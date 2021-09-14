const env = process.env.NODE_ENV || "production";

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
    APIKey: "L7vm2yi3QHS3XaTsb3dFtA",
    APISecret: "Bk2v5jM2jH3IMMaDPGzLjBbu3NK7YlYYBIQ6",
    email: 'lisinchyk@gmail.com'
};

// const config = {
//   development: {
//     APIKey: "L7vm2yi3QHS3XaTsb3dFtA",
//     APISecret: "Bk2v5jM2jH3IMMaDPGzLjBbu3NK7YlYYBIQ6",
//   },
//   production: {
//     APIKey: "L7vm2yi3QHS3XaTsb3dFtA",
//     APISecret: "Bk2v5jM2jH3IMMaDPGzLjBbu3NK7YlYYBIQ6",
//   },
// };

module.exports = config;