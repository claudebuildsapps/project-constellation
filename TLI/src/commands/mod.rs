pub mod add;
pub mod list;
pub mod complete;
pub mod delete;
pub mod show;
pub mod next;

use uuid::Uuid;

pub fn find_task_by_partial_id(tasks: &[crate::task::Task], partial_id: &str) -> Result<Uuid, String> {
    let matches: Vec<&crate::task::Task> = tasks
        .iter()
        .filter(|task| task.id.to_string().starts_with(partial_id))
        .collect();

    match matches.len() {
        0 => Err(format!("No task found with ID starting with '{}'", partial_id)),
        1 => Ok(matches[0].id),
        _ => Err(format!("Ambiguous ID '{}' matches {} tasks", partial_id, matches.len())),
    }
}