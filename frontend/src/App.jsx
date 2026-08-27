
// import { useEffect, useState } from "react";
// import {
//   Routes,
//   Route,
//   useNavigate
// } from "react-router-dom";

// import PaymentHistory from "./PaymentHistory";
// import "./App.css";

// const API_URL = "http://127.0.0.1:8000";


// function Dashboard() {

//   // ==========================================
//   // FORM STATE
//   // ==========================================

//   const [amount, setAmount] = useState(5000);

//   const [paymentMethod, setPaymentMethod] =
//     useState("Card");

//   const [failureReason, setFailureReason] =
//     useState("Card Declined");


//   // ==========================================
//   // APP STATE
//   // ==========================================

//   const [result, setResult] = useState(null);

//   const [history, setHistory] = useState([]);

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState("");


//   // ==========================================
//   // DASHBOARD STATS
//   // ==========================================

//   const [stats, setStats] = useState({

//     total_payments: 0,

//     total_revenue_at_risk: 0,

//     recovered_payments: 0,

//     total_revenue_recovered: 0,

//     recovery_rate: 0,

//     expected_recovery_revenue: 0,

//     high_priority_count: 0,

//     average_ai_confidence: 0,

//     pending_count: 0,

//     confirmed_count: 0,

//     done_count: 0,

//     recovered_this_month: 0,

//     recovered_count_this_month: 0,

//     current_month: "",

//     current_year: ""

//   });


//   const navigate = useNavigate();


//   // ==========================================
//   // LOAD DATA ON START
//   // ==========================================

//   useEffect(() => {

//     fetchPayments();

//     fetchStats();

//   }, []);


//   // ==========================================
//   // FETCH RECENT PAYMENTS
//   // ==========================================

//   const fetchPayments = async () => {

//     try {

//       const response = await fetch(
//         `${API_URL}/payments/recent`
//       );

//       if (!response.ok) {

//         throw new Error(
//           "Failed to fetch payments"
//         );

//       }

//       const data =
//         await response.json();

//       setHistory(data);

//     } catch (error) {

//       console.error(
//         "Error fetching payments:",
//         error
//       );

//     }

//   };


//   // ==========================================
//   // FETCH DASHBOARD STATS
//   // ==========================================

//   const fetchStats = async () => {

//     try {

//       const response = await fetch(
//         `${API_URL}/payments/stats`
//       );

//       if (!response.ok) {

//         throw new Error(
//           "Failed to fetch stats"
//         );

//       }

//       const data =
//         await response.json();

//       setStats(data);

//     } catch (error) {

//       console.error(
//         "Error fetching stats:",
//         error
//       );

//     }

//   };


//   // ==========================================
//   // REFRESH DASHBOARD
//   // ==========================================

//   const refreshDashboard = async () => {

//     setError("");

//     try {

//       await Promise.all([
//         fetchPayments(),
//         fetchStats()
//       ]);

//     } catch (error) {

//       console.error(error);

//     }

//   };


//   // ==========================================
//   // ANALYZE PAYMENT
//   // ==========================================

//   const handleAnalyze = async () => {

//     setLoading(true);

//     setError("");


//     const paymentData = {

//       amount:
//         Number(amount),

//       payment_method:
//         paymentMethod,

//       failure_reason:
//         failureReason,

//       previous_successful_payments:
//         10,

//       previous_failed_payments:
//         1,

//       retry_count:
//         0,

//       customer_success_rate:
//         0.9,

//       hour_of_payment:
//         14,

//       customer_tenure_days:
//         500

//     };


//     try {

//       const response =
//         await fetch(

//           `${API_URL}/predict`,

//           {

//             method:
//               "POST",

//             headers: {

//               "Content-Type":
//                 "application/json"

//             },

//             body:
//               JSON.stringify(
//                 paymentData
//               )

//           }

//         );


//       if (!response.ok) {

//         throw new Error(
//           "Prediction failed"
//         );

//       }


//       const data =
//         await response.json();


//       // Show RePay result
//       setResult(data);


//       // Refresh dashboard
//       await Promise.all([
//         fetchPayments(),
//         fetchStats()
//       ]);


//     } catch (error) {

//       console.error(
//         "Error:",
//         error
//       );

//       setError(
//         "Could not connect to RePay backend. Please make sure the backend server is running."
//       );


//     } finally {

//       setLoading(false);

//     }

//   };


//   // ==========================================
//   // FORMAT CURRENCY
//   // ==========================================

//   const formatCurrency = (value) => {

//     return `₹${Number(
//       value || 0
//     ).toLocaleString(
//       "en-IN",
//       {
//         maximumFractionDigits: 2
//       }
//     )}`;

//   };


//   // ==========================================
//   // FORMAT PERCENTAGE
//   // ==========================================

//   const formatPercentage = (value) => {

//     return Number(
//       value || 0
//     ).toFixed(2);

//   };


//   return (

//     <div className="app">


//       {/* =====================================
//           NAVBAR
//       ===================================== */}

//       <nav className="navbar">

//         <div className="logo">

//           <div className="logo-icon">
//             R
//           </div>

//           <span>
//             RePay
//           </span>

//         </div>


//         <div className="nav-status">

//           <span className="status-dot"></span>

//           AI Powered Recovery Engine

//         </div>

//       </nav>



//       <main className="container">


//         {/* =====================================
//             HERO
//         ===================================== */}

//         <section className="hero">

//           <div>

//             <p className="eyebrow">

//               AI-POWERED PAYMENT RECOVERY

//             </p>


//             <h1>

//               Recover more.

//               <br />

//               <span>
//                 Lose less.
//               </span>

//             </h1>


//             <p className="hero-text">

//               RePay analyzes failed payments,
//               predicts recovery probability,
//               and recommends the best action
//               using machine learning.

//             </p>

//           </div>

//         </section>



//         {/* =====================================
//             MAIN METRICS
//         ===================================== */}

//         <section className="metrics metrics-grid">


//           <div className="metric-card">

//             <p>
//               Total Failed Payments
//             </p>

//             <h2>
//               {stats.total_payments || 0}
//             </h2>

//             <span>
//               Payments analyzed by RePay
//             </span>

//           </div>



//           <div className="metric-card">

//             <p>
//               Revenue at Risk
//             </p>

//             <h2>
//               {formatCurrency(
//                 stats.total_revenue_at_risk
//               )}
//             </h2>

//             <span>
//               Total failed payment value
//             </span>

//           </div>



//           <div className="metric-card">

//             <p>
//               Recovered Payments
//             </p>

//             <h2>
//               {stats.recovered_payments || 0}
//             </h2>

//             <span className="positive">

//               {formatPercentage(
//                 stats.recovery_rate
//               )}%
//               {" "}recovery rate

//             </span>

//           </div>



//           <div className="metric-card">

//             <p>
//               Revenue Recovered
//             </p>

//             <h2>
//               {formatCurrency(
//                 stats.total_revenue_recovered
//               )}
//             </h2>

//             <span className="positive">
//               Successfully recovered
//             </span>

//           </div>

//         </section>



//         {/* =====================================
//             REPAY INSIGHTS
//         ===================================== */}

//         <section className="ai-metrics-section">

//           <div className="section-heading">

//             <div>

//               <h2>
//                 RePay Insights
//               </h2>

//               <p>
//                 Smart recovery insights across all failed payments.
//               </p>

//             </div>

//           </div>


//           <div className="metrics ai-metrics">


//             <div className="metric-card ai-card">

//               <p>
//                 Expected Recoverable Revenue
//               </p>

//               <h2>

//                 {formatCurrency(
//                   stats.expected_recovery_revenue
//                 )}

//               </h2>

//               <span>
//                 Based on RePay predictions
//               </span>

//             </div>



//             <div className="metric-card ai-card">

//               <p>
//                 High Priority Payments
//               </p>

//               <h2>

//                 {stats.high_priority_count || 0}

//               </h2>

//               <span className="priority-text">

//                 Requires immediate attention

//               </span>

//             </div>



//             <div className="metric-card ai-card">

//               <p>
//                 Recovery Confidence
//               </p>

//               <h2>

//                 {formatPercentage(
//                   stats.average_ai_confidence
//                 )}%

//               </h2>

//               <span>

//                 Average recovery probability

//               </span>

//             </div>



//             <div className="metric-card ai-card">

//               <p>
//                 Recovery Pipeline
//               </p>

//               <h2>

//                 {stats.pending_count || 0}

//                 {" / "}

//                 {stats.confirmed_count || 0}

//                 {" / "}

//                 {stats.done_count || 0}

//               </h2>

//               <span>

//                 Pending / Confirmed / Done

//               </span>

//             </div>

//           </div>

//         </section>



//         {/* =====================================
//             PAYMENT ANALYZER
//         ===================================== */}

//         <section className="analyzer">


//           <div className="section-heading">

//             <div>

//               <h2>
//                 Analyze Failed Payment
//               </h2>

//               <p>

//                 Enter payment details to get a
//                 RePay recommendation.

//               </p>

//             </div>


//             <div className="ai-label">

//               <span></span>

//               RePay

//             </div>

//           </div>



//           {error && (

//             <div className="error-message">

//               {error}

//             </div>

//           )}



//           <div className="form-grid">


//             {/* AMOUNT */}

//             <div className="input-group">

//               <label>
//                 Payment Amount
//               </label>


//               <div className="amount-input">

//                 <span>
//                   ₹
//                 </span>


//                 <input

//                   type="number"

//                   min="1"

//                   value={amount}

//                   onChange={(e) =>
//                     setAmount(
//                       e.target.value
//                     )
//                   }

//                 />

//               </div>

//             </div>



//             {/* PAYMENT METHOD */}

//             <div className="input-group">

//               <label>
//                 Payment Method
//               </label>


//               <select

//                 value={paymentMethod}

//                 onChange={(e) =>
//                   setPaymentMethod(
//                     e.target.value
//                   )
//                 }

//               >

//                 <option>
//                   Card
//                 </option>

//                 <option>
//                   UPI
//                 </option>

//                 <option>
//                   Net Banking
//                 </option>

//                 <option>
//                   Wallet
//                 </option>

//               </select>

//             </div>



//             {/* FAILURE REASON */}

//             <div className="input-group">

//               <label>
//                 Failure Reason
//               </label>


//               <select

//                 value={failureReason}

//                 onChange={(e) =>
//                   setFailureReason(
//                     e.target.value
//                   )
//                 }

//               >

//                 <option>
//                   Card Declined
//                 </option>

//                 <option>
//                   Insufficient Funds
//                 </option>

//                 <option>
//                   Network Error
//                 </option>

//                 <option>
//                   Bank Error
//                 </option>

//               </select>

//             </div>

//           </div>



//           <button

//             className="analyze-btn"

//             onClick={handleAnalyze}

//             disabled={loading}

//           >

//             {loading
//               ? "Analyzing..."
//               : "Analyze Payment →"
//             }

//           </button>

//         </section>



//         {/* =====================================
//             REPAY RESULT MODAL
//         ===================================== */}

//         {result && (

//           <div className="modal-overlay">

//             <div className="result-card">


//               <button

//                 className="close-btn"

//                 onClick={() =>
//                   setResult(null)
//                 }

//               >
//                 ×
//               </button>



//               {/* HEADER */}

//               <div className="result-header">

//                 <div>

//                   <p className="eyebrow">

//                     REPAY RECOMMENDATION

//                   </p>


//                   <h2>

//                     Recovery Decision

//                   </h2>

//                 </div>


//                 <span

//                   className={`priority ${
//                     result.priority
//                       ?.toLowerCase()
//                   }`}

//                 >

//                   {result.priority} PRIORITY

//                 </span>

//               </div>



//               {/* MAIN RESULT */}

//               <div className="result-main">


//                 <div className="result-item">

//                   <p>
//                     Recommended Action
//                   </p>

//                   <h3>
//                     {result.best_action}
//                   </h3>

//                 </div>



//                 <div className="result-item">

//                   <p>
//                     RePay Confidence
//                   </p>

//                   <h3>

//                     {formatPercentage(
//                       result.confidence_percentage ??
//                       result.recovery_probability
//                     )}%

//                   </h3>

//                 </div>

//               </div>



//               {/* EXPECTED RECOVERY */}

//               <div className="expected-recovery">

//                 <p>
//                   Expected Recoverable Revenue
//                 </p>

//                 <h3>

//                   {formatCurrency(
//                     result.expected_recovery_amount
//                   )}

//                 </h3>

//               </div>



//               {/* =====================================
//                   RECOVERY STRATEGY
//               ===================================== */}

             


// {result.recovery_strategy?.length > 0 && (

//   <div className="recovery-strategy">

//     <div className="strategy-header">

//       <div>

//         <p className="options-title">
//           Recovery Strategy
//         </p>

//         <span>
//           Follow this recommended recovery sequence
//         </span>

//       </div>

//     </div>


//     <div className="strategy-timeline">

//       {result.recovery_strategy.map(
//         (strategy, index) => {

//           const isPrimary =
//             strategy.type === "PRIMARY";

//           return (

//             <div
//               className={`timeline-step ${
//                 isPrimary ? "primary" : "fallback"
//               }`}
//               key={index}
//             >

//               {/* TIMELINE INDICATOR */}

//               <div className="timeline-indicator">

//                 <div className="timeline-number">
//                   {strategy.step}
//                 </div>

//                 {index <
//                   result.recovery_strategy.length - 1 && (
//                     <div className="timeline-line"></div>
//                   )}

//               </div>


//               {/* STRATEGY CARD */}

//               <div className="timeline-content">


//                 <div className="strategy-card-top">

//                   <div>

//                     <span
//                       className={`strategy-badge ${
//                         isPrimary
//                           ? "recommended"
//                           : "fallback"
//                       }`}
//                     >

//                       {isPrimary
//                         ? "RECOMMENDED"
//                         : "FALLBACK"}

//                     </span>


//                     <h4>
//                       {strategy.action}
//                     </h4>

//                   </div>


//                   <div className="probability-badge">

//                     <span>
//                       Success Probability
//                     </span>

//                     <strong>
//                       {formatPercentage(
//                         strategy.probability
//                       )}%
//                     </strong>

//                   </div>

//                 </div>


//                 <p className="strategy-description">

//                   {strategy.instruction}

//                 </p>


//                 {/* PROBABILITY BAR */}

//                 <div className="strategy-bar-wrapper">

//                   <div className="strategy-bar-label">

//                     <span>
//                       Recovery likelihood
//                     </span>

//                     <span>
//                       {formatPercentage(
//                         strategy.probability
//                       )}%
//                     </span>

//                   </div>


//                   <div className="strategy-progress">

//                     <div

//                       className={`strategy-progress-fill ${
//                         isPrimary
//                           ? "primary-fill"
//                           : "fallback-fill"
//                       }`}

//                       style={{

//                         width:
//                           `${Math.min(
//                             Number(
//                               strategy.probability
//                             ) || 0,
//                             100
//                           )}%`

//                       }}

//                     ></div>

//                   </div>

//                 </div>


//               </div>

//             </div>

//           );

//         }

//       )}

//     </div>

//   </div>

// )}




//               {/* =====================================
//                   ALL RECOVERY OPTIONS
//               ===================================== */}

//               <div className="probabilities">

//                 <p className="options-title">

//                   All Recovery Options

//                 </p>


//                 {Object.entries(
//                   result.all_action_probabilities
//                   || {}
//                 ).map(
//                   ([action, probability]) => (

//                     <div

//                       className="probability-row"

//                       key={action}

//                     >


//                       <div className="probability-label">

//                         <span>
//                           {action}
//                         </span>

//                         <strong>

//                           {formatPercentage(
//                             probability
//                           )}%

//                         </strong>

//                       </div>


//                       <div className="progress-bar">

//                         <div

//                           className="progress-fill"

//                           style={{

//                             width:
//                               `${Math.min(
//                                 Number(probability) || 0,
//                                 100
//                               )}%`

//                           }}

//                         />

//                       </div>

//                     </div>

//                   )
//                 )}

//               </div>



//               {/* =====================================
//                   REPAY REASONING
//               ===================================== */}

//               <div className="reasoning-section">

//                 <h3>

//                   Why did RePay choose this?

//                 </h3>


//                 {result.reasoning?.length > 0 ? (

//                   <ul>

//                     {result.reasoning.map(
//                       (reason, index) => (

//                         <li key={index}>

//                           {reason}

//                         </li>

//                       )
//                     )}

//                   </ul>

//                 ) : (

//                   <p>

//                     RePay reasoning is not available
//                     for this prediction.

//                   </p>

//                 )}

//               </div>


//             </div>

//           </div>

//         )}



//         {/* =====================================
//             RECENT PAYMENT HISTORY
//         ===================================== */}

//         <section className="history">


//           <div className="history-header">


//             <div>

//               <h2>
//                 Recent Recovery History
//               </h2>

//               <p>

//                 Your latest failed payments
//                 analyzed by RePay.

//               </p>

//             </div>



//             <div className="history-actions">


//               <button

//                 className="view-all-btn"

//                 onClick={refreshDashboard}

//               >

//                 Refresh

//               </button>



//               <button

//                 className="view-all-btn"

//                 onClick={() =>
//                   navigate(
//                     "/payment-history"
//                   )
//                 }

//               >

//                 View All →

//               </button>

//             </div>

//           </div>



//           <div className="table-wrapper">

//             <table>

//               <thead>

//                 <tr>

//                   <th>
//                     Payment
//                   </th>

//                   <th>
//                     Amount
//                   </th>

//                   <th>
//                     Failure Reason
//                   </th>

//                   <th>
//                     RePay Action
//                   </th>

//                   <th>
//                     Probability
//                   </th>

//                   <th>
//                     Priority
//                   </th>

//                   <th>
//                     Status
//                   </th>

//                 </tr>

//               </thead>



//               <tbody>


//                 {history.length === 0 ? (

//                   <tr>

//                     <td
//                       colSpan="7"
//                       className="empty-history"
//                     >

//                       No payments analyzed yet.

//                     </td>

//                   </tr>

//                 ) : (

//                   history.map(
//                     (payment, index) => (

//                       <tr
//                         key={
//                           payment._id
//                           || index
//                         }
//                       >


//                         <td>

//                           <div className="payment-info">

//                             <div className="payment-icon">

//                               ₹

//                             </div>


//                             <div>

//                               <strong>

//                                 PAY-

//                                 {payment._id
//                                   ? payment._id.slice(-4)
//                                   : index + 1}

//                               </strong>


//                               <span>

//                                 {payment.payment_method}

//                                 {" "}Payment

//                               </span>

//                             </div>

//                           </div>

//                         </td>



//                         <td>

//                           {formatCurrency(
//                             payment.amount
//                           )}

//                         </td>



//                         <td>

//                           {payment.failure_reason}

//                         </td>



//                         <td>

//                           <span className="action-tag">

//                             {payment.best_action}

//                           </span>

//                         </td>



//                         <td>

//                           <strong className="probability">

//                             {formatPercentage(
//                               payment.recovery_probability
//                             )}%

//                           </strong>

//                         </td>



//                         <td>

//                           <span

//                             className={`priority small-priority ${
//                               payment.priority
//                                 ?.toLowerCase()
//                             }`}

//                           >

//                             {payment.priority || "-"}

//                           </span>

//                         </td>



//                         <td>

//                           <span

//                             className={`status ${
//                               (
//                                 payment.status
//                                 || "Pending"
//                               ).toLowerCase()
//                             }`}

//                           >

//                             ● {payment.status || "Pending"}

//                           </span>

//                         </td>

//                       </tr>

//                     )
//                   )

//                 )}

//               </tbody>

//             </table>

//           </div>

//         </section>


//       </main>

//     </div>

//   );

// }


// /* ==========================================
//    ROUTES
// ========================================== */

// function App() {

//   return (

//     <Routes>

//       <Route

//         path="/"

//         element={<Dashboard />}

//       />


//       <Route

//         path="/payment-history"

//         element={<PaymentHistory />}

//       />

//     </Routes>

//   );

// }


// export default App;


import {
  Routes,
  Route
} from "react-router-dom";

import Dashboard
  from "./components/Dashboard";

import PaymentHistory
  from "./PaymentHistory";

import "./App.css";


function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/payment-history"
        element={<PaymentHistory />}
      />

    </Routes>

  );

}


export default App;