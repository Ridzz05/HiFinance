// lib/types.ts
// Shared TypeScript types untuk TMA dashboard

export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  created_at: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlySummary {
  period: {
    year: number;
    month: number;
    label: string;
  };
  total_income: number;
  total_expense: number;
  balance: number;
  expense_by_category: CategorySummary[];
  transaction_count: number;
}
