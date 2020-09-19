import * as firebase from 'firebase';
import { firebaseConfig } from '../firebaseConfig';
import { setTables } from '../components/HallPage/HallPageAction';
import { setUserLoggedIn, setUserDetails } from '../components/LoginDialog/LoginDialogAction';
import { determinateSubTurnWinnerIndex } from './gameLogic';

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

export const deleteFirebase = (child, id) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child(child + '/' + id);
    return childRef.remove();
}

export const insertTableParticipantsFirebase = (id, userUid, players) => {
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

export const removeTableParticipantsFirebase = (id, userUid) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id + '/participants');
    return childRef.transaction(function update(participants) {
        if (participants) participants = participants.filter(uid => uid !== userUid);
        return participants;
    });
}

export const setTableDeclarationsFirebase = (id, round, playerIndex, declaration) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id + '/declarations');
    return childRef.transaction(function update(declarations) {
        if (declarations) declarations[round][playerIndex] = declaration;
        return declarations;
    });
}

export const changeTurnFirebase = (id, newTurnIndex) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id + '/turnIndex');
    return childRef.transaction(function update(turnIndex) {
        if (turnIndex) turnIndex = newTurnIndex;
        return turnIndex;
    });
}

export const setTableClockFirebase = (id, newClock) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id + '/clock');
    return childRef.transaction(function update(clock) {
        if (clock) clock = newClock;
        return clock;
    });
}

export const declarePassTurnAndCleanAbsence = (id, round, playerIndex, declaration, newTurnIndex, newClock) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id);
    return childRef.transaction(function update(table) {
        if (table) {
            table.declarations[round][playerIndex] = declaration;
            table.turnIndex = newTurnIndex;
            table.clock = newClock;
            if (table.absencePlayerManager) delete table.absencePlayerManager;
        }
        return table;
    });
}

export const playCardPassTurnAndCleanAbsence = (id, round, subRound, card, newTurnIndex, newClock) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id);
    return childRef.transaction(function update(table) {
        if (table) {
            table.playedCards[round][subRound][table.playedCards[round][subRound].indexOf(-1)] = card;
            table.turnIndex = newTurnIndex;
            table.clock = newClock;
            if (table.absencePlayerManager) delete table.absencePlayerManager;

            if (table.playedCards[round][subRound].every(card => card !== -1)) {
                // everybody played their cards, now determinate who won 
                let winnerIndex = determinateSubTurnWinnerIndex(table);
                table.points[table.round][winnerIndex]++;
                // change subRound
                if (subRound === (table.shifts[round][0].length - 1)) {
                    table.subRound = 0;
                    table.round++;
                    table.initialTurnIndex = (table.initialTurnIndex + 1) % table.players;
                    table.turnIndex = table.initialTurnIndex;
                }
                else {
                    table.turnIndex = winnerIndex;
                    table.subRound++;
                }
            }
        }
        return table;
    });
}

export const signalAbsence = (id, uid) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('tables/' + id);
    return childRef.transaction(function update(table) {
        if (table) {
            if (!table.absencePlayerManager) table.absencePlayerManager = uid;
            else return;
        }
        return table;
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

export const updateUserDetails = (key, displayName, photoURL) => {
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('userDetails/' + key);
    let newVal = {};
    if (displayName) newVal.displayName = displayName;
    if (photoURL) newVal.photoURL = photoURL;
    return childRef.update(newVal);
}