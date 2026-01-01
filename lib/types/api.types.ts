// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
  errors?: {
    field: string;
    value: string;
    reason: string;
  }[];
}

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
