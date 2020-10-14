本日は Next.js 9.5 についてご紹介します。以下のような特徴があります:

- **[安定版としての段階的な静的再生成](#stable-incremental-static-regeneration)**: デプロイ後、ミリ秒単位で静的ページを再ビルドします
- **[カスタマイズ可能なベースパス](#customizable-base-path)**: ドメインの下位パスに Next.js プロジェクトを簡単にホストします
- **[リライト、リダイレクト、ヘッダーのサポート](#support-for-rewrites-redirects-and-headers)**: バニティ URL の書き換えや、古い URL のリダイレクト、静的ページへのヘッダーの追加
- **[オプションの URL の末尾スラッシュ](#optional-trailing-slash-in-urls)**: URL の末尾のスラッシュの有無を一貫して強制します
- **[ページバンドルのための永続的なキャッシュ](#persistent-caching-for-page-bundles)**: 変更されていないページの JavaScript ファイルが複数のビルド間で引き継がれるようになりました
- **[Fast Refresh 機能の強化](#fast-refresh-enhancements)**: Next.js のライブエディット体験の信頼性が向上します
- **[本番環境での React のプロファイリング](#production-react-profiling)**: プロジェクトのレンダリングにどれくらい「コスト」がかかっているか測定するための新しいフラグ
- **[オプションのキャッチオール型ルート（すべてのルートのキャッチ）](#optional-catch-all-routes)**: 動的ルートは、SEO 駆動のユースケースにさらなる柔軟性を提供するようになりました
- **[Webpack 5 のサポート（ベータ版）](#webpack-5-support-beta)**: オプションで、次のバージョンの webpack 5 にオプトインすることで、ビルドサイズと速度が向上します

## 安定版としての段階的な静的再生成

Next.js は
[バージョン 9.3 で静的サイト生成](https://nextjs.org/blog/next-9-3#next-gen-static-site-generation-ssg-support)
を導入しましたが、そのとき、明確な目標を念頭に置いていました: つまり、[静的であることの恩恵](https://rauchg.com/2020/2019-in-review#static-is-the-new-dynamic) （つねに高速であり、つねにオンラインであり、[世界中に複製されている](https://rauchg.com/2020/static-hoisting#hoist-to-the-edge)）を得つつ、
Next.js が得意とする、動的なデータへの充実したサポートも行うということです。

この両方のいいとこ取りをするために、Next.js は **段階的な静的再生成** を導入しましたが、
それはサイトをすでにビルドしてしまった後に静的なコンテンツを更新するというものでした。
[`getStaticPaths` の中で `fallback: true` オプション](https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required)を使うことで、**新しい静的ページを** **_実行時_ に** **登録する** ことができるのです。

Next.js はこの方法で、データセットがどれだけ大きくとも、無数のページをオンデマンドでプリレンダリングすることができます。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">As of Next.js 9.3+, static generation is possible at build time. But also at runtime!<br><br>This demo shows off Jamstack at scale on <a href="https://twitter.com/vercel?ref_src=twsrc%5Etfw">@vercel</a> – to the tune of 500M new pages a day 😁<a href="https://t.co/ppNoRKNiZV">https://t.co/ppNoRKNiZV</a></p>&mdash; Guillermo Rauch (@rauchg) <a href="https://twitter.com/rauchg/status/1253478798286151680?ref_src=twsrc%5Etfw">April 24, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

今日は **段階的な静的再生成** の _一般的な利用可能性_ をお伝えしようと思います。これは、トラフィックの流入に合わせてバックグラウンドで既存のページを再レンダリングすることによって **_既存の_ ページを更新する** メカニズムです。

バックグラウンドでの再生成は [stale-while-revalidate](https://tools.ietf.org/html/rfc5861) にインスパイアされており、このバックグラウンド再生成を利用することで、トラフィックが途切れることなく提供（サーブ）されること、つねに静的ストレージから提供されること、そして新しくビルドされたページは _生成が終わった後にのみ_ プッシュされることが確約されます。

```tsx
export async function getStaticProps() {
  return {
    props: await getDataFromCMS(),
    // 以下のタイミングと条件でページを再生成します:
    // - リクエストが来たとき
    // - 最大でも 1 秒に 1 回
    revalidate: 1
  }
}
```

<Caption>
  revalidate フラグは最大で何秒に 1 回再生成が行われるかの数字で、
  <a href="https://en.wikipedia.org/wiki/Cache_stampede">
    https://en.wikipedia.org/wiki/Cache_stampede
  </a>
  を防ぎます。
</Caption>

従来の SSR とは異なり、段階的な静的再生成を利用すれば、静的であることのメリットを確実に得ることができます:

- レイテンシが突然高まるというようなことは起こりません。ページは一貫して高速に提供されます。
- ページがオフラインになってしまうことがありません。バックグラウンドでのページ再生成が失敗しても、古いページが変更されずに残っています。
- データベースとバックエンドへの負荷が低いです。ページは最大でも同時に一度しか再計算されません。

段階的な再生成の機能（ページを追加しそれらの遅延更新を行う）と[プレビューモード](https://nextjs.org/docs/advanced-features/preview-mode)はいずれも現在安定版であり、`next start` 並びに
[Vercel edge platform](https://vercel.com) の両方において、追加の設定不要で完全にサポートされています。

この新機能を紹介するために、特定の issue への GitHub での様々な反応のカウントを表示するページを静的に再生成する例を作りました: [https://reactions-demo.now.sh/](https://reactions-demo.now.sh/)

<Image
  caption="絵文字でリアクションしたあとに最初にこのページに訪問すると、バックグラウンドで新しいページの生成が始まります。あらゆるリクエストは静的キャッシュから提供されます。"
  captionSpacing={0}
  src="/static/blog/next-9-5/reactions-demo.gif"
  width={1434 / 2}
  height={1464 / 2}
  oversize={false}
/>

次は、2 つの追加的な静的再生成機能に対応するために補足的な RFC を作成する予定です:

- 複数のページを同時に再生成し、無効化する（ブログのインデックスと、ある特定のブログ記事のように）
- ユーザーのトラフィックに先んじてイベントを待ち受ける（リッスンする）ことによる再生成（CMS のウェブフックのように）

詳細は [`getStaticProps` のドキュメンテーション](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)を確認してください。

## カスタマイズ可能なベースパス

Next.js プロジェクトは必ずしもドメインのルートから提供（サーブ）されるとは限りません。Next.js プロジェクトを `/docs` のような下位のパス配下にホストして、Next.js プロジェクトがドメインのそのサブセクションのみをカバーするようにしたいというような場合もあるでしょう。

これは今までも可能ではあったのですが、かなり余分な設定が必要でした。例えば、すべての `<Link>` にプレフィックスを付け加えて Next.js が正しいパスから JavaScript バンドルを提供するようにするといったことです。

この問題に対処すべく、新しい設定のオプションを導入します。
`basePath` を使うことで簡単に Next.js プロジェクトをドメインの下位のパスでホストできるようになります。

`basePath` を使い始めるには、`next.config.js` に以下のように追加します:

```tsx
// next.config.js
module.exports = {
  basePath: '/docs'
}
```

`basePath` を設定すると、プロジェクトは自動的にその指定されたパスからルーティングされます。今回のケースでは `/docs` です。

プロジェクト内の他のページに `next/link` や `next/router` を使ってリンクするときは、自動的に `basePath` がプレフィックスとして付きます。これにより、プロジェクトを変更することなく `basePath` を変えることができます。

この例を挙げるとすれば `next/link` を使って別のページにルーティングする以下のようなものになるでしょう:

```tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Link href="/documentation-page">
        <a>Documentation page</a>
      </Link>
    </>
  )
}
```

こうやって `next/link` を使うと、その結果、以下の HTML が Web ブラウザにレンダリングされます:

```html
<a href="/docs/documentation-page">Documentation page</a>
```

さらなる詳細は、
[`basePath` のドキュメンテーション](https://nextjs.org/docs/api-reference/next.config.js)をご覧ください。

## リライト、リダイレクト、ヘッダーのサポート

### リライト

Next.js プロジェクトをビルドするとき、あるルートを別の URL にプロキシしたい場合があるかもしれません。例えば、Next.js を段階的に自分のスタックに導入したい場合、Next.js プロジェクト内に存在するページをルーティングし、次に、リクエストがマッチしなかったページは、移行元の古いプロジェクトにルーティングしたいと思うかもしれません。

Next.js 9.5 では、`rewrites` という新たな設定オプションが導入されました。このオプションを使用すると、受信したリクエストパスを別の宛先パス（外部 URL を含む）にマッピングすることができます。

例えば、ある特定のルートを `example.com` に書き換えたいとします:

```ts
// next.config.js
module.exports = {
  async rewrites() {
    return [
      { source: '/backend/:path*', destination: 'https://example.com/:path*' }
    ]
  }
}
```

このケースでは、`/backend` 配下のすべてのパスが `example.com` にルーティングされます。

また、Next.js プロジェクトのルーティングがリクエストに一致しているかどうかを確認し、一致していない場合は前のプロジェクトに書き換えることもできます。これは **Next.js の段階的な導入** には非常に便利です。

```ts
module.exports = {
  async rewrites() {
    return [
      // プロキシーを行おうとする前に、Next.js プロジェクトのルートがリクエストと一致するかチェックする
      {
        source: '/:path*',
        destination: '/:path*'
      },
      {
        source: '/:path*',
        destination: `https://example.com/:path*`
      }
    ]
  }
}
```

今回のケースでは、まずすべてのパスについて Next.js プロジェクトのルーティングと一致させようとします。一致するものがなければ、前のプロジェクトである `example.com` にプロキシします。

`rewrites` の詳細については
[rewrites のドキュメンテーション](https://nextjs.org/docs/api-reference/next.config.js/rewrites)をご覧ください。

### リダイレクト

ほとんどのウェブサイトでは少なくともいくらかリダイレクトが必要になります。とりわけ、プロジェクトにおけるルーティングの構造を変更するときなんかはそうでしょう。例えば、`/blog` を `/news` に移動する、もしくはそれに類した変更を行うときです。

これまで、Next.js プロジェクトに転送用のリストを用意するには、カスタムサーバーや独自の `_error` ページを設定して、そのルートにリダイレクトが設定されているかチェックする必要がありました。しかしながら、この設定を行うには、重要な静的／サーバレス最適化を無効化する（サーバーを持つことになるので）という代償を支払わなければならず、使い勝手があまりよいものではありませんでした。

Next.js 9.5 からは、`next.config.js` において `redirects` キーの下にリダイレクトのリストを作成することができるようになりました:

```ts
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true
      }
    ]
  }
}
```

`redirects` のさらなる詳細については、
[redirects のドキュメンテーション](https://nextjs.org/docs/api-reference/next.config.js/redirects)をご覧ください。

### ヘッダー

Next.js では、静的生成とサーバーサイドレンダリングの両方を利用したハイブリッドなプロジェクトを構築することができます。サーバーサイドレンダリングでは、受信したリクエストに対してヘッダーを設定することができます。静的ページの場合、ヘッダの設定はこれまでできませんでした。

今回、`next.config.js` に、すべての Next.js ルートに適用される `headers` プロパティを導入しました:

```ts
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Feature-Policy',
            // microphone と geolocation を無効化する
            value: "microphone 'none'; geolocation 'none'"
          }
        ]
      }
    ]
  }
}
```

`headers` オプションを使用することで、[`Feature-Policy`](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Feature-Policy) や [`Content-Security-Policy`](https://developer.mozilla.org/ja/docs/Web/HTTP/CSP) といった、共通的に必要になるヘッダーを設定できるようになります。

`headers` 機能の詳細については [headers のドキュメンテーション](https://nextjs.org/docs/api-reference/next.config.js/headers)をご確認ください。

## オプションの URL の末尾スラッシュ

3 年前に Next.js が導入されたときは、末尾にスラッシュが付いたすべての URL が常に 404 ページを返すというのがデフォルトの動作でした。

これは効果的だった半面、この動作を変更する機能を要望するユーザーもいました。たとえば、以前は常に末尾スラッシュが適用されていた既存のプロジェクトを Next.js に移行する場合などです。

Next.js 9.5では、`next.config.js` に `trailingSlash` という新しいオプションを導入しました。

この新しいオプションにより、Next.js は以下のように URL 末尾のスラッシュの挙動を自動的に処理するようになります:

- 末尾にスラッシュの付いている URL を末尾にスラッシュ の付いていない URL へ自動的にリダイレクトします。例えば: `/about/` を `/about` へ
- `trailingSlash` が `true` に設定されている場合、末尾にスラッシュがない URL は、末尾にスラッシュの付いている URL にリダイレクトされます。例えば: `/about` から `/about/` へ
- 不要なリダイレクトを避けるために、`next/link` では末尾のスラッシュが自動的に適用/削除されます。

```ts
// next.config.js
module.exports = {
  // 末尾のスラッシュを強制する。デフォルトでは末尾スラッシュを付けない（false）
  trailingSlash: true
}
```

`trailingSlash` 機能の詳細は
[trailingSlash のドキュメンテーション](https://nextjs.org/docs/api-reference/next.config.js/trailing-slash)をご確認ください。

## ページバンドルのための永続的なキャッシュ

Next.js ページを書くときは、すべてのスクリプトバンドル、CSS スタイルシート、HTML の作成は完全に自動化され、かつ抽象化されており、ユーザーはそれについて考える必要がありません。Next.js 9.5 以前のバージョンで、生成された `<script>` タグを調べてみれば、その URL は以下のようなパターンになっていることに気づくでしょう:

```
/_next/static/ovgxWYrvKyjnlM15qtz7h/pages/about.js
```

上記の `ovgxWYrvKyjnlM15qtz7h` というパス部分はいわゆる _build ID_ というものです。
これらのファイルはエッジやユーザーのマシンで簡単にキャッシュ可能でしたが、アプリを再ビルドするとビルド ID は変わってしまい、すべてのキャッシュは破棄されてしまいます。

ほとんどのプロジェクトではこのトレードオフは問題になりませんでしたが、変更されていないページのブラウザキャッシュを無効にしないことで、この動作をさらに最適化したいと考えました。

Google Chrome チームと共同で開発した [Next.js 9.2 での改良されたコード分割戦略](https://nextjs.org/blog/next-9-2#improved-code-splitting-strategy)の導入は、Next.js のページバンドル生成に今回の改良を加えるための基礎となりました。

Next.js 9.5 からは、すべてのページの **JavaScript バンドルは、ビルド ID の代わりにコンテンツハッシュを使用するようになりました**。これにより、複数のデプロイ間で変更がなされていないページは、再度ダウンロードする必要なくブラウザやエッジキャッシュに残ります。

先ほどと対照的に、これらの変更後の URL パターンは以下のようになります。

```
/_next/static/chunks/pages/about.qzfS4o5gIEXRME6sTEahL.js
```

グローバルなビルド ID の代わりに登場した `qzfS4o5gIEXRME6sTEahL` の部分は `about.js` バンドルの確定的なハッシュであり、サイト内のその部分のコードが変更されないかぎり同じ値を取ります。さらに、Next.js が自動的に設定する `Cache-Control: public,max-age=31536000,immutable` という設定によって、**再デプロイを行っても長期的にキャッシュされるようになりました**。

## Fast Refresh 機能の強化

[Next.js 9.4 では Fast Refresh を導入](https://nextjs.org/blog/next-9-4#fast-refresh)しました。これは React コンポーネントに加えた編集を即座にフィードバックしてくれる新しいホットリロード体験です。

Next.js 9.5 では Fast Refresh の実装がさらに改良され、成功に必要なツールが提供されています:

- **エラーが理解しやすい**: すべてのコンパイルエラーとランタイムエラーがアップデートされ、[**エラーの原因となったコードのコードフレームを含む関連情報** のみが表示されるように](https://twitter.com/timer150/status/1263689549898829829)なりました。
- **開発時に表示される、コンポーネントの状態を維持するためのヒント**: 可能な限り多くのシナリオにおいて、Fast Refresh がコンポーネントの状態を維持するための有用なヒントが提供されるようになりました。Next.js が提供する各ヒントは、完全に実行可能で、実行前と実行後の例が添付されています！
- **コンポーネントの状態がリセットされるときの警告**: ファイルが編集されたあと Next.js がコンポーネントの状態を保持できなくなった場合に詳細な警告が表示されるようになりました。この警告は、プロジェクトがコンポーネントの状態をリセットしなければならなかった理由を診断するのに役立ち、その原因を修正すれば Fast Refresh を最大限に活用することができます。
- **新しいドキュメンテーション**: Fast Refresh とはなんなのか、どのように動作するのか、何を期待するのかといったことを解説する[広範囲なドキュメンテーションを追加](https://nextjs.org/docs/basic-features/fast-refresh)しました！　また、このドキュメンテーションでは、Fast Refresh のエラー回復の仕組みを説明し、Fast Refresh をより効果的に活用する方法を紹介しています。
- **ユーザーコードのトラブルシューティングガイド**: 新しいドキュメンテーションには、開発時に Fast Refresh を最大限活用するための [一般的なトラブルシューティングの手順やヒント](https://nextjs.org/docs/basic-features/fast-refresh#tips)も含まれています。

## 本番環境での React のプロファイリング

React は少し前に [Profiler API](https://github.com/reactjs/rfcs/pull/51) を導入し、React コンポーネントのパフォーマンス問題を追跡できるようになりました。この機能は開発時には自動的に動作しますが、本番環境でプロファイリングを行うには別バージョンの ReactDOM を使用する必要があります。

Next.js 9.5 では、`next build` に `--profile` フラグを付けることで **React の本番環境でのプロファイリングを有効にすること**ができるようになりました:

```bash
next build --profile
```

その後は、開発時と同じようにプロファイラを使うことができます。

React のプロファイリングについて詳しく知りたい方は、[React チームによる React Profiler の投稿](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)を読んでください。この機能に貢献してくれた [@TodorTotev](https://github.com/TodorTotev) と [@darshkpatel](https://github.com/darshkpatel) に感謝します。

## オプションのキャッチオール型ルート（すべてのルートのキャッチ）

Next.js 9.2 では、様々なユースケースでコミュニティに広く採用されている [キャッチオール型の動的ルーティングのサポート](https://nextjs.org/blog/next-9-2#catch-all-dynamic-routes) が追加されました。キャッチオール型のルートを使用すると、ヘッドレス CMS や GraphQL API、ファイルシステムなどを利用した非常に動的なルーティング構造を作成するための柔軟に作成できます。

フィードバックに耳を傾ける中で、_ルーティングにおいて最上位レベルに合わせて_ さらに柔軟性を持たせたいというユーザーの声を聞きました。本日、これらの高度なシナリオのために、**オプションのキャッチオール型ダイナミックルート** を公開することができるのを嬉しく思います。

オプションのキャッチオール型ルートを作成するには、`[[...slug]]` という構文を用いたページを作成してください。

例えば、`pages/blog/[[...slug]].js` は `/blog` にマッチし、その配下にある次のようなルートにもマッチします: `/blog/a` や `/blog/a/b/c` などです。

キャッチオールルートのように、`slug` は[ルーターのクエリオブジェクト](https://nextjs.org/docs/api-reference/next/router#router-object)の中で、パスの部分の配列として提供されます。ですから、`/blog/foo/bar` というパスの場合、クエリオブジェクトは `{ slug: ['foo', 'bar'] }` となります。`/blog` というパスの場合は、クエリオブジェクトは slug キーを省略し、次のようになります: `{ }`

[オプションのキャッチオール型ルートについての詳細は我々のドキュメンテーション](https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes) を参照してください。

## Webpack 5 のサポート（ベータ版）

Webpack 5 は現在ベータ版です。Webpack 5 にはいくつかの大きな改善点が含まれています:

- [Tree-Shaking の改善](https://github.com/webpack/changelog-v5#nested-tree-shaking):
  ネストされたエクスポート、内部モジュール、CommonJS はツリーシェイクされます
- [永続的なキャッシュ](https://github.com/webpack/changelog-v5#persistent-caching):
  前のビルドの作業を再利用できます
- [確定的なチャンクとモジュール ID](https://github.com/webpack/changelog-v5#deterministic-chunk-and-module-ids):
  複数のビルド間で Webpack モジュール ID が変更されるケースを解決します


本日は Next.js 用の Webpack 5 のベータ版が利用できるようになったということをお伝えします。

Webpack 5 を試してみるには、`package.json` の中で
[Yarn resolutions（依存関係の解決）](https://classic.yarnpkg.com/ja/docs/selective-version-resolutions) を使用します。

```json
{
  "resolutions": {
    "webpack": "^5.0.0-beta.22"
  }
}
```

Webpack 5 のベータ版はすでに 
[nextjs.org](http://nextjs.org) と [vercel.com](http://vercel.com) において本番投入されています。徐々に試してみて、何か発見したことがあれば [GitHub](https://github.com/vercel/next.js/issues/13341) でご報告ください。

### コンパイルインフラの改善

webpack 5をサポートするために、コンパイルパイプラインの多くを書き換え、より Next.js に合わせたものにしました。

- Next.js は `webpack-hot-middleware` と `webpack-dev-middleware` に依拠するのをやめ、代わりに webpack を直接使用し、Next.js プロジェクトに特化して最適化するようになりました。これにより、よりシンプルなアーキテクチャと高速な開発コンパイルが可能になりました。
- [オンデマンドエントリ](https://nextjs.org/blog/next-8#improved-on-demand-entries)とは、開発中に特定のタイミングで訪問したページでコンパイルできるようにするために Next.js が持っていたシステムのことですが、これも書き換えられ、私たちのユースケースに合わせて特別に調整された新しい webpack の振る舞いを活用することで、より信頼性の高いものになりました。
- [React の Fast Refresh と Next.js のエラーのオーバーレイ表示](https://nextjs.org/blog/next-9-4#fast-refresh) は現在完全に webpack 5と互換性のあるものになっています
- ディスクキャッシュが将来のベータリリースで可能になります

### 後方互換性

我々はつねに、Next.js が以前のバージョンとの後方互換性を維ように心がけています。

webpack 4 は今後も完全にサポートされたままです。我々は webpack のチームと緊密に連携を取っており、webpack 4 から 5 への移行が可能な限りスムーズに行えるようにしています。

Next.js プロジェクトに独自の webpack 設定をしていない場合、プロジェクトに対して何ら変更を施さなくても webpack 5 を完全に活用することができます。

**重要:** プロジェクトに
[独自の webpack 設定](https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config)を行っている場合、webpack 5 への移行にはいくつかの変更が必要になるかもしれません。将来のシームレスなアップグレードのために、我々が移行手順をお知らせするときに気付けるよう我々のドキュメントに目を光らせておいていただくか、webpack 拡張機能の使用を最小限に抑えることをお勧めします。

### macOSでのファイル監視の改善

最近、コードにいくつかの変更を加えた後、macOS でのファイル監視が停止してしまうという webpack の問題が見つかりました。更新を再度表示するには、プロジェクトを手動で再起動する必要があります。いくつかの変更の後、このサイクルがまた発生します。

さらに、この問題は Next.js プロジェクトだけでなく、webpack 上に構築されるすべてのプロジェクトとフレームワークでも発生することがわかりました。

この問題を数日かけてデバッグした結果、webpack が使用している chokidar と呼ばれるファイル監視の実装に根本的な原因があることを突き止めました。この chokidar は、Node.js エコシステムで広く使用されているファイル監視実装です。

この問題を修正する[パッチを chokidar](https://github.com/paulmillr/chokidar/pull/1018) に送信しました。パッチがリリースされた後、私たちは [Tobias Koppers](https://github.com/sokra) と協力して、このパッチを[新しい webpack バージョン](https://github.com/webpack/webpack/releases/tag/v4.44.0)で公開しました。

このパッチを適用した webpack バージョンは、Next.js 9.5 にアップグレードすると自動的に使用されます。

## 結論

Next.js の採用が継続的に伸びていることにワクワクしています。

- これまでに **1,200 人** 以上の実人数ベースでのコントリビューターがいて、9.4 のリリース移行では **135 人**の新しいコントリビューターがいました。
- GitHub では、このプロジェクトは **51,100 回** 以上スターを付けられています。

[GitHub Discussions](https://github.com/vercel/next.js/discussions) で Next.js のコミュニティに参加しましょう。Discussions は、他の Next.js ユーザーとつながり、自由に質問をし、作品を共有できるコミュニティ空間です。

例えば、皆に [自分のプロジェクト URL を共有する](https://github.com/vercel/next.js/discussions/10640) ことから始めてみるといいかもしれません。

何か還元したいけれどどうしたらいいかわからないという場合は、Webpack のサポートのような実験的な機能を試してみて、その結果発見したことをご報告いただくことをおすすめします！

