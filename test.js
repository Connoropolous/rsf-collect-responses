const { expect } = require('chai')
const sinon = require('sinon')
const { rsfCollectResponses } = require('./index')
const { newMockMakeContactable } = require('rsf-contactable')

describe('#rsfCollectResponses', () => {
    context('when timeout is reached, regardless if no responses have been added', function () {
        it('should early exit and return 0 results', done => {
            rsfCollectResponses(2, '', 1000, [], results => {
                expect(results.length).to.equal(0)
                done()
            })
        })
    })

    context('when the number of participants is 1 and the process completes through user action, not the timeout', function () {
        it('the number of responses should equal the number of participants times the max number of responses per participant', done => {
            const mockMakeContactable = newMockMakeContactable(sinon.spy)
            const contactables = [{ id: 'dude' }].map(mockMakeContactable)
            rsfCollectResponses(2, '', 4000, contactables, results => {
                expect(results.length).to.equal(2)
                expect(results).to.eql([{ text: 'hi', id: 'dude' }, { text: 'hi again', id: 'dude' }])
                done()
            })
            contactables[0].trigger('hi')
            contactables[0].trigger('hi again')
        })
    })

    context('when the number of participants is 2 and the process completes through user action, not the timeout', function () {
        it('the number of responses should still equal the number of participants times the max number of responses per participant', done => {
            const mockMakeContactable = newMockMakeContactable(sinon.spy)
            const contactables = [{ id: 'p1' }, { id: 'p2' }].map(mockMakeContactable)
            rsfCollectResponses(2, '', 4000, contactables, results => {
                expect(results.length).to.equal(4)
                expect(results).to.eql([
                    { text: 'hi', id: 'p1' },
                    { text: 'hi again', id: 'p1' },
                    { text: 'idea', id: 'p2' },
                    { text: 'idea again', id: 'p2' },
                ])
                done()
            })
            contactables[0].trigger('hi')
            contactables[0].trigger('hi again')
            contactables[1].trigger('idea')
            contactables[1].trigger('idea again')
        })
    })

    context('context and rules should be conveyed', function () {
        it('should convey useful feedback to the participants', done => {
            const mockMakeContactable = newMockMakeContactable(sinon.spy)
            const contactables = [{ id: 'dude' }].map(mockMakeContactable)
            rsfCollectResponses(1, 'prompt', 4000, contactables, () => done())
            const spoken = contactables[0].speak
            expect(spoken.getCall(0).args[0]).to.equal('prompt')
            expect(spoken.getCall(1).args[0]).to.equal('The process will stop automatically after 4000 milliseconds.')
            contactables[0].trigger('hi')
            expect(spoken.getCall(2).args[0]).to.equal('You\'ve reached the limit of responses. Thanks for participating. You will be notified when everyone has completed.')
            expect(spoken.getCall(3).args[0]).to.equal('Everyone has completed. Thanks for participating.')
        })
    })
})