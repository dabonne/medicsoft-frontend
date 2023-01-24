import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import profile from "../../assets/imgs/profile.png";
import back from "../../assets/imgs/bck.png";
import RendezVous from "./pages/RendezVous";
import Prescription from "./pages/Prescription";
import CompteRendu from "./pages/CompteRendu";
import DossierContainer from "./pages/DossierContainer";

const InfoPatient = () => {
  const [datas, setDatas] = useState([]);
  const [pageName, setPageName] = useState("Dossier médical")
  const [location, setLocation] = useState(window.location.pathname);
  const [search, setSearch] = useState("");
  const [list, setList] = useState("");

  useEffect(() => {
    setDatas([...Array(20).keys()]);
    console.log(location.includes("dossiers-medicaux"))
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

    dd !== [] ? setList(dd) : setList(datas);
  };

  return (
    <>
      <div className="row">
        <h1 className="h2 text-bold">Jannie DOE</h1>
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
              Jannie DOE
            </span>
            <span className="d-block my-1">
              <span>ID Patient: </span>
              <span className="text-bold">P12902</span>
            </span>
            <span className="d-block my-1">
              <span className="text-bold">23 ans . Femme</span>
            </span>
            <span className="d-block my-1">
              <span className="">Date de naissance: </span>
              <span className="text-bold">10/12/2023</span>
            </span>
            <span className="d-block my-1">
              <span className="">Téléphone: </span>
              <span className="text-bold">(00226) XX XX XX XX</span>
            </span>
            <span className="d-block my-1">
              <span className="">Ouagadougou, </span>
              <span className="text-bold">BURKINA FASO</span>
            </span>
            <span className="d-block mt-3">
              <Link to="#" className="text-black">
                Envoyer en hospitalisation
              </Link>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-7 col-lg-9 mx-auto">
          <ul className="nav nav-tabs mx-0">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="rendez-vous"
              >
                Rendez-vous
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="prescriptions"
              >
                Prescriptions
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="dossiers-medicaux"
              >
                Dossiers médicaux
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="comptes-rendus">
                Comptes rendus
              </Link>
            </li>
          </ul>

          <div className="px-1">
            <Link to="/dashboard/patient/details/dossiers-medicaux" className="d-inline-block my-2 text-black text-decoration-none">
              {
                (location.includes("dossiers-medicaux")) && <>
                <span><img src={back} alt="" /></span> <span className="text-bold">{" "+pageName}</span>
                </>
              }
              
            </Link>
            <Routes>
              <Route path="/" element={<RendezVous setLocation={setLocation} />} />
              <Route path="/rendez-vous" element={<RendezVous setLocation={setLocation} />} />
              <Route path="/prescriptions" element={<Prescription setLocation={setLocation} />} />
              <Route path="/dossiers-medicaux/*" element={<DossierContainer setLocation={setLocation} setPageName={setPageName} />} />
              <Route path="/comptes-rendus" element={<CompteRendu setLocation={setLocation} />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPatient;
