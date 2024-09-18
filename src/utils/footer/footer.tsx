import React, { memo } from "react";
import { styled } from "styled-components";

const Footer = memo(() => {
  return (
    <FooterWrapper>
      <div>© 2024, wnwlals13 All rights reserved.</div>
    </FooterWrapper>
  );
});

export default Footer;

const FooterWrapper = styled.div`
  color: #aeaeae;
  display: flex;
  justify-content: center;
  padding: 1rem;
  // position: sticky;
  // bottom: 0;
`;
