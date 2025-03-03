import json

import redis

from firetrack.state.state_backend import StateBackend
from firetrack.state.state_manager import StateManager


class StateBackendRedis(StateBackend):
    def __init__(self, redis_host="localhost", redis_port=6379, redis_db=0):
        """
        Inicializa a conexão com o Redis.

        Args:
            redis_host (str): Endereço do Redis.
            redis_port (int): Porta do Redis.
            redis_db (int): Número do banco de dados Redis.
        """
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db, decode_responses=True)

    def save_manager(self, new_manager: StateManager) -> str:
        """
        Salva um novo `StateManager` no Redis.

        Args:
            new_manager (StateManager): O gerenciador de estados a ser salvo.

        Returns:
            str: ID gerado para o `StateManager`.
        """
        manager_id = f"state_manager:{id(new_manager)}"
        data = {
            "current_state": str(new_manager.get_current_state()),
            "transitions": json.dumps(new_manager.transitions),
        }
        self.redis_client.hmset(manager_id, data)
        return manager_id

    def load_manager(self, manager_id: str) -> StateManager:
        """
        Carrega um `StateManager` do Redis.

        Args:
            manager_id (str): O ID do `StateManager`.

        Returns:
            StateManager: O `StateManager` recuperado.

        Raises:
            KeyError: Se o `StateManager` não for encontrado.
        """
        data = self.redis_client.hgetall(manager_id)
        if not data:
            raise KeyError(f"StateManager with ID '{manager_id}' not found.")

        # Desserializa os dados armazenados
        current_state = data["current_state"]
        transitions = json.loads(data["transitions"])

        # Reconstrói o `StateManager`
        manager = StateManager(transitions=[], initial_state=current_state)
        manager.transitions = transitions
        return manager

    def update_manager(self, manager_id: str, manager: StateManager):
        """
        Atualiza um `StateManager` no Redis.

        Args:
            manager_id (str): O ID do `StateManager`.
            manager (StateManager): O `StateManager` atualizado.
        """
        if not self.redis_client.exists(manager_id):
            raise KeyError(f"StateManager with ID '{manager_id}' not found.")

        data = {
            "current_state": str(manager.get_current_state()),
            "transitions": json.dumps(manager.transitions),
        }
        self.redis_client.hmset(manager_id, data)
