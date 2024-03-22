import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { apiParamedical, apiPatient } from "../../../services/api";
import { AppContext } from "../../../services/context";
import requestPatient from "../../../services/requestPatient";
import requestDoctor from "../../../services/requestDoctor";
import InformationPatient from "../../../components/InformationPatient";

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
      <InformationPatient />
      <div className="row row-cols-1 row-cols-md-5 my-5">
        <div className="col mb-3">
          <Link
            to="antecedent-personne"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Antécédents</span> <br />
            </div>
          </Link>
        </div>
        <div className="col mb-3">
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
        <div className="col mb-3">
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
        <div className="col mb-3">
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
        <div className="col mb-3">
          <Link
            to="resume-consultation"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Compte</span> <br />
              <span className="text-bold">Rendu</span> <br />
            </div>
          </Link>
        </div>
        <div className="col mb-3">
          <Link
            to="fichier-dossier-medicaux"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Fichiers</span> <br />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DossierMedicaux;
