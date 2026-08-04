-- USC Analytics Tables
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ── Leads table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  appliance TEXT NOT NULL,
  issue TEXT DEFAULT '',
  name TEXT DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  phone_hash TEXT DEFAULT '',
  phone_last4 TEXT DEFAULT '',
  source TEXT NOT NULL,
  page_url TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  ip_address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  region TEXT DEFAULT '',
  country TEXT DEFAULT '',
  isp TEXT DEFAULT '',
  asn TEXT DEFAULT '',
  browser TEXT DEFAULT '',
  browser_version TEXT DEFAULT '',
  os TEXT DEFAULT '',
  os_version TEXT DEFAULT '',
  device_type TEXT DEFAULT '',
  device_model TEXT DEFAULT '',
  device_vendor TEXT DEFAULT '',
  session_id TEXT DEFAULT '',
  time_on_page BIGINT DEFAULT 0,
  screen_resolution TEXT DEFAULT '',
  viewport TEXT DEFAULT '',
  language TEXT DEFAULT '',
  referrer TEXT DEFAULT '',
  traffic_source TEXT DEFAULT '',
  traffic_medium TEXT DEFAULT '',
  traffic_category TEXT DEFAULT '',
  traffic_campaign TEXT DEFAULT '',
  gclid TEXT DEFAULT '',
  fingerprint TEXT DEFAULT ''
);

-- ── Page views table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_views (
  view_id TEXT PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL DEFAULT '',
  page_url TEXT DEFAULT '',
  page_path TEXT DEFAULT '',
  page_title TEXT DEFAULT '',
  referrer TEXT DEFAULT '',
  ip_address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  region TEXT DEFAULT '',
  country TEXT DEFAULT '',
  isp TEXT DEFAULT '',
  browser TEXT DEFAULT '',
  os TEXT DEFAULT '',
  device_type TEXT DEFAULT '',
  screen_resolution TEXT DEFAULT '',
  language TEXT DEFAULT '',
  traffic_source TEXT DEFAULT '',
  traffic_medium TEXT DEFAULT '',
  traffic_category TEXT DEFAULT '',
  time_on_page BIGINT DEFAULT 0,
  fingerprint TEXT DEFAULT ''
);

-- ── Enable Row Level Security ────────────────────────────────────
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can submit leads / page views from website)
CREATE POLICY "Public insert leads" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert page_views" ON page_views FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow public select (admin dashboard reads — admin pages are behind auth middleware)
CREATE POLICY "Public select leads" ON leads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public select page_views" ON page_views FOR SELECT TO anon, authenticated USING (true);

-- ── Indexes for performance ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_received_at ON leads (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_appliance ON leads (appliance);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_fingerprint ON leads (fingerprint);
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON leads (session_id);

CREATE INDEX IF NOT EXISTS idx_pv_received_at ON page_views (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_page_path ON page_views (page_path);
CREATE INDEX IF NOT EXISTS idx_pv_fingerprint ON page_views (fingerprint);
CREATE INDEX IF NOT EXISTS idx_pv_session_id ON page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_pv_traffic_category ON page_views (traffic_category);
