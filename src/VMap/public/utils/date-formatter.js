/**
 *  @name:gw_date
 *  用途:   日期/事件处理方法类
 *         主要提供日期时间相关的处理函数
 *  @author:wxcwater
 *  @version:0.1.0
 */

// ---------------------------------------------------
// 日期格式化
// 格式 YYYY/yyyy/YY/yy 表示年份
// MM/M 月份
// W/w 星期
// dd/DD/d/D 日期
// hh/HH/h/H 时间
// mm/m 分钟
// ss/SS/s/S 秒
// ---------------------------------------------------
export function dateFormat(dateObj, formatStr) {
    if (!dateObj) {
        console.log('util_date:传入时间参数为空')
        return ''
    }
    if (!formatStr) {
        console.log('util_date:传入格式化参数为空')
        return ''
    }
    if (typeof dateObj === 'number') {
        const realDateObj = new Date(dateObj)
        dateObj = realDateObj
    }
    let str = formatStr
    const Week = ['日', '一', '二', '三', '四', '五', '六']

    str = str.replace(/yyyy|YYYY/, dateObj.getFullYear())
    str = str.replace(/yy|YY/, (dateObj.getYear() % 100) > 9 ? (dateObj.getYear() % 100).toString() : `0${dateObj.getYear() % 100}`)

    str = str.replace(/MM/, dateObj.getMonth() + 1 < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1)
    str = str.replace(/M/g, dateObj.getMonth())

    str = str.replace(/w|W/g, Week[dateObj.getDay()])

    str = str.replace(/dd|DD/, dateObj.getDate() > 9 ? dateObj.getDate().toString() : `0${dateObj.getDate()}`)
    str = str.replace(/d|D/g, dateObj.getDate())

    str = str.replace(/hh|HH/, dateObj.getHours() > 9 ? dateObj.getHours().toString() : `0${dateObj.getHours()}`)
    str = str.replace(/h|H/g, dateObj.getHours())
    str = str.replace(/mm/, dateObj.getMinutes() > 9 ? dateObj.getMinutes().toString() : `0${dateObj.getMinutes()}`)
    str = str.replace(/m/g, dateObj.getMinutes())

    str = str.replace(/ss|SS/, dateObj.getSeconds() > 9 ? dateObj.getSeconds().toString() : `0${dateObj.getSeconds()}`)
    str = str.replace(/s|S/g, dateObj.getSeconds())

    return str
}
// 当前日期 分
export function formatDateTime(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    let h = mytime.getHours()
    h = h < 10 ? `0${h}` : h
    let minute = mytime.getMinutes()
    minute = minute < 10 ? `0${minute}` : minute
    return `${y}-${m}-${d} ${h}:${minute}`
}
// 当前日期 时,分为00
export function formatDateTimeHm(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    let h = mytime.getHours()
    h = h < 10 ? `0${h}` : h
    return `${y}-${m}-${d} ${h}:00`
}
// 前count天
export function formatDateTime11(count, data) {
    let mytime = data || new Date()
    mytime = new Date(mytime.getTime() - 86400000 * count)
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    let h = mytime.getHours()
    h = h < 10 ? `0${h}` : h
    let minute = mytime.getMinutes()
    minute = minute < 10 ? `0${minute}` : minute
    return `${y}-${m}-${d} ${h}:${minute}`
}
/**
 * 后count天D，小时H,默认D
 *
 * @param {*} count 间隔
 * @param {*} data 传入的时间
 * @param {*} type 类型 D,H
 * @returns
 */
export function formatDateTimeCount(count, data, countType, formatType) {
    let n = 86400000 // 天数
    if (countType == 'H') {
        n = 3600000
    }
    if (typeof(data) === 'string') {
        data = new Date(data)
    }
    let mytime = data || new Date()
    mytime = new Date(mytime.getTime() + n * count)
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    let h = mytime.getHours()
    h = h < 10 ? `0${h}` : h
    let minute = mytime.getMinutes()
    minute = minute < 10 ? `0${minute}` : minute
    let seconds = mytime.getSeconds()
    seconds = seconds < 10 ? `0${seconds}` : seconds

    if (formatType == 'yyyy-MM-dd HH:mm:ss') {
        return `${y}-${m}-${d} ${h}:${minute}:${seconds}`
    }
    if (formatType == 'yyyy-MM-dd HH:mm') {
        return `${y}-${m}-${d} ${h}:${minute}`
    }
    if (formatType == 'yyyy-MM-dd') {
        return `${y}-${m}-${d}`;
    }
    return `${y}-${m}-${d} ${h}:${minute}:${seconds}`
}
// 一周前
export function formatDateWeek(count, data) {
    let mytime = data || new Date()
    mytime = new Date(mytime.getTime() - 86400000 * count)
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    return `${y}-${m}-${d}`
}
// 当前日期 时
export function formatDateTimeH(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    let h = mytime.getHours()
    h = h < 10 ? `0${h}` : h
    return `${y}-${m}-${d} ${h}`
}
// 当前日期 天
export function formatDateTimeD(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    return `${y}-${m}-${d}`
}
export function formatDateTimeD1(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    return `${y}年${m}月${d}日`
}
export function formatDateTimeD2(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    return `${m}月${d}日`
}

// 当前月
export function formatDateTimeM(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    return `${y}-${m}`
}
// 日期时间戳转换
export function formatDateTime2(timeStamp) {
    // timeStamp  12位时间戳码
    if (timeStamp === null) {
        return null
    } else {
        const date = new Date()
        date.setTime(timeStamp)
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? `0${m}` : m
        let d = date.getDate()
        d = d < 10 ? `0${d}` : d
        let h = date.getHours()
        h = h < 10 ? `0${h}` : h
        let minute = date.getMinutes()
        let second = date.getSeconds()
        minute = minute < 10 ? `0${minute}` : minute
        second = second < 10 ? `0${second}` : second
        return `${y}-${m}-${d} ${h}:${minute}:${second}`
    }
}

// 时间字符串转时间戳
export function dateStr2TimeStamp(dateStr){
  let date = new Date(dateStr)
  let timeStamp = date.getTime()
  return timeStamp
}

export function dateStr2Date(dateStr){
  let date = new Date(dateStr)
  return date
}

// 返回上一个8点
export function formatDateTime8H() {
    let mytime = new Date()
    const h = mytime.getHours()
    if (h < 8) {
        mytime = new Date(mytime.getTime() - 86400000)
    }
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    return `${y}-${m}-${d} 08:00`
}

// 当前时刻的五分钟后
export function meetRoomStarTime(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    let h = mytime.getHours()
    h = h < 10 ? `0${h}` : h
    let minute = mytime.getMinutes() + 5
    minute = minute < 10 ? `0${minute}` : minute
    let s = mytime.getSeconds()
    s = s < 10 ? `0${s}` : s
    return `${y}-${m}-${d} ${h}:${minute}:${s}`
}
// 当前时刻的五分钟后的一年后
export function meetRoomEndTime(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear() + 1
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate()
    d = d < 10 ? `0${d}` : d
    let h = mytime.getHours()
    h = h < 10 ? `0${h}` : h
    let minute = mytime.getMinutes() + 5
    minute = minute < 10 ? `0${minute}` : minute
    let s = mytime.getSeconds()
    s = s < 10 ? `0${s}` : s
    return `${y}-${m}-${d} ${h}:${minute}:${s}`
}
// 会议开始时间和结束时间
export function meetingStarTime(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate() + 1
    d = d < 10 ? `0${d}` : d
    return `${y}-${m}-${d} 10:00:00`
}
// 会议开始时间和结束时间
export function meetingEndTime(data) {
    const mytime = data || new Date()
    const y = mytime.getFullYear()
    let m = mytime.getMonth() + 1
    m = m < 10 ? `0${m}` : m
    let d = mytime.getDate() + 1
    d = d < 10 ? `0${d}` : d
    return `${y}-${m}-${d} 12:00:00`
}

// highCharts图表时间格式封装
export function chartDateFormatter() {
    var date = new Date(this.value)
    var fmt
    if (this.dateTimeLabelFormat == '%H:%M') {
        // 分钟 小时
        fmt = date.Format('hh:mm')
    } else if (this.dateTimeLabelFormat == '%e. %b') {
        // 天
        fmt = date.Format('MM.dd')
    } else if (this.dateTimeLabelFormat == "%b \'%y") {
        // 月
        fmt = date.Format('yyyy.MM')
    } else if (this.dateTimeLabelFormat == '%Y') {
        // 年
        fmt = date.Format('yyyy')
    }
    if (this.isFirst || this.isLast) {
        fmt = date.Format('yyyy.MM.dd')
    }
    return fmt
}



/**
 * 日期字符串截止到天
 * @param {*} date 日期Date
 * @returns 日期字符串
 */
export function date2StringD(date = new Date()) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? `0${m}` : m;
    let d = date.getDate();
    d = d < 10 ? `0${d}` : d;
    return `${y}-${m}-${d}`;
}

export function date2StringH(date = new Date()) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? `0${m}` : m;
    let d = date.getDate();
    d = d < 10 ? `0${d}` : d;
    let h = date.getHours();
    h = h < 10 ? `0${h}` : h;
    return `${y}-${m}-${d} ${h}`;
}

export function date2StringD2(date = new Date()) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? `0${m}` : m;
    let d = date.getDate();
    d = d < 10 ? `0${d}` : d;
    return `${y}年${m}月${d}日`;
}

/**
 * 取count周前的时间
 * @param {*} count number
 * @param {*} date 日期
 * @returns count周前
 */
export function formatDateWeek(count, date = new Date()) {
    let mytime = date;
    mytime = new Date(mytime.getTime() - 86400000 * count);
    let y = mytime.getFullYear();
    let m = mytime.getMonth() + 1;
    m = m < 10 ? `0${m}` : m;
    let d = mytime.getDate();
    d = d < 10 ? `0${d}` : d;
    return `${y}-${m}-${d}`;
}

// 返回上一个8点
export function formatDateTime8H() {
    let mytime = new Date();
    let h = mytime.getHours();
    if (h < 8) {
        mytime = new Date(mytime.getTime() - 86400000);
    }
    let y = mytime.getFullYear();
    let m = mytime.getMonth() + 1;
    m = m < 10 ? `0${m}` : m;
    let d = mytime.getDate();
    d = d < 10 ? `0${d}` : d;
    return `${y}-${m}-${d} 08:00`;
}

export default {
    dateFormat,
    formatDateTime,
    formatDateTime2,
    formatDateTimeH,
    formatDateTimeM,
    formatDateTimeD,
    formatDateTimeD1,
    formatDateTimeD2,
    formatDateWeek,
    formatDateTime11,
    formatDateTime8H,
    chartDateFormatter
}