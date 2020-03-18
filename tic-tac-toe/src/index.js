import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
Square コンポーネントは自分で state （マルバツ）を管理せず、
Board コンポーネントから値を受け取って、栗区されたときは
そのことを Board コンポーネントに伝えるだけ。
こうした場合、Square コンポーネントは Controlled Component (by Board Component) と呼ばれる。
*/

// 関数コンポーネント：renderメソッドだけを有して自分のstateを持たないコンポーネントをシンプルに書ける
const Square = props => {
    return (
        <button
            className="square"
            // 関数コンポーネントでは onClick = {() => props.onClick()} は以下のように書ける
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (

            // state はそれを定義している Board コンポーネント内でプライベートな
            // ものなので、 Square から Board の state を直接書き換えることはできない
            // 代わりに、 Board から Square に関数を渡すことにして、
            // マス目がクリックされたら Square にその関数を呼んでもらうようにする。
            <Square 
                value={this.props.squares[i]}
                onClick={()=>this.props.onClick(i)}/>
            );
    }

    render(){
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        // Game コンポーネントが history にアクセスできる必要があるため、
        // history という state はトップレベルの Game コンポーネントに置く
        // (state の lift up)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext : true,
            stepNumber : 0, //いま何手目の状態を見ているか
        };
    }

    handleClick = (i) => {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // squares を直接変更せずに、.slice()を呼んで配列のコピーを作成する。
        // 着手があるたびに squares のコピーを作り、配列をイミュータブルなものとして
        // 扱うことで、squares の過去のバージョンをすべて保存しておいて、
        // 過去の手番をさかのぼることができる。
        const squares = current.squares.slice();

        if (squares[i] || calculateWinner(squares)){
            return ;
        }

        squares[i] = this.state.xIsNext ? '❌' : '⭕️';
        this.setState({
            // push メソッドと違って、concat() は元の配列をミューテートしないためこれを利用する
            history: history.concat([{squares : squares}]), 
            xIsNext: !this.state.xIsNext,
            // 初期状態（全マスnull）も history に含まれるため
            // それまでに n 回着手があったとき history は n+1 である。
            // つまり、「n 回目の着手が終わったあとの状態においては何手目に着目している（stepNumber）？」という問いの答えは
            // n+1 であり、history.length になる（history.length + 1 ではない）
            stepNumber : history.length,
        });
    }

    jumpTo = step => {
        this.setState({
            stepNumber : step,
            xIsNext : (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? '❌' : '⭕️');
        }

        const moves = history.map((step, move) => {
            // step : value, move: index
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            return (
                // 着手（順）はゲームの最中に並べ変わったり削除されたり挿入されたりしないため
                // 着手のインデックスをリストのキーとして使うことは安全
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

const calculateWinner = squares => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 6],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i=0; i < lines.length; i++){
        const [a, b, c] = lines[i]
        // squares[a] === squares[b] === squares[c] は無理
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }

    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);