use crate::task::Task;
use serde_json;
use std::fs;
use std::io::{self, Write};
use std::path::PathBuf;
use uuid::Uuid;

pub struct TaskStorage {
    file_path: PathBuf,
}

impl TaskStorage {
    pub fn new() -> io::Result<Self> {
        let home_dir = dirs::home_dir().ok_or_else(|| {
            io::Error::new(io::ErrorKind::NotFound, "Could not find home directory")
        })?;
        
        let tli_dir = home_dir.join(".tli");
        fs::create_dir_all(&tli_dir)?;
        
        let file_path = tli_dir.join("tasks.json");
        
        Ok(Self { file_path })
    }

    pub fn load_tasks(&self) -> io::Result<Vec<Task>> {
        if !self.file_path.exists() {
            return Ok(Vec::new());
        }

        let content = fs::read_to_string(&self.file_path)?;
        if content.trim().is_empty() {
            return Ok(Vec::new());
        }

        serde_json::from_str(&content).map_err(|e| {
            io::Error::new(io::ErrorKind::InvalidData, format!("JSON parse error: {}", e))
        })
    }

    pub fn save_tasks(&self, tasks: &[Task]) -> io::Result<()> {
        let json = serde_json::to_string_pretty(tasks)?;
        let mut file = fs::File::create(&self.file_path)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }

    pub fn add_task(&self, task: Task) -> io::Result<()> {
        let mut tasks = self.load_tasks()?;
        tasks.push(task);
        self.save_tasks(&tasks)
    }

    pub fn remove_task(&self, id: Uuid) -> io::Result<bool> {
        let mut tasks = self.load_tasks()?;
        let original_len = tasks.len();
        tasks.retain(|task| task.id != id);
        
        if tasks.len() < original_len {
            self.save_tasks(&tasks)?;
            Ok(true)
        } else {
            Ok(false)
        }
    }

    pub fn update_task<F>(&self, id: Uuid, updater: F) -> io::Result<bool>
    where
        F: FnOnce(&mut Task),
    {
        let mut tasks = self.load_tasks()?;
        let mut found = false;
        
        for task in &mut tasks {
            if task.id == id {
                updater(task);
                found = true;
                break;
            }
        }
        
        if found {
            self.save_tasks(&tasks)?;
        }
        
        Ok(found)
    }
}