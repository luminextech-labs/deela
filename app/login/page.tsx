'use client';

import { useState } from 'react';

const socialButtons = [
  { name: 'Google', icon: 'G', color: 'text-gray-700' },
  { name: 'Apple', icon: '🍎', color: 'text-gray-900' },
  { name: 'Facebook', icon: 'f', color: 'text-blue-600' },
  { name: 'Email', icon: '✉️', color: 'text-violet-600' },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex items-center justify-center p-4">
      {/* Center card */}
      <div className="w-full max-w-md">

        {/* Header label */}


        {/* Welcome card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="deela logo" className="h-14 object-contain" />
          </div>

          {/* Welcome message */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
              ยินดีต้อนรับสู่ Deela
              <span className="text-violet-500">💜</span>
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              ล็อกอินเพื่อบันทึกสินค้าที่ชอบและรับแจ้งเตือนราคา
            </p>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            {socialButtons.map((btn) => (
              <button
                key={btn.name}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm"
              >
                <span className={`text-xl w-8 text-center ${btn.color}`}>{btn.icon}</span>
                <span className="flex-1 text-center text-sm font-medium text-gray-700">
                  เข้าสู่ระบบด้วย {btn.name}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">หรือ</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register prompt */}
          <div className="text-center">
            <span className="text-sm text-gray-500">ยังไม่มีบัญชี? </span>
            <button className="text-sm font-semibold text-violet-600 hover:text-violet-700">สมัครสมาชิก</button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          การล็อกอินถือว่ายอมรับ{' '}
          <span className="text-violet-500">ข้อกำหนดการใช้งาน</span> และ{' '}
          <span className="text-violet-500">นโยบายความเป็นส่วนตัว</span>
        </p>
      </div>
    </div>
  );
}