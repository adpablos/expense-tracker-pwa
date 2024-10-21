/* eslint-disable import/no-named-as-default */
import React, { useState, useCallback } from 'react';
import {
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaTag,
  FaListUl,
  FaDollarSign,
  FaSearch,
} from 'react-icons/fa';
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

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const ResetLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FilterContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  padding: ${({ theme }) => theme.space.medium};
`;

const FilterForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.space.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FilterItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.space.xsmall};
  color: ${({ theme }) => theme.colors.textLight};
`;

const LabelIcon = styled.span`
  margin-right: ${({ theme }) => theme.space.xsmall};
  color: ${({ theme }) => theme.colors.primary};
`;

const ApplyButton = styled(Button)`
  grid-column: 1 / -1;
  margin-top: ${({ theme }) => theme.space.medium};
`;

interface ExpenseFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

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
    const resetFilters: FilterValues = {
      startDate: null,
      endDate: null,
      category: null,
      subcategory: null,
      amount: null,
      description: null,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  }, [onFilterChange]);

  return (
    <FilterContainer>
      <FilterHeader>
        <FilterToggle onClick={() => setIsOpen(!isOpen)}>
          <FaFilter style={{ marginRight: '0.5rem' }} />
          {isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
          {isOpen ? (
            <FaChevronUp style={{ marginLeft: '0.5rem' }} />
          ) : (
            <FaChevronDown style={{ marginLeft: '0.5rem' }} />
          )}
        </FilterToggle>
        <ResetLink onClick={handleReset}>Resetear filtros</ResetLink>
      </FilterHeader>
      <FilterContent $isOpen={isOpen}>
        <FilterForm onSubmit={handleSubmit}>
          <FilterItem>
            <FilterLabel>
              <LabelIcon>
                <FaCalendarAlt />
              </LabelIcon>
              Fecha inicio
            </FilterLabel>
            <DatePicker
              selected={filters.startDate ? stringToDate(filters.startDate) : null}
              onChange={(date: Date | null) => handleDateChange(date, 'startDate')}
              dateFormat="yyyy/MM/dd"
              placeholderText="Fecha inicio"
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel>
              <LabelIcon>
                <FaCalendarAlt />
              </LabelIcon>
              Fecha fin
            </FilterLabel>
            <DatePicker
              selected={filters.endDate ? stringToDate(filters.endDate) : null}
              onChange={(date: Date | null) => handleDateChange(date, 'endDate')}
              dateFormat="yyyy/MM/dd"
              placeholderText="Fecha fin"
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel>
              <LabelIcon>
                <FaTag />
              </LabelIcon>
              Categoría
            </FilterLabel>
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
            <FilterLabel>
              <LabelIcon>
                <FaListUl />
              </LabelIcon>
              Subcategoría
            </FilterLabel>
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
            <FilterLabel>
              <LabelIcon>
                <FaDollarSign />
              </LabelIcon>
              Cantidad
            </FilterLabel>
            <Input
              name="amount"
              type="number"
              value={filters.amount || ''}
              onChange={handleInputChange}
              placeholder="Cantidad"
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel>
              <LabelIcon>
                <FaSearch />
              </LabelIcon>
              Descripción
            </FilterLabel>
            <Input
              name="description"
              type="text"
              value={filters.description || ''}
              onChange={handleInputChange}
              placeholder="Descripción (búsqueda parcial)"
            />
          </FilterItem>
          <ApplyButton variant="primary" type="submit">
            Aplicar filtros
          </ApplyButton>
        </FilterForm>
      </FilterContent>
    </FilterContainer>
  );
};

export default ExpenseFilters;
