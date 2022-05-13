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
export interface IProfile {
  id?: string;
  uid: string;
  name?: string;
  profilePhotoDataUrl?: string;
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
  timeStamp?: number;
}
export class ProfileObject implements IProfile {
  uid = '';
  name = '';
  profilePhotoDataUrl = '';
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

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  profileCollection: CollectionReference<IProfile>;
  memoCollection: CollectionReference<IMemo>;

  constructor(public af: Firestore) {
    this.profileCollection = collection(this.af, 'profile') as CollectionReference<IProfile>;
    this.memoCollection = collection(this.af, 'memo') as CollectionReference<IMemo>;
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
    return collectionData(
      query(this.memoCollection, where('profileId', '==', profileId), orderBy('timeStamp', 'desc')),
      {
        idField: 'id',
      },
    );
  }

  profileInit(uid: string): Observable<IProfile[]> {
    console.log(uid);
    console.log(collectionData(this.profileCollection));
    return collectionData(query(this.profileCollection, where('uid', '==', uid), orderBy('timeStamp', 'desc')), {
      idField: 'id',
    });
  }
}
