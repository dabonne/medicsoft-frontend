import React from "react";
import doctor from "./assets/imgs/doctor.svg";
import logo from "./assets/imgs/medicsoft.png";
import intersect from "./assets/imgs/intersect.png";
import btn_circle from "./assets/imgs/btn_circle.svg";
import pwd from "./assets/imgs/pwd.png";
import { Link } from "react-router-dom";

const Login = () => {


  const handleSubmit = () => {

  }
  return (
    <>
      <div className="d-none d-lg-block col-lg-5 h-100 illustration-img">
        <img width="110%" src={doctor} alt="" />
      </div>
      <div className="col-12 col-lg-7 h-100 illustration-form position-relative">
        <div className="row">
          <div className="col-12 px-3 col-sm-8 mx-auto">
            <form className="mt-5">
              <img
                className="mt-5 mb-3"
                src={logo}
                alt=""
                width="156.04px"
                height="35px"
              />
              <h1 className="text-bold m-0">Connexion</h1>
              <span>Heureux de vous revoir</span>

              <div className="form-floating mt-5 mb-4">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                />
                <label htmlFor="floatingInput">Email</label>
              </div>
              <div className="form-floating mb-4 position-relative">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                />
                <label htmlFor="floatingPassword">Mots de passe</label>
                <img
                  className="position-absolute eye-position"
                  src={intersect}
                  alt=""
                />
              </div>

              <div className="checkbox mb-4 position-relative">
                <label className="text-small align-middle">
                  <input
                    className="no-height"
                    type="checkbox"
                    value="remember-me"
                  />{" "}
                  Se souvenir de moi
                </label>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#pwd"
                  className="text-small link text-deco position-absolute top-0 end-0"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Link className="w-100 btn btn-lg btn-primary" to="/dashboard/">
                Se connecter
              </Link>
            </form>
          </div>
        </div>

        <div className="row position-absolute bottom-0 w-100">
          <div className="col-12 col-lg-9 text-center mx-auto my-2">
            <div className="text-small d-inline-block my-1 me-2">
              © Laafi Vision Médical All rights reserved.
            </div>
            <Link to="#" className="text-small link d-inline-block my-1 me-2">
              Terms
            </Link>
            <Link to="#" className="text-small link d-inline-block my-1">
              Privacy
            </Link>
          </div>
        </div>
      </div>
      <div className="col-12 position-relatve">
        <div className="position-fixed bottom-3 end-0">
          <img className="" src={btn_circle} alt="" />
        </div>
      </div>

      <div className="modal fade" id="pwd">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content ">
            <div className="modal-header border-0">
              
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body text-center col-12 col-md-10 mx-auto">
              <div><img src={pwd} alt="" /></div>
            <h4 className="modal-title text-meduim text-bold my-2">
              Mot de passe oublié?
              </h4>
              <p className="my-3">
                Veuillez renseigner votre email et nous vous enverrons un mail
                contenant les instructions pour réinitialiser votre mot de passe{" "}
              </p>

              <form className={""} onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer l'adresses mail"
                    value={""}
                    onChange={(e) => {
                      e.preventDefault();
                      
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer un email
                  </div>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    data-bs-dismiss="modal1"
                  >
                    Envoyer le mail de réinitialisation
                  </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
