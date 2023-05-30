import { Field, ID, ObjectType } from '@nestjs/graphql';

import { CreateRecordInput } from './create-record.input';
import { RecordStatus } from './record.enum';

export type RecordKey = {
  id: string;
};

@ObjectType({ implements: CreateRecordInput })
export class Record extends CreateRecordInput {
  @Field(/* istanbul ignore next */ () => ID)
  id: string;

  @Field(/* istanbul ignore next */ () => RecordStatus)
  status: RecordStatus;

  @Field()
  createAt: string;
}
