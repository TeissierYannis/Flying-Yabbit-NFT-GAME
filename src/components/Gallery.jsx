import React from 'react';

const Gallery = (props) => {

    const {nft, useToPlay} = props;

    return (
        <div className="container">
            <div className="grid">
                {nft.map(nft => (
                    <div className="column-xs-12 column-md-4" key={nft.id}>
                        <figure className="img-container">
                            <img src={nft.uri}
                                 alt={"Yabbits Original #" + nft.id}/>

                            <div className="info">{"Yabbits Original #" + nft.id}
                                <button className="select-btn" onClick={() => {
                                    useToPlay(nft)
                                }}>Select
                                </button>
                            </div>
                            <span className="img-content-hover"/>
                        </figure>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;