import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// context を使ってみる
const themes = {
    light: {
      background: '#fff',
      color : '#000',
    },
    dark: {
      background: '#000',
      color: '#fff',
    },
};

const Settings = React.createContext({
    theme : themes.dark,
    toggleTheme : () => {},
});

const ThemeTogglerButton = () => {
    // ThemeTogglerButton は theme のみならず、toggleTheme 関数もコンテクストから受け取る
    // Consumer の使い方：<HogeContext.Consumer>{value => コンテクストの値に基づいて何かをレンダーする}</HogeContext.Consumer>
    return (
        <Settings.Consumer>
            {({theme, toggleTheme}) => (
                <button
                onClick={toggleTheme}
                style={{backgroundColor : theme.background, color: theme.color}}>
                    Toggle Theme
                </button>
            )}
        </Settings.Consumer>
    );
}

class SearchBar extends React.Component {
    render() {
        return (
            <form>
                <input type="text" placeholder="Search..."
                value={this.props.filterText}
                onChange={this.props.onTextChange}/>
                <p>
                    <input type="checkbox" checked={this.props.inStockOnly}
                    onChange={this.props.onCheckChange}/>
                    {' '}
                    Only show product in stock
                </p>
            </form>
        )
    }
}

class ProductCategoryRow extends React.Component {
    render() {
        return (
            <tr>
                <th colSpan="2">
                {this.props.category}
                </th>
            </tr>
        )
    }
}

class ProductRow extends React.Component {
    render() {
        return (
            <tr>
                <td>
                    {this.props.product.stocked ?
                    this.props.product.name:
                    <span style={{color: 'red'}}>
                        {this.props.product.name}
                    </span>
                    }
                </td>
                <td>{this.props.product.price}</td>
            </tr>
        )
    }
}

class ProductTable extends React.Component {

    render() {
        const rows = [];
        let lastCategory = null;
        // .forEach でなく .map も使える
        // map の場合、何かを return しないと warning が出る
        this.props.products.forEach(product => {
            // indexOf で検索文字列が商品名に含まれているかの判定ができる
            if (product.name.indexOf(this.props.filterText) === -1){
                return null;
            }
            if (this.props.inStockOnly && !product.stocked) {
                return null;
            }
            // category も 商品も全部 rows に詰めていく
            // 直近のカテゴリ名を記録しておいてカテゴリの入れ替わりを判定する
            // というのはスマート（でも元のデータがカテゴリでソートされている必要ある）
            // ソートされていなければソート処理を書けばいいだけだろうけど
            if (product.category !== lastCategory) {
                rows.push(
                    <ProductCategoryRow
                        category={product.category}
                        key={product.category} />
                );
            }
            rows.push(
                <ProductRow
                    product={product}
                    key={product.name} />
            );
            lastCategory = product.category;
        });

        return (
            <React.Fragment>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            <ThemeTogglerButton />
            </React.Fragment>
        )
    }
}

class FilterableProductTable extends React.Component {
    constructor(props){
        super(props);

        // 親コンポーネント（本コンポーネント）で、contextをいじる関数を定義する
        this.toggleTheme = () => {
            this.setState(state => ({
                theme :
                    state.theme === themes.dark
                    ? themes.light
                    : themes.dark,
            }));
        }

        // context をいじる関数を state に含めて render 内で Provider に渡す
        this.state = {
            theme : themes.light,
            toggleTheme : this.toggleTheme,
            filterText : '',
            inStockOnly : false,
        }
    }

    handleTextChange = (e) => {
        this.setState({filterText : e.target.value})
    }

    handleCheckChange = (e) => {
        console.log(e.target);
        this.setState({inStockOnly : e.target.checked})
    }

    // データモデルのカテゴリがばらばらだったときのためにソートを実装
    compare = (a, b) => {
        // Use toUpperCase() to ignore character casing
        const categoryA = a.category.toUpperCase();
        const categoryB = b.category.toUpperCase();
      
        let comparison = 0;
        if (categoryA > categoryB) {
          comparison = 1;
        } else if (categoryA < categoryB) {
          comparison = -1;
        }
        return comparison;
      }

    render() {

        const products = this.props.products.sort(this.compare);

        return (
            // state は全部 Provider に渡される
            <Settings.Provider value={this.state}>
                <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onTextChange={this.handleTextChange}
                    onCheckChange={this.handleCheckChange}
                />
                <ProductTable 
                    products={products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}/>
                </div>
            </Settings.Provider>
        )
    }
}

const PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
  ];

ReactDOM.render(
    <FilterableProductTable products={PRODUCTS} />,
    document.getElementById('root')
);