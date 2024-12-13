const {AccountDoughnutChart, PositionsPieChart} = require("./chartjs/pies");
const {randNum} = require('./util');
const {myOrdersTable} = require('./datatables/ordersTable');

$(()=>{
    window.ts.refreshToken()
    .then(() => {
        // main();
        new Main();
    }).catch(error => {
        console.log(error);
    });
});

class Main{
    constructor(){
        this.accountIds; 
        this.accounts;
        this.balances;
        this.positions;
        this.posPie;
        this.balPie;
        this.init();
    }

    async init(){
        await window.ts.account.getAccounts().then(resp =>{
            this.accounts = resp;
            this.accountIds = resp.map(item => `${item.AccountID}`).join(',')
            this.proceed();
        });
    }

    async getBalances(){
        await window.ts.account.getAccountBalances(this.accountIds).then(resp =>{
            this.balances = resp;
            this.accountsPie();
        });
    }
    
    async getPositions(){
        await window.ts.account.getPositions(this.accountIds).then(resp =>{
            this.positions = resp;
            console.log(this.positions);
            // this.positionsPie();
        });
    }

    accountsPie(){
        if (!this.balPie){
            this.balPie = new AccountDoughnutChart("accountPie")
        }
        
        var labels = [];
        var amts = [];
        var plTotal = 0;
        var cashTotal = 0;
        this.balances.forEach((bal)=>{
            labels.push(`${bal?.AccountType}: ${parseFloat(bal?.Equity).toFixed(2)}`);
            amts.push(bal?.Equity);
            cashTotal += parseFloat(bal?.Equity);
            plTotal += parseFloat(bal?.TodaysProfitLoss);
        });
        labels.push(`Crypto: 0`);
        labels.push(`Cash: ${cashTotal.toFixed(2)}`);
        amts.push(0);
        amts.push(cashTotal);
        this.balPie.updateLabels(labels);
        this.balPie.updateData(amts);
        $("#equity").text(cashTotal.toFixed(2));
        $("#pl").empty();
        $("#pl").append(`${plTotal.toFixed(2)} ${plTotal < 0 ? '<i class="fa-solid fa-caret-down"></i>' : '<i class="fa-solid fa-caret-up"></i>'} ${plTotal < 0 ? '-' : ''}${(Math.abs(plTotal)/cashTotal).toFixed(2)}%`);
    }

    positionsPie(){
        if (!this.posPie){
            this.posPie = new PositionsPieChart("positionsPie");
        }
    }

    proceed(){
        this.getBalances();
        this.getPositions();
        setInterval(()=>{
            this.getBalances(); 
            this.getPositions();
        }, 60000);
        
    }
}

function main(){
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
}