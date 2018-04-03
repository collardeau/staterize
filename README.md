[![Build Status](https://travis-ci.org/collardeau/staterize.svg?branch=master)](https://travis-ci.org/collardeau/staterize)
[![Coverage Status](https://coveralls.io/repos/github/collardeau/staterize/badge.svg?branch=master)](https://coveralls.io/github/collardeau/staterize?branch=master)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# staterize

A tiny state machine designed for React

# Example



```javascript
import staterize from 'staterize';

  // prepare your state and its derivations:
 
  const state = { 
    count: 0 
   };
 
  const deriveState = [
    {
      is10: st => st.count === 10
    }
  ];
 
  // what to do when the state is updated:
  const onStateChange = st => {
    console.log(st)
  }
  
 // initilize a store from staterize:
 const store = staterize(state, deriveState, onStateChange);

// calling store with no params returns the current state:
 const state = store();
 // { count: 0, is10: false)
 
 // calling store with some state updates:
 store({ count: 10 })
 // triggers the onStateChange callback with:
 { count: 10, is10: true)

```
More examples coming soon...
