# Conectar ao Redis
from firetrack.state.state_backend_redis import StateBackendRedis
from firetrack.state.state_machine import StateMachine
from firetrack.state.transition import Transition

backend = StateBackendRedis(redis_host="localhost", redis_port=6379)

# Criar máquina de estados
state_machine = StateMachine(backend)

# Criar transições
t1 = Transition.create("IDLE", "RUNNING", "start_command")
t2 = Transition.create("RUNNING", "STOPPED", "stop_command")

# Criar um novo StateManager e salvar no Redis
manager_id = state_machine.create_state_manager([t1, t2], "IDLE")
print(f"StateManager salvo no Redis com ID: {manager_id}")

# Alterar estado e salvar no Redis
state_machine.change_state(manager_id, "start_command")
print(f"Novo estado salvo: {state_machine.get_current_state(manager_id)}")  # RUNNING

# Carregar do Redis e verificar estado
loaded_manager = backend.load_manager(manager_id)
print(f"Estado carregado do Redis: {loaded_manager.get_current_state()}")  # RUNNING