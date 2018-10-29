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
import {CONFIG} from '../../../config/app.config';
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

    // const uid = route.queryParams['uid'];
    const openid = route.queryParams['openid'];
    const queryParams = {
      openid: openid ? openid : ''
    };
    /*if (uid) {
      this.authSvc.updateLoginStatus(uid);
    }*/

    const url: string = state.url;
    return this.checkLogin(url, queryParams);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {

    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string, queryParams?): boolean {

    if (this.authSvc.isLogged) {
      return true;
    }

    this.authSvc.loginRedirectUrl = url;
    this.router.navigate(['/auth/signIn'], {queryParams: queryParams});

    return false;
  }
}
