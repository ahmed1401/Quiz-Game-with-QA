# Tools Directory

This folder hosts optional QA tooling (k6 load generator, OWASP ZAP) that should be downloaded locally rather than stored in Git.

## k6
- Download: https://github.com/grafana/k6/releases (use v0.49.0 or later).
- Extract into `tools/k6/` so that `k6.exe` is available for `k6 run QA_TestSuites/04_NonFunctional/k6_scenario.js`.

## OWASP ZAP
- Download baseline/bundle: https://www.zaproxy.org/download/
- Place the extracted folder under `tools/zap/` for CLI scans referenced in `QA_Bundle/SOUMISSION_QA_QUIZ_GAME/04_PERFORMANCE_SÉCURITÉ`.

These binaries are ignored via `.gitignore` to keep the repository lightweight; reproduce them locally before executing performance or security suites.
