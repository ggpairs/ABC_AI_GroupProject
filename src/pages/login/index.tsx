import {useState} from 'react'
import Taro, {useLoad} from '@tarojs/taro'
import {useAuth} from '@/contexts/AuthContext'
import {STORAGE_KEY_REDIRECT_PATH} from '@/components/RouteGuard'

export default function Login() {
  const {signInWithUsername, signUpWithUsername, signInWithWechat} = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  useLoad(() => {
    console.log('登录页面加载')
  })

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Taro.showToast({title: '请输入用户名和密码', icon: 'none'})
      return
    }

    if (!agreed) {
      Taro.showToast({title: '请先同意用户协议和隐私政策', icon: 'none'})
      return
    }

    setLoading(true)

    const {error} = isLogin
      ? await signInWithUsername(username, password)
      : await signUpWithUsername(username, password)

    setLoading(false)

    if (error) {
      Taro.showToast({
        title: isLogin ? '登录失败' : '注册失败',
        icon: 'none'
      })
      return
    }

    Taro.showToast({
      title: isLogin ? '登录成功' : '注册成功',
      icon: 'success'
    })

    // 登录成功后跳转
    setTimeout(() => {
      const redirectPath = Taro.getStorageSync(STORAGE_KEY_REDIRECT_PATH)
      if (redirectPath) {
        Taro.removeStorageSync(STORAGE_KEY_REDIRECT_PATH)
        const tabBarPages = [
          '/pages/home/index',
          '/pages/cases/index',
          '/pages/volunteers/index',
          '/pages/clients/index',
          '/pages/profile/index'
        ]
        if (tabBarPages.some((path) => redirectPath.includes(path))) {
          Taro.switchTab({url: redirectPath})
        } else {
          Taro.navigateTo({url: redirectPath})
        }
      } else {
        Taro.switchTab({url: '/pages/home/index'})
      }
    }, 500)
  }

  const handleWechatLogin = async () => {
    if (!agreed) {
      Taro.showToast({title: '请先同意用户协议和隐私政策', icon: 'none'})
      return
    }

    setLoading(true)
    const {error} = await signInWithWechat()
    setLoading(false)

    if (error) {
      Taro.showToast({title: error.message, icon: 'none', duration: 2000})
      return
    }

    Taro.showToast({title: '登录成功', icon: 'success'})

    setTimeout(() => {
      const redirectPath = Taro.getStorageSync(STORAGE_KEY_REDIRECT_PATH)
      if (redirectPath) {
        Taro.removeStorageSync(STORAGE_KEY_REDIRECT_PATH)
        const tabBarPages = [
          '/pages/home/index',
          '/pages/cases/index',
          '/pages/volunteers/index',
          '/pages/clients/index',
          '/pages/profile/index'
        ]
        if (tabBarPages.some((path) => redirectPath.includes(path))) {
          Taro.switchTab({url: redirectPath})
        } else {
          Taro.navigateTo({url: redirectPath})
        }
      } else {
        Taro.switchTab({url: '/pages/home/index'})
      }
    }, 500)
  }

  const isWeApp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">ABC数字创造营</h1>
          <p className="text-2xl text-white/90">用数字技术创造价值</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-elegant">
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-2xl font-medium rounded-xl transition-all flex items-center justify-center leading-none ${
                isLogin ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
              登录
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-2xl font-medium rounded-xl transition-all flex items-center justify-center leading-none ${
                !isLogin ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
              注册
            </button>
          </div>

          <div className="flex flex-col gap-6 mb-6">
            <div className="border-2 border-input rounded-xl px-4 py-4 bg-background overflow-hidden">
              <input
                className="w-full text-2xl text-foreground bg-transparent outline-none"
                type="text"
                placeholder="用户名"
                value={username}
                onInput={(e) => {
                  const ev = e as any
                  setUsername(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>

            <div className="border-2 border-input rounded-xl px-4 py-4 bg-background overflow-hidden">
              <input
                className="w-full text-2xl text-foreground bg-transparent outline-none"
                type="password"
                placeholder="密码"
                value={password}
                onInput={(e) => {
                  const ev = e as any
                  setPassword(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6" onClick={() => setAgreed(!agreed)}>
            <div
              className={`w-6 h-6 rounded flex items-center justify-center border-2 ${
                agreed ? 'bg-primary border-primary' : 'bg-white border-border'
              }`}>
              {agreed && <div className="i-mdi-check text-2xl text-white" />}
            </div>
            <span className="text-xl text-muted-foreground">
              我已阅读并同意《用户协议》和《隐私政策》
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground text-2xl font-medium rounded-xl mb-4 flex items-center justify-center leading-none disabled:opacity-50">
            {loading ? '处理中...' : isLogin ? '登录' : '注册'}
          </button>

          {isWeApp && (
            <button
              type="button"
              onClick={handleWechatLogin}
              disabled={loading}
              className="w-full py-4 bg-secondary text-secondary-foreground text-2xl font-medium rounded-xl flex items-center justify-center leading-none gap-2 disabled:opacity-50">
              <div className="i-mdi-wechat text-3xl" />
              <span>微信快捷登录</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
