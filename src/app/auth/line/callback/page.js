'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Service from '../../../api/Service';

export default function LineCallbackPage() {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const fetchLineProfile = async () => {
            const code = params.get('code');
            if (!code) return router.replace('/?error=missing_code');

            try {
                const body = new URLSearchParams();
                body.append('grant_type', 'authorization_code');
                body.append('code', code);
                body.append('redirect_uri', process.env.NEXT_PUBLIC_LINE_CALLBACK_URL);
                body.append('client_id', process.env.NEXT_PUBLIC_LINE_CLIENT_ID);
                body.append('client_secret', process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET);

                const tokenRes = await axios.post(
                    'https://api.line.me/oauth2/v2.1/token',
                    body,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );

                const access_token = tokenRes.data.access_token;

                const profileRes = await axios.get('https://api.line.me/v2/profile', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                console.log('📦 LINE Profile Response:', profileRes.data); // ✅ แสดงทั้งหมด

                const { userId, displayName, pictureUrl, statusMessage } = profileRes.data;

                const res = await new Service().registerLineUser(
                    displayName,
                    userId
                );

                // 👉 หากต้องการ redirect หลังบันทึกสำเร็จ:
                // router.replace(`/register?lineId=${userId}&displayName=${encodeURIComponent(displayName)}`);
            } catch (e) {
                console.error("LINE LOGIN ERROR:", e.message);
                router.replace('/?error=login_failed');
            }
        };

        fetchLineProfile();
    }, [params, router]);

    return <div style={{ padding: 30 }}>🔄 กำลังเข้าสู่ระบบผ่าน LINE...</div>;
}
