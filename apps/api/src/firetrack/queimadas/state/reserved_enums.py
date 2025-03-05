from enum import Enum


class ReservedStates(Enum):
    ABORTED = "ABORTED"
    INTERRUPTED = "INTERRUPTED"


class ReservedEvents(Enum):
    ABORT = "ABORT"
    INTERRUPT = "INTERRUPT"