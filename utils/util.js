// 格式化时间: 2018-03-24T15:43:59.887
function formatTime(time) {
  // "Sat Mar 24 2018 16:40:22 GMT+0800 (中国标准时间)" => 24
  const days = +String(new Date()).split(' ')[2];
  // ["2018", "03", "24", "15", "43", "59.887"]
  const t = time.split(/[-|T|:]/);

  if (t[2] == days) {
    return `${t[3]}:${t[4]}`;
  }
  if (t[2] == days - 1) {
    return `昨日 ${t[3]}:${t[4]}`;
  }
  return `${t[1]}月${t[2]}日`;
}
// 格式化时间2：1521943328763
function formatTime2(time, nowDate) {
  const minutes = (nowDate - time) / 60000;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = weeks / 4;
  const years = months / 12;
  if (minutes < 60) {
    return `${Math.floor(minutes) > 0 ? Math.floor(minutes) : 1}分钟前`;
  } else if (hours < 24) {
    return `${Math.floor(hours)}小时前`;
  } else if (days < 7) {
    return `${Math.floor(days)}天前`;
  } else if (weeks < 4) {
    return `${Math.floor(weeks)}周前`;
  } else if (months < 12) {
    return `${Math.floor(months)}月前`;
  }
  return `${Math.floor(years)}年前`;
}
function formatTime3(time) {
  return new Date(+time.split(/[(|)]/)[1])
    .toJSON()
    .split(/\..+/)[0]
    .split('T')
    .join(' ');
}
export { formatTime, formatTime2, formatTime3 };
