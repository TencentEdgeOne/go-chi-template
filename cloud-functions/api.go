package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// Todo 待办事项模型
type Todo struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"createdAt"`
}

var (
	todoMu    sync.RWMutex
	todoSeq   = 3
	todoStore = []Todo{
		{ID: 1, Title: "Deploy to EdgeOne", Completed: true, CreatedAt: time.Now().Add(-48 * time.Hour)},
		{ID: 2, Title: "Write Go handlers", Completed: true, CreatedAt: time.Now().Add(-24 * time.Hour)},
		{ID: 3, Title: "Try Chi router", Completed: false, CreatedAt: time.Now()},
	}
)

func main() {
	r := chi.NewRouter()

	r.Use(middleware.Recoverer)
	r.Use(middleware.Logger)

	// Welcome
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"message": "Welcome to EdgeOne Chi Demo!",
			"version": "1.0.0",
			"routes": []string{
				"GET  /            - this page",
				"GET  /health      - health check",
				"GET  /api/todos   - list todos",
				"POST /api/todos   - create todo",
				"GET  /api/todos/{id}          - get todo",
				"PATCH /api/todos/{id}/toggle   - toggle todo",
				"DELETE /api/todos/{id}         - delete todo",
			},
		})
	})

	// Health
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{
			"status":    "ok",
			"framework": "chi",
		})
	})

	// Todo CRUD
	r.Route("/api/todos", func(r chi.Router) {
		r.Get("/", listTodos)
		r.Post("/", createTodo)
		r.Get("/{id}", getTodo)
		r.Patch("/{id}/toggle", toggleTodo)
		r.Delete("/{id}", deleteTodo)
	})

	port := "9000"
	fmt.Printf("Chi server starting on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func listTodos(w http.ResponseWriter, r *http.Request) {
	todoMu.RLock()
	defer todoMu.RUnlock()
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": todoStore, "total": len(todoStore)})
}

func createTodo(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title string `json:"title"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}
	if req.Title == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "title is required"})
		return
	}
	todoMu.Lock()
	todoSeq++
	todo := Todo{ID: todoSeq, Title: req.Title, Completed: false, CreatedAt: time.Now()}
	todoStore = append(todoStore, todo)
	todoMu.Unlock()
	writeJSON(w, http.StatusCreated, map[string]interface{}{"data": todo})
}

func getTodo(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
		return
	}
	todoMu.RLock()
	defer todoMu.RUnlock()
	for _, t := range todoStore {
		if t.ID == id {
			writeJSON(w, http.StatusOK, map[string]interface{}{"data": t})
			return
		}
	}
	writeJSON(w, http.StatusNotFound, map[string]string{"error": "todo not found"})
}

func toggleTodo(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
		return
	}
	todoMu.Lock()
	defer todoMu.Unlock()
	for i := range todoStore {
		if todoStore[i].ID == id {
			todoStore[i].Completed = !todoStore[i].Completed
			writeJSON(w, http.StatusOK, map[string]interface{}{"data": todoStore[i]})
			return
		}
	}
	writeJSON(w, http.StatusNotFound, map[string]string{"error": "todo not found"})
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
		return
	}
	todoMu.Lock()
	defer todoMu.Unlock()
	for i, t := range todoStore {
		if t.ID == id {
			todoStore = append(todoStore[:i], todoStore[i+1:]...)
			writeJSON(w, http.StatusOK, map[string]string{"message": "deleted"})
			return
		}
	}
	writeJSON(w, http.StatusNotFound, map[string]string{"error": "todo not found"})
}
