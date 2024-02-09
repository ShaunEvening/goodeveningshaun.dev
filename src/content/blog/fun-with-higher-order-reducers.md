---
title: Fun with Higher Order Reducers
description: How to turn common Redux patterns into reusable code.
author: "shaun-evening"
pubDate: "Sep 11 2018"
heroImage:
  src: "/grainy-gradient-1.svg"
  alt: ""
canonicalUrl: "https://medium.com/@shaunlloyd/fun-with-higher-order-reducers-ab2e6a34188e"
---

How you manage the state of your application is important, and libraries such as `redux` and `ngrx` have been widely adopted in the JavaScript community for this task. Even though state management has come a long way, most people will quickly notice common patterns being repeated in their reducers and start to cry foul over the boilerplate that seems to be required. This was something I noticed too, but I started to adopt a pattern of **Higher Order Reducers** to help abstract away the repetition.

Before we get into the how Higher Order Reducers can help, let's look back at what a **Higher Order Function** is. A Higher Order Function is a function that takes one or more functions as arguments and/or returns a function

now remember, reducers are functions too. A Higher Order Reducer is a specific kind of Higher Order Function that will return a new reducer function.

---

## Resetting Reducer State

Let's start with one piece of functionality that I found to be used over and over again in my reducers, resetting state! Imagine that we're creating a shopping cart feature in our application and we want to give the user the ability to empty their cart; how might that look as a reducer? Consider the following:

The `shoppingCartReducer` seems pretty straightforward right now, and many reducers are. However, there are bits of logic that we tend to repeat time and time again, which often leads to complaints of too much boilerplate. If we look at the `shoppingCartReducer` we can see some logic that is often repeated, resetting state.
If we wanted to move resetting a reducer's state into a Higher Order Reducer, how would that look? Let's consider the following example:

Now that we have `withResetState`, refactoring our `shoppingCartReducer` to use it looks like this:

We configured the Higher Order Reducer here to look for the `shoppingCartActionTypes.RESET_CART_STATE` action and told it to set our state to `INITIAL_SHOPPING_CART_STATE` when this action is fired. Then, we gave the resulting Higher Order Function our base reducer from before while also removing the need for the reset action switch case. Cool, right?!

---

## Asynchronous Loading Flags

Another common behaviour of modern single page applications is asynchronous actions such as API calls. While this asynchronous code is being executed, user interfaces tend to block the user from clicking the submit button again and update the page to inform the user they are loading something. Typically in redux, the state of an asynchronous call is represented by three states:

- `isLoading`: A boolean flag to determine whether the current call is in progress or not. Defaults to false.
- `success`: A boolean flag to show whether a call was previously made and was successful. Defaults to false.
- `error`: set to null or a defined error (can be an object or an error message string). Defaults to null

When my state passes through each of these states, I explicitly set the other keys back to their default to represent the most recent asynchronous action. How does this look in a typical redux reducer? Let's find out:

Again, including these three new cases and their associated state doesn't seem like a big detail, right? However, when you have several reducers needing the same functionality - the code starts to build up.
What if we created reducers just for:

### isLoading

### success

### error

Using these single case reducers, we can create a Higher Order Reducer to abstract away the functionality of handling asynchronous loading state:

In the above example, `withLoadable` allows us to configure which actions the enhanced reducer should listen for in order to update it's asynchronous action state. In doing this, we can now lift the handling of tracking asynchronous actions out of the base reducer and again focus on the specific functionality that is unique to the piece of state you're looking to update with your reducer.
Let's update our previous example to use `withLoadable` to see how this would look.

TADA 🎉 we've now lifted the asynchronous state out of our reducer, we no longer need to juggle these three properties of our state.

---

## Using Them Together

Now that we've seen a few examples of using Higher Order Reducers, what if we wanted to use a few of them together? We can also write a function to pipe the base reducer through each of the given Higher Order Reducers. Consider the following `pipeHigherOrderReducers` function:

Using `pipeHigherOrderReducers`, we now have a way to pipe a base reducer through multiple Higher Order Reducers; awesome! Let's consider the following example to see how would that look in action?

We've now been able to clear up four commonly repeated state transformations from our base reducer and are left with cases that are specific to the the actual use of this reducer.

---

## Caveats

Due to the fact that each higher order reducer is written in a way to be pipeable for the base reducer, each transform of state in the chain as the ability to respond the same action and alter the entire state; This can be both a good and bad thing. If not properly kept track of, your piped reducer could perform undesired transforms on your state, however, I would argue that this concern can be handled by writing unit tests for your reducers. On the other hand, responding to one action in different layers of this chain can be very handy.

As an example, let's look back to our enhanced `shoppingCartReducer`. Let's imagine that a requirement of this reducer is to clear the items array once the purchase has been successfully made. It wouldn't make sense to bake that into withLoadable as that would make it too specific to the problem and no longer be generic. Additionally, we only ever want withLoadable to be responsible for the isLoading, success, and error properties or risk our reducer becoming increasingly unpredictable. Instead let's handle any additional functionality in the base reducer.

---

## In Closing

Higher Order Reducers can be a fun way to create reusable functionality for your reducers and even handle whole pieces of state for you. Of course, like with every other programming pattern, this can be abused and cause even more problems. However, when used effectively, Higher Order Reducers can be used to abstract common functionality out of our reducers and focus purely on the specific logic that makes each reducer unique.

If you want to dive deeper into what you can do with your redux and ngrx reducers, I would highly recommend checking out this list of [reducer utility libraries](https://github.com/markerikson/redux-ecosystem-links/blob/master/reducers.md) by [Mark Erikson](https://github.com/markerikson) on Github.
