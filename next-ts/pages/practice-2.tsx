import { NextPage } from 'next';

// 型演習（2回目）
// https://qiita.com/uhyo/items/0e7821ce494024c98da5

// 1-1
function isPositive(num: number): boolean {
    return num >= 0;
}

isPositive(3);
// isPositive('123');
// const numVar: number = isPositive(-5);

// 1-2
function showUserInfo(user: User) {
    console.log(user);
}

interface User {
    name: string;
    age: number;
    private: boolean;
};

const thesugar: User = {
    name: 'thesugar',
    age: 27,
    private: true,
}

showUserInfo(thesugar);

// 1-3 関数の型
const isPosi:IsPositiveFunc = num => num >= 0;
type IsPositiveFunc = (arg: number) => boolean;

console.log(`1-3: ${isPosi(5)}`);
//isPosi('foo');
//const res: number = isPosi(123);

// 1-4 配列の型
function sumOfPos(arr: number[]): number {
    return arr.filter(num => num >= 0).reduce((acc, num) => acc + num, 0);
}

const sum:number = sumOfPos([1, 3, -2, 0]);
console.log(`1-4: ${sum}`);
// sumOfPos(123, 456);
// sumOfPos([123, 'foobar']);

// 2-1
function myFilter<T>(arr: T[], predicate: (arg:T) => boolean): T[] {
    const result = [];
    for (const elm of arr) {
        if (predicate(elm)) {
            result.push(elm);
        }
    }
    return result;
}

const res = myFilter([1, 2, 3, 4, 5], num => num % 2 === 0);
const res2 = myFilter(['foo', 'hoge', 'bar'], str => str.length >= 4);
console.log(`2-1 \n${res}\n${res2}`);
// myFilter([1, 2, 3, 4, 5], str => str.length >= 4);

// 2-2.
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

const slowSpeed = getSpeed("slow");
const mediumSpeed = getSpeed("medium");
const fastSpeed = getSpeed("fast");
//getSpeed("veryfast");
console.log(`2-2: \nslow: ${slowSpeed}, \nmedium: ${mediumSpeed}, \nfast: ${fastSpeed}`)

// 2-3 省略可能なプロパティ
interface Options {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}

declare function addEventListener(
    type:string,
    func: (arg: undefined)=>void, // ここは `() => void` でいいっぽい
    options?: Options | boolean): void;

/*
addEventListener("foobar", () => {});
addEventListener("event", () => {}, true);
addEventListener("event2", () => {}, {});
addEventListener("event3", () => {}, {
    capture: true,
    once: false
});
*/

// エラー例
// addEventListener("foobar", () => {}, "string");
// addEventListener("hoge", () => {}, {
//     capture: true,
//     once: false,
//     excess: true
// });

// 2-4
function giveId<T>(obj: T): T & {id: string} {
    const id = '文字列文字列文字列';
    return {
        ...obj,
        id
    };
}

const obj1: {
    id: string;
    foo: number;
} = giveId({ foo: 123 });

const obj2: {
    id: string;
    num: number;
    hoge: boolean;
} = giveId({
    num: 0,
    hoge: true
});

// エラー例
/*
const obj3: {
    id: string;
    piyo: string;
} = giveId({
    foo: "bar"
});
*/

console.log(`2-4:`);
console.log(obj1);
console.log(obj2);

// 2-5. 👹要復習
/*
type updateFunc<T> = (arg:T | ((arg:T)=>T))=> void;
declare function useState<T>(initialState: T): ([T, updateFunc<T>]); 
*/

// 使用例
// number型のステートを宣言 (numStateはnumber型)
// const [numState, setNumState] = useState(0);
// setNumStateは新しい値で呼び出せる
// setNumState(3);
// setNumStateは古いステートを新しいステートに変換する関数を渡すこともできる
// setNumState(state => state + 10);

// 型引数を明示することも可能
// const [anotherState, setAnotherState] = useState<number | null>(null);
// setAnotherState(100);

// エラー例
//setNumState('foobar');

// ✅ OK！ただし、けっこう悩んだのでリトライすべき
// 模範解答は以下。（実質同じだが、updateFunc ではなくその関数の *引数* の type を定義している）
// ・・・この方が、*引数として新しいステートの値を直接受け取るか、新しいステートを古いステートから計算する
// 関数を受け取るか* の両方が可能であるというのがわかりやすい。
// なお、ステート更新関数は、使用例を見ればわかるように副作用としてステートを更新するので
// 関数の返り値が void になることに注意。

/* 模範解答
type UseStateUpdatorArgument<T> = T | ((oldValue: T)=>T);
declare function useState<T>(
    initialValue: T
): [T, (updator: UseStateUpdatorArgument<T>) => void]
*/

// 3-1　👹Again！

// 自分の解答。ダメだと思う。特に、下の dataMap = のとこで推論されてる型がめちゃくちゃ
// result.set(obj[key], obj) としているのに、なぜ型注釈は <keyof T, T[keyof T]> としているのか
/*
function mapFromArray<T>(arr: T[], key: keyof T): Map<keyof T, T[keyof T]> {
    const result = new Map();
    for (const obj of arr) {
        result.set(obj[key], obj);
    }
    return result;
}
*/


// 模範解答
function mapFromArray<T, K extends keyof T>(arr: T[], key: K): Map<T[K], T> {
    const result = new Map();
    for (const obj of arr) {
      result.set(obj[key], obj);
    }
    return result;
}


const data = [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Mary Sue" },
    { id: 100, name: "Taro Yamada" }
  ];

const dataMap = mapFromArray(data, "id");
  /*
  dataMapは
  Map {
    1 => { id: 1, name: 'John Smith' },
    2 => { id: 2, name: 'Mary Sue' },
    100 => { id: 100, name: 'Taro Yamada' }
  }
  というMapになる
  */

console.log(dataMap);
// エラー例
// mapFromArray(data, "age");

// ========================
// 2020/4/18
// ========================

// 2-5 復習
// Good 👍
type ArgumentForStateUpdate<T> = T | ((prevState: T) => T);
declare function useState<T>(initialState: T): [T, (arg: ArgumentForStateUpdate<T>) => void];

// 使用例
// number型のステートを宣言 (numStateはnumber型)
const [numState, setNumState] = useState(0);
// setNumStateは新しい値で呼び出せる
setNumState(3);
// setNumStateは古いステートを新しいステートに変換する関数を渡すこともできる
setNumState(state => state + 10);

// 型引数を明示することも可能
const [anotherState, setAnotherState] = useState<number | null>(null);
setAnotherState(100);

// 3-1 復習
function myMap<T, K extends keyof T>(arr: T[], key: K): Map<T[K], T> {
    const result = new Map();
    for (const obj of arr) {
        result.set(obj[key], obj);
    }
    return result;
}

/*
💡部分型について
    K extends keyof T について。
    これは K が keyof T の部分型でなければいけないということを示しており、
    keyof T は T が持つプロパティ名いずれかの型である。以下の使用例では T = {id: number; name: string} なので
    keyof T は "id" | "name" となる。そして、K はその部分型（つまり、"id" | "name" に当てはめることができる型）なので
    "id" や "name"、"id" | "name" などが可能。（使用例では K には "id" という型が入る）
*/

const data2 = [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Mary Sue" },
    { id: 100, name: "Taro Yamada" }
  ];
const dataMap2 = myMap(data2, "id");

// 3-2
// OK 👍 Mapped Types の基本的な例。
// key とかじゃなくて K としたほうがいいんじゃない？（命名）
type MyPartial<T> = {
    [key in keyof T]?: T[key];
}

type T1 = MyPartial<{foo: number; bar: string;}>;

// 3-3　👺復習すること。

// 引数に渡された文字列に応じて型の挙動を変えたい場合はその文字列をリテラル型として取得するのが定番
// class EventDischarger<T> でジェネリクスを使ったうえで、
// メソッド（emit）にもジェネリクスを指定することに思い至れれば解ける。

interface EventPayloads {
    start : {
        user: string;
    };
    stop : {
        user : string;
        after: number;
    };
    end: {};
}

class EventDischarger<E> {
    emit<Ev extends keyof E>(eventName: Ev, payload: E[Ev]) {
        // 省略
    }
}
// 使用例
const ed = new EventDischarger<EventPayloads>();
ed.emit("start", {
  user: "user1",
});
ed.emit("stop", {
  user: "user1",
  after: 3
});
ed.emit("end", {});

// エラー例
/*
ed.emit("start", {
  user: "user2",
  after: 0
});
ed.emit("stop", {
  user: "user2"
});
ed.emit("foobar", {
  foo: 123
});
*/

// 3-4
// Good 👍 代数的データ型を模したパターン！
// 模範解答では type Action = | { ... } ... と、
// 最初にも | が付いているけど違いはあるのか？

type Action = {
    type: "increment"
    amount: number
} | {
    type: "decrement"
    amount: number
} | {
    type : "reset"
    value: number
}

const reducer = (state: number, action: Action) => {
    switch (action.type) {
        case "increment":
            return state + action.amount;
        case "decrement":
            return state - action.amount;
        case "reset":
            return action.value;
    }
}

// 使用例
reducer(100, {
    type: 'increment',
    amount: 10,
}) === 110;
reducer(100, {
    type: 'decrement',
    amount: 55,
}) === 45;
reducer(500, {
    type: 'reset',
    value: 0,
}) === 0;

// エラー例
// reducer(0,{
//     type: 'increment',
//     value: 100,
// });

// 3-5
// 👺要復習！！！！！！！💢💢💢
// undefined extends A ? で条件分岐してオプショナルか否か処理を分けるのかなり単純だが
// 思いつかないと悩む。。あと A extends undefined ではなく *undefined extends A* であることに注意
// undefined extends A が成り立つというのは A が undefined や undefined | hoge ということ。
type Func<A, R> = undefined extends A ? (arg?: A) => R : (arg: A) => R;

// 使用例
const f1: Func<number, number> = num => num + 10;
const v1: number = f1(10);

const f2: Func<undefined, number> = () => 0;
const v2: number = f2();
const v3: number = f2(undefined);

const f3: Func<number | undefined, number> = num => (num || 0) + 10;
const v4: number = f3(123);
const v5: number = f3();

// エラー例
// const v6: number = f1();

const Practice: NextPage = () => (
    <>hello</>
);

export default Practice;