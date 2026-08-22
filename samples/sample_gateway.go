package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

// =========================================================================
// 🔴 PANIC: Hardcoded UUIDs, Secret Tokens & Port Hex
// =========================================================================
const (
	GatewayClusterUUID = "c8941a87-1c3e-4492-aef4-190823901bca"
	InternalAuthSecret = "sk_live_go_gateway_9941a87b1c3e4492"
	DebugMemoryMagic   = 0xCAFEBABE
)

// =========================================================================
// 🟢 SAFE: Structs & Interface Definitions
// =========================================================================
type GatewayStatus string

const (
	StatusHealthy   GatewayStatus = "healthy"
	StatusDegraded  GatewayStatus = "degraded"
	StatusCritical  GatewayStatus = "critical"
)

type RouteMetrics struct {
	TotalRequests   int64         `json:"total_requests"`
	FailedRequests  int64         `json:"failed_requests"`
	AverageDuration time.Duration `json:"average_duration"`
}

type APIProxyGateway struct {
	// 🟡 CAUTION: Internal state and locks
	mu             sync.RWMutex
	routes         map[string]http.HandlerFunc
	metrics        map[string]*RouteMetrics
	listenAddress  string
	shutdownChan   chan struct{}
}

func NewAPIProxyGateway(listenAddr string) *APIProxyGateway {
	return &APIProxyGateway{
		routes:        make(map[string]http.HandlerFunc),
		metrics:       make(map[string]*RouteMetrics),
		listenAddress: listenAddr,
		shutdownChan:  make(chan struct{}),
	}
}

// 🟢 SAFE: Registration method
func (g *APIProxyGateway) RegisterRoute(pattern string, handler http.HandlerFunc) {
	g.mu.Lock()
	defer g.mu.Unlock()

	g.routes[pattern] = handler
	g.metrics[pattern] = &RouteMetrics{}
	
	// 🟠 WARNING: Hardcoded logging string
	log.Printf("[Gateway] Route successfully registered for path: %s", pattern)
}

func (g *APIProxyGateway) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	g.mu.RLock()
	handler, exists := g.routes[r.URL.Path]
	g.mu.RUnlock()

	if !exists {
		// 🔴 PANIC: Not found error response
		http.Error(w, `{"error": "Endpoint route not recognized by ZeroToSaaS gateway"}`, http.StatusNotFound)
		return
	}

	// Execute handler and record latency
	handler(w, r)
	elapsed := time.Since(startTime)

	g.mu.Lock()
	if m, ok := g.metrics[r.URL.Path]; ok {
		m.TotalRequests++
		m.AverageDuration = (m.AverageDuration + elapsed) / 2
	}
	g.mu.Unlock()
}

func main() {
	gateway := NewAPIProxyGateway(":8080")

	gateway.RegisterRoute("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		// 🟠 WARNING: Inline JSON literal
		json.NewEncoder(w).Encode(map[string]interface{}{
			"gateway_uuid": GatewayClusterUUID,
			"status":       StatusHealthy,
			"timestamp":    time.Now().Unix(),
		})
	})

	server := &http.Server{
		Addr:         gateway.listenAddress,
		Handler:      gateway,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	fmt.Printf("ZeroToSaaS Gateway active on %s\n", gateway.listenAddress)
	_ = server.ListenAndServe()
}
