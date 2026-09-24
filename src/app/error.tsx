"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

import { Button, ButtonLink, Container } from "@/components/ui";

/**
 * หน้าเมื่อเกิดข้อผิดพลาดที่ไม่คาดคิด
 *
 * ⚠️ Next.js 16 ส่ง `retry` (ไม่ใช่ `reset` แบบเวอร์ชันก่อน) — ดู
 *    node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md
 * ⚠️ ห้ามแสดง error.message ให้ผู้ใช้เห็น — ข้อความจากระบบอาจมีรายละเอียดภายใน (path, query)
 *    แสดงเฉพาะรหัส digest ซึ่งใช้ค้นหาใน log ฝั่ง server ได้โดยไม่เปิดเผยอะไร
 */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-red-600">เกิดข้อผิดพลาด</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">ขออภัย หน้านี้แสดงผลไม่สำเร็จ</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง หากยังพบปัญหา ติดต่อเราได้โดยตรง
        </p>
        {error.digest && <p className="mt-3 text-xs text-slate-500">รหัสอ้างอิง: <span className="font-mono">{error.digest}</span></p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => retry()}>
            <RefreshCw aria-hidden="true" className="size-4" />
            ลองใหม่อีกครั้ง
          </Button>
          <ButtonLink href="/" variant="secondary">กลับหน้าแรก</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
