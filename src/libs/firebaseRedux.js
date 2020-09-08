import * as firebase from 'firebase';
import { firebaseConfig } from '../firebaseConfig';
import { setTables } from '../components/HallPage/HallPageAction';
import { setUserLoggedIn, setUserDetails } from '../components/LoginDialog/LoginDialogAction';

export const initFirebaseRedux = (dispatch) => {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    const rootRef = firebase.database().ref();
    rootRef.child('tables').on('value', snap => {
        let newVal = snap.val();
        if (newVal) dispatch(setTables(newVal));
        else dispatch(setTables({}));
    });

    rootRef.child('userDetails').on('value', snap => {
        let newVal = snap.val();
        if (newVal) dispatch(setUserDetails(newVal));
        else dispatch(setUserDetails({}));
        console.log(newVal)
    });

    firebase.auth().onAuthStateChanged(function (user) {
        dispatch(setUserLoggedIn(user));
    });
}

export const insertFirebase = (child, data) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child(child);
    let id = childRef.push().key;
    let newObject = {};
    newObject[id] = data;
    return childRef.update(newObject);
}

export const updateTableParticipantsFirebase = (id, userUid, players) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id + '/participants');
    return childRef.transaction(function update(participants) {
        if (participants) {
            if (participants.length < players) participants.push(userUid);
            else return;  // abort transaction
        }
        return participants;
    });
}

export const createUser = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export const updateUserProfile = (user, displayName, photo) => {
    if (user) return user.updateProfile({ displayName: displayName, photoURL: photo });
    else return new Promise.reject("invalid user");
}

export const sendEmailVerification = (user) => {
    if (user) return user.sendEmailVerification();
    else return new Promise.reject("invalid user");
}

export const logout = () => {
    return firebase.auth().signOut();
}

export const login = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

export const sendPasswordResetEmail = (email) => {
    return firebase.auth().sendPasswordResetEmail(email);
}

export const updateUserEmail = (user, email) => {
    if (user) return user.updateEmail(email);
    else return new Promise.reject("invalid user");
}

export const uploadUserImage = (user, image) => {
    if (user) return firebase.storage().ref("sballo/" + user.uid + "/avatar.png").putString(image, 'data_url');
    else return new Promise.reject("invalid user");
}