# コンテクスト
## 使いどころ
ある React コンポーネントのツリーに対して「グローバル」とみなsことができる、  
- 現在の認証済みのユーザ
- テーマ
- 有線言語
といったデータを共有するために設計されている。  
コンテクストを使用することで、中間の要素群を経由してプロパティを渡すことを避けることができる。  

```javascript
// コンテクストを使用すると、全てのコンポーネントを明示的に通すことなしに
// コンポーネントツリーの深くまで値を渡すことができます。
// 現在のテーマ（デフォルトは "light"）の為のコンテクストを作成します。
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // 以下のツリーへ現在のテーマを渡すためにプロバイダを使用します。
    // どんな深さでも、どのようなコンポーネントでも読み取ることができます。
    // このサンプルでは、"dark" を現在の値として渡しています。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 間のコンポーネントはもう明示的にテーマを
// 下に渡す必要はありません。
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 現在のテーマのコンテクストを読むために、contextType に指定します。
  // React は上位の最も近いテーマプロバイダを見つけ、その値を使用します。
  // この例では、現在のテーマは "dark" です。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

## コンテクストを使用するかを判断するときの注意点
コンテクストは主に、なんらかのデータが、ネストレベルの異なる **多く** のコンポーネントからアクセスできる必要があるときに使用される。  
コンテクストはコンポーネントの使用を困難にするという側面があるため、慎重に利用する必要がある。  
多くの階層を軽油していくつかの props を渡すことを避けたいだけであれば、コンポーネントコンポジションはよりシンプルな解決策になる。  

## React.createContext

```javascript
const MyContext = React.createContext(defaultValue);
```
コンテクストオブジェクトを作成する。React がこのコンテクストオブジェクトが登録 (subscribe) されているコンポーネントをレンダーする場合、ツリー内の最も近い上位の一致する `Provider` から現在のコンテクストの値を読み取る。  
  
`defaultValue` 引数は、コンポーネントがツリー内の上位に一致するプロバイダを持っていない場合のみ使用される。`undefined` をプロバイダの値として渡しても、コンシューマコンポーネントが `defaultValue` を使用することはない。

## Contect.Provider

```javascript
<MyContext.Provider value={/* 何らかの値 */}>
```

すべてのコンテクストオブジェクトにはプロバイダ (Provider) コンポーネントが付属しており、これにより、コンシューマオブジェクトはコンテクストの変更を購読 (subscribe) できる。  
  
プロバイダは `value` プロパティを受け取り、これが子孫であるコンシューマコンポーネントに渡される。1 つのプロバイダは多くのコンシューマと接続することができる。プロバイダは値を上書きするために、ツリー内のより深い位置でネストできる。  

プロバイダの子孫のすべてのコンシューマは、プロバイダの `value` プロパティが変更されるために再レンダーされる。  
  
変更は、`Object.is` と同じアルゴリズムを使用し、新しい値と古い値の比較によって判断される。

## Class.contextType

```javascript
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* MyContextの値を使用し、マウント時に副作用を実行します */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* MyContextの値に基づいて何かをレンダーします */
  }
}
MyClass.contextType = MyContext;
```

クラスの `contextType` プロパティには、 `React.createContext()` により作成されたコンテクストオブジェクトを指定することができる。  
これにより、 `this.context` を使って、そのコンテクストタイプの最も近い現在値を利用できる。  

また、 **static** クラスフィールドを使用することで `contextType` を初期化することができる。

```javascript
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 値に基づいて何かをレンダーします */
  }
}
```

## Context.Consumer

```javascript
<MyContext.Consumer>
  {value => /* コンテクストの値に基づいて何かをレンダーします */}
</MyContext.Consumer>
```

コンテクストの変更を購読 (subscribe) する React コンポーネント。関数コンポーネント内でコンテクストを購読することができる。
function as a child が必要。この関数は現在のコンテクストの値を受け取り、 React ノードを返す。この関数に渡される引数 `value` は、ツリー内の上位で一番近いこのコンテクスト用のプロバイダの value プロパティと等しくなる。このコンテクスト用のプロバイダが上位に存在しない場合、引数の　`value` は `createContext()` から渡された `defaultValue` と等しくなる。

## Context.displayName
コンテクストオブジェクトは `displayName` という文字列型のプロパティを有している。例えば以下のコンポーネントは DevTools で MyDisplayName と表示される。

```javascript
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## 複数のコンテクストを使用するときは
コンテクストの再レンダーを高速に保つために、 React は各コンテクストのコンシューマをツリー内の別々のノードにする必要がある。

```javascript
// テーマのコンテクスト、デフォルトのテーマは light
const ThemeContext = React.createContext('light');

// サインイン済みのユーザのコンテクスト
const UserContext = React.createContext({
  name: 'Guest',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // コンテクストの初期値を与える App コンポーネント
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// コンポーネントは複数のコンテクストを使用する可能性があります
function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
```

## 注意事項
コンテクストは参照の同一性を使用していつ再レンダーするかを決定するため、プロバイダの親が再レンダーするときにコンシューマで意図しないレンダーを引き起こす可能性があるいくつかの問題がある。以下のコードでは、新しいオブジェクトが `value` に対してつねに作成されるため、プロバイダが再レンダーするたびにすべてのコンシューマを再レンダーしてしまう。

```javascript
class App extends React.Component {
  render() {
    return (
      <Provider value={{something: 'something'}}>
        <Toolbar />
      </Provider>
    );
  }
}
```

この問題を回避するためには、親の state に値をリフトアップする。

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <Provider value={this.state.value}>
        <Toolbar />
      </Provider>
    );
  }
}
```