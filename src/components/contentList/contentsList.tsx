import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Database from "../../service/database";
import Footer from "../../utils/footer/footer.jsx";
// import Navbar from "../../utils/navbar/navbar.tsx";
import { ContentItem } from "../content/contentItem";
// import styles from "./contentsList.module.css";
import styled from "styled-components";

const ContentsList = () => {
  const navigate = useNavigate();
  const db = new Database();

  // const historyId = navigate?.location?.state;
  const [contentList, setContentList] = useState([]);

  const getAllContent = async () => {
    const result = await db.getAllContent();
    setContentList(result);
  };

  useEffect(() => {
    getAllContent();
    console.log(contentList);
  }, []);

  const oneArticle = (result: string) => {
    // navigate("/viewPost", {
    //   state: {
    //     id: historyId ? historyId.id : null,
    //     name: historyId ? historyId.name : null,
    //     // email: historyId ? historyId.email : null,
    //     article: result,
    //   },
    // });
  };

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
  width: 100%;
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
