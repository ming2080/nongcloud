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

/** 终端设备态势相关类型：大屏左侧「终端设备态势」面板使用 */

export type TerminalDeviceStation = 'station1' | 'station2';

export type TerminalDeviceType = 'valve' | 'sensor' | 'weather' | 'pump' | 'flow';

export interface TerminalDevice {
  id: string;
  name: string;
  station: TerminalDeviceStation;
  stationTag: string;
  type: TerminalDeviceType;
  /** 正常 / 异常，与 isAlert 同步 */
  status: '正常' | '异常';
  isAlert: boolean;
  telemetry: string;
  signal: string;
  /** 当日最后上报时间 HH:MM:SS，用于列表排序 */
  time: string;
}

export interface TerminalDeviceStats {
  /** 设备总数 */
  total: number;
  /** 在线数（状态正常） */
  online: number;
  /** 异常/告警数 */
  alert: number;
  /** 基站1# 设备数 */
  station1: number;
  /** 基站2# 设备数 */
  station2: number;
}
