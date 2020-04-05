# Next.config.js
## 概要
Next.js のふるまいをカスタムするには、`next.config.js` をプロジェクトルートに作る。（`package.json` と同じ階層）

`next.config.js` は Node.js のモジュールであって JSON ファイルではない。Next.js サーバとビルドフェーズで使われて、ブラウザのビルドには含まれない。  

例を見てみよう。

```javascript
module.exports = {
    /* ここに設定のオプションを書く　*/
}
```

関数を使うこともできる。

```javascript
module.exports = (phase, { defaultConfig }) => {
    return {
        /* ここに設定のオプション */
    }
}
```

`phase` は設定がロードされる現在の context。[ここ](https://github.com/zeit/next.js/blob/canary/packages/next/next-server/lib/constants.ts#L1-L4) から利用可能な phase を確認することができる。phase は `next/constants` からインポートできる。

```javascript
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            /*  development only config options here */
        }
    }

    return {
        /* config options for all phases except development here */
    }
}
```

## 環境変数
JavaScript バンドルに環境変数を追加するためには、`next.config.js` を開いて `env` 設定を追加する。：
```javascript
module.exports = {
    env: {
        customKey: 'my-value',
    },
}
```

こうすることで、コードの中で `process.env.customKey` とすればアクセスできる。

```javascript
function Page() {
    return <h1>The value of customKey is: {process.env.customKey}</h1>
}

export default Page
```

Next.js はビルド時に `process.env.customeKey` を `'my-value'`に置き換える。

## Asset Prefix による CDN サポート
CDN を設定するには、アセットプレフィックスを設定し、Next.js がホストされているドメインに解決するように CDN のオリジンを設定する。

```javascript
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    // Use the CDN in production and localhost for development
    assetPrefix: isProd ? 'https://cdn.mydomain.com' : '',
}
```

Next.js はロードするスクリプトで自動的にプレフィックスを使用するが、パブリックフォルダにはなんの影響もない。CDN 上でアセットを提供したい場合は、自分でプレフィックスを導入する必要がある。

## Build Target
Next.js は様々なビルドターゲットをサポートしており、それぞれのターゲットによってアプリのビルドや実行方法が変わる。

### `server` ターゲット
> これがデフォルトのターゲットだが、 `serverless` ターゲットを強く推奨する。
デフォルトのターゲット。`next start` ともカスタムサーバーとも互換性がある（カスタムサーバの場合は必須）。  

アプリケーションはモノリス（大きな単一の機能によって 1 つの処理を実現するためのアーキテクチャ）としてビルドされ、デプロイされる。これはデフォルトのターゲットであるため、追加の設定は不要。

### `serverless` ターゲット
ZEIT Now へのデプロイはこのターゲットを自動的に有効にする。自分でオプトインする必要はないが、オプトインすることもできる。  

このターゲットは、モノリシックサーバを必要としない独立したページを出力する。

`next start` またはサーバレスデプロイプラットフォーム（ZEIT now など）のみと互換性があり、カスタムサーバ API を用いることはできない。  

このターゲットをオプトインするには、`next.config.js` で以下の設定を行う。

```javascript
module.exports = {
    target: 'serveless'
}
```

## その他
その他、webpack の設定やランタイムの設定も `next.config.js` でできる。