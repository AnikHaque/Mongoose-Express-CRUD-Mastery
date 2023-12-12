/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface FullName {
  firstName: string;
  lastName: string;
}

export interface Address {
  street: string;
  city: string;
  country: string;
}

export interface Orders {
  productName?: string;
  price?: number;
  quantity?: number;
}

export interface IUser {
  userId: number;
  username: string;
  password: string;
  fullName: FullName;
  age: number;
  email: string;
  isActive: boolean;
  hobbies: string[];
  address: Address;
  orders?: Orders[];
}

export interface UserModel extends Model<IUser> {
  isUserExists(userId: number): Promise<IUser | null>;
}
