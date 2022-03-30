import React from 'react';

import YabbitsOriginalNFT from './artifacts/contracts/YabbitsOriginal.sol/YabbitsOriginalNFT.json';

import web3 from './plugins/web3';

// import css
import './style/AnimatedLoader.css'
import './style/Galery.css'
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import Gallery from "./components/Gallery";
import PolygonAPI from "./plugins/polygonAPI";

const AnimatedLoader = ({value, maxValue}) => {
    let percent = (value / maxValue * 100).toFixed(2);

    return (
        <div className="progress-container">
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
            <progress id="progress" value={value} max={maxValue}>
            </progress>
            <p className="progress-value">
                {percent}%
            </p>
        </div>
    )
}

const Home = () => {

    const [nft, setNft] = React.useState(null);

    const web3Class = new web3(window.ethereum, '0xD795Bb0E45299f8e685B66e903e9c99C271576FF', YabbitsOriginalNFT.abi);
    web3Class.getTotalSupply().then(console.log);
    web3Class.getUserAddress().then(console.log);
    web3Class.getBalance().then(console.log);

    const polygonAPI = new PolygonAPI('0xD795Bb0E45299f8e685B66e903e9c99C271576FF');

    const [loading, setLoading] = React.useState(0);
    const [maxLoading, setMaxLoading] = React.useState(0);

    React.useEffect(() => {

        let ntfs = []
        polygonAPI.listTokenOf(web3Class.getUserAddress()).then(res => {
            if (res.length > 10) {
                // slice
                res = res.slice(0, 10);
            }

            res.forEach((tokenId, index) => {
                setMaxLoading(res.length + 1);
                ntfs.push(web3Class.getNFTURI(tokenId))
                setLoading(index + 1);
            });

            setNft(ntfs);
        });
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
                        <AnimatedLoader value={loading} maxValue={maxLoading}/>
                    )}
                </section>
            </div>}
        </div>
    )
}
export default Home;