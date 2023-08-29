/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-09 11:09:42
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-09 11:09:44
 */

import canvas2image from '../advanced/canvas2image'

/**
 * 导出canvas对象
 * @param {*} canvas
 */
export function exportCanvas(canvas) {
  var imageWidth = 800
  // 保存（下载）图片
  canvas2image.Canvas2Image.saveAsImage(
    canvas,
    imageWidth,
    (imageWidth * canvas.height) / canvas.width,
    'png'
  )
  // var img = canvas2image.convertToImage(canvas, imageWidth, imageWidth * canvas.height / canvas.width, 'png');
  // var loadImg = document.createElement('a')
  // loadImg.href = img.src
  // loadImg.download = 'earth'
  // loadImg.click()
}