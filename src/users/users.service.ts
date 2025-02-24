import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, MongooseQueryOptions } from 'mongoose';
import { RegisterDto, UpdateProfileDto } from './users.dto';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Điều kiện where
    const query: MongooseQueryOptions = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, totalItems] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit).exec(),
      await this.userModel.countDocuments(query),
    ]);

    return {
      data: users,
      page,
      limit,
      totalItems,
      totalPage: Math.ceil(totalItems / limit),
    };
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const saltOrRounds = 10;
    const password = registerDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const newUser = new this.userModel({
      ...registerDto,
      password: hash,
    });
    return newUser.save();
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findById(id);
    user.username = updateProfileDto.username;
    return user.save();
  }
}
