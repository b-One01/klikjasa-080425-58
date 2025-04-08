
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ServiceCategory } from '@/types/service';
import { motion } from 'framer-motion';

interface CategoryCarouselProps {
  categories: ServiceCategory[];
}

export const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false, dragFree: true });
  const [showHint, setShowHint] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      // Show swipe hint animation for 3 seconds
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const getIconElement = (iconName: string) => {
    const iconMap: Record<string, string> = {
      'house': '🏠',
      'settings': '🔧',
      'heart': '❤️',
      'car': '🚗',
      'briefcase': '💼',
      'calendar': '📅',
      'smile': '😊',
      'computer': '💻',
      'activity': '📈',
      'utensils': '🍽️',
      'star': '⭐',
    };

    return iconMap[iconName] || '⭐';
  };

  return (
    <div className="relative">
      <Carousel 
        ref={emblaRef}
        className="w-full"
        opts={{ align: 'start', loop: false, dragFree: true }}
      >
        <CarouselContent className="pl-4">
          {categories.map((category) => (
            <CarouselItem key={category.id} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 min-w-24">
              <Link
                to={`/category/${category.id}`}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                  <span className="text-xl">{getIconElement(category.icon)}</span>
                </div>
                <span className="text-xs text-center line-clamp-2 px-1">{category.name}</span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden absolute left-0 -translate-x-1/2 md:flex" />
        <CarouselNext className="hidden absolute right-0 translate-x-1/2 md:flex" />
      </Carousel>

      {showHint && (
        <motion.div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="bg-primary/20 rounded-full p-2 flex items-center"
            animate={{ 
              x: [0, -20, 20, 0],
            }}
            transition={{ 
              duration: 1.5,
              repeat: 1,
              ease: "easeInOut" 
            }}
          >
            <ChevronLeft className="text-primary h-6 w-6" />
            <span className="mx-2 text-primary font-medium">Geser</span>
            <ChevronRight className="text-primary h-6 w-6" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryCarousel;
