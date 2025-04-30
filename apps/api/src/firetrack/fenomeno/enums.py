from enum import Enum
from functools import lru_cache


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

    @classmethod
    @lru_cache
    def choices(cls):
        return tuple((x.value, x.value) for x in cls)

    @classmethod
    @lru_cache
    def states(cls):
        return list(x.value for x in cls)
