import {supabase} from '@/client/supabase'
import type {
  Case,
  CaseCategory,
  CaseWithFavorite,
  QAItem,
  RecruitmentSeason,
  ServiceModule,
  StoryWithFavorite,
  VolunteerStory
} from './types'

// ==================== 案例相关 ====================

// 获取精选案例
export async function getFeaturedCases(limit = 3): Promise<Case[]> {
  const {data, error} = await supabase
    .from('cases')
    .select('*')
    .eq('is_featured', true)
    .order('view_count', {ascending: false})
    .limit(limit)

  if (error) {
    console.error('获取精选案例失败:', error)
    return []
  }
  return Array.isArray(data) ? data : []
}

// 获取案例列表（带筛选和分页）
export async function getCases(
  category?: CaseCategory,
  page = 1,
  pageSize = 10
): Promise<{cases: Case[]; total: number}> {
  let query = supabase.from('cases').select('*', {count: 'exact'})

  if (category) {
    query = query.eq('category', category)
  }

  const from = (page - 1) * pageSize
  const {data, error, count} = await query
    .order('created_at', {ascending: false})
    .range(from, from + pageSize - 1)

  if (error) {
    console.error('获取案例列表失败:', error)
    return {cases: [], total: 0}
  }

  return {
    cases: Array.isArray(data) ? data : [],
    total: count || 0
  }
}

// 获取案例详情
export async function getCaseById(id: string): Promise<Case | null> {
  const {data, error} = await supabase.from('cases').select('*').eq('id', id).maybeSingle()

  if (error) {
    console.error('获取案例详情失败:', error)
    return null
  }
  return data
}

// 增加案例浏览量
export async function incrementCaseViewCount(id: string): Promise<void> {
  const {error} = await supabase.rpc('increment_case_view_count', {case_id: id}).maybeSingle()

  if (error) {
    console.error('增加浏览量失败:', error)
  }
}

// ==================== 志愿者故事相关 ====================

// 获取精选志愿者故事
export async function getFeaturedStories(limit = 3): Promise<VolunteerStory[]> {
  const {data, error} = await supabase
    .from('volunteer_stories')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', {ascending: false})
    .limit(limit)

  if (error) {
    console.error('获取精选故事失败:', error)
    return []
  }
  return Array.isArray(data) ? data : []
}

// 获取志愿者故事列表（带筛选和分页）
export async function getVolunteerStories(
  season?: string,
  position?: string,
  page = 1,
  pageSize = 10
): Promise<{stories: VolunteerStory[]; total: number}> {
  let query = supabase.from('volunteer_stories').select('*', {count: 'exact'})

  if (season) {
    query = query.eq('season', season)
  }
  if (position) {
    query = query.ilike('position', `%${position}%`)
  }

  const from = (page - 1) * pageSize
  const {data, error, count} = await query
    .order('created_at', {ascending: false})
    .range(from, from + pageSize - 1)

  if (error) {
    console.error('获取志愿者故事失败:', error)
    return {stories: [], total: 0}
  }

  return {
    stories: Array.isArray(data) ? data : [],
    total: count || 0
  }
}

// 获取志愿者故事详情
export async function getStoryById(id: string): Promise<VolunteerStory | null> {
  const {data, error} = await supabase
    .from('volunteer_stories')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('获取故事详情失败:', error)
    return null
  }
  return data
}

// ==================== 招募季相关 ====================

// 获取当前招募季
export async function getCurrentRecruitmentSeason(): Promise<RecruitmentSeason | null> {
  const {data, error} = await supabase
    .from('recruitment_seasons')
    .select('*')
    .eq('status', 'ongoing')
    .order('year', {ascending: false})
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('获取当前招募季失败:', error)
    return null
  }
  return data
}

// 获取所有招募季
export async function getAllRecruitmentSeasons(): Promise<RecruitmentSeason[]> {
  const {data, error} = await supabase
    .from('recruitment_seasons')
    .select('*')
    .order('year', {ascending: false})
    .order('season', {ascending: false})

  if (error) {
    console.error('获取招募季列表失败:', error)
    return []
  }
  return Array.isArray(data) ? data : []
}

// 根据年份和季节获取招募季
export async function getRecruitmentSeasonByYearAndSeason(
  year: number,
  season: string
): Promise<RecruitmentSeason | null> {
  const {data, error} = await supabase
    .from('recruitment_seasons')
    .select('*')
    .eq('year', year)
    .eq('season', season)
    .maybeSingle()

  if (error) {
    console.error('获取招募季失败:', error)
    return null
  }
  return data
}

// ==================== Q&A相关 ====================

// 获取Q&A列表（按分类）
export async function getQAItems(category?: string): Promise<QAItem[]> {
  let query = supabase.from('qa_items').select('*')

  if (category) {
    query = query.eq('category', category)
  }

  const {data, error} = await query.order('sort_order', {ascending: true})

  if (error) {
    console.error('获取Q&A失败:', error)
    return []
  }
  return Array.isArray(data) ? data : []
}

// 获取Q&A分类列表
export async function getQACategories(): Promise<string[]> {
  const {data, error} = await supabase.from('qa_items').select('category')

  if (error) {
    console.error('获取Q&A分类失败:', error)
    return []
  }

  const categories = Array.isArray(data) ? data.map((item) => item.category) : []
  return [...new Set(categories)]
}

// ==================== 服务模块相关 ====================

// 获取所有服务模块
export async function getServiceModules(): Promise<ServiceModule[]> {
  const {data, error} = await supabase
    .from('service_modules')
    .select('*')
    .order('sort_order', {ascending: true})

  if (error) {
    console.error('获取服务模块失败:', error)
    return []
  }
  return Array.isArray(data) ? data : []
}

// ==================== 收藏相关 ====================

// 添加收藏
export async function addFavorite(
  userId: string,
  itemType: 'case' | 'story',
  itemId: string
): Promise<{success: boolean; error?: string}> {
  const {error} = await supabase.from('favorites').insert({
    user_id: userId,
    item_type: itemType,
    item_id: itemId
  })

  if (error) {
    console.error('添加收藏失败:', error)
    return {success: false, error: error.message}
  }
  return {success: true}
}

// 取消收藏
export async function removeFavorite(
  userId: string,
  itemType: 'case' | 'story',
  itemId: string
): Promise<{success: boolean; error?: string}> {
  const {error} = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)

  if (error) {
    console.error('取消收藏失败:', error)
    return {success: false, error: error.message}
  }
  return {success: true}
}

// 检查是否已收藏
export async function checkIsFavorited(
  userId: string,
  itemType: 'case' | 'story',
  itemId: string
): Promise<boolean> {
  const {data, error} = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .maybeSingle()

  if (error) {
    console.error('检查收藏状态失败:', error)
    return false
  }
  return !!data
}

// 获取用户收藏列表
export async function getUserFavorites(
  userId: string
): Promise<{cases: CaseWithFavorite[]; stories: StoryWithFavorite[]}> {
  const {data: favorites, error} = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {ascending: false})

  if (error) {
    console.error('获取收藏列表失败:', error)
    return {cases: [], stories: []}
  }

  const favoritesArray = Array.isArray(favorites) ? favorites : []

  // 分离案例和故事的ID
  const caseIds = favoritesArray.filter((f) => f.item_type === 'case').map((f) => f.item_id)
  const storyIds = favoritesArray.filter((f) => f.item_type === 'story').map((f) => f.item_id)

  // 获取案例详情
  let cases: CaseWithFavorite[] = []
  if (caseIds.length > 0) {
    const {data: casesData} = await supabase.from('cases').select('*').in('id', caseIds)
    cases = (Array.isArray(casesData) ? casesData : []).map((c) => ({...c, is_favorited: true}))
  }

  // 获取故事详情
  let stories: StoryWithFavorite[] = []
  if (storyIds.length > 0) {
    const {data: storiesData} = await supabase
      .from('volunteer_stories')
      .select('*')
      .in('id', storyIds)
    stories = (Array.isArray(storiesData) ? storiesData : []).map((s) => ({
      ...s,
      is_favorited: true
    }))
  }

  return {cases, stories}
}

// 批量检查收藏状态
export async function batchCheckFavorites(
  userId: string,
  items: Array<{type: 'case' | 'story'; id: string}>
): Promise<Record<string, boolean>> {
  const {data, error} = await supabase.from('favorites').select('*').eq('user_id', userId)

  if (error) {
    console.error('批量检查收藏状态失败:', error)
    return {}
  }

  const favoritesArray = Array.isArray(data) ? data : []
  const favoriteMap: Record<string, boolean> = {}

  items.forEach((item) => {
    const key = `${item.type}_${item.id}`
    favoriteMap[key] = favoritesArray.some(
      (f) => f.item_type === item.type && f.item_id === item.id
    )
  })

  return favoriteMap
}
