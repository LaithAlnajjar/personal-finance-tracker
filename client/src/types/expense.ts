export type Expense = {
  id: number;
  title?: string;
  amount: number;
  category?: {
    id: string;
    name: string;
  };
  merchant?: string;
  date: string;
  notes?: string;
};
