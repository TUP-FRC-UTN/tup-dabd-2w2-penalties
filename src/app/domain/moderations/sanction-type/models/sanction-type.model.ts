import { EntityBase } from "../../../../shared/models/entity-base.model";

export interface SanctionType extends EntityBase {
  name: string;
  description: string;
}
