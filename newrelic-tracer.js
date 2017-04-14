const Newrelic = require('newrelic');

function newrelicInward(ctx, data) {
    const servicePin = data.msg.meta$.pattern;

    Newrelic.setTransactionName(servicePin);
}


function newrelicTracer() {
    const seneca = this;

    seneca.inward(newrelicInward);
}

module.exports = newrelicTracer;
