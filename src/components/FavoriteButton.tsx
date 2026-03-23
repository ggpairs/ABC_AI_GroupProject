import {useState} from 'react'
import Taro from '@tarojs/taro'
import {useAuth} from '@/contexts/AuthContext'
import {addFavorite, removeFavorite} from '@/db/api'

interface FavoriteButtonProps {
  itemType: 'case' | 'story'
  itemId: string
  initialFavorited?: boolean
  onToggle?: (favorited: boolean) => void
}

export default function FavoriteButton({
  itemType,
  itemId,
  initialFavorited = false,
  onToggle
}: FavoriteButtonProps) {
  const {user} = useAuth()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (e: any) => {
    e.stopPropagation()

    if (!user) {
      Taro.showToast({title: '请先登录', icon: 'none'})
      setTimeout(() => {
        Taro.navigateTo({url: '/pages/login/index'})
      }, 1000)
      return
    }

    setLoading(true)

    if (favorited) {
      const {success} = await removeFavorite(user.id, itemType, itemId)
      if (success) {
        setFavorited(false)
        Taro.showToast({title: '已取消收藏', icon: 'none'})
        onToggle?.(false)
      }
    } else {
      const {success} = await addFavorite(user.id, itemType, itemId)
      if (success) {
        setFavorited(true)
        Taro.showToast({title: '收藏成功', icon: 'success'})
        onToggle?.(true)
      }
    }

    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        favorited ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
      } disabled:opacity-50`}>
      <div className={`${favorited ? 'i-mdi-heart' : 'i-mdi-heart-outline'} text-3xl`} />
    </button>
  )
}
