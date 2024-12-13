const {AccountDoughnutChart, PositionsPieChart} = require("./chartjs/pies");
const {randNum, formatVolume} = require('./util');
const {myOrdersTable} = require('./datatables/ordersTable');

$(()=>{
    $('body div').hide();
    $('body loader').show();
    window.ts.refreshToken()
    .then(() => {
        new Main();
        $('body div').show();
        $('body loader').fadeOut();
    }).catch(error => {
        console.log(error);
        $('body loader').fadeOut();
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
        var equity = this.balances.find(obj => obj.AccountType === "Cash");
        var eqTotal = parseFloat(equity?.Equity);
        var eqpl = parseFloat(equity?.TodaysProfitLoss);
        this.balPie.updateLabels([
            "Equities $" + formatVolume(eqTotal),
            "Market $" + formatVolume(parseFloat(equity?.MarketValue)),
            "Cash $" + formatVolume(parseFloat(equity?.CashBalance))
        ]);
        this.balPie.updateData([
            eqTotal,
            parseFloat(equity?.MarketValue),
            parseFloat(equity?.CashBalance),
        ]);
        $("#equity").text("$"+eqTotal.toFixed(2));
        $("#pl").empty();
        $("#pl").append(`<div class="text-${eqpl < 0 ? 'danger' : 'success'}">
            ${eqpl.toFixed(2)} ${eqpl < 0 ? '<i class="fa-solid fa-caret-down"></i>' : '<i class="fa-solid fa-caret-up"></i>'} ${eqpl < 0 ? '-' : ''}${(Math.abs(eqpl)/eqTotal).toFixed(3)}%
            </div>`);
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

// function main(){
//     var c1 = new AccountDoughnutChart("accountPie");
//     var c2 = new PositionsPieChart("positionsPie");

//     try {
//     myOrdersTable('ordersTable');
//     } catch(error) {
//     console.log(error)
//     }

//     setInterval(()=>{
//     [c1, c2].forEach((cls)=>{
//         var a = randNum(0,100000);
//         var b  = randNum(0,100000);
//         var c = randNum(0,100000);
//         cls.updateLabels([`Equity ${a}`,
//             `Crypto ${b}`, `Cash ${c}`]);
//         cls.updateData([
//             a, b, c
//         ]);
//     });
//     }, 1000); 
// }