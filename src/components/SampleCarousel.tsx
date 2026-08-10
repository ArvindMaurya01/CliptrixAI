import React from 'react';
import { Carousel } from './Carousel';

interface SampleCarouselProps {
  onSelectCategory?: (categoryKey: string) => void;
}

export const SampleCarousel: React.FC<SampleCarouselProps> = ({ onSelectCategory }) => {
  return <Carousel onSelectCategory={onSelectCategory} />;
};

export default SampleCarousel;
