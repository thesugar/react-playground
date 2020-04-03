# Routing
## Introduction
ファイルが `pages` ディレクトリに追加されると、自動的に route として利用できるようになる。  
`pages` ディレクトリの中のファイルは、ほとんどの一般的なパターンを定義するために使用することができる。

### Index routes
router は `index` と名のつくファイルを自動的にディレクトリの root に route する。
- `pages/index.js` -> `/`
- `pages/blog/index.js` -> `/blog`

### Nested routes
ネストされたフォルダ構造を作成した場合、ファイルは自動的に同じ方法でルーティングされる。
- `pages/blog/first-post.js` -> `/blog/first-post`
- `pages/dashboard/settings/username.js` -> `/dashboard/settings/username`

### Dynamic route segments
ブラケット構文により、名前付きパラメータをマッチさせることができる。
- `pages/blog/[slug].js` -> `/blog/:slug`（`/blog/hello-world`）
- `pages/[username]/settings.js` -> `/:username/settings` (`/foo/settings`)
- `pages/post/[...all].js` -> `/post/*`（`/post/2020/id/title`）

### Linking between pages
クライアントサイドでのページ遷移は `Link` を使う。  
dynamic path segments でルーティングを行うときは、 ルーターがどの JavaScript ファイルを読み込むべきかわかるように `href` と `as` を与える。
- `href` - `pages` ディレクトリ内のファイル名。例えば、 `blog/[slug]`
- `as` - ブラウザに表示される URL。例えば `blog/hello-world`

```javascript
import Link from `next/link`

const Home = () => {
    return (
        <ul>
            <li>
                <Link href="/blog/[slug]" as="/blog/hello-world">
                    <a>To Hello World Blog post</a>
                </Link>
            </li>
        </ul>
    )
}

export default Home
```

### ルーター注入（Injecting the router）
`router` オブジェクトにアクセスするためには `useRouter` か `withRouter` を利用する。一般的には `useRouter` が推奨。

## Dynamic Routes
ブラケット記法によってダイナミックルーティングを実現できる。  
たとえば以下のページ `pages/post/[pid].js` を考えると：  

```javascript
import { useRouter } from 'next/router'

const Post = () => {
    const router = useRouter()
    const { pid } = router.query

    return <p>Post: {pid}</p>
}

export defaut Post
```

`post/1` や `post/abc` のようなあらゆるルーティングは `pages/post/[pid].js` にマッチする。マッチした path パラメータはクエリパラメータとしてページに送られ、他のクエリパラメータとマージされる。  

例えば、 `/post/abc` という route は以下の `query` オブジェクトを持つ。

```javascript
{ "pid" : "abc" }
```

似たように、`post/abc?foo=bar` という route は以下の `query` オブジェクトを持つ。

```javascript
{ "foo" : "bar", "pid": "abc" }
```

複数の route segments も同様に機能する。 `pages/post/[pid]/[comment].js` は `/post/abc/a-comment` にマッチし、 `query` オブジェクトは `{ "pid" : "abc", "comment": "a-comment" }` のようになる。

### Catch all routes
ブラケットの中で三点ドットを利用することで、すべての paths をキャッチするようにダイナミックルーティングを拡張できる。

- `pages/post/[...slug].js` は `/post/a` にもマッチするし、 `/post/a/b` や `/post/a/b/c` にもマッチする。
- もちろん、`slug` 以外の変数名も使える。`[...param].js` でも `[...all].js` でもよい。

マッチしたパラメータはクエリパラメータ（今の例では `slug`）としてページに送られるが、それはつねに配列であり、たとえば `/post/a` という path の `query` オブジェクトは `{ "slug" : ["a"] }` になる。  

`post/a/b` というケースでは `query` オブジェクトは `{ "slug" : ["a", "b"] }` になる。

#### 備考
自動静的最適化（Automatic Static Optimization）によって静的に最適化されたページは、ルートパラメータが提供されないままハイドレーションされる。
ハイドレーションの後、Next.js はアプリケーションの更新をトリガーにして、クエリオブジェクトにルートパラメータを提供する。

## Imperatively （命令的）
Router API を使った命令的なクライアントサイドでのページ遷移（ただし、 `next/link` で大体のルーティング絡みのニーズは事足りる）。

```javascript
import Router from 'next/router'

Router.push('/')
```

## Shallow Routing
シャロールーティングによって、 `getInitialProps` を走らせることなく URL を変更できる。  
`router` オブジェクト（`useRouter` あるいは `withRouter` から取得できる）を通じて、状態（state）を失うことなく、更新された `pathname` と `query` を受け取る。  

たとえば、`/` というページにいるときに、 `/?counter=10` という URL に、（ページの更新をすることなく）飛ばすことができるっぽい。使用ケースのイメージはあまり沸かない。。  
なお、同じページ URL 内での遷移のみが機能するようで、たとえば、 `/?counter=10` から `/about?counter=10` へのシャローな遷移はできないようである。