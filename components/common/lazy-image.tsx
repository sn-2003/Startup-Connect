'use client';

import { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function LazyImage({ src, alt, className, fallback }: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !imageSrc) {
      setImageSrc(src);
    }
  }, [inView, src, imageSrc]);

  const handleError = () => {
    setImageError(true);
    if (fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <div ref={ref} className={className}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <div className={`${className} bg-gray-200 animate-pulse`} />
      )}
    </div>
  );
}