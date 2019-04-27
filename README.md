# rsf-collect-responses


## Installation
`npm install --save rsf-collect-responses`

## API

### `rsfCollectResponses(maxResponses, prompt, maxTime, contactables, callback)`

The core logic for interacting with participants, timeouts, and collecting responses.

How it works:
- rules for the process will be sent to participants
- the prompt will be sent to partipants
- it will listen for any responses from each participant, and add it to the list of results if they are under the allowed `maxResponses` number
- it will stop accepting responses from a partipant when they reach the `maxResponses` number, and let them know
- it will let everyone know when the process has completed because of the `maxTime` came to pass, or
- it will let everyone know when the process has completed because all of the participants submitted as many responses as the `maxResponses` number

`maxResponses` : `Number`, the number of responses to stop collecting at

`prompt` : `String`, the text that prompts people, and sets the rules and context

`maxTime` : `Number`, the number of milliseconds to wait until stopping this process automatically

`contactables`: `[Contactable]`, the "contactables" array from `rsf-contactable`, or a mock... objects with `.speak` and `.listen` methods.

`callback` : `Function`, a callback to call with only one argument which are the results

`callback -> results` : `[Response]`, array of the responses collected

`Response.text` : `String`, the text of the response

`Response.id` : `String`, the id of the agent who gave the response


### `main(readWriteDir)`

`readWriteDir` : `String`, the path to the directory from which to read an `input.json` file and write the `output.json` file


## Development

Tests are written in mocha/chai/sinon and can be run using
```
npm test
```
