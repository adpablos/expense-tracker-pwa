/* eslint-disable import/no-named-as-default */
// src/components/categories/SubcategoryList.tsx

import React from 'react';
import styled from 'styled-components';

import { Subcategory } from '../../types';

import SubcategoryItem from './SubcategoryItem';

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

interface SubcategoryListProps {
  subcategories: Subcategory[];
  categoryId: string;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ subcategories, categoryId }) => {
  if (!subcategories || subcategories.length === 0) {
    return <p>No hay subcategorías</p>;
  }

  return (
    <List>
      {subcategories.map((subcategory) => (
        <SubcategoryItem key={subcategory.id} subcategory={subcategory} categoryId={categoryId} />
      ))}
    </List>
  );
};

export default SubcategoryList;
