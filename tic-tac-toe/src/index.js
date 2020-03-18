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

    /*
     state の lift-up.
     元々 Square の state で個々に管理していたマルバツを
     親コンポーネントの Board で管理させることで
     ゲームの状況を一箇所で管理できるようにする。
    */
    constructor(props){
        super(props);
        this.state = { 
            squares : Array(9).fill(null),
            xIsNext : true,
        };
    }

    handleClick = (i) => {

        // squares を直接変更せずに、.slice()を呼んで配列のコピーを作成している。
        const squares = this.state.squares.slice();
        if (squares[i] || calculateWinner(squares)){
            return ;
        }

        squares[i] = this.state.xIsNext ? '❌' : '⭕️';
        this.setState({squares: squares, xIsNext: !this.state.xIsNext});
    }

    renderSquare(i) {
        return (

            // state はそれを定義している Board コンポーネント内でプライベートな
            // ものなので、 Square から Board の state を直接書き換えることはできない
            // 代わりに、 Board から Square に関数を渡すことにして、
            // マス目がクリックされたら Square にその関数を呼んでもらうようにする。
            <Square 
                value={this.state.squares[i]}
                onClick={()=>this.handleClick(i)}/>
            );
    }

    render(){
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner : ' + winner;
        } else {
            // 文字列 + 式 は {} でなく () で囲む
            status = 'Next player: ' + (this.state.xIsNext ? '❌' : '⭕️');
        }

        return (
            <div>
                <div className="status">{status}</div>
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
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
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