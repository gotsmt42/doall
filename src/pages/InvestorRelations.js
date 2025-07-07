import React from 'react';
const InvestorRelations = () => (
  <section className="py-16 px-6 max-w-4xl mx-auto bg-white">
    
    <h1 className="text-3xl font-bold text-red-800 mb-6">นักลงทุนสัมพันธ์</h1>
    <ul className="list-disc list-inside text-gray-700 space-y-3">
      <li><strong>แบบ 56-1 One Report:</strong> ดาวน์โหลดเอกสารฉบับล่าสุด</li>
      <li><strong>งบการเงิน:</strong> งบไตรมาส/ประจำปี ที่โปร่งใส ตรวจสอบได้</li>
      <li><strong>นโยบายการจ่ายเงินปันผล:</strong> การจ่ายผลตอบแทนตามเกณฑ์ที่กำหนด</li>
    </ul>

    <div className="mt-8">
  <h2 className="text-xl font-semibold text-red-700 mb-3">ดาวน์โหลดรายงาน</h2>
  <ul className="space-y-2 text-red-600 underline">
    <li><a href="/files/one-report-2023.pdf" target="_blank">📄 56-1 One Report ประจำปี 2566</a></li>
    <li><a href="/files/financial-q1-2024.pdf" target="_blank">📊 งบการเงินไตรมาส 1 ปี 2567</a></li>
    <li><a href="/files/dividend-policy.pdf" target="_blank">💸 นโยบายการจ่ายปันผล</a></li>
  </ul>
</div>

  </section>

  
);

export default InvestorRelations;
