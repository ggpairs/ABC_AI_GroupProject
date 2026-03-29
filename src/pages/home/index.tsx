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
    <div className="min-h-screen bg-gray-50">
      {/* 深蓝渐变Banner */}
      <div className="bg-gradient-to-r from-slate-700 to-blue-600 px-6 py-14 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-sm">ABC数字创造营</h1>
        <p className="text-xl text-white/95 opacity-95">用数字技术创造价值 · 赋能企业数字化转型</p >
      </div>

      <div className="px-5 py-8">
        {/* 关于我们卡片 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800">关于我们</h2>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-lg text-blue-600 font-medium">
              {expanded ? '收起' : '展开'}
            </button>
          </div>
          <div className={`text-lg text-gray-600 leading-loose ${expanded ? '' : 'line-clamp-3'}`}>
            ABC数字创造营分社是ABC总社旗下优质地方分支机构，聚焦数字技术赋能企业与组织数字化转型升级。
            我们汇聚大学生、职场志愿者等多元力量，为合作方提供专业、高效的定制化数字化解决方案。
            <br /><br />
            我们坚守初心，让数字技术落地民生与产业，助力更多伙伴实现数字化成长；同时搭建优质实践平台，
            让每一位志愿者收获能力提升与价值成长。
          </div>
        </div>

        {/* 精选案例 */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800">精选案例</h2>
            <button
              type="button"
              onClick={() => Taro.switchTab({url: '/pages/cases/index'})}
              className="text-base text-blue-600 flex items-center gap-1 font-medium">
              <span>查看更多</span>
              <div className="i-mdi-chevron-right" />
            </button>
          </div>
          <div className="flex flex-col gap-5">
            {featuredCases.map((caseItem) => (
              <CaseCard key={caseItem.id} case={caseItem} />
            ))}
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex flex-col gap-5 mb-10">
          <button
            type="button"
            onClick={() => Taro.switchTab({url: '/pages/volunteers/index'})}
            className="w-full py-5 bg-slate-700 text-white text-xl font-bold rounded-2xl shadow-sm">
            成为志愿者
          </button>
          <button
            type="button"
            onClick={() => Taro.switchTab({url: '/pages/clients/index'})}
            className="w-full py-5 bg-blue-600 text-white text-xl font-bold rounded-2xl shadow-sm">
            成为客户
          </button>
        </div>

        {/* 招募季卡片 */}
        {currentSeason && (
          <div
            onClick={() => Taro.switchTab({url: '/pages/volunteers/index'})}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">{seasonText}</h3>
              <span
                className={`px-4 py-2 rounded-full text-base font-medium ${
                  currentSeason.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-600'
                    : currentSeason.status === 'upcoming'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-gray-100 text-gray-500'
                }`}>
                {statusText}
              </span>
            </div>
            <p className="text-lg text-gray-600 mb-4">{currentSeason.description}</p >
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <span className="text-lg">了解详情</span>
              <div className="i-mdi-arrow-right" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}