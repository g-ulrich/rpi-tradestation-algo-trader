const {AccountDoughnutChart, PositionsPieChart} = require("./chartjs/pies");
const {randNum, formatVolume, isMarketOpen} = require('./util');
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
        this.posIndex = 0;
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
            this.positionsPie();
            this.updatePosition();
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
        var labels = [];
        var values = [];
        this.positions.forEach((pos)=>{
            labels.push(`${pos?.Symbol} (${pos?.Quantity})`);
            values.push(parseFloat(pos?.TotalCost));
        });
        this.posPie.updateLabels(labels);
        this.posPie.updateData(values);
    }

    updatePosition(){
        var pos = this.positions[this.posIndex];
        this.posIndex += 1;
        if (this.posIndex == this.positions.length){
            this.posIndex = 0;
        }
        if (this.positions.length > 0 && pos){
            var todayspl = parseFloat(pos?.TodaysProfitLoss);
            var totalpl = parseFloat(pos?.UnrealizedProfitLoss);
            $(`#position`).empty();
            $(`#position`).append(`
                <div class="no-grow px-1">
                    <h4 title="${pos?.Timestamp}" class="text-white m-0">
                        <img height="20" width="auto" alt="" style="margin-top:-3px;" src="../images/ticker_icons/${pos?.Symbol}.png" />
                        ${pos?.Symbol} 
                        <span class="text-secondary"> (${pos?.Quantity}) </span>
                         <span class="text-secondary">
                            $${todayspl.toFixed(2)}
                        </span>
                    </h4>
                    <h6 class="m-0">
                        <span class="text-${totalpl < 0 ? 'danger' : 'success'}">
                            $${totalpl.toFixed(2)}
                            <i class="fa-solid fa-caret-${totalpl < 0 ? 'down' : 'up'}"></i> 
                            ${parseFloat(pos?.UnrealizedProfitLossPercent).toFixed(2)}%
                        </span>
                    </h6>
                </div>
                <div id="chart" class="grow"></div>
            `);
        } else {
            $('#position').hide();
        }
    }

    setMarketStatus(){
        var status = isMarketOpen();
        var val = "";
        if (status == 'closed'){
            val = "Market Closed";
        }else{
            val = status.charAt(0).toUpperCase() + status.slice(1) + "-Market Open";
        }
        $('#market_status').text(val);
    }

    proceed(){
        this.setMarketStatus();
        this.getBalances();
        this.getPositions();
        setInterval(()=>{
            this.setMarketStatus();
            this.getBalances(); 
            this.getPositions();
        }, 60000);
        
    }
}
