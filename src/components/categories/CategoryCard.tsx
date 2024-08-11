/* eslint-disable import/no-named-as-default */
// src/components/categories/CategoryCard.tsx

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { deleteCategory } from '../../store/slices/categoriesSlice';
import { Category } from '../../types';
import Button from '../common/Button';

import CategoryForm from './CategoryForm';
import SubcategoryForm from './SubcategoryForm';
import SubcategoryList from './SubcategoryList';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.space.medium};
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const CategoryName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.space.small};
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.small};
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const StyledButton = styled(Button)`
  flex: 1;
  min-width: 100px;
`;

const SubcategoryFormContainer = styled.div`
  margin-top: ${({ theme }) => theme.space.small};
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConfirmationContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space.medium};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-align: center;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space.small};
  margin-top: ${({ theme }) => theme.space.medium};
`;

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteCategory = () => {
    setCategoryToDelete(category);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete.id));
      setCategoryToDelete(null);
    }
  };

  return (
    <Card>
      <CategoryName>{category.name}</CategoryName>
      <ButtonGroup>
        <StyledButton size="small" onClick={() => setIsEditing(!isEditing)}>
          <FaEdit /> {isEditing ? 'Cancelar' : 'Editar'}
        </StyledButton>
        <StyledButton size="small" variant="danger" onClick={handleDeleteCategory}>
          <FaTrash /> Eliminar
        </StyledButton>
        <StyledButton size="small" onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}>
          <FaPlus /> {isAddingSubcategory ? 'Cancelar' : 'Subcategoría'}
        </StyledButton>
      </ButtonGroup>
      {isEditing && (
        <CategoryForm categoryToEdit={category} onComplete={() => setIsEditing(false)} />
      )}
      {isAddingSubcategory && (
        <SubcategoryFormContainer>
          <SubcategoryForm
            categoryId={category.id}
            onComplete={() => setIsAddingSubcategory(false)}
          />
        </SubcategoryFormContainer>
      )}
      <SubcategoryList subcategories={category.subcategories} categoryId={category.id} />

      {categoryToDelete && (
        <ConfirmationModal>
          <ConfirmationContent>
            <p>
              ¿Estás seguro de que quieres eliminar la categoría &quot;{categoryToDelete.name}
              &quot;?
            </p>
            <ConfirmationButtons>
              <Button variant="secondary" onClick={() => setCategoryToDelete(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDeleteCategory}>
                Eliminar
              </Button>
            </ConfirmationButtons>
          </ConfirmationContent>
        </ConfirmationModal>
      )}
    </Card>
  );
};

export default CategoryCard;
