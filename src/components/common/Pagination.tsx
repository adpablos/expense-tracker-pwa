import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${theme.padding.large};
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: ${theme.padding.small} ${theme.padding.medium};
  margin: 0 ${theme.padding.small};
  background-color: ${props => props.isActive ? theme.colors.primary : theme.colors.background};
  color: ${props => props.isActive ? theme.colors.background : theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.primaryHover};
    color: ${theme.colors.background};
  }

  &:disabled {
    background-color: ${theme.colors.disabled};
    color: ${theme.colors.textLight};
    cursor: not-allowed;
  }
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <PaginationContainer>
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Anterior
      </PageButton>
      {pageNumbers.map(number => (
        <PageButton
          key={number}
          onClick={() => onPageChange(number)}
          isActive={currentPage === number}
        >
          {number}
        </PageButton>
      ))}
      <PageButton 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Siguiente
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;