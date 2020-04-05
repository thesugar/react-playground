# AMP Support
（注意）AMP では CSS-in-JS のみがサポートされており、CSS モジュールは現時点ではサポートされていない。

## AMP Components を追加する
AMP コミュニティは、AMPページをよりインタラクティブなものにするために [多くのコンポーネント](https://amp.dev/documentation/components/) を提供している。Next.js は自動的に、ページ内で使われるすべての AMP コンポーネントをインポートするので、手動で AMP コンポーネントをインポートする必要はない。

```javascript
export const config = { amp: true }

function MyAmpPage() {
    const date = new Date()

    return (
        <div>
            <p>Some time: {date.toJSON()}</p>
            <amp-timeago
                width="0"
                height="15"
                datetime={date.toJSON()}
                layout="responsive"
            >
            .
            </amp-timeago>
        </div>
    )
}

export default MyAmpPage
```

例えば上記の例では `amp-timeago` コンポーネントを利用している。  

デフォルトでは、コンポーネントの最新バージョンがつねにインポートされる。もしもバージョンをカスタマイズしたい場合は、`next/head` を使って指定することができる。

```javascript
import Head from 'next/head'

export const config = { amp: true }

function MyAmpPage() {
    const date = new Date()

    return (
        <div>
            <Head>
                <script
                  async
                  key="amp-timeago"
                  custom-element="amp-timeago"
                  src="https://cdn.ampproject.org/v0/amp-timeago-0.1.js"
                />
            </Head>
        {/* ... */}
        </div>
    )
}
```

## AMP Validation
開発中は AMP ページは `amphtml-validatior` によって自動的にバリデートされる。ページは Static HTML export するときにも自動でバリデートされ、あらゆる警告やエラーはターミナルに出力される。AMP エラーはステータスコード `1` で exit される。

## AMP in Static HTML export
`next export` を使って Static HTML export を行い静的にページをプリレンダリングするとき、Next.js はページが AMP をサポートしているかどうかを検知し、それに基づいてエクスポートの振る舞いを変更する。  

たとえば、ハイブリッドな AMP ページ `page/about.js` があった場合、以下を出力する：
- `out/about.html` - クライアントサイドの React ランタイムを備えた HTML
- `out/about.amp.html` - AMP ページ

もし `pages/about.js` が AMP のみのページであれば、以下を出力する：
- `out/about.html` - 最適化された AMP ページ

## TypeScript
現時点では TypeScript 用のビルトインの型は無い。Workaround として、手作業で `amp.d.ts` ファイルをプロジェクトの中に作って、[ここ](https://stackoverflow.com/questions/50585952/typescript-and-google-amp-property-amp-img-does-not-exist-on-type-jsx-intrin/50601125#50601125) にあるようにカスタム型を追加することはできる。