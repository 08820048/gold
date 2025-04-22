// 价格数据处理配置
export const priceConfig = {
  // 刷新频率配置（毫秒）
  refreshInterval: 5000,
  
  gold: {
    // 黄金价格处理参数
    divisor: 1, // 除数，默认为1表示不处理
    multiplier: 1, // 乘数，默认为1表示不处理
    addition: 0, // 加数，默认为0表示不处理
    subtraction: 0, // 减数，默认为0表示不处理
    decimalPlaces: 2, // 保留小数位数
  },
  silver: {
    // 白银价格处理参数
    divisor: 1066, // 除数
    multiplier: 1, // 乘数
    addition: 0, // 加数
    subtraction: 0, // 减数
    decimalPlaces: 2, // 保留小数位数
  },
  k18: {
    // 18K金价格处理参数（基于黄金价格）
    divisor: 1, // 除数
    multiplier: 0.74, // 乘数，18K金为黄金价格的74%
    addition: 0, // 加数
    subtraction: 0, // 减数
    decimalPlaces: 2, // 保留小数位数
  },
  platinum: {
    // 铂金价格处理参数
    divisor: 1, // 除数
    multiplier: 1, // 乘数
    addition: 0, // 加数
    subtraction: 20, // 减数
    decimalPlaces: 2, // 保留小数位数
  }
}

// 处理价格数据的通用函数
export const processPrice = (price, config) => {
  if (!price || !config) return '0.00'
  
  let result = parseFloat(price)
  
  // 按照配置顺序处理：除法 -> 乘法 -> 加法 -> 减法
  if (config.divisor !== 1) result = result / config.divisor
  if (config.multiplier !== 1) result = result * config.multiplier
  if (config.addition !== 0) result = result + config.addition
  if (config.subtraction !== 0) result = result - config.subtraction
  
  // 格式化小数位数
  return result.toFixed(config.decimalPlaces)
} 