---
title: Blubry
category: Hardware & Electronics
status: archive
order: 12
summary: A smartphone-to-hardware bridge that turns a standard 3.5mm TRRS headphone jack into a bidirectional communication channel between phones and custom electronics. The phone's own audio codec, FFT, and mic input replace Bluetooth or USB drivers for rapid hardware prototyping.
icon: i-lucide-cable
cover: blubry.jpg
---

## Overview
Blubry is a smartphone-to-hardware bridge that turns a standard 3.5mm TRRS headphone jack into a bidirectional communication channel between iOS/Android devices and custom electronics. The core insight: smartphones already carry a capable audio codec, real-time FFT processing, and a microphone input — Blubry's analog front-end decodes audio tones from a phone into hardware control signals and routes sensor data back as audio, enabling rapid hardware prototyping with no wireless hardware or USB drivers required.

## Key Features
- **Audio-based bidirectional link** — TRRS jack carries audio-out (phone → hardware) and mic-in (hardware → phone) simultaneously; on-device FFT decodes frequency tones into digital signals for hardware control
- **MSGEQ7 7-band spectrum analyzer** — dedicated IC performs real-time frequency analysis on the incoming audio signal, extracting amplitude levels across 7 bands for reliable, noise-tolerant signal decoding
- **MAX756 step-up converter** — supplies regulated board power directly from the phone's audio channel, eliminating the need for external batteries on the Basic variant
- **LM358 op-amp signal conditioning** — dual-channel op-amp amplifies the mic-level signal from the TRRS jack before it reaches downstream ICs
- **Two-tier hardware line** — *Blubry Basic* is the pure audio interface board; *Bluduino* integrates an ATmega328P with Arduino bootloader for direct microcontroller access from the phone
- **Iterative PCB development** — multiple hardware revisions (v0.1 through v0.9) manufactured through OshPark and Advanced Circuits, with professional stencils for reflow soldering
- **Rich demo application ecosystem** — reference designs validated across a galvanic skin response lie detector, digital oscilloscope, alcohol breathalyzer, Geiger counter audio adapter, heart rate monitor, RFID reader, and sound-reactive LED matrix

## Tech Stack
ATmega328P, MSGEQ7, MAX756, LM358, KiCad, Arduino, C/C++ (firmware), iOS FFT audio libraries

## Background
Designed in 2012–2013 to lower the barrier to hardware prototyping by eliminating the need for Bluetooth radios or USB drivers just to bridge a sensor to a phone. Using the headphone jack as a programmable I/O port kept the hardware side minimal — a handful of commodity analog ICs — while the phone's existing CPU handled signal decoding, UI, and networking. The project spanned multiple PCB spins and a broad set of demo applications validating the communication approach across diverse sensor types.
