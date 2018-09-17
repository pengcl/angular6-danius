export const TAB_CONFIG = {
  show: true,
  items: [
    {
      pagePath: '/employer/find/list',
      iconPath: '/assets/images/icons/tabBar/company.png',
      selectedIconPath: '/assets/images/icons/tabBar/company_on.png',
      text: '招聘',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      pagePath: '/employer/message/list',
      iconPath: '/assets/images/icons/tabBar/message.png',
      selectedIconPath: '/assets/images/icons/tabBar/message_on.png',
      text: '消息',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      pagePath: '/employer/home',
      iconPath: '/assets/images/icons/tabBar/me.png',
      selectedIconPath: '/assets/images/icons/tabBar/me_on.png',
      text: '我的',
      selected: true,
      badge: {
        badge: 0,
        dot: false
      }
    }
  ]
};
