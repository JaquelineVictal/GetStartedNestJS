export default interface IMetric {
  id: number;
  metricName: string;
  salesForceName: string;
  siteName: number;
  dateTime: string;
  value: number;
  referenceValue: number;
  metricDate?: string | Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
