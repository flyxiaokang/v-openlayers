/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-01-10 14:25:51
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-01-10 14:34:49
 */


export function getRandomNum(min = 0, max = 100) {
    var Range = max - min;
    var Rand = Math.random();
    var num = min + Math.round(Rand * Range); //四舍五入
    return num;
}