export interface Claim {
  id: number;
}
export interface ClaimNew {
  plot_id: number,
  sanction_type_entity_id: number,
  description: string,
  proofs_id: number[]
}
