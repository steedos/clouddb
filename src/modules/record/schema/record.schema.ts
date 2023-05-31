import { Schema } from 'dynamoose';

export const RecordSchema = new Schema({
  tableId: {
    type: String,
    hashKey: true,
  },
  id: {
    type: String,
    rangeKey: true,
  },
  baseId: {
    type: String,
  },
  fields: {
    type: Object,
  },
  createdTime: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  modifiedTime: {
    type: String,
  },
  modifiedBy: {
    type: String,
  },
}, {
  saveUnknown: true
});
