// /pages/auth/line.js
export default function handler(req, res) {
  const LINE_LOGIN_URL = 'https://access.line.me/oauth2/v2.1/authorize';
  const client_id = 'YOUR_LINE_CLIENT_ID';
  const redirect_uri = 'http://localhost:3000/auth/line/callback';
  const state = '123456'; // ควรสุ่มจริงจัง
  const scope = 'profile openid';

  const loginUrl = `${LINE_LOGIN_URL}?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;

  res.writeHead(302, { Location: loginUrl });
  res.end();
}
