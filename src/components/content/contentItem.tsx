import React, { memo, useEffect, useState } from "react";
import { Content } from "../../d";
import styled from "styled-components";
import { editableInputTypes } from "@testing-library/user-event/dist/utils";
import Database from "../../service/database";
import { getDownloadURL } from "firebase/storage";

interface ProfileSmProps {
  contentProfile: string;
}

export const ContentItem = memo(
  ({
    item,
    handleClick,
  }: {
    item: Content;
    handleClick: (param: string) => void;
  }) => {
    const { id, title, writer, createDate, updateDate, contents, imgUrl } =
      item;
    const [mainImg, setMainImg] = useState<string>("");
    const [contentProfile, setContentProfile] = useState<string>("");
    const db = new Database();

    const handleReadContent = () => {
      handleClick(id);
    };

    useEffect(() => {
      // console.log("writer=>", writer);
      async function fetchMainImg() {
        // console.log(imgUrl);
        const data = await db.getURL(id, imgUrl[0]);
        if (data) setMainImg(data);
      }
      if (imgUrl?.length > 0) fetchMainImg();

      async function fetchProfileImg() {
        const data = await db.getProfileImg(writer);
        if (data) {
          const file_url = await getDownloadURL(data.items[0]);
          if (file_url) setContentProfile(file_url);
        }
      }
      fetchProfileImg();
    }, []);

    return (
      <ContentContainer onClick={handleReadContent}>
        {mainImg && <ImgWrapper src={mainImg} />}
        <MetaWrapper>
          <h3>{title}</h3>
          <div>{createDate}</div>
        </MetaWrapper>
        <UserInfoWrapper>
          <ProfileSm profile={contentProfile}></ProfileSm>
          <div>{writer}</div>
        </UserInfoWrapper>
      </ContentContainer>
    );
  }
);

const ContentContainer = styled.section`
  background: #fff;
  border-radius: 10px;
  height: 420px;
  overflow: hidden;
  border: 0.5px solid mainLightGrey;
  box-shadow: 1px 4px 15px 0px rgba(0, 0, 0, 0.03);
  -webkit-box-shadow: 1px 4px 15px 0px rgba(0, 0, 0, 0.03);
  -moz-box-shadow: 1px 4px 15px 0px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
`;

const ImgWrapper = styled.img`
  width: 100%;
  max-height: 50%;
  min-height: 50%;
  object-fit: cover;
`;

const MetaWrapper = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  flex: 1 100%;
`;

const UserInfoWrapper = styled.div`
  border-top: 0.5px solid #aeaeae;
  padding: 1rem;
  font-size: 14px;
  color: #aeaeae;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileSm = styled.div<{ profile: string }>`
  background-color: #aeaeae;
  width: 25px;
  height: 25px;
  overflow: hidden;
  border-radius: 50%;
  background: url(${(props) => props.profile});
  background-size: 100% 100%;
`;
