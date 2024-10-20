import { EntityBase } from '../../../../shared/models/entity-base.model';

export interface SanctionType extends EntityBase, SanctionTypeRequestDTO {}

export interface SanctionTypeRequestDTO {
  name: string;
  description: string;
  charge_type: ChargeTypeEnum;
  amount: number; 
}

export enum ChargeTypeEnum {
  PROPORTIONAL = 'Proporcional',
  FIXED = 'Fijo',
}
