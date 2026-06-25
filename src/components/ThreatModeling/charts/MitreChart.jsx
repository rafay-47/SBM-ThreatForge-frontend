import React from "react";
import BarChart from "@cloudscape-design/components/bar-chart";
import Box from "@cloudscape-design/components/box";

/**
 * MitreChart Component
 *
 * Displays a horizontal stacked bar chart showing the distribution of threats across
 * MITRE ATT&CK tactics, broken down by likelihood level. Horizontal bars are used
 * because the 14 tactic names are long and benefit from the extra label width.
 *
 * Features:
 * - Horizontal stacked bar chart showing likelihood breakdown
 * - Color-coded by likelihood: High (red), Medium (orange), Low (yellow)
 * - Empty state handling when no threats are mapped to MITRE tactics
 * - Accessibility support with ARIA labels
 * - Integration with Cloudscape Design System
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Object with tactics array and series data
 * @param {Array} props.data.tactics - Array of MITRE ATT&CK tactic names
 * @param {Array} props.data.series - Array of series objects with likelihood data
 * @returns {JSX.Element} The rendered MITRE ATT&CK tactic chart
 */
const MitreChart = ({ data = { tactics: [], series: [] } }) => {
  const { tactics, series } = data;

  return (
    <BarChart
      series={series}
      xDomain={tactics}
      yTitle="MITRE ATT&CK Tactic"
      xTitle="Number of Threats"
      horizontalBars={true}
      stackedBars={true}
      empty={
        <Box textAlign="center" color="text-status-inactive" role="status" aria-live="polite">
          No threats mapped to MITRE ATT&CK tactics
        </Box>
      }
      ariaLabel="Stacked bar chart showing the distribution of threats across MITRE ATT&CK tactics by likelihood"
      ariaDescription="Horizontal stacked bar chart displaying threat counts for each MITRE ATT&CK tactic, broken down by likelihood level: High (red), Medium (orange), and Low (yellow)"
      height={450}
      hideFilter
    />
  );
};

/**
 * Custom comparison function for React.memo
 * Only re-render if the data prop has actually changed
 */
const arePropsEqual = (prevProps, nextProps) => {
  const prevTactics = prevProps.data?.tactics || [];
  const nextTactics = nextProps.data?.tactics || [];

  if (prevTactics.length !== nextTactics.length) {
    return false;
  }

  for (let i = 0; i < prevTactics.length; i++) {
    if (prevTactics[i] !== nextTactics[i]) {
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
      if (prevData[j].x !== nextData[j].x || prevData[j].y !== nextData[j].y) {
        return false;
      }
    }
  }

  return true;
};

// Memoize the component with custom comparison to prevent unnecessary re-renders
export default React.memo(MitreChart, arePropsEqual);
