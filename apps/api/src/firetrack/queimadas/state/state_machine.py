from enum import Enum
from typing import Dict, List

from firetrack.queimadas.state.state_backend import StateBackend
from firetrack.queimadas.state.state_manager import StateManager
from firetrack.queimadas.state.transition import Transition


class StateMachine:
    def __init__(self, backend: StateBackend):
        """
        Inicializa a máquina de estados.

        Args:
            backend (StateBackend): Backend para persistência dos estados.
        """
        self.__backend = backend
        self.__state_managers: Dict[str, StateManager] = {}

    def create_state_manager(
        self, transitions: List[Transition], initial_state: str | Enum
    ) -> str:
        """
        Cria um novo gerenciador de estados e persiste no banco.

        Args:
            transitions (Iterable[Transition]): Lista de transições possíveis.
            initial_state (str | Enum): Estado inicial.

        Returns:
            str: ID do StateManager criado.
        """
        new_manager = StateManager(transitions, initial_state)
        state_manager_id = self.__backend.save_manager(new_manager)

        self.__state_managers[state_manager_id] = new_manager
        return state_manager_id

    def get_state_manager(self, manager_id: str) -> StateManager:
        """
        Recupera um gerenciador de estados pelo seu ID.

        Args:
            manager_id (str): O ID do gerenciador de estados.

        Returns:
            StateManager: O gerenciador de estados correspondente.

        Raises:
            KeyError: Se o ID não existir no banco de dados.
        """
        if manager_id not in self.__state_managers:
            # Carrega do banco se não estiver em memória
            saved_manager = self.__backend.load_manager(manager_id)
            if saved_manager is None:
                raise KeyError(f"StateManager with ID '{manager_id}' not found.")

            self.__state_managers[manager_id] = saved_manager

        return self.__state_managers[manager_id]

    def change_state(self, manager_id: str, event: str | Enum):
        """
        Altera o estado de um StateManager e persiste no banco.

        Args:
            manager_id (str): O ID do gerenciador de estados.
            event (str | Enum): O evento que dispara a transição.

        Raises:
            KeyError: Se o gerenciador não existir.
            ValueError: Se a transição não for válida.
        """
        manager = self.get_state_manager(manager_id)
        manager.change(event)

        # Persiste a mudança no banco de dados
        self.__backend.update_manager(manager_id, manager)

    def get_current_state(self, manager_id: str) -> str | Enum:
        """
        Retorna o estado atual de um StateManager.

        Args:
            manager_id (str): O ID do gerenciador de estados.

        Returns:
            str | Enum: O estado atual.
        """
        return self.get_state_manager(manager_id).get_current_state()
