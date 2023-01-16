import IReport from 'src/interfaces/Ireport';

export default class reportEntitie {
  id: number;
  metricName: string;
  totalValue: number;
  count: number;
  avg?: number;
  metricDate?: string | Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(report: IReport) {
    this.id = metric.id;
    this.metricName = metric.metricName;
    this.totalValue = totalValue.salesForceName;
    this.dateTime = metric.dateTime;
    this.value = metric.value;
    this.referenceValue = metric.referenceValue;
    this.metricDate = metric.metricDate ? metric.metricDate : null;
    this.createdAt = metric.createdAt ? metric.createdAt : new Date();
    this.updatedAt = metric.updatedAt ? metric.updatedAt : new Date();
  }
}
