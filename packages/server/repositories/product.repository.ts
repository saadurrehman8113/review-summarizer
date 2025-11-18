import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const productRepository = {
  getProductById: async (id: number) => {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product;
  },
};
