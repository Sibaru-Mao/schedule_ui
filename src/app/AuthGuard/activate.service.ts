import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivateService implements CanActivate {

  permission
  constructor() {

  }
  // public CanActivate() {
  //   return window.confirm("是否进入")
  //   // return alert(11111111)
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.permission = JSON.parse(sessionStorage.getItem('permission'))
    if (this.permission == 4) {
      return true
    }else{
      alert("无管理员权限")
    }
  }
}
