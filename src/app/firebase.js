import { initializeApp } from 'firebase/app';
import {getAnalytics} from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjPPNvRqzpHWge4-M6kLqISBNbgezGGXw",
  authDomain: "ibaadspantry.firebaseapp.com",
  projectId: "ibaadspantry",
  storageBucket: "ibaadspantry.appspot.com",
  messagingSenderId: "1078557765910",
  appId: "1:1078557765910:web:fa46f1fe3b81db10bba037"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)
const firestore = getFirestore(app);
export { firestore };
