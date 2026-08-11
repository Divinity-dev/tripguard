"use client";

import {
Area,
AreaChart,
CartesianGrid,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from "recharts";

const revenueData = [
{ month: "Mar", revenue: 420000 },
{ month: "Apr", revenue: 580000 },
{ month: "May", revenue: 720000 },
{ month: "Jun", revenue: 680000 },
{ month: "Jul", revenue: 910000 },
{ month: "Aug", revenue: 1080000 },
];

const formatCurrency = (value) => {
if (value >= 1000000) {
return `₦${(value / 1000000).toFixed(1)}M`;
}

return `₦${(value / 1000).toFixed(0)}K`;
};

const RevenueChart = () => {
return ( <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div> <h2 className="font-semibold text-gray-900">
Revenue Overview </h2>

      <p className="mt-1 text-xs text-gray-500">
        Revenue generated from bookings
      </p>
    </div>

    <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 outline-none focus:border-[#63E6BE]">
      <option>Last 6 months</option>
      <option>Last 12 months</option>
      <option>This year</option>
    </select>
  </div>

  <div className="mt-6 h-[280px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={revenueData}
        margin={{
          top: 10,
          right: 5,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient
            id="revenueGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#63E6BE"
              stopOpacity={0.35}
            />
            <stop
              offset="100%"
              stopColor="#63E6BE"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f1f5f9"
        />

        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 11,
            fill: "#9ca3af",
          }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 11,
            fill: "#9ca3af",
          }}
          tickFormatter={formatCurrency}
          width={55}
        />

        <Tooltip
          formatter={(value) => [
            `₦${Number(value).toLocaleString()}`,
            "Revenue",
          ]}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#63E6BE"
          strokeWidth={3}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>

);
};

export default RevenueChart;
