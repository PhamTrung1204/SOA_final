import React from 'react';
import { Paper, Typography, Rating, Box } from '@mui/material';
import moment from 'moment';
import { useReadAllReviewsAdmin } from '../../api/queries';

const ReviewsSection = ({ specId }) => {
  const { data: productReview, isLoading: isLoadingReviews } = useReadAllReviewsAdmin(specId);

  // Nếu đang tải đánh giá
  if (isLoadingReviews) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography variant="body2">Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  // Nếu không có đánh giá nào cho specId này
  if (!productReview || productReview.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Đánh giá về sản phẩm
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Chưa có đánh giá nào.
        </Typography>
      </Paper>
    );
  }

  // Lọc các đánh giá chỉ cho specId hiện tại
  const filteredReviews = Array.isArray(productReview)
    ? productReview.filter((review) => review.spec === specId)
    : [];

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Đánh giá sản phẩm
      </Typography>
      {filteredReviews.length > 0 ? (
        filteredReviews.map((review) => (
          <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
            <Rating value={review.star} readOnly />
            <Typography variant="body2" sx={{ mb: 1 }}>
              {review.description}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {moment(review.createdAt).format('DD/MM/YYYY')}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          Chưa có đánh giá nào.
        </Typography>
      )}
    </Paper>
  );
};

export default ReviewsSection;
