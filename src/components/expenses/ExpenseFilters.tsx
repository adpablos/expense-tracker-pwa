/* eslint-disable import/no-named-as-default */
import React, { useState } from 'react';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styled from 'styled-components';

import { FilterValues } from '../../types/filters';
import { dateToString, stringToDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';

const FilterContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const FilterToggle = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const FilterContent = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  padding: ${({ theme }) => theme.space.medium};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top: none;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.medium}
    ${({ theme }) => theme.borderRadius.medium};
`;

const FilterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.medium};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const DatePickerWrapper = styled.div`
  flex: 1;
`;

interface ExpenseFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ onFilterChange, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(currentFilters);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleDateChange = (date: Date | null, name: 'startDate' | 'endDate') => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: date ? dateToString(date) : null };

      // Validate that the end date is not before the start date
      if (newFilters.startDate && newFilters.endDate) {
        const start = stringToDate(newFilters.startDate);
        const end = stringToDate(newFilters.endDate);
        if (start && end && end < start) {
          setDateError('La fecha de fin no puede ser anterior a la fecha de inicio');
        } else {
          setDateError(null);
        }
      } else {
        setDateError(null);
      }

      return newFilters;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateError) {
      onFilterChange(filters);
      setIsOpen(false);
    }
  };

  const getDateOrUndefined = (dateString: string | null): Date | undefined => {
    if (dateString) {
      const date = stringToDate(dateString);
      return date || undefined;
    }
    return undefined;
  };

  return (
    <FilterContainer>
      <FilterToggle onClick={() => setIsOpen(!isOpen)}>
        <span>
          <FaFilter style={{ marginRight: '0.5rem' }} />
          {isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        </span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </FilterToggle>
      <FilterContent isOpen={isOpen}>
        <FilterForm onSubmit={handleSubmit}>
          <DatePickerWrapper>
            <DatePicker
              selected={filters.startDate ? stringToDate(filters.startDate) : null}
              onChange={(date: Date | null) => handleDateChange(date, 'startDate')}
              selectsStart
              startDate={getDateOrUndefined(filters.startDate)}
              endDate={getDateOrUndefined(filters.endDate)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Fecha inicio"
            />
          </DatePickerWrapper>
          <DatePickerWrapper>
            <DatePicker
              selected={filters.endDate ? stringToDate(filters.endDate) : null}
              onChange={(date: Date | null) => handleDateChange(date, 'endDate')}
              selectsEnd
              startDate={getDateOrUndefined(filters.startDate)}
              endDate={getDateOrUndefined(filters.endDate)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Fecha fin"
            />
          </DatePickerWrapper>
          <Button variant="primary" type="submit">
            Aplicar filtros
          </Button>
        </FilterForm>
      </FilterContent>
    </FilterContainer>
  );
};

export default ExpenseFilters;
