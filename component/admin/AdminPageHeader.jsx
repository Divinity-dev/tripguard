import { Plus, Download } from "lucide-react";

const AdminPageHeader = ({
title,
description,
actionLabel,
onAction,
showAction = false,
showExport = false,
onExport,
}) => {
return ( <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div> <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
{title} </h1>

    {description && (
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    )}
  </div>

  <div className="flex flex-wrap items-center gap-2">
    {showExport && (
      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        <Download size={17} />
        Export
      </button>
    )}

    {showAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#63E6BE] px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-[#4fd9ad]"
      >
        <Plus size={17} />
        {actionLabel}
      </button>
    )}
  </div>
</div>

);
};

export default AdminPageHeader;
