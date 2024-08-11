/* eslint-disable import/no-named-as-default */
// src/components/categories/SubcategoryItem.tsx

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { updateSubcategory, deleteSubcategory } from '../../store/slices/categoriesSlice';
import { Subcategory } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.xsmall};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xsmall};
`;

interface SubcategoryItemProps {
  subcategory: Subcategory;
  categoryId: string;
}

const SubcategoryItem: React.FC<SubcategoryItemProps> = ({ subcategory, categoryId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subcategory.name);
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdate = () => {
    if (editName.trim() && editName !== subcategory.name) {
      dispatch(updateSubcategory({ id: subcategory.id, name: editName, categoryId }));
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteSubcategory({ categoryId, subcategoryId: subcategory.id }));
  };

  if (isEditing) {
    return (
      <ListItem>
        <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
        <ButtonGroup>
          <Button size="small" onClick={handleUpdate}>
            <FaSave />
          </Button>
          <Button size="small" variant="secondary" onClick={() => setIsEditing(false)}>
            <FaTimes />
          </Button>
        </ButtonGroup>
      </ListItem>
    );
  }

  return (
    <ListItem>
      {subcategory.name}
      <ButtonGroup>
        <Button size="small" onClick={() => setIsEditing(true)}>
          <FaEdit />
        </Button>
        <Button size="small" variant="danger" onClick={handleDelete}>
          <FaTrash />
        </Button>
      </ButtonGroup>
    </ListItem>
  );
};

export default SubcategoryItem;
