import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profile from "../../assets/imgs/profile.png";
import sang from "../../assets/imgs/sang.png";
import back from "../../assets/imgs/back.png";
import sui from "../../assets/imgs/sui.png";
import view from "../../assets/imgs/view.png";
import edit from "../../assets/imgs/edit.png";
import del from "../../assets/imgs/delete.png";
import user from "../../assets/imgs/user.png";
import print from "../../assets/imgs/print.png";

const InfoPatient = () => {
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [list, setList] = useState("");

  useEffect(() => {
    setDatas([...Array(20).keys()]);
  }, []);

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
        <div className="col-10 col-sm-8 mx-auto col-md-5 col-lg-4">
          <img width="100%" src={profile} alt="" />

          <div className="border border-1 border-radius p-4 my-4">
            <p className="text-16 text-bold ps-1">Information du patient</p>
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
              <span className="text-bold">Téléphone: (00226) XX XX XX XX</span>
            </span>
            <span className="d-block my-1">
              <span className="text-bold">Ouagadougou, BURKINA FASO</span>
            </span>
            <span className="d-block my-1">
              <span className="text-bold text-meduim">
                <img src={sang} alt="" /> O+
              </span>
            </span>
          </div>
        </div>
        <div className="col-12 col-md-7 col-lg-8 mx-auto">
          <ul className="nav nav-tabs mx-0" role="tablist">
            <li className="nav-item">
              <Link className="nav-link active" data-bs-toggle="tab" to="#home">
                Rendez-vous
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" data-bs-toggle="tab" to="#menu1">
                Prescription
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" data-bs-toggle="tab" to="#menu2">
                Rapports médicaux
              </Link>
            </li>
          </ul>

          <div className="tab-content">
            <div id="home" className="container tab-pane active">
              <div className="row my-3">
                <div className="col-12">
                  <div className="d-inline-block">
                    <input
                      type="text"
                      className="form-control search"
                      placeholder="Rechercher..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        onSearch(e, search);
                      }}
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
                    1/10
                  </div>
                </div>
              </div>

              <div className="table-responsive-sm">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr className="align-middle">
                      <th scope="col" className="border-raduis-left">
                        Practiciens
                      </th>
                      <th scope="col">Date et heure</th>
                      <th scope="col">Statut</th>
                      <th scope="col" className="text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(9).keys()].map((data, idx) => {
                      //data.checkValue = false
                      return (
                        <tr key={idx}>
                          <td>
                            <div className="d-inline-block me-2 align-middle">
                              <img src={user} alt="" />
                            </div>
                            <div className="d-inline-block align-middle">
                              <span className="text-bold">Dr. Jannette DOE</span>
                              <br />
                              <span>Psychiatre</span>
                            </div>
                          </td>
                          <td>
                            <span className="text-bold">12/02/2023</span>
                            <br />
                            <span>
                              <span className="text-bold">Heure:</span> 10h30
                            </span>
                          </td>
                          <td>
                            <button className="btn bg-success border-radius text-bold">
                              Terminer
                            </button>
                          </td>
                          <td className="text-center">
                            <div className="btn-group">
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Voir l'employé"
                                  data-bs-toggle="modal"
                                  data-bs-target="#viewEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                    //viewEmploye(data);
                                  }}
                                  src={view}
                                  alt=""
                                />
                              </div>
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Désactiver l'utilisateur"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                  }}
                                  src={edit}
                                  alt=""
                                />
                              </div>
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Désactiver l'utilisateur"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                  }}
                                  src={del}
                                  alt=""
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div id="menu1" className="container tab-pane fade">
            <div className="row my-3">
                <div className="col-9">
                  <div className="d-inline-block">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        onSearch(e, search);
                      }}
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
                    1/10
                  </div>
                </div>
                <div className="col-3 d-flex justify-content-end align-items-center">
                  <button className="btn btn-primary">Ajouter</button>
                </div>
              </div>

              <div className="table-responsive-lg">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr className="align-middle">
                      <th scope="col" className="border-raduis-left">
                      Prescription ID
                      </th>
                      <th scope="col">Type</th>
                      <th scope="col">Date</th>
                      <th scope="col">Délivrée par</th>
                      <th scope="col" className="text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(9).keys()].map((data, idx) => {
                      //data.checkValue = false
                      return (
                        <tr key={idx}>
                          <td>
                            <span className="text-bold">PRESC-0218374</span>
                          </td>
                          <td>
                            <span className="text-bold">Ordonnance</span>
                          </td>
                          <td>
                            <span className="text-bold">12/02/2023</span>
                            <br />
                            <span>
                              <span className="text-bold">Heure:</span> 10h30
                            </span>
                          </td>
                          <td>
                            <div className="d-inline-block me-2 align-middle">
                              <img src={user} alt="" />
                            </div>
                            <div className="d-inline-block align-middle">
                              <span className="text-bold">Dr. Jannette DOE</span>
                              <br />
                              <span>Psychiatre</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="btn-group">
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Voir l'employé"
                                  data-bs-toggle="modal"
                                  data-bs-target="#viewEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                    //viewEmploye(data);
                                  }}
                                  src={view}
                                  alt=""
                                />
                              </div>
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Voir l'employé"
                                  data-bs-toggle="modal"
                                  data-bs-target="#viewEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                    //viewEmploye(data);
                                  }}
                                  src={print}
                                  alt=""
                                />
                              </div>
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Désactiver l'utilisateur"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                  }}
                                  src={edit}
                                  alt=""
                                />
                              </div>
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Désactiver l'utilisateur"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                  }}
                                  src={del}
                                  alt=""
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div id="menu2" className="container tab-pane fade">
              <br />
              <h3>Rapports médicaux</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPatient;
