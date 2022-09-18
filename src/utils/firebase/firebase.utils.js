import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBev-xLTHdjNT81r90k7v_lHtTk9gbadbw",
  authDomain: "e-com-db-d82ec.firebaseapp.com",
  projectId: "e-com-db-d82ec",
  storageBucket: "e-com-db-d82ec.appspot.com",
  messagingSenderId: "712446193824",
  appId: "1:712446193824:web:ea593ad7f207e8ca9ed9c5",
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

//FireBase Method which will return the authentication string of a user
//Notice this method keep tracking if you signed in or not
//You will be signed in aslong as YOU DIDNT SIGN OUT MANUALLY (or just use signoutuser method)
export const auth = getAuth();

export const SignInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const SignInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  //collection will give us back a reference to the document
  const collectionRef = collection(db, collectionKey);
  //Batch will give us access to manipulate the data
  const batch = writeBatch(db);

  //loop on each obj and create a doc with the name of obj title
  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    //set[or add in other words] the obj to the doc db
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("Done");
};

export const getCategoriesAndDocuments = async () => {
  //Getting the collection refernce
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef);

  const querySnapShot = await getDocs(q);
  const categoryMap = querySnapShot.docs.reduce((accumulator, docSnapShot) => {
    const { title, items } = docSnapShot.data();
    accumulator[title.toLowerCase()] = items;
    return accumulator;
  }, {});
  return categoryMap;
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  //if user data does not exists
  //Ceate / set the document with the data from userAuth in my collection
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("Error creating the user", error.message);
    }
  }

  //if user data exists
  //return back userDocRef
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};
