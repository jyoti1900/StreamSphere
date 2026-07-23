import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register admin',
    description: 'Creates a new admin account',
  })
  @ApiBody({ type: RegisterAdminDto })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @ApiResponse({ status: 409, description: 'Admin email already exists' })
  register(@Body() payload: RegisterAdminDto) {
    return this.adminService.register(payload);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin login',
    description: 'Authenticates admin and returns JWT access token',
  })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({
    status: 200,
    description: 'Admin login successful',
    schema: {
      example: {
        message: 'Admin login successful',
        admin: {
          adminId: '65f1a3b2c5d8e9f0g1h2i3j4',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          status: 'ACTIVE',
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password' })
  login(@Body() payload: LoginAdminDto) {
    return this.adminService.login(payload);
  }
}
