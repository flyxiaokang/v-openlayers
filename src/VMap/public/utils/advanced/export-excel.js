/*
 * @Description: 导出excel工具函数
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-11-03 10:52:01
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-22 18:16:26
 */

import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export function exportExcelByElementId(id, fileName = '下载') {
    var xlsxParam = {
        raw: true
    }; //转换成excel时，使用原始的格式
    var wb = XLSX.utils.table_to_book(document.querySelector("#" + id), xlsxParam); //outTable为列表id
    var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
    });
    try {
        FileSaver.saveAs(
            new Blob([wbout], {
                type: "application/octet-stream;charset=utf-8"
            }),
            `${fileName}.xlsx`
        );
    } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
    }
    return wbout;
}

// data = [
//     ["id", "name", "value"],
//     [1, "sheetjs", 7262],
//     [2, "js-xlsx", 6969]
// ]
export function exportExcelByData(data, fileName = '下载') {
    const ws = XLSX.utils.aoa_to_sheet(data);
    /* generate workbook and add the worksheet */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, fileName + '.xlsx');
}

export function exportExcelByJson(jsonData, {
    header = [],
    skipHeader = true,
    fileName = '下载'
} = {
    header: [],
    skipHeader: true,
    fileName: '下载'
}) {
    function changeData(s) {
        //如果存在ArrayBuffer对象(es6) 最好采用该对象
        if (typeof ArrayBuffer !== 'undefined') {
            //1、创建一个字节长度为s.length的内存区域
            var buf = new ArrayBuffer(s.length);
            //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
            var view = new Uint8Array(buf);
            //3、返回指定位置的字符的Unicode编码
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;

        } else {
            var buf = new Array(s.length);
            for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    }
    var wopts = {
        bookType: 'xlsx',
        bookSST: true,
        type: 'binary'
    };
    var workBook = {
        SheetNames: ['Sheet1'],
        Sheets: {},
        Props: {}
    };
    //1、XLSX.utils.json_to_sheet(data) 接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表，默认的列顺序由使用Object.keys的字段的第一次出现确定
    //2、将数据放入对象workBook的Sheets中等待输出
    workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(jsonData, {
        header,
        skipHeader
    });

    //3、XLSX.write() 开始编写Excel表格
    //4、changeData() 将数据处理成需要输出的格式
    FileSaver.saveAs(new Blob([changeData(XLSX.write(workBook, wopts))], {
        type: 'application/octet-stream'
    }), fileName + ".xlsx")
}

var obj = [];
obj.push({
    name: "sheet1",
    data: sheetData,
});

obj.push({
    name: "sheet2",
    data: sheetData,
});

// exportExcelWithMultipleSheet(obj, {
//     skipHeader: true,
//     fileName: "测试123",
// });

export function exportExcelWithMultipleSheet(data, {
    header = [],
    skipHeader = false,
    fileName = '下载'
} = {
    header: [],
    skipHeader: false,
    fileName: '下载'
}) {
    // 将workbook装化成blob对象
    function workbook2blob(workbook) {
        // 生成excel的配置项
        var wopts = {
            // 要生成的文件类型
            bookType: "xlsx",
            // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            bookSST: false,
            type: "binary"
        };
        var wbout = XLSX.write(workbook, wopts);
        // 将字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        }
        var blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
        });
        return blob;
    }
    // 将blob对象创建bloburl，然后用a标签实现弹出下载框
    function openDownloadDialog(blob, fileName) {
        if (typeof blob == "object" && blob instanceof Blob) {
            blob = URL.createObjectURL(blob); // 创建blob地址
        }
        var aLink = document.createElement("a");
        aLink.href = blob;
        // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
        aLink.download = fileName || "";
        var event;
        if (window.MouseEvent) event = new MouseEvent("click");
        //   移动端
        else {
            event = document.createEvent("MouseEvents");
            event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
   
    const wb = XLSX.utils.book_new();
    data.forEach(element => {
        var title = element.name
        var sheetData = element.data
        var sheet = XLSX.utils.json_to_sheet(sheetData,{
            header,
            skipHeader
        });
        XLSX.utils.book_append_sheet(wb, sheet, title);
    });

    XLSX.writeFile(wb, fileName + '.xlsx');

    // const workbookBlob = workbook2blob(wb);
    // // 导出最后的总表
    // openDownloadDialog(workbookBlob, fileName + '.xlsx');
}

// export function exportExcelByJsonWithHeader(data, {
//     header,
//     fileName
// }) {
//     // 假设这个是数据源 一般是直接拉服务器上的数据, 进行下载
//     const data = [{
//             id: 1,
//             name: "张三",
//             age: 10
//         },
//         {
//             id: 2,
//             name: "张珊",
//             age: 10
//         },
//         {
//             id: 3,
//             name: "李四",
//             age: 10
//         },
//     ];

//     // 展示名称
//     const headerReplace = {
//         id: "ID",
//         name: "名称",
//         age: "年龄"
//     };

//     // 数据源
//     const sheet = [headerReplace, ...data];
//     console.log(sheet)
//     // 创建一个sheet表格   使用json_to_sheet, 数据格式比较为  数组包对象, 不然会报错
//     const worksheet = XLSX.utils.json_to_sheet(sheet, {
//         // 这里可以通过设置header, 来对导出数据 列 顺序的排序
//         // 实测可以只写一部分, 也可以整体排序
//         // ["id", "name", "age"] 相当于把上面整个表头给限制顺序了
//         header: ["age", 'name', 'id'],
//         // 跳过 Header, 就是把原来表格数据的表头去掉了, headerReplace渲染的数据 "冒充" 表头了
//         skipHeader: true,
//     });

//     // 简单理解为在内存中 创建一个xlsx 文件
//     const newWorkBook = XLSX.utils.book_new();
//     // 把worksheet添加到workbook中
//     XLSX.utils.book_append_sheet(newWorkBook, worksheet, "SheetJS");
//     // 写入文件, CHROME浏览器会直接下载, 后面的是文件名称和后缀
//     XLSX.writeFile(newWorkBook, "订单.xlsx");
// }