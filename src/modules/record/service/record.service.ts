import { InjectModel, Model } from 'nestjs-dynamoose';
import * as uuid from 'uuid';

import { Injectable } from '@nestjs/common';

import { Record, RecordKey, RecordInput } from '../model/record.model';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel('record')
    private readonly model: Model<Record, RecordKey>,
  ) {}

  async create(baseId: string, tableId: string, input: RecordInput) {
    const userId = "test";
    const record = await this.model.create({
      tableId,
      id: uuid.v4(),
      fields: input.fields,
      createdTime: new Date().toISOString(),
      createdBy: userId,
      baseId
    })
    return {
      id: record.id,
      fields: record.fields,
      createdTime: record.createdTime
    };
  }

  update(key: RecordKey, input: RecordInput) {
    const userId = "test";
    console.log(input)
    return this.model.update(key, {
      fields: input.fields,
      modifiedTime: new Date().toISOString(),
      modifiedBy: userId,
    });
  }

  delete(key: RecordKey) {
    return this.model.delete(key);
  }

  findOne(key: RecordKey) {
    return this.model.get(key);
  }

  findByTableId(tableId: string) {
    return this.model
      .query('tableId')
      .eq(tableId)
      .exec();
  }
}
