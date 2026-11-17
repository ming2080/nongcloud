/** 历史曲线相关类型：大屏「历史数据」面板使用 */

export interface HistoryPoint {
  /** 图表横轴显示的短日期，如 10/06 */
  date: string;
  /** 完整日期，用于按所选区间过滤，如 2026-10-06 */
  fullDate: string;
  val: number;
  note: string;
}

export interface HistoryMetricConfig {
  unit: string;
  domain: [number, number];
  ticks: number[];
  alertLine: number;
  baseline: number;
}

export interface HistorySummary {
  /** 区间内数据点数（天数） */
  count: number;
  peakVal: number;
  peakDate: string;
  valleyVal: number;
  valleyDate: string;
  /** 区间均值，保留 1 位小数 */
  avg: number;
}

export interface HistoryConfig extends HistoryMetricConfig {
  /** 按所选日期区间过滤后的数据点 */
  data: HistoryPoint[];
  /** 由 data 算出的区间统计；无数据时为 null */
  summary: HistorySummary | null;
}
