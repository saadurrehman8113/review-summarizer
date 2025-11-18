import dayjs from "dayjs";

import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const reviewRepository = {
  getReviews: async (productId: number, limit: number = 10) => {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const summary = await prisma.summary.findFirst({
      where: { AND: [{ productId }, { expiresAt: { gt: new Date() } }] },
    });

    return { reviews, summary: summary ? summary.content : null };
  },

  storeReviewSummary: async (productId: number, summary: string) => {
    const now = new Date();
    const expiresAt = dayjs().add(7, "days").toDate();

    const data = {
      content: summary,
      expiresAt,
      generatedAt: now,
      productId,
    };

    const reviewSummary = await prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });

    return reviewSummary;
  },

  getReviewSummary: async (productId: number) => {
    const summary = await prisma.summary.findUnique({
      where: { productId },
    });

    return summary;
  },
};
