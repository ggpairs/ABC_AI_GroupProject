import {useCallback, useEffect, useMemo, useState} from 'react'
import Taro, {getEnv, showToast, useDidShow} from '@tarojs/taro'
import {useTabBarPageClass} from '@/hooks/useTabBarPageClass'
import {getAllRecruitmentSeasons, getFeaturedStories, getQACategories, getQAItems} from '@/db/api'
import type {QAItem, RecruitmentSeason, VolunteerStory} from '@/db/types'
import StoryCard from '@/components/StoryCard'

export default function Volunteers() {
  useTabBarPageClass()
  const [seasons, setSeasons] = useState<RecruitmentSeason[]>([])
  const [selectedSeason, setSelectedSeason] = useState<RecruitmentSeason | null>(null)
  const [qaItems, setQaItems] = useState<QAItem[]>([])
  const [qaCategories, setQaCategories] = useState<string[]>([])
  const [selectedQaCategory, setSelectedQaCategory] = useState<string>('')
  const [expandedQa, setExpandedQa] = useState<string | null>(null)
  const [stories, setStories] = useState<VolunteerStory[]>([])

  const loadData = useCallback(async () => {
    const [seasonsData, qaData, categories, storiesData] = await Promise.all([
      getAllRecruitmentSeasons(),
      getQAItems(),
      getQACategories(),
      getFeaturedStories(4)
    ])

    setSeasons(seasonsData)
    if (seasonsData.length > 0) {
      const ongoing = seasonsData.find((s) => s.status === 'ongoing')
      setSelectedSeason(ongoing || seasonsData[0])
    }

    setQaItems(qaData)
    setQaCategories(['全部', ...categories])
    setStories(storiesData)
  }, [])

  useDidShow(() => {
    loadData()
  })

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredQaItems = useMemo(() => {
    if (!selectedQaCategory || selectedQaCategory === '全部') {
      return qaItems
    }
    return qaItems.filter((item) => item.category === selectedQaCategory)
  }, [qaItems, selectedQaCategory])

  const seasonMap = useMemo(
    () => ({
      spring: '春季',
      summer: '夏季',
      autumn: '秋季'
    }),
    []
  )

  const statusMap = useMemo(
    () => ({
      ongoing: '进行中',
      upcoming: '即将开始',
      ended: '已结束'
    }),
    []
  )

  const handleApply = () => {
    if (getEnv() === Taro.ENV_TYPE.WEAPP) {
      // TODO: 替换为实际的ABC总站小程序appId和路径
      Taro.navigateToMiniProgram({
        appId: 'wxAPP_ID_HERE',
        path: 'pages/volunteer-apply/index',
        fail: () => {
          showToast({title: '跳转失败，请稍后重试', icon: 'none'})
        }
      })
    } else {
      showToast({title: '请在微信小程序中使用此功能', icon: 'none'})
    }
  }

  const handleMyApplication = () => {
    if (getEnv() === Taro.ENV_TYPE.WEAPP) {
      // TODO: 替换为实际的ABC总站小程序appId和路径
      Taro.navigateToMiniProgram({
        appId: 'wxAPP_ID_HERE',
        path: 'pages/my-application/index',
        fail: () => {
          showToast({title: '跳转失败，请稍后重试', icon: 'none'})
        }
      })
    } else {
      showToast({title: '请在微信小程序中使用此功能', icon: 'none'})
    }
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-primary px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">加入我们</h1>
        <p className="text-xl text-white/90">用你的技能创造价值，收获成长与经验</p>
      </div>

      <div className="px-6 py-6">
        <h2 className="text-3xl font-bold text-foreground mb-4">项目季招募</h2>

        {seasons.length > 0 && (
          <>
            <div className="flex gap-3 mb-6 overflow-x-auto">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  type="button"
                  onClick={() => setSelectedSeason(season)}
                  className={`px-5 py-2 rounded-full text-xl whitespace-nowrap transition-all flex items-center justify-center leading-none break-keep ${
                    selectedSeason?.id === season.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                  {season.year}
                  {seasonMap[season.season]}
                </button>
              ))}
            </div>

            {selectedSeason && (
              <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    {selectedSeason.year}
                    {seasonMap[selectedSeason.season]}招募
                  </h3>
                  <span
                    className={`px-4 py-2 rounded-full text-xl font-medium ${
                      selectedSeason.status === 'ongoing'
                        ? 'bg-accent text-accent-foreground'
                        : selectedSeason.status === 'upcoming'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                    {statusMap[selectedSeason.status]}
                  </span>
                </div>

                <p className="text-xl text-foreground mb-4 leading-relaxed whitespace-pre-wrap">
                  {selectedSeason.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-xl font-bold text-foreground mb-2">职责要求</h4>
                  <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedSeason.requirements}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-bold text-foreground mb-2">你将收获</h4>
                  <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedSeason.benefits}
                  </p>
                </div>

                {selectedSeason.status === 'ongoing' ? (
                  <button
                    type="button"
                    onClick={handleApply}
                    className="w-full py-4 bg-accent text-accent-foreground text-2xl font-bold rounded-xl flex items-center justify-center leading-none">
                    立即报名
                  </button>
                ) : selectedSeason.status === 'upcoming' && selectedSeason.next_season_hint ? (
                  <div className="text-center py-4 bg-muted rounded-xl">
                    <p className="text-xl text-muted-foreground">{selectedSeason.next_season_hint}</p>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-muted rounded-xl">
                    <p className="text-xl text-muted-foreground">招募已结束，敬请期待下一季</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div
          onClick={handleMyApplication}
          className="bg-gradient-subtle rounded-2xl p-6 shadow-card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">我的申请</h3>
              <p className="text-xl text-muted-foreground">查看申请进度和详情</p>
            </div>
            <div className="i-mdi-chevron-right text-4xl text-muted-foreground" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-4">申请Q&A</h2>

        <div className="flex gap-3 mb-4 overflow-x-auto">
          {qaCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedQaCategory(cat)}
              className={`px-5 py-2 rounded-full text-xl whitespace-nowrap transition-all flex items-center justify-center leading-none break-keep ${
                selectedQaCategory === cat || (cat === '全部' && !selectedQaCategory)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {filteredQaItems.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div
                onClick={() => setExpandedQa(expandedQa === item.id ? null : item.id)}
                className="flex items-center justify-between p-5">
                <h3 className="text-xl font-medium text-foreground flex-1">{item.question}</h3>
                <div
                  className={`i-mdi-chevron-down text-3xl text-muted-foreground transition-transform ${
                    expandedQa === item.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {expandedQa === item.id && (
                <div className="px-5 pb-5">
                  <p className="text-xl text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-foreground">志愿者故事</h2>
          <button
            type="button"
            onClick={() => {
              // TODO: 跳转到志愿者故事列表页
              showToast({title: '功能开发中', icon: 'none'})
            }}
            className="text-xl text-primary flex items-center gap-1 leading-none">
            <span>查看更多</span>
            <div className="i-mdi-chevron-right text-2xl" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  )
}
