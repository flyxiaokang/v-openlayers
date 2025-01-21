<!--
 * @Description: 文件上传
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-11-21 15:23:41
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-01 11:24:40
-->
<template>
  <el-upload
    ref="refUploadFile"
    :drag="drag"
    action=""
    style="display: inline-block"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="handleFileChange"
    :before-upload="handleBeforeUpload"
    :multiple="true"
    :accept="accept"
  >
    <i v-if="drag" class="el-icon-upload"></i>
    <div v-if="drag" class="el-upload__text">
      将文件拖到此处，或<em>点击上传</em>
    </div>
    <slot>
      <el-button v-if="!drag" type="primary" size="mini"> 上传 </el-button>
    </slot>
  </el-upload>
</template>

<script>
import WKT2WKID from './js/wkid'
import { open } from 'shapefile'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'

export default {
  name: 'FileUpload',
  data() {
    return {
      shpFeatures: [],
      shpWkid: '',
      excelData: {},
    }
  },
  props: {
    accept: {
      type: String,
      default: '.shp,.prj,.json,.txt',
    },
    onSuccess: {
      type: Function,
    },

    onError: {
      type: Function,
    },

    drag: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    handleBeforeUpload(file) {
      this.handleZip(files)
    },
    handleFileChange(files, fileList) {
      var _this = this
      this.$refs.refUploadFile.clearFiles()
      this.model_buffer = false
      this.file = fileList[0]
      //判断文件是否为shp文件
      const name = this.file.name
      const extension = name.split('.')[1]
      this.extension = extension

      if ('xlsx' === extension) {
        this.handleExcel(files)
        return
      }

      if ('zip' === extension) {
        this.handleZip(files)
        return
      }

      if (
        'shp' !== extension &&
        'prj' !== extension &&
        'json' !== extension &&
        'txt' !== extension &&
        'geojson' !== extension
      ) {
        this.$message({
          type: 'info',
          message: '请选择shp文件或者导出的json文件',
        })
        return
      }
      // console.log("文件格式", extension);
      if ('json' === extension || 'geojson' === extension) {
        var reader = new FileReader()
        const fileData = this.file.raw
        reader.readAsText(fileData)
        reader.onload = function (e) {
          var jsonObj = JSON.parse(this.result)
          _this.handleGeojson(jsonObj)
        }
      } else if ('txt' === extension) {
        this.handleTxt(this.file)
      } else if ('prj' === extension) {
        var reader = new FileReader()
        const fileData = this.file.raw
        reader.readAsText(fileData)
        reader.onload = function (e) {
          var w = this.result.trim()
          _this.shpWkid = _this.getWkid(w)
          if (_this.shpWkid == '') {
            _this.onError &&
              _this.onError({
                wkid: _this.shpWkid,
                wkt: w,
                message: '无法识别坐标系',
              })
          }
        }
      } else if ('shp' === extension) {
        var reader = new FileReader()
        const fileData = this.file.raw
        reader.readAsArrayBuffer(fileData)
        reader.onload = function (e) {
          _this.getShp(this.result, (e) => {
            _this.shpFeatures = e
            setTimeout(() => {
              _this.handleShp()
            }, 200)
          })
        }
      }
    },

    /**
     * wkt
     */
    handleTxt(file) {
      let _this = this
      var reader = new FileReader()
      const fileData = file.raw
      reader.readAsText(fileData)
      reader.onload = function (e) {
        const { result } = this
        _this.handleSuccess({
          success: true,
          type: 'wkt',
          wkt: result,
        })
      }
    },

    /**
     * shp zip
     */
    handleZip(file) {
      const zip = new JSZip()
      zip.loadAsync(file.raw).then((res) => {
        const keys = Object.keys(zip.files)
        for (let key of keys) {
          if (!key.includes('MACOS')) {
            if (key.includes('.shp')) {
              zip
                .file(key)
                .async('arraybuffer')
                .then((res) => {
                  this.shpFeatures = this.getShp(res, (e) => {
                    this.shpFeatures = e
                    setTimeout(() => {
                      this.handleShp()
                    }, 200)
                  })
                })
            }
            if (key.includes('.prj')) {
              zip
                .file(key)
                .async('string')
                .then((text) => {
                  this.shpWkid = this.getWkid(text)
                  this.prj = text
                })
            }
          }
        }
      })
    },
    /**
     * shp
     */
    handleShp() {
      if (this.shpWkid && this.shpFeatures.length > 0) {
        const geojson = {
          type: 'FeatureCollection',
          features: this.shpFeatures,
        }
        this.handleSuccess({
          success: true,
          type: 'geojson',
          wkid: this.shpWkid,
          geojson,
        })
      } else {
        this.handleError({
          success: false,
          type: 'geojson',
          wkid: this.shpWkid,
          prj: this.prj,
        })
      }

      this.shpFeatures = []
      this.shpWkid = ''
    },

    /**
     * geojson
     */
    handleGeojson(geojson) {
      if (geojson.type === 'FeatureCollection') {
        this.handleSuccess({
          success: true,
          type: 'geojson',
          geojson,
        })
      } else {
        this.handleError({
          success: false,
          type: 'geojson',
          wkid: this.shpWkid,
          prj: this.prj,
        })
      }
    },

    /**
     * excel
     */
    handleExcel(e) {
      const { raw } = e
      if (!raw) {
        return
      }
      this.upload(raw)
    },

    handleSuccess(data) {
      this.onSuccess && this.onSuccess(data)
      this.$emit('on-success', data)
    },

    handleError(data) {
      this.onError && this.onError(data)
      this.$emit('on-error', data)
    },

    getWkid(str) {
      let wkid = ''
      var w = str.trim()
      if (w.indexOf('China Geodetic Coordinate System 2000') != -1) {
        wkid = 4490
      } else if (w.includes('WGS_1984')) {
        wkid = 4326
      } else {
        WKT2WKID.forEach((element) => {
          if (element.wkt == w) {
            wkid = element.wkid
          }
        })
      }
      return wkid
    },

    getShp(arraybuffer, callback) {
      const features = []
      open(arraybuffer)
        .then((source) =>
          source.read().then(function log(result) {
            if (result.done) {
              console.log('result.done>>>>>>>>>>>>>>>')
              callback(features)
              return
              // return features;
            }
            features.push(result.value)
            return source.read().then(log)
          })
        )
        .catch((error) => {})
    },

    upload(rawFile) {
      // this.$refs["excel-upload-input"].value = null; // fix can't select the same excel
      this.readerData(rawFile)
    },

    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },

    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = `UNKNOWN ${C}` // <-- replace with your desired default
        if (cell && cell.t) {
          hdr = XLSX.utils.format_cell(cell)
        }
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    },

    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results

      this.handleSuccess({ type: this.extension, data: this.excelData })
    },
  },
}
</script>

<style scoped></style>
