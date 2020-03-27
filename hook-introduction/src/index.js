import React, { useState, useEffect, useContext, useReducer, useRef } from 'react';
import ReactDOM from 'react-dom';

/*
    useState : ステートフック
    useEffect : 副作用フック
*/

const Example = () => {
    // 新しい state 変数を宣言し、count と名付ける
    // useState がフック。
    // useState は現在の state の値と、
    // それを更新するための関数をペアにして返す。
    // 更新するための関数はクラスコンポーネントの this.setState に似ているが、
    // 新しい state が古いものとマージされないという違いがある。
    const [count, setCount] = useState(0); // useState の引数は state の初期値。オブジェクトである必要はない。

    // useEffect は副作用のためのフックであり、関数コンポーネント内で副作用を実行可能にする
    // クラスコンポーネントにおける componentDidMount, componentDidUpdate, componentWillUnmount と同様の目的で使う。
    useEffect(() => {
        // useEffect を呼ぶことで、DOM への更新を反映したあとに自分の定義する副作用関数を実行するように React へ指示できる
        // デフォルトでは初回のレンダーも含む毎回のレンダー時に副作用関数が呼び出される
        // 副作用は自分を「クリーンアップ」するためのコード（※）を、オプションとして関数を返すことで指定できる
        // return () => {hogeAPI.unsubscribe()} みたいな感じ
        // ※：コンポーネントがアンマウントされるときや再レンダーによって副作用が再実行されるときに行われる
        document.title = `You clicked ${count} times`;
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}

// setState の引数に関数を渡す例
const Counter = ({initialCount}) => {
    const [count, setCount] = useState(initialCount);

    return (
        <>
            Count: {count}
            <button onClick={() => setCount(initialCount)}>Reset</button>
            {/* 関数型の更新の例。この場合だと setCount(count - 1) とかでも同じ挙動になるけど。。 */}
            <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
            <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
        </>
    );
}

// コンテクストを使う
const themes = {
    light : {
        foreground: "#000000",
        background: "#eeeeee"
    },
    dark : {
        foreground: "#ffffff",
        background: "#222222"
    }
};

const ThemeContext = React.createContext(themes.light);

const ToolBar = () => {
    return (
        <div>
            <ThemedButton />
        </div>
    );
}

const ThemedButton = () => {
    const theme = useContext(ThemeContext);

    return (
        <button style={{background: theme.background, color:theme.foreground}}>
            I am styled by theme context!
        </button>
    );
}

// reducer を使う
const initialState = {count: 0};

const reducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1};
        case 'decrement':
            return {count: state.count - 1};
        default:
            throw new Error();
    }
}

const CounterWithReducer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <>
            Count (with reducer): {state.count}
            <button onClick={() => dispatch({type: 'decrement'})}>-</button>
            <button onClick={() => dispatch({type: 'increment'})}>+</button>
        </>
    );
}

// useRef を使う
const TextInputWithFocusButton = ()  => {
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

const App = () => {
    return (
        <React.Fragment>
            <Example />
            <Counter initialCount={0} />
            
            {/* ここでは、クリックしたらテーマを切り替えるのは実装してない */}
            <ThemeContext.Provider value={themes.dark}>
                <ToolBar />
            </ThemeContext.Provider>
            
            <CounterWithReducer reducer={reducer} />

            <br />
            <TextInputWithFocusButton />
        </React.Fragment>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));