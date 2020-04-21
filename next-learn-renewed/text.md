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

さらに、（開発時のビルドでなく）プロダクションとしてのビルドにおいては、`Link` コンポーネントがブラウザのビューポートに表示されると、Next.js は自動的にリンク先のページのコードをバックグラウンドで**プリフェッチ**します。リンクをクリックするときまでには、目的のページのコードはバックグラウンドで読み込まれ終わっており、ページ遷移はほぼ瞬時に行われるのです！

### サマリー
Next.js は、コード分割、クライアントサイドのナビゲーション、（プロダクション環境における）プリフェッチングによって、最良のパフォーマンスのためにアプリを自動的に最適化します。  

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