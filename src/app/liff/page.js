'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import Service from '../api/Service';

export default function LiffPage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const runLiff = async () => {
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });

      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      const userProfile = await liff.getProfile();
      setProfile(userProfile);

      console.log('✅ LINE Profile:', userProfile);

      // ✅ Register ข้อมูลทันที
      const res = await new Service().registerLineUser(
        userProfile.userId,
        userProfile.displayName
      );

      console.log('📦 Register Result:', res?.data);
    };

    runLiff();
  }, []);

  if (!profile) return <div>🔄 Loading LIFF...</div>;

  return (
    <div style={{ padding: 30 }}>
      <h2>👤 LINE User</h2>
      <p><strong>Name:</strong> {profile.displayName}</p>
      <p><strong>User ID:</strong> {profile.userId}</p>
      <img src={profile.pictureUrl} width="100" alt="avatar" />
    </div>
  );
}
