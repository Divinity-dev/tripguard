"use client";

import {
CheckCircle2,
Clock3,
Eye,
FileCheck2,
MoreHorizontal,
XCircle,
} from "lucide-react";

const statusStyles = {
Pending: "bg-amber-50 text-amber-600",
Approved: "bg-emerald-50 text-emerald-600",
Rejected: "bg-red-50 text-red-600",
};

const statusIcons = {
Pending: Clock3,
Approved: CheckCircle2,
Rejected: XCircle,
};

const VerificationTable = ({
verifications = [],
onView,
onApprove,
onReject,
showActions = true,
}) => {
return ( <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"> <div className="overflow-x-auto"> <table className="w-full min-w-[850px]"> <thead> <tr className="border-b border-gray-100 bg-gray-50/70"> <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
Applicant </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Document
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Submitted
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Status
          </th>

          {showActions && (
            <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Action
            </th>
          )}
        </tr>
      </thead>

      <tbody>
        {verifications.length > 0 ? (
          verifications.map((verification) => {
            const StatusIcon =
              statusIcons[verification.status] || Clock3;

            const statusClass =
              statusStyles[verification.status] ||
              "bg-gray-100 text-gray-600";

            return (
              <tr
                key={verification.id}
                className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                      {verification.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {verification.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {verification.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FileCheck2 size={15} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {verification.documentType}
                      </p>

                      <p className="text-xs text-gray-400">
                        {verification.documentNumber}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {verification.submittedAt}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
                  >
                    <StatusIcon size={12} />
                    {verification.status}
                  </span>
                </td>

                {showActions && (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(verification)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#159669] hover:bg-[#63E6BE]/10"
                        >
                          <Eye size={14} />
                          Review
                        </button>
                      )}

                      {verification.status === "Pending" && (
                        <>
                          {onApprove && (
                            <button
                              type="button"
                              onClick={() =>
                                onApprove(verification)
                              }
                              className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-50"
                              aria-label={`Approve ${verification.name}`}
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}

                          {onReject && (
                            <button
                              type="button"
                              onClick={() =>
                                onReject(verification)
                              }
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                              aria-label={`Reject ${verification.name}`}
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </>
                      )}

                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label={`More actions for ${verification.name}`}
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={showActions ? 5 : 4}
              className="px-5 py-12 text-center"
            >
              <FileCheck2 className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-3 text-sm font-medium text-gray-700">
                No verification requests
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Verification requests will appear here when users
                submit their documents.
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

);
};

export default VerificationTable;
