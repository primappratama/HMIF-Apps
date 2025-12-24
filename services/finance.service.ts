export interface FinanceTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  createdBy: string;
  createdAt: string;
}

// Mock finance database
let transactions: FinanceTransaction[] = [
  {
    id: '1',
    title: 'Iuran Anggota Bulan Desember',
    amount: 5000000,
    type: 'income',
    category: 'Iuran',
    description: 'Iuran bulanan dari 100 anggota @ Rp 50.000',
    date: '2024-12-01',
    createdBy: 'Admin HMIF',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Pembelian Konsumsi Workshop',
    amount: 1500000,
    type: 'expense',
    category: 'Acara',
    description: 'Snack dan makan siang untuk 50 peserta workshop',
    date: '2024-12-15',
    createdBy: 'Admin HMIF',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Sponsorship Perusahaan X',
    amount: 10000000,
    type: 'income',
    category: 'Sponsorship',
    description: 'Sponsorship untuk acara seminar teknologi',
    date: '2024-12-10',
    createdBy: 'Admin HMIF',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Sewa Tempat Acara',
    amount: 3000000,
    type: 'expense',
    category: 'Acara',
    description: 'Sewa aula untuk seminar 1 hari',
    date: '2024-12-12',
    createdBy: 'Admin HMIF',
    createdAt: new Date().toISOString(),
  },
];

export const getAllTransactions = async (): Promise<FinanceTransaction[]> => {
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getTransactionsByType = async (type: 'income' | 'expense'): Promise<FinanceTransaction[]> => {
  return transactions
    .filter(t => t.type === type)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getTransactionById = async (id: string): Promise<FinanceTransaction | null> => {
  return transactions.find(t => t.id === id) || null;
};

export const createTransaction = async (
  title: string,
  amount: number,
  type: 'income' | 'expense',
  category: string,
  description: string,
  date: string,
  createdBy: string
): Promise<FinanceTransaction> => {
  const newTransaction: FinanceTransaction = {
    id: Date.now().toString(),
    title,
    amount,
    type,
    category,
    description,
    date,
    createdBy,
    createdAt: new Date().toISOString(),
  };
  
  transactions.push(newTransaction);
  return newTransaction;
};

export const updateTransaction = async (
  id: string,
  updates: Partial<FinanceTransaction>
): Promise<FinanceTransaction> => {
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Transaksi tidak ditemukan');
  }
  
  transactions[index] = { ...transactions[index], ...updates };
  return transactions[index];
};

export const deleteTransaction = async (id: string): Promise<void> => {
  transactions = transactions.filter(t => t.id !== id);
};

export const getFinanceSummary = async () => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    balance,
  };
};

export const getTransactionsByCategory = async () => {
  const categoryMap: { [key: string]: number } = {};
  
  transactions.forEach(t => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }
    categoryMap[t.category] += t.type === 'income' ? t.amount : -t.amount;
  });
  
  return Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
  }));
};