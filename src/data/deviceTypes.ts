import type {
  DeviceTypeItem,
  DeviceTypeStats,
} from '../types';
import {
  SVG_DEVICE_TH,
  SVG_DEVICE_SOIL,
  SVG_DEVICE_PRESS,
  SVG_DEVICE_CO2,
  SVG_DEVICE_WEATHER,
  SVG_DEVICE_PHEC,
  SVG_DEVICE_PAR,
  SVG_DEVICE_MOTOR,
  SVG_DEVICE_OZONE,
  SVG_DEVICE_GAS,
} from '../components/deviceImages';

/**
 * 管理端「设备类型」页的数据源。
 *
 * 原来 10 个设备类型的清单写死在 DeviceTypeManagement 组件里，
 * 分类与上级类型两个筛选下拉的选项又是另外手写的一份，
 * 增删一个类型要同步改三处，容易对不上。这里把清单抽出来，
 * 两个筛选下拉的选项、启用数与关联设备总数全部由清单实时算出。
 */

export const DEVICE_TYPES: DeviceTypeItem[] = [
  {
    id: 'dt-1',
    no: 1,
    image: SVG_DEVICE_TH,
    name: '智能环境温湿度变送器',
    code: 'DEV-TH-01',
    category: '环境监测',
    parentType: '大棚微气候监控系统',
    version: 'V2.2.0',
    remark: '高精度工业级数字温湿度变送器，自带LCD背光双显，高灵敏透气网罩',
    creator: '管理员',
    createTime: '2026-10-15 15:20:10',
    updater: '管理员',
    updateTime: '2026-10-15 15:35:00',
    moduleName: '第1路高精度温湿度传感器',
    protocol: 'Modbus-RTU',
    model: 'RS485-TH-V2',
    deviceCount: 48,
    status: '启用'
  },
  {
    id: 'dt-2',
    no: 2,
    image: SVG_DEVICE_SOIL,
    name: '多深度土壤墒情监测仪',
    code: 'DEV-SOIL-02',
    category: '土壤墒情',
    parentType: '水肥一体化测控系统',
    version: 'V2.1.5',
    remark: '不锈钢三探针式土壤水分、温度、电导率EC高灵敏度插入式探针传感器',
    creator: '管理员',
    createTime: '2026-10-15 13:45:30',
    updater: '李工 (系统运维)',
    updateTime: '2026-10-15 14:10:00',
    moduleName: '第2路多深度土壤墒情仪',
    protocol: 'MQTT',
    model: 'SOIL-EC-800',
    deviceCount: 36,
    status: '启用'
  },
  {
    id: 'dt-3',
    no: 3,
    image: SVG_DEVICE_PRESS,
    name: '主管道高频水流水压变送器',
    code: 'DEV-PRESS-03',
    category: '水利管网',
    parentType: '水肥一体化测控系统',
    version: 'V2.0.4',
    remark: '316L全不锈钢压阻式压力变送器，赫斯曼DIN接头，G1/2管网螺纹接口',
    creator: '管理员',
    createTime: '2026-10-15 10:18:22',
    updater: '王工 (设备专家)',
    updateTime: '2026-10-15 11:00:15',
    moduleName: '第3路主管道水流水压变送器',
    protocol: 'LoRaWAN',
    model: 'PRS-LORA-DN50',
    deviceCount: 22,
    status: '启用'
  },
  {
    id: 'dt-4',
    no: 4,
    image: SVG_DEVICE_CO2,
    name: '红外二氧化碳浓度分析仪',
    code: 'DEV-CO2-04',
    category: '气体分析',
    parentType: '大棚微气候监控系统',
    version: 'V1.9.2',
    remark: '进口双光束红外NDIR光学气体传感器，带金镀层吸收腔，0-5000ppm量程',
    creator: '管理员',
    createTime: '2026-10-14 16:50:18',
    updater: '管理员',
    updateTime: '2026-10-14 17:30:00',
    moduleName: '第4路高精度二氧化碳传感器',
    protocol: 'Modbus-RTU',
    model: 'CO2-NDIR-5000',
    deviceCount: 30,
    status: '启用'
  },
  {
    id: 'dt-5',
    no: 5,
    image: SVG_DEVICE_WEATHER,
    name: '超声波农田微气象多合一监测桩',
    code: 'DEV-MET-05',
    category: '农业气象',
    parentType: '园区大田气象监测站',
    version: 'V3.0.1',
    remark: '一体化超声波风速风向冠顶、多层百叶轻型防辐射罩与太阳能供电立杆',
    creator: '管理员',
    createTime: '2026-10-14 11:22:05',
    updater: '陈工 (气象工程)',
    updateTime: '2026-10-14 12:15:20',
    moduleName: '第5路农田微气象多合一监测桩',
    protocol: 'TCP/IP',
    model: 'METEO-PRO-X6',
    deviceCount: 16,
    status: '启用'
  },
  {
    id: 'dt-6',
    no: 6,
    image: SVG_DEVICE_PHEC,
    name: '水质酸碱度pH/EC在线检测仪',
    code: 'DEV-PH-06',
    category: '水肥水质',
    parentType: '水肥一体化测控系统',
    version: 'V1.8.6',
    remark: '工业在线双通道水质分析仪，配双球形玻璃pH电极与双铂金环EC电极',
    creator: '管理员',
    createTime: '2026-10-13 17:05:40',
    updater: '李工 (系统运维)',
    updateTime: '2026-10-13 17:50:00',
    moduleName: '第6路水质酸碱度pH/EC监测仪',
    protocol: 'Modbus-RTU',
    model: 'WATER-PH-EC01',
    deviceCount: 12,
    status: '启用'
  },
  {
    id: 'dt-7',
    no: 7,
    image: SVG_DEVICE_PAR,
    name: '植物冠层光合有效辐射监测仪',
    code: 'DEV-PAR-07',
    category: '植物生理',
    parentType: '智慧农情科研系统',
    version: 'V1.5.0',
    remark: '余弦校正光学半球漫射罩，带阳极氧化微调水平水准泡，测量PAR光量子',
    creator: '管理员',
    createTime: '2026-10-13 14:12:15',
    updater: '林博 (农科院)',
    updateTime: '2026-10-13 15:00:10',
    moduleName: '第7路植物茎流叶片水分传感仪',
    protocol: 'LoRaWAN',
    model: 'STEM-FLOW-07',
    deviceCount: 10,
    status: '启用'
  },
  {
    id: 'dt-8',
    no: 8,
    image: SVG_DEVICE_MOTOR,
    name: '大棚顶膜电动卷膜开合定位器',
    code: 'DEV-ROLL-08',
    category: '智能控制',
    parentType: '智能温室通风控制系统',
    version: 'V2.0.0',
    remark: '24V直流行星减速卷膜电机，带双向行程限位编码轮与输出花键联轴器',
    creator: '管理员',
    createTime: '2026-10-12 16:30:00',
    updater: '张工 (自控工程)',
    updateTime: '2026-10-12 17:20:00',
    moduleName: '第8路大棚顶膜开合行程定位器',
    protocol: 'Modbus-RTU',
    model: 'ROLL-MOTOR-X8',
    deviceCount: 28,
    status: '启用'
  },
  {
    id: 'dt-9',
    no: 9,
    image: SVG_DEVICE_OZONE,
    name: '密闭育苗室负离子臭氧消毒机',
    code: 'DEV-O3-09',
    category: '绿色植保',
    parentType: '绿色物理植保防控系统',
    version: 'V1.3.2',
    remark: '304不锈钢壁挂机箱，内置陶瓷高压放电发生器与强力负离子循环风机',
    creator: '管理员',
    createTime: '2026-10-11 15:40:22',
    updater: '管理员',
    updateTime: '2026-10-11 16:10:00',
    moduleName: '第9路负离子与臭氧灭菌监测模块',
    protocol: 'TCP/IP',
    model: 'OZONE-CLEAN-09',
    deviceCount: 8,
    status: '启用'
  },
  {
    id: 'dt-10',
    no: 10,
    image: SVG_DEVICE_GAS,
    name: '有害气体与甲烷浓度安全监控仪',
    code: 'DEV-GAS-10',
    category: '安全防护',
    parentType: '园区安全用气监控系统',
    version: 'V1.2.0',
    remark: 'Ex d IICT6防爆铸铝外壳，顶置高亮红色声光报警灯，烧结金属阻火网头',
    creator: '管理员',
    createTime: '2026-10-10 10:15:00',
    updater: '赵工 (安监员)',
    updateTime: '2026-10-10 11:00:00',
    moduleName: '第10路有害气体与一氧化碳检测仪',
    protocol: 'Modbus-RTU',
    model: 'GAS-SENSE-10',
    deviceCount: 6,
    status: '启用'
  }
];

/** 由设备类型清单算出总数、启用数、关联设备总数与各分类/上级类型的计数。 */
export function summarizeDeviceTypes(
  deviceTypes: DeviceTypeItem[],
): DeviceTypeStats {
  const countBy = (key: (item: DeviceTypeItem) => string) => {
    const grouped: { name: string; count: number }[] = [];
    for (const item of deviceTypes) {
      const name = key(item);
      const found = grouped.find((g) => g.name === name);
      if (found) {
        found.count += 1;
      } else {
        grouped.push({ name, count: 1 });
      }
    }
    return grouped;
  };
  return {
    total: deviceTypes.length,
    enabled: deviceTypes.filter((dt) => dt.status === '启用').length,
    totalDeviceCount: deviceTypes.reduce(
      (sum, dt) => sum + (dt.deviceCount ?? 0),
      0,
    ),
    categories: countBy((dt) => dt.category ?? '未分类'),
    parentTypes: countBy((dt) => dt.parentType),
  };
}
