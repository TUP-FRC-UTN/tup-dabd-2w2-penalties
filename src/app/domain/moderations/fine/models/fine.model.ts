import { EntityBase } from '../../../../shared/models/entity-base.model';
import { FineStatusEnum } from './fine-status.enum';
import { InfractionDto } from '../../infraction/models/infraction.model';
import { SanctionType } from '../../sanction-type/models/sanction-type.model';

export interface Fine extends EntityBase {
  plotId: number;
  fineState: FineStatusEnum;
  sanctionType: SanctionType;
  infractions: InfractionDto[];
}
