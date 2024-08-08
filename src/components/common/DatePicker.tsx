import { es } from 'date-fns/locale';
import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import 'react-datepicker/dist/react-datepicker.css';

// Registrar el locale español
registerLocale('es', es);

const DatePickerContainer = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: ${({ theme }) => theme.space.xsmall};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  .react-datepicker {
    font-family: ${({ theme }) => theme.fonts.body};
    border-color: ${({ theme }) => theme.colors.border};
  }

  .react-datepicker__header {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    border-bottom-color: ${({ theme }) => theme.colors.border};
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    color: ${({ theme }) => theme.colors.text};
  }

  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    color: ${({ theme }) => theme.colors.text};
  }

  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    background-color: ${({ theme }) => theme.colors.backgroundDark};
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholderText?: string;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  dateFormat = 'yyyy/MM/dd',
  placeholderText = 'Selecciona una fecha',
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  ...props
}) => {
  return (
    <DatePickerContainer>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat={dateFormat}
        locale="es"
        placeholderText={placeholderText}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        startDate={startDate}
        endDate={endDate}
        {...props}
      />
    </DatePickerContainer>
  );
};

export default CustomDatePicker;
