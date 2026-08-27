function PaymentForm({
  amount,
  setAmount,
  paymentMethod,
  setPaymentMethod,
  failureReason,
  setFailureReason,
  handleAnalyze,
  loading
}) {
  return (
    <section className="analyzer">

      <div className="section-heading">

        <div>

          <h2>
            Analyze Failed Payment
          </h2>

          <p>
            Enter payment details to get a
            RePay recommendation.
          </p>

        </div>


        <div className="ai-label">

          <span></span>

          RePay

        </div>

      </div>


      <div className="form-grid">

        {/* AMOUNT */}

        <div className="input-group">

          <label>
            Payment Amount
          </label>

          <div className="amount-input">

            <span>
              ₹
            </span>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

          </div>

        </div>


        {/* PAYMENT METHOD */}

        <div className="input-group">

          <label>
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
          >

            <option>Card</option>

            <option>UPI</option>

            <option>
              Net Banking
            </option>

            <option>
              Wallet
            </option>

          </select>

        </div>


        {/* FAILURE REASON */}

        <div className="input-group">

          <label>
            Failure Reason
          </label>

          <select
            value={failureReason}
            onChange={(e) =>
              setFailureReason(
                e.target.value
              )
            }
          >

            <option>
              Card Declined
            </option>

            <option>
              Insufficient Funds
            </option>

            <option>
              Network Error
            </option>

            <option>
              Bank Error
            </option>

          </select>

        </div>

      </div>


      <button
        className="analyze-btn"
        onClick={handleAnalyze}
        disabled={loading}
      >

        {loading
          ? "Analyzing..."
          : "Analyze Payment →"
        }

      </button>

    </section>
  );
}

export default PaymentForm;