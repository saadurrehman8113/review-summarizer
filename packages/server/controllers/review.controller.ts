import type { Request, Response } from "express";

import { productService } from "../services/product.service";
import { reviewService } from "../services/review.service";

export const reviewController = {
  getReviews: async (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product id!" });
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    const { summary, reviews } = await reviewService.getReviews(productId);

    res
      .status(200)
      .json({ message: "Reviews fetched successfully.", summary, reviews });
  },

  getReviewSummary: async (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product id!" });
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    const { reviews } = await reviewService.getReviews(productId, 1);

    if (!reviews.length) {
      return res
        .status(400)
        .json({ error: "This product has no reviews yet!" });
    }

    const summary = await reviewService.getReviewSummary(productId);

    res
      .status(200)
      .json({ message: "Review summary generated successfully", summary });
  },
};
