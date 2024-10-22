import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useCallback, useRef } from 'react';

import api from '../services/api';

export interface Household {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const useHouseholds = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [activeHousehold, setActiveHousehold] = useState<Household | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const fetchedRef = useRef(false);

  const fetchHouseholds = useCallback(async () => {
    if (fetchedRef.current) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await api.get('/users/me/households', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHouseholds(response.data);
      if (response.data.length > 0 && !activeHousehold) {
        setActiveHousehold(response.data[0]);
      }
      fetchedRef.current = true;
    } catch (error) {
      console.error('Error fetching households:', error);
    }
  }, [getAccessTokenSilently, activeHousehold]);

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  const setActiveHouseholdSafely = useCallback((household: Household | null) => {
    setActiveHousehold(household);
  }, []);

  return {
    households,
    activeHousehold,
    setActiveHousehold: setActiveHouseholdSafely,
    refreshHouseholds: fetchHouseholds,
  };
};
