export class GatewayDto {
  constructor(
    public id?: number,
    public type?: string,
    public archIds: number[] = [],
    public conditionsJson?: string
  ) {}
}
