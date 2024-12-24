const {AccountDoughnutChart, PositionsPieChart} = require("./chartjs/pies");
const {randNum, formatVolume, isMarketOpen, getRandomBoldRGBA} = require('./util');
const {SimpleTableData} = require('./datatables/simple');
const { getOrderColumns } = require('./datatables/myColumns/orders');

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
        this.progress = 0;
        this.posIndex = 0;
        this.ordersTable = new SimpleTableData({
            title: "Todays Orders",
            containerID: "ordersTable",
            columns: getOrderColumns(),
            dom: 't',
        });
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
            this.positionsPie();
            this.updatePositionHTML(this.positions[this.posIndex]);
        });
    }

    accountsPie(){
        var equity = this.balances.find(obj => obj.AccountType === "Cash");
        var eqTotal = parseFloat(equity?.Equity);
        var eqpl = parseFloat(equity?.TodaysProfitLoss);
        $("#equity").text("$"+eqTotal.toFixed(2));
        $("#pl").empty();
        $("#pl").append(`<div class="text-${eqpl < 0 ? 'danger' : 'success'}">
            ${eqpl.toFixed(2)} ${eqpl < 0 ? '<i class="fa-solid fa-caret-down"></i>' : '<i class="fa-solid fa-caret-up"></i>'} ${eqpl < 0 ? '-' : ''}${((eqpl/eqTotal)*100).toFixed(3)}%
            </div>`);

        var labels = [
            "Equities $" + formatVolume(eqTotal),
            "Market $" + formatVolume(parseFloat(equity?.MarketValue)),
            "Cash $" + formatVolume(parseFloat(equity?.CashBalance))
        ];
        var data = [
            eqTotal,
            parseFloat(equity?.MarketValue),
            parseFloat(equity?.CashBalance),
        ];
        if (!this.balPie){
            this.balPie = new AccountDoughnutChart("accountPie");
            this.balPie.chart.data.labels = labels;
            this.balPie.chart.data.datasets = [{
                labels: labels,
                data: data,
                backgroundColor: [getRandomBoldRGBA(.8), getRandomBoldRGBA(.8), getRandomBoldRGBA(.8)],
                borderColor: ['rgba(255, 255, 255, .5)', 'rgba(255, 255, 255, .5)', 'rgba(255, 255, 255, .5)'],
            }];
        } else {
            this.balPie.chart.data.datasets[0].data = data;
        }
        this.balPie.chart.update();
    }

    positionsPie(){
        var labels = this.positions.map(item => `${item?.Symbol} (${item?.Quantity})`);
        var data = this.positions.map(item => parseFloat(item?.TotalCost));
        if (!this.posPie){
            this.posPie = new PositionsPieChart("positionsPie");
            this.posPie.chart.data.labels = labels;
            this.posPie.chart.data.datasets = [{
                labels: labels,
                data: data,
                backgroundColor: this.positions.map(item => getRandomBoldRGBA(.8)),
                borderColor: this.positions.map(item =>  'rgba(255, 255, 255, .5)'),
            }];
        } else {
            this.posPie.chart.data.datasets[0].data = data;
        }
        this.posPie.chart.update();
    }

    updatePositionHTML(pos){
        if (this.positions.length > 0 && pos){
            var todayspl = parseFloat(pos?.TodaysProfitLoss);
            var totalCost = parseFloat(pos?.TotalCost);
            var totalpl = parseFloat(pos?.UnrealizedProfitLoss);
            $(`#position`).empty();
            $(`#position`).append(`
                <div class="flex">
                    <div class="grow px-1">
                        <h4 title="${pos?.Timestamp}" class="text-white m-0">
                            <img height="20" width="auto" alt="" style="margin-top:-3px;" src="../images/ticker_icons/${pos?.Symbol}.png" />
                            ${pos?.Symbol} 
                            (${pos?.Quantity})
                            $${parseFloat(pos?.Last).toFixed(3)}
                            <span class="text-secondary float-end"> $${parseFloat(pos?.AveragePrice).toFixed(3)}<sup><i>A</i></sup> $${totalCost.toFixed(2)}</span>
                        </h4>
                        <h6 class="m-0">
                            <span class="text-${todayspl < 0 ? 'danger' : 'success'}">
                                $${todayspl.toFixed(3)} <i class="fa-solid fa-caret-${todayspl < 0 ? 'down' : 'up'}"></i> 
                                ${((todayspl/totalCost)*100).toFixed(3)}%
                            </span>
                            <span class="float-end text-${totalpl < 0 ? 'danger' : 'success'}">
                                $${totalpl.toFixed(3)} <i class="fa-solid fa-caret-${totalpl < 0 ? 'down' : 'up'}"></i> 
                                ${parseFloat(pos?.UnrealizedProfitLossPercent).toFixed(3)}%
                            </span>
                        </h6>
                    </div>
                </div>
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

    async initStreamPositions(){
        const self = this;
        await window.ts.account.stream.connectPositions(
            this.accountIds,
            (data) => {
                var pos = this.positions[this.posIndex];
                if (pos?.Symbol == data["Symbol"]) {
                    self.updatePositionHTML(data);
                    self.positions[this.posIndex] = data;
                    self.positionsPie();
                }
            },
            (error) => {
              console.error('Stream error:', error);
            }
        );
    }

    proceed(){
        var loop = 10000;
        this.getPositions();
        this.initStreamPositions();
        this.setMarketStatus();
        this.getBalances();
        let startTime = Date.now();
        let elapsedTime = 0;
        setInterval(()=>{
            startTime = Date.now();
            elapsedTime = 0;
            this.posIndex += 1;
            if (this.posIndex == this.positions.length){
                this.posIndex = 0;
            }
            this.updatePositionHTML(this.positions[this.posIndex]);
            this.setMarketStatus();
            this.getBalances();
        }, loop);

        setInterval(()=>{
            const now = Date.now();
            elapsedTime = now - startTime || now;
            var per = (elapsedTime / loop) * 100;
            this.progress = per;
            console.log(`Current elapsed time: ${elapsedTime}ms ${per}%`);
            $(".progress-bar").css('width', `${per}%`);
            $(".progress-bar").attr('aria-valuenow', `${per}`);
        }, 500);
    }
}
