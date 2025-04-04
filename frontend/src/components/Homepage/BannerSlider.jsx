import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Card, CardMedia, IconButton } from "@mui/material";
import { useReadAllCarouselAdmin } from "../../api/queries";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "slick-carousel/slick/slick.css"; // Import slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import slick-theme CSS
import CircularProgress from "@mui/material/CircularProgress";

// Component custom arrow phải
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        padding: "10px",
        cursor: "pointer",
        position: "absolute",
        right: "0", // Đặt mũi tên ra ngoài bên phải
        top: "50%", // Căn giữa theo chiều dọc
        transform: "translateY(-50%)", // Điều chỉnh cho đúng giữa chiều cao
        zIndex: 1,
      }}
    >
      <ArrowForwardIcon color="white" />
    </IconButton>
  );
};

// Component custom arrow trái
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        padding: "10px",
        cursor: "pointer",
        position: "absolute",
        left: "0", // Đặt mũi tên ra ngoài bên trái
        top: "50%", // Căn giữa theo chiều dọc
        transform: "translateY(-50%)", // Điều chỉnh cho đúng giữa chiều cao
        zIndex: 1,
      }}
    >
      <ArrowBackIcon color="white" />
    </IconButton>
  );
};

const BannerSlider = () => {
  const { data: banners, isLoading, isError, error } = useReadAllCarouselAdmin();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Thêm autoplay để chạy tự động
    autoplaySpeed: 3000, // Chuyển slide sau 3 giây
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <p>Có lỗi xảy ra: {error.message}</p>;
  return (
    <Slider {...settings}>
      {banners.map((banner) => (
        <Link
          to={`/products/${banner.slug}`}
          key={banner.id}
          style={{ textDecoration: "none" }}
        >
          <Card
            sx={{
              padding: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <CardMedia
              component="img"
              image={banner.imgUrl}
              alt={banner.title}
              sx={{
                display: "flex",
                justifyContent: "center",
                margin: "0 auto",
                width: "100%", // Độ rộng 50% của container
                height: "auto",
                objectFit: "contain",
                maxHeight: "320px",
                borderRadius: "8px",
              }}
            />
          </Card>
        </Link>
      ))}
    </Slider>
  );
};

export default BannerSlider;
