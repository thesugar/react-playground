import Layout from '../../components/layout';
import utilStyles from '../../styles/utils.module.css'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'

type PostProps = {
    postData: {
        title: string
        date: string
        contentHtml: string
    }
}

const Post = ({ postData }: PostProps ) => {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}

const getStaticPaths = async () => {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

type Props = {
    params: {
        id : string
    }
}

const getStaticProps = async ({ params } : Props ) => {
    const postData = await getPostData(params.id)
    return {
        props: {
            postData
        }
    }
}

export default Post;
export { getStaticPaths, getStaticProps };