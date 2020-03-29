import allQuotes from '../../quotes.json';

// every file inside `pages/api` is an API Route,
// that way we can distinguish between a lambda (serverless functions)
// and a React Component.
// `res.status` and `res.json` are custom response helpers added by Next.js.

export default (req, res) => {
    // API routes provide built in middlewares which parse the incoming `req`, like
    // `req.query`. Let's enhance our API to read query params and filter results acordingly.
    const { author } = req.query;
    let quotes = allQuotes;

    if (author) {
        quotes = quotes.filter(quote => quote.author.toLowerCase().includes(author.toLowerCase()));
    }

    if (!quotes.length) {
        quotes = allQuotes.filter(quote => quote.author.toLowerCase() === 'unknown')
    }

    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    
    res.status(200).json(quote);
};