import Header from "@/components/Header";
import { TaskStatus, TaskStatusText } from "@/models/taskStatus";
import { useState, useEffect, useRef } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/check-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status != 200) {
        window.location.href = "/login";
      }
    };

    checkAuth();
  }, []);

  const getTasks = async () => {
    const response = await fetch("/api/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseJson = await response.json();
      setTasks(responseJson.tasks);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleCreateTask = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    });

    if (response.ok) {
      formRef.current.reset();
      getTasks();
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    const response = await fetch(`/api/tasks/update?taskId=${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: updatedTask }),
    });

    if (response.ok) {
      getTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    const response = await fetch(`/api/tasks/delete?taskId=${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      getTasks();
    }
  };

  const handleDoneTask = async (taskId) => {
    const response = await fetch(`/api/tasks/done?taskId=${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      getTasks();
    }
  };

  const handleInProgressTask = async (taskId) => {
    const response = await fetch(`/api/tasks/in-progress?taskId=${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      getTasks();
    }
  };

  const handleExcludeTask = async (taskId) => {
    const response = await fetch(`/api/tasks/exclude?taskId=${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      getTasks();
    }
  };

  return (
    <>
      <Header />
      <div className="text-center">
        <h1 className="display-2 pt-5">Tasks</h1>
        <p className="lead">What's Next for You</p>
      </div>

      <div className="container d-flex justify-content-center align-items-center mt-5 mb-5">
        <form ref={formRef} onSubmit={handleCreateTask}>
          <div className="row align-items-center">
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                id="task"
                onChange={(e) => setTask(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Create Task
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="container">
        {tasks.map((task) => (
          <div key={task._id} className="card mb-3 border border-black shadow">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <input
                    type="text"
                    value={task.task}
                    className="form-control"
                    onChange={(e) => {
                      const updatedTask = e.target.value;
                      setTasks((prevTasks) =>
                        prevTasks.map((t) =>
                          t._id === task._id ? { ...t, task: updatedTask } : t
                        )
                      );
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-4 text-center">
                  <p>
                    Status:{" "}
                    <b
                      className={
                        task.status == TaskStatus.COMPLETED
                          ? "text-success"
                          : task.status == TaskStatus.DELETED
                          ? "text-danger"
                          : "text-black"
                      }
                    >
                      {TaskStatusText[task.status]}
                    </b>
                  </p>
                </div>
                <div className="col-sm-4 text-center">
                  <p className="text-muted">
                    Created at: {new Date(task.creationDate).toLocaleString()}
                  </p>
                </div>
                <div className="col-sm-4 text-center">
                  <p className="text-muted">
                    Last updated at:{" "}
                    {new Date(task.lastUpdatedDate).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-sm-3 p-2">
                  <button
                    className="btn btn-primary form-control"
                    onClick={() => handleUpdateTask(task._id, task.task)}
                  >
                    Update
                  </button>
                </div>
                <div className="col-sm-3 p-2">
                  <button
                    className="btn btn-secondary form-control"
                    onClick={() => handleInProgressTask(task._id)}
                  >
                    In Progress
                  </button>
                </div>
                <div className="col-sm-2 p-2">
                  <button
                    className="btn btn-success form-control"
                    onClick={() => handleDoneTask(task._id)}
                  >
                    Done
                  </button>
                </div>
                <div className="col-sm-2 p-2">
                  <button
                    className="btn btn-danger form-control"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="col-sm-2 p-2">
                  <button
                    className="btn btn-warning form-control text-white"
                    onClick={() => handleExcludeTask(task._id)}
                  >
                    Exclude
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
