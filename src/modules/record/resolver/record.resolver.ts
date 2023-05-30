import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuardGraphQL } from '@5stones/nest-oidc';

import { CreateRecordInput } from '../model/create-record.input';
import { Record } from '../model/record.model';
import { UpdateRecordInput } from '../model/update-record.input';
import { RecordService } from '../service/record.service';

@UseGuards(JwtAuthGuardGraphQL)
@Resolver(() => Record)
export class RecordResolver {
  constructor(private readonly recordService: RecordService) {}

  @Mutation(/* istanbul ignore next */ () => Record)
  createRecord(@Args('input') input: CreateRecordInput) {
    return this.recordService.create(input);
  }

  @Mutation(/* istanbul ignore next */ () => Record)
  updateRecord(
    @Args('id', { type: /* istanbul ignore next */ () => ID }) id: string,
    @Args('input') input: UpdateRecordInput,
  ) {
    return this.recordService.update({ id }, input);
  }

  @Mutation(/* istanbul ignore next */ () => Record)
  deleteRecord(
    @Args('id', { type: /* istanbul ignore next */ () => ID }) id: string,
  ) {
    return this.recordService.delete({ id });
  }

  @Query(/* istanbul ignore next */ () => Record)
  record(
    @Args('id', { type: /* istanbul ignore next */ () => ID }) id: string,
  ) {
    return this.recordService.findOne({ id });
  }

  @Query(/* istanbul ignore next */ () => [Record])
  recordByUserId(@Args('userId') userId: string) {
    return this.recordService.findByUserId(userId);
  }

  @Query(/* istanbul ignore next */ () => [Record])
  recordByTargetId(@Args('targetId') targetId: string) {
    return this.recordService.findByTargetId(targetId);
  }
}
