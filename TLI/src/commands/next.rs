use crate::storage::TaskStorage;

pub fn execute(storage: &TaskStorage) -> Result<(), Box<dyn std::error::Error>> {
    let tasks = storage.load_tasks()?;
    
    // Find the most recently created pending task
    let next_task = tasks
        .iter()
        .filter(|task| !task.completed)
        .max_by_key(|task| task.created_at);
    
    match next_task {
        Some(task) => {
            println!("🎯 Next task to do:");
            println!("  [{}] {} ({})", 
                &task.id.to_string()[..8], 
                task.title, 
                task.priority
            );
            
            if let Some(desc) = &task.description {
                println!("  Description: {}", desc);
            }
            
            println!("  Created: {}", task.created_at.format("%Y-%m-%d %H:%M"));
            println!("\nRun 'tli complete {}' when done!", &task.id.to_string()[..8]);
        }
        None => {
            println!("🎉 No pending tasks! You're all caught up!");
            println!("Add a new task with 'tli add <title>'");
        }
    }
    
    Ok(())
}