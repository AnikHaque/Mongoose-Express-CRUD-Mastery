import { Schema, model } from 'mongoose';
import {
  Address,
  FullName,
  IUser,
  Orders,
  UserModel,
} from './user/user.interface';
import bcrypt from 'bcryptjs';
import config from '../config';

const FullNameSchema = new Schema<FullName>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const AddressSchema = new Schema<Address>({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const OrdersSchema = new Schema<Orders>({
  productName: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
});

const UserSchema = new Schema<IUser, UserModel>({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: FullNameSchema,
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  hobbies: {
    type: [String],
    required: true,
  },
  address: AddressSchema,
  orders: { type: [OrdersSchema], default: [] },
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  const responseData = {
    userId: user.userId,
    username: user.username,
    fullName: user.fullName && {
      firstName: user.fullName.firstName,
      lastName: user.fullName.lastName,
    },
    age: user.age,
    email: user.email,
    isActive: user.isActive,
    hobbies: user.hobbies,
    address: user.address && {
      street: user.address.street,
      city: user.address.city,
      country: user.address.country,
    },
  };
  return responseData;
};

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

UserSchema.pre('find', function (next) {
  this.select('-_id');
  this.select('-password');
  this.select('-userId');
  this.select('-fullName._id');
  this.select('-address._id');
  this.select('-isActive');
  this.select('-hobbies');
  this.select('-orders');
  this.select('-__v');
  next();
});

UserSchema.statics.isUserExists = async function (userId: number) {
  const existingUser = await User.findOne({ userId });
  return existingUser;
};

const User = model<IUser, UserModel>('User', UserSchema);

export default User;
