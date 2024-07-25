/*
 * @Description: String处理方法集
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-10-20 11:29:38
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-06-19 17:08:32
 */

export function uuid() {
    let s = [];
    let hexDigits = "0123456789abcdefghijk";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}

export function uuidOnlyStr(length = 10) {
    let s = [];
    let hexDigits = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < length; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    return s.join("");
}