import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";
import ContentForm from "../content_form/content_form";
import ContentPreview, { Preview } from "../content_preview/content_preview";
import Editor from "../editor/editor";

const ContentEdit = () => {
  const { state } = useLocation();
  const { contents, createDate, id, imgUrl, title, updarteDate, writer } =
    state;

  const previewText = { title, htmlString: contents };
  const [text, setText] = useState<Preview>(previewText);

  useEffect(() => {
    console.log(text);
  }, [text]);

  // const onChangeField = () => {};

  return (
    <FormContainer>
      <LeftContainer>
        <ContentForm
          mode={2}
          updateText={setText}
          previewText={previewText}
        ></ContentForm>
      </LeftContainer>
      <RightContainer>
        {previewText && <ContentPreview previewText={text} />}
      </RightContainer>
    </FormContainer>
  );
};
export default ContentEdit;

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
