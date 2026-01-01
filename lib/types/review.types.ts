// Review Types

export interface Review {
  id: number;
  bookId: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  content: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreateRequest {
  bookId: number;
  rating: number;
  title: string;
  content: string;
}

export interface ReviewUpdateRequest {
  rating: number;
  title: string;
  content: string;
}
