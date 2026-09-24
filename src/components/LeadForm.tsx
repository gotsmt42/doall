"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Loader2, Paperclip, X } from "lucide-react";

import { Button, cx } from "@/components/ui";
import { BUDGET_OPTIONS, FILE_RULES, contactSchema, formatBytes, quotationSchema } from "@/lib/lead";

/**
 * ฟอร์ม "ติดต่อเรา" และ "ขอใบเสนอราคา" (คอมโพเนนต์เดียว สองโหมด)
 *
 * ⚠️ ตรวจข้อมูลด้วย schema ชุดเดียวกับฝั่ง server (src/lib/lead.ts) — ผ่านที่นี่ = ผ่านที่ server
 * ⚠️ ไม่ใช้ไลบรารีฟอร์ม (react-hook-form ~25 kB) — ฟอร์มสองชุดที่ไม่ซับซ้อน state ธรรมดาพอ
 * ⚠️ Accessibility: ช่องที่ผิดได้ aria-invalid + aria-describedby ชี้ไปที่ข้อความ error
 *    และกดส่งแล้วผิด = เลื่อนโฟกัสไปช่องแรกที่ผิดทันที (คนใช้โปรแกรมอ่านหน้าจอรู้ว่าต้องแก้ตรงไหน)
 */

type Kind = "contact" | "quotation";
type Errors = Record<string, string>;
type Status = { state: "idle" } | { state: "sending" } | { state: "done"; ref: string } | { state: "error"; message: string };

export default function LeadForm({
  kind,
  serviceOptions,
  defaultService = "",
  defaultDetails = "",
}: {
  kind: Kind;
  serviceOptions: { value: string; label: string }[];
  defaultService?: string;
  defaultDetails?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // ⚠️ เวลาที่ฟอร์มถูกแสดง — server ใช้กันบอทที่กรอกเสร็จเร็วกว่าคน (ดู api/lead/route.ts)
  //    ตั้งค่าตอนผู้ใช้เริ่มโต้ตอบกับฟอร์มครั้งแรก (focus) — เป็นเวลาฝั่งเบราว์เซอร์จริงเสมอ
  //    และไม่ต้องใช้ effect/state (ไม่ทำให้ render ซ้ำ)
  const startedAt = useRef(0);
  const markStart = () => { if (!startedAt.current) startedAt.current = Date.now(); };

  const schema = kind === "quotation" ? quotationSchema : contactSchema;

  const collect = () => {
    const fd = new FormData(formRef.current!);
    const obj: Record<string, unknown> = { kind };
    for (const [k, v] of fd.entries()) if (typeof v === "string") obj[k] = v;
    obj.consent = fd.get("consent") === "on";
    return obj;
  };

  const validate = (): Errors => {
    const r = schema.safeParse(collect());
    if (r.success) return {};
    const out: Errors = {};
    for (const issue of r.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!out[key]) out[key] = issue.message;
    }
    return out;
  };

  // หลังกดส่งครั้งแรกแล้ว ตรวจใหม่ทุกครั้งที่แก้ — error หายทันทีที่แก้ถูก ไม่ต้องกดส่งซ้ำเพื่อดู
  const revalidate = () => { if (submitted) setErrors(validate()); };

  const addFiles = (list: FileList | null) => {
    setFileError("");
    if (!list) return;
    const allowed = FILE_RULES.accept.split(",");
    const next = [...files];
    for (const f of Array.from(list)) {
      const ext = "." + (f.name.toLowerCase().split(".").pop() || "");
      if (!allowed.includes(ext)) { setFileError(`"${f.name}" ไม่ใช่ชนิดไฟล์ที่รองรับ (${FILE_RULES.label})`); continue; }
      if (f.size > FILE_RULES.maxFileBytes) { setFileError(`"${f.name}" ใหญ่เกิน ${formatBytes(FILE_RULES.maxFileBytes)}`); continue; }
      if (next.some((x) => x.name === f.name && x.size === f.size)) continue;
      next.push(f);
    }
    if (next.length > FILE_RULES.maxFiles) { setFileError(`แนบได้ไม่เกิน ${FILE_RULES.maxFiles} ไฟล์`); return; }
    if (next.reduce((n, f) => n + f.size, 0) > FILE_RULES.maxTotalBytes) {
      setFileError(`ไฟล์รวมกันเกิน ${formatBytes(FILE_RULES.maxTotalBytes)} — ไฟล์ขนาดใหญ่ส่งให้ทีมงานทาง LINE หรืออีเมลได้หลังเราติดต่อกลับ`);
      return;
    }
    setFiles(next);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      // เลื่อนโฟกัสไปช่องแรกที่ผิด ตามลำดับในฟอร์ม
      const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      requestAnimationFrame(() => (formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']") ?? first)?.focus());
      return;
    }

    setStatus({ state: "sending" });
    const fd = new FormData(formRef.current!);
    fd.set("kind", kind);
    fd.set("consent", fd.get("consent") === "on" ? "true" : "false");
    fd.set("t", String(startedAt.current));
    fd.delete("files");
    files.forEach((f) => fd.append("files", f, f.name));

    try {
      const res = await fetch("/api/lead", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; error?: string; fieldErrors?: Errors };
      if (res.ok && data.ok) {
        setStatus({ state: "done", ref: data.ref || "" });
        window.scrollTo({ top: (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120, behavior: "smooth" });
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setStatus({ state: "error", message: data.error || "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" });
    } catch {
      setStatus({ state: "error", message: "เชื่อมต่ออินเทอร์เน็ตไม่ได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่" });
    }
  };

  if (status.state === "done") {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <CheckCircle2 aria-hidden="true" className="size-9 text-emerald-600" />
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          {kind === "quotation" ? "ได้รับคำขอใบเสนอราคาแล้ว" : "ได้รับข้อความของท่านแล้ว"}
        </h2>
        <p className="mt-2 leading-relaxed text-slate-700">
          ทีมงานจะติดต่อกลับเพื่อสอบถามรายละเอียดและประเมินงาน ภายในวันทำการถัดไป
        </p>
        {status.ref && (
          <p className="mt-4 text-sm text-slate-600">
            เลขอ้างอิง <span className="font-mono font-semibold text-slate-900">{status.ref}</span> — ใช้อ้างอิงเมื่อติดต่อสอบถาม
          </p>
        )}
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-red-600 hover:underline">กลับหน้าแรก</Link>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} onChange={revalidate} onFocus={markStart} noValidate className="space-y-5">
      {/* ⚠️ ช่องดักบอท: คนมองไม่เห็นและกด Tab ไปไม่ถึง บอทที่กรอกทุกช่องจะกรอกช่องนี้ด้วย
          ห้ามใช้ display:none — บอทบางตัวข้ามช่องที่ซ่อนแบบนั้นโดยเฉพาะ */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>เว็บไซต์ <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {status.state === "error" && (
        <div role="alert" className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{status.message}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="ชื่อผู้ติดต่อ" required error={errors.name} autoComplete="name" />
        <Field name="company" label="บริษัท / หน่วยงาน" error={errors.company} autoComplete="organization" />
        <Field name="phone" label="เบอร์โทรศัพท์" required error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="เช่น 081-234-5678" />
        <Field name="email" label="อีเมล" error={errors.email} type="email" inputMode="email" autoComplete="email" />
      </div>

      {kind === "contact" && <Field name="subject" label="หัวข้อ" required error={errors.subject} />}

      <SelectField
        name="serviceType"
        label="ประเภทงาน"
        required={kind === "quotation"}
        error={errors.serviceType}
        defaultValue={defaultService}
        placeholder={kind === "quotation" ? "เลือกประเภทงาน" : "ไม่ระบุ"}
        options={serviceOptions}
      />

      {kind === "quotation" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="siteLocation" label="สถานที่หน้างาน" error={errors.siteLocation} placeholder="เช่น อ.ปากเกร็ด จ.นนทบุรี" />
          <SelectField
            name="budget"
            label="งบประมาณโดยประมาณ"
            error={errors.budget}
            placeholder="ไม่ระบุ"
            options={BUDGET_OPTIONS.map((b) => ({ value: b, label: b }))}
          />
          <Field name="preferredDate" label="วันที่ต้องการเข้าหน้างาน" error={errors.preferredDate} type="date" />
        </div>
      )}

      <Field
        name="details"
        label={kind === "quotation" ? "รายละเอียดงาน" : "รายละเอียด"}
        required
        error={errors.details}
        multiline
        defaultValue={defaultDetails}
        placeholder={kind === "quotation" ? "เช่น ประเภทอาคาร ขนาดพื้นที่ จำนวนจุดโดยประมาณ ระบบเดิมที่มีอยู่" : ""}
      />

      {kind === "quotation" && (
        <div>
          <p className="text-sm font-semibold text-slate-900">แนบไฟล์ <span className="font-normal text-slate-500">(ถ้ามี)</span></p>
          <p className="mt-1 text-xs text-slate-500">
            แบบแปลน รูปหน้างาน หรือ BOQ · {FILE_RULES.label} · ไม่เกิน {FILE_RULES.maxFiles} ไฟล์ รวม {formatBytes(FILE_RULES.maxTotalBytes)}
          </p>
          <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-within:border-red-600">
            <Paperclip aria-hidden="true" className="size-4" />
            เลือกไฟล์
            <input
              type="file"
              name="files"
              multiple
              accept={FILE_RULES.accept}
              className="sr-only"
              onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
            />
          </label>
          {fileError && <p role="alert" className="mt-2 text-sm text-red-700">{fileError}</p>}
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((f) => (
                <li key={f.name + f.size} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <FileText aria-hidden="true" className="size-4 shrink-0 text-slate-500" />
                  <span className="min-w-0 flex-1 truncate text-slate-800">{f.name}</span>
                  <span className="shrink-0 text-xs text-slate-500">{formatBytes(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((x) => x !== f))}
                    aria-label={`ลบไฟล์ ${f.name}`}
                    className="grid size-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 size-4 shrink-0 accent-red-600"
          />
          <span>
            ข้าพเจ้ายินยอมให้บริษัทเก็บและใช้ข้อมูลข้างต้นเพื่อติดต่อกลับและจัดทำใบเสนอราคา ตาม
            {" "}<Link href="/privacy" target="_blank" className="font-semibold text-red-700 underline underline-offset-2">นโยบายความเป็นส่วนตัว</Link>
          </span>
        </label>
        {errors.consent && <p id="consent-error" className="mt-1.5 text-sm text-red-700">{errors.consent}</p>}
      </div>

      <Button type="submit" size="lg" disabled={sending} className="w-full sm:w-auto sm:min-w-52">
        {sending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            กำลังส่ง…
          </>
        ) : kind === "quotation" ? "ส่งคำขอใบเสนอราคา" : "ส่งข้อความ"}
      </Button>
      {kind === "quotation" && (
        <p className="text-sm text-slate-500">ทีมงานจะติดต่อกลับเพื่อสอบถามรายละเอียดและประเมินงาน</p>
      )}
    </form>
  );
}

/* ── ช่องกรอกมาตรฐาน ────────────────────────────────────────────────── */

const INPUT =
  "w-full rounded-lg border bg-white px-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 " +
  "transition-colors focus:outline-none focus:ring-2 focus:ring-red-600/20";

function Field({
  name,
  label,
  required,
  error,
  multiline,
  ...rest
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">) {
  const id = `f-${name}`;
  const errId = `${id}-error`;
  const cls = cx(INPUT, error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-slate-500");
  const aria = { "aria-invalid": Boolean(error), "aria-describedby": error ? errId : undefined, "aria-required": required || undefined };
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-900">
        {label}
        {required ? <span className="text-red-600"> *</span> : <span className="font-normal text-slate-500"> (ไม่บังคับ)</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          maxLength={4000}
          placeholder={rest.placeholder}
          defaultValue={rest.defaultValue as string | undefined}
          className={cx(cls, "py-3 leading-relaxed")}
          {...aria}
        />
      ) : (
        <input id={id} name={name} className={cx(cls, "h-11")} {...aria} {...rest} />
      )}
      {error && <p id={errId} className="mt-1.5 text-sm text-red-700">{error}</p>}
    </div>
  );
}

function SelectField({
  name,
  label,
  required,
  error,
  options,
  placeholder,
  defaultValue = "",
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  options: { value: string; label: string }[];
  placeholder: string;
  defaultValue?: string;
}) {
  const id = `f-${name}`;
  const errId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-900">
        {label}
        {required ? <span className="text-red-600"> *</span> : <span className="font-normal text-slate-500"> (ไม่บังคับ)</span>}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        className={cx(INPUT, "h-11", error ? "border-red-500" : "border-slate-300 focus:border-slate-500")}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p id={errId} className="mt-1.5 text-sm text-red-700">{error}</p>}
    </div>
  );
}
