import sys
from pathlib import Path

from fastapi.testclient import TestClient
from bson import ObjectId


# ==========================================
# ADD BACKEND FOLDER TO PYTHON PATH
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

sys.path.append(
    str(BASE_DIR / "backend")
)


# ==========================================
# IMPORT FROM MAIN.PY
# ==========================================

from main import (
    app,
    get_priority,
    generate_recovery_strategy,
    simulate_recovery_result
)


# ==========================================
# CREATE TEST CLIENT
# ==========================================

client = TestClient(app)


# ==========================================
# TEST 1: HOME ENDPOINT
# ==========================================

def test_home():

    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert (
        data["message"]
        == "Welcome to RePay AI Payment Recovery Agent"
    )


# ==========================================
# TEST 2: HEALTH CHECK
# ==========================================

def test_health():

    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"

    assert data["model_loaded"] is True


# ==========================================
# TEST 3: PRIORITY FUNCTION
# ==========================================

def test_get_priority():

    # HIGH priority
    assert get_priority(0.85) == "HIGH"

    # MEDIUM priority
    assert get_priority(0.60) == "MEDIUM"

    # LOW priority
    assert get_priority(0.30) == "LOW"


# ==========================================
# TEST 4: PRIORITY BOUNDARIES
# ==========================================

def test_priority_boundaries():

    # 80% should be HIGH
    assert get_priority(0.80) == "HIGH"

    # 50% should be MEDIUM
    assert get_priority(0.50) == "MEDIUM"

    # Below 50% should be LOW
    assert get_priority(0.49) == "LOW"


# ==========================================
# TEST 5: GENERATE RECOVERY STRATEGY
# ==========================================

def test_generate_recovery_strategy():

    results = {

        "Retry": 0.60,

        "UPI Link": 0.85,

        "Reminder": 0.70

    }

    strategy = generate_recovery_strategy(

        results,

        "UPI Link"

    )

    # UPI Link should be first because
    # it is the best action

    assert strategy[0]["action"] == "UPI Link"

    assert strategy[0]["step"] == 1

    assert strategy[0]["type"] == "PRIMARY"

    # Other actions should be fallbacks

    assert strategy[1]["type"] == "FALLBACK"

    assert strategy[2]["type"] == "FALLBACK"

    # Total strategy should contain 3 actions

    assert len(strategy) == 3


# ==========================================
# TEST 6: RETRY SIMULATION
# ==========================================

def test_retry_simulation():

    payment = {

        "amount": 5000,

        "customer_success_rate": 0.80,

        "previous_successful_payments": 5,

        "previous_failed_payments": 1,

        "retry_count": 1,

        "failure_reason": "network timeout"

    }

    success, score, threshold = (
        simulate_recovery_result(

            payment,

            "Retry",

            80,

            1

        )
    )

    # Retry threshold should be 68

    assert threshold == 68

    # Score must always stay between 0 and 100

    assert score >= 0

    assert score <= 100

    # Success should be boolean

    assert isinstance(success, bool)


# ==========================================
# TEST 7: UPI LINK SIMULATION
# ==========================================

def test_upi_link_simulation():

    payment = {

        "amount": 5000,

        "customer_success_rate": 0.90,

        "previous_successful_payments": 10,

        "previous_failed_payments": 1,

        "retry_count": 2,

        "failure_reason": "card declined"

    }

    success, score, threshold = (
        simulate_recovery_result(

            payment,

            "UPI Link",

            85,

            1

        )
    )

    # UPI Link threshold

    assert threshold == 64

    # Score should be valid

    assert score >= 0

    assert score <= 100

    assert isinstance(success, bool)


# ==========================================
# TEST 8: REMINDER SIMULATION
# ==========================================

def test_reminder_simulation():

    payment = {

        "amount": 3000,

        "customer_success_rate": 0.90,

        "previous_successful_payments": 8,

        "previous_failed_payments": 1,

        "retry_count": 1,

        "failure_reason": "payment pending"

    }

    success, score, threshold = (
        simulate_recovery_result(

            payment,

            "Reminder",

            75,

            3

        )
    )

    # Reminder threshold should be 60

    assert threshold == 60

    # Score should always be valid

    assert score >= 0

    assert score <= 100

    assert isinstance(success, bool)


# ==========================================
# TEST 9: INVALID PAYMENT ID
# ==========================================

def test_invalid_payment_id():

    response = client.get(

        "/payments/invalid-id"

    )

    assert response.status_code == 400

    data = response.json()

    assert (
        data["detail"]
        == "Invalid payment ID"
    )


# ==========================================
# TEST 10: INVALID PAYMENT STATUS
# ==========================================

def test_invalid_payment_status():

    fake_id = str(
        ObjectId()
    )

    response = client.patch(

        f"/payments/{fake_id}/status",

        params={

            "status": "InvalidStatus"

        }

    )

    assert response.status_code == 400

    data = response.json()

    assert (
        data["detail"]
        == "Invalid status"
    )