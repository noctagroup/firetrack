# Conectar ao Redis

from firetrack.queimadas.enums import ProcessingEvents, ProcessingStates
from firetrack.queimadas.state.reserved_enums import ReservedEvents, ReservedStates
from firetrack.queimadas.state.state_backend_redis import StateBackendRedis
from firetrack.queimadas.state.state_machine import StateMachine
from firetrack.queimadas.state.transition import Transition

backend = StateBackendRedis(redis_host="localhost", redis_port=6379)

# Criar máquina de estados
state_machine = StateMachine(backend)

transitions = Transition.create_many(
    [
        [
            ProcessingStates.IDLE,
            ProcessingStates.STARTED,
            ProcessingEvents.START,
        ],  # Inicia o processo
        [
            ProcessingStates.STARTED,
            ProcessingStates.BBOX_SELECTED,
            ProcessingEvents.SELECT_BBOX,
        ],  # Seleciona a área de interesse (Bounding Box)
        [
            ProcessingStates.BBOX_SELECTED,
            ProcessingStates.PERIOD_SELECTED,
            ProcessingEvents.SELECT_PERIOD,
        ],  # Define o período de análise
        [
            ProcessingStates.PERIOD_SELECTED,
            ProcessingStates.READY_FOR_VISUAL_ANALYSIS,
            ProcessingEvents.CONFIRM_PROCESSING_SCOPE,
        ],  # Confirma os parâmetros de processamento
        [
            ProcessingStates.READY_FOR_VISUAL_ANALYSIS,
            ProcessingStates.IN_VISUAL_ANALYSIS,
            ProcessingEvents.START_VISUAL_ANALYSIS,
        ],  # Inicia a análise visual
        [
            ProcessingStates.IN_VISUAL_ANALYSIS,
            ProcessingStates.READY_FOR_VALID_PAIR_SEPARATION,
            ProcessingEvents.CONCLUDE_VISUAL_ANALYSIS,
        ],  # Finaliza a análise visual
        [
            ProcessingStates.READY_FOR_VALID_PAIR_SEPARATION,
            ProcessingStates.IN_VALID_PAIR_SEPARATION,
            ProcessingEvents.START_VALID_PAIRS_SEPARATION,
        ],  # Inicia a separação de pares válidos
        [
            ProcessingStates.IN_VALID_PAIR_SEPARATION,
            ProcessingStates.READY_FOR_INDEXES_CREATION,
            ProcessingEvents.CONCLUDE_VALID_PAIRS_SEPARATION,
        ],  # Finaliza a separação de pares válidos
        [
            ProcessingStates.READY_FOR_INDEXES_CREATION,
            ProcessingStates.IN_INDEXES_CREATION,
            ProcessingEvents.START_INDEX_CREATION,
        ],  # Inicia a criação de índices
        [
            ProcessingStates.IN_INDEXES_CREATION,
            ProcessingStates.READY_FOR_DIFFERENCE_IMAGE_CREATION,
            ProcessingEvents.CONCLUDE_INDEX_CREATION,
        ],  # Finaliza a criação de índices
        [
            ProcessingStates.READY_FOR_DIFFERENCE_IMAGE_CREATION,
            ProcessingStates.IN_DIFFERENCE_IMAGE_CREATION,
            ProcessingEvents.START_DIFFERENCE_IMAGE_CREATION,
        ],  # Inicia a criação de imagem de diferença
        [
            ProcessingStates.IN_DIFFERENCE_IMAGE_CREATION,
            ProcessingStates.READY_FOR_AI_CLASSIFICATION,
            ProcessingEvents.CONCLUDE_DIFFERENCE_IMAGE_CREATION,
        ],  # Finaliza a criação de imagem de diferença
        [
            ProcessingStates.READY_FOR_AI_CLASSIFICATION,
            ProcessingStates.IN_AI_CLASSIFICATION,
            ProcessingEvents.START_AI_CLASSIFICATION,
        ],  # Inicia a classificação por IA
        [
            ProcessingStates.IN_AI_CLASSIFICATION,
            ProcessingStates.READY_FOR_PUBLISH,
            ProcessingEvents.CONCLUDE_AI_CLASSIFICATION,
        ],  # Finaliza a classificação por IA
        [
            ProcessingStates.READY_FOR_PUBLISH,
            ProcessingStates.PUBLISHED,
            ProcessingEvents.PUBLISH,
        ],  # Publica os resultados finais
    ]
)

for state in ProcessingStates:
    transitions.extend(
        [
            Transition.create(state, ReservedStates.ABORTED, ReservedEvents.ABORT),
            Transition.create(
                state, ReservedStates.INTERRUPTED, ReservedEvents.INTERRUPT
            ),
        ]
    )

# Criar um novo StateManager e salvar no Redis
manager_id = state_machine.create_state_manager(transitions, ProcessingStates.IDLE)
print(f"StateManager criado e salvo no Redis com ID: {manager_id}")

# Testando as transições

print(f"Estado inicial: {state_machine.get_current_state(manager_id)}")  # IDLE

state_machine.change_state(manager_id, ProcessingEvents.START)
print(f"Novo estado: {state_machine.get_current_state(manager_id)}")  # STARTED

# Testar abortar em qualquer momento
state_machine.change_state(manager_id, ReservedEvents.ABORT)
print(
    f"Novo estado após abortar: {state_machine.get_current_state(manager_id)}"
)  # ABORTED

# Reiniciar para testar interrupção
manager_id = state_machine.create_state_manager(transitions, ProcessingStates.IDLE)
print(f"\nNovo StateManager criado com ID: {manager_id}")

state_machine.change_state(manager_id, ProcessingEvents.START)
print(f"Novo estado: {state_machine.get_current_state(manager_id)}")  # STARTED

state_machine.change_state(manager_id, ReservedEvents.INTERRUPT)
print(
    f"Novo estado após interrupção: {state_machine.get_current_state(manager_id)}"
)  # INTERRUPTED


# Carregar o `StateManager` salvo no Redis e verificar estado
loaded_manager = backend.load_manager(manager_id)
print(
    f"Estado carregado do Redis: {loaded_manager.get_current_state()}"
)  # Deve ser ABORTED ou INTERRUPTED
