import React, {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "../editor/editor";
import styled from "styled-components";
import { UserContext } from "../../index";
import Database from "../../service/database";
import { Content } from "../../d";
import { Preview } from "../content_preview/content_preview";
import { getDownloadURL } from "firebase/storage";

interface Iprops {
  mode: number;
  updateText: React.Dispatch<React.SetStateAction<Preview>>;
  previewText?: Preview;
}

const ContentForm = memo(({ mode, updateText, previewText }: Iprops) => {
  const user = useContext(UserContext);
  const db = new Database();
  const navigate = useNavigate();
  const targetIdRef = useRef<string>(previewText?.id || Date.now().toString());
  const [url, setUrl] = useState<string[]>([]);
  const [file, setFile] = useState<File[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const [mainText, setMainText] = useState(previewText?.htmlString);
  const [contents, setContents] = useState("");

  useEffect(() => {
    return () => {
      console.log("unmount");
    };
  });

  useEffect(() => {
    if (titleRef.current && previewText?.title) {
      titleRef.current.value = previewText?.title;
    }
    if (previewText?.id) targetIdRef.current = previewText.id;
  }, []);

  const onUpload = (e: MouseEvent<HTMLButtonElement>) => {
    let isAllUpdated = false;
    if (mode !== 1 && !previewText) return;

    if (!titleRef.current?.value) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!mainText) {
      alert("내용을 입력해주세요");
      return;
    }

    const contentObj: Content = {
      id: targetIdRef.current,
      createDate: getFormatDate(new Date()) || "",
      updateDate: getFormatDate(new Date()) || "",
      writer: user.email,
      title: titleRef.current?.value,
      contents: mainText,
      imgUrl: url,
      imgFile: file,
    };

    // img temp 삭제
    if (url.length > 0) {
      db.deleteImgTemp({ uid: contentObj.id, imgs: url, file: file });

      // img 저장
      let updatedText = mainText;

      db.addImgFile({
        uid: contentObj.id,
        imgs: url,
        file: file,
      }).then(async (res) => {
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            const file_url = await getDownloadURL(res[i].ref);
            const regExp = /<img[^>]+src=[\"']?([^>\"']+)[\"']?[^>]*>/g;
            updatedText.replace(regExp, (match, p1) => {
              return match.replace(p1, file_url);
            });
          }

          setMainText(updatedText);
        }

        // content 이미지 링크 새로이 수정
        contentObj["contents"] = updatedText;
        if (mode === 1) {
          addContent(contentObj);
        } else {
          editContent(contentObj);
        }
      });
    } else {
      if (mode === 1) {
        addContent(contentObj);
      } else {
        editContent(contentObj);
      }
    }
  };

  /* 새글 추가 */
  const addContent = async (params: Content) => {
    await db.addContent(params).then((res) => {
      navigate("/");
    });
  };

  /* 내글 수정 */
  const editContent = async (params: Content) => {
    await db.editContent(params).then((res) => {
      navigate("/");
    });
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    let input = e.currentTarget! as HTMLInputElement;

    updateText((prev) => {
      return { ...prev, title: input.value };
    });
  };

  const getFormatDate = (date: Date) => {
    var year = date.getFullYear();
    var month = 1 + date.getMonth();
    month = month >= 10 ? month : 0 + month;
    var day = date.getDate();
    day = day >= 10 ? day : 0 + day;
    return year + "-" + month + "-" + day;
  };

  useEffect(() => {
    updateText((prev) => {
      return { ...prev, htmlString: contents };
    });
    setMainText(contents);
  }, [contents]);

  return (
    <FormContainer>
      <div>
        <input
          type="text"
          name="title"
          ref={titleRef}
          className="defaultTextInput"
          placeholder="제목을 입력하세요."
          onKeyUp={onKeyUp}
          autoFocus={true}
          maxLength={20}
        />
      </div>
      <EditorWrapper>
        <Editor
          mainContents={mainText}
          setContents={setContents}
          targetIdRef={targetIdRef}
          setUrl={setUrl}
          setFile={setFile}
        />
      </EditorWrapper>
      <div>
        <button className="btnDefault_outline" onClick={onUpload}>
          업로드
        </button>
      </div>
    </FormContainer>
  );
});

export default ContentForm;

const FormContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 1rem;
`;

const EditorWrapper = styled.div`
  flex: 1;
  height: 100%;
`;
