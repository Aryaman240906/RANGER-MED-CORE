import time
import random

def simulate_heavy_work(seconds=3):
    # small deterministic-ish delay with a little variance
    time.sleep(seconds + (random.random() * 1.0))
