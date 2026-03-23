import {useCallback, useEffect, useMemo, useState} from 'react'
import {useDidShow} from '@tarojs/taro'
import {useTabBarPageClass} from '@/hooks/useTabBarPageClass'
import {getCases} from '@/db/api'
import type {Case, CaseCategory} from '@/db/types'
import CaseCard from '@/components/CaseCard'
import EmptyState from '@/components/EmptyState'

export default function Cases() {
  useTabBarPageClass()
  const [cases, setCases] = useState<Case[]>([])
  const [category, setCategory] = useState<CaseCategory | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const categories = useMemo(
    () => [
      {value: undefined, label: '全部'},
      {value: 'ai_bot' as CaseCategory, label: 'AI Bot'},
      {value: 'ai_miniprogram' as CaseCategory, label: 'AI小程序'},
      {value: 'digital_transformation' as CaseCategory, label: '数字化转型'},
      {value: 'other' as CaseCategory, label: '其他'}
    ],
    []
  )

  const loadCases = useCallback(async () => {
    setLoading(true)
    const {cases: data} = await getCases(category, 1, 50)
    setCases(data)
    setLoading(false)
  }, [category])

  useDidShow(() => {
    loadCases()
  })

  useEffect(() => {
    loadCases()
  }, [loadCases])

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`px-5 py-2 rounded-full text-xl whitespace-nowrap transition-all flex items-center justify-center leading-none break-keep ${
                category === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="i-mdi-loading text-5xl text-primary animate-spin" />
          </div>
        ) : cases.length === 0 ? (
          <EmptyState icon="i-mdi-folder-open-outline" title="暂无案例" description="该分类下暂无案例" />
        ) : (
          <div className="flex flex-col gap-4">
            {cases.map((caseItem) => (
              <CaseCard key={caseItem.id} case={caseItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
