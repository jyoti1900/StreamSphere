import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument, AdminStatus } from './schema/admin.schema';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { rethrowIfHttpException } from '../common/utils/rethrow-http.exception';
import { throwIfDuplicateKey } from '../common/utils/mongo-duplicate-key.util';
import { AuthRole } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeAdmin(admin: AdminDocument) {
    const { password: _password, ...safeAdmin } = admin.toObject();
    return safeAdmin;
  }

  async register(payload: RegisterAdminDto) {
    try {
      const existing = await this.adminModel.findOne({
        email: payload.email.toLowerCase().trim(),
      });

      if (existing && !existing.isDeleted) {
        throw new ConflictException('Admin email already exists');
      }

      if (existing?.isDeleted) {
        existing.set({
          ...payload,
          email: payload.email.toLowerCase().trim(),
          isDeleted: false,
          status: AdminStatus.ACTIVE,
        });
        const restored = await existing.save();

        return {
          message: 'Admin restored successfully',
          data: this.sanitizeAdmin(restored),
        };
      }

      const admin = await this.adminModel.create({
        ...payload,
        email: payload.email.toLowerCase().trim(),
        isDeleted: false,
      });

      return {
        message: 'Admin registered successfully',
        data: this.sanitizeAdmin(admin),
      };
    } catch (err) {
      rethrowIfHttpException(err);
      throwIfDuplicateKey(err, { email: 'Email' });
      throw new InternalServerErrorException('Admin registration failed');
    }
  }

  async login(payload: LoginAdminDto) {
    const email = payload.email.toLowerCase().trim();

    const admin = await this.adminModel
      .findOne({ email, isDeleted: false })
      .select('+password');

    if (!admin) {
      throw new BadRequestException('Email does not exist');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    if (admin.status === AdminStatus.INACTIVE) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    await this.adminModel.findByIdAndUpdate(admin._id, {
      lastLoginAt: new Date(),
    });

    const accessToken = this.jwtService.sign({
      userId: admin._id.toString(),
      email: admin.email,
      role: AuthRole.ADMIN,
      status: admin.status,
    });

    return {
      message: 'Admin login successful',
      admin: {
        adminId: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        status: admin.status,
      },
      accessToken,
    };
  }
}
