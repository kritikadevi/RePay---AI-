import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function PaymentHistory() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [executingId, setExecutingId] = useState(null);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD DATA ON START
  // ==========================================

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // LOAD PAYMENTS + STATS
  // ==========================================

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([
        fetchPayments(),
        fetchStats()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);

      setError(
        "Could not connect to the RePay backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH PAYMENTS
  // ==========================================

  const fetchPayments = async () => {
    const response = await fetch(
      `${API_URL}/payments`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch payments"
      );
    }

    const data = await response.json();

    setPayments(data);

    return data;
  };

  // ==========================================
  // FETCH DASHBOARD STATS
  // ==========================================

  const fetchStats = async () => {
    const response = await fetch(
      `${API_URL}/payments/stats`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch stats"
      );
    }

    const data = await response.json();

    setStats(data);

    return data;
  };

  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  const updateStatus = async (
    paymentId,
    newStatus
  ) => {
    setUpdatingId(paymentId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/payments/${paymentId}/status?status=${encodeURIComponent(
          newStatus
        )}`,
        {
          method: "PATCH"
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.detail ||
          "Failed to update payment status"
        );
      }

      await Promise.all([
        fetchPayments(),
        fetchStats()
      ]);

    } catch (error) {
      console.error(
        "Error updating status:",
        error
      );

      setError(
        error.message ||
        "Could not update payment status"
      );

    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // RUN REPAY RECOVERY WORKFLOW
  // ==========================================

  const executeStrategy = async (paymentId) => {
  setExecutingId(paymentId);
  setError("");
  setExecutionResult(null);

  try {
    const response = await fetch(
      `${API_URL}/payments/${paymentId}/execute-strategy`,
      {
        method: "POST"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
        "Failed to run RePay recovery workflow"
      );
    }

    // Show RePay workflow result
    setExecutionResult(data);

    // Fetch latest payments and stats
    const [updatedPayments] = await Promise.all([
      fetchPayments(),
      fetchStats()
    ]);

    // Refresh strategy modal if it is open
    const updatedPayment = updatedPayments.find(
      (payment) => payment._id === paymentId
    );

    if (updatedPayment) {
      setSelectedPayment(updatedPayment);
    }

  } catch (error) {
    console.error(
      "Error running RePay:",
      error
    );

    setError(
      error.message ||
      "Could not run RePay recovery workflow"
    );

  } finally {
    setExecutingId(null);
  }
};


  // ==========================================
  // DELETE PAYMENT
  // ==========================================

  const deletePayment = async (
    paymentId
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to permanently delete this payment?"
      );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(paymentId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/payments/${paymentId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.detail ||
          "Failed to delete payment"
        );
      }

      await Promise.all([
        fetchPayments(),
        fetchStats()
      ]);

    } catch (error) {
      console.error(
        "Error deleting payment:",
        error
      );

      setError(
        error.message ||
        "Could not delete payment"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDateTime = (
    dateString
  ) => {
    if (!dateString) {
      return "-";
    }

    const date =
      new Date(dateString);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }
    );
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (
    amount
  ) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    )}`;
  };

  // ==========================================
  // FORMAT PERCENTAGE
  // ==========================================

  const formatPercentage = (
    value
  ) => {
    return Number(
      value || 0
    ).toFixed(2);
  };

  // ==========================================
  // FILTER PAYMENTS
  // ==========================================

  const filteredPayments =
    payments.filter((payment) => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        payment._id
          ?.toLowerCase()
          .includes(searchText) ||

        payment.payment_method
          ?.toLowerCase()
          .includes(searchText) ||

        payment.failure_reason
          ?.toLowerCase()
          .includes(searchText) ||

        payment.best_action
          ?.toLowerCase()
          .includes(searchText) ||

        payment.priority
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        (
          payment.status ||
          "Pending"
        ) === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // ==========================================
  // STATUS COUNT
  // ==========================================

  const getStatusCount = (
    status
  ) => {
    if (!stats) {
      return 0;
    }

    switch (status) {
      case "Pending":
        return (
          stats.pending_count ||
          0
        );

      case "Confirmed":
        return (
          stats.confirmed_count ||
          0
        );

      case "Done":
        return (
          stats.done_count ||
          0
        );

      default:
        return (
          stats.total_payments ||
          0
        );
    }
  };

  return (
    <div className="history-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={() =>
            navigate("/")
          }
          style={{
            cursor: "pointer"
          }}
        >

          <div className="logo-icon">
            R
          </div>

          <span>
            RePay
          </span>

        </div>

        <div className="history-nav-actions">

          <button
            className="refresh-btn"
            onClick={loadData}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "↻ Refresh"}
          </button>

          <button
            className="back-btn"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to Dashboard
          </button>

        </div>

      </nav>

      {/* MAIN CONTENT */}

      <main className="history-container">

        {/* ERROR */}

        {error && (
          <div className="error-message">

            <span>
              {error}
            </span>

            <button
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>
        )}

        {/* PAGE HEADER */}

        <div className="dashboard-header">

          <div>

            <p className="eyebrow">
              PAYMENT RECOVERY
            </p>

            <h1>
              RePay Dashboard
            </h1>

            <p>
              Track, manage and execute
              intelligent recovery workflows
              for failed payments with RePay.
            </p>

          </div>

        </div>

        {/* SUMMARY CARDS */}

        {stats && (

          <section className="summary-grid">

            <div className="summary-card">

              <p>
                Revenue at Risk
              </p>

              <h2>
                {formatCurrency(
                  stats.total_revenue_at_risk
                )}
              </h2>

              <span>
                {stats.total_payments || 0}
                {" "}failed payment(s)
              </span>

            </div>

            <div className="summary-card recovered-card">

              <p>
                Revenue Recovered
              </p>

              <h2>
                {formatCurrency(
                  stats.total_revenue_recovered
                )}
              </h2>

              <span>
                {stats.recovered_payments || 0}
                {" "}payment(s) successfully recovered
              </span>

            </div>

            <div className="summary-card expected-card">

              <p>
                Expected Recovery
              </p>

              <h2>
                {formatCurrency(
                  stats.expected_recovery_revenue
                )}
              </h2>

              <span>
                Based on RePay predictions
              </span>

            </div>

            <div className="summary-card rate-card">

              <p>
                Recovery Rate
              </p>

              <h2>
                {formatPercentage(
                  stats.recovery_rate
                )}%
              </h2>

              <span>
                Actual successful recoveries
              </span>

            </div>

          </section>
        )}

        {/* REPAY INSIGHTS */}

        {stats && (

          <section className="ai-insights-grid">

            <div className="insight-card">

              <p>
                Average Recovery Confidence
              </p>

              <h3>
                {formatPercentage(
                  stats.average_ai_confidence
                )}%
              </h3>

              <span>
                Average predicted recovery probability
              </span>

            </div>

            <div className="insight-card">

              <p>
                High Priority Cases
              </p>

              <h3>
                {stats.high_priority_count || 0}
              </h3>

              <span>
                Payments requiring immediate attention
              </span>

            </div>

            <div className="insight-card">

              <p>
                Recovered in{" "}
                {stats.current_month ||
                  "This Month"}
              </p>

              <h3>
                {formatCurrency(
                  stats.recovered_this_month
                )}
              </h3>

              <span>
                {stats.recovered_count_this_month || 0}
                {" "}payment(s) recovered this month
              </span>

            </div>

            <div className="insight-card">

              <p>
                Current Workflow
              </p>

              <h3>
                {stats.pending_count || 0}
                {" "}Pending
              </h3>

              <span>
                {stats.confirmed_count || 0}
                {" "}confirmed •{" "}
                {stats.done_count || 0}
                {" "}completed
              </span>

            </div>

          </section>
        )}

        {/* STATUS TABS */}

        <div className="status-tabs">

          {[
            "All",
            "Pending",
            "Confirmed",
            "Done"
          ].map((status) => (

            <button
              key={status}

              className={
                statusFilter === status
                  ? "active-tab"
                  : ""
              }

              onClick={() =>
                setStatusFilter(status)
              }
            >

              {status}

              <span>
                {getStatusCount(status)}
              </span>

            </button>

          ))}

        </div>

        {/* SEARCH */}

        <div className="search-section">

          <input
            type="text"

            placeholder="Search by payment ID, method, failure reason, recovery action or priority..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {/* TABLE */}

        <section className="full-history">

          <div className="history-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Failure Reason</th>
                  <th>RePay Action</th>
                  <th>Confidence</th>
                  <th>Priority</th>
                  <th>Expected Recovery</th>
                  <th>Created</th>
                  <th>Recovered</th>
                  <th>Status</th>
                  <th>Strategy</th>
                  <th>Run RePay</th>
                  <th>Update</th>
                  <th>Delete</th>

                </tr>

              </thead>

              <tbody>

                {filteredPayments.map(
                  (payment, index) => (

                    <tr
                      key={
                        payment._id ||
                        index
                      }
                    >

                      {/* PAYMENT */}

                      <td>

                        <div className="payment-info">

                          <div className="payment-icon">
                            ₹
                          </div>

                          <div>

                            <strong>

                              PAY-

                              {payment._id
                                ? payment._id.slice(-6)
                                : index + 1}

                            </strong>

                            <span>

                              {payment.payment_method ||
                                "-"}

                              {" "}Payment

                            </span>

                          </div>

                        </div>

                      </td>

                      {/* AMOUNT */}

                      <td>

                        {formatCurrency(
                          payment.amount
                        )}

                      </td>

                      {/* FAILURE REASON */}

                      <td>

                        {payment.failure_reason ||
                          "-"}

                      </td>

                      {/* REPAY ACTION */}

                      <td>

                        <span className="action-tag">

                          {payment.best_action ||
                            "-"}

                        </span>

                      </td>

                      {/* CONFIDENCE */}

                      <td>

                        <strong className="probability">

                          {formatPercentage(
                            payment.confidence_percentage ??
                            payment.recovery_probability
                          )}%

                        </strong>

                      </td>

                      {/* PRIORITY */}

                      <td>

                        <span
                          className={`priority ${
                            (
                              payment.priority ||
                              "LOW"
                            ).toLowerCase()
                          }`}
                        >

                          {payment.priority ||
                            "LOW"}

                        </span>

                      </td>

                      {/* EXPECTED RECOVERY */}

                      <td>

                        {formatCurrency(
                          payment.expected_recovery_amount
                        )}

                      </td>

                      {/* CREATED */}

                      <td className="date-cell">

                        {formatDateTime(
                          payment.created_at
                        )}

                      </td>

                      {/* RECOVERED */}

                      <td className="date-cell">

                        {payment.status === "Done"

                          ? formatDateTime(
                              payment.recovered_at
                            )

                          : "-"
                        }

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`status ${
                            (
                              payment.status ||
                              "Pending"
                            ).toLowerCase()
                          }`}
                        >

                          ●{" "}

                          {payment.status ||
                            "Pending"}

                        </span>

                        {payment.execution_status && (

                          <div className="execution-status">

                            {payment.execution_status}

                          </div>

                        )}

                      </td>

                      {/* VIEW STRATEGY */}

                      <td>

                        <button
                          className="strategy-btn"

                          onClick={() =>
                            setSelectedPayment(
                              payment
                            )
                          }
                        >

                          View

                        </button>

                      </td>

                      {/* RUN REPAY */}

                      <td>

                        <button
                          className="execute-btn"

                          disabled={
                            executingId ===
                              payment._id ||
                            payment.status ===
                              "Done"
                          }

                          onClick={() =>
                            executeStrategy(
                              payment._id
                            )
                          }
                        >

                          {payment.status ===
                            "Done"

                            ? "Recovered"

                            : executingId ===
                              payment._id

                              ? "Running..."

                              : "Run RePay"}

                        </button>

                      </td>

                      {/* UPDATE STATUS */}

                      <td>

                        <select

                          className="status-select"

                          value={
                            payment.status ||
                            "Pending"
                          }

                          disabled={
                            updatingId ===
                            payment._id
                          }

                          onChange={(e) =>
                            updateStatus(
                              payment._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Done">
                            Done
                          </option>

                        </select>

                      </td>

                      {/* DELETE */}

                      <td>

                        <button
                          className="delete-btn"

                          disabled={
                            deletingId ===
                            payment._id
                          }

                          onClick={() =>
                            deletePayment(
                              payment._id
                            )
                          }
                        >

                          {deletingId ===
                            payment._id

                            ? "Deleting..."

                            : "Delete"}

                        </button>

                      </td>

                    </tr>

                  )
                )}

                {/* LOADING */}

                {loading && (

                  <tr>

                    <td
                      colSpan="14"
                      className="empty-history"
                    >

                      Loading payment history...

                    </td>

                  </tr>
                )}

                {/* EMPTY STATE */}

                {!loading &&
                  filteredPayments.length === 0 && (

                    <tr>

                      <td
                        colSpan="14"
                        className="empty-history"
                      >

                        No payments found.

                      </td>

                    </tr>

                  )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* ======================================
          STRATEGY MODAL
      ====================================== */}

      {selectedPayment && (

        <div className="modal-overlay">

          <div className="strategy-modal">

            <button
              className="close-btn"

              onClick={() =>
                setSelectedPayment(null)
              }
            >
              ×
            </button>

            <p className="eyebrow">
              REPAY RECOVERY WORKFLOW
            </p>

            <h2>
              Recovery Strategy
            </h2>

            <p className="strategy-payment-id">

              Payment ID:
              {" "}
              PAY-
              {selectedPayment._id?.slice(-6)}

            </p>

            {selectedPayment.recovery_strategy
              ?.length > 0 ? (

              <div className="strategy-steps">

                {selectedPayment
                  .recovery_strategy
                  .map(
                    (step, index) => (

                      <div
                        className={`strategy-step ${
                          step.type
                            ?.toLowerCase()
                        }`}

                        key={index}
                      >

                        <div className="strategy-number">

                          {step.step}

                        </div>

                        <div className="strategy-content">

                          <div className="strategy-top">

                            <div>

                              <span
                                className={`strategy-type ${
                                  step.type
                                    ?.toLowerCase()
                                }`}
                              >

                                {step.type ===
                                  "PRIMARY"

                                  ? "RECOMMENDED"

                                  : "FALLBACK"}

                              </span>

                              <h4>

                                {step.action}

                              </h4>

                            </div>

                            <strong>

                              {formatPercentage(
                                step.probability
                              )}%

                            </strong>

                          </div>

                          <p>

                            {step.instruction}

                          </p>

                          <div className="strategy-progress">

                            <div
                              className="strategy-progress-fill"

                              style={{
                                width:
                                  `${Math.min(
                                    Number(
                                      step.probability
                                    ) || 0,
                                    100
                                  )}%`
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}

              </div>

            ) : (

              <p>
                No recovery strategy available.
              </p>

            )}

            {/* EXECUTED STEPS */}

            {selectedPayment.executed_steps
              ?.length > 0 && (

              <div className="executed-steps">

                <h3>
                  Execution Results
                </h3>

                {selectedPayment
                  .executed_steps
                  .map(
                    (step, index) => (

                      <div
                        className={`execution-step ${
                          step.result
                            ?.toLowerCase()
                        }`}

                        key={index}
                      >

                        <strong>

                          Step {step.step}:
                          {" "}
                          {step.action}

                        </strong>

                        <span>

                          {step.result}

                        </span>

                      </div>

                    )
                  )}

              </div>

            )}

            {/* AUDIT TRAIL */}

            {selectedPayment.audit_trail
              ?.length > 0 && (

              <div className="audit-section">

                <h3>
                  Recovery Audit Trail
                </h3>

                <div className="audit-list">

                  {selectedPayment
                    .audit_trail
                    .map(
                      (audit, index) => (

                        <div
                          className="audit-item"
                          key={index}
                        >

                          <span>

                            {formatDateTime(
                              audit.time
                            )}

                          </span>

                          <p>

                            {audit.event}

                          </p>

                        </div>

                      )
                    )}

                </div>

              </div>

            )}

          </div>

        </div>

      )}

      {/* ======================================
          REPAY EXECUTION RESULT MODAL
      ====================================== */}

      {executionResult && (

        <div className="modal-overlay">

          <div className="execution-result-modal">

            <button
              className="close-btn"

              onClick={() =>
                setExecutionResult(null)
              }
            >
              ×
            </button>

            <p className="eyebrow">
              REPAY WORKFLOW RESULT
            </p>

            <h2>

              {executionResult.success

                ? "Payment Recovered"

                : "Recovery Attempt Completed"}

            </h2>

            <p className="execution-result-description">

              {executionResult.success
                ? "RePay successfully completed the recovery workflow."
                : "RePay completed the configured recovery attempts, but the payment could not be recovered."}

            </p>

            <div
              className={`execution-result-status ${
                executionResult.success

                  ? "success"

                  : "failed"
              }`}
            >

              {executionResult.success

                ? "RECOVERY SUCCESSFUL"

                : "RECOVERY UNSUCCESSFUL"}

            </div>

            {executionResult.success && (

              <div className="result-recovered-amount">

                <p>
                  Recovered Amount
                </p>

                <h3>

                  {formatCurrency(
                    executionResult.recovered_amount
                  )}

                </h3>

              </div>

            )}

            {executionResult.successful_action && (

              <p className="successful-action">

                Successful Action:
                {" "}

                <strong>

                  {executionResult.successful_action}

                </strong>

              </p>

            )}

            <div className="execution-results-list">

              <h3>
                Workflow Steps
              </h3>

              {executionResult.executed_steps
                ?.map(
                  (step, index) => (

                    <div
                      className={`execution-step ${
                        step.result
                          ?.toLowerCase()
                      }`}

                      key={index}
                    >

                      <div>

                        <strong>

                          Step {step.step}:
                          {" "}

                          {step.action}

                        </strong>

                        <span>

                          {formatPercentage(
                            step.probability
                          )}% predicted recovery probability

                        </span>

                      </div>

                      <b>

                        {step.result}

                      </b>

                    </div>

                  )
                )}

            </div>

            <button
              className="close-result-btn"

              onClick={() =>
                setExecutionResult(null)
              }
            >

              Close

            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default PaymentHistory;