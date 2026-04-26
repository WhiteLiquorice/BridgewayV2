import { useState, useMemo } from 'react'

type Category = 'Hair Care' | 'Skincare' | 'Supplies' | 'Color' | 'Tools'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  cost: number
  qty: number
  threshold: number
  category: Category
}

const INITIAL: Product[] = [
  { id: '1', name: 'Olaplex No.3',       sku: 'OLP-003', price: 30, cost: 14,  qty: 12, threshold: 5,  category: 'Hair Care' },
  { id: '2', name: 'Redken All Soft',    sku: 'RDK-AS8', price: 22, cost: 9.5, qty: 3,  threshold: 5,  category: 'Hair Care' },
  { id: '3', name: 'Dermalogica SPF50',  sku: 'DML-SPF', price: 48, cost: 21,  qty: 0,  threshold: 3,  category: 'Skincare'  },
  { id: '4', name: 'Disposable Gloves',  sku: 'SUP-GLV', price: 0,  cost: 8,   qty: 25, threshold: 10, category: 'Supplies'  },
  { id: '5', name: 'Wella Koleston 7/1', sku: 'WEL-701', price: 18, cost: 7,   qty: 6,  threshold: 8,  category: 'Color'     },
  { id: '6', name: 'Denman Brush D3',    sku: 'DEN-D3',  price: 14, cost: 6,   qty: 9,  threshold: 4,  category: 'Tools'     },
]

const CATEGORIES: Category[] = ['Hair Care', 'Skincare', 'Supplies', 'Color', 'Tools']

const BLANK: Omit<Product, 'id'> = { name: '', sku: '', price: 0, cost: 0, qty: 0, threshold: 5, category: 'Hair Care' }

function stockStatus(p: Product) {
  if (p.qty === 0)            return { label: 'Out of Stock', cls: 'bg-red-500/10 text-red-400 border-red-500/20',       row: 'text-red-400' }
  if (p.qty <= p.threshold)   return { label: 'Low Stock',    cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', row: 'text-amber-400' }
  return                             { label: 'In Stock',     cls: 'bg-green-500/10 text-green-400 border-green-500/20', row: 'text-green-400' }
}

function exportCSV(products: Product[]) {
  const header = 'Product,SKU,Category,Retail Price,Cost Price,Qty On Hand,Low Stock At,Status,Margin %'
  const rows = products.map(p => {
    const margin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(1) : '—'
    const status = stockStatus(p).label
    return [p.name, p.sku, p.category, `$${p.price.toFixed(2)}`, `$${p.cost.toFixed(2)}`, p.qty, p.threshold, status, `${margin}%`].join(',')
  }).join('\n')
  const blob = new Blob([`${header}\n${rows}`], { type: 'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = 'inventory.csv'; a.click()
}

interface FieldProps { label: string; children: React.ReactNode }
function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"

interface ProductModalProps {
  initial?: Product
  onSave: (p: Omit<Product, 'id'>) => void
  onClose: () => void
}

function ProductModal({ initial, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(initial ? { ...initial } : { ...BLANK })
  const margin = form.price > 0 ? (((form.price - form.cost) / form.price) * 100).toFixed(1) : null

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">{initial ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Product Name">
              <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Olaplex No.3" />
            </Field>
          </div>
          <Field label="SKU">
            <input className={inputCls} value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. OLP-003" />
          </Field>
          <Field label="Category">
            <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value as Category)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Retail Price ($)">
            <input type="number" min={0} step={0.01} className={inputCls} value={form.price} onChange={e => set('price', Number(e.target.value))} />
          </Field>
          <Field label="Cost Price ($)">
            <input type="number" min={0} step={0.01} className={inputCls} value={form.cost} onChange={e => set('cost', Number(e.target.value))} />
          </Field>
          <Field label="Qty On Hand">
            <input type="number" min={0} className={inputCls} value={form.qty} onChange={e => set('qty', Number(e.target.value))} />
          </Field>
          <Field label="Low Stock Alert At">
            <input type="number" min={0} className={inputCls} value={form.threshold} onChange={e => set('threshold', Number(e.target.value))} />
          </Field>
        </div>

        {margin !== null && (
          <div className="mt-4 px-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-lg flex justify-between text-xs">
            <span className="text-gray-500">Gross Margin</span>
            <span className={Number(margin) >= 40 ? 'text-green-400 font-semibold' : 'text-amber-400 font-semibold'}>{margin}%</span>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => { if (form.name) { onSave(form); onClose() } }}
            disabled={!form.name}
            className="flex-1 py-2.5 bg-brand hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-[#0c1a2e] text-sm font-semibold rounded-lg transition-colors"
          >
            {initial ? 'Save Changes' : 'Add Product'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white text-sm rounded-lg transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>(INITIAL)
  const [modal, setModal] = useState<'add' | string | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<Category | 'All'>('All')

  const editingProduct = typeof modal === 'string' && modal !== 'add'
    ? products.find(p => p.id === modal) : undefined

  const filtered = useMemo(() => products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat    = filterCat === 'All' || p.category === filterCat
    return matchSearch && matchCat
  }), [products, search, filterCat])

  const lowStock   = products.filter(p => p.qty <= p.threshold)
  const totalValue = products.reduce((s, p) => s + p.cost * p.qty, 0)
  const retailVal  = products.reduce((s, p) => s + p.price * p.qty, 0)

  function addProduct(data: Omit<Product, 'id'>) {
    setProducts(prev => [...prev, { ...data, id: Date.now().toString() }])
  }

  function updateProduct(data: Omit<Product, 'id'>) {
    if (typeof modal !== 'string') return
    setProducts(prev => prev.map(p => p.id === modal ? { ...data, id: p.id } : p))
  }

  function adjustQty(id: string, delta: number) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p))
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Track retail products and supplies. Low-stock alerts appear on the morning dashboard.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(products)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white text-sm rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export
          </button>
          <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-amber-400 text-[#0c1a2e] text-sm font-semibold rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total SKUs',      value: products.length.toString(),          color: 'text-white'       },
          { label: 'Low Stock Items', value: lowStock.length.toString(),           color: lowStock.length > 0 ? 'text-amber-400' : 'text-green-400' },
          { label: 'Inventory Cost',  value: `$${totalValue.toFixed(0)}`,          color: 'text-white'       },
          { label: 'Retail Value',    value: `$${retailVal.toFixed(0)}`,           color: 'text-green-400'   },
        ].map(c => (
          <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Low stock banner */}
      {lowStock.length > 0 && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-red-400 mb-2">⚠ {lowStock.length} item{lowStock.length > 1 ? 's' : ''} at or below reorder threshold</p>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p.id} className="text-xs px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-300">
                {p.name} — {p.qty === 0 ? 'Out of Stock' : `${p.qty} left`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
          <input className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50" placeholder="Search products or SKU…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {(['All', ...CATEGORIES] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat as Category | 'All')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${filterCat === cat ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {['Product', 'SKU', 'Category', 'Retail', 'Cost', 'Margin', 'Qty', 'Status', 'Adjust', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="px-5 py-10 text-center text-sm text-gray-600">No products match your search.</td></tr>
            ) : filtered.map(p => {
              const st = stockStatus(p)
              const margin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(0) : null
              return (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3 text-gray-400">{p.category}</td>
                  <td className="px-4 py-3 text-gray-300">{p.price > 0 ? `$${p.price.toFixed(2)}` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">${p.cost.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {margin !== null
                      ? <span className={Number(margin) >= 40 ? 'text-green-400 font-medium' : 'text-amber-400 font-medium'}>{margin}%</span>
                      : <span className="text-gray-700">—</span>}
                  </td>
                  <td className={`px-4 py-3 font-semibold ${st.row}`}>{p.qty}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${st.cls}`}>{st.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => adjustQty(p.id, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-xs font-bold">−</button>
                      <button onClick={() => adjustQty(p.id, 1)}  className="w-6 h-6 flex items-center justify-center rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-xs font-bold">+</button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setModal(p.id)} className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-colors">Edit</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modal === 'add' && <ProductModal onSave={addProduct} onClose={() => setModal(null)} />}
      {editingProduct  && <ProductModal initial={editingProduct} onSave={updateProduct} onClose={() => setModal(null)} />}
    </div>
  )
}
