# 📸 Modern Full-Stack Masonry Gallery

> โปรเจกต์เว็บแกลเลอรีรูปภาพอัจฉริยะที่มาพร้อมระบบการจัดเรียงแบบ Masonry Layout และระบบกรอง Hashtag แบบ Multi-select

**🌐 Live Demo:** [https://gallery-test-two.vercel.app/](https://gallery-test-two.vercel.app/)

---

## ✨ Key Features (ฟีเจอร์เด่น)

* **Adaptive Masonry Grid:** ระบบจัดเรียงรูปภาพแบบสลับฟันปลาที่ปรับขนาดคอลัมน์อัตโนมัติตามขนาดหน้าจอ (1 ถึง 4 คอลัมน์)
* **Smart Multi-Tag Filtering:** กรองรูปภาพด้วย Hashtag จากแถบเมนูตรงกลาง (Centered Tags Cloud) สามารถกดเลือกได้หลาย Tag พร้อมกัน (Toggle)
* **Optimized Infinite Scroll:** โหลดรูปภาพเพิ่มอัตโนมัติเมื่อเลื่อนลงมาถึงด้านล่างสุด (Just-in-time loading) พร้อมตั้งค่าได้ว่าจะดึงข้อมูลทีละกี่รูป (10, 20, 30, หรือ 50 รูป)
* **Smooth UX/UI:** ดีไซน์สไตล์ Minimalist ด้วย Tailwind CSS พร้อมเอฟเฟกต์ Backdrop Blur ที่ Navbar และปุ่ม Back-to-Top

---

## 🛠️ Technology Stack

ระบบถูกออกแบบเป็น **Monorepo** เพื่อความคล่องตัวในการพัฒนาและปรับใช้

| Layer | Technology | Key Responsibility (หน้าที่หลัก) |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | จัดการ UI, Routing และ State Management |
| **Styling** | Tailwind CSS | จัดการ Layout (Masonry) และ Responsive Design |
| **Backend API**| Next.js API Routes | ทำงานเป็น Serverless Function รับส่งข้อมูล JSON |
| **ORM** | Prisma | จัดการ Schema และ Query ข้อมูลแบบ Type-safe |
| **Database** | PostgreSQL (Neon.tech) | Serverless Database สำหรับเก็บข้อมูลรูปภาพและ Tags |
| **Deployment**| Vercel | CI/CD Platform สำหรับการนำขึ้นใช้งานจริง |

---

## 💻 Production Environment Details

เนื่องจากระบบถูกออกแบบด้วยสถาปัตยกรรม **Modern Serverless** เพื่อลดภาระการดูแลระบบ (Zero-maintenance) และให้รองรับผู้ใช้งานได้ยืดหยุ่น (Auto-scaling) สเปคและซอฟต์แวร์บน Production จึงมีรายละเอียดดังนี้:

### 1. Application Server (แพลตฟอร์มรันเว็บและ API)
* **Provider:** Vercel (รันอยู่บนโครงสร้างพื้นฐานของ AWS)
* **OS/Environment:** Managed Amazon Linux 2 (Serverless Runtime)
* **Software/Runtime:** Node.js v20.x
* **Server Specifications (Serverless Functions):**
  * **Memory:** 1024 MB ต่อ 1 Request (ขยายได้ตาม Tier)
  * **Execution Timeout:** 10 - 15 วินาที สำหรับ API Routes
  * **Scaling:** อัตโนมัติ (จาก 0 ไปจนถึงหลายพัน Concurrent Requests)
  * **CDN:** Vercel Edge Network

### 2. Database Server (ฐานข้อมูล)
* **Provider:** Neon.tech (Serverless Postgres)
* **OS/Environment:** Managed Linux Cloud Environment (AWS Region: ap-southeast-1 Singapore)
* **Software:** PostgreSQL 15+
* **Server Specifications:**
  * **Compute:** อัตโนมัติ (Auto-scaling Compute ตั้งแต่ 0.25 vCPU ไปจนถึงระดับ Production ตามโหลดการใช้งานจริง)
  * **Storage:** ยืดหยุ่นอัตโนมัติตามขนาดข้อมูล
  * **Connection Pooling:** ใช้ PgBouncer ในตัว เพื่อรองรับ Connection จำนวนมากจาก Serverless Functions ป้องกันปัญหา Database Overload

### 3. Deployment Flow (วิธีการนำระบบขึ้น Production)
ใช้กระบวนการ **CI/CD (Continuous Integration / Continuous Deployment)** แบบอัตโนมัติผ่าน GitHub และ Vercel:

1. **Code Commit:** พัฒนาและ Push โค้ดขึ้นสู่ Repository บน GitHub (Branch: `main`)
2. **Webhook Trigger:** Vercel ตรวจจับการเปลี่ยนแปลงใน Branch `main` และเริ่มกระบวนการ Build อัตโนมัติ
3. **Build Phase:** * รันคำสั่ง `npm install` เพื่อลง Dependencies 
   * รัน `prisma generate` เพื่อสร้าง Database Client
   * รัน `next build` เพื่อคอมไพล์โค้ด React เป็น Static HTML และ Serverless Functions
4. **Release:** เมื่อ Build สำเร็จ Vercel จะ Deploy เวอร์ชันใหม่ขึ้น Live URL ทันทีโดยไม่มี Downtime (Zero Downtime Deployment)

---

## 🏗️ System Architecture

สถาปัตยกรรมการทำงานของระบบตั้งแต่ผู้ใช้ (Client) ไปจนถึงฐานข้อมูล (Database):

```mermaid
graph TD
    A[User / Client Browser] -->|HTTP GET Request| B(Next.js App Router)
    subgraph "Vercel Cloud Infrastructure"
    B --> C{API Route: /api/images}
    C -->|Prisma Query| D[Connection Pool]
    end
    D -->|SQL SELECT & FILTER| E[(Neon PostgreSQL)]
    E -->|Return Data| D
    D -->|JSON Response| C
    C -->|Render Gallery| B
    B -->|Update UI| A