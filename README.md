# DevLink — DevSecOps GitOps Kubernetes Platform

> **Deployment and Automation of the DevLink Application using Kubernetes, GitOps, CI/CD, Security Scanning, Monitoring, and Cloud Infrastructure**

**Author:** Obianuju Linda Owoh  
**Role:** DevOps Engineer  
**Duration:** 3 months  
**Live App:** [obianuju-tech.online](https://obianuju-tech.online) | **API:** [api.obianuju-tech.online](https://api.obianuju-tech.online)  
**ArgoCD:** [argocd.obianuju-tech.online](https://argocd.obianuju-tech.online) | **Grafana:** [grafana.obianuju-tech.online](https://grafana.obianuju-tech.online)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Environment Setup](#environment-setup)
- [Kubernetes Cluster Setup](#kubernetes-cluster-setup)
- [Application Containerization](#application-containerization)
- [Kubernetes Resources](#kubernetes-resources)
- [Database Deployment](#database-deployment)
- [GitOps with ArgoCD](#gitops-with-argocd)
- [CI/CD Pipeline](#cicd-pipeline)
- [Security Implementation](#security-implementation)
- [Monitoring and Observability](#monitoring-and-observability)
- [Networking](#networking)
- [Challenges and Resolutions](#challenges-and-resolutions)
- [Project Outcomes](#project-outcomes)
- [Future Improvements](#future-improvements)

---

## Project Overview

DevLink is a full-stack web application (Next.js frontend + NestJS/Prisma backend + PostgreSQL) deployed on a self-managed Kubernetes cluster using a complete DevSecOps workflow. This project was built as a production-style portfolio environment covering the full lifecycle: infrastructure provisioning, containerization, GitOps deployments, automated CI/CD, container security scanning, TLS automation, and real-time observability.

### Objectives

**Infrastructure** — Deploy on Kubernetes, implement GitOps, configure cloud networking, enable HTTPS  
**CI/CD** — Automate image builds and deployment updates, eliminate manual processes  
**Security** — Scan source code and images pre-deployment, secure ingress with TLS  
**Monitoring** — Collect metrics, visualize cluster health, route alerts to Slack  

---

## Architecture

```
Developer → Git Push → GitHub Actions → Trivy Scan → Docker Build
                                                          ↓
                                                     Docker Hub
                                                          ↓
                                               Manifest Update (sed)
                                                          ↓
                                                       ArgoCD
                                                          ↓
                                          MicroK8s Kubernetes Cluster
                                         ┌──────────────────────────┐
                                         │  Master Node (vmi3169176) │
                                         │  - ArgoCD                 │
                                         │  - Monitoring Stack       │
                                         │  - Frontend + Backend     │
                                         ├──────────────────────────┤
                                         │  Worker Node (vmi3169177) │
                                         │  - Frontend + Backend     │
                                         │  - Monitoring Stack       │
                                         └──────────────────────────┘
                                                    ↕
                                         NGINX Ingress / MetalLB
                                                    ↕
                              User ← Cloudflare DNS ← cert-manager TLS
```

**Cluster nodes:** `vmi3169176` (master, 62.171.137.29) · `vmi3169177` (worker, 62.171.137.33)  
**Namespace:** `bootcampt`  
**Docker Hub image:** `obianuju127/devopsbootcamp`

---

## Technology Stack

| Category | Technology |
|---|---|
| Containers | Docker |
| Orchestration | Kubernetes (MicroK8s) |
| GitOps | ArgoCD, ArgoCD Image Updater |
| CI/CD | GitHub Actions |
| Security Scanning | Trivy |
| Database | PostgreSQL |
| Monitoring | Prometheus |
| Visualization | Grafana |
| Logging | Loki |
| Tracing | Tempo |
| Alerting | Alertmanager + Slack |
| Ingress Controller | NGINX Ingress |
| Certificate Management | cert-manager + Let's Encrypt |
| Load Balancing | MetalLB |
| DNS Management | Cloudflare |
| Operating System | Ubuntu Linux |

---

## Environment Setup

### VPS Provisioning (Contabo)

Two Contabo VPS instances form the Kubernetes cluster:

| Role | Instance | IP | Specs |
|---|---|---|---|
| Master | vmi3169176 | 62.171.137.29 | 4 vCPU · 8 GB RAM · 100 GB SSD |
| Worker | vmi3169177 | 62.171.137.33 | 4 vCPU · 8 GB RAM · 100 GB SSD |

Both nodes run **Ubuntu Linux**.

---

## Kubernetes Cluster Setup

### MicroK8s Installation

```bash
sudo snap install microk8s --classic
sudo usermod -aG microk8s $USER
```

### Core Add-ons Enabled

```bash
microk8s enable dns
microk8s enable ingress
microk8s enable storage
microk8s enable cert-manager
microk8s enable helm3
microk8s enable ha-cluster
microk8s enable metallb
microk8s enable observability   # Prometheus · Grafana · Loki · Tempo
```

### Verify Cluster

```bash
microk8s status
kubectl get nodes -o wide
```

---

## Application Containerization

Both services use **multi-stage Docker builds** with the official `node:20-alpine` base image, keeping production images small and secure.

### Backend (NestJS / Prisma) — Port `5000`

Build stages:
1. Install system packages (`python3`, `build-base`, `openssl` for Prisma)
2. Install Node dependencies with `npm ci`
3. Copy source and generate Prisma client (`npx prisma generate`)
4. Build the application (`npm run build`)
5. Copy only production artifacts to a clean `runner` stage
6. Run as non-root user

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 build-base openssl
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# copy only dist + node_modules from builder
EXPOSE 5000
```

### Frontend (Next.js) — Port `3000`

Build stages:
1. Install dependencies with `npm ci`
2. Build Next.js app (`npm run build`)
3. Production stage copies only `.next`, `public`, and production `node_modules`
4. Run as non-root user

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
```

> **Result:** Images optimized from ~1.5 GB to ~250–350 MB through multi-stage builds and production-only dependency installation.

---

## Kubernetes Resources

All application resources live in the `bootcampt` namespace.

```bash
kubectl get all -n bootcampt
```

### Resource Inventory

| Kind | Name |
|---|---|
| Deployment | `frontend-deployment` |
| Deployment | `backend-deployment` |
| Deployment | `postgres` |
| Service | `frontend-service` (ClusterIP :3000) |
| Service | `backend-service` (ClusterIP :3001) |
| Service | `postgres` (ClusterIP :5432) |
| Ingress | `frontend-ingress` → `obianuju-tech.online` |
| Ingress | `backend-ingress` → `api.obianuju-tech.online` |
| PersistentVolumeClaim | `postgres-pvc` |

### Inspect Ingress

```bash
kubectl get ingress -A
kubectl describe ingress frontend-ingress -n bootcampt
kubectl describe ingress backend-ingress -n bootcampt
```

TLS is enabled on all five public ingresses via cert-manager annotations:

```yaml
annotations:
  cert-manager.io/cluster-issuer: bootcampt-issuer
  nginx.ingress.kubernetes.io/ssl-redirect: "true"
```

---

## Database Deployment

PostgreSQL is deployed inside Kubernetes with a persistent volume.

```
Database:   mydb
Service:    postgres.bootcampt.svc.cluster.local:5432
```

```bash
kubectl get pods -n bootcampt -l app=postgres
kubectl get pv,pvc -n bootcampt
```

The PVC uses a `nodeSelector` to pin PostgreSQL to a specific node, preventing data-loss from unbound hostPath volumes.

---

## GitOps with ArgoCD

ArgoCD manages all deployments declaratively from this Git repository.

**Dashboard:** [argocd.obianuju-tech.online](https://argocd.obianuju-tech.online)

### Managed Applications

| Application | Source Path | Status |
|---|---|---|
| `frontend-app` | `frontend/` | ✅ Healthy · Synced |
| `backend-app` | `backend/` | ✅ Healthy · Synced |
| `database-app` | `database/` | ✅ Healthy · Synced |

### Features Configured

- **Auto Sync** — Applies manifest changes pushed to `main` automatically
- **Self Healing** — Reverts manual cluster drift to match Git state
- **Pruning** — Removes resources deleted from manifests
- **ArgoCD Image Updater** — Monitors Docker Hub and updates image tags automatically

### ArgoCD Installation

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

---

## CI/CD Pipeline

The pipeline triggers on every push to `main`, running 4 jobs to build, scan, push, and deploy automatically.

**Workflow file:** `.github/workflows/ci-cd.yml`

### Pipeline Flow

```
Git Push to main
      │
      ▼
┌─────────────────┐
│ Job 1           │  trivy-scan
│ Trivy Security  │  → Scan frontend source
│ Scan            │  → Scan backend source
└────────┬────────┘
         │ (parallel after scan passes)
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Job 2  │ │ Job 3  │  build-and-push
│ Build  │ │ Build  │  → Docker build + push
│Frontend│ │Backend │  → Tag: test-v{run_number}
└────┬───┘ └───┬────┘
     └────┬────┘
          ▼
┌─────────────────┐
│ Job 4           │  deploy-via-argocd
│ Update Manifests│  → sed image tags in YAML
│ + ArgoCD Sync   │  → git commit + push
└─────────────────┘  → argocd app sync
```

### Workflow Overview

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  IMAGE_NAME: obianuju127/devopsbootcamp

jobs:
  trivy-scan:
    name: Trivy Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4.2.2
      - name: Scan frontend source
        uses: aquasecurity/trivy-action@master
      - name: Scan backend source
        uses: aquasecurity/trivy-action@master

  build-push-frontend:
    name: Build & Push Frontend
    needs: trivy-scan
    runs-on: ubuntu-latest
    # docker build & push steps

  build-push-backend:
    name: Build & Push Backend
    needs: trivy-scan
    runs-on: ubuntu-latest
    # docker build & push steps

  deploy-via-argocd:
    name: Deploy via ArgoCD
    needs: [build-push-frontend, build-push-backend]
    runs-on: ubuntu-latest
    steps:
      - name: Update image tags in manifests
        run: |
          sed -i "s|image: .*frontend.*|image: $IMAGE_NAME:frontend-${{ github.run_number }}|g" frontend/deployment.yaml
          sed -i "s|image: .*backend.*|image: $IMAGE_NAME:backend-${{ github.run_number }}|g" backend/deployment.yaml
      - name: Commit and push manifest changes
        run: |
          git config user.email "github-actions@github.com"
          git add . && git commit -m "CI: update image tags to test-v${{ github.run_number }}"
          git push
      - name: Sync via ArgoCD CLI
        run: argocd app sync frontend-app && argocd app sync backend-app
```

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `ARGOCD_SERVER` | ArgoCD server URL |
| `ARGOCD_AUTH_TOKEN` | ArgoCD API token |
| `GH_TOKEN` | GitHub PAT for manifest commits |

---

## Security Implementation

### Trivy Security Scanning

Trivy runs as the first pipeline gate — builds are blocked if scans fail.

Scans performed:
1. **Filesystem scan** — Source code scanned before any image is built
2. **Container image scan** — Built image scanned before pushing to Docker Hub

```bash
# Manual image scan
trivy image obianuju127/devopsbootcamp
```

### TLS / HTTPS

All five public endpoints are secured with Let's Encrypt certificates managed automatically by cert-manager.

```bash
kubectl get certificate -A
# NAMESPACE       NAME              READY   SECRET
# argocd          argocd-tls        True    argocd-tls
# bootcampt       backend-tls       True    backend-tls
# bootcampt       frontend-tls      True    frontend-tls
# observability   grafana-tls       True    grafana-tls
# observability   prometheus-tls    True    prometheus-tls
```

Certificate issuer: **Let's Encrypt E7** · Auto-renewed by cert-manager  
DNS validation: Cloudflare A records → `62.171.137.29`

---

## Monitoring and Observability

Full observability stack deployed via `microk8s enable observability` into the `observability` namespace.

### Prometheus

Collects real-time metrics from both nodes and all workloads.

Monitored: CPU utilization · Memory utilization · Pod health · Cluster health · Network traffic

```bash
# Via ingress
https://prometheus.obianuju-tech.online
```

### Grafana

**URL:** [grafana.obianuju-tech.online](https://grafana.obianuju-tech.online)

| Dashboard | Purpose |
|---|---|
| Kubernetes / Views / Global | Cluster-wide resource utilization and health |
| Kubernetes / Views / Pods | Per-pod CPU, memory, network, and health |
| Node Exporter Full | Node-level: CPU, RAM, disk, filesystem, network, system load |
| Grafana Metrics | Grafana self-monitoring |
| Prometheus Stats | Prometheus scrape performance |

### Alertmanager

Routes Prometheus alerts to Slack.

```bash
https://alertmanager.obianuju-tech.online

# Confirmed alert groups:
# slack-notifications / namespace=default        → 1 alert
# slack-notifications / namespace=kube-system    → 6 alerts
```

### Loki + Tempo

- **Loki** — Centralized log aggregation from all pods
- **Tempo** — Distributed tracing for cross-service request flows

---

## Networking

### MetalLB

Provides LoadBalancer IP assignment on bare-metal VPS.

```bash
kubectl get ipaddresspool -n metallb-system
# ADDRESSES: ["62.171.137.29/32"]

kubectl get svc ingress-nginx-controller -n bootcampt
# TYPE: LoadBalancer  EXTERNAL-IP: 62.171.137.29
```

### NGINX Ingress

Routes all external traffic to the correct Kubernetes services.

```bash
kubectl get ingress -A
# NAMESPACE       NAME                 HOSTS
# argocd          argocd-ingress       argocd.obianuju-tech.online
# bootcampt       backend-ingress      api.obianuju-tech.online
# bootcampt       frontend-ingress     obianuju-tech.online
# observability   grafana-ingress      grafana.obianuju-tech.online
# observability   prometheus-ingress   prometheus.obianuju-tech.online
```

### Cloudflare DNS

All subdomains managed via Cloudflare with A records pointing to `62.171.137.29`.

---

## Challenges and Resolutions

### ArgoCD Sync Failures

**Cause:** Kubernetes manifests contained configuration errors and outdated image references. GitHub Actions initially failed to update manifests after new builds.

**Resolution:** Corrected manifest files, configured GitHub Actions to automatically update image tags via `sed`, and validated repository changes before each sync.

---

### Image Pull Errors

**Cause:** Pods failed to start due to incorrect image names, missing tags, and authentication issues with the container registry.

**Resolution:** Corrected image references, rebuilt and pushed images, configured image pull secrets for registry authentication.

---

### TLS Certificate Issues

**Cause:** Let's Encrypt could not validate the domain because Cloudflare DNS records and ClusterIssuer configuration were incorrect.

**Resolution:** Corrected Cloudflare A records, updated ClusterIssuer, and cert-manager successfully issued valid TLS certificates for all five ingresses.

---

### Frontend ↔ Backend Communication Issues

**Cause:** Frontend could not reach the backend API. Root cause: `iptables -P FORWARD DROP` blocking ClusterIP routing on both nodes, combined with an incorrect `NEXT_PUBLIC_API_URL` build-time variable.

**Resolution:** Set `iptables -P FORWARD ACCEPT` on both nodes, persisted with `netfilter-persistent save`, and corrected the `NEXT_PUBLIC_API_URL` in the frontend Dockerfile and CI workflow.

---

### PostgreSQL WAL Corruption

**Cause:** A forgotten Docker Compose Postgres container was running in parallel, burning excess CPU and causing WAL corruption.

**Resolution:** Stopped the Docker Compose container, recovered the database with `pg_resetwal`, and ensured only the Kubernetes-managed PostgreSQL instance is active.

---

## Project Outcomes

- ✅ Deployed a containerized full-stack application on a self-managed MicroK8s Kubernetes cluster
- ✅ Implemented GitOps with ArgoCD — auto sync, self healing, and pruning
- ✅ Built an automated 4-job CI/CD pipeline with GitHub Actions
- ✅ Integrated Trivy security scanning on both source code and container images
- ✅ Configured HTTPS with cert-manager and Let's Encrypt across all five public endpoints
- ✅ Deployed full observability stack (Prometheus · Grafana · Loki · Tempo · Alertmanager)
- ✅ Integrated Cloudflare DNS and NGINX Ingress for external access
- ✅ Automated image updates with ArgoCD Image Updater

---

## Future Improvements

- **Kubernetes Network Policies** — Restrict pod-to-pod communication to only authorized service pairs
- **Open Policy Agent (OPA)** — Enforce admission policies (no privileged containers, mandatory resource limits)
- **Falco Runtime Security** — Real-time container behaviour monitoring and security alerting
- **Service Mesh (Istio / Linkerd)** — Mutual TLS (mTLS), advanced traffic management, and microservice observability
- **Centralized External Log Storage** — Long-term log retention outside the cluster for compliance and analysis

---

## Repository Structure

```
DevOps-bootcamp-App-stack/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── frontend/
│   ├── Dockerfile
│   └── deployment.yaml        # ArgoCD-managed K8s manifests
├── backend/
│   ├── Dockerfile
│   └── deployment.yaml
└── database/
    ├── deployment.yaml
    ├── service.yaml
    └── pvc.yaml
```

---

## Author

**Obianuju Linda Owoh** — DevOps Engineer  
[GitHub](https://github.com/obianuju-linda) · [LinkedIn](www.linkedin.com/in/obianuju-owoh)

> Built as part of a structured 3-month DevOps bootcamp to demonstrate production-grade Kubernetes deployment, GitOps workflows, CI/CD automation, container security, and full-stack observability.
