import React from 'react';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import BoardView from './BoardView';

require('../sass/index.scss');


export default class App extends React.Component {
  render() {
    return (
        <BoardView />
    );
  }
}
