/**
 * Shared Recharts tooltip prop types used across all chart components.
 * Recharts does not export these types directly, so we define them here.
 */

export interface TooltipPayloadItem {
  name: string;
  value: number | null;
  color: string;
  fill: string;
  dataKey: string;
  payload: Record<string, unknown>;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

/** Generic record type for chart data rows. */
export type ChartDataRow = Record<string, string | number | null | undefined>;

/** Model metrics shape from model_results.json */
export interface PollutantMetrics {
  MAE:  number;
  RMSE: number;
  R2:   number;
  R:    number;
}
