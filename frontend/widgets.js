// Register your widgets here
const LayoutBuilder = require('./lib/layout-builder')

LayoutBuilder.registerWidget( 'Alert', require('./widgets/alert') )
LayoutBuilder.registerWidget( 'Panel', require('./widgets/panel') )
LayoutBuilder.registerWidget( 'EvaluateForm', require('./components/staff/evaluate-form.jsx') )
LayoutBuilder.registerWidget( 'ReviewAlert', require('./widgets/review-alert') )
LayoutBuilder.registerWidget( 'ProjectList', require('./widgets/project-list') )
LayoutBuilder.registerWidget( 'ProjectTeam', require('./components/project/team') )
LayoutBuilder.registerWidget( 'ProjectSearch', require('./components/staff/evaluate-form') )
LayoutBuilder.registerWidget( 'QualifyAlert', require('./widgets/qualify-alert') )
LayoutBuilder.registerWidget( 'VerticalList', require('./widgets/vertical-list') )

// Useful boxes
LayoutBuilder.registerWidget( 'CurrentStage', require('./widgets/current-stage.jsx') )
LayoutBuilder.registerWidget( 'NextStage', require('./widgets/next-stage.jsx') )
LayoutBuilder.registerWidget( 'ContentBox', require('./widgets/content-box.jsx') )

// Single functionality widgets
LayoutBuilder.registerWidget( 'Tips', require('./widgets/tips.jsx') )
LayoutBuilder.registerWidget( 'QualifyList', require('./widgets/qualify-list.jsx') )
