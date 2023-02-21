import React, { useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";

const RendezVous = ({setLocation}) => {
    const [datas, setDatas] = useState([]);
    const [search, setSearch] = useState("");
    const [list, setList] = useState("");
    const doctor = [
      {name:"Sawadogo Jean Brice", sp:"Pediatre"},
      {name:"Coulibaly Philippe", sp:"Psychiatre"},
      {name:"Dembele Hoda", sp:"Cardiologue"},
      {name:"Bazongo Bonou", sp:"Pediatre"},
    ]
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
            {[...Array(4).keys()].map((data, idx) => {
              //data.checkValue = false
              return (
                <tr key={idx}>
                  <td>
                    <div className="d-inline-block me-2 align-middle">
                      <img src={user} alt="" />
                    </div>
                    <div className="d-inline-block align-middle">
                      <span className="text-bold">Dr. {doctor[idx].name}</span>
                      <br />
                      <span>{doctor[idx].sp}</span>
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
                    {data % 2 === 0 ? (
                      <button className="btn bg-success border-radius-2">
                        Terminer
                      </button>
                    ) : data % 3 === 0 ? (
                      <button className="btn bg-warning border-radius-2">
                        En attente
                      </button>
                    ) : (
                      <button className="btn bg-danger border-radius-2">
                        Annuler
                      </button>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Voir le patient"
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
                      {data % 2 === 0 && (
                        <div className="d-inline-block mx-1">
                          <img
                            title="Supprimer le patient"
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
                      )}
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

export default RendezVous;
