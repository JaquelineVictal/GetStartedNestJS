export default interface IReport {
  id: number;
  metricName: string;
  totalValue: number;
  count: number;
  avg?: number;
  metricDate?: string | Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
