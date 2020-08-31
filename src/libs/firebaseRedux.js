import * as firebase from 'firebase';
import { firebaseConfig } from '../firebaseConfig';

import { setSpeed } from '../components/HallPage/HallPageAction';

export const initFirebaseRedux = (dispatch) => {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    const rootRef = firebase.database().ref();
    rootRef.child('speed').on('value', snap => {
        dispatch(setSpeed(snap.val()));
    });
}