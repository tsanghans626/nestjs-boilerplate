export function dateRangeTransformer({ value }: { value: [number, number] }) {
  if (!value) return undefined;

  // 如果是字符串数组（查询参数情况）
  if (Array.isArray(value) && value.length === 2) {
    const start = Number(value[0]);
    const end = Number(value[1]);
    if (!isNaN(start) && !isNaN(end)) {
      return [new Date(start), new Date(end)];
    }
  }

  return undefined;
}

export function dateHumanTransformer({ value }: { value: Date }) {
  if (!value) return '';

  const now = new Date();
  const targetDate = new Date(value);

  // 获取时分格式
  const timeStr = targetDate.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // 计算日期差
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDateOnly = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const dayDiff = Math.floor(
    (targetDateOnly.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // 1. 如果是当天，则只显示 时：分
  if (dayDiff === 0) {
    return timeStr;
  }

  // 2. 如果是明天或后天，则显示 明天/后天 时：分
  if (dayDiff === 1) {
    return `明天 ${timeStr}`;
  }
  if (dayDiff === 2) {
    return `后天 ${timeStr}`;
  }

  // 获取星期
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const targetWeekDay = weekDays[targetDate.getDay()];

  // 计算周差
  const nowWeekStart = new Date(nowDate);
  nowWeekStart.setDate(nowDate.getDate() - now.getDay()); // 本周日

  const targetWeekStart = new Date(targetDateOnly);
  targetWeekStart.setDate(targetDateOnly.getDate() - targetDate.getDay()); // 目标日期所在周的周日

  const weekDiff = Math.floor(
    (targetWeekStart.getTime() - nowWeekStart.getTime()) /
      (1000 * 60 * 60 * 24 * 7),
  );

  // 3. 如果是本周，则显示 周X 时：分
  if (weekDiff === 0 && dayDiff > 0) {
    return `周${targetWeekDay} ${timeStr}`;
  }

  // 4. 如果是下周，则显示 下周X 时：分
  if (weekDiff === 1) {
    return `下周${targetWeekDay} ${timeStr}`;
  }

  // 其他情况显示完整日期
  return targetDate.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function durationHumanTransformer({ value }: { value: number }) {
  if (!value) return '';

  // 将毫秒转换为秒
  const totalSeconds = Math.floor(value / 1000);

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  // 1. 当日不为0时，显示 X天X小时
  if (days > 0) {
    return `${days}天${hours}小时`;
  }

  // 2. 当日为0，时不为0时，显示 X小时X分钟
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }

  // 3. 当时为0，分不为0时，显示 X分钟
  if (minutes > 0) {
    return `${minutes}分钟`;
  }

  // 4. 当分为0时，显示 不足1分钟
  return '不足1分钟';
}
