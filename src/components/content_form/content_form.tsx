import React, {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  useCallback,
  MouseEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import styles from "./content_form.module.css";
import Hashtag from "../hashtag/hashtag";
import Editor from "../editor/editor";
import styled from "styled-components";
import { UserContext } from "../../index";
import Database from "../../service/database";
import { Content } from "../../d";
import { Preview } from "../content_preview/content_preview";

interface Iprops {
  mode: number;
  updateText: React.Dispatch<React.SetStateAction<Preview>>;
  previewText?: Preview;
}

const useGettingTitle = (param: any) => {
  const [title, setTitle] = useState(null);

  const ref = useCallback((el: HTMLInputElement) => {
    if (el) {
      el.value = param.title;
      console.log(param);
      setTitle(param.title);
    }
  }, []);

  return [title, ref];
};

const ContentForm = memo(({ mode, updateText, previewText }: Iprops) => {
  const [title, titleRef] = useGettingTitle(previewText);
  // const [title, titleRef]: any = () => {
  // const [title, setTitle] = useState("");
  // const ref = useCallback((el: HTMLInputElement) => {
  //   if (el !== null) console.log(el);
  // }, []);
  // return [title, setTitle];
  // };
  // const titleRef = useRef<HTMLInputElement | null>(null);
  // const titleRefCallback = useCallback((el: HTMLInputElement | null) => {
  //   console.log(el);
  // }, []);
  const [targetId, setTargetId] = useState("");
  const [url, setUrl] = useState("");

  const [hashtag, setHashtag] = useState([]);
  const [mainText, setMainText] = useState(previewText?.htmlString);
  const [updateFile, setUpdateFile] = useState({
    fileName: null,
    fileURL: null,
  });
  const navigate = useNavigate();
  const user = useContext(UserContext);
  // const editorMode = useState<number>(mode); // 1: 생성(default), 2:수정
  console.log("mode", mode);

  useEffect(() => {
    // 게시글 id가 생성되지 않았다면 생성!
    // if (!newId.length) setNewId(Date.now().toString());
    // [게시글 수정] 정보 세팅
    // if (previewText) {
    //   if (!titleRef.current) return;
    //   titleRef.current = previewText?.title;
    //   console.log("previewText", previewText);
    // }
  }, []);

  const onUpload = (e: MouseEvent<HTMLButtonElement>) => {
    // event.preventDefault();
    console.log(title, titleRef);
    // if (!titleRef && !titleRef.current) return;

    // let title = titleRef.current;
    // console.log(title);

    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    } else if (mainText === "") {
      alert("내용을 입력해주세요");
    }

    const contentObj = {
      id: targetId,
      createDate: getFormatDate(new Date()) || "",
      updateDate: getFormatDate(new Date()) || "",
      writer: user.email,
      title: title,
      contents: mainText,
      imgUrl: url,
    };
    console.log(contentObj);
    // if (mode === 1) {
    //   addContent(contentObj);
    // } else {
    //   // editContent();
    // }
  };

  /* 새글 추가 */
  const addContent = async (params: Content) => {
    const db = new Database();
    await db.addContent(params).then((res) => {
      navigate("/");
    });
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    let input = e.currentTarget! as HTMLInputElement;

    updateText((prev) => {
      return { ...prev, title: input.value };
    });

    // e.preventDefault();
    // console.log(title, e);
    // let value = title.value;
    // console.log(e.currentTarget.value);
    // updateContent({
    //   ...contents,
    //   [e.currentTarget.name]: e.currentTarget.value,
    //   // hashtag,
    //   updateFile,
    // });
  };

  // const onFileChange = (file) => {
  //   file && setUpdateFile({ fileName: file.name, fileURL: file.url });
  // };

  // const hashTagHandle = (data) => {
  //   setHashtag(data);
  // };
  const onChangeField = (data: string) => {
    // const template = document.createElement("div");
    // template.innerHTML = data;
    // console.log("form", data, "왜필요한가");

    // data && setMainText(data);
    console.log("onchangefield", data);
    updateText((prev) => {
      return { ...prev, htmlString: data };
    });
    setMainText(data);
  };
  // useEffect(() => {
  // updateContent({
  //   ...contents,
  //   ["mainContents"]: mainText,
  //   updateFile,
  // });
  // }, [updateFile, mainText]);

  const getFormatDate = (date: Date) => {
    var year = date.getFullYear();
    var month = 1 + date.getMonth();
    month = month >= 10 ? month : 0 + month;
    var day = date.getDate();
    day = day >= 10 ? day : 0 + day;
    return year + "-" + month + "-" + day;
  };
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
          onChangeField={onChangeField}
          mainContents={mainText}
          setId={setTargetId}
          setUrl={setUrl}
        />
      </EditorWrapper>
      <div>
        <button className="btnDefault_outline uploadBtn" onClick={onUpload}>
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

  // .uploadBtn {
  //   flex: 1;
  // }
`;

const EditorWrapper = styled.div`
  flex: 1;
  height: 100%;
`;
