/*
 * @Description: 基础数据类型方法扩展
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-10-13 17:27:40
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-10-20 14:19:08
 */

/*****字符串 *************************************************************/
String.prototype.isString = function(str) {
    if (typeof str === 'string' || str instanceof String) {
        return true
    }
    return false
}

String.prototype.isValidURL = function() {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(this)
}

String.prototype.isValidLowerCase = function() {
    const reg = /^[a-z]+$/
    return reg.test(this)
}

String.prototype.isValidUpperCase = function() {
    const reg = /^[A-Z]+$/
    return reg.test(this)
}

String.prototype.isValidAlphabets = function() {
    const reg = /^[A-Za-z]+$/
    return reg.test(this)
}

String.prototype.isValidEmail = function() {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(this)
}

String.prototype.hexColor2Rgba = function(opacity = 1) {
    var sColor = this.toLowerCase();
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
        }
        sColorChange.push(opacity);
        return sColorChange;
    } else {
        console.warn('请输入十六进制颜色')
    }
    return sColor;
};

String.prototype.hexColor2RgbStr = function(bArray = false) {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = this.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
            colorChange.push(parseInt(`0x${color.slice(i, i + 2)}`));
        }
        if (bArray) {
            return colorChange;
        } else {
            return `RGB(${colorChange.join(",")})`;
        }
    } else {
        return color;
    }
};

String.prototype.getUrlQueryValueByName = function(paramName) {
    const reg = new RegExp(`(^|&)${paramName}=([^&]*)(&|$)`, "i");
    const result = this.split('?')[1].match(reg);
    if (result != null) {
        return decodeURI(result[2]);
    } else {
        return null;
    }
}

String.prototype.getUrlQueryObj = function() {
    if (this.split('?').length > 1) {
        const result = this.split('?')[1];
        const params = result.split('&')
        const paramsObj = {}
        params.forEach(param => {
            let paramArr = param.split('=')
            paramsObj[paramArr[0]] = decodeURI(paramArr[1] || '')
        });
        return paramsObj;
    } else {
        console.info('无请求参数')
        return null
    }
}

String.prototype.timeStr2Timestamp = function() {
    let date = new Date(this)
    let timeStamp = date.getTime()
    return timeStamp
}

String.prototype.timeStr2Date = function() {
    return new Date(this)
}

/*****数组 *************************************************************/
Array.prototype.isArray = function(arr) {
    if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arr) === '[object Array]'
    }
    return Array.isArray(arr)
}

Array.prototype.removeElement = function(element) {
    return this.splice(this.indexOf(element), 1)
}

Array.prototype.removeElementByProperty = function() {

}

/*****日期 *************************************************************/
/**
 * 格式化日期对象
 * @param {*} fmt yyyy-MM-dd hh:mm:ss
 * @returns 日期字符串
 */
Date.prototype.date2String = function(fmt = 'yyyy-MM-dd hh:mm:ss') {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                `00${o[k]}`.substr(`${o[k]}`.length));
        }
    }
    return fmt;
};

Date.prototype.dateFormat = function(dateObj, formatStr) {
    if (!dateObj) {
        console.log('util_date:传入时间参数为空');
        return '';
    }
    if (!formatStr) {
        console.log('util_date:传入格式化参数为空');
        return '';
    }
    if (typeof dateObj === 'number') {
        let realDateObj = new Date(dateObj);
        dateObj = realDateObj;
    }
    let str = formatStr;
    let Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, dateObj.getFullYear());
    str = str.replace(/yy|YY/, (dateObj.getYear() % 100) > 9 ? (dateObj.getYear() % 100).toString() : `0${dateObj.getYear() % 100}`);

    str = str.replace(/MM/, dateObj.getMonth() + 1 < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1);
    str = str.replace(/M/g, dateObj.getMonth());

    str = str.replace(/w|W/g, Week[dateObj.getDay()]);

    str = str.replace(/dd|DD/, dateObj.getDate() > 9 ? dateObj.getDate().toString() : `0${dateObj.getDate()}`);
    str = str.replace(/d|D/g, dateObj.getDate());

    str = str.replace(/hh|HH/, dateObj.getHours() > 9 ? dateObj.getHours().toString() : `0${dateObj.getHours()}`);
    str = str.replace(/h|H/g, dateObj.getHours());
    str = str.replace(/mm/, dateObj.getMinutes() > 9 ? dateObj.getMinutes().toString() : `0${dateObj.getMinutes()}`);
    str = str.replace(/m/g, dateObj.getMinutes());

    str = str.replace(/ss|SS/, dateObj.getSeconds() > 9 ? dateObj.getSeconds().toString() : `0${dateObj.getSeconds()}`);
    str = str.replace(/s|S/g, dateObj.getSeconds());

    return str;
}