import React, { useState } from 'react';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  containerClassName: string;
  imageClassName?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, containerClassName, imageClassName }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative bg-slate-200 dark:bg-slate-700 overflow-hidden ${containerClassName}`}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-shimmer"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imageClassName || 'w-full h-full object-cover'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default ImageWithLoader;