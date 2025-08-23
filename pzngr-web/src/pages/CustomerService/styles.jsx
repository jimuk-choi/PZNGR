import styled from "styled-components";

export const CustomerServiceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px); /* 헤더 높이(100px)를 제외한 높이 */
  background-color: #f0f0f0;
`;

export const CustomerServiceText = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-size: 36px;
  color: #333333;
  font-weight: bold;
`;
