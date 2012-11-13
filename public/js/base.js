require([
    'jquery'
    , 'backbone'
    , 'mustache'
    , 'js/views/dashboardView'
], function (
    $
    , Backbone
    , Mustache
    , DashboardView
){
    $(function() {
        console.log( 'jquery is loaded' );
        var dashboardView = new DashboardView();
    });
});
