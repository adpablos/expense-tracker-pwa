/* eslint-disable import/no-named-as-default */
// src/components/categories/CategoryList.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import { deleteCategory, deleteSubcategory } from '../../store/slices/categoriesSlice';

import CategoryItem from './CategoryItem';

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);

  const handleDeleteCategory = (categoryId: string) => {
    dispatch(deleteCategory(categoryId));
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    dispatch(deleteSubcategory({ categoryId, subcategoryId }));
  };

  return (
    <List>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onDeleteCategory={handleDeleteCategory}
          onDeleteSubcategory={handleDeleteSubcategory}
        />
      ))}
    </List>
  );
};

export default CategoryList;
