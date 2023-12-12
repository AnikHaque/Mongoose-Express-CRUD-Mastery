import { Document } from 'mongoose';
import User from '../user.model';
import { IUser, Orders } from './user.interface';

//createUser
const createUser = async (userData: IUser): Promise<IUser> => {
  const result = await User.create(userData);
  return result;
};

// getAllUser
const getAllUser = async () => {
  const result = await User.find();
  return result;
};

// getSingleUser
const getSingleUser = async (userId: number) => {
  const user = await User.isUserExists(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const result = await User.findOne({ userId });
  return result;
};

// updateUser
const updateUser = async (userId: number, userData: IUser) => {
  const user = await User.isUserExists(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const result = await User.updateOne(
    { userId },
    { $set: userData },
    { new: true, runValidators: true },
  );
  return result;
};

//deleteUser
const deleteUser = async (userId: number) => {
  const user = await User.isUserExists(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const result = await User.deleteOne({ userId });
  return result;
};

//addProductInOrder
const addProductInOrder = async (
  userId: number,
  productData: Orders,
): Promise<Orders[]> => {
  const user = await User.isUserExists(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.orders) {
    user.orders = [];
  }

  user.orders.push(productData);

  await (user as IUser & Document).save();
  return user.orders;
};

//getUserOrders
const getUserOrders = async (userId: number): Promise<Orders[]> => {
  const user = await User.isUserExists(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return user.orders || [];
};

//getTotalPriceInOrders
const getTotalPriceInOrders = async (userId: number): Promise<number> => {
  const user = await User.isUserExists(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const totalPrice = await User.aggregate([
    {
      $match: {
        userId: user.userId,
      },
    },
    { $unwind: '$orders' },
    {
      $group: {
        _id: null,
        totalPrice: {
          $sum: {
            $multiply: ['$orders.price', '$orders.quantity'],
          },
        },
      },
    },
    {
      $project: {
        totalPrice: 1,
        _id: 0,
      },
    },
  ]);

  return totalPrice[0] || 0;
};

export const userServices = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
  addProductInOrder,
  getUserOrders,
  getTotalPriceInOrders,
};
