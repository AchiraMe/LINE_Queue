"use client";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Service from './api/Service'; // ✅ import class ที่เขียนไว้แล้ว

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [lineId, setLineId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lid = params.get("lineId");
    if (lid) setLineId(lid);
  }, []);

  const handleRegister = async () => {
    if (!name || !lineId) {
      return Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกชื่อ และตรวจสอบ LINE ID', 'warning');
    }

    setLoading(true);
    const res = await new Service().registerLineUser(name, lineId);
    setLoading(false);

    if (res?.data?.status === '1') {
      Swal.fire('สำเร็จ', 'ลงทะเบียนเรียบร้อยแล้ว', 'success').then(() => {
        window.location.href = '/';
      });
    } else {
      Swal.fire('ผิดพลาด', res?.data?.message || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>ลงทะเบียนผู้ใช้</h2>

      <div className="form-group">
        <label>ชื่อพนักงาน</label>
        <input
          type="text"
          className="form-control"
          value={name}
          placeholder="เช่น สมชาย ใจดี"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group mt-3">
        <label>LINE ID</label>
        <input
          type="text"
          className="form-control"
          value={lineId}
          disabled
        />
      </div>

      <button
        className="btn btn-primary mt-4"
        style={{ width: '100%' }}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? 'กำลังบันทึก...' : 'ลงทะเบียน'}
      </button>
    </div>
  );
}
