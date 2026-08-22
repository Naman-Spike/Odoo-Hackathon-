import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

export const Table = React.forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-xl shadow-liquid-card">
      <table ref={ref} className={classNames("w-full caption-bottom text-xs text-zinc-800", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={classNames("[&_tr]:border-b bg-zinc-50/80 text-[11px] uppercase tracking-wider font-bold text-zinc-500 border-b border-zinc-200/80", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={classNames("[&_tr:last-child]:border-0 divide-y divide-zinc-100", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={classNames("border-b border-zinc-100 transition-colors hover:bg-zinc-50/70 data-[state=selected]:bg-zinc-100", className)}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={classNames("h-11 px-4 text-left align-middle font-bold text-zinc-500 [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={classNames("py-3.5 px-4 align-middle text-zinc-700 [&:has([role=checkbox])]:pr-0", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";
