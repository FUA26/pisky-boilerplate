import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton"

export function PermissionsTableSkeleton() {
  return <DataTableSkeleton columnCount={5} rowCount={6} filterCount={2} />
}
