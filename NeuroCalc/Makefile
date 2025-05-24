.PHONY: dev stop clean
.DEFAULT_GOAL := dev

dev:
	nohup npm run dev > dev.log 2>&1 & echo "NeuroCalc started in background. Use 'make stop' to stop."

stop:
	pkill -f "npm run dev" || true
	pkill -f "electron" || true

clean:
	npm run clean