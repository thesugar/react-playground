# TypeScript の型入門
Source: [TypeScriptの型入門](https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a)

## プリミティブ型
`string`, `number`, `boolean`, `symbol`, `bigint`, `null`, `undefined` がある。
コンパイラオプションで `--strictNullChecks` をオンにしていない場合は、`null` と `undefined` は他の型の値として扱うことができる。つまり、 `--strictNullChecks` をオンにしないと undefined や null が紛れ込む可能性があり危険。オンにすることを推奨。

## リテラル型
プリミティブ型を細分化したものとしてリテラル型がある。リテラル型には文字列のリテラル型、数値のリテラル型、真偽値のリテラル型がある。それぞれ、`'foo''` や `3`、`true` のような名前の型。  

文字列のリテラル型は `string` の *部分型* であり、文字列のリテラル型を持つ値は string 型として扱うことができる。

```ts
const a: 'foo' = 'foo';
const b: string = a;
```

## オブジェクト型
TypeScript でオブジェクトを表現するための型👉`{ }` の中にプロパティ名とその型を列挙するもの。  
たとえば `{foo: string; bar: number}` などといったように型を定義できる。  
また、以下の例の interface は TypeScript 独自の構文であり、オブジェクト型に名前をつけることができる。

```ts
interface MyObj {
    foo: string;
    bar: number;
}

const a: MyObj = {
    foo: 'foo',
    bar: 3,
};
```

**TypeScript の構造的部分型（structural subtyping）について**

```ts
interface MyObj {
    foo: string;
    bar: number;
}

interface MyObj2 {
    foo: string;
}

const a: MyObj = {foo: 'hoge', bar: 3};
// ✅ OK
const b: MyObj2 = a;
```

`MyObj2` は foo プロパティのみを持つオブジェクトの型だが、 `MyObj2` 型変数に `MyObj` 型の値 `a` を代入することができる。 `MyObj` 型の値は `string` 型のプロパティ foo を持っているため `MyObj2` 型の値の要件を満たしていると考えられるからである。このような場合、 `MyObj` は `MyObj2` の *部分型* であるという。  
  

ただし、オブジェクトリテラルに対しては特殊な処理がある。

```ts
interface MyObj {
    foo: string;
    bar: number;
}

interface MyObj2 {
    foo: string;
}

// 🛑 上の例と実質同じなのに、オブジェクトリテラルの場合は
// 余計なプロパティを持つオブジェクトは弾かれてしまう。
const b: MyObj2 = {foo: 'hoge', bar: 3};
```

## 配列型
`[]` を使う。`number[]` など。ジェネリクスを使って `Array<number>` のように書くことも可能。

## 関数型
たとえば `(foo: string, bar:number) => boolean` のように表現される。型に引数の名前が書いてあるが、これは型の一致判定には関係ない。  

function 宣言などによって作られた関数にもこのような型がつく。

```ts
const f: (foo: string) => number = func;

function func(arg: string): number {
    return Number(arg);
}
```

### 関数の部分型関係
関数型に対しては、普通の部分型関係がある。

```ts
interface MyObj {
    foo: string;
    bar: number;
}

interface MyObj2 {
    foo: string;
}

const a: (obj: MyObj2)=>void = ()=>{};
const b: (obj: MyObj)=>void = a;
```

上記の例のように、 `(obj: MyObj2)=>void` 型の値を `(obj: MyObj)=>void` 型の値として扱うことができる。これは、 `MyObj` は `MyObj2` の部分型なので、`MyObj2` を受け取って処理できる関数は `MyObj` を受け取っても当然処理できるだろうということ。  
（`MyObj` と `MyObj2` を比べると、`MyObj` のほうがプロパティが追加されているので、MyObj ⊂ MyObj2 という包含関係になる。よって MyObj が MyObj2 の部分型である、と直観的にわかる）  
  
引数の数に関しても部分型関係が発生する。

```ts
const f1: (foo: string)=>void = ()=>{};
const f2: (foo: string, bar: number)=>void = f1;
```

このように、`(foo: string)=>void` 型の値を `(foo:string, bar:number)=>void` 型で定義された関数に代入することができる。これは、関数の側で余計な引数を無視すればよいということ。  

（A が B の部分型ということは、A ⊂ B ということで、「A には（B と比較して）余計なものが生えてる」と見ることができる。A に余計なものが生えてるということは、それを無視すれば B を扱う型で定義されたものに代入することができるということ）

## 可変長引数
`(foo, ...bar)` のように、最後の引数を `...bar` のようにすると、それ以降の引数が全部入った *配列* が `bar` に渡される。（これは JavaScript の機能）

TypeScript でも可変長引数の関数を宣言できる。その場合、可変長引数の部分の型は配列にする。

```ts
const func = (foo: string, ...bar: number[]) => bar;

func('foo');
func('bar', 1, 2, 3);
// 🛑 Error
func('hoge', 'nyan', 1, 2)
```

## void 型
この型は主に関数の返り値の型として使われ、「何も返さない」ことを表す。void 型とは undefined のみを値にとる型になる。void 型の変数に `undefined` を入れることはできるが、ただし、 undefined 型の変数に void 型の値を入れることはできない。

## any 型
any 型の値はどんな型とも相互変換可能であり、実質 TypeScript の型システムを無視することに相当する。

```ts
const a: any = 3;
// any 型の値はどんな型の値としても利用可能なので、string 型の変数 b に代入することもできる。
const b: string = a;
```

## クラスの型
TypeScript では、クラスを定義すると同時に同名の型も定義される。以下の例では、クラス `Foo` を定義したことで、`Foo` という型も同時に定義されることになる。

```ts
class Foo {
    method(): void {
        console.log('Hello World');
    }
}

const obj: Foo = new Foo();
```

注意すべきは、TypeScript はあくまで構造的片型付けを採用しているということ。JavaScript の実行時にはあるオブジェクトがあるクラスのインスタンスか否かということはプロトタイプチェーンによって特徴づけられるが、TypeScript の型の世界においてはそうではない。  

ここで定義された型 `Foo` は次のようなオブジェクト型で代替可能。

```ts
interface MyFoo {
    method: () => void;
}

class Foo {
    method(): void {
        console.log('Hello World');
    }
}

const obj: MyFoo = new Foo();
const obj2: Foo = obj;
```

ここで定義した `MyFoo` という型は、method という関数型のプロパティ（すなわちメソッド）を持つオブジェクトの型。それゆえ、`Foo` 型は `MyFoo` 型と同じである。

## ジェネリクス
型名を `Foo<S, T>` のようにすることで、型の定義の中でそれらの名前（ここで言うS や T）を型変数として使うことができる。

```ts
interface Foo<S, T> {
    foo: S;
    bar: T;
}

const obj: Foo<number, string> = {
    foo: 3,
    bar: 'hi',
};
```

クラス定義や関数定義でも型変数を導入できる。

```ts
class Foo<T> {
    constructor(obj: T) {
        // ...
    }
}

function func<T>(obj: T): void {
    // ...
}
```

上記の `func` の型は `<T>(obj: T) => void` という型になる。関数の場合、呼び出すまでどのような型引数で呼ばれるかわからないため、型にも型変数が残った状態になる。

## タプル型
JavaScript にはタプルという概念はないため、 TypeScript では配列をタプルの代わりとして用いることになっている。タプル型は `[string, number]` のように書く。これは実際のところ、長さが 2 の配列で、 0 番目に文字列が、1 番目に数値が入ったようなものを表している。

```ts
const foo: [string, number] = ['foo', 5];

const str: string = foo[0];

function makePair(x: string, y: number): [string, number] {
    return [x, y];
}
```

TypeScript でタプルと呼ばれるものはあくまで配列なので、配列のメソッドで操作できてしまう。以下のコードはエラー無くコンパイルできるが、実際に実行すると変数 `num` には文字列が入ってしまう。

```ts
const tuple: [string, number] = ['foo', 3];

tuple.pop();
tuple.push('hey');

const num: number = tuple[1];
```

0 要素のタプル型も作ることができる（`const unit: [] = []`）。  
また、TypeScript のタプル型は、可変長のタプル型（！？）の宣言が可能。これは実質的には最初のいくつかの要素の型が特別扱いされたような配列の型になる。

```ts
type NumAndStrings = [number, ...string[]];
/*
この例では、NumAndStrings 型は、最初の要素が数値で、残りは文字列であるような配列の型となる。
*/

const a1: NumAndStrings = [3, 'foo', 'bar'];
const a2: NumAndStrings = [5];

// 🛑 error!
const a3: NumAndStrings = ['foo', 'bar'];
```
  
オプショナルな要素を持つタプル型もある。たとえば `[string, number?]` のようなもので、この場合は、2 番目の要素はあってもなくてもいいということになる。ある場合は `number` 型でないといけない。  
ちなみに、オプショナルな要素はオプショナルでない要素より後に来ないといけない。`[string?, number]` のような型はダメ。

### タプル型と可変長引数
タプル型を関数の可変長引数の型を表すのに使える。

```ts
type Args = [string, number, boolean];

const func = (...args: Args) => args[1];
const v = func('foo', 3, true);
// v の型は number
```

可変長引数の型として配列を用いることができたが、配列の代わりにタプル型を用いることもできる。上の例では、可変長引数 `args` の型は `Args` すなわち `[string, number, boolean]` である。このように、タプル型を型の列として用いることで、複数の引数の型をまとめて指定することができる。  

上の例では可変長ではなくなってしまっているが、可変長タプルを用いると引数の可変長性も保たれる。

```ts
type Args = [string, ...number[]];

const func = (f: string, ...args: Args) => args[0];

const v1 = func('foo', 'bar');
const v2 = func('foo', 'bar', 1, 2, 3);
```

### 関数呼び出しの spread とタプル型
`...` という記法は関数呼び出しのときにも使うことができる。ここでもタプル型は使うことができる。適切なタプル型の配列を `...` で展開することで、型の合った関数を呼び出すことができる。

```ts
const func = (str: string, num: number, b:boolean) => args[0] + args[1];

const args: [string, number, boolean] = ['foo', 3, false]

func(...args); // この結果は args[0]+args[1] (='foo' + 3)で 'foo3' (文字列) になる
```

### タプル型と可変長引数とジェネリクス
以上の知識とジェネリクスを組み合わせる。タプル型をとるような型変数を用いることで、関数の引数列をジェネリクスで扱うことができる。  

例として、関数の最初の引数があらかじめ決まっているような新しい関数を作る関数 `bind` を書いてみる。

```ts
function bind<T, U extends any[], R>(
    func: (arg1: T, ...rest: U) => R,
    value: T,
): ((...args: U) => R) {
    return (...args: U) => func(value, ...args);
}

const add = (x: number, y:number) => x + y;

const add1 = bind(add, 1);

console.log(add1(5)) // 6
```
まず、関数 `bind` は 2 つの引数 `func` と `value` を受け取り、戻り値としては関数 `(...args: U) => func(value, ...args)` を返す。この関数は、受け取った引数列 `args` に加えて、最初の引数として `value` を `func` に渡して呼び出した返り値をそのまま返す関数。  

ここで、`U extends any[]` の部分は見慣れないが、これは、型引数 `U` は `any[]` の部分型でなければいけないという意味。`string[]` などの配列型に加えてタプル型も全部 `any[]` の部分型である。この制限により、 `...rest: U` のように可変長引数の型として `U` を使うことができる。

加えて、 `bind(add, 1)` の呼び出しでは型変数はそれぞれ `T = number`、`U = [number]`、`R = number` と推論される。返り値の型は `(...args: U) => R` すなわち `[arg: number] => number` となる。`U` がタプル型に推論されるのが注目に値するポイント。これにより、`add` の引数の情報が失われずに `add1` に引き継がれている。

## union 型（合併型）

```ts
let value: string | number = 'foo';

value = 100; // ✅OK
value = 'bar'; // ✅OK
```

オブジェクトの型でも union 型を作ることができる。

```ts
interface Hoge {
    foo: string;
    bar: number;
}

interface Piyo {
    foo: number;
    baz: boolean;
}

type HogePiyo = Hoge | Piyo;

// ✋Hoge 型か Piyo 型に一致するようにしなければならない
// たとえば foo: string ならもうひとつのプロパティは bar: number に限定されるし
// foo: number ならもうひとつのプロパティは baz: boolean に限定される
// foo が Hoge, Piyo 両方にあるからといってもう一つのプロパティを無視して string にも number にもなれるということはない

const obj: HogePiyo = {
    foo: 'hello',
    bar: 0,
};

const obj2: HogePiyo = {
    foo: 10,
    baz: false,
};
```

### union 型の絞り込み
union 型の値というのはそのままでは使いにくい。例えば、上で定義した `HogePiyo` 型のオブジェクトは `bar` プロパティを参照することができない。なぜなら、`HogePiyo` 型の値は `Hoge` かもしれないし `Piyo` かもしれず、 `Piyo` には `bar` プロパティがないから。（`foo` プロパティは両方にあるので参照可能）  

普通は、 `Hoge | Piyo` のような型の値が与えられる場合、まずその値が実際にはどちらなのか実行時に判定する必要がある。  

以下のように in 演算子を使うことで型の絞り込みもできるが・・・

```ts
// Hoge と Piyo の定義は上の例と同じ

function someFunc(obj: Hoge | Piyo): void {
    // obj は Hoge | Piyo 型なので、Hoge, Piyo どちらなのか特定したい
    if ('bar' in obj) {
        // bar プロパティがあるということは Hoge 型
        console.log('Hoge', obj.bar);
    } else {
        // bar プロパティがないのでここでは obj は Piyo 型
        console.log('Piyo', obj.baz);
    }
}
```

❗️ただし、この例では、次のようなコードを書くこともできるので注意が必要。

```ts
// 😈
const obj: Hoge | Piyo = {
    foo: 123,
    bar: 'bar',
    baz: true
}

someFunc(obj);
```

obj に代入されているのは `Piyo` 型のオブジェクトに余計な bar プロパティがついたもの。ということはこれは `Piyo` 型のオブジェクトとみなせ、`Hoge | Piyo` 型の変数にも代入可能だが、`someFunc()` に渡すと `'bar' in obj` が成立して obj が `Hoge` 型とみなされてしまう。`obj.bar` は（obj が Hoge 型の場合 bar は number となるが）ここでは string 型なのでバグのもとになる。

### typeof を用いた絞り込み

単純に以下のようになる。オブジェクトが絡まなければ安全。上記の例では `typeof obj.foo` が文字列か数値かで判別することもできる。ちなみに、`typeof obj` は `Hoge` や `Piyo` ではなく `object` が返ってきてしまう。

```ts
function func(value: string | number): number {
    if ('string' === typeof value) {
        return value.length;
    } else {
        return value;
    }
}
```

### null チェック
もうひとつ、union 型がよく使われる場面は「nullable な値を扱いたい場合」である。
例えば、文字列の値があるかもしれないし null かもしれないという状況は `string | null` という型で表せる。`string | null` 型の値は null かもしれないので、文字列として扱ったりプロパティを参照したりすることができない。これに対し、null でなければ処理したいという場面はよくある。JavaScript における典型的な方法は `value !== null` のように if 文で null チェックを行う方法だが、TypeScript ではこれを適切に解釈して型を絞り込むことができる。

```ts
function func(value: string | null): number {
    if (value !== null) {
        // ここでは string 型に絞り込まれている
        return value.length;
    } else {
        return 0;
    }
}
```

`&&` や `||` の短絡実行も TypeScript では適切に型検査が働く。上の func は次のようにも書くことができる。

```ts
function func(value: string | null): number {
    return value !== null && value.length || 0;
}
```

### 代数的データ型（Algebraic Data Type）っぽいパターン
*オブジェクトに対しても* いい感じに union 型を使いたいとき。リテラル型と union 型を組み合わせることでいわゆる代数的データ型（タグ付き union）を再現する方法がある。

```ts
interface some<T> {
    type: 'Some';
    value: T;
}

interface None {
    type: 'None';
}

type Option<T> = Some<T> | None;

function map<T, U>(obj: Option<T>, f: (obj: T)=> U): Option<U> {
    if (obj.type === 'Some') {
        // ここで obj は Some<T> 型に特定される
        return {
            type: 'Some',
            value: f(obj.value),
        };
    } else {
        return {
            type: 'None',
        };
    }
}
```

これは値があるかもしれないし無いかもしれないことを表すいわゆる option 型を TypeScript で表現した例。ポイントになるのは `Some<T>` と `None` に共通のプロパティ `type`。type プロパティには、このオブジェクトの種類（Some/None）を表す文字列が入っている。ここで type プロパティの型としてリテラル型を使うことによって、`Option<T>` 型の値 `obj` に対して、`obj.type` を参照することで型を特定（Some/None）できる状況を作っている。（この方法は TypeScript で推奨されている方法らしい）  

次のように switch 文でも同じことができる。

```ts
function map<T, U>(obj: T, f: (obj: T)=> U): Option<U> {
    switch (obj.type) {
        case 'Some':
            return {
                type: 'Some',
                value: f(obj.value);
            };
        case 'None':
            return {
                type: 'None';
            };
    }
}
```

この map 関数の場合はこちらのほうが拡張に強くて安全。（`Option<T>` に第 3 の種類の値を追加した場合、 if 文だとそれも else で処理されてしまうが switch の場合はコンパイルエラーを出してくれて、関数を変更する必要があることにすぐ気付けるため）  

### union 型オブジェクトのプロパティ
オブジェクト同士の union 型を作った場合、そのプロパティアクセスの挙動は概ね期待通りの結果となる。少し前に出てきた `HogePiyo` 型の例でいえば・・・

```ts
interface Hoge {
    foo: string;
    bar: number;
}

interface Piyo {
    foo: number;
    baz: boolean;
}

type HogePiyo = Hoge | Piyo;

function getFoo(obj: HogePiyo): string | number {
    return obj.foo;
}
```

`Hoge | Piyo` 型の変数 `obj` の `foo` プロパティはアクセス可能であり、その型は `string | number` 型になる。一方、`bar` や `baz` は（それぞれ `Hoge` と `Piyo` にしか存在せず）`Hoge | Piyo` には存在しない可能性があるためアクセスできない。

## never 型
never 型は「属する値が存在しない型」であり、部分型関係の一番下にある（任意の型の部分型である）型。どんな値も never 型の変数に入れることはできない。一方で、どんな型にも never 型の値を入れることができる。

```ts
const n: never = 0; // 🛑 Error!

// ✅ string 型の foo に never 型の値を入れることができる
// ただし、「never 型の値」を作る方法がないので、declare で宣言だけする
declare const nev: never;
const foo: string = nev;
```

never 型にあてはまる値は存在しないため、never 型の値を実際に作ることはできない。never 型が使われるシチュエーションとしては、たとえば *switch 文において、すべてのケースを調べ尽くしたあとの `default: ` ブロック内* や、以下のような関数の返り値。

```ts
function func(): never {
    throw new Error('original error');
}

const result: never = func();
```

関数の返り値の型が `never` 型となるのは、関数が値を返す可能性が無いとき。これは返り値が無いことを表す `void` 型とは異なり、そもそも *関数が正常に終了して値が返ってくるということがありえない場合* を指表す。上の例では、関数 func は必ず throw する。つまり関数の実行は必ず中断され、値を返すことなく関数を脱出するのである。  
ちなみに、上の例で返り値に型注釈で `never` と書かなければ `void` に推論される。

## intersection 型（交差型）
union 型とある意味で対になるものとして **intersection 型** がある。2 つの型 T, U に対して `T & U` と書くと、`T` でもあり `U` でもあるような型を表す。

```ts
interface Hoge {
    foo: string;
    bar: number;
}

// 上で出てきた例とは foo の型を変えてある
// （上の例では Piyo.foo: number）
interface Piyo {
    foo: string;
    baz: boolean;
}

// Hoge & Piyo 型のオブジェクトは foo, bar, baz 3つのプロパティを持つ必要がある
const obj: Hoge & Piyo = {
    foo: 'fooooo',
    bar: 3,
    baz: true,
};
```

union 型と intersection 型を組み合わせるとおもしろい。

```ts
interface Hoge {
    type: 'hoge';
    foo: string;
}

interface Piyo {
    type: 'piyo';
    bar: number;
}

interface Fuga {
    baz: boolean;
}

type Obj = (Hoge | Piyo) & Fuga;

function func(obj: Obj) {
    // obj は Fuga なので baz を参照可能
    console.log(obj.baz);
    if (obj.type === 'hoge') {
        // ここでは obj は Hoge & Fuga
        console.log(obj.foo);
    } else {
        // ここでは obj は Piyo & Fuga
        console.log(obj.bar);
    }
}
```

`Obj` 型は `(Hoge | Piyo) & Fuga` 型だが、これは `(Hoge & Fuga) | (Piyo & Fuga)` 型と同一視される。

### intersection 型と union 型の関係
関数型を含む union 型というものを考えてみよう。まずは以下の例。

```ts
type StrFunc = (arg: string) => string;
type NumFunc = (arg: number) => string;

declare const obj: StrFunc | NumFunc;

// 🛑エラー
obj(123);
```

この例では、`StrFunc | NumFunc` 型の変数 `obj` を作っている。`StrFunc` 型は文字列を受け取って文字列を返す関数の型で、`NumFunc` 型は数値を受け取って文字列を返す関数の型。  

`obj` を呼ぶところでエラーが発生している。`obj` は `StrFunc` 型かもしれないので引数は文字列でなければならないが、一方で、`NumFunc` 型かもしれないので引数は数値でなければならず、つまり、引数が文字列であることと数値であることが同時に要求されているから。文字列であり尚且つ数値であるような値は存在しないため、この関数を呼ぶことは実質不可能。  

このように、関数同士の union を考えるとき、結果の関数の引数は **もともとの引数同士の intersection 型を持つ必要** がある。これは、関数の引数の型が **反変** （contravariant）の位置にあることが影響している。  

引数の型が intersection 型を持つ必要があるということで、では intersection 型の引数が存在できるような例を考えてみる。

```ts
interface Hoge {
    foo: string;
    bar: number;
}
interface Piyo {
    foo: string;
    baz: boolean;
}

type HogeFunc = (arg: Hoge) => number;
type PiyoFunc = (arg: Piyo) => boolean;

declare const func: HogeFunc | PiyoFunc;

const res = func({
    foo: 'nyan',
    bar: 123,
    baz: false,
});
```

この例では `func` は `HogeFunc | PiyoFunc` 型。`HogeFunc` の引数は `Hoge` で `PiyoFunc` の引数は `Piyo` なので、`func` の引数の型は `Hoge & Piyo` 型である必要がある。よって、`Hoge & Piyo` 型を持つオブジェクトを作ることで `func` を呼ぶことができる。  

また、この例では `res` の型は `number | boolean` 型になる（`func` の型が `HogeFunc` の場合は返り値が `number` に、 `PiyoFunc` の場合は返り値の型が `boolean` になるため）。  

この辺りの処理は扱いが難しいためか、関数のオーバーロードがある場合やジェネリクスが関わる場合などに引数の型が推論できなかったりするなど、多少制限があるようだ。

## オブジェクト型再訪
オブジェクト型は「プロパティ名: 型;」という定義の集まりだったが、実はプロパティに対して修飾子を付けることができる。修飾子は `?` と `readonly` の 2 種類ある。

### `?`: 省略可能なプロパティ
`?` を付けて宣言したプロパティは省略可能になる。

```ts
interface MyObj {
    foo: string;
    bar?: number;
}

const obj: MyObj = {
    foo: 'nyan';
}
```
上記の例では bar が省略可能なプロパティになる。  
実際の JavaScript では存在しないプロパティにアクセスしようとすると undefined が返るため、bar プロパティの型は `number | undefined` になる。このように、`?` 修飾子を付けられたプロパティは自動的に `undefined` 型との union 型になる。よって、それを使う側は undefined チェックを行う必要がある。

```ts
function func(obj: MyObj) {
    // === undefined でもチェックできる。
    // null でチェックするなら以下のように != null と書く。（!== null とやってしまうと undefined は !== null が true として評価されるので obj.bar*100 を実行しようとして、「undefinedかもよ」というエラーになる。）
    return obj.bar != null ? obj.bar*100 : 0
}
```

ちなみに、`?` を使わずに自分で bar の型を `number | undefined` と定義すれば同じ意味になるかというとそうはならない。`?` を使わない場合は、たとえ undefined が許されているプロパティでもきちんと宣言しないといけない（省略不可能）。

### `readonly`
これを付けて宣言されたプロパティは再代入できなくなる。const のプロパティ版みたいなもの。

```ts
interface MyObj {
    readonly foo: string;
}

const obj: MyObj = {
    foo: 'fixed',
}

obj.foo = 'change!' // 🛑エラー！
```

ただし、readonly への過信は禁物。readonly でない型を経由して書き換えることができてしまう。

```ts
interface MyObj {
    readonly foo: string;
}

interface MyObj2 {
    foo: string;
}

const obj: MyObj = { foo: 'before', }
const obj2: MyObj2 = obj;

obj2.foo = 'after!';

console.log(obj.foo); // 'after!'
```

### インデックスシグネチャ
オブジェクト型には他の記法もある。その一つがインデックスシグネチャ。

```ts
interface MyObj {
    // この記法！
    [key:string]: number;
}

const obj: MyObj = {};

const num: number = obj.foo;
const num2: number = obj.bar;
```

`[key: string] : number;` のように書くと、`string` 型であるような任意のプロパティ名に対して `number` 型を持つという意味になる。obj にそのような型を与えたので、 `obj.foo` や `obj.bar` などはみんな `number` 型を持つ。  

これは便利だが危ない。上の例では obj は実際には `{}` なので `obj.foo` などは undefined のはずだがその可能性が無視されてしまう。最近の JavaScript では、インデックスシグネチャの利用は回避することができる。オブジェクトを辞書として使いたければインデックスシグネチャの代わりに Map を使ったり、配列の場合は、インデックスによるアクセスを避けて for-of 文を使うなどの方法がある。

### 関数シグネチャ
オブジェクト型の記法で関数型を表現する方法がある。

```ts
interface Func {
    (arg: number): void;
}

const f: Func = (arg: number)=> { console.log(arg); };
```

この記法は通常のプロパティの宣言と同時に使うことができるため、「関数だが同時に特定のプロパティを持っているようなオブジェクト」を表すことができる。さらに、複数の関数シグネチャを書くことができ、それによってオーバーローディングを表現できる。

```ts
interface Func {
    foo: string;
    (arg: number): void;
    (arg: string): string;
}
```

この型が表す値は、`string` 型の foo プロパティを持つオブジェクトであり、かつ `number` 型を引数に関数として呼び出すことができその場合は何も返さず、`string` 型を引数として呼び出すこともできてその場合は `string` 型の値を返すような関数、ということになる。（この interface を実装する場合は引数を `arg: number | string` で定義して、関数の中で typeof arg を見て条件分岐すればよさげ）

### new シグネチャ
コンストラクタであることを表すシグネチャもある。

```ts
interface Ctor<T> {
    // new() すると T 型の値が返る
    new(): T;
}

// このクラス Foo は new すると Foo のインスタンス（もちろん Foo 型）が返されるので、
// Ctor<Foo> に代入可能。
class Foo {
    public bar: number | undefined;
}

const f: Ctor<Foo> = Foo;
```

## `as` によるダウンキャスト
これは TypeScript 独自の構文で、「式 as 型」と書く。ダウンキャストというのは、派生型の値を部分型として扱うためのもの。

```ts
const value = rand();

const str = value as number;
console.log(str * 10);

function rand(): string | number {
    if (Math.random() < 0.5) {
        return 'hello';
    } else {
        return 123;
    }
}
```

上記の例で value は `string | number` 型の値だが、`value as number` の構文により `number` 型として扱っている。よって変数 str は `number` 型になる。  
だがこれは安全ではない。実際には str には文字列が入ってしまう可能性もあるため。`as` は危険なので本当に必要な場面以外で使用するのは回避したほうがよい。

## readonly な配列とタプル
配列型やタプル型においても `readonly` の概念が存在する。readonly な配列は `readonly T[]` のように書く（`T` は要素の型）。

```ts
const arr: readonly number[] = [1, 2, 3];

arr[0] = 100; // 🛑 Error : arr の要素を書き換えるのは error
arr.push(10); // 🛑 Error : readonly 配列型には push などの書き換えメソッドは存在しない
```

`readonly` な配列のプロパティを書き換えようとするとエラーになる。また、`readonly` な配列は、`push` などの配列を破壊的に書き換えるメソッドは除去されており使うことができない。この 2 つの機能により `readonly` 配列の書き換え不可能性を型システム上で担保している。  

なお、`readonly T[]` 型は `ReadOnlyArray<T>` と書くこともできる。  

readonly なタプルも同様に、タプルの前に `readonly` をつけて表現する。そうすると、タプルの各要素を書き換えることはできなくなる。

```ts
const tuple: readonly [string, number] = ['foo', 123];
tuple[0] = 'bar' // 🛑 Error!
```

### `as const`
`readonly` 絡みの話題として `as const` がある。これは TypeScript に型推論の方法を指示するための構文。

`as const` は各種リテラル（文字列・数値・真偽値・オブジェクトリテラル・配列リテラル）に付加することができ、 *その値が書き換えを意図していない* 値であることを表す。

```ts
const obj = {
    foo: '123',
    bar: [1, 2, 3]
}
// obj は { foo: string; bar: number[] } 型
```
まず、普通に書いた（`as const` 無し）`obj` の型は `{ foo: string; bar: number[] }` 型となっている。`foo`プロパティの型は '123' 型ではなく string 型として推論されている。つまり、リテラル型にはなっておらず、`obj.foo = '456'` のように書き換えることができてしまう。  

さて、ではここで `as const` をつけるとどうなるか。

```ts
const obj2 = {
    foo: '123',
    bar: [1, 2, 3]
} as const;
// obj2 は { readonly foo: '123'; readonly bar: readonly [1, 2, 3]};
```

`as const` をオブジェクトリテラルにつけると、`as const` は再帰的に（オブジェクトの中身にも）適用されるため、`foo` プロパティは `'123'` 型になり、foo のプロパティ自体も `readonly` になる。`bar` プロパティも同様で、配列リテラルに `as const` を使用すると対応する `readonly` **タプル型** が推論される。 
  
このように、`as const` はリテラルの型推論で型を広げて欲しくないときに使用することができる。

## `object` 型と `{}` 型
`object` 型は「プリミティブ以外の値の型」。JavaScript にはオブジェクトのみを引数に受け取る関数があり、そのような関数を表現するための型。例えば、`Object.create` は引数としてオブジェクトまたは null のみを受け取る関数。  

ところで、`{}` という型について考えてみよう。これは、何もプロパティが無いオブジェクト型。プロパティが無いと言っても、構造的部分型により、`{foo: string}` のような型を持つオブジェクトも `{}` 型として扱うことができる。  
（ **復習**　構造的部分型について：`interface A = { hoge: string }`、`interface B = { hoge: string; fuga: number }` のような 2 つの型があった場合、A に比べてプロパティが多い B は、（B ⊂ A という関係から）A の部分型であり、A の型を持つ値として振る舞える）

```ts
const obj = { foo: 'foo' };
const obj2: {} = obj;
```

となると、任意のオブジェクトを表す型として `{}` ではダメなのか？　答えは *ダメ* で、`{}` という型はオブジェクト以外も受け付けてしまう（ただし、undefined と null は除く）。

これは JavaScript の仕様上、プリミティブに対してもプロパティアクセスができることと関係している。（プリミティブ型もある意味オブジェクトっぽく扱ってるから `{}` はなんでも受け入れるっていう意味？）  

いずれにしても、 `{}` は undefined と null 以外はなんでも受け入れてしまうような弱い型であり、オブジェクトを表す型として使用するのは適切ではない。

## weak type
オプショナルなプロパティ（`?` 修飾子つきで宣言されたプロパティ）しかない型にも同様の問題がある。そのような型は、関数に渡すためのオプションオブジェクトの型としてよく登場する。  

そこで、そのような型は **weak type** と呼ばれ、特殊な処理が行われる。

```ts
interface Options {
    foo?: string;
    bar?: number;
}

const obj1 = { hoge: 3 };
const obj2: Options = obj1; // 🛑 Error!
const obj3: Options = 5;    // 🛑 Error!
```

最後の 2 行に対するエラーは weak type に特有のもの。obj2 の行は、`{ hoge: number; }` 型の値を `Options` 型の値として扱おうとしているがエラーになっている。構造的部分型の考えに従えば、`{ hoge: number; }` 型のオブジェクトは foo と bar が省略されており、余計なプロパティ hoge を持った `Options` 型のオブジェクトとみなせそうだが、weak type 特有のルールによりこれは認められない。  
具体的には、weak type の値として認められるためには *weak type が持つプロパティを1 つ以上持った型である必要がある* 。例外的に、 `{}` は `Options` 型の値として扱える。  

また、weak type はオブジェクトでないものも同様に弾いてくれる。

## unknown
`{}` は弱い型であると述べたが、本当に最も弱い型である `unknown` 型がある。*どんな型の値も unknown 型として扱うことができる* 。これはいわゆる **top型** で、never 型のちょうど逆にあたる、 *すべての型を部分型として持つ* ような、部分型関係の頂点にある型（never は任意の型の部分型であり、どんな値も never 型の変数に入れることはできない一方、どんな型にも never 型の値を入れることができる。）。

```ts
const u1: unknown = 3; // 数値のリテラルを入れたり
const u2: unknown = null; // null を入れたり
const u3: unknown = (foo: string)=> true; // 関数を入れたり
```

任意の値を取ることができるというのは any 型と同じ特徴だが、unknown 型は any 型と異なり安全に扱うことができる。というのも、unknown 型の値はどんな値なのかわからないため、できることが制限されている。たとえば、数値の足し算をすることもできなければプロパティアクセスもできない。

```ts
const u: unknown = 3;
const sum = u + 5; // 🛑 Error!
const p = u.prop; // 🛑 Error!
```

つまり、どんな値かわからない（unknown）ということは、その値に対して何もできないということを意味している。any 型の場合は好き勝手扱えて危険なので、代わりに unknown 型を使うことが有効。  

unknown 型の値を使うときは、型の絞り込みができる。これにより、unknown 型の値として受け取った値が特定の型のときにのみ処理をすることが可能になる。

```ts
const u: unknown = 3;

if (typeof u === 'number') {
    const foo = u + 5;
}
```

また、クラスの型と instanceof を組み合わせることによる絞り込みも可能。

```ts
class MyClass {
    public prop: number = 10;
}

const u: unknown = new MyClass();

if (u instanceof MyClass) {
    u.prop;
}
```

### unknown 型と void 型の関係
`unknown` 型と `void` 型は似ているところがある。それは関数の返り値の型として `void` 型が登場する場合に現れる。次の例は正しいコード（コンパイルエラーが起きない）である。

```ts
const func1: () => number = () => 123;

const f: (() => void) = func1;
```

ここで、`func1` は `() => number` 型、つまり数値を返す関数である。上の例ではこれを `() => void` 型として扱ってもよいということを表している。  

これが `void` 型の特殊なところで、 **部分型関係において `void` 型は `unknown` 型と同様の振る舞い**（どんな型の値も void 型とみなせる）をする（ただし、`void` 型を（関数の返り値などではなく）直に扱う場合は追加の制限が入る）。

これは特に、アロー関数と組み合わせた場合に役に立つ挙動。`func1` を呼びたいけど返り値には興味がない場合、`() => func1()` のようアロー関数を作るとこれは `() => number` 型となる。しかし返り値はどうでもいいので気持ち的にはこれは `() => void` 型とも言え、この気持ちを表現するためにこのような関数を `() => void` 型として扱えるようになっている。  

これは裏を返せば **返り値が `void` 型の関数の返り値は何が入っているのかまったくわからない** ということになる。
上の例に続いて以下を実行すると、一見 void 型に見える voidValue には実は 123 が入っている。

```ts
const voidValue: void = f();
console.log(voidValue); // 123
```

なので、`void` 型の値を得てもそれが `undefined` である保証すら無いということになる。`void` 型を持つ値の挙動はやはり `unknown` 型と似ており、基本的に使うことができない（`unknown` 型として使うことはできる）。  

以上より、`void` 型というのは `unknown` にさらに追加の制限が加わった型という見方ができる。

## typeof
`typeof 変数` と書くと、その変数の型が得られる。

```ts
let foo = '文字列だよ';
type FooType = typeof foo; // FooType は string になる（let で宣言してるからリテラル型（'文字列だよ'型）にはならない

const str: FooType = 'abc';
```

## keyof
ある `T` を型とすると、`keyof T` という型の構文がある。`keyof T` は、「`T` のプロパティ名全ての型」である。

```ts
interface MyObj {
    foo: string;
    bar: number;
}

let key: keyof MyObj;
key = 'foo';
key = 'bar';
key = 'nyan' // 🛑 Error: Type '"nyan"' is not assignable to type '"foo" | "bar"'.
```

なお、JavaScript ではプロパティ名は文字列のほかに *シンボル* である可能性もある。よって、keyof 型はシンボルの型を含む可能性もある。

```ts
// 新しいシンボルを作成
const symb = Symbol();

const obj = {
    foo: 'str',
    [symb] : 'symb', // [symb] は symb を文字列でなく式として評価してプロパティ名（キー）にするという意味
};

// ObjType = 'foo' | typeof symb
type ObjType = keyof (typeof obj);
```

上記の例では、`obj` のプロパティ名の型を keyof で得た。`ObjType` は `'foo' | typeof symb` となっている。`'foo' | symbol` とはならない点に注意しよう。TypeScript ではシンボルは `symbol` 型だが、プロパティ名としてはシンボルはひとつずつ異なるため `symb` に入っている特定のシンボルでないといけない。  

さらに、keyof 型には `number` の部分型（：数値のリテラル型ってことよね）が含まれる場合もある。それは、数値リテラルを使ってプロパティを宣言した場合である。

```ts
const obj = {
    foo: 'str',
    0: 'num',
};

// ObjType = 0 | 'foo'
type ObjType = keyof (typeof obj);
```

JavaScript ではプロパティ名には数値は使えない（使おうとした場合文字列に変換される）が、TypeScript では数値をプロパティ名に使用した場合は型の上ではそれを保とうとするのである。
  
また、上で出てきたインデックスシグネチャを持つオブジェクトの場合はまた挙動が異なる。

```ts
interface MyObj {
    [foo: string]: number;
}

// MyObjKey = string | number
type MyObjKey = keyof MyObj;
```

この例で定義した `MyObj` 型は *任意の* `string` 型の名前に対してその名前のプロパティは `number` 型を持つという意味になっている。ということは、`MyObj` 型のオブジェクトのキーとしては `string` 型の値すべてが使用できる。よって、`keyof MyObj` は `string` になることが期待できる。  

しかし、実際にはこれは `string | number` となる。これは、数値の場合もどのみち文字列に変換されるから OK という意図が込められたもの。  
なお、一方、インデックスシグネチャのキーの型が `number` の場合（上の例で `[foo: number]: ...` とした場合）は `keyof MyObj` は `number` のみとなる。

## Lookup Types `T[K]`
keyof とセットで使われることが多いのが Lookup Types である。これは、型 `T` と `K` に対して `T[K]` という構文で書く。`K` がプロパティ名（つまりオブジェクトのキー）の型であるとき、 `T[K]` は `T` のそのプロパティの型となる。（？？？）👉なんのことかわからないのでコードを見てみよう。

```ts
interface MyObj {
    foo: string;
    bar: number;
}

// 上の説明にあてはめると、型 T = MyObj 型、型 K = 'foo'。
// T[K]（MyObj['foo']）は MyObj の foo プロパティの型になるので、string 型。
// つまり what は string 型となり、文字列を代入できる。
const what: MyObj['foo'] = 'にゃんにゃか．'
```

同様に、上の例において `MyObj['bar']` は `number` になる。 `MyObj['baz']` のように、プロパティ名ではない型を与えるとエラーになる。**`K` は `keyof T` の部分型である必要がある**。 

逆に言えば、`MyObj[keyof MyObj]` という型は可能で、これは `MyObj['foo' | 'bar']` という型を表す。そして、`MyObj['foo']` は `string` 型を表し、`MyObj['bar']` は `number` 型を表すのだから、最終的に `MyObj['foo' | 'bar']` は `string | number` になる。  
  
keyof と Lookup Types を使うと以下のような関数を書ける。

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const obj = {
    foo: 'string',
    bar: 123,
};

const str: string = pick(obj, 'foo');
const num: number = pick(obj, 'bar');
```

この関数 pick は、`pick(obj, 'foo')` とすると `obj.foo` を返してくれるような関数。注目すべきは、この関数にちゃんと型を付けることができているという点。  

pick は型変数を 2 つ持ち、2 つ目は `K extends keyof T` と書かれている。これは、「ここで宣言する型変数 `K` は `keyof T` の部分型でなければならない」という意味。

## Mapped Types
以上の 2 つ（keyof, Lookup Types）と同時に導入されたのが **mapped type** と呼ばれる型。mapped type は `{[P in K]: T}` という構文を持つ型である。ここで `P` は型変数、`K` と `T` はなんらかの型とする。ただし、`K` は `string` の部分型である必要がある。たとえば、 `{[P in 'foo' | 'bar']: number}` という型が可能。  

`{[P in K]: T}` という型の意味は、「`K` 型の値として可能な各文字列 `P` に対して、型 `T` を持つプロパティ `P` が存在するようなオブジェクトの型」である。`{[P in 'foo' | 'bar']: number}` の例では `K` は `'foo' | 'bar'` なので、`P` としては `'foo'` と `'bar'` が可能。よってこの型が表しているのは `number` 型を持つプロパティ foo と bar が存在するようなオブジェクトである。  

すなわち `{[P in 'foo' | 'bar']: number}` というのは `{ foo: number; bar: number;}` と同じ意味である。

```ts
type Obj1 = {[P in 'foo' | 'bar']: number};
interface Obj2 {
    foo: number;
    bar: number;
}

const obj1: Obj1 = {foo: 3, bar: 5};
const obj2: Obj2 = obj1;
const obj3: Obj1 = obj2;
```

さて、これだけではなんの意味があるのかわからないが、実は、`{[P in K]: T}` という構文において、型 `T` の中で `P` を使うことができるのである。

```ts
type PropNullable<T> = {[P in keyof T]: T[P] | null};

interface Foo {
    foo: string;
    bar: number;
}

const obj: PropNullable<Foo> = {
    foo: 'にゃ',
    bar: null,
};
```

ここでは型変数 `T` を持つ型 `PropNullable<T>` を定義した。この型は、`T` 型のオブジェクトの各プロパティ `P` の型が、 `T[P] | null`、すなわち、元の型であるか null であるかのいずれかであるようなオブジェクトの型。  

また、mapped type では `[P in K]` の部分に `?` や `readonly` といった修飾子をつけることができる。例えば、次の型 `Partial<T>` は `T` のプロパティをすべてオプショナルにした型である。（この型は TypeScript の標準ライブラリに定義されており、自分で定義しなくても使うことができる。）  
すべてのプロパティを readonly にする `ReadOnly<T>` も用意されている。

```ts
type Partial<T> = {[P in keyof T]?: T[P]};
```

逆に、修飾子を取り除くことも可能である。そのためには、`?` や `readonly` の前に `-` をつける。たとえば、すべてのプロパティから `?` を取り除く（`Partial<T>` と逆のはたらきをする）`Required<T>` は次のように書ける（実際にはこの `Required<T>` も標準ライブラリに入っている）。

```ts
type Required<T> = {[P in keyof T]-?: T[P]};

interface Foo {
    foo: string;
    bar?: number;
}

type ReqFoo = Required<Foo>;
// ReqFoo = { foo: string; bar:number; }
// Required によって、もともとの interface 定義ではオプショナルだった bar プロパティも必須プロパティになる
```

mapped type を使う例としては、他にも以下のようなものもある。

```ts
function propStringify<T> (obj: T): {[P in keyof T]: string} {
    const result = {} as {[P in keyof T]: string};
    for (const key in obj) {
        result.key = String(obj[key]);
    }
    return result;
}
```

## Conditional Types
これは **型レベルの条件分岐が可能な型** 。Conditonal Type は 4 つの型を用いて `T extends U ? X : Y` という構文で表現される。すなわち、この型は `T` が `U` の部分型ならば `X` に、そうでなければ `Y` になる。

### mapped types の限界
mapped type の問題 -> deep なマッピングができない。たとえば、`Readonly<T>` はプロパティを *shallow に* readonly 化する。例えば

```ts
interface Obj {
    foo: string;
    bar: {
        hoge: number;
    };
}
```

という型に対して `Readonly<Obj>` としても、`foo` と `bar` は readonly になるが `bar` の中の `hoge` は readonly にならない。ネストしているオブジェクトも含めて全部 readonly にしてくれるようなものを作ろうとした場合、例えば以下のように定義するとうまくいくだろうか。

```ts
// 素朴に再帰を書く
type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
}
```

これは以下のようなケースだとうまくいくが・・・

```ts
interface Obj {
    foo: string;
    bar: {
        hoge: number;
    };
}

type ReadOnlyObj = DeepReadonly<Obj>;

const obj: ReadOnlyObj = {
    foo: 'foo',
    bar: {
        hoge: 3,
    },
};

obj.bar.hoge = 10; // 🛑 ERROR
```

しかし、これは `DeepReadonly<T>` の `T` の型が何か判明しているからであり、次のような状況ではうまくいかなくなる。

```ts
function readonlyify<T>(obj: T): DeepReadonly<T> {
    // 🛑 Error: Excessive stack depth comparing types 'T' and 'DeepReadonly<T>'
    return obj as DeepReadonly<T>;
}
```

つまり、このような単純な再帰では一般の `T` に対してどこまでも mapped type を展開してしまうことになり
それを防ぐために conditional type が必要となる。  
  
（ちなみに、deep に readonly にするには as const を使えばいけるはず）

### conditional type による `DeepReadonly<T>`
conditonal type を用いて `DeepReadonly<T>` を定義すると以下のようになる。

```ts
// T が配列の場合、配列以外のオブジェクトの場合、それ以外（プリミティブ）の場合で条件分岐
type DeepReadonly<T> =
    T extends any[] ? DeepReadonlyArray<T[number]> : // 配列の場合は DeepReadonlyArray<T> で処理
    T extends object ? DeepReadonlyObject<T> : // それ以外のオブジェクトは DeepReadonlyObject<T> で処理
    T; // プリミティブの場合はそのプロパティを考える必要はないため単に T を返す。

// DeepReadonlyArray<T> は、要素の型である T を DeepReadonly<T> で再帰的に処理
// 配列自体の型は ReadonlyArray<T> により表現
// ReadonlyArray<T> は標準ライブラリにある型で、各要素が readonly になっている配列。 
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    // mapped type を用いて各プロパティを処理
    // NonFunctionPropertyNames<T> は T のプロパティのうち関数でないもの。
    // T からメソッド（関数であるようなプロパティ）を除去している。
    // （メソッドにより自己を書き換える可能性を排除している）
    readonly [P in NonFunctionPropertyNames<T>]: DeepReadonly<T[P]>;
};

// これも conditional type で実装されている
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K}[keyof T];
```

`DeepReadonly<T>` が conditional type になっており、`T` が配列か（配列以外の）オブジェクトかそれ以外（プリミティブ）かで条件分岐している。  

`T[number]` というのは、その条件分岐内では配列であるところの `T` に対して `number` 型のプロパティ名でアクセスできるプロパティの型だから、配列 `T` の要素の型ということになる。  

`DeepReadonlyObject<T>` は mapped type を用いて各プロパティを処理している。ただし、 `NonFunctionPropertyNames<T>` というのは `T` のプロパティ名のうち関数でないもの。これも conditional type で実装されている。  

実のところ、`DeepReadonly<T>` の本質は、conditional type が遅延評価されるところにある。`DeepReadonly<T>` の条件分岐は `T` が何かわからないと判定できないので必然的にそうなるが、これにより、評価時に無限に再帰することを防いでいる。

### conditional type における型マッチング
conditional type にはさらに協力な機能がある。それは、**conditional typeの条件部で新たな型変数を導入できる** という機能である。

**例**
```ts
type ReturnType<T> = T extends ((...args: any[]) => infer R) ? R : T;
```

`ReturnType<T>` は、`T` が関数の型のとき、その返り値の型となる。ポイントは、関数の型の返り値部分にある `infer R` である。このように `infer` キーワードを用いることで、conditional type の条件部分で型変数を導入することができる。導入された型変数は分岐の then 側（`?` のあと）で利用可能になる。  

つまり、この `ReturnType<T>` は `T` が `(...args: any[]) => R` （の部分型）であるとき `R` に評価されるということ。then 側でしか型変数が使えないのは、else 側では `T` が `(...args: any[]) => R` の形をしていないかもしれないことを考えると当然と言える。このことからわかるように、この機能は **型に対するパターンマッチ** と見ることができる。

同じ型変数に対する `infer` が複数箇所に現れることも可能。その場合、推論される型変数に union 型や intersection 型が入ることもある。

```ts
type Foo<T> =
    T extends {
        foo: infer U;
        bar: infer U;
        hoge: (arg: infer V)=> void;
        piyo: (arg: infer V)=> void;
    } ? [U, V] : never;

interface Obj {
    foo: string;
    bar: number;
    hoge: (arg: string)=> void;
    piyo: (arg: number)=> void;
}

declare let t: Foo<Obj>; // t の型は [string | number, string & number（= never）]
```

部分型関係を考えれば、`U` が union 型で表現されて `V` が intersection 型で表現される理由がわかる。`U` は covariant な位置に、`V` は contravariant な位置に出現しているからである。