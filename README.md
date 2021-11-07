# <img src="https://www.dazn.com/favicon.svg" alt="DAZN" width=50> [Frontend Library Coding Challenge](https://gist.github.com/simontabor/b728c9852ea898af98b61e9b79fe0b40)

## Project Description

This repository contains my solution for the [DAZN frontend library coding challenge](https://gist.github.com/simontabor/b728c9852ea898af98b61e9b79fe0b40). The assignment was to build a Websocket Service that a frontend application could use to connect to a websocket server, subscribe to rooms and receive real-time updates. Functional requirements can be found on the assignment page.

## Implementation Overview

The assignment only asked for the module to be built, however I wasn't overly familiar with websockets to I also built a basic websocket server and frontend client. You can start the server and client using the instructions below, however please keep in mind that as both were outside the scope of the assignment, neither adhere to best practices. **They are only included for the convenience of testing the module manually**.

## Starting the Project

-   Clone the project locally by running `git clone git@github.com:adambelton/dazn.git`.
-   Navigate to the **/server** folder, run `yarn install` to install the server dependencies, and then run `yarn dev` to start the server.
-   Navigate to the **/module** folder, run `yarn install` to install the module's dependencies, run `yarn build` to build the module and then run `yarn link` to make the module available for linking locally.
-   Navigate to the **/client** folder, run `yarn install` to install the client's dependencies, run `yarn link websocket-module` to create a symlink to the local module, and run `yarn dev` to start the client. The application can be accessed at http://localhost:8000.

## Tests

A number of unit tests for the module can be found in the /module/test folder. To execute the tests, navigate to the **/module** folder and run `yarn test`.

## Ideas for Improvements

-   I would investigate creating some sort of queue and status reporting for the room subscriptions, due to their asynchronous nature. This wasn't really necessary for the client demo, but when I started writing tests for the module I was forced to add a bunch of callback arguments to the methods just to control the flow of the tests.
-   I would introduce some authentication dependent on the use-cases the module would need to support.
-   I would do some exploratory manual testing to uncover edge-cases that should have unit tests.
-   I would create a CI pipeline to automate testing and re-deploying on each push (I used TSDX for the module package, which comes pre-configured to use Github actions, however I discarded them for now).
-   I would add a linter to the project (and the CI pipeline) and configure it to enforce common rules and conventions.
