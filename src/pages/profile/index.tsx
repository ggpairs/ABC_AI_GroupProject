import {useCallback, useEffect, useState} from 'react'
import Taro, {useDidShow} from '@tarojs/taro'
import {Image} from '@tarojs/components'
import {useTabBarPageClass} from '@/hooks/useTabBarPageClass'
import {useAuth} from '@/contexts/AuthContext'
import {getUserFavorites} from '@/db/api'
import type {CaseWithFavorite, StoryWithFavorite} from '@/db/types'
import {withRouteGuard} from '@/components/RouteGuard'
import CaseCard from '@/components/CaseCard'
import StoryCard from '@/components/StoryCard'
import EmptyState from '@/components/EmptyState'

function Profile() {
  useTabBarPageClass()
  const {user, profile, signOut} = useAuth()
  const [favoriteCases, setFavoriteCases] = useState<CaseWithFavorite[]>([])
  const [favoriteStories, setFavoriteStories] = useState<StoryWithFavorite[]>([])
  const [activeTab, setActiveTab] = useState<'cases' | 'stories'>('cases')

  const loadFavorites = useCallback(async () => {
    if (!user) return

    const {cases, stories} = await getUserFavorites(user.id)
    setFavoriteCases(cases)
    setFavoriteStories(stories)
  }, [user])

  useDidShow(() => {
    loadFavorites()
  })

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const handleSignOut = async () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          await signOut()
          Taro.showToast({title: '已退出登录', icon: 'success'})
        }
      }
    })
  }

  const handleAbout = () => {
    Taro.showModal({
      title: '关于我们',
      content:
        'ABC数字创造营分社\n\n用数字技术创造价值\n\n我们致力于通过数字技术赋能企业和组织的数字化转型，为志愿者提供实践和成长的平台。\n\n版本：1.0.0',
      showCancel: false
    })
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-primary px-6 py-8">
        <div className="flex items-center gap-4">
          <Image
            src={(profile?.avatar_url as string) || 'https://via.placeholder.com/80'}
            mode="aspectFill"
            className="w-20 h-20 rounded-full bg-muted"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">
              {(profile?.username as string) || (user?.email as string) || '未登录'}
            </h1>
            <p className="text-xl text-white/80">{profile?.role === 'admin' ? '管理员' : '普通用户'}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <h2 className="text-3xl font-bold text-foreground mb-4">我的收藏</h2>

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('cases')}
            className={`flex-1 py-3 text-2xl font-medium rounded-xl transition-all flex items-center justify-center leading-none ${
              activeTab === 'cases'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
            案例 ({favoriteCases.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stories')}
            className={`flex-1 py-3 text-2xl font-medium rounded-xl transition-all flex items-center justify-center leading-none ${
              activeTab === 'stories'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
            故事 ({favoriteStories.length})
          </button>
        </div>

        {activeTab === 'cases' ? (
          favoriteCases.length === 0 ? (
            <EmptyState
              icon="i-mdi-heart-outline"
              title="暂无收藏案例"
              description="去浏览案例并收藏吧"
              actionText="浏览案例"
              onAction={() => Taro.switchTab({url: '/pages/cases/index'})}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {favoriteCases.map((caseItem) => (
                <CaseCard key={caseItem.id} case={caseItem} />
              ))}
            </div>
          )
        ) : favoriteStories.length === 0 ? (
          <EmptyState
            icon="i-mdi-heart-outline"
            title="暂无收藏故事"
            description="去浏览志愿者故事并收藏吧"
            actionText="浏览故事"
            onAction={() => Taro.switchTab({url: '/pages/volunteers/index'})}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {favoriteStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={handleAbout}
            className="w-full py-4 bg-card text-foreground text-2xl rounded-xl shadow-card flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="i-mdi-information-outline text-3xl" />
              <span>关于我们</span>
            </div>
            <div className="i-mdi-chevron-right text-3xl text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-4 bg-destructive text-destructive-foreground text-2xl rounded-xl flex items-center justify-center leading-none gap-2">
            <div className="i-mdi-logout text-3xl" />
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default withRouteGuard(Profile)
