import * as XLSX from 'xlsx';

export function importExcel(filePath) {
  const data = [];
  try {
    // Everything went fine
    const workbook = XLSX.readFile(filePath); // 整个excel文档
    const sheetNames = workbook.SheetNames; //获取所有工作薄名

    //解析
    const sheet1 = workbook.Sheets[sheetNames[0]]; //根据工作薄名获取工作薄

    /*
     sheet1['!ref']获取工作薄的有效范围'A1:C20'
     XLSX.utils.decode_range 将有效范围转为range对象
     range: {s: {r:0, c:0}, e: {r:10, 3}}
     */
    const range = XLSX.utils.decode_range(sheet1['!ref']);
    const startRow = range.s.r; // 开始的行
    const startCol = range.s.c; // 开始的列
    const endRow = range.e.r; // 结束的行
    const endCol = range.e.c; // 结束的列
    //循环获取单元格值
    for (let R = startRow+1; R <= endRow; ++R) {
      const row = [];
      let flag = false;
      for (let C = startCol; C <= endCol; ++C) {
        let rowValue = null;
        let cellAddress = {
          'c': C,
          'r': R
        }; //获取单元格地址
        const cell = XLSX.utils.encode_cell(cellAddress); //根据单元格地址获取单元格
        if (sheet1[cell]) {
          //获取单元格值
          rowValue = sheet1[cell].v;
        } else {
          rowValue = '';
        }
        row.push(rowValue);
      }
      //判断整行是否都为空，是则去掉
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== '') {
          flag = true;
          break;
        }
      }
      if (flag) {
        data.push(row);
      }
    }
  } catch (e) {
    //err = '解析出错' + e.toString();
  }

  return {data};
}
