import * as firebase from 'firebase';
import { firebaseConfig } from '../firebaseConfig';

import { setTables } from '../components/HallPage/HallPageAction';

export const initFirebaseRedux = (dispatch) => {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    const rootRef = firebase.database().ref();
    rootRef.child('tables').on('value', snap => {
        let newVal = snap.val();
        if (newVal) dispatch(setTables(newVal));
        else dispatch(setTables({}));
    });
}

export const insertFirebase = (child, data) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child(child);
    let id = childRef.push().key;
    let newTable = {};
    newTable[id] = data;
    return childRef.update(newTable);
}

export const updateTableParticipantsFirebase = (id, userId, players) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id + '/participants');
    return childRef.transaction(function update(participants) {
        if (participants) {
            if(participants.length < players) participants.push(userId);
            else return;  // abort transaction
        }
        return participants;
    });
}