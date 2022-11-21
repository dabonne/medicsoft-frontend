import React, { useEffect, useState } from "react";
import back from "../../assets/imgs/back.png";
import sui from "../../assets/imgs/sui.png";
import sang from "../../assets/imgs/sang.png";
import { Route, Routes, useNavigate } from "react-router-dom";

const ListPatient = () => {
  const [datas, setDatas] = useState([]);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    setDatas([...Array(20).keys()]);
  }, []);

  

  const navigateToPatientInfo = (e,idx) =>{
    e.preventDefault()
    return navigate(`detail`)
  }

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
        <h1 className="h2">Mes patients</h1>
      </div>
      <div className="row my-4">
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

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 mb-4">
        {datas.map((data, idx) => {
          return (
            <div key={idx} className="col" type="button" onClick={(e) => navigateToPatientInfo(e,idx)}>
              <div className="card v-card shadow-sm p-1">
                <div className="d-inline-block mx-auto my-2">
                  <img
                    className="circle"
                    width="100%"
                    src={`https://source.unsplash.com/random/800x600/?product=${idx}`}
                    alt=""
                  />
                </div>
                <div className="mt-2 mb-5">
                  <span className="d-block text-center text-bold text-meduim">
                    Jannie DOE
                  </span>
                  <span className="d-block my-1 text-center">
                    <span>ID Patient: </span>
                    <span className="text-bold">P12902</span>
                  </span>
                  <span className="d-block my-1 text-center">
                    <span className="text-bold">23 ans . Femme</span>
                  </span>
                  <span className="d-block my-1 text-center">
                    <span className="text-bold text-meduim">
                      <img src={sang} alt="" /> O+
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ListPatient;
