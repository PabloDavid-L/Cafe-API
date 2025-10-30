import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CafesService } from './cafes.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { QueryCafeDto } from './dto/query-cafe.dto';

@Controller('cafes')
export class CafesController {
  constructor(private readonly cafesService: CafesService) {}

  //Crea un cafe
  @Post()
  create(@Body() createCafeDto: CreateCafeDto) {
    console.log('Creando un nuevo café');
    return this.cafesService.create(createCafeDto);
  }

  //Retorna todos los cafes
  @Get()
  findAll(@Query() query: QueryCafeDto) {
    console.log('Obteniendo todos los cafés');
    // El ValidationPipe global valida y transforma los query params
    return this.cafesService.findAll(query);
  }

  //Retorna un cafe por Id
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(`Obteniendo café con ID: ${id}`);
    return this.cafesService.findOne(+id);
  }

  // Cambia la ruta para aceptar un nombre en lugar de ID
  @Get('tipo/:tipoName')
  findByTipoName(@Param('tipoName') tipoName: string) {
    console.log(`Obteniendo cafés por tipo: ${tipoName}`);
    // Llama a un nuevo método en el servicio (o renombrado)
    return this.cafesService.findByTipoName(tipoName);
  }

  //Actualiza un cafe
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCafeDto: UpdateCafeDto) {
    console.log(`Actualizando café con ID: ${id}`);
    return this.cafesService.update(+id, updateCafeDto);
  }

  //Elimina un cafe
  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(`Eliminando café con ID: ${id}`);
    return this.cafesService.remove(+id);
  }
}
