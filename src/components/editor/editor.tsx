import Resizer from "react-image-file-resizer";
import React, { memo, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import Parser from "html-react-parser";
import "react-quill/dist/quill.snow.css";
import Database from "../../service/database";
import { getDownloadURL } from "firebase/storage";
import { resolve } from "path";
import { blob } from "stream/consumers";
import styled from "styled-components";

interface EditorProps {
  mainContents?: string;
  setContents: React.Dispatch<React.SetStateAction<string>>;
  setId?: React.Dispatch<React.SetStateAction<string>>; // 게시글 id Set
  setUrl?: React.Dispatch<React.SetStateAction<string[]>>; // 게시글 이미지 url
  setFile?: React.Dispatch<React.SetStateAction<File[]>>;
  targetIdRef?: React.MutableRefObject<string>; // 게시글 id
  // setDfileList?: React.Dispatch<React.SetStateAction<string[]>>;
}

const Editor = memo((props: EditorProps) => {
  const { mainContents, setContents, setUrl, setFile, targetIdRef } = props;
  const quillRef = useRef<ReactQuill>(null);
  const db = new Database();
  const [mainImg, setMainImg] = useState("");
  const tempImgUploadedRef = useRef<string[]>([]); // 임시로 이미지 저장 후, 임시저장된 이미지 정보 모음
  const tempFileUploadedRef = useRef<File[]>([]); // 임시로 이미지 저장 후, 임시저장된 이미지 정보 모음
  const [tempURL, setTempURL] = useState<[string, string][]>([]);

  /* 수정하기인 경우, 세팅 */
  useEffect(() => {
    if (!mainContents) return;
    let text = JSON.parse(JSON.stringify(mainContents));
    let quill = quillRef.current?.getEditor();
    const delta = quill?.clipboard.convert(text);
    if (delta) quill?.setContents(delta);
  }, []);

  // 이미지 리사이징
  const resizeFile = async (file: File) => {
    let arr = file.type.split("/");
    let type = arr[arr.length - 1];
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file, // target file
        1500, // maxWidth
        1500, // maxHeight
        type, // compressFormat
        100, // quality : 0 and 100. Used for the JPEG compression
        0,
        (uri) => {
          resolve(uri);
        },
        "file" // outputType : Can be either base64, blob or file.(Default type is base64)
      );
    });
  };

  // function : image 추가 시, 핸들러
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    if (!targetIdRef?.current) return;

    input.addEventListener("change", async () => {
      const files = input.files! as FileList;

      // 이미지 리사이징
      let resizedImage = (await resizeFile(files[0])) as File;

      if (!mainImg) {
        setMainImg(resizedImage.name);
        if (setUrl) setUrl((prev) => [...prev, resizedImage.name]);
        if (setFile) setFile((prev) => [...prev, resizedImage]);
      }
      if (!quillRef.current) return;
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();

      // 우선 이미지 미리보기를 위해 sotrage 내 /image/temp 에 저장
      await db
        .addImgTemp({ contentId: targetIdRef.current, fileURL: resizedImage })
        .then(async (res) => {
          const file_url = await getDownloadURL(res.ref);

          tempImgUploadedRef.current.push(resizedImage.name);
          tempFileUploadedRef.current.push(resizedImage);
          setTempURL((prev) => [...prev, [resizedImage.name, file_url]]);
          if (range) editor.insertEmbed(range.index, "image", file_url);
        });
    });
  };

  const modules = React.useMemo(() => {
    return {
      toolbar: {
        container: [
          ["image"],
          [{ header: [1, 2, false] }],
          ["bold", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "+1" }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ],
        handlers: {
          image: imageHandler,
        },
      },
    };
  }, []);

  const formats = [
    "header",
    "bold",
    "image",
    "list",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "bullet",
    "indent",
    "link",
    "align",
    "color",
    "background",
  ];

  // 이미지 사이즈 100%로 맞추기위해 classname 추가
  const Image = Quill.import("formats/image");
  Image.className = "custom-image";
  Quill.register(Image, true);

  const onChangeHandler = (content: any, delta: any) => {
    if (content) {
      setContents(content);
    }
  };

  return (
    <>
      <ReactQuill
        ref={quillRef}
        style={{
          height: "450px",
          maxHeight: "450px",
        }}
        theme="snow"
        modules={modules}
        formats={formats}
        onChange={onChangeHandler}
      />
    </>
  );
});

export default Editor;
