var post = {
  'id': '1',
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
  ],
  'tags': [
	{'tag': 'hip'},
	{'tag': 'fun'},
	{'tag': 'spunky'},
	{'tag': 'tied-up'},
	{'tag': 'fresh'},
	{'tag': 'super'}
  ]
}

exports.view = function(req, res) {
  res.render('outfit', post);
};