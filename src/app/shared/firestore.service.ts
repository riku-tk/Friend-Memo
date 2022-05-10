import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  DocumentReference,
  CollectionReference,
  Firestore,
  query,
  collectionData,
  orderBy,
  setDoc,
  addDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, concatMap } from 'rxjs/operators';

export interface IUser {
  email: string;
  // photoDataUrl: string;
}

export const profileColumn: Array<string> = ['name', 'age', 'gender', 'hobby', 'favoriteFood'];

export interface IProfile {
  uid: string;
  profileId: string;
  name?: string;
  profilePhotoDataUrl?: string;
  age?: string;
  gender?: string;
  hobby?: string;
  favoriteFood?: string;
  birthDay?: string;
  birthPlace?: string;
  dislikes?: string;
  timeStamp: number;
}
export class ProfileObject implements IProfile {
  uid = '';
  profileId = '';
  name = '';
  profilePhotoDataUrl = '';
  age = '';
  gender = '';
  hobby = '';
  favoriteFood = '';
  birthDay = '';
  birthPlace = '';
  dislikes = '';
  timeStamp = Date.now();
}

export interface IProfileList extends IUser, IProfile {}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  userDoc: DocumentReference<IUser>;
  profileCollection: CollectionReference<IProfile>;
  userCollection: CollectionReference<IUser>;
  profileTmp: IProfile;

  constructor(public af: Firestore) {
    this.profileCollection = collection(this.af, 'profile') as CollectionReference<IProfile>;
    this.userCollection = collection(this.af, 'users') as CollectionReference<IUser>;
  }

  userInit(uid: string): Promise<IUser> {
    this.userDoc = doc(this.af, `users/${uid}`) as DocumentReference<IUser>;
    return docData<IUser>(this.userDoc).pipe(first()).toPromise(Promise);
  }

  userSet(user: IUser): Promise<void> {
    return setDoc(this.userDoc, user);
  }

  profileAdd(profile: IProfile) {
    return addDoc(this.profileCollection, profile);
  }

  profileInit(): Observable<IProfileList[]> {
    return collectionData(query(this.profileCollection, orderBy('timeStamp', 'desc')), {
      idField: 'profileId',
    }).pipe(
      concatMap(async (profiles) => {
        const users = (await collectionData(this.userCollection, {
          idField: 'uid',
        })
          .pipe(first())
          .toPromise(Promise)) as (IUser & { uid: string })[];

        return profiles.map((profile) => {
          const user = users.find((u) => u.uid === profile.uid);
          return Object.assign(profile, user);
        });
      }),
    );
  }

  // getProfileData(profileId: string): Observable<IProfileList[]> {
  //   return collectionData(query(this.profileCollection, orderBy('timeStamp', 'desc')), {
  //     idField: 'profileId',
  //   }).pipe(
  //     concatMap(async (profiles) => {
  //       const users = (await collectionData(this.userCollection, {
  //         idField: 'uid',
  //       })
  //         .pipe(first())
  //         .toPromise(Promise)) as (IUser & { uid: string })[];

  //       return profiles.map((profile) => {
  //         const user = users.find((u) => u.uid === profile.uid);
  //         return Object.assign(profile, user);
  //       });
  //     }),
  //   );
  // }
}
