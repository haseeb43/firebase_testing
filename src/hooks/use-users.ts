
'use client';

import { UsersContext } from '@/contexts/users-provider';
import { useContext } from 'react';

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
