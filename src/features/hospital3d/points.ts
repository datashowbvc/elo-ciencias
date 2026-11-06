/** Coordenadas futuras no sistema local do GLB, sem alterar a origem do modelo. */
export interface HospitalPoint { id: string; label: string; position: [number, number, number]; confirmed: true; }
export const hospitalPoints: readonly HospitalPoint[] = [];
