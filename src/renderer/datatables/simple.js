const $ = require('jquery');
const { getRandomAlphaNum, hhmmss } = require('../util');
const DataTable = require('./datatables.min.js');

// Rest of the code remains unchanged

class SimpleTableAjax{
    constructor(params){
        this.params = params;
        this.intervalSeconds = params?.intervalSeconds || null;
        this. globalClassName =  params?.globalClassName || null;
        this.dom = params?.dom || "lfrtip",
        this.title = params?.title || "";
        this.id = params?.containerID;
        this.tableId = `${this.id}_${getRandomAlphaNum(10)}`;
        this.ajax = params?.ajax || null;
        this.cols = params?.columns || null;
        this.table = null;
        this.init();
    }

    createTitleContainer(){
        if (this.title !== "") {
            $(`#${this.id}`).prepend(`<div id="${this.id}_title" class="w-100 px-1">
                <h4 class="m-0">${this.title}
                    <span id="${this.tableId}_lastupdate" class="float-end text-muted h6 mb-0 mt-1">${hhmmss()}</span>
                </h4>
            </div>`);
        }
    }

    setHeaders(){
        var html = `<thead><tr>`;
        this.cols.forEach((obj, i)=>{
            var cls = obj?.headerCls ? obj?.headerCls : '';
            html += `<th class="text-muted ${cls}" style="font-weight:200;">${obj?.name}</th>`
        });
        html += `</tr></thead>`;
        return html;
    }

    setContainer(){
        $(`#${this.id}`).append(
            `<table id="${this.tableId}" class="display overflow compact nowrap w-100 ">
                ${this.setHeaders()}
            </table>`
        );
    }

    reloadTable(self){
        $(`#${self.tableId}_lastupdate`).empty();
        $(`#${self.tableId}_lastupdate`).append(`<i class="fa-solid fa-spinner fa-spin"></i>`);
        // self.table.ajax = self.updateAjaxHeader();
        // self.
        // self.table.ajax.url(self.ajax.url).load(additionalParams);
        // self.table.ajax.reload();
        self.table.destroy();
        $(`#${self.id}`).empty();
        console.log("Destroy?");

        new SimpleTableAjax({...self.params, ajax: self.updateAjaxHeader()})

        setTimeout(()=>{
            $(`#${self.tableId}_lastupdate`).empty();
            $(`#${self.tableId}_lastupdate`).text(hhmmss());
        }, 500);
        
    }

    bgAlpha(alpha){
        return {'background-color': `rgba(255, 255, 255,${alpha})`}
    }

    updateAjaxHeader(){
        if (this.globalClassName){
            console.log("Update header...", window.ts[this.globalClassName].accessToken);
            return {...this.ajax, headers: {
                Authorization: `Bearer ${window.ts[this.globalClassName].accessToken}`,
            }};
        }
    }

    init(){
        this.createTitleContainer();
        this.setContainer();
        const self = this;
        this.table = new DataTable(`#${this.tableId}`, {
            dom: self.dom,
            processing: false,
            serverSide: false,
            responsive: true,
            ajax: this.updateAjaxHeader(),
            columns: this.cols,
            scrollX: true,
            // scrollY: 200
            rowCallback: function(row, data, index){
                if (index % 2 == 0) {
                    $(row).css(self.bgAlpha(.03));
                }
                $(row).hover(
                    ()=>$(row).css(self.bgAlpha(.1)),
                    ()=>{$(row).css(self.bgAlpha(index % 2 == 0 ? .03 : .0));}
                );
            }
        });
        $(`#${this.tableId} tbody`).addClass('border-top');
        $(`#${this.tableId}_lastupdate`).text(hhmmss());

        // Conditional statement for reloading the table on an interval
        if (this.intervalSeconds) {
            const self = this;
            setInterval(function() {
                self.reloadTable(self);
            }, this.intervalSeconds);
        }
    }
}



class SimpleTableData{
    constructor(params){
        this.params = params;
        this.dom = params?.dom || "",
        this.title = params?.title || "";
        this.id = params?.containerID;
        this.tableId = `${this.id}_${getRandomAlphaNum(10)}`;
        this.cols = params?.columns || null;
        this.table = null;
        this.table = this.initTable();
        this.lastRowAdded= null;
    }

    updateTitle(txt){
        $(`#${this.id}_title_txt`).text(txt);
    }

    createTitleContainer(){
        if (this.title !== "") {
            $(`#${this.id}`).prepend(`<div id="${this.id}_title" class="text-secondary">
                <div class="m-0"><span id="${this.id}_title_txt">${this.title}</span>
                    <span id="${this.tableId}_lastupdate" class="float-end mb-0">${hhmmss()}</span>
                </div>
            </div>`);
        }
    }

    setHeaders(){
        var html = `<thead><tr>`;
        this.cols.forEach((obj, i)=>{
            var cls = obj?.headerCls ? obj?.headerCls : '';
            var style = obj?.headerStyle ? obj?.headerStyle : '';
            html += `<th class="text-secondary ${cls}" style="font-weight:200;${style}">${obj?.name}</th>`
        });
        html += `</tr></thead>`;
        return html;
    }

    setContainer(){
        $(`#${this.id}`).append(
            `<table id="${this.tableId}" class="display overflow compact nowrap w-100 ">
                ${this.setHeaders()}
            </table>`
        );
    }

    getLastRowAdded(){
        return this.lastRowAdded;
    }

    addRow(self, data){
        self.table.rows.add(data).draw(false);
        this.lastRowAdded = data[0];
        $(`#${self.tableId}_lastupdate`).text(hhmmss());
    }

    setStreamData(self, data){
        self.table.clear();
        self.table.rows.add(data).draw();
        $(`#${self.tableId}_lastupdate`).text(hhmmss());
    }

    setPollData(self, data){
        $(`#${self.tableId}_lastupdate`).empty();
        $(`#${self.tableId}_lastupdate`).append(`<i class="fa-solid fa-spinner fa-spin"></i>`);
        try{
            self.table.clear();
        }catch(error){
            console.error(error);
        }
        self.table.rows.add(data).draw();
        setTimeout(()=>{
            $(`#${self.tableId}_lastupdate`).empty();
            $(`#${self.tableId}_lastupdate`).text(hhmmss());
        }, 500);
    }

    bgAlpha(alpha){
        return {'background-color': `rgba(255, 255, 255,${alpha})`}
    }

    initTable(){
        this.createTitleContainer();
        this.setContainer();
        const self = this;
        var table = new DataTable(`#${this.tableId}`, {
            dom: self.dom,
            processing: false,
            serverSide: false,
            responsive: true,
            data: [],
            columns: this.cols,
            order: this.params?.order ? this.params?.order : [[ 0, "asc"]],
            scrollX: true,
            // scrollY: 200
            rowCallback: function(row, data, index){
                if (index % 2 == 0) {
                    $(row).css(self.bgAlpha(.03));
                }
                $(row).hover(
                    ()=>$(row).css(self.bgAlpha(.1)),
                    ()=>{$(row).css(self.bgAlpha(index % 2 == 0 ? .03 : .0));}
                );
            }
        });
        // $(`#${this.tableId} tbody`).addClass('border-top');
        $(`#${this.tableId}_lastupdate`).text(hhmmss());
        return table;
    }
}

module.exports = {
    SimpleTableData: SimpleTableData,
    SimpleTableAjax: SimpleTableAjax
}