import { app } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  DocumentSnapshot,
  QuerySnapshot,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Content } from "../d";
import { useContext } from "react";
import { UserContext } from "../index";

const db = getFirestore();
const storage = getStorage(app);

class Database {
  /* 모든 게시글 조회 */
  getAllContent = async () => {
    const q = query(collection(db, "content"), orderBy("createDate", "desc"));
    const docSnap = await getDocs(q);
    const result: any = [];

    docSnap.forEach((item) => {
      result.push(item.data());
    });

    return result;
  };
  /* 단일 게시글 조회 */
  getEachContent = async (id: string) => {
    console.log(db, id);
    const docSnap = await getDoc(doc(db, "content", id));
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  /* 사용자 게시글 모두 조회 */
  getAllContentById = async (user: string) => {
    const q = query(collection(db, "content"), where("writer", "==", user));
    const docSnap = await getDocs(q);
    const result: any = [];

    docSnap.forEach((item) => result.push(item.data()));

    return result;
  };

  /* 게시글 추가 (단일) */
  addContent = async (content: Content) => {
    await setDoc(doc(db, "content", content.id), content);
  };
  // addImgFile = async (ImgFile: FormData) => {
  //   const contentId = ImgFile.get("targetId")! as string;
  //   const file = ImgFile.get("file")! as File;
  /* 게시글 이미지 파일 추가 */
  addImgFile = async (obj: { contentId: string; fileURL: any }) => {
    let { contentId, fileURL } = obj;
    const storageRef = ref(storage, `images/${contentId}/${fileURL.name}`);

    const uploadFile = await uploadBytes(storageRef, fileURL);
    return uploadFile;
  };
  /* 게시글 이미지 폴더에 모든 파일 다운로드 */
  getImgFiles = async (contentId: string) => {
    const storageRef = ref(storage, `images/${contentId}`);
    return await listAll(storageRef).then((res) => res.items);
  };

  getURL = async (id: string, name: string) => {
    return await getDownloadURL(ref(storage, `images/${id}/${name}`));
  };
  /* 게시글 이미지 파일 추가 */
  addProfile = async (obj: { userId: string; fileURL: any }) => {
    let { userId, fileURL } = obj;
    const storageRef = ref(storage, `profile/${userId}/${fileURL.name}`);

    const uploadFile = await uploadBytes(storageRef, fileURL);
    return uploadFile;
  };

  /* 파일 삭제 */
  // deleteProfile = async () => {
  //   deleteObject
  // }
  // saveCommnet(userId, comment) {
  //   //
  // }
  // updateContent(userId, content) {
  //   // console.log(userId, content);
  //   firebaseDB.ref(`/contents/${userId}/${content.id}`).update(content);
  // }
  // removeContent(userId, contentId) {
  //   firebaseDB.ref(`/contents/${userId}/${contentId}`).remove();
  // }
  // readAllContent() {
  //   const result = ref("contents").once("value");
  // }
  // readMyContent(userId) {
  //   return firebaseDB.ref(`content/${userId}`).once("value");
  // }
}
export default Database;
