from enum import Enum
from typing import List, Union


class Transition:
    """
    A factory-based transition between states.
    """

    def __init__(self, state_from: Union[str, Enum], state_to: Union[str, Enum], when: Union[str, Enum]):
        self.state_from = state_from
        self.state_to = state_to
        self.when = when

    @classmethod
    def create(cls, state_from: Union[str, Enum], state_to: Union[str, Enum], when: Union[str, Enum]) -> "Transition":
        """
        Factory method to create a single Transition instance.

        Args:
            state_from (str | Enum): The initial state.
            state_to (str | Enum): The target state.
            when (str): The condition that triggers the transition.

        Returns:
            Transition: A new transition object.
        """
        return cls(state_from, state_to, when)

    @classmethod
    def create_many(cls, from_to_when: List[List[Union[str, Enum]]]) -> List["Transition"]:
        """
        Factory method to create multiple Transition instances.

        Args:
            from_to_when (List[List[Union[str, Enum]]]): 
                A list of lists, each containing (state_from, state_to, when).

        Returns:
            List[Transition]: A list of created transitions.

        Raises:
            ValueError: If any of the input lists do not have exactly 3 elements.
        """
        transitions = []
        for transition_data in from_to_when:
            if len(transition_data) != 3:
                raise ValueError("Each transition must contain exactly 3 elements: (state_from, state_to, when).")
            transitions.append(cls(*transition_data))

        return transitions

    def __repr__(self):
        return f"Transition({self.state_from} -> {self.state_to}, when='{self.when}')"
