import { Claim } from './claim.model';
import { EntityBase } from './entityBase.model';

export interface Infraction extends EntityBase {
  userId: Number;

  description: string;

  infractionState: string;

  sanctionType: string;

  claims: Claim[];
}
