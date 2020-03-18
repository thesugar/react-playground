import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    /*
    Square コンポーネントは自分で state （マルバツ）を管理せず、
    Board コンポーネントから値を受け取って、栗区されたときは
    そのことを Board コンポーネントに伝えるだけ。
    こうした場合、Square コンポーネントは Controlled Component (by Board Component) と呼ばれる。
    */
    render() {
        return (
            <button 
                className="square" 
                onClick={()=>this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
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
        };
    }

    handleClick = (i) => {
        /*
        squares を直接変更せずに、.slice()を呼んで配列のコピーを作成している。
        */
        const squares = this.state.squares.slice();
        squares[i] = '❌';
        this.setState({squares: squares});
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
        const status = 'Next player: X';

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

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);