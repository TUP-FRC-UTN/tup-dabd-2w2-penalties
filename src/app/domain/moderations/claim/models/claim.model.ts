import { EntityBase } from '../../../../shared/models/entity-base.model';
import { SanctionType } from '../../sanction-type/models/sanction-type.model';

export interface ClaimDTO extends EntityBase {
  description: string;
  plot_id: number;
  infraction_id: number;
  sanction_type: SanctionType;
  claim_state: ClaimStatusEnum;
}
export interface ClaimNew {
  plot_id: number;
  sanction_type_entity_id: number;
  description: string;
  proofs_id: number[];
}

export enum ClaimStatusEnum {
  SENT = 'Enviado',
  APPROVED = 'Aprobado',
  REJECTED = 'Desaprobado',
}
