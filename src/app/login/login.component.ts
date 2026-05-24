import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../_services/login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent implements OnInit {

  titulo = 'Login';
  deviceInfo = null;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = true;
  isLoading = false;
  errorMessage = '';

  model: any ={};
  private returnUrl = '/dashboard';

  public get emProducao(): boolean {
    const res = environment.production;
    return res;
  }
  
  constructor(
      private authService: AuthService,
      private loginService: LoginService,
      private route: ActivatedRoute,
      public router: Router
     ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
 
    if ( this.authService.loggedIn()){
        this.router.navigateByUrl(this.returnUrl);
    }
    
  }
  login(): void {
    this.errorMessage = '';
    this.isLoading = true;
    sessionStorage.setItem('logando', 'S');

    this.loginService.getToken(null).subscribe({
    next: (response: any) => {
      if (!response?.token) {
        this.handleLoginError();
        return;
      }

      sessionStorage.setItem('token', response.token);

      this.loginService.loginFornecedor(this.model).subscribe({
        next: () => {
          this.isLoading = false;
          sessionStorage.setItem('logando', '');
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          console.error('Erro ao realizar login:', error);
          this.handleLoginError(error);
        }
      });
    },
    error: (error) => {
      console.error('Erro ao obter o token:', error);
      this.handleLoginError(error);
    }
  });
}

  private handleLoginError(error?: HttpErrorResponse): void {
    this.isLoading = false;
    sessionStorage.setItem('logando', '');

    if (error?.status === 0) {
      this.errorMessage = 'Nao foi possivel conectar ao servidor. Verifique a API e tente novamente.';
      return;
    }

    if (error?.status === 401 || error?.status === 403) {
      this.errorMessage = 'Usuario ou senha invalidos.';
      return;
    }

    this.errorMessage = 'Nao foi possivel realizar o login. Tente novamente.';
  }

}
