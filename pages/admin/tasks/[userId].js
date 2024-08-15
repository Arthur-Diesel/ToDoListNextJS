import Header from "@/components/Header";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { TaskStatus } from "@/models/taskStatus";
import { TaskStatusText } from "@/models/taskStatus";

export default function Tasks() {
  const router = useRouter();
  const { userId } = router.query;
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchTasks = async () => {
      const response = await fetch(`/api/admin/tasks/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    };

    fetchTasks();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchUser = async () => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setUser(data.user);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <>
      <Header />
      <div className="text-center">
        <h2 className="display-5 pt-5">Tasks for user: {user.name}</h2>
        <p className="lead">ID: {userId}</p>
      </div>
      <div className="container">
        {tasks.map((task) => (
          <div key={task._id} className="card mb-3 border border-black shadow">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <p className="border rounded border-black p-2">{task.task}</p>
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
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
