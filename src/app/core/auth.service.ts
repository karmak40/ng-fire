import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router'
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage'

import 'rxjs/add/operator/switchMap';
//import { Observable } from '../../../node_modules/rxjs';
import { Observable } from 'rxjs/Rx';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null)
      }
    })
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => console.log('You have Successfully signed in'))
      .catch(error => console.log(error.message))
  }

  signOut() {
    return this.afAuth.auth.signOut()
    .then(() => {
      this.router.navigate(['/'])
    })
  }

}
