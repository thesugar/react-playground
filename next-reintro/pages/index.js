import React, { useEffect } from 'react';
import Layout from '../components/MyLayout';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Quote from '../components/Quote';

const ShowLink = ({ show }) => (
    <li key={show.id}>
        <Link href='/show/[id]' as={`/show/${show.id}`}>
            <a>{show.name}</a>
        </Link>
        <style jsx>
            {`
                li {
                    list-style: none;
                    margin: 5px 0;
                }

                a {
                    text-decoration: none;
                    color: blue;
                    padding : 5px;
                }
            `}
        </style>
    </li>
);

const Index = props => {
    // useEffect はクライアントサイドで描画後に実行される。
    useEffect(() => console.log(`props.shows.length is ${props.shows.length}`));

    return (
        <Layout>
            <h1>Batman TV Shows</h1>
            <ul>
                {props.shows.map(show => (
                    <ShowLink key={show.id} show={show} />
                ))}
            </ul>
            {/* CSS rules written in styled-jsx have no effect on
            elements inside of a child component (i.e. <ShowLink />) */}
            <style jsx>
                {`
                h1,
                a {
                    font-family: 'Arial';
                }

                ul {
                    padding: 0;
                }
            `}
            </style>
            {/* When you add `global` in styled-jsx, 
            CSS rules are applied to a child component */}
            <style jsx global>
                {`
                a:hover {
                    opacity: 0.6;
                    background-color : pink;
                }
                `}
            </style>
            <Quote />
        </Layout>
    );
}

// サーバサイドで API からデータをフェッチして Index に props として渡す
// console.logの中身はサーバサイドのコンソールにしか出てこない
Index.getInitialProps = async () => {
    const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
    const data = await res.json();

    console.log(`Show data fetched. Count: ${data.length}`);

    return {
        shows: data.map(entry => entry.show)
    };
};

export default Index;