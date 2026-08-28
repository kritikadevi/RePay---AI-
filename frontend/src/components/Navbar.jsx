function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">

        <img
          className="logo-icon"
          src="/favicon.svg"
          alt="RePay AI logo"
        />

        <span>
          RePay
        </span>

      </div>


      <div className="nav-status">

        <span className="status-dot"></span>

        AI Powered Recovery Engine

      </div>

    </nav>
  );
}

export default Navbar;