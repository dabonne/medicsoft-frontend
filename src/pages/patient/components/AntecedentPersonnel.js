import React, { useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";


const AntecedentPersonnel = ({setNameIdx}) => {

    const [datas, setDatas] = useState([]);
    const [search, setSearch] = useState("");
    const [list, setList] = useState("");
    setNameIdx(1)

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
    return(
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
                    <div className="btn btn-secondary me-2">Synthèse</div>
                    <button className="btn btn-primary">Ajouter</button>
                </div>
              </div>

              <div className="table-responsive-lg">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr className="align-middle">
                      <th scope="col" className="border-raduis-left">
                        Antécédent ID
                      </th>
                      <th scope="col">Nom de maladie</th>
                      <th scope="col">Période</th>
                      <th scope="col">Lien de parenté</th>
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
                            <span className="text-bold">PRESC-0218374</span>
                          </td>
                          <td>
                            <span className="text-bold">Tuberculose</span>
                          </td>
                          <td>
                            {
                                (data % 2 === 0) ? <span className="text-bold">12/02/2013 - 12/03/2015</span> :
                                <span className="text-bold">Héréditaire</span>
                            }
                          </td>
                          <td>
                            {
                                (data % 2 === 0) ? <span className="text-bold">Personnel</span> :
                                (data % 3 === 0) ? <span className="text-bold">Père</span> :
                                <span className="text-bold">Mère</span>
                            }
                            
                          </td>
                          <td className="text-center">
                            <div className="btn-group">
                            <div className="d-inline-block mx-1">
                                <img
                                  title="Éditer le rapport"
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
                                  title="Supprimer le rapport"
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
    )
}

export default AntecedentPersonnel;