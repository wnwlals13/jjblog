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

  useEffect(() => {
    console.log("preview", text);
  }, [text]);

  return (
    <FormContainer>
      <LeftContainer>
        <ContentForm mode={1} updateText={setText} />
      </LeftContainer>
      <RightContainer>
        {text && <ContentPreview previewText={text} />}
      </RightContainer>
    </FormContainer>
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
