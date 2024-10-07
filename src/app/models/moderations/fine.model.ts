import { EntityBase } from './entityBase.model';
import { Infraction } from './infraction.model';
import { SanctionType } from './sanctionType.model';

export interface Fine extends EntityBase {
  plotId: number;
  description: string;
  fineState: string;
  sanctionType: SanctionType;
  infractions: Infraction[];
}
