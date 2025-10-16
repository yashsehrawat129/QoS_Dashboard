 
document.addEventListener('DOMContentLoaded', () => {
    const protocolSelect = document.getElementById('protocol-select');
    const appSelect = document.getElementById('app-select');
    const spinner = document.getElementById('loading-spinner');

    // Chart.js global configuration
    Chart.defaults.color = '#c0c0c0';
    Chart.defaults.borderColor = 'rgba(233, 69, 96, 0.2)';

    const chartOptions = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false }
        },
        scales: {
            x: {
                grid: { color: 'rgba(192, 192, 192, 0.1)' },
                ticks: { color: '#c0c0c0' }
            },
            y: {
                grid: { color: 'rgba(192, 192, 192, 0.1)' },
                ticks: { color: '#c0c0c0' },
                beginAtZero: true
            }
        },
        animation: {
            duration: 400,
            easing: 'easeInOutQuad'
        }
    });
    
    const lineChartConfig = (label, color) => ({
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: `${color}33`, // Add alpha for fill
                fill: true,
                tension: 0.3
            }]
        },
        options: chartOptions(label)
    });

    // Initialize charts
    const latencyChart = new Chart(document.getElementById('latencyChart'), lineChartConfig('Latency', '#e94560'));
    const jitterChart = new Chart(document.getElementById('jitterChart'), lineChartConfig('Jitter', '#5372f0'));
    const throughputChart = new Chart(document.getElementById('throughputChart'), lineChartConfig('Throughput', '#34d399'));
    const packetLossChart = new Chart(document.getElementById('packetLossChart'), lineChartConfig('Packet Loss', '#f59e0b'));

    const charts = [latencyChart, jitterChart, throughputChart, packetLossChart];

    async function fetchAndUpdateCharts() {
        const protocol = protocolSelect.value;
        const appType = appSelect.value;
        
        spinner.style.display = 'block';

        try {
            const response = await fetch(`/get_metrics?protocol=${protocol}&app_type=${encodeURIComponent(appType)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Update chart data
            latencyChart.data.labels = data.labels;
            latencyChart.data.datasets[0].data = data.latency;
            
            jitterChart.data.labels = data.labels;
            jitterChart.data.datasets[0].data = data.jitter;

            throughputChart.data.labels = data.labels;
            throughputChart.data.datasets[0].data = data.throughput;

            packetLossChart.data.labels = data.labels;
            packetLossChart.data.datasets[0].data = data.packet_loss;

            // Update all charts
            charts.forEach(chart => chart.update());

        } catch (error) {
            console.error("Failed to fetch metrics:", error);
        } finally {
            spinner.style.display = 'none';
        }
    }

    // Event listeners for dropdowns
    protocolSelect.addEventListener('change', fetchAndUpdateCharts);
    appSelect.addEventListener('change', fetchAndUpdateCharts);

    // Initial data load
    fetchAndUpdateCharts();
});