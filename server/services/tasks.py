"""
Background Task Manager - Handle asynchronous tasks
"""

from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
import uuid
import asyncio


class TaskStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRYING = "retrying"


class TaskPriority(Enum):
    CRITICAL = 0
    HIGH = 1
    MEDIUM = 2
    LOW = 3


@dataclass
class Task:
    id: str
    name: str
    function: str
    args: tuple
    kwargs: dict
    priority: TaskPriority
    status: TaskStatus
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Any] = None
    error: Optional[str] = None
    retries: int = 0
    max_retries: int = 3
    
    def to_dict(self) -> Dict[str, Any]:
        data = {
            "id": self.id,
            "name": self.name,
            "function": self.function,
            "priority": self.priority.value,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "result": str(self.result) if self.result else None,
            "error": self.error,
            "retries": self.retries,
            "max_retries": self.max_retries
        }
        return data


class TaskQueue:
    """Task queue manager for background jobs"""
    
    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.queue: List[Task] = []
        self.running_tasks: Dict[str, Task] = {}
        self.completed_tasks: List[Task] = []
        self.failed_tasks: List[Task] = []
    
    def create_task(
        self,
        name: str,
        function: str,
        args: tuple = (),
        kwargs: dict = {},
        priority: TaskPriority = TaskPriority.MEDIUM,
        max_retries: int = 3
    ) -> Task:
        """Create a new background task"""
        task_id = str(uuid.uuid4())
        
        task = Task(
            id=task_id,
            name=name,
            function=function,
            args=args,
            kwargs=kwargs,
            priority=priority,
            status=TaskStatus.PENDING,
            created_at=datetime.now(),
            max_retries=max_retries
        )
        
        self.tasks[task_id] = task
        self._enqueue(task)
        
        return task
    
    def _enqueue(self, task: Task):
        """Add task to queue with priority"""
        self.queue.append(task)
        self.queue.sort(key=lambda t: t.priority.value)
    
    async def execute_task(self, task: Task) -> Any:
        """Execute a single task"""
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.now()
        self.running_tasks[task.id] = task
        
        try:
            result = await self._run_task_function(task)
            
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.now()
            task.result = result
            
            self.completed_tasks.append(task)
            del self.running_tasks[task.id]
            
            return result
            
        except Exception as e:
            task.error = str(e)
            task.retries += 1
            
            if task.retries < task.max_retries:
                task.status = TaskStatus.RETRYING
                self._enqueue(task)
            else:
                task.status = TaskStatus.FAILED
                task.completed_at = datetime.now()
                self.failed_tasks.append(task)
            
            if task.id in self.running_tasks:
                del self.running_tasks[task.id]
            
            raise
    
    async def _run_task_function(self, task: Task) -> Any:
        """Simulate running task function"""
        await asyncio.sleep(0.1)
        
        if task.function == "send_notification":
            return {"status": "sent", "task": task.name}
        elif task.function == "process_media":
            return {"status": "processed", "task": task.name}
        elif task.function == "sync_social_data":
            return {"status": "synced", "task": task.name}
        elif task.function == "generate_analytics":
            return {"status": "generated", "task": task.name}
        else:
            return {"status": "completed", "task": task.name}
    
    def get_task(self, task_id: str) -> Optional[Task]:
        """Get task by ID"""
        return self.tasks.get(task_id)
    
    def cancel_task(self, task_id: str) -> bool:
        """Cancel a pending task"""
        task = self.tasks.get(task_id)
        
        if task and task.status == TaskStatus.PENDING:
            task.status = TaskStatus.CANCELLED
            if task in self.queue:
                self.queue.remove(task)
            return True
        
        return False
    
    def get_queue_stats(self) -> Dict[str, Any]:
        """Get queue statistics"""
        return {
            "total_tasks": len(self.tasks),
            "pending": len([t for t in self.queue if t.status == TaskStatus.PENDING]),
            "running": len(self.running_tasks),
            "completed": len(self.completed_tasks),
            "failed": len(self.failed_tasks),
            "queue_depth": len(self.queue)
        }
    
    def get_tasks_by_status(self, status: TaskStatus) -> List[Task]:
        """Get all tasks with specific status"""
        return [
            task for task in self.tasks.values()
            if task.status == status
        ]
    
    def cleanup_old_tasks(self, days: int = 7):
        """Remove old completed/failed tasks"""
        cutoff = datetime.now() - timedelta(days=days)
        
        to_remove = []
        for task_id, task in self.tasks.items():
            if task.status in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
                if task.completed_at and task.completed_at < cutoff:
                    to_remove.append(task_id)
        
        for task_id in to_remove:
            del self.tasks[task_id]
        
        self.completed_tasks = [
            t for t in self.completed_tasks
            if t.completed_at and t.completed_at >= cutoff
        ]
        
        self.failed_tasks = [
            t for t in self.failed_tasks
            if t.completed_at and t.completed_at >= cutoff
        ]
        
        return len(to_remove)


class ScheduledTaskManager:
    """Manage scheduled/recurring tasks"""
    
    def __init__(self, task_queue: TaskQueue):
        self.task_queue = task_queue
        self.scheduled_tasks: Dict[str, Dict[str, Any]] = {}
    
    def schedule_task(
        self,
        name: str,
        function: str,
        run_at: datetime,
        args: tuple = (),
        kwargs: dict = {},
        recurring: bool = False,
        interval_minutes: Optional[int] = None
    ) -> str:
        """Schedule a task for future execution"""
        schedule_id = str(uuid.uuid4())
        
        self.scheduled_tasks[schedule_id] = {
            "id": schedule_id,
            "name": name,
            "function": function,
            "run_at": run_at,
            "args": args,
            "kwargs": kwargs,
            "recurring": recurring,
            "interval_minutes": interval_minutes,
            "last_run": None,
            "next_run": run_at,
            "run_count": 0
        }
        
        return schedule_id
    
    def check_and_run_scheduled(self) -> List[Task]:
        """Check and execute scheduled tasks"""
        now = datetime.now()
        executed_tasks = []
        
        for schedule_id, schedule in list(self.scheduled_tasks.items()):
            if schedule['next_run'] <= now:
                task = self.task_queue.create_task(
                    name=schedule['name'],
                    function=schedule['function'],
                    args=schedule['args'],
                    kwargs=schedule['kwargs']
                )
                
                executed_tasks.append(task)
                schedule['last_run'] = now
                schedule['run_count'] += 1
                
                if schedule['recurring'] and schedule['interval_minutes']:
                    schedule['next_run'] = now + timedelta(minutes=schedule['interval_minutes'])
                else:
                    del self.scheduled_tasks[schedule_id]
        
        return executed_tasks
    
    def get_upcoming_tasks(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Get tasks scheduled in the next X hours"""
        now = datetime.now()
        future = now + timedelta(hours=hours)
        
        upcoming = [
            {
                **schedule,
                'next_run': schedule['next_run'].isoformat()
            }
            for schedule in self.scheduled_tasks.values()
            if now <= schedule['next_run'] <= future
        ]
        
        return sorted(upcoming, key=lambda x: x['next_run'])
    
    def cancel_scheduled_task(self, schedule_id: str) -> bool:
        """Cancel a scheduled task"""
        if schedule_id in self.scheduled_tasks:
            del self.scheduled_tasks[schedule_id]
            return True
        return False


class WorkerPool:
    """Pool of workers to process tasks concurrently"""
    
    def __init__(self, task_queue: TaskQueue, num_workers: int = 4):
        self.task_queue = task_queue
        self.num_workers = num_workers
        self.workers: List[asyncio.Task] = []
        self.is_running = False
    
    async def worker(self, worker_id: int):
        """Worker coroutine"""
        while self.is_running:
            if self.task_queue.queue:
                task = self.task_queue.queue.pop(0)
                try:
                    await self.task_queue.execute_task(task)
                except Exception as e:
                    print(f"Worker {worker_id} error: {e}")
            else:
                await asyncio.sleep(0.5)
    
    async def start(self):
        """Start worker pool"""
        self.is_running = True
        self.workers = [
            asyncio.create_task(self.worker(i))
            for i in range(self.num_workers)
        ]
    
    async def stop(self):
        """Stop worker pool"""
        self.is_running = False
        await asyncio.gather(*self.workers, return_exceptions=True)
        self.workers = []
    
    def get_worker_stats(self) -> Dict[str, Any]:
        """Get worker pool statistics"""
        return {
            "num_workers": self.num_workers,
            "is_running": self.is_running,
            "active_workers": len([w for w in self.workers if not w.done()]),
            "queue_stats": self.task_queue.get_queue_stats()
        }
