"use client"

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MoreHorizontal,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  FileIcon,
  Download,
  Eye,
  History,
} from "lucide-react"
import type { EvidenceFile, EvidenceFileType } from "../_types/evidence-types"
import { format } from "date-fns"

interface EvidenceTableProps {
  evidenceFiles: EvidenceFile[]
}

const getFileIcon = (fileType: EvidenceFileType) => {
  switch (fileType) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    case "docx":
    case "doc":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "png":
    case "jpg":
    case "jpeg":
      return <FileImage className="h-5 w-5 text-purple-500" />
    case "zip":
      return <FileArchive className="h-5 w-5 text-yellow-500" />
    case "txt":
      return <FileText className="h-5 w-5 text-gray-500" />
    default:
      return <FileIcon className="h-5 w-5 text-gray-400" />
  }
}

export function EvidenceTable({ evidenceFiles }: EvidenceTableProps) {
  if (!evidenceFiles || evidenceFiles.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No evidence files found.</p>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">File Name</TableHead>
            <TableHead>Evidence Type</TableHead>
            <TableHead>Linked Assignment</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Uploader</TableHead>
            <TableHead>Date Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evidenceFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(file.fileType)}
                  <span className="font-medium truncate" title={file.fileName}>
                    {file.fileName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{file.evidenceType}</Badge>
              </TableCell>
              <TableCell>
                <Link href={`/assignments/${file.linkedAssignment.id}`} className="hover:underline text-primary">
                  {file.linkedAssignment.title}
                </Link>
              </TableCell>
              <TableCell>{file.version}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={file.uploader.avatar || "/placeholder.svg"} alt={file.uploader.name} />
                    <AvatarFallback>{file.uploader.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {file.uploader.name}
                </div>
              </TableCell>
              <TableCell>{format(new Date(file.uploadDate), "dd MMM yyyy, HH:mm")}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => alert(`Viewing details for ${file.fileName}`)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert(`Downloading ${file.fileName}`)}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert(`Viewing version history for ${file.fileName}`)}>
                      <History className="mr-2 h-4 w-4" /> Version History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
