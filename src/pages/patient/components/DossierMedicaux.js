import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { apiParamedical, apiPatient } from "../../../services/api";
import { AppContext } from "../../../services/context";
import requestPatient from "../../../services/requestPatient";
import requestDoctor from "../../../services/requestDoctor";

const DossierMedicaux = () => {
  const authCtx = useContext(AppContext)
  const {user} = authCtx
  const [data, setData] = useState("")
  const [syntheseList, setSyntheseList] = useState([])
  const header = {
    headers: { Authorization: `${user.token}` },
  };

  useEffect(() => {
    get()
    synthese()
  }, []);

  const get = () => {
    requestPatient
      .get(apiPatient.get + "/" + user.cni, header)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        
      })
      .catch((error) => {
        //deconnect()
      });
  }

  const synthese = () => {
    requestDoctor
      .get(apiParamedical.synthese + "/" + user.cni, header)
      .then((res) => {
        setSyntheseList(res.data);
        console.log(res.data);
        
      })
      .catch((error) => {
        //deconnect()
      });
  }
  return (
    <>
      <div className="row my-3">
        <div className="col-12 col-md-6">
          <div className="d-inline-block me-3 text-bold text-meduim align-top">
            <span>{data.lastname +" "+ data.firstname}</span>
          </div>
          <div className="d-inline-block">
            <span className="text-bold">{data.age} ans. {data.gender}</span> <br />
            <span>Date de naissance: </span>
            <span className="text-bold">{data.birthdate}</span> <br />
            <span>Poids: </span>
            <span className="text-bold">{data.weight} kg</span> <br />
            <span>Taille: </span>
            <span className="text-bold">{data.height} m</span> <br />
            <span>IMC: </span>
            <span className="text-bold">{data.imc} KG/M²</span> <br />
            <span>
              <Link to="/dashboard/patient/dossier-paramedical" className="text-black">
                Voir le dossier paramédical
              </Link>{" "}
            </span>{" "}
            <br />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="btn-group">
            <div className="btn btn-secondary me-2"
            onClick={ e =>{
              e.preventDefault()
              window.open(
                "https://doctor-management.herokuapp.com/doctor-management/external-api/doctor/medical-record/synthesis-report/" +
                  user.cni+"/"+user.organisationRef
              );
            }}
            
            >Synthèse</div>
            <div className="btn btn-primary me-2">Exporter le dossier</div>
          </div>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-5 my-5">
        <div className="col">
          <Link
            to="antecedent-personne"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Antécédents</span> <br />
            </div>
          </Link>
        </div>
        <div className="col">
          <Link
            to="imageries"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Compte rendu</span> <br />
              <span className="text-bold">d’imagerie</span> <br />
            </div>
          </Link>
        </div>
        <div className="col">
          <Link
            to="examens-specialises"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Compte rendu</span> <br />
              <span className="text-bold">d’examens</span> <br />
              <span className="text-bold">spécialisés</span> <br />
            </div>
          </Link>
        </div>
        <div className="col">
          <Link
            to="analyses-biologiques"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Compte rendu</span> <br />
              <span className="text-bold">d’analyses</span> <br />
              <span className="text-bold">biologiques</span> <br />
            </div>
          </Link>
        </div>
        <div className="col">
          <Link
            to="resume-consultation"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Résumé</span> <br />
              <span className="text-bold">consultation</span> <br />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DossierMedicaux;
