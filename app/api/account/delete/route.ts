import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Delete push tokens for this email
    await supabaseAdmin
      .from("push_tokens")
      .delete()
      .eq("email", normalizedEmail)

    // Delete subscription record
    await supabaseAdmin
      .from("subscriptions")
      .delete()
      .eq("email", normalizedEmail)

    // Delete any user-specific cached data
    await supabaseAdmin
      .from("user_profiles")
      .delete()
      .eq("email", normalizedEmail)

    console.log(`[Account Delete] Deleted account for ${normalizedEmail}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Account Delete] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete account. Please contact Support@BibleForLifeStages.com" },
      { status: 500 }
    )
  }
}
