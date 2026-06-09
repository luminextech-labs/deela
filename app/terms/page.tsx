export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">ข้อกำหนดการใช้บริการ</h1>
        <p className="text-sm text-gray-500 mb-8">อัปเดตล่าสุด: มิถุนายน 2026</p>
        
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. บริการของเรา</h2>
            <p>
              Deela เป็นแอปพลิเคชันเปรียบเทียบราคาสินค้าสำหรับตลาดไทย โดยรวบรวมข้อมูลราคาและสินค้าจากแพลตฟอร์มต่างๆ 
              รวมถึง Lazada, Shopee และ TikTok Shop เพื่อช่วยให้ผู้ใช้สามารถค้นหาและเปรียบเทียบราคาได้อย่างสะดวก
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. การใช้งาน</h2>
            <p>ผู้ใช้ตกลงที่จะ:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>ใช้บริการเพื่อวัตถุประสงค์ส่วนตัวที่ถูกกฎหมายเท่านั้น</li>
              <li>ไม่ใช้บริการในทางที่ผิดกฎหมายหรือขัดต่อข้อกำหนดเหล่านี้</li>
              <li>ไม่คัดลอก ดัดแปลง หรือเผยแพร่เนื้อหาจากบริการโดยไม่ได้รับอนุญาต</li>
              <li>ไม่พยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. ลิงก์พันธมิตร (Affiliate Links)</h2>
            <p>
              Deela อาจมีลิงก์พันธมิตรที่นำไปสู่ผลิตภัณฑ์บนแพลตฟอร์มอื่น เมื่อผู้ใช้ซื้อสินค้าผ่านลิงก์เหล่านี้ 
              Deela อาจได้รับค่าคอมมิชชันจากการขาย โดยไม่มีค่าใช้จ่ายเพิ่มเติมสำหรับผู้ใช้
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. ข้อมูลสินค้า</h2>
            <p>
              ข้อมูลสินค้าและราคาที่แสดงใน Deela มาจากแพลตฟอร์มต่างๆ และอาจมีการเปลี่ยนแปลง 
              Deela ไม่สามารถรับประกันความถูกต้องของราคาและความพร้อมในการซื้อได้ ผู้ใช้ควรตรวจสอบกับแพลตฟอร์มต้นทางก่อนซื้อ
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. ข้อจำกัดความรับผิด</h2>
            <p>
              Deela ไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้บริการ รวมถึงแต่ไม่จำกัดเพียง
              ความเสียหายทางตรง ทางอ้อม หรือที่เกิดจากการสูญเสียโอกาส
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. การเปลี่ยนแปลงข้อกำหนด</h2>
            <p>
              Deela ขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดเหล่านี้ได้ตลอดเวลา โดยจะแจ้งให้ผู้ใช้ทราบผ่านการอัปเดตในหน้านี้
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. ติดต่อเรา</h2>
            <p>
              หากมีคำถามเกี่ยวกับข้อกำหนดการใช้บริการ กรุณาติดต่อเราที่:<br />
              อีเมล: support@deela.app<br />
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