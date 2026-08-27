import { formatCurrency, formatPercentage }
  from "../utils/helpers";

function Modal({
  result,
  closeModal
}) {
  if (!result) {
    return null;
  }

  return (
    <div className="modal-overlay">

      <div className="result-card">

        <button
          className="close-btn"
          onClick={closeModal}
        >
          ×
        </button>


        {/* HEADER */}

        <div className="result-header">

          <div>

            <p className="eyebrow">
              REPAY RECOMMENDATION
            </p>

            <h2>
              Recovery Decision
            </h2>

          </div>


          <span
            className={`priority ${
              result.priority?.toLowerCase()
            }`}
          >

            {result.priority} PRIORITY

          </span>

        </div>


        {/* MAIN RESULT */}

        <div className="result-main">

          <div className="result-item">

            <p>
              Recommended Action
            </p>

            <h3>
              {result.best_action}
            </h3>

          </div>


          <div className="result-item">

            <p>
              RePay Confidence
            </p>

            <h3>

              {formatPercentage(
                result.confidence_percentage ??
                result.recovery_probability
              )}%

            </h3>

          </div>

        </div>


        {/* EXPECTED RECOVERY */}

        <div className="expected-recovery">

          <p>
            Expected Recoverable Revenue
          </p>

          <h3>

            {formatCurrency(
              result.expected_recovery_amount
            )}

          </h3>

        </div>


        {/* RECOVERY STRATEGY */}

        {result.recovery_strategy?.length > 0 && (

          <div className="recovery-strategy">

            <div className="strategy-header">

              <div>

                <p className="options-title">
                  Recovery Strategy
                </p>

                <span>
                  Follow this recommended
                  recovery sequence
                </span>

              </div>

            </div>


            <div className="strategy-timeline">

              {result.recovery_strategy.map(
                (strategy, index) => {

                  const isPrimary =
                    strategy.type === "PRIMARY";

                  return (

                    <div
                      className={`timeline-step ${
                        isPrimary
                          ? "primary"
                          : "fallback"
                      }`}
                      key={index}
                    >

                      <div className="timeline-indicator">

                        <div className="timeline-number">
                          {strategy.step}
                        </div>


                        {index <
                          result.recovery_strategy.length - 1 && (

                          <div className="timeline-line"></div>

                        )}

                      </div>


                      <div className="timeline-content">

                        <div className="strategy-card-top">

                          <div>

                            <span
                              className={`strategy-badge ${
                                isPrimary
                                  ? "recommended"
                                  : "fallback"
                              }`}
                            >

                              {isPrimary
                                ? "RECOMMENDED"
                                : "FALLBACK"}

                            </span>


                            <h4>
                              {strategy.action}
                            </h4>

                          </div>


                          <div className="probability-badge">

                            <span>
                              Success Probability
                            </span>

                            <strong>

                              {formatPercentage(
                                strategy.probability
                              )}%

                            </strong>

                          </div>

                        </div>


                        <p className="strategy-description">

                          {strategy.instruction}

                        </p>


                        <div className="strategy-bar-wrapper">

                          <div className="strategy-bar-label">

                            <span>
                              Recovery likelihood
                            </span>

                            <span>

                              {formatPercentage(
                                strategy.probability
                              )}%

                            </span>

                          </div>


                          <div className="strategy-progress">

                            <div
                              className={`strategy-progress-fill ${
                                isPrimary
                                  ? "primary-fill"
                                  : "fallback-fill"
                              }`}
                              style={{
                                width:
                                  `${Math.min(
                                    Number(
                                      strategy.probability
                                    ) || 0,
                                    100
                                  )}%`
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          </div>

        )}


        {/* ALL RECOVERY OPTIONS */}

        <div className="probabilities">

          <p className="options-title">
            All Recovery Options
          </p>


          {Object.entries(
            result.all_action_probabilities || {}
          ).map(
            ([action, probability]) => (

              <div
                className="probability-row"
                key={action}
              >

                <div className="probability-label">

                  <span>
                    {action}
                  </span>

                  <strong>

                    {formatPercentage(
                      probability
                    )}%

                  </strong>

                </div>


                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${Math.min(
                          Number(probability) || 0,
                          100
                        )}%`
                    }}
                  />

                </div>

              </div>

            )
          )}

        </div>


        {/* REASONING */}

        <div className="reasoning-section">

          <h3>
            Why did RePay choose this?
          </h3>


          {result.reasoning?.length > 0 ? (

            <ul>

              {result.reasoning.map(
                (reason, index) => (

                  <li key={index}>
                    {reason}
                  </li>

                )
              )}

            </ul>

          ) : (

            <p>
              RePay reasoning is not available
              for this prediction.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default Modal;