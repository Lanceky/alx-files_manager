class AppController {
  static status(req, res) {
    res.status(200).json({ status: 'OK' });
  }

  static stats(req, res) {
    // Logic for stats, could be from DB or Redis
    res.status(200).json({ stats: { files: 10, users: 5 } });
  }
}

module.exports = AppController;

