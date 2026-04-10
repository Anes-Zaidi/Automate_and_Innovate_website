-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  university VARCHAR(255) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  year VARCHAR(10) NOT NULL,
  is_team_leader BOOLEAN DEFAULT FALSE NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  organization VARCHAR(255) NOT NULL,
  visit_date VARCHAR(50) NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create policies (Basic: Allow all for now, or restrict as needed)
-- For a public registration form, we usually allow service role or specific policies
-- Here I'll just enable them for the service role (default Supabase behavior)
-- If these are accessed via API routes, the API routes will use the service role or a client with appropriate keys.

CREATE POLICY "Allow public inserts for teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts for participants" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts for visitors" ON visitors FOR INSERT WITH CHECK (true);

-- Allow reading only for authenticated users (admins)
CREATE POLICY "Allow authenticated reads for teams" ON teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated reads for participants" ON participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated reads for visitors" ON visitors FOR SELECT TO authenticated USING (true);
