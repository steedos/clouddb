import { registerEnumType } from '@nestjs/graphql';

enum RecordStatus {
  Active = 'Active',
  Deleted = 'Deleted',
}

registerEnumType(RecordStatus, {
  name: 'RecordStatus',
});

export { RecordStatus };
