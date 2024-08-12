import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

import Button from '../common/Button';
import Input from '../common/Input';

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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space.large};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const InputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space.xsmall};
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space.small};
`;

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  initialName: string;
  title: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialName, title }) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  const handleSave = () => {
    onSave(name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>
          <FaEdit style={{ marginRight: '0.5rem' }} /> {title}
        </Title>
        <InputContainer>
          <Label htmlFor="name">Nombre:</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Introduce el nuevo nombre"
          />
        </InputContainer>
        <ButtonGroup>
          <Button variant="secondary" onClick={onClose}>
            <FaTimes /> Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <FaSave /> Guardar
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditModal;
