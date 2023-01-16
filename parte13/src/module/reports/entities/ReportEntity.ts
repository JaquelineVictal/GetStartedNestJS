export default class ReportEntity {
  reportDate: string;
  totalValue: number;
  count: number;
  avg: number;

  public build(
    reportDate: string,
    totalValue: number,
    count: number,
    avg: number,
  ): ReportEntity {
    const reportEntity = new ReportEntity();
    reportEntity.reportDate = reportDate;
    reportEntity.totalValue = totalValue;
    reportEntity.count = count;
    reportEntity.avg = avg;

    return reportEntity;
  }
}
