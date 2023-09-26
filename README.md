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

# run local dev server
pnpm dev
```

**TODO**

- [ ] Markdown editor
- [ ] Dark Mode
- [ ] Push Notification
- [ ] BOT Moderator
- [ ] Sirkel (Group Discussion)
