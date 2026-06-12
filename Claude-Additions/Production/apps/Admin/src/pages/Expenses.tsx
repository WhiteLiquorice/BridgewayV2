/**
 * Expenses — entry form + profitability summary. (Tier 3, Expense Tracking)
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCallable } from '../../../shared/hooks/useCallable';
import { Card, StatCard, Button, Alert, SimpleBarChart } from '../../../shared/components/ui';

const CATEGORIES = ['supplies', 'rent', 'utilities', 'marketing', 'payroll', 'equipment', 'other'];

interface Profitability {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number | null;
  byCategory: Record<string, number>;
  byMonth: { month: string; revenue: number; expenses: number; profit: number }[];
}

const currency = (n: number) => `$${(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function Expenses() {
  const { orgId } = useAuth();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('supplies');
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<Profitability | null>(null);

  const { call: record, loading: saving, error: saveError } = useCallable<object, { id: string }>('recordExpense');
  const { call: getProfitability, loading } = useCallable<object, Profitability>('getProfitability');

  const loadData = async () => {
    if (!orgId) return;
    const rangeEnd = new Date().toISOString();
    const rangeStart = new Date(Date.now() - 180 * 86400000).toISOString();
    const result = await getProfitability({ orgId, rangeStart, rangeEnd });
    if (result) setData(result);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const submit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    const result = await record({ orgId, amount: amt, category, description });
    if (result) {
      setSaved(true);
      setAmount('');
      setDescription('');
      loadData();
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Expenses & Profitability</h1>
        <p className="text-sm text-gray-500">Last 6 months.</p>
      </div>

      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Revenue" value={currency(data.totalRevenue)} />
          <StatCard label="Expenses" value={currency(data.totalExpenses)} />
          <StatCard label="Net Profit" value={currency(data.netProfit)} />
          <StatCard label="Margin" value={data.profitMargin != null ? `${data.profitMargin}%` : '—'} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Record Expense">
          <div className="space-y-3">
            {saveError && <Alert kind="error">{saveError.message}</Alert>}
            {saved && <Alert kind="success">Expense recorded.</Alert>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Monthly supply order"
              />
            </div>
            <Button onClick={submit} loading={saving} disabled={!amount}>Record</Button>
          </div>
        </Card>

        <Card title="Expenses by Category">
          {data && Object.keys(data.byCategory).length > 0 ? (
            <SimpleBarChart
              data={Object.entries(data.byCategory).map(([label, value]) => ({ label, value }))}
              formatValue={currency}
            />
          ) : (
            <p className="text-sm text-gray-500">{loading ? 'Loading…' : 'No expenses recorded yet.'}</p>
          )}
        </Card>
      </div>

      {data && data.byMonth.length > 0 && (
        <Card title="Monthly Profit">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="py-2 pr-4">Month</th>
                <th className="py-2 pr-4 text-right">Revenue</th>
                <th className="py-2 pr-4 text-right">Expenses</th>
                <th className="py-2 text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.byMonth.map((m) => (
                <tr key={m.month} className="border-b border-gray-50">
                  <td className="py-2 pr-4 font-medium">{m.month}</td>
                  <td className="py-2 pr-4 text-right">{currency(m.revenue)}</td>
                  <td className="py-2 pr-4 text-right">{currency(m.expenses)}</td>
                  <td className={`py-2 text-right font-medium ${m.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currency(m.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
