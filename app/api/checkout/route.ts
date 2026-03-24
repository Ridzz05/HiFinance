import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telegram_id, plan_type } = body;

    if (!telegram_id || !plan_type) {
      return NextResponse.json({ error: "Missing telegram_id or plan_type" }, { status: 400 });
    }

    // Mock integration for a real Payment Gateway (e.g. Midtrans, Stripe, Xendit)
    const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // PENTING: Injeksi telegram_id dan plan_type ke metadata/custom_field.
    // Ini memastikan webhook dapat mengidentifikasi pengguna mana yang membayar opsi plan apa.
    const mockPaymentPayload = {
      order_id: transactionId,
      gross_amount: plan_type.toLowerCase() === "founder" ? 499000 : 99000,
      metadata: {
        telegram_id: parseInt(telegram_id, 10),
        plan_type: plan_type.toLowerCase()
      }
    };

    // Return URL Redirect agar di front-end pengguna bisa di-navigasi ke payment gateway.
    return NextResponse.json({
      status: "success",
      transaction_id: transactionId,
      payment_url: `https://mock-payment-gateway.hifinance.ai/pay/${transactionId}`,
      simulated_payload: mockPaymentPayload
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
