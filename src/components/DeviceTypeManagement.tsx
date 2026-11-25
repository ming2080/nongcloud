import React, { useState, useMemo } from 'react';
import { 
  Search, RefreshCw, SlidersHorizontal, Settings, Plus, Trash2, 
  Calendar, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Sliders, Cpu, FileText, AlertTriangle, X, Check,
  Layers, Download, ArrowUpDown, Filter, Upload, Eye, CheckCircle2
} from 'lucide-react';
import { 
  SVG_DEVICE_TH, SVG_DEVICE_SOIL, SVG_DEVICE_PRESS, SVG_DEVICE_CO2,
  SVG_DEVICE_WEATHER, SVG_DEVICE_PHEC, SVG_DEVICE_PAR, SVG_DEVICE_MOTOR,
  SVG_DEVICE_OZONE, SVG_DEVICE_GAS, DEVICE_IMAGE_MAP, getDeviceImage 
} from './deviceImages';

import type { DeviceTypeItem } from '../types';
import { DEVICE_TYPES, summarizeDeviceTypes } from '../data/deviceTypes';

export interface DeviceModuleItem {
  id: string;
  no: number;
  name: string;
  remark: string;
  sort: number;
  creator: string;
  createTime: string;
}

export interface ModulePropertyItem {
  id: string;
  moduleId?: string;
  no: number;
  name: string;
  address: string;
  registerSize: number;
  propType: '只读' | '读写';
  displayForm: '数值显示' | '开关状态' | '枚举状态' | '文本状态';
  parseMethod: 'BCD' | 'HEX' | 'IEEE754' | '16位无符号' | '16位有符号';
  unit: string;
  calcTransform: string;
  sort: number;
}

export interface DeviceTypeLogItem {
  id: string;
  serialNo: string;
  projectName: string;
  target: string;
  changeType: '属性扩展' | '参数调优' | '固件升级' | '初始注册' | '模块停用';
  summary: string;
  versionChange: string;
  operator: string;
  ip: string;
  logTime: string;
  diffBefore?: string;
  diffAfter?: string;
}

interface DeviceTypeManagementProps {
  subTab: 'device-module' | 'device-type' | 'device-type-log';
  onSubTabChange: (tab: 'device-module' | 'device-type' | 'device-type-log') => void;
  showToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const DeviceTypeManagement: React.FC<DeviceTypeManagementProps> = ({
  subTab,
  onSubTabChange,
  showToast = (msg) => alert(msg)
}) => {
  // 1. ==================== 设备模块 State & Mock Data (重新生成，创建时间按近期时间降序排) ====================
  const initialModules: DeviceModuleItem[] = [
    { 
      id: 'mod-01', 
      no: 1, 
      name: '第1路高精度温湿度传感器', 
      remark: '进口SHT40高灵敏度温湿采集，适配智慧连栋温室环境动态感应', 
      sort: 1, 
      creator: '管理员', 
      createTime: '2026-10-15 14:35:28' 
    },
    { 
      id: 'mod-02', 
      no: 2, 
      name: '第2路多深度土壤墒情仪', 
      remark: '10cm/20cm/40cm三层土壤温湿度与电导率盐分综合监测', 
      sort: 2, 
      creator: '管理员', 
      createTime: '2026-10-15 11:20:16' 
    },
    { 
      id: 'mod-03', 
      no: 3, 
      name: '第3路主管道水流水压变送器', 
      remark: '水肥一体化管网主干管压力与瞬时流量高频一体采集', 
      sort: 3, 
      creator: '管理员', 
      createTime: '2026-10-14 17:08:42' 
    },
    { 
      id: 'mod-04', 
      no: 4, 
      name: '第4路高精度二氧化碳传感器', 
      remark: '红外NDIR光学原理，量程0-5000ppm，作物光合作用环境监控', 
      sort: 4, 
      creator: '管理员', 
      createTime: '2026-10-14 09:45:10' 
    },
    { 
      id: 'mod-05', 
      no: 5, 
      name: '第5路农田微气象多合一监测桩', 
      remark: '超声波风速风向、雨量、光合有效辐射PAR气象要素集成采集', 
      sort: 5, 
      creator: '管理员', 
      createTime: '2026-10-13 16:22:05' 
    },
    { 
      id: 'mod-06', 
      no: 6, 
      name: '第6路水质酸碱度pH/EC监测仪', 
      remark: '智能灌溉储水池与水肥配方池原水水质闭环检测与电导补偿', 
      sort: 6, 
      creator: '管理员', 
      createTime: '2026-10-13 10:15:33' 
    },
    { 
      id: 'mod-07', 
      no: 7, 
      name: '第7路植物茎流叶片水分传感仪', 
      remark: '微米级茎秆微变与叶片蒸腾水势动态感知，指导精量灌溉决策', 
      sort: 7, 
      creator: '管理员', 
      createTime: '2026-10-12 15:40:20' 
    },
    { 
      id: 'mod-08', 
      no: 8, 
      name: '第8路大棚顶膜开合行程定位器', 
      remark: '双向霍尔脉冲限位编码，支持开度0-100%无级精细调控反馈', 
      sort: 8, 
      creator: '管理员', 
      createTime: '2026-10-11 14:25:50' 
    },
    { 
      id: 'mod-09', 
      no: 9, 
      name: '第9路负离子与臭氧灭菌监测模块', 
      remark: '绿色物理杀菌消毒与密闭空间空气洁净度实时遥测反馈', 
      sort: 9, 
      creator: '管理员', 
      createTime: '2026-10-10 18:02:15' 
    },
    { 
      id: 'mod-10', 
      no: 10, 
      name: '第10路有害气体与一氧化碳检测仪', 
      remark: '沼气池与密闭育苗室CO/CH4安全浓度预警，防范积聚风险', 
      sort: 10, 
      creator: '管理员', 
      createTime: '2026-10-09 08:30:00' 
    },
  ];

  const [modules, setModules] = useState<DeviceModuleItem[]>(initialModules);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [moduleFilterName, setModuleFilterName] = useState('');
  const [moduleFilterRemark, setModuleFilterRemark] = useState('');
  const [moduleFilterDate, setModuleFilterDate] = useState('');
  const [isModuleFilterExpanded, setIsModuleFilterExpanded] = useState(false);
  const [moduleExtraCreator, setModuleExtraCreator] = useState('全部');
  const [timeSortOrder, setTimeSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals for Device Module
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<DeviceModuleItem | null>(null);
  const [moduleFormData, setModuleFormData] = useState({ name: '', remark: '', sort: 1 });

  // Delete confirm modal for modules
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  // 2. ==================== 模块属性 (真实物联网传感器与控制属性数据集) ====================
  const initialPropertiesData: ModulePropertyItem[] = [
    { id: 'prop-1', no: 1, name: '环境空气温度', address: '0x0001', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 1 },
    { id: 'prop-2', no: 2, name: '空气相对湿度', address: '0x0002', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%RH', calcTransform: '%s*0.1', sort: 2 },
    { id: 'prop-3', no: 3, name: '露点温度', address: '0x0003', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 3 },
    { id: 'prop-4', no: 4, name: '二氧化碳浓度', address: '0x0004', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: 'ppm', calcTransform: '%s', sort: 4 },
    { id: 'prop-5', no: 5, name: '光合有效辐射(PAR)', address: '0x0005', registerSize: 2, propType: '只读', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'μmol/m²·s', calcTransform: '%s', sort: 5 },
    { id: 'prop-6', no: 6, name: '土壤体积含水量', address: '0x0007', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%', calcTransform: '%s*0.1', sort: 6 },
    { id: 'prop-7', no: 7, name: '土壤电导率(EC)', address: '0x0008', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: 'uS/cm', calcTransform: '%s', sort: 7 },
    { id: 'prop-8', no: 8, name: '主管道水流压力', address: '0x0009', registerSize: 2, propType: '只读', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'kPa', calcTransform: '%s*0.01', sort: 8 },
    { id: 'prop-9', no: 9, name: '温度超限告警上限', address: '0x0020', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 9 },
    { id: 'prop-10', no: 10, name: '温度超限告警下限', address: '0x0021', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 10 },
    { id: 'prop-11', no: 11, name: '湿度超限告警上限', address: '0x0022', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%RH', calcTransform: '%s*0.1', sort: 11 },
    { id: 'prop-12', no: 12, name: '数据采集上报周期', address: '0x0030', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位无符号', unit: 's', calcTransform: '%s', sort: 12 },
    { id: 'prop-13', no: 13, name: '传感器运行健康状态', address: '0x0040', registerSize: 1, propType: '只读', displayForm: '枚举状态', parseMethod: 'HEX', unit: '', calcTransform: '%s', sort: 13 },
    { id: 'prop-14', no: 14, name: '主供电电池电压', address: '0x0050', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: 'V', calcTransform: '%s*0.01', sort: 14 }
  ];

  // 行业标准测点预设库
  const PROPERTY_PRESETS: Record<string, { label: string; props: ModulePropertyItem[] }> = {
    standard: {
      label: '通用物联网综合测点库',
      props: initialPropertiesData
    },
    climate: {
      label: '大棚温湿度与微气候测点库',
      props: [
        { id: 'cp-1', no: 1, name: '环境空气温度', address: '0x0001', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 1 },
        { id: 'cp-2', no: 2, name: '空气相对湿度', address: '0x0002', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%RH', calcTransform: '%s*0.1', sort: 2 },
        { id: 'cp-3', no: 3, name: '露点温度', address: '0x0003', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 3 },
        { id: 'cp-4', no: 4, name: '饱和水汽压差(VPD)', address: '0x0004', registerSize: 2, propType: '只读', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'kPa', calcTransform: '%s*0.01', sort: 4 },
        { id: 'cp-5', no: 5, name: '高温排风联动阈值', address: '0x0010', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 5 },
        { id: 'cp-6', no: 6, name: '高湿降湿联动阈值', address: '0x0011', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%RH', calcTransform: '%s*0.1', sort: 6 },
        { id: 'cp-7', no: 7, name: '采集上报周期', address: '0x0020', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位无符号', unit: 's', calcTransform: '%s', sort: 7 },
        { id: 'cp-8', no: 8, name: '温湿度探头通讯状态', address: '0x0030', registerSize: 1, propType: '只读', displayForm: '枚举状态', parseMethod: 'HEX', unit: '', calcTransform: '%s', sort: 8 }
      ]
    },
    soil: {
      label: '多深度土壤水肥墒情测点库',
      props: [
        { id: 'sp-1', no: 1, name: '浅层(10cm)土壤水分', address: '0x0001', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%', calcTransform: '%s*0.1', sort: 1 },
        { id: 'sp-2', no: 2, name: '浅层(10cm)土壤温度', address: '0x0002', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 2 },
        { id: 'sp-3', no: 3, name: '中层(20cm)土壤水分', address: '0x0003', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%', calcTransform: '%s*0.1', sort: 3 },
        { id: 'sp-4', no: 4, name: '中层(20cm)土壤温度', address: '0x0004', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 4 },
        { id: 'sp-5', no: 5, name: '深层(40cm)土壤水分', address: '0x0005', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%', calcTransform: '%s*0.1', sort: 5 },
        { id: 'sp-6', no: 6, name: '土壤电导率(EC值)', address: '0x0006', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: 'uS/cm', calcTransform: '%s', sort: 6 },
        { id: 'sp-7', no: 7, name: '土壤盐分折算总量', address: '0x0007', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: 'mg/L', calcTransform: '%s', sort: 7 },
        { id: 'sp-8', no: 8, name: '干旱灌溉触发下限', address: '0x0015', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%', calcTransform: '%s*0.1', sort: 8 }
      ]
    },
    pipe: {
      label: '水肥一体管网水流水压测点库',
      props: [
        { id: 'pp-1', no: 1, name: '主管道瞬时水压', address: '0x0001', registerSize: 2, propType: '只读', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'kPa', calcTransform: '%s*0.01', sort: 1 },
        { id: 'pp-2', no: 2, name: '主管道瞬时流速', address: '0x0003', registerSize: 2, propType: '只读', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'm³/h', calcTransform: '%s*0.1', sort: 2 },
        { id: 'pp-3', no: 3, name: '当日累计灌溉流量', address: '0x0005', registerSize: 2, propType: '只读', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'm³', calcTransform: '%s', sort: 3 },
        { id: 'pp-4', no: 4, name: '管道介质水体温度', address: '0x0007', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位有符号', unit: '℃', calcTransform: '%s*0.1', sort: 4 },
        { id: 'pp-5', no: 5, name: '管网超压停泵警戒线', address: '0x0010', registerSize: 2, propType: '读写', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'kPa', calcTransform: '%s*0.01', sort: 5 },
        { id: 'pp-6', no: 6, name: '管网失压泄漏报警线', address: '0x0012', registerSize: 2, propType: '读写', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'kPa', calcTransform: '%s*0.01', sort: 6 }
      ]
    },
    gas: {
      label: '气体环境与安全监测测点库',
      props: [
        { id: 'gp-1', no: 1, name: '二氧化碳实时浓度', address: '0x0001', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: 'ppm', calcTransform: '%s', sort: 1 },
        { id: 'gp-2', no: 2, name: '甲烷/可燃气体浓度', address: '0x0002', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: '%LEL', calcTransform: '%s*0.1', sort: 2 },
        { id: 'gp-3', no: 3, name: '一氧化碳有害气体', address: '0x0003', registerSize: 1, propType: '只读', displayForm: '数值显示', parseMethod: '16位无符号', unit: 'ppm', calcTransform: '%s', sort: 3 },
        { id: 'gp-4', no: 4, name: '臭氧浓度实时遥测', address: '0x0004', registerSize: 2, propType: '只读', displayForm: '数值显示', parseMethod: 'IEEE754', unit: 'mg/m³', calcTransform: '%s*0.01', sort: 4 },
        { id: 'gp-5', no: 5, name: '高浓度声光报警阈值', address: '0x0010', registerSize: 1, propType: '读写', displayForm: '数值显示', parseMethod: '16位无符号', unit: 'ppm', calcTransform: '%s', sort: 5 }
      ]
    }
  };

  const getDomainProperties = (name: string): ModulePropertyItem[] => {
    if (name.includes('土壤') || name.includes('墒情')) {
      return PROPERTY_PRESETS.soil.props;
    }
    if (name.includes('水流') || name.includes('水压') || name.includes('管网')) {
      return PROPERTY_PRESETS.pipe.props;
    }
    if (name.includes('二氧化碳') || name.includes('CO2') || name.includes('气体') || name.includes('甲烷') || name.includes('臭氧')) {
      return PROPERTY_PRESETS.gas.props;
    }
    if (name.includes('温湿度') || name.includes('气候')) {
      return PROPERTY_PRESETS.climate.props;
    }
    return PROPERTY_PRESETS.standard.props;
  };

  const [propSettingsModalOpen, setPropSettingsModalOpen] = useState(false);
  const [currentPropModule, setCurrentPropModule] = useState<DeviceModuleItem | null>(null);
  const [modulePropertyList, setModulePropertyList] = useState<ModulePropertyItem[]>(initialPropertiesData);
  const [selectedPropIds, setSelectedPropIds] = useState<string[]>([]);
  
  // Property filters inside the modal
  const [propFilterName, setPropFilterName] = useState('全部');
  const [propFilterAddress, setPropFilterAddress] = useState('全部');
  const [propFilterType, setPropFilterType] = useState('全部');

  // Display Format Setting Submodal (展现形式设置)
  const [displayFormModalOpen, setDisplayFormModalOpen] = useState(false);
  const [displayFormProp, setDisplayFormProp] = useState<ModulePropertyItem | null>(null);
  const [displayFormConfig, setDisplayFormConfig] = useState({
    formatType: '数值显示',
    decimalPlaces: 2,
    gaugeMin: 0,
    gaugeMax: 100,
    warningThreshold: 75,
    dangerThreshold: 90,
    colorScheme: '标准蓝绿'
  });

  // 3. ==================== 设备类型 State & Mock Data (使用真实工业物联网设备图，按近期时间降序排) ====================
  // Image preview lightbox state
  const [previewImageItem, setPreviewImageItem] = useState<DeviceTypeItem | null>(null);

  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeItem[]>(DEVICE_TYPES);
  // 类型总数、启用数、关联设备总数与各分类/上级类型计数全部由清单算出
  const deviceTypeStats = useMemo(() => summarizeDeviceTypes(deviceTypes), [deviceTypes]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);
  const [typeFilterName, setTypeFilterName] = useState('');
  const [typeFilterRemark, setTypeFilterRemark] = useState('');
  const [typeFilterDate, setTypeFilterDate] = useState('');
  const [typeFilterCategory, setTypeFilterCategory] = useState('全部');
  const [typeFilterParent, setTypeFilterParent] = useState('全部');
  const [typeFilterCreator, setTypeFilterCreator] = useState('全部');
  const [isTypeFilterExpanded, setIsTypeFilterExpanded] = useState(false);
  const [typeTimeSortOrder, setTypeTimeSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals for Device Types
  const [deviceTypeModalOpen, setDeviceTypeModalOpen] = useState(false);
  const [editingDeviceType, setEditingDeviceType] = useState<DeviceTypeItem | null>(null);
  const [deviceTypeFormData, setDeviceTypeFormData] = useState({
    name: '',
    code: '',
    image: '',
    category: '环境监测',
    parentType: '大棚微气候监控系统',
    version: 'V2.1.0',
    remark: '',
    updater: '管理员',
    protocol: 'Modbus-RTU',
    model: '',
    moduleName: '第1路高精度温湿度传感器',
    status: '启用' as '启用' | '停用'
  });

  // Delete confirm modal for device types
  const [deleteTypeConfirmOpen, setDeleteTypeConfirmOpen] = useState(false);
  const [deleteTypeTargetIds, setDeleteTypeTargetIds] = useState<string[]>([]);

  // 4. ==================== 设备类型更新日志 State & Mock Data (10 items matching screenshot, sorted descending by recent date) ====================
  const initialLogs: DeviceTypeLogItem[] = [
    { id: 'log-1', serialNo: 'LOG-20261015-1500', projectName: '阳光玫瑰园', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.108', logTime: '2026-10-15 15:00:28' },
    { id: 'log-2', serialNo: 'LOG-20261015-1320', projectName: '大地农场', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.108', logTime: '2026-10-15 13:20:15' },
    { id: 'log-3', serialNo: 'LOG-20261014-1840', projectName: '圣代草莓园', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.115', logTime: '2026-10-14 18:40:10' },
    { id: 'log-4', serialNo: 'LOG-20261014-1415', projectName: '圣代草莓园2', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.115', logTime: '2026-10-14 14:15:00' },
    { id: 'log-5', serialNo: 'LOG-20261013-1620', projectName: '飞天农场', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.120', logTime: '2026-10-13 16:20:30' },
    { id: 'log-6', serialNo: 'LOG-20261013-1005', projectName: '飞飞农场', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.120', logTime: '2026-10-13 10:05:12' },
    { id: 'log-7', serialNo: 'LOG-20261012-1550', projectName: '天山农场', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.128', logTime: '2026-10-12 15:50:40' },
    { id: 'log-8', serialNo: 'LOG-20261011-1410', projectName: '时代农场', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.135', logTime: '2026-10-11 14:10:22' },
    { id: 'log-9', serialNo: 'LOG-20261010-1125', projectName: '青山农场', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.140', logTime: '2026-10-10 11:25:00' },
    { id: 'log-10', serialNo: 'LOG-20261009-0912', projectName: '肥大牧场', target: '物联网灌溉控制器', changeType: '参数调优', summary: '统一修改定时灌溉的寄存器大小', versionChange: 'V2.1.0 → V2.1.2', operator: '管理员', ip: '192.168.1.145', logTime: '2026-10-09 09:12:00' }
  ];
  const [logs, setLogs] = useState<DeviceTypeLogItem[]>(initialLogs);
  const [logFilterName, setLogFilterName] = useState('');
  const [logFilterOption, setLogFilterOption] = useState('全部');
  const [logFilterDate, setLogFilterDate] = useState('');
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [isLogFilterExpanded, setIsLogFilterExpanded] = useState(false);
  const [logFilterType, setLogFilterType] = useState('全部');
  const [logDetailItem, setLogDetailItem] = useState<DeviceTypeLogItem | null>(null);

  // 5. ==================== Filter & Sort Logic for 设备模块 ====================
  // 按近期时间降序排 (Creation time descending)
  const filteredModules = useMemo(() => {
    return modules
      .filter(m => {
        const matchName = moduleFilterName.trim() === '' || m.name.includes(moduleFilterName.trim());
        const matchRemark = moduleFilterRemark.trim() === '' || m.remark.includes(moduleFilterRemark.trim());
        const matchDate = moduleFilterDate.trim() === '' || m.createTime.includes(moduleFilterDate.trim());
        const matchCreator = moduleExtraCreator === '全部' || m.creator === moduleExtraCreator;
        return matchName && matchRemark && matchDate && matchCreator;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createTime).getTime();
        const timeB = new Date(b.createTime).getTime();
        return timeSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [modules, moduleFilterName, moduleFilterRemark, moduleFilterDate, moduleExtraCreator, timeSortOrder]);

  // Checkbox handlers for modules
  const isAllSelected = filteredModules.length > 0 && selectedModuleIds.length === filteredModules.length;
  const isIndeterminate = selectedModuleIds.length > 0 && selectedModuleIds.length < filteredModules.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedModuleIds([]);
    } else {
      setSelectedModuleIds(filteredModules.map(m => m.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedModuleIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Module edit/create
  const handleOpenCreateModule = () => {
    setEditingModule(null);
    setModuleFormData({
      name: `第${modules.length + 1}路智慧物联监测模块`,
      remark: '新增扩展传感器监测通道属性',
      sort: modules.length + 1
    });
    setModuleModalOpen(true);
  };

  const handleOpenEditModule = (item: DeviceModuleItem) => {
    setEditingModule(item);
    setModuleFormData({
      name: item.name,
      remark: item.remark,
      sort: item.sort
    });
    setModuleModalOpen(true);
  };

  const handleSaveModule = () => {
    if (!moduleFormData.name.trim()) {
      showToast('请输入模块名称', 'info');
      return;
    }

    if (editingModule) {
      setModules(prev => prev.map(m => m.id === editingModule.id ? {
        ...m,
        name: moduleFormData.name,
        remark: moduleFormData.remark,
        sort: Number(moduleFormData.sort) || 1
      } : m));
      showToast(`已成功修改模块「${moduleFormData.name}」`, 'success');
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const newModule: DeviceModuleItem = {
        id: `mod-${Date.now()}`,
        no: modules.length + 1,
        name: moduleFormData.name,
        remark: moduleFormData.remark,
        sort: Number(moduleFormData.sort) || modules.length + 1,
        creator: '管理员',
        createTime: timeStr
      };
      setModules(prev => [newModule, ...prev]);
      showToast(`已成功新建模块「${moduleFormData.name}」`, 'success');
    }
    setModuleModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setModules(prev => prev.filter(m => !deleteTargetIds.includes(m.id)));
    setSelectedModuleIds(prev => prev.filter(id => !deleteTargetIds.includes(id)));
    setDeleteConfirmOpen(false);
    showToast(`成功删除 ${deleteTargetIds.length} 个设备模块！`, 'success');
    setDeleteTargetIds([]);
  };

  // 5.1 ==================== Filter & Sort Logic for 设备类型 (按近期时间降序排) ====================
  const filteredDeviceTypes = useMemo(() => {
    return deviceTypes
      .filter(dt => {
        const matchName = !typeFilterName.trim() || dt.name.includes(typeFilterName.trim()) || dt.code.includes(typeFilterName.trim());
        const matchRemark = !typeFilterRemark.trim() || dt.remark.includes(typeFilterRemark.trim());
        const matchDate = !typeFilterDate.trim() || dt.createTime.includes(typeFilterDate.trim()) || (dt.updateTime && dt.updateTime.includes(typeFilterDate.trim()));
        const matchCategory = typeFilterCategory === '全部' || dt.category === typeFilterCategory;
        const matchParent = typeFilterParent === '全部' || dt.parentType === typeFilterParent;
        const matchCreator = typeFilterCreator === '全部' || dt.creator === typeFilterCreator;
        return matchName && matchRemark && matchDate && matchCategory && matchParent && matchCreator;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createTime).getTime();
        const timeB = new Date(b.createTime).getTime();
        return typeTimeSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [deviceTypes, typeFilterName, typeFilterRemark, typeFilterDate, typeFilterCategory, typeFilterParent, typeFilterCreator, typeTimeSortOrder]);

  // Checkbox handlers for device types
  const isAllTypesSelected = filteredDeviceTypes.length > 0 && selectedTypeIds.length === filteredDeviceTypes.length;
  const isIndeterminateTypes = selectedTypeIds.length > 0 && selectedTypeIds.length < filteredDeviceTypes.length;

  const handleSelectAllTypes = () => {
    if (isAllTypesSelected) {
      setSelectedTypeIds([]);
    } else {
      setSelectedTypeIds(filteredDeviceTypes.map(dt => dt.id));
    }
  };

  const handleSelectOneType = (id: string) => {
    setSelectedTypeIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenCreateDeviceType = () => {
    setEditingDeviceType(null);
    setDeviceTypeFormData({
      name: `第${deviceTypes.length + 1}路智能测控装置`,
      code: `DEV-NEW-${String(deviceTypes.length + 1).padStart(2, '0')}`,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80',
      category: '环境监测',
      parentType: '大棚微气候监控系统',
      version: 'V2.1.0',
      remark: '新增物联网智能感知与自动调控设备类型',
      updater: '管理员',
      protocol: 'Modbus-RTU',
      model: 'RS485-IOT-X',
      moduleName: '第1路高精度温湿度传感器',
      status: '启用'
    });
    setDeviceTypeModalOpen(true);
  };

  const handleOpenEditDeviceType = (dt: DeviceTypeItem) => {
    setEditingDeviceType(dt);
    setDeviceTypeFormData({
      name: dt.name,
      code: dt.code,
      image: dt.image || '',
      category: dt.category || '环境监测',
      parentType: dt.parentType || '无 (顶级类型)',
      version: dt.version || 'V2.0.0',
      remark: dt.remark || '',
      updater: '管理员',
      protocol: dt.protocol || 'Modbus-RTU',
      model: dt.model || '',
      moduleName: dt.moduleName || '第1路高精度温湿度传感器',
      status: dt.status || '启用'
    });
    setDeviceTypeModalOpen(true);
  };

  const handleSaveDeviceType = () => {
    if (!deviceTypeFormData.name.trim()) {
      showToast('请输入设备类型名称', 'info');
      return;
    }
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    if (editingDeviceType) {
      setDeviceTypes(prev => prev.map(dt => dt.id === editingDeviceType.id ? {
        ...dt,
        name: deviceTypeFormData.name,
        code: deviceTypeFormData.code,
        image: deviceTypeFormData.image,
        category: deviceTypeFormData.category,
        parentType: deviceTypeFormData.parentType,
        version: deviceTypeFormData.version,
        remark: deviceTypeFormData.remark,
        protocol: deviceTypeFormData.protocol,
        model: deviceTypeFormData.model,
        moduleName: deviceTypeFormData.moduleName,
        status: deviceTypeFormData.status,
        updater: deviceTypeFormData.updater || '管理员',
        updateTime: timeStr
      } : dt));
      showToast(`已成功修改设备类型「${deviceTypeFormData.name}」`, 'success');
    } else {
      const newDt: DeviceTypeItem = {
        id: `dt-${Date.now()}`,
        no: deviceTypes.length + 1,
        name: deviceTypeFormData.name,
        code: deviceTypeFormData.code,
        image: deviceTypeFormData.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80',
        category: deviceTypeFormData.category,
        parentType: deviceTypeFormData.parentType,
        version: deviceTypeFormData.version,
        remark: deviceTypeFormData.remark,
        creator: '管理员',
        createTime: timeStr,
        updater: deviceTypeFormData.updater || '管理员',
        updateTime: timeStr,
        protocol: deviceTypeFormData.protocol,
        model: deviceTypeFormData.model,
        moduleName: deviceTypeFormData.moduleName,
        deviceCount: 0,
        status: deviceTypeFormData.status
      };
      setDeviceTypes(prev => [newDt, ...prev]);
      showToast(`已成功新建设备类型「${deviceTypeFormData.name}」`, 'success');
    }
    setDeviceTypeModalOpen(false);
  };

  const handleConfirmDeleteTypes = () => {
    setDeviceTypes(prev => prev.filter(dt => !deleteTypeTargetIds.includes(dt.id)));
    setSelectedTypeIds(prev => prev.filter(id => !deleteTypeTargetIds.includes(id)));
    setDeleteTypeConfirmOpen(false);
    showToast(`成功删除 ${deleteTypeTargetIds.length} 个设备类型！`, 'success');
    setDeleteTypeTargetIds([]);
  };

  const handleOpenTypePropSettings = (dt: DeviceTypeItem) => {
    setCurrentPropModule({
      id: dt.id,
      no: dt.no || 1,
      name: dt.name,
      remark: dt.remark,
      sort: 1,
      creator: dt.creator,
      createTime: dt.createTime
    });
    setModulePropertyList(getDomainProperties(dt.name));
    setSelectedPropIds([]);
    setPropFilterName('全部');
    setPropFilterAddress('全部');
    setPropFilterType('全部');
    setPropSettingsModalOpen(true);
  };

  // 6. ==================== 属性设置 Handlers ====================
  const handleOpenPropSettings = (mod: DeviceModuleItem) => {
    setCurrentPropModule(mod);
    setModulePropertyList(getDomainProperties(mod.name));
    setSelectedPropIds([]);
    setPropFilterName('全部');
    setPropFilterAddress('全部');
    setPropFilterType('全部');
    setPropSettingsModalOpen(true);
  };

  // Add new property in the table
  const handleAddNewPropertyRow = () => {
    const nextNo = modulePropertyList.length + 1;
    const names = [
      '环境空气温度', '空气相对湿度', '二氧化碳浓度', '光合有效辐射', 
      '土壤体积含水率', '土壤电导率EC', '主管道水流压力', '设备运行状态', 
      '高限告警阈值', '低限告警阈值', '数据采集上报周期', '供电电池电压',
      '无线信号强度RSSI', '故障自检代码', '累计运行工作时长'
    ];
    const assignedName = names[(nextNo - 1) % names.length] || `自定义遥测指标${nextNo}`;
    const hexAddr = `0x00${(nextNo).toString(16).padStart(2, '0').toUpperCase()}`;
    const newProp: ModulePropertyItem = {
      id: `prop-${Date.now()}`,
      no: nextNo,
      name: assignedName,
      address: hexAddr,
      registerSize: 1,
      propType: '只读',
      displayForm: '数值显示',
      parseMethod: '16位无符号',
      unit: assignedName.includes('温度') ? '℃' : assignedName.includes('湿度') ? '%RH' : assignedName.includes('压力') ? 'kPa' : '',
      calcTransform: assignedName.includes('温度') || assignedName.includes('湿度') ? '%s*0.1' : '%s',
      sort: nextNo
    };
    setModulePropertyList(prev => [...prev, newProp]);
    showToast(`已新增第 ${nextNo} 项属性测点「${assignedName}」(${hexAddr})`, 'success');
  };

  // Batch delete properties
  const handleBatchDeleteProperties = () => {
    if (selectedPropIds.length === 0) {
      showToast('请先勾选需要批量删除的属性项', 'info');
      return;
    }
    setModulePropertyList(prev => prev.filter(p => !selectedPropIds.includes(p.id)));
    showToast(`已批量删除选中的 ${selectedPropIds.length} 项属性`, 'success');
    setSelectedPropIds([]);
  };

  // Delete single property
  const handleDeleteSingleProperty = (propId: string, propName: string) => {
    setModulePropertyList(prev => prev.filter(p => p.id !== propId));
    setSelectedPropIds(prev => prev.filter(id => id !== propId));
    showToast(`已删除属性「${propName}」`, 'info');
  };

  // Open 展现形式设置
  const handleOpenDisplayFormModal = (prop: ModulePropertyItem) => {
    setDisplayFormProp(prop);
    setDisplayFormConfig({
      formatType: prop.displayForm,
      decimalPlaces: 2,
      gaugeMin: 0,
      gaugeMax: 100,
      warningThreshold: 75,
      dangerThreshold: 90,
      colorScheme: '标准蓝绿'
    });
    setDisplayFormModalOpen(true);
  };

  const handleSaveDisplayFormConfig = () => {
    if (displayFormProp) {
      setModulePropertyList(prev => prev.map(p => p.id === displayFormProp.id ? {
        ...p,
        displayForm: displayFormConfig.formatType as any
      } : p));
      showToast(`已成功保存「${displayFormProp.name}」展现形式配置`, 'success');
    }
    setDisplayFormModalOpen(false);
  };

  // Filtered properties inside the modal
  const filteredProperties = useMemo(() => {
    return modulePropertyList.filter(p => {
      const matchName = propFilterName === '全部' || p.name.includes(propFilterName);
      const matchAddress = propFilterAddress === '全部' || p.address === propFilterAddress;
      const matchType = propFilterType === '全部' || p.propType === propFilterType;
      return matchName && matchAddress && matchType;
    });
  }, [modulePropertyList, propFilterName, propFilterAddress, propFilterType]);

  return (
    <div className="space-y-4">
      {/* =========================================================================
          TAB 1: 设备模块 (设备模块列表重新生成，创建时间按近期时间降序排)
      ========================================================================= */}
      {subTab === 'device-module' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Top Search Card (Matching Screenshot Form) */}
          <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-y-3">
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700">
                {/* 模块名称 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">模块名称:</span>
                  <input 
                    type="text" 
                    value={moduleFilterName}
                    onChange={(e) => setModuleFilterName(e.target.value)}
                    placeholder=""
                    className="w-48 h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none focus:border-[#1890ff] transition-colors"
                  />
                </div>

                {/* 备注 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">备注:</span>
                  <input 
                    type="text" 
                    value={moduleFilterRemark}
                    onChange={(e) => setModuleFilterRemark(e.target.value)}
                    placeholder=""
                    className="w-56 h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none focus:border-[#1890ff] transition-colors"
                  />
                </div>

                {/* 日期 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">日期:</span>
                  <div className="relative flex items-center">
                    <Calendar size={13} className="text-slate-400 absolute left-2.5 pointer-events-none" />
                    <input 
                      type="text" 
                      value={moduleFilterDate}
                      onChange={(e) => setModuleFilterDate(e.target.value)}
                      placeholder="请选择日期范围" 
                      className="w-48 h-8 pl-8 pr-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-[#1890ff] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: 重置, 查询, 展开 ∨ */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setModuleFilterName('');
                    setModuleFilterRemark('');
                    setModuleFilterDate('');
                    setModuleExtraCreator('全部');
                  }}
                  className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs transition-colors cursor-pointer"
                >
                  重置
                </button>
                <button
                  onClick={() => {
                    showToast(`已筛选出 ${filteredModules.length} 条设备模块数据`, 'info');
                  }}
                  className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-normal transition-colors cursor-pointer shadow-2xs"
                >
                  查询
                </button>
                <button
                  onClick={() => setIsModuleFilterExpanded(!isModuleFilterExpanded)}
                  className="text-xs text-[#1890ff] hover:text-blue-600 flex items-center gap-1 cursor-pointer select-none"
                >
                  <span>{isModuleFilterExpanded ? '收起' : '展开'}</span>
                  {isModuleFilterExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </div>
            </div>

            {/* Expanded Additional Filters */}
            {isModuleFilterExpanded && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-600 animate-in fade-in duration-100">
                <div className="flex items-center gap-2">
                  <span>创建人:</span>
                  <select 
                    value={moduleExtraCreator} 
                    onChange={(e) => setModuleExtraCreator(e.target.value)}
                    className="h-7 px-2 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer"
                  >
                    <option value="全部">全部创建人</option>
                    <option value="管理员">管理员</option>
                    <option value="系统内置">系统内置</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>创建时间排序:</span>
                  <button 
                    onClick={() => setTimeSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="h-7 px-2.5 border border-slate-300 rounded text-xs text-slate-700 hover:text-blue-600 flex items-center gap-1 bg-white cursor-pointer"
                  >
                    <ArrowUpDown size={12} />
                    <span>{timeSortOrder === 'desc' ? '近期时间降序 (最新在前)' : '时间升序'}</span>
                  </button>
                </div>
                <span className="text-slate-400 text-[11px]">共检索到 {filteredModules.length} 个现代化传感器模组</span>
              </div>
            )}
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs space-y-3">
            {/* Toolbar above Table: [新建] [批量删除] ... [Refresh] [Density] [Settings] */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenCreateModule}
                  className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-normal transition-colors cursor-pointer shadow-2xs"
                >
                  新建
                </button>
                <button
                  onClick={() => {
                    if (selectedModuleIds.length === 0) {
                      showToast('请先勾选需要批量删除的模块', 'info');
                      return;
                    }
                    setDeleteTargetIds(selectedModuleIds);
                    setDeleteConfirmOpen(true);
                  }}
                  disabled={selectedModuleIds.length === 0}
                  className={`px-3.5 py-1.5 rounded text-xs font-normal transition-colors ${
                    selectedModuleIds.length > 0 
                      ? 'bg-[#ff4d4f] hover:bg-red-600 text-white cursor-pointer shadow-2xs' 
                      : 'bg-red-300 text-white cursor-not-allowed opacity-60'
                  }`}
                >
                  批量删除 {selectedModuleIds.length > 0 ? `(${selectedModuleIds.length})` : ''}
                </button>
              </div>

              {/* Right Toolbar Icons */}
              <div className="flex items-center gap-1.5 text-slate-500">
                <button 
                  onClick={() => {
                    setModules([...initialModules]);
                    setSelectedModuleIds([]);
                    setTimeSortOrder('desc');
                    showToast('已重置并按近期时间降序加载设备模块', 'success');
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" 
                  title="刷新数据"
                >
                  <RefreshCw size={14} />
                </button>
                <button 
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" 
                  title="密度与列展示"
                >
                  <SlidersHorizontal size={14} />
                </button>
                <button 
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" 
                  title="列表设置"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-100 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] text-slate-700 font-medium border-b border-slate-200">
                    <th className="py-3 px-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3 w-16 text-center text-slate-600">序号</th>
                    <th className="py-3 px-4 text-slate-800 font-medium whitespace-nowrap">
                      <span>模块名称</span>
                    </th>
                    <th className="py-3 px-4 text-slate-800 font-medium">备注</th>
                    <th className="py-3 px-4 text-center text-slate-800 font-medium w-24">排序值</th>
                    <th className="py-3 px-4 text-slate-800 font-medium w-24">创建人</th>
                    <th className="py-3 px-4 text-slate-800 font-medium w-44">
                      <div 
                        className="flex items-center gap-1.5 cursor-pointer hover:text-[#1890ff]"
                        onClick={() => setTimeSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        title="点击切换创建时间升序/降序"
                      >
                        <span>创建时间</span>
                        <ArrowUpDown size={11} className={timeSortOrder === 'desc' ? 'text-[#1890ff]' : 'text-slate-400'} />
                        <span className="text-[10px] text-blue-500 font-normal">({timeSortOrder === 'desc' ? '降序' : '升序'})</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 text-center text-slate-800 font-medium w-48">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredModules.map((item, index) => {
                    const isChecked = selectedModuleIds.includes(item.id);
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-[#fcfdfe] transition-colors ${isChecked ? 'bg-blue-50/40' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => handleSelectOne(item.id)}
                            className="rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* 序号 */}
                        <td className="py-3 px-3 text-center text-slate-600 font-mono text-xs">
                          {index + 1}
                        </td>

                        {/* 模块名称 */}
                        <td className="py-3 px-4 font-normal text-slate-800 whitespace-nowrap">
                          {item.name}
                        </td>

                        {/* 备注 */}
                        <td className="py-3 px-4 text-slate-600 max-w-md truncate" title={item.remark}>
                          {item.remark}
                        </td>

                        {/* 排序值 */}
                        <td className="py-3 px-4 text-center text-slate-700 font-mono">
                          {item.sort}
                        </td>

                        {/* 创建人 */}
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                          {item.creator}
                        </td>

                        {/* 创建时间 - 严格按近期时间降序排 */}
                        <td className="py-3 px-4 text-slate-700 font-mono whitespace-nowrap">
                          <span className="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded text-[11px] text-slate-600 font-medium">
                            {item.createTime}
                          </span>
                        </td>

                        {/* 操作: [编辑] [删除] [属性设置] */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditModule(item)}
                              className="px-2.5 py-0.5 border border-[#91d5ff] bg-white hover:bg-blue-50 text-[#1890ff] rounded text-[11px] transition-colors cursor-pointer"
                            >
                              编辑
                            </button>

                            <button
                              onClick={() => {
                                setDeleteTargetIds([item.id]);
                                setDeleteConfirmOpen(true);
                              }}
                              className="px-2.5 py-0.5 border border-[#ffa39e] bg-white hover:bg-red-50 text-[#ff4d4f] rounded text-[11px] transition-colors cursor-pointer"
                            >
                              删除
                            </button>

                            {/* 属性设置 button -> Opens 模块属性 modal */}
                            <button
                              onClick={() => handleOpenPropSettings(item)}
                              className="px-2.5 py-0.5 border border-[#ffd591] bg-white hover:bg-amber-50 text-[#fa8c16] rounded text-[11px] transition-colors cursor-pointer font-medium"
                            >
                              属性设置
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pt-3 flex items-center justify-end gap-2 text-xs text-slate-600 select-none">
              <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
                <ChevronLeft size={13} />
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-[#1890ff] bg-[#1890ff] text-white rounded font-medium shadow-2xs">
                1
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors cursor-pointer">
                2
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors cursor-pointer">
                3
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors cursor-pointer">
                4
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors cursor-pointer">
                5
              </button>
              <span className="px-1 text-slate-400">......</span>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors cursor-pointer">
                50
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
                <ChevronRight size={13} />
              </button>

              <div className="relative ml-2">
                <select className="h-7 pl-2 pr-6 border border-slate-200 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer">
                  <option value="10">10条/页</option>
                  <option value="20">20条/页</option>
                  <option value="50">50条/页</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: 设备类型 (按截图生成，创建时间按近期的降序排)
      ========================================================================= */}
      {subTab === 'device-type' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Top Search Card (Matching Screenshot Form) */}
          <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-y-3">
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700">
                {/* 设备类型名称 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">设备类型名称:</span>
                  <input 
                    type="text" 
                    value={typeFilterName}
                    onChange={(e) => setTypeFilterName(e.target.value)}
                    placeholder=""
                    className="w-48 h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none focus:border-[#1890ff] transition-colors"
                  />
                </div>

                {/* 类型分类 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">类型分类:</span>
                  <select 
                    value={typeFilterCategory}
                    onChange={(e) => setTypeFilterCategory(e.target.value)}
                    className="w-36 h-8 px-2 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-none focus:border-[#1890ff] cursor-pointer"
                  >
                    <option value="全部">全部类型分类</option>
                    {deviceTypeStats.categories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}（{c.count}）</option>
                    ))}
                  </select>
                </div>

                {/* 备注 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">备注:</span>
                  <input 
                    type="text" 
                    value={typeFilterRemark}
                    onChange={(e) => setTypeFilterRemark(e.target.value)}
                    placeholder=""
                    className="w-48 h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none focus:border-[#1890ff] transition-colors"
                  />
                </div>

                {/* 日期 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">日期:</span>
                  <div className="relative flex items-center">
                    <Calendar size={13} className="text-slate-400 absolute left-2.5 pointer-events-none" />
                    <input 
                      type="text" 
                      value={typeFilterDate}
                      onChange={(e) => setTypeFilterDate(e.target.value)}
                      placeholder="请选择日期范围" 
                      className="w-44 h-8 pl-8 pr-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-[#1890ff] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: 重置, 查询, 展开 ∨ */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setTypeFilterName('');
                    setTypeFilterRemark('');
                    setTypeFilterDate('');
                    setTypeFilterCategory('全部');
                    setTypeFilterParent('全部');
                    setTypeFilterCreator('全部');
                  }}
                  className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs transition-colors cursor-pointer"
                >
                  重置
                </button>
                <button
                  onClick={() => {
                    showToast(`已筛选出 ${filteredDeviceTypes.length} 条设备类型数据`, 'info');
                  }}
                  className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-normal transition-colors cursor-pointer shadow-2xs"
                >
                  查询
                </button>
                <button
                  onClick={() => setIsTypeFilterExpanded(!isTypeFilterExpanded)}
                  className="text-xs text-[#1890ff] hover:text-blue-600 flex items-center gap-1 cursor-pointer select-none"
                >
                  <span>{isTypeFilterExpanded ? '收起' : '展开'}</span>
                  {isTypeFilterExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </div>
            </div>

            {/* Expanded Additional Filters */}
            {isTypeFilterExpanded && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-600 animate-in fade-in duration-100">
                <div className="flex items-center gap-2">
                  <span>上级设备类型:</span>
                  <select 
                    value={typeFilterParent} 
                    onChange={(e) => setTypeFilterParent(e.target.value)}
                    className="h-7 px-2 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer"
                  >
                    <option value="全部">全部上级类型</option>
                    {deviceTypeStats.parentTypes.map((pt) => (
                      <option key={pt.name} value={pt.name}>{pt.name}（{pt.count}）</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>创建人:</span>
                  <select 
                    value={typeFilterCreator} 
                    onChange={(e) => setTypeFilterCreator(e.target.value)}
                    className="h-7 px-2 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer"
                  >
                    <option value="全部">全部创建人</option>
                    <option value="管理员">管理员</option>
                    <option value="系统内置">系统内置</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>创建时间排序:</span>
                  <button 
                    onClick={() => setTypeTimeSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="h-7 px-2.5 border border-slate-300 rounded text-xs text-slate-700 hover:text-blue-600 flex items-center gap-1 bg-white cursor-pointer"
                  >
                    <ArrowUpDown size={12} />
                    <span>{typeTimeSortOrder === 'desc' ? '近期时间降序 (最新在前)' : '时间升序'}</span>
                  </button>
                </div>
                <span className="text-slate-400 text-[11px]">共 {deviceTypeStats.total} 个设备类型 · 启用 {deviceTypeStats.enabled} 个 · 关联设备 {deviceTypeStats.totalDeviceCount} 台，当前筛选 {filteredDeviceTypes.length} 个</span>
              </div>
            )}
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs space-y-3">
            {/* Toolbar above Table: [新建] [批量删除] ... [Refresh] [Density] [Settings] */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenCreateDeviceType}
                  className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-normal transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>新建</span>
                </button>
                <button
                  onClick={() => {
                    if (selectedTypeIds.length === 0) {
                      showToast('请先勾选需要批量删除的设备类型', 'info');
                      return;
                    }
                    setDeleteTypeTargetIds(selectedTypeIds);
                    setDeleteTypeConfirmOpen(true);
                  }}
                  disabled={selectedTypeIds.length === 0}
                  className={`px-3.5 py-1.5 rounded text-xs font-normal transition-colors ${
                    selectedTypeIds.length > 0 
                      ? 'bg-[#ff4d4f] hover:bg-red-600 text-white cursor-pointer shadow-2xs' 
                      : 'bg-red-300 text-white cursor-not-allowed opacity-60'
                  }`}
                >
                  批量删除 {selectedTypeIds.length > 0 ? `(${selectedTypeIds.length})` : ''}
                </button>
              </div>

              {/* Right Toolbar Icons */}
              <div className="flex items-center gap-1.5 text-slate-500">
                <button 
                  onClick={() => {
                    setDeviceTypes([...DEVICE_TYPES]);
                    setSelectedTypeIds([]);
                    setTypeTimeSortOrder('desc');
                    showToast('已重置并按近期时间降序加载设备类型', 'success');
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" 
                  title="刷新数据"
                >
                  <RefreshCw size={14} />
                </button>
                <button 
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" 
                  title="密度与列展示"
                >
                  <SlidersHorizontal size={14} />
                </button>
                <button 
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" 
                  title="列表设置"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>

            {/* Table matching screenshot with image, category, updater, updateTime */}
            <div className="overflow-x-auto border border-slate-100 rounded">
              <table className="w-full text-left text-xs border-collapse min-w-[1300px]">
                <thead>
                  <tr className="bg-[#fafafa] text-slate-700 font-medium border-b border-slate-200">
                    <th className="py-3 px-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={isAllTypesSelected}
                        ref={el => { if (el) el.indeterminate = isIndeterminateTypes; }}
                        onChange={handleSelectAllTypes}
                        className="rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-2 w-12 text-center text-slate-600">序号</th>
                    <th className="py-3 px-3 text-center text-slate-800 font-medium w-16">设备图片</th>
                    <th className="py-3 px-4 text-slate-800 font-medium whitespace-nowrap">
                      <span>设备类型名称</span>
                    </th>
                    <th className="py-3 px-3 text-slate-800 font-medium w-32">类型编码</th>
                    <th className="py-3 px-3 text-center text-slate-800 font-medium w-24">类型分类</th>
                    <th className="py-3 px-3 text-slate-800 font-medium w-40">上级设备类型</th>
                    <th className="py-3 px-3 text-center text-slate-800 font-medium w-20">版本号</th>
                    <th className="py-3 px-4 text-slate-800 font-medium max-w-xs">备注说明</th>
                    <th className="py-3 px-3 text-slate-800 font-medium w-20">创建人</th>
                    <th className="py-3 px-3 text-slate-800 font-medium w-36">
                      <div 
                        className="flex items-center gap-1 cursor-pointer hover:text-[#1890ff]"
                        onClick={() => setTypeTimeSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        title="点击切换创建时间升序/降序"
                      >
                        <span>创建时间</span>
                        <ArrowUpDown size={11} className={typeTimeSortOrder === 'desc' ? 'text-[#1890ff]' : 'text-slate-400'} />
                      </div>
                    </th>
                    <th className="py-3 px-3 text-slate-800 font-medium w-24">更新人</th>
                    <th className="py-3 px-3 text-slate-800 font-medium w-36">更新时间</th>
                    <th className="py-3 px-4 text-center text-slate-800 font-medium w-48 sticky right-0 bg-[#fafafa]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeviceTypes.map((item, index) => {
                    const isChecked = selectedTypeIds.includes(item.id);
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-[#fcfdfe] transition-colors ${isChecked ? 'bg-blue-50/40' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => handleSelectOneType(item.id)}
                            className="rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* 序号 */}
                        <td className="py-3 px-2 text-center text-slate-600 font-mono text-xs">
                          {index + 1}
                        </td>

                        {/* 设备图片 (真实硬件设备图，支持点击大图预览) */}
                        <td className="py-2 px-3 text-center">
                          <div 
                            onClick={() => setPreviewImageItem(item)}
                            className="w-10 h-10 rounded-md bg-white border border-slate-200 overflow-hidden mx-auto flex items-center justify-center group relative shadow-2xs cursor-pointer hover:border-[#1890ff] hover:shadow-xs transition-all"
                            title="点击查看高清设备实物图与规格详情"
                          >
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-contain p-0.5 group-hover:scale-115 transition-transform duration-200" 
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Cpu size={18} className="text-slate-400" />
                            )}
                            <div className="absolute inset-0 bg-[#1890ff]/15 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye size={12} className="text-[#1890ff] drop-shadow-xs" />
                            </div>
                          </div>
                        </td>

                        {/* 设备类型名称 */}
                        <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                          {item.name}
                        </td>

                        {/* 类型编码 */}
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                          {item.code}
                        </td>

                        {/* 类型分类 */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                            item.category === '环境监测' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            item.category === '土壤墒情' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            item.category === '水利管网' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                            item.category === '气体分析' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            item.category === '农业气象' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                            item.category === '水肥水质' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                            item.category === '植物生理' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            item.category === '智能控制' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            item.category === '绿色植保' ? 'bg-lime-50 text-lime-700 border-lime-200' :
                            'bg-slate-50 text-slate-700 border-slate-200'
                          }`}>
                            {item.category || '环境监测'}
                          </span>
                        </td>

                        {/* 上级设备类型 */}
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-[#1890ff] border border-blue-100 text-[11px]">
                            {item.parentType}
                          </span>
                        </td>

                        {/* 版本号 */}
                        <td className="py-3 px-3 text-center font-mono text-slate-700 text-[11px]">
                          {item.version}
                        </td>

                        {/* 备注说明 */}
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={item.remark}>
                          {item.remark}
                        </td>

                        {/* 创建人 */}
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap text-[11px]">
                          {item.creator}
                        </td>

                        {/* 创建时间 - 严格按近期时间降序排 */}
                        <td className="py-3 px-3 text-slate-700 font-mono whitespace-nowrap">
                          <span className="bg-slate-50 border border-slate-200/80 px-1.5 py-0.5 rounded text-[11px] text-slate-600 font-medium">
                            {item.createTime}
                          </span>
                        </td>

                        {/* 更新人 */}
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap text-[11px]">
                          <span className="text-slate-800 font-medium">{item.updater || item.creator || '管理员'}</span>
                        </td>

                        {/* 更新时间 */}
                        <td className="py-3 px-3 text-slate-700 font-mono whitespace-nowrap">
                          <span className="bg-emerald-50/70 border border-emerald-200/70 px-1.5 py-0.5 rounded text-[11px] text-emerald-700 font-medium">
                            {item.updateTime || item.createTime}
                          </span>
                        </td>

                        {/* 操作: [编辑] [删除] [属性设置] */}
                        <td className="py-3 px-4 text-center whitespace-nowrap sticky right-0 bg-white">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditDeviceType(item)}
                              className="px-2 py-0.5 border border-[#91d5ff] bg-white hover:bg-blue-50 text-[#1890ff] rounded text-[11px] transition-colors cursor-pointer"
                            >
                              编辑
                            </button>

                            <button
                              onClick={() => {
                                setDeleteTypeTargetIds([item.id]);
                                setDeleteTypeConfirmOpen(true);
                              }}
                              className="px-2 py-0.5 border border-[#ffa39e] bg-white hover:bg-red-50 text-[#ff4d4f] rounded text-[11px] transition-colors cursor-pointer"
                            >
                              删除
                            </button>

                            <button
                              onClick={() => handleOpenTypePropSettings(item)}
                              className="px-2 py-0.5 border border-[#87e8de] bg-white hover:bg-teal-50 text-[#13c2c2] rounded text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                              title="配置设备类型绑定的模块传感器寄存器属性"
                            >
                              <Settings size={11} />
                              <span>属性设置</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Matching Screenshot 1:1) */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <div>
                共 <span className="font-medium text-slate-700">{filteredDeviceTypes.length}</span> 条
              </div>

              <div className="flex items-center gap-1 select-none">
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
                  <ChevronLeft size={13} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center border border-[#1890ff] bg-[#1890ff] text-white rounded font-medium cursor-pointer shadow-xs">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors cursor-pointer">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
                  <ChevronRight size={13} />
                </button>

                <div className="relative ml-2">
                  <select className="h-7 pl-2 pr-6 border border-slate-200 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer">
                    <option value="10">10条/页</option>
                    <option value="20">20条/页</option>
                    <option value="50">50条/页</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 ml-2 text-slate-500">
                  <span>跳至</span>
                  <input 
                    type="number" 
                    defaultValue={1} 
                    min={1} 
                    max={2} 
                    className="w-10 h-7 text-center border border-slate-200 rounded text-xs text-slate-700 outline-none focus:border-[#1890ff]"
                  />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: 设备类型更新日志 (Matching User Screenshot 1:1)
      ========================================================================= */}
      {subTab === 'device-type-log' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Search Filter Card (Matching Screenshot 1:1) */}
          <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
                {/* 名称 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">名称:</span>
                  <input 
                    type="text" 
                    placeholder="请输入关键字"
                    value={logFilterName}
                    onChange={(e) => setLogFilterName(e.target.value)}
                    className="w-44 h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-none focus:border-[#1890ff]"
                  />
                </div>

                {/* 选项 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">选项:</span>
                  <select 
                    value={logFilterOption}
                    onChange={(e) => setLogFilterOption(e.target.value)}
                    className="w-40 h-8 px-2 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-none focus:border-[#1890ff] cursor-pointer"
                  >
                    <option value="全部">请选择</option>
                    <option value="物联网灌溉控制器">物联网灌溉控制器</option>
                    <option value="温湿度传感器">温湿度传感器</option>
                    <option value="土壤墒情仪">土壤墒情仪</option>
                  </select>
                </div>

                {/* 日期范围 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-normal">日期:</span>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="请选择日期范围"
                      value={logFilterDate}
                      onChange={(e) => setLogFilterDate(e.target.value)}
                      className="w-44 h-8 pl-8 pr-2 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-none focus:border-[#1890ff]"
                    />
                    <Calendar size={13} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Action Buttons: 重置, 查询, 展开 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setLogFilterName('');
                    setLogFilterOption('全部');
                    setLogFilterDate('');
                    setLogFilterType('全部');
                    showToast('已重置筛选条件', 'info');
                  }}
                  className="px-3.5 h-8 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs transition-colors cursor-pointer"
                >
                  重置
                </button>
                <button
                  onClick={() => showToast('查询成功', 'success')}
                  className="px-3.5 h-8 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded text-xs transition-colors cursor-pointer shadow-2xs font-medium"
                >
                  查询
                </button>
                <button
                  onClick={() => setIsLogFilterExpanded(!isLogFilterExpanded)}
                  className="px-2.5 h-8 border border-slate-300 bg-white hover:bg-slate-50 text-[#1890ff] rounded text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>展开</span>
                  {isLogFilterExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
            </div>

            {/* Expanded Advanced Filters */}
            {isLogFilterExpanded && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <span>操作类型:</span>
                  <select 
                    value={logFilterType}
                    onChange={(e) => setLogFilterType(e.target.value)}
                    className="w-36 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-none focus:border-[#1890ff]"
                  >
                    <option value="全部">全部类型</option>
                    <option value="参数调优">参数调优</option>
                    <option value="属性扩展">属性扩展</option>
                    <option value="固件升级">固件升级</option>
                    <option value="初始注册">初始注册</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Table Card (Matching Screenshot 1:1) */}
          <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500 font-medium">
                设备类型更新日志记录 (共 <span className="text-[#1890ff] font-mono">{logs.length}</span> 条)
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer" title="刷新">
                  <RefreshCw size={13} />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer" title="列设置">
                  <SlidersHorizontal size={13} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] text-slate-700 font-medium border-b border-slate-200">
                    <th className="py-3 px-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedLogIds.length === logs.length && logs.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLogIds(logs.map(l => l.id));
                          } else {
                            setSelectedLogIds([]);
                          }
                        }}
                        className="rounded border-slate-300 cursor-pointer text-[#1890ff] focus:ring-0"
                      />
                    </th>
                    <th className="py-3 px-3 w-12 text-center text-slate-600">序号</th>
                    <th className="py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-[#1890ff]">
                      <div className="flex items-center gap-1">
                        <span>项目名称</span>
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4 font-medium text-slate-700">设备类型</th>
                    <th className="py-3 px-4 font-medium text-slate-700">更新说明</th>
                    <th className="py-3 px-3 font-medium text-slate-700 w-28">更新人</th>
                    <th className="py-3 px-4 font-medium text-slate-700 w-40">
                      <div className="flex items-center gap-1">
                        <span>创建时间</span>
                        <ArrowUpDown size={11} className="text-[#1890ff]" />
                      </div>
                    </th>
                    <th className="py-3 px-4 text-center font-medium w-24">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs
                    .filter(log => {
                      const matchName = logFilterName.trim() === '' || log.projectName.includes(logFilterName.trim()) || log.summary.includes(logFilterName.trim());
                      const matchOption = logFilterOption === '全部' || log.target === logFilterOption;
                      const matchType = logFilterType === '全部' || log.changeType === logFilterType;
                      return matchName && matchOption && matchType;
                    })
                    .sort((a, b) => new Date(b.logTime).getTime() - new Date(a.logTime).getTime())
                    .map((log, idx) => (
                      <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedLogIds.includes(log.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLogIds([...selectedLogIds, log.id]);
                              } else {
                                setSelectedLogIds(selectedLogIds.filter(id => id !== log.id));
                              }
                            }}
                            className="rounded border-slate-300 cursor-pointer text-[#1890ff] focus:ring-0"
                          />
                        </td>
                        <td className="py-3 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{log.projectName}</td>
                        <td className="py-3 px-4 font-medium text-slate-700">{log.target}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-md truncate" title={log.summary}>{log.summary}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{log.operator}</td>
                        <td className="py-3 px-4 font-mono text-slate-600 text-[11px] font-medium">
                          <span className="bg-slate-50 border border-slate-200/80 px-1.5 py-0.5 rounded">
                            {log.logTime}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setLogDetailItem(log)}
                            className="px-2.5 py-0.5 border border-[#91d5ff] bg-white hover:bg-blue-50 text-[#1890ff] rounded text-[11px] cursor-pointer"
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <div>
                共 <span className="font-medium text-slate-700">{logs.length}</span> 条
              </div>

              <div className="flex items-center gap-1 select-none">
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
                  <ChevronLeft size={13} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center border border-[#1890ff] bg-[#1890ff] text-white rounded font-medium cursor-pointer shadow-xs">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors cursor-pointer">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
                  <ChevronRight size={13} />
                </button>

                <div className="relative ml-2">
                  <select className="h-7 pl-2 pr-6 border border-slate-200 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer">
                    <option value="10">10条/页</option>
                    <option value="20">20条/页</option>
                    <option value="50">50条/页</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 ml-2 text-slate-500">
                  <span>跳至</span>
                  <input 
                    type="number" 
                    defaultValue={1} 
                    min={1} 
                    max={2} 
                    className="w-10 h-7 text-center border border-slate-200 rounded text-xs text-slate-700 outline-none focus:border-[#1890ff]"
                  />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS & DRAWERS
      ========================================================================= */}

      {/* Modal 1: 「模块属性」弹窗 (1:1 Exact Match to User's Uploaded Screenshot) */}
      {propSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-6xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white relative">
              <h3 className="font-bold text-slate-800 text-sm">
                模块属性
              </h3>

              {/* Yellow Alert Banner in Header/Top matching screenshot 1:1 */}
              <div className="absolute left-1/2 -translate-x-1/2 bg-[#ffc53d] text-slate-900 px-6 py-1 rounded text-xs font-medium shadow-xs">
                设备模块修改后，引用到的设备类型不一起修改
              </div>

              <button 
                onClick={() => setPropSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base leading-none p-1"
                title="关闭"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {/* Action Toolbar matching screenshot */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left Action Buttons: [+ 新增] [- 批量删除] [导入] [下载模板] */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleAddNewPropertyRow}
                    className="px-3.5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs font-normal"
                  >
                    <span>+</span>
                    <span>新增</span>
                  </button>

                  <button
                    onClick={handleBatchDeleteProperties}
                    className="px-3.5 py-1.5 bg-[#ff4d4f] hover:bg-red-600 text-white rounded text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs font-normal"
                  >
                    <span>-</span>
                    <span>批量删除</span>
                  </button>

                  <button
                    onClick={() => showToast('请选择属性配置文件进行导入 (支持 .xlsx, .csv)', 'info')}
                    className="px-3.5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs transition-colors cursor-pointer shadow-2xs font-normal"
                  >
                    导入
                  </button>

                  <button
                    onClick={() => showToast('已下载「设备模块属性导入模板.xlsx」', 'success')}
                    className="px-3.5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs transition-colors cursor-pointer shadow-2xs font-normal"
                  >
                    下载模板
                  </button>
                </div>

                {/* Right Filter Selects & Tools */}
                <div className="flex items-center gap-2.5">
                  {/* 属性名称 ∨ (动态适配真实测点) */}
                  <div className="relative">
                    <select 
                      value={propFilterName}
                      onChange={(e) => setPropFilterName(e.target.value)}
                      className="h-7 pl-2 pr-6 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer hover:border-[#1890ff]"
                    >
                      <option value="全部">全部属性名称</option>
                      {Array.from(new Set(modulePropertyList.map(p => p.name))).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 属性地址 ∨ (动态适配真实寄存器地址) */}
                  <div className="relative">
                    <select 
                      value={propFilterAddress}
                      onChange={(e) => setPropFilterAddress(e.target.value)}
                      className="h-7 pl-2 pr-6 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer hover:border-[#1890ff] font-mono"
                    >
                      <option value="全部">全部寄存器地址</option>
                      {Array.from(new Set(modulePropertyList.map(p => p.address))).map(addr => (
                        <option key={addr} value={addr}>{addr}</option>
                      ))}
                    </select>
                  </div>

                  {/* 属性类型 ∨ */}
                  <div className="relative">
                    <select 
                      value={propFilterType}
                      onChange={(e) => setPropFilterType(e.target.value)}
                      className="h-7 pl-2 pr-6 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none cursor-pointer hover:border-[#1890ff]"
                    >
                      <option value="全部">全部属性类型</option>
                      <option value="只读">只读</option>
                      <option value="读写">读写</option>
                    </select>
                  </div>

                  {/* Refresh, Column, Settings icons */}
                  <div className="flex items-center gap-1.5 text-slate-500 pl-1 border-l border-slate-200">
                    <button 
                      onClick={() => {
                        setModulePropertyList(currentPropModule ? getDomainProperties(currentPropModule.name) : [...initialPropertiesData]);
                        setSelectedPropIds([]);
                        setPropFilterName('全部');
                        setPropFilterAddress('全部');
                        setPropFilterType('全部');
                        showToast('已重置并刷新当前模块标准属性测点列表', 'info');
                      }}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 cursor-pointer" 
                      title="刷新"
                    >
                      <RefreshCw size={13} />
                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 cursor-pointer" title="列设置">
                      <SlidersHorizontal size={13} />
                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 cursor-pointer" title="配置">
                      <Settings size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 行业标准测点模板快捷载入 */}
              <div className="flex items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Layers size={12} className="text-[#1890ff]" />
                    <span>快捷切换测点库:</span>
                  </span>
                  {Object.entries(PROPERTY_PRESETS).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setModulePropertyList([...item.props]);
                        setSelectedPropIds([]);
                        setPropFilterName('全部');
                        setPropFilterAddress('全部');
                        setPropFilterType('全部');
                        showToast(`已更新载入「${item.label}」共 ${item.props.length} 项属性`, 'success');
                      }}
                      className="px-2.5 py-0.5 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-[#1890ff] border border-slate-200 hover:border-blue-200 transition-colors text-[11px] cursor-pointer shadow-2xs"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 shrink-0">
                  当前已收录 <span className="text-[#1890ff] font-medium font-mono">{filteredProperties.length}</span> 个标准寄存器
                </div>
              </div>

              {/* Table matching Screenshot columns 1:1 */}
              <div className="border border-slate-200 rounded overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#fafafa] text-slate-700 font-medium border-b border-slate-200">
                      <th className="py-2.5 px-3 w-10 text-center">
                        <input 
                          type="checkbox" 
                          checked={filteredProperties.length > 0 && selectedPropIds.length === filteredProperties.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPropIds(filteredProperties.map(p => p.id));
                            } else {
                              setSelectedPropIds([]);
                            }
                          }}
                          className="rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-3 w-14 text-center">序号</th>
                      <th className="py-2.5 px-3 w-28">属性名称</th>
                      <th className="py-2.5 px-3 w-32 font-mono">属性地址</th>
                      <th className="py-2.5 px-3 w-24 text-center">寄存器大小</th>
                      <th className="py-2.5 px-3 w-24">属性类型</th>
                      <th className="py-2.5 px-3 w-28">展现形式</th>
                      <th className="py-2.5 px-3 w-24">解析方式</th>
                      <th className="py-2.5 px-3 w-24">单位</th>
                      <th className="py-2.5 px-3 w-28">计算转换</th>
                      <th className="py-2.5 px-3 w-16 text-center">排序</th>
                      <th className="py-2.5 px-3 w-36 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProperties.map((prop, idx) => {
                      const isChecked = selectedPropIds.includes(prop.id);
                      return (
                        <tr key={prop.id} className={`hover:bg-slate-50/70 transition-colors ${isChecked ? 'bg-blue-50/30' : ''}`}>
                          {/* Checkbox */}
                          <td className="py-2.5 px-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {
                                setSelectedPropIds(prev => 
                                  prev.includes(prop.id) ? prev.filter(id => id !== prop.id) : [...prev, prop.id]
                                );
                              }}
                              className="rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                            />
                          </td>

                          {/* 序号 */}
                          <td className="py-2.5 px-3 text-center text-slate-600 font-mono">
                            {prop.no || idx + 1}
                          </td>

                          {/* 属性名称 */}
                          <td className="py-2.5 px-3 text-slate-800 font-medium">
                            <input 
                              type="text" 
                              value={prop.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setModulePropertyList(prev => prev.map(p => p.id === prop.id ? { ...p, name: val } : p));
                              }}
                              className="w-full bg-transparent border-0 hover:border-b hover:border-slate-300 focus:border-b focus:border-[#1890ff] outline-none text-slate-800 text-xs py-0.5"
                            />
                          </td>

                          {/* 属性地址 */}
                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            {prop.address}
                          </td>

                          {/* 寄存器大小 */}
                          <td className="py-2.5 px-3 text-center font-mono text-slate-800">
                            {prop.registerSize}
                          </td>

                          {/* 属性类型 ∨ */}
                          <td className="py-2.5 px-3">
                            <select 
                              value={prop.propType}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setModulePropertyList(prev => prev.map(p => p.id === prop.id ? { ...p, propType: val } : p));
                              }}
                              className="bg-transparent border-0 text-slate-700 outline-none cursor-pointer text-xs pr-1 font-medium hover:text-[#1890ff]"
                            >
                              <option value="只读">只读 ∨</option>
                              <option value="读写">读写 ∨</option>
                            </select>
                          </td>

                          {/* 展现形式 ∨ */}
                          <td className="py-2.5 px-3">
                            <select 
                              value={prop.displayForm}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setModulePropertyList(prev => prev.map(p => p.id === prop.id ? { ...p, displayForm: val } : p));
                              }}
                              className="bg-transparent border-0 text-slate-700 outline-none cursor-pointer text-xs pr-1 hover:text-[#1890ff]"
                            >
                              <option value="数值显示">数值显示 ∨</option>
                              <option value="开关状态">开关状态 ∨</option>
                              <option value="枚举状态">枚举状态 ∨</option>
                              <option value="文本状态">文本状态 ∨</option>
                            </select>
                          </td>

                          {/* 解析方式 ∨ */}
                          <td className="py-2.5 px-3">
                            <select 
                              value={prop.parseMethod}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setModulePropertyList(prev => prev.map(p => p.id === prop.id ? { ...p, parseMethod: val } : p));
                              }}
                              className="bg-transparent border-0 text-slate-700 outline-none cursor-pointer text-xs pr-1 hover:text-[#1890ff]"
                            >
                              <option value="BCD">BCD ∨</option>
                              <option value="HEX">HEX ∨</option>
                              <option value="IEEE754">IEEE754 ∨</option>
                              <option value="16位无符号">16位无符号 ∨</option>
                              <option value="16位有符号">16位有符号 ∨</option>
                            </select>
                          </td>

                          {/* 单位 (Input) */}
                          <td className="py-2.5 px-3">
                            <input 
                              type="text" 
                              value={prop.unit}
                              placeholder=""
                              onChange={(e) => {
                                const val = e.target.value;
                                setModulePropertyList(prev => prev.map(p => p.id === prop.id ? { ...p, unit: val } : p));
                              }}
                              className="w-16 h-6 px-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none focus:border-[#1890ff] font-mono text-center"
                            />
                          </td>

                          {/* 计算转换 (Input) */}
                          <td className="py-2.5 px-3">
                            <input 
                              type="text" 
                              value={prop.calcTransform}
                              placeholder=""
                              onChange={(e) => {
                                const val = e.target.value;
                                setModulePropertyList(prev => prev.map(p => p.id === prop.id ? { ...p, calcTransform: val } : p));
                              }}
                              className="w-20 h-6 px-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none focus:border-[#1890ff] font-mono"
                            />
                          </td>

                          {/* 排序 */}
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                            {prop.sort}
                          </td>

                          {/* 操作: 展现形式设置 | 删除 */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenDisplayFormModal(prop)}
                                className="text-[#1890ff] hover:underline cursor-pointer text-xs"
                              >
                                展现形式设置
                              </button>
                              <button
                                onClick={() => handleDeleteSingleProperty(prop.id, prop.name)}
                                className="text-red-500 hover:underline cursor-pointer text-xs"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer with 取消 & 确定 buttons */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-white">
              <button 
                onClick={() => setPropSettingsModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs cursor-pointer transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  showToast(`模块属性已成功保存！共配置 ${modulePropertyList.length} 项测点`, 'success');
                  setPropSettingsModalOpen(false);
                }}
                className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-normal cursor-pointer shadow-xs transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submodal: 展现形式设置 */}
      {displayFormModalOpen && displayFormProp && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1890ff]"></span>
                <span>展现形式设置 — {displayFormProp.name}</span>
              </h4>
              <button 
                onClick={() => setDisplayFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-slate-700 font-medium mb-1">展现形式分类</label>
                <select 
                  value={displayFormConfig.formatType}
                  onChange={(e) => setDisplayFormConfig({ ...displayFormConfig, formatType: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white outline-none focus:border-[#1890ff]"
                >
                  <option value="数值显示">数值显示 (仪表盘/趋势折线/大字数字)</option>
                  <option value="开关状态">开关状态 (双态开/关指示灯)</option>
                  <option value="枚举状态">枚举状态 (多状态标签映射)</option>
                  <option value="文本状态">文本状态 (原始文本透传)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">小数点位数</label>
                  <input 
                    type="number" 
                    value={displayFormConfig.decimalPlaces}
                    onChange={(e) => setDisplayFormConfig({ ...displayFormConfig, decimalPlaces: parseInt(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">配色方案</label>
                  <select 
                    value={displayFormConfig.colorScheme}
                    onChange={(e) => setDisplayFormConfig({ ...displayFormConfig, colorScheme: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white outline-none focus:border-[#1890ff]"
                  >
                    <option value="标准蓝绿">标准蓝绿 (安全/常态)</option>
                    <option value="警示暖黄">警示暖黄 (预警/临界)</option>
                    <option value="高危绯红">高危绯红 (告警/超标)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">预警阈值</label>
                  <input 
                    type="number" 
                    value={displayFormConfig.warningThreshold}
                    onChange={(e) => setDisplayFormConfig({ ...displayFormConfig, warningThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">告警阈值</label>
                  <input 
                    type="number" 
                    value={displayFormConfig.dangerThreshold}
                    onChange={(e) => setDisplayFormConfig({ ...displayFormConfig, dangerThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50">
              <button 
                onClick={() => setDisplayFormModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs cursor-pointer"
              >
                取消
              </button>
              <button 
                onClick={handleSaveDisplayFormConfig}
                className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 新建 / 编辑设备模块弹窗 */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1890ff]"></span>
                <span>{editingModule ? '编辑设备模块' : '新建设备模块'}</span>
              </h3>
              <button 
                onClick={() => setModuleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-red-500 mr-1">*</span>模块名称
                </label>
                <input 
                  type="text" 
                  value={moduleFormData.name}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, name: e.target.value })}
                  placeholder="例如：第11路多光谱植物监测模块"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  排序值 (序号)
                </label>
                <input 
                  type="number" 
                  value={moduleFormData.sort}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, sort: parseInt(e.target.value) || 1 })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  备注说明
                </label>
                <textarea 
                  rows={3}
                  value={moduleFormData.remark}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, remark: e.target.value })}
                  placeholder="请输入该传感器模块的业务用途说明..."
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50">
              <button 
                onClick={() => setModuleModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs cursor-pointer"
              >
                取消
              </button>
              <button 
                onClick={handleSaveModule}
                className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
              >
                确定保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: 删除确认弹窗 */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">确认删除设备模块?</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  即将删除选中的 <span className="font-bold text-red-500">{deleteTargetIds.length}</span> 个模块。删除后不可撤销，关联的设备属性与测点映射将解除绑定。
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 bg-[#ff4d4f] hover:bg-red-600 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3.5: 设备类型批量删除确认弹窗 */}
      {deleteTypeConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">确认删除设备类型?</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  即将删除选中的 <span className="font-bold text-red-500">{deleteTypeTargetIds.length}</span> 个设备类型。删除后不可撤销，关联的测点与设备将解除绑定。
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteTypeConfirmOpen(false)}
                className="px-3.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteTypes}
                className="px-3.5 py-1.5 bg-[#ff4d4f] hover:bg-red-600 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: 设备类型新建/编辑弹窗 */}
      {deviceTypeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Cpu size={15} className="text-[#1890ff]" />
                <span>{editingDeviceType ? '编辑设备类型' : '新建设备类型'}</span>
              </h3>
              <button 
                onClick={() => setDeviceTypeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-red-500 mr-1">*</span>设备类型名称
                </label>
                <input 
                  type="text" 
                  value={deviceTypeFormData.name}
                  onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, name: e.target.value })}
                  placeholder="例如：智能环境温湿度变送器"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">类型编码</label>
                  <input 
                    type="text" 
                    value={deviceTypeFormData.code}
                    onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, code: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-red-500 mr-1">*</span>类型分类
                  </label>
                  <select 
                    value={deviceTypeFormData.category}
                    onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] bg-white cursor-pointer"
                  >
                    {deviceTypeStats.categories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 版本号 */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">版本号</label>
                <input 
                  type="text" 
                  value={deviceTypeFormData.version}
                  onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, version: e.target.value })}
                  placeholder="V2.1.0"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] font-mono"
                />
              </div>

              {/* 设备图片 (预览与图片地址) */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">设备图片</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    {deviceTypeFormData.image ? (
                      <img 
                        src={deviceTypeFormData.image} 
                        alt="预览" 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    ) : (
                      <Cpu size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input 
                      type="text" 
                      value={deviceTypeFormData.image}
                      onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, image: e.target.value })}
                      placeholder="输入图片URL或选择快捷预设"
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-[#1890ff] font-mono"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400">预设图片:</span>
                      {[
                        { label: '温湿度传感器', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80' },
                        { label: '土壤墒情', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=100&auto=format&fit=crop&q=80' },
                        { label: '水流水压', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=100&auto=format&fit=crop&q=80' },
                        { label: '气体监测', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=100&auto=format&fit=crop&q=80' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setDeviceTypeFormData({ ...deviceTypeFormData, image: preset.url })}
                          className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-[#1890ff] text-[10px] text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">上级设备类型</label>
                <select 
                  value={deviceTypeFormData.parentType}
                  onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, parentType: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] bg-white cursor-pointer"
                >
                  {deviceTypeStats.parentTypes.map((pt) => (
                    <option key={pt.name} value={pt.name}>{pt.name}</option>
                  ))}
                  <option value="无 (顶级类型)">无 (顶级类型)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">备注说明</label>
                <textarea 
                  rows={2}
                  value={deviceTypeFormData.remark}
                  onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, remark: e.target.value })}
                  placeholder="请输入该设备类型的技术规格或业务用途说明..."
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] leading-relaxed resize-none"
                />
              </div>

              {/* 更新人与更新时间 */}
              <div className="grid grid-cols-2 gap-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">更新人</label>
                  <input 
                    type="text" 
                    value={deviceTypeFormData.updater}
                    onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, updater: e.target.value })}
                    placeholder="例如：管理员"
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-[#1890ff] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">更新时间状态</label>
                  <div className="h-7 px-2 bg-emerald-50 border border-emerald-200 rounded flex items-center text-[11px] text-emerald-700 font-medium">
                    保存时将自动更新为当前最新时间
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">绑定模块</label>
                  <select 
                    value={deviceTypeFormData.moduleName}
                    onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, moduleName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] bg-white cursor-pointer"
                  >
                    {modules.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">通信协议</label>
                  <select 
                    value={deviceTypeFormData.protocol}
                    onChange={(e) => setDeviceTypeFormData({ ...deviceTypeFormData, protocol: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#1890ff] bg-white cursor-pointer"
                  >
                    <option value="Modbus-RTU">Modbus-RTU</option>
                    <option value="MQTT">MQTT</option>
                    <option value="LoRaWAN">LoRaWAN</option>
                    <option value="TCP/IP">TCP/IP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button 
                onClick={() => setDeviceTypeModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs cursor-pointer"
              >
                取消
              </button>
              <button 
                onClick={handleSaveDeviceType}
                className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer shadow-xs"
              >
                确定保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: 日志详情与 Diff 查看 */}
      {logDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#1890ff]" />
                <h4 className="font-bold text-slate-800 text-sm">变更快照审计详情</h4>
              </div>
              <button 
                onClick={() => setLogDetailItem(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded space-y-1.5 border border-slate-100 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">流水号:</span>
                  <span className="font-bold text-[#1890ff]">{logDetailItem.serialNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">目标模块:</span>
                  <span className="text-slate-800">{logDetailItem.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">操作类型:</span>
                  <span className="font-medium">{logDetailItem.changeType} ({logDetailItem.versionChange})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">操作人 / IP:</span>
                  <span>{logDetailItem.operator} ({logDetailItem.ip})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">时间:</span>
                  <span>{logDetailItem.logTime}</span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800 mb-1">变更简述：</p>
                <p className="text-slate-600 bg-blue-50/50 p-2.5 rounded border border-blue-100 leading-relaxed text-[11px]">
                  {logDetailItem.summary}
                </p>
              </div>

              {logDetailItem.diffAfter && (
                <div>
                  <p className="font-semibold text-slate-800 mb-1">配置 Diff 快照：</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-2 bg-red-50/50 border border-red-200 rounded text-red-700 overflow-x-auto max-h-40">
                      <p className="font-bold text-red-500 mb-1 border-b border-red-200 pb-0.5">- 变更前配置</p>
                      <pre className="whitespace-pre">{logDetailItem.diffBefore}</pre>
                    </div>
                    <div className="p-2 bg-emerald-50/50 border border-emerald-200 rounded text-emerald-800 overflow-x-auto max-h-40">
                      <p className="font-bold text-emerald-600 mb-1 border-b border-emerald-200 pb-0.5">+ 变更后配置</p>
                      <pre className="whitespace-pre">{logDetailItem.diffAfter}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end bg-slate-50">
              <button 
                onClick={() => setLogDetailItem(null)}
                className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-normal cursor-pointer"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceTypeManagement;
