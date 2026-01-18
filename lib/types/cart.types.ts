// Cart Types

export interface CartItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  // Aliases for API responses that use different field names
  bookTitle?: string;
  bookAuthor?: string;
  bookCoverImageUrl?: string;
  bookCurrentPrice?: number;
  totalPrice?: number;
  selected?: boolean;
}

export interface CartSummary {
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  finalAmount: number;
  totalItems: number;
}

export interface CartItemAddRequest {
  bookId: number;
  quantity: number;
}

export interface CartItemUpdateRequest {
  quantity: number;
}
