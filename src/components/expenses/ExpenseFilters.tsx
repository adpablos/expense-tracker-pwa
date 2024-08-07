import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import 'react-datepicker/dist/react-datepicker.css';
import { FilterValues } from '../../types/filters';
// eslint-disable-next-line import/no-named-as-default
import Button from '../common/Button';

const FilterContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 1rem;
  padding: ${({ theme }) => theme.space.small};

  &:hover {
    text-decoration: underline;
  }
`;

const FilterContent = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  padding: ${({ theme }) => theme.space.medium};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-top: ${({ theme }) => theme.space.small};
`;

const FilterForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.space.small};
  flex-wrap: wrap;
`;

interface ExpenseFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ onFilterChange, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(currentFilters);

  const handleDateChange = (date: Date | null, name: 'startDate' | 'endDate') => {
    setFilters((prev) => ({ ...prev, [name]: date }));
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
        {isOpen ? (
          <FaChevronUp style={{ marginLeft: '0.5rem' }} />
        ) : (
          <FaChevronDown style={{ marginLeft: '0.5rem' }} />
        )}
      </FilterToggle>
      <FilterContent isOpen={isOpen}>
        <FilterForm onSubmit={handleSubmit}>
          <DatePicker
            selected={filters.startDate}
            onChange={(date: Date | null) => handleDateChange(date, 'startDate')}
            selectsStart
            startDate={filters.startDate || undefined}
            endDate={filters.endDate || undefined}
            dateFormat="yyyy/MM/dd"
            placeholderText="Fecha inicio"
            locale="es"
          />
          <DatePicker
            selected={filters.endDate}
            onChange={(date: Date | null) => handleDateChange(date, 'endDate')}
            selectsEnd
            startDate={filters.startDate || undefined}
            endDate={filters.endDate || undefined}
            dateFormat="yyyy/MM/dd"
            placeholderText="Fecha fin"
            locale="es"
          />
          <Button variant="primary" type="submit">
            Aplicar filtros
          </Button>
        </FilterForm>
      </FilterContent>
    </FilterContainer>
  );
};

export default ExpenseFilters;
