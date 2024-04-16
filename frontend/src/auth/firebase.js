import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "broe-code.firebaseapp.com",
	projectId: "broe-code",
	storageBucket: "broe-code.appspot.com",
	messagingSenderId: "575491455237",
	appId: "1:575491455237:web:b104538ac2ca6c73a71f6c",
};

initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, provider);
		return result.user;
	} catch (error) {
		console.log("Authentication with Google failed:", error);
		throw error;
	}
};
