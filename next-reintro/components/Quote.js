import useSWR from 'swr';

const fetcher = url => {
    return fetch(url).then(r => r.json());
}

const Quote = () => {
    const fetcher = url => {
        return fetch(url).then(r => r.json());
    }
    
    const { data, error } = useSWR('../pages/api/randomQuote'. fetcher);
    
    // hoge?.fuga is the same as `hoge && hoge.fuga`
    const author = data?.author;
    let quote = data?.quote;

    if (!data) quote = 'Loading...';
    if (error) quote = 'Failed to fetch the quote';

    return (
        <main className='center'>
            <div className='quote'>{quote}</div>
            {author && <span className='author'>- {author}</span>}

            <style jsx>{`
                main {
                    width: 90%;
                    max-width: 900px;
                    margin: 300px auto;
                    text-align: center;
                }
                .quote {
                    font-family: cursive;
                    color : #559834;
                    font-size: 20px;
                }
            `}</style>
        </main>
    );
}

export default Quote;