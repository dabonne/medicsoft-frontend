import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import profile from "../../../assets/imgs/profile.png";
import mgs from "../../../assets/imgs/mgs.png";
import poids from "../../../assets/imgs/poids.png";
import pression from "../../../assets/imgs/pression.png";
import satur from "../../../assets/imgs/satur.png";
import tmp from "../../../assets/imgs/tmp.png";
import glyc from "../../../assets/imgs/glyc.png";
import freq from "../../../assets/imgs/freq.png";
import bck from "../../../assets/imgs/bck.png";


import ButtonParamedical from "../../../components/ButtonParamedical";
import ModalParamedical from "../../../components/ModalParamedical";
import { AppContext } from "../../../services/context";
import requestPatient from "../../../services/requestPatient";
import { apiPatient } from "../../../services/api";

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

const ContentParamedical = () => {
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
      link:"transmissions"
    },
    {
      id: "WEIGHT",
      img: poids,
      title: "Poids",
      label: "Poids",
      placeholder: "Entrer le poids en Kg",
      link:"poids"
    },
    {
      id: "BODY_TEMPERATURE",
      img: tmp,
      title: "Température corporelle",
      label: "Température corporelle",
      placeholder: "Entrer la température corporelle en degré Celsius",
      link:"temperature"
    },
    {
      id: "ARTERIAL_PRESSURE",
      img: pression,
      title: "Pression artérielle",
      label: "Pression artérielle systolique",
      placeholder: "Entrer la pression artérielle en mmHg",
      link:"pression"
    },
    {
      id: "CARDIAC_FREQUENCY",
      img: freq,
      title: "Fréquence cardiaque",
      label: "Fréquence cardiaque",
      placeholder: "Entrer la fréquence cardiaque en bpm",
      link:"frequence"
    },
    {
      id: "BLOOD_SUGAR",
      img: glyc,
      title: "Glycémie",
      label: "Glycémie",
      placeholder: "Entrer la glycémie en mg/dL",
      link:"glycemie"
    },
    {
      id: "OXYGEN_SATURATION",
      img: satur,
      title: "Saturation en oxygène",
      label: "Saturation",
      placeholder: "Entrer la saturation en Sao2",
      link:"saturation"
    },
    {
      id: "HEIGHT",
      img: poids,
      title: "Taille",
      label: "Taille",
      placeholder: "Entrer la taille en m",
      link:"taille"
    },
    {
      id: "BLOOD_GROUP",
      img: poids,
      title: "Groupe Sanguin",
      label: "Groupe Sanguin",
      placeholder: "Entrer le Groupe Sanguin",
      link:"groupe-sanguin"
    },
  ];
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
      <div className="d-flex">
        <div className="me-auto">
        <div className="row">
        <Link className="text-decoration-none text-black" to="/dashboard/patient/details/dossiers-medicaux"><img src={bck} alt="" /> Retour</Link>
      </div>
          <div className="me-3 text-bold text-meduim align-top">
            <span>{patient.lastname + " " + patient.firstname}</span>
          </div>
          <div className="d-inline-block">
            <span className="text-bold">{patient.age} ans. Femme</span> <br />
            <span>Date de naissance: </span>
            <span className="text-bold">{patient.birthdate}</span> <br />
            <span>Poids: </span>
            <span className="text-bold">89kg</span> <br />
            <span>Taille: </span>
            <span className="text-bold">1m 90</span> <br />
            <span>IMC: </span>
            <span className="text-bold">24.65 KG/M²</span> <br />
          </div>
        </div>
        <div>
          <button className="btn btn-primary">Exporter le dossier</button>
        </div>
      </div>
      {paramedicalButton.map(({ id, img, title, label, placeholder, link}) => {
        return (
          <div key={label}>
            <ButtonParamedical id={"modal" + id} img={img} title={title} link={link}/>
            <ModalParamedical
              id={"modal" + id}
              type={id}
              labelInput={label}
              placeholderInput={placeholder}
            />
          </div>
        );
      })}
    </>
  );
};

export default ContentParamedical;
