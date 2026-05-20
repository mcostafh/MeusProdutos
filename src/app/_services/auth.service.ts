import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  jwtHelpter = new JwtHelperService();
  decodedToken: any;
  roleName: any;
  perfil: any;
  empresaId: any;
  marcaEmpresarial: any;
  plano: any;
  dataDoProximoVencimento: any;
  controlaGradeNosProdutos: any;
  controlaCorNosProdutos: any;
 

  protected get url(): string {return `${environment.BASE_URL}${environment.API}`; }

  constructor( 
    private http: HttpClient ){  }

  validarUsuarioESenha( model: any){
      return this.http.post(`${this.url}/user/ValidarUsuarioESenha`, model);
  }


  login(model: any){
    return this.http
      .post(`${this.url}/login`, model).pipe(
          map((response: any) => {
            if (response?.token){
              this.decodedToken = this.jwtHelpter.decodeToken( response.token);
              this.empresaId = response.user.empresaId;
              this.marcaEmpresarial = response.user.empresa.marcaEmpresarial;
              (response.user.empresa.numero ? response.user.empresa.numero + ', ' : '')  + 
              (response.user.empresa.bairro ? response.user.empresa.bairro + ', ' : '')  + 
              (response.user.empresa.cidade ? response.user.empresa.cidade + ' - ' : '')  + 
              (response.user.empresa.uf ? response.user.empresa.uf : '');
              this.plano = response.user.empresa.planoDePagamento;

              this.roleName = response.user.role.name;
              this.dataDoProximoVencimento = response.user.empresa.proximoVencimento;
              this.controlaGradeNosProdutos = response.user.empresa.controlaGradeNosProdutos;
              this.controlaCorNosProdutos = response.user.empresa.controlaCorNosProdutos;


              sessionStorage.setItem('token', response.token);
              sessionStorage.setItem('roleName', this.roleName);

              sessionStorage.setItem('empresaId', this.empresaId);
              sessionStorage.setItem('marcaEmpresarial', this.marcaEmpresarial);

              sessionStorage.setItem('plano', this.plano);
              sessionStorage.setItem('dataDoProximoVencimento', this.dataDoProximoVencimento);
              sessionStorage.setItem('controlaGradeNosProdutos', this.controlaGradeNosProdutos);
              sessionStorage.setItem('controlaCorNosProdutos', this.controlaCorNosProdutos);



            }

            return response;
          })
      )

  }

  register(model: any){
    return this.http.post(`${this.url}/user/register`, model);
  }

  cancel(model: any){
    return this.http.put(`${this.url}/user/cancel`, model);
  }

  changePassword(model: any, newPassWord: string){
    return this.http.put(`${this.url}/user/changePassword/${newPassWord}`, model);
  }

  loggedIn(){
    const token = sessionStorage.getItem('token');

    if (!token || this.jwtHelpter.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    
    this.empresaId = sessionStorage.getItem('empresaId');
    this.marcaEmpresarial = sessionStorage.getItem('marcaEmpresarial');
    
    this.plano = sessionStorage.getItem('plano');
    this.dataDoProximoVencimento = sessionStorage.getItem('dataDoProximoVencimento');
    this.controlaGradeNosProdutos = sessionStorage.getItem('controlaGradeNosProdutos');
    this.controlaCorNosProdutos = sessionStorage.getItem('controlaCorNosProdutos');
    
    
    return true;
  }

  logout(){
    sessionStorage.clear();
    this.decodedToken = null;
    this.roleName = null;
    this.perfil = null;
    this.empresaId = null;
    this.marcaEmpresarial = null;
    this.plano = null;
    this.dataDoProximoVencimento = null;
    this.controlaGradeNosProdutos = null;
    this.controlaCorNosProdutos = null;
  }


}
