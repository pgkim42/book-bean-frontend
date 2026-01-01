// Order Types

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCoverImageUrl?: string;
  bookCurrentPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName?: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientDetailAddress: string;
  recipientZipCode: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  couponDiscountAmount: number;
  deliveryFee: number;
  totalPaymentAmount: number;
  orderItems: OrderItem[];
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateRequest {
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientDetailAddress: string;
  recipientZipCode: string;
  couponId?: number;
  paymentMethod: string;
}

export interface OrderListParams {
  page?: number;
  size?: number;
  sort?: string;
}
