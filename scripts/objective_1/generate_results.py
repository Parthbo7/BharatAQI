"""
BharatAQI — Full Objective-1 Pipeline Orchestrator
====================================================
Runs the complete Objective-1 pipeline end-to-end:

  Step 1: Generate satellite multi-pollutant database (GEE or synthetic fallback)
  Step 2: Generate CPCB ground truth database
  Step 3: Train CNN-LSTM deep learning model
  Step 4: Validate and export results to frontend

Usage:
    cd scripts/objective_1
    python generate_results.py
    python generate_results.py --epochs 100 --batch-size 64
"""

import os
import sys
import time
import argparse

sys.path.insert(0, os.path.dirname(__file__))


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="BharatAQI Objective-1 Full Pipeline"
    )
    parser.add_argument(
        "--epochs", type=int, default=50,
        help="Training epochs (default: 50)",
    )
    parser.add_argument(
        "--batch-size", type=int, default=32,
        help="Mini-batch size, TensorFlow only (default: 32)",
    )
    return parser.parse_args()


def main():
    args = _parse_args()
    t_start = time.time()

    print("=" * 60)
    print("  BHARAT AQI — OBJECTIVE-1 FULL PIPELINE")
    print("  Surface AQI Development using Satellite Data")
    print("=" * 60)

    # ------------------------------------------------------------------
    # Step 1: Satellite database
    # ------------------------------------------------------------------
    print("\n" + "=" * 60)
    print("  STEP 1: Satellite Multi-Pollutant Database")
    print("=" * 60)

    from gee_extractor import run_gee_extraction
    run_gee_extraction(start_date="2023-01-01", end_date="2023-12-31", monthly=True)

    # ------------------------------------------------------------------
    # Step 2: CPCB ground truth database
    # ------------------------------------------------------------------
    print("\n" + "=" * 60)
    print("  STEP 2: CPCB Ground Truth Database")
    print("=" * 60)

    from cpcb_ground_truth import generate_ground_truth
    generate_ground_truth(start_date="2023-01-01", end_date="2023-12-31")

    # ------------------------------------------------------------------
    # Step 3 & 4: Train model and export results
    # ------------------------------------------------------------------
    print("\n" + "=" * 60)
    print("  STEP 3 & 4: CNN-LSTM Training & Validation")
    print("=" * 60)

    from train import run_training
    results = run_training(epochs=args.epochs, batch_size=args.batch_size)

    # ------------------------------------------------------------------
    # Summary
    # ------------------------------------------------------------------
    elapsed = time.time() - t_start
    print("\n" + "=" * 60)
    print("  PIPELINE COMPLETE")
    print("=" * 60)
    print(f"\n  Total elapsed time : {elapsed / 60:.1f} min")
    print(f"\n  Model Metrics (AQI):")
    for k, v in results["metrics"].items():
        print(f"    {k}: {v}")

    if "per_pollutant_metrics" in results:
        print(f"\n  Per-pollutant summary:")
        for poll, m in results["per_pollutant_metrics"].items():
            if m:
                print(f"    {poll:<8} R²={m.get('R2', '?')}  RMSE={m.get('RMSE', '?')}")

    print(f"\n  Files generated:")
    print(f"    data/satellite_database.csv")
    print(f"    data/ground_truth_cpcb.csv")
    print(f"    src/lib/model_results.json")
    print(f"\n  Run 'npm run dev' to see the updated dashboard.")


if __name__ == "__main__":
    main()
