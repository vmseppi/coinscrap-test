import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsList from '../TransactionsList';
import { Transaction } from '@/types/transaction';

const mockTransactions: Transaction[] = [
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
  }
];

describe('TransactionsList', () => {
  it('debería renderizar la lista de transacciones', () => {
    render(<TransactionsList initialTransactions={mockTransactions} />);
    
    expect(screen.getByText('Supermercado DIA')).toBeInTheDocument();
    expect(screen.getByText('Nómina')).toBeInTheDocument();
    expect(screen.getByText('Transacciones (2)')).toBeInTheDocument();
  });

  it('debería mostrar estado vacío cuando no hay transacciones', () => {
    render(<TransactionsList initialTransactions={[]} />);
    
    expect(screen.getByText('No se encontraron transacciones')).toBeInTheDocument();
  });

  it('debería filtrar transacciones por texto de búsqueda', async () => {
    const user = userEvent.setup();
    render(<TransactionsList initialTransactions={mockTransactions} />);
    
    const searchInput = screen.getByLabelText('Buscar');
    
    await act(async () => {
      await user.type(searchInput, 'Supermercado');
    });
    
    expect(screen.getByText('Supermercado DIA')).toBeInTheDocument();
    expect(screen.queryByText('Nómina')).not.toBeInTheDocument();
  });
});
