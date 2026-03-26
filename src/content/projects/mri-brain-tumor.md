---
title: "MRI Brain Tumor Detection & Segmentation"
description: "Multimodal MRI classification and segmentation model trained on BraTS dataset with shared encoder, achieving 91.3% accuracy and 97.1% sensitivity."
date: "2025-10"
tags: ["PyTorch", "Computer Vision", "Medical Imaging", "FastAPI", "BraTS"]
featured: true
category: "ml-ai"
github: "https://github.com/dhairyamishra"
metric: "91.3%"
metricLabel: "Accuracy"
---

## Overview

Built a production-ready multimodal MRI classification and segmentation pipeline trained on the **BraTS dataset**. The model uses a shared encoder architecture for both tumor classification and pixel-level segmentation, achieving strong performance across both tasks simultaneously.

## Results

| Metric | Score |
|--------|-------|
| Classification Accuracy | **91.3%** |
| Sensitivity | **97.1%** |
| Dice Score (Segmentation) | **76.5%** |
| Model Parameters | **31.7M** |
| Inference Speedup | **~40% faster** vs separate models |

## Key Features

- **Shared Encoder Architecture**: Single backbone for both classification and segmentation reduces parameter count and inference time
- **Conditional Segmentation**: Segmentation head activates only when tumor is detected, optimizing inference
- **One-Command Pipeline**: Productized training-to-demo pipeline with automation across 6 stages, 4 smart prompts, and 25/25 passing tests
- **API Endpoints**: 11 FastAPI endpoints for model inference, health checks, and data management

## Tech Stack

- **ML**: PyTorch, torchvision, BraTS dataset
- **API**: FastAPI, Uvicorn, Pydantic
- **Testing**: pytest with 25/25 test coverage
- **Optimization**: Conditional inference, shared encoder, mixed precision
