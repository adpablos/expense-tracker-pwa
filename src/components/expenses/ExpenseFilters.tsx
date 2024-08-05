import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.padding.small};
  margin-bottom: ${theme.padding.medium};
`;

const FilterInput = styled.input`
  padding: ${theme.padding.small};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

const FilterSelect = styled.select`
  padding: ${theme.padding.small};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

const FilterButton = styled.button`
  padding: ${theme.padding.small};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

interface ExpenseFiltersProps {
  onFilterChange: (filters: any) => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const handleApplyFilters = () => {
    const filters: any = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (category) filters.category = category;
    if (minAmount) filters.minAmount = parseFloat(minAmount);
    if (maxAmount) filters.maxAmount = parseFloat(maxAmount);
    onFilterChange(filters);
  };

  return (
    <FilterContainer>
      <FilterInput
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Fecha inicio"
      />
      <FilterInput
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="Fecha fin"
      />
      <FilterSelect value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Todas las categorías</option>
        {/* Aquí deberías mapear las categorías disponibles */}
      </FilterSelect>
      <FilterInput
        type="number"
        value={minAmount}
        onChange={(e) => setMinAmount(e.target.value)}
        placeholder="Monto mínimo"
      />
      <FilterInput
        type="number"
        value={maxAmount}
        onChange={(e) => setMaxAmount(e.target.value)}
        placeholder="Monto máximo"
      />
      <FilterButton onClick={handleApplyFilters}>Aplicar filtros</FilterButton>
    </FilterContainer>
  );
};

export default ExpenseFilters;