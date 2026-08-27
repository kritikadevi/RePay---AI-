from pydantic import BaseModel


class Payment(BaseModel):

    amount: float

    payment_method: str

    failure_reason: str

    previous_successful_payments: int

    previous_failed_payments: int

    retry_count: int

    customer_success_rate: float

    hour_of_payment: int

    customer_tenure_days: int