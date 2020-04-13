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