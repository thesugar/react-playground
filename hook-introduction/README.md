# Hook 入門
## [フック早わかり](https://ja.reactjs.org/docs/hooks-overview.html)
### フックとは？
関数コンポーネントに state やライフサイクルといった React の機能を "接続する (hook into)" ための関数。

### フックのルール
- フックは関数の **トップレベルのみで** 呼び出す。ループや条件分岐やネストした関数の中でフックを呼び出してはいけない
- フックは React の **関数コンポーネントの内部のみで** 呼び出す
- ただし、自分のカスタムフックの中で呼び出すことは可能

### 独自フック（カスタムフック）
まず、 `useState` と `useEffect` の両方のフックを呼び出してフレンドのオンライン状態をサブスクライブする `FriendStatus` という（この段階ではフックではなく、）コンポーネントがある。
この購読（サブスクリプション）ロジックを別のコンポーネントでも使いたくなったとする。

```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

まず、このロジックを `useFriendStatus` というカスタムフックへと抽出する。これは `friendID` を引数として受け取り、友だちがオンラインかどうか（`isOnline`）を返す。

```javascript
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

これで複数のコンポーネントから同じロジックが使える：

```javascript
function FriendStatus(props) {
    const isOnline = useFriendStatus(props.friend.id);

    if (isOnline === null) {
        return 'loading...';
    }

    return isOnline ? 'Online' : 'Offline';
}
```

```javascript
function FriendListItem(props) {
    const isOnline = useFriendStatus(props.friend.id);

    return (
        <li style={{ color : isOnline ? 'green' : 'black' }}>
            {props.friend.name}
        </li>
    );
}
```

これらのコンポーネントの state は完全に独立している。フックは state を用いたロジックを再利用するためのものであり、state そのものを再利用するものではない。もっと言えば、フックのそれぞれの呼び出しが独立した state を持っているため、まったく同じカスタムフックを 1 つおコンポーネント内で 2 回以上呼び出すことも可能。  
  
カスタムフックは機能というよりは習慣のようなもの。関数の名前が" `use` "から始まって、その関数が他のフックを呼び出していれば、それをカスタムフックと言うことにする、ということ。

### その他のフック（チラ見せ）
#### useContext
React のコンテクストをコンポーネントのネストなしに利用できるようになる：

```javascript
function Example() {
    const locale = useContext(LocaleContext);
    const theme = useContext(ThemeContext);
    // ...
}
```

#### useReducer
複雑なコンポーネントのローカル state を reducer を用いて管理できるようになる。

```javascript
function Todos() {
    const [todos, dispatch] = useReducer(todosReducer);
    // ...
}
```

## [副作用フックの利用法](https://ja.reactjs.org/docs/hooks-effect.html)
### 副作用の例
- データの取得
- 購読（subscription）の設定
- React コンポーネント内の DOM の手動での変更

React コンポーネントにおける副作用には 2 種類ある。クリーンアップコードを必要としない副作用と、必要とする副作用。これらの違いは？

### クリーンアップを必要としない副作用
- ネットワークリクエストの送信
- 手動での DOM 改変
- ログの記録
などがクリーンアップを必要としない副作用の例。なぜかというと、それらのコードが実行されたあとすぐにそのことを忘れても問題ないから。

### クリーンアップを必要とする副作用
- 何らかの外部のデータソースへの購読をセットアップしたいとき
のような場合はメモリリークが発生しないようにクリーンアップが必要。

### 副作用のスキップによるパフォーマンス改善
再レンダー間で特定の値が変わっていない場合には副作用の適用をスキップするよう、React に伝えることができる。そのためには、 `useEffect` のオプションの第 2 引数として配列を渡す。

```javascript
useEffect(() => {
    document.title = `You clicked ${count} times`;
}, [count]) // only re-run the effect if count changes
```

たとえば上記の例のように、第 2 引数として `[count]` を渡すと、あるレンダーと次のレンダー間で count の値が変化した場合にのみ副作用を再適用する。配列内に複数の要素がある場合、React は配列内の要素のうちひとつでも変わっている場合に副作用を再実行する。クリーンアップフェーズがある副作用（クリーンアップ用の関数を return している場合）でも同様に動作する。

#### 💡補足
この最適化を利用する場合、 **時間の経過とともに変化し副作用によって利用される、コンポーネントスコープの値（props や state など）** がすべて配列に含まれていることを確認すること。そうしないと、以前のレンダー時の古い値を参照してしまうことになる。  
もしも副作用とそのクリーンアップを 1 度だけ（マウント時とアンマウント時にのみ）実行したいという場合、空の配列（`[]`）を第 2 引数として渡すことができる。こうすることで、副作用は props や state の値のいずれにも依存していないため再実行する必要が一切ない、ということを React に伝えることができる。

## [フックのルール](https://ja.reactjs.org/docs/hooks-rules.html)
### Reactはフックが呼ばれる順番に依存している
ひとつのコンポーネント内で複数の state や副作用を使うことができるが、このとき、フックが呼ばれる順番でもって、どの `useState` の呼び出しがどの state に対応するのかを判断している。

```javascript
// ------------
// First render
// ------------
useState('Mary')           // 1. Initialize the name state variable with 'Mary'
useEffect(persistForm)     // 2. Add an effect for persisting the form
useState('Poppins')        // 3. Initialize the surname state variable with 'Poppins'
useEffect(updateTitle)     // 4. Add an effect for updating the title

// -------------
// Second render
// -------------
useState('Mary')           // 1. Read the name state variable (argument is ignored)
useEffect(persistForm)     // 2. Replace the effect for persisting the form
useState('Poppins')        // 3. Read the surname state variable (argument is ignored)
useEffect(updateTitle)     // 4. Replace the effect for updating the title

// ...
```

フックへの呼び出しの順番がレンダー間で変わらないかぎり、React はそれらのフックにローカル state を割り当てることができる。しかし、フックの呼び出しを条件分岐内で行ったらどうなるか？（たとえば `persistForm` 副作用の内部で）

```javascript
// 🔴 We're breaking the first rule by using a Hook in a condition
if (name !== '') {
useEffect(function persistForm() {
    localStorage.setItem('formData', name);
});
}
```

`name !== ''` という条件は初回のレンダー時は `true` なのでフックは実行されるが、次回のレンダー時にはユーザがフォームをクリアしているかもしれず、その場合にこの条件は `false` になる。するとレンダー途中でこのフックがスキップされ、フックの呼ばれる順番が変わってしまう。

```javascript
useState('Mary')           // 1. Read the name state variable (argument is ignored)
// useEffect(persistForm)  // 🔴 This Hook was skipped!
useState('Poppins')        // 🔴 2 (but was 3). Fail to read the surname state variable
useEffect(updateTitle)     // 🔴 3 (but was 4). Fail to replace the effect
```

これが、**フックを呼び出すのが関数のトップレベルのみでなければならない理由** である。条件付きで副作用を走らせたい場合は、その条件をフックの **内部** に入れることができる。

```javascript
useEffect(function persistForm() {
    // 👍 We're not breaking the first rule anymore
    if (name !== '') {
        localStorage.setItem('formData', name);
    }
});
```

## [フック API リファレンス](https://ja.reactjs.org/docs/hooks-reference.html)
### useContext

`useContext(MyContext)` はクラスにおける `static contextType = MyContext`、あるいは `<MyContext.Consumer>` と同等のものであると考えることができる。  
`useContext(MyContext)` は現在のコンテクストの値を **読み取り**、その変化を購読することしかできない。コンテクストの値を設定するために、今後もツリーの上の階層で `<MyContext.Provider>` が必要。

```javascript
const value = useContext(MyContext);
```

コンテクストオブジェクト（`React.createContext(defaultValue)` からの戻り値）を受け取り、そのコンテクストの現在値を返す。コンテクストの現在値は、ツリー内でこのフックを呼んだコンポーネントの直近にある `<MyContext.Provider>` の `value` の値によって決定される。  
  
直近の `<MyContext.Provider>` が更新された場合、このフックはその `MyContext` プロバイダに渡された最新の `value` の値を使って再レンダーを発生させる。  

`useContext` に渡す引数は **コンテクストオブジェクト自体** 。
- 正しい: `useContext(MyContext)`
- 間違い: `useContext(MyContext.Provider)`
- 間違い: `useContext(MyContext.Consumer)`

## useReducer

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

`useState` の代替品である。`(state, action) => newState` **という型** の reducer を受け取り、現在の state を `dispatch` メソッドとペアにして返す。  
`useReducer` が `useState` より好ましいのは、複数の値にまたがる複雑な state ロジックがある場合や、前の state に基づいて次の state を決める必要がある場合。また、 `useReducer` を使えば、コールバックの代わりに dispatch を下位コンポーネントに渡せるようになるため、複数階層にまたがって更新を発生させるようなコンポーネントではパフォーマンスの最適化にもなる。

### 遅延初期化（lazy initialization）
初期 state の作成を遅延させることもできる。そのためには `init` 関数を第 3 引数として渡す。初期 state が `init(initialArg)` に設定される。  
これにより初期 state の計算を reducer の外部に抽出することができる。これはアクションに応じて state をリセットしたい場合にも便利。

```javascript
// 初期化用の `init` 関数を定義
function init(initialCount) {
    return {count: initialCount};
}

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1};
        case 'decrement':
            return {count: state.count - 1 };
        case 'reset':
            return init(action.payload);
        default:
            throw new Error();
    }
}

function Counter({initialCount}) {
    const [state, dispatch] = useReducer(reducer, initialCount, init);

    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch({type: 'reset', payload: initialCount})} >
            Reset
            </button>
            <button onClick={() => dispatch({type: 'decrement'})}>-</button>
            <button onClick={() => dispatch({type: 'increment'})}>+</button>
        </>
    )
}

```

### useMemo

```javascript
const memoizedValue = useMemo(() => someFunc(a, b), [a, b]);
```

メモ化された値を返す。作成用の関数とそれが依存する値の配列を渡す。`useMemo` は依存配列の要素のひとつが変化した場合にのみメモ化された値を再計算する。この最適化によりレンダーごとに高価な計算が実行されるのを避けることができる。  

`useMemo` に渡した関数はレンダー中に実行される。レンダー中に通常やらないことをこの関数内で行わないようにする。たとえば副作用は `useMemo` でなく `useEffect` の仕事である。

### useCallback

```javascript
const memoizedCallback = useCallback(
    () => {
        doSomething(a, b);
    }, [a, b],
);
```

メモ化されたコールバックを返す。インラインのコールバックとそれが依存している値の配列を渡すと、`useCallback` はそのコールバックをメモ化したものを返し、その関数は依存配列の要素のひとつが変化した場合にのみ変化する。  

`useCallback(func, deps)` は `useMemo(() => func, deps)` と等価。

### useRef

```javascript
const refContainer = useRef(initialValue);
```

`useRef` は、 `.current` プロパティが、渡された引数（`initialValue`）に初期化されているミュータブルな ref オブジェクトを返す。  

よくあるユースケースは、子コンポーネントに命令型でアクセスするというもの。：

```javascript
function TextInputWithFocusButton() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
        inputEl.current.focus();
    };

    return (
        <>
            <input ref={inputEl} type="text" />
            <button onClick={onButtonClick}>Focus the input</button>
        </>
    );
}
```

本質的に `useRef` とは、書き換え可能な値を `.current` プロパティ内に保持することができる「箱」のようなもの。  
ref は DOM にアクセスする手段という認識は間違っていない。`<div ref={myRef} />` のようにして React に ref オブジェクトを渡した場合、React は DOM ノードに変更があるたびに `.current` プロパティをその DOM ノードに設定する。  
  
しかし、`useRef()` は `ref` 属性で使うだけでなく、より便利に使える。あらゆる書き換え可能な値を保持しておくのに便利。  ref はクラスにおけるインスタンス変数と似たようなものだと考えることができる。遅延化処理をしたい場合を覗き、レンダーの最中に ref を書き換えることはせず、イベントハンドラや副作用内でだけ書き換えるようにするべき。
  
`useRef` は中身が変更になってもそのことを通知し **ない** 。`.current` プロパティを書き換えても再レンダーは発生しない。  
c.f.) コールバック ref  
`useRef` ではなく、`useCallback` の返り値（メモ化されたコールバック）を someRef みたいな名前の変数に入れて Ref オブジェクトっぽく扱い、それを DOM の ref 属性に指定してやる。

### useImperativeHandle

```javascript
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` は `ref` が使われたときに親コンポーネントに渡されるインスタンス値をカスタマイズするのに使う。`forwardRef` と組み合わせて使う。

### useLayoutEffect
この関数のシグネチャは `useEffect` と同一だが、DOM の変更があったあとで同期的に副作用が呼び出される。これは DOM からレイアウトを読み出して同期的に再描画を行う場合に使う。`useLayoutEffect` の内部でスケジュールされた更新はブラウザによって描画される前のタイミングで同期的に処理される。  
  
可能な場合は、画面の更新がブロックするのを避けるため、標準の `useEffect` を優先して使い、それで問題が発生する場合のみ `useLayoutEffect` を試すとよい。  
  
サーバサイドレンダリングを使用している場合は、`useLayoutEffect` と `useEffect` の **どちらも** JavaScript がダウンロードされるまでは実行できない。

### useDebugValue

```javascript
useDebugValue(value)
```

React DevTools でカスタムフックのラベルを表示することができる。
第 2 引数として、値のフォーマット用関数を渡すことで、フォーマット済みの表示用の値を返すようになる。例えば `Date` 型の値を返すカスタムフックでは、以下のようなフォーマッタ関数を渡すことで、不必要に `toDateString` を呼び出すのを避けることができる。

```javascript
// in a custom hook
// some calculation...
useDebugValue(resultDate, date => date.toDateString());
```

### 📝Note
副作用関数内 で使われる関数は副作用関数内で宣言するのがよい。副作用関数の外側にある関数内でどの props や state が使われているか覚えておくのは大変で、依存配列の指定のときにバグのもとになるから。
```javascript
// 🙅‍♀️
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 This is not safe (it calls `doSomething` which uses `someProp`)
}

// 🙆‍♂️
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (our effect only uses `someProp`)
}
```