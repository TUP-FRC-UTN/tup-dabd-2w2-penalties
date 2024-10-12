import { EntityBase } from './entityBase.model';
import { FineStatusEnum } from './fineStatus.enum';
import { Infraction } from './infraction.model';
import { SanctionType } from './sanctionType.model';

export interface FineDTO {
  plotId: number | undefined;

  sanctionTypeId: number | undefined;
}
