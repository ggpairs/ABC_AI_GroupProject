-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 创建招募季状态枚举
CREATE TYPE recruitment_status AS ENUM ('upcoming', 'ongoing', 'ended');

-- 创建招募季季节枚举
CREATE TYPE season_type AS ENUM ('spring', 'summer', 'autumn');

-- 创建案例分类枚举
CREATE TYPE case_category AS ENUM ('ai_bot', 'ai_miniprogram', 'digital_transformation', 'other');

-- 创建用户资料表
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  email text,
  phone text,
  openid text,
  role user_role NOT NULL DEFAULT 'user',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建案例表
CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  cover_image text NOT NULL,
  client_type text NOT NULL,
  category case_category NOT NULL,
  tags text[] DEFAULT '{}',
  duration text,
  summary text NOT NULL,
  background text,
  challenges text,
  solutions text,
  results text,
  volunteers text,
  is_featured boolean DEFAULT false,
  view_count int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建志愿者故事表
CREATE TABLE volunteer_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text NOT NULL,
  quote text NOT NULL,
  full_story text NOT NULL,
  season season_type NOT NULL,
  position text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建招募季表
CREATE TABLE recruitment_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season season_type NOT NULL,
  year int NOT NULL,
  status recruitment_status NOT NULL,
  start_date date,
  end_date date,
  description text NOT NULL,
  requirements text NOT NULL,
  benefits text NOT NULL,
  next_season_hint text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(season, year)
);

-- 创建Q&A表
CREATE TABLE qa_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建服务模块表
CREATE TABLE service_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建收藏表
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('case', 'story')),
  item_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- 创建索引
CREATE INDEX idx_cases_category ON cases(category);
CREATE INDEX idx_cases_featured ON cases(is_featured);
CREATE INDEX idx_volunteer_stories_season ON volunteer_stories(season);
CREATE INDEX idx_volunteer_stories_featured ON volunteer_stories(is_featured);
CREATE INDEX idx_recruitment_seasons_status ON recruitment_seasons(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_item ON favorites(item_type, item_id);

-- 启用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 创建管理员检查函数
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles 策略
CREATE POLICY "管理员可以完全访问profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "用户可以查看自己的profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Cases 策略（所有人可读，管理员可写）
CREATE POLICY "所有人可以查看案例" ON cases
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理案例" ON cases
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Volunteer Stories 策略
CREATE POLICY "所有人可以查看志愿者故事" ON volunteer_stories
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理志愿者故事" ON volunteer_stories
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Recruitment Seasons 策略
CREATE POLICY "所有人可以查看招募季信息" ON recruitment_seasons
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理招募季" ON recruitment_seasons
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Q&A 策略
CREATE POLICY "所有人可以查看Q&A" ON qa_items
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理Q&A" ON qa_items
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Service Modules 策略
CREATE POLICY "所有人可以查看服务模块" ON service_modules
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理服务模块" ON service_modules
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Favorites 策略
CREATE POLICY "用户可以查看自己的收藏" ON favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "用户可以添加收藏" ON favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的收藏" ON favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 创建用户同步触发器函数
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  INSERT INTO public.profiles (id, username, email, phone, openid, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN NEW.email LIKE '%@miaoda.com' THEN REPLACE(NEW.email, '@miaoda.com', '')
      ELSE NULL
    END,
    CASE 
      WHEN NEW.email LIKE '%@wechat.login' THEN NULL
      ELSE NEW.email
    END,
    NEW.phone,
    COALESCE((NEW.raw_user_meta_data->>'openid')::text, NULL),
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  
  RETURN NEW;
END;
$$;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 创建公开视图
CREATE VIEW public_profiles AS
  SELECT id, username, avatar_url, role FROM profiles;