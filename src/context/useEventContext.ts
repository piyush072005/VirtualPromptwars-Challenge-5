import { useContext } from 'react';
import { EventContext } from './EventContextInstance';

export { type TabType } from './EventContextInstance';

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
