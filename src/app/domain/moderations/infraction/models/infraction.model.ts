import { Claim } from '../../claim/models/claim.model';
import { EntityBase } from '../../../../shared/models/entity-base.model';

export interface InfractionDto {
  plotId: Number;

  description: string;

  sanctionTypeId: number;

  claimsId: number[];
}
