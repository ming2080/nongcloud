import type {
  HistoryConfig,
  HistoryMetricConfig,
  HistoryPoint,
  HistorySummary,
} from '../types';

/**
 * 大屏「历史数据」面板的数据源。
 *
 * 原来三组指标的曲线数据与峰值/谷值/均值都写死在 App.tsx 的
 * getHistoryConfig() 里，日期区间选择器只改显示文字、不过滤数据。
 * 这里把原始日序列抽出来：按指标取数、按所选日期区间过滤，
 * 峰值/谷值/均值由过滤后的数据实时算出。
 */

export const HISTORY_METRIC_CONFIGS: Record<string, HistoryMetricConfig> = {
  空气温度: {
    unit: '℃',
    domain: [0, 60],
    ticks: [0, 20, 40, 60],
    alertLine: 45,
    baseline: 28,
  },
  空气湿度: {
    unit: '%RH',
    domain: [30, 100],
    ticks: [30, 50, 70, 90],
    alertLine: 80,
    baseline: 60,
  },
  土壤水势: {
    unit: 'kPa',
    domain: [10, 60],
    ticks: [10, 25, 40, 55],
    alertLine: 45,
    baseline: 25,
  },
};

const DAYS: Array<{ date: string; fullDate: string }> = [
  { date: '10/06', fullDate: '2026-10-06' },
  { date: '10/07', fullDate: '2026-10-07' },
  { date: '10/08', fullDate: '2026-10-08' },
  { date: '10/09', fullDate: '2026-10-09' },
  { date: '10/10', fullDate: '2026-10-10' },
  { date: '10/11', fullDate: '2026-10-11' },
  { date: '10/12', fullDate: '2026-10-12' },
  { date: '10/13', fullDate: '2026-10-13' },
  { date: '10/14', fullDate: '2026-10-14' },
  { date: '10/15', fullDate: '2026-10-15' },
];

function buildSeries(
  values: number[],
  notes: string[],
): HistoryPoint[] {
  return DAYS.map((d, i) => ({
    date: d.date,
    fullDate: d.fullDate,
    val: values[i],
    note: notes[i],
  }));
}

export const HISTORY_SERIES: Record<string, HistoryPoint[]> = {
  空气温度: buildSeries(
    [25, 28, 29, 32, 34, 35, 38, 44, 48, 52],
    ['偏凉', '温和', '常态', '常态', '适宜', '升温', '回稳', '偏高', '超限高温', '极值警戒'],
  ),
  空气湿度: buildSeries(
    [49, 54, 58, 62, 63, 65, 68, 71, 79, 86],
    ['干燥警戒', '偏干', '良好', '正常', '适宜', '常态', '适中', '正常', '湿润', '高湿预警'],
  ),
  土壤水势: buildSeries(
    [19, 22, 24, 26, 28, 31, 35, 41, 46, 51],
    ['极湿', '适宜', '墒情优', '良好', '良好', '微降', '补灌后', '临界', '缺水预警', '重度缺水'],
  ),
};

export function getHistoryMetricConfig(metric: string): HistoryMetricConfig {
  return HISTORY_METRIC_CONFIGS[metric] ?? HISTORY_METRIC_CONFIGS['空气温度'];
}

export function getHistorySeries(metric: string): HistoryPoint[] {
  return HISTORY_SERIES[metric] ?? HISTORY_SERIES['空气温度'];
}

/** 解析「2026/09/25 ~ 2026/10/10」格式的区间文字，解析失败返回 null */
export function parseHistoryRange(range: string): { start: string; end: string } | null {
  const parts = range.split('~').map((s) => s.trim().replace(/\//g, '-'));
  if (parts.length !== 2) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parts[0])) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parts[1])) return null;
  return { start: parts[0], end: parts[1] };
}

/** 只保留落在 [start, end] 闭区间内的数据点 */
export function filterHistoryByRange(
  points: HistoryPoint[],
  start: string,
  end: string,
): HistoryPoint[] {
  return points.filter((p) => p.fullDate >= start && p.fullDate <= end);
}

/** 由数据点算出峰值 / 谷值 / 均值；无数据时返回 null */
export function summarizeHistory(points: HistoryPoint[]): HistorySummary | null {
  if (points.length === 0) return null;
  let peak = points[0];
  let valley = points[0];
  let sum = 0;
  for (const p of points) {
    if (p.val > peak.val) peak = p;
    if (p.val < valley.val) valley = p;
    sum += p.val;
  }
  return {
    count: points.length,
    peakVal: peak.val,
    peakDate: peak.date,
    valleyVal: valley.val,
    valleyDate: valley.date,
    avg: Math.round((sum / points.length) * 10) / 10,
  };
}

/**
 * 给定指标与区间文字，返回图表要用的配置：
 * 数据按区间过滤，统计值由过滤后的数据算出。
 * 区间文字解析失败时返回该指标的全部数据。
 */
export function buildHistoryConfig(metric: string, range: string): HistoryConfig {
  const config = getHistoryMetricConfig(metric);
  const series = getHistorySeries(metric);
  const parsed = parseHistoryRange(range);
  const data = parsed ? filterHistoryByRange(series, parsed.start, parsed.end) : [...series];
  return {
    ...config,
    data,
    summary: summarizeHistory(data),
  };
}
