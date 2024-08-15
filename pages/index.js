import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <Header />
      <div className="text-center mb-5">
        <h1 className="text-center display-1 pt-5">TDList</h1>
        <p className="lead">Step-by-Step Success!</p>
        <div className="container">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={
              isAuthenticated
                ? () => (window.location.href = "/tasks")
                : () => (window.location.href = "/signup")
            }
          >
            Comece a utilizar agora!
          </button>
        </div>
      </div>
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-6 p-3">
            <h3>Organização e Clareza</h3>
            <p>
              Uma to-do list ajuda a organizar suas tarefas de forma clara e
              estruturada. Ao listar o que precisa ser feito, você pode
              visualizar melhor suas prioridades e ter uma visão geral das suas
              responsabilidades, o que facilita a organização do seu tempo e
              esforço.
            </p>
          </div>
          <div className="col-lg-6 p-3">
            <h3>Aumento da Produtividade</h3>
            <p>
              Ter uma lista de tarefas bem definida pode aumentar sua
              produtividade, pois você pode se concentrar em uma tarefa de cada
              vez e evitar a sensação de sobrecarga. Além disso, riscar itens da
              lista à medida que os conclui proporciona uma sensação de
              realização e pode motivar você a continuar avançando.
            </p>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-lg-12 p-3">
            <h3>Redução do Estresse</h3>
            <p>
              Anotar suas tarefas em uma lista pode ajudar a reduzir a ansiedade
              e o estresse relacionados ao esquecimento de compromissos e
              prazos. Saber que você tem um plano claro e definido pode
              proporcionar maior tranquilidade e ajudar a gerenciar melhor suas
              responsabilidades.
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="text-center">
          <h2>Não acredita em nós?</h2>
          <p>
            Leia os artigos abaixo e veja como listas de tarefas podem te ajudar
            a ser mais produtivo!
          </p>
        </div>
        <div className="row">
          <div className="col-lg-4 p-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  The Life Hack That Beethoven and Ben Franklin Had in Common
                </h5>
                <p className="card-text">
                  In the Autobiography of Benjamin Franklin, the Founding Father
                  reveals how he accomplished so much in his 84 years. One
                  doesn’t typically become a diplomat, writer, scientist and
                  printer by accident, and to hear Franklin tell it, he owed his
                  prolific productivity to a reliable routine.
                </p>
                <a
                  target="_blank"
                  href="https://www.insidehook.com/wellness/best-life-hack-history"
                  className="btn btn-primary"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 p-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Do To-Do Lists Work?</h5>
                <p className="card-text">
                  Many people use lists to keep track of things that they want
                  or need to do. Do these ubiquitous to-do lists work? Does it
                  matter if these lists are regular, formal habits or causal
                  notes or even a mental list? Does the structure or
                  organization of these lists matter? These are some of the
                  questions Shamarukh Chowdhury, a senior doctoral student in
                  our research group, asked when she embarked on a recent
                  research project.
                </p>
                <a
                  target="_blank"
                  href="https://www.psychologytoday.com/intl/blog/dont-delay/202002/do-do-lists-work"
                  className="btn btn-primary"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 p-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  Writing A To-Do List May Help You Fall Asleep Faster
                </h5>
                <p className="card-text">
                  For the millions of people who have trouble falling asleep, a
                  new study suggests adding a simple practice before bed may
                  reduce the time it takes to drift off.
                </p>
                <a
                  target="_blank"
                  href="https://www.forbes.com/sites/alicegwalton/2018/01/14/writing-before-bed-may-help-you-fall-asleep-faster/"
                  className="btn btn-primary"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
