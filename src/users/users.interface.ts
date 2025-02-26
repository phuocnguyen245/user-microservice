import { UserDocument } from './users.schema';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: UserDocument;
}
