# Customizing
## Babel の設定のカスタマイズ
Next.js には `next/babel` のプリセットが含まれていて、そのプリセットには、React アプリケーションとサーバサイドのコードをコンパイルするのに必要なものがすべて含まれている。だが、デフォルトの Babel 設定をカスタマイズすることも可能である。  

そうするためには、 `.babelrc` ファイルをアプリのトップで定義するだけでよい。
以下がその例。
```json
{
    "preset": ["next/babel"],
    "plugins": []
}
```

`next/babel` プリセットは以下を含む：
- preset-env
- preset-react
- preset-typescript
- plugin-proposal-class-properties
- plugin-proposal-object-rest-spread
- plugin-transform-runtime
- styled-jsx

これらのプリセット/プラグインを設定するには、カスタムの `.babelrc` の `preset` や `plugins` に追加しないこと。かわりに、`next/babel` のプリセットで設定する。：

```json
{
  "presets": [
    [
      "next/babel",
      {
        "preset-env": {},
        "transform-runtime": {},
        "styled-jsx": {},
        "class-properties": {}
      }
    ]
  ],
  "plugins": []
}
```

## Customizing PostCSS Config
いったん省略。[元のドキュメント](https://nextjs.org/docs/advanced-features/customizing-postcss-config)。

## Custom Server
通常、`next start` でサーバーを起動するが、独自ルートパターンを使用するために 100 % プログラムでサーバを起動することも可能。

> カスタムサーバーを使用すると決める前に、Next.js の統合ルータではアプリの要件を満たせない場合にのみ使用すべきであることを心に留めておくこと。カスタムサーバを使用すると、サーバレス機能や自動静的最適化などの重要なパフォーマンス最適化が削除されてしまう。
  
カスタムサーバーの例  

```javascript
// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/b', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/a', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
```

> `server.js` は babel や webpack を経由しない。このファイルが必要とする構文とソースが、実行している現在のノードのバージョンと互換性があることを確認すること。

そうしたら、カスタムサーバを実行するために、`package.json` の `scripts` をアップデートする必要がある：

```JSON
"scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
}
```

-------
カスタムサーバは、サーバと Next.js アプリを接続するために以下のインポートを使う。

```javascript
const next = require('next')
const app = next({})
```

上記の `next` インポートは、以下のオプションを有したオブジェクトを受け取る関数である。
- `dev`: `Boolean` - Next.js を開発モードで起動するか否か。デフォルトは `false`
- `dir`: `String` - Next.js プロジェクトのロケーション。デフォルトは `'.'`
- `quiet`: `Boolean` - サーバ情報を含むエラーメッセージを隠すかどうか。デフォルトは `false`
- `conf`: `object` - next.config.js で使用するのと同じオブジェクト。デフォルトは `{}`

リターンされた `app` は Next.js に要求どおりにリクエストを処理させるよう使用することができる。

### Disabling file-system routing
デフォルトで `pages` ディレクトリ配下の各ファイルを、ファイル名に一致するパス名でサーブするが、この振る舞いを変えることもできる。詳細は省略。

## Custom `App`
Next.js ではページを初期化するために `App` コンポーネントが使われる。`App` コンポーネントをオーバーライドしてページ初期化を制御することができ、そうすることで以下のようなことが可能になる。
- ページ変更間のレイアウトの永続化
- ページ遷移時の state の維持
- `componentDidCatch` を使用することで独自のエラーハンドリング
- ページに追加のデータを注入する
- グローバル CSS を追加する

デフォルトの `App` をオーバーライドするためには、 `./pages/_app.js` ファイルを以下のように作成する。：

```javascript
function MyApp({ Component, pageProps }){
    return <Component {...pageProps} />
}

export default MyApp
```

`Component` プロパティはアクティブなページなので、route 間を移動するたびに `Component` は新しいページに変わる。したがって、`Component` に送ったプロパティはすべてページによって受け取られる。  

`pageProps` はページ用にプリロードされた初期 props を持つオブジェクト。`getInitialProps` を使っていなければ（ドキュメントママ。たぶん `getServerSideProps` でも同じ話かな、プリロードされた初期 props というからには）空オブジェクトになる。

> `App` に独自 `getInitialProps` を追加すると、自動静的最適化が無効になる。

## Custom `Document`

独自の `Document` はもっぱらアプリの `<html>` と `<body>` タグを補強するために使われる。Next.js のページでは、周囲のドキュメントのマークアップの定義がスキップされるため必要である。  

独自の `Document` には、非同期のサーバレンダリングデータの要件を表現するための `getInitialProps` を含めることもできる。  

デフォルトの `Document` をオーバーライドするためには、`./pages/_document.js` を作成して、以下のように `Document` クラスを extend する。

```javascript
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
              <Head />
              <body>
                 <Main />
                 <NextScript />
              </body>
            </Html>
        )
    }
}

export default MyDocument
```

`<Html>`, `<Head />`, `<Main />`, `< /NextScript>` はページが適切にレンダーされるために必要。
`<Html lang="en">` のようにカスタムアトリビュートの指定も可能。

`ctx` オブジェクトは `getInitialProps` 内で受け取るものに相当するが、ひとつだけ追加されているものがある：
- `renderPage`: `Function` - 実際の React のレンダリングロジックを実行するためのコールバック。サーバサイドレンダリングで適切に動くように外部ライブラリをラップするときなどに使う。
  
**注意**
- `Document` はサーバーでのみレンダリングされる。`onClick` のようなイベントハンドラは機能しない。
- `<Main />` の外の React コンポーネントはブラウザによって初期化されないので、アプリケーションロジックをそこに書かないこと。すべてのページに渡って共有されるコンポーネントが必要な場合（メニューやらツールバーやら）は、`App` コンポーネントをいじるとよい。
- `Document` の `getInitialProps` 関数はクライアントサイドでの遷移時や静的最適化された場合には呼ばれない。
- `ctx.req` / `ctx.res` が `getInitialProps` 内で定義されているかチェックすること。これらの変数は、自動静的最適化（Automatic Static Optimization）や `next export` によって静的にエクスポートされたときには `undefined` になる。

## Custom Error Page
### 404 Page
デフォルトでも 404 ページは用意されているが、`pages/404.js` を作成することで独自 404 ページを用意することができる。このファイルはビルド時に静的に作られる。

```javascript
// pages/404.js
export default function Custom404() {
    return <h1>404 - Page Not found</h1>
}
```

### 500 Page
デフォルトでは、Next.js はデフォルトの 404 ページのスタイルと一致する 500 エラーページを提供する。このページはサーバサイドのエラーを報告させるため、静的に最適化されていない。  

500 エラーはクライアントサイドでもサーバサイドでも `Error` コンポーネントによってハンドリングされる。それをオーバーライドするためには、`pages/_error.js` を定義して以下のようなコードを加える。：

```javascript
function Error({ statusCode }){
    return (
        <p>
          {statusCode
            ? `An error ${statusCode} occured on server`
            : 'An error occured on client'}
        </p>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
```

#### ビルトインのエラーページの再利用
`Error` コンポーネントをインポートする。

```javascript
import Error from 'next/error'
import fetch from 'isomorphic-unfetch'

const Page = ({ errorCode, stars }) => {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return <div>Next stars: {stars}</div>
}

Page.getInitialProps = async () => {
  const res = await fetch('https://api.github.com/repos/zeit/next.js')
  const errorCode = res.statusCode > 200 ? res.statusCode : false
  const json = await res.json()

  return { errorCode, stars: json.stargazers_count }
}

export default Page
```

`Error` コンポーネントは `title` プロパティも受け取ることができる。

## `src` ディレクトリについて
ページは `src/pages` 配下に置くこともできる（ルート直下の `pages` 配下に置くのではなく）。

**注意**
- `next.config.js` や `tsconfig.json` のような設定ファイルは root ディレクトリの中に置くこと。`src` フォルダの中に置くとうまく動かない。`public` ディレクトリについても同様。

## Multi Zones
Zone とは Next.js アプリの単一のデプロイである。複数の zone を持ち、それらを組み合わせひとつのアプリとすることもできる。  
たとえば、以下のアプリがあるとしよう。
- `/blog/**` をサーブしているアプリ
- その他すべてのページをサーブしている別のアプリ

マルチゾーンのサポートにより、これら両方のアプリをマージしてひとつのアプリとし、見にきたユーザは単一の URL でもってブラウズするようにできる。なお、開発やデプロイはそれらのアプリについて別々に行うことができる。

### How to define a zone
zone 関連の特別な API はない。以下のことを行うだけ：
- あるアプリに他のアプリ用のページが含まれていないことを確認する。例えばアプリ A が `/blog` というページを持っていたら、アプリ B は同じページを持っていてはいけない。
- 静的ファイルの衝突を防ぐために [assetPrefix](https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix) を付け加える。

### How to merge zones
HTTP プロクシを使って zone をマージする。
ZEIT now を使っている場合は、両方のアプリをデプロイするのに単一の `now.json` を使うことができる。

```json
{
  "version": 2,
  "builds": [
    { "src": "blog/package.json", "use": "@now/next" },
    { "src": "home/package.json", "use": "@now/next" }
  ],
  "routes": [
    { "src": "/blog/_next(.*)", "dest": "blog/_next$1" },
    { "src": "/blog(.*)", "dest": "blog/blog$1" },
    { "src": "(.*)", "dest": "home$1" }
  ]
}
```

