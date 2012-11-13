/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', {
    title: 'Subscriber Search'
    , appName: 'Subscriber Search'
    , sidebarTitle: 'Subscriber Details'
    , accessToken: req.session.token
    , expiration: req.session.expiration
    });
};
