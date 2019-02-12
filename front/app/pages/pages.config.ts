export const TAB_CONFIG = {
  show: true,
  items: [
    {
      type: 'icon',
      pagePath: '/index',
      iconPath: 'icons-home',
      selectedIconPath: 'icons-home_fill',
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
      selectedIconPath: 'icons-list_fill',
      text: '分类',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      type: 'icon',
      pagePath: '/admin/cart/list',
      iconPath: 'icons-cart',
      selectedIconPath: 'icons-cart_fill',
      text: '购物车',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    },
    {
      type: 'icon',
      pagePath: '/admin/order/list',
      iconPath: 'icons-person',
      selectedIconPath: 'icons-person_fill',
      text: '订单',
      selected: false,
      badge: {
        badge: 0,
        dot: false
      }
    }
  ]
};
