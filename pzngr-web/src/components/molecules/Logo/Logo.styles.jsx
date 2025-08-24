import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;

  &.active {
    color: inherit;
  }

  &:active,
  &:focus,
  &:visited {
    text-decoration: none;
    color: inherit;
  }
`;