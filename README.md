# ForumGW Redesign
[v2](https://forumgw.vercel.app)
[github](https://github.com/AdiCahyaSaputra/forumgw-v2)

# ForumGw

Sebuah Forum non-formal buat tempat nongkrong lu pada.
Bahasa yang tidak formal membuat gw dan user merasa lebih bebas disini (tapi g ada kata" toxic)

**Fitur**

- Bikin Tulisan
- Bikin Tulisan Secara Anonymous

**Tech Stack**

- Next TS
- Tailwind (shadcn/ui)
- tRPC
- Prisma
- Supabase

**Run Locally**

```bash
git clone https://github.com/AdiCahyaSaputra/forumgw

# this project use pnpm
pnpm install

# rename .env.example to .env
# and setup .env
pnpm prisma migrate dev
pnpm prisma db seed

# run local dev server
pnpm dev
```

**TODO**

cek di branch [dev](https://github.com/AdiCahyaSaputra/forumgw/tree/dev)
