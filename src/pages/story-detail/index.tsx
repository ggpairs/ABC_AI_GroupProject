import {useCallback, useEffect, useState} from 'react'
import {getCurrentInstance, useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {Image} from '@tarojs/components'
import {checkIsFavorited, getStoryById} from '@/db/api'
import type {VolunteerStory} from '@/db/types'
import FavoriteButton from '@/components/FavoriteButton'
import {useAuth} from '@/contexts/AuthContext'

export default function StoryDetail() {
  const {user} = useAuth()
  const [story, setStory] = useState<VolunteerStory | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(true)

  const storyId = getCurrentInstance().router?.params?.id || ''

  const loadData = useCallback(async () => {
    if (!storyId) return

    setLoading(true)
    const data = await getStoryById(storyId)
    setStory(data)

    if (data && user) {
      const isFavorited = await checkIsFavorited(user.id, 'story', storyId)
      setFavorited(isFavorited)
    }
    setLoading(false)
  }, [storyId, user])

  useDidShow(() => {
    loadData()
  })

  useEffect(() => {
    loadData()
  }, [loadData])

  useShareAppMessage(() => ({
    title: story?.name ? `${story.name}的志愿者故事` : '志愿者故事',
    path: `/pages/story-detail/index?id=${storyId}`
  }))

  useShareTimeline(() => ({
    title: story?.name ? `${story.name}的志愿者故事` : '志愿者故事'
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="i-mdi-loading text-5xl text-primary animate-spin" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <div className="i-mdi-alert-circle-outline text-8xl text-muted-foreground mb-4" />
          <p className="text-2xl text-muted-foreground">故事不存在</p>
        </div>
      </div>
    )
  }

  const seasonMap = {
    spring: '春季',
    summer: '夏季',
    autumn: '秋季'
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-subtle px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <Image src={story.avatar_url} mode="aspectFill" className="w-20 h-20 rounded-full bg-muted" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">{story.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xl text-muted-foreground">{story.position}</span>
              <span className="text-xl text-muted-foreground">·</span>
              <span className="text-xl text-primary">{seasonMap[story.season]}</span>
            </div>
          </div>
          <FavoriteButton
            itemType="story"
            itemId={story.id}
            initialFavorited={favorited}
            onToggle={setFavorited}
          />
        </div>
        <p className="text-2xl text-foreground italic">"{story.quote}"</p>
      </div>

      <div className="px-6 py-6">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">{story.full_story}</p>
        </div>
      </div>
    </div>
  )
}
