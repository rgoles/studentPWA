import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const signOutFunction = () => {
  signOut(auth)
    .then(() => {
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      console.log("Sign-out failed.");
      console.log(error);
    });
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message };
  }
};
