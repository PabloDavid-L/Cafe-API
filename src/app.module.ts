import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiposModule } from './tipos/tipos.module';
import { CafesModule } from './cafes/cafes.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TiposModule,
    CafesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cafedb',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
