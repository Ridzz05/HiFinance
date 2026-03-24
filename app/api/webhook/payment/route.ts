import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Dalam implementasi asli, verifikasi HMAC/Signature dari Payment Gateway sangat krusial di sini.
    // Contoh untuk Midtrans: const hash = crypto.createHash('sha512').update(order_id + status_code + gross_amount + server_key).digest('hex');
    
    if (payload.status !== "paid" && payload.transaction_status !== "settlement") {
       return NextResponse.json({ message: "Ignored: transaction is not fully paid yet" }, { status: 200 });
    }

    // Ambil metadata injeksi yang dikirim saat /checkout
    const metadata = payload.metadata || payload.custom_field;
    if (!metadata || !metadata.telegram_id || !metadata.plan_type) {
      return NextResponse.json({ error: "Missing required tracking metadata" }, { status: 400 });
    }

    const { telegram_id, plan_type } = metadata;

    console.log(`[Webhook] Menerima pembayaran sukses. Upgrade User ID: ${telegram_id} ke tier: ${plan_type}`);

    // Update database menggunakan Supabase Admin Client (Service Role Key) bypass RLS
    const supabase = getSupabase();
    
    // Asumsi tabel 'users' menggunakan 'telegram_id' (int) sebagai Primary Key
    const { error } = await supabase
      .from("users")
      .update({ tier: plan_type.toLowerCase() })
      .eq("telegram_id", parseInt(telegram_id, 10));

    if (error) {
      console.error("[Webhook] Supabase Update Error:", error);
      return NextResponse.json({ error: "Gagal memperbarui tier user." }, { status: 500 });
    }

    // Acknowledge the webhook success quickly (200 OK)
    return NextResponse.json({ message: "Webhook processed gracefully" }, { status: 200 });

  } catch (err: any) {
    console.error("[Webhook] System Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
