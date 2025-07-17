import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("about.title")}</title>
        <meta name="description" content={t("about.description")} />
      </Helmet>

      <section className="py-20 px-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-red-800 dark:text-red-300 mb-10 text-center">
          {t("about.heading")}
        </h1>

        {/* ประวัติบริษัท */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
            ประวัติบริษัท
          </h2>
          <p className="text-lg leading-relaxed">
            บริษัท ดู ออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง
            จำกัดก่อตั้งขึ้นเมื่อวันที่ 25 พฤษภาคม 2563
            ซึ่งมีวัตถุประสงค์ในการดำเนินธุรกิจ จำหน่ายออกแบบและติดตั้ง
            งานระบบไฟฟ้า ประปา สุขาภิบาล เครื่องกล
            และระบบสื่อสารโทรคมนาคมสำหรับงานภายในและภายนอกอาคารทุกชนิด
            โดยยึดหลักความถูกต้องและปลอดภัยในการทำงาน
            เพื่อให้งานมีคุณภาพทางบริษัทเรามีทีมวิศวกรหรือหัวหน้างาน
            คอยกำกับดูแลงานตามแผนงานอย่างต่อเนื่อง
            เพื่อส่งมอบงานมีประสิทธิภาพให้กับลูกค้า
          </p>
        </div>

        <div className="mb-12">
          <p className="text-lg leading-relaxed">
            <p className="text-lg leading-relaxed">
              บริษัทมีวิศวกรผู้เชี่ยวชาญด้วยประสบการร์ทำงานมากกว่า 10
              ปีและทีมงานที่มีคุณภาพหลายด้าน สามารถดำเนินการติดตั้ง
              แก้ไขและปรับเปลี่ยนขอบเขตของงานได้ตามความต้องการของลูกค้าเป็นหลัก
            </p>
          </p>
        </div>

        <div className="mb-12">
          <p className="text-lg leading-relaxed">
            ลูกค้าของเรามีหลากหลายประเภท อาทิเช่น โรงงานอุตสาหกรรม
            หน่วยงานราชการ โกดัง องค์กรขนาดใหญ่ อาคารพาณิชย์
            และสำนักงานออฟฟิศต่างๆ เป็นต้น{" "}
          </p>
        </div>

        {/* พันธกิจขององค์กร */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
            นโยบายของบริษัท
          </h2>
          <p className="text-lg leading-relaxed">
            • ซื่อสัตย์และซื่อตรง บริการลูกค้าเต็มความสามารถ
          </p>
          <p className="text-lg leading-relaxed">
            • ปฏิบัติตามกฎหมายและข้อกำหนดอื่นๆ ด้านความปลอดภัย อาชีวอนามัย และสิ่งแวดล้อม
          </p>
          <p className="text-lg leading-relaxed">
            • พัฒนาความรู้ ความสามารถ และทักษะด้านการทำงานให้ทันสมัยอยู่เสมอ
          </p>
          <p className="text-lg leading-relaxed">
            • ปฏิบัติตามกฎหมาย และข้อกำหนดอื่นๆ ด้านความปลอดภัย อาชีวอนามัย
            และสิ่งแวดล้อม
          </p>
        </div>
        {/* พันธกิจขององค์กร */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
            พันธกิจขององค์กร
          </h2>
          <p className="text-lg leading-relaxed">
            • เป็นบริษัทรับเหมาติดตั้งงานระบบแบบครบวงจร
            มีประสบการณ์และความชำนาญในงานด้านวิศวกรรมทุกประเภท
          </p>
          <p className="text-lg leading-relaxed">
            • ควบคุมการปฏิบัติงานให้ได้ตามมาตราฐาน
            ภายใต้งบประมาณและตามเวลาที่ให้สัญญาไว้กับลูกค้า
          </p>
          <p className="text-lg leading-relaxed">
            • ขยายธุรกิจรับเหมาติดตั้งไปยังต่างประเทศ
            โดยเฉพาะในแถบภูมิภาคเอเชียกฎหมาย และข้อกำหนดอื่นๆ ด้านความปลอดภัย
            อาชีวอนามัย และสิ่งแวดล้อม
          </p>
          <p className="text-lg leading-relaxed">
            • เสริมสร้างจิตสานึกที่ดีในการทำงาน มีความปลอดภัยและรักษา
            สิ่งแวดล้อมในการทำงาน
          </p>
        </div>

        {/* วิสัยทัศน์ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
            วิสัยทัศน์
          </h2>
          <p className="text-lg leading-relaxed">
            บริษัทมุ่งมั่นและทุ่มเท สู่การเป็นผู้นำที่มีความเชี่ยวชาญในด้านงาน
            วิศวกรรม โดยเน้นการบริการอย่างมีคุณภาพ ปลอดภัย
            รองรับความต้องการของลูกค้าได้ทุกรูปแบบ
            เพื่อตอบสนองความพีงพอใจของลูกค้าเป็นหลัก
          </p>
        </div>
        {/* วิสัยทัศน์ */}
        <div className="mb-12">
          <p className="text-lg leading-relaxed">
            <p className="text-lg leading-relaxed">
              เพื่อก้าวสู่การเป็นพันธมิตรที่แข็งแกร่งทั้งในระดับประเทศและอาเซียน
              เราให้ความสำคัญกับคุณภาพและความพึงพอใจของลูกค้า...
            </p>
          </p>
        </div>

        {/* คณะผู้บริหาร */}
        <div className="bg-red-50 dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-red-200">
            {t("about.management_title")}
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              👤 <strong>NAME #1</strong>
            </li>
            <li>
              👤 <strong>NAME #2</strong>
            </li>
            <li>
              👤 <strong>NAME #3</strong>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default About;
