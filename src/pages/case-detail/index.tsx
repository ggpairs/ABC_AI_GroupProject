import {useCallback, useEffect, useState} from 'react'
import {getCurrentInstance, useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {Image} from '@tarojs/components'
import {checkIsFavorited, getCaseById, incrementCaseViewCount} from '@/db/api'
import type {Case} from '@/db/types'
import FavoriteButton from '@/components/FavoriteButton'
import {useAuth} from '@/contexts/AuthContext'

export default function CaseDetail() {
  const {user} = useAuth()
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(true)

  const caseId = getCurrentInstance().router?.params?.id || ''

  const loadData = useCallback(async () => {
    if (!caseId) return

    setLoading(true)
    const data = await getCaseById(caseId)
    setCaseData(data)

    if (data) {
      incrementCaseViewCount(caseId)
      if (user) {
        const isFavorited = await checkIsFavorited(user.id, 'case', caseId)
        setFavorited(isFavorited)
      }
    }
    setLoading(false)
  }, [caseId, user])

  useDidShow(() => {
    loadData()
  })

  useEffect(() => {
    loadData()
  }, [loadData])

  useShareAppMessage(() => ({
    title: caseData?.title || '案例详情',
    path: `/pages/case-detail/index?id=${caseId}`
  }))

  useShareTimeline(() => ({
    title: caseData?.title || '案例详情'
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="i-mdi-loading text-5xl text-primary animate-spin" />
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <div className="i-mdi-alert-circle-outline text-8xl text-muted-foreground mb-4" />
          <p className="text-2xl text-muted-foreground">案例不存在</p>
        </div>
      </div>
    )
  }

  const categoryMap = {
    ai_bot: 'AI Bot',
    ai_miniprogram: 'AI小程序',
    digital_transformation: '数字化转型',
    other: '其他'
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Image src={caseData.cover_image} mode="aspectFill" className="w-full h-64 bg-muted" />

      <div className="px-6 py-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-foreground flex-1">{caseData.title}</h1>
          <FavoriteButton
            itemType="case"
            itemId={caseData.id}
            initialFavorited={favorited}
            onToggle={setFavorited}
          />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl text-muted-foreground">{caseData.client_type}</span>
          <span className="text-xl text-muted-foreground">·</span>
          <span className="text-xl text-primary">{categoryMap[caseData.category]}</span>
          {caseData.duration && (
            <>
              <span className="text-xl text-muted-foreground">·</span>
              <span className="text-xl text-muted-foreground">{caseData.duration}</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {caseData.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground text-lg rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-3">项目简介</h2>
          <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">{caseData.summary}</p>
        </div>

        {caseData.background && (
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-3">项目背景</h2>
            <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">{caseData.background}</p>
          </div>
        )}

        {caseData.challenges && (
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-3">挑战</h2>
            <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">{caseData.challenges}</p>
          </div>
        )}

        {caseData.solutions && (
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-3">解决方案</h2>
            <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">{caseData.solutions}</p>
          </div>
        )}

        {caseData.results && (
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-3">成果数据</h2>
            <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">{caseData.results}</p>
          </div>
        )}

        {caseData.volunteers && (
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h2 className="text-2xl font-bold text-foreground mb-3">参与志愿者</h2>
            <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap">{caseData.volunteers}</p>
          </div>
        )}
      </div>
    </div>
  )
}
