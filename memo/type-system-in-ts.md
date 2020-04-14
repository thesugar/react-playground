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

