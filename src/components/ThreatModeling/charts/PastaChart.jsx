import React from "react";
import BarChart from "@cloudscape-design/components/bar-chart";
import Box from "@cloudscape-design/components/box";

/**
 * PastaChart Component
 *
 * Displays a vertical stacked bar chart showing the distribution of threats across
 * the seven PASTA (Process for Attack Simulation and Threat Analysis) stages,
 * broken down by likelihood level.
 *
 * Features:
 * - Vertical stacked bar chart showing likelihood breakdown
 * - Color-coded by likelihood: High (red), Medium (orange), Low (yellow)
 * - Empty state handling when no threats are categorized
 * - Accessibility support with ARIA labels
 * - Integration with Cloudscape Design System
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Object with stages array and series data
 * @param {Array} props.data.stages - Array of PASTA stage names
 * @param {Array} props.data.series - Array of series objects with likelihood data
 * @returns {JSX.Element} The rendered PASTA stage chart
 */
const PastaChart = ({ data = { stages: [], series: [] } }) => {
  const { stages, series } = data;

  return (
    <BarChart
      series={series}
      xDomain={stages}
      yTitle="Number of Threats"
      xTitle="PASTA Stage"
      horizontalBars={false}
      stackedBars={true}
      empty={
        <Box textAlign="center" color="text-status-inactive" role="status" aria-live="polite">
          No threats mapped to PASTA stages
        </Box>
      }
      ariaLabel="Stacked bar chart showing the distribution of threats across PASTA stages by likelihood"
      ariaDescription="Vertical stacked bar chart displaying threat counts for each of the seven PASTA stages, broken down by likelihood level: High (red), Medium (orange), and Low (yellow)"
      height={300}
      hideFilter
    />
  );
};

/**
 * Custom comparison function for React.memo
 * Only re-render if the data prop has actually changed
 */
const arePropsEqual = (prevProps, nextProps) => {
  const prevStages = prevProps.data?.stages || [];
  const nextStages = nextProps.data?.stages || [];

  if (prevStages.length !== nextStages.length) {
    return false;
  }

  for (let i = 0; i < prevStages.length; i++) {
    if (prevStages[i] !== nextStages[i]) {
      return false;
    }
  }

  // Shallow comparison of series data values
  const prevSeries = prevProps.data?.series || [];
  const nextSeries = nextProps.data?.series || [];
  if (prevSeries.length !== nextSeries.length) {
    return false;
  }
  for (let i = 0; i < prevSeries.length; i++) {
    const prevData = prevSeries[i]?.data || [];
    const nextData = nextSeries[i]?.data || [];
    if (prevData.length !== nextData.length) {
      return false;
    }
    for (let j = 0; j < prevData.length; j++) {
      if (
        prevData[j].x !== nextData[j].x ||
        prevData[j].y !== nextData[j].y
      ) {
        return false;
      }
    }
  }

  return true;
};

// Memoize the component with custom comparison to prevent unnecessary re-renders
export default React.memo(PastaChart, arePropsEqual);
