// User Types
export interface User {
  id: string;
  nim: string;
  name: string;
  email: string;
  angkatan: string;
  photo?: string;
  role: 'member' | 'admin' | 'pengurus';
}

// Auth Types
export interface LoginCredentials {
  identifier: string; // NIM or Email
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Activity Types
export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  category: string;
}

// Finance Types
export interface FinanceTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  receipt?: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// History Types
export interface Leader {
  id: string;
  name: string;
  position: 'ketua_himpunan' | 'ketua_angkatan' | 'ketua_ldk';
  period: string;
  photo?: string;
  angkatan?: string;
}