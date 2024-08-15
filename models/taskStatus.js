export const TaskStatus = {
  DELETED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};

export const TaskStatusText = {
  [TaskStatus.DELETED]: "Deleted",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.COMPLETED]: "Completed",
};
