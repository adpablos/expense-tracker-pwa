/* eslint-disable import/no-named-as-default */
import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import { fetchExpenses } from '../../store/slices/expensesSlice';
import { theme } from '../../styles/theme';
import { Margin, Padding } from '../../styles/utilities';
import Button from '../common/Button';

const ChartWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.padding.medium};
`;

const DateSelector = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.primary};
`;

const MonthDisplay = styled.span`
  min-width: 150px;
  text-align: center;
`;

const ChartContainer = styled.div`
  height: 300px;
  padding: ${({ theme }) => theme.padding.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 250px;
  }
`;

const TotalExpenses = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.large};
  padding: ${({ theme }) => theme.padding.medium};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.text};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface ChartData {
  name: string;
  value: number;
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: {
    percent: number;
  };
}

const MonthlyExpensesChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.items);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    dispatch(
      fetchExpenses({
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
      })
    ).then(() => setIsLoading(false));
  }, [dispatch, currentDate]);

  useEffect(() => {
    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        const category = expense.category;
        acc[category] = (acc[category] || 0) + Number(expense.amount);
        return acc;
      },
      {} as Record<string, number>
    );

    const data = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));

    setChartData(data);
    setTotalExpenses(data.reduce((sum, item) => sum + item.value, 0));
  }, [expenses]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>{payload[0].name}</strong>
          </p>
          <p
            style={{ margin: 0 }}
          >{`${payload[0].value.toFixed(2)}€ (${(payload[0].payload.percent * 100).toFixed(0)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const changeMonth = (increment: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  return (
    <ChartWrapper>
      <ChartHeader>
        <Button variant="secondary" onClick={() => changeMonth(-1)} isRound>
          <FaChevronLeft />
        </Button>
        <Margin size="medium" direction="horizontal">
          <DateSelector>
            <MonthDisplay>{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</MonthDisplay>
          </DateSelector>
        </Margin>
        <Button variant="secondary" onClick={() => changeMonth(1)} isRound>
          <FaChevronRight />
        </Button>
      </ChartHeader>
      {isLoading ? (
        <Padding size="large">
          <p>Cargando datos...</p>
        </Padding>
      ) : chartData.length > 0 ? (
        <>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <TotalExpenses>
            <strong>Total gastado este mes:</strong>
            <br />
            <span style={{ fontSize: '1.5em', color: theme.colors.primary }}>
              ${totalExpenses.toFixed(2)}
            </span>
          </TotalExpenses>
        </>
      ) : (
        <Padding size="large">
          <p>No hay gastos registrados para este mes.</p>
        </Padding>
      )}
    </ChartWrapper>
  );
};

export default MonthlyExpensesChart;
