import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { QuerService } from './quer.service';

@Controller('quer')
export class QuerController {
  constructor(private readonly querService: QuerService) {}

  @Post('handleQuestion')
  @HttpCode(200)
  async handleQuestion(@Body('question') question: string) {
    return this.querService.handleQuestion(question);
  }
}
