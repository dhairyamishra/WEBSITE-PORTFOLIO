---
title: "Testaro — Web Accessibility Testing"
description: "Multi-tool web accessibility compliance evaluation and unified reporting pipeline. Presented at ACM SIGACCESS ASSETS 2023 representing CVS Health."
date: "2023-10"
tags: ["Accessibility", "Node.js", "CI/CD", "Playwright", "ACM"]
featured: false
category: "open-source"
paperUrl: "#"
metric: "ACM"
metricLabel: "ASSETS 2023"
---

## Overview

Testaro is a comprehensive web accessibility testing framework that aggregates results from multiple accessibility evaluation tools into a unified reporting pipeline. Presented at the **25th ACM SIGACCESS ASSETS conference** representing CVS Health.

## Conference Presentation

- **Venue**: 25th ACM International Conference on Computers and Accessibility (ASSETS 2023)
- **Role**: Speaker/Contributor representing CVS Health
- **Focus**: Multi-tool compliance rule evaluation and unified reporting

## Key Features

- **Multi-Tool Aggregation**: Combines results from multiple accessibility testing engines (axe-core, WAVE, etc.)
- **Unified Reporting**: Standardized output format across disparate tool results
- **Browser-Based Testing**: Automated test execution in real browser environments
- **CI Integration**: Pluggable into GitHub Actions and other CI/CD pipelines for shift-left accessibility validation
- **Compliance Rules**: Automated evaluation against WCAG standards

## Impact

- Enabled automated accessibility compliance checking across CVS Health's web properties
- Shifted accessibility validation left in the development lifecycle
- Reduced production accessibility issues by integrating with CI pipelines

## Tech Stack

- **Runtime**: Node.js
- **Testing**: Playwright, axe-core
- **CI/CD**: GitHub Actions
- **Reporting**: Custom unified report format
