export const TAB_CONFIG = {
  show: true,
  items: [
    {
      type: 'icon',
      pagePath: '/index',
      iconPath: 'icons-home',
      selectedIconPath: '/assets/images/icons/tabBar/job_on.png',
      text: '首页',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      type: 'icon',
      pagePath: '/front/types',
      iconPath: 'icons-list',
      selectedIconPath: '/assets/images/icons/tabBar/company_on.png',
      text: '分类',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      type: 'icon',
      pagePath: '/admin/order/list',
      iconPath: 'icons-goods_hot',
      selectedIconPath: '/assets/images/icons/tabBar/message_on.png',
      text: '订单',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    }
  ]
};
