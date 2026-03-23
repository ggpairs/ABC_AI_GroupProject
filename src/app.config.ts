const pages = [
  'pages/home/index',
  'pages/cases/index',
  'pages/volunteers/index',
  'pages/clients/index',
  'pages/profile/index',
  'pages/login/index',
  'pages/case-detail/index',
  'pages/story-detail/index'
]

//  To fully leverage TypeScript's type safety and ensure its correctness, always enclose the configuration object within the global defineAppConfig helper function.
export default defineAppConfig({
  pages,
  tabBar: {
    color: '#6B7280',
    selectedColor: '#1E5EBF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/icons/home_unselected.png',
        selectedIconPath: './assets/icons/home_selected.png'
      },
      {
        pagePath: 'pages/cases/index',
        text: '案例',
        iconPath: './assets/icons/cases_unselected.png',
        selectedIconPath: './assets/icons/cases_selected.png'
      },
      {
        pagePath: 'pages/volunteers/index',
        text: '志愿者',
        iconPath: './assets/icons/volunteers_unselected.png',
        selectedIconPath: './assets/icons/volunteers_selected.png'
      },
      {
        pagePath: 'pages/clients/index',
        text: '成为客户',
        iconPath: './assets/icons/clients_unselected.png',
        selectedIconPath: './assets/icons/clients_selected.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/icons/profile_unselected.png',
        selectedIconPath: './assets/icons/profile_selected.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'ABC数字创造营',
    navigationBarTextStyle: 'black'
  }
})
