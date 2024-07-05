import styled from "styled-components";

export const Wrapper = styled.div`
    width : 100%;
    height : 100%;
    display : flex;
    flex-direction : row;
    justify-content : center;
    align-items : center;
`;

export const FormWrapper = styled.form`
    display : flex;
    flex-direction : column;
    padding : 20px ;
    border : 1px solid #aeaeae;
    border-radius : 20px;
    gap : 20px;

    div {
        flex : 1;
    }

    div input {
        width : 100%;
    }
`;