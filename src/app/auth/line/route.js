// src/app/auth/line/route.js
import { NextResponse } from 'next/server';

export function GET() {
  const LINE_LOGIN_URL = 'https://access.line.me/oauth2/v2.1/authorize';
  const client_id = process.env.NEXT_PUBLIC_LINE_CLIENT_ID;
  const redirect_uri = encodeURIComponent(process.env.NEXT_PUBLIC_LINE_CALLBACK_URL);
  const state = Math.random().toString(36).substring(2);
  const scope = 'profile openid';

  const loginUrl = `${LINE_LOGIN_URL}?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;

  return NextResponse.redirect(loginUrl);
}
