import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
  }

  // Получение IP из заголовков
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'Неизвестно';

  // Получение страны по IP
  let country = 'Неизвестно';

  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json`);
    const geoData = await geoRes.json();
    country = geoData?.country_name || 'Неизвестно';
  } catch (error) {
    console.warn('Ошибка определения страны:', error);
  }

  // Отправка в Google Apps Script
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL!;
    const secret = process.env.GOOGLE_SCRIPT_SECRET!;

    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email,
        country,
        secret,
      }),
    });

    const text = await res.text();
    console.log("Ответ от Google Script:", text);

    if (!res.ok) throw new Error('Ошибка Google Script');

    return NextResponse.json({ message: 'Email успешно сохранён' });
  } catch (error) {
    console.error('Ошибка отправки в Google Таблицу:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
