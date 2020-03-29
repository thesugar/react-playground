import Link from 'next/link';
import React from 'react';

const linkStyle = {
    marginRight : 15
}

const Header = () => (
    <React.Fragment>
        <Link href='/'>
            <a style={linkStyle}>Home</a>
        </Link>
        <Link href='/about'>
            <a style={linkStyle}>About</a>
        </Link>
    </React.Fragment>
);

export default Header;