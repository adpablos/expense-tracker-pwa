import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../store';
import { fetchCategories } from '../store/slices/categoriesSlice';

interface DataProviderProps {
  children: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.categories);
  const hasDispatchedRef = useRef(false);

  useEffect(() => {
    if (status === 'idle' && !hasDispatchedRef.current) {
      console.log('Dispatching fetchCategories from DataProvider');
      dispatch(fetchCategories());
      hasDispatchedRef.current = true;
    } else {
      console.log('DataProvider categories status:', status);
    }
  }, [dispatch, status]);

  return <>{children}</>;
};

export default DataProvider;
