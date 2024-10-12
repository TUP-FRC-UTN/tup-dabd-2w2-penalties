import { EntityBase } from './entityBase.model';

export interface SanctionType extends EntityBase {
  name: string;
  description: string;
}
