import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Users(req, res) {
  const [users, setUsers] = useState([]);

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
      } else {
        const responseJson = await response.json();
        if (!responseJson.isAdmin) {
          window.location.href = "/";
        }
      }
    };

    checkAuth();
  }, []);

  async function fetchUsers() {
    const response = await fetch("/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setUsers(data.users);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleRemoveUser(userId) {
    const response = await fetch("/api/admin/users/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (response.status === 200) {
      fetchUsers();
    }
  }

  async function handleUpdateAdmin(userId) {
    const response = await fetch("/api/admin/users/update-admin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (response.status === 200) {
      fetchUsers();
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-center display-1 pt-5">Usuários</h1>
        <p className="lead text-center">Gerencie os usuários do sistema</p>
      </div>
      <div className="container">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Administrador</th>
                <th>Data de Criação</th>
                <th>Última Data de Atualização</th>
                <th>Tarefas</th>
                <th>Remover</th>
                <th>Tornar Administrador</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <th scope="row">{users.indexOf(user) + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Sim" : "Não"}</td>
                  <td>{new Date(user.creationDate).toLocaleString()}</td>
                  <td>{new Date(user.lastUpdatedDate).toLocaleString()}</td>
                  <td>
                    <Link
                      target="_blank"
                      href={`/admin/tasks/${user._id}`}
                      className="btn btn-primary"
                    >
                      Tarefas
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveUser(user._id)}
                    >
                      Remover
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleUpdateAdmin(user._id)}
                    >
                      Tornar Administrador
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
