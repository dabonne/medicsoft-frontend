import React from "react";
import hp from "../assets/imgs/home_profile.png";
import homeBg from "../assets/imgs/home_bg.png";

const Home = () => {
  return (
    <>
      <div className="row">
        <h1 className="h2">Accueil</h1>
      </div>
      <div className="row my-4">
        <div className="col-12 col-md-6">
          <img width="100%" src={homeBg} alt="" />
        </div>
        <div className="col-12 col-md-5 bg-secondary border-radius">
          <div className="row">
          <div className="col-7 d-flex align-items-center">
            <div>
            <span className="d-block">Connecté en tant que</span>
            <span className="d-block text-meduim text-bold">Jannette DOE</span>
            <span className="d-block">
              Adminstrateur(rice) de la plateforme
            </span>
            </div>
          </div>
          <div className="col-3">
            <img src={hp} alt="" />
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
