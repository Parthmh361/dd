import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  dob: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  dob: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model<IUser>('Userpbl', userSchema);

export default User;
