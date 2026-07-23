import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseBody = exceptionResponse as Record<string, unknown>;
                const fieldErrors = responseBody.errors;

                if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                    message = fieldErrors.join('; ');
                } else if (Array.isArray(responseBody.message)) {
                    message = responseBody.message.join('; ');
                } else {
                    message = (responseBody.message as string) || exception.message;
                }

                response.status(status).json({
                    success: false,
                    statusCode: status,
                    message,
                    errors: Array.isArray(fieldErrors)
                        ? fieldErrors
                        : Array.isArray(responseBody.message)
                          ? responseBody.message
                          : null,
                    data: null,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
                return;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            data: null,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}
