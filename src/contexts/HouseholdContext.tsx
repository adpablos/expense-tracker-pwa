import React, { createContext, useContext, ReactNode } from 'react';

import { useHouseholds, Household } from '../hooks/useHouseholds';

interface HouseholdContextType {
  households: Household[];
  activeHousehold: Household | null;
  setActiveHousehold: (household: Household | null) => void;
  refreshHouseholds: () => Promise<void>;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export const useHouseholdContext = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHouseholdContext must be used within a HouseholdProvider');
  }
  return context;
};

interface HouseholdProviderProps {
  children: ReactNode;
}

export const HouseholdProvider: React.FC<HouseholdProviderProps> = ({ children }) => {
  const { households, activeHousehold, setActiveHousehold, refreshHouseholds } = useHouseholds();

  return (
    <HouseholdContext.Provider
      value={{ households, activeHousehold, setActiveHousehold, refreshHouseholds }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};
