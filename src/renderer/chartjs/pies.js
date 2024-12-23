const Chart = require('chart.js/auto'); // Import Chart.js
const {getRandomBoldRGBA} = require('../util');
const $ = require('jquery');


class AccountDoughnutChart {
    constructor(id) {
        this.id = id; // ID of the canvas element
        this.chart = null; // Placeholder for the chart instance
        this.data = {
            labels: ['Equities', 'Crypto', 'Cash'], // Updated to 3 data points
            datasets: [{
                label: 'Dataset',
                data: [12], // Corresponding data points
                backgroundColor: [
                    getRandomBoldRGBA(.6),
                    getRandomBoldRGBA(.6),
                    getRandomBoldRGBA(.6),
                ],
                borderColor: [
                    'rgba(255, 255, 255, .5)',
                ],
                borderWidth: 1
            }]
        };

        this.options = {
            responsive: true,
            maintainAspectRatio: false, // Allow flexible aspect ratio
            layout: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            },
            plugins: {
                legend: {
                    position: 'left', // Move legend to the right
                    labels: {
                        usePointStyle: true, // Use custom points
                        pointStyle: 'circle', // Style of points
                        boxWidth: 10, // Thin dots (width)
                        boxHeight: 5, // Thin dots (height)
                        padding: 5, // Space between legend items
                    }
                },
                tooltip: {
                    enabled: true
                }
            },
            cutout: '60%', // Make the doughnut thinner
        };

        this.render();
    }


    updateLabels(newLabels) {
        // Update the labels dynamically
        this.chart.data.labels = newLabels;
        this.chart.update(); // Re-render the chart
    }

    updateData(newData) {
        // Update the data dynamically
        this.chart.data.datasets[0].data = newData;
        this.chart.update(); // Re-render the chart
    }

    render() {
        const ctx = document.getElementById(this.id).getContext("2d");
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: this.data,
            options: this.options
        });
    }
}

class PositionsPieChart {
    constructor(id) {
        this.id = id; // ID of the canvas element
        this.chart = null; // Placeholder for the chart instance
        this.data = {
            labels: [], // Updated to 3 data points
            datasets: []
        };

        this.options = {
            responsive: true,
            maintainAspectRatio: false, // Allow flexible aspect ratio
            layout: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            },
            plugins: {
                legend: {
                    position: 'right', // Move legend to the right
                    labels: {
                        usePointStyle: false, // Use custom points
                        boxWidth: 10, // Thin dots (width)
                        boxHeight: 5, // Thin dots (height)
                        padding: 5, // Space between legend items
                    }
                },
                tooltip: {
                    enabled: true
                }
            },
            // cutout: '60%', // Make the doughnut thinner
        };

        this.render();
    }

    update(data){
        this.chart.data.datasets = data;
        this.chart.update();
    }
      
    render() {
        const ctx = document.getElementById(this.id).getContext("2d");
        this.chart = new Chart(ctx, {
            type: 'pie',
            data: this.data,
            options: this.options
        });
    }
}

module.exports = {
    AccountDoughnutChart: AccountDoughnutChart,
    PositionsPieChart: PositionsPieChart
};
