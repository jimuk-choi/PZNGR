import styled from "styled-components";
import { maxMedia } from "../../../shared/styles";

export const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxxxxl} ${({ theme }) => theme.spacing.xxxxxxl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxxxl};
  box-sizing: border-box;

  ${maxMedia.desktopM`
    padding: ${({ theme }) => theme.spacing.xxxxl} ${({ theme }) => theme.spacing.xxxxxl};
    gap: ${({ theme }) => theme.spacing.xxxxl};
  `}

  ${maxMedia.tablet`
    padding: ${({ theme }) => theme.spacing.xxxl} ${({ theme }) => theme.spacing.xl};
    gap: ${({ theme }) => theme.spacing.xxxl};
  `}

  ${maxMedia.mobile`
    padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.xxl};
  `}
`;

export const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const MidSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.xxxxl};
  border-bottom: ${({ theme }) => theme.borders.light};
  position: relative;
  gap: ${({ theme }) => theme.spacing.xxxxxl};

  ${maxMedia.tablet`
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xxxl};
    padding-bottom: ${({ theme }) => theme.spacing.xxl};
  `}
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxl};
  align-items: flex-start;

  ${maxMedia.tablet`
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

export const RightSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxxxxl};
  align-items: flex-start;

  ${maxMedia.tablet`
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xxxl};
  `}
`;

export const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxl};

  ${maxMedia.tablet`
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  `}
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
  align-items: flex-start;

  ${maxMedia.tablet`
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

export const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;

  ${maxMedia.tablet`
    gap: ${({ theme }) => theme.spacing.sm};
  `}
`;

export const InfoRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
  flex-wrap: wrap;

  ${maxMedia.tablet`
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  `}
`;

export const BottomSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxxl};

  ${maxMedia.tablet`
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

export const SNSGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxxl};
  align-items: center;
`;