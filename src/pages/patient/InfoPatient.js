import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profile from "../../assets/imgs/profile.png";
import sang from "../../assets/imgs/sang.png";

const InfoPatient = () => {
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    setDatas([...Array(20).keys()]);
  }, []);

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
            <span className="d-block text-bold text-meduim mb-3" style={{fontSize:"2rem"}}>
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
          <ul class="nav nav-tabs mx-0" role="tablist">
            <li class="nav-item">
              <Link class="nav-link active" data-bs-toggle="tab" to="#home">
                Rendez-vous
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" data-bs-toggle="tab" to="#menu1">
                Prescription
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" data-bs-toggle="tab" to="#menu2">
                Rapports médicaux
              </Link>
            </li>
          </ul>

          <div class="tab-content">
            <div id="home" class="container tab-pane active">
              <br />
              <h3>Rendez-vous</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div id="menu1" class="container tab-pane fade">
              <br />
              <h3>Prescription</h3>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div id="menu2" class="container tab-pane fade">
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
