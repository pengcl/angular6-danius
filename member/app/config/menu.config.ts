export const MENU_CONFIG = {
  show: false,
  items: [
    {
      pagePath: '/index',
      iconPath: 'icon-add',
      selectedIconPath: 'icon-add',
      text: '会员<br>充值',
      selected: false,
      badge: {
        badge: 0,
        dot: true
      }
    },
    {
      pagePath: '/front/list',
      iconPath: 'icon-search',
      selectedIconPath: 'icon-search',
      text: '订单<br>查询',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      pagePath: '/front/new',
      iconPath: 'icon-category',
      selectedIconPath: 'icon-category',
      text: '价格<br>查询',
      selected: false,
      badge: {
        badge: 10,
        dot: false
      }
    },
    {
      pagePath: '/admin/cart',
      iconPath: 'icon-users',
      selectedIconPath: 'icon-users',
      text: '分销<br>管理',
      selected: true,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      pagePath: '/admin/cart',
      iconPath: 'icon-graph-line',
      selectedIconPath: 'icon-graph-line',
      text: '充值<br>记录',
      selected: true,
      badge: {
        badge: 0,
        dot: false
      }
    }
  ]
};
