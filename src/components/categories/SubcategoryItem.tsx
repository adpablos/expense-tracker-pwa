/* eslint-disable import/no-named-as-default */
import React, { useState } from 'react';
import type { IconBaseProps } from 'react-icons';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

import { Subcategory } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  margin-bottom: ${({ theme }) => theme.space.xsmall};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const Name = styled.span`
  flex-grow: 1;
  margin-right: ${({ theme }) => theme.space.small};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xsmall};
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.space.xsmall};
`;

interface SubcategoryItemProps {
  subcategory: Subcategory;
  categoryId: string;
  onUpdateSubcategory: (subcategoryId: string, categoryId: string, newName: string) => void;
  onDeleteSubcategory: (subcategoryId: string, categoryId: string, subcategoryName: string) => void;
}

const SubcategoryItem: React.FC<SubcategoryItemProps> = ({
  subcategory,
  categoryId,
  onUpdateSubcategory,
  onDeleteSubcategory,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subcategory.name);

  const handleUpdate = () => {
    if (editName.trim() && editName !== subcategory.name) {
      onUpdateSubcategory(subcategory.id, categoryId, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(subcategory.name);
    setIsEditing(false);
  };

  const EditIcon = FaEdit as unknown as React.ComponentType<IconBaseProps>;
  const TrashIcon = FaTrash as unknown as React.ComponentType<IconBaseProps>;
  const SaveIcon = FaSave as unknown as React.ComponentType<IconBaseProps>;
  const TimesIcon = FaTimes as unknown as React.ComponentType<IconBaseProps>;

  if (isEditing) {
    return (
      <Item>
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleUpdate}
          autoFocus
        />
        <Actions>
          <ActionButton onClick={handleUpdate}>
            <SaveIcon />
          </ActionButton>
          <ActionButton onClick={handleCancel}>
            <TimesIcon />
          </ActionButton>
        </Actions>
      </Item>
    );
  }

  return (
    <Item>
      <Name>{subcategory.name}</Name>
      <Actions>
        <ActionButton onClick={() => setIsEditing(true)}>
          <EditIcon />
        </ActionButton>
        <ActionButton
          variant="danger"
          onClick={() => onDeleteSubcategory(subcategory.id, categoryId, subcategory.name)}
        >
          <TrashIcon />
        </ActionButton>
      </Actions>
    </Item>
  );
};

export default SubcategoryItem;
