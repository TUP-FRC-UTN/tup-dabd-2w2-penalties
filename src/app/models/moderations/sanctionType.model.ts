import { EntityBase } from './entityBase.model';
import { Infraction } from './infraction.model';

export interface SanctionType extends EntityBase {
  name: string;
}
