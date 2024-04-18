import mongoose from 'mongoose' 

interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    isAdmin: boolean;
    name: string;
    locked: boolean;
    lockedAt: Date;
    loginAttempts: number;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
  }

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    name: { type: String, required: true },
    locked: { type: Boolean, required: false, default: false },
    lockedAt: { type: Date, required: false },
    loginAttempts: { type: Number, required: false, default: 0 },
    created_at: { type: Date, default: Date.now }, // Automatic timestamp
    updated_at: { type: Date, default: Date.now }, // Automatic timestamp
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } // Enable automatic timestamps
);

const User = mongoose.model<UserDocument>('User', userSchema);

export  { User, UserDocument };