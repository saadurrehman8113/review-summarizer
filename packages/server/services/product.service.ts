import { productRepository } from "../repositories/product.repository";

export const productService = {
  getProductById: async (id: number) => {
    const product = await productRepository.getProductById(id);

    return product;
  },
};
