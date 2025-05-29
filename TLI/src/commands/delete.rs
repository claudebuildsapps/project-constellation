use crate::storage::TaskStorage;
use crate::commands::find_task_by_partial_id;

pub fn execute(
    storage: &TaskStorage,
    partial_id: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let tasks = storage.load_tasks()?;
    let task_id = find_task_by_partial_id(&tasks, partial_id)?;
    
    // Find the task to get its title before deleting
    let task_title = tasks
        .iter()
        .find(|task| task.id == task_id)
        .map(|task| task.title.clone())
        .ok_or("Task not found")?;
    
    let removed = storage.remove_task(task_id)?;
    
    if removed {
        println!("✓ Deleted task: {}", task_title);
    } else {
        return Err("Task not found".into());
    }
    
    Ok(())
}