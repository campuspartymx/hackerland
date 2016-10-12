// Register Layouts here
const LayoutBuilder = require('./lib/layout-builder')

LayoutBuilder.registerLayout( 'twoColumns',  require('./layouts/two-columns') )
LayoutBuilder.registerLayout( 'singleColumn',  require('./layouts/single-column') )