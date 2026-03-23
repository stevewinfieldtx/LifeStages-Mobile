import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (uses service role key - full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Types for our subscription table
export interface SubscriptionRecord {
  id: string
  email: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: 'trialing' | 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | null
  trial_started_at: string | null
  trial_ends_at: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

// Helper functions for subscription management
export async function getSubscriptionByEmail(email: string): Promise<SubscriptionRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching subscription:', error)
  }

  return data
}

export async function getSubscriptionByCustomerId(customerId: string): Promise<SubscriptionRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subscription by customer ID:', error)
  }

  return data
}

export async function getSubscriptionByStripeSubscriptionId(subscriptionId: string): Promise<SubscriptionRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subscription by Stripe subscription ID:', error)
  }

  return data
}

export async function createSubscription(
  email: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  status: SubscriptionRecord['subscription_status'],
  trialEndsAt: Date | null,
  currentPeriodEnd: Date | null
): Promise<SubscriptionRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      email: email.toLowerCase(),
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      subscription_status: status,
      trial_started_at: status === 'trialing' ? new Date().toISOString() : null,
      trial_ends_at: trialEndsAt?.toISOString() || null,
      current_period_end: currentPeriodEnd?.toISOString() || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating subscription:', error)
    return null
  }

  return data
}

export async function updateSubscription(
  stripeSubscriptionId: string,
  updates: Partial<Pick<SubscriptionRecord, 'subscription_status' | 'current_period_end' | 'trial_ends_at'>>
): Promise<SubscriptionRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating subscription:', error)
    return null
  }

  return data
}

export async function hasUsedTrial(email: string): Promise<boolean> {
  const subscription = await getSubscriptionByEmail(email)
  return subscription?.trial_started_at !== null
}

export async function canStartTrial(email: string): Promise<{ canStart: boolean; reason?: string }> {
  const subscription = await getSubscriptionByEmail(email)

  if (!subscription) {
    return { canStart: true }
  }

  if (subscription.trial_started_at) {
    return {
      canStart: false,
      reason: 'You have already used your free trial. Please subscribe to continue.'
    }
  }

  if (subscription.subscription_status === 'active') {
    return {
      canStart: false,
      reason: 'You already have an active subscription.'
    }
  }

  return { canStart: true }
}
