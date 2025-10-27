import { Transaction } from '@/types/transaction';

export const mockTransactions: Transaction[] = [
  {
    id: "tx_001",
    date: "2025-08-02",
    description: "Supermercado DIA",
    amount: -37.45,
    category: "Groceries",
    account: "ES98...1234",
    pending: false
  },
  {
    id: "tx_002",
    date: "2025-08-03",
    description: "Nómina",
    amount: 1450.00,
    category: "Income",
    account: "ES98...1234",
    pending: false
  },
  {
    id: "tx_003",
    date: "2025-08-04",
    description: "Netflix",
    amount: -12.99,
    category: "Subscriptions",
    account: "ES98...1234",
    pending: false
  },
  {
    id: "tx_004",
    date: "2025-08-04",
    description: "Café",
    amount: -2.10,
    category: "Dining",
    account: "ES98...1234",
    pending: true
  }
];
