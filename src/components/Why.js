import React from "react";
import './Why.css'

export default function Why() {
  return(
    <section className="why">
      <div className="container-fluid">
        <div className="content">
          <h2>WHY <span>CHOOSE US?</span></h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    <div className="card-icon">
                      <i className="bi bi-wallet2"></i>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">RIP COLLECTION</h5>
                      <p className="card-text">Digital games die when servers shut down, access is restricted, or they're delisted, rendering them unplayable</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    <div className="card-icon">
                    <i className="bi bi-check2-square"></i>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">TOKENIZED GAMES</h5>
                      <p className="card-text">Own your own games that are saved in a private blockchain</p>
                    </div>
                  </div>
                </div>
              </div>
           
            </div>
            <div className="col-md-4">
              <div className="row justify-content-center">
                <div className="col-md-12">
                <img className="img-fluid center-img" src={require('../images/land-cta.png')} alt="center-img"/>          
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    <div className="card-icon">
                    <i className="bi bi-brush"></i>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">Sell your own games</h5>
                      <p className="card-text">You could tranfer ownership of your asset without relying on a centralized server</p>
                    </div>
                  </div>
                </div>
              </div>
             
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    <div className="card-icon">
                    <i className="bi bi-boxes"></i>
                    </div>
                  </div>
                  <div className="col-md-8">
                  <div className="card-body">
                      <h5 className="card-title">Backup your games</h5>
                      <p className="card-text">Even after server shut down yu cud verify game wnership through tokens</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}