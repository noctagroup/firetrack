from abc import ABC

from firetrack.state.state_manager import StateManager


class StateBackend(ABC):
    def save_manager(self, new_manager: StateManager):
        pass

    def load_manager(self, manager_id: str):
        pass

    def update_manager(self, manager_id: str, manager: StateManager):
        pass