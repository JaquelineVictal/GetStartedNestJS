import Iibge from 'src/interfaces/Iibge';

export default class ibgeEntitie {
  id: number;
  name: string;
  region: string;
  freq: number;
  rank: number;
  gender: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(Iibge: Iibge) {
    this.id = Iibge.id;
    this.name = Iibge.name;
    this.region = Iibge.region;
    this.freq = Iibge.freq;
    this.rank = Iibge.rank;
    this.gender = Iibge.gender;
    this.createdAt = Iibge.createdAt ? Iibge.createdAt : new Date();
    this.updatedAt = Iibge.updatedAt ? Iibge.updatedAt : new Date();
  }
}
