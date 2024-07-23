import React, {
  memo,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import Parser from "html-react-parser";
import "react-quill/dist/quill.snow.css";
import Database from "../../service/database";
import { getDownloadURL } from "firebase/storage";

interface EditorProps {
  onChangeField: (param: any | null) => void;
  mainContents?: string;
  setId?: React.Dispatch<React.SetStateAction<string>>; // 게시글 id
  setUrl?: React.Dispatch<React.SetStateAction<string>>; // 게시글 메인이미지 url
}

const Editor = memo((props: EditorProps) => {
  const { setId, mainContents, onChangeField, setUrl } = props;
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const quillRef = useRef<ReactQuill>(null);
  const [targetId, setTargetId] = useState(Date.now().toString());
  const db = new Database();

  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    // 게시글 id가 생성되지 않았다면 생성!
    if (targetId && setId) setId(targetId);
  }, [targetId]);

  /* 수정하기인 경우, 세팅 */
  useEffect(() => {
    let text = JSON.parse(JSON.stringify(mainContents));
    let quill = quillRef.current?.getEditor();
    const delta = quill?.clipboard.convert(text);
    if (delta) quill?.setContents(delta);
  }, []);

  // function : image 핸들러
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async () => {
      let formData = new FormData();
      const files = input.files! as FileList;

      if (!mainImg) {
        setMainImg(files[0].name);
        if (setUrl) setUrl(files[0].name);
      }

      if (!quillRef.current) return;
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();

      await db
        .addImgFile({ contentId: targetId, fileURL: files[0] })
        .then(async (res) => {
          const file_url = await getDownloadURL(res.ref);

          if (range) editor.insertEmbed(range.index, "image", file_url);
        });

      try {
      } catch (error) {}
    });
  };

  useEffect(() => {
    console.log("list", fileList);
  }, [fileList]);

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
    //'font',
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

  const onChangeHandler = (
    content: any,
    delta: any,
    source: any,
    editor: any
  ) => {
    // console.log(content, editor);
    let wrapper = document.createElement("div");
    wrapper.style.maxWidth = "100%";
    wrapper.innerHTML = content;

    const htmlString = wrapper.outerHTML;
    // console.log("editor", htmlString, content, delta, source, editor);
    onChangeField(htmlString);
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
