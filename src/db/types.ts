// 数据库类型定义

export type UserRole = 'user' | 'admin'
export type RecruitmentStatus = 'upcoming' | 'ongoing' | 'ended'
export type SeasonType = 'spring' | 'summer' | 'autumn'
export type CaseCategory = 'ai_bot' | 'ai_miniprogram' | 'digital_transformation' | 'other'

export interface Profile {
  id: string
  username: string | null
  email: string | null
  phone: string | null
  openid: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Case {
  id: string
  title: string
  cover_image: string
  client_type: string
  category: CaseCategory
  tags: string[]
  duration: string | null
  summary: string
  background: string | null
  challenges: string | null
  solutions: string | null
  results: string | null
  volunteers: string | null
  is_featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface VolunteerStory {
  id: string
  name: string
  avatar_url: string
  quote: string
  full_story: string
  season: SeasonType
  position: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface RecruitmentSeason {
  id: string
  season: SeasonType
  year: number
  status: RecruitmentStatus
  start_date: string | null
  end_date: string | null
  description: string
  requirements: string
  benefits: string
  next_season_hint: string | null
  created_at: string
  updated_at: string
}

export interface QAItem {
  id: string
  category: string
  question: string
  answer: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ServiceModule {
  id: string
  title: string
  description: string
  icon: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  item_type: 'case' | 'story'
  item_id: string
  created_at: string
}

// 带收藏状态的案例
export interface CaseWithFavorite extends Case {
  is_favorited?: boolean
}

// 带收藏状态的志愿者故事
export interface StoryWithFavorite extends VolunteerStory {
  is_favorited?: boolean
}
