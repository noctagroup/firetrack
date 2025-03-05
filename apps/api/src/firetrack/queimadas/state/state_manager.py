from enum import Enum

from firetrack.queimadas.state.transition import Transition


class StateManager:
    def __init__(self, transitions: list[Transition], initial_state: str | Enum):
        """
        Inicializa o gerenciador de estados.

        Args:
            transitions (list[Transition]): Lista de transições possíveis.
            initial_state (str | Enum): Estado inicial do gerenciador.
        """
        self.transitions: dict[str, list[dict]] = {}
        self.__current_state = initial_state
        self.__register_transitions(transitions)

    def _normalize_event(self, event: str | Enum) -> str:
        """
        Converte um evento para string, independentemente de ser `Enum` ou `str`.

        Args:
            event (str | Enum): O evento a ser normalizado.

        Returns:
            str: O evento convertido para string.
        """
        return event if isinstance(event, str) else event.name

    def __register_transitions(self, transitions: list[Transition]):
        """
        Registra todas as transições em um dicionário.

        Args:
            transitions (list[Transition]): Lista de transições a serem registradas.
        """
        for transition in transitions:
            when_key = self._normalize_event(transition.when)
            self.transitions.setdefault(when_key, []).append(
                {"from": transition.state_from, "to": transition.state_to}
            )

    def change(self, when: str | Enum):
        """
        Realiza a transição de estado com base no evento.

        Args:
            when (str | Enum): Nome do evento que dispara a transição.

        Raises:
            KeyError: Se o evento não estiver registrado.
            ValueError: Se a transição não for válida a partir do estado atual.
        """
        when = self._normalize_event(when)

        if when not in self.transitions:
            raise KeyError(f"Event '{when}' not registered.")

        possible_transitions = self.transitions[when]

        for transition in possible_transitions:
            if transition["from"] == self.__current_state:
                self.__current_state = transition["to"]
                print(f"Transitioned from {transition['from']} to {transition['to']}.")
                return

        raise ValueError(
            f"Invalid transition from '{self.__current_state}' using event '{when}'."
        )

    def get_current_state(self) -> str | Enum:
        """
        Retorna o estado atual.

        Returns:
            str | Enum: O estado atual da máquina.
        """
        return self.__current_state

    def to_dict(self):
        return {
            "current_state": self._normalize_event(self.__current_state),
            "transitions": {
                event: [
                    {
                        "from": self._normalize_event(t["from"]),
                        "to": self._normalize_event(t["to"]),
                    }
                    for t in transitions
                ]
                for event, transitions in self.transitions.items()
            },
        }

    @classmethod
    def from_dict(cls, data: dict) -> "StateManager":
        """
        Converte um dicionário salvo no Redis de volta para um StateManager.
        """
        initial_state = data["current_state"]
        transitions = {
            event: [{"from": state["from"], "to": state["to"]} for state in states]
            for event, states in data["transitions"].items()
        }
        manager = cls(transitions=[], initial_state=initial_state)
        manager.transitions = transitions
        return manager
