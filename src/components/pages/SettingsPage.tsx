/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';
import type { IconBaseProps } from 'react-icons';
import { FaUser, FaHome, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import styledComponents from 'styled-components';

import { useHouseholdContext } from '../../contexts/HouseholdContext';
import { AppDispatch, RootState } from '../../store';
import { updateProfile } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';
import Container from '../ui/Container';
import PageHeader from '../ui/PageHeader';

const PlusIcon = FaPlus as unknown as React.ComponentType<IconBaseProps>;

const PageContainer = styledComponents(Container)`
  max-width: 800px;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

// Title removed in favor of PageHeader

const Section = styledComponents.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styledComponents.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
  }
`;

const HouseholdGrid = styledComponents.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const HouseholdCard = styledComponents.div<{ isActive: boolean }>`
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.backgroundLight};
  color: ${({ isActive }) => (isActive ? 'white' : 'inherit')};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const HouseholdName = styledComponents.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const AddHouseholdCardBase = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Modal = styledComponents.div`
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

const ModalContent = styledComponents.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
`;

const SettingsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const { households, activeHousehold, setActiveHousehold, refreshHouseholds } =
    useHouseholdContext();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState('');

  // Utilizamos useEffect para registrar los hogares cuando el componente se monta o cuando cambian
  useEffect(() => {
    console.log('Households:', households);
  }, [households]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email }))
      .unwrap()
      .then(() => {
        console.log('Profile updated successfully');
      })
      .catch((error) => {
        console.error('Failed to update profile:', error);
      });
  };

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para crear un nuevo hogar
    await refreshHouseholds();
    setIsModalOpen(false);
    setNewHouseholdName('');
  };

  return (
    <PageContainer>
      <PageHeader title="Ajustes" subtitle="Tu cuenta y hogares" />
      <Section>
        <SectionTitle>
          <FaUser /> Perfil
        </SectionTitle>
        <form onSubmit={handleUpdateProfile}>
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Actualizar Perfil</Button>
        </form>
      </Section>
      <Section>
        <SectionTitle>
          <FaHome /> Hogares
        </SectionTitle>
        <HouseholdGrid>
          {households && households.length > 0 ? (
            households.map((household) => (
              <HouseholdCard
                key={household.id}
                isActive={activeHousehold?.id === household.id}
                onClick={() => setActiveHousehold(household)}
              >
                <HouseholdName>{household.name}</HouseholdName>
              </HouseholdCard>
            ))
          ) : (
            <p>No se encontraron hogares. Añade uno nuevo.</p>
          )}
          <AddHouseholdCardBase onClick={() => setIsModalOpen(true)}>
            <span>
              <PlusIcon />
            </span>
            <span>Añadir Hogar</span>
          </AddHouseholdCardBase>
        </HouseholdGrid>
      </Section>
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h2>Crear Nuevo Hogar</h2>
            <form onSubmit={handleCreateHousehold}>
              <Input
                type="text"
                value={newHouseholdName}
                onChange={(e) => setNewHouseholdName(e.target.value)}
                placeholder="Nombre del hogar"
                required
              />
              <Button type="submit">Crear</Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default SettingsPage;
