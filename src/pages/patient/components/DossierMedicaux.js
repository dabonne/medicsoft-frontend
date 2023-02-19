import React from "react";
import { Link } from "react-router-dom";

const DossierMedicaux = () => {
  return (
    <>
      <div className="row my-3">
        <div className="col-12 col-md-6">
          <div className="d-inline-block me-3 text-bold text-meduim align-top">
            <span>Jannie DOE</span>
          </div>
          <div className="d-inline-block">
            <span className="text-bold">23 ans. Femme</span> <br />
            <span>Date de naissance: </span>
            <span className="text-bold">12/12/1999</span> <br />
            <span>Poids: </span>
            <span className="text-bold">89kg</span> <br />
            <span>Taille: </span>
            <span className="text-bold">1m 90</span> <br />
            <span>IMC: </span>
            <span className="text-bold">24.65 KG/M²</span> <br />
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
            <div className="btn btn-secondary me-2">Synthèse</div>
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
              <span className="text-bold">personnels et</span> <br />
              <span className="text-bold">familiaux</span> <br />
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
            to="divers"
            className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
          >
            <div className="text-center">
              <span className="text-bold">Divers</span> <br />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DossierMedicaux;
