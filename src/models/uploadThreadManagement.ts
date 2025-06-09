export const uploadFileThreadManagement = {
  num: 0,
  maxThreadsQuantity: 5,
}
export const isMaxFileThreadsQuantity = () => {
  return uploadFileThreadManagement.num >= uploadFileThreadManagement.maxThreadsQuantity
}
export const addFileUploadThread = () => {
  uploadFileThreadManagement.num++
}
export const diminishFileUploadThread = () => {
  uploadFileThreadManagement.num--
}

export const uploadfileChunkThreadManagement = {
  num: 0,
  maxThreadsQuantity: 5,
}
export const isMaxFileChunkThreadsQuantity = () => {
  return uploadfileChunkThreadManagement.num >= uploadfileChunkThreadManagement.maxThreadsQuantity
}
export const queryFileChunkSurplusThreadsQuantity = () => {
  return uploadfileChunkThreadManagement.maxThreadsQuantity - uploadfileChunkThreadManagement.num
}
export const addFileChunkUploadThread = () => {
  uploadfileChunkThreadManagement.num++
}
export const diminishFileChunkUploadThread = () => {
  uploadfileChunkThreadManagement.num--
}
