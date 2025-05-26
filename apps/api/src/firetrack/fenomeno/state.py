from enum import Enum
from functools import lru_cache
from typing import Optional, Union

from transitions import Machine
from typing_extensions import TypedDict

from firetrack.fenomeno.models import Fenomeno


class FenomenoState(str, Enum):
    IDLE = "Idle"
    STARTED = "Started"
    PRODUCT_SELECTED = "Product Selected"
    TIMESPAN_SELECTED = "Timespan Selected"
    AOI_SELECTED = "AOI Selected"
    READY_FOR_VISUAL_ANALYSIS = "Ready for Visual Analysis"
    IN_VISUAL_ANALYSIS = "In Visual Analysis"
    READY_FOR_VALID_PAIR_SEPARATION = "Ready for Valid Pair Separation"
    IN_VALID_PAIR_SEPARATION = "In Valid Pair Separation"
    READY_FOR_INDEXES_CREATION = "Ready for Indexes Creation"
    IN_INDEXES_CREATION = "In Indexes Creation"
    READY_FOR_DIFFERENCE_IMAGE_CREATION = "Ready for Difference Image Creation"
    IN_DIFFERENCE_IMAGE_CREATION = "In Difference Image Creation"
    READY_FOR_AI_CLASSIFICATION = "Ready for AI Classification"
    IN_AI_CLASSIFICATION = "In AI Classification"
    READY_FOR_PUBLISH = "Ready for Publish"
    PUBLISHED = "Published"
    ERROR = "Error"
    ABORTED = "Aborted"
    NO_CANDIDATES = "No Candidates Found"

    @classmethod
    @lru_cache
    def states(cls):
        return [state.value for state in cls]


class TransitionDict(TypedDict, total=False):
    trigger: str
    source: Union[str, list[str]]
    dest: str
    conditions: Optional[Union[str, list[str]]]
    unless: Optional[Union[str, list[str]]]
    before: Optional[Union[str, list[str]]]
    after: Optional[Union[str, list[str]]]
    prepare: Optional[Union[str, list[str]]]


class FenomenoFSM:
    states = FenomenoState.states()

    transitions: list[TransitionDict] = [
        {
            "trigger": "start",
            "source": FenomenoState.IDLE.value,
            "dest": FenomenoState.STARTED.value,
        },
        {
            "trigger": "select_product",
            "source": FenomenoState.STARTED.value,
            "dest": FenomenoState.PRODUCT_SELECTED.value,
        },
        {
            "trigger": "select_timespan",
            "source": FenomenoState.PRODUCT_SELECTED.value,
            "dest": FenomenoState.TIMESPAN_SELECTED.value,
        },
        {
            "trigger": "select_aoi",
            "source": FenomenoState.TIMESPAN_SELECTED.value,
            "dest": FenomenoState.AOI_SELECTED.value,
        },
        {
            "trigger": "confirm_processing_scope",
            "source": FenomenoState.AOI_SELECTED.value,
            "dest": FenomenoState.READY_FOR_VISUAL_ANALYSIS.value,
        },
        {
            "trigger": "no_found_candidates",
            "source": FenomenoState.AOI_SELECTED.value,
            "dest": FenomenoState.NO_CANDIDATES.value,
        },
        {
            "trigger": "start_visual_analysis",
            "source": FenomenoState.READY_FOR_VISUAL_ANALYSIS.value,
            "dest": FenomenoState.IN_VISUAL_ANALYSIS.value,
        },
        {
            "trigger": "finish_visual_analysis",
            "source": FenomenoState.IN_VISUAL_ANALYSIS.value,
            "dest": FenomenoState.READY_FOR_VALID_PAIR_SEPARATION.value,
        },
        {
            "trigger": "start_valid_pair_separation",
            "source": FenomenoState.READY_FOR_VALID_PAIR_SEPARATION.value,
            "dest": FenomenoState.IN_VALID_PAIR_SEPARATION.value,
        },
        {
            "trigger": "finish_valid_pair_separation",
            "source": FenomenoState.IN_VALID_PAIR_SEPARATION.value,
            "dest": FenomenoState.READY_FOR_INDEXES_CREATION.value,
        },
        {
            "trigger": "start_indexes_creation",
            "source": FenomenoState.READY_FOR_INDEXES_CREATION.value,
            "dest": FenomenoState.IN_INDEXES_CREATION.value,
        },
        {
            "trigger": "finish_index_creation",
            "source": FenomenoState.IN_INDEXES_CREATION.value,
            "dest": FenomenoState.READY_FOR_DIFFERENCE_IMAGE_CREATION.value,
        },
        {
            "trigger": "start_difference_image_creation",
            "source": FenomenoState.READY_FOR_DIFFERENCE_IMAGE_CREATION.value,
            "dest": FenomenoState.IN_DIFFERENCE_IMAGE_CREATION.value,
        },
        {
            "trigger": "finish_difference_image_creation",
            "source": FenomenoState.IN_DIFFERENCE_IMAGE_CREATION.value,
            "dest": FenomenoState.READY_FOR_AI_CLASSIFICATION.value,
        },
        {
            "trigger": "start_ai_classification",
            "source": FenomenoState.READY_FOR_AI_CLASSIFICATION.value,
            "dest": FenomenoState.IN_AI_CLASSIFICATION.value,
        },
        {
            "trigger": "finish_ai_classification",
            "source": FenomenoState.IN_AI_CLASSIFICATION.value,
            "dest": FenomenoState.READY_FOR_PUBLISH.value,
        },
        {
            "trigger": "publish",
            "source": FenomenoState.READY_FOR_PUBLISH.value,
            "dest": FenomenoState.PUBLISHED.value,
        },
        {"trigger": "fail", "source": "*", "dest": FenomenoState.ERROR.value},
        {"trigger": "abort", "source": "*", "dest": FenomenoState.ABORTED.value},
    ]

    def __init__(self, fenomeno_instance: Fenomeno):
        self.fenomeno = fenomeno_instance

        self.machine = Machine(
            model=self,
            states=self.states,
            transitions=self.transitions,
            initial=fenomeno_instance.state,
            after_state_change=self._sync_to_model,
        )

    def _sync_to_model(self):
        self.fenomeno.state = self.state  # self.state is already a string
        self.fenomeno.save()
