import React from "react";
import NftCard from "./NftCard";
import NftModal from "./NftModal";
import { nfts } from "./nfts";
import { catalogo } from "./catalogo";

class NFT extends React.Component {
  state = {
    showModal: false,
    selectedNft: null,
  };

  handleOpenModal = (catalogo) => {
    this.setState({
      showModal: true,
      selectedNft: catalogo,
    });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      selectedNft: null,
    });
  };

  render() {
    return (
      <div>
        <h1>Ecommerce AcquaMarine</h1>
        <div className="nft-grid">
          {nfts.map((nft) => (
            <NftCard
              key={nft.id}
              nft={nft}
              onClick={() => this.handleOpenModal(nft)}
            />
          ))}
        </div>
        {this.state.showModal && (
          <NftModal
            catalogo={this.state.selectedNft}
            onClose={this.handleCloseModal}
          />
        )}
      </div>
    );
  }
}

export default NFT;
