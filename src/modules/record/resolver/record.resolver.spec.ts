import { Item } from 'nestjs-dynamoose';

import { Test, TestingModule } from '@nestjs/testing';

import { RecordStatus } from '../model/record.enum';
import { RecordService } from '../service/record.service';
import { RecordTestImports } from '../test/record-test.imports';
import recordJson from './record.data.json';
import { RecordResolver } from './record.resolver';

let resolver: RecordResolver;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: RecordTestImports,
    providers: [RecordService, RecordResolver],
  }).compile();

  resolver = module.get<RecordResolver>(RecordResolver);
});

describe('Record Resolver', () => {
  let records: Item<Record>[] = [];

  beforeAll(async () => {
    // create record records
    records = await Promise.all(
      recordJson.map(
        async (input) => (await resolver.createRecord(input)) as any,
      ),
    );
  });

  afterAll(async () => {
    // create record records
    await Promise.all(
      records.map(
        async (record) =>
          await resolver.deleteRecord(record.toJSON().id),
      ),
    );
  });

  it('find by userId or targetId', async () => {
    // test findByUserId and findByTargetId
    expect(await resolver.recordByUserId('mary')).toHaveLength(0);
    expect(await resolver.recordByUserId('user21')).toHaveLength(2);
    expect(await resolver.recordByTargetId('iphone')).toHaveLength(0);
  });

  it('update status', async () => {
    const records = await resolver.recordByTargetId('device21');
    expect(records).toHaveLength(1);
    expect(records[0].status).toBe(RecordStatus.Active);

    const updated = await resolver.updateRecord(records[0].id, {
      status: RecordStatus.Deleted,
    });
    expect(updated).toBeDefined();
    expect(updated.status).toBe(RecordStatus.Deleted);
  });

  it('find by id', async () => {
    const records = await resolver.recordByTargetId('device23');
    expect(records).toHaveLength(1);

    const record = await resolver.record(records[0].id);
    expect(record).toBeDefined();
    expect(record.id).toBe(records[0].id);
  });
});
