import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlmaceneroGuard implements CanActivate {
  constructor(private userService: AuthService,
              private router: Router) { }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.userService.isAutenticado){
      let rol = this.userService.rolUser.toLowerCase();
      if (rol === 'administrador' || rol === 'almacenero') {
        return true;
      } else {
        this.router.navigate(['/','not-allowed']);
        return false;
      }
    } else {
      this.router.navigate(['/','login']);
      return false;
    }
  }
  
}
