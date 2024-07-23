import React, { useContext, useEffect, useState } from "react";
import Database from "../../service/database";
import { UserContext } from "../../index";
import { Content } from "src/d";
import { styled } from "styled-components";
import { ContentItem } from "../content/contentItem";
import { useNavigate } from "react-router-dom";
import { getDownloadURL } from "firebase/storage";
import { Authentication } from "../../service/authentication";

interface LooseObject {
  [key: string]: number | string;
}

export default function Mypage() {
  const user = useContext(UserContext);
  const db = new Database();
  const [list, setList] = useState<Content[]>();
  const navigate = useNavigate();
  const [profileURL, setProfileURL] = useState(user.photoURL || "");
  const [userName, setUserName] = useState("");
  const [preview, setPreview] = useState<any>();

  useEffect(() => {
    db.getAllContentById(user.email).then((res) => {
      setList(res);
    });

    // 값 세팅
    const nameInput = document.querySelector("#name");
    if (user.name) nameInput?.setAttribute("value", user.name);
  }, []);

  const handleClick = (param: string) => {
    navigate(`/viewPost/${param}`);
  };

  const handleModalOpen = () => {
    const modal = document.querySelector("#mypage-modal")! as HTMLElement;
    modal.style.display = "block";
  };

  const handleModalClose = () => {
    const modal = document.querySelector("#mypage-modal")! as HTMLElement;
    modal.style.display = "none";
  };

  const handlImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(e.target.files[0]);
    }
  };

  const handleUpdateMyInfo = async () => {
    let info: LooseObject = {};
    if (userName) {
      info["displayName"] = userName;
    }
    if (preview) {
      const id = user.email! as string;

      await db
        .addProfile({ userId: id, fileURL: preview })
        .then(async (res) => {
          const file_url = await getDownloadURL(res.ref);
          setProfileURL(file_url);
          info["photoURL"] = file_url;
        });
    }

    const auth = new Authentication();
    auth.updateUserInfo(info);
  };

  return (
    <Container>
      <LeftContainer>
        <ProfileWrapper>
          <EditProfile src="../edit.png" alt="" onClick={handleModalOpen} />
          <Profile
            src={`${
              user.profileImg ||
              user.photoURL ||
              "https://picsum.photos/200/300"
            }`}
            alt=""
          ></Profile>
        </ProfileWrapper>
        <h1>{user.name || user.displayName}</h1>
        <div>{user.email}</div>
      </LeftContainer>
      <RightContainer>
        <h1>내글 보기</h1>
        <hr></hr>
        {list?.map((item) => (
          <ListItem onClick={() => handleClick(item.id)}>
            <div>{item.title}</div>
            <div>{item.createDate}</div>
          </ListItem>
        ))}
      </RightContainer>
      <MypageModal id="mypage-modal">
        <div className="modal-content">
          <span className="close" onClick={handleModalClose}>
            &times;
          </span>
          <h1 className="modal-head">프로필 변경</h1>
          <InputContainer>
            <label htmlFor="name">
              <div>프로필 이미지 변경</div>
            </label>
            <input
              type="file"
              id="profile"
              placeholder=" "
              onChange={handlImageChange}
            />
            <p id="file-name"></p>
          </InputContainer>
          <InputContainer>
            <label htmlFor="name">
              <div>이름 변경</div>
            </label>
            <input
              type="text"
              id="name"
              placeholder=" "
              onChange={(e) => setUserName(e.target.value)}
            />
          </InputContainer>
          <button className="btnDefault saveBtn" onClick={handleUpdateMyInfo}>
            저장
          </button>
        </div>
      </MypageModal>
    </Container>
  );
}

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;

  input:not([type="file"]) {
    width: 100%;
    padding: 10px 10px 10px 0;
    font-size: 16px;
    border: none;
    border-bottom: 2px solid #ccc;
    background: transparent;
    transition: border-color 0.3s;
    outline: none;
  }
  input:focus {
    border-bottom: 2px solid #4285f4;
  }
`;
const MypageModal = styled.section`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 0;
  margin: 0;

  .saveBtn {
    width: 100%;
  }
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    border-radius: 4px;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 24px;
    font-weight: bold;
    margin-top: 0;
  }
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  .modal-head {
    margin-top: 0;
  }
`;
const Container = styled.section`
  display: flex;
  justify-content: flex;
  padding-top: 5rem;
  gap: 2rem;
  list-style: none;
`;
const LeftContainer = styled.div`
  width: 15rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
`;
const ProfileWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50%;
  min-height: 14rem;
`;
const EditProfile = styled.img`
  position: absolute;
  top: 20px;
  right: 10px;
  width: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  padding: 0.4rem;
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.06);
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.06);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.06);
`;
const Profile = styled.img`
  width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 50%;
`;
const RightContainer = styled.div`
  padding: 1rem;
  flex: 1;
`;
const ListItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #aeaeae;
  display: flex;
  justify-content: space-between;
`;
