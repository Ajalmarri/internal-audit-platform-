import type React from "react"
import { Avatar, Card, CardContent, Typography, Box, Chip } from "@mui/material"

interface TeamMember {
  id: string
  name: string
  role: string
  avatarUrl: string
}

interface AssignedTeamCardProps {
  teamMembers: TeamMember[]
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "assignment-1", // Updated ID to match audit plan assignment ID
    name: "Alice Smith",
    role: "Lead Auditor",
    avatarUrl: "/images/avatars/avatar-alice.jpg",
  },
  {
    id: "assignment-2", // Updated ID to match audit plan assignment ID
    name: "Bob Johnson",
    role: "Auditor",
    avatarUrl: "/images/avatars/avatar-bob.jpg",
  },
  {
    id: "assignment-3", // Updated ID to match audit plan assignment ID
    name: "Charlie Brown",
    role: "Auditor",
    avatarUrl: "/images/avatars/avatar-charlie.jpg",
  },
]

const AssignedTeamCard: React.FC<AssignedTeamCardProps> = ({ teamMembers = mockTeamMembers }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Assigned Team
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {teamMembers.map((member) => (
            <Box key={member.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar alt={member.name} src={member.avatarUrl} />
              <Box>
                <Typography variant="subtitle1">{member.name}</Typography>
                <Chip label={member.role} size="small" />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default AssignedTeamCard
