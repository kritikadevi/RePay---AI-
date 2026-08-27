from fastapi import APIRouter

from app.models.payment_model import Payment

from app.controllers.payment_controller import (
    predict_recovery_controller,
    get_recent_payments_controller,
    get_payments_controller,
    payment_stats_controller,
    get_payment_controller,
    execute_recovery_strategy_controller,
    update_payment_status_controller,
    delete_payment_controller
)


router = APIRouter(
    prefix="",
    tags=["Payments"]
)


# ==========================================
# PREDICT PAYMENT RECOVERY
# ==========================================

@router.post("/predict")
def predict_recovery(
    payment: Payment
):

    return predict_recovery_controller(
        payment
    )


# ==========================================
# GET RECENT PAYMENTS
# ==========================================

@router.get("/payments/recent")
def get_recent_payments():

    return get_recent_payments_controller()


# ==========================================
# GET ALL PAYMENTS
# ==========================================

@router.get("/payments")
def get_payments():

    return get_payments_controller()


# ==========================================
# PAYMENT DASHBOARD STATS
# ==========================================

@router.get("/payments/stats")
def payment_stats():

    return payment_stats_controller()


# ==========================================
# GET SINGLE PAYMENT
# ==========================================

@router.get("/payments/{payment_id}")
def get_payment(
    payment_id: str
):

    return get_payment_controller(
        payment_id
    )


# ==========================================
# EXECUTE RECOVERY STRATEGY
# ==========================================

@router.post(
    "/payments/{payment_id}/execute-strategy"
)
def execute_recovery_strategy(
    payment_id: str
):

    return execute_recovery_strategy_controller(
        payment_id
    )


# ==========================================
# UPDATE PAYMENT STATUS
# ==========================================

@router.patch(
    "/payments/{payment_id}/status"
)
def update_payment_status(

    payment_id: str,

    status: str
):

    return update_payment_status_controller(

        payment_id,

        status
    )


# ==========================================
# DELETE PAYMENT
# ==========================================

@router.delete(
    "/payments/{payment_id}"
)
def delete_payment(
    payment_id: str
):

    return delete_payment_controller(
        payment_id
    )