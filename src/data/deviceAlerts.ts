import type {
  DeviceAlertStats,
  LowPowerDevice,
  OfflineDevice,
} from '../types';

/**
 * 管理端「离线设备监控预警」「低电量设备警示」两块面板的数据源。
 *
 * 原来两份各 8 台的设备清单写死在 App.tsx 里，管理端底部两张卡片
 * 的角标却写死为「5台离线」「5台低电量」，与清单条数对不上，
 * 增删一台设备要同步改三处数字。这里把清单抽出来，角标计数、
 * 最低电量与最早离线时间全部由清单实时算出。
 */

export const OFFLINE_DEVICES: OfflineDevice[] = [
  { id: '1', name: '浙江安吉白茶核心园区智能墒情桩', serial: 'ZJ-AJ-SEN-01', time: '2026-10-15 14:12:11', type: '传感器', battery: '12%' },
  { id: '2', name: '福建武夷山大红袍数字茶园气象站', serial: 'FJ-WYS-MET-02', time: '2026-10-15 11:10:01', type: '控制器', battery: '8%' },
  { id: '3', name: '山东寿光现代蔬菜高科园水肥一体机', serial: 'SD-SG-IRR-03', time: '2026-10-14 18:52:06', type: '监测站', battery: '15%' },
  { id: '4', name: '云南普洱有机咖啡庄园墒情雷达', serial: 'YN-PE-COFFEE-01', time: '2026-10-14 09:31:06', type: '监测站', battery: '5%' },
  { id: '5', name: '黑龙江北大荒万亩智慧农场导航测控站', serial: 'HLJ-BD-FARM-05', time: '2026-10-13 16:25:01', type: '终端', battery: '10%' },
  { id: '6', name: '新疆兵团优质棉田滴灌智控中心', serial: 'XJ-BT-COTTON-02', time: '2026-10-13 10:15:22', type: '监测站', battery: '6%' },
  { id: '7', name: '海南三亚南繁科研育种基地温光监测桩', serial: 'HI-SY-NF-01', time: '2026-10-12 22:40:11', type: '控制器', battery: '4%' },
  { id: '8', name: '江苏扬州稻麦核心试验站水质监测仪', serial: 'JS-YZ-RICE-04', time: '2026-10-12 15:33:50', type: '传感器', battery: '11%' },
];

export const LOW_POWER_DEVICES: LowPowerDevice[] = [
  { id: '1', name: '浙江杭州西湖龙井茶基地土壤雷达', serial: 'ZJ-HZ-LJ-01', time: '2026-10-15 15:12:11', battery: '5%' },
  { id: '2', name: '福建安溪铁观音生态智控桩', serial: 'FJ-AX-TGY-02', time: '2026-10-15 13:10:01', battery: '9%' },
  { id: '3', name: '广西南宁香蕉产业智慧水肥站', serial: 'GX-NN-FRT-03', time: '2026-10-14 20:52:06', battery: '11%' },
  { id: '4', name: '广东湛江热带果树气象观测仪', serial: 'GD-ZJ-LYCHEE-01', time: '2026-10-14 12:31:06', battery: '7%' },
  { id: '5', name: '贵州遵义赤水河谷有机茶园监控桩', serial: 'GZ-ZY-CS-04', time: '2026-10-13 08:25:01', battery: '12%' },
  { id: '6', name: '四川眉山东坡泡菜原料种植基地墒情站', serial: 'SC-MS-DP-03', time: '2026-10-13 06:12:00', battery: '8%' },
  { id: '7', name: '陕西延安苹果智慧果园水肥仪', serial: 'SX-YA-AP-02', time: '2026-10-12 19:25:40', battery: '10%' },
  { id: '8', name: '宁夏中卫枸杞滴灌智能终端', serial: 'NX-GQ-FRT-01', time: '2026-10-12 14:02:18', battery: '6%' },
];

/** 由两份预警清单算出角标计数、最低电量与最早离线时间。 */
export function summarizeDeviceAlerts(
  offlineDevices: OfflineDevice[],
  lowPowerDevices: LowPowerDevice[],
): DeviceAlertStats {
  const batteryOf = (battery: string) =>
    Number.parseInt(battery.replace('%', ''), 10);
  const lowestBatteryNum = Math.min(
    ...offlineDevices.map((d) => batteryOf(d.battery)),
    ...lowPowerDevices.map((d) => batteryOf(d.battery)),
  );
  const earliestOfflineTime = offlineDevices
    .map((d) => d.time)
    .sort()
    .at(0) ?? '';
  return {
    offlineCount: offlineDevices.length,
    lowPowerCount: lowPowerDevices.length,
    lowestBattery: `${lowestBatteryNum}%`,
    earliestOfflineTime,
  };
}
