import { InjectModel, Model } from 'nestjs-dynamoose';
import * as uuid from 'uuid';

import { Injectable } from '@nestjs/common';

import { CreateRecordInput } from '../model/create-record.input';
import { RecordStatus } from '../model/record.enum';
import { Record, RecordKey } from '../model/record.model';
import { UpdateRecordInput } from '../model/update-record.input';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel('record')
    private readonly model: Model<Record, RecordKey>,
  ) {}

  create(input: CreateRecordInput) {
    return this.model.create({
      ...input,
      id: uuid.v4(),
      status: RecordStatus.Active,
      createAt: new Date().toISOString(),
    });
  }

  update(key: RecordKey, input: UpdateRecordInput) {
    return this.model.update(key, input);
  }

  delete(key: RecordKey) {
    return this.model.delete(key);
  }

  findOne(key: RecordKey) {
    return this.model.get(key);
  }

  findByTargetId(targetId: string) {
    return this.model
      .query('targetId')
      .eq(targetId)
      .where('status')
      .eq(RecordStatus.Active)
      .exec();
  }

  findByUserId(userId: string) {
    return this.model
      .query('userId')
      .eq(userId)
      .where('status')
      .eq(RecordStatus.Active)
      .exec();
  }
}
