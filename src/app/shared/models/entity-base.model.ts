import { InfractionDto } from '../../domain/moderations/infraction/models/infraction.model';

export interface EntityBase {
  id: number;
  createdDate: Date;
  createdBy: string;
  lastUpdatedAt: Date;
  lastUpdatedBy: number;
}
