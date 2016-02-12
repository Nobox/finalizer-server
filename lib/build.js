var schema = require('./schema');
var Project = require('./project');

var Build = schema.define('Build', {
    project_id: { type: schema.Number, index: true },
    hash: { type: schema.String, index: true, 'null': false },
    created_at: { type: schema.Date, default: Date.now() },
    updated_at: { type: schema.Date, default: Date.now() }
});
Build.belongsTo(Project, { as: 'project', foreignKey: 'project_id' });

module.exports = Build;
