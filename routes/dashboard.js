exports.view = function(req, res) {
  var posts = {
    'posts': [
      {
        'title': 'Looooooookin\' CHIC',
        'user': 'Anna B.',
        'comments': '17 comments',
        'likes': '41',
        'time': '17 minutes ago',
        'caption': 'Found this and just had to share!',
        'img': 'http://i.istockimg.com/file_thumbview_approve/21076093/2/stock-photo-21076093-happy-summer-girl.jpg',
        'items': [
          {
            'title': 'Glasses',
            'x': 0.54,
            'y': 0.17
          },
          {
            'title': 'Shirt',
            'x': 0.34,
            'y': 0.6
          },
          {
            'title': 'Leggings',
            'x': 0.67,
            'y': 0.89
          }
        ]
      },
      {
        'title': 'Summer drive',
        'user': 'Kendrick.',
        'comments': '4 comments',
        'likes': '19',
        'time': '28 minutes ago',
        'caption': 'Took the car out to the hills with a couple of friends. Thought this look\'d do!',
        'img': 'http://i.istockimg.com/file_thumbview_approve/19744739/2/stock-photo-19744739-male-fashion-model-sitting-in-classic-sports-car.jpg'
      }
    ]
  };
  res.render('dashboard', posts);
};