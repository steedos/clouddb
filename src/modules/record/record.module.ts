import { DynamooseModule } from 'nestjs-dynamoose';

import { Module } from '@nestjs/common';

import { RecordController } from './controller/record.controller';
import { RecordResolver } from './resolver/record.resolver';
import { RecordSchema } from './schema/record.schema';
import { RecordService } from './service/record.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'record',
        schema: RecordSchema,
      },
    ]),
  ],
  providers: [RecordService, RecordResolver],
  controllers: [RecordController],
})
export class RecordModule {}
