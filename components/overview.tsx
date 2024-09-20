"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { FaWindows, FaApple, FaLinux } from "react-icons/fa";

interface OverviewProps {
  data: { name: string; total: number }[];
}

export function Overview({ data }: OverviewProps) {
  const { theme } = useTheme();
  const barColor = theme === "dark" ? "#ffffff" : "#000000";
  const textColor = theme === "dark" ? "#ffffff" : "#000000";

  const aggregatedData = [
    { name: "Linux", total: data.filter(item => item.name.includes("Linux")).reduce((sum, item) => sum + item.total, 0), icon: FaLinux },
    { name: "Windows", total: data.filter(item => item.name.includes("Windows")).reduce((sum, item) => sum + item.total, 0), icon: FaWindows },
    { name: "macOS", total: data.filter(item => item.name.includes("Mac")).reduce((sum, item) => sum + item.total, 0), icon: FaApple },
  ].sort((a, b) => b.total - a.total);

  const CustomXAxisTick = ({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
    const Icon = aggregatedData.find(item => item.name === payload.value)?.icon;
    return (
      <g transform={`translate(${x},${y})`}>
        {Icon && <Icon x={-12} y={0} size={24} fill={textColor} />}
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={aggregatedData} margin={{ left: 20, right: 20, top: 20, bottom: 40 }}>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={(props) => <CustomXAxisTick {...props} />}
          interval={0}
        />
        <YAxis type="number" stroke={textColor} />
        <Bar
          dataKey="total"
          fill={barColor}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
