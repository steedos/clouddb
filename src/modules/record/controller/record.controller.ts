import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
  Post,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/auth.module';
import { RecordService } from '../service/record.service';
import { RecordInput, MultipleRecordsInput } from '../model/record.model';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(':baseId/:tableIdOrName')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  find(
    @Param("baseId") baseId: string, 
    @Param("tableIdOrName") tableIdOrName: string, 
  ) {
    const tableId = baseId + "/" + tableIdOrName
    return this.recordService.findByTableId(tableId);
  }

  @Get(':recordId')
  async findOne(
    @Param("baseId") baseId: string, 
    @Param("tableIdOrName") tableIdOrName: string, 
    @Param('recordId') id: string,
  ) {
    const tableId = baseId + "/" + tableIdOrName;
    const record = await this.recordService.findOne({ id, tableId });
    if (!record) {
      throw new NotFoundException();
    }
    return record;
  }

  @Post()
  async create(
    @Param("baseId") baseId: string, 
    @Param("tableIdOrName") tableIdOrName: string, 
    @Body() body: MultipleRecordsInput
  ) {
    const tableId = baseId + "/" + tableIdOrName;
    const { fields, records } = body;
    if (typeof fields === 'object') {
      return this.recordService.create(baseId, tableId, {
        fields
      });
    }
    if (typeof records === 'object') {
      const results:any = [];

      for (const record of records) {
        const created = await this.recordService.create(baseId, tableId, {
          fields: record.fields
        });
        results.push(created);
      }
      return results
    }
  }

  @Patch(':recordId')
  @Put(':recordId')
  update(
    @Param("baseId") baseId: string, 
    @Param("tableIdOrName") tableIdOrName: string, 
    @Param('recordId') id: string, 
    @Body() body: RecordInput
  ) {
    const tableId = baseId + "/" + tableIdOrName;
    return this.recordService.update({ id, tableId }, body);
  }

  @Post(':id')
  delete(
    @Param("baseId") baseId: string, 
    @Param("tableIdOrName") tableIdOrName: string, 
    @Param('recordId') id: string
  ) {
    const tableId = baseId + "/" + tableIdOrName;
    return this.recordService.delete({ id , tableId});
  }

}