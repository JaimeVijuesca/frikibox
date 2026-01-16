import data from './placeholder-images.json';

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type ImagePlaceholder = {
  id: string | number;
  name: string;
  imageUrl: string;
  imageUrlBack?: string | null;
  imageHint: string;
  price?: number;
  description?: string;
  category?: string;
  availableSizes?: string[];
  selectedSize?: string;
  contains?: any[];
  variants?: ProductVariant[];
  tags?: string[];
  mainFranchise?: string;
  franchiseCategory?: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
