# TLI Project Configuration

## Project Overview
TLI (Task List Interface) is a Rust-based CLI tool for task management, serving as a "cousin of CLI" for organizing and tracking tasks efficiently.

## Build and Run Commands
- `cargo build` - Build the project
- `cargo run -- <command>` - Run with specific commands
- `cargo test` - Run tests
- `cargo build --release` - Build optimized release version

## Project Structure
- `src/main.rs` - CLI entry point and command routing
- `src/task.rs` - Task data structure and methods
- `src/storage.rs` - File I/O and data persistence
- `src/commands/` - Individual command implementations
  - `add.rs` - Add new tasks
  - `list.rs` - List and filter tasks
  - `complete.rs` - Mark tasks as completed
  - `delete.rs` - Remove tasks
  - `show.rs` - Display task details

## Key Features
- UUID-based task identification with partial ID matching
- JSON file storage in `~/.tli/tasks.json`
- Priority levels (low, medium, high)
- Task completion tracking with timestamps
- Comprehensive CLI interface with Clap

## Dependencies
- `clap` - Command line parsing
- `serde` + `serde_json` - Serialization
- `chrono` - Date/time handling
- `uuid` - Unique identifiers
- `dirs` - Home directory detection

## Testing Strategy
Run comprehensive tests with `cargo test` to verify:
- Task creation and manipulation
- Storage operations
- CLI command parsing
- Partial ID matching logic