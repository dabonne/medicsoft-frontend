import React, { useState } from "react";
import view from "../assets/imgs/view.png";
import edit from "../assets/imgs/edit.png";
import del from "../assets/imgs/delete.png";
import back from "../assets/imgs/back.png";
import sui from "../assets/imgs/sui.png";

const Employe = () => {
  const [datas, setDatas] = useState([...Array(12).keys()]);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Les employés</h1>
        <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newEmploye"
          >
            Ajouter un employé
          </button>
        </div>
      </div>
      <div className="modal fade" id="newEmploye">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Ajout d’un(e) employé(e)
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form action="">
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer le nom de famille de l’employé(e)"
                    name="lname"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Prénom(s)
                  </label>
                  <input
                    type="name"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer le ou les prenom(s) de l’employé(e)"
                    name="fname"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Date de naissance
                  </label>
                  <input
                    type="name"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer la date de naissance"
                    name="fname"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Numéro CNI
                  </label>
                  <input
                    type="name"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer le numéro CNI"
                    name="fname"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Email
                  </label>
                  <input
                    type="name"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer l’adresse mail"
                    name="fname"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Telephone
                  </label>
                  <input
                    type="name"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer le numero de téléphone"
                    name="fname"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Classification
                  </label>
                  <select className="form-select">
                    <option>Choisir la classification</option>
                    <option>classification 1</option>
                    <option>classification 2</option>
                    <option>classification 3</option>
                    <option>classification 4</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Spécialistion
                  </label>
                  <input
                    type="name"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer la spécialisation"
                    name="fname"
                  />
                </div>
              </form>
            </div>

            <div className="modal-footer d-flex justify-content-start border-0">
              <button
                type="reset"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Effacer
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Ajouter l’employé(e)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-12">
          <div className="d-inline-block my-1 me-1">
            <img src={del} alt="" />
          </div>
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control search"
              placeholder="Rechercher..."
            />
          </div>
          <div className="btn-group">
          <div className="d-inline-block my-1 mx-1">
            <img src={back} alt="" />
          </div>
          <div className="d-inline-block my-1 mx-1">
            <img src={sui} alt="" />
          </div>
          </div>
          <div className="d-inline-block my-1 mx-1 text-meduim text-bold">
            Page 1/10
          </div>
        </div>
      </div>
      <p className="text-ultra-small">12 éléments affichés</p>
      <div className="table-responsive-sm">
        <table className="table table-striped align-middle">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="border-raduis-left">
                #
              </th>
              <th scope="col">Nom et Prénom(s)</th>
              <th scope="col">Département</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((data, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <input type="checkbox" value="selected" />
                  </td>
                  <td>Jannette DOE</td>
                  <td>Département 1</td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img src={view} alt="" />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img src={edit} alt="" />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img src={del} alt="" />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Employe;
