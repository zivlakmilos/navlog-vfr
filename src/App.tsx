import { Route, Router } from '@solidjs/router';
import type { Component } from 'solid-js';
import Home from './Home';
import Heading from './Heading';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/heading/new" component={Heading} />
      <Route path="/heading/:id" component={Heading} />
    </Router>
  );
};

export default App;
