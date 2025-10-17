import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiposModule } from './tipos/tipos.module';
import { CafesModule } from './cafes/cafes.module';

@Module({
  imports: [TiposModule, CafesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
