/* eslint-disable import/no-named-as-default */
import React, { useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styled from 'styled-components';

import { Category } from '../../types';
import Button from '../common/Button';

import EditModal from './EditModal';
import SubcategoryList from './SubcategoryList';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  margin-bottom: ${({ theme }) => theme.space.medium};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.medium};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CategoryName = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.small};
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.space.xsmall};
`;

const SubcategoriesSection = styled.div`
  padding: ${({ theme }) => theme.space.medium};
`;

const ToggleButton = styled(ActionButton)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xsmall};
`;

interface CategoryCardProps {
  category: Category;
  onUpdateCategory: (categoryId: string, newName: string) => void;
  onDeleteCategory: (categoryId: string, categoryName: string) => void;
  onCreateSubcategory: (categoryId: string, name: string) => void;
  onUpdateSubcategory: (subcategoryId: string, categoryId: string, newName: string) => void;
  onDeleteSubcategory: (subcategoryId: string, categoryId: string, subcategoryName: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onUpdateCategory,
  onDeleteCategory,
  onCreateSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CategoryHeader>
        <CategoryName>{category.name}</CategoryName>
        <ActionButtons>
          <ActionButton onClick={() => setIsEditing(true)}>
            <FaEdit />
          </ActionButton>
          <ActionButton
            variant="danger"
            onClick={() => onDeleteCategory(category.id, category.name)}
          >
            <FaTrash />
          </ActionButton>
          <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
            {category.subcategories?.length || 0} subcategorías
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </ToggleButton>
        </ActionButtons>
      </CategoryHeader>
      {isExpanded && (
        <SubcategoriesSection>
          <SubcategoryList
            subcategories={category.subcategories || []}
            categoryId={category.id}
            onCreateSubcategory={onCreateSubcategory}
            onUpdateSubcategory={onUpdateSubcategory}
            onDeleteSubcategory={onDeleteSubcategory}
          />
        </SubcategoriesSection>
      )}
      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={(newName) => onUpdateCategory(category.id, newName)}
        initialName={category.name}
        title="Editar Categoría"
      />
    </Card>
  );
};

export default CategoryCard;
