/* eslint-disable import/no-named-as-default */
import React from 'react';
import styled from 'styled-components';

import Button from './Button';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.space.small};
  margin-top: ${({ theme }) => theme.space.medium};
`;

const Ellipsis = styled.span`
  padding: ${({ theme }) => theme.space.xsmall};
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxDisplayedPages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxDisplayedPages = 5,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const halfMax = Math.floor(maxDisplayedPages / 2);

    let startPage = Math.max(currentPage - halfMax, 2);
    const endPage = Math.min(startPage + maxDisplayedPages - 3, totalPages - 1);

    if (endPage - startPage + 1 < maxDisplayedPages - 2) {
      startPage = Math.max(endPage - maxDisplayedPages + 3, 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
      {currentPage > 1 && (
        <Button onClick={() => onPageChange(currentPage - 1)} variant="secondary">
          Anterior
        </Button>
      )}
      <Button onClick={() => onPageChange(1)} variant={currentPage === 1 ? 'primary' : 'secondary'}>
        1
      </Button>
      {currentPage > 3 && <Ellipsis>...</Ellipsis>}
      {getPageNumbers().map((number) => (
        <Button
          key={number}
          onClick={() => onPageChange(number)}
          variant={currentPage === number ? 'primary' : 'secondary'}
        >
          {number}
        </Button>
      ))}
      {currentPage < totalPages - 2 && <Ellipsis>...</Ellipsis>}
      {totalPages > 1 && (
        <Button
          onClick={() => onPageChange(totalPages)}
          variant={currentPage === totalPages ? 'primary' : 'secondary'}
        >
          {totalPages}
        </Button>
      )}
      {currentPage < totalPages && (
        <Button onClick={() => onPageChange(currentPage + 1)} variant="secondary">
          Siguiente
        </Button>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
