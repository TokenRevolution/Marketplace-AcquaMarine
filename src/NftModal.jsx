import React from "react";

const NftModal = ({ catalogo, onClose }) => {
  return (
    <div className="nft-modal">
      <div className="modal-content">
        <br></br>
        <br></br>
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <br></br>
        <br></br>
        <div className="prodotto">
        <img id="cardiModal" src={catalogo.image} alt={catalogo.name} />
        <h2>{catalogo.name}</h2>
        <p>{catalogo.description}</p>
        <a href={catalogo.link}><button>Aggiungi al cerrello</button></a>
        </div>
        <div className="prodotto">
        <img id="cardiModal" src={catalogo.image} alt={catalogo.name} />
        <h2>{catalogo.name}</h2>
        <p>{catalogo.description}</p>
        <a href={catalogo.link}><button>Aggiungi al cerrello</button></a>
        </div>
        <div className="prodotto">
        <img id="cardiModal" src={catalogo.image} alt={catalogo.name} />
        <h2>{catalogo.name}</h2>
        <p>{catalogo.description}</p>
        <a href={catalogo.link}><button>Aggiungi al cerrello</button></a>
        </div>
        <div className="prodotto">
        <img id="cardiModal" src={catalogo.image} alt={catalogo.name} />
        <h2>{catalogo.name}</h2>
        <p>{catalogo.description}</p>
        <a href={catalogo.link}><button>Aggiungi al cerrello</button></a>
        </div>
        <div className="prodotto">
        <img id="cardiModal" src={catalogo.image} alt={catalogo.name} />
        <h2>{catalogo.name}</h2>
        <p>{catalogo.description}</p>
        <a href={catalogo.link}><button>Aggiungi al cerrello</button></a>
        </div>
        <div className="prodotto">
        <img id="cardiModal" src={catalogo.image} alt={catalogo.name} />
        <h2>{catalogo.name}</h2>
        <p>{catalogo.description}</p>
        <a href={catalogo.link}><button>Aggiungi al cerrello</button></a>
        </div>
      </div>
    </div>
  );
};

export default NftModal;
