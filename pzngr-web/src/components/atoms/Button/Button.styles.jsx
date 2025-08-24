import styled from "styled-components";

const underlineDefault = "http://localhost:3845/assets/03aea4e981334f84dae8abe1fe83caa0840343c6.svg";
const underlineHovered = "http://localhost:3845/assets/503b522eba8da988b8f962ce8deacb71ddeeda05.svg";

export const StyledButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;

  .button-text {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: ${({ theme }) => theme.fontWeights.normal};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.black};
    white-space: nowrap;
    line-height: normal;
  }

  .underline {
    width: 100%;
    height: 1px;
    position: relative;
    
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-image: url(${underlineDefault});
      background-size: cover;
      background-repeat: no-repeat;
      opacity: ${props => props.state === "hovered" ? 1 : 0};
      transition: opacity ${({ theme }) => theme.transitions.fast};
    }
  }

  &:hover {
    .underline::after {
      background-image: url(${underlineHovered});
      opacity: 1;
    }
  }

  ${props => props.state === "hovered" && `
    .underline::after {
      background-image: url(${underlineHovered});
      opacity: 1;
    }
  `}
`;