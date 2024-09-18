import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Database from "../../service/database";
import { ContentItem } from "../content/contentItem";
import styled from "styled-components";

const ContentsList = () => {
  const navigate = useNavigate();
  const db = new Database();
  const [contentList, setContentList] = useState([]);

  const getAllContent = async () => {
    const result = await db.getAllContent();
    setContentList(result);
  };

  useEffect(() => {
    getAllContent();
  }, []);

  const handleClick = (param: string) => {
    navigate(`/viewPost/${param}`);
  };

  return (
    <ContentListContainer>
      {Object.values(contentList).map((item, index) => (
        <ContentItem key={index} item={item} handleClick={handleClick} />
      ))}
    </ContentListContainer>
  );
};

export default ContentsList;

const ContentListContainer = styled.section`
  max-width: 1440px;
  display: grid;

  gap: 20px 20px;
  padding: 0 1rem;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 5rem;

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1032px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
