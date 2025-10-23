// src/cafes/cafes.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CafesService } from './cafes.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';

@Controller('cafes')
export class CafesController {
  constructor(private readonly cafesService: CafesService) {}

  @Post()
  create(@Body() createCafeDto: CreateCafeDto) {
    return this.cafesService.create(createCafeDto);
  }

  @Get()
  findAll() {
    return this.cafesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cafesService.findOne(+id);
  }

  // --- ENDPOINT MODIFICADO ---
  // Cambia la ruta para aceptar un nombre en lugar de ID
  @Get('tipo/:tipoName')
  findByTipoName(@Param('tipoName') tipoName: string) {
    // Llama a un nuevo método en el servicio (o renombrado)
    return this.cafesService.findByTipoName(tipoName);
  }
  // --- FIN ENDPOINT MODIFICADO ---

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCafeDto: UpdateCafeDto) {
    return this.cafesService.update(+id, updateCafeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cafesService.remove(+id);
  }
}