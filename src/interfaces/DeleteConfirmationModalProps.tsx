import { Expense } from '../types';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  expense: Expense | null;
  onConfirm: () => void;
  onCancel: () => void;
}