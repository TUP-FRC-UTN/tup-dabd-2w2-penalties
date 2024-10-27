import { ClaimDTO } from '../../claim/models/claim.model';
import { EntityBase } from '../../../../shared/models/entity-base.model';

export interface InfractionDto {
  plotId: number;
  description: string;
  sanctionTypeId: number;
  claimsId: number[];
}

export interface InfractionModel extends EntityBase {
  plot_id: number;
  description: string;
  sanctionTypeId: number;
  claims: ClaimDTO[];
  fine_id: number;
}
