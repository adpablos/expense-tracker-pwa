import React from 'react';
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
  width: 300px;
  text-align: center;
`;

const Button = styled.button`
  margin: 10px;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

interface DeleteConfirmModalProps {
  expense: Expense;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ expense, onConfirm, onCancel }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete the expense: {expense.description}?</p>
        <Button onClick={onConfirm}>Yes, Delete</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteConfirmModal;