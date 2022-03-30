import React from 'react';

import YabbitsOriginalNFT from './artifacts/contracts/YabbitsOriginal.sol/YabbitsOriginalNFT.json';

import web3 from './plugins/web3';

// import css
import './style/AnimatedLoader.css'
import './style/Galery.css'
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import Gallery from "./components/Gallery";

const AnimatedLoader = () => {

    return (
        <div className="wrapper">
            <div id="dot1"></div>
            <div id="dot2"></div>
            <div id="dot3"></div>
            <div id="dot4"></div>
            <div id="dot5"></div>
            <div id="dot6"></div>
            <div id="dot7"></div>
            <div id="dot8"></div>
            <div id="dot9"></div>
            <div id="dot10"></div>
            <div id="base1"></div>
            <div id="base2"></div>
            <div id="base3"></div>
            <div id="base4"></div>
            <div id="base5"></div>
        </div>
    )
}

const Home = () => {

    const [nft, setNft] = React.useState(null);

    const web3Class = new web3(window.ethereum, '0xD795Bb0E45299f8e685B66e903e9c99C271576FF', YabbitsOriginalNFT.abi);
    web3Class.getTotalSupply().then(console.log);
    web3Class.getUserAddress().then(console.log);
    web3Class.getBalance().then(console.log);

    React.useEffect(() => {
        web3Class.listNFTsOwnedByUser(1, 9).then(setNft);
    }, []);

    const [playing, setPlaying] = React.useState(false);
    const [playingNFT, setPlayingNFT] = React.useState(null);

    const useToPlay = (nft) => {
        console.log(nft)
        setPlayingNFT(nft);
        setPlaying(true);
    }


    // if playing is true render Game else render Gallery
    return (
        <div className="home">
            <Navbar/>
            {playing ? <Game nft={playingNFT}/> : <div>
                <section className="gallery">
                    {nft ? (
                        <Gallery nft={nft} useToPlay={useToPlay}/>
                    ) : (
                        <AnimatedLoader/>
                    )}
                </section>
            </div>}
        </div>
    )
}
export default Home;