import { Module } from '@nestjs/common';
import { QuerService } from './quer.service';
import { QuerController } from './quer.controller';

@Module({
  providers: [QuerService],
  controllers: [QuerController],
})
export class QuerModule {}
