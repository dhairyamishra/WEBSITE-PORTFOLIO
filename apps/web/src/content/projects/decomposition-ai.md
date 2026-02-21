---
title: "Decomposition AI"
description: "LLM-assisted knowledge mapping app that converts prompts into reusable idea graphs via GPT-driven decomposition heuristics across 5 thought/node types."
date: "2025-03"
tags: ["React", "GPT-4", "Graph Visualization", "LLM", "React Flow"]
featured: false
category: "full-stack"
github: "https://github.com/dhairyamishra"
metric: "5"
metricLabel: "Node Types"
---

## Overview

An intelligent knowledge mapping application that leverages LLMs to decompose complex prompts into structured, reusable idea graphs. The system uses GPT-driven heuristics to break down concepts across 5 distinct thought/node types, enabling iterative analysis and synthesis.

## Key Features

- **GPT-Driven Decomposition**: Converts natural language prompts into structured knowledge graphs
- **5 Node Types**: Supports different thought categories for rich knowledge representation
- **3 View Modes**: Timeline, Focus, and History views for different analysis workflows
- **Graph Operations**: Breakdown, synthesis, and action summarization on graph nodes
- **Prompt Orchestration**: Intelligent routing of LLM calls for graph manipulation
- **Fallback Routing**: Local and cloud model execution with automatic failover based on availability

## Architecture

The app uses a React frontend with React Flow for graph visualization, connected to a prompt orchestration layer that manages LLM interactions. Graph state is managed with Zustand/Immer for immutable, performant updates.

## Tech Stack

- **Frontend**: React, React Flow, Zustand, Immer, TailwindCSS
- **AI**: OpenAI GPT-4, prompt engineering, fallback routing
- **Visualization**: React Flow, custom node renderers
