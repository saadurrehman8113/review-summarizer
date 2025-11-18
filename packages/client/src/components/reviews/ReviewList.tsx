import { useState, useEffect } from "react";
import axios from "axios";

type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  rating: number;
  content: string;
};

type getReviewsResponse = {
  message: string;
  summary: string | null;
  reviews: [Review];
};

const ReviewList = ({ productId }: Props) => {
  const [reviewData, setReviewData] = useState<getReviewsResponse>();

  const fetchReviews = async () => {
    const { data } = await axios.get<getReviewsResponse>(
      `./api/products/${productId}/reviews`
    );

    console.log(data.reviews);

    setReviewData(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {reviewData?.reviews.map((review) => (
        <div key={review.id}>
          <div className="font-semibold">{review.author}</div>
          <div>{review.rating}/5</div>
          <p className="py-2">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
