/* eslint-disable import/no-named-as-default */
import { Field, ErrorMessage } from 'formik';
import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const StyledInput = styled(Field)`
  width: 100%;
  padding: ${({ theme }) => theme.space.small} ${({ theme }) => theme.space.medium};
  padding-left: 35px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const InputIcon = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-top: ${({ theme }) => theme.space.xsmall};
  position: absolute;
`;

interface FormFieldProps {
  name: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ name, type, placeholder, icon }) => (
  <InputWrapper>
    <InputIcon>{icon}</InputIcon>
    <StyledInput name={name} type={type} placeholder={placeholder} />
    <ErrorMessage name={name} component={ErrorText} />
  </InputWrapper>
);

export default FormField;
