import { Claim } from '../../claim/models/claim.model';
import { EntityBase } from '../../../../shared/models/entity-base.model';

export interface Infraction extends EntityBase {
  userId: Number;

  description: string;

  infractionState: string;

  sanctionType: string;

  claims: Claim[];
}
