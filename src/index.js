import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const colors = {
  used: "lightgreen",
  selected: "deepskyblue",
  wrong: "lightcoral"
};

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
      stars: Math.floor(Math.random() * 9) + 1,
      selectedNumbers: [],
      usedNumbers: []
    };
  }

  handleClick(num) {
    this.setState(prevState => {
      let { stars, selectedNumbers, usedNumbers } = prevState;
      selectedNumbers = [...selectedNumbers, num];
      const sum = selectedNumbers.reduce((acc, cv) => (acc += cv), 0);

      if (sum === stars) {
        usedNumbers = [...usedNumbers, ...selectedNumbers];
        selectedNumbers = [];
        stars = Math.floor(Math.random() * 9) + 1;
      }

      return { selectedNumbers, usedNumbers, stars };
    });
  }

  render() {
    const { usedNumbers, selectedNumbers, stars } = this.state;
    const selectedSum = selectedNumbers.reduce((acc, cv) => (acc += cv), 0);
    const selectionIsWrong = selectedSum > stars;
    const arr = [...Array(9).keys()];
    const starsArray = [...Array(stars).keys()];
    return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="stars">
            {starsArray.map(v => {
              return <div key={v} className="star" />;
            })}
          </div>
          <div className="play-numbers">
            {arr.map(v => {
              const isSelected = selectedNumbers.find(i => i === v + 1)
                ? true
                : false;
              const isUsed = usedNumbers.find(i => i === v + 1) ? true : false;
              return (
                <Number
                  used={isUsed}
                  selected={isSelected}
                  key={v}
                  onClick={i => this.handleClick(i)}
                  wrong={selectionIsWrong}
                  num={v + 1}
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
