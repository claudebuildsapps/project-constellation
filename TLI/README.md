# TLI - Task List Interface

A cousin of CLI for task management. TLI is a command-line task management tool built in Rust that helps you organize and track your tasks efficiently.

## Features

- ✅ Add tasks with titles, descriptions, and priorities
- 📋 List all tasks or filter by status (completed/pending)
- ✓ Mark tasks as completed
- 🗑️ Delete tasks
- 🔍 Show detailed task information
- 🎯 Show the next task to do (most recent pending task)
- 🏠 Store tasks in your home directory (`~/.tli/tasks.json`)
- 🆔 Short UUID support for easy task identification

## Installation

### From Source

```bash
git clone <repository-url>
cd TLI
cargo build --release
cargo install --path .
```

## Usage

### Add a new task

```bash
# Basic task
tli add "Finish the project"

# Task with description
tli add "Review code" --description "Review the pull request for the new feature"

# Task with priority
tli add "Fix bug" --priority high

# Task with both description and priority
tli add "Write documentation" -d "Update README and API docs" -p low
```

### List tasks

```bash
# List all tasks
tli list

# List only completed tasks
tli list --completed

# List only pending tasks
tli list --pending
```

### Complete a task

```bash
# Complete a task using the first few characters of its ID
tli complete a1b2c3d4
```

### Delete a task

```bash
# Delete a task using the first few characters of its ID
tli delete a1b2c3d4
```

### Show task details

```bash
# Show detailed information about a task
tli show a1b2c3d4
```

### Show next task

```bash
# Show the next task to do (most recent pending task)
tli next
```

## Task Priorities

Tasks can have three priority levels:
- `low` - Low priority tasks
- `medium` - Medium priority tasks (default)
- `high` - High priority tasks

## Data Storage

TLI stores your tasks in `~/.tli/tasks.json`. The data is stored as JSON and includes:
- Unique UUID for each task
- Title and optional description
- Priority level
- Creation timestamp
- Completion status and timestamp
- Task completion history

## Examples

```bash
# Add a high-priority task
tli add "Deploy to production" -d "Deploy version 2.0" -p high

# List all tasks
tli list

# Complete the first task (using partial ID)
tli complete a1b2

# Show details of a specific task
tli show a1b2c3d4

# List only pending tasks
tli list --pending

# Delete a completed task
tli delete a1b2
```

## Command Reference

| Command | Description | Options |
|---------|-------------|---------|
| `add <title>` | Add a new task | `-d, --description` `-p, --priority` |
| `list` | List all tasks | `-c, --completed` `-p, --pending` |
| `complete <id>` | Mark task as completed | |
| `delete <id>` | Delete a task | |
| `show <id>` | Show task details | |
| `next` | Show next task to do | |

## Development

Built with:
- [Rust](https://rust-lang.org/) - Systems programming language
- [Clap](https://clap.rs/) - Command line argument parser
- [Serde](https://serde.rs/) - Serialization framework
- [Chrono](https://github.com/chronotope/chrono) - Date and time library
- [UUID](https://github.com/uuid-rs/uuid) - UUID generation

### Building

```bash
cargo build
```

### Running Tests

```bash
cargo test
```

### Running

```bash
cargo run -- add "Test task"
cargo run -- list
```

## License

MIT License - see LICENSE file for details.