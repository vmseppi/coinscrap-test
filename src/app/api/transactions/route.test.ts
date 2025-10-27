import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock de los datos
jest.mock('@/data/mock-transactions', () => ({
  mockTransactions: [
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
  ]
}));

describe('/api/transactions', () => {
  it('debería devolver todas las transacciones sin filtros', async () => {
    const request = new NextRequest('http://localhost:3000/api/transactions');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.transactions).toHaveLength(3);
    expect(data.total).toBe(3);
  });

  it('debería filtrar por categoría', async () => {
    const request = new NextRequest('http://localhost:3000/api/transactions?category=Groceries');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.transactions).toHaveLength(1);
    expect(data.transactions[0].category).toBe('Groceries');
  });

  it('debería filtrar por texto de búsqueda', async () => {
    const request = new NextRequest('http://localhost:3000/api/transactions?query=Netflix');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.transactions).toHaveLength(1);
    expect(data.transactions[0].description).toBe('Netflix');
  });

  it('debería ordenar por fecha descendente por defecto', async () => {
    const request = new NextRequest('http://localhost:3000/api/transactions');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.transactions[0].date).toBe('2025-08-04'); // Más reciente
    expect(data.transactions[2].date).toBe('2025-08-02'); // Más antigua
  });

  it('debería ordenar por importe ascendente', async () => {
    const request = new NextRequest('http://localhost:3000/api/transactions?sortBy=amount&sortOrder=asc');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.transactions[0].amount).toBe(-37.45); // Menor importe
    expect(data.transactions[2].amount).toBe(1450.00); // Mayor importe
  });

  it('debería combinar filtros correctamente', async () => {
    const request = new NextRequest('http://localhost:3000/api/transactions?query=Supermercado&category=Groceries');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.transactions).toHaveLength(1);
    expect(data.transactions[0].description).toBe('Supermercado DIA');
    expect(data.transactions[0].category).toBe('Groceries');
  });
});
