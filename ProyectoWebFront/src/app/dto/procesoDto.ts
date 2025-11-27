// src/app/dto/procesoDto.ts

export type ProcessStatus = 'DRAFT' | 'PUBLISHED' | 'INACTIVE';

export class ProcesoDto {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public category?: string,
    public status?: ProcessStatus,
    public organizationId?: number,
    public activityIds: number[] = [],
    public archIds: number[] = [],
    public gatewayIds: number[] = [],
    public orden?: number
  ) {}
}
