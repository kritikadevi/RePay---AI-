import { formatCurrency, formatPercentage }
  from "../utils/helpers";

function PaymentTable({
  history,
  refreshDashboard,
  navigate
}) {
  return (
    <section className="history">

      <div className="history-header">

        <div>

          <h2>
            Recent Recovery History
          </h2>

          <p>
            Your latest failed payments
            analyzed by RePay.
          </p>

        </div>


        <div className="history-actions">

          <button
            className="view-all-btn"
            onClick={refreshDashboard}
          >
            Refresh
          </button>


          <button
            className="view-all-btn"
            onClick={() =>
              navigate("/payment-history")
            }
          >
            View All →
          </button>

        </div>

      </div>


      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Payment</th>

              <th>Amount</th>

              <th>Failure Reason</th>

              <th>RePay Action</th>

              <th>Probability</th>

              <th>Priority</th>

              <th>Status</th>

            </tr>

          </thead>


          <tbody>

            {history.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="empty-history"
                >
                  No payments analyzed yet.
                </td>

              </tr>

            ) : (

              history.map(
                (payment, index) => (

                  <tr
                    key={
                      payment._id || index
                    }
                  >

                    <td>

                      <div className="payment-info">

                        <div className="payment-icon">
                          ₹
                        </div>


                        <div>

                          <strong>

                            PAY-

                            {payment._id
                              ? payment._id.slice(-4)
                              : index + 1}

                          </strong>


                          <span>

                            {payment.payment_method}

                            {" "}Payment

                          </span>

                        </div>

                      </div>

                    </td>


                    <td>

                      {formatCurrency(
                        payment.amount
                      )}

                    </td>


                    <td>

                      {payment.failure_reason}

                    </td>


                    <td>

                      <span className="action-tag">

                        {payment.best_action}

                      </span>

                    </td>


                    <td>

                      <strong className="probability">

                        {formatPercentage(
                          payment.recovery_probability
                        )}%

                      </strong>

                    </td>


                    <td>

                      <span
                        className={`priority small-priority ${
                          payment.priority
                            ?.toLowerCase()
                        }`}
                      >

                        {payment.priority || "-"}

                      </span>

                    </td>


                    <td>

                      <span
                        className={`status ${
                          (
                            payment.status ||
                            "Pending"
                          ).toLowerCase()
                        }`}
                      >

                        ● {payment.status || "Pending"}

                      </span>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default PaymentTable;