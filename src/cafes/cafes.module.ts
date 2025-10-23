import { Module } from '@nestjs/common';
import { CafesService } from './cafes.service';
import { CafesController } from './cafes.controller';
import { Cafe } from './entities/cafe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipo } from '../tipos/entities/tipo.entity'; // <-- Importar Tipo

@Module({
  // Añadir Tipo al array de forFeature
  imports: [TypeOrmModule.forFeature([Cafe, Tipo])],
  controllers: [CafesController],
  providers: [CafesService],
})
export class CafesModule {}
