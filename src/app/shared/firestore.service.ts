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
  deleteDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, concatMap } from 'rxjs/operators';
export interface IUser {
  email: string;
  // photoDataUrl: string;
}
export interface IProfile {
  id?: string;
  uid: string;
  name?: string;
  profilePhotoDataUrl?: string;
  // age?: string;
  profession: string;
  gender?: string;
  hobby?: string;
  favoriteFood?: string;
  birthMonthAndDay?: string;
  birthMonth?: string;
  birthDay?: string;
  birthPlace?: string;
  dislikes?: string;
  timeStamp: number;
}

export interface IMemo {
  id?: string;
  profileId?: string;
  text?: string;
}
export class ProfileObject implements IProfile {
  uid = '';
  name = '';
  profilePhotoDataUrl = '';
  // age = '';
  profession = '';
  gender = '';
  hobby = '';
  favoriteFood = '';
  birthMonthAndDay = '';
  birthMonth = '';
  birthDay = '';
  birthPlace = '';
  dislikes = '';
  timeStamp = Date.now();
}

export interface Imemolist extends IProfile, IMemo {}
export interface IProfileList extends IUser, IProfile {}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  userDoc: DocumentReference<IUser>;
  profileCollection: CollectionReference<IProfile>;
  userCollection: CollectionReference<IUser>;

  memoCollection: CollectionReference<IMemo>;
  profileTmp: IProfile;

  constructor(public af: Firestore) {
    this.profileCollection = collection(this.af, 'profile') as CollectionReference<IProfile>;
    this.memoCollection = collection(this.af, 'memo') as CollectionReference<IMemo>;
    this.userCollection = collection(this.af, 'users') as CollectionReference<IUser>;
  }

  userInit(uid: string): Promise<IUser> {
    this.userDoc = doc(this.af, `users/${uid}`) as DocumentReference<IUser>;
    return docData<IUser>(this.userDoc).pipe(first()).toPromise(Promise);
  }

  userSet(user: IUser): Promise<void> {
    return setDoc(this.userDoc, user);
  }

  getProfileDoc(id: string): DocumentReference<IProfile> {
    return doc(this.af, 'profile/' + id) as DocumentReference<IProfile>;
  }

  profileSet(id: string, profile: IProfile): Promise<void> {
    return setDoc(this.getProfileDoc(id), profile);
  }

  deleteProfile(id: string): Promise<void> {
    return deleteDoc(this.getProfileDoc(id));
  }

  profileAdd(profile: IProfile) {
    return addDoc(this.profileCollection, profile);
  }

  memoAdd(memo: IMemo) {
    return addDoc(this.memoCollection, memo);
  }

  memoInit(profileId: string): Observable<IMemo[]> {
    return collectionData(query(this.memoCollection, where('profileId', '==', profileId)), {
      idField: 'id',
    });
  }

  profileInit(uid: string): Observable<IProfile[]> {
    console.log(uid);
    console.log(collectionData(this.profileCollection));
    return collectionData(query(this.profileCollection, where('uid', '==', uid), orderBy('timeStamp', 'desc')), {
      idField: 'id',
    });
  }

  // profileInit(): Observable<IProfile[]> {
  //   return collectionData(query(this.profileCollection, orderBy('timeStamp', 'desc')), {
  //     idField: 'id',
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
