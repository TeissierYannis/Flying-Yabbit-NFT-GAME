import React from "react";

const Navbar = () => {
    return (
        <nav>
            <div className="container">
                <div className="grid">
                    <div className="column-xs-12 column-md-10">
                        <p id="highlight">Flying Yabbits</p>
                    </div>
                    <div className="column-xs-12 column-md-2">
                        <ul>
                            <li><a href="/" className="active">Collection</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;