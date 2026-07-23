import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument, UserStatus } from './schema/users.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../common/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password-user.dto';
import { rethrowIfHttpException } from '../common/utils/rethrow-http.exception';
import { throwIfDuplicateKey } from '../common/utils/mongo-duplicate-key.util';
import { AuthRole } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,

    private readonly emailService: EmailService,

    private readonly configService: ConfigService,
  ) { }

  private get jwtSecret(): string {
    return this.configService.get<string>('jwtSecret') || 'super-secret-key';
  }

  private get frontendUrl(): string {
    return this.configService.get<string>('frontendUrl') || 'http://localhost:3000' || 'http://localhost:3001';
  }

  private async findActiveUser(id: string) {
    const user = await this.userModel.findOne({ _id: id, isDeleted: false });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private sanitizeUser(user: UserDocument) {
    const { password: _password, ...safeUser } = user.toObject();
    return safeUser;
  }

  async create(data: CreateUserDto) {
    try {
      const existingByEmail = await this.userModel.findOne({
        email: data.email,
      });

      const existingByPhone = await this.userModel.findOne({
        phone: data.phone,
        ...(existingByEmail ? { _id: { $ne: existingByEmail._id } } : {}),
      });

      if (existingByPhone && !existingByPhone.isDeleted) {
        throw new ConflictException('Phone number already exists');
      }

      if (existingByEmail && existingByEmail.isDeleted) {
        if (existingByPhone && existingByPhone.isDeleted === false) {
          throw new ConflictException('Phone number already exists');
        }

        existingByEmail.set({ ...data, isDeleted: false });
        const restoredUser = await existingByEmail.save();

        this.emailService.sendConfirmationEmail(
          restoredUser.email,
          restoredUser.firstName,
        );

        return {
          message: 'User restored successfully',
          data: this.sanitizeUser(restoredUser),
        };
      }

      if (existingByEmail && !existingByEmail.isDeleted) {
        throw new ConflictException('Email already exists');
      }

      const newUser = await this.userModel.create({
        ...data,
        isDeleted: false,
      });

      this.emailService.sendConfirmationEmail(
        newUser.email,
        newUser.firstName,
      );

      return {
        message: 'User created successfully',
        data: this.sanitizeUser(newUser),
      };
    } catch (err) {
      rethrowIfHttpException(err);
      throwIfDuplicateKey(err, {
        email: 'Email',
        phone: 'Phone number',
      });
      console.error('User creation failed:', err);
      throw new InternalServerErrorException('User creation failed');
    }
  }

  async login(payload: LoginUserDto) {
    const { email, password } = payload;

    const user = await this.userModel
      .findOne({ email, isDeleted: false })
      .select('+password');

    if (!user) {
      throw new BadRequestException('Email does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Account is blocked');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Account is inactive');
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
    });

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: AuthRole.USER,
      status: user.status,
    };

    const accessToken = this.jwtService.sign(tokenPayload);

    return {
      message: 'Login successfully',
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: AuthRole.USER,
        subscriptionPlan: user.subscriptionPlan ?? null,
        subscriptionExpiresAt: user.subscriptionExpiresAt ?? null,
      },
      accessToken,
    };
  }

  async getProfile(userId: string) {
    const user = await this.findActiveUser(userId);
    const safeUser = this.sanitizeUser(user);

    return {
      id: safeUser._id,
      userId: safeUser._id,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      email: safeUser.email,
      phone: safeUser.phone,
      status: safeUser.status,
      role: AuthRole.USER,
      subscriptionPlan: safeUser.subscriptionPlan ?? null,
      subscriptionExpiresAt: safeUser.subscriptionExpiresAt ?? null,
    };
  }

  async list() {
    try {
      return await this.userModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .lean();
    } catch {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      const existingUser = await this.findActiveUser(id);

      if (data.email && data.email !== existingUser.email) {
        const emailExists = await this.userModel.findOne({
          email: data.email,
          isDeleted: false,
          _id: { $ne: id },
        });
        if (emailExists) {
          throw new ConflictException('Email already exists');
        }
      }

      if (data.phone && data.phone !== existingUser.phone) {
        const phoneExists = await this.userModel.findOne({
          phone: data.phone,
          isDeleted: false,
          _id: { $ne: id },
        });
        if (phoneExists) {
          throw new ConflictException('Phone number already exists');
        }
      }

      const payload: Record<string, unknown> = { ...data };

      return await this.userModel.findByIdAndUpdate(id, payload, {
        new: true,
      });
    } catch (err) {
      rethrowIfHttpException(err);
      throwIfDuplicateKey(err, {
        email: 'Email',
        phone: 'Phone number',
      });
      throw new InternalServerErrorException('User update failed');
    }
  }

  async delete(id: string) {
    try {
      await this.findActiveUser(id);

      await this.userModel.findByIdAndUpdate(id, {
        isDeleted: true,
      });

      return {
        message: 'User deleted successfully (soft delete)',
      };
    } catch (err) {
      rethrowIfHttpException(err);
      throw new InternalServerErrorException('User deletion failed');
    }
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      email: payload.email.toLowerCase().trim(),
      isDeleted: false,
    });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        tokenVersion: user.passwordResetTokenVersion,
        purpose: 'password_reset',
      },
      this.jwtSecret,
      { expiresIn: '15m' },
    );

    const resetLink =
      `${this.frontendUrl}/password/resetpassword?token=${encodeURIComponent(token)}`;

    try {
      await this.emailService.sendForgotPasswordEmail(
        user.email,
        user.firstName,
        resetLink,
      );
    } catch (error) {
      console.error('Forgot password email failed:', error);
      throw new InternalServerErrorException(
        'Unable to send password reset email. Please try again later.',
      );
    }

    return {
      message: 'Password reset link sent successfully',
    };
  }

  async resetPassword(token: string, payload: ResetPasswordDto) {
    if (!token?.trim()) {
      throw new BadRequestException('Reset token is required');
    }

    let decoded: {
      id: string;
      email: string;
      tokenVersion: number;
      purpose?: string;
    };

    try {
      decoded = jwt.verify(token.trim(), this.jwtSecret) as typeof decoded;
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (decoded.purpose && decoded.purpose !== 'password_reset') {
      throw new BadRequestException('Invalid reset token');
    }

    const user = await this.userModel
      .findOne({ _id: decoded.id, isDeleted: false })
      .select('+password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (decoded.tokenVersion !== user.passwordResetTokenVersion) {
      throw new BadRequestException('Reset link already used or expired');
    }

    user.password = payload.password;
    user.passwordResetTokenVersion += 1;
    await user.save();

    this.emailService
      .sendResetPasswordSuccessEmail(user.email, user.firstName)
      .catch((error) => {
        console.log('Reset password success email failed:', error);
      });

    return {
      message: 'Password reset successful',
    };
  }
}

