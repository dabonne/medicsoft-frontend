import React, { useContext, useEffect, useState } from "react";
import {
  Link} from "react-router-dom";
import mgs from "../../../assets/imgs/mgs.png";
import poids from "../../../assets/imgs/poids.png";
import pression from "../../../assets/imgs/pression.png";
import satur from "../../../assets/imgs/satur.png";
import tmp from "../../../assets/imgs/tmp.png";
import glyc from "../../../assets/imgs/glyc.png";
import freq from "../../../assets/imgs/freq.png";
import bck from "../../../assets/imgs/bck.png";


import ButtonParamedical from "../../../components/ButtonParamedical";
import { AppContext } from "../../../services/context";
import requestPatient from "../../../services/requestPatient";
import { apiPatient } from "../../../services/api";
import ModalParamedicalMutiple from "../../../components/ModalParamedicalMutiple";

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
  const { user } = authCtx;

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
        //console.log(res.data);
        setPatient(res.data);
      })
      .catch((error) => {
        //deconnect()
      });
  }, []);

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
            <span className="text-bold">{patient.weight} kg</span> <br />
            <span>Taille: </span>
            <span className="text-bold">{patient.height} m</span> <br />
            <span>IMC: </span>
            <span className="text-bold">{patient.imc} KG/M²</span> <br />
          </div>
        </div>
        <div>
          <button className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target={"#modalMul"}>Ajouter</button>
          <button className="btn btn-primary">Exporter le dossier</button>
        </div>
      </div>
      {paramedicalButton.map(({ id, img, title, label, link}) => {
        return (
          <div key={label}>
            <ButtonParamedical id={"modal" + id} img={img} title={title} link={link}/>
          </div>
        );
      })}
      <ModalParamedicalMutiple
              id={"modalMul"}
            />
    </>
  );
};

export default ContentParamedical;
