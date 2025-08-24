import styled from "styled-components";

export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xxxxxxl} 0;
`;

export const MyPageTitle = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxxxl};
  text-align: center;
`;

export const MyPageContent = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MenuSection = styled.div`
  width: 100%;
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

export const MenuItem = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: ${({ theme }) => theme.borders.light};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;