import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PricingCard from './pricing-card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const isPro = profile?.subscription_status === 'pro'

  return (
    <main className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between py-6 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-semibold">SaaS App</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800">
                Sair
              </button>
            </form>
          </div>
        </header>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Escolha seu plano</h1>
          <p className="text-gray-400">Comece grátis. Faça upgrade quando precisar.</p>
        </div>

        <PricingCard isPro={isPro} />
      </div>
    </main>
  )
}
