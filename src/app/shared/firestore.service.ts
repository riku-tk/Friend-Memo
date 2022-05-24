import { Injectable } from '@angular/core';
import {
  collection,
  doc,
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
  name: string;
  profilePhotoDataUrl?: string;
  profession: string;
  gender: string;
  hobby: string;
  favoriteFood: string;
  birthMonth: string;
  birthDay: string;
  birthPlace: string;
  dislikes: string;
  pinningFlg: boolean;
  relationship: string;
  timeStamp: number;
}
export interface IMemo {
  id?: string;
  profileId?: string;
  text?: string;
  timeStamp?: number;
  pinningFlg?: boolean;
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

  getMemoDoc(id: string): DocumentReference<IMemo> {
    return doc(this.af, 'memo/' + id) as DocumentReference<IMemo>;
  }

  memoSet(id: string, memo: IMemo): Promise<void> {
    return setDoc(this.getMemoDoc(id), memo);
  }

  deleteMemo(id: string): Promise<void> {
    return deleteDoc(this.getMemoDoc(id));
  }

  memoAdd(memo: IMemo) {
    return addDoc(this.memoCollection, memo);
  }

  memoInit(profileId: string): Observable<IMemo[]> {
    return collectionData(
      query(
        this.memoCollection,
        where('profileId', '==', profileId),
        orderBy('pinningFlg', 'desc'),
        orderBy('timeStamp', 'desc'),
      ),
      {
        idField: 'id',
      },
    );
  }

  profileInit(uid: string): Observable<IProfile[]> {
    return collectionData(
      query(
        this.profileCollection,
        where('uid', '==', uid),
        orderBy('pinningFlg', 'desc'),
        orderBy('timeStamp', 'desc'),
      ),
      {
        idField: 'id',
      },
    );
  }

  profileInitOrderByBirthDay(uid: string): Observable<IProfile[]> {
    return collectionData(
      query(
        this.profileCollection,
        where('uid', '==', uid),
        orderBy('pinningFlg', 'desc'),
        orderBy('timeStamp', 'desc'),
        orderBy('birthMonth', 'asc'),
        orderBy('birthDay', 'asc'),
      ),
      {
        idField: 'id',
      },
    );
  }
}
