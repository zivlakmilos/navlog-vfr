import { Route, Router } from '@solidjs/router';
import type { Component } from 'solid-js';
import Home from './Home';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
    </Router>
  );
};

export default App;
