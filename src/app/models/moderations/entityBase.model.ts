import { Infraction } from './infraction.model';

export interface  EntityBase {
  id: number;
  createdDate: string;
  createdBy: string;
  lastUpdatedAt: number;
  lastUpdatedBy: number;
}
