import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.highlight ? 'highlight' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.winLine && this.props.winLine.includes(i)}
      />
    );
  }

  renderRows(start) {
    const cols = [];
    for (let i = start; i < start + 5; i++) {
      cols.push(this.renderSquare(i));
    }
    return (
      <div className="board-row" key={start}>
        {cols}
      </div>
    );
  }

  render() {
    const rows = [];
    for (let i = 0; i < 5; i++) {
      rows.push(this.renderRows(i * 5));
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(25).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      location: { x: null, y: null },
      sortingStatus: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: { x: Math.floor(i / 5), y: i % 5 },
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  toggleSorting() {
    this.setState({
      sortingStatus: !this.state.sortingStatus
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, winLine } = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move + ` (${step.location.x}, ${step.location.y})`
        : 'Go to game start';
      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? 'button-active' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (!current.squares.includes(null)) {
      status = "It's draw";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winLine={winLine}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="toggle-button" onClick={() => this.toggleSorting()}>Toggle sorting</button>
          <ol>{this.state.sortingStatus ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19 , 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]

  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return {
        winner: squares[a],
        winLine: lines[i]
      };
    }
  }
  return {
    winner: undefined,
    winLine: undefined
  };
}
