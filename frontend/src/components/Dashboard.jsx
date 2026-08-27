import { useEffect, useState }
  from "react";

import { useNavigate }
  from "react-router-dom";

import Navbar from "./Navbar";
import StatsCard from "./StatsCard";
import PaymentForm from "./PaymentForm";
import PaymentTable from "./PaymentTable";
import Modal from "./Modal";

import {
  getRecentPayments,
  getPaymentStats,
  analyzePayment
} from "../services/api";

import {
  formatCurrency,
  formatPercentage
} from "../utils/helpers";


function Dashboard() {

  // ==========================================
  // FORM STATE
  // ==========================================

  const [amount, setAmount] =
    useState(5000);

  const [
    paymentMethod,
    setPaymentMethod
  ] = useState("Card");

  const [
    failureReason,
    setFailureReason
  ] = useState(
    "Card Declined"
  );


  // ==========================================
  // APP STATE
  // ==========================================

  const [result, setResult] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // STATS
  // ==========================================

  const [stats, setStats] =
    useState({

      total_payments: 0,

      total_revenue_at_risk: 0,

      recovered_payments: 0,

      total_revenue_recovered: 0,

      recovery_rate: 0,

      expected_recovery_revenue: 0,

      high_priority_count: 0,

      average_ai_confidence: 0,

      pending_count: 0,

      confirmed_count: 0,

      done_count: 0,

      recovered_this_month: 0,

      recovered_count_this_month: 0,

      current_month: "",

      current_year: ""

    });


  const navigate =
    useNavigate();


  // ==========================================
  // FETCH PAYMENTS
  // ==========================================

  const fetchPayments = async () => {

    try {

      const data =
        await getRecentPayments();

      setHistory(data);

    } catch (error) {

      console.error(
        "Error fetching payments:",
        error
      );

    }

  };


  // ==========================================
  // FETCH STATS
  // ==========================================

  const fetchStats = async () => {

    try {

      const data =
        await getPaymentStats();

      setStats(data);

    } catch (error) {

      console.error(
        "Error fetching stats:",
        error
      );

    }

  };


  // ==========================================
  // LOAD ON START
  // ==========================================

  useEffect(() => {

    fetchPayments();

    fetchStats();

  }, []);


  // ==========================================
  // REFRESH
  // ==========================================

  const refreshDashboard =
    async () => {

      setError("");

      await Promise.all([

        fetchPayments(),

        fetchStats()

      ]);

    };


  // ==========================================
  // ANALYZE PAYMENT
  // ==========================================

  const handleAnalyze =
    async () => {

      setLoading(true);

      setError("");


      const paymentData = {

        amount:
          Number(amount),

        payment_method:
          paymentMethod,

        failure_reason:
          failureReason,

        previous_successful_payments:
          10,

        previous_failed_payments:
          1,

        retry_count:
          0,

        customer_success_rate:
          0.9,

        hour_of_payment:
          14,

        customer_tenure_days:
          500

      };


      try {

        const data =
          await analyzePayment(
            paymentData
          );

        setResult(data);


        await Promise.all([

          fetchPayments(),

          fetchStats()

        ]);

      } catch (error) {

        console.error(
          "Error:",
          error
        );

        setError(
          "Could not connect to RePay backend. Please make sure the backend server is running."
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="app">

      <Navbar />


      <main className="container">


        {/* HERO */}

        <section className="hero">

          <div>

            <p className="eyebrow">

              AI-POWERED PAYMENT RECOVERY

            </p>


            <h1>

              Recover more.

              <br />

              <span>
                Lose less.
              </span>

            </h1>


            <p className="hero-text">

              RePay analyzes failed payments,
              predicts recovery probability,
              and recommends the best action
              using machine learning.

            </p>

          </div>

        </section>


        {/* MAIN METRICS */}

        <section className="metrics metrics-grid">

          <StatsCard
            title="Total Failed Payments"
            value={stats.total_payments || 0}
            description="Payments analyzed by RePay"
          />


          <StatsCard
            title="Revenue at Risk"
            value={formatCurrency(
              stats.total_revenue_at_risk
            )}
            description="Total failed payment value"
          />


          <StatsCard
            title="Recovered Payments"
            value={stats.recovered_payments || 0}
            description={`${formatPercentage(
              stats.recovery_rate
            )}% recovery rate`}
          />


          <StatsCard
            title="Revenue Recovered"
            value={formatCurrency(
              stats.total_revenue_recovered
            )}
            description="Successfully recovered"
          />

        </section>


        {/* REPAY INSIGHTS */}

        <section className="ai-metrics-section">

          <div className="section-heading">

            <div>

              <h2>
                RePay Insights
              </h2>

              <p>
                Smart recovery insights across all
                failed payments.
              </p>

            </div>

          </div>


          <div className="metrics ai-metrics">

            <StatsCard
              className="ai-card"
              title="Expected Recoverable Revenue"
              value={formatCurrency(
                stats.expected_recovery_revenue
              )}
              description="Based on RePay predictions"
            />


            <StatsCard
              className="ai-card"
              title="High Priority Payments"
              value={
                stats.high_priority_count || 0
              }
              description="Requires immediate attention"
            />


            <StatsCard
              className="ai-card"
              title="Recovery Confidence"
              value={`${formatPercentage(
                stats.average_ai_confidence
              )}%`}
              description="Average recovery probability"
            />


            <StatsCard
              className="ai-card"
              title="Recovery Pipeline"
              value={
                `${stats.pending_count || 0} / ${
                  stats.confirmed_count || 0
                } / ${
                  stats.done_count || 0
                }`
              }
              description="Pending / Confirmed / Done"
            />

          </div>

        </section>


        {/* PAYMENT FORM */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        <PaymentForm

          amount={amount}
          setAmount={setAmount}

          paymentMethod={paymentMethod}
          setPaymentMethod={
            setPaymentMethod
          }

          failureReason={failureReason}
          setFailureReason={
            setFailureReason
          }

          handleAnalyze={
            handleAnalyze
          }

          loading={loading}

        />


        {/* RESULT MODAL */}

        <Modal

          result={result}

          closeModal={() =>
            setResult(null)
          }

        />


        {/* PAYMENT TABLE */}

        <PaymentTable

          history={history}

          refreshDashboard={
            refreshDashboard
          }

          navigate={navigate}

        />

      </main>

    </div>

  );

}

export default Dashboard;