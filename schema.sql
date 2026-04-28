-- SECURITY SCHEMA FOR SECUREGUARD

-- 1. PROFILES TABLE
-- Extends the auth.users table with security-specific settings
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  security_score INT DEFAULT 0,
  master_key_hash TEXT, -- Stored as a hash for verification
  recovery_question TEXT,
  recovery_answer_hash TEXT,
  lockout_until TIMESTAMP WITH TIME ZONE,
  failed_attempts INT DEFAULT 0,
  last_breach_check TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SECURE VAULT TABLE
-- Stores encrypted items. Content is encrypted client-side.
CREATE TABLE vault_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  encrypted_content TEXT NOT NULL, -- AES-256 encrypted string
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TWO-FACTOR SECRETS TABLE
-- Stores 2FA secrets for the manager. Encrypted client-side or server-side.
CREATE TABLE two_factor_secrets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  account_name TEXT NOT NULL,
  issuer TEXT,
  encrypted_secret TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SECURITY LOGS
-- Track login attempts and security events
CREATE TABLE security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'login', 'vault_access', 'failed_attempt', 'breach_found'
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE two_factor_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
-- Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vault: Users can only see and manage their own vault items
CREATE POLICY "Users can manage own vault" ON vault_items FOR ALL USING (auth.uid() = user_id);

-- 2FA: Users can only see and manage their own 2FA secrets
CREATE POLICY "Users can manage own 2fa" ON two_factor_secrets FOR ALL USING (auth.uid() = user_id);

-- Logs: Users can view their own logs
CREATE POLICY "Users can view own logs" ON security_logs FOR SELECT USING (auth.uid() = user_id);

-- FUNCTIONS & TRIGGERS
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
