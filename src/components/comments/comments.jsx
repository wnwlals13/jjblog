import React, { createRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Comments = ({ postsId }) => {
  const history = useNavigate();
  const commentRef = createRef();
  useEffect(() => {
    const utterances = document.createElement("script");
    const utterancesConfig = {
      src: "https://utteranc.es/client.js",
      repo: "wnwlals13/blog-comment",
      "issue-term": postsId,
      label: "comments",
      theme: "github-light",
      crossorigin: "anonymous",
      async: true,
    };
    Object.entries(utterancesConfig).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });
    commentRef.current.appendChild(utterances);
  }, [postsId, commentRef]);
  return <div ref={commentRef}></div>;
};
export default Comments;
