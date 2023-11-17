import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import React from "react";

function TableSkeleton() {
  return (
    <div
      style={{
        height: "13em",
        width: "92%",
        backgroundColor: "rgba(4, 4, 5, 0.675)",
        color: "white",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
      className="box-shadow2 elemento-com-scroll-vertical mx-auto mb-5 border-2 border-none rounded-xl"
    >
      <Table className="max-h-60 w-10/12 mt-5">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[110px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[110px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[110px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[110px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[110px]" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <Skeleton className="h-12 w-12 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <Skeleton className="h-12 w-12 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <Skeleton className="h-12 w-12 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default TableSkeleton;
