import RollTrendsData from "./RollTrendsData";

export default interface RollTrendsLineChartProps {
  data: RollTrendsData;
  title: string;
  filters?: boolean;
}
