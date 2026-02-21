---
title: "PICO-LLM Research Pipeline"
description: "Modular LLM research pipeline for training and evaluating K-Gram MLP, LSTM, and KV-cache Transformer architectures with 22+ experiment configs."
date: "2025-04"
tags: ["PyTorch", "LLM", "Transformers", "LSTM", "Research"]
featured: false
category: "research"
github: "https://github.com/dhairyamishra"
metric: "73.21%"
metricLabel: "Token Accuracy"
---

## Overview

A modular research pipeline for training and evaluating small-scale language model architectures. The pipeline supports K-Gram MLP, LSTM, and KV-cache Transformer models with systematic cross-run analysis across 22+ experiment configurations.

## Best Results (KV-Cache Transformer)

| Metric | Score |
|--------|-------|
| Validation Loss | **1.665** |
| Perplexity | **6.389** |
| Token Accuracy | **73.21%** |

## Key Features

- **Multi-Architecture Support**: K-Gram MLP, LSTM, and KV-cache Transformer training loops
- **22+ Experiment Configs**: Systematic hyperparameter sweeps and architecture comparisons
- **Cross-Run Analysis**: Automated comparison and visualization across experiment runs
- **Reproducible**: Deterministic seeding and config-driven experimentation

## Tech Stack

- **ML**: PyTorch, custom Transformer implementation with KV-cache
- **Experiment Tracking**: Weights & Biases (wandb)
- **Analysis**: NumPy, Pandas, Matplotlib
