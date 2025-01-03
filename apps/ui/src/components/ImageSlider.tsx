// components/ImageSlider.tsx
import React from 'react';
import Slider from 'react-slick';
import './styles/ImageSlider.css';

interface ImageSliderProps {
  images: string[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const settings = {
    dots: true, // 하단 점 네비게이션
    infinite: true, // 무한 스크롤
    speed: 500, // 슬라이드 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 개수
    arrows: true, // 좌우 화살표 표시
  };

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Slide ${index + 1}`} className='imageSlider' />
        </div>
      ))}
    </Slider>
  );
};
