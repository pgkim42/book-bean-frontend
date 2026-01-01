// Wishlist Types

export interface WishlistItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  addedAt: string;
}

export interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
}
