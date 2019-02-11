import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import _ from 'lodash';

const colors = {
  used: "lightgreen",
  selected: "deepskyblue",
  wrong: "lightcoral"
};

const randomSum = (arr, maxSum) => {
  const sets = [[]], sums = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0, len = sets.length; j < len; j++) {
      const candidateSet = sets[j].concat(arr[i]);
      const candidateSum = _.sum(candidateSet);
      if (candidateSum <= maxSum) {
        sets.push(candidateSet);
        sums.push(candidateSum);
      }
    }
  }
  return _.sample(sums);
}

class Number extends React.PureComponent {
  bgColor() {
    const { used, selected, wrong } = this.props;
    if (used) {
      return { background: colors.used };
    }
    if (selected) {
      return wrong
        ? { background: colors.wrong }
        : { background: colors.selected };
    }
    return {};
  }

  handleClick(num) {
    if (!this.props.used) {
      this.props.onClick(num);
    }
  }

  render() {
    const { num } = this.props;
    return (
      <button
        style={this.bgColor()}
        onClick={() => this.handleClick(num)}
        className="number"
      >
        {this.props.num}
      </button>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNumbers: [],
      usedNumbers: []
    };
  }

  numbers = _.range(1, 10);
  stars = _.range(randomSum(this.numbers, 9));

  handleClick(num) {

    this.setState(prevState => {
      let { selectedNumbers, usedNumbers } = prevState;

      if (selectedNumbers.indexOf(num) >= 0) {
        selectedNumbers = selectedNumbers.filter(v => v !== num);
      } else {
        selectedNumbers = [...selectedNumbers, num];
      }
      const sum = _.sum(selectedNumbers);
      this.selectionIsWrong = sum > this.stars.length;
      this.gameIsDone = usedNumbers.length === this.numbers.length;
      if (sum === this.stars.length) {
        usedNumbers = [...usedNumbers, ...selectedNumbers];
        selectedNumbers = [];
        this.stars = _.range(
          randomSum(_.difference(this.numbers, usedNumbers), 9)
        );;
      }

      return { selectedNumbers, usedNumbers };
    });
  }

  resetGame() {
    this.setState({
      selectedNumbers: [],
      usedNumbers: []
    })
    this.numbers = _.range(1, 10);
    this.stars = _.range(randomSum(this.numbers, 9));
  }

  render() {
    return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="stars">
            {this.stars.map(v => {
              return <div key={v} className="star" />;
            })}
          </div>
          <div className="play-numbers">
            {this.numbers.map(v => {
              const isSelected = this.state.selectedNumbers.indexOf(v) >= 0;
              const isUsed = this.state.usedNumbers.indexOf(v) >= 0;
              return (
                <Number
                  used={isUsed}
                  selected={isSelected}
                  key={v}
                  onClick={i => this.handleClick(i)}
                  wrong={this.selectionIsWrong}
                  num={v}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
