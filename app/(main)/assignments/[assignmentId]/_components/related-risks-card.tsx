import type React from "react"
import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material"

interface Risk {
  id: string
  title: string
  description: string
  controls: {
    id: string
    name: string
  }[]
}

interface RelatedRisksCardProps {
  assignmentId: string
}

const mockRelatedRisks: Risk[] = [
  {
    id: "risk-101", // Updated risk ID to align with audit plan IDs
    title: "Financial Misstatement",
    description: "Risk of material misstatement in financial reporting due to inadequate internal controls.",
    controls: [
      { id: "control-201", name: "Segregation of Duties" }, // Updated control ID to align with audit plan IDs
      { id: "control-202", name: "Management Review" }, // Updated control ID to align with audit plan IDs
    ],
  },
  {
    id: "risk-102", // Updated risk ID to align with audit plan IDs
    title: "IT Security Breach",
    description: "Risk of unauthorized access to sensitive data due to weak IT security measures.",
    controls: [
      { id: "control-203", name: "Access Controls" }, // Updated control ID to align with audit plan IDs
      { id: "control-204", name: "Intrusion Detection System" }, // Updated control ID to align with audit plan IDs
    ],
  },
]

const RelatedRisksCard: React.FC<RelatedRisksCardProps> = ({ assignmentId }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          Related Risks
        </Typography>
        <List>
          {mockRelatedRisks.map((risk) => (
            <ListItem key={risk.id}>
              <ListItemText
                primary={risk.title}
                secondary={
                  <>
                    {risk.description}
                    <Typography variant="subtitle2">Controls:</Typography>
                    <List dense>
                      {risk.controls.map((control) => (
                        <ListItem key={control.id}>
                          <ListItemText primary={control.name} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default RelatedRisksCard
