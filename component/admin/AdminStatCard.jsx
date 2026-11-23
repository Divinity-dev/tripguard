import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const AdminStatCard = ({
title,
value,
change,
trend = "up",
icon: Icon,
description,
}) => {
const isPositive = trend === "up";

return ( <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"> <div className="flex items-start justify-between"> <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#63E6BE]/15 text-[#18a875]"> <Icon size={21} /> </div>

    <div
      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
        isPositive
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-600"
      }`}
    >
      {isPositive ? (
        <ArrowUpRight size={13} />
      ) : (
        <ArrowDownRight size={13} />
      )}

      {change}
    </div>
  </div>

  <div className="mt-5">
    <p className="text-sm text-gray-500">{title}</p>

    <h3 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
      {value}
    </h3>

    <p className="mt-1 text-xs text-gray-400">{description}</p>
  </div>
</div>


);
};

export default AdminStatCard;
