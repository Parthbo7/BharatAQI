"""
BharatAQI — Data Loader & Preprocessing Pipeline
==================================================
Loads satellite and ground truth CSVs, merges them by state+date,
creates sliding-window temporal sequences for the LSTM, and splits
into train/val/test sets with proper normalization.
"""

import os
import csv
import math
import random
from datetime import datetime

random.seed(42)

# Feature columns from satellite database
SATELLITE_FEATURES = [
    "no2_col", "so2_col", "co_col", "o3_col", "hcho_col",
    "aod", "temp_era5", "humidity_era5", "wind_speed_era5",
    "wind_u_era5", "wind_v_era5", "fire_count"
]

# Target columns from ground truth
TARGET_COLUMNS = ["pm25", "pm10", "no2", "so2", "co", "aqi"]

SEQUENCE_LENGTH = 7  # 7-day lookback window


def load_csv(filepath):
    """Load a CSV file into a list of dictionaries."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Data file not found: {filepath}")

    with open(filepath, "r") as f:
        reader = csv.DictReader(f)
        return list(reader)


def safe_float(val, default=0.0):
    """Safely convert a value to float."""
    if val is None or val == "" or val == "None":
        return default
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


def merge_datasets(satellite_path, ground_truth_path):
    """
    Merge satellite and ground truth data by state_id and date.

    For each ground truth record, find the matching satellite record
    (same state, same month) and create a combined feature vector.
    """
    sat_data = load_csv(satellite_path)
    gt_data = load_csv(ground_truth_path)

    print(f"  Satellite records: {len(sat_data)}")
    print(f"  Ground truth records: {len(gt_data)}")

    # Index satellite data by (state_id, year-month)
    sat_index = {}
    for row in sat_data:
        date_str = row["date"]
        year_month = date_str[:7]  # "2023-01"
        key = (row["state_id"], year_month)
        sat_index[key] = row

    # Merge
    merged = []
    matched = 0
    for gt_row in gt_data:
        date_str = gt_row["date"]
        year_month = date_str[:7]
        state_id = gt_row["state_id"]
        key = (state_id, year_month)

        sat_row = sat_index.get(key)
        if sat_row is None:
            continue

        matched += 1
        record = {
            "date": date_str,
            "state_id": state_id,
            "station": gt_row.get("station", ""),
            "city": gt_row.get("city", ""),
            "lat": safe_float(gt_row.get("lat")),
            "lon": safe_float(gt_row.get("lon")),
        }

        # Add satellite features
        for feat in SATELLITE_FEATURES:
            record[feat] = safe_float(sat_row.get(feat))

        # Add ground truth targets
        for target in TARGET_COLUMNS:
            record[target] = safe_float(gt_row.get(target))

        merged.append(record)

    print(f"  Merged records: {len(merged)} (matched {matched})")
    return merged


class StandardScaler:
    """Simple standard scaler (zero mean, unit variance)."""

    def __init__(self):
        self.means = []
        self.stds = []

    def fit(self, data):
        """Compute mean and std from data (list of lists)."""
        n_features = len(data[0])
        self.means = [0.0] * n_features
        self.stds = [1.0] * n_features

        for f in range(n_features):
            values = [row[f] for row in data]
            mean = sum(values) / len(values)
            variance = sum((v - mean) ** 2 for v in values) / len(values)
            std = math.sqrt(variance) if variance > 0 else 1.0
            self.means[f] = mean
            self.stds[f] = std

        return self

    def transform(self, data):
        """Normalize data using fitted parameters."""
        result = []
        for row in data:
            normalized = [(row[f] - self.means[f]) / self.stds[f] for f in range(len(row))]
            result.append(normalized)
        return result

    def fit_transform(self, data):
        self.fit(data)
        return self.transform(data)

    def inverse_transform_targets(self, data, target_indices):
        """Inverse transform specific target columns."""
        result = []
        for row in data:
            inv = []
            for i, idx in enumerate(target_indices):
                inv.append(row[i] * self.stds[idx] + self.means[idx])
            result.append(inv)
        return result


def create_sequences(features, targets, seq_length=SEQUENCE_LENGTH):
    """
    Create sliding-window sequences for the LSTM.

    Given features [N, F] and targets [N, T], produces:
      X: [N - seq_length, seq_length, F]  — input sequences
      y: [N - seq_length, T]              — target values (at end of window)
    """
    X, y = [], []
    for i in range(len(features) - seq_length):
        X.append(features[i:i + seq_length])
        y.append(targets[i + seq_length])
    return X, y


def prepare_data(data_dir=None):
    """
    Full data preparation pipeline.

    Returns:
    --------
    (X_train, y_train), (X_val, y_val), (X_test, y_test),
    feature_scaler, target_scaler, raw_merged_data
    """
    if data_dir is None:
        data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data")

    satellite_path = os.path.join(data_dir, "satellite_database.csv")
    ground_truth_path = os.path.join(data_dir, "ground_truth_cpcb.csv")

    print("\n--- Data Loading & Preprocessing ---")

    # Step 1: Merge datasets
    merged = merge_datasets(satellite_path, ground_truth_path)

    if not merged:
        raise ValueError("No merged records. Ensure both CSVs exist and have matching state_ids.")

    # Step 2: Sort by date and station for temporal consistency
    merged.sort(key=lambda x: (x["state_id"], x["station"], x["date"]))

    # Step 3: Extract feature and target arrays
    raw_features = []
    raw_targets = []
    for record in merged:
        feat_vec = [record[f] for f in SATELLITE_FEATURES]
        target_vec = [record[t] for t in TARGET_COLUMNS]
        raw_features.append(feat_vec)
        raw_targets.append(target_vec)

    print(f"  Feature vector size: {len(SATELLITE_FEATURES)}")
    print(f"  Target vector size: {len(TARGET_COLUMNS)}")

    # Step 4: Normalize
    feature_scaler = StandardScaler()
    norm_features = feature_scaler.fit_transform(raw_features)

    target_scaler = StandardScaler()
    norm_targets = target_scaler.fit_transform(raw_targets)

    # Step 5: Create sliding window sequences
    X, y = create_sequences(norm_features, norm_targets, seq_length=SEQUENCE_LENGTH)
    print(f"  Total sequences (window={SEQUENCE_LENGTH}): {len(X)}")

    # Step 6: Split into train (70%), val (15%), test (15%)
    n = len(X)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)

    X_train, y_train = X[:train_end], y[:train_end]
    X_val, y_val = X[train_end:val_end], y[train_end:val_end]
    X_test, y_test = X[val_end:], y[val_end:]

    print(f"  Train: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")

    return (X_train, y_train), (X_val, y_val), (X_test, y_test), \
           feature_scaler, target_scaler, merged


if __name__ == "__main__":
    print("=" * 60)
    print("  BHARAT AQI — DATA LOADER TEST")
    print("=" * 60)
    try:
        (X_train, y_train), (X_val, y_val), (X_test, y_test), \
            f_scaler, t_scaler, raw = prepare_data()
        print(f"\n[OK] Pipeline ready. Sample input shape: [{len(X_train[0])}, {len(X_train[0][0])}]")
    except FileNotFoundError as e:
        print(f"\n[ERROR] {e}")
        print("Run gee_extractor.py and cpcb_ground_truth.py first to generate data.")
