# TinyLink — URL Shortener (Next.js + Prisma + PostgreSQL)

TinyLink is a fully functional **URL Shortener** built using  **Next.js App Router** ,  **Prisma ORM** , and  **PostgreSQL** .

It supports custom short codes, URL validation, redirects with click-tracking, analytics, a dashboard, and a healthcheck system.

This project is built as part of a backend assignment and follows production-style architecture, API conventions, and database design.

🚀 Live Demo

🔗 Deployed App: https://tinylink-pink.vercel.app

💻 Local Dev: http://localhost:3000

## 🚀 Features

### 🔗 **Short Link Creation**

* Create short links from long URLs
* Optional **custom short code**
* Server-side URL validation
* Custom codes must be **globally unique**
* Stores creation time automatically

### 🔀 **Redirection**

* Visiting `/<code>` performs HTTP **302 redirect**
* On every redirect:
  * `totalClicks` increments
  * `lastClicked` is updated
  * A click entry is stored (IP + timestamp)

### 🗑 **Delete Link**

* Delete links from the dashboard
* Deleted codes return **404**

### 📊 **Dashboard**

* List of all short links with:
  * Code
  * Target URL
  * Total clicks
  * Last clicked time
* Add link form (custom code supported)
* Delete link
* Search / Filter by code or target URL
* Copy short link button
* Modal-based form on desktop, inline form on mobile
* Fully responsive UI

### 📈 **Analytics Page**

* Page: `/dashboard/[code]`
* Shows detailed statistics for a single link:
  * Target URL
  * Total clicks
  * Last clicked
  * List of click events (timestamp + IP)
* Clean UI for viewing timelines

### ❤️ **System Healthcheck**

* `/api/healthz`
* Returns:
  * System uptime
  * Build time
  * Database statusProject Structure


## 🛠️ Tech Stack

| Category   | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | Next.js 15 (App Router), React          |
| Backend    | Next.js Server Routes (route handlers)  |
| Database   | PostgreSQL                              |
| ORM        | Prisma                                  |
| Deployment | Vercel (Next.js) + Neon.tech (Postgres) |
| UI         | TailwindCSS, react-hot-toast            |
| Dev        | Docker (local Postgres), TypeScript     |

---

## 📁 Project Structure

<pre class="overflow-visible!" data-start="2192" data-end="2670"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>/app
  /api
    /links
      route.ts        → POST + GET (all links)
    /links/[code]
      route.ts        → GET (single) + DELETE
    /healthz
      route.ts        → service health
  /[code]
    page.tsx          → redirect handler
  /dashboard
    page.tsx          → main dashboard
    /[code]
      page.tsx        → analytics page

/lib
  prisma.ts           → Prisma client instance

/prisma
  schema.prisma       → DB schema

/components
  ...UI components...
</span></span></code></div></div></pre>

---

⚙️ Environment Variables

Create .env:

DATABASE_URL="your_postgres_connection_url"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"


When deployed on Vercel:

NEXT_PUBLIC_BASE_URL="https://tinylink-pink.vercel.app"

▶️ Running Locally
git clone https://github.com/yourusername/tinylink.git
cd tinylink

npm install
npx prisma generate
npm run dev

App runs on → http://localhost:3000

🗄️ Prisma Commands
Create database migrations
npx prisma migrate dev

Push schema without migration (not recommended for prod)
npx prisma db push

Deploy migrations (production)
npx prisma migrate deploy

## 🗄️ Database Schema (Prisma)

<pre class="overflow-visible!" data-start="2710" data-end="3190"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-prisma"><span>model Link {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  targetUrl   String
  totalClicks Int      @default(0)
  createdAt   DateTime @default(now())
  lastClicked DateTime?
  clicks      Click[]
}

model Click {
  id        Int      @id @default(autoincrement())
  linkId    Int
  timestamp DateTime @default(now())
  ip        String?
  link      Link     @relation(fields: [linkId], references: [id], onDelete: Cascade)
}
</span></code></div></div></pre>


# Local Development Setup

## 1. Clone the repository

<pre class="overflow-visible!" data-start="3254" data-end="3296"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-sh"><span><span>git </span><span>clone</span><span> <repo-url>
</span><span>cd</span><span> tinylink
</span></span></code></div></div></pre>

## 2. Install dependencies

<pre class="overflow-visible!" data-start="3325" data-end="3346"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-sh"><span><span>npm install
</span></span></code></div></div></pre>

---

# 🐘 Database Setup (PostgreSQL via Docker)

Run Postgres locally:

<pre class="overflow-visible!" data-start="3421" data-end="3568"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-sh"><span><span>docker run --name tinylink-postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e POSTGRES_DB=tinylink -p 5432:5432 -d postgres:15
</span></span></code></div></div></pre>

### Verify container:

<pre class="overflow-visible!" data-start="3592" data-end="3611"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-sh"><span><span>docker ps
</span></span></code></div></div></pre>

---

## 3. Setup Environment Variables

Create `.env`:

<pre class="overflow-visible!" data-start="3669" data-end="3785"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>DATABASE_URL</span><span>=</span><span>"postgresql://admin:admin@localhost:5432/tinylink"</span><span>
</span><span>NEXT_PUBLIC_BASE_URL</span><span>=</span><span>"http://localhost:3000"</span><span>
</span></span></code></div></div></pre>

---

## 4. Run Prisma migrations

<pre class="overflow-visible!" data-start="3820" data-end="3852"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-sh"><span><span>npx prisma migrate dev
</span></span></code></div></div></pre>

Open Prisma Studio:

<pre class="overflow-visible!" data-start="3874" data-end="3901"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-sh"><span><span>npx prisma studio
</span></span></code></div></div></pre>

---

## 5. Start the Dev Server

<pre class="overflow-visible!" data-start="3935" data-end="3956"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-sh"><span><span>npm run dev
</span></span></code></div></div></pre>

Now visit:

### Dashboard

`http://localhost:3000/dashboard`

### Healthcheck

`http://localhost:3000/api/healthz`

### Redirect test

`http://localhost:3000/abc123`

---

# 📡 API Endpoints

### **POST /api/links**

Create a short link.

### **GET /api/links**

Get all links.

### **GET /api/links/[code]**

Get a single link with analytics.

### **DELETE /api/links/[code]**

Delete a link.

### **GET /api/healthz**
e.g. http://localhost:3000/api/healthz

System health and uptime.

### **GET /[code]**

Redirect handler.


License

This project is open-source. Use it freely.
