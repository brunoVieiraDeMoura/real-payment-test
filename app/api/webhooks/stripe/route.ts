import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId

      if (userId) {
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'pro',
            stripe_customer_id: session.customer as string,
          })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId

      if (userId) {
        await supabaseAdmin
          .from('profiles')
          .update({ subscription_status: 'free' })
          .eq('id', userId)
      }
      break
    }
  }

  return new Response('OK', { status: 200 })
}
