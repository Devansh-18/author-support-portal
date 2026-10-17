import mongoose from 'mongoose';
import { USER_ROLES } from '../../constants/enums.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLES),
        message: 'Invalid role "{VALUE}". Allowed roles: ' + Object.values(USER_ROLES).join(', ')
      },
      required: [true, 'Role is required']
    },
    authorId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: null
    },
    city: {
      type: String,
      trim: true,
      default: null
    },
    joinedDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

export const User = mongoose.model('User', userSchema);
