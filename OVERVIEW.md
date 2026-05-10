# Tài Liệu Tổng Quan Dự Án
## Portfolio Cá Nhân — Ngô Hồ Tấn Toàn

---

## 1. Tổng Quan

| Thuộc tính | Chi tiết |
|---|---|
| **Tên dự án** | Personal Portfolio Website |
| **Chủ sở hữu** | Ngô Hồ Tấn Toàn |
| **Vai trò** | Sinh viên IT năm 4 · Full-stack Web Developer |
| **Mô tả** | Website portfolio cá nhân thể hiện kỹ năng lập trình, dự án đã làm, và tích hợp AI chatbot để tương tác trực tiếp với người xem |
| **Phong cách** | Modern High-Tech & Minimalist — dark mode `#0a0a0a`, glassmorphism, terminal UI |
| **Font** | Roboto Mono — toàn bộ giao diện (cả body lẫn mono) |
| **Màu chủ đạo** | Nền `#0a0a0a` · Accent `cyan-400` · Terminal text `green-400` |
| **Dev URL** | http://localhost:3000 |
| **Deploy** | Vercel |

---

## 2. Mục Tiêu Dự Án

### 2.1 Mục tiêu sản phẩm

| Mục tiêu | Mô tả |
|---|---|
| Xây dựng thương hiệu cá nhân | Tạo ấn tượng chuyên nghiệp với nhà tuyển dụng và cộng đồng dev |
| Minh chứng năng lực kỹ thuật | Bản thân website là bằng chứng cho khả năng full-stack |
| Showcase dự án | Trưng bày các project thực tế, có link GitHub và demo live |
| Kênh liên lạc | Nhận tin nhắn từ người xem trực tiếp qua terminal tích hợp AI |
| Tính mở rộng | Dữ liệu projects lấy từ DB — thêm project mới không cần sửa code |

### 2.2 Mục tiêu kỹ thuật

| Mục tiêu | Giải pháp |
|---|---|
| Kiến trúc chuẩn Next.js App Router | RSC cho data fetching, Client Components cho animation/tương tác |
| AI streaming realtime | Vercel AI SDK v6 + Gemini 2.0 Flash, `useChat` hook |
| Lưu trữ liên tục | Drizzle ORM + Supabase PostgreSQL cho projects và contact messages |
| Type safety 100% | TypeScript strict — `npx tsc --noEmit` → 0 lỗi |
| Hiệu ứng cao cấp | Framer Motion: fade, slide, stagger, 3D mouse-tracking tilt |
| Bảo mật form | Validate phía server (Server Action), không expose DB ra client |

---

## 3. Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React 19)                   │
│                                                         │
│  Hero │ About │ TechStack │ Projects │ AiTerminal       │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP
┌───────────────────────▼─────────────────────────────────┐
│              Next.js 16 App Router (Turbopack)          │
│                                                         │
│  ┌─────────────────────┐   ┌──────────────────────────┐ │
│  │  React Server       │   │  Client Components       │ │
│  │  Components (RSC)   │   │  - Hero (typewriter)     │ │
│  │  - Projects.tsx     │   │  - TechStack (stagger)   │ │
│  │    └─ fetch từ DB   │   │  - ProjectList (3D tilt) │ │
│  └─────────────────────┘   │  - AiTerminal (useChat)  │ │
│                            └──────────────────────────┘ │
│  ┌─────────────────────┐   ┌──────────────────────────┐ │
│  │  API Routes         │   │  Server Actions           │ │
│  │  POST /api/chat     │   │  submitContact()          │ │
│  │  └─ Gemini stream   │   │  └─ validate + DB insert  │ │
│  └─────────────────────┘   └──────────────────────────┘ │
└───────────┬─────────────────────────┬───────────────────┘
            │                         │
    ┌───────▼───────┐         ┌───────▼───────┐
    │ Google Gemini │         │   Supabase    │
    │ 2.0 Flash API │         │  PostgreSQL   │
    └───────────────┘         └───────────────┘
```

**Quy tắc phân chia RSC / Client:**
- `"use client"` — khi dùng `useState`, `useEffect`, `useRef`, event handlers, hooks animation
- RSC (mặc định) — khi chỉ cần fetch data và render HTML tĩnh

---

## 4. Phân Tích Chức Năng

### 4.1 Hero Section
**File:** `src/components/Hero.tsx` · **Type:** Client Component

**Mục đích:** Màn hình đầu tiên, tạo ấn tượng ngay khi vào trang với phong cách terminal.

| Chức năng | Cách thực hiện |
|---|---|
| Typewriter effect | `setInterval` 50ms/ký tự gõ chuỗi `> Hello, I'm Ngô Hồ Tấn Toàn \| IT Student & Web Developer` |
| Blinking cursor | CSS `@keyframes blink` qua class `cursor-blink` — nhấp nháy sau khi typing xong |
| Entry animation | Framer Motion `opacity: 0→1, y: 20→0, duration: 0.6s` khi page load |
| Ambient glow | Div `w-700px, bg-cyan-500/5, blur-[140px]` tạo hiệu ứng ánh sáng nền |
| CTA buttons | `./view-projects` và `./contact-me` — dùng `onClick + scrollIntoView` (không dùng `href="#"` để tránh auto-scroll khi reload) |
| Fade-in delayed | CTA và tagline chỉ `opacity: 1` sau khi `isTypingDone === true` |

**Luồng xử lý:**
```
Mount → Framer Motion fade-in (0.6s)
      → setInterval 50ms/char bắt đầu gõ
      → index === FULL_TEXT.length → isTypingDone = true → clearInterval
      → CTA + tagline animate opacity: 0→1 (delay 0.4s)
```

---

### 4.2 About Section
**File:** `src/components/About.tsx` · **Type:** Client Component

**Mục đích:** Giới thiệu bản thân ngắn gọn — ảnh, tên, bio, thông tin học tập.

| Chức năng | Cách thực hiện |
|---|---|
| Avatar tròn | `next/image` với `fill + object-cover`, border `cyan-400/30`, `overflow-hidden` |
| Fallback avatar | `onError` → thay src bằng dicebear initials API khi `avatar.jpg` chưa có |
| Glow ring | `absolute inset-0 bg-cyan-400/20 blur-2xl scale-110` phía sau avatar |
| Online indicator | Chấm `bg-green-400` góc phải dưới, `shadow-green-400/50` |
| Stats grid | 4 ô glassmorphism: Year of Study (Year 4), Major (IT), Projects (10+), Status (Open to work) |
| Bio text | 2 đoạn tiếng Việt, `text-slate-400 leading-7` |
| Slide animation | Avatar `x: -30→0`, bio `x: 30→0` khi scroll vào viewport |

> **Lưu ý:** Thêm ảnh thật vào `public/avatar.jpg` để thay thế placeholder.

---

### 4.3 Tech Stack Section
**File:** `src/components/TechStack.tsx` · **Type:** Client Component

**Mục đích:** Showcase các công nghệ đang sử dụng với hiệu ứng chuyên nghiệp.

| Chức năng | Cách thực hiện |
|---|---|
| Skills grid | 9 card: C#, Next.js, Tailwind CSS, TypeScript, Supabase, Git, React, Drizzle ORM, PostgreSQL |
| Màu riêng từng skill | Mỗi item có `text-color` + `border-color` đặc trưng (purple, cyan, blue, green, orange...) |
| Stagger animation | `variants` Framer Motion với `staggerChildren: 0.08` — card xuất hiện lần lượt |
| useInView trigger | `useInView(ref, { once: true, margin: "-80px" })` — animation chỉ chạy 1 lần khi đến viewport |
| Float effect | CSS `@keyframes float-anim` qua class `animate-float`, mỗi card delay khác nhau (`animationDelay`) |
| Hover scale | `hover:scale-105 transition-transform duration-200` |

---

### 4.4 Projects Section
**Files:** `src/components/Projects.tsx` (RSC) + `src/components/ProjectList.tsx` (Client)

**Mục đích:** Hiển thị danh sách dự án từ database, với card 3D tilt ấn tượng.

#### Projects.tsx — React Server Component
| Chức năng | Cách thực hiện |
|---|---|
| Fetch từ DB | `db.select().from(projects).orderBy(desc(created_at))` — chạy server-side |
| Fallback | `try/catch` → dùng `PLACEHOLDER_PROJECTS` khi DB không kết nối được |
| Truyền data | Render `<ProjectList projects={data} />` với data đã fetch |

#### ProjectList.tsx — Client Component
| Chức năng | Cách thực hiện |
|---|---|
| 3D tilt card | `useMotionValue(x/y)` + `useSpring` + `useTransform` → `rotateX/rotateY` theo vị trí chuột |
| Glassmorphism | Class `glass`: `bg-white/5, backdrop-blur-12px, border-white/8` |
| Viewport animation | `whileInView={{ opacity:1, y:0 }}` với `viewport={{ once: true, margin: "-50px" }}` |
| translateZ layer | Inner div `style={{ transform: "translateZ(20px)" }}` tạo chiều sâu 3D |
| Links conditional | `source_url` → nút `> source`; `live_url` → nút `> live demo`; chỉ hiện khi có data |
| Project ID badge | `[01]`, `[02]`... góc phải trên card |

**Schema bảng `projects`:**
```sql
id          SERIAL PRIMARY KEY
title       TEXT NOT NULL
description TEXT NOT NULL
source_url  TEXT                              -- nullable
live_url    TEXT                              -- nullable
created_at  TIMESTAMP DEFAULT NOW() NOT NULL
```

---

### 4.5 AI Terminal
**File:** `src/components/AiTerminal.tsx` · **Type:** Client Component

**Mục đích:** Terminal macOS-style kép — vừa là AI chatbot, vừa là contact form.

#### Giao diện chung
| Yếu tố | Chi tiết |
|---|---|
| macOS title bar | 3 dot traffic light (đỏ/vàng/xanh), tiêu đề thay đổi theo mode |
| Terminal body | `bg-[#0d0d0d]`, `h-80 overflow-y-auto`, font mono, auto-scroll đến đáy |
| Input row | Prompt label + input field, style terminal |

#### Chế độ Chat (mặc định)
| Chức năng | Cách thực hiện |
|---|---|
| AI streaming | `useChat()` từ `@ai-sdk/react` → `{ messages, sendMessage, status }` |
| Trạng thái loading | `status === "submitted" \| "streaming"` → hiện blinking `▋` |
| Render messages | Lọc `parts` có `type === "text"`, user = `green-400`, AI = `slate-300` với border-l |
| Switch mode | Gõ `/contact` → `setMode("contact")`, log dòng hệ thống |

#### Chế độ Contact Form
| Chức năng | Cách thực hiện |
|---|---|
| Luồng nhập | Tuần tự: `name` → `email` → `message` (mỗi bước hỏi 1 dòng) |
| Log terminal | Mỗi bước hiện prompt + input dưới dạng `> field: value` |
| Typewriter loading | `setInterval 40ms` gõ chuỗi `> Executing data transfer...` khi đang submit |
| Server Action | `submitContact(FormData)` — validate server-side + insert Supabase |
| Kết quả | Success → `> Transfer complete` + nút `> return to chat`; Error → log đỏ + nút `> try again` |
| Chống duplicate key | `logCounterRef = useRef(0)` tăng đơn điệu — không dùng state để tránh re-render race |

**API Route `POST /api/chat`:**
```
Request:  { messages: UIMessage[] }
          ↓
          convertToModelMessages(messages)  ← async, await bắt buộc
          ↓
          streamText({ model: gemini-2.0-flash, system: "...", messages })
          ↓
Response: toUIMessageStreamResponse()       ← stream từng chunk về client
          (try/catch → 503 nếu Gemini lỗi)
```

**Server Action `submitContact`:**
```
Input: FormData { name, email, message }
  ↓ validate: name (2–100 chars), email (regex), message (10–5000 chars)
  ↓ db.insert(contact_messages).values({ name, email, message })
Output: { success: boolean, error?: string }
```

**Schema bảng `contact_messages`:**
```sql
id         SERIAL PRIMARY KEY
name       TEXT NOT NULL
email      TEXT NOT NULL
message    TEXT NOT NULL
created_at TIMESTAMP DEFAULT NOW() NOT NULL
```

---

## 5. Stack Công Nghệ

### Frontend
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| Next.js | 16.2.6 | Framework — App Router, RSC, Server Actions, API Routes |
| React | 19.2.4 | UI runtime |
| TypeScript | ^5 | Type safety toàn bộ |
| Tailwind CSS | ^4 | Utility CSS, custom `@utility` directives |
| Framer Motion | ^12 | Animation — fade, slide, stagger, 3D tilt, spring |
| Roboto Mono | Google Fonts | Font duy nhất — `subsets: ["latin", "vietnamese"]` |

### Backend / Data
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| Drizzle ORM | ^0.45 | Type-safe ORM, schema definition, query builder |
| postgres | ^3.4 | PostgreSQL driver cho Node.js |
| Supabase | — | Managed PostgreSQL (region: ap-southeast-2, Sydney) |
| drizzle-kit | ^0.31 | CLI migration (`push`, `generate`, `studio`) |

### AI
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| ai (Vercel AI SDK) | ^6 | Core — `streamText`, `convertToModelMessages`, types |
| @ai-sdk/react | ^3 | `useChat` hook — streaming state management phía client |
| @ai-sdk/google | ^3 | Gemini provider adapter |
| Gemini 2.0 Flash | — | LLM — phản hồi nhanh, context portfolio |

---

## 6. Cấu Trúc Thư Mục

```
newtech/
├── src/
│   ├── app/
│   │   ├── globals.css              # Theme, keyframes, @utility (cursor-blink, animate-float, glass, bg-grid-pattern)
│   │   ├── layout.tsx               # Root layout — Roboto Mono, ScrollReset, metadata
│   │   ├── page.tsx                 # Entry point — lắp ráp tất cả sections + footer
│   │   └── api/chat/
│   │       └── route.ts             # POST /api/chat — Gemini 2.0 Flash streaming
│   ├── components/
│   │   ├── Hero.tsx                 # [Client] Full-screen hero + typewriter + CTA
│   │   ├── About.tsx                # [Client] Avatar + bio + stats grid + slide animation
│   │   ├── TechStack.tsx            # [Client] Skills grid + stagger + float
│   │   ├── Projects.tsx             # [RSC]    Fetch DB → render ProjectList
│   │   ├── ProjectList.tsx          # [Client] 3D tilt glassmorphism cards
│   │   ├── AiTerminal.tsx           # [Client] macOS terminal — AI chat + contact form
│   │   └── ScrollReset.tsx          # [Client] Xóa hash URL, scrollTo(0,0) khi load
│   ├── db/
│   │   ├── index.ts                 # Khởi tạo Drizzle client (postgres driver)
│   │   └── schema.ts                # Schema: projects, contact_messages + infer types
│   └── actions/
│       └── contact.ts               # "use server" — submitContact() với validation
├── public/
│   └── avatar.jpg                   # ⚠ Cần thêm thủ công (hiện đang dùng placeholder dicebear)
├── next.config.ts                   # remotePatterns: api.dicebear.com
├── drizzle.config.ts                # Drizzle Kit — load .env.local qua dotenv
├── .env.local                       # DATABASE_URL, GOOGLE_GENERATIVE_AI_API_KEY
└── package.json
```

---

## 7. Biến Môi Trường

| Biến | Dùng ở | Mục đích |
|---|---|---|
| `DATABASE_URL` | `src/db/index.ts` | PostgreSQL connection string Supabase |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `src/app/api/chat/route.ts` | Gemini API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side (nếu cần) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client-side (nếu cần) | Supabase publishable key |

---

## 8. Trạng Thái Hiện Tại

| # | Hạng mục | Trạng thái | Ghi chú |
|---|---|---|---|
| TypeScript | ✅ Sạch | `npx tsc --noEmit` → 0 lỗi | |
| Hero | ✅ Hoàn chỉnh | Typewriter, CTA, animation | |
| About | ⚠ Gần xong | Chạy được, avatar dùng placeholder | Cần thêm `public/avatar.jpg` |
| TechStack | ✅ Hoàn chỉnh | Stagger + float animation | |
| Projects | ⚠ Dùng fallback | Hiển thị placeholder data | Cần kết nối DB |
| AI Terminal | ✅ Hoàn chỉnh | Chat + contact form hoạt động | |
| Database | ❌ Chưa kết nối | ENOTFOUND hostname Supabase | Tạo bảng thủ công qua SQL Editor |
| Deploy | ❌ Chưa deploy | — | Cần push lên GitHub → Vercel |

**SQL tạo bảng (chạy trong Supabase SQL Editor):**
```sql
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  source_url  TEXT,
  live_url    TEXT,
  created_at  TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

## 9. Lệnh Hay Dùng

```bash
# Chạy dev server (Turbopack)
npm run dev

# Kiểm tra TypeScript
npx tsc --noEmit

# Push schema lên DB
npx drizzle-kit push

# Mở Drizzle Studio (quản lý DB trực quan)
npx drizzle-kit studio

# Build production
npm run build

# Chạy production build
npm start
```


---

## 2. Mục Tiêu Dự Án

### 2.1 Mục tiêu chính
- **Xây dựng thương hiệu cá nhân** — Tạo điểm nhấn chuyên nghiệp cho nhà tuyển dụng và cộng đồng dev.
- **Trình bày kỹ năng kỹ thuật** — Bản thân trang web là minh chứng cho năng lực full-stack.
- **Giới thiệu dự án** — Showcase các project đã làm, có link source và demo live.
- **Tạo kênh liên lạc** — Nhận tin nhắn trực tiếp từ người xem qua form tích hợp AI terminal.

### 2.2 Mục tiêu kỹ thuật
- Áp dụng **Next.js App Router** (React Server Components + Client Components) đúng chuẩn.
- Triển khai **AI streaming chat** với Gemini 2.0 Flash qua Vercel AI SDK v6.
- Sử dụng **Drizzle ORM + Supabase PostgreSQL** để lưu trữ project và contact messages.
- Đảm bảo **TypeScript strict** — 0 lỗi compile.
- Hiệu ứng mượt với **Framer Motion** (fade, slide, stagger, 3D tilt).

---

## 3. Kiến Trúc Hệ Thống

```
Browser (React 19)
    │
    ├── Next.js 16 App Router (Turbopack)
    │       ├── React Server Components  → fetch data trực tiếp từ DB
    │       └── Client Components        → UI tương tác, animation
    │
    ├── API Routes
    │       └── /api/chat                → AI streaming (Gemini 2.0 Flash)
    │
    ├── Server Actions
    │       └── submitContact()          → validate + insert contact message
    │
    └── Drizzle ORM → Supabase PostgreSQL (ap-southeast-2)
```

---

## 4. Phân Tích Chức Năng

### 4.1 Hero Section (`src/components/Hero.tsx`)
**Mô tả:** Màn hình chào đầu tiên chiếm toàn viewport.

| Tính năng | Chi tiết |
|---|---|
| Typewriter effect | Gõ từng ký tự chuỗi `> Hello, I'm Ngô Hồ Tấn Toàn | IT Student & Web Developer` với tốc độ 50ms/char |
| Blinking cursor | Con trỏ nhấp nháy CSS (`cursor-blink`) sau khi typing xong |
| Fade-in animation | Framer Motion `opacity: 0→1, y: 20→0` khi load trang |
| Ambient glow | Vòng glow cyan blur-[140px] ở giữa tạo chiều sâu |
| CTA buttons | `./view-projects` (anchor #projects) + `./contact-me` (anchor #terminal), xuất hiện sau khi typing xong |
| Terminal aesthetic | Label `portfolio.exe — v1.0.0`, font mono, màu green-400 |

**Luồng:**
```
Page load → Framer Motion fade-in → setInterval 50ms typing → isTypingDone = true → CTA fade-in
```

---

### 4.2 About Section (`src/components/About.tsx`)
**Mô tả:** Giới thiệu cá nhân với ảnh đại diện và thông tin cơ bản.

| Tính năng | Chi tiết |
|---|---|
| Avatar tròn | `next/image` fill + `object-cover`, border cyan/30, overflow hidden |
| Glow ring | `bg-cyan-400/20 blur-2xl scale-110` phía sau avatar |
| Online indicator | Chấm xanh `bg-green-400` góc dưới phải, shadow glow |
| Stats grid | 4 chỉ số: Year of Study, Major, Projects (10+), Status |
| Bio text | 2 đoạn mô tả tiếng Việt, font sans (Roboto Mono) |
| Badge IT Student | Label mono, border cyan dạng inline-code |
| Slide animation | Avatar slide từ trái, bio slide từ phải (`x: ±30`) |

**Lưu ý:** `public/avatar.jpg` cần được thêm thủ công — chưa có file.

---

### 4.3 Tech Stack Section (`src/components/TechStack.tsx`)
**Mô tả:** Grid hiển thị 9 công nghệ với animation stagger.

| Tính năng | Chi tiết |
|---|---|
| Skills grid | 9 kỹ năng: C#, Next.js, Tailwind CSS, TypeScript, Supabase, Git, React, Drizzle ORM, PostgreSQL |
| Màu sắc riêng | Mỗi skill có màu text + border đặc trưng (cyan, blue, purple, green...) |
| Stagger animation | `staggerChildren: 0.08` — card xuất hiện lần lượt khi scroll đến |
| Float effect | CSS animation `animate-float` — card lơ lửng nhẹ |
| useInView trigger | Chỉ kích hoạt animation khi phần tử vào viewport (`margin: -80px`) |

---

### 4.4 Projects Section (`src/components/Projects.tsx` + `ProjectList.tsx`)
**Mô tả:** Hiển thị danh sách dự án, lấy dữ liệu từ database.

| Tính năng | Chi tiết |
|---|---|
| React Server Component | Fetch projects trực tiếp từ Supabase PostgreSQL qua Drizzle ORM |
| Fallback data | `PLACEHOLDER_PROJECTS` (3 project mẫu) khi DB không kết nối được |
| 3D tilt card | Mouse-tracking 3D perspective dùng `useMotionValue` + `useSpring` + `useTransform` |
| Glassmorphism | `backdrop-blur-md`, `bg-white/5`, `border border-white/8` |
| Viewport animation | Framer Motion `whileInView` với `once: true` |
| Links | Source (GitHub) + Live Demo — optional, chỉ hiện khi có data |

**Cấu trúc DB (bảng `projects`):**
```sql
id          SERIAL PRIMARY KEY
title       TEXT NOT NULL
description TEXT NOT NULL
source_url  TEXT           -- nullable
live_url    TEXT           -- nullable
created_at  TIMESTAMP DEFAULT NOW()
```

---

### 4.5 AI Terminal (`src/components/AiTerminal.tsx`)
**Mô tả:** Terminal macOS-style, tích hợp 2 chế độ: AI chat và contact form.

#### Chế độ Chat (mặc định)
| Tính năng | Chi tiết |
|---|---|
| AI provider | Google Gemini 2.0 Flash (`@ai-sdk/google`) |
| Streaming | `useChat` từ `@ai-sdk/react` — response stream theo thời gian thực |
| Status | `status === "submitted" \| "streaming"` → hiện loading indicator |
| Command đặc biệt | Gõ `/contact` → chuyển sang chế độ contact form |
| macOS UI | 3 dot traffic light (đỏ/vàng/xanh), title bar, scroll area |

#### Chế độ Contact Form
| Tính năng | Chi tiết |
|---|---|
| Luồng nhập liệu | Nhập tuần tự: name → email → message (terminal-style) |
| Server Action | `submitContact()` — validate + insert vào `contact_messages` |
| Validation | name (2–100 ký tự), email (regex), message (10–5000 ký tự) |
| Typewriter loading | Hiệu ứng gõ chữ khi đang gửi |
| Log entries | Mỗi bước được log ra terminal với màu: prompt (cyan) / system / success (green) / error (red) |
| `useRef` counter | Tránh duplicate key React — dùng `logCounterRef` thay vì state |

**API Route (`/api/chat`):**
```
POST /api/chat
Body: { messages: UIMessage[] }

→ convertToModelMessages(messages)  [async]
→ streamText({ model: gemini-2.0-flash, system: "...", messages })
→ toUIMessageStreamResponse()
```

**Cấu trúc DB (bảng `contact_messages`):**
```sql
id         SERIAL PRIMARY KEY
name       TEXT NOT NULL
email      TEXT NOT NULL
message    TEXT NOT NULL
created_at TIMESTAMP DEFAULT NOW()
```

---

## 5. Stack Công Nghệ

### Frontend
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| Next.js | 16.2.6 | Framework chính, App Router, SSR/RSC |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type safety toàn bộ codebase |
| Tailwind CSS | ^4 | Styling, custom utilities |
| Framer Motion | ^12 | Animation (fade, slide, stagger, 3D tilt) |
| Roboto Mono | Google Fonts | Font duy nhất — cả sans lẫn mono |

### Backend / Data
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| Drizzle ORM | ^0.45 | ORM type-safe, schema + query builder |
| postgres (driver) | ^3.4 | Kết nối PostgreSQL |
| Supabase | — | PostgreSQL host (region: ap-southeast-2) |
| drizzle-kit | ^0.31 | Migration CLI |

### AI
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| ai (Vercel AI SDK) | ^6 | Core streaming, `useChat`, `streamText` |
| @ai-sdk/react | ^3 | `useChat` hook cho client |
| @ai-sdk/google | ^3 | Gemini provider |
| Gemini 2.0 Flash | — | LLM model |

---

## 6. Cấu Trúc Thư Mục

```
newtech/
├── src/
│   ├── app/
│   │   ├── globals.css          # Dark theme, grid pattern, glassmorphism utilities
│   │   ├── layout.tsx           # Root layout, Roboto Mono font, metadata
│   │   ├── page.tsx             # Main page — wires tất cả sections
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts     # POST /api/chat — Gemini streaming
│   ├── components/
│   │   ├── Hero.tsx             # Full-screen hero + typewriter
│   │   ├── About.tsx            # Avatar + bio + stats
│   │   ├── TechStack.tsx        # Skills grid + stagger animation
│   │   ├── Projects.tsx         # RSC — fetch từ DB
│   │   ├── ProjectList.tsx      # Client — 3D tilt cards
│   │   └── AiTerminal.tsx       # macOS terminal, AI chat + contact form
│   ├── db/
│   │   ├── index.ts             # Drizzle client init
│   │   └── schema.ts            # Table definitions (projects, contact_messages)
│   └── actions/
│       └── contact.ts           # Server Action: submitContact()
├── public/
│   └── avatar.jpg               # ⚠ THIẾU — cần thêm thủ công
├── .env.local                   # DATABASE_URL, GOOGLE_GENERATIVE_AI_API_KEY
├── drizzle.config.ts            # Drizzle Kit config (load dotenv)
└── package.json
```

---

## 7. Biến Môi Trường

| Biến | Mục đích |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |

---

## 8. Vấn Đề Đang Tồn Tại

| # | Vấn đề | Mức độ | Giải pháp |
|---|---|---|---|
| 1 | `public/avatar.jpg` thiếu | Medium | Thêm ảnh vào `public/avatar.jpg` |
| 2 | DB connection lỗi ENOTFOUND | High | Tạo bảng thủ công qua Supabase SQL Editor |
| 3 | Projects fallback data tĩnh | Low | Sau khi có DB, data tự động load từ Supabase |

**SQL tạo bảng (chạy trong Supabase SQL Editor):**
```sql
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

## 9. Lệnh Hay Dùng

```bash
# Chạy dev server
npm run dev

# Kiểm tra TypeScript
npx tsc --noEmit

# Push schema lên DB (khi DB kết nối được)
npx drizzle-kit push

# Build production
npm run build
```
