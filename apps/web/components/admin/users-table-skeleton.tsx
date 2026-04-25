import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton"

export function UsersTableSkeleton() {
  return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={1} />
}
