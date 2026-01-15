import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create Users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@tastyfruit.com" },
    update: {},
    create: {
      email: "admin@tastyfruit.com",
      name: "Admin TastyFruit",
      password: hashedPassword,
      role: "admin",
      image: "https://ui-avatars.com/api/?name=Admin+TastyFruit",
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@tastyfruit.com" },
    update: {},
    create: {
      email: "editor@tastyfruit.com",
      name: "Editor User",
      password: hashedPassword,
      role: "editor",
    },
  });

  console.log("👤 Users seeded:", { admin: admin.email, editor: editor.email });

  // 2. Create Products
  const mango = await prisma.product.create({
    data: {
      name: "Mangga Harum Manis",
      description: "Mangga segar dengan rasa manis dan harum yang khas",
      slug: "mangga-harum-manis",
      imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078",
      nutrition: {
        energi: "60 kcal",
        karbo: "15g",
      },
    },
  });

  const dragonFruit = await prisma.product.create({
    data: {
      name: "Buah Naga Merah",
      description: "Buah naga merah segar kaya antioksidan",
      slug: "buah-naga-merah",
      imageUrl: "https://images.unsplash.com/photo-1527325678964-54921661f888",
      nutrition: {
        energi: "50 kcal",
        serat: "3g",
      },
    },
  });

  console.log("🍎 Products seeded:", {
    mango: mango.name,
    dragonFruit: dragonFruit.name,
  });

  // 3. Create Recipes
  const smoothie = await prisma.recipe.create({
    data: {
      title: "Smoothie Bowl Mangga Naga",
      description: "Smoothie bowl segar dengan kombinasi mangga dan buah naga",
      ingredients: [
        { name: "Mangga matang", amount: "1 buah" },
        { name: "Buah naga merah", amount: "1/2 buah" },
        { name: "Pisang beku", amount: "1 buah" },
        { name: "Susu almond", amount: "100ml" },
        { name: "Granola", amount: "Secukupnya", note: "Topping" },
      ],
      instructions: [
        {
          title: "Blender",
          description: "Blender semua buah dengan susu almond hingga halus",
        },
        { title: "Sajikan", description: "Tuang ke dalam bowl" },
        {
          title: "Topping",
          description:
            "Tambahkan granola dan potongan buah segar sebagai topping",
        },
      ],
      cookingTime: "15 minutes",
      servings: "2 porsi",
      difficulty: "Easy",
      author: "Admin TastyFruit",
      isPublished: true,
      imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4",
    },
  });

  console.log("🍳 Recipe seeded:", smoothie.title);

  // 4. Create Publications
  const article = await prisma.publication.create({
    data: {
      title: "Manfaat Buah Naga untuk Kesehatan",
      content:
        "<p>Buah naga merupakan salah satu buah tropis yang kaya akan nutrisi...</p>",
      excerpt:
        "Buah naga kaya akan antioksidan dan vitamin C yang baik untuk sistem imun tubuh.",
      author: "Admin TastyFruit",
      category: "Kesehatan",
      isPublished: true,
      publishedAt: new Date(),
      imageUrl: "https://images.unsplash.com/photo-1527325678964-54921661f888",
    },
  });

  console.log("📰 Publication seeded:", article.title);

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
