export class IbgeEntity {
  id: number;
  name: string;
  region: string;
  freq: number;
  rank: number;
  gender: string;
  createdAt: Date;
  updatedAt: Date;

  public build(
    id: number,
    name: string,
    region: string,
    freq: number,
    rank: number,
    gender: string,
    createdAt: Date,
    updatedAt: Date,
  ): IbgeEntity {
    const ibgeEntity = new IbgeEntity();
    ibgeEntity.id = id;
    ibgeEntity.name = name;
    ibgeEntity.region = region;
    ibgeEntity.freq = freq;
    ibgeEntity.rank = rank;
    ibgeEntity.gender = gender;
    ibgeEntity.createdAt = createdAt;
    ibgeEntity.updatedAt = updatedAt;

    return ibgeEntity;
  }
}
