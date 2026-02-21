---
title: "Cloud NLP Classification Service"
description: "Production-ready multi-model text classification service with zero-downtime model switching, deployed on GCP. DistilBERT achieves 96.57% accuracy."
date: "2025-11"
tags: ["NLP", "DistilBERT", "FastAPI", "Docker", "GCP", "PyTorch"]
featured: true
category: "full-stack"
github: "https://github.com/dhairyamishra"
metric: "96.57%"
metricLabel: "Accuracy"
---

## Overview

A production-grade multi-model text classification service built with FastAPI and Docker, featuring zero-downtime model switching between DistilBERT, TF-IDF + LogReg, and TF-IDF + SVM. Deployed live on **GCP Compute Engine** using an e2-standard-2 instance.

## Model Benchmarks

| Model | Accuracy | Latency | Cost Factor |
|-------|----------|---------|-------------|
| DistilBERT | **96.57%** | 60–100ms | Baseline |
| LogReg (TF-IDF) | 85–88% | 5ms (21× faster) | — |
| SVM (TF-IDF) | 85–88% | 2ms (44× faster) | — |

Trained and benchmarked on a **24,783-sample dataset** with comprehensive E2E validation.

## Key Features

- **Zero-Downtime Switching**: Hot-swap between models without service interruption
- **326+ Test Suite**: Automated E2E validation with 100% pass rate
- **Cloud Deployment**: Live on GCP at ~$0.07/hr (~$50/mo)
- **Multi-Model Architecture**: Pluggable model backends behind a unified API

## Tech Stack

- **ML**: Hugging Face Transformers, PyTorch, scikit-learn, TF-IDF
- **API**: FastAPI, Uvicorn, Pydantic
- **Infrastructure**: Docker, GCP Compute Engine (e2-standard-2)
- **Testing**: pytest, 326+ automated tests
