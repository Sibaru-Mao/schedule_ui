import { SummaryComponent } from './../summary/summary.component';
import { Component, OnInit } from '@angular/core';
import { DataService } from './../../../../services/data.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as XLSX from 'ts-xlsx'
import * as Excel from 'exceljs';

interface ItemData {
  id: string;
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {
  start_date = null;
  end_date = null;
  now_date = this.format_date(new Date())
  line_param = "ALL"
  model_param = "ALL"
  shift_param = "ALL"
  mo_param = ''
  permission
  edit_bool
  download_bool

  to_excel
  excel_name = 'detail'

  line_list = []
  model_list = []
  detail_list = []
  data_list = [this.line_param, this.model_param, this.shift_param, this.mo_param]

  detail_tem_Obj = {}
  constructor(
    private data: DataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.permission = JSON.parse(sessionStorage.getItem('permission'))
    this.edit_bool = false
    this.download_bool = false
    this.capture()
    this.line_list = JSON.parse(sessionStorage.getItem('line_list'))
    this.model_list = JSON.parse(sessionStorage.getItem('model_list'))
    this.detail_list = await this.data.get_machine_detail(this.data_list, [this.now_date, this.now_date])
    this.updateEditCache();
  }

  capture() {
    if (this.permission != 4) {
      if (this.permission != 3) {
        if (this.permission != 2) {
          this.download_bool = true
        }
        if (this.permission != 1) {
          this.edit_bool = true
        }
      }
    }
  }

  pushExcel(event) {
    let file: File = event.target.files[0]
    let reader = new FileReader();

    reader.onload = async (e) => {
      const excel: any = reader.result

      const worksheets = XLSX.read(excel, { type: 'binary' })
      const sheetName = worksheets.SheetNames[0]
      const excelRowData = XLSX.utils.sheet_to_json(worksheets.Sheets[sheetName], { header: 1 })
      let a = await this.data.excel_machine_detail(excelRowData)
      alert(a['status'])
      event.target.files = []
    }
    // }
    if (file)
      reader.readAsBinaryString(file)
  }

  downExcel() {
    this.getData()
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset='UTF-8'><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${this.excel_name}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${this.to_excel}</table></body></html>`;
    //????????????
    window.location.href = uri + this.base64(template)
  }
  //??????base64??????
  base64(s) { return window.btoa(unescape(encodeURIComponent(s))) }

  getData() {
    this.to_excel = '';
    this.to_excel += "<tr><th>ID</th><th>Date</th><th>Shift</th><th>Line</th><th>MO</th><th>PN</th><th>QTY</th><th>Order type</th><th>Model</th><th>Remark</th></tr>"
    for (let i = 0; i < this.detail_list.length; i++) {
      this.to_excel += "<tr><td>" + this.detail_list[i].id + " </td><td>" + this.detail_list[i].date + " </td><td>" + this.detail_list[i].shift + " </td><td>" + this.detail_list[i].line + " </td><td>" + this.detail_list[i].mo + " </td><td>" + this.detail_list[i].pn + " </td><td>" + this.detail_list[i].qty + " </td><td>" + this.detail_list[i].order_type + " </td><td>" + this.detail_list[i].model + " </td><td>" + this.detail_list[i].remark + " </td></tr>"
    }
  }

  //??????????????????yyyy/MM/dd
  format_date(date: Date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();
    let my_month
    let my_day
    my_month = "/" + mymonth;
    my_day = "/" + myweekday;
    return myyear + my_month + my_day
  }


  async go() {
    //input??????????????????
    if (this.mo_param.replace(/[^\w\ ]/ig, '') != this.mo_param) {
      alert('???????????????MO?????????????????????')
      this.mo_param = ''
    }
    //??????????????????
    else if (this.start_date == null || this.end_date == null) {
      alert("??????????????????")
    }
    else if (this.start_date > this.end_date) {
      alert("?????????????????????????????????")
    } else {
      let date = [this.format_date(this.start_date), this.format_date(this.end_date)]
      this.data_list = [this.line_param, this.model_param, this.shift_param, this.mo_param]
      this.detail_list = await this.data.get_machine_detail(this.data_list, date)
      this.updateEditCache()
    }
  }
  edit_cache: { [key: string]: { edit: boolean; data: ItemData } } = {};

  startEdit(id: any): void {
    this.edit_cache[id].edit = true;
    this.detail_tem_Obj[id] = JSON.parse(JSON.stringify(this.edit_cache[id]))
  }

  async deleteData(id) {
    let r = confirm("Sure to delete?")
    if (r == true) {
      const index = this.detail_list.findIndex(item => item.id === id);
      this.detail_list.splice(index, 1)
      await this.data.delete_machine_detail(id)
    }
  }

  cancelEdit(id: string): void {
    this.edit_cache[id] = {
      data: this.detail_tem_Obj[id]["data"],
      edit: false
    };
  }

  async saveEdit(id: string): Promise<void> {
    const index = this.detail_list.findIndex(item => item.id === id);
    Object.assign(this.detail_list[index], this.edit_cache[id].data);
    this.edit_cache[id].edit = false;
    await this.data.change_machine_detail(this.detail_list[index])
  }

  updateEditCache(): void {
    this.edit_cache = {}
    this.detail_list.forEach(item => {
      this.edit_cache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }


  writeBuildland(assetdata) {
    console.log(assetdata);

    const workbook = new Excel.Workbook();
    return new Promise(async (resolve, reject) => {
      // start ??????sheet
      const worksheet = workbook.addWorksheet('detail');
      // ????????????
      worksheet.getCell('A1').value = 'ID';
      worksheet.getCell('B1').value = 'Date';
      worksheet.getCell('C1').value = 'Shift';
      worksheet.getCell('D1').value = 'Line';
      worksheet.getCell('E1').value = 'MO';
      worksheet.getCell('F1').value = 'PN';
      worksheet.getCell('G1').value = 'QTY';
      worksheet.getCell('H1').value = 'Order type';
      worksheet.getCell('I1').value = 'Model';
      worksheet.getCell('J1').value = 'Remark';

      for (const index in assetdata) {
        const row = worksheet.getRow(Number(index) + 2);
        for (let col = 0; col <= assetdata.length; col++) {
          const cell = row.getCell(col);
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          switch (col) {
            case 1:
              cell.value = assetdata[index].id;
              break;
            case 2:
              cell.value = assetdata[index].date;
              break;
            case 3:
              cell.value = assetdata[index].shift;
              break;
            case 4:
              cell.value = assetdata[index].line;
              break;
            case 5:
              cell.value = assetdata[index].mo;
              break;
            case 6:
              cell.value = assetdata[index].pn;
              break;
            case 7:
              cell.value = assetdata[index].qty;
              break;
            case 8:
              cell.value = assetdata[index].order_type;
              break;
            case 9:
              if (assetdata[index].adj_ratio) {
                cell.value = assetdata[index].model;
              } else cell.value = '';
              break;
            case 10:
              if (assetdata[index].adj_monfee) {
                cell.value = assetdata[index].remark;
              } else cell.value = '';
              break;
            default:
              break;
          }
        }
      }
      worksheet.getColumn('A').width = 16;
      worksheet.getColumn('C').width = 16;
      worksheet.getColumn('D').width = 40;
      worksheet.getColumn('I').width = 19;
      worksheet.getColumn('K').width = 17;
      console.log(await workbook.xlsx)

      // 7.????????????
      const path = './detail' + '.xlsx';
      await workbook.xlsx.writeFile(path);
    });
  }







  filters = [
    {
      name: 'type',
      fn: (fileList) => {
        const filterFiles = fileList.filter(w => ~['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(w.type));
        if (filterFiles.length !== fileList.length) {
          return filterFiles;
        }
        return fileList;
      }
    }
  ];

  //?????????????????????
  noType = (file: File): boolean => {
    this.getExcelData(file)
    return false;
  }
  //??????Excel??????
  async getExcelData(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    this.data.excel_machine_detail(formData)
  }

}
