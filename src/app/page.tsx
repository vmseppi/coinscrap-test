import TransactionsList from '@/components/TransactionsList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lista de Transacciones
          </h1>
          <p className="text-gray-600">
            Filtra y ordena tus transacciones financieras
          </p>
        </div>
        
        <TransactionsList />
      </main>
    </div>
  );
}
