// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import ExpenseForm from './components/expenses/ExpenseForm';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1>Expense Tracker</h1>
          <ExpenseForm />
        </header>
      </div>
    </Provider>
  );
};

export default App;
