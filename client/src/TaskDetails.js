import React from 'react';
import Header from './Header.js';
import Traits from './Traits.js';
import axios from 'axios';
import GoogleMaps from './Map.js';
import Auth from './Auth.js';

class TaskDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: {},
      taskId: props.match.params.taskId,
      tasks: [],
    };

    this.acceptTask = this.acceptTask.bind(this);
    this.rejectTask = this.rejectTask.bind(this);
  }

  componentDidMount() {
    // Get the task info from the API
    console.log('Running?');
    axios.get(`/tasks/${this.state.taskId}`).then(result => {
      console.log('results', result.data);
      this.setState({task: result.data});
    });
  }

  displayButtonPostResult(isAccepted) {
    isAccepted
      ? alert('Task has been accepted!')
      : alert('Task has been rejected!');
  }

  acceptTask() {
    axios
      .post(`/tasks/${this.state.taskId}/accept`, {username: Auth.username})
      .then(() => {
        // Based on res, figure out whether task has been accepted or not.
        this.displayButtonPostResult(true);
      })
      .then(() => {
        this.props.history.goBack();
      });
  }

  rejectTask() {
    axios
      .post(`/tasks/${this.state.taskId}/reject`, {username: Auth.username})
      .then(() => {
        // Based on res, figure out whether task has been accepted or not.
        this.displayButtonPostResult(false);
      })
      .then(() => {
        console.log('this is redirection!!');
        this.props.history.goBack();
      });
  }

  render() {
    console.log('RENDERING!', this.props);
    return (
      <div className="ui container" style={{paddingTop: '100px'}}>
        <Header name={Auth.username} />

        <div className="ui stackable grid">
          <div className="twelve wide column">
            <div className="ui segment">
              <h1 className="ui center aligned header">
                {this.state.task ? this.state.task.title : 'Loading'}
              </h1>
              <div className="ui text container fluid">
                <p>
                  {this.state.task ? this.state.task.description : 'Loading'}
                </p>
                <script
                  async
                  defer
                  src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC7t8S8b9WhSyAuT7Mr5VJaUhtDVDOUrV4&callback=initMap`}
                  type="text/javascript"
                />
                <div className="ui center aligned attached segment">
                  <div className="ui buttons">
                    <button onClick={this.rejectTask} className="ui button">
                      Cancel
                    </button>
                    <div className="or" />
                    <button
                      onClick={this.acceptTask}
                      className="ui positive button">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="twelve wide column">
            <GoogleMaps
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBH-6-MO2reXrAZ4fDQuzkOghyIBPkLyhE&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{height: `100%`}} />}
              containerElement={<div style={{height: `100%`}} />}
              mapElement={<div style={{height: `100%`}} />}
              tasks={[this.state.task]}
              key={this.state.task.id}
            />
          </div>
          <div className="four wide column">
            <div className="ui segment">
              <h3>Further Details</h3>
              {this.state.task ? <Traits task={this.state.task} /> : 'Loading'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskDetails;
