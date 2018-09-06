export const TAB_CONFIG = {
  show: true,
  items: [
    {
      pagePath: '/employee/find/job/list',
      iconPath: '/assets/images/icons/tabBar/job.png',
      selectedIconPath: '/assets/images/icons/tabBar/job_on.png',
      text: '职位',
      selected: false,
      badge: {
        badge: 0,
        dot: true
      }
    },
    {
      pagePath: '/employee/find/company/list',
      iconPath: '/assets/images/icons/tabBar/company.png',
      selectedIconPath: '/assets/images/icons/tabBar/company_on.png',
      text: '公司',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      pagePath: '/employee/message/list',
      iconPath: '/assets/images/icons/tabBar/message.png',
      selectedIconPath: '/assets/images/icons/tabBar/message_on.png',
      text: '消息',
      selected: false,
      badge: {
        badge: 10,
        dot: false
      }
    },
    {
      pagePath: '/employee/home',
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
