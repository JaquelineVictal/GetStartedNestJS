import IMetric from "src/interfaces/Imetric";


export default class metricEntitie {
  id: number;
  metricName: string;
  salesForceName: string;
  siteName: number;
  dateTime: Date;
  value: number;
  referenceValue: number;
  metricDate?: string | Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(metric: IMetric) {
    this.id = metric.id;
    this.metricName = metric.metricName;
    this.salesForceName = metric.salesForceName;
    this.dateTime = ajustDateTime(metric.dateTime);
    this.value = metric.value;
    this.referenceValue = metric.referenceValue;
    this.metricDate = metric.metricDate ? metric.metricDate : null;
    this.createdAt = metric.createdAt ? metric.createdAt : new Date();
    this.updatedAt = metric.updatedAt ? metric.updatedAt : new Date();
  }

  private ajustDateTime(dateTime: string) {
    ////
  }

  public createdMetric(metric: IMetric){

  }
}
