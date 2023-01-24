import React, { useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";

const Prescription = ({setLocation}) => {
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [list, setList] = useState("");
  setLocation(window.location.pathname)
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
    <div className="container-fluid">
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
              <th scope="col">Date de délivrance</th>
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
                          title="Voir la prescription"
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
                          title="Imprimer la prescription"
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
                          title="Éditer la prescription"
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
                          title="Supprimer la prescription"
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
  );
};

export default Prescription;
