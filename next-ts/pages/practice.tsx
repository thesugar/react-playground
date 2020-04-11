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


const Practice: NextPage = () => (
    <div>
        <h1>TypeScript の練習</h1>
        <p>
            <h2># 1</h2> 
            {isPositive(3) ? 'true' : 'false'}
        </p>
        <p>
            <h2># 2</h2>
            {showUserInfo({name: 'John', age: 16, private: false})}
        </p>
        <p>
            <h2># 3</h2>
            {isPositive2(5) ? 'true': 'false'}
        </p>
        <p>
            <h2># 4</h2>
            {sumOfPos([10, 90, -2, 0, -20])}<br />
        </p>

        <p>
            <h2># 5</h2>
            {myFilter([1, 2, 3, 4, 5], num => num % 2 === 0).map((v, i) =>
                 <div>{i} th element is {v}</div>)}
            {myFilter(['foo', 'hoge', 'bar'], str => str.length >= 4).map((v, i) =>
                <div>{i} th element is {v}</div>)}
        </p>

        <p>
            <h2># 6</h2>
            {slowSpeed} <br />
            {mediumSpeed}
        </p>

        <p>
            <h2># 7</h2>
            省略
        </p>

        <p>
            <h2># 8</h2>
            {obj1.foo}<br />
            {obj1.id}<br />
        </p>
    </div>
);

export default Practice;