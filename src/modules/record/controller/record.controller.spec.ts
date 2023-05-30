import { Item } from 'nestjs-dynamoose';

import { Test, TestingModule } from '@nestjs/testing';

import { RecordStatus } from '../model/record.enum';
import { RecordService } from '../service/record.service';
import { RecordTestImports } from '../test/record-test.imports';
import { RecordController } from './record.controller';
import recordJson from './record.data.json';

let controller: RecordController;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: RecordTestImports,
    providers: [RecordService],
    controllers: [RecordController],
  }).compile();

  controller = module.get<RecordController>(RecordController);
});

describe('Record Controller', () => {
  let records: Item<Record>[] = [];

  beforeAll(async () => {
    records = await Promise.all(
      recordJson.map(
        async (input) => await controller.create(input),
      ) as any,
    );
  });

  afterAll(async () => {
    await Promise.all(
      records.map(
        async (record) =>
          await controller.delete(record.toJSON().id),
      ),
    );
  });

  it('find by userId or targetId', async () => {
    // test findByUserId and findByTargetId
    expect(await controller.find({ userId: 'mary' })).toHaveLength(0);
    expect(await controller.find({ userId: 'user12' })).toHaveLength(1);
    expect(await controller.find({ targetId: 'iphone' })).toHaveLength(0);
  });

  it('update status', async () => {
    const records = await controller.find({ targetId: 'device12' });
    expect(records).toHaveLength(1);
    expect(records[0].status).toBe(RecordStatus.Active);

    const updated = await controller.update(records[0].id, {
      status: RecordStatus.Deleted,
    });
    expect(updated).toBeDefined();
    expect(updated.status).toBe(RecordStatus.Deleted);
  });

  it('find by id', async () => {
    const records = await controller.find({ targetId: 'device13' });
    expect(records).toHaveLength(1);

    const record = await controller.findOne(records[0].id);
    expect(record).toBeDefined();
    expect(record.id).toBe(records[0].id);
  });

  it('find by id (not found)', async () => {
    let error = null;
    try {
      await controller.findOne('dummyid');
    } catch (e) {
      error = e;
    }
    expect(error).toMatchObject({ status: 404 });
  });

  it('find by userId and targetId (bad request)', async () => {
    let error = null;
    try {
      await controller.find({ targetId: 'device01', userId: 'user01' });
    } catch (e) {
      error = e;
    }
    expect(error).toMatchObject({ status: 400 });
  });

  it('find all (bad request)', async () => {
    let error = null;
    try {
      await controller.find({});
    } catch (e) {
      error = e;
    }
    expect(error).toMatchObject({ status: 400 });
  });
});
