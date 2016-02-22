var kue = require('kue');

function Queue() {
    this.jobs = kue.createQueue();


    kue.app.set('title', 'Finalizer Queue Dashboard');
    kue.app.listen(3000);
}

/**
 * Job creation template
 * @param  {string}     jobName
 * @param  {Obaject}    data        Bundle information
 * @param  {Function}   callback
 * @return {null}
 */
Queue.prototype.create = function(jobName, data, callback) {

    var job = this.jobs.create(jobName, data)
        .removeOnComplete(true)
        .save();

    job.on('job complete', function(id) {
        console.log('job #%d', id);

    }).on('failed', function(errorMessage){
        console.log('job failed')
        console.log(errorMessage);
    });

}

function setupKueApp() {

}


module.exports = new Queue();
