/* eslint-disable import/no-named-as-default */
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import styled from 'styled-components';

import { Subcategory } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

import SubcategoryItem from './SubcategoryItem';

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const AddSubcategoryForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.space.small};
  margin-top: ${({ theme }) => theme.space.medium};
`;

const AddButton = styled(Button)`
  flex-shrink: 0;
`;

interface SubcategoryListProps {
  subcategories: Subcategory[];
  categoryId: string;
  onCreateSubcategory: (categoryId: string, name: string) => void;
  onUpdateSubcategory: (subcategoryId: string, categoryId: string, newName: string) => void;
  onDeleteSubcategory: (subcategoryId: string, categoryId: string, subcategoryName: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  subcategories,
  categoryId,
  onCreateSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
}) => {
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubcategoryName.trim()) {
      onCreateSubcategory(categoryId, newSubcategoryName.trim());
      setNewSubcategoryName('');
    }
  };

  return (
    <>
      <List>
        {subcategories.map((subcategory) => (
          <SubcategoryItem
            key={subcategory.id}
            subcategory={subcategory}
            categoryId={categoryId}
            onUpdateSubcategory={onUpdateSubcategory}
            onDeleteSubcategory={onDeleteSubcategory}
          />
        ))}
      </List>
      <AddSubcategoryForm onSubmit={handleSubmit}>
        <Input
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          placeholder="Nueva subcategoría"
        />
        <AddButton type="submit">
          <FaPlus /> Añadir
        </AddButton>
      </AddSubcategoryForm>
    </>
  );
};

export default SubcategoryList;
