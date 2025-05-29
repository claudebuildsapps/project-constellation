use crate::storage::TaskStorage;
use crate::commands::find_task_by_partial_id;

pub fn execute(
    storage: &TaskStorage,
    partial_id: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let tasks = storage.load_tasks()?;
    let task_id = find_task_by_partial_id(&tasks, partial_id)?;
    
    let updated = storage.update_task(task_id, |task| {
        if task.completed {
            println!("Task '{}' is already completed", task.title);
        } else {
            task.complete();
            println!("✓ Completed task: {}", task.title);
        }
    })?;
    
    if !updated {
        return Err("Task not found".into());
    }
    
    Ok(())
}