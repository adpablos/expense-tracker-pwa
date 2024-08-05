import React, { useState } from 'react';
import styled from 'styled-components';
import { Expense } from '../../types';

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 5px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface EditExpenseModalProps {
    expense: Expense;
    onSave: (updatedExpense: Expense) => void;
    onCancel: () => void;
  }
  
  const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, onSave, onCancel }) => {
    const [editedExpense, setEditedExpense] = useState<Expense>(expense);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditedExpense(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(editedExpense);
    };
  
    return (
      <ModalOverlay>
        <ModalContent>
          <h2>Edit Expense</h2>
          <Form onSubmit={handleSubmit}>
            <Input
              name="description"
              value={editedExpense.description}
              onChange={handleChange}
              placeholder="Description"
            />
            <Input
              name="amount"
              type="text"
              value={editedExpense.amount}
              onChange={handleChange}
              placeholder="Amount"
            />
            <Input
              name="category"
              value={editedExpense.category}
              onChange={handleChange}
              placeholder="Category"
            />
            <Input
              name="subcategory"
              value={editedExpense.subcategory}
              onChange={handleChange}
              placeholder="Subcategory"
            />
            <Input
              name="date"
              type="date"
              value={editedExpense.date.split('T')[0]} // Assuming the date is in ISO format
              onChange={handleChange}
            />
            <Button type="submit">Save Changes</Button>
            <Button type="button" onClick={onCancel}>Cancel</Button>
          </Form>
        </ModalContent>
      </ModalOverlay>
    );
  };
  
  export default EditExpenseModal;