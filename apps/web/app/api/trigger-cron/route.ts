import { NextResponse } from "next/server";

/**
 * Vercel Cron invoca esta ruta según `vercel.json`. Los horarios del cron de Vercel son siempre **UTC**
 * (p. ej. 14:00 UTC corresponde a 08:00 en America/Mexico_City con offset UTC-6).
 */
export async function GET(request: Request) {
  // 1. Vercel envía automáticamente una cabecera de autorización a sus cron jobs
  const authHeader = request.headers.get('authorization');
  
  // Validamos que el llamado sea real de Vercel y no de un intruso
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // 2. Apuntamos a tu backend. 
    // En local será http://localhost:8080, en producción será tu URL de Fly.io/Railway
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    
    // 3. Hacemos la llamada POST a la ruta exacta que me pasaste
    const response = await fetch(`${backendUrl}/api/cron/payments/daily`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CRON_SECRET}`,
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`El backend respondió con status: ${response.status}`);
    }

    const data = await response.json();
    
    // Le decimos a Vercel que todo salió bien
    return NextResponse.json({ 
      success: true, 
      message: "Cron enviado al backend exitosamente",
      backendResponse: data 
    });

  } catch (error) {
    console.error("Error al ejecutar el cron:", error);
    return NextResponse.json({ 
      error: "Fallo al contactar al backend de reentwise" 
    }, { status: 500 });
  }
}