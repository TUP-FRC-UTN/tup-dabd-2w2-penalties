import { EntityBase } from '../moderations/entityBase.model';

export interface Plot extends EntityBase {
  plot_number: number;
  block_number: number;
  plot_status: string;
  plot_type: string;
}
