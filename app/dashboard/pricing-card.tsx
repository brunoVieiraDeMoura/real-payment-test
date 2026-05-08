'use client'

import { useState } from 'react'

interface PricingCardProps {
  isPro: boolean
}

const FREE_FEATURES = ['1 projeto', '5 usuários', 'Suporte por e-mail']
const PRO_FEATURES = ['Projetos ilimitados', 'Usuários ilimitados', 'Suporte prioritário', 'API access']

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function PricingCard({ isPro }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      alert('Erro ao iniciar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/create-portal', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      alert('Erro ao abrir portal. Tente novamente.')
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      {/* Free Plan */}
      <div className={`relative rounded-2xl border p-6 flex flex-col ${isPro ? 'border-gray-800 bg-gray-900/50' : 'border-indigo-500/50 bg-gray-900 ring-1 ring-indigo-500/20'}`}>
        {!isPro && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Plano atual
          </span>
        )}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Gratuito</h2>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">R$0</span>
            <span className="text-gray-400 text-sm">/mês</span>
          </div>
        </div>

        <ul className="space-y-2.5 mb-6 flex-1">
          {FREE_FEATURES.map(f => (
            <li key={f} className="flex items-center gap-2.5">
              <CheckIcon />
              <span className="text-gray-300 text-sm">{f}</span>
            </li>
          ))}
        </ul>

        <div className={`w-full py-2.5 text-center rounded-lg text-sm font-medium ${isPro ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-gray-300'}`}>
          {isPro ? 'Plano anterior' : 'Plano atual'}
        </div>
      </div>

      {/* Pro Plan */}
      <div className={`relative rounded-2xl border p-6 flex flex-col ${isPro ? 'border-green-500/50 bg-gray-900 ring-1 ring-green-500/20' : 'border-gray-800 bg-gray-900/50'}`}>
        {isPro && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Plano atual
          </span>
        )}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Pro</h2>
            {!isPro && (
              <span className="bg-indigo-600/20 text-indigo-400 text-xs font-medium px-2 py-0.5 rounded-full border border-indigo-500/30">
                Popular
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">R$1</span>
            <span className="text-gray-400 text-sm">/mês</span>
          </div>
        </div>

        <ul className="space-y-2.5 mb-6 flex-1">
          {PRO_FEATURES.map(f => (
            <li key={f} className="flex items-center gap-2.5">
              <CheckIcon />
              <span className="text-gray-300 text-sm">{f}</span>
            </li>
          ))}
        </ul>

        {isPro ? (
          <div className="flex flex-col gap-2">
            <div className="w-full py-2.5 rounded-lg bg-green-600/20 border border-green-500/30 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400 text-sm font-semibold">Plano Pro ativado</span>
            </div>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="w-full py-2 text-gray-400 hover:text-white text-xs transition-colors disabled:opacity-50"
            >
              {portalLoading ? 'Abrindo...' : 'Gerenciar / Cancelar assinatura'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {loading ? 'Redirecionando...' : 'Assinar agora'}
          </button>
        )}
      </div>
    </div>
  )
}
