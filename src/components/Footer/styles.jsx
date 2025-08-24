import styled, { css } from "styled-components";
import { media, maxMedia } from "../../styles/breakpoints.jsx";

export const FooterContainer = styled.footer`
  background-color: #f4f3f9;
  width: 100%;
  padding: 64px 96px;
  display: flex;
  flex-direction: column;
  gap: 64px; /* Figma: gap-16 -> 64px */
  box-sizing: border-box;

  ${maxMedia.desktop`
    padding: 48px 64px;
    gap: 48px;
  `}

  ${maxMedia.tablet`
    padding: 32px 20px;
    gap: 32px;
  `}

  ${maxMedia.mobile`
    padding: 24px 16px;
    gap: 24px;
  `}
`;

export const TopBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const LogoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

export const LogoImage = styled.img`
  height: 55px;
  width: 200px;
  object-fit: contain;
  object-position: center;
`;

export const MidBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 48px;
  border-bottom: 0.5px solid rgba(160, 160, 160, 0.6);
  position: relative;

  ${maxMedia.tablet`
    flex-direction: column;
    gap: 32px;
    padding-bottom: 24px;
  `}
`;

export const LeftBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px; /* Figma: gap-8 -> 32px */
  align-items: flex-start;

  ${maxMedia.tablet`
    gap: 16px;
  `}
`;

export const RightBox = styled.div`
  display: flex;
  gap: 64px; /* Figma: gap-16 -> 64px */
  align-items: flex-start;

  ${maxMedia.tablet`
    flex-direction: column;
    gap: 32px;
  `}
`;

export const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px; /* Figma: gap-6 -> 24px */

  ${maxMedia.tablet`
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  `}
`;

export const LinkItem = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  white-space: nowrap;
  cursor: pointer;

  ${maxMedia.tablet`
    font-size: 14px;
  `}
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px; /* Figma: gap-6 -> 24px */
  align-items: flex-start;

  ${maxMedia.tablet`
    gap: 16px;
  `}
`;

export const InfoTitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  white-space: nowrap;
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* Figma: gap-3 -> 12px */
  align-items: flex-start;

  ${maxMedia.tablet`
    gap: 8px;
  `}
`;

export const InfoRow = styled.div`
  display: flex;
  gap: 16px; /* Figma: gap-4 -> 16px */
  align-items: flex-start;
  flex-wrap: wrap;

  ${maxMedia.tablet`
    flex-direction: column;
    gap: 8px;
  `}
`;

export const InfoItem = styled.div`
  display: flex;
  gap: 4px; /* Figma: gap-1 -> 4px */
  align-items: flex-start;
`;

export const InfoLabel = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  white-space: nowrap;
`;

export const InfoText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  color: #000000;
  white-space: nowrap;
`;

export const BottomBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 32px; /* Figma: gap-8 -> 32px */

  p {
    font-family: "Pretendard", sans-serif;
    font-size: 14px;
    color: #a0a0a0;
    white-space: nowrap;
  }

  ${maxMedia.tablet`
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 16px;

    p {
      text-align: left;
    }
  `}
`;

export const SNSBox = styled.div`
  display: flex;
  gap: 32px; /* Figma: gap-8 -> 32px */
  align-items: center;

  p {
    font-family: "Pretendard", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #000000;
    white-space: nowrap;
  }
`;

export const SNSIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;
