# API Routes
API ルートは、Next.js を使って API を構築するための簡単なソリューションを提供する。  
`pages/api` の中に存在するあらゆるファイルは `/api/*` にマッピングされ、ページではなく、API エンドポイントとして扱われる。  

例えば、以下の API ルート `pages/api/user.js` はシンプルな `json` のレスポンスを扱う。

```javascript
export default (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ name : 'John Dae' }))
}
```

API ルートが機能するためには、上記のように関数を `export default` しないといけない（ちなみに、上記関数を **request handler** と呼ぶ）。リクエストハンドラが受け取るパラメータは次の 2 つ。
- `req`: http.IncomingMessage のインスタンス
- `res`: http.ServerResponse のインスタンス

異なる HTTP メソッドを 1 つのAPI ルートで扱うために、 `req.method` をリクエストハンドラの中で使うことができる。

```javascript
export default (req, res) => {
    if (req.method === 'POST') {
        // Process a POST request
    } else {
        // Handle any other HTTP method
    }
}
```

API Routes は CORS ヘッダを指定しない。つまり、デフォルトでは同じオリジンのみとなる。リクエストハンドラを CORS ミドルウェアでラップすることで、このような動作をカスタマイズできる。

## Dynamic API Routes
API Routes はダイナミックルーティングをサポートしている。`pages` と同じネーミングルールが使える。
例えば、 `pages/api/post/[pid].js` という API ルートは以下のようなコードで書ける：

```javascript
export default (req, res) => {
    const {
        query : { pid },
    } = req 

    res.end(`Post: ${pid}`)
}
```

ここで、`/api/post/abc` へのリクエストは `Post: abc` というレスポンスを返す。

### Catch all Api Routes
3 点ドットを使ってすべての paths をキャッチするのもページングにおけるルーティングと同じ。
`pages/api/post/[...slug].js` という API ルートは以下のようになる。

```javascript
export default (req, res) => {
    const {
        query: { slug },
    } = req

    res.end(`Post: ${slug.join(', ')}`)
}
```

ここで、 `api/post/a/b/c` へのリクエストは `Post: a, b, c` というレスポンスを返す。

## API Middlewares
API routes は、入ってくるリクエスト `req` を parse するための組み込みのミドルウェアを提供する。それは以下である：
- `req.cookies` - リクエストから送られてくるクッキーを含んだオブジェクト。デフォルトは `{}`。
- `req.query` - クエリ文字列を含んだオブジェクト。デフォルトは `{}`
- `req.body` - `content-type` によって parse される body を含んだオブジェクト。body がなければ `null`。

### Custom Config
すべての API ルートは `config` をエクスポートしてデフォルトの設定を変更することができる。

```javascript
export const config = {
    api: {
        bodyParser: {
            sizeLimit; '1mb',
        },
    },
}
```

`api` オブジェクトは API routes が利用可能なすべての設定を含む。
`bodyParser` は body の解析（parsing）を可能にするが、body を `Stream` として consume したければ `bodyParser: false` として無効にすることもできる。

### Connect/ Exporess middleware support
Connect 互換のミドルウェアを利用することもできる。たとえば、API エンドポイントに [CORS を設定する](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS) には、 cors パッケージを利用する。
まず、`cors` をインストールする。（`yarn add cors`）
そうしたら、 `cors` を API route に加える。

```javascript
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// and to throw an error when an error happens in a middleware
// (ミドルウェアの実行を待ってから続行し、ミドルウェアでエラーが発生した場合にエラーをスローするためのヘルパーメソッド)
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, result => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

async function handler(req, res) {
    // Run the middleware
    await runMiddleware(req, res, cors)

    // API ロジックの残りの部分
    res.json({ message: 'Hello Everyone!' })
}

export default handler
```

## Response Helpers
レスポンス `res` は Express.js 的なメソッドを含んでおり、開発者経験の向上および、新しい API エンドポイントの作成スピード向上に寄与する。

```javascript
export default (req, res) => {
    res.status(200).json({ name: 'Next.js' })
}
```

含まれているヘルパーは：
- `res.status(code)` - ステータスコードをセットする関数。 `code` は有効な HTTP のステータスコードである必要あり。
- `res.json(json)` - JSON レスポンスを送る。`json` は有効な　JSON オブジェクトでないとだめ。
- `res.send(body)` - HTTP レスポンスを送る。 `body` は `string`、`object` あるいは `buffer`。