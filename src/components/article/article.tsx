import React, { memo, useContext, useEffect, useRef, useState } from "react";
import {
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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
  const commentsRef = useRef<Element>();
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
    const isComment = commentsRef.current?.firstChild;
    console.log("isComment", isComment);
    if (isComment) return;

    const el = document.createElement("script");
    el.async = true;
    el.setAttribute("src", "https://utteranc.es/client.js");
    el.setAttribute("repo", "wnwlals13/blog-comment");
    el.setAttribute("issue-term", "pathname");
    el.setAttribute("label", "pathname");
    el.setAttribute("theme", "github-light");
    el.setAttribute("crossorigin", "anonymous");
    commentsRef.current?.appendChild(el);
  }, []);

  if (!article) return <></>;

  return (
    <Container>
      <BtnWrapper>
        <h1>{article.title}</h1>
        {user && article?.writer === user.email ? (
          <EditBtns>
            <button
              onClick={() => {
                if (window.confirm("해당 글을 수정하시겠습니까?"))
                  navigate(`/editPost/${contentId}`, { state: article });
              }}
            >
              수정하기
            </button>
            <button
              onClick={async () => {
                if (
                  window.confirm("해당 글을 삭제하시겠습니까?") &&
                  contentId
                ) {
                  const db = new Database();
                  await db
                    .deleteContent({ uid: contentId, url: article.imgUrl })
                    .then((res) => {
                      navigate("/");
                    });
                }
              }}
            >
              삭제하기
            </button>
          </EditBtns>
        ) : (
          <></>
        )}
      </BtnWrapper>
      <MetaWrapper>
        <div>{article.writer}</div>
        <div>{article.createDate}</div>
      </MetaWrapper>
      <ContentWrapper>{Parser(article.contents)}</ContentWrapper>
      <CommentDiv />
    </Container>
  );
};
const Container = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  justify-contents: center;
  align-items: center;
  margin: 0 auto;

  @media (min-width: 500px) {
    max-width: 700px;
    width: 100%;
  }
`;
const BtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  margin: 2rem 0;
`;
const MetaWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
`;
const ContentWrapper = styled.div`
  width: 100%;
`;
const CommentDiv = styled.div`
  margin-top: 80px;

  .utterances {
    max-width: 100%;
  }
`;
const EditBtns = styled.div`
  & button {
    margin-right: 10px;
  }
`;
