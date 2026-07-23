import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentsService } from '../common/payments/payments.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly paymentsService: PaymentsService,
    ) { }

    @Public()
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new user',
        description: 'Creates a new user account with provided details',
    })
    @ApiBody({
        type: CreateUserDto,
        description: 'User registration data',
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully created',
        schema: {
            example: {
                _id: '65f1a3b2c5d8e9f0g1h2i3j4',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '9876543210',
                status: 'ACTIVE',
                createdAt: '2024-03-21T10:30:00.000Z',
                updatedAt: '2024-03-21T10:30:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed or user already exists',
    })
    async createUser(@Body() payload: CreateUserDto) {
        return this.usersService.create(payload);
    }

    @Get('list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all users',
        description: 'Retrieves a list of all registered users. Requires access token.',
    })
    @ApiResponse({
        status: 200,
        description: 'Users retrieved successfully',
        schema: {
            example: [
                {
                    _id: '65f1a3b2c5d8e9f0g1h2i3j4',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: 9876543210,
                    status: 'active',
                    createdAt: '2024-03-21T10:30:00.000Z',
                    updatedAt: '2024-03-21T10:30:00.000Z',
                },
            ],
        },
    })
    async findAllUsers() {
        return this.usersService.list();
    }

    @Get('plan-history')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get plan history',
        description:
            'Returns payment details for the logged-in user only (user, email, amount, method, status, date).',
    })
    @ApiQuery({
        name: 'accessToken',
        required: false,
        description: 'JWT from POST /users/login (use if Authorization header is not set)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @ApiResponse({
        status: 200,
        description: 'Plan history retrieved successfully',
        schema: {
            example: [
                {
                    user: 'John Wick',
                    email: 'john@example.com',
                    amount: '₹299',
                    method: 'UPI',
                    status: 'paid',
                    date: '2026-04-03',
                },
            ],
        },
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    async getPlanHistory(@CurrentUser() user: { userId: string }) {
        return this.paymentsService.getPlanHistory(user.userId);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'User login',
        description: 'Authenticates user and returns JWT token',
    })
    @ApiBody({
        type: LoginUserDto,
        description: 'User login credentials',
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        schema: {
            example: {
                message: 'Login successfully',
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    userId: '65f1a3b2c5d8e9f0g1h2i3j4',
                    email: 'john@example.com',
                    status: 'ACTIVE',
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid email or password',
    })
    async loginUser(@Body() payload: LoginUserDto) {
        return this.usersService.login(payload);
    }

    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Update user',
        description:
            'Updates the currently logged-in user. Uses userId from access token, no ID in URL.',
    })
    @ApiBody({
        type: UpdateUserDto,
        description: 'User update data (all fields optional)',
    })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully',
        schema: {
            example: {
                _id: '65f1a3b2c5d8e9f0g1h2i3j4',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johnupdated@example.com',
                phone: '9876543210',
                status: 'active',
                createdAt: '2024-03-21T10:30:00.000Z',
                updatedAt: '2024-03-22T12:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async updateUser(
        @Body() body: UpdateUserDto,
        @CurrentUser() user: { userId: string },
    ) {
        return this.usersService.update(user.userId, body);
    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete user',
        description: 'Deletes a user by ID',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'User ID',
        example: '65f1a3b2c5d8e9f0g1h2i3j4',
    })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
        schema: {
            example: {
                message: 'User deleted successfully',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async deleteUser(@Param('id', ParseMongoIdPipe) id: string) {
        return this.usersService.delete(id);
    }

    // FORGOT PASSWORD
    @Public()
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Forgot password',
        description:
            'Sends a password reset link to the user email',
    })
    @ApiBody({
        type: ForgotPasswordDto,
        description: 'User email address',
    })
    @ApiResponse({
        status: 200,
        description:
            'Password reset link sent successfully',
        schema: {
            example: {
                message:
                    'Password reset link sent successfully',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async forgotPassword(
        @Body() payload: ForgotPasswordDto,
    ) {
        return this.usersService.forgotPassword(
            payload,
        );
    }



    // RESET PASSWORD (token in body — recommended for frontend)
    @Public()
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reset password',
        description: 'Resets user password using the token from the email link',
    })
    @ApiBody({ type: ResetPasswordWithTokenDto })
    @ApiResponse({ status: 200, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async resetPasswordWithBody(@Body() payload: ResetPasswordWithTokenDto) {
        return this.usersService.resetPassword(payload.token, payload);
    }

    // RESET PASSWORD (token in URL — legacy)
    @Public()
    @Patch('reset-password/:token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reset password',
        description:
            'Resets user password using reset token',
    })
    @ApiBody({
        type: ResetPasswordDto,
        description: 'New password data',
    })
    @ApiResponse({
        status: 200,
        description:
            'Password reset successful',
        schema: {
            example: {
                message:
                    'Password reset successful',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description:
            'Invalid or expired token',
    })
    async resetPassword(
        @Param('token') token: string,
        @Body() payload: ResetPasswordDto,
    ) {
        return this.usersService.resetPassword(
            decodeURIComponent(token),
            payload,
        );
    }
}
