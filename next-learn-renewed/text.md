# Next.js チュートリアル
## Next.js アプリをつくる
React で 0 からちゃんとした Web アプリケーションを構築するには、考慮しなくてはならない細かい点が数多くあります：
- コードは webpack のようなバンドラでバンドルし、Babel のようなコンパイラを使って変換しなくてはならない
- コード分割といったプロダクションの最適化を行う必要がある
- パフォーマンスや SEO のために静的にプリレンダリングしたいページがある一方で、サーバサイドレンダリングやクライアントサイドレンダリングを利用したいページもあるかもしれない
- React アプリとデータストアを接続するために、いくらかのサーバサイドのコードを書く必要があるかもしれない

フレームワークを使えばこういった問題は解決できます。しかし、こういったフレームワークは適切な抽象度を兼ね備えたものでなければなりません。そうでなければあまり便利なものとは言えないでしょう。そうしたフレームワークはすばらしい「開発者経験（Developer Experience）」を提供し、コードを書いているときにあなたやあなたのチームがすばらしい経験を味わえるものである必要があります。

### Next.js: The React Framework
React フレームワークの Next.js を見ていきましょう。Next.js を使えば先ほど述べたあらゆる問題を解決できます。しかしより重要なことは、React アプリケーションを構築するときにあなたやあなたのチームが、まるで導かれるように成功するということなのです。

Next.js には最高クラスの開発者経験があり、数多くの特徴が組み込まれています。例えば以下のような特徴があります。
- ページベースの直感的なルーティングシステム（動的ルーティングをサポート）
- プリレンダリングでは、静的生成（SSG）とサーバサイドレンダリング（SSR）の両方をページ単位でサポート
- より速いページロードのための自動コード分割
- 最適化されたプリフェッチングによるクライアントサイドルーティング
- CSS と Sass のビルトインサポートおよびあらゆる CSS-in-JS ライブラリのサポート
- HMR (Hot Module Replacement) をサポートする開発環境
- サーバレス関数を用いて API エンドポイントを構築するための API ルート
- 完全に拡張可能であるという点

Next.js は、世界でも最大級のブランドを含む数多くの Web サイトや Web アプリで使われています。

### このチュートリアルについて
この無料で対話形式のコースに取り組むことで Next.js の始め方を学ぶことができます。  

このチュートリアルでは、シンプルな **ブログアプリ** を作ることで Next.js の基本を学びます。最終的な結果の例はこちらです：
https://next-learn-starter.now.sh （[ソースコード](https://github.com/zeit/next-learn-starter/tree/master/demo)）  
それでは始めましょう！

> このチュートリアルは JavaScript と React の基本知識を前提にします。もし React のコードを書いたことがなければ、まずは [React の公式チュートリアル](https://reactjs.org/tutorial/tutorial.html) に取り組んでみるとよいでしょう。  
Next.js のドキュメンテーションを探している方は[こちら](https://nextjs.org/docs/getting-started)。

### セットアップ
まずは、開発環境が準備できているか確認しましょう。
- Node.js をインストールしていない場合は、[こちらからインストールしてください](https://nodejs.org/en/)。Node.js のバージョン 10 以降が必要です。
- このチュートリアルではあなたが普段使っているテキストエディタとターミナルを使っていきます。

> Windows を使っている方は、[Git for Windows](https://gitforwindows.org/) をダウンロードし、同梱の Git Bash（このチュートリアルで使う UNIX 固有のコマンドをサポートしています）を使うことをおすすめします。

### Next.js アプリを作る
Next.js アプリを作るためには、ターミナルを開き、アプリを作りたいディレクトリに `cd` コマンドで移動し以下のコマンドを実行します。

```bash
npm init next-app nextjs-blog

# yarn の場合
yarn create next-app nextjs-blog
```

続いて、**Default starter app** テンプレートを選択します。

```bash
> Default starter app
```
> 内部的には、こうすることで `create-next-app` が呼ばれ、Next.js アプリを立ち上げます。

### 開発サーバを動かす
今、`nextjs-blog` というディレクトリができたと思います。ではそのディレクトリの中に `cd` で移動しましょう。

```bash
cd nextjs-blog
```

続いて、以下のコマンドを実行してください。

```bash
npm run dev

# yarn の場合
yarn dev
```
こうすることで、Next.jsアプリの「開発サーバー」（詳しくは後述）が 3000 番ポートで起動します。  
正しく動いているかどうかチェックしてみましょう。http://localhost:3000 をブラウザから開いてください。

Question: ページにはなんというテキストが表示されていますか？
A. Welcome to Next.js!  
B. Hello Next.js!
<details close>
<summary>答えを見る</summary>
A
</details>

# Welcome to Next.js
http://localhost:3000 にアクセスすると以下のようなページが表示されます。これは開始用のテンプレートページで、Next.js に関する有用な情報が書かれています。

( **画像** )

> ヘルプが利用できます：もし詰まったら、[GitHub Discussions](https://github.com/zeit/next.js/discussions) から Next.js のコミュニティに連絡してください。

次はこのページを編集してみましょう！

### ページを編集する
この開始用ページを編集してみましょう。
- Next.js の開発サーバがまだ起動していることを確かめてください。
- `pages/index.js` をテキストエディタで開いてください。
- `<h1>` タグ配下にある "Welcome to" というテキストを探して、それを "Learn" に変更してください。
- ファイルを保存しましょう。

ファイルを保存するとすぐに、ブラウザが自動的にリロードを行いページを新しいテキストで更新します。

(**画像**)

Next.js の開発サーバは **Hot Reloading** という特徴を持っています。ファイルに変更を加えると、Next.js が自動的にブラウザ内で変更を適用します。ページをリフレッシュする必要はありません。この特徴により、アプリ開発の繰り回しを素早く行うことができます。

次のレッスンでは、さらに多くのページを作成し、ページ間の遷移を行います。

> 開発サーバは起動したままにしておくとよいでしょう。もしも後から再起動させたいという場合は、サーバを停止するために `Ctrl + c` を押してください。

----
## ページ間の遷移
ここまでで我々が作った Next.js アプリにはひとつのページしかありません。一般的な Web サイトや Web アプリは、複数の異なるページを持つことができます。

それでは、アプリにより多くのページを追加する方法を探ってみましょう。

**このレッスンで学ぶこと**
このレッスンでは、
- ファイルシステムルーティングという特徴を使って新しいページを作成します
- `Link` コンポーネントを使って、クライアントサイドのページ遷移を実現する方法を学びます
- コード分割とプリフェッチングに関するビルトインのサポートについて学びます。

> Next.js のルーティングに関する詳細なドキュメントを探している場合は、[ルーティングドキュメンテーション](https://nextjs.org/docs/routing/introduction)をご覧ください。

### セットアップ
#### スターターコードをダウンロードする（任意）
前のレッスンから継続して取り組んでいる場合は、以下はスキップできます。  
そうでないのであれば、スターターコードをダウンロードおよびインストールし、以下のとおり実行してください。繰り返しになりますが、前回のレッスンを終えているのであれば以下は不要です。

```bash
# If you prefer Yarn, you can use `yarn create` instead of `npm init`
npm init next-app nextjs-blog --example "https://github.com/zeit/next-learn-starter/tree/master/navigate-between-pages-starter"
cd nextjs-blog
# If you prefer Yarn, you can use `yarn dev` instead
npm run dev
```

### Next.js におけるページ
Next.js では、ページとは `pages` ディレクトリに存在するファイルからエクスポートされる React コンポーネントです。  

ページは **ファイル名** に基づいてルーティングに関連づけられます。例えば、開発時は：
- `pages/index.js` は `/` にルーティングされます。
- `pages/posts/first-post.js` は `/posts/first-post` としてルーティングされます。

すでに `pages/index.js` ファイルはありますから、`pages/posts/first-post.js` を作成して、うまく機能するか見てみましょう。

### 新しいページを作成する
`pages` 配下に `posts` というディレクトリを作成してください。

`posts` ディレクトリの中に、以下の内容で `first-post.js` というファイルを作成してください。

```js
export default function FirstPost() {
    return <h1>First Post</h1>
}
```

コンポーネントはどんな名前でもいいですが、必ず `default` エクスポートしなくてはなりません。

そうしたら、開発サーバが起動していることを確かめて http://localhost:3000/posts/first-post にアクセスしてください。以下のようなページが見えるはずです。

(**画像**)

これが、Next.js において異なるページを作成する方法です。  
`pages` ディレクトリの配下にシンプルに JavaScript ファイルを作成すれば、そのファイルへのパスが URL のパスになります。

ある意味、HTML や PHP のファイルを使って Web サイトを構築するのと似ています。HTML を書く代わりに JSX を書き、 React コンポーネントを使います。

新しく追加したページにリンクを追加して、最初のページから遷移してみましょう。

### Link コンポーネント
Web サイトのページ間でリンクを貼るときは一般的には `<a>` という HTML タグが使われます。

Next.js では、`<Link>` という、 `<a>` タグをラップした React コンポーネントを使います。`<Link>` によって、アプリ内の異なるページへクライアントサイドで遷移することができます。

### `<Link>` を使う
まず、`pages/index.js` 内で、以下の行を一番上に加えて、 `next/link` から `Link` コンポーネントをインポートします。

```js
import Link from 'next/link'
```

そうしたら、`h1` タグ内に存在する以下の行を・・・

```html
Learn <a href="https://next.js.org">Next.js!</a>
```

次のように変更します：

```html
Read <Link href="/posts/first-post"><a>this page!</a></Link>
```

次に、`pages/posts/first-post.js` の内容を以下のように書き換えます。

```js
import Link from 'next/link'

export default function FirstPost() {
  return (
    <>
      <h1>First Post</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </>
  )
}
```

見てのとおり、`Link` コンポーネントは `<a>` タグを使うのと似ています。`<a href="...">` の代わりに `<Link href="...">` を使い、その中に `<a>` タグを配置します。

これが機能するか見てみましょう。各ページにリンクが表示されており、ページを戻ったり進んだりできるはずです。

TODO: **画像**

### クライアントサイドのページ遷移（ナビゲーション）
`Link` コンポーネントによって、同じ Next.js アプリ内にある 2 つのページ間のクライアントサイドでのナビゲーションが可能になります。

クライアントサイドのナビゲーションとは、ページ遷移が *JavaScript を使って* 行われることを意味し、ブラウザによって行われるデフォルトのページ遷移よりも高速です。  

簡単な検証方法を紹介します。
- ブラウザの開発者ツールを使って、`<html>` の `background` CSS プロパティを `yellow` に変更します。
- リンクをクリックして、2 つのページ間を進んだり戻ったりしてください。
- 黄色の背景が、ページ遷移の間にも持続していることがわかります。

これは、ブラウザがページ全体をロードしているのでは*なく*、クライアントサイドでのナビゲーション（ページ遷移）が機能していることを示しています。

**画像**

もし `<Link href="...">` でなく `<a href="...">` を使って上記と同様のことを行ったら、リンクをクリックするとブラウザはページ全体をリフレッシュするので背景色はクリアされます。

### コード分割とプリフェッチング
Next.js は自動的にコード分割を行うので、各ページはそのページに必要なものだけを読み込みます。つまり、トップのページがレンダリングされたときに、他のページのコードが最初からサーブされるわけではないということです。

このことにより、たとえ数百ものページを持つアプリであってもトップページは素早く読み込まれることが保証されます。

リクエストしたページのコードだけを読み込むということは、ページが分離されるということでもあります。あるページでエラーが発生したとしても、アプリの他の部分は動作し続けます。

さらに、（開発時のビルドでなく）本番環境でのビルドにおいては、`Link` コンポーネントがブラウザのビューポートに表示されると、Next.js は自動的にリンク先のページのコードをバックグラウンドで**プリフェッチ**します。リンクをクリックするときまでには、目的のページのコードはバックグラウンドで読み込まれ終わっており、ページ遷移はほぼ瞬時に行われるのです！

### サマリー
Next.js は、コード分割、クライアントサイドのナビゲーション、（本番環境における）プリフェッチングによって、最良のパフォーマンスのためにアプリを自動的に最適化します。  

`pages` ディレクトリ配下のファイルがルーティングになり、ビルトインの `Link` コンポーネントを利用することができます。ルーティング用のライブラリは必要ありません。

`Link` コンポーネントについては [API リファレンスドキュメンテーション](https://nextjs.org/docs/api-reference/next/link) から、ルーティングについては [ルーティングのドキュメンテーション](https://nextjs.org/docs/routing/introduction) から、さらに学ぶことができます。

> メモ：Next.js のアプリの外にある外部のページにリンクを貼る必要があるときは、 `Link` 無しで `<a>` タグだけを使ってください。
`className` といった属性を加える必要があるときは、 `Link` タグでなく、`a` タグに加えてください。

----

## アセット、メタデータ、CSS
我々が追加した 2 つめのページは現時点ではスタイリングされていない。では、ページをスタイリングするためにいくつか CSS を付け加えてみよう。

Next.js には CSS と Sass のサポートが組み込まれています。このコースでは CSS を使用します。

このレッスンでは Next.js が画像のような静的なアセットや `title` タグのようなページのメタデータといったものをどのように扱うかもお話しします。

### このレッスンで学ぶこと
- 静的なファイル（画像など）を Next.js に追加する方法
- 各ページの `<head>` 内に入るものをカスタマイズする方法
- CSS モジュールを使ってスタイルされた再利用可能な React コンポーネントを作成する方法
- `pages/_app.js` の中にグローバル CSS を追加する方法
- Next.js においてスタイリングを行ううえでのいくつかの便利な Tips

> Next.js のスタイリングに関する詳細なドキュメンテーションをお探しの場合は [CSSドキュメンテーション](https://nextjs.org/docs/basic-features/built-in-css-support) をご覧ください。

### セットアップ
#### スターターコードをダウンロードする（任意）
前のレッスンから継続して取り組んでいる場合は、以下はスキップできます。  
そうでないのであれば、スターターコードをダウンロードおよびインストールし、以下のとおり実行してください。繰り返しになりますが、前回のレッスンを終えているのであれば以下は不要です。
```bash
# If you prefer Yarn, you can use `yarn create` instead of `npm init`
npm init next-app nextjs-blog --example "https://github.com/zeit/next-learn-starter/tree/master/assets-metadata-css-starter"
cd nextjs-blog
# If you prefer Yarn, you can use `yarn dev` instead
npm run dev
```

### アセット
まず、Next.js が画像といったような静的なアセットをどのように扱うかお話しましょう。

Next.js は画像などの静的なファイルを、**トップレベルの `public` ディレクトリ** 配下でサーブすることができます。`pages` ディレクトリと同様に、`public` 内のファイルはアプリケーションのルート（root）から参照することができます。

アプリの `pages/index.js` を開いて `<footer>` を見てみると、`/zeit.svg` にある画像を参照している部分があります。

```html
Powered by <img src="/zeit.svg" alt="ZEIT Logo" />
```

`zeit.svg` は アプリケーションのトップレベルの `public` ディレクトリの中にあります。

`public` ディレクトリには `robots.txt` や Google Site Verification、その他あらゆる静的なアセットを有効に配置することができます。もっと学ぶには[静的ファイルサービングに関するドキュメンテーション](https://nextjs.org/docs/basic-features/static-file-serving) をチェックしてください。

### メタデータ
`<title>` という HTML タグのようなページのメタデータを変更したくなったらどうしましょうか？

`<title>` は `<head>` という HTML タグの一部ですから、Next.js で作ったページにおいて、 `<head>` タグに変更を加える方法を見ていきましょう。

`pages/index.js` をエディタで開いて、以下の行を見てください。

```js
<Head>
  <title>Create Next App</title>
  <link rel="icon" href="/favicon.ico" />
</Head>
```

小文字の `<head>` ではなく `<Head>` が使われていることに注目してください。`<Head>` は Next.js に組み込まれている React コンポーネントです。`<Head>` を使えばページの `<head>` を修正することができます。

`Head` コンポーネントは `next/head` モジュールからインポートできます。

#### `<Head>` を `first-post.js` に追加する
我々はまだ `/posts/first-post` に `<title>` を追加していませんので、いま追加してみましょう。

`pages/posts/first-post.js` ファイルを開いてください。

まず、`Head` を `next/head` からインポートしてください：

```js
import Head from 'next/head';
```

続いて、`Head` を `FirstPost` コンポーネントに追加してください。現時点では、`title` タグだけを追加します。

```js
export default function FirstPost() {
  return (
    <>
      <Head>
        <title>First Post</title>
      </Head>
      …
    </>
  )
}
```

http://localhost:3000/posts/first-post にアクセスしてみてください。ブラウザのタブには「First Post」と表示されているはずです。ブラウザの開発者ツールを使えば、`title` タグが `<head>` に追加されていることがわかります。

> `next/head` についてさらに学ぶには、[API リファレンスのドキュメンテーション](https://nextjs.org/docs/api-reference/next/head) をチェックしてください。  
> たとえば `lang` 属性を加えるといったように `<html>` をカスタマイズしたい場合は、カスタムの `Document` コンポーネントを作成することで実現できます。詳しくは[カスタムドキュメントに関するドキュメンテーション](https://nextjs.org/docs/advanced-features/custom-document)を参照してください。

### CSS スタイリング
では **CSS スタイリング**についてお話しましょう。

見ての通り、インデックスページ（http://localhost:3000）にはすでにいくらかスタイリングが施されています。`pages/index.js` を見てみると、このようなコードが目に入ると思います：

```js
<style jsx>{`
   ...
`}</style>
```
これは [styled-jsx](https://github.com/zeit/styled-jsx) というライブラリを使用しています。これは「CSS-in-JS」のライブラリ、すなわち、React コンポーネント内で CSS を書くことができ、CSS スタイルがスコープ付けられます（他のコンポーネントは影響を受けません）。

Next.js は [styled-jsx](https://github.com/zeit/styled-jsx) のサポートが組み込まれていますが、[styled-components](https://github.com/zeit/next.js/tree/canary/examples/with-styled-components) や [emotion](https://github.com/zeit/next.js/tree/canary/examples/with-emotion) といった他の人気の高い CSS-in-JS ライブラリを使うこともできます。

#### CSS の記述とインポート
Next.js には CSS と Sass のサポートが組み込まれており、.css や .scss ファイルをインポートすることができます。

Tailwind CSS のような人気のある CSS ライブラリを使うこともサポートされています。

このレッスンでは、Next.js で CSS を書き、インポートする方法について説明します。また、Next.js に組み込まれている CSS モジュールと Sass のサポートについてもお話します。では詳しく見ていきましょう！

### レイアウトコンポーネント
まずは、すべてのページで共通して使う **Layout** コンポーネントを作成しましょう。
- `components` という名前のディレクトリをトップレベルに作成してください
- その中に、以下の内容で `layout.js` というファイルを作成してください。

```js
function Layout({ children }) {
    return <div>{children}</div>
}

export default Layout
```

続いて、`pages/posts/first-post.js` の中で `Layout` をインポートして、一番外側のコンポーネントにしてください。

```js
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'

export default function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </Layout>
  )
}
```

### CSS を追加する
では、`Layout` にスタイルを追加していきましょう。そのために、[CSS モジュール](https://github.com/css-modules/css-modules) （CSS ファイルを React コンポーネントの中でインポートすることができるようになります）を使います。

`layout.module.css` というファイルを `components` ディレクトリ内に、以下の内容で作成してください。

```js
.container {
  max-width: 36rem;
  padding: 0 1rem;
  margin: 3rem auto 6rem;
}
```

> 重要：この CSS モジュールを使用するためには、CSS ファイル名は `.module.css` で終わる必要があります。

これを `Layout` 内で使用するために、以下のことが必要になります。
- `styles` としてこのファイルをインポートする
- `styles.<class-name>` を `className` として使う
- 今回のケースでは、クラス名は `container` なので、`styles.container` を使う

```js
import styles from './layout.module.css'

export default function Layout({ children }) {
  return <div className={styles.container}>{children}</div>
}
```

いま http://localhost:3000/posts/first-post にアクセスしてみれば、センタリングされたコンテナーの中にテキストが配置されているのがわかるはずです。

**画像**

#### 一意のクラス名を自動的に生成する
いま、ブラウザの開発者ツールの HTML を見てみると、`div` タグには `layout_container__...` というようなクラス名が付けられていることに気づくと思います。

**画像**

これは CSS モジュールによるものです。*CSS モジュールは自動的に一意のクラス名を生成します*。CSS モジュールを使っているかぎりは、クラス名の衝突を気にする必要はないのです。

さらには、Next.js のコード分割という特徴は CSS モジュールに対しても機能します。これにより、各ページで読み込まれる CSS の量が最小限に抑えられます。その結果、バンドルのサイズが小さくなります。

CSS モジュールはビルド時に JavaScript のバンドルから抽出され、Next.js によって自動的に読み込まれる `.css` ファイルを生成します。

### グローバルなスタイリング
CSS モジュールはコンポーネントレベルでのスタイリングには便利です。しかし、いくつかの CSS を **すべての** ページで読み込みたい場合、Next.js はそれにもサポートを用意してあります。

グローバルな CSS ファイルを読み込むには、`pages` ディレクトリ配下に **`_app.js` というファイルを作成** し、以下の内容を記述してください。

```js
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

この `App` コンポーネントは、すべてのページに共通するトップレベルのコンポーネントです。たとえば、ページ間を移動するときに状態（state）を保持するために `App` コンポーネントを使用することあできます。

#### 開発サーバを再起動する
**重要**： `_app.js` を追加したときは開発サーバを再起動する必要があります。`Ctrl + c` を押してサーバを停止し、再度起動してください。
```bash
npm run dev

# yarn の場合
# yarn dev
```
### グローバル CSS を追加する
Next.js では、グローバル CSS ファイルを `_app.js` 内でインポートすることでグローバル CSS を利用することができます。それ以外の場所ではグローバル CSS をインポート **できません**。

グローバル CSS を `_app.js` の外ではインポートできない理由は、グローバル CSS はページのすべての要素に影響を与えてしまうからです。

（`_app.js` 以外でもグローバル CSS をインポートできてしまったら、）トップページから `/posts/first-post` ページに移動した場合、トップページでインポートしたグローバルスタイルは意図せず `/posts/first-post` にも影響を与えてしまいます。（ので、`_app.js` 以外ではグローバル CSS をインポートできないようになっている）

グローバル CSS ファイルはどこにでも配置することができ、どんな名前にすることもできます。では以下のようにやってみましょう。

- `styles` ディレクトリをトップレベルに作成し、その中に `global.css` を作成してください
- 以下の内容を記述してください。これにより、いくつかのスタイルがリセットされ、`a` タグの色が変わります。

```css
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 1.6;
  font-size: 18px;
}

* {
  box-sizing: border-box;
}

a {
  color: #0070f3;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  display: block;
}
```

最後に、`_app.js` 内でそれをインポートします。

```js
import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

今、http://localhost:3000/posts/first-post にアクセスすると、スタイルが適用されているのがわかります。

**画像**

> うまくいかない場合：`_app.js` を追加したときに開発サーバを再起動しているかどうか確かめてください。

ここまでで我々が学んだことを要約します。
- CSS モジュールを使うためには、`*.module.css` という名前の CSS ファイルをどんなコンポーネント内からでもインポートすればよい
- グローバル CSS を使うには、`pages/_app.js` 内で CSS ファイルをインポートする

### Layout を磨き上げる
ここまでは、CSS モジュールといったコンセプトを説明するために、最小限の React および CSS のコードを追加したのみでした。次のレッスン（データフェッチング）に移る前に、ページのスタイリングとコードを磨き上げましょう。

#### プロフィール画像をダウンロードする
まず第一に、あなたのプロフィール画像を最終的なデザインに使用します。
- あなたのプロフィール画像を GitHub や Twitter、LinkedIn その他からダウンロードしてください（もしくは[こちら](https://github.com/zeit/next-learn-starter/blob/master/basics-final/public/images/profile.jpg)を使用してください）。
- `images` ディレクトリを `public` ディレクトリの中に作成してください。
- `public/images` ディレクトリの中に `profile.jpg` として画像を保存してください。
- 画像サイズはだいたい 400px × 400px 程度になります。
- `public/zeit.svg` は削除して構いません。

#### `components/layout.module.css` を更新する
第二に、以下のコードを `components/layout.module.css` に使います。単純にコピー＆ペーストしてください。これによりいくぶん洗練されたスタイルになります。

```css
.container {
  max-width: 36rem;
  padding: 0 1rem;
  margin: 3rem auto 6rem;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.headerImage {
  width: 6rem;
  height: 6rem;
}

.headerHomeImage {
  width: 8rem;
  height: 8rem;
}

.backToHome {
  margin: 3rem 0 0;
}
```

#### `styles/utils.module.css` を作成する
第三に、複数のコンポーネントにまたがって便利に使える、タイポグラフィなどのためのユーティリティとなる CSS クラスのセットを作成しましょう。

`styles/utils.module.css` に CSS モジュールとして追加します。

```css
.heading2Xl {
  font-size: 2.5rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.05rem;
  margin: 1rem 0;
}

.headingXl {
  font-size: 2rem;
  line-height: 1.3;
  font-weight: 800;
  letter-spacing: -0.05rem;
  margin: 1rem 0;
}

.headingLg {
  font-size: 1.5rem;
  line-height: 1.4;
  margin: 1rem 0;
}

.headingMd {
  font-size: 1.2rem;
  line-height: 1.5;
}

.borderCircle {
  border-radius: 9999px;
}

.colorInherit {
  color: inherit;
}

.padding1px {
  padding-top: 1px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.listItem {
  margin: 0 0 1.25rem;
}

.lightText {
  color: #999;
}
```

#### `components/layout.js` を更新する
4 つめのステップとして、以下のコードを `components/layout.js` にコピーして、上部にある `Your Name` をあなたの名前に **書き換えてください**。ここでは新しく次のようなものが出てきます。
- `meta` タグ（例：`og:image`）
- タイトルと画像のサイズを調整するための `home` という真偽値の prop
- `home` が `false` であった場合に表示するページ下部の「Back to home」というリンク

#### `pages/index.js` を更新する
最後に、トップページを更新します。  
`pages/index.js` を以下のとおりに書き換えてください。

```js
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
    </Layout>
  )
}
```

そうしたら `[Your Self Introduction]` をあなたの自己紹介文で置き換えてください。これは筆者の例です。

**画像**

出来上がりです！これでレイアウトのコードを磨き上げることができたので、データ取得のレッスンに移ります。

このレッスンをまとめあげる前に、Next.js の CSS サポートに関連する便利なテクニックについてお話します。

### スタイリングに関する Tips
きっと便利に使えるスタイリングの Tips がいくつかあります。

> 以下、本セッションは読み通すだけで結構です。アプリに変更を加える必要はありません。

#### クラスを切り替えるために `classnames` ライブラリを使う
`classnames` は、クラス名を簡単に切り替えるたえの便利なライブラリです。`npm install classnames` か `yarn add classnames` とすることでインストールできます。

詳細は [README](https://github.com/JedWatson/classnames) を読んでいただくとして、基本的な使い方は以下のとおりです：
- `type`（`'success'` か `'error'`という値をとりうる）を受け取る `Alert` コンポーネントを作成したいという状況だと想定してください。
- `type` が `'success'` であれば、文字の色を緑にします。`type` が `'error'` であれば、文字の色は赤にします。

まずは CSS モジュール（例：`alert.module.css`）を以下のように書くことができます：

```css
.success {
  color: green;
}
.error {
  color: red;
}
```

そして `classnames` を次のように使いましょう。

```js
import styles from './alert.module.css'
import cn from 'classnames'

export default function Alert({ type }) {
  return (
    <div
      className={cn({
        [styles.success]: type === 'success',
        [styles.error]: type === 'error'
      })}
    >
      {children}
    </div>
  )
}
```

#### PostCSS 設定をカスタマイズする
初期設定のまま、なんの設定も不要で、Next.js は CSS を [PostCSS](https://postcss.org/) を使ってコンパイルします。  

`postcss.config.js` というファイルをトップレベルに作成して PostCSS の設定をカスタマイズできます。これは[Tailwind CSS](https://tailwindcss.com/) のようなライブラリを使っている場合に便利です。

以下は [Tailwind CSS](https://tailwindcss.com/) を [`purgecss`](https://github.com/FullHuman/purgecss) （使われてない CSS を削除するものです）と合わせて使うときの例です。
- `tailwindcss`、`@fullhuman/postcss-purgecss`、および `postcss-preset-env` をインストールする必要があります
- `autoprefixer` はデフォルトで Next.js に含まれているため不要です

```js
module.exports = {
  plugins: [
    'tailwindcss',
    ...(process.env.NODE_ENV === 'production'
      ? [
          [
            '@fullhuman/postcss-purgecss',
            {
              content: [
                './pages/**/*.{js,jsx,ts,tsx}',
                './components/**/*.{js,jsx,ts,tsx}'
              ],
              defaultExtractor: content =>
                content.match(/[\w-/:]+(?<!:)/g) || []
            }
          ]
        ]
      : []),
    'postcss-preset-env'
  ]
}
```

> PostCSS の設定についてもっと知るためには、[我々のドキュメンテーション](https://nextjs.org/docs/advanced-features/customizing-postcss-config) をチェックしてください。

#### Sass を使う
初期設定のまま、Next.js では `.scss` および `.sass` 両方の拡張子を使って [Sass](https://sass-lang.com/) をインポートすることができます。CSS モジュールと `.module.scss` または `.moduke.sass` 拡張子を介して、コンポーネントレベルの Sass を使用することができます。

Next.js に組み込まれている Sass のサポートを利用する前に、sass をインストールしてください。

```bash
npm install sass
```

#### このレッスンはこれで以上です！
Next.js に組み込まれている CSS サポートや CSS モジュールについてもっと知りたい方は、[我々のドキュメンテーション](https://nextjs.org/docs/basic-features/built-in-css-support) をチェックしてください。

------
## プリレンダリングとデータフェッチング
我々はブログを作りたい（[作りたいものはこれ](https://next-learn-starter.now.sh/)です）のですが、ここまででブログの中身は何も追加していません。このレッスンでは、外部にあるブログデータを自分のアプリに取り込む方法を学びます。  
このレッスンではブログのコンテンツをファイルシステムに保存していきますが、コンテンツが他の場所（データベースやヘッドレス CMS など）に存在する場合も問題なく動作します。

### このレッスンで学ぶこと
- Next.js のプリフェッチングに関する特徴
- プリフェッチングの 2 つの形式：静的生成（Static Generation）とサーバサイドレンダリング
- データがある場合とない場合の静的生成
- `getStaticProps` と、外部のブログデータをインデックスページにインポートするためのそれ（`getStaticProps`）の使い方
- `getStaticProps` に関する便利情報

### セットアップ
#### スターターコードをダウンロードする（任意）
前のレッスンから継続して取り組んでいる場合は、以下はスキップできます。  
そうでないのであれば、スターターコードをダウンロードおよびインストールし、以下のとおり実行してください。繰り返しになりますが、前回のレッスンを終えているのであれば以下は不要です。
```bash
# If you prefer Yarn, you can use `yarn create` instead of `npm init`
npm init next-app nextjs-blog --example "https://github.com/zeit/next-learn-starter/tree/master/data-fetching-starter"
cd nextjs-blog
# If you prefer Yarn, you can use `yarn dev` instead
npm run dev
```

スターターコードをダウンロードしたら、以下を更新してください：
- `public/images/profile.jpg` をあなたの写真にしてください（推奨：400px × 400px）
- `components/layout.js` 内の `const name = '[Your Name]'` をあなたの名前にしてください。
- `pages/index.js` 内の `<p>[Your Self Introduction]</p>` をあなたの自己紹介文にしてください。

### プリレンダリング
データフェッチングについて説明する前に、Next.js の最も重要な概念のひとつである **プリレンダリング** について説明します。

デフォルトで、Next.js はすべてのページをプリレンダリングします。つまり、Next.js は、クライアント側の JavaScript ですべてのレンダリングを行うのではなく、あらかじめ各ページの HTML を生成しておくということです。プリレンダリングの結果、パフォーマンスと SEO が向上します。

生成された各 HTML はそのページに必要な最小限の JavaScript コードと関連づけられます。ブラウザによってページが読み込まれると、そのページの JavaScript コードが実行され、ページが完全にインタラクティブなものになります（このプロセスは **ハイドレーション** と呼ばれます）。

### プリレンダリングが行われていることを確認する
以下のステップによって、プリレンダリングが行われていることを確認できます。
- ブラウザの JavaScript を無効にしてください（[Chromeを使っている場合はこちらから](https://developers.google.com/web/tools/chrome-devtools/javascript/disable)）
- 本番環境で Next.js アプリにアクセスしてみてください（もしくは [このページ](https://next-learn-assets-metadata-css.now.sh/) にアクセスして確認することもできます）

アプリが JavaScript 無しでレンダリングされていることがわかるはずです。これは Next.js が静的な HTML としてアプリをプリレンダリングしているからで、これによって JavaScript を実行せずともアプリの UI を見ることができるのです。

> メモ：上記のステップは `localhost` でも試すことができますが、JavaScript を無効化していると CSS は読み込まれません。

プレーンな React で（つまり Next.js は使わずに）アプリを作った場合、プリレンダリングは行われません。したがって、JavaScript を無効にするとアプリは表示されなくなってしまいます。たとえば：
- ブラウザで JavaScript を有効にした状態で[このページを確認してください](https://create-react-app.now-examples.now.sh/)。これは [Create React App](https://create-react-app.dev/) で作成したプレーンな React アプリです。
- いま、JavaScript を無効にして[同じページ](https://create-react-app.now-examples.now.sh/)に再度アクセスしてください。
- アプリは表示されなくなっているはずです。代わりに、「You need to enable JavaScript to run this app.」と表示されています。これはアプリが静的な HTML にプリレンダリングされていないためです。

### サマリー：プリレンダリングあり vs プリレンダリングなし
簡単にまとめてみると以下のようになります。

**画像**

**画像**

次は、Next.js におけるプリレンダリングの 2 つの形式についてお話します。

### プリレンダリングにおける 2 つの形式
Next.js のプリレンダリングには 2 つの形式があります：**静的生成（Static Generation）** と **サーバサイドレンダリング（SSR）** です。それらの違いは、いつ HTML を生成するかというところにあります。

- **静的生成** は **ビルド時** に HTML を生成するプリレンダリング手法です。プリレンダリングされた HTML は各リクエストに対して *再利用* されます。
- **サーバサイドレンダリング** は **毎回のリクエストごとに**  HTML を生成するプリレンダリング手法です。

**画像**

**画像**

> 開発モード（`npm run dev` あるいは `yarn dev` を実行したとき）では、静的生成を使用しているページであっても、すべてのページが毎回のリクエストごとにプリレンダリングされます。

### ページ単位
重要なことは、Next.js ではページごとにどちらのプリレンダリング形式を使用するか **選択** できるということです。ほとんどのページにおいて静的生成（Static Generation）を使用しつつ、残る一部のページはサーバサイドレンダリングを使用するというような「ハイブリッド」な Next.js アプリを作ることができるのです。

**画像**

### いつ静的生成（Static Generation）を使い、いつサーバサイドレンダリングを使用すべきか
可能ならばいつでも静的生成（データの有無を問わず）を使用することを推奨します。そうすることで、ページは一度ビルドされたら CDN によって提供されるので、毎回のリクエストに対してサーバサイドレンダリングを行うよりもはるかに高速になるからです。

静的生成はいろんなタイプのページで使用できます。一例を示すと：
- マーケティングページ
- ブログ記事
- E コマースの商品リスト
- ヘルプやドキュメンテーション

自分自身に尋ねてみましょう、「このページをユーザーのリクエストに **先立って** プリレンダリングすることはできるだろうか？」。答えが yes であれば、静的生成を選択すべきです。

一方、ユーザーのリクエストに先立ってページをプリレンダリングすることができないのであれば、静的生成は良い考えでは **ありません**。頻繁に更新されるデータを表示するページや、毎回のリクエストごとに内容が変わるページなどです。

そういったケースでは、**サーバサイドレンダリング** を使用することができます。静的生成に比べて遅くなってはしまいますが、プリレンダリングされたページはつねに最新状態が保たれます。あるいはプリレンダリングは行わずに、クライアント側の JavaScript を使用してデータを埋め込むこともできます。

### 静的生成にフォーカスを当てる
このレッスンでは、静的生成にフォーカスを当てます。次は、データが **ある場合と無い場合** の静的生成についてお話します。

### データがある場合とない場合の静的生成
静的生成は **データ** がある場合も無い場合も行うことができます。

ここまでで我々が作ってきたページでは外部データの取得（フェッチ）は必要ありませんでした。こういったページは、本番用にアプリがビルドされるときに自動的に静的生成されます。

**画像**

しかし、ページによっては、最初に外部データを取得しないと HTML をレンダリングできない場合があります。ファイルシステムにアクセスしたり、外部 API を取得したり、ビルド時にデータベースに問い合わせたりする必要があるかもしれません。Next.js ではこうしたケース、すなわち **データ有り** の静的生成も、追加設定なしで対応できます。

**画像**

### `getStaticProps` を使った、データ有りの静的生成
データ有りの静的生成はどのように動作するのでしょうか？Next.js では、ページコンポーネントを export するとき、`getStaticProps` という `async` 関数も export することができます。そうした場合、
- `getStaticProps` は本番環境用のビルド時に実こおうされます
- 関数内部では、外部データを取得（フェッチ）して、取得したデータを props としてページに渡すことができます。

```js
export default function Home(props) { ... }

export async function getStaticProps() {
    // ファイルシステムや API、DB などから外部データを取得する
    const data = ...

    // `props` キーに対応する値が `Home` コンポーネントに渡される
    return {
        props: ...
    }
}
```

本質的には、`getStaticProps` を使うことで Next.js にこう伝えることができるということです。「このページにはいくつか外部に依存しているデータがあるよ。だからビルド時にこのページをプリレンダリングするときは、まずその依存関係をしっかり解決してよ！」

> メモ：開発環境では、`getStaticProps` は毎回のリクエストごとに実行されます。

### `getStaticProps` を使いましょう
習うより慣れろです。次からは `getStaticProps` を使ってブログに実装を加えていきましょう！

### ブログのデータ
では、ファイルシステムを使って、アプリにブログのデータを追加しましょう。各ブログの投稿はマークダウンファイルにします。
- 新たに `posts` という名前のディレクトリをトップレベルに作成してください（`pages/posts` とは異なります）。
- そのディレクトリの中に `pre-rendering.md` と `ssg-ssr.md` という 2 つのファイルを作成してください。

以下を `pre-rendering.md` にコピーしてください。

```markdown
---
title: 'Two Forms of Pre-rendering'
date: '2020-01-01'
---

Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.

- **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.
- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.
```

以下を `ssg-ssr.md` にコピーしてください。

```markdown
---
title: 'When to Use Static Generation v.s. Server-side Rendering'
date: '2020-01-02'
---

We recommend using **Static Generation** (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.

You can use Static Generation for many types of pages, including:

- Marketing pages
- Blog posts
- E-commerce product listings
- Help and documentation

You should ask yourself: "Can I pre-render this page **ahead** of a user's request?" If the answer is yes, then you should choose Static Generation.

On the other hand, Static Generation is **not** a good idea if you cannot pre-render a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.

In that case, you can use **Server-Side Rendering**. It will be slower, but the pre-rendered page will always be up-to-date. Or you can skip pre-rendering and use client-side JavaScript to populate data.
```

> `title` と `date` を含むメタデータ部分が各マークダウンの一番上にあることに気づいたかもしれません。これは YAML Front Matter と呼ばれているもので、 [gray-matter](https://github.com/jonschlinkert/gray-matter) というライブラリを使って解析できます。

### `getStaticProps` でブログデータを解析する
では、このデータを使ってインデックスページ（`pages/index.js`）を更新しましょう。やろうとしていることは
- 各マークダウンファイルを解析して `title`、`date` およびファイル名（その投稿の URL に対応する `id` としてファイル名を使います）を取得します
- インデックスページのデータをリスト化し、日付によってソートします。

**画像**

### getStaticProps を実装する
最初に、各マークダウンファイルのメタデータを解析するために [gray-matter](https://github.com/jonschlinkert/gray-matter) をインストールします。

```bash
npm install gray-matter
```

次に、ファイルシステムからデータを取得するための簡単なライブラリを作ります。
- `lib` というディレクトリをトップレベルに作成してください
- そのディレクトリの中に `posts.js` というファイルを以下の内容で作成してください。

```js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}
```

そうしたら、 `pages/index.js` 内で、この関数をインポートしてください。

```js
import { getSortedPostsData } from '../lib/posts'
```

続いてこの関数を `getStaticProps` 内で呼びます。関数を呼び出した結果は props キーの内部で返す必要があります。

```js
export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
```

このように設定すれば、`allPostsData` prop は `Home` コンポーネントに渡されます。この渡された prop を見るために、コンポーネントの定義を `{ allPostsData }` を受け取るように修正しましょう。

```js
export default function Home ({ allPostsData }) { ... }
```

データを表示するために、別の `<section>` タグをコンポーネントの下部に追加します。

```js
export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>…</Head>
      <section className={utilStyles.headingMd}>…</section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
```

いま、http://localhost:3000 にアクセスすればブログのデータが見えるはずです。

**画像**

おめでとうございます！外部のデータを（ファイルシステムから）取得して、そのデータを使ってインデックスページをプリレンダリングすることが無事成功しました！

**画像**

`getStaticProps` を使うにあたっての Tips をいくつか紹介します。

### getStaticProps の詳細
`getStaticProps` に関するより詳しい情報は [ドキュメンテーション](https://nextjs.org/docs/basic-features/data-fetching) から確認できますが、ここでは `getStaticProps` について知っておくべきいくつかの本質的な情報を紹介します。

### 外部 API を取得する あるいは データベースに問い合わせる
我々が作ったアプリの `lib/posts.js` では、`getSortedPostsData` を実装してファイルシステムからデータを取得しました。しかし、外部の API エンドポイントといった他のデータソースからもデータを取得することができますし、そのようにしても問題なく動作します。

```js
import fetch from 'node-fetch'

export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from an external API endpoint
  const posts = await fetch('..')
  return res.json()
}
```

直接データベースにクエリを発行することもできます。

```js
import someDatabaseSDK from 'someDatabaseSDK'

const databaseClient = someDatabaseSDK.createClient(...)

export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from a database
  return databaseClient.query('SELECT posts...')
}
```

これは、`getStaticProps` は **サーバサイドでのみ** 実行されるから可能なことです。`getStaticProps` がクライアントサイドで実行されることは決してありません。ブラウザ用の JS バンドルに含まれることもありません。つまり、直接データベースにクエリを投げるようなコードを書くことができて、ブラウザにそのコードが送られることは無いということです。

### 開発環境 vs 本番環境
- 開発環境（`npm run dev` あるいは `yarn dev`）では、`getStaticProps` は毎回のリクエストごとに実行されます。
- 本番環境では、`getStaticProps` はビルド時にのみ実行されます。

ビルド時にのみ実行されるよう想定されているため、クエリパラメータや HTTP ヘッダなど、リクエスト時にしか利用できないデータを使用することはできません。

### ページでのみ利用できる
`getStaticProps` は **ページ** からのみ export できます。ページではないファイルから export することはできません。

この制約の理由のひとつは、React では、ページがレンダリングされる前に、必要なデータがすべて揃っている必要があるからです。

### リクエスト時にデータを取得する必要がある場合はどうする？
ユーザーのリクエストに先立ってページをプリレンダリングすることができない場合には静的生成はいいアイデアでは **ありません**。頻繁に更新されるデータを表示したり、ページの内容が毎回のリクエストで変化するようなページの場合です。

こういったケースでは、**サーバサイドレンダリング** を試すか、プリレンダリングをスキップしてしまうこともできます。次のレッスンに進む前に、こういった戦略について説明します。

### リクエスト時にデータを取得する
ビルド時ではなく **リクエスト時** にデータを取得する必要がある場合、**サーバサイドレンダリング** を試してみることができます。

**画像**

サーバサイドレンダリングを使うには、`getStaticProps` ではなく`getServerSideProps` をページから export する必要があります。

### `getServerSideProps` を使う
こちらが `getServerSideProps` のスターターコードです。我々のブログアプリの例では必要ありませんので実装は行いません。

```js
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    }
  }
}
```

`getServerSideProps` はリクエスト時に呼ばれるので、そのパラメータ（`context`）にはリクエストの特定のパラメータが含まれます。これは [ドキュメンテーション](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) でもっと知ることができます。

`getServerSidePRops` は、リクエスト時にデータを取得しなければならないページをプリレンダリングする必要がある場合にのみ使うべきです。毎回のリクエストに対してサーバはレンダリング処理を行わなくてはならず、また、その処理の結果は追加の設定をしないかぎり CDN にキャッシュしておくこともできないので、Time To First Byte（TTFB、最初の 1 バイトが到着するまでの時間）は `getStaticProps` よりも遅くなってしまいます。

### クライアントサイドレンダリング
データをプリレンダリングする必要が **ない** 場合には、以下の戦略（**クライアントサイドレンダリング** と呼ばれる）を使うこともできます。
- 外部データを必要としないページの部分を静的生成（プリレンダリング）する
- ページが読み込まれたら、クライアント側で JavaScript を使って外部データを取得し、残る部分にデータを埋め込む

**画像**

このアプローチは、たとえば、ユーザーのダッシュボードページを作るときなどにうまくいきます。ダッシュボードはプライベートなもので、ユーザーに固有のページであり、SEO は関係なく、ページがプリレンダリングされる必要もないからです。データは頻繁に更新され、リクエスト時のデータ取得を必要とします。

### SWR
Next.js を開発しているチームは、SWR というデータフェッチ用の React フックを作成しました。クライアント側でデータを取得する場合にはこちらを強くおすすめします。キャッシング、再検証（revalidation）、フォーカストラッキング、インターバルを開けた再フェッチなどに対応しています。ここでは詳細までは触れませんが、使用例を紹介します。

```js
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

[詳細は SWR のドキュメントをチェックしてください](https://swr.now.sh/)。

**完了です！**
次のレッスンでは、各ブログの投稿に対して **動的ルーティング** を使用してページを作成します。

> 繰り返しになりますが、`getStaticProps` と `getServerSideProps` についてより深く知りたい場合は [ドキュメンテーション](https://nextjs.org/docs/basic-features/data-fetching) をご確認ください。

----
## 動的ルーティング
ブログのデータをインデックスページに埋め込みましたが、個々のブログ記事のページはまだ作成していません（[作りたいものはこちら](https://next-learn-starter.now.sh/)です）。こうした個々の記事のページの URL はブログのデータに依存するものにしたいところです。つまり、動的ルーティングを使用する必要があるということです。

### このレッスンで学ぶこと
- `getStaticPaths` を使って動的ルーティングによりページを静的に生成する方法
- ブログの各投稿のデータを取得するための `getStaticProps` の書き方
- `remark` を用いたマークダウンのレンダー方法
- 日付を表す文字列をきれいに出力する方法
- 動的ルーティングを用いてページにリンクを貼る方法
- 動的ルーティングに関するいくつかの便利な情報

### セットアップ
#### スターターコードをダウンロードする（任意）
前のレッスンから継続して取り組んでいる場合は、以下はスキップできます。  
そうでないのであれば、スターターコードをダウンロードおよびインストールし、以下のとおり実行してください。繰り返しになりますが、前回のレッスンを終えているのであれば以下は不要です。

```bash
# If you prefer Yarn, you can use `yarn create` instead of `npm init`
npm init next-app nextjs-blog --example "https://github.com/zeit/next-learn-starter/tree/master/dynamic-routes-starter"
cd nextjs-blog
# If you prefer Yarn, you can use `yarn dev` instead
npm run dev
```

スターターコードをダウンロードしたら、以下を更新してください：
- `public/images/profile.jpg` をあなたの写真にしてください（推奨：400px × 400px）
- `components/layout.js` 内の `const name = '[Your Name]'` をあなたの名前にしてください。
- `pages/index.js` 内の `<p>[Your Self Introduction]</p>` をあなたの自己紹介文にしてください。

### 外部データに依存するページのパス
前のレッスンでは、**ページの内容** が外部データに依存するケースを扱いました。`getStaticProps` を使って、インデックスページをレンダーするのに必要なデータを取得したのでした。

今回のレッスンでは、各 **ページのパス** が外部データに依存するケースについて説明します。Next.js を使うことで、外部データに依存するパスを持ったページを静的に生成することができます。このことによって、Next.js では **動的な URL** を使うことが可能になるのです。

**画像**

### 動的ルーティングを使って静的にページを生成する方法
我々のケースでは、ブログの各投稿に対して動的にページを生成したいです。
- 各投稿を `/posts/<id>` というパスにしたいですし、ここで `<id>` は、トップレベルに作成した `posts` ディレクトリにあるマークダウンファイルの名前を使いたいです。
- 我々は `ssg-ssr.md` と `pre-rendering.md` が手元にあるので、それらは `/posts/ssg-ssr` と `/posts/pre-rendering` というパスにしたいです。

### ステップの概要
以上のことは、以下のステップを踏むことで可能です。**まだこれらの変更を加える必要はありません**、次のページ（節）から行っていきます。

まず、`pages/posts` の下に `[id].js` というページを作成します。`[` で始まり `]` で終わるページは、Next.js では動的なページになります。

`pages/posts/[id].js` では、ブログの投稿記事をレンダーするコードを書きます。我々が作った他のページと同様です。

```js
import Layout from '../../components/layout'

export default function Post() {
  return <Layout>...</Layout>
}
```

ここで、新たに次のことを行います。それは、このページから `getStaticPaths` という async 関数を export するということです。この関数の中では、`id` として **とりうる値** のリストを返さなければなりません。

```js
import Layout from '../../components/layout'

export default function Post() {
  return <Layout>...</Layout>
}

export async function getStaticPaths() {
  // Return a list of possible value for id
}
```

最後に、ここでまた `getStaticProps` を実装します。今回は、受け取った `id` に基づいて必要なデータを取得します。`getStaticProps` は `params` を受け取りますが、そこには `id` が含まれています。

```js
import Layout from '../../components/layout'

export default function Post() {
  return <Layout>...</Layout>
}

export async function getStaticPaths() {
  // Return a list of possible value for id
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
}
```

以上で説明したことを視覚的にまとめると以下のようになります。

**画像**

### getStaticPaths を実装する
最初に、以下のファイルをセットアップしましょう。
- `[id].js` というファイルを `pages/posts` ディレクトリの中に作成してください
- また、`pages/posts` ディレクトリ内の `first-post.js` を削除してください、こちらのファイルはもう使いません。

そうしたら、以下を `pages/posts/[id].js` に書き加えてください。`...` の部分はあとで埋めます。

```js
import Layout from '../../components/layout'

export default function Post() {
  return <Layout>...</Layout>
}
```

そうしたら、`lib/posts.js` を開いて、以下の関数を追加してください。この関数は、`posts` ディレクトリに存在するファイル名（`.md` ファイルを覗く）のリストを返します。

```js
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}
```

**重要**： return されるリストはただの文字列の配列では *ありません*。上記でコメントアウトされているようなオブジェクトの配列でなければなりません。各オブジェクトには `params` キーが存在して、`id` キーを持ったオブジェクトを含んでいなくてはなりません（ファイル名で `[id]` を使用するため）。そうしなければ、`getStaticPaths` は失敗します。

最後に、`pages/posts/[id].js`の中で、この関数をインポートします。

```js
import { getAllPostIds } from '../../lib/posts'
```

そうしたら、この関数を呼び出す `getStaticPaths` を作成します。

```js
export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}
```

- `id` としてとりうる値の配列は、return されたオブジェクトの `paths` キーに対応する値でなければなりません。これはまさに `getAllPostIds()` が返すものです。
- `fallback: false` は今のところは無視してください。後ほど説明します。

これでほとんど完了ですが、`getStaticProps` を実装する必要があります。

### getStaticProps を実装する
与えられた `id` を持つ投稿をレンダーするのに必要なデータをフェッチする必要があります。

そうするために、`lib/posts.js` を再度開き、以下の関数を追記してください。これは `id` に基づいてブログの投稿データを返します。

```js
export function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Combine the data with the id
  return {
    id,
    ...matterResult.data
  }
}
```

最後に、`pages/posts/[id].js` の中で、以下の行を…

```js
import { getAllPostIds } from '../../lib/posts'
```

次のように置き換えてください：

```js
import { getAllPostIds, getPostData } from '../../lib/posts'
```

そうしたら、この関数を呼び出す `getStaticProps` を作成してください。

```js
export async function getStaticProps({ params }) {
  const postData = getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
```

その後、`Post` コンポーネントを、`postData` を使うように更新してください。

```js
export default function Post({ postData }) {
  return (
    <Layout>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
    </Layout>
  )
}
```

これで出来上がりです！試しに次のページにアクセスしてみてください。
- http://localhost:3000/posts/ssg-ssr
- http://localhost:3000/posts/pre-rendering

各ページのブログ記事のデータを見ることができるはずです。

**画像**

素晴らしいですね！動的なページを生成することに成功しました。

### うまくいかない場合
エラーに出くわした場合は、正しいコードを書いたファイルになっているか確認してください。
- `pages/posts/[id].js` は[このようなコード](https://github.com/zeit/next-learn-starter/blob/master/dynamic-routes-step-1/pages/posts/%5Bid%5D.js)になります。
- `lib/posts.js` は[このようなコード](https://github.com/zeit/next-learn-starter/blob/master/dynamic-routes-step-1/lib/posts.js)になります。
- （それでもうまく動かない場合は）残りのコードは[このようなコード](https://github.com/zeit/next-learn-starter/tree/master/dynamic-routes-step-1)になります。

それでもまだ詰まっている場合は、[GitHub Discussions](https://github.com/zeit/next.js/discussions) からコミュニティにお気軽に質問してください。他の人がコードを見ることができるように、GitHub にあなたのコードを push してそれにリンクを貼っていただけるとありがたいです。

### サマリー
ここでまた、我々が行ったことを視覚的にまとめておきます。

**画像**

しかしまだブログの **マークダウンのコンテンツ** を表示していません。次にその部分に取り組みましょう。

### マークダウンをレンダーする
マークダウンのコンテンツをレンダーするために、`remark` ライブラリを使用します。まずはインストールしましょう。

```bash
npm install remark remark-html
```

それらを `lib/posts.js` でインポートします。

```js
import remark from 'remark'
import html from 'remark-html'
```

そして、`getPostData()` を `remark` を使用するように、以下のとおり書き換えてください。

```js
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}
```

**重要**：　**`async`** キーワードを `getPostData` に追加しましたが、これは、`remark` に対して `async` を使用する必要があるためです。

これは、`pages/posts/[id].js` 内の `getStaticProps` を、`getPostData` を呼び出すときに `await` を使用するように書き換える必要があるということです。

```js
export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  const postData = await getPostData(params.id)
  // ...
}
```

最後に、`Post` コンポーネントを書き換えて、`dangerouslySetInnerHTML` を使って `contentHtml` をレンダーするようにしましょう。

```js
export default function Post({ postData }) {
  return (
    <Layout>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
      <br />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  )
}
```

もう一度、以下のページにアクセスしてみてください。

- http://localhost:3000/posts/ssg-ssr
- http://localhost:3000/posts/pre-rendering

ブログのコンテンツが表示されているはずです。

**画像**

これでほぼ完了です。次は、各ページを磨き上げて完成させましょう。

### 投稿ページを磨き上げる
#### 投稿ページに `title` を追加する
`pages/posts/[id].js` 内で、投稿データを使って `title` タグを追加しましょう。`next/head` をインポートし、`title` タグを追加します。

```js
import Head from 'next/head'

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      ...
    </Layout>
  )
}
```

#### データのフォーマットを整える
データをフォーマットするために、`date-fns` ライブラリを使用します。まずはインストールします。

```bash
npm install date-fns
```

次に、`components/date.js` ファイルに `Date` コンポーネントを作成します。

```js
import { parseISO, format } from 'date-fns'

export default function Date({ dateString }) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
}
```

そうしたらそれを `pages/posts/[id].js` 内で使いましょう。

```js
// Add this line to imports
import Date from '../../components/date'

export default function Post({ postData }) {
  return (
    <Layout>
      ...
      {/* Replace {postData.date} with this */}
      <Date dateString={postData.date} />
      ...
    </Layout>
  )
}
```
http://localhost:3000/posts/pre-rendering にアクセスすれば、「**January 1, 2020**」と日付が書かれているのが見えるはずです。

#### CSS を追加する
最後に、いくらか CSS を追加しましょう。`pages/posts/[id].js` の中に、`article` タグの下にあるコードをすべて書き、また、以下に示すとおりに CSS モジュールを使用してください。

```js
// Add this line
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
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
```

http://localhost:3000/posts/pre-rendering にアクセスすれば、ページの見た目は少しよくなっているはずです。

**画像**

すばらしい！次にインデックスページを磨き上げれば完了です！

### インデックスページを磨き上げる
最後のステぷとして、インデックスページ（`pages/index.js`）を更新しましょう。

具体的には、各投稿ページに対してのリンクを追加する必要があります。`Link` コンポーネントを使用していきますが、今回は少し違うことをする必要があります。

動的ルーティングを持った持ったページにリンクを貼るには、`Link` コンポーネントを少し違うかたちで使う必要があります。我々のケースでは、`/posts/ssg-ssr` にリンクするのに、このように書く必要があります：

```js
<Link href="/posts/[id]" as="/posts/ssg-ssr">
  <a>...</a>
</Link>
```

見てわかるように、`href` には `[id]` を使い、`as` prop には実際のパス（`ssg-ssr`）を用いる必要があります。

それでは実装してみましょう。まずは、`Link` と `Date` を `pages/index.js` 内でインポートしてください。

```js
import Link from 'next/link'
import Date from '../components/date'
```

そうしたら、`Home` コンポーネントの下部近くで、`li` タグを以下で書き換えてください。

```js
<li className={utilStyles.listItem} key={id}>
  <Link href="/posts/[id]" as={`/posts/${id}`}>
    <a>{title}</a>
  </Link>
  <br />
  <small className={utilStyles.lightText}>
    <Date dateString={date} />
  </small>
</li>
```

各記事に対してリンクすることができているはずです。

**画像**

> うまく動いていないものがあるときは、コードが[このように](https://github.com/zeit/next-learn-starter/tree/master/api-routes-starter)なっているか確認してください。

出来上がりです！このレッスンを終える前に、動的ルーティングを使うにあたっての Tips をいくつかご紹介します。

### 動的ルーティングの詳細
動的ルーティングについて深く知るには我々のドキュメンテーションをご覧ください。
- [データフェッチング](https://nextjs.org/docs/basic-features/data-fetching)
- [動的ルーティング](https://nextjs.org/docs/routing/dynamic-routes)

しかしここでは、動的ルーティングについて知っておくべきいくつかの本質的な情報をお伝えします。

#### 外部 API を取得する あるいは　データベースに問い合わせる
`getStaticProps` のように、`getStaticPaths` はどんあデータソースからもデータを取得することができます。我々の例では、`getAllPostIds` （`getStaticPaths` によって使われます）は外部の API エンドポイントからデータをフェッチしてきても構わないのです。

```js
export async function getAllPostIds() {
  // Instead of the file system,
  // fetch post data from an external API endpoint
  const posts = await fetch('..')
  const postsJson = res.json()
  return postsJson.map(post => {
    return {
      params: {
        id: post.id
      }
    }
  })
}
```

#### 開発環境 vs 本番環境
- 開発環境（`npm run dev` または `yarn dev`）では、`getStaticPaths` は毎回のリクエストごとに実行されます。
- 本番環境では、`getStaticPaths` はビルド時に実行されます。

#### Fallback
`getStaticPaths` から `fallback: false` を return したことを思い出してください。これは何を意味するのでしょうか。

もし `fallback` が `false` であれば、`getStaticPaths` から return されていないあらゆるパスは、アクセスすると **404 ページ** になります。

`fallback` が `true` であれば、`getStaticProps` の挙動は異なります：
- `getStaticPaths` から return されたパスはビルド時に HTML としてレンダーされます。
- ビルド時に生成されなかったパスにアクセスしても 404 ページには **なりません**。代わりに、Next.js はそうしたパスへの最初のリクエストがあったときに、そのページの「fallback」バージョンを提供します（Fallback ページの詳細は後述します）。
- バックグラウンドでは、Next.js はリクエストがあったパスを静的に生成します。同じページに対する後続（初回以降）のリクエストに対しては、その生成されたページが提供されます（ビルド時にプリレンダリングされた他のページと同じように）。

この内容は本レッスンのスコープを超えてしまいますが、`fallback: true` としたときの詳細については[ドキュメンテーション](https://nextjs.org/docs/basic-features/data-fetching#fallback-pages)から詳しく知ることができます。

#### すべてのルート（route）をキャッチ
動的ルーティングは、ブラケットの中で三点ドットを加えることで、すべてのパスをキャッチするように拡張することができます。たとえば：
- `pages/posts/[...id].js` は `/posts/a` とマッチしますが、`/posts/a/b`、`/posts/a/b/c` その他ともマッチします

この場合、`getStaticPaths` では、以下のように `id` キーの値として配列を返さなければなりません。

```js
return [
  {
    params: {
      // Statically Generates /posts/a/b/c
      id: ['a', 'b', 'c']
    }
  }
  //...
]
```

そうすることで `params.id` は `getStaticProps` において配列となります。

```js
export async function getStaticProps({ params }) {
  // params.id will be like ['a', 'b', 'c']
}
```

もっと学ぶには[動的ルーティング](https://nextjs.org/docs/routing/dynamic-routes)のドキュメントをご覧ください。

### ルーター（Router）
Next.js のルーターにアクセスしたければ、`useRouter` フックを `next/router` からインポートすることで可能になります。詳しくは[router のドキュメント](https://nextjs.org/docs/routing/dynamic-routes)をご覧ください。

### 404 ページ
独自の 404 ページを作成するには、`pages/404.js` を作成してください。このファイルはビルド時に静的に生成されます。

```js
// pages/404.js
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>
}
```

詳細は[エラーページ](https://nextjs.org/docs/advanced-features/custom-error-page#404-page)のドキュメントをご覧ください。

### 他の例
`getStaticProps` や `getStaticPaths` を説明するためにいくつか例を作成しました。もっと学ぶにはこれらのソースコードを見てみてください。

- [マークダウンファイルを使ったブログスターター](https://github.com/zeit/next.js/tree/canary/examples/blog-starter)（[デモ](https://next-blog-starter.now.sh/)）
- [DatoCMS の例](https://github.com/zeit/next.js/tree/canary/examples/cms-datocms)（[デモ](https://next-blog-datocms.now.sh/)）
- [TakeShape の例](https://github.com/zeit/next.js/tree/canary/examples/cms-takeshape)（[デモ](https://next-blog-takeshape.now.sh/)）
- [Sanity の例](https://github.com/zeit/next.js/tree/canary/examples/cms-sanity)（[デモ](https://next-blog-sanity.now.sh/)）

**これで出来上がりです！**

次のレッスンでは、Next.js の API ルート機能について解説します。

---
## API ルート
Next.js は API ルートをサポートしており、それにより、API エンドポイントを Node.js 関数として簡単に作成することができます。我々が作っているブログには必ずしも必要なものではありませんが、本レッスンではその使い方について手短にご説明します。

### このレッスンで学ぶこと
- API ルートの作り方
- API ルートに関する便利な情報

### セットアップ
#### スターターコードをダウンロードする（任意）
前のレッスンから継続して取り組んでいる場合は、以下はスキップできます。  
そうでないのであれば、スターターコードをダウンロードおよびインストールし、以下のとおり実行してください。繰り返しになりますが、前回のレッスンを終えているのであれば以下は不要です。

```bash
# If you prefer Yarn, you can use `yarn create` instead of `npm init`
npm init next-app nextjs-blog --example "https://github.com/zeit/next-learn-starter/tree/master/api-routes-starter"
cd nextjs-blog
# If you prefer Yarn, you can use `yarn dev` instead
npm run dev
```

スターターコードをダウンロードしたら、以下を更新してください：
- `public/images/profile.jpg` をあなたの写真にしてください（推奨：400px × 400px）
- `components/layout.js` 内の `const name = '[Your Name]'` をあなたの名前にしてください。
- `pages/index.js` 内の `<p>[Your Self Introduction]</p>` をあなたの自己紹介文にしてください。

### API ルートを作成する
API ルートを使うことで、Next.js アプリの中に API エンドポイントを作成することができます。そのためには、`pages/api` ディレクトリの中に、以下のフォーマットを持つ **関数** を作成します。

```js
// req = request data, res = response data
export default (req, res) => {
  // ...
}
```

これはサーバレス関数（ラムダ（Lambda）としても知られる）としてデプロイできます。

### 簡単な API エンドポイントを作成する
それでは試してみましょう。`pages/api` の中に、以下に示すコードで `hello.js` というファイルを作成してください。

```js
export default (req, res) => {
  res.status(200).json({ text: 'Hello' })
}
```

http://localhost:3000/api/hello にアクセスしてみてください。`{"text":"Hello"}`と表示されているはずです。以下に留意してください。：
- `req` は [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) のインスタンスであり、加えて、[ここ](https://nextjs.org/docs/api-routes/api-middlewares)にあるようなビルド済みのミドルウェアもあります。
- `res` は [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) のインスタンスであり、加えて[ここ](https://nextjs.org/docs/api-routes/response-helpers)にあるようなヘルパー関数もあります。

以上です！このレッスンを終える前に、API ルートを用いるうえでの Tips をいくつかご紹介します。

### API ルートの詳細
API ルートに関して深く知りたい場合は[ドキュメンテーション](https://nextjs.org/docs/api-routes/dynamic-api-routes)から情報を得ることができますが、ここでは API ルートについて知っておくべき重要な情報をご紹介します。

#### `getStaticProps` あるいは `getStaticPaths` からは API ルートをフェッチしないこと
`getStaticProps` あるいは `getStaticPaths` からは API ルートをフェッチすべき**ではありません**。そうする代わりに、`getStaticProps` あるいは `getStaticPaths` の中に直接サーバサイドのコードを書いてください（あるいはヘルパ関数を呼び出してください）。

理由は次のとおりです：`getStaticProps` あるいは `getStaticPaths` はサーバサイドでのみ実行されます。クライアントサイドで実行されることはありませんし、ブラウザ用の JS バンドルに含まれることもありません。これは、データベースに直接問い合わせるようなコードを書くことができて、そういったコードがブラウザ側に送られることは無いということです。

#### 良い使用例：フォーム入力を処理する
API ルートの良い使用例は、フォーム入力の処理です。たとえば、ページ内にフォームを作成し、そのフォームから API ルートに `POST` リクエストを送信させることができます。そうしたら、それを直接データベースに保存できます。API ルートのコードはクライアント側のバンドルには含まれないので、安全にサーバ再度のコードを書くことができるというわけです。

```js
export default (req, res) => {
  const email = req.body.email
  // Then save email to your database, etc...
}
```

#### プレビューモード
静的生成は、ページがヘッドレス CMS からデータを取得する場合に便利です。しかし、ヘッドレス CMS で下書きを書いていて、その下書きをすぐにページ上で**プレビュー**したい場合には理想的ではありません。これらのページをビルド時ではなく**リクエスト時に**レンダリングし、公開用のコンテンツではなく下書きの内容を取得したいと思うでしょう。こうした特別なケースに限っては、静的生成をバイパスしてほしいことと思います。

Nexrt.js はこの問題を解決する **プレビューモード** という機能を持っており、API ルートを利用しています。詳しくは、[プレビューモード](https://nextjs.org/docs/advanced-features/preview-mode)のドキュメントをご覧ください。

#### 動的 API ルート
API ルートは、通常のページと同様に動的なものにすることもできます。詳しくは[動的 API ルート](https://nextjs.org/docs/api-routes/dynamic-api-routes)のドキュメンテーションをご覧ください。

**以上です！**
次のレッスンでは、Next.js アプリを本番環境にデプロイする方法について説明します。

---
## Next.js アプリをデプロイする
このレッスンでは、Next.js アプリを本番環境にデプロイします。

Next.js を [Vercel](https://vercel.com/)（Next.js のクリエイターによって構築された Jamstack のデプロイプラットフォームです）にデプロイする方法を学びます。その他のデプロイの選択肢についてもご説明します。

> 前提事項：このレッスンでは [GitHub アカウント](https://github.com/)が必要です。

### このレッスンで学ぶこと
- Next.js アプリを [Vercel](https://vercel.com/) にデプロイする方法
- **DPS** ワークフロー：**D**evelop、**P**review、**S**hip
- Next.js アプリを独自のホスティングプロバイダにデプロイする方法

### スタータコードをダウンロードする（任意）
前のレッスンから継続して取り組んでいる場合は、以下はスキップできます。  
そうでないのであれば、スターターコードをダウンロードおよびインストールし、以下のとおり実行してください。繰り返しになりますが、前回のレッスンを終えているのであれば以下は不要です。

```bash
# If you prefer Yarn, you can use `yarn create` instead of `npm init`
npm init next-app nextjs-blog --example "https://github.com/zeit/next-learn-starter/tree/master/api-routes-starter"
cd nextjs-blog
# If you prefer Yarn, you can use `yarn dev` instead
npm run dev
```

スターターコードをダウンロードしたら、以下を更新してください：
- `public/images/profile.jpg` をあなたの写真にしてください（推奨：400px × 400px）
- `components/layout.js` 内の `const name = '[Your Name]'` をあなたの名前にしてください。
- `pages/index.js` 内の `<p>[Your Self Introduction]</p>` をあなたの自己紹介文にしてください。

### GitHub に push する
デプロイの前に、まだしていなければ Next.js アプリを [GitHub](https://github.com/zeit/next.js) に push しましょう。

これによりデプロイが簡単になります。

- あなた個人の GitHub アカウントで `nextjs-blog` という新しいリポジトリを作成してください。
- そのリポジトリは public でも private でも構いません。README やその他のファイルで初期化する必要は **ありません**。
- 手助けが必要であれば、[GitHub のこちらのガイド](https://help.github.com/en/github/getting-started-with-github/create-a-repo) をご覧ください。

そうしたら、
- Next.js アプリ用に git リポジトリをローカルで初期化していない場合は初期化してください。
- Next.js アプリを上記で作成した GitHub のリポジトリに push してください。

GitHub に push するには、以下のコマンドを実行すればよいです（`<username>` はあなたの GitHub のユーザ名で置き換えてください）。

```bash
git remote add origin https://github.com/<username>/nextjs-blog.git
git push -u origin master
```

GitHub リポジトリが準備できたら続けて次に進みましょう。

### Vercel にデプロイする
Next.js を本番環境にデプロイするのに最も簡単な方法は、Next.js のクリエイターによって開発された [Vercel](https://vercel.com/) プラットフォームを使うことです。

Vercel は、静的 & JAMstack 開発とサーバレス関数をサポートするグローバル CDN を備えたオールインワンのプラットフォームです。Vercel は Next.js アプリをデプロイするのに最適な場所だと考えます。無料で利用開始できます（クレジットカードは必要ありません）。

### Vercel アカウントを作成する
まずは、https://vercel.com/signup にアクセスして Vercel アカウントをさくせい　してください。**Continue with GitHub** を選択してサインアッププロセスを完了してください。

### **`nextjs-blog` リポジトリをインポートする**
サインアップを終えたら、`nextjs-blog` リポジトリを Vercel に **インポート** してください。こちらから行うことができます：https://vercel.com/import/git

- **Now for GitHub** をインストールする必要があります。**すべてのリポジトリ（All Repositories）** に対するアクセス権を与えることができます。
- Now をインストールしたら、`nextjs-blog` をインポートしてください。

以下の設定は *デフォルト値* を使うことができます。何か変更する必要はありません。Vercel は、Next.js アプリがあることを自動的に検知し、最適なビルド設定を選択してくれます。
- プロジェクト名
- ルートディレクトリ
- ビルドコマンド
- 出力されるディレクトリ
- 開発用のコマンド

デプロイを行うと、Next.js アプリはビルドを開始します。これは 1 分以内に完了するはずです。

> **ヘルプを利用できます**：デプロイに失敗しても、[GitHub のディスカッション](https://github.com/zeit/next.js/discussions)でいつでも助けを得ることができます。デプロイについての詳細は[こちら](https://nextjs.org/docs/deployment)をご覧ください。

ビルドが完了すると、デプロイ用の URL がいくつか表示されます。その URL のいずれかをクリックすうrと、 Next.js のスターターページがライブで表示されるはずです。

おめでとうございます！Next.js アプリを本番環境にデプロイすることができました。次に、Vercel の詳細とおすすめのワークフローについて詳しく説明します。

### Next.js と Vercel
[Vercel](https://vercel.com/)