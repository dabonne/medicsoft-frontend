import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import profile from "../../assets/imgs/profile.png";
import mgs from "../../assets/imgs/mgs.png";
import poids from "../../assets/imgs/poids.png";
import pression from "../../assets/imgs/pression.png";
import satur from "../../assets/imgs/satur.png";
import tmp from "../../assets/imgs/tmp.png";
import glyc from "../../assets/imgs/glyc.png";
import freq from "../../assets/imgs/freq.png";
import requestPatient from "../../services/requestPatient";
import { apiPatient } from "../../services/api";
import { AppContext } from "../../services/context";
import ButtonParamedical from "../../components/ButtonParamedical";
import ModalParamedical from "../../components/ModalParamedical";
import ContentParamedical from "./components/ContentParamedical";
import TableParamedal from "./components/TableParamedal";

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

const DossierParamedical = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [datas, setDatas] = useState([]);
  const [pageName, setPageName] = useState("Dossier médical");
  const [location, setLocation] = useState(window.location.pathname);
  const [search, setSearch] = useState("");
  const [list, setList] = useState("");

  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const paramedicalButton = [
    {
      id: "TRANSMISSION",
      img: mgs,
      title: "Transmissions",
      label: "Note à transmettre à toute l’équipe",
      placeholder: "Ecrire...",
    },
    {
      id: "CARDIAC_FREQUENCY",
      img: freq,
      title: "Fréquence cardiaque",
      label: "Fréquence cardiaque",
      placeholder: "Entrer la fréquence cardiaque en bpm",
    },
    {
      id: "BLOOD_SUGAR",
      img: glyc,
      title: "Glycémie",
      label: "Glycémie",
      placeholder: "Entrer la glycémie en mg/dL",
    },
    {
      id: "OXYGEN_SATURATION",
      img: satur,
      title: "Saturation en oxygène",
      label: "Saturation",
      placeholder: "Entrer la saturation en Sao2",
    },
    {
      id: "ARTERIAL_PRESSURE",
      img: pression,
      title: "Pression artérielle systolique",
      label: "Pression artérielle systolique",
      placeholder: "Entrer la pression artérielle en mmHg",
    },
    {
      id: "BODY_TEMPERATURE",
      img: tmp,
      title: "Température corporelle",
      label: "Température corporelle",
      placeholder: "Entrer la température corporelle en degré Celsius",
    },
    {
      id: "WEIGHT",
      img: poids,
      title: "Poids",
      label: "Poids",
      placeholder: "Entrer le poids en Kg",
    },
    {
      id: "HEIGHT",
      img: poids,
      title: "Taille",
      label: "Taille",
      placeholder: "Entrer la taille en m",
    },
    {
      id: "BLOOD_GROUP",
      img: poids,
      title: "Groupe Sanguin",
      label: "Groupe Sanguin",
      placeholder: "Entrer le Groupe Sanguin",
    },
  ];

  const paramedicalType = [
    "TRANSMISSION",
    "CARDIAC_FREQUENCY",
    "BLOOD_SUGAR",
    "OXYGEN_SATURATION",
    "ARTERIAL_PRESSURE",
    "BODY_TEMPERATURE",
    "WEIGHT",
  ]
  const [patient, setPatient] = useState(initPatient);
  useEffect(() => {
    requestPatient
      .get(apiPatient.get + "/" + user.cni, header)
      .then((res) => {
        setDatas(res.data);
        //console.log(res.data);
        setPatient(res.data);
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

    dd !== [] ? setList(dd) : setList(datas);
  };

  return (
    <>
      <div className="row">
        <h1 className="h2 text-bold">Dossier paramédical de {patient.lastname + " " + patient.firstname}</h1>
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
              <span className="text-bold">P12902</span>
            </span>
            <span className="d-block my-1">
              <span className="text-bold">{patient.age} ans . {patient.gender}</span>
            </span>
            <span className="d-block my-1">
              <span className="">Date de naissance: </span>
              <span className="text-bold">{patient.birthdate}</span>
            </span>
            <span className="d-block my-1">
              <span className="">Téléphone: </span>
              <span className="text-bold">
                (00226) {patient.phoneNumber}
              </span>
            </span>
            <span className="d-block my-1">
              <span className="">{patient.city}, </span>
              <span className="text-bold">{patient.country}</span>
            </span>
            <span className="d-block mt-3">
              <Link to="#" className="text-black">
                Envoyer en hospitalisation
              </Link>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-7 col-lg-9 mx-auto">
          <Routes>
            <Route path="/" element={<ContentParamedical />} />
            <Route path="transmissions" element={<TableParamedal unite="" label={['Note','Note']} type={paramedicalButton[0]}/>} />
            <Route path="frequence" element={<TableParamedal unite="bpm" label={['Fréquence','Fréquence c.']} type={paramedicalButton[1]}/>} />
            <Route path="glycemie" element={<TableParamedal unite="mg/dL" label={['Glycémie','Glycémie']} type={paramedicalButton[2]}/>} />
            <Route path="saturation" element={<TableParamedal unite="% SaO2" label={['Saturation','Saturation']} type={paramedicalButton[3]}/>} />
            <Route path="pression" element={<TableParamedal unite="mmHg" label={['Pression','Pression A. Systolique']} type={paramedicalButton[4]}/>} />
            <Route path="temperature" element={<TableParamedal unite="°C" label={['Température','Température']} type={paramedicalButton[5]}/>} />
            <Route path="poids" element={<TableParamedal unite="Kg" label={['Poids','Poids']} type={paramedicalButton[6]}/>} />
            <Route path="taille" element={<TableParamedal unite="m" label={['Taille','Taille']} type={paramedicalButton[7]}/>} />
            <Route path="groupe-sanguin" element={<TableParamedal unite="" label={['Groupe sanguin','Groupe sanguin']} type={paramedicalButton[8]}/>} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default DossierParamedical;
