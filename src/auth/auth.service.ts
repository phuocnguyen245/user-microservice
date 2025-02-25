import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/users.schema';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);

    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      _id: (user as UserDocument)._id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const [isExistedUsername, isExistedEmail] = await Promise.all([
        this.usersService.findByUsername(registerDto.username),
        this.usersService.findByEmail(registerDto.email),
      ]);

      if (isExistedUsername || isExistedEmail) {
        throw new UnauthorizedException('Username or email is already existed');
      }

      const saltOrRounds = 10;
      const password = registerDto.password;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const newUser = new this.userModel({
        ...registerDto,
        password: hash,
      });
      const avbc = await newUser.save();
      console.log({ avbc });
      return avbc;
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Registration failed',
      );
    }
  }
}
