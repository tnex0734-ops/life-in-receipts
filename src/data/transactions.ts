import { TransactionSummary, Receipt } from '../types/receipt';

export interface CardTransaction {
  transId: string;
  transDate: string;
  merchant: string;
  category: string;
  amt: number;
  city?: string;
  state?: string;
}

export function parseTransactionRecord(row: Record<string, string>): Receipt {
  // SENSITIVE FIELDS STRIPPED: cc_num, customer_id, street, dob
  const merchant = (row.merchant || 'Merchant').replace(/^fraud_/i, '').replace(/ Pvt Ltd/i, '').trim();
  const amt = parseFloat(row.amt) || 0;
  return {
    id: `tx-${row.trans_id || Math.random()}`,
    source: 'transaction',
    timestamp: row.trans_date_trans_time ? new Date(row.trans_date_trans_time).getTime() : 0,
    dateStr: row.trans_date_trans_time || '',
    title: merchant,
    subtitle: `${row.category || 'General'}${row.city ? ' • ' + row.city : ''}`,
    category: row.category || 'General',
    amount: amt,
    currency: 'INR',
    tags: [row.category || 'General', row.city, row.state].filter(Boolean) as string[]
  };
}
