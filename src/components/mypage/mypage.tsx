import React from "react";
import styles from "./mypage.module.css";

export default function Mypage() {
  return (
    <section className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.profileImg}>img</div>
        <div className={styles.profileComment}>comment</div>
        <div className={styles.profileBtn}>
          <button>설정</button>
        </div>
      </div>
      <div className={styles.postList}>
        <li>list1</li>
        <li>list2</li>
        <li>list3</li>
      </div>
    </section>
  );
}
