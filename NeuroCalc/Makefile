.PHONY: dev dev-bg stop clean status
.DEFAULT_GOAL := dev

dev:
	npm run dev

dev-bg:
	nohup npm run dev > dev.log 2>&1 & echo "NeuroCalc started in background with auto-update. Use 'make stop' to stop."
	@echo "Process ID: $$!" 
	@echo "Logs: tail -f dev.log"
	@echo "Status: make status"

stop:
	pkill -f "npm run dev" || true
	pkill -f "electron" || true
	@echo "NeuroCalc stopped"

status:
	@echo "Checking NeuroCalc processes..."
	@pgrep -fl "npm run dev" || echo "No npm dev process found"
	@pgrep -fl "electron" || echo "No electron process found"

clean:
	npm run clean