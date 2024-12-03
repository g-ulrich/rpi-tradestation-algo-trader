const {convertToEST, formatCurrency} = require('../../util');

function getColor(row){
    var filled = row?.StatusDescription == 'Filled';
    var rejected = row?.StatusDescription == 'Rejected';
    return rejected ? 'text-primary' : filled ? 'text-success' : 'text-muted';
}


const getOrderColumns = () => {
    return [
        {
            data: '', 
            name: 'Details',
            render: function(data, type, row) {
                var legs = row?.Legs;
                var isLegs = legs && row.Legs.length > 0;
                var shares = isLegs ? legs[0].QuantityOrdered : '0';
                var symbol = isLegs ? legs[0].Symbol : '';
                var action = isLegs ? legs[0].BuyOrSell : '';
                var price = isLegs ? legs[0].ExecutionPrice : '0.0';
                return `<div class="${getColor(row)}">${action} ${symbol}<br/>${shares} @ ${parseFloat(price).toFixed(2)}</div>`;
            }
        },
        { data: 'OrderType', name: 'Order', headerCls: 'text-center',
            render: function(data, type, row) {
                return `<div class="text-center ${getColor(row)}">
                ${data}<br/>
                ${row?.Duration} ${row?.StatusDescription}
                </div>`;
            } 
        },
        // { data: 'OrderID', name: 'ID', headerCls: 'text-center',
        //     render: function(data, type, row) {
        //         return `<div class="text-center">
        //         <span class="text-muted">Acct.</span> <span class="${getColor(row)}">${row?.AccountID}</span><br/>
        //         <span class="text-muted">Ord.</span> <span class="${getColor(row)}">${data}</span>
        //         </div>`;
        //     } 
        // },
        // { data: 'OpenedDateTime', name: 'Opened', headerCls: 'text-end',
        //     render: function(data, type, row) {
        //         return `<div class="text-end text-muted">${convertToEST(data)}</div>`;
        //     } 
        // },
      
    ];
};

module.exports = {
    getOrderColumns: getOrderColumns
};