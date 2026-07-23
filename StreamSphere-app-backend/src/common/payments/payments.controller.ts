import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('plans')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List subscription plans' })
  @ApiResponse({ status: 200, description: 'Subscription plans retrieved' })
  getPlans() {
    return this.paymentsService.getPlans();
  }

  @Get('order-summary')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get order summary for a plan',
    description:
      'Returns order summary with plan price, discount, and total for checkout UI.',
  })
  @ApiQuery({
    name: 'planId',
    required: true,
    enum: ['monthly', 'yearly'],
    example: 'monthly',
  })
  @ApiResponse({
    status: 200,
    description: 'Order summary retrieved',
    schema: {
      example: {
        title: 'Order Summary',
        items: [
          {
            label: 'Monthly Premium',
            amount: 199,
            amountFormatted: '₹199',
          },
        ],
        discount: {
          label: 'Discount (20%)',
          amount: -40,
          amountFormatted: '-₹40',
        },
        total: {
          label: 'Total',
          amount: 159,
          amountFormatted: '₹159',
        },
      },
    },
  })
  getOrderSummary(@Query('planId') planId: string) {
    return this.paymentsService.getOrderSummary(planId);
  }

  @Get('list')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all user payment details',
    description: 'Returns payment details for all registered users. No token required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment details retrieved successfully',
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
  getAllPaymentDetails() {
    return this.paymentsService.getAllPaymentDetails();
  }

  @Post('create-order')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create Razorpay order for subscription',
    description:
      'Requires user access token via Authorization header, x-access-token header, or accessToken in body.',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 200, description: 'Razorpay order created' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  createOrder(
    @Body() payload: CreateOrderDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.paymentsService.createOrder(user.userId, payload);
  }

  @Post('verify')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Razorpay payment after checkout',
    description:
      'Requires user access token via Authorization header, x-access-token header, or accessToken in body.',
  })
  @ApiBody({ type: VerifyPaymentDto })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  verifyPayment(
    @Body() payload: VerifyPaymentDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.paymentsService.verifyPayment(user.userId, payload);
  }

  @Get('plan-history')
  @ApiBearerAuth('access-token')
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
  getPlanHistory(@CurrentUser() user: { userId: string }) {
    return this.paymentsService.getPlanHistory(user.userId);
  }

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Razorpay webhook handler' })
  @ApiHeader({
    name: 'x-razorpay-signature',
    description: 'Razorpay webhook signature',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  handleWebhook(
    @Req() req: { body: Buffer | Record<string, unknown> },
    @Headers('x-razorpay-signature') signature?: string,
  ) {
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : JSON.stringify(req.body);

    return this.paymentsService.handleWebhook(rawBody, signature);
  }
}
