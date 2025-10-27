export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  pending: boolean;
}

export interface TransactionFilters {
  query?: string;
  category?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionListProps {
  items: Transaction[];
  filters?: TransactionFilters;
  onFiltersChange?: (filters: TransactionFilters) => void;
}
