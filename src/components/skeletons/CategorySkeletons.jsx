import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export const StatCardSkeleton = () => (
  <div className="rounded-lg border border-slate-200 bg-white p-4">
    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
    <div className="mt-3 h-8 w-20 animate-pulse rounded bg-slate-200" />
  </div>
);

export const CategoryTableSkeleton = ({ rows = 8 }) => (
  <Table>
    <TableBody>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow key={idx}>
          <TableCell>
            <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-14 animate-pulse rounded bg-slate-200" />
          </TableCell>
          <TableCell>
            <div className="ml-auto h-8 w-24 animate-pulse rounded bg-slate-200" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
