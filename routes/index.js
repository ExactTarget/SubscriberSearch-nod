/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', {
    title: 'Subscriber Search - Node.js Version'
    , appName: 'Node.js Version'
    , sidebarTitle: 'Subscriber Details'
    , accessToken: req.session.token
    , expiration: req.session.expiration
    });
};
