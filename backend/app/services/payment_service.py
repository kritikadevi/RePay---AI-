from pathlib import Path

import joblib
import pandas as pd


# ==========================================
# PROJECT ROOT
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[3]


# ==========================================
# LOAD ML MODEL
# ==========================================

model_path = BASE_DIR / "payment_recovery_model.pkl"

model = joblib.load(model_path)

print("ML model loaded successfully!")


# ==========================================
# PRIORITY FUNCTION
# ==========================================

def get_priority(probability):

    if probability >= 0.80:
        return "HIGH"

    elif probability >= 0.50:
        return "MEDIUM"

    return "LOW"


# ==========================================
# AI RECOVERY DECISION
# ==========================================

def choose_best_action(payment_data):

    actions = [
        "Retry",
        "UPI Link",
        "Reminder"
    ]

    # Guardrail:
    # Do not recommend Retry after
    # 2 or more retry attempts

    if payment_data.get("retry_count", 0) >= 2:

        if "Retry" in actions:
            actions.remove("Retry")

    results = {}

    # ======================================
    # TEST EVERY AVAILABLE ACTION
    # ======================================

    for action in actions:

        payment_copy = payment_data.copy()

        payment_copy["recovery_action"] = action

        payment_df = pd.DataFrame([
            payment_copy
        ])

        probability = model.predict_proba(
            payment_df
        )[0][1]

        results[action] = float(
            probability
        )

    # ======================================
    # SELECT BEST ACTION
    # ======================================

    best_action = max(
        results,
        key=results.get
    )

    best_probability = results[
        best_action
    ]

    priority = get_priority(
        best_probability
    )

    return (
        best_action,
        best_probability,
        priority,
        results
    )


# ==========================================
# GENERATE RECOVERY STRATEGY
# ==========================================

def generate_recovery_strategy(
    all_results,
    best_action
):

    sorted_actions = sorted(

        all_results.items(),

        key=lambda x: x[1],

        reverse=True
    )

    strategy = []

    for action, probability in sorted_actions:

        if action == best_action:

            strategy.append({

                "step":
                    1,

                "action":
                    action,

                "probability":
                    round(
                        probability * 100,
                        2
                    ),

                "type":
                    "PRIMARY",

                "instruction":
                    f"Attempt {action} as the recommended recovery action."

            })

        else:

            strategy.append({

                "step":
                    len(strategy) + 1,

                "action":
                    action,

                "probability":
                    round(
                        probability * 100,
                        2
                    ),

                "type":
                    "FALLBACK",

                "instruction":
                    f"If the previous action is unsuccessful, "
                    f"automatically continue with {action}."

            })

    return strategy


# ==========================================
# SIMULATE ACTION-SPECIFIC RECOVERY
# ==========================================

def simulate_recovery_result(
    payment,
    action,
    probability_percentage,
    step_number
):

    ml_score = float(
        probability_percentage or 0
    )

    customer_success_rate = float(
        payment.get(
            "customer_success_rate",
            0
        )
    ) * 100

    successful_payments = int(
        payment.get(
            "previous_successful_payments",
            0
        )
    )

    failed_payments = int(
        payment.get(
            "previous_failed_payments",
            0
        )
    )

    retry_count = int(
        payment.get(
            "retry_count",
            0
        )
    )

    amount = float(
        payment.get(
            "amount",
            0
        )
    )

    failure_reason = str(
        payment.get(
            "failure_reason",
            ""
        )
    ).lower()

    # ======================================
    # CUSTOMER BEHAVIOR SCORE
    # ======================================

    history_score = 0

    if successful_payments > failed_payments:
        history_score = 8

    elif failed_payments > successful_payments:
        history_score = -8

    # ======================================
    # ACTION-SPECIFIC ADJUSTMENTS
    # ======================================

    action_adjustment = 0

    # --------------------------------------
    # RETRY
    # --------------------------------------

    if action == "Retry":

        action_adjustment -= (
            retry_count * 12
        )

        if any(
            keyword in failure_reason
            for keyword in [
                "timeout",
                "network",
                "temporary",
                "server",
                "gateway"
            ]
        ):
            action_adjustment += 10

        if amount >= 10000:
            action_adjustment -= 5

    # --------------------------------------
    # UPI LINK
    # --------------------------------------

    elif action == "UPI Link":

        if customer_success_rate >= 80:
            action_adjustment += 10

        if successful_payments >= 3:
            action_adjustment += 5

        if retry_count >= 1:
            action_adjustment += 8

        if any(
            keyword in failure_reason
            for keyword in [
                "card",
                "declined",
                "payment",
                "insufficient"
            ]
        ):
            action_adjustment += 5

    # --------------------------------------
    # REMINDER
    # --------------------------------------

    elif action == "Reminder":

        if customer_success_rate >= 70:
            action_adjustment += 12

        if successful_payments > failed_payments:
            action_adjustment += 6

        if customer_success_rate < 50:
            action_adjustment -= 8

    # ======================================
    # STEP PROGRESSION EFFECT
    # ======================================

    step_adjustment = (
        (step_number - 1) * 2
    )

    # ======================================
    # FINAL SCORE
    # ======================================

    final_score = (

        ml_score * 0.60

        +

        customer_success_rate * 0.25

        +

        history_score

        +

        action_adjustment

        +

        step_adjustment
    )

    # ======================================
    # DETERMINISTIC PAYMENT VARIATION
    # ======================================

    payment_seed = (

        int(amount)

        +

        successful_payments * 7

        +

        failed_payments * 11

        +

        retry_count * 13

        +

        len(action) * 5
    )

    variation = (
        payment_seed % 13
    ) - 6

    final_score += variation

    final_score = max(
        0,
        min(
            final_score,
            100
        )
    )

    # ======================================
    # SUCCESS THRESHOLD
    # ======================================

    thresholds = {

        "Retry": 68,

        "UPI Link": 64,

        "Reminder": 60
    }

    threshold = thresholds.get(
        action,
        65
    )

    success = (
        final_score >= threshold
    )

    return (
        success,
        round(final_score, 2),
        threshold
    )


# ==========================================
# GENERATE AI REASONING
# ==========================================

def generate_reasoning(
    payment_data,
    best_action,
    probability,
    priority
):

    reasoning = []

    confidence_percentage = round(
        probability * 100,
        2
    )

    reasoning.append(

        f"RePay predicts a "
        f"{confidence_percentage}% probability "
        f"of successful payment recovery."
    )

    reasoning.append(

        f"{best_action} produced the highest "
        f"predicted recovery probability among "
        f"the available recovery actions."
    )

    # HIGH VALUE TRANSACTION

    if payment_data["amount"] >= 10000:

        reasoning.append(

            "This is a high-value transaction, "
            "so successful recovery has a "
            "higher business impact."
        )

    # CUSTOMER PAYMENT BEHAVIOR

    if payment_data.get(
        "previous_successful_payments",
        0
    ) > payment_data.get(
        "previous_failed_payments",
        0
    ):

        reasoning.append(

            "The customer has a stronger "
            "history of successful payments "
            "than failed payments."
        )

    # CUSTOMER SUCCESS RATE

    if payment_data.get(
        "customer_success_rate",
        0
    ) >= 0.80:

        reasoning.append(

            "The customer's historical payment "
            "success rate is high, increasing "
            "the likelihood of recovery."
        )

    # RETRY GUARDRAIL

    if payment_data.get(
        "retry_count",
        0
    ) >= 2:

        reasoning.append(

            "Multiple retries have already been "
            "attempted, so RePay avoids another "
            "Retry and prioritizes alternative "
            "recovery actions."
        )

    # PRIORITY

    if priority == "HIGH":

        reasoning.append(

            "This payment is HIGH priority "
            "because it has strong predicted "
            "recovery potential."
        )

    elif priority == "MEDIUM":

        reasoning.append(

            "This payment is MEDIUM priority "
            "and should proceed through the "
            "recommended recovery workflow."
        )

    else:

        reasoning.append(

            "This payment is LOW priority "
            "because its predicted recovery "
            "potential is currently limited."
        )

    return reasoning