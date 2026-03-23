import type {VolunteerStory} from '@/db/types'
import {Image} from '@tarojs/components'
import Taro from '@tarojs/taro'

interface StoryCardProps {
  story: VolunteerStory
  onClick?: () => void
}

export default function StoryCard({story, onClick}: StoryCardProps) {
  const seasonMap = {
    spring: '春季',
    summer: '夏季',
    autumn: '秋季'
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({url: `/pages/story-detail/index?id=${story.id}`})
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-card rounded-2xl p-5 shadow-card transition-all active:scale-98">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={story.avatar_url}
          mode="aspectFill"
          className="w-16 h-16 rounded-full bg-muted"
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-foreground mb-1">{story.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg text-muted-foreground">{story.position}</span>
            <span className="text-lg text-muted-foreground">·</span>
            <span className="text-lg text-primary">{seasonMap[story.season]}</span>
          </div>
        </div>
      </div>
      <p className="text-xl text-muted-foreground italic line-clamp-2">"{story.quote}"</p>
    </div>
  )
}
