import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../utils/navbar/navbar";
// import styles from "./article.module.css";
import Comments from "../comments/comments";
import Parser from "html-react-parser";
import Database from "../../service/database";
import { styled } from "styled-components";
import { Content } from "../../d";
import { UserContext } from "../../index";

export const Article = () => {
  const { id } = useParams();
  const db = new Database();
  const navigate = useNavigate();

  const [contentId, setContentId] = useState(id);
  const [article, setArticle] = useState<Content>();
  const commentsEl = useRef<HTMLDivElement>(null);
  const user = useContext(UserContext);

  function isTypeContent(param: any): param is Content {
    return true;
  }

  useEffect(() => {
    if (!contentId) return;
    db.getEachContent(contentId).then((result) => {
      if (isTypeContent(result)) {
        setArticle(result);
      }
    });
  }, [contentId]);

  useEffect(() => {
    const isComment = commentsEl.current?.firstChild;
    // console.log(!isComment);
    // return () => {
    //   if (!isComment) {
    const el = document.createElement("script");
    el.async = true;
    el.setAttribute("src", "https://utteranc.es/client.js");
    el.setAttribute("repo", "wnwlals13/blog-comment");
    el.setAttribute("issue-term", "pathname");
    el.setAttribute("label", "pathname");
    el.setAttribute("theme", "github-light");
    el.setAttribute("crossorigin", "anonymous");

    commentsEl.current?.appendChild(el);
    //   }
    // };
    console.log();
  }, []);

  if (!article) return <></>;

  return (
    <Container>
      <button onClick={() => navigate("/")}>목록으로</button>
      <BtnWrapper>
        <h1>{article.title}</h1>
        {article?.writer === user.email ? (
          <button
            onClick={() =>
              navigate(`/editPost/${contentId}`, { state: article })
            }
          >
            수정하기
          </button>
        ) : (
          <></>
        )}
      </BtnWrapper>
      <MetaWrapper>
        <div>{article.writer}</div>
        <div>{article.createDate}</div>
      </MetaWrapper>
      <div>{Parser(article.contents)}</div>
      <div ref={commentsEl} />
    </Container>
  );
};
const Container = styled.div`
  margin-bottom: 2rem;
`;
const BtnWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  margin: 2rem 0;
`;
const MetaWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;
