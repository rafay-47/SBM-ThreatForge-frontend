import React from "react";
import BarChart from "@cloudscape-design/components/bar-chart";
import Box from "@cloudscape-design/components/box";

/**
 * StrideChart Component
 *
 * Displays a vertical stacked bar chart showing the distribution of threats across
 * the six STRIDE categories (Spoofing, Tampering, Repudiation, Information Disclosure,
 * Denial of Service, and Elevation of Privilege), broken down by likelihood level.
 *
 * Features:
 * - Vertical stacked bar chart showing likelihood breakdown
 * - Color-coded by likelihood: High (red), Medium (orange), Low (blue)
 * - Empty state handling when no threats are categorized
 * - Accessibility support with ARIA labels
 * - Integration with Cloudscape Design System
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Object with categories array and series data
 * @param {Array} props.data.categories - Array of STRIDE category names
 * @param {Array} props.data.series - Array of series objects with likelihood data
 * @returns {JSX.Element} The rendered STRIDE category chart
 */
const StrideChart = ({ data = { categories: [], series: [] } }) => {
  const { categories, series } = data;

  return (
    <BarChart
      series={series}
      xDomain={categories}
      yTitle="STRIDE Category"
      xTitle="Number of Threats"
      horizontalBars={true}
      stackedBars={true}
      empty={
        <Box textAlign="center" color="text-status-inactive" role="status" aria-live="polite">
          No threats categorized
        </Box>
      }
      ariaLabel="Stacked bar chart showing the distribution of threats across STRIDE categories by likelihood"
      ariaDescription="Horizontal stacked bar chart displaying threat counts for each of the six STRIDE categories, broken down by likelihood level: High (red), Medium (orange), and Low (blue)"
      height={350}
      hideFilter
    />
  );
};

/**
 * Custom comparison function for React.memo
 * Only re-render if the data prop has actually changed
 */
const arePropsEqual = (prevProps, nextProps) => {
  const prevCategories = prevProps.data?.categories || [];
  const nextCategories = nextProps.data?.categories || [];

  if (prevCategories.length !== nextCategories.length) {
    return false;
  }

  for (let i = 0; i < prevCategories.length; i++) {
    if (prevCategories[i] !== nextCategories[i]) {
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
export default React.memo(StrideChart, arePropsEqual);
