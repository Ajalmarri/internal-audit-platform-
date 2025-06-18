import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserStub } from "../_types/assignment-types"

interface AssignedTeamCardProps {
  teamMembers: UserStub[]
}

export default function AssignedTeamCard({ teamMembers }: AssignedTeamCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assigned Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{member.name}</p>
              {/* Could add role here if available */}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No team members assigned.</p>
        )}
      </CardContent>
    </Card>
  )
}
