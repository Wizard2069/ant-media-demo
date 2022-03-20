import {Injectable} from '@angular/core';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {ActivatedRouteSnapshot, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard extends KeycloakAuthGuard implements CanActivateChild, CanLoad {
    
    constructor(
        protected router: Router,
        protected keycloak: KeycloakService
    ) {
        super(router, keycloak);
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(childRoute, state);
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const authenticated = this.keycloak.isLoggedIn();
        authenticated.then(async (isAuth) => {
            if (!isAuth) {
                await this.keycloak.login({
                    redirectUri: window.location.origin + '/' + segments.map(s => s.path).join('/')
                });
            } 
        });
        
        return authenticated;
    }
    
    isAccessAllowed(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        console.log(this.roles);
        const requiredRoles = route.data.roles;
        
        if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
            return Promise.resolve(true);
        }
        
        return Promise.resolve(requiredRoles.every(role => this.roles.includes(role)));
    }
    
}
