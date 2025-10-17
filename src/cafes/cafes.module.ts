import { Module } from '@nestjs/common';
import { CafesService } from './cafes.service';
import { CafesController } from './cafes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cafe])],
  controllers: [CafesController],
  providers: [CafesService],
})
export class CafesModule {}
