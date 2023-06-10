import { Module } from '@nestjs/common';
import { QuerModule } from './quer/quer.module';

@Module({
  imports: [QuerModule],
})
export class AppModule {}
