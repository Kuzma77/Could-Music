import OSS from 'ali-oss'
const region = 'oss-cn-beijing'
const accessKeyId = 'LTAI4G3RbEnYyXpd2ez6jbo4'
const accessKeySecret = '6vVUWNdOhUunRQCLyrjszgKwVZMjkv'
const bucket = 'swl-kuzma'
const path = 'could-music'
let client = new OSS({
  region: region,
  accessKeyId: accessKeyId,
  accessKeySecret: accessKeySecret,
  bucket: bucket,
  path: path
})
//  上传
const CooOss = function(file) {
  if (this instanceof CooOss) {
    let objectKey = file.lastModified + '_' + file.name
    return new Promise((resolve, reject) => {
      client
        .multipartUpload(objectKey, file)
        .then((result) => {
          console.log(result)
          resolve({
            code: 0,
            objectKey: objectKey,
            url: this.getOssFileUrl(objectKey),
            msg: 'ok'
          })
        })
        .catch((err) => {
          console(err)
          console.error('上传出错了')
          reject({ code: -1, url: '', objectKey: '', msg: '上传出错了' })
        })
    })
  } else {
    return new CooOss(file)
  }
}

// 下载
const downloadFile = function(key) {
  console.log(key)
  let url = client.signatureUrl(key)
  let Img = new Image(),
    dataURL = ''
  let fileName = key.substring(key.indexOf('_') + 1)
  Img.src = url
  Img.setAttribute('crossOrigin', 'Anonymous')
  Img.onload = function() {
    let canvas = document.createElement('canvas'),
      width = Img.width,
      height = Img.height
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(Img, 0, 0, width, height)
    dataURL = canvas.toDataURL('image/png')
    let eleLink = document.createElement('a')
    eleLink.download = fileName
    eleLink.style.display = 'none'
    eleLink.href = dataURL
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
  }
}
/**
 *
 * @param {上传是设置文件key 一般是文件名} obecjtKey
 */
CooOss.prototype.getOssFileUrl = (obecjtKey) => {
  if (!obecjtKey) return new Error('object key 必须传')
  return 'https://' + bucket + '.' + region + '.aliyuncs.com/' + obecjtKey
}

export default {
  install(Vue) {
    Vue.prototype.Oss = {
      uploadFile: CooOss,
      downloadFile: downloadFile
    }
  }
}

CooOss.prototype.getOssFileUrl = (obecjtKey) => {
  if (!obecjtKey) return new Error('object key 必须传')
  return 'https://' + bucket + '.' + region + '.aliyuncs.com/' + obecjtKey
}
