/*
 * @Description: Date处理方法集
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-10-20 10:38:03
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-29 10:50:28
 */
/**
 * 根据指定时间间隔划分指定时间范围
 * @param {*} interval 时间间隔
 * @param {*} timeList 时间范围
 * @returns 时间数组
 */
export function CustomTimeSegment(interval = 30, timeList = ["04:00 - 24:00"]) {
    let openTime = timeList;
    let y = new Date().getFullYear();
    let m = new Date().getMonth() + 1;
    let d = new Date().getDate();
    let start = [],
        end = []; //start起始时间数组，end结束时间数组
    for (let i = 0, len = openTime.length; i < len; i++) {
        //将时间字符串转换成日期格式并存入开始时间数组和结束时间数组
        let [s, e] = openTime[i].split("-");
        start.push(new Date(y + "/" + m + "/" + d + " " + s));
        end.push(new Date(y + "/" + m + "/" + d + " " + e));
    }
    let list = [];

    function formatTime(time) {
        //时间为个位数则补零
        return time < 10 ? "0" + time : time;
    }
    for (let i = 0, len = start.length; i < len; i++) {
        let len2 = (end[i].getTime() - start[i].getTime()) / (interval * 60 * 1000); //计算各子区间以半小时为间隔拆分后的数组长度
        for (let j = 0; j < len2; j++) {
            if (start[i].getTime() + interval * 60 * 1000 <= end[i].getTime()) {
                //将各子区间日期按半小时递增转换为时间并存入list数组
                let ss = new Date(start[i].getTime() + interval * 60 * 1000 * j),
                    ee = new Date(start[i].getTime() + interval * 60 * 1000 * (j + 1));
                list.push([
                    formatTime(ss.getHours()) + ":" + formatTime(ss.getMinutes()),
                    formatTime(ee.getHours()) + ":" + formatTime(ee.getMinutes()),
                ]);
            }
        }
    }
    list = list.map((item) => {
        // return item.join("-");
        return item[0];
    });

    return list
}

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

/**
 * 将任意格式的日期转为 new Date() 类型
 * @param {*} date 日期
 * @param {boolean} allowNull 转换结果是否允许为null
 * @returns
 */
export function convertAnyToDate(date, allowNull = false) {
	let dateType = Object.prototype.toString.call(date); // 传入的时间的类型
	let timeObj = null; // 时间对象
	// 获取时间对象
	if (dateType == "[object Date]") {
		timeObj = new Date(date);
	} else if (dateType == "[object String]") {
		// 判断是否为纯数字，纯数字即视为时间戳
		let test = /^\d+$/.test(date);
		if (test) {
			let tempDate = parseInt(date);
			let tempTimeStamp = date.length == 10 ? tempDate * 1000 : tempDate;
			timeObj = new Date(tempTimeStamp);
		} else {
			// 利用是否能转换为时间戳判断是否为日期格式字符串
			let tempTime = new Date(date).getTime();
			if (null != tempTime && undefined != tempTime && !isNaN(tempTime)) {
				timeObj = new Date(tempTime);
			}
		}
	} else if (dateType == "[object Number]") {
		let timestamp = date.toString().length == 10 ? date * 1000 : date;
		timeObj = new Date(timestamp);
	}
	if (timeObj == null && !allowNull) {
		timeObj = new Date();
	}
	return timeObj;
}

/**
 * 时间戳转时间字符串
 * @param {*} timeStamp 时间戳
 * @param {*} format    格式
 * @returns 时间字符串
 */
export function timestamp2String(timeStamp, format) {
    var t = new Date(timeStamp);
    var tf = function(i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy| MM| dd| HH| mm| ss/g,
        function(a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
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