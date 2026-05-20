import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

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

  model: any ={};
  private returnUrl = '/dashboard';

  public get emProducao(): boolean {
    const res = environment.production;
    return res;
     }

  
  constructor(
      private authService: AuthService,
      private route: ActivatedRoute,
      public router: Router
     ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
 
    if ( this.authService.loggedIn()){
        this.router.navigateByUrl(this.returnUrl);
    }
  }
  logout(){
    this.authService.logout();
  }
  
  login(){
    this.authService.login(this.model)
      .subscribe(
        () =>{
          if (this.authService.loggedIn()) {
            this.router.navigateByUrl(this.returnUrl);
          }
        }
      );
  }

}
