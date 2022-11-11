import React, { useEffect, useState } from "react";
import view from "../assets/imgs/view.png";
import edit from "../assets/imgs/edit.png";
import del from "../assets/imgs/delete.png";
import back from "../assets/imgs/back.png";
import sui from "../assets/imgs/sui.png";
import requestEmploye from "../services/requestEmploye";
import { apiEmploye } from "../services/api";

const Employe = () => {
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [dele, setDelete] = useState("");
  const [datas, setDatas] = useState([]);
  const [list, setList] = useState([]);
  const [jsData, setJsData] = useState({
    registrationReference: "",
    firstName: "",
    lastName: "",
    cnib: "",
    title: "",
    birthdate: "",
    specialisation: "",
    specialisations: {},
    classification: "",
    classifications: {},
    email: "",
    phone: "",
    medicalStaff: "",
  });
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [cnib, setCnib] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [classification, setClassification] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  useEffect(() => {
    requestEmploye
      .get(apiEmploye.getAll)
      .then((res) => {
        setDatas(res.data.employeeResponseList);
        setList(res.data.employeeResponseList);
        //console.log(res.data.employeeResponseList);
      })
      .catch((error) => {});
  }, [refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(jsData)
    requestEmploye
      .post(apiEmploye.post, jsData)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitEdite = (e) => {
    e.preventDefault();
    //console.log(jsData)
    requestEmploye
      .put(apiEmploye.put, jsData)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getJsData = (e) => {
    e.preventDefault();
    requestEmploye
      .get(apiEmploye.getJsData)
      .then((res) => {
        //get dataForm success
        setJsData(res.data);
        setLastName("");
        setFirstName("");
        setBirthdate("");
        setCnib("");
        setEmail("");
        setPhone("");
        setClassification("");
        setSpecialisation("");
      })
      .catch((error) => {
        //get dataForm faille
        console.log(error);
      });
  };

  const getEmploye = (e, ref) => {
    e.preventDefault();
    console.log("getEmploye");
    requestEmploye
      .get(`${apiEmploye.get}/${ref}`)
      .then((res) => {
        //setDatas(res.data.employeeResponseList);
        console.log(res.data.employeeResponseList);
        setLastName(res.data.employeeResponseList[0].lastName);
        setFirstName(res.data.employeeResponseList[0].firstName);
        //setBirthdate(res.data.employeeResponseList[0].birthdate);
        setCnib(res.data.employeeResponseList[0].cnib);
        setEmail(res.data.employeeResponseList[0].email);
        setPhone(res.data.employeeResponseList[0].phone);
        setClassification(res.data.employeeResponseList[0].classification);
        setSpecialisation(res.data.employeeResponseList[0].specialisation);
        jsData.specialisations =
          res.data.employeeResponseList[0].specialisations;
        jsData.classifications =
          res.data.employeeResponseList[0].classifications;
        jsData.employeeReference =
          res.data.employeeResponseList[0].employeeReference;
          jsData.registrationReference =
          res.data.employeeResponseList[0].employeeReference;
        setJsData(jsData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onDelete = (e) => {
    e.preventDefault();
    requestEmploye
      .delete(
        `${apiEmploye.delete}/${dele}` /*, {
                headers: { Authorization: `Bearer ${user.token}` },
            }*/
      )
      .then((res) => {
        console.log("suppression ok");
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Employés</h1>
        <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newEmploye"
            onClick={(e) => getJsData(e)}
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
              <form onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer le nom de famille de l’employé(e)"
                    value={lastName}
                    onChange={(e) => {
                      e.preventDefault();
                      setLastName(e.target.value);
                      jsData.lastName = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Prénom(s)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer le ou les prenom(s) de l’employé(e)"
                    value={firstName}
                    onChange={(e) => {
                      e.preventDefault();
                      setFirstName(e.target.value);
                      jsData.firstName = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    placeholder="Entrer la date de naissance"
                    value={birthdate}
                    onChange={(e) => {
                      e.preventDefault();
                      setBirthdate(e.target.value);
                      jsData.birthdate = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cni" className="form-label">
                    Numéro CNI
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cni"
                    placeholder="Entrer le numéro CNI"
                    value={cnib}
                    onChange={(e) => {
                      e.preventDefault();
                      setCnib(e.target.value);
                      jsData.cnib = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Entrer l’adresse mail"
                    value={email}
                    onChange={(e) => {
                      e.preventDefault();
                      setEmail(e.target.value);
                      jsData.email = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Telephone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    placeholder="Entrer le numero de téléphone"
                    value={phone}
                    onChange={(e) => {
                      e.preventDefault();
                      setPhone(e.target.value);
                      jsData.phone = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clst" className="form-label">
                    Classification
                  </label>
                  <select
                    id="clst"
                    className="form-select"
                    value={classification}
                    onChange={(e) => {
                      e.preventDefault();
                      setClassification(e.target.value);
                      jsData.classification = e.target.value;
                      setJsData(jsData);
                    }}
                  >
                    <option>Choisir la classification</option>
                    {Object.keys(jsData.classifications).map((key) => {
                      return (
                        <option key={key} value={jsData.classifications[key]}>
                          {jsData.classifications[key]}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="spft" className="form-label">
                    Spécialisation
                  </label>
                  <select
                    id="spft"
                    className="form-select"
                    value={specialisation}
                    onChange={(e) => {
                      e.preventDefault();
                      setSpecialisation(e.target.value);
                      jsData.specialisation = e.target.value;
                      jsData.title = jsData.specialisations[e.target.value];
                      setJsData(jsData);
                    }}
                  >
                    <option>Choisir la specialisation</option>
                    {Object.keys(jsData.specialisations).map((key) => {
                      return (
                        <option className="w-100" key={key} value={key}>
                          {jsData.specialisations[key]}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Ajouter l’employé(e)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editEmploye">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Modification d’un(e) employé(e)
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmitEdite}>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer le nom de famille de l’employé(e)"
                    value={lastName}
                    onChange={(e) => {
                      e.preventDefault();
                      setLastName(e.target.value);
                      jsData.lastName = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Prénom(s)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer le ou les prenom(s) de l’employé(e)"
                    value={firstName}
                    onChange={(e) => {
                      e.preventDefault();
                      setFirstName(e.target.value);
                      jsData.firstName = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    placeholder="Entrer la date de naissance"
                    value={birthdate}
                    onChange={(e) => {
                      e.preventDefault();
                      setBirthdate(e.target.value);
                      jsData.birthdate = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cni" className="form-label">
                    Numéro CNI
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cni"
                    placeholder="Entrer le numéro CNI"
                    value={cnib}
                    onChange={(e) => {
                      e.preventDefault();
                      setCnib(e.target.value);
                      jsData.cnib = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Entrer l’adresse mail"
                    value={email}
                    onChange={(e) => {
                      e.preventDefault();
                      setEmail(e.target.value);
                      jsData.email = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Telephone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    placeholder="Entrer le numero de téléphone"
                    value={phone}
                    onChange={(e) => {
                      e.preventDefault();
                      setPhone(e.target.value);
                      jsData.phone = e.target.value;
                      setJsData(jsData);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clst" className="form-label">
                    Classification
                  </label>
                  <select
                    id="clst"
                    className="form-select"
                    value={classification}
                    onChange={(e) => {
                      e.preventDefault();
                      setClassification(e.target.value);
                      jsData.classification = e.target.value;
                      setJsData(jsData);
                    }}
                  >
                    <option>Choisir la classification</option>
                    {Object.keys(jsData.classifications).map((key) => {
                      return (
                        <option key={key} value={jsData.classifications[key]}>
                          {jsData.classifications[key]}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="spft" className="form-label">
                    Spécialisation
                  </label>
                  <select
                    id="spft"
                    className="form-select"
                    value={specialisation}
                    onChange={(e) => {
                      e.preventDefault();
                      setSpecialisation(e.target.value);
                      jsData.specialisation = e.target.value;
                      jsData.title = jsData.specialisations[e.target.value];
                      setJsData(jsData);
                    }}
                  >
                    <option>Choisir la specialisation</option>
                    {Object.keys(jsData.specialisations).map((key) => {
                      return (
                        <option className="w-100" key={key} value={key}>
                          {jsData.specialisations[key]}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Sauvegarder les informations
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="deleteEmploye">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Supprimer l'employé</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">Comfirmer l'action</div>

            <div className="modal-footer">
            <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  onDelete(e);
                }}
              >
                Supprimer
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Annuler
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
            {list.map((data, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <input type="checkbox" value="selected" />
                  </td>
                  <td>{data.firstName + " " + data.lastName}</td>
                  <td>{data.department}</td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img src={view} alt="" />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          data-bs-toggle="modal"
                          data-bs-target="#editEmploye"
                          onClick={(e) => {
                            getEmploye(e, data.employeeReference);
                          }}
                          src={edit}
                          alt=""
                        />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          data-bs-toggle="modal"
                          data-bs-target="#deleteEmploye"
                          onClick={(e) =>{
                            e.preventDefault()
                            setDelete(data.employeeReference)
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
    </>
  );
};

export default Employe;
