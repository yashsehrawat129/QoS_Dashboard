 
import time

def apply_qos_policy(protocol, app_type):
    """Simulates an SDN controller applying a QoS policy and prints it to the console."""
    
    policies = {
        "reno": "Applying standard TCP fairness: Increase queue size, mark ECN bits.",
        "cubic": "Applying high-speed TCP policy: Fair queue scheduling and priority adjustments.",
        "bbr": "Applying BBR-aware policy: Dynamic pacing and ECN avoidance.",
        "udp": "Applying real-time policy: Traffic shaping and rate limiting to prevent network saturation."
    }
    
    policy_description = policies.get(protocol, "Applying default forwarding policy.")
    
    print(f"[{time.strftime('%H:%M:%S')}] [SDN Controller] Detected '{app_type}' traffic using '{protocol.upper()}'.")
    print(f"[{time.strftime('%H:%M:%S')}] [SDN Controller] ACTION: {policy_description}")
    
    return policy_description