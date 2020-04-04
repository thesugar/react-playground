# Advanced Features
## Preview Mode
Static Generation はヘッドレス CMS からデータをフェッチするときに便利だが、ヘッドレス CMS に下書きを書いていて、まず下書きを **プレビュー** したいときには理想的ではない。

Next.js でこれらのページをビルド時でなくリクエスト時にレンダリングし、公開するコンテンツではなくドラフトのコンテンツを取得するようにしたいとする。このような場合にかぎり、 Next.js は静的生成をバイパスするようにしたいとする。  

Next.js にはプレビューモードという機能があり、この問題を解決する。ここではその使い方を説明する。

### Step 1. プレビュー API route を作り、アクセスする
まず、プレビュー API route を作る。名前はなんでもよい。たとえば、 `pages/api/preview.js`（TypeScript の場合 `.ts`）など。　　

この API route では、レスポンスオブジェクトの `setPreviewData()` を呼ぶ必要がある。`setPreviewData()` の引数はオブジェクト。

```javascript
export default (req, res) => {
    // ...
    res.setPreviewData({})
    // ...
}
```

`res.setPreviewData()` はプレビューモードを有効にするブラウザのクッキーを設定する。これらのクッキーを含む Next.js へのリクエストはプレビューモードとみなされ、静的に生成されたページの動作が変更される（これについては後述）。
  
以下のような API ルートを作成し、ブラウザから手動でアクセスすることで、手動でテストできる。

```javascript
// pages/api/preview.js にあるとすると、ブラウザから /api/preview を開いて確認する
export default (req, res) => {
    res.setPreviewData({})
    res.end('Preview mode enabled')
}
```

ほか、細かい設定あり

### Step 2. `getStaticProps` をアップデートする
プレビューモードのクッキーを設定した状態で `getStaticProps` を持ったページへリクエストを送信すると、`getStaticProps` が（ビルド時ではなく）リクエスト時に呼ばれる。  
さらに、以下の状態の `context` オブジェクトとともに呼ばれる：
- `context.preview` が `true`
- `context.previewData` が `setPreviewData` の引数に使われたものと同じ

この詳細は、実際にプレビューモードを利用するときに[公式ドキュメント](https://nextjs.org/docs/advanced-features/preview-mode) を読むのがよさそう。


## Dynamic Import
### 基本的な使い方

```javascript
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/hello'))

const Home = () => {
    return (
        <div>
            <Header />
            {/* '../components/hello' を dynamic import する */}
            <DynamicComponent />
            <p>HOME PAGE is here!</p>
        </div>
    )
}

export default Home
```

### 名前付き export の場合
上の例では、 `'../components/hello'` は、そのモジュール内でコンポーネントがデフォルトエクスポートされている前提だが、そうでない場合、たとえば、以下のように `Hello` という名前付きでエクスポートされているモジュールを考えてみよう。

```javascript
export function Hello() {
    return <p>Hello!</p>
}
```

この `Hello` コンポーネントをダイナミックインポートするためには、`import()` からリターンされる Promise から、それ（`Hello` コンポーネント）をリターンする。以下のコードを見た方がはやい。

```javascript
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() =>
    import('../components/hello').then(mod => mod.Hello)
)

// ...
```

### カスタムローディングコンポーネント
オプショナルな `loading` コンポーネントを追加して、ダイナミックコンポーネントがロードされている間にローディング状態をレンダリングすることができる。たとえば：

```javascript
import dynamic from 'next/dynamic'

const DynamicComponentWithCustomLoading = dynamic(
    () => import('../components/hello'),
    { loading: () => <p>...</p> }
)

// 以下同じ...
```

### With no SSR
いつもモジュールをサーバサイドに含めたいというわけではない、たとえば、ブラウザのみで機能するライブラリを含む場合などである。その場合は以下のようにする。

```javascript
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
    () => import('../components/hello'),
    { ssr: false }
)
```

### Automatic Static Optimization
ページが静的かどうかの自動判定機能。ページに `getInitialProps` があるかないかで判定される（ドキュメントママ。今は `getServerSideProps` とかを見てるのかな？）  

`getInitialProps` が存在する場合、 Next.js はデフォルトの動作を使用し、リクエストごとにページをレンダリングする（サーバーサイドレンダリング）。  

`getInitialProps` がない場合、 Next.js は静的な HTML にページをプリレンダリングすることで自動的にページを静的に最適化する。プリレンダリング中は、このフェーズで提供するクエリ情報がないため、ルーターのクエリオブジェクトは空になる。クエリの値は、ハイドレーションの後にクライアント側で入力される。  

`next build` とすると静的に最適化されたページの `.html` ファイルが出力される。例えば、`pages/about.js` の結果は次のようになる。

```zsh
.next/server/static/${BUILD_ID}/about.html
```

ページに `getInitialProps` を付け加えた場合は、以下のように JavaScript になる。

```zsh
.next/server/static/${BUILD_ID}/about.js
```

開発時には、静的最適化インディケータ（static optimization indicator）が含まれているので、`pages/about.js` が最適化されているかどうかわかる。

## Static HTML Export
`next export` することで、アプリケーションを静的な HTML としてエクスポートできる。  
エクスポートされたアプリケーションはほとんどの Next.js の特徴をサポートしている。たとえばダイナミックルーティングやプリフェッチング、プレローディングやダイナミックインポートなどだ。  

`next export` はまずすべてのページを HTML にプリレンダリングするがそれは `exportPathMap`（html をレンダリングするにあたって事前定義済の path を提供する）を呼び出すことで行われる。  

### 使い方
ふつうにアプリを作ったあと、以下を実行する。

```zsh
next build && next export
```

これは、`package.json` の中で以下のように定義して、

```json
"scripts": {
    "build" : "next build && next export"
}
```

その後、`yarn build` とするのでもよい。そうすると、 `out` ディレクトリの中にアプリの静的バージョンが吐き出される。