// src/components/categories/CategoryList.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import LoadingOverlay from '../common/LoadingOverlay';

import CategoryCard from './CategoryCard';

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.space.medium};
`;

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status, error } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <LoadingOverlay message="Cargando categorías..." />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <List>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </List>
  );
};

export default CategoryList;
