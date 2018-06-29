import React, { Component } from 'react';
import axios from 'axios';
import Select, { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import copy from 'copy-to-clipboard';
import 'react-notifications/lib/notifications.css';
import './App.css';

const Option = (props) => {
  return (
    <div className="Option">
      <img src={props.data.option.img} alt={props.data.option.key} className="Option-image" />
      <components.Option {...props}/>
      <p className="Option-copy">Click to copy</p>
    </div>
  );
};

const overrides = {
  indicatorsContainer: (base, state) => ({
    display: 'none',
  }),
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      emojis: [],
      options: [],
      error: '',
      inputValue: '',
    }
  }

  componentWillMount() {
    this.setState({ loading: true });
    axios.get('https://api.github.com/emojis')
      .then((res) => {
        this.setState({
          loading: false,
          emojis: res.data,
          options: Object.keys(res.data).map(emoji => {
            return ({
              option: { key: emoji, img: res.data[emoji] },
              label: `:${emoji}:`,
            });
          }),
        })
      })
      .catch((error) => {
        NotificationManager.error('Something went wrong, please refresh and try again.');
        this.setState({ loading: false });
      });
  }

  render() {
    const { emojis, options, error, inputValue } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img
            src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f937-2642.png?v8"
            className="App-logo"
            alt="logo"
          />
          <h1 className="App-title">Github emojis</h1>
          <a href="https://github.com/cjevning/github-emoji-list" style={{ color: 'whitesmoke' }}>
            View on Github
          </a>&nbsp;
          <FontAwesomeIcon icon={faGithub} color="whitesmoke" />
        </header>
        {error &&
          <p className="Error-text">{error}</p>
        }
        <Select
          className="Emoji-search"
          styles={overrides}
          placeholder="Search for an emoji here...  "
          options={options}
          openMenuOnClick={false}
          components={{ Option }}
          value={inputValue}
          onInputChange={v => this.setState({ inputValue: v })}
          onChange={(v) => {
            copy(v.label);
            NotificationManager.success(`${v.label} copied to clipboard!`);
            this.setState({ inputValue: '' });
          }}
        />
        <div className="Emojis-container">
          {Object.keys(emojis).map(emoji => (
            <button
              type="button"
              key={emoji}
              className="Emoji-display"
              onClick={() => {
                copy(`:${emoji}:`);
                NotificationManager.success(`:${emoji}: copied to clipboard!`);
              }}
            >
              <img src={emojis[emoji]} alt={emoji} className="Emoji-image" />
              <p>:{emoji}:</p>
              <p className="Emoji-copy">Click to copy to clipboard</p>
            </button>
          ))}
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default App;
