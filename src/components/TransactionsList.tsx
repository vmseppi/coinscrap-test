'use client';

import { useState, useMemo } from 'react';
import { Transaction, TransactionFilters } from '@/types/transaction';

interface TransactionsListProps {
  initialTransactions?: Transaction[];
}

export default function TransactionsList({ initialTransactions }: TransactionsListProps) {
  const [filters, setFilters] = useState<TransactionFilters>({
    query: '',
    category: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Usar datos del servidor (RSC) como fuente principal
  const transactions = initialTransactions || [];

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(transactions.map(t => t.category))
    );
    return uniqueCategories;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Aplicar filtros localmente
    if (filters.query) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(filters.query!.toLowerCase()) ||
        transaction.category.toLowerCase().includes(filters.query!.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(transaction =>
        transaction.category === filters.category
      );
    }

    // Aplicar ordenación localmente
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (filters.sortBy === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = a.amount;
        bValue = b.amount;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, filters]);

  const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  // Estados de carga y error

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="search">
              Buscar
            </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar transacciones..."
              value={filters.query}
              onChange={(e) => handleFilterChange({ query: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
              Categoría
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sortBy">
              Ordenar por
            </label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as 'date' | 'amount' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Fecha</option>
              <option value="amount">Importe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sortOrder">
              Orden
            </label>
            <select
              id="sortOrder"
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de transacciones */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Transacciones ({filteredTransactions.length})
          </h2>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="text-gray-500 mb-2">📄</div>
              <p className="text-gray-600">No se encontraron transacciones</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="px-6 py-4 hover:bg-gray-50 focus-within:bg-gray-50"
                role="listitem"
                tabIndex={0}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {transaction.description}
                      </h3>
                      {transaction.pending && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Pendiente
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatDate(transaction.date)}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {transaction.category}
                      </span>
                      <span>{transaction.account}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-semibold ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatAmount(transaction.amount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}