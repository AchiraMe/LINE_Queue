"use client";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Service from './api/Service'; // 👈 เพิ่ม import Service

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [lineId, setLineId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lid = params.get("lineId");
    if (lid) setLineId(lid);
  }, []);

  const handleSubmit = async () => {
    if (!name || !lineId) {
      return Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกชื่อ และตรวจสอบ LINE ID', 'warning');
    }

    const service = new Service();
    const res = await service.registerLineUser(name, lineId);

    if (res && res.status === 200) {
      Swal.fire('ลงทะเบียนสำเร็จ', 'ข้อมูลถูกบันทึกแล้ว', 'success').then(() => {
        window.location.href = '/';
      });
    } else {
      Swal.fire('ผิดพลาด', res?.data?.message || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>ลงทะเบียนผู้ใช้</h2>
      <div className="form-group mt-3">
        <label>ชื่อพนักงาน</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="กรอกชื่อ"
        />
      </div>
      <div className="form-group mt-3">
        <label>Line ID</label>
        <input
          className="form-control"
          value={lineId}
          disabled
        />
      </div>
      <button
        className="btn btn-primary mt-4"
        onClick={handleSubmit}
        style={{ width: 200 }}
      >
        ลงทะเบียน
      </button>
    </div>
  );
}
