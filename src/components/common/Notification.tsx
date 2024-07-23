import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const NotificationContainer = styled.div<{ type: 'success' | 'error' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: ${theme.padding.medium};
  border-radius: ${theme.borderRadius};
  background-color: ${props => props.type === 'success' ? theme.colors.success : theme.colors.error};
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  z-index: 1000;
`;

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => (
  <NotificationContainer type={type}>
    {message}
  </NotificationContainer>
);

export default Notification;