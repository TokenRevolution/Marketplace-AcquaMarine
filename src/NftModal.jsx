import React from "react";

const NftModal = ({ nft, onClose }) => {
  return (
    <div className="nft-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <img id="cardiModal" src={nft.image} alt={nft.name} />
        <h2>{nft.name}</h2>
        <p>{nft.description}</p>
        <a href={nft.link}><button>Buy</button></a>
      </div>
    </div>
  );
};

export default NftModal;
