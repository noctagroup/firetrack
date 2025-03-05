import json

import redis

from firetrack.queimadas.state.state_backend import StateBackend
from firetrack.queimadas.state.state_manager import StateManager


class StateBackendRedis(StateBackend):
    def __init__(self, redis_host="localhost", redis_port=6379, redis_db=0):
        """
        Inicializa a conexão com o Redis.

        Args:
            redis_host (str): Endereço do Redis.
            redis_port (int): Porta do Redis.
            redis_db (int): Número do banco de dados Redis.
        """
        self.redis_client = redis.StrictRedis(
            host=redis_host, port=redis_port, db=redis_db, decode_responses=True
        )

    def save_manager(self, new_manager: StateManager) -> str:
        """
        Salva um novo `StateManager` no Redis.

        Args:
            new_manager (StateManager): O gerenciador de estados a ser salvo.

        Returns:
            str: ID gerado para o `StateManager`.
        """
        manager_id = f"state_manager:{id(new_manager)}"
        self.redis_client.set(manager_id, json.dumps(new_manager.to_dict()))
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
        data = self.redis_client.get(manager_id)
        if not data:
            raise KeyError(f"StateManager with ID '{manager_id}' not found.")

        return StateManager.from_dict(json.loads(data))

    def update_manager(self, manager_id: str, manager: StateManager):
        """
        Atualiza um `StateManager` no Redis.

        Args:
            manager_id (str): O ID do `StateManager`.
            manager (StateManager): O `StateManager` atualizado.
        """
        if not self.redis_client.exists(manager_id):
            raise KeyError(f"StateManager with ID '{manager_id}' not found.")

        self.redis_client.set(manager_id, json.dumps(manager.to_dict()))
