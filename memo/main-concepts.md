# main concepts
## イベント処理
クラスコンポーネントを利用する場合、イベントハンドラはクラスのメソッドになる。
例えば、以下の`Toggle`コンポーネントはユーザが "ON", "OFF" 状態を切り替えられるようなボタンをレンダーする。

```JavaScript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

JSX のコールバックにおける `this` の意味に注意しなければなりません。JavaScript では、クラスのメソッドはデフォルトではバインドされません。`this.handleClick` へのバインドを忘れて onClick に渡した場合、実際に関数が呼ばれた時に `this` は `undefined` となってしまいます。

これは React に限った動作ではなく、JavaScript における関数の仕組みの一部です。一般的に、`onClick={this.handleClick}` のように () を末尾に付けずに何らかのメソッドを参照する場合、そのメソッドはバインドしておく必要があります。

bind の呼び出しが苦痛なら、それを回避する方法が 2 つあります。実験的なパブリッククラスフィールド構文を使用しているなら、コールバックを正しくバインドするのにクラスフィールドを利用できます：

```javascript
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

この構文は、Create React App ではデフォルトで有効です。

クラスフィールド構文を使用していない場合、コールバック内でアロー関数を使用することもできます：

```javascript
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

**この構文での問題は、LoggingButton がレンダリングされるたびに異なるコールバック関数が毎回作成されるということです。大抵のケースではこれは問題ありません。しかし、このコールバックが props の一部として下層のコンポーネントに渡される場合、それら下層コンポーネントが余分に再描画されることになります。 一般的にはコンストラクタでバインドするかクラスフィールド構文を使用して、この種のパフォーマンスの問題を避けるようおすすめします。**

⬆️これどういう意味？

ちなみに、以下のイベントハンドラの書き方は正しい（つまり、onClick にアロー関数を突っ込むのがダメというわけではない）。
```javascript
class Square extends React.Component {
 render() {
   return (
     <button className="square" onClick={() => alert('click')}>
       {this.props.value}
     </button>
   );
 }
}
```

`onClick={() => alert('click')}` と記載したときに `onClick` プロパティに渡しているのは関数であることに注意してください。React はクリックされるまでこの関数を実行しません。`() =>` を書くのを忘れて `onClick={alert('click')}` と書くのはよくある間違いであり、こうするとコンポーネントが再レンダーされるたびにアラートが表示されてしまいます。

## メモ
JSXの中で、`=> {<li></li>}` だと error. `=> <li></li>` (without curly braces) はok

```javascript
class FilterableProductTable extends React.Component {
    render() {
        return (
            <ul>
            {/* => {<li></li>} だと error. => <li></li> (without curly braces) はok */}
            {this.props.products.map(product => 
                <li key={product.name}>{product.name}</li>
            )}
            </ul>
        )
    }
}
```


