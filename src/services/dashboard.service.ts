import prisma from "../models/prisma.js";

export const getStats = async () => {
  // Get current date info for weekly activity
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get total counts
  const [products, recipes, publications, users] = await Promise.all([
    prisma.product.count(),
    prisma.recipe.count(),
    prisma.publication.count(),
    prisma.user.count(),
  ]);

  // Get recent activity (items created in last 7 days)
  const [newProducts, newRecipes, newPublications] = await Promise.all([
    prisma.product.count({
      where: { createdAt: { gte: oneWeekAgo } },
    }),
    prisma.recipe.count({
      where: { createdAt: { gte: oneWeekAgo } },
    }),
    prisma.publication.count({
      where: { createdAt: { gte: oneWeekAgo } },
    }),
  ]);

  // Get monthly data for the last 6 months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();
  const monthlyData = {
    products: [] as Array<{ count: number }>,
    recipes: [] as Array<{ count: number }>,
    publications: [] as Array<{ count: number }>,
  };

  // Get counts for last 6 months
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0);
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59);

    const [prodCount, recipeCount, pubCount] = await Promise.all([
      prisma.product.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.recipe.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.publication.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
    ]);

    monthlyData.products.push({ count: prodCount });
    monthlyData.recipes.push({ count: recipeCount });
    monthlyData.publications.push({ count: pubCount });
  }

  return {
    products,
    recipes,
    publications,
    users,
    recentActivity: {
      newProducts,
      newRecipes,
      newPublications,
    },
    monthlyData,
  };
};
