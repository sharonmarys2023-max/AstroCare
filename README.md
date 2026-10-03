# AstroCare — Astronaut Health Monitor

A simple web dashboard created for the NASA Space Apps Challenge preselection task **Astronaut Health Monitor**.

## Features
- One astronaut profile
- Heart rate
- Oxygen level
- Body temperature
- Sleep duration
- Exercise time
- Normal / Warning / Critical status
- Automatic health alerts
- Mission day/time indicator
- Random health data that varies every 2 seconds
- Live telemetry chart
- Responsive design

## Alert logic
Primary critical rule:
- Oxygen < 90% → CRITICAL ALERT

Additional monitoring:
- Oxygen 90–94% → WARNING
- Heart rate > 110 BPM → CRITICAL
- Heart rate > 100 BPM → WARNING
- Temperature outside critical range → CRITICAL
- Sleep below 6 hours → WARNING
