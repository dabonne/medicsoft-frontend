import React from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import NotebookPlanning from "./notebook/NotebookPlanning";
import NotebookConsultation from "./notebook/NotebookConsultation";

const Notebook = () => {
  return (
    <>
      <div className="row">
        <h1 className="h2">Agenda</h1>
      </div>
      <div className="row my-4">
        <div className="col-12">
          <ul className="nav nav-tabs mx-0">
            <li className="nav-item">
              <NavLink
                to="/dashboard/agenda/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Planning
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/dashboard/agenda/consultation"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Mes consultations
              </NavLink>
            </li>
            {
              /**
               * <li className="nav-item">
            <NavLink
                to="/dashboard/agenda/list"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Tout afficher
              </NavLink>
            </li>
               */
            }
          </ul>

          <div className="tab-content">
            <Routes>
              <Route path="/" element={<NotebookPlanning />} />
              <Route path="/consultation" element={<NotebookConsultation />} />
              <Route path="/list" element={<NotebookConsultation />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notebook;
