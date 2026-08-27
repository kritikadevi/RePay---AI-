from datetime import datetime, timezone

from fastapi import HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from database import payments_collection

from app.services.payment_service import (
    choose_best_action,
    generate_recovery_strategy,
    simulate_recovery_result,
    generate_reasoning
)


# ==========================================
# CREATE PAYMENT + PREDICT
# ==========================================

def predict_recovery_controller(payment):

    payment_data = payment.model_dump()

    (
        best_action,
        probability,
        priority,
        all_results
    ) = choose_best_action(payment_data)

    confidence_percentage = round(
        probability * 100,
        2
    )

    expected_recovery_amount = round(
        payment.amount * probability,
        2
    )

    reasoning = generate_reasoning(
        payment_data,
        best_action,
        probability,
        priority
    )

    formatted_results = {
        action: round(prob * 100, 2)
        for action, prob in all_results.items()
    }

    recovery_strategy = generate_recovery_strategy(
        all_results,
        best_action
    )

    current_time = datetime.now(timezone.utc)

    audit_trail = [
        {
            "time": current_time,
            "event": "Payment failure received by RePay"
        },
        {
            "time": current_time,
            "event": (
                f"RePay analyzed payment and predicted "
                f"{confidence_percentage}% recovery probability"
            )
        },
        {
            "time": current_time,
            "event": (
                f"RePay selected recommended recovery action: "
                f"{best_action}"
            )
        },
        {
            "time": current_time,
            "event": (
                f"RePay generated a {len(recovery_strategy)}-step "
                f"recovery workflow"
            )
        },
        {
            "time": current_time,
            "event": f"Payment assigned {priority} priority"
        }
    ]

    payment_document = {

        # PAYMENT INFORMATION
        "amount": payment.amount,
        "payment_method": payment.payment_method,
        "failure_reason": payment.failure_reason,
        "previous_successful_payments":
            payment.previous_successful_payments,
        "previous_failed_payments":
            payment.previous_failed_payments,
        "retry_count": payment.retry_count,
        "customer_success_rate":
            payment.customer_success_rate,
        "hour_of_payment": payment.hour_of_payment,
        "customer_tenure_days":
            payment.customer_tenure_days,

        # REPAY DECISION
        "best_action": best_action,
        "recovery_probability":
            confidence_percentage,
        "confidence_percentage":
            confidence_percentage,
        "priority": priority,

        # BUSINESS IMPACT
        "expected_recovery_amount":
            expected_recovery_amount,

        # AI INTELLIGENCE
        "reasoning": reasoning,
        "all_action_probabilities":
            formatted_results,
        "recovery_strategy":
            recovery_strategy,

        # EXECUTION
        "execution_status": "Not Started",
        "executed_steps": [],

        # AUDIT
        "audit_trail": audit_trail,

        # STATUS
        "status": "Pending",
        "recovered_amount": 0,

        # TIMESTAMPS
        "created_at": current_time,
        "updated_at": current_time,
        "recovered_at": None
    }

    result = payments_collection.insert_one(
        payment_document
    )

    return {
        "id": str(result.inserted_id),
        "best_action": best_action,
        "recovery_probability":
            confidence_percentage,
        "confidence_percentage":
            confidence_percentage,
        "priority": priority,
        "expected_recovery_amount":
            expected_recovery_amount,
        "reasoning": reasoning,
        "all_action_probabilities":
            formatted_results,
        "recovery_strategy":
            recovery_strategy,
        "audit_trail": audit_trail,
        "execution_status": "Not Started",
        "executed_steps": [],
        "status": "Pending",
        "created_at": current_time
    }


# ==========================================
# GET RECENT PAYMENTS
# ==========================================

def get_recent_payments_controller():

    payments = []

    for payment in (
        payments_collection
        .find()
        .sort("created_at", -1)
        .limit(3)
    ):

        payment["_id"] = str(
            payment["_id"]
        )

        payments.append(payment)

    return payments


# ==========================================
# GET ALL PAYMENTS
# ==========================================

def get_payments_controller():

    payments = []

    for payment in (
        payments_collection
        .find()
        .sort("created_at", -1)
    ):

        payment["_id"] = str(
            payment["_id"]
        )

        payments.append(payment)

    return payments


# ==========================================
# GET PAYMENT STATS
# ==========================================

def payment_stats_controller():

    payments = list(
        payments_collection.find()
    )

    total_payments = len(payments)

    total_revenue_at_risk = sum(
        payment.get("amount", 0)
        for payment in payments
    )

    recovered_payments = sum(
        1
        for payment in payments
        if payment.get("status") == "Done"
    )

    total_revenue_recovered = sum(
        payment.get("recovered_amount", 0)
        for payment in payments
    )

    recovery_rate = (
        recovered_payments / total_payments
    ) * 100 if total_payments > 0 else 0

    expected_recovery_revenue = sum(
        payment.get(
            "expected_recovery_amount",
            0
        )
        for payment in payments
    )

    high_priority_count = sum(
        1
        for payment in payments
        if payment.get("priority") == "HIGH"
    )

    probabilities = [
        payment.get(
            "confidence_percentage",
            payment.get(
                "recovery_probability",
                0
            )
        )
        for payment in payments
    ]

    average_recovery_probability = (
        sum(probabilities) / len(probabilities)
        if probabilities
        else 0
    )

    pending_count = sum(
        1
        for payment in payments
        if payment.get("status") == "Pending"
    )

    confirmed_count = sum(
        1
        for payment in payments
        if payment.get("status") == "Confirmed"
    )

    done_count = sum(
        1
        for payment in payments
        if payment.get("status") == "Done"
    )

    now = datetime.now(timezone.utc)

    current_month = now.month
    current_year = now.year

    recovered_this_month = sum(
        payment.get(
            "recovered_amount",
            0
        )
        for payment in payments
        if (
            payment.get("status") == "Done"
            and isinstance(
                payment.get("recovered_at"),
                datetime
            )
            and payment["recovered_at"].month
            == current_month
            and payment["recovered_at"].year
            == current_year
        )
    )

    recovered_count_this_month = sum(
        1
        for payment in payments
        if (
            payment.get("status") == "Done"
            and isinstance(
                payment.get("recovered_at"),
                datetime
            )
            and payment["recovered_at"].month
            == current_month
            and payment["recovered_at"].year
            == current_year
        )
    )

    return {
        "total_payments": total_payments,
        "total_revenue_at_risk":
            round(total_revenue_at_risk, 2),
        "recovered_payments":
            recovered_payments,
        "total_revenue_recovered":
            round(total_revenue_recovered, 2),
        "recovery_rate":
            round(recovery_rate, 2),
        "expected_recovery_revenue":
            round(expected_recovery_revenue, 2),
        "high_priority_count":
            high_priority_count,
        "average_ai_confidence":
            round(
                average_recovery_probability,
                2
            ),
        "pending_count": pending_count,
        "confirmed_count": confirmed_count,
        "done_count": done_count,
        "recovered_this_month":
            round(recovered_this_month, 2),
        "recovered_count_this_month":
            recovered_count_this_month,
        "current_month":
            now.strftime("%B"),
        "current_year":
            current_year
    }


# ==========================================
# GET SINGLE PAYMENT
# ==========================================

def get_payment_controller(
    payment_id: str
):

    try:

        object_id = ObjectId(
            payment_id
        )

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid payment ID"
        )

    payment = payments_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not payment:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    payment["_id"] = str(
        payment["_id"]
    )

    return payment


# ==========================================
# EXECUTE RECOVERY STRATEGY
# ==========================================

def execute_recovery_strategy_controller(
    payment_id: str
):

    try:

        object_id = ObjectId(
            payment_id
        )

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid payment ID"
        )

    payment = payments_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not payment:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    if payment.get("status") == "Done":

        raise HTTPException(
            status_code=400,
            detail=(
                "Payment has already been "
                "recovered"
            )
        )

    recovery_strategy = payment.get(
        "recovery_strategy",
        []
    )

    if not recovery_strategy:

        raise HTTPException(
            status_code=400,
            detail=(
                "Recovery strategy is not "
                "available"
            )
        )

    current_time = datetime.now(
        timezone.utc
    )

    audit_trail = payment.get(
        "audit_trail",
        []
    )

    executed_steps = []

    audit_trail.append({
        "time": current_time,
        "event": (
            "RePay autonomous recovery "
            "workflow started"
        )
    })

    for strategy_step in recovery_strategy:

        action = strategy_step.get(
            "action"
        )

        step_number = int(
            strategy_step.get(
                "step",
                1
            )
        )

        probability = float(
            strategy_step.get(
                "probability",
                0
            )
        )

        step_start_time = datetime.now(
            timezone.utc
        )

        audit_trail.append({
            "time": step_start_time,
            "event": (
                f"RePay executing Step "
                f"{step_number}: {action}"
            )
        })

        (
            success,
            simulation_score,
            threshold
        ) = simulate_recovery_result(
            payment,
            action,
            probability,
            step_number
        )

        step_result = {
            "step": step_number,
            "action": action,
            "probability": probability,
            "simulation_score":
                simulation_score,
            "success_threshold":
                threshold,
            "result":
                "SUCCESS"
                if success
                else "FAILED",
            "executed_at":
                step_start_time
        }

        executed_steps.append(
            step_result
        )

        if success:

            completion_time = datetime.now(
                timezone.utc
            )

            audit_trail.append({
                "time": completion_time,
                "event": (
                    f"Step {step_number}: "
                    f"{action} succeeded with "
                    f"a recovery score of "
                    f"{simulation_score}%."
                )
            })

            audit_trail.append({
                "time": completion_time,
                "event": (
                    "Payment recovered successfully. "
                    "RePay workflow completed."
                )
            })

            payments_collection.update_one(
                {
                    "_id": object_id
                },
                {
                    "$set": {
                        "status": "Done",
                        "execution_status":
                            "Completed",
                        "executed_steps":
                            executed_steps,
                        "recovered_amount":
                            payment.get(
                                "amount",
                                0
                            ),
                        "recovered_at":
                            completion_time,
                        "updated_at":
                            completion_time,
                        "audit_trail":
                            audit_trail
                    }
                }
            )

            return {
                "message": (
                    "RePay recovery workflow "
                    "completed successfully"
                ),
                "success": True,
                "status": "Done",
                "execution_status":
                    "Completed",
                "successful_action": action,
                "executed_steps":
                    executed_steps,
                "recovered_amount":
                    payment.get(
                        "amount",
                        0
                    ),
                "audit_trail":
                    audit_trail
            }

        else:

            audit_trail.append({
                "time": datetime.now(
                    timezone.utc
                ),
                "event": (
                    f"Step {step_number}: "
                    f"{action} failed with a "
                    f"recovery score of "
                    f"{simulation_score}% "
                    f"(required: {threshold}%)."
                )
            })

            if step_number < len(
                recovery_strategy
            ):

                audit_trail.append({
                    "time": datetime.now(
                        timezone.utc
                    ),
                    "event": (
                        "Previous action was unsuccessful. "
                        "RePay is automatically moving to "
                        "the next fallback action."
                    )
                })

    completion_time = datetime.now(
        timezone.utc
    )

    audit_trail.append({
        "time": completion_time,
        "event": (
            "All recovery actions were attempted. "
            "Payment remains pending for "
            "manual review."
        )
    })

    payments_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "status": "Pending",
                "execution_status":
                    "All Strategies Failed",
                "executed_steps":
                    executed_steps,
                "recovered_amount": 0,
                "updated_at":
                    completion_time,
                "audit_trail":
                    audit_trail
            }
        }
    )

    return {
        "message": (
            "RePay attempted all "
            "recovery actions"
        ),
        "success": False,
        "status": "Pending",
        "execution_status":
            "All Strategies Failed",
        "successful_action": None,
        "executed_steps":
            executed_steps,
        "recovered_amount": 0,
        "audit_trail":
            audit_trail
    }


# ==========================================
# UPDATE PAYMENT STATUS
# ==========================================

def update_payment_status_controller(
    payment_id: str,
    status: str
):

    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Done"
    ]

    if status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    try:

        object_id = ObjectId(
            payment_id
        )

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid payment ID"
        )

    existing_payment = (
        payments_collection.find_one(
            {
                "_id": object_id
            }
        )
    )

    if not existing_payment:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    current_time = datetime.now(
        timezone.utc
    )

    update_data = {
        "status": status,
        "updated_at": current_time
    }

    audit_trail = existing_payment.get(
        "audit_trail",
        []
    )

    if status == "Done":

        update_data[
            "recovered_at"
        ] = current_time

        update_data[
            "recovered_amount"
        ] = existing_payment.get(
            "amount",
            0
        )

        update_data[
            "execution_status"
        ] = "Completed"

        audit_trail.append({
            "time": current_time,
            "event": (
                "Recovery manually marked "
                "as completed"
            )
        })

    elif status == "Confirmed":

        update_data[
            "execution_status"
        ] = "Confirmed"

        audit_trail.append({
            "time": current_time,
            "event": (
                "Recovery action confirmed "
                "for processing"
            )
        })

    elif status == "Pending":

        update_data[
            "recovered_at"
        ] = None

        update_data[
            "recovered_amount"
        ] = 0

        update_data[
            "execution_status"
        ] = "Not Started"

        audit_trail.append({
            "time": current_time,
            "event": (
                "Payment moved back to pending"
            )
        })

    update_data[
        "audit_trail"
    ] = audit_trail

    payments_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": update_data
        }
    )

    return {
        "message":
            "Payment status updated successfully",
        "status": status,
        "updated_at": current_time,
        "recovered_at":
            update_data.get(
                "recovered_at"
            ),
        "recovered_amount":
            update_data.get(
                "recovered_amount",
                existing_payment.get(
                    "recovered_amount",
                    0
                )
            )
    }


# ==========================================
# DELETE PAYMENT
# ==========================================

def delete_payment_controller(
    payment_id: str
):

    try:

        object_id = ObjectId(
            payment_id
        )

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid payment ID"
        )

    result = payments_collection.delete_one(
        {
            "_id": object_id
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return {
        "message":
            "Payment deleted successfully",
        "deleted_id":
            payment_id
    }