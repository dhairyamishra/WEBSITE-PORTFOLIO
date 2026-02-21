---
title: "Solaris — Multi-Agent Video World Models"
description: "Scalable multi-agent Minecraft dataset and evaluation harness for action-conditioned Video-DiT world models under partial observability. ICML 2026 submission at NYU Courant."
date: "2025-09"
tags: ["PyTorch", "Video-DiT", "Multi-Agent", "Minecraft", "Computer Vision", "Research"]
featured: true
category: "research"
paperUrl: "#"
metric: "95%"
metricLabel: "Test Coverage"
---

## Overview

Solaris is a research project at NYU Courant targeting **ICML 2026**, focused on building scalable multi-agent world models in Minecraft environments. The work addresses the challenge of action-conditioned video generation under partial observability — where each agent sees only its own perspective.

## Key Contributions

- **Multi-Agent Dataset**: Collected synchronized dual-view rollouts across 23 episode types totaling 10+ hours at 30 FPS to validate temporal and cross-view consistency
- **Memory-Efficient Self-Forcing**: Avoided gradient retention over rollout KV caches and recomputed once to cut teacher context backprop memory growth from quadratic to linear in teacher length
- **Evaluation Suite**: Built a multiplayer evaluation suite benchmarking rollout quality and failure modes across agents — temporal coherence and cross-view consistency. Final episode suite passed with 95% coverage
- **Interleaved Multi-Agent Attention**: Designed attention by exposing P in the sequence `(b, P, T, H, W, C)`, introduced per-player embeddings and zero-init gates to prevent cross-agent drift, reducing cross-view mismatch rate by **22%** vs baseline

## Architecture

The system uses a Video Diffusion Transformer (Video-DiT) backbone conditioned on per-agent action sequences. Key architectural innovations include:

1. **Interleaved attention** across agent perspectives in the token sequence
2. **Per-player positional embeddings** that preserve agent identity
3. **Zero-init gating** to prevent early cross-agent information leakage
4. **Long-context self-forcing** with memory-linear backpropagation

## Tech Stack

- **Framework**: PyTorch, custom Video-DiT implementation
- **Data**: Minecraft MCP with synchronized multi-agent recording
- **Training**: Multi-GPU distributed training with gradient checkpointing
- **Evaluation**: Custom temporal coherence and cross-view consistency metrics
