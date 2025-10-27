import { NextRequest, NextResponse } from 'next/server';
import { mockTransactions } from '@/data/mock-transactions';
import { Transaction, TransactionFilters } from '@/types/transaction';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') as 'date' | 'amount' || 'date';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

    let filteredTransactions = [...mockTransactions];

    // Filtrar por texto de búsqueda
    if (query) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (category) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.category === category
      );
    }

    // Ordenar
    filteredTransactions.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortBy === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = a.amount;
        bValue = b.amount;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return NextResponse.json({
      transactions: filteredTransactions,
      total: filteredTransactions.length
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
