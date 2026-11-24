import type {
  TerminalDevice,
  TerminalDeviceStats,
} from '../types';

/**
 * 大屏左侧「终端设备态势」面板的数据源。
 *
 * 原来 7 台终端设备的列表、顶部「在线 / 异常」数、四个筛选标签的
 * 计数（全部 / 基站1# / 基站2# / 告警）都写死在 App.tsx 里，改一台
 * 设备要同步改四处数字，容易对不上。这里把设备清单抽出来，
 * 顶部数字与标签计数全部由清单实时算出。
 */

export const TERMINAL_DEVICES: TerminalDevice[] = [
  {
    id: 'VALVE-01',
    name: '灌溉控制器1#电磁阀门',
    station: 'station1',
    stationTag: '基站1#',
    type: 'valve',
    status: '正常',
    isAlert: false,
    telemetry: '阀门开度 100% · 恒压供水',
    signal: '98%',
    time: '16:23:45',
  },
  {
    id: 'VALVE-02',
    name: '灌溉控制器2#电磁阀门',
    station: 'station1',
    stationTag: '基站1#',
    type: 'valve',
    status: '正常',
    isAlert: false,
    telemetry: '阀门闭合 0% · 待机轮灌',
    signal: '95%',
    time: '16:22:10',
  },
  {
    id: 'VALVE-03',
    name: '灌溉控制器3#电磁阀门',
    station: 'station1',
    stationTag: '基站1#',
    type: 'valve',
    status: '正常',
    isAlert: false,
    telemetry: '轮灌分组 A-01 · 延时待启',
    signal: '92%',
    time: '16:20:00',
  },
  {
    id: 'SEN-04',
    name: '田间通用土壤墒情传感器',
    station: 'station1',
    stationTag: '基站1#',
    type: 'sensor',
    status: '异常',
    isAlert: true,
    telemetry: '采集超时 >150ms · 数据突变',
    signal: '42%',
    time: '16:12:05',
  },
  {
    id: 'MET-01',
    name: '小型农田环境气象站',
    station: 'station2',
    stationTag: '基站2#',
    type: 'weather',
    status: '正常',
    isAlert: false,
    telemetry: '光照 86k Lux · 温湿监测正常',
    signal: '99%',
    time: '16:23:40',
  },
  {
    id: 'PUMP-02',
    name: '水肥机组变频增压泵',
    station: 'station2',
    stationTag: '基站2#',
    type: 'pump',
    status: '正常',
    isAlert: false,
    telemetry: '频率 42.5Hz · 稳压 0.38MPa',
    signal: '94%',
    time: '16:23:12',
  },
  {
    id: 'FLOW-03',
    name: '主干管道脉冲流量计',
    station: 'station2',
    stationTag: '基站2#',
    type: 'flow',
    status: '正常',
    isAlert: false,
    telemetry: '瞬时流量 24.6 m³/h',
    signal: '96%',
    time: '16:21:45',
  },
];

/** 由设备清单算出顶部在线/异常数与各筛选标签的计数。 */
export function summarizeTerminalDevices(
  devices: TerminalDevice[],
): TerminalDeviceStats {
  return {
    total: devices.length,
    online: devices.filter((d) => !d.isAlert).length,
    alert: devices.filter((d) => d.isAlert).length,
    station1: devices.filter((d) => d.station === 'station1').length,
    station2: devices.filter((d) => d.station === 'station2').length,
  };
}
