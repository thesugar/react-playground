import quotes from '../../quotes.json';

// every file inside `pages/api` is an API Route,
// that way we can distinguish between a lambda (serverless functions)
// and a React Component.
// `res.status` and `res.json` are custom response helpers added by Next.js.
export default (req, res) => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(200).json(quote);
};