import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

type Form = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  loading = false;
  login: Form = {
    email: '',
    password: '',
  };

  constructor(public auth: AuthService) {}

  ngOnInit() {}

  signIn() {
    this.loading = true;
    this.auth.authSignIn(this.login).finally(() => {
      this.loading = false;
    });
  }
}
