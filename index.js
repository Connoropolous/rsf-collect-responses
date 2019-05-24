const { readInput, writeOutput } = require('rsf-reader-writer')
const { makeContactable } = require('rsf-contactable')

const MAX_RESPONSES_TEXT = `You've reached the limit of responses. Thanks for participating. You will be notified when everyone has completed.`
const ALL_COMPLETED_TEXT = `Everyone has completed. Thanks for participating.`
const TIMEOUT_TEXT = `The max time has been reached. Stopping now. Thanks for participating.`
const rulesText = (maxTime) => `The process will stop automatically after ${maxTime} milliseconds.` // TODO: improve the human readable time

// a value that will mean any amount of responses can be collected
// from each person, and that the process will guaranteed last until the maxTime comes to pass
const UNLIMITED_CHAR = '*'

// needs
// maxResponses : Number | String, the number of responses to stop collecting at, use '*' for any amount
// prompt : String, the text that prompts people, and sets the rules and context
// maxTime : Number, the number of milliseconds to wait until stopping this process automatically
// contactables: [Contactable], the "contactables" array from `rsf-contactable`, or a mock... objects with `.speak` and `.listen` methods.
// callback : Function, a callback to call with only one argument which are the results

// gives
// results : [Response], array of the responses collected
// Response.text : String, the text of the response
// Response.id : String, the id of the agent who gave the response
// Response.timestamp : Number, the unix timestamp of the moment the message was received
const rsfCollectResponses = (maxResponses, prompt, maxTime, contactables, callback) => {

    if (maxResponses === UNLIMITED_CHAR) {
        maxResponses = Infinity
    }

    // array to store the results
    const results = []

    // stop the process after a maximum amount of time
    const timeoutId = setTimeout(() => {
        // complete, saving whatever results we have
        complete(TIMEOUT_TEXT)
    }, maxTime)

    // setup a completion handler that
    // can only fire once
    let calledComplete = false
    const complete = (completionText) => {
        if (!calledComplete) {
            contactables.forEach(contactable => contactable.speak(completionText))
            clearTimeout(timeoutId)
            callback(results)
            calledComplete = true
        }
    }
    
    contactables.forEach(contactable => {
        // keep track of the number of responses from this person
        let responseCount = 0

        // initiate contact with the person
        // and set context, and "rules"
        contactable.speak(prompt)
        setTimeout(() => contactable.speak(rulesText(maxTime)), 500)

        // listen for messages from them, and treat each one
        // as an input, up till the alotted amount
        contactable.listen(text => {
            if (responseCount < maxResponses) {
                results.push({
                    text,
                    id: contactable.id,
                    timestamp: Date.now()
                })
                responseCount++
            }
            // in the case where maxResponses is Infinity,
            // this will never match
            if (responseCount === maxResponses) {
                contactable.speak(MAX_RESPONSES_TEXT)
            }
            // exit when everyone has added all their alotted responses
            // in the case where maxResponses is Infinity,
            // this will never match
            if (results.length === contactables.length * maxResponses) {
                complete(ALL_COMPLETED_TEXT)
            }
        })
    })
}
module.exports.rsfCollectResponses = rsfCollectResponses

module.exports.main = (dir) => {
    const input = readInput(dir)

    const MAX_RESPONSES = input.max_responses
    const PROMPT = input.prompt
    const PARTICIPANTS_CONFIG = input.participants_config
    const MAX_TIME = input.max_time // TODO: set a default?

    // convert each config into a "contactable", with `speak` and `listen` functions
    const contactables = PARTICIPANTS_CONFIG.map(makeContactable)

    rsfCollectResponses(MAX_RESPONSES, PROMPT, MAX_TIME, contactables, results => {
        // this save the output to a file
        writeOutput(dir, results)
        // this exits the process with 'success' status
        // use exit code 1 to show error
        // allow any remaining messages to be sent
        setTimeout(() => {
            process.exit()
        }, 2000)
    })
}