import { EntityBase } from './entityBase.model';
import { FineStatusEnum } from './fineStatus.enum';
import { Infraction } from './infraction.model';
import { SanctionType } from './sanctionType.model';

export interface UpdateFineStateDTO {
  id: number | undefined;
  fineState: FineStatusEnum;
  updatedBy: number;
}
