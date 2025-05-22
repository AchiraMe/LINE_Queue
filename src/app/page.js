// /pages/index.js
export default function HomePage() {
  return (
    <div style={{ padding: 50, textAlign: 'center' }}>
      <h1 style={{ marginBottom: 20 }}>ระบบจองคิว Flex Line</h1>
      <p>กรุณาเข้าสู่ระบบด้วยบัญชี LINE เพื่อเริ่มต้น</p>

      <a href="/auth/line">
        <button
          className="btn btn-success"
          style={{
            fontSize: 20,
            padding: '10px 30px',
            marginTop: 30,
            backgroundColor: '#06C755',
            border: 'none',
            color: '#fff',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          ➤ เข้าสู่ระบบด้วย LINE
        </button>
      </a>
    </div>
  );
}
