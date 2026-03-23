import {useCallback, useEffect, useMemo, useState} from 'react'
import Taro, {useDidShow} from '@tarojs/taro'
import {useTabBarPageClass} from '@/hooks/useTabBarPageClass'
import {getFeaturedCases, getCurrentRecruitmentSeason} from '@/db/api'
import type {Case, RecruitmentSeason} from '@/db/types'
import CaseCard from '@/components/CaseCard'

export default function Home() {
  useTabBarPageClass()
  const [featuredCases, setFeaturedCases] = useState<Case[]>([])
  const [currentSeason, setCurrentSeason] = useState<RecruitmentSeason | null>(null)
  const [expanded, setExpanded] = useState(false)

  const loadData = useCallback(async () => {
    const [cases, season] = await Promise.all([getFeaturedCases(3), getCurrentRecruitmentSeason()])
    setFeaturedCases(cases)
    setCurrentSeason(season)
  }, [])

  useDidShow(() => {
    loadData()
  })

  useEffect(() => {
    loadData()
  }, [loadData])

  const seasonText = useMemo(() => {
    if (!currentSeason) return null
    const seasonMap = {spring: '春季', summer: '夏季', autumn: '秋季'}
    return `${currentSeason.year}${seasonMap[currentSeason.season]}招募`
  }, [currentSeason])

  const statusText = useMemo(() => {
    if (!currentSeason) return null
    const statusMap = {
      ongoing: '进行中',
      upcoming: '即将开始',
      ended: '已结束'
    }
    return statusMap[currentSeason.status]
  }, [currentSeason])

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-hero px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">ABC数字创造营</h1>
        <p className="text-2xl text-white/90">用数字技术创造价值</p>
      </div>

      <div className="px-6 py-8">
        <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">关于我们</h2>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xl text-primary flex items-center justify-center leading-none">
              {expanded ? '收起' : '展开'}
            </button>
          </div>
          <div className={`text-xl text-muted-foreground leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
            ABC数字创造营分社是ABC总社旗下的地方分支机构，致力于通过数字技术赋能企业和组织的数字化转型。我们汇聚了一群充满热情的志愿者，包括大学生和职场人，共同为客户提供专业的数字化解决方案。
            <br />
            <br />
            我们的使命是让数字技术真正服务于社会，帮助更多企业和组织实现数字化转型，同时为志愿者提供实践和成长的平台。
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">精选案例</h2>
            <button
              type="button"
              onClick={() => Taro.switchTab({url: '/pages/cases/index'})}
              className="text-xl text-primary flex items-center gap-1 leading-none">
              <span>查看更多</span>
              <div className="i-mdi-chevron-right text-2xl" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {featuredCases.map((caseItem) => (
              <CaseCard key={caseItem.id} case={caseItem} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <button
            type="button"
            onClick={() => Taro.switchTab({url: '/pages/volunteers/index'})}
            className="w-full py-6 bg-gradient-primary text-white text-2xl font-bold rounded-2xl shadow-elegant flex items-center justify-center leading-none">
            成为志愿者
          </button>
          <button
            type="button"
            onClick={() => Taro.switchTab({url: '/pages/clients/index'})}
            className="w-full py-6 bg-gradient-secondary text-white text-2xl font-bold rounded-2xl shadow-elegant flex items-center justify-center leading-none">
            成为客户
          </button>
        </div>

        {currentSeason && (
          <div
            onClick={() => Taro.switchTab({url: '/pages/volunteers/index'})}
            className="bg-gradient-subtle rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-foreground">{seasonText}</h3>
              <span
                className={`px-4 py-2 rounded-full text-xl font-medium ${
                  currentSeason.status === 'ongoing'
                    ? 'bg-accent text-accent-foreground'
                    : currentSeason.status === 'upcoming'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}>
                {statusText}
              </span>
            </div>
            <p className="text-xl text-muted-foreground mb-4">{currentSeason.description}</p>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-xl">了解详情</span>
              <div className="i-mdi-arrow-right text-2xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
