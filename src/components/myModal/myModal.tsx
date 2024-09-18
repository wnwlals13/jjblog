import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./myModal.module.css";

const MyModal = memo(({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleMenu = (e: React.MouseEvent<HTMLElement>) => {
    let id = e.currentTarget.getAttribute("data-id");

    switch (id) {
      case "new": {
        navigate("/addPost", { state });
        break;
      }
      case "mypage": {
        navigate("/mypage", { state });
        break;
      }
      case "logout": {
        const answer = window.confirm("정말로 로그아웃하시겠습니까?");
        if (!answer) return;

        onLogout();
        window.location.replace("/");
        break;
      }
    }
  };

  return (
    <ul className={`${styles.myModalList}`}>
      <li className={styles.listItem} data-id="new" onClick={handleMenu}>
        새 글 쓰기
      </li>
      <li className={styles.mypage} data-id="mypage" onClick={handleMenu}>
        마이페이지
      </li>
      <li className={styles.listItem} data-id="logout" onClick={handleMenu}>
        로그아웃
      </li>
    </ul>
  );
});

export default MyModal;
