function StatsCard({
  title,
  value,
  description,
  className = ""
}) {
  return (
    <div className={`metric-card ${className}`}>

      <p>
        {title}
      </p>

      <h2>
        {value}
      </h2>

      <span>
        {description}
      </span>

    </div>
  );
}

export default StatsCard;