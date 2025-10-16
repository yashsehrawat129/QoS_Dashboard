 
import numpy as np

def generate_base_data(points=30):
    """Generates a common time-series label array."""
    return [i for i in range(1, points + 1)]

def simulate_reno(points=30):
    """Simulates TCP Reno: classic sawtooth pattern."""
    throughput = 50 + np.cumsum(np.random.randn(points) * 5)
    throughput = np.clip(throughput, 20, 100)
    # Introduce sawtooth drops
    for i in range(3, points, 8):
        throughput[i:] -= np.random.uniform(15, 25)
        throughput = np.clip(throughput, 20, 100)

    latency = 80 + np.random.uniform(-15, 15, points) + (100 - throughput) * 0.2
    jitter = np.abs(np.diff(latency, prepend=latency[0])) + np.random.uniform(1, 5, points)
    packet_loss = np.clip(0.5 + (100 - throughput) * 0.05 + np.random.uniform(-0.2, 0.2, points), 0.1, 5)

    return {
        "labels": generate_base_data(points),
        "latency": list(np.round(latency, 2)),
        "jitter": list(np.round(jitter, 2)),
        "throughput": list(np.round(throughput, 2)),
        "packet_loss": list(np.round(packet_loss, 2))
    }

def simulate_cubic(points=30):
    """Simulates TCP Cubic: more stable and aggressive than Reno."""
    throughput = 75 + np.cumsum(np.random.randn(points) * 2)
    throughput = np.clip(throughput, 60, 150)
    latency = 40 + np.random.uniform(-5, 5, points)
    jitter = np.abs(np.diff(latency, prepend=latency[0])) + np.random.uniform(0.5, 3, points)
    packet_loss = np.clip(0.2 + (150 - throughput) * 0.02 + np.random.uniform(-0.1, 0.1, points), 0, 2)

    return {
        "labels": generate_base_data(points),
        "latency": list(np.round(latency, 2)),
        "jitter": list(np.round(jitter, 2)),
        "throughput": list(np.round(throughput, 2)),
        "packet_loss": list(np.round(packet_loss, 2))
    }

def simulate_bbr(points=30):
    """Simulates Google BBR: high throughput, low latency."""
    throughput = 180 + np.cumsum(np.random.randn(points) * 1.5)
    throughput = np.clip(throughput, 150, 250)
    latency = 20 + np.random.uniform(-3, 3, points)
    jitter = np.abs(np.diff(latency, prepend=latency[0])) + np.random.uniform(0.1, 1.5, points)
    packet_loss = np.random.uniform(0, 0.2, points) # BBR avoids loss

    return {
        "labels": generate_base_data(points),
        "latency": list(np.round(latency, 2)),
        "jitter": list(np.round(jitter, 2)),
        "throughput": list(np.round(throughput, 2)),
        "packet_loss": list(np.round(packet_loss, 2))
    }

def simulate_udp(points=30):
    """Simulates UDP: high throughput, high variability."""
    throughput = 200 + np.random.uniform(-50, 20, points)
    throughput = np.clip(throughput, 50, 250)
    latency = 60 + np.random.uniform(-25, 25, points)
    jitter = np.abs(np.diff(latency, prepend=latency[0])) + np.random.uniform(5, 20, points)
    packet_loss = np.random.uniform(2, 10, points) # UDP is lossy

    return {
        "labels": generate_base_data(points),
        "latency": list(np.round(latency, 2)),
        "jitter": list(np.round(jitter, 2)),
        "throughput": list(np.round(throughput, 2)),
        "packet_loss": list(np.round(packet_loss, 2))
    }