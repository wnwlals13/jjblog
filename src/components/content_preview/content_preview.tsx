import React, { memo, useEffect } from "react";
import styled from "styled-components";

export interface Preview {
  title?: string;
  htmlString?: string;
  id: string;
}

/**
 * 게시글 작성 : 미리보기
 */
const ContentPreview = memo(({ previewText }: { previewText: Preview }) => {
  const { title, htmlString } = previewText;
  console.log(title, htmlString);
  return (
    <>
      <PreviewHeader>{title}</PreviewHeader>
      {htmlString && (
        <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>
      )}
      {/* {htmlString} */}
    </>
  );
});

export default ContentPreview;

const PreviewHeader = styled.h1`
  font-size: 1.8rem;
  margin-top: 0;
`;
