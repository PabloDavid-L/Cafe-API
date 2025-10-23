import { Module } from '@nestjs/common';
import { TiposService } from './tipos.service';
import { TiposController } from './tipos.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- 1. Importar
import { Tipo } from './entities/tipo.entity'; // <--- 2. Importar

@Module({
  imports: [TypeOrmModule.forFeature([Tipo])], // <--- 3. Añadir esto
  controllers: [TiposController],
  providers: [TiposService],
})
export class TiposModule {}