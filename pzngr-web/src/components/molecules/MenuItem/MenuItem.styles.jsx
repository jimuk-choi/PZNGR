import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { maxMedia } from "../../../shared/styles";

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &.active {
    color: inherit;
  }

  &:active,
  &:focus,
  &:visited {
    text-decoration: none;
    color: inherit;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.gray.medium};
  }

  ${maxMedia.tablet`
    p {
      font-size: ${({ theme }) => theme.fontSizes.md};
    }
  `}

  ${maxMedia.mobile`
    p {
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }
  `}
`;