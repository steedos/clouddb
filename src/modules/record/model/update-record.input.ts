import { IsEnum, IsIn } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

import { RecordStatus } from './record.enum';

@InputType()
export class UpdateRecordInput {
  @IsIn([RecordStatus.Deleted])
  @IsEnum(RecordStatus)
  @Field(/* istanbul ignore next */ () => RecordStatus)
  status: RecordStatus;
}
