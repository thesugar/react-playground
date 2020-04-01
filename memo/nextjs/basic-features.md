# Basic Features
## Pages
Next.js では、 **ページ** は `pages` ディレクトリ内の `.js`, `.tsx` ファイルからエクスポートされる React コンポーネント。

### Pre-rendering
デフォルトで、Next.js はすべてのページを pre-render する。つまり Next.js は事前に各ページから HTML を生成するということ（クライアントサイドで行うのではなく）。Pre-rendering によってより良いパフォーマンスと SEO が期待できる。  

生成された各 HTML は最小限の JavaScript コードに紐づいている。ページがブラウザによってロードされると、JavaScript コードが実行され、そのページはインタラクティブになる（このプロセスは **hydration** と呼ばれる）。

#### Two forms of Pre-rendering
Next.js には 2 種類の Pre-rendering の形がある。違いは、いつ HTML が生成されるかである。  

- Static Generation (推奨) : ビルド時に HTML が生成され、各リクエストでその HTML が再利用される。
- Server-side Rendering : 各リクエストごとに HTML が生成される。

ほとんどのページに Static Generation を利用し、その他少数のページに Server-side Rendering を利用するといったような　"hybrid" なアプリを作ることもできるし、Static Generation や Server-side Rendering とあわせて **Client-side Rendering** を用いることもいつでもできる。

#### いつ Static Generation を使うべきか
可能なときはいつでも使うことを推奨。いろいろな種類のページで活用できる。たとえば：
- マーケティングページ
- ブログ
- E コマース商品リスト
- ヘルプページやドキュメンテーション

「ユーザーのリクエストに **先立って** ページを pre-render できるだろうか？」と考えてみて、答えが yes なら、Static Generation を選ぶべき。  

頻繁にアップデートされるデータを表示するときや、ページの内容がリクエストごとに変わるときは Static Generation を利用するのはよい考えではない。

## Data Fetching
### `getStaticProps` (Static Generation)
ビルド時に、 `getStaticProps` から返される props を使ってページを pre-render する。

```javascript
export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    }
}
```

`context` パラメータは以下のキーを含むオブジェクト。
    - `params`: 動的ルーティングを使っているページのルートパラメータ。例えば、
    ページの名前が `[id].js` なら、`params` は `{ id : ...}` のようになる。
    これを利用するときは `getStaticPaths` と一緒に使うべきである。
    - `preview`：ページがプレビューモードなら `true`、そうでなければ `false`
    - `previewData`：`setPreviewData` によってセットされるプレビューデータ。

#### いつ `getStaticProps` を使うべきか？
- レンダーに必要なデータが、ユーザーからのリクエストに先立って、ビルド時には手元にあるとき
- ヘッドレス CMS から来るデータを利用するとき
- データがパブリックにキャッシュされうるとき（ユーザー固有でないとき）
- ページが SEO のために pre-render され、速く動作する必要があるとき。`getStaticProps` は HTML と JSON ファイルを生成し、それらは CDN によってキャッシュされる。

#### TypeScript
TypeScript では `GetStaticProps` を使う。

```typescript
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async context => {
    // ...
}
```

#### `process.cwd()` について
`getStaticProps` のファイルシステムから、ファイルを直接読み取ることができる。  
そのためには、ファイルのフルパスを取得する必要がある。
そこで使われるのが `process.cwd()` であり、Next.js が実行されるディレクトリが得られる。

```javascript
import fs from 'fs';
import path from 'path';

// ...

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)
  // ...
```

#### Technical details
- ビルド時にのみ実行される
    - クエリパラメータや HTTP ヘッダーなど、ユーザーからのリクエスト時にのみ得られるデータを受け取ることはできない。
- サーバサイドのコードを直接書ける
    - `getStaticProps` はサーバサイドでのみ実行され、クライアントサイドで実行されることは決してない（ブラウザーへの JS バンドルに含まれることすらない）。そのため、DB へのクエリなどのコードを直接書いて問題ない。`getStaticProps` から API route をフェッチするべきではなく、かわりに、サーバサイドのコードを直接書くのがよい。
- HTML と JSON の両方を静的に生成する
    - `getStaticProps` を含むページがビルド時に pre-render されると、ページの HTML に加えて、 Next.js は　`getStaticProps`　の実行結果を含んだ JSON ファイルを生成する。
    - この JSON ファイルは `next/link` や `next/router` によるクライアントサイドでのルーティングに使われる。
- page ファイル内のみで書くこと
    - `getStaticProps` は page ファイルからのみ export できる。
    - また、 `export async function getStaticProps() {} ` のように書くべきで、（`getInitialProps` のように、）ページのプロパティにしてはいけない。
- 開発環境では毎リクエスト実行される

### `getStaticPaths` (Static Generation)

```javascript
export async function getStaticPaths() {
    return {
        paths: [
            { params : { ... }}
        ],
        fallback : true or false
    };
}
```

#### `paths` キー
pre-render される path を定めるもの。 `pages/posts/[id].js` という名前の動的ルーティングのページがあるとして、そのページから `getStaticPaths` を export して、 `paths` として以下のように return した場合・・・

```javascript
return {
    paths: [
        { params: { id: '1' } },
        { params: { id: '2' } }
    ],
    fallback: ...
}
```

Next.js は静的に `posts/1` と `posts/2` をビルド時に生成する。
なお、 各 `params` の値は、ページ名に使われているパラメータと一致している必要がある。

- ページの名前が `pages/posts/[postId]/[commentId]` のとき、 `params` には `postId` と `commentId` が含まれている必要あり。
- ページ名が `pages/[...slug]` のような形であれば、 `params` には `slug` が配列の形で含まれていなければならない。たとえば、配列が `['foo', 'bar']` なら、 Next.js は静的に `/foo/bar` というページを生成する。

#### `fallback` キー
##### `fallback: false`
`getStaticPaths` から return されていない path へアクセスしたときには 404 になる。
pre-render すべき path が少ししかないときにはこの方式が便利。また、新しいページが頻繁には加えられないときもこのやり方が有用。

#### `fallback: true`
- `getStaticPaths` から return された path はビルド時に HTML になる
- ビルド時に生成されなかった path は 404 ページにはならず、最初にその path にリクエストがあったときそのページの "fallback" バージョンを生成する。
- バックグラウンドではリクエストがあった path の HTML や JSON が静的に生成される。
- それが完了したら、ブラウザは生成された path の JSON を受け取る。これにより、ページが自動的にレンダーされる。ユーザーから見たら、fallback ページからフルページに遷移するように見える。
- 同時に、 Next.js はこの path　を pre-render されたページたちのリストに加える。以降の、同じページへのリクエストには、上で生成されたページが使われる。
- `router` オブジェクト（`useRouter()` から返される）->  fallback かどうかは `router.isFallback` で検知できる。

#### fallback: true はどんなときに便利なのか
アプリに、データに依存する静的ページがたくさんある場合に便利（大規模な E コマースサイトなど）。すべての製品ページをプリレンダリングしていたら、ビルドに時間が無限にかかる。  

その代わりに、ページの小さなサブセットを静的に生成し、残りの部分には fallback:true を使用することで、誰かがまだ生成されていないページをリクエストすると、ユーザーは loading... 的なインディケータ付きのページを見ることになるがすぐに getStaticProps によってフルページのレンダリングがなされ、その後は、同じページをリクエストした人は誰でも、静的にプリレンダリングされたページを取得する。

#### TypeScript
TypeScript では `GetStaticPaths` を使う。

```typescript
import { GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
    // ...
}
```

#### Technical details
- `getStaticProps` と一緒に使うべし
- サーバサイドで、ビルド時にしか実行されないよ
- page ファイルのみからエクスポートすべし
- 開発モードでは毎リクエスト実行される

#### 例

```javascript
// pages/posts/[id].js
import { useRouter } from 'next/router'
import fetch from 'node-fetch'

function Post({ post }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [{ params: { id: 1 } }, { params: { id: 2 } }],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}

export default Post
```

### `getServerSideProps` (Server-side Rendering)

```javascript
export async funtion getServerSideProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    }
}
```

`context` パラメータは以下のキーを含むオブジェクト
- `params` : このページがダイナミックルーティングを利用していた場合、 `params` にはルーティング用のパラメータが含まれる。ページ名が `[id].js` だった場合、 `params` は `{ id: ...}` のようになる。
- `req` : HTTP IncomingMessage object
- `res` : HTTP response object
- `query` : クエリ文字列
- `preview` : プレビューモードのとき `true` で、そうでないとき `false`
- `previewData` : `setPreviewData` によってセットされるプレビューデータ

例

```javascript
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```

#### いつ `getServerSideProps` を使うべきか？
getServerSideProps は、リクエスト時にデータを取得しなければならないページを、プリレンダリングする必要がある場合にのみ使用すべし。Time to first byte (TTFB) は getStaticProps よりも遅くなる。 なぜなら、サーバーはリクエストごとに結果を計算しなければならず、結果は追加の設定なしでは CDN によってキャッシュされないため。

データをプリレンダリングする必要がない場合は、クライアント側でデータをフェッチすることを検討すべき。

#### TypeScript

```typescript
import { GetServerSideProps } from `next`

export const getServerSideProps : GetServerSideProps = async context => {
    // ...
}
```

#### Technical details
- サーバサイドのみで実行される
    - このページを直接リクエストすると、リクエスト時に getServerSideProps が実行され、このページは返された props でプリレンダリングされる。
    - `next/link` や `next/router` を介してクライアント側のページ遷移でこのページをリクエストすると、Next.js はサーバーに API リクエストを送信し、`getServerSideProps` を実行する。`getServerSideProps` を実行した結果を含む JSON を返し、その JSON がページのレンダリングに使用される。この作業はすべて Next.js が自動的に処理してくれるので、getServerSideProps が定義されていれば余計なことをする必要はない。
- page ファイルのみからエクスポートすべし

### クライアントサイドにおけるデータ取得
頻繁に更新されるデータが含まれていて、また、データをプリレンダリングする必要がない場合、クライアントサイドでデータを取得することができる。たとえばユーザーに固有のデータなどが例として当てはまる。そのときの流れは次のようになる。：
- まず、データ無しのページを表示する。一部は静的生成によってプリレンダリングされているかもしれない。欠けているデータに対しては loading 表示を出すこともできる。
- 次に、クライアントサイドでデータを取得して、準備ができたらそれを表示する。
  
このアプローチはユーザーのダッシュボードページなんかで有用だろう。　ダッシュボードはプライベートで個々のユーザーに固有のものだし、SEO は関係なく、プリレンダリングされている必要もないからだ。そしてデータは頻繁に更新され、リクエスト時のデータ取得が必要になるためである。

#### SWR
データフェッチングのための React フック。クライアントサイドでデータを取得するときにはおすすめ。キャッシュや再検証（revalidation）、フォーカストラッキング、インターバルでのリフェッチなどを処理する。

```javascript
import useSWR from `swr`

function Profile() {
    const { data, error } = useSWR('/api/user', fetch)

    if (error) return <div>failed to load </div>
    if (!data) return <div>loading... </div>
    return <div> hello {data.name}! </div>
}
```