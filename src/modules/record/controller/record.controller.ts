import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/auth.module';
import { CreateRecordInput } from '../model/create-record.input';
import { UpdateRecordInput } from '../model/update-record.input';
import { RecordService } from '../service/record.service';

@UseGuards(JwtAuthGuard)
@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  create(@Body() body: CreateRecordInput) {
    return this.recordService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateRecordInput) {
    return this.recordService.update({ id }, body);
  }

  @Post(':id')
  delete(@Param('id') id: string) {
    return this.recordService.delete({ id });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const noti = await this.recordService.findOne({ id });
    if (!noti) {
      throw new NotFoundException();
    }
    return noti;
  }

  @Get()
  find(@Query() { userId, targetId }: { userId?: string; targetId?: string }) {
    if (userId && !targetId) {
      return this.recordService.findByUserId(userId);
    }
    if (targetId && !userId) {
      return this.recordService.findByTargetId(targetId);
    }
    throw new BadRequestException();
  }
}
