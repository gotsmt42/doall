import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * ชิ้นส่วนพื้นฐานที่ทั้งเว็บใช้ร่วมกัน
 *
 * ⚠️ กฎของงานที่ดู "เป็นระบบเดียวกัน": **ทุกที่ที่ต้องใช้ปุ่ม/การ์ด/หัวข้อ ต้องเรียกจากที่นี่**
 *    ห้ามเขียน <button className="..."> ลอยๆ ในหน้าใดหน้าหนึ่ง — ปุ่มที่มุมโค้งต่างกัน 2px
 *    ระหว่างสองหน้า คือสิ่งที่คนดูออกว่า "ไม่เนี้ยบ" แม้บอกไม่ถูกว่าอะไรผิด
 * ⚠️ ทุกตัวในไฟล์นี้เป็น Server Component (ไม่มี "use client") ตั้งใจให้ไม่ต้องส่ง JS
 *    ลงเบราว์เซอร์เลย ส่วนที่ต้องโต้ตอบจริงแยกไว้เป็นไฟล์ของตัวเองใน src/layouts
 */

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/* ── กรอบความกว้างของเนื้อหา ───────────────────────────────────────────── */

/**
 * ⚠️ px-5 ที่นี่คือสิ่งเดียวที่กันเนื้อหาชนขอบจอมือถือทั้งเว็บ
 *    ห้ามมีส่วนไหนวางเนื้อหานอก Container โดยไม่ใส่ระยะขอบของตัวเอง
 */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)}>{children}</div>;
}

/**
 * ระยะห่างแนวตั้งมาตรฐานของทุกส่วน — "ที่ว่างเยอะพอดี" มาจากการใช้ค่าเดียวกันทั้งเว็บ
 * ไม่ใช่การกะเอาเป็นส่วนๆ
 */
export function Section({
  children,
  className,
  tone = "surface",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "subtle" | "ink";
  id?: string;
}) {
  const tones = {
    surface: "bg-white",
    subtle: "bg-slate-50",
    ink: "bg-slate-900 text-slate-300",
  } as const;
  return (
    <section id={id} className={cx("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      {children}
    </section>
  );
}

/* ── หัวข้อของแต่ละส่วน ─────────────────────────────────────────────────── */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: As = "h2",
  onDark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: ElementType;
  onDark?: boolean;
}) {
  return (
    <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        // ⚠️ ข้อความนำหัวข้อเป็นแค่ป้ายบอกหมวด ไม่ใช่หัวข้อ — ห้ามทำเป็น <h*>
        //    ไม่งั้นลำดับหัวข้อของหน้าจะพัง ซึ่งกระทบทั้ง SEO และโปรแกรมอ่านหน้าจอ
        <p className="mb-3 text-sm font-semibold tracking-wide text-red-600 uppercase">{eyebrow}</p>
      )}
      <As className={cx("text-2xl font-bold sm:text-3xl lg:text-4xl", onDark && "text-white")}>{title}</As>
      {description && (
        <p className={cx("mt-4 text-base leading-relaxed", onDark ? "text-slate-400" : "text-slate-600")}>{description}</p>
      )}
    </div>
  );
}

/* ── ปุ่ม ───────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "onDark";
type ButtonSize = "md" | "lg";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold " +
  // ⚠️ transition อยู่ที่ปุ่มทุกตัวเหมือนกันหมด — "การโต้ตอบที่คาดเดาได้" คือทุกปุ่ม
  //    ตอบสนองด้วยจังหวะเดียวกัน ไม่ใช่บางปุ่มหน่วง บางปุ่มเปลี่ยนทันที
  "transition-colors duration-150 " +
  "disabled:cursor-not-allowed disabled:opacity-55";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
  onDark: "border border-white/25 text-white hover:bg-white/10",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  // ⚠️ สูงอย่างน้อย 44px บนมือถือ — เล็กกว่านี้คนนิ้วใหญ่กดพลาดเป็นประจำ
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">) {
  const cls = cx(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
  if (external) {
    // ⚠️ ลิงก์ออกนอกเว็บต้องมี rel="noopener" เสมอ — ไม่งั้นหน้าปลายทางแก้ไข window.opener
    //    ของเราได้ (เปลี่ยนหน้าเราเป็นหน้าปลอมได้) noreferrer กันไม่ให้ส่ง URL ของเราต่อไปด้วย
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ComponentPropsWithoutRef<"button">) {
  return (
    <button className={cx(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)} {...rest}>
      {children}
    </button>
  );
}

/* ── การ์ด ──────────────────────────────────────────────────────────────── */

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  /** true = การ์ดนี้กดได้ ให้ยกขึ้นตอนชี้ (ใช้เฉพาะการ์ดที่กดได้จริงเท่านั้น) */
  interactive?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-xl border border-slate-200 bg-white",
        interactive && "transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── ป้ายกำกับ ──────────────────────────────────────────────────────────── */

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        tone === "brand" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700",
      )}
    >
      {children}
    </span>
  );
}

/* ── รายการติ๊กถูก ──────────────────────────────────────────────────────── */

export function CheckList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cx("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-slate-600">
          {/* ⚠️ ไอคอนตกแต่งต้องมี aria-hidden — ไม่งั้นโปรแกรมอ่านหน้าจอจะอ่าน "กราฟิก"
              ซ้ำทุกบรรทัดจนฟังไม่รู้เรื่อง */}
          <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1.5 size-4 shrink-0 fill-red-600">
            <path d="M8.1 14.5 4 10.4l1.4-1.4 2.7 2.7 6.5-6.5L16 6.6z" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── ส่วนแสดงเมื่อไม่มีข้อมูล ───────────────────────────────────────────── */

/**
 * ⚠️ หน้าที่กรองแล้วไม่เจออะไรเลย ต้องบอกว่า "ไม่พบ" พร้อมทางออก ไม่ใช่ปล่อยพื้นที่ว่าง
 *    พื้นที่ว่างเปล่าทำให้คนคิดว่าเว็บพัง แล้วปิดหน้าไปเลย
 */
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ── ฝัง JSON-LD ลงหน้า ─────────────────────────────────────────────────── */

/**
 * ⚠️ ต้องใช้ dangerouslySetInnerHTML เท่านั้น — React จะหนีอักขระ &,<,> ให้อัตโนมัติถ้า
 *    ใส่เป็นลูกของ <script> ธรรมดา แล้ว JSON จะเสียจน Google อ่านไม่ออกทั้งก้อน
 * ⚠️ แทน < ด้วย < กัน XSS กรณีข้อมูลมีแท็กปนมา (ข้อมูลเรามาจากไฟล์ในโปรเจกต์
 *    แต่กันไว้เป็นนิสัย เผื่อวันที่ดึงจาก CMS)
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
