import { HttpException, HttpStatus } from '@nestjs/common';

export function handleError(error: any) {
  if (error instanceof HttpException) {
    throw error;
  } else {
    throw new HttpException(
      'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
