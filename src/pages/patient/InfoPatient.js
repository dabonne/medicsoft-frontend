import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import profile from "../../assets/imgs/profile.png";
import back from "../../assets/imgs/bck.png";
import RendezVous from "./pages/RendezVous";
import Prescription from "./pages/Prescription";
import CompteRendu from "./pages/CompteRendu";
import DossierContainer from "./pages/DossierContainer";
import requestPatient from "../../services/requestPatient";
import { apiPatient } from "../../services/api";
import { AppContext } from "../../services/context";
import ModalPatient from "../../components/ModalPatient";
import DeleteModal from "../../components/DeleteModal";
import requestDoctor from "../../services/requestDoctor";
import HospitalisationPatient from "./pages/HospitalisationPatient";

const initPatient = {
  firstname: "",
  lastname: "",
  cni: "",
  age: "",
  gender: "",
  birthdate: "",
  phoneNumber: "",
  country: "Burkina Faso",
  city: "",
  weight: "",
  height: "",
};
const InfoPatient = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange, onDataSharedChange } = authCtx;
  const [datas, setDatas] = useState([]);
  const [pageName, setPageName] = useState("Dossier médical");
  const [location, setLocation] = useState(window.location.pathname);
  const [search, setSearch] = useState("");
  const [list, setList] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const [patient, setPatient] = useState(initPatient);
  const navigate = useNavigate()
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  useEffect(() => {
    requestPatient
      .get(apiPatient.get + "/" + user.cni, header)
      .then((res) => {
        setDatas(res.data);
        console.log("isLoad");
        setPatient(res.data);
        setIsLoad(true);
      })
      .catch((error) => {
        //deconnect()
      });
  }, [location]);

  const onSearch = (e) => {
    e.preventDefault();
    let str = e.target.value;
    let dd = datas.filter((data) => {
      const fullNameOne = data.lastName + " " + data.firstName;
      const fullNameTwo = data.firstName + " " + data.lastName;
      const fullNameOneDepart =
        data.lastName + " " + data.firstName + " " + data.department;
      const fullNameTwoDepart =
        data.firstName + " " + data.lastName + " " + data.department;

      return (
        data.lastName.toLowerCase().includes(str.toLowerCase()) ||
        data.firstName.toLowerCase().includes(str.toLowerCase()) ||
        data.department.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOne.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwo.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOneDepart.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwoDepart.toLowerCase().includes(str.toLowerCase())
      );
    });

    dd.length !== 0 ? setList(dd) : setList(datas);
  };

  const onDelete = (id) => {
    requestDoctor
      .delete(apiPatient.putOrDelete+"/"+id, header)
      .then((res) => {
        console.log(res.data);
        navigate("/dashboard/patient")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="row">
        <h1 className="h2 text-bold">{}</h1>
      </div>
      <div className="row my-4">
        <div className="col-10 col-sm-8 mx-auto col-md-5 col-lg-3">
          <img width="100%" src={profile} alt="" />

          <div className="border border-1 border-radius p-4 my-4">
            <p className="text-16 text-bold ps-1">Patient(e)</p>
            <span
              className="d-block text-bold text-meduim mb-3"
              style={{ fontSize: "2rem" }}
            >
              {patient.lastname + " " + patient.firstname}
            </span>
            <span className="d-block my-1">
              <span>ID Patient: </span>
              <span className="text-bold">{patient.patientId}</span>
            </span>
            <span className="d-block my-1">
              <span className="text-bold">
                {patient.age} ans . {patient.gender}
              </span>
            </span>
            <span className="d-block my-1">
              <span className="">Date de naissance: </span>
              <span className="text-bold">{patient.birthdate}</span>
            </span>
            <span className="d-block my-1">
              <span className="">Téléphone: </span>
              <span className="text-bold">(00226) {patient.phoneNumber}</span>
            </span>
            <span className="d-block my-1">
              <span className="">{patient.city}, </span>
              <span className="text-bold">{patient.country}</span>
            </span>
            <span className="d-inline-block mt-3 me-3">
              <Link
                to="#"
                className="text-black"
                data-bs-toggle="modal"
                data-bs-target="#newPatient"
              >
                Modifier
              </Link>
            </span>
            <span className="d-inline-block mt-3">
              <Link
                to="#"
                className="text-danger"
                data-bs-toggle="modal"
                data-bs-target="#delete"
              >
                supprimer
              </Link>
            </span>
            
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-7 col-lg-9 mx-auto">
          <ul className="nav nav-tabs mx-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="rendez-vous"
              >
                Rendez-vous
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="prescriptions"
              >
                Prescriptions
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="dossiers-medicaux"
              >
                Dossiers médicaux
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="comptes-rendus"
              >
                Comptes rendus
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="patient-hospitalisation"
              >
                Hospitalisations
              </NavLink>
            </li>
          </ul>

          <div className="px-1">
            <Link
              to="/dashboard/patient/details/dossiers-medicaux"
              className="d-inline-block my-2 text-black text-decoration-none"
            >
              {location.includes("dossiers-medicaux") && (
                <>
                  <span>
                    <img
                      src={back}
                      alt=""
                      onClick={(e) => {
                        setPageName("Dossier médical");
                      }}
                    />
                  </span>{" "}
                  <span className="text-bold">{" " + pageName}</span>
                </>
              )}
            </Link>
            <Routes>
              <Route
                path="/"
                element={<RendezVous setLocation={setLocation} />}
              />
              <Route
                path="/rendez-vous"
                element={<RendezVous setLocation={setLocation} />}
              />
              <Route
                path="/prescriptions/*"
                element={<Prescription setLocation={setLocation} />}
              />
              <Route
                path="/dossiers-medicaux/*"
                element={
                  <DossierContainer
                    setLocation={setLocation}
                    setPageName={setPageName}
                  />
                }
              />
              <Route
                path="/comptes-rendus"
                element={<CompteRendu setLocation={setLocation} />}
              />
              <Route
                path="/patient-hospitalisation/*"
                element={<HospitalisationPatient setLocation={setLocation} />}
              />
            </Routes>
            
          </div>
        </div>
      </div>
      {<ModalPatient edit={true} />}
      <DeleteModal title={"Suppression du patient"} id={user.cni} modal={"delete"} onDelete={onDelete} />
    </>
  );
};

export default InfoPatient;
