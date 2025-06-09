var initSparkMD5Time = 100
var initSparkMD5MaxTime = 30000
var initSparkMD5Type = 'initSparkMD5'

var uploadFileCreateHashType = 'uploadFileCreateHash'
self.onmessage = (e) => {
  const { url, type, key, file, chunkSize, chunkTotal } = e.data ?? {}
  if (file) {
    console.log(`${file?.name}`, 'onmessage', e)
  }
  if (type === initSparkMD5Type) {
    const isLoadSparkMD5 = () => {
      return self.SparkMD5 && self.SparkMD5.ArrayBuffer
    }
    if (isLoadSparkMD5()) {
      self.postMessage({
        type,
        initSuccess: true,
      })
      return
    }
    self.importScripts(url + '/spark-md5.min.js?t=' + Date.now())
    // 每initSparkMD5Time检查下是否加载成功
    const timerInterval = setInterval(() => {
      if (isLoadSparkMD5()) {
        self.postMessage({
          type,
          initSuccess: true,
        })
        timerInterval && clearInterval(timerInterval)
        timerTimeout && clearTimeout(timerTimeout)
      }
    }, initSparkMD5Time)
    // 如果initSparkMD5MaxTime内没有加载成功，就报错
    const timerTimeout = setTimeout(() => {
      if (!self.SparkMD5 || !self.SparkMD5.ArrayBuffer) {
        self.postMessage({
          type,
          initSuccess: false,
        })
        timerInterval && clearInterval(timerInterval)
        timerTimeout && clearTimeout(timerTimeout)
      }
    }, initSparkMD5MaxTime)
    return
  }

  if (type === uploadFileCreateHashType) {
    if (!file) {
      console.warn(`${uploadFileCreateHashType}: file is null`, file)
      self.postMessage({
        type,
        key,
        hash: null,
      })
      self.close()
      return
    }

    const spark = new self.SparkMD5.ArrayBuffer()
    let count = 0

    const loadNext = (index) => {
      const reader = new FileReader()
      // 计算切片的起始位置
      const start = index * chunkSize
      // 计算切片的结束位置，取文件大小和理论结束位置的较小值
      const end = Math.min((index + 1) * chunkSize, file.size)
      reader.readAsArrayBuffer(file.slice(start, end))
      reader.onload = (e) => {
        count++
        spark.append(e.target.result)
        if (count === chunkTotal) {
          self.postMessage({
            type,
            key,
            hash: spark.end(),
          })
          self.close()
        } else {
          loadNext(count)
        }
      }
      reader.onerror = () => {
        self.postMessage({
          type,
          key,
          hash: null,
        })
        self.close()
      }
    }
    loadNext(0)
    return
  }
}
