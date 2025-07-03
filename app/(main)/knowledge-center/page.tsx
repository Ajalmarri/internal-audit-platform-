"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  mockCategories,
  mockArticles,
  type ArticleCategory,
  type KnowledgeArticle,
} from "./_types/knowledge-center-types"
import { Search, ArrowRight } from "lucide-react"
import { format } from "date-fns"

export default function KnowledgeCenterPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredArticles = useMemo(() => {
    if (!searchTerm) {
      return mockArticles.filter((article) => article.isFeatured)
    }
    return mockArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.tags && article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
    )
  }, [searchTerm])

  const featuredOrSearchedArticles = searchTerm
    ? filteredArticles
    : mockArticles.filter((article) => article.isFeatured)

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Center</h1>
        <p className="text-muted-foreground mt-1">Your central hub for audit documentation, guides, and policies.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search all articles and guides..."
          className="w-full pl-10 pr-4 py-3 text-base rounded-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!searchTerm && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Explore Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockCategories.slice(0, 4).map(
              (
                category: ArticleCategory, // Show first 4 prominent categories
              ) => (
                <Link href={`/knowledge-center/category/${category.slug}`} key={category.id} className="block group">
                  <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-3 pb-3">
                      <category.icon className="w-8 h-8 text-primary" />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ),
            )}
          </div>
          {mockCategories.length > 4 && (
            <div className="mt-6 text-center">
              <Link href="/knowledge-center/categories" legacyBehavior>
                <Button variant="outline">
                  View All Categories <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {searchTerm ? `Search Results (${featuredOrSearchedArticles.length})` : "Featured & Recently Updated"}
        </h2>
        {featuredOrSearchedArticles.length > 0 ? (
          <div className="space-y-6">
            {featuredOrSearchedArticles.map((article: KnowledgeArticle) => (
              <Link href={`/knowledge-center/${article.slug}`} key={article.id} className="block group">
                <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{article.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        By {article.author || "Audit Department"} &bull; In{" "}
                        <span className="font-medium text-primary">
                          {article.categoryName || mockCategories.find((c) => c.id === article.categoryId)?.name}
                        </span>
                      </span>
                      <span>Last updated: {format(new Date(article.lastUpdated), "MMMM d, yyyy")}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {searchTerm ? "No articles found matching your search." : "No featured articles available at the moment."}
          </p>
        )}
      </section>
    </div>
  )
}
