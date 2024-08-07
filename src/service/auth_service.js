import firebase, { app } from "./firebase";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const auth = getAuth();

export class AuthService {
  signUp(params) {
    let { email, password } = params;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  login(providerName) {
    const authProvider = this.getProvider(providerName);
    signInWithPopup(auth, authProvider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user);
      const userInfo = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        profileImg: user.photoURL,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
    });
  }
  onAuthChange(onUserChanged) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        onUserChanged(user);
      }
    });
  }
  logout() {
    localStorage.removeItem("user");
    return auth.signOut();
  }
  getProvider(providerName) {
    switch (providerName) {
      case "Google":
        return googleProvider;
      case "Github":
        return githubProvider;
      default:
        throw new Error(`not supported provider : ${providerName}`);
    }
  }
}

export default AuthService;
