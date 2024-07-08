import React from "react";
import styles from "./mypage.module.css";

export default function Mypage() {
  const handleEditProfile = () => {};
  return (
    <section className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.profile}>
          <div className={styles.profileImg}>
            <input type="file" className={styles.profileBtn} />
          </div>
          <h2 className={styles.name}>name</h2>
          <div className={styles.profileComment}>comment</div>
          {/* <div className={styles.profileBtn}>
            <button className={styles.myBtn}>설정</button>
          </div> */}
        </div>
        <div className={styles.tags}>list</div>
      </div>
      <div className={styles.postList}>
        <li>list1</li>
        <li>list2</li>
        <li>list3</li>
      </div>
    </section>
  );
}
