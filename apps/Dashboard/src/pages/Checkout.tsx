import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

// TODO: Replace simulated payment with Stripe Elements + create-pos-payment-intent
// edge function for real card processing.

export default function Checkout() {
  const { org } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [products, setProducts] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([]) // [{product, qty}]
  const [tipPercent, setTipPercent] = useState(0)
  const [staff, setStaff] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [search, setSearch] = useState('')
  const [clientPackages, setClientPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)

  useEffect(() => {
    if (!org?.id) return
    Promise.all([
      supabase.from('clients').select('id, full_name, email, phone').eq('org_id', org.id).order('full_name'),
      supabase.from('services').select('id, name, price, duration').eq('org_id', org.id).eq('is_active', true),
      supabase.from('products').select('id, name, price_cents').eq('org_id', org.id).eq('is_active', true),
      supabase.from('profiles').select('id, full_name, commission_rate_percentage').eq('org_id', org.id).neq('role', 'patient').eq('is_active', true),
    ]).then(([{ data: c }, { data: s }, { data: p }, { data: st }]) => {
      setClients(c || [])
      setServices(s || [])
      setProducts(p || [])
      setStaff(st || [])
    })
  }, [org?.id])

  const serviceCents = selectedService ? Math.round((selectedService.price || 0) * 100) : 0
  const redeemableValue = selectedPackage ? serviceCents : 0
  const productsCents = selectedProducts.reduce((sum, { product, qty }) => sum + product.price_cents * qty, 0)
  const subtotalCents = Math.max(0, serviceCents + productsCents - redeemableValue)
  const tipCents = Math.round((serviceCents + productsCents) * (tipPercent / 100))
  const totalCents = subtotalCents + tipCents
  const totalDollars = (totalCents / 100).toFixed(2)

  const filteredClients = clients.filter(c =>
    !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleProcessPayment() {
    setProcessing(true)
    const items = []
    if (selectedService) items.push({ type: 'service', id: selectedService.id, name: selectedService.name, price_cents: serviceCents, qty: 1 })
    selectedProducts.forEach(({ product, qty }) => items.push({ type: 'product', id: product.id, name: product.name, price_cents: product.price_cents, qty }))

    const commissionRate = selectedStaff?.commission_rate_percentage ?? 0
    const commissionAmount = (subtotalCents / 100) * (commissionRate / 100)

    if (selectedPackage) {
      await supabase.from('client_packages')
        .update({ used_sessions: selectedPackage.used_sessions + 1 })
        .eq('id', selectedPackage.id)
    }

    const { error } = await supabase.from('pos_transactions').insert({
      org_id: org.id,
      client_id: selectedClient?.id || null,
      staff_id: selectedStaff?.id || null,
      items,
      tip_cents: tipCents,
      total_cents: totalCents,
      commission_amount: commissionAmount,
      status: 'completed', // TODO: integrate Stripe payment intent
    })

    if (!error) setSuccess(true)
    setProcessing(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Payment Recorded</h2>
        <p className="text-gray-400 text-sm mb-1">${totalDollars} collected{selectedClient ? ` from ${selectedClient.full_name}` : ''}</p>
        {tipCents > 0 && <p className="text-gray-500 text-xs mb-6">Includes ${(tipCents/100).toFixed(2)} tip</p>}
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSuccess(false); setStep(1); setSelectedClient(null); setSelectedService(null); setSelectedProducts([]); setTipPercent(0) }}
            className="bg-brand hover:bg-brand text-[#0c1a2e] font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
            New Transaction
          </button>
          <button onClick={() => navigate('/overview')} className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Checkout</h1>
          <p className="text-sm text-gray-500 mt-0.5">Process a payment for a client visit</p>
        </div>
        <div className="flex items-center gap-2">
          {[1,2,3,4].map(s => (
            <div key={s} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= s ? 'bg-brand text-[#0c1a2e]' : 'bg-gray-800 text-gray-500'}`}>{s}</div>
          ))}
        </div>
      </div>

      {/* Step 1: Client */}
      {step === 1 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Select Client</h2>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50" />
          <div className="space-y-1 max-h-64 overflow-y-auto">
            <button onClick={() => { setSelectedClient(null); setStep(2) }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
              <p className="text-sm text-gray-400">Continue without selecting a client</p>
            </button>
            {filteredClients.map(c => (
              <button key={c.id} onClick={async () => {
              setSelectedClient(c)
              setStep(2)
              // Fetch client packages
              const { data } = await supabase.from('client_packages').select('*').eq('client_id', c.id).eq('status', 'active')
              setClientPackages(data || [])
            }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedClient?.id === c.id ? 'bg-brand/10 border border-brand/20' : 'hover:bg-white/5'}`}>
                <p className="text-sm font-medium text-white">{c.full_name}</p>
                <p className="text-xs text-gray-500">{c.email}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Service + Products */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-3">Select Service</h2>
            <div className="space-y-1">
              {services.map(s => (
                <button key={s.id} onClick={() => {
                  setSelectedService(selectedService?.id === s.id ? null : s)
                  setSelectedPackage(null) // Reset package if service changes
                }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${selectedService?.id === s.id ? 'bg-brand/10 border border-brand/20' : 'hover:bg-white/5 border border-transparent'}`}>
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-sm text-brand">${s.price}</p>
                </button>
              ))}
            </div>
          </div>
          
          {selectedService && selectedClient && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white mb-3">Redeem Membership/Package</h2>
              <div className="space-y-1">
                {clientPackages.length === 0 && <p className="text-xs text-gray-500">No active packages for this client.</p>}
                {clientPackages.filter(p => !p.service_id || p.service_id === selectedService.id).map(p => (
                  <button key={p.id} onClick={() => setSelectedPackage(selectedPackage?.id === p.id ? null : p)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between border ${selectedPackage?.id === p.id ? 'bg-brand/10 border-brand/20 text-white' : 'hover:bg-white/5 border-transparent text-gray-400'}`}>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-[10px] opacity-60">{p.total_sessions - p.used_sessions} sessions remaining</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-brand">Use Session</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {products.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white mb-3">Add Products</h2>
              <div className="space-y-1">
                {products.map(p => {
                  const entry = selectedProducts.find(x => x.product.id === p.id)
                  return (
                    <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5">
                      <div>
                        <p className="text-sm font-medium text-white">{p.name}</p>
                        <p className="text-xs text-gray-500">${(p.price_cents/100).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry && <button onClick={() => setSelectedProducts(prev => prev.map(x => x.product.id === p.id ? { ...x, qty: Math.max(0, x.qty - 1) } : x).filter(x => x.qty > 0))}
                          className="w-7 h-7 rounded-full bg-gray-800 text-white text-sm flex items-center justify-center hover:bg-gray-700">−</button>}
                        {entry && <span className="text-sm text-white w-4 text-center">{entry.qty}</span>}
                        <button onClick={() => setSelectedProducts(prev => entry ? prev.map(x => x.product.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...prev, { product: p, qty: 1 }])}
                          className="w-7 h-7 rounded-full bg-brand/20 text-brand text-sm flex items-center justify-center hover:bg-brand/30">+</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-3">Attributed Staff</h2>
            <div className="grid grid-cols-2 gap-2">
              {staff.map(s => (
                <button key={s.id} onClick={() => setSelectedStaff(selectedStaff?.id === s.id ? null : s)}
                  className={`text-left px-4 py-3 rounded-lg transition-colors border ${selectedStaff?.id === s.id ? 'bg-brand/10 border-brand/20 text-white' : 'hover:bg-white/5 border-transparent text-gray-400'}`}>
                  <p className="text-sm font-medium">{s.full_name}</p>
                  <p className="text-[10px] opacity-60">{s.commission_rate_percentage}% commission</p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">Back</button>
            <button onClick={() => setStep(3)} disabled={!selectedService && selectedProducts.length === 0}
              className="flex-1 bg-brand hover:bg-brand disabled:opacity-50 text-[#0c1a2e] font-semibold py-2.5 rounded-lg text-sm transition-colors">Next</button>
          </div>
        </div>
      )}

      {/* Step 3: Tip */}
      {step === 3 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white">Add a Tip</h2>
          <div className="grid grid-cols-4 gap-2">
            {[0, 10, 15, 20].map(pct => (
              <button key={pct} onClick={() => setTipPercent(pct)}
                className={`py-3 rounded-xl text-sm font-semibold transition-colors ${tipPercent === pct ? 'bg-brand text-[#0c1a2e]' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                {pct === 0 ? 'No tip' : `${pct}%`}
              </button>
            ))}
          </div>
          <div className="bg-gray-800 rounded-xl p-4 space-y-2">
            {selectedService && <div className="flex justify-between text-sm"><span className="text-gray-400">{selectedService.name}</span><span className="text-white">${(serviceCents/100).toFixed(2)}</span></div>}
            {selectedProducts.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between text-sm"><span className="text-gray-400">{product.name} × {qty}</span><span className="text-white">${(product.price_cents*qty/100).toFixed(2)}</span></div>
            ))}
            {tipCents > 0 && <div className="flex justify-between text-sm border-t border-gray-700 pt-2"><span className="text-gray-400">Tip ({tipPercent}%)</span><span className="text-white">${(tipCents/100).toFixed(2)}</span></div>}
            <div className="flex justify-between font-semibold border-t border-gray-700 pt-2"><span className="text-white">Total</span><span className="text-brand text-base">${totalDollars}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">Back</button>
            <button onClick={() => setStep(4)} className="flex-1 bg-brand hover:bg-brand text-[#0c1a2e] font-semibold py-2.5 rounded-lg text-sm transition-colors">Review Payment</button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm + Process */}
      {step === 4 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white">Confirm & Process</h2>
          {selectedClient && (
            <div className="bg-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand text-sm font-bold">{selectedClient.full_name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{selectedClient.full_name}</p>
                <p className="text-xs text-gray-500">{selectedClient.email}</p>
              </div>
            </div>
          )}
          <div className="bg-gray-800 rounded-xl p-4 space-y-2">
            {selectedService && <div className="flex justify-between text-sm"><span className="text-gray-400">{selectedService.name}</span><span className="text-white">${(serviceCents/100).toFixed(2)}</span></div>}
            {selectedProducts.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between text-sm"><span className="text-gray-400">{product.name} × {qty}</span><span className="text-white">${(product.price_cents*qty/100).toFixed(2)}</span></div>
            ))}
            {tipCents > 0 && <div className="flex justify-between text-sm border-t border-gray-700 pt-2"><span className="text-gray-400">Tip</span><span className="text-white">${(tipCents/100).toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t border-gray-700 pt-2"><span className="text-white">Total</span><span className="text-brand">${totalDollars}</span></div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            {/* TODO: Replace with Stripe Elements for real card processing */}
            Tap "Process Payment" to record this transaction. Stripe card payment integration coming soon.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">Back</button>
            <button onClick={handleProcessPayment} disabled={processing}
              className="flex-1 bg-brand hover:bg-brand disabled:opacity-60 text-[#0c1a2e] font-semibold py-2.5 rounded-lg text-sm transition-colors">
              {processing ? 'Processing...' : `Process $${totalDollars}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
