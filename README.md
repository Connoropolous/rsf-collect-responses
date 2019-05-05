# rsf-collect-responses

`rsf-collect-responses` is part of the Rapid Sensemaking Framework ecosystem... please read
the [README of rsf-runner](https://github.com/rapid-sensemaking-framework/rsf-runner/blob/master/README.md) for the full context for what that is.

`rsf-collect-responses` is an [RSF Operator](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-operators)

For a prompt, collect statements numbering up to a given maximum (or unlimited) from a list of participants

## Installation

`npm install --save rsf-collect-responses`

## RSF Sequence example

The following could be used in an [RSF Sequence](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-sequences) JSON file.

```json
{
    "id": "rsf-collect-responses",
    "description": "Gather input from people based on a prompt",
    "language": "node",
    "contract": {
        "needs": {
            "max_time": "number",
            "prompt": "string",
            "max_responses": "number",
            "participants_config": [{
                "id": "string",
                "name": "string",
                "type": "string"
            }]
        },
        "gives": [{
            "text": "string",
            "id": "string",
            "timestamp": "number"
        }]
    },
    "dependencies_file": {
        "dependencies": {
            "rsf-collect-responses": "0.0.28"
        }
    },
    "code_file": "require('rsf-collect-responses').main(__dirname)"
}
```

## API

___

### `main(readWriteDir)`

executes as a process until `rsfCollectResponses` completes, at which points it writes the results to a JSON file in the given `readWriteDir` directory, and exits the process.

`readWriteDir` : `String`, the path to the directory from which to read an `input.json` file and write the `output.json` file

Expectations for `input.json`:

`input.max_responses`, for `maxResponses` in `rsfCollectResponses`

`input.prompt` for `prompt` in `rsfCollectResponses`

`input.participants_config` which it will make an `[Contactables]` using `makeContactable` from `rsf-contactable`  to pass in as `contactables` to `rsfCollectResponses`

`input.max_time`, for `maxTime` in `rsfCollectResponses`

___

### `rsfCollectResponses(maxResponses, prompt, maxTime, contactables, callback)`

The core logic for interacting with participants, timeouts, and collecting responses.

How it works:

- rules for the process will be sent to participants
- the prompt will be sent to partipants
- it will listen for any responses from each participant, and add it to the list of results if they are under the allowed `maxResponses` number
- it will stop accepting responses from a partipant if/when they reach the `maxResponses` number, and let them know
- it will let everyone know when the process has completed because the `maxTime` came to pass, or
- it will let everyone know when the process has completed because all of the participants submitted as many responses as the `maxResponses` number

`maxResponses` : `Number`, the number of responses to stop collecting at, use `*` for any amount

`prompt` : `String`, the text that prompts people, and sets the rules and context

`maxTime` : `Number`, the number of milliseconds to wait until stopping this process automatically

`contactables`: `[Contactable]`, the "contactables" array from `rsf-contactable`, or a mock... objects with `.speak` and `.listen` methods.

`callback` : `Function`, a callback to call with only one argument which are the results

`callback -> results` : `[Response]`, array of the responses collected

`Response.text` : `String`, the text of the response

`Response.id` : `String`, the id of the agent who gave the response

`Response.timestamp` : `Number`, the unix timestamp of the moment the message was received



## Development

Tests are written in mocha/chai/sinon and can be run using

```
npm test
```
