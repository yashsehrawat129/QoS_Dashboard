from flask import Flask, render_template, jsonify, request
import data_simulation
import sdn_controller

app = Flask(__name__)

# A dictionary to map protocol names from the request to the simulation functions
SIMULATORS = {
    "reno": data_simulation.simulate_reno,
    "cubic": data_simulation.simulate_cubic,
    "bbr": data_simulation.simulate_bbr,
    "udp": data_simulation.simulate_udp
}

@app.route('/')
def index():
    """Renders the main dashboard page."""
    return render_template('index.html')

@app.route('/get_metrics')
def get_metrics():
    """API endpoint to fetch simulated network metrics."""
    protocol = request.args.get('protocol', 'bbr').lower()
    app_type = request.args.get('app_type', 'Video Streaming').lower()

    # Get the correct simulation function from the dictionary
    simulation_function = SIMULATORS.get(protocol, data_simulation.simulate_bbr)
    
    # Generate the data
    data = simulation_function()
    
    # Simulate applying an SDN QoS policy (prints to console)
    sdn_controller.apply_qos_policy(protocol, app_type)
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)