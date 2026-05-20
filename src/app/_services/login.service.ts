import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  protected get url(): string {return `${environment.BASE_URL}`; }
  protected get api(): string {return `${environment.API}`; }
  protected get routerGetToken(): any {return `${environment.ROUTERS.GET_TOKEN}`; }

  constructor( private http: HttpClient ){  }

  getToken(model: any){
    if (!model){
      model = {
        "user": environment.LOGIN.USER,
        "password": environment.LOGIN.PASSWORD}        
    }
    return this.http
      .post(`${this.url}${this.api}${this.routerGetToken}`, model);
  };

}
