import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../utils/navbar/navbar";
import ContentForm from "../content_form/content_form";
import ContentPreview, { Preview } from "../content_preview/content_preview";
// import styles from "./content_add.module.css";
import styled from "styled-components";
import { Content } from "../../d";
import Database from "../../service/database";

const ContentAdd = memo(() => {
  const [text, setText] = useState<Preview>({});
  const [htmlString, setHtmlString] = useState("");
  const [title, setTitle] = useState("");

  const history = useNavigate();
  // const historyId = history?.location?.state;
  // const historyArticle = history?.location?.state?.article;
  // const goToMain = () => {
  //   history("/", {
  //     state: {
  //       id: historyId ? historyId.id : null,
  //       name: historyId ? historyId.name : null,
  //       email: historyId ? historyId.email : null,
  //     },
  //   });
  // };
  // const addContent = (content) => {
  //   db.addContent(content);
  //   history("/");
  // setContents((contents) => {
  //   let update = { ...contents };
  //   update[content.id] = content;
  //   return update;
  // });
  // console.log(content);
  // dbService.addContent(content);
  // goToMain();
  // };
  // const updateText = (obj) => {
  //   let { title, htmlString } = obj;
  //   console.log(title, htmlString, obj);
  // setHtmlString(data);
  // };

  // useEffect(() => {
  //   setContents(historyArticle);
  // }, [historyArticle]);

  useEffect(() => {
    console.log("preview", text);
  }, [text]);

  return (
    // <section className={styles.container}>
    <FormContainer>
      {/* <div className={styles.inputWrap}> */}
      <LeftContainer>
        {/* {!historyArticle && ( */}
        <ContentForm
          // contents={contents}
          // addContent={addContent}
          // updateContent={updateContent}
          mode={1}
          updateText={setText}
          // FileInput={FileInput}
        />
        {/* )} */}
      </LeftContainer>
      {/* <div className={styles.prevWrap}> */}
      <RightContainer>
        {text && <ContentPreview previewText={text} />}
      </RightContainer>
      {/* </div> */}
    </FormContainer>
    // </section>
  );
});

export default ContentAdd;

const FormContainer = styled.section`
  display: flex;
  gap: 1rem;
  padding: 0;
  height: 600px;
`;

const LeftContainer = styled.section`
  flex: 1;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const RightContainer = styled.div`
  flex: 1;
  overflow-y: scroll;

  @media (max-width: 1440px) {
    flex: 0;
  }
`;
