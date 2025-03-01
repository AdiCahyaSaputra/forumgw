import { prisma } from "./db";

async function main() {
  const role = await prisma.role.createMany({
    data: [{ name: "common" }, { name: "developer" }],
  });

  const category = await prisma.category.createMany({
    data: [{ name: "fyp" }, { name: "dev" }, { name: "group" }],
  });

  console.log(role, category);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
