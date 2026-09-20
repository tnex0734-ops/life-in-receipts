import { HouseholdSummary, Receipt } from '../types/receipt';

export interface HouseholdTransaction {
  date: string;
  mode: string;
  category: string;
  subcategory: string;
  note: string;
  amount: number;
  incomeExpense: string;
  currency: string;
}

export function parseHouseholdRecord(row: Record<string, string>): Receipt {
  const amount = parseFloat(row.Amount) || 0;
  return {
    id: `hh-${Math.random()}`,
    source: 'household',
    timestamp: row.Date ? new Date(row.Date).getTime() : 0,
    dateStr: row.Date || '',
    title: row.Note || row.Subcategory || row.Category || 'Household Item',
    subtitle: `${row.Category || 'Household'}${row.Subcategory ? ' • ' + row.Subcategory : ''}`,
    category: row.Category || 'Household',
    amount,
    currency: row.Currency || 'INR',
    tags: [row.Mode || 'Cash', row['Income/Expense'] || 'Expense', row.Subcategory].filter(Boolean) as string[]
  };
}
