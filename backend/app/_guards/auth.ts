// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================
import {Injectable} from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad,
  Route, ActivatedRoute
} from '@angular/router';
import {CONFIG} from '../app.config';
import {UaService} from '../../../service/ua.service';
import {AuthService} from '../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private uaSvc: UaService,
              private authSvc: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const uid = route.queryParams['uid'];
    if (uid) {
      this.authSvc.updateLoginStatus(uid);
    }
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {

    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {

    if (this.authSvc.isLogged) {
      return true;
    }

    this.authSvc.loginRedirectUrl = url;

    if (this.uaSvc.isWx) {
      window.location.href = CONFIG.prefix.api + '/wx/auth?callbackUrl=' + encodeURI(CONFIG.webHost + url);
    } else {
      this.router.navigate(['/auth/signIn']);
    }

    return false;
  }
}
