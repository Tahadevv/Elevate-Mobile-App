import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType<any>;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

export interface ChartContainerProps {
  config: ChartConfig;
  children: React.ReactNode;
  style?: ViewStyle;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  config,
  children,
  style,
}) => {
  return (
    <ChartContext.Provider value={{ config }}>
      <View style={[styles.chartContainer, style]}>
        {children}
      </View>
    </ChartContext.Provider>
  );
};

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any, name: string) => React.ReactNode;
  style?: ViewStyle;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
  style,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <View style={[styles.tooltip, style]}>
      {label && (
        <Text style={styles.tooltipLabel}>{label}</Text>
      )}
      {payload.map((item, index) => (
        <View key={index} style={styles.tooltipItem}>
          <View style={[styles.tooltipIndicator, { backgroundColor: item.color }]} />
          <Text style={styles.tooltipName}>{item.name}</Text>
          <Text style={styles.tooltipValue}>
            {formatter ? formatter(item.value, item.name) : item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export interface ChartLegendProps {
  payload?: any[];
  hideIcon?: boolean;
  style?: ViewStyle;
}

const ChartLegend: React.FC<ChartLegendProps> = ({
  payload,
  hideIcon = false,
  style,
}) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <View style={[styles.legend, style]}>
      {payload.map((item, index) => {
        const itemConfig = config[item.dataKey] || config[item.name];
        const color = item.color || itemConfig?.color;

        return (
          <View key={index} style={styles.legendItem}>
            {!hideIcon && (
              <View style={[styles.legendIcon, { backgroundColor: color }]} />
            )}
            <Text style={styles.legendLabel}>
              {itemConfig?.label || item.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

// Simple Bar Chart Component
export interface BarChartProps {
  data: { name: string; value: number; color?: string }[];
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = screenWidth - 40,
  height = 200,
  style,
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <View style={[styles.barChart, { width, height }, style]}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <View
            style={[
              styles.bar,
              {
                height: (item.value / maxValue) * (height - 60),
                backgroundColor: item.color || "#3b82f6",
              },
            ]}
          />
          <Text style={styles.barLabel}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

// Simple Line Chart Component
export interface LineChartProps {
  data: { name: string; value: number; color?: string }[];
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = screenWidth - 40,
  height = 200,
  style,
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;

  return (
    <View style={[styles.lineChart, { width, height }, style]}>
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * (width - 40);
        const y = height - 60 - ((item.value - minValue) / range) * (height - 60);

        return (
          <View
            key={index}
            style={[
              styles.linePoint,
              {
                left: x,
                top: y,
                backgroundColor: item.color || "#3b82f6",
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tooltip: {
    backgroundColor: "white",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 120,
  },
  tooltipLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  tooltipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tooltipIndicator: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 8,
  },
  tooltipName: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
  },
  tooltipValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendIcon: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 2,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  lineChart: {
    position: "relative",
  },
  linePoint: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});

export {
  BarChart, ChartContainer, ChartLegend, ChartTooltip, LineChart
};

