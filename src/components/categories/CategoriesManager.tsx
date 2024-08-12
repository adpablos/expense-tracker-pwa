/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../../store/slices/categoriesSlice';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';
import ErrorModal from '../common/ErrorModal';
import Input from '../common/Input';
import SuccessModal from '../common/SuccessModal';

import EditModal from './EditModal';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.medium};
`;

const AddCategoryForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.space.small};
  margin-bottom: ${({ theme }) => theme.space.large};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: ${({ theme }) => theme.space.medium};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StyledInput = styled(Input)`
  flex-grow: 1;
  min-width: 0;
`;

const CategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-bottom: ${({ theme }) => theme.space.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.medium};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  cursor: pointer;
`;

const CategoryName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.small};
`;

const SubcategoryList = styled.ul<{ isExpanded: boolean }>`
  list-style-type: none;
  padding: ${({ theme }) => theme.space.medium};
  display: ${(props) => (props.isExpanded ? 'block' : 'none')};
`;

const SubcategoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.small};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const CategoriesManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status } = useSelector((state: RootState) => state.categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryNames, setNewSubcategoryNames] = useState<{ [key: string]: string }>({});
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{
    id: string;
    categoryId: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      try {
        await dispatch(createCategory({ name: newCategoryName })).unwrap();
        setSuccessMessage('Categoría creada con éxito');
        setNewCategoryName('');
      } catch (error) {
        setErrorMessage(`Error al crear la categoría: ${error}`);
      }
    }
  };

  const handleUpdateCategory = async (categoryId: string, newName: string) => {
    try {
      await dispatch(updateCategory({ id: categoryId, name: newName })).unwrap();
      setSuccessMessage('Categoría actualizada con éxito');
      setEditingCategory(null);
    } catch (error) {
      setErrorMessage(`Error al actualizar la categoría: ${error}`);
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    setConfirmMessage(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`);
    setConfirmAction(() => async () => {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        setSuccessMessage('Categoría eliminada con éxito');
      } catch (error) {
        setErrorMessage(`Error al eliminar la categoría: ${error}`);
      }
    });
  };

  const handleCreateSubcategory = async (categoryId: string) => {
    const name = newSubcategoryNames[categoryId];
    if (name && name.trim()) {
      try {
        await dispatch(createSubcategory({ categoryId, name: name.trim() })).unwrap();
        setSuccessMessage('Subcategoría creada con éxito');
        setNewSubcategoryNames((prev) => ({ ...prev, [categoryId]: '' }));
      } catch (error) {
        setErrorMessage(`Error al crear la subcategoría: ${error}`);
      }
    }
  };

  const handleUpdateSubcategory = async (
    subcategoryId: string,
    categoryId: string,
    newName: string
  ) => {
    try {
      await dispatch(updateSubcategory({ id: subcategoryId, name: newName, categoryId })).unwrap();
      setSuccessMessage('Subcategoría actualizada con éxito');
      setEditingSubcategory(null);
    } catch (error) {
      setErrorMessage(`Error al actualizar la subcategoría: ${error}`);
    }
  };

  const handleDeleteSubcategory = (
    subcategoryId: string,
    categoryId: string,
    subcategoryName: string
  ) => {
    setConfirmMessage(
      `¿Estás seguro de que quieres eliminar la subcategoría "${subcategoryName}"?`
    );
    setConfirmAction(() => async () => {
      try {
        await dispatch(deleteSubcategory({ categoryId, subcategoryId })).unwrap();
        setSuccessMessage('Subcategoría eliminada con éxito');
      } catch (error) {
        setErrorMessage(`Error al eliminar la subcategoría: ${error}`);
      }
    });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  return (
    <Container>
      <AddCategoryForm onSubmit={handleCreateCategory}>
        <StyledInput
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre de la nueva categoría"
        />
        <Button type="submit">
          <FaPlus /> Añadir Categoría
        </Button>
      </AddCategoryForm>

      <CategoryList>
        {categories.map((category) => (
          <CategoryItem key={category.id}>
            <CategoryHeader onClick={() => toggleCategory(category.id)}>
              <CategoryName>{category.name}</CategoryName>
              <ActionButtons>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCategory({ id: category.id, name: category.name });
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id, category.name);
                  }}
                >
                  <FaTrash />
                </Button>
                {expandedCategories[category.id] ? <FaChevronUp /> : <FaChevronDown />}
              </ActionButtons>
            </CategoryHeader>
            <SubcategoryList isExpanded={expandedCategories[category.id] || false}>
              {category.subcategories?.map((subcategory) => (
                <SubcategoryItem key={subcategory.id}>
                  <span>{subcategory.name}</span>
                  <ActionButtons>
                    <Button
                      onClick={() =>
                        setEditingSubcategory({
                          id: subcategory.id,
                          categoryId: category.id,
                          name: subcategory.name,
                        })
                      }
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDeleteSubcategory(subcategory.id, category.id, subcategory.name)
                      }
                    >
                      <FaTrash />
                    </Button>
                  </ActionButtons>
                </SubcategoryItem>
              ))}
              <SubcategoryItem>
                <Input
                  placeholder="Nueva subcategoría"
                  value={newSubcategoryNames[category.id] || ''}
                  onChange={(e) =>
                    setNewSubcategoryNames((prev) => ({ ...prev, [category.id]: e.target.value }))
                  }
                />
                <Button onClick={() => handleCreateSubcategory(category.id)}>
                  <FaPlus /> Añadir
                </Button>
              </SubcategoryItem>
            </SubcategoryList>
          </CategoryItem>
        ))}
      </CategoryList>

      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage(null)}
        title={successMessage || ''}
      />
      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction) {
            confirmAction();
            setConfirmAction(null);
          }
        }}
        message={confirmMessage}
      />
      <EditModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={(newName) => editingCategory && handleUpdateCategory(editingCategory.id, newName)}
        initialName={editingCategory?.name || ''}
        title="Editar Categoría"
      />
      <EditModal
        isOpen={!!editingSubcategory}
        onClose={() => setEditingSubcategory(null)}
        onSave={(newName) =>
          editingSubcategory &&
          handleUpdateSubcategory(editingSubcategory.id, editingSubcategory.categoryId, newName)
        }
        initialName={editingSubcategory?.name || ''}
        title="Editar Subcategoría"
      />
    </Container>
  );
};

export default CategoriesManager;
