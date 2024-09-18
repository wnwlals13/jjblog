import { app } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
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
    const docSnap = await getDoc(doc(db, "content", id));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
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
    try {
      let { imgFile, ...newContent } = content;
      await setDoc(doc(db, "content", newContent.id), newContent);
      // }
    } catch (error) {
      if (error instanceof Error)
        throw new Error(
          `게시글 추가에 실패하였습니다. message=>${error.message}`
        );
    }
  };

  /* 게시글 이미지 폴더에 모든 파일 다운로드 */
  getImgFiles = async (contentId: string) => {
    const storageRef = ref(storage, `images/${contentId}`);
    return await listAll(storageRef).then((res) => res.items);
  };

  getURL = async (id: string, name: string) => {
    try {
      return await getDownloadURL(ref(storage, `images/${id}/${name}`));
    } catch (err) {
      if (err instanceof Error) throw new Error(`now image, ${err.message}`);
    }
  };
  /* 게시글 이미지 파일 추가 */
  addProfile = async (obj: { userId: string; fileURL: any }) => {
    let { userId, fileURL } = obj;
    const storageRef = ref(storage, `profile/${userId}/${fileURL.name}`);

    const uploadFile = await uploadBytes(storageRef, fileURL);
    return uploadFile;
  };

  /* 게시글 수정 */
  editContent = async (param: Content) => {
    const ref = doc(db, "content", param.id);

    // 수정 시, 메인이미지가 지워졌다면, 메인이미지 변경 필요!
    const update = {
      title: param.title,
      contents: param.contents,
    };

    await updateDoc(ref, update);
  };

  /* 파일 삭제 */
  deleteImg = async (obj: { uid: string; url: string[] }) => {
    const { uid, url } = obj;
    for (let i = 0; i < url.length; i++) {
      const desertRef = ref(storage, `images/${uid}/${url[i]}`);
      await deleteObject(desertRef);
    }
  };

  /* 게시글 삭제 */
  deleteContent = async (obj: { uid: string; url: string[] }) => {
    const { uid, url } = obj;
    // 속하는 이미지 있으면 all 삭제
    this.deleteImg(obj);

    // 게시글 삭제
    await deleteDoc(doc(db, "content", uid));
  };

  /* (임시) 게시글 이미지 파일 추가 */
  addImgTemp = async (obj: { contentId: string; fileURL: any }) => {
    let { contentId, fileURL } = obj;
    const storageRef = ref(storage, `images/temp/${contentId}/${fileURL.name}`);
    const uploadFile = await uploadBytes(storageRef, fileURL);
    return uploadFile;
  };

  /* 게시글 이미지 파일 추가 */
  addImgFile = async (obj: { uid: string; imgs: string[]; file: File[] }) => {
    try {
      let { uid, imgs, file } = obj;
      let arr = [];
      for (let i = 0; i < file.length; i++) {
        const storageRef = ref(storage, `images/${uid}/${file[i].name}`);
        const uploadFile = await uploadBytes(storageRef, file[i]);
        arr.push(uploadFile);
      }
      return arr;
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`이미지 저장에 실패했습니다. ${error.message}`);
    }
  };

  /* 임시 이미지 제거 */
  deleteImgTemp = async (obj: {
    uid: string;
    imgs: string[];
    file: File[];
  }) => {
    const { uid, imgs, file } = obj;
    try {
      for (let i = 0; i < imgs.length; i++) {
        const tempImgRef = ref(storage, `images/temp/${uid}/${imgs[i]}`);
        if (tempImgRef) await deleteObject(tempImgRef);
      }
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`폴더 삭제에 실패했습니다. ${error.message}`);
    }
  };

  /* 블로그 게시글 리스트 조회 시, 작성자 프로필 이미지 불러오기 */
  getProfileImg = async (id: string) => {
    const storageListRef = ref(storage, `profile/${id}`);
    return await listAll(storageListRef);
  };
}
export default Database;
