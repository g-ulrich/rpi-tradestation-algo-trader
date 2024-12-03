const {AccountDoughnutChart, PositionsPieChart} = require("./chartjs/pies");
const {randNum} = require('./util');
const {myOrdersTable} = require('./datatables/ordersTable');

$(()=>{
 var c1 = new AccountDoughnutChart("accountPie");
 var c2 = new PositionsPieChart("positionsPie");

try {
    myOrdersTable('ordersTable');
} catch(error) {
    console.log(error)
}

 setInterval(()=>{
    [c1, c2].forEach((cls)=>{
        var a = randNum(0,100000);
        var b  = randNum(0,100000);
        var c = randNum(0,100000);
        cls.updateLabels([`Equity ${a}`,
            `Crypto ${b}`, `Cash ${c}`]);
        cls.updateData([
            a, b, c
        ]);
    });
}, 1000); 
});