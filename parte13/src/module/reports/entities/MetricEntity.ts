export default class MetricEntity {
  id: number;
  metricName: string;
  salesForceName: string;
  siteName: number;
  dateTime: Date;
  value: number;
  referenceValue: number;
  createdAt: Date;
  updatedAt: Date;

  public build(
    id: number,
    metricName: string,
    salesForceName: string,
    siteName: number,
    dateTime: Date,
    value: number,
    referenceValue: number,
    createdAt: Date,
    updatedAt: Date,
  ): MetricEntity {
    const metricEntity = new MetricEntity();
    metricEntity.id = id;
    metricEntity.metricName = metricName;
    metricEntity.salesForceName = salesForceName;
    metricEntity.siteName = siteName;
    metricEntity.dateTime = dateTime;
    metricEntity.value = value;
    metricEntity.referenceValue = referenceValue;
    metricEntity.createdAt = createdAt;
    metricEntity.updatedAt = updatedAt;

    return metricEntity;
  }
}
