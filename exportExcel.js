this.$axios({
  url: completeExportUrl,
  method: 'get',
  params: this.queryParamsWithoutEmpty,
  responseType: 'arraybuffer',
  noInterceptors: true,
}).then((response) => {
  console.log('导出请求返回', response);
  let str = response.headers['content-disposition']
  console.log('文件名', str.match(/filename="(.+)"/)[1]);
  let filename = str.match(/filename="(.+)"/)[1];
  return exportExcel(new Blob([response.data]), filename || '什么鬼文件');
}).catch((error) => {
  // this.$message(response.data.message);
  console.log(error);
})


export default function download (data, filename) {
  if (!data) { return; }
  let url = window.URL.createObjectURL(data);
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', filename + '.xlsx');
  document.body.appendChild(link);
  link.click();
}
