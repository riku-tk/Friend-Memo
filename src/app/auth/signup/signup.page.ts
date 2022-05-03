import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

type Form = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  loading = false;
  login: Form = {
    email: '',
    password: '',
  };

  constructor(public auth: AuthService) {}

  ngOnInit() {}

  signUp() {
    this.loading = true;
    this.auth.authSignUp(this.login).finally(() => {
      this.loading = false;
    });
  }
}
