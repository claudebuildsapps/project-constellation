use crate::storage::TaskStorage;
use crate::task::Task;

pub fn execute(
    storage: &TaskStorage,
    show_completed: bool,
    show_pending: bool,
) -> Result<(), Box<dyn std::error::Error>> {
    let tasks = storage.load_tasks()?;
    
    if tasks.is_empty() {
        println!("No tasks found. Add a task with 'tli add <title>'");
        return Ok(());
    }
    
    let filtered_tasks: Vec<&Task> = tasks
        .iter()
        .filter(|task| {
            if show_completed && show_pending {
                true // Show all if both flags are set
            } else if show_completed {
                task.completed
            } else if show_pending {
                !task.completed
            } else {
                true // Show all by default
            }
        })
        .collect();
    
    if filtered_tasks.is_empty() {
        if show_completed {
            println!("No completed tasks found.");
        } else if show_pending {
            println!("No pending tasks found.");
        }
        return Ok(());
    }
    
    println!("Tasks:");
    for task in filtered_tasks {
        let status = if task.completed { "✓" } else { "○" };
        let id_short = &task.id.to_string()[..8];
        
        println!(
            "{} [{}] {} ({})",
            status,
            id_short,
            task.title,
            task.priority
        );
        
        if let Some(desc) = &task.description {
            println!("    {}", desc);
        }
        
        if task.completed {
            if let Some(completed_at) = task.completed_at {
                println!("    Completed: {}", completed_at.format("%Y-%m-%d %H:%M"));
            }
        }
    }
    
    let completed_count = tasks.iter().filter(|t| t.completed).count();
    let pending_count = tasks.len() - completed_count;
    
    println!("\nSummary: {} pending, {} completed", pending_count, completed_count);
    
    Ok(())
}