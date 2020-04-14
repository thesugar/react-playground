import { NextPage } from 'next';

// 関数に型をつける
const isPositive = (num:number): boolean => {
    return num >= 0;
}

// オブジェクトの型
interface User {
    name: string;
    age: number;
    private: boolean;
}

const showUserInfo = (user: User) => (
    <ul>
        <li>{user.name}</li>
        <li>{user.age}</li>
    </ul>
);

// 1-3. 関数の型
// 😱　これ、arg : number とやることがわからなかった
// 😱　関数の型は `(引数名: 型) => 返り値の型` という形で書く。
// 引数名 arg に意味はない。
type IsPositiveFunc = (arg: number) => boolean
const isPositive2: IsPositiveFunc = num => num >= 0;

// 1-4. 配列の型
// 💡 Array<number> は number[] と書いてもいい。
const sumOfPos = (arr: Array<number>): number => {
    return arr.filter(num => num >= 0).reduce((acc, num) => acc + num);
}

// 2-1. ジェネリクス
// Genericsを使う場合は、 const myFilter = <T>(arr:T[], ...) みたいにはできなそう（？
// predicate の型指定も注目。関数のふるまい自体を型にしている感じ
function myFilter<T> (arr:T[], predicate: (elm:T) => boolean) :T[] {
    const result = [];
    for (const elm of arr) {
        if (predicate(elm)) {
            result.push(elm);
        }
    }
    return result;
}

// 2-2. いくつかの文字列を受け取れる関数
type Speed = 'slow' | 'medium' | 'fast';

function getSpeed(speed: Speed): number {
    switch (speed) {
        case "slow":
            return 10;
        case "medium":
            return 50;
        case "fast":
            return 200;
    }
}

const slowSpeed = getSpeed('slow');
const mediumSpeed = getSpeed('medium');

// 2-3. 省略可能なプロパティ

/* 全然ダメ
declare function addEventListener (arg1:string, arg2:()=>void, arg3: boolean | {
    capture: boolean | undefined,
    once: boolean | undefined,
    passive: boolean | undefined
} | undefined): void;
*/

// 省略可能な変数には ? をつける
interface AddEventListenerOptionsObject {
    capture? : boolean;
    once? : boolean;
    passive? : boolean;
}

declare function addEventListener(
    type: string,
    handler: () => void,
    options? : boolean | AddEventListenerOptionsObject
): void

// ↑　declare の使い方がよくわからない
// 以下のようにしても x is not defined というエラーになる
// うーん
declare let x:number;
// x = 30;

// 2-4. プロパティを一つ増やす関数
// 🔥これもわからなかった
// 🔥 `T & {id: string}` はインターセクション型
// オブジェクトに新しいプロパティを増やしたい場合の典型手法
function giveId<T>(obj: T): T & {id : string} {
    const id = 'あいうえお'
    return {
        ...obj,
        id
    };
}

const obj1: {
    id: string;
    foo: number;
} = giveId({ foo: 123});

// 2-5
// useState

/* 自分の解答。おしい
declare function useState<T> (initialState: T) :[
    T, (T | ((arg:T) => T)) 🔥 => void が必要🔥
]
*/

type UseStateUpdatorArgument<T> = T | ((oldValue: T) => T);

declare function useState<T>(
    initialValue: T
):[T, (updator: UseStateUpdatorArgument<T>) => void];

// 3-1 配列から Map を作る

/*
今回、mapFromArrayは2つの型引数を持つ。
1つ目は T で、これは渡される配列の要素の型（オブジェクト）である。
2つ目は K で、2 つ目の引数の型です。これは使用するプロパティ名を表すリテラル型を期待している。引数 key で指定されるプロパティ名は T が持つプロパティの名前でなければならないため、型引数の制約にそのことを書く。
それが `K extends keyof T`の部分。これは K が keyof T の部分型でなければいけないということを示しており、keyof T は T が持つプロパティ名いずれかの型です。今回の使用例では、Tは {id: number; name: string} なので keyof T は "id" | "name" となる。
Kはその部分型（つまり "id" | "name" に当てはめることができる型）なので、"id" や "name"、"id" | "name" などが可能。問題の使用例では mapFromArray(data, "id") として使用されているため、K には "id" という型が入る。

返り値の Map 型は2つの型引数をとる型です。1 つ目はキーの、2 つ目は値の型です。今回、Map のキーとなるのは各オブジェクト obj の、keyで指定されたプロパティ、すなわち obj[key] の型です。例えば key が "id" の場合は obj["id"] の型となる。
いまオブジェクトの型は T で、キーの名前はリテラル型として K に入っているため、プロパティアクセス型を用いて obj[key] の型は T[K] と表現できる。

Map に入る値はオブジェクトそのものなので、2 つ目の型引数は普通に T です。

なお、今回は返り値の型のアノテーション（Map<T[K], T>）を省略してしまうとTypeScriptが推論できず、Map<any, any>にされてしまう。
このように型アノテーションで指示する方法の他に、new Map() を new Map<T[K], T>() として型を教えてあげる方法もある。
*/

function mapFromArray<T, K extends keyof T> (arr: T[], key: K): Map<T[K], K> {
    const result = new Map();
    for (const obj of arr) {
        result.set(obj[key], obj);
    }
    return result;
}

const data = [
    { id: 1, name: 'sugar' },
    { id: 2, name: 'salt' },
    { id: 20, name: 'kohh' },
    { id: 100, name: 'hannya' }
]

const dataMap = mapFromArray(data, 'id');
console.log(dataMap);

// 3-2
// オブジェクトの型を渡されると、その各プロパティを全部省略可能にするもの
//　💪Mapped Typesの基本的な使い方
// keyof T に属する各プロパティ名 K に対して、型 T[K] を持つ K という省略可能なプロパティが
// 存在するようなオブジェクトの型が MyPartial<T> である。
type MyPartial<T> = {[K in keyof T]?: T[K]};

type T1 = MyPartial<{
    foo: number;
    bar: string;
}>;

const t1:T1 = {
    foo: 20,
    bar: "ja"
};

console.log(t1);

// 3-3 イベント
interface EventPayloads {
    start: {
        user: string;
    };

    stop: {
        user: string;
        after: number;
    };

    end: {};
}

// 引数に渡された文字列に応じて（"start", "stop" , "end"）型の挙動を変えたい場合は
// その文字列をリテラル型として取得するのが定番。　Ev extends keyof E とすることで
// E に定義されていないイベント名を拒否する。
class EventDischarger<E> {
    emit<Ev extends keyof E>(eventname: Ev, payload: E[Ev]) {
        // 省略...
    }
}

// 3-4 reducer

// アクションの型を Action とし、ユニオン型を用いて定義する。
// 代数的データ型を模したパターン。TypeScriptでは頻出。
type Action =
    | {
        type: "increment";
        amount: number;
    }
    | {
        type: "decrement";
        amount: number;
    } |
    {
        type: "reset";
        value: number;
    };

const reducer = (state: number, action: Action) => {
    switch (action.type) {
        case "increment":
            return state + action.amount;
        
        case "decrement":
            return state - action.amount;

        case "reset":
            return action.value;
    }
};

// 3-5
// ↓これでもよさげ。。。？
// type Func<A, R> = (arg: A extends undefined ? void | undefined : A) => R;

type Func<A, R> = undefined extends A ? (arg?: A) => R : (arg: A) => R;
// undefined extends A は undefined 型が A 型の部分型であるという条件を表している
// これは A が undefined を受け入れる型であるかどうかを判定しているということ。
// A が undefined である場合のほか、 A が number | undefined の場合も合致する。

const f1: Func<number, number> = num => num + 10;
const v1: number = f1(10)

const f2: Func<undefined, number> = () => 0;
const v2: number = f2();
const v3: number = f2(undefined);

const f3: Func<number | undefined, number> = num => (num || 0) + 10;
const v4: number = f3(123);
const v5: number = f3();

// error example
//const v6: number = f1();

// 以下は TS 型入門の内容
interface Hoge {
    foo: string;
    bar: number;
}

interface Piyo {
    foo: number;
    baz: boolean;
}

type HogePiyo = Hoge | Piyo;

function someFunc(obj: Hoge | Piyo): void {
    // obj は Hoge | Piyo 型なので、Hoge, Piyo どちらなのか特定したい
    if ('string' === typeof obj.foo) {
        // bar プロパティがあるということは Hoge 型
        console.log('Hoge', obj.foo);
        console.log(typeof obj);
    } else {
        // bar プロパティがないのでここでは obj は Piyo 型
        console.log('Piyo', obj.foo);
        console.log(typeof obj);
    }
}

someFunc({foo: 100, baz: true, bar:30});

function nullCheck(value: string | null): number {
    if (value !== null) {
        return value.length;
    } else {
        return 0;
    }
}

console.log(nullCheck('にゃんにゃか．'));

const Practice: NextPage = () => (
    <div>
        <h1>TypeScript の練習</h1>
            <h2># 1</h2> 
            <h3>
            {isPositive(3) ? 'true' : 'false'}
            </h3>
            <h2># 2</h2>
            <h3>
            {showUserInfo({name: 'John', age: 16, private: false})}
            </h3>
            <h2># 3</h2>
            <h3>
            {isPositive2(5) ? 'true': 'false'}
            </h3>
            <h2># 4</h2>
            <h3>
            {sumOfPos([10, 90, -2, 0, -20])}
            </h3>
            <h2># 5</h2>
            <h3>
            <ul>
            {myFilter([1, 2, 3, 4, 5], num => num % 2 === 0).map((v, i) =>
                 <li key={i}>{i} th element is {v}</li>)}
            {myFilter(['foo', 'hoge', 'bar'], str => str.length >= 4).map((v, i) =>
                <li key={i}>{i} th element is {v}</li>)}
            </ul>
            </h3>
            <h2># 6</h2>
            <h3>
            {slowSpeed} <br />
            {mediumSpeed}
            </h3>
            <h2># 7</h2>
            <h3>
            省略
            </h3>
 
            <h2># 8</h2>
            <h3>
            {obj1.foo}<br />
            {obj1.id}<br />
            </h3>
            <h2># 3-1</h2>
            <h3>配列から Map を作る<br />
            {dataMap.size}
            </h3>
            <h2># 3-5</h2>
            <h3>
                {v1}/{v2}/{v3}/{v4}/{v5}
            </h3>
            <style jsx>
            {`
            div {
                background-color: #fff;
                opacity: 
            }

            h1 {
                color: blue;
                background-color: pink;
                margin: 20px;
                padding: 10px;
                align: center;
                font-family: Tahoma;
            }

            h2 {
                color: green;
                background-color: black;
                opacity: 70%;
                font-family: Palatino;
                margin: 20px;
                padding: 10px;
            }

            h3 {
                font-family: Tahoma;
                margin: 20px;
                paddding: 10px;
            }
            `}
            </style>
    </div>
);

export default Practice;