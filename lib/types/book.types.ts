// Book Types

export type BookStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string;
  isbn: string;
  description?: string;
  imageUrl?: string;
  originalPrice: number;
  salePrice: number;
  discountRate: number;
  stockQuantity: number;
  status: BookStatus;
  categoryId: number;
  categoryName?: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookListParams {
  page?: number;
  size?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}
