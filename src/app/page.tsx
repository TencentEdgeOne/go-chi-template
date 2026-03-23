"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, ExternalLink, Zap } from "lucide-react"

interface ApiEndpoint {
  name: string
  method: string
  path: string
  description: string
  body?: object
}

const endpoints: ApiEndpoint[] = [
  {
    name: "Welcome",
    method: "GET",
    path: "/api/",
    description: "Welcome page listing all available routes",
  },
  {
    name: "Health Check",
    method: "GET",
    path: "/api/health",
    description: "Health check endpoint returning service status",
  },
  {
    name: "List Todos",
    method: "GET",
    path: "/api/api/todos",
    description: "GET route returning all todos with total count",
  },
  {
    name: "Create Todo",
    method: "POST",
    path: "/api/api/todos",
    description: "POST route with JSON body to create a new todo",
    body: { title: "Learn Chi Router" },
  },
  {
    name: "Get Todo by ID",
    method: "GET",
    path: "/api/api/todos/1",
    description: "Dynamic route parameter with chi.URLParam(r, \"id\")",
  },
  {
    name: "Toggle Todo",
    method: "PATCH",
    path: "/api/api/todos/1/toggle",
    description: "Toggle todo completion status",
  },
  {
    name: "Delete Todo",
    method: "DELETE",
    path: "/api/api/todos/3",
    description: "Delete a todo by ID",
  },
]

export default function Home() {
  const [results, setResults] = useState<Record<string, { data: string; status: number } | null>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleApiCall = async (endpoint: ApiEndpoint) => {
    const key = `${endpoint.method}:${endpoint.path}`
    setLoadingStates(prev => ({ ...prev, [key]: true }))
    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
      }
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body)
      }
      const response = await fetch(endpoint.path, options)
      const data = await response.json()
      setResults(prev => ({
        ...prev,
        [key]: { data: JSON.stringify(data, null, 2), status: response.status },
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [key]: { data: `Error: Failed to call ${endpoint.method} ${endpoint.path}`, status: 0 },
      }))
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="https://pages.edgeone.ai" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <img src="/eo-logo-blue.svg" alt="EdgeOne Pages" width={32} height={32} />
                </div>
                <h1 className="text-lg font-semibold">EdgeOne Pages</h1>
              </div>
            </a>
            <a
              href="https://github.com/TencentEdgeOne/go-chi-template"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold leading-tight">
              Go Functions on EdgeOne Pages - Chi
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Go Functions allow you to run Go web frameworks on EdgeOne Pages.
              This template uses the <code className="text-blue-400">Chi</code> router
              with composable middleware, subrouters, and URL parameters.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://edgeone.ai/pages/new?from=github&template=go-chi-template" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#1c66e5] hover:bg-[#1c66e5]/90 text-white px-8 py-3 text-lg cursor-pointer">
                <Zap className="w-5 h-5 mr-2" />
                One-Click Deployment
              </Button>
            </a>
            <a href="https://pages.edgeone.ai/document/go-functions" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="border-gray-600 hover:bg-gray-800 text-white px-8 py-3 text-lg cursor-pointer">
                <ExternalLink className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </a>
          </div>

          {/* Code Block */}
          <Card className="bg-gray-900 border-gray-700 text-left">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-gray-400">
                ./cloud-functions/api.go
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-gray-200 font-mono leading-relaxed">
{`package main

import (
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
)

func main() {
    r := chi.NewRouter()

    r.Use(middleware.Recoverer)
    r.Use(middleware.Logger)

    r.Get("/", welcomeHandler)
    r.Get("/health", healthHandler)

    // Todo CRUD subrouter
    r.Route("/api/todos", func(r chi.Router) {
        r.Get("/", listTodos)
        r.Post("/", createTodo)
        r.Get("/{id}", getTodo)
        r.Patch("/{id}/toggle", toggleTodo)
        r.Delete("/{id}", deleteTodo)
    })

    http.ListenAndServe(":9000", r)
}`}
              </pre>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-800 pb-2">
              API Endpoints
            </h2>
            {endpoints.map(endpoint => {
              const key = `${endpoint.method}:${endpoint.path}`
              const result = results[key]
              const isLoading = loadingStates[key]

              return (
                <Card key={key} className="bg-gray-900 border-gray-700">
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                            endpoint.method === "POST"
                              ? "bg-green-600/20 text-green-400"
                              : endpoint.method === "PATCH"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : endpoint.method === "DELETE"
                              ? "bg-red-600/20 text-red-400"
                              : "bg-blue-600/20 text-blue-400"
                          }`}>
                            {endpoint.method}
                          </span>
                          <span className="font-mono text-sm text-gray-200">{endpoint.path}</span>
                        </div>
                        <p className="text-xs text-gray-500">{endpoint.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApiCall(endpoint)}
                        disabled={isLoading}
                        className="bg-[#1c66e5] hover:bg-[#1c66e5]/90 text-white cursor-pointer"
                      >
                        {isLoading ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        ) : (
                          <Play className="w-3 h-3 mr-1" />
                        )}
                        Call
                      </Button>
                    </div>

                    {endpoint.body && (
                      <div className="bg-gray-800 rounded px-3 py-2">
                        <p className="text-xs text-gray-500 mb-1">Request Body:</p>
                        <pre className="text-xs text-yellow-300 font-mono">
                          {JSON.stringify(endpoint.body, null, 2)}
                        </pre>
                      </div>
                    )}

                    {result && (
                      <div className="text-left">
                        <p className="text-xs text-gray-500 mb-1">
                          Response{result.status > 0 ? ` (${result.status})` : ""}:
                        </p>
                        <pre className="text-green-400 font-mono text-xs bg-gray-800 px-3 py-2 rounded overflow-x-auto">
                          {result.data}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>Powered by EdgeOne Pages</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
