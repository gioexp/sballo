import * as firebase from 'firebase';
import { firebaseConfig } from '../firebaseConfig';

import { setTables } from '../components/HallPage/HallPageAction';

export const initFirebaseRedux = (dispatch) => {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    const rootRef = firebase.database().ref();
    rootRef.child('tables').on('value', snap => {
        dispatch(setTables(snap.val()));
    });
}

export const insertFirebase = (child, data) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child(child);
    let id = childRef.push().key;
    let newTable = {};
    newTable[id] = data;
    childRef.update(newTable);
}