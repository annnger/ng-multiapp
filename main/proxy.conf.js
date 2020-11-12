const cfg = [
  {
    context: [
      '/app1/*.js',
      '/app1/*.html'
    ],
    target: 'http://localhost:3001/'
  },
  {
    context: [
      '/app2/*.js',
      '/app2/*.html'
    ],
    target: 'http://localhost:3002/'
  }
];

module.exports = cfg;
