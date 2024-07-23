import React, { memo, useEffect, useState } from "react";
import { Content } from "../../d";
import styled from "styled-components";
import { editableInputTypes } from "@testing-library/user-event/dist/utils";
import Database from "../../service/database";

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
    const [mainImg, setMainImg] = useState<string | null>(null);
    const db = new Database();

    const handleReadContent = () => {
      handleClick(id);
    };

    const downloadURL = async () => {
      if (imgUrl) {
        const result = await db.getURL(id, imgUrl);
        console.log(result);
        setMainImg(result);
      }
    };

    useEffect(() => {
      // if (!contents) return;
      // const dom = document.createElement("div");
      // dom.innerHTML = contents;
      // const mainImg = dom.getElementsByTagName("img")[0]?.src;
      // if (mainImg) {
      //   setMainImg(mainImg);
      // }
      downloadURL();
    }, [contents]);

    console.log(mainImg);

    return (
      <ContentContainer onClick={handleReadContent}>
        {mainImg && <ImgWrapper src={mainImg} />}
        <MetaWrapper>
          <h3>{title}</h3>
          <div>{createDate}</div>
        </MetaWrapper>
        <UserInfoWrapper>
          <ProfileSm>profile</ProfileSm>
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
  gap: 0.5rem;
`;

const ProfileSm = styled.div`
  background-color: #aeaeae;
  width: 18px;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
`;
