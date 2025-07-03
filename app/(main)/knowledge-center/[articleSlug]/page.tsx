"use client"

import { useParams, useRouter } from "next/navigation"
import { mockArticles, mockCategories } from "../_types/knowledge-center-types"
import { ArrowLeft, CalendarDays, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import Link from "next/link"

export default function ArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleSlug = params.articleSlug as string

  const article = mockArticles.find((art) => art.slug === articleSlug)

  if (!article) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="text-muted-foreground mt-2">
          The article you are looking for does not exist or may have been moved.
        </p>
        <Button onClick={() => router.push("/knowledge-center")} className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Knowledge Center
        </Button>
      </div>
    )
  }

  const category = mockCategories.find((cat) => cat.id === article.categoryId)

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6 group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </Button>

      <article className="bg-card p-6 sm:p-8 rounded-lg shadow-sm">
        <header className="mb-8 border-b pb-6">
          {category && (
            <Link href={`/knowledge-center/category/${category.slug}`} legacyBehavior>
              <a className="text-sm font-medium text-primary hover:underline mb-2 inline-block">{category.name}</a>
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={article.authorAvatar || "/placeholder.svg?width=32&height=32&text=AD"}
                  alt={article.author || "Audit Department"}
                />
                <AvatarFallback>{article.author ? article.author.substring(0, 2).toUpperCase() : "AD"}</AvatarFallback>
              </Avatar>
              <span>{article.author || "Audit Department"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Last updated: {format(new Date(article.lastUpdated), "MMMM d, yyyy")}</span>
            </div>
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Placeholder for edit button if user has permissions */}
        {/* <div className="mt-12 border-t pt-6 text-right">
          <Button variant="outline">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Article
          </Button>
        </div> */}
      </article>
    </div>
  )
}
