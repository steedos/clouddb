import { Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsObject } from 'class-validator';


export class RecordInput {
  @ApiProperty()
  fields: object;
};
export class MultipleRecordsInput {
  @ApiProperty()
  fields: object;
  @ApiProperty({type: () => [RecordInput]})
  records: [RecordInput];
};

export type RecordKey = {
  tableId: string;
  id: string;
};

// @ObjectType({ })
export class Record {
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  baseId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  tableId: string;

  @IsNotEmpty()
  @IsObject()
  @Field()
  fields: object;

  @Field()
  createdTime: string;

  @Field()
  modifiedTime?: string;

  @Field()
  createdBy: string;

  @Field()
  modifiedBy?: string;
}
