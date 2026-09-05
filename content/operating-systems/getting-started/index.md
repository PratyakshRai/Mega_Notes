---
title: Getting Started with Operating Systems
category: Operating Systems
topic: Getting Started
difficulty: Beginner
description: Introduction to the Operating Systems section covering processes, memory, scheduling and concurrency.
tags:
  - operating-systems
  - processes
  - memory
  - scheduling
order: 1
---

## Operating Systems

This section covers OS fundamentals:

- **Processes & Threads** — creation, lifecycle, context switching
- **Memory Management** — virtual memory, paging, segmentation
- **CPU Scheduling** — FCFS, SJF, Round Robin, Priority
- **Deadlocks** — prevention, detection, recovery
- **File Systems** — inodes, directories, permissions
- **Concurrency** — race conditions, mutexes, semaphores

:::info Content Coming Soon
Notes will be added as content is provided.
:::

## Process vs Thread

| | Process | Thread |
|--|---------|--------|
| Memory | Own address space | Shared with process |
| Creation | Heavy (fork) | Lightweight |
| Communication | IPC (pipes, sockets) | Shared memory |
| Crash impact | Independent | Can crash process |
