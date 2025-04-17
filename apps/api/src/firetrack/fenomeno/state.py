from transitions import Machine

from firetrack.fenomeno.models import Fenomeno


class FenomenoFSM:
    states = [
        "idle",
        "started",
        "product_selected",
        "timespan_selected",
        "aoi_selected",
        "ready_for_visual_analysis",
        "in_visual_analysis",
        "ready_for_valid_pair_separation",
        "in_valid_pair_separation",
        "ready_for_indexes_creation",
        "in_indexes_creation",
        "ready_for_difference_image_creation",
        "in_difference_image_creation",
        "ready_for_ai_classification",
        "in_ai_classification",
        "ready_for_publish",
        "published",
        "error",
        "aborted",
    ]

    transitions = [
        {"trigger": "start", "source": "idle", "dest": "started"},
        {"trigger": "select_product", "source": "started", "dest": "product_selected"},
        {
            "trigger": "select_timespan",
            "source": "product_selected",
            "dest": "timespan_selected",
        },
        {
            "trigger": "select_aoi",
            "source": "timespan_selected",
            "dest": "aoi_selected",
        },
        {
            "trigger": "confirm_processing_scope",
            "source": "aoi_selected",
            "dest": "ready_for_visual_analysis",
        },
        {
            "trigger": "start_visual_analysis",
            "source": "ready_for_visual_analysis",
            "dest": "in_visual_analysis",
        },
        {
            "trigger": "finish_visual_analysis",
            "source": "in_visual_analysis",
            "dest": "ready_for_valid_pair_separation",
        },
        {
            "trigger": "start_valid_pair_separation",
            "source": "ready_for_valid_pair_separation",
            "dest": "in_valid_pair_separation",
        },
        {
            "trigger": "finish_valid_pair_separation",
            "source": "in_valid_pair_separation",
            "dest": "ready_for_indexes_creation",
        },
        {
            "trigger": "start_indexes_creation",
            "source": "ready_for_indexes_creation",
            "dest": "in_indexes_creation",
        },
        {
            "trigger": "finish_index_creation",
            "source": "in_indexes_creation",
            "dest": "ready_for_difference_image_creation",
        },
        {
            "trigger": "start_difference_image_creation",
            "source": "ready_for_difference_image_creation",
            "dest": "in_difference_image_creation",
        },
        {
            "trigger": "finish_difference_image_creation",
            "source": "in_difference_image_creation",
            "dest": "ready_for_ai_classification",
        },
        {
            "trigger": "start_ai_classification",
            "source": "ready_for_ai_classification",
            "dest": "in_ai_classification",
        },
        {
            "trigger": "finish_ai_classification",
            "source": "in_ai_classification",
            "dest": "ready_for_publish",
        },
        {"trigger": "publish", "source": "ready_for_publish", "dest": "published"},
        {"trigger": "fail", "source": "*", "dest": "error"},
        {"trigger": "abort", "source": "*", "dest": "aborted"},
    ]

    def __init__(self, fenomeno_instance: Fenomeno):
        self.fenomeno = fenomeno_instance

        self.machine = Machine(
            model=self,
            states=FenomenoFSM.states,
            transitions=FenomenoFSM.transitions,
            initial=fenomeno_instance.state,
            after_state_change=self._sync_to_model,
        )

    def _sync_to_model(self):
        self.fenomeno.state = self.state
        self.fenomeno.save()
