import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { supabase } from '../lib/supabase'

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '14px',
      color: '#ffffff',
      '::placeholder': { color: '#6b7280' },
    },
    invalid: { color: '#f87171' },
  },
}

function CheckoutForm({ amount, onSuccess, onError, disabled }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [cardError, setCardError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)
    setCardError('')

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      // clientSecret is provided to Elements via options
      undefined,
      { payment_method: { card: elements.getElement(CardElement) } }
    )

    if (error) {
      setCardError(error.message)
      setProcessing(false)
      onError?.(error.message)
    } else if (paymentIntent?.status === 'succeeded') {
      setProcessing(false)
      onSuccess?.(paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Card Details</label>
        <div className="bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-3">
          <CardElement options={CARD_STYLE} />
        </div>
      </div>
      {cardError && <p className="text-red-400 text-sm">{cardError}</p>}
      <div className="text-sm text-gray-400 flex items-center justify-between">
        <span>Amount due:</span>
        <span className="text-white font-semibold">${Number(amount).toFixed(2)}</span>
      </div>
      <button
        type="submit"
        disabled={!stripe || processing || disabled}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#080f1d] font-semibold rounded-lg py-2.5 text-sm transition-colors"
      >
        {processing ? 'Processing...' : `Pay $${Number(amount).toFixed(2)}`}
      </button>
    </form>
  )
}

export default function StripePayment({ orgId, stripePublishableKey, amount, onSuccess, onError }) {
  const [stripePromise, setStripePromise] = useState(null)
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!stripePublishableKey) {
      setError('Stripe is not configured for this organization.')
      setLoading(false)
      return
    }
    setStripePromise(loadStripe(stripePublishableKey))
  }, [stripePublishableKey])

  useEffect(() => {
    if (!orgId || !amount) return
    async function createIntent() {
      setLoading(true)
      try {
        const { data, error: err } = await supabase.functions.invoke('create-payment-intent', {
          body: { org_id: orgId, amount },
        })
        if (err) throw err
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret)
        } else if (data?.error) {
          setError(data.error)
        }
      } catch (err) {
        setError('Payment setup failed. You can complete payment at your visit.')
      } finally {
        setLoading(false)
      }
    }
    createIntent()
  }, [orgId, amount])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-sm text-gray-400">Setting up payment...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
        <p className="text-amber-400 text-sm">{error}</p>
        <p className="text-gray-500 text-xs mt-1">Payment can be collected at your visit instead.</p>
      </div>
    )
  }

  if (!stripePromise || !clientSecret) return null

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}
