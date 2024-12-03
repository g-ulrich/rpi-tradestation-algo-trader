const {SimpleTableData} = require('./simple');
const { getOrderColumns } = require('./myColumns/orders');



function myOrdersTable(id) {
    new SimpleTableData({
        title: "Todays Orders",
        containerID: id,
        columns: getOrderColumns(),
        dom: 't',
    });
}

module.exports = {
    myOrdersTable: myOrdersTable,
};