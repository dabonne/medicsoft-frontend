import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import mc from "./assets/imgs/medicsoft_crois.svg";
import msg from "./assets/imgs/msg.png";
import supp from "./assets/imgs/supp.png";
import userp from "./assets/imgs/user.png";
import home from "./assets/imgs/home.png";
import employe from "./assets/imgs/employe.png";
import rendv from "./assets/imgs/rendezvous.png";
import agenda from "./assets/imgs/agenda.png";
import patient from "./assets/imgs/patient.png";
import bk from "./assets/imgs/bk.png";
import Employe from "./pages/Employe";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Meet from "./pages/Meet";
import Notebook from "./pages/Notebook";
import Patient from "./pages/Patient";
import NotebookGard from "./pages/NotebookGard";
import { useNavigate } from "react-router-dom/dist";
import { deleteUser, getUser } from "./services/storage";
import { AppContext, initialUser } from "./services/context";
import ProtectedRoute from "./components/ProtectedRoute";
import Planning from "./pages/Planning";
import requestUser from "./services/requestUser";
import { apiUser } from "./services/api";

const Dashboard = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [userLocal, setUserLocal] = useState("")
  let navigate = useNavigate();
  const [userImg, setUserImg] = useState(userp);
  useEffect(() => {
    //return navigate("/dashboard/")
    setUserImg(user.profile)
    requestUser
          .get(apiUser.get+"/"+user.organisationRef,{
            headers: { Authorization: `Bearer ${user.token}`, },
          })
          .then((res) => {
            //console.log(res.data.photo);
            user.profile = "data:image/jpeg;base64,"+res.data.photo
            setUserImg("data:image/jpeg;base64,"+res.data.photo)
            onUserChange(user)
            //console.log(res.data.employeeResponseList);
          })
          .catch((error) => {
            console.log(error);
          });
    setUserLocal(getUser())
    isAuth();
  }, [user]);
  const isAuth = () => {
    if (user.isAuth == false || user.token == null || user.token == "") {
      console.log(`connexion échoué, isAuth`);
      console.log(user);

      //return navigate("/");
    } else {
      console.log("isAuth true");
    }
  };

  const deconnect = () => {
    deleteUser();
    onUserChange(initialUser);
  };

  return (
    <>
      <header className="container-fluid navbar navbar-dark bg-white sticky-top flex-md-nowrap px-0 py-4 shadow d-md-none">
        <Link
          className="navbar-brand1 bg-white col-md-3 col-lg-2 me-0 px-3"
          to="#"
        >
          <img src={mc} alt="" />
        </Link>
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
              <div className="d-md-none py-3"></div>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <NavLink
                    to="/dashboard/"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
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
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard/personnel"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={employe} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Le personnel
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard/rendez-vous"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={rendv} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Mes rendez-vous
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard/agenda"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={agenda} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Agenda
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard/patient"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={patient} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Mes patients
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard/hospitalisation"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={agenda} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Hospitalisation
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard/planning"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={agenda} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Planning des Soignants
                    </span>
                  </NavLink>
                </li>
              </ul>

              <ul className="nav flex-column w-100 position-absolute bottom-0 mb-5">
                <li className="nav-item link-border1">
                  <Link to="#" className="nav-link">
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={msg} alt="" />
                    </span>
                    <span className="d-block d-md-none border border-2 d-lg-block wd-80 p-2">
                      <img src={msg} alt="" />
                      <span className="d-inline-block ms-3">Messagerie</span>
                    </span>
                  </Link>
                </li>
                <li className="nav-item link-border1">
                  <Link to="#" className="nav-link">
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
                        className="rounded-circle" 
                        width="30px" 
                        src={userImg} alt="" 
                        style={{ marginLeft: "-6px", marginTop: "-6px" }}
                        />
                      <span className="d-inline-block ms-2">{user.name}</span>
                    </span>
                  </Link>
                  <ul
                    className="ms-5 my-2 dropdown-menu text-small shadow"
                    aria-labelledby="dropdownUser2"
                  >
                    <li>
                      <Link className="dropdown-item" to="/dashboard/parametre">
                        Paramètres
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          deconnect();
                        }}
                      >
                        Se déconnecter
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

          <main className="col-md-11 ms-sm-auto col-lg-10 px-md-4 pt-2 h-90 text-small">
            <div className="d-flex justify-content-between py-3">
              <div className="d-inline-block">
                <span className="d-inline-block me-2">
                <img src={bk} alt="" />

                </span>
                <span className="d-inline-block text-bold">retour</span>
              </div>
              <div className="d-inline-block btn btn-gray">
                <span>{user.organisation} - </span>
                <span 
                  className="text-bold text-decoration-underline"
                  data-bs-toggle="modal"
                  data-bs-target="#changeOrganisation"
                  >Changer d’organisation</span>
              </div>

            </div>
          <Routes>
              <Route path="/" element={<ProtectedRoute isAllowed={user.isAuth } redirectPath= "/"><Home /></ProtectedRoute> } />
              <Route path="/personnel" element={<ProtectedRoute isAllowed={user.isAuth } redirectPath= "/"><Employe /></ProtectedRoute>} />
              <Route path="/rendez-vous" element={<ProtectedRoute isAllowed={user.isAuth } redirectPath= "/"><Meet /></ProtectedRoute>} />
              <Route path="/agenda" element={<ProtectedRoute isAllowed={user.isAuth } redirectPath= "/"><Notebook /></ProtectedRoute>} />
              <Route path="/patient/*" element={<ProtectedRoute isAllowed={user.isAuth } redirectPath= "/"><Patient /></ProtectedRoute>} />
              <Route path="/hospitalisation/*" element={<ProtectedRoute isAllowed={user.isAuth } redirectPath= "/"><Patient /></ProtectedRoute>} />
              <Route path="/planning/*" element={<ProtectedRoute isAllowed={user.isAuth } redirectPath= "/"><Planning /></ProtectedRoute>} />
              <Route path="/parametre" element={<ProtectedRoute isAllowed={user.isAuth } redirectPath= "/"><Settings /></ProtectedRoute>} />
            </Routes>
          </main>
          <div className="col-12 col-md-9 ms-sm-auto col-lg-10 px-md-4 text-center text-md-start">
          <div className="text-small d-inline-block  my-1 me-2">
              © Laafi Vision Médical, Tous droits réservés.
            </div>
            <div className="d-inline-block ms-md-5">
            <Link to="#" className="text-small link d-inline-block my-1 me-2">
              Conditions générales
            </Link>
            <Link to="#" className="text-small link d-inline-block my-1">
              Politiques de confidentialités
            </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="changeOrganisation">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
            <select
                    id="clst"
                    className="form-select"
                    value={""}
                    onChange={(e) => {
                      e.preventDefault();
                      
                    }}
                    required
                  >
                    <option value="">Choisir l'organisation</option>
                    {user.organisations && Object.keys(user.organisations).map((key) => {
                      return (
                        <option key={key} value={user.organisations[key]}>
                          {user.organisations[key]}
                        </option>
                      );
                    })}
                  </select>
            </div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={(e) =>{
                 /// e.preventDefault()
                  //setModalNotifyMsg('')
                }}
              >
                Changer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
