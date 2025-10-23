// Quitamos 'Query' de la importación
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CafesService } from './cafes.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
// No necesitamos QueryCafeDto

@Controller('cafes')
export class CafesController {
  constructor(private readonly cafesService: CafesService) {}

  @Post()
  create(@Body() createCafeDto: CreateCafeDto) {
    return this.cafesService.create(createCafeDto);
  }

  // findAll simple: no recibe @Query()
  @Get()
  findAll() {
    return this.cafesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Considera usar ParseIntPipe aquí: @Param('id', ParseIntPipe) id: number
    return this.cafesService.findOne(+id);
  }

  // --- ENDPOINT findByTipo RESTAURADO ---
  @Get('tipo/:tipoId')
  findByTipo(@Param('tipoId') tipoId: string) {
    // Considera usar ParseIntPipe aquí: @Param('tipoId', ParseIntPipe) tipoId: number
    return this.cafesService.findByTipo(+tipoId);
  }
  // --- FIN ENDPOINT findByTipo RESTAURADO ---

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCafeDto: UpdateCafeDto) {
    // Considera usar ParseIntPipe aquí
    return this.cafesService.update(+id, updateCafeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Considera usar ParseIntPipe aquí
    return this.cafesService.remove(+id);
  }
}
