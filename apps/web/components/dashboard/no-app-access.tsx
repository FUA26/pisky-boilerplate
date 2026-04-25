import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export function NoAppAccess() {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>No App Access</CardTitle>
        <CardDescription>
          You do not have access to any apps. Ask an administrator to grant
          access.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Once access is granted, your available apps will appear here.
      </CardContent>
    </Card>
  )
}
