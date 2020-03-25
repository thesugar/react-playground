# React の render porps と HOC を理解する
参考：[Understanding React Render Props and HOC](https://blog.bitsrc.io/understanding-react-render-props-and-hoc-b37a9576e196)

## なぜこれらのパターン（render props や HOC）が必要なのか？
React ではコード再利用のためのシンプルな方法が提供されており、それは **コンポーネント** である。コンポーネントは、ページのコンテンツやスタイル、ビジネスロジックに至るまで多くのものをカプセル化する。だから理想的には 1 つのコンポーネントの中に HTML や CSS、JavaScript を 1 つの目的のために（単一責任）組み合わせて持つことができる。  

## 例
さて、ここで E コマースアプリを作ってるとする。他の E コマースアプリのように、ユーザーは購入できる商品を見たり、カートに商品を入れたりすることができる。ということで、API から商品のデータを取得して、それをリストとして商品カタログを表示することになる。    

今回のケースでは、React コンポーネントはこんな感じで実装できる：  

```javascript
import React, { Component } from 'react';

class ProductList extends Component {
    state = {
        products : []
    };

    componentDidMount() {
        getProducts().then(products => {
            this.setState({
                products
            });
        });
    }

    render() {
        return (
            <ul>
              {this.state.products.map(product => (
                    <li key={product.id}>
                        <span>{product.name}</span>
                        <a href="#">Add to Cart</a>
                    </li>
              ))}
            </ul>
        );
    }
}

export { ProductList };
```

管理用に、商品を追加したり削除したりできる管理ポータルを設置する。この管理ポータルでは、同じ API からデータを取得し、表形式のフォームで商品カタログを表示するものとする。  

React コンポーネントの実装はこんな感じになる：  

```javascript
import React, { Component } from 'react';

class ProductTable extends Component {
    state = {
        products : []
    };

    componentDidMount() {
        getProducts().then(products => {
            this.setState({
                products
            });
        });
    }

    handleDelete = currentProduct => {
        const remainingProducts = this.state.products.filter(
            product => product.id !== currentProduct.id
        );
        deleteProducts(currentProduct.id).then(() => {
            this.setState({
                products: remainingProducts
            });
        });
    };

    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>
                                <button onClick={() => this.handleDelete(product)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

export { ProductList };
```

ここですぐにわかるのは、両方のコンポーネントとも商品のデータを取得するロジックを実装していることだ。  
そして今後、こんな状況も発生するかもしれない。  

- 商品のデータを使って、それを異なる形で表示する必要がある
- 商品のデータを異なる API から取ってきて（ユーザーのカートページでこれができれば便利）、ただしそれを `ProductList` でやったのとまったく同じように表示する
- API からデータを取ってくるかわりに、ローカルストレージから商品データにアクセスする
- 表形式の商品カタログで、Delete ボタンではなく異なるアクションを行うボタンを実装する

こういった際にそれぞれ別のコンポーネントを作るとなると、たくさんの同じコードを何回も書くことになってしまう。  

データの取得とデータの表示は 2 つの関心事に分割できる。わかりやすく言うと、1 つのコンポーネントはただ 1 つの責任を持っているほうがはるかに良いということだ。  

では、1 つめのコンポーネントをリファクタしてみよう。リファクタ前と同じように、商品データを prop として受け取り、商品カタログをリストとしてレンダーする。コンポーネントの state やライフサイクルメソッドは必要ないので、クラスコンポーネントから関数コンポーネントに変える。  

そうすると、以下のようになる：  

```javascript
import React from 'react';

const ProductList = ({ products }) => {
    return (
        <ul>
            {products.map(product => (
                <li key={product.id}>
                    <span>{product.name}</span>
                    <a href="#">Add to Cart</a>
                </li>
            ))}
        </ul>
    );
};

export { ProductList }
```

`ProductList` と同じ様に、`ProductTable` は商品データを prop として受け取り、そのデータを表の行としてレンダーする関数コンポーネントになる。  

さて、`ProductsData` というコンポーネントを作ってみよう。これは API から商品データを取得する。データ取得と state の更新は元々の `ProductList` コンポーネントと同じになる。だが、このコンポーネントのレンダーメソッドには何を書けばいいだろうか？

```javascript
import React, { Component } from 'react';

class ProductData extends Component {
    state = {
        products : []
    };

    componentDidMount() {
        getProducts().then(products => {
            this.setState({
                products
            });
        });
    }

    render() {
        return 'ここで何を返せばよい？';
    }
}

export { ProductData };
```

もしも単純に `ProductList` コンポーネントを return するように書いてしまったら、そのコンポーネントを `ProductTable` 用に再利用することはできなくなる。なんとかして、このコンポーネントが「自身は何をレンダーするべきか？」を問い合わせることができればこの問題は解決する。ある場所ではコンポーネントに対して `ProductList` コンポーネントをレンダーするように伝え、管理ポータルでは `ProductTable` コンポーネントをレンダーするように伝えるという具合だ。  

ここでレンダープロップや HOC（高階コンポーネント）が効いてくる。これらはまさに、コンポーネントが「自身は何をレンダーするべきなのか？」と尋ねる方法である。これによりコードの再利用をぐっと押し進めることができる。  

なぜレンダープロップや HOC が必要なのかわかったところで、それらの使い方を見ていこう。

## レンダープロップ（Render Props）
レンダープロップを概念的なレベルで理解するのはとても簡単。React のことはいったん忘れて、ふつうの JavaScript でちょっと考えてみよう。  

2 つの数の和を計算する関数があるとする。まず、計算結果をコンソールにログ出力したい。ということで、こんな感じで関数を設計する：

```javascript
const sum = (a, b) => {
    const result = a + b;
    console.log(result);
}
```

しかしながら、この `sum` 関数がめちゃくちゃ便利なので他の場所でも使いたくなったとする。そこで、コンソールに計算結果をログ出力するのではなく `sum` 関数からは計算結果だけをもらい、その計算結果をどう使うかは `sum` 関数を呼び出す側で決めるようにする。

こういうふうに書けばよい：

```javascript
const sum = (a, b, fn) => {
    const result = a + b;
    fn(result);
}

// 使い方
sum(1, 2, (result) => {
    console.log(result);
})

const alertFn = (result) => {
    alert(result);
}

sum(3, 6, alertFn)
```

`sum` 関数にコールバック関数を引数 `fn` として渡すのだ。そうすると、`sum` 関数は結果を計算し、その計算結果を引数として `fn` 関数を呼ぶ。こうしてコールバック関数は計算結果を受け取り、その結果を自由に使うことができる。  

これがレンダープロップのエッセンスである。このパターンを使うことでより明快なコードを書くことができる。ではこれを今回の問題に当てはめてみよう。  

2 つの数の合計を計算する関数のかわりに、商品データを取得する `ProductsData` コンポーネントがある。いま `ProductsData` コンポーネントには props を通じて関数が渡される。`ProductsData` コンポーネントは商品データを取得しその取得したデータを prop として渡された関数に与える。渡された関数は商品データを使ってなんでも好きなことができる。  

React では、このような実装になる：
```javascript
import React, { Component } from 'react';

class ProductData extends Component {
    state = {
        products : []
    };

    componentDidMount() {
        getProducts().then(products => {
            this.setState({
                products
            });
        });
    }

    render() {
        return this.props.render({
            products: this.state.products
        })
    }
}
```

`fn` 引数のように、関数として渡される **レンダー** プロップがあるというわけだ。それから `ProductData` コンポーネントは商品データを引数として、この関数を呼び出すことになる。  

`ProductData` コンポーネントは次のような形で使うことができる：

```javascript
<ProductData
    render={({products}) => <ProductList products={products} />}
/>

<ProductData
    render={({products}) => <ProductTable products={products} />}
/>

<ProductData render={({products}) => (
    <h1>
        Number of Products:
        <strong>{products.length}</strong>
    </h1>
)} />
```

見てわかるように、レンダープロップはかなりいろんな用途で使えるパターンだ。ほとんどのことはとてもわかりやすい方法で達成することができる。そしてこのことがまさに我々が墓穴を掘る理由である。

> Sunil Pai (@threepointone) のツイート
>> How soon do you think before the weenies start calling nested render props as callback hell (ネストされたレンダープロップをコールバック地獄と呼ぶようになるまではどれくらいだと思う？）

ネスティングを避けるシンプルなやり方はコンポーネントをより小さいコンポーネントに分割し、それらのコンポーネントを別々のファイルに分けることだ。もう一つのやり方は、より多くのコンポーネントを作り、それらを（レンダープロップの中に長ったらしい関数を書くのではなく）組み合わせることだ。  

ではここから HOC と呼ばれるもう一つのポピュラーなパターンを見ていこう。

## 高階コンポーネント（HOC）
このパターンでは、コンポーネントを引数として受け取り、同じコンポーネントを返す（tだし機能性を追加したうえで）関数を定義する。  

このことに聴き馴染みがあるとしたら、これが Mobx の拡張で使われるデコレータパターンに似ているからだ。Python のような多くの言語はデコレータを組み込みで持っており、JavaScript もじきにデコレータをサポートする予定だ。HOC はデコレータに非常によく似ている。  

HOCを理解するにはコードを見たほうが言葉で説明するよりずっと簡単だ。ということでまずはコードを見てみよう。

```javascript
import React, { Component } from 'react';

const withProductData = WrappedComponent =>
    class ProductData extends Component {
        state = {
            products: []
        };

        componentDidMount() {
            getProducts().then(products => {
                this.setState({
                    products
                });
            });
        }

        render() {
            return <WrappedComponent products={this.state.products} />;
        }
    };

export { withProductData };
```

見てわかるように、データ取得と state の更新ロジックはレンダープロップでやったのとちょうど同じである。唯一の変化は、コンポーネントクラスが関数の中にあることだ。その関数はコンポーネントを引数に取り、そしてレンダーメソッドの内部で、引数として渡されたコンポーネントを追加の props とともにレンダーする。こんな複雑な名前にしてはかなり簡単な実装ではないだろうか？

```javascript
// 高階コンポーネントを得るために ProductList と ProductTable をラップする
const ProductListWithData = withProductData(ProductList);
const ProductTableWithData = withProductData(ProductTable);

// 通常のコンポーネントと同じ様に高階コンポーネントを使える
<div>
    <ProductListWithData />
    <ProductTableWithData />
</div>
```

ということで、なぜレンダープロップや HOC が必要なのかということ、そしてそれらをどのように実装できるのかということを見てきた。  

1 つ疑問が残る：レンダープロップか HOC、どのように選択すればよいのだろうか？　これはかなりたくさんの記事があるので今回は立ち入らない。  

[When to NOT use Render Props](https://blog.kentcdodds.com/when-to-not-use-render-props-5397bbeff746)
[HOCs vs Render Props](https://www.richardkotze.com/coding/hoc-vs-render-props-react)

## 結論
本記事ではなぜこれらのパターンが必要なのか、それぞれのパターンのエッセンス、そして再利用性の高いコンポーネントを組み立てるためにこれらのパターンをどうやって活用すればよいのかを見てきた。

------

## 比較
[Higher-order components vs Render Props](https://www.richardkotze.com/coding/hoc-vs-render-props-react) の記事では、次のように比較されている。

- HOCは何を解決するのか？
    - 重要なことは、ES6 クラスを使用する際にコードを再利用する方法を提供してくれたこと。
    - 2 つの HOC が同じものを実装しても、メソッド名の衝突がなくなる。
    - 再利用可能な小さなコード単位を簡単に作ることができ、単一責任の原則をサポートする。
    - 複数のHOCを合成して 1 つのコンポーネントに適用することができる。Recompose のように compose 関数を使うと可読性が向上する。

- HOC には新たな問題が発生する。
    - デバッグに役立つように、displayName を HOC 関数名で設定するなどのボイラプレートコード (withHOC(Component))。
    - すべての関連する props がコンポーネントに渡されていることを確認する。
    - ラップされたコンポーネントから static メソッドを巻き上げる。
    - 複数の HOC を一緒に構成するのは簡単ですが、これは深いネストツリーを作り出し、デバッグが難しくなる。

- レンダープロップは何を解決するのか？
    - ES6 クラスを使用する際に、コンポーネント間でコードを再利用する。
    - 最低レベルのインダイレクト - どのコンポーネントが呼び出され、state が分離されているかが明確になる。
    - props、state、クラスメソッドの名前の衝突の問題がない。
    - ボイラーコードや static メソッドの巻き上げが必要ありません。

- レンダープロップの問題
    - レンダープロップが認識していないデータの上で閉じる可能性があるため、`shouldComponentUpdate` を使用することに注意
    - また、すべてのレンダーに対してクロージャを定義する際に、メモリの問題が発生する可能性がある。しかし、パフォーマンスを変更する前に必ず最初に測定すること。
    - もう 1 つの小さな問題は、レンダープロップコールバックが JSX では式でラップする必要があるため、あまりきれいではないこと。HOC の結果をレンダリングすると、よりきれいに見える。

- レンダープロップか HOC か？
一般的にはレンダープロップが HOC が提起する問題を解決していると言える。レンダープロップス、標準のコンポーネントに似ているため、ボイラコードが少なく、static メソッドを巻き上げる必要がないため、セットアップが簡単。また、state の更新や props の受け渡しに失敗することが少なくなるため、より予測しやすくなる。  

しかし、特に多くの横断的な関心事がコンポーネントに適用される場合は、レンダープロップよりも HOC の方が良いと思う。多くのネストされたレンダープロップコンポーネントは、Andrew Clark が Twitter で強調しているように、「コールバック地獄」に似ている。小さな HOC ユニットを作成し、それらを一緒にコンポーズして機能豊富なコンポーネントを構築するのは簡単である。

問題解決に最も役立つツールを使うことを忘れずに、ハイプ（誇大広告）ドリブン開発に負けないようにしよう。レンダープロップと HOC はどちらも素晴らしい React パターンなんだから。