import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import { firebaseError } from './firebase.error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: Auth,
    public navController: NavController,
    public alertController: AlertController
  ) {}

  async getUserId(): Promise<string> {
    return (await this.afAuth.currentUser).uid;
  }

  authSignUp(login: { email: string; password: string }) {
    return createUserWithEmailAndPassword(
      this.afAuth,
      login.email,
      login.password
    ).then(() => {
      this.navController.navigateForward('/').catch((error) => {
        console.log(error.message);
        this.alertError(error);
        throw error;
      });
    });
  }

  authSignIn(login: { email: string; password: string }) {
    return signInWithEmailAndPassword(
      this.afAuth,
      login.email,
      login.password
    ).then(() => {
      this.navController.navigateForward('/').catch((error) => {
        console.log(error.message);
        this.alertError(error);
        throw error;
      });
    });
  }

  authSignOut() {
    return signOut(this.afAuth).then(() => {
      this.navController.navigateForward('/auth/signin').catch((error) => {
        console.log(error.message);
        this.alertError(error);
        throw error;
      });
    });
  }

  async alertError(e) {
    if (firebaseError.hasOwnProperty(e.code)) {
      e = firebaseError[e.code];
    }

    const alert = await this.alertController.create({
      header: e.code,
      message: e.message,
      buttons: ['閉じる'],
    });
    await alert.present();
  }
}
