import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Export typed hooks for usage in components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);