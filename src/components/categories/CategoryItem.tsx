// src/components/categories/CategoryItem.tsx

import React, { useState } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import styled from 'styled-components';

import { Category } from '../../types';

import SubcategoryForm from './SubcategoryForm';

const Item = styled.li`
  margin-bottom: ${({ theme }) => theme.space.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.space.medium};
`;

const CategoryName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.space.small};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.small};
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
`;

const SubcategoryList = styled.ul`
  list-style-type: none;
  padding-left: ${({ theme }) => theme.space.medium};
`;

interface CategoryItemProps {
  category: Category;
  onDeleteCategory: (categoryId: string) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onDeleteCategory,
  onDeleteSubcategory,
}) => {
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);

  return (
    <Item>
      <CategoryName>{category.name}</CategoryName>
      <ButtonGroup>
        <Button onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}>
          <FaPlus /> Añadir Subcategoría
        </Button>
        <Button onClick={() => onDeleteCategory(category.id)}>
          <FaTrash /> Eliminar Categoría
        </Button>
      </ButtonGroup>
      {isAddingSubcategory && (
        <SubcategoryForm
          categoryId={category.id}
          onComplete={() => setIsAddingSubcategory(false)}
        />
      )}
      <SubcategoryList>
        {category.subcategories.map((subcategory) => (
          <li key={subcategory.id}>
            {subcategory.name}
            <Button onClick={() => onDeleteSubcategory(category.id, subcategory.id)}>
              <FaTrash />
            </Button>
          </li>
        ))}
      </SubcategoryList>
    </Item>
  );
};

export default CategoryItem;
