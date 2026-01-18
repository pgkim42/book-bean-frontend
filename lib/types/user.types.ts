// User Types

export interface User {
  id?: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  zipCode?: string;
  address?: string;
  addressDetail?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}
