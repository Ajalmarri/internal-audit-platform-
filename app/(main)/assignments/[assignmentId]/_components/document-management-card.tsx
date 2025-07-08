"use client"

import type React from "react"
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, IconButton } from "@mui/material"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import DeleteIcon from "@mui/icons-material/Delete"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { styled } from "@mui/system"

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: "1px solid #e0e0e0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
  "&:hover": {
    boxShadow: "0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22)",
  },
}))

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}))

const StyledList = styled(List)(({ theme }) => ({
  padding: 0,
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  borderBottom: "1px solid #f0f0f0",
  "&:last-child": {
    borderBottom: "none",
  },
}))

const mockDocuments = [
  { id: "64a3c1e0-1a2a-4b3a-8c1a-3e0a5b4c7d6e", name: "Document 1.pdf" },
  { id: "75b4d2f1-2b3b-4c4b-9d2b-4f1b6c7d8e9f", name: "Document 2.docx" },
  { id: "86c5e302-3c4c-4d5c-ae3c-5g2c7d8e9f0a", name: "Document 3.txt" },
]

interface DocumentManagementCardProps {
  assignmentId: string
}

const DocumentManagementCard: React.FC<DocumentManagementCardProps> = ({ assignmentId }) => {
  const handleUpload = () => {
    alert("Upload functionality not implemented yet.")
  }

  const handleDelete = (documentId: string) => {
    alert(`Delete functionality not implemented yet for document ID: ${documentId}`)
  }

  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" gutterBottom>
          Document Management
        </Typography>
        <StyledList>
          {mockDocuments.map((document) => (
            <StyledListItem key={document.id}>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary={document.name} />
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(document.id)}>
                <DeleteIcon />
              </IconButton>
            </StyledListItem>
          ))}
        </StyledList>
        <IconButton color="primary" aria-label="upload" onClick={handleUpload}>
          <CloudUploadIcon />
          <Typography variant="body2" style={{ marginLeft: "5px" }}>
            Upload Document
          </Typography>
        </IconButton>
      </StyledCardContent>
    </StyledCard>
  )
}

export default DocumentManagementCard
