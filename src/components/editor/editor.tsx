import Resizer from "react-image-file-resizer";
import React, { memo, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import Parser from "html-react-parser";
import "react-quill/dist/quill.snow.css";
import Database from "../../service/database";
import { getDownloadURL } from "firebase/storage";

interface EditorProps {
  mainContents?: string;
  setContents: React.Dispatch<React.SetStateAction<string>>;
  setId?: React.Dispatch<React.SetStateAction<string>>; // 게시글 id Set
  // setUrl?: React.Dispatch<React.SetStateAction<string[]>>; // 게시글 이미지 url
  // setFile?: React.Dispatch<React.SetStateAction<File[]>>;
  // setTempUrl: React.Dispatch<React.SetStateAction<string[]>>;
  url?: React.MutableRefObject<string[]>;
  file?: React.MutableRefObject<File[]>;
  tempUrl?: React.MutableRefObject<string[]>;
  targetIdRef?: React.MutableRefObject<string>; // 게시글 id
}

const Editor = memo((props: EditorProps) => {
  const {
    mainContents,
    setContents,
    // setUrl,
    // setFile,
    // setTempUrl,
    url,
    file,
    tempUrl,
    targetIdRef,
  } = props;
  const quillRef = useRef<ReactQuill>(null);
  const db = new Database();
  const [mainImg, setMainImg] = useState("");

  /* 수정하기인 경우, 세팅 */
  useEffect(() => {
    if (!mainContents) return;
    let text = JSON.parse(JSON.stringify(mainContents));
    let quill = quillRef.current?.getEditor();
    const delta = quill?.clipboard.convert(text);
    if (delta) quill?.setContents(delta);
  }, []);

  useEffect(() => {
    return () => {
      console.log("editor unmount?");
    };
  });

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
        // if (setUrl) setUrl((prev) => [...prev, resizedImage.name]);
        // if (setFile) setFile((prev) => [...prev, resizedImage]);
        if (url) url.current.push(resizedImage.name);
        if (file) file.current.push(resizedImage);
      }
      if (!quillRef.current) return;
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();

      // 우선 이미지 미리보기를 위해 sotrage 내 /image/temp 에 저장
      await db
        .addImgTemp({ contentId: targetIdRef.current, fileURL: resizedImage })
        .then(async (res) => {
          const file_url = await getDownloadURL(res.ref);
          tempUrl?.current.push(file_url);
          // setTempUrl((prev) => [...prev, file_url]); // temp url을 origin url로 변경할 때, 비교할 수 있도록 변수 저장
          if (range) {
            editor.insertEmbed(range.index, "image", file_url);
            // 이미지가 등록 된 후, 커서를 이미지 다음 줄로 이동시킨다.
            setTimeout(() => {
              editor.insertText(range.index + 1, "\n");
              editor.setSelection(range.index + 2, range.index);
            }, 1000);
          }
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
