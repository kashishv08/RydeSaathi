base_price = {
    "MINI": 50,
    "SEDAN": 100,
    "SUV": 150,
}

dis_per_km = 12
dur_per_min = 2

def cal_fare(vehicle_type, distance_km, duration_min):
    base = base_price.get(vehicle_type, base_price["MINI"])
    return round(base + (distance_km * dis_per_km) + (duration_min * dur_per_min), 2)