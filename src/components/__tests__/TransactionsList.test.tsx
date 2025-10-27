import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsList from '../TransactionsList';
import { Transaction } from '@/types/transaction';

// Mock de fetch
global.fetch = jest.fn();

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
  },
  {
    id: "tx_003",
    date: "2025-08-04",
    description: "Netflix",
    amount: -12.99,
    category: "Subscriptions",
    account: "ES98...1234",
    pending: false
  }
];

describe('TransactionsList', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('debería renderizar la lista de transacciones', () => {
    render(<TransactionsList initialTransactions={mockTransactions} />);
    
    expect(screen.getByText('Supermercado DIA')).toBeInTheDocument();
    expect(screen.getByText('Nómina')).toBeInTheDocument();
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('debería mostrar el contador de transacciones', () => {
    render(<TransactionsList initialTransactions={mockTransactions} />);
    
    expect(screen.getByText('Transacciones (3)')).toBeInTheDocument();
  });

  it('debería filtrar por texto de búsqueda', async () => {
    const user = userEvent.setup();
    render(<TransactionsList initialTransactions={mockTransactions} />);
    
    const searchInput = screen.getByLabelText('Buscar');
    await user.type(searchInput, 'Netflix');
    
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.queryByText('Supermercado DIA')).not.toBeInTheDocument();
    expect(screen.queryByText('Nómina')).not.toBeInTheDocument();
  });

  it('debería filtrar por categoría', async () => {
    const user = userEvent.setup();
    render(<TransactionsList initialTransactions={mockTransactions} />);
    
    const categorySelect = screen.getByLabelText('Categoría');
    await user.selectOptions(categorySelect, 'Groceries');
    
    expect(screen.getByText('Supermercado DIA')).toBeInTheDocument();
    expect(screen.queryByText('Nómina')).not.toBeInTheDocument();
    expect(screen.queryByText('Netflix')).not.toBeInTheDocument();
  });

  it('debería ordenar por importe', async () => {
    const user = userEvent.setup();
    render(<TransactionsList initialTransactions={mockTransactions} />);
    
    const sortBySelect = screen.getByLabelText('Ordenar por');
    await user.selectOptions(sortBySelect, 'amount');
    
    const sortOrderSelect = screen.getByLabelText('Orden');
    await user.selectOptions(sortOrderSelect, 'asc');
    
    // Verificar que las transacciones están ordenadas por importe ascendente
    const transactionItems = screen.getAllByRole('listitem');
    expect(transactionItems[0]).toHaveTextContent('-37,45 €');
    expect(transactionItems[1]).toHaveTextContent('-12,99 €');
    expect(transactionItems[2]).toHaveTextContent('1.450,00 €');
  });

  it('debería mostrar estado de carga', async () => {
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ transactions: mockTransactions })
      }), 100))
    );

    render(<TransactionsList />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Cargando transacciones...')).toBeInTheDocument();
  });

  it('debería mostrar estado de error', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Error de red'));

    render(<TransactionsList />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error: Error de red')).toBeInTheDocument();
    });
  });

  it('debería mostrar estado vacío cuando no hay transacciones', () => {
    render(<TransactionsList initialTransactions={[]} />);
    
    expect(screen.getByText('No se encontraron transacciones')).toBeInTheDocument();
  });

  it('debería formatear correctamente los importes', () => {
    render(<TransactionsList initialTransactions={mockTransactions} />);
    
    expect(screen.getByText('-37,45 €')).toBeInTheDocument();
    expect(screen.getByText('1.450,00 €')).toBeInTheDocument();
    expect(screen.getByText('-12,99 €')).toBeInTheDocument();
  });

  it('debería mostrar el indicador de transacción pendiente', () => {
    const transactionsWithPending: Transaction[] = [
      ...mockTransactions,
      {
        id: "tx_004",
        date: "2025-08-05",
        description: "Café",
        amount: -2.10,
        category: "Dining",
        account: "ES98...1234",
        pending: true
      }
    ];

    render(<TransactionsList initialTransactions={transactionsWithPending} />);
    
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });
});
