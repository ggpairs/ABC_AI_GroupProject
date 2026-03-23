import type {Case} from '@/db/types'
import {Image} from '@tarojs/components'
import Taro from '@tarojs/taro'

interface CaseCardProps {
  case: Case
  onClick?: () => void
}

export default function CaseCard({case: caseItem, onClick}: CaseCardProps) {
  const categoryMap = {
    ai_bot: 'AI Bot',
    ai_miniprogram: 'AI小程序',
    digital_transformation: '数字化转型',
    other: '其他'
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({url: `/pages/case-detail/index?id=${caseItem.id}`})
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-card rounded-2xl overflow-hidden shadow-card transition-all active:scale-98">
      <Image
        src={caseItem.cover_image}
        mode="aspectFill"
        className="w-full h-48 bg-muted"
      />
      <div className="p-5">
        <h3 className="text-2xl font-bold text-foreground mb-2 break-keep">{caseItem.title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl text-muted-foreground">{caseItem.client_type}</span>
          <span className="text-xl text-muted-foreground">·</span>
          <span className="text-xl text-primary">{categoryMap[caseItem.category]}</span>
        </div>
        <p className="text-xl text-muted-foreground line-clamp-2 mb-4">{caseItem.summary}</p>
        <div className="flex flex-wrap gap-2">
          {caseItem.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-muted text-muted-foreground text-lg rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
