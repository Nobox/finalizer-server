var schema = require('./schema');
var Build = require('./build');

var Project = schema.define('Project', {
    name: { type: schema.String, limit: 255, index: true, 'null': false },
    slug: { type: schema.String, index: true, 'null': false },
    created_at: { type: schema.Date, default: Date.now() },
    updated_at: { type: schema.Date, default: Date.now() }
});
Project.validatesPresenceOf('name', 'slug');
Project.hasMany(Build, { as: 'builds', foreignKey: 'project_id' });

module.exports = Project;
