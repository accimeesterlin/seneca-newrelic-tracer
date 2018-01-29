const Newrelic = require('newrelic');

let customParamsHandler;

function isInternalAction(msg) {
    return msg.role === 'seneca' ||
      msg.role === 'transport' ||
      msg.role === 'options' ||
      msg.role === 'mesh' ||
      msg.init;
}

function newrelicInward(ctx, { msg, err, res }) {
    if (isInternalAction(msg)) {
        return;
    }

    const servicePin = msg.meta$.pattern;
    Newrelic.setTransactionName(servicePin);
}
function newrelicOutward(ctx, { msg, err, res }) {
    if (isInternalAction(msg)) {
        return;
    }

    if (customParamsHandler) {
        const params = customParamsHandler(msg, err, res);
        Newrelic.addCustomParameters(params);
    }
}


function newrelicTracer(opts) {
    const seneca = this;
    const { customParameterHandler } = opts;
    customParamsHandler = customParameterHandler;
    seneca.inward(newrelicInward);
    seneca.outward(newrelicOutward);
}

module.exports = newrelicTracer;
