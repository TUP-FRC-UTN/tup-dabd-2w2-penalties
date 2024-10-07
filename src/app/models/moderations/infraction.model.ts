import { Claim } from './claim.model';

export interface Infraction {
  userId: Number;

  description: string;

  infractionState: string;

  sanctionType: string;

  claims: Claim[];
}
