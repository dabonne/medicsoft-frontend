import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import mc from "./assets/imgs/medicsoft_crois.svg";
import msg from "./assets/imgs/msg.png";
import supp from "./assets/imgs/supp.png";
import user from "./assets/imgs/user.png";
import home from "./assets/imgs/home.png";
import employe from "./assets/imgs/employe.png";
import rendv from "./assets/imgs/rendezvous.png";
import agenda from "./assets/imgs/agenda.png";
import patient from "./assets/imgs/patient.png";
import Employe from "./pages/Employe";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Meet from "./pages/Meet";
import Notebook from "./pages/Notebook";
import Patient from "./pages/Patient";

const Dashboard = () => {
  return (
    <>
      <header className="container-fluid navbar navbar-dark bg-white sticky-top flex-md-nowrap px-0 py-4 shadow1 d-md-none">
        <a
          className="navbar-brand1 bg-white col-md-3 col-lg-2 me-0 px-3"
          href="#"
        >
          <img src={mc} alt="" />
        </a>
        <button
          className="navbar-toggler p-2 position-absolute mx-0 my-4 d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-1 col-lg-2 d-md-block bg-white sidebar collapse p-0"
          >
            <div className="position-sticky h-100 text-small">
              <div className="col-12 d-none d-md-block text-center py-5 m-0">
                <img src={mc} alt="" />
              </div>
              <div className="d-md-none py-2"></div>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link to="/dashboard/" className="nav-link active">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={home} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Accueil
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/employe" className="nav-link">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={employe} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Les employés
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/rendez-vous" className="nav-link">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={rendv} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80 p-0 m-0"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Mes rendez-vous
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/agenda" className="nav-link">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={agenda} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80 p-0 m-0"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Mon agenda
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/patient" className="nav-link">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={patient} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80 p-0 m-0"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Mes patients
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/patient" className="nav-link">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={agenda} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80 p-0 m-0"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Agenda de Garde
                    </span>
                  </Link>
                </li>
              </ul>

              <ul className="nav flex-column w-100 position-md-absolute bottom-0 mb-5">
                <li className="nav-item link-border1">
                  <Link to="/dashboard/patient" className="nav-link">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={msg} alt="" />
                    </span>
                    <span className="d-block d-md-none border border-2 d-lg-block wd-80 p-2">
                      <img src={msg} alt="" />
                      <span className="d-inline-block ms-3">Messagérie</span>
                    </span>
                  </Link>
                </li>
                <li className="nav-item link-border1">
                  <Link to="/dashboard/patient" className="nav-link">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={supp} alt="" />
                    </span>
                    <span className="d-block d-md-none border border-2 d-lg-block wd-80 p-2">
                      <img src={supp} alt="" />{" "}
                      <span className="d-inline-block ms-3">Support</span>
                    </span>
                  </Link>
                </li>
                <li className="nav-item link-border link-border-primary dropdown">
                  <Link
                    to="#"
                    className="nav-link d-flex align-items-center text-decoration-none"
                    id="dropdownUser2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="d-none d-md-block d-lg-none ">
                      <img src={user} alt="" />
                    </span>
                    <span className="d-block d-md-none border border-2 d-lg-block wd-80 p-2">
                      <img
                        className="d-inline-block"
                        src={user}
                        alt=""
                        style={{ marginLeft: "-6px" }}
                      />
                      <span className="d-inline-block ms-2">Jannette DOE</span>
                    </span>
                  </Link>
                  <ul
                    class="ms-5 my-2 dropdown-menu text-small shadow"
                    aria-labelledby="dropdownUser2"
                  >
                    <li>
                      <Link class="dropdown-item" to="/dashboard/parametre">
                        Paramètre
                      </Link>
                    </li>
                    <li>
                      <Link class="dropdown-item" to="/">
                        Se déconnecter
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

          <main className="col-md-11 ms-sm-auto col-lg-10 px-md-4 pt-5 h-90 text-small">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/employe" element={<Employe />} />
              <Route path="/rendez-vous" element={<Meet />} />
              <Route path="/agenda" element={<Notebook />} />
              <Route path="/patient" element={<Patient />} />
              <Route path="/parametre" element={<Settings />} />
            </Routes>
          </main>
          <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="text-small d-inline-block my-4 me-4">
              © Laafi Vision Médical All rights reserved.
            </div>
            <Link to="#" className="text-small link d-inline-block my-4 me-4">
              Terms
            </Link>
            <Link to="#" className="text-small link d-inline-block my-4 me-4">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
