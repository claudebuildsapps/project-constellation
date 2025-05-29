use crate::storage::TaskStorage;
use crate::commands::find_task_by_partial_id;

pub fn execute(
    storage: &TaskStorage,
    partial_id: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let tasks = storage.load_tasks()?;
    let task_id = find_task_by_partial_id(&tasks, partial_id)?;
    
    let task = tasks
        .iter()
        .find(|task| task.id == task_id)
        .ok_or("Task not found")?;
    
    println!("Task Details:");
    println!("  ID: {}", task.id);
    println!("  Title: {}", task.title);
    
    if let Some(desc) = &task.description {
        println!("  Description: {}", desc);
    }
    
    println!("  Priority: {}", task.priority);
    println!("  Status: {}", if task.completed { "Completed" } else { "Pending" });
    println!("  Created: {}", task.created_at.format("%Y-%m-%d %H:%M:%S UTC"));
    
    if let Some(completed_at) = task.completed_at {
        println!("  Completed: {}", completed_at.format("%Y-%m-%d %H:%M:%S UTC"));
    }
    
    Ok(())
}