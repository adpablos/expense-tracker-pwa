import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const FilterContainer = styled.div`
  margin-bottom: ${theme.padding.medium};
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  font-size: 1rem;
  padding: ${theme.padding.small};

  &:hover {
    text-decoration: underline;
  }
`;

const FilterContent = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  padding: ${theme.padding.medium};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  margin-top: ${theme.padding.small};
`;

const FilterForm = styled.form`
  display: flex;
  gap: ${theme.padding.small};
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: ${theme.padding.small};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

const FilterButton = styled.button`
  padding: ${theme.padding.small} ${theme.padding.medium};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

interface FilterValues {
  startDate: string;
  endDate: string;
}

interface ExpenseFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ onFilterChange, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(currentFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <FilterContainer>
      <FilterToggle onClick={() => setIsOpen(!isOpen)}>
        <FaFilter style={{ marginRight: '0.5rem' }} />
        {isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        {isOpen ? <FaChevronUp style={{ marginLeft: '0.5rem' }} /> : <FaChevronDown style={{ marginLeft: '0.5rem' }} />}
      </FilterToggle>
      <FilterContent isOpen={isOpen}>
        <FilterForm onSubmit={handleSubmit}>
          <FilterInput
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleInputChange}
            placeholder="Fecha inicio"
          />
          <FilterInput
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleInputChange}
            placeholder="Fecha fin"
          />
          <FilterButton type="submit">Aplicar filtros</FilterButton>
        </FilterForm>
      </FilterContent>
    </FilterContainer>
  );
};

export default ExpenseFilters;