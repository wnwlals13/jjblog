import React, { memo, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../utils/navbar/navbar";
import styles from "./article.module.css";
import Comments from "../comments/comments";
import Parser from "html-react-parser";

const Article = memo(({ authService, dbService }) => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  const {state} = useLocation();
  const historyId = navigate?.location?.Article;
  const article = state?.article;

  const id = article?.id || "";
  const userName = article?.userName || "";
  const title = article?.title;
  const mainContents = article?.mainContents;
  const fileURL = article?.fileURL || "";
  const uploadDate = historyId?.uploadDate || "";
  const hashtag = historyId?.hashtag || [];

  const goToHome = () => {
    navigate( "/", {
      state: {
        id: navigate?.location?.state.id,
        name: navigate?.location?.state.name,
        email: navigate?.location?.state.email,
        article: null,
      },
    });
  };
  const onUpdateHandle = () => {
    navigate( "/editPost", {
      state: {
        id: navigate?.location?.state.id,
        name: navigate?.location?.state.name,
        email: navigate?.location?.state.email,
        article: historyId,
      },
    });
  };
  const onDeleteHandle = () => {
    dbService.removeContent(currentUser, historyId.id);
    goToHome();
  };
  useEffect(() => {
    authService.onAuthChange((user) => {
      const email = user && user.email.split("@")[0];
      user && setCurrentEmail(email);
      user && setCurrentUser(user.uid);
    });
  }, [authService]);
  useEffect(() => {
    return () => setCurrentUser("");
  }, []);
  useEffect(() => {
    return () => setCurrentEmail("");
  }, []);

  useEffect(()=> {
    const imgdiv = document.getElementById('img-container');
    imgdiv.style = `background-image: url("${fileURL}")`;
  },[])

  return (
    <section className={styles.container}>
      <div className={styles.articleContainer}>
        <button className={styles.backBtn} onClick={goToHome}>
          홈으로
        </button>
        <div className={styles.imgWrapper}>
          <div id="img-container" className={styles.imgDiv}></div>
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.info}>
          <div className={styles.info__Text}>
            <div className={styles.userInfo}>{userName}</div>
            <div className={styles.date}>{uploadDate}</div>
          </div>
          {historyId?.userName === currentEmail && (
            <div className={styles.info__mybtns}>
              <button className={styles.update} onClick={onUpdateHandle}>
                <span>수정하기</span>
              </button>
              <button className={styles.delete} onClick={onDeleteHandle}>
                <span>삭제하기</span>
              </button>
            </div>
          )}
        </div>
        {/* {fileURL && <img className={styles.file} src={fileURL} alt="img" />} */}
        <div className={styles.content}>{Parser(mainContents)}</div>
        <ul className={styles.hashtagWrapper}>
          <p>#HashTag</p>
          {hashtag &&
            hashtag.map((data) => (
              <li key={data} className={styles.hashtag}>
                {data}
              </li>
            ))}
        </ul>
        {/* <div className={styles.commentWrapper}>
          <Comments postsId={id} />
        </div> */}
      </div>
    </section>
  );
});

export default Article;