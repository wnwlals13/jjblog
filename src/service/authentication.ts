import firebase from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

/**
 * Auth 관련 api
 */
export class Authentication {
  signup(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        window.location.href = "/login";
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorMessage);
        // ..
      });
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        window.location.href = "/";

        const userInfo = {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          // token: user.accessToken,
          profileImg: user.photoURL,
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
        window.location.replace("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode == "auth/invalid-email") {
          alert("이메일 형식 틀림");
        }
      });
  }

  loginSocial(providerName: string) {
    const authProvider = this.getProvider(providerName);
    const provide =
      providerName === "Google" ? GoogleAuthProvider : GithubAuthProvider;
    signInWithPopup(auth, authProvider).then((result) => {
      const credential = provide.credentialFromResult(result);
      const token = credential?.accessToken;

      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        profileImg: user.photoURL,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      window.location.replace("/");
    });
  }

  getProvider(providerName: string) {
    switch (providerName) {
      case "Google":
        return new GoogleAuthProvider();
      case "Github":
        return new GithubAuthProvider();
      default:
        throw new Error(`Not supported provider : ${providerName}`);
    }
  }

  logout() {
    localStorage.removeItem("user");
    return auth.signOut();
  }

  updateUserInfo(obj: {}) {
    if (!auth.currentUser) return;
    updateProfile(auth.currentUser, obj).then((res) => {
      //profile updated!
      if (auth.currentUser) {
        console.log(auth.currentUser, res);
        localStorage.setItem("user", JSON.stringify(auth.currentUser));
        window.location.reload(); // 새로고침
      }
    });
  }
}
