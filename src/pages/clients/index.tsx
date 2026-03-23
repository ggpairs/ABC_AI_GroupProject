import {useCallback, useEffect, useState} from 'react'
import Taro, {getEnv, showToast, useDidShow} from '@tarojs/taro'
import {useTabBarPageClass} from '@/hooks/useTabBarPageClass'
import {getFeaturedCases, getServiceModules} from '@/db/api'
import type {Case, ServiceModule} from '@/db/types'
import CaseCard from '@/components/CaseCard'

export default function Clients() {
  useTabBarPageClass()
  const [serviceModules, setServiceModules] = useState<ServiceModule[]>([])
  const [featuredCases, setFeaturedCases] = useState<Case[]>([])

  const loadData = useCallback(async () => {
    const [modules, cases] = await Promise.all([getServiceModules(), getFeaturedCases(3)])
    setServiceModules(modules)
    setFeaturedCases(cases)
  }, [])

  useDidShow(() => {
    loadData()
  })

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleApply = () => {
    if (getEnv() === Taro.ENV_TYPE.WEAPP) {
      // TODO: 替换为实际的ABC总站小程序appId和路径
      Taro.navigateToMiniProgram({
        appId: 'wxAPP_ID_HERE',
        path: 'pages/client-apply/index',
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
      <div className="bg-gradient-secondary px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">成为客户</h1>
        <p className="text-xl text-white/90">让数字技术为您的业务赋能</p>
      </div>

      <div className="px-6 py-6">
        <h2 className="text-3xl font-bold text-foreground mb-4">我们的服务</h2>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {serviceModules.map((module) => (
            <div key={module.id} className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className={`${module.icon} text-5xl text-primary flex-shrink-0`} />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{module.title}</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">{module.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-4">合作流程</h2>

        <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">需求沟通</h3>
                <p className="text-xl text-muted-foreground">
                  提交申请后，我们的团队会在1-2个工作日内与您联系，深入了解您的需求和期望
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">方案匹配</h3>
                <p className="text-xl text-muted-foreground">
                  根据您的需求，我们会为您匹配最合适的项目团队和解决方案
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">项目执行</h3>
                <p className="text-xl text-muted-foreground">
                  专业的志愿者团队将与您紧密合作，确保项目按时高质量交付
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">成果交付</h3>
                <p className="text-xl text-muted-foreground">
                  项目完成后，我们会提供完整的交付文档和后续支持服务
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-4">成功案例</h2>

        <div className="flex flex-col gap-4 mb-8">
          {featuredCases.map((caseItem) => (
            <CaseCard key={caseItem.id} case={caseItem} />
          ))}
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="w-full py-6 bg-accent text-accent-foreground text-2xl font-bold rounded-2xl shadow-elegant flex items-center justify-center leading-none">
          立即申请
        </button>
      </div>
    </div>
  )
}
