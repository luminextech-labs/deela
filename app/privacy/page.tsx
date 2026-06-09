export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">นโยบายความเป็นส่วนตัว</h1>
        <p className="text-sm text-gray-500 mb-8">อัปเดตล่าสุด: มิถุนายน 2026</p>
        
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. ข้อมูลที่เรารวบรวม</h2>
            <p>Deela อาจรวบรวมข้อมูลดังต่อไปนี้:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>ข้อมูลการใช้งาน:</strong> ประวัติการค้นหา สินค้าที่ดู และการคลิกลิงก์</li>
              <li><strong>ข้อมูลอุปกรณ์:</strong> ประเภทเบราว์เซอร์ ระบบปฏิบัติการ และที่อยู่ IP</li>
              <li><strong>ข้อมูลบัญชี:</strong> อีเมล และข้อมูลการลงทะเบียน (หากคุณสมัครสมาชิก)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. วิธีใช้ข้อมูล</h2>
            <p>เราใช้ข้อมูลที่รวบรวมเพื่อ:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>ให้บริการเปรียบเทียบราคาและค้นหาสินค้า</li>
              <li>ปรับปรุงประสบการณ์การใช้งานของผู้ใช้</li>
              <li>แสดงเนื้อหาที่เกี่ยวข้องกับความสนใจของผู้ใช้</li>
              <li>วิเคราะห์และปรับปรุงบริการ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. การแบ่งปันข้อมูล</h2>
            <p>เราอาจแบ่งปันข้อมูลกับ:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>แพลตฟอร์มพันธมิตร:</strong> Lazada, Shopee, TikTok (เพื่อดึงข้อมูลสินค้า)</li>
              <li><strong>ผู้ให้บริการ:</strong> บริการโฮสติ้งและวิเคราะห์ข้อมูล</li>
              <li><strong>ข้อกำหนดทางกฎหมาย:</strong> เมื่อจำเป็นตามกฎหมาย</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. คุกกี้</h2>
            <p>
              เราใช้คุกกี้เพื่อจดจำความชอบของผู้ใช้และวิเคราะห์การใช้งานเว็บไซต์ คุณสามารถปฏิเสธคุกกี้ผ่านการตั้งค่าเบราว์เซอร์ได้
              แต่การปฏิเสธอาจส่งผลต่อการทำงานของบริการบางส่วน
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. การรักษาความปลอดภัย</h2>
            <p>
              เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต
              อย่างไรก็ตาม ไม่มีระบบใดที่จะปลอดภัย 100% เราจึงไม่สามารถรับประกันความปลอดภัยได้อย่างสมบูรณ์
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. สิทธิ์ของคุณ</h2>
            <p>คุณมีสิทธิ์:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>เข้าถึงข้อมูลส่วนตัวของคุณ</li>
              <li>แก้ไขข้อมูลที่ไม่ถูกต้อง</li>
              <li>ลบข้อมูลส่วนตัวของคุณ</li>
              <li>ปฏิเสธการตลาดทางตรง</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. การเปลี่ยนแปลงนโยบาย</h2>
            <p>
              เราอาจอัปเดตนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การเปลี่ยนแปลงจะมีผลเมื่อประกาศในหน้านี้
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. ติดต่อเรา</h2>
            <p>
              หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อเราที่:<br />
              อีเมล: privacy@deela.app<br />
              เว็บไซต์: https://deela.app
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t">
          <a href="/" className="text-blue-600 hover:text-blue-800">
            ← กลับไปหน้าหลัก
          </a>
        </div>
      </div>
    </div>
  )
}