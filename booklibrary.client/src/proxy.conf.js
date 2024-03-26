const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/book",
      "/addbook",
      "/removebook"
    ],
    target: "https://localhost:7019",
    secure: false
  },
]

module.exports = PROXY_CONFIG;
