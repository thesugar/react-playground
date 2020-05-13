import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

const getSortedPostsData = () => {
    // /posts 配下のファイル名を取得する
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {
        // id として使うためにファイル名から .md を削除する
        const id = fileName.replace(/\.md$/, '')
        
        // マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // 投稿のメタデータ部分を解析するために gray-matter を使う
        const matterResult = matter(fileContents)

        // データを id と合わせる
        return {
            id,
            ...matterResult.data
        }
    })

    return allPostsData.sort((a, b) => {
        return (a.date - b.date)
    })
}

const getAllPostIds = () => {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map(fileName => {
        return { 
            params : {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

const getPostData = async id => {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    // markdown -> html
    const processedContent = await remark().use(html).process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        id,
        contentHtml, // is a content of an article
        ...matterResult.data // is metadata of an article
    }
}

module.exports = { getSortedPostsData, getAllPostIds, getPostData }