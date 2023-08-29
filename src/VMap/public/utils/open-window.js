/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-21 10:17:53
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-02-22 10:45:26
 */
/**
 *Created by PanJiaChen on 16/11/29.
 * @param {Sting} url
 * @param {Sting} title
 * @param {Number} w
 * @param {Number} h
 */
export default function openWindow(url, title, w, h) {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = !window.screenLeft ? window.screenLeft : window.screen.left
  const dualScreenTop = !window.screenTop ? window.screenTop : window.screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

