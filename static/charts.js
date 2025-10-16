document.addEventListener('DOMContentLoaded', () => {
    const protocolSelector = document.getElementById('protocol-selector');
    const appTypeSelector = document.getElementById('app-type-selector');
    const spinner = document.getElementById('loading-spinner');

    // Define colors for each protocol to keep them consistent
    const PROTOCOL_COLORS = {
        reno: { border: 'rgba(24, 119, 242, 1)', background: 'rgba(24, 119, 242, 0.1)' },
        cubic: { border: 'rgba(52, 168, 83, 1)', background: 'rgba(52, 168, 83, 0.1)' },
        bbr: { border: 'rgba(234, 67, 53, 1)', background: 'rgba(234, 67, 53, 0.1)' },
        udp: { border: 'rgba(251, 188, 5, 1)', background: 'rgba(251, 188, 5, 0.1)' }
    };

    // --- Chart.js Global Configuration ---
    Chart.defaults.font.family = "'Roboto', sans-serif";
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.plugins.tooltip.backgroundColor = '#333';
    Chart.defaults.plugins.tooltip.titleFont.size = 14;
    Chart.defaults.plugins.tooltip.bodyFont.size = 12;

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    // --- Initialize Charts ---
    const latencyChart = new Chart(document.getElementById('latencyChart'), { type: 'line', data: { datasets: [] }, options: commonOptions });
    const jitterChart = new Chart(document.getElementById('jitterChart'), { type: 'line', data: { datasets: [] }, options: commonOptions });
    const throughputChart = new Chart(document.getElementById('throughputChart'), { type: 'bar', data: { datasets: [] }, options: commonOptions });
    const packetLossChart = new Chart(document.getElementById('packetLossChart'), { type: 'line', data: { datasets: [] }, options: commonOptions });
    const allCharts = [latencyChart, jitterChart, throughputChart, packetLossChart];

    async function fetchAndUpdateCharts() {
        spinner.style.display = 'flex';

        // 1. Get selected protocols and application type
        const selectedProtocols = Array.from(protocolSelector.querySelectorAll('input:checked')).map(input => input.value);
        const selectedAppType = appTypeSelector.querySelector('input:checked').value;
        
        // Update checkbox UI
        protocolSelector.querySelectorAll('label').forEach(label => {
            const input = label.querySelector('input');
            if (input.checked) {
                label.style.backgroundColor = 'rgba(24, 119, 242, 0.1)';
                label.style.borderColor = 'rgba(24, 119, 242, 1)';
            } else {
                label.style.backgroundColor = 'var(--sidebar-bg)';
                label.style.borderColor = 'var(--border-color)';
            }
        });


        if (selectedProtocols.length === 0) {
            allCharts.forEach(chart => {
                chart.data.labels = [];
                chart.data.datasets = [];
                chart.update();
            });
            spinner.style.display = 'none';
            return;
        }

        // 2. Fetch data for all selected protocols concurrently
        const promises = selectedProtocols.map(protocol =>
            fetch(`/get_metrics?protocol=${protocol}&app_type=${encodeURIComponent(selectedAppType)}`).then(res => res.json())
        );

        const results = await Promise.all(promises);

        // 3. Clear existing datasets
        allCharts.forEach(chart => chart.data.datasets = []);
        const labels = results[0]?.labels || []; // Use labels from the first result

        // 4. Populate new datasets for each chart
        results.forEach((data, index) => {
            const protocol = selectedProtocols[index];
            const color = PROTOCOL_COLORS[protocol] || { border: '#ccc', background: '#ccc' };
            
            latencyChart.data.labels = labels;
            latencyChart.data.datasets.push({
                label: protocol.toUpperCase(),
                data: data.latency,
                borderColor: color.border,
                backgroundColor: color.background,
                tension: 0.3,
                fill: true
            });

            jitterChart.data.labels = labels;
            jitterChart.data.datasets.push({
                label: protocol.toUpperCase(),
                data: data.jitter,
                borderColor: color.border,
                backgroundColor: color.background,
                tension: 0.3,
                fill: true
            });
            
            throughputChart.data.labels = labels;
            throughputChart.data.datasets.push({
                label: protocol.toUpperCase(),
                data: data.throughput,
                backgroundColor: color.border, // For bar charts, background color is the main color
            });

            packetLossChart.data.labels = labels;
            packetLossChart.data.datasets.push({
                label: protocol.toUpperCase(),
                data: data.packet_loss,
                borderColor: color.border,
                backgroundColor: color.background,
                tension: 0.3,
                fill: true
            });
        });

        // 5. Update all charts
        allCharts.forEach(chart => chart.update());
        spinner.style.display = 'none';
    }

    // Attach event listeners
    protocolSelector.addEventListener('change', fetchAndUpdateCharts);
    appTypeSelector.addEventListener('change', fetchAndUpdateCharts);

    // Initial load
    fetchAndUpdateCharts();
});