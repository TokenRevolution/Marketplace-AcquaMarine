import React from "react";

const NftCard = ({ nft, onClick }) => {
  return (
    <div className="nft-card" onClick={onClick}>
      <img id="cardi" src={nft.image} alt={nft.name} />
      <h2>{nft.name}</h2>
      <p>{nft.description}</p>
      <button>VEDI IL CATALOGO</button>
    </div>
  );
};

export default NftCard;
