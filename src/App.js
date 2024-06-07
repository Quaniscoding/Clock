import React from 'react';
import './App.css'
class LengthControl extends React.Component {
  render() {
    return (
      <div className="length-control">
        <div id={this.props.titleID}>{this.props.title}</div>
        <button className="btn-level" id={this.props.minID} onClick={this.props.onClick} value="-">
          <i className="fa fa-arrow-down fa-2x"></i>
        </button>
        <div className="btn-level" id={this.props.lengthID}>{this.props.length}</div>
        <button className="btn-level" id={this.props.addID} onClick={this.props.onClick} value="+">
          <i className="fa fa-arrow-up fa-2x"></i>
        </button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brkLength: 5,
      seshLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: {
        color: "white"
      }
    };
    this.setBrkLength = this.setBrkLength.bind(this);
    this.setSeshLength = this.setSeshLength.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.beginCountDown = this.beginCountDown.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.warning = this.warning.bind(this);
    this.buzzer = this.buzzer.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.clockify = this.clockify.bind(this);
    this.reset = this.reset.bind(this);
  }

  setBrkLength(e) {
    this.lengthControl("brkLength", e.currentTarget.value, this.state.brkLength, "Session");
  }

  setSeshLength(e) {
    this.lengthControl("seshLength", e.currentTarget.value, this.state.seshLength, "Break");
  }

  lengthControl(e, t, s, i) {
    if (this.state.timerState !== "running") {
      if (this.state.timerType === i) {
        if (t === "-" && s !== 1) {
          this.setState({ [e]: s - 1 });
        } else if (t === "+" && s !== 60) {
          this.setState({ [e]: s + 1 });
        }
      } else {
        if (t === "-" && s !== 1) {
          this.setState({ [e]: s - 1, timer: 60 * (s - 1) });
        } else if (t === "+" && s !== 60) {
          this.setState({ [e]: s + 1, timer: 60 * (s + 1) });
        }
      }
    }
  }

  timerControl() {
    if (this.state.timerState === "stopped") {
      this.beginCountDown();
      this.setState({ timerState: "running" });
    } else {
      this.setState({ timerState: "stopped" });
      if (this.state.intervalID) this.state.intervalID.cancel();
    }
  }

  beginCountDown() {
    this.setState({
      intervalID: (() => {
        const func = () => {
          this.decrementTimer();
          this.phaseControl();
        };
        let timeoutID;
        const intervalID = setInterval(func, 1000);
        return {
          cancel: () => clearInterval(intervalID)
        };
      })()
    });
  }

  decrementTimer() {
    this.setState({ timer: this.state.timer - 1 });
  }

  phaseControl() {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);
    if (timer < 0) {
      this.state.intervalID && this.state.intervalID.cancel();
      if (this.state.timerType === "Session") {
        this.beginCountDown();
        this.switchTimer(60 * this.state.brkLength, "Break");
      } else {
        this.beginCountDown();
        this.switchTimer(60 * this.state.seshLength, "Session");
      }
    }
  }

  warning(timer) {
    if (timer < 61) {
      this.setState({ alarmColor: { color: "#a50d0d" } });
    } else {
      this.setState({ alarmColor: { color: "white" } });
    }
  }

  buzzer(timer) {
    if (timer === 0) this.audioBeep.play();
  }

  switchTimer(timer, type) {
    this.setState({
      timer: timer,
      timerType: type,
      alarmColor: { color: "white" }
    });
  }

  clockify() {
    if (this.state.timer < 0) return "00:00";
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }

  reset() {
    this.setState({
      brkLength: 5,
      seshLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: { color: "white" }
    });
    if (this.state.intervalID) this.state.intervalID.cancel();
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  render() {
    return (
      <div>
        <div className="main-title">25 + 5 Clock</div>
        <LengthControl
          addID="break-increment"
          length={this.state.brkLength}
          lengthID="break-length"
          minID="break-decrement"
          onClick={this.setBrkLength}
          title="Break Length"
          titleID="break-label"
        />
        <LengthControl
          addID="session-increment"
          length={this.state.seshLength}
          lengthID="session-length"
          minID="session-decrement"
          onClick={this.setSeshLength}
          title="Session Length"
          titleID="session-label"
        />
        <div className="timer" style={this.state.alarmColor}>
          <div className="timer-wrapper">
            <div id="timer-label">{this.state.timerType}</div>
            <div id="time-left">{this.clockify()}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.timerControl}>
            <i className="fa fa-play fa-2x"></i>
            <i className="fa fa-pause fa-2x"></i>
          </button>
          <button id="reset" onClick={this.reset}>
            <i className="fa fa-refresh fa-2x"></i>
          </button>
        </div>
        <div className="author">
          Designed and Coded by <br />
          <a href="https://github.com/Quaniscoding" target="_blank" rel="noreferrer">
            Quaniscoding
          </a>
        </div>
      </div>
    );
  }
}

export default App;
