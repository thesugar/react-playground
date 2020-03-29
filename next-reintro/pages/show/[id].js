import Layout from '../../components/MyLayout';
import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';

const Post = props => {
    // getInitialProps 内で context.query.id を取得することもできるし
    // ここで useRouter 使って query.id を取り出すこともできる
    const router = useRouter();

    return (
        <Layout>
            <h1>{props.show.name}</h1>
            <h2>{router.query.id}</h2>
            <p>{props.show.summary.replace(/<[/]?[pb]>/g, '')}</p>
            {props.show.image ? <img src={props.show.image.medium} /> : null}
        </Layout>
);
}

// the first argument of the function is the context object.
// It has a `query` object that we can use to fetch information.
Post.getInitialProps = async context => {
    // ここでは useRouter 使えない。
    // Hookを使えるのは関数のトップレベルのみで、getInitialPropsは
    // Postという関数の中の関数だから。
    // const router = useRouter();
    const { id } = context.query;
    const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
    const show = await res.json();

    // This is gonna only logged on the browser console because we navigate to the post via the client side.
    // When users click on a link wrapped with the `<Link>` component,
    // the page transition takes place in the browser, without making a request to the server.
    // If users visit a post page directly (e.g. http://localhost:3000/show/975), they'll see the log printed
    // on the **server but not in the client**.
    console.log(`Fetched show: ${show.name}`);

    return { show };
}

export default Post;