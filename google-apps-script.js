/**
 * Google Apps Script - 青协报名数据后端
 *
 * 部署步骤：
 * 1. 打开 https://sheets.new 创建一个新的 Google Sheet
 * 2. 在第一行添加表头：姓名 | 学号 | 学院 | 电话 | 微信 | 班次 | 日期 | 调剂 | 备注 | 提交时间
 * 3. 点击「扩展」→「Apps Script」
 * 4. 粘贴此脚本，替换默认代码
 * 5. 点击「部署」→「新建部署」
 * 6. 类型选「网页应用」，执行身份选「我」，访问权限选「任何人」
 * 7. 部署后复制 URL，粘贴到 app.js 的 GSHEET_URL 变量中
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.name || '',
      data.studentId || '',
      data.college || '',
      data.phone || '',
      data.wechat || '',
      data.shift || '',
      (data.dates || []).join(', '),
      data.flexible || '',
      data.note || '',
      data.time || new Date().toLocaleString('zh-CN')
    ]);

    return ContentService.createTextOutput(JSON.stringify({status:'ok'}));
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error', msg:err.message}));
  }
}

function doGet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length <= 1) return ContentService.createTextOutput('[]');

    var headers = data[0];
    var records = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var record = {};
      for (var j = 0; j < headers.length && j < row.length; j++) {
        record[headers[j]] = row[j];
      }
      records.push(record);
    }

    return ContentService.createTextOutput(JSON.stringify(records));
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify([]));
  }
}
