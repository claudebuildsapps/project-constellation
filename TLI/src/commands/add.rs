use crate::storage::TaskStorage;
use crate::task::{Priority, Task};

pub fn execute(
    storage: &TaskStorage,
    title: String,
    description: Option<String>,
    priority: Priority,
) -> Result<(), Box<dyn std::error::Error>> {
    let task = Task::new(title, description, priority);
    
    storage.add_task(task.clone())?;
    
    println!("✓ Task added: {} ({})", task.title, task.id.to_string()[..8].to_string());
    if let Some(desc) = &task.description {
        println!("  Description: {}", desc);
    }
    println!("  Priority: {}", task.priority);
    
    Ok(())
}