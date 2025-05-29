use clap::{Parser, Subcommand};
use std::process;

mod task;
mod storage;
mod commands;

use task::Priority;
use storage::TaskStorage;

#[derive(Parser)]
#[command(name = "tli")]
#[command(about = "Task List Interface - A cousin of CLI for task management")]
#[command(version = "0.1.0")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Add a new task
    #[command(alias = "a")]
    Add {
        /// Task title
        title: String,
        /// Task description
        #[arg(short, long)]
        description: Option<String>,
        /// Task priority (low, medium, high)
        #[arg(short, long, default_value = "medium")]
        priority: Priority,
    },
    /// List all tasks
    #[command(alias = "l")]
    List {
        /// Show only completed tasks
        #[arg(short, long)]
        completed: bool,
        /// Show only pending tasks
        #[arg(short, long)]
        pending: bool,
    },
    /// Complete a task
    #[command(alias = "c")]
    Complete {
        /// Task ID (first few characters)
        id: String,
    },
    /// Delete a task
    #[command(alias = "d")]
    Delete {
        /// Task ID (first few characters)
        id: String,
    },
    /// Show task details
    #[command(alias = "s")]
    Show {
        /// Task ID (first few characters)
        id: String,
    },
    /// Show the next task to do (most recent pending task)
    #[command(alias = "n")]
    Next,
}

fn main() {
    let cli = Cli::parse();
    
    let storage = match TaskStorage::new() {
        Ok(storage) => storage,
        Err(e) => {
            eprintln!("Error initializing storage: {}", e);
            process::exit(1);
        }
    };

    let result = match cli.command {
        Commands::Add { title, description, priority } => {
            commands::add::execute(&storage, title, description, priority)
        }
        Commands::List { completed, pending } => {
            commands::list::execute(&storage, completed, pending)
        }
        Commands::Complete { id } => {
            commands::complete::execute(&storage, &id)
        }
        Commands::Delete { id } => {
            commands::delete::execute(&storage, &id)
        }
        Commands::Show { id } => {
            commands::show::execute(&storage, &id)
        }
        Commands::Next => {
            commands::next::execute(&storage)
        }
    };

    if let Err(e) = result {
        eprintln!("Error: {}", e);
        process::exit(1);
    }
}
