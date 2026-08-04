-- BigQuery table schema for Urban Service Company lead tracking
-- Run this in the BigQuery console after creating your dataset
-- Dataset: analytics  |  Table: leads

CREATE TABLE IF NOT EXISTS `analytics.leads` (
  lead_id STRING NOT NULL,
  received_at TIMESTAMP NOT NULL,
  appliance STRING NOT NULL,
  issue STRING,
  name STRING,
  phone_hash STRING NOT NULL,
  phone_last4 STRING NOT NULL,
  source STRING NOT NULL,

  -- Page context
  page_url STRING,
  referrer STRING,

  -- Server-side telemetry
  ip_address STRING,
  city STRING,
  region STRING,
  country STRING,
  isp STRING,
  asn STRING,
  latitude STRING,
  longitude STRING,
  user_agent STRING,

  -- Device info (from user-agent)
  browser STRING,
  browser_version STRING,
  os STRING,
  os_version STRING,
  device_type STRING,
  device_model STRING,
  device_vendor STRING,

  -- Client-side telemetry
  session_id STRING,
  time_on_page INT64,
  screen_resolution STRING,
  viewport STRING,
  language STRING
);

-- Optional: Partition by date for cost optimization
-- CREATE TABLE IF NOT EXISTS `analytics.leads`
-- PARTITION BY DATE(received_at)
-- CLUSTER BY appliance, source AS
-- SELECT * FROM `analytics.leads`;

-- ── Useful queries ──────────────────────────────────────────────

-- Leads by appliance
-- SELECT appliance, COUNT(*) as leads FROM `analytics.leads`
-- GROUP BY appliance ORDER BY leads DESC;

-- Leads by source (which button/form)
-- SELECT source, COUNT(*) as leads FROM `analytics.leads`
-- GROUP BY source ORDER BY leads DESC;

-- Leads by city (geo)
-- SELECT city, COUNT(*) as leads FROM `analytics.leads`
-- GROUP BY city ORDER BY leads DESC;

-- Leads by ISP
-- SELECT isp, COUNT(*) as leads FROM `analytics.leads`
-- GROUP BY isp ORDER BY leads DESC;

-- Leads by device type
-- SELECT device_type, COUNT(*) as leads FROM `analytics.leads`
-- GROUP BY device_type ORDER BY leads DESC;

-- Avg time on page before lead submission
-- SELECT AVG(time_on_page) as avg_ms FROM `analytics.leads`;

-- Leads by browser
-- SELECT browser, COUNT(*) as leads FROM `analytics.leads`
-- GROUP BY browser ORDER BY leads DESC;

-- Unique users (by phone hash)
-- SELECT COUNT(DISTINCT phone_hash) as unique_users FROM `analytics.leads`;

-- Leads by day with conversion source
-- SELECT DATE(received_at) as day, source, COUNT(*) as leads
-- FROM `analytics.leads` GROUP BY day, source ORDER BY day DESC;
