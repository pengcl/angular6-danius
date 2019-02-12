const av = navigator.appVersion; // window.navigator 对象包含有关访问者浏览器的信息。
const ua = navigator.userAgent;

export class UaService {

  constructor() {
  }

  getPlatform() {
    if ((ua.indexOf('iPhone') > -1 || ua.indexOf('iPod') > -1)) {
      return 'iPhone';
    }
    return 'Android';
  }

  getAv() {
    return av;
  }

  getUa() {
    return ua;
  }

  isWx(): boolean {// 检查是否微信
    return String(ua.toLowerCase().match(/MicroMessenger/i)) === 'micromessenger';
  }
}
