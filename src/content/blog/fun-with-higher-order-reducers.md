---
title: Fun with Higher Order Reducers
description: How to turn common Redux patterns into reusable code.
author: "shaun-evening"
pubDate: "Sep 11 2018"
heroImage:
  src: "Fun-with-HOR"
  alt: ""
canonicalUrl: "https://medium.com/@shaunlloyd/fun-with-higher-order-reducers-ab2e6a34188e"
---

How you manage the state of your application is important, and libraries such as `redux` and `ngrx` have been widely adopted in the JavaScript community for this task. Even though state management has come a long way, most people will quickly notice common patterns being repeated in their reducers and start to cry foul over the boilerplate that seems to be required. This was something I noticed too, but I started to adopt a pattern of **Higher Order Reducers** to help abstract away the repetition.

Before we get into the how Higher Order Reducers can help, let's look back at what a **Higher Order Function** is. A Higher Order Function is a function that takes one or more functions as arguments and/or returns a function

```js
const multiplyBy = (multiplier) => (number) => number * multiplier;

const double = multiplyBy(2); // returns (number) => number * 2

double(10); // returns 20
```

now remember, reducers are functions too. A Higher Order Reducer is a specific kind of Higher Order Function that will return a new reducer function.

---

## Resetting Reducer State

Let's start with one piece of functionality that I found to be used over and over again in my reducers, resetting state! Imagine that we're creating a shopping cart feature in our application and we want to give the user the ability to empty their cart; how might that look as a reducer? Consider the following:

```js
// Initial (or default) state of the reducer
const INITIAL_SHOPPING_CART_STATE = {
  items: [],
};

const shoppingCartReducer = (state = INITIAL_SHOPPING_CART_STATE, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      return {
        ...state,
        // Add new item from payload to the items array
        items: [...state.items, action.payload],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        // Remove item from the items array with the given id
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    case "RESET_CART_STATE": {
      return {
        // Reset state back to the initial state
        ...INITIAL_SHOPPING_CART_STATE,
      };
    }
    default: {
      return state;
    }
  }
};
```

The `shoppingCartReducer` seems pretty straightforward right now, and many reducers are. However, there are bits of logic that we tend to repeat time and time again, which often leads to complaints of too much boilerplate. If we look at the `shoppingCartReducer` we can see some logic that is often repeated, resetting state.

If we wanted to move resetting a reducer's state into a Higher Order Reducer, how would that look? Let's consider the following example:

```js
// Takes the action type for resetting state and the state to reset to
const withResetState =
  (resetStateActionType, initialState) =>
  // Returns a higher order reducer that takes a baseReducer
  (baseReducer) =>
  // returns a new reducer function
  (state, action) => {
    // Is the given action of type resetStateActionType?
    const newState =
      action.type === resetStateActionType
        ? { ...initialState } // if yes, return initial state
        : state; // if not, return given state

    // give newState and the action to the base reducer
    return baseReducer(newState, action);
  };
```

Now that we have `withResetState`, refactoring our `shoppingCartReducer` to use it looks like this:

```js
const baseShoppingCartReducer = (
  state = INITIAL_SHOPPING_CART_STATE,
  action
) => {
  switch (action.type) {
    case "ADD_ITEM": {
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    default: {
      return state;
    }
  }
};

const shoppingCartReducer = withResetState(
  "RESET_CART_STATE",
  INITIAL_SHOPPING_CART_STATE
)(baseShoppingCartReducer);
```

We configured the Higher Order Reducer here to look for the `shoppingCartActionTypes.RESET_CART_STATE` action and told it to set our state to `INITIAL_SHOPPING_CART_STATE` when this action is fired. Then, we gave the resulting Higher Order Function our base reducer from before while also removing the need for the reset action switch case. Cool, right?!

---

## Asynchronous Loading Flags

Another common behaviour of modern single page applications is asynchronous actions such as API calls. While this asynchronous code is being executed, user interfaces tend to block the user from clicking the submit button again and update the page to inform the user they are loading something. Typically in redux, the state of an asynchronous call is represented by three states:

- `isLoading`: A boolean flag to determine whether the current call is in progress or not. Defaults to false.
- `success`: A boolean flag to show whether a call was previously made and was successful. Defaults to false.
- `error`: set to null or a defined error (can be an object or an error message string). Defaults to null

When my state passes through each of these states, I explicitly set the other keys back to their default to represent the most recent asynchronous action. How does this look in a typical redux reducer? Let's find out:

```js
// Initial (or default) state of the reducer
const INITIAL_SHOPPING_CART_STATE = {
  isLoading: false,
  success: false,
  error: null,
  items: [],
};

const shoppingCartReducer = (state = INITIAL_SHOPPING_CART_STATE, action) => {
  switch (action.type) {
    case "ADD_ITEM": /* ... add item logic */
    case "REMOVE_ITEM": /* ... remove item logic */
    case "RESET_CART_STATE": /* ... Reset cart logic */
    case "PURCHASE_CART": {
      return {
        ...state,
        // sets the loading state to show the async action is underway
        isLoading: true,
        success: false,
        error: null,
      };
    }
    case "PURCHASE_CART_SUCCESS": {
      return {
        ...state,
        // sets the loading state to show the async action was successful
        isLoading: false,
        success: true,
        error: null,
      };
    }
    case "PURCHASE_CART_ERROR": {
      return {
        ...state,
        // sets the loading state to show the async action failed
        isLoading: false,
        success: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
```

Again, including these three new cases and their associated state doesn't seem like a big detail, right? However, when you have several reducers needing the same functionality - the code starts to build up.
What if we created reducers just for:

### `isLoading`

```js
// sets the loading state to show the async action is underway
const isLoadingReducer = (state) => ({
  ...state,
  error: null,
  isLoading: true,
  success: false,
});
```

### `success`

```js
// sets the loading state to show the async action was successful
const successReducer = (state) => ({
  ...state,
  error: null,
  isLoading: false,
  success: true,
});
```

### `error`

```js
// sets the loading state to show the async action failed
const errorReducer = (state, action) => ({
  ...state,
  error: action.payload,
  isLoading: false,
  success: false,
});
```

Using these single case reducers, we can create a Higher Order Reducer to abstract away the functionality of handling asynchronous loading state:

```js
// Initial state of the async flags
// Can be spread into the initial state object of your base reducer
export const INITIAL_LOADABLE_STATE = {
  error: null,
  isLoading: false,
  success: false,
};

// No operation reducer (default case) to take and return state
export const noopReducer = (state) => state;

/*
  ActionTypes is an object that has three key value pairs
    - isLoadingActionType
    - successActionType
    - errorActionType
  with each value being the action type for the associated reducer
*/
export const withLoadable = (actionTypes) => {
  // Create an object to map the the given action types to
  // the correct reducer defined above
  const actionReducerMap = {
    [actionTypes.isLoadingActionType]: isLoadingReducer,
    [actionTypes.successActionType]: successReducer,
    [actionTypes.errorActionType]: errorReducer,
  };

  // Returns a higher order reducer that takes a baseReducer
  return (baseReducer) =>
    // Returns a new reducer
    (state, action) => {
      // Is the action type a loadable action specified above?
      // if yes, set the action reducer, else set the noopReducer
      const reducerFunction = actionReducerMap[action.type] || noopReducer;
      // compute new state with the specificed reducer set in reducerAction
      const newState = reducerFunction(state, action);
      // return the result of the newState and action passed into the baseReducer
      return baseReducer(newState, action);
    };
};
```

In the above example, `withLoadable` allows us to configure which actions the enhanced reducer should listen for in order to update it's asynchronous action state. In doing this, we can now lift the handling of tracking asynchronous actions out of the base reducer and again focus on the specific functionality that is unique to the piece of state you're looking to update with your reducer.

Let's update our previous example to use `withLoadable` to see how this would look.

```js
// spread in the default loadable state
const baseShoppingCartReducer = (
  state = INITIAL_SHOPPING_CART_STATE,
  action
) => {
  switch (action.type) {
    case "ADD_ITEM": {
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    case "RESET_CART_STATE": {
      return {
        ...INITIAL_SHOPPING_CART_STATE,
      };
    }
    default: {
      return state;
    }
  }
};

const shoppingCartReducer = withLoadable({
  isLoadingAction: "PURCHASE_CART",
  successAction: "PURCHASE_CART_SUCCESS",
  errorAction: "PURCHASE_CART_ERROR",
})(baseShoppingCartReducer);
```

TADA 🎉 we've now lifted the asynchronous state out of our reducer, we no longer need to juggle these three properties of our state.

---

## Using Them Together

Now that we've seen a few examples of using Higher Order Reducers, what if we wanted to use a few of them together? We can also write a function to pipe the base reducer through each of the given Higher Order Reducers. Consider the following `pipeHigherOrderReducers` function:

```js
// Takes in Higher Order Reducers (as many as you want)
const pipeHigherOrderReducers =
  (...higherOrderReducers) =>
  // returns a higher order reducer that takes a base reducer
  (baseReducer) =>
    // returns the new reducer that is the result of the baseReducer
    // being passed through all the given Higher Order Reducers
    higherOrderReducers.reduce(
      (reducer, nextHigherOrderReducer) => nextHigherOrderReducer(reducer),
      baseReducer
    );
```

Using `pipeHigherOrderReducers`, we now have a way to pipe a base reducer through multiple Higher Order Reducers; awesome! Let's consider the following example to see how would that look in action?

```js
const baseShoppingCartReducer = (
  state = INITIAL_SHOPPING_CART_STATE,
  action
) => {
  switch (action.type) {
    case "ADD_ITEM": {
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    default: {
      return state;
    }
  }
};

// Pass in the configured Higher Order Reducers to our piping function
const shoppingCartReducer = pipeHigherOrderReducers(
  withResetState("RESET_CART_STATE", INITIAL_SHOPPING_CART_STATE),
  withLoadable({
    isLoadingAction: "PURCHASE_CART",
    successAction: "PURCHASE_CART_SUCCESS",
    errorAction: "PURCHASE_CART_ERROR",
  })
)(baseShoppingCartReducer);
```

We've now been able to clear up four commonly repeated state transformations from our base reducer and are left with cases that are specific to the the actual use of this reducer.

---

## Caveats

Due to the fact that each higher order reducer is written in a way to be pipeable for the base reducer, each transform of state in the chain as the ability to respond the same action and alter the entire state; This can be both a good and bad thing. If not properly kept track of, your piped reducer could perform undesired transforms on your state, however, I would argue that this concern can be handled by writing unit tests for your reducers. On the other hand, responding to one action in different layers of this chain can be very handy.

As an example, let's look back to our enhanced `shoppingCartReducer`. Let's imagine that a requirement of this reducer is to clear the items array once the purchase has been successfully made. It wouldn't make sense to bake that into withLoadable as that would make it too specific to the problem and no longer be generic. Additionally, we only ever want withLoadable to be responsible for the isLoading, success, and error properties or risk our reducer becoming increasingly unpredictable. Instead let's handle any additional functionality in the base reducer.

```js
const baseShoppingCartReducer = (
  state = INITIAL_SHOPPING_CART_STATE,
  action
) => {
  switch (action.type) {
    case "ADD_ITEM": // ... add item logic
    case "REMOVE_ITEM": // ... remove item logic
    case "PURCHASE_CART_SUCCESS": {
      return {
        ...state,
        // Clear the cart once the purchase has been completed
        items: [],
      };
    }
    default: {
      return state;
    }
  }
};

const shoppingCartReducer = pipeHigherOrderReducers(
  withResetState("RESET_CART_STATE", INITIAL_SHOPPING_CART_STATE),
  withLoadable({
    isLoadingAction: "PURCHASE_CART",
    successAction: "PURCHASE_CART_SUCCESS",
    errorAction: "PURCHASE_CART_ERROR",
  })
)(baseShoppingCartReducer);
```

---

## In Closing

Higher Order Reducers can be a fun way to create reusable functionality for your reducers and even handle whole pieces of state for you. Of course, like with every other programming pattern, this can be abused and cause even more problems. However, when used effectively, Higher Order Reducers can be used to abstract common functionality out of our reducers and focus purely on the specific logic that makes each reducer unique.

If you want to dive deeper into what you can do with your redux and ngrx reducers, I would highly recommend checking out this list of [reducer utility libraries](https://github.com/markerikson/redux-ecosystem-links/blob/master/reducers.md) by [Mark Erikson](https://github.com/markerikson) on Github.
