var kue = require('kue');
var habitat = require('habitat');

var env = habitat.load('./.env');

function Queue() {
    this.jobs = kue.createQueue({
        redis: {
            auth: process.env.REDIS_PASSWORD
        }
    });
    this.server = false;

    // load kue server
    if (this.server) {
        kue.app.set('title', 'Finalizer Queue Dashboard');
        kue.app.listen(3000);
    }
}

/**
 * Job creation template
 * @param  {string}     jobName
 * @param  {Object}    data        Bundle information
 * @param  {Function}   callback
 * @return {null}
 */
Queue.prototype.create = function(jobName, data, callback) {
    var job = this.jobs.create(jobName, data)
        .removeOnComplete(true)
        .save();

    job.on('job complete', function(id) {
        console.log('job #%d', id);
    }).on('failed', function(errorMessage) {
        console.log('job failed');
        console.log(errorMessage);
    });
}

module.exports = new Queue();
