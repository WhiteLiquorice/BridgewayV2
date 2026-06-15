import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { dataconnect } from '../lib/firebase'
import { getProductsForInventory, createProduct, updateProduct, updateProductStock } from '@bridgeway/database'
import { useToast } from '../context/ToastContext'
import { logActivity } from '../lib/logActivity'
import Modal from '../components/Modal'

interface Product {
  id: string
  org_id: string
  name: string
  price_cents: number
  stock_count: number | null
  low_stock_threshold: number
  is_active: boolean
  created_at: string
}

export default function Inventory() {
  const { org, profile } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'low' | 'out' | 'inactive'>('all')
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [priceDollars, setPriceDollars] = useState('')
  const [stockCount, setStockCount] = useState('')
  const [threshold, setThreshold] = useState('10')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const orgId = org?.id

  // Fetch products
  const { data: products = [] as Product[], isLoading } = useQuery<Product[]>({
    queryKey: ['products', orgId],
    queryFn: async () => {
      const { data } = await getProductsForInventory(dataconnect, { orgId: orgId! })
      return (data?.products || []).map((p: any) => ({
        id: p.id,
        org_id: orgId!,
        name: p.name,
        price_cents: p.priceCents,
        stock_count: p.stockCount,
        low_stock_threshold: p.lowStockThreshold,
        is_active: p.isActive,
        created_at: p.createdAt
      }))
    },
    enabled: !!orgId,
  })

  // Invalidate queries helper
  const refreshProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products', orgId] })
  }

  // Quick Inline Stock Adjustment
  async function adjustStock(product: Product, delta: number) {
    const currentStock = product.stock_count || 0
    const newStock = Math.max(0, currentStock + delta)
    
    try {
      await updateProductStock(dataconnect, { id: product.id, stockCount: newStock })
      
      refreshProducts()
      
      // Log activity
      logActivity({
        org_id: orgId,
        user_id: profile?.user_id,
        action: 'product.stock_adjusted',
        entity_type: 'product',
        entity_id: product.id,
        metadata: { 
          product_name: product.name, 
          previous_stock: currentStock, 
          new_stock: newStock 
        }
      })
      
      showToast(`${product.name} stock updated to ${newStock}`, 'success')
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error')
    }
  }

  // Open Add Modal
  function handleOpenAdd() {
    setName('')
    setPriceDollars('')
    setStockCount('')
    setThreshold('10')
    setIsActive(true)
    setFormError('')
    setIsAddOpen(true)
  }

  // Open Edit Modal
  function handleOpenEdit(product: Product) {
    setSelectedProduct(product)
    setName(product.name)
    setPriceDollars((product.price_cents / 100).toFixed(2))
    setStockCount(product.stock_count !== null ? product.stock_count.toString() : '')
    setThreshold((product.low_stock_threshold ?? 10).toString())
    setIsActive(product.is_active)
    setFormError('')
    setIsEditOpen(true)
  }

  // Save New Product
  async function handleAddProduct() {
    if (!name.trim()) { setFormError('Product name is required'); return }
    const price = parseFloat(priceDollars)
    if (isNaN(price) || price < 0) { setFormError('Price must be a positive number'); return }
    const stock = stockCount.trim() === '' ? null : parseInt(stockCount)
    if (stock !== null && (isNaN(stock) || stock < 0)) { setFormError('Stock must be a positive integer'); return }
    const thresh = parseInt(threshold)
    if (isNaN(thresh) || thresh < 0) { setFormError('Low stock threshold must be a positive integer'); return }

    setSaving(true)
    setFormError('')

    try {
      const priceCents = Math.round(price * 100)
      const { data } = await createProduct(dataconnect, {
        orgId: orgId!,
        name: name.trim(),
        priceCents,
        stockCount: stock,
        lowStockThreshold: thresh,
        isActive,
      })

      logActivity({
        org_id: orgId,
        user_id: profile?.user_id,
        action: 'product.created',
        entity_type: 'product',
        entity_id: data?.product_insert?.id,
        metadata: { product_name: name.trim(), price_cents: priceCents, initial_stock: stock }
      })

      showToast('Product created successfully', 'success')
      refreshProducts()
      setIsAddOpen(false)
    } catch (err: any) {
      setFormError(err.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  // Update Product
  async function handleEditProduct() {
    if (!selectedProduct) return
    if (!name.trim()) { setFormError('Product name is required'); return }
    const price = parseFloat(priceDollars)
    if (isNaN(price) || price < 0) { setFormError('Price must be a positive number'); return }
    const stock = stockCount.trim() === '' ? null : parseInt(stockCount)
    if (stock !== null && (isNaN(stock) || stock < 0)) { setFormError('Stock must be a positive integer'); return }
    const thresh = parseInt(threshold)
    if (isNaN(thresh) || thresh < 0) { setFormError('Low stock threshold must be a positive integer'); return }

    setSaving(true)
    setFormError('')

    try {
      const priceCents = Math.round(price * 100)
      await updateProduct(dataconnect, {
        id: selectedProduct.id,
        name: name.trim(),
        priceCents,
        stockCount: stock,
        lowStockThreshold: thresh,
        isActive,
      })

      logActivity({
        org_id: orgId,
        user_id: profile?.user_id,
        action: 'product.updated',
        entity_type: 'product',
        entity_id: selectedProduct.id,
        metadata: { product_name: name.trim(), price_cents: priceCents, stock: stock }
      })

      showToast('Product updated successfully', 'success')
      refreshProducts()
      setIsEditOpen(false)
    } catch (err: any) {
      setFormError(err.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  // Filter products
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false

    const stock = p.stock_count ?? 0
    const thresh = p.low_stock_threshold ?? 10

    if (activeTab === 'low') {
      return p.is_active && stock > 0 && stock <= thresh
    }
    if (activeTab === 'out') {
      return p.is_active && stock === 0
    }
    if (activeTab === 'inactive') {
      return !p.is_active
    }
    return true // 'all'
  })

  // Calculate statistics
  const activeProducts = products.filter(p => p.is_active)
  const totalItems = activeProducts.length
  
  const totalStockValue = activeProducts.reduce((sum, p) => {
    return sum + ((p.stock_count || 0) * (p.price_cents / 100))
  }, 0)

  const lowStockCount = activeProducts.filter(p => {
    const stock = p.stock_count ?? 0
    const thresh = p.low_stock_threshold ?? 10
    return stock > 0 && stock <= thresh
  }).length

  const outOfStockCount = activeProducts.filter(p => (p.stock_count ?? 0) === 0).length

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Inventory Tracker</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage spa retail items, monitor stock levels, and configure alerts</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-[#0c1a2e] text-sm font-medium rounded-lg hover:bg-brand transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Products</p>
            <h3 className="text-2xl font-semibold text-white mt-1">{totalItems}</h3>
            <p className="text-[10px] text-gray-400 mt-1">Active retail items</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Value</p>
            <h3 className="text-2xl font-semibold text-white mt-1">${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-gray-400 mt-1">Retail value on hand</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Low Stock</p>
            <h3 className={`text-2xl font-semibold mt-1 ${lowStockCount > 0 ? 'text-amber-400' : 'text-white'}`}>{lowStockCount}</h3>
            <p className="text-[10px] text-gray-400 mt-1">Below threshold limit</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${lowStockCount > 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Out of Stock</p>
            <h3 className={`text-2xl font-semibold mt-1 ${outOfStockCount > 0 ? 'text-red-400' : 'text-white'}`}>{outOfStockCount}</h3>
            <p className="text-[10px] text-gray-400 mt-1">Require immediate reorder</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${outOfStockCount > 0 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-950/40 p-1.5 rounded-xl border border-gray-800/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${activeTab === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveTab('low')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'low' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-gray-400 hover:text-white border border-transparent'}`}
          >
            Low Stock
            {lowStockCount > 0 && <span className="bg-amber-500 text-gray-950 px-1.5 py-0.5 rounded-full text-[9px] font-bold">{lowStockCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('out')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'out' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:text-white border border-transparent'}`}
          >
            Out of Stock
            {outOfStockCount > 0 && <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold">{outOfStockCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${activeTab === 'inactive' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Inactive
          </button>
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-center px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider w-36">Stock Level</th>
                <th className="text-center px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Level</th>
                <th className="text-center px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    {search ? 'No products match your search' : 'No products added yet'}
                  </td>
                </tr>
              ) : (
                filtered.map(product => {
                  const stock = product.stock_count ?? 0
                  const thresh = product.low_stock_threshold ?? 10
                  const isOutOfStock = stock === 0
                  const isLowStock = stock > 0 && stock <= thresh

                  let stockBadgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  let stockBadgeLabel = 'In Stock'

                  if (!product.is_active) {
                    stockBadgeClass = 'bg-gray-800 text-gray-500 border border-gray-700/50'
                    stockBadgeLabel = 'Inactive'
                  } else if (isOutOfStock) {
                    stockBadgeClass = 'bg-red-500/10 text-red-400 border border-red-500/20 font-semibold'
                    stockBadgeLabel = 'Out of Stock'
                  } else if (isLowStock) {
                    stockBadgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    stockBadgeLabel = 'Low Stock'
                  }

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-gray-200 font-medium block">{product.name}</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-300 tabular-nums">
                        ${(product.price_cents / 100).toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-3">
                          {product.is_active && (
                            <button
                              onClick={() => adjustStock(product, -1)}
                              disabled={stock === 0}
                              className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 disabled:opacity-40 text-gray-300 text-xs flex items-center justify-center transition-colors"
                            >
                              −
                            </button>
                          )}
                          <span className={`text-sm text-gray-200 font-semibold w-8 text-center tabular-nums`}>
                            {product.stock_count !== null ? product.stock_count : '—'}
                          </span>
                          {product.is_active && (
                            <button
                              onClick={() => adjustStock(product, 1)}
                              className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 text-xs flex items-center justify-center transition-colors"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center text-gray-400 tabular-nums">
                        &lt;= {thresh}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium inline-block ${stockBadgeClass}`}>
                          {stockBadgeLabel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="px-3 py-1.5 text-xs text-brand bg-brand/10 border border-brand/20 rounded-lg hover:bg-brand/20 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Product" size="md">
        <div className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{formError}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Lavender Massage Oil (8 oz)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={priceDollars}
                  onChange={e => setPriceDollars(e.target.value)}
                  placeholder="29.99"
                  className="w-full pl-7 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Initial Stock</label>
              <input
                type="number"
                value={stockCount}
                onChange={e => setStockCount(e.target.value)}
                placeholder="20"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Low Stock Alert Threshold</label>
            <input
              type="number"
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              placeholder="10"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20"
            />
            <p className="text-[10px] text-gray-500 mt-1">Triggers a warning indicator when stock levels fall below this limit.</p>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="isActiveAdd"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-brand focus:ring-brand/30 [color-scheme:dark]"
            />
            <label htmlFor="isActiveAdd" className="text-sm font-medium text-gray-300 cursor-pointer select-none">Active (Available in POS checkout)</label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProduct}
              disabled={saving}
              className="px-5 py-2 bg-brand text-[#0c1a2e] text-sm font-medium rounded-lg hover:bg-brand transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Product'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Product" size="md">
        <div className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{formError}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={priceDollars}
                  onChange={e => setPriceDollars(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
              <input
                type="number"
                value={stockCount}
                onChange={e => setStockCount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Low Stock Alert Threshold</label>
            <input
              type="number"
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand/50"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="isActiveEdit"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-brand focus:ring-brand/30 [color-scheme:dark]"
            />
            <label htmlFor="isActiveEdit" className="text-sm font-medium text-gray-300 cursor-pointer select-none">Active (Available in POS checkout)</label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditProduct}
              disabled={saving}
              className="px-5 py-2 bg-brand text-[#0c1a2e] text-sm font-medium rounded-lg hover:bg-brand transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
