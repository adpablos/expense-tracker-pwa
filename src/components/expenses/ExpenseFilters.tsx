/* eslint-disable import/no-named-as-default */
import React, { useState, useCallback } from 'react';
import { FaFilter, FaChevronDown, FaChevronUp, FaUndo } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '../../store';
import { FilterValues } from '../../types/filters';
import { dateToString, stringToDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import Input from '../common/Input';
import Select from '../common/Select';

const FilterContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const FilterToggle = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.space.medium};
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const FilterContent = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  padding: ${({ theme }) => theme.space.medium};
`;

const FilterForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.space.medium};
`;

const FilterItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.space.xsmall};
  color: ${({ theme }) => theme.colors.textLight};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.medium};
  grid-column: 1 / -1;
  margin-top: ${({ theme }) => theme.space.medium};
`;

const ResetButton = styled(Button)`
  flex: 1;
`;

const ApplyButton = styled(Button)`
  flex: 1;
`;

interface ExpenseFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

const initialFilters: FilterValues = {
  startDate: null,
  endDate: null,
  category: null,
  subcategory: null,
  amount: null,
  description: null,
};

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ onFilterChange, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(currentFilters);
  const [dateError, setDateError] = useState<string | null>(null);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const subcategories = useSelector((state: RootState) => state.categories.subcategories);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value || null }));
  };

  const handleDateChange = (date: Date | null, name: 'startDate' | 'endDate') => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: date ? dateToString(date) : null };

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

  const handleReset = useCallback(() => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  }, [onFilterChange]);

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
          <FilterItem>
            <FilterLabel>Fecha inicio</FilterLabel>
            <DatePicker
              selected={filters.startDate ? stringToDate(filters.startDate) : null}
              onChange={(date: Date | null) => handleDateChange(date, 'startDate')}
              dateFormat="yyyy/MM/dd"
              placeholderText="Fecha inicio"
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel>Fecha fin</FilterLabel>
            <DatePicker
              selected={filters.endDate ? stringToDate(filters.endDate) : null}
              onChange={(date: Date | null) => handleDateChange(date, 'endDate')}
              dateFormat="yyyy/MM/dd"
              placeholderText="Fecha fin"
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel>Categoría</FilterLabel>
            <Select
              name="category"
              value={filters.category || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Todas las categorías' },
                ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
              ]}
              placeholder="Categoría"
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel>Subcategoría</FilterLabel>
            <Select
              name="subcategory"
              value={filters.subcategory || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Todas las subcategorías' },
                ...subcategories
                  .filter(
                    (sub) =>
                      !filters.category ||
                      sub.categoryId === categories.find((cat) => cat.name === filters.category)?.id
                  )
                  .map((sub) => ({ value: sub.name, label: sub.name })),
              ]}
              placeholder="Subcategoría"
              disabled={!filters.category}
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel>Cantidad</FilterLabel>
            <Input
              name="amount"
              type="number"
              value={filters.amount || ''}
              onChange={handleInputChange}
              placeholder="Cantidad"
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel>Descripción</FilterLabel>
            <Input
              name="description"
              type="text"
              value={filters.description || ''}
              onChange={handleInputChange}
              placeholder="Descripción (búsqueda parcial)"
            />
          </FilterItem>
          <ButtonContainer>
            <ResetButton variant="secondary" type="button" onClick={handleReset}>
              <FaUndo /> Resetear filtros
            </ResetButton>
            <ApplyButton variant="primary" type="submit">
              Aplicar filtros
            </ApplyButton>
          </ButtonContainer>
        </FilterForm>
      </FilterContent>
    </FilterContainer>
  );
};

export default ExpenseFilters;
