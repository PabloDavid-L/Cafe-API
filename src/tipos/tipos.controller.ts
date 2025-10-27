import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TiposService } from './tipos.service';
import { CreateTipoDto } from './dto/create-tipo.dto';
import { UpdateTipoDto } from './dto/update-tipo.dto';

@Controller('tipos')
export class TiposController {
  constructor(private readonly tiposService: TiposService) {}

  //Crea un tipo
  @Post()
  create(@Body() createTipoDto: CreateTipoDto) {
    return this.tiposService.create(createTipoDto);
  }

  //Retorna todos los tipos
  @Get()
  findAll() {
    return this.tiposService.findAll();
  }

  //Retorna un tipo por Id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposService.findOne(+id);
  }

  //Actualiza un tipo
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoDto: UpdateTipoDto) {
    return this.tiposService.update(+id, updateTipoDto);
  }

  //Elimina un tipo
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposService.remove(+id);
  }
}
