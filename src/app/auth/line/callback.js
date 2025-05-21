// /pages/auth/line/callback.js
import axios from 'axios';

export async function getServerSideProps(context) {
  const { code } = context.query;

  const tokenRes = await axios.post('https://api.line.me/oauth2/v2.1/token', null, {
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:3000/auth/line/callback',
      client_id: 'YOUR_LINE_CLIENT_ID',
      client_secret: 'YOUR_LINE_CLIENT_SECRET'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const access_token = tokenRes.data.access_token;

  const profileRes = await axios.get('https://api.line.me/v2/profile', {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  const lineId = profileRes.data.userId;

  return {
    redirect: {
      destination: `/?lineId=${lineId}`,
      permanent: false
    }
  };
}

export default function CallbackPage() {
  return null; // No UI
}
