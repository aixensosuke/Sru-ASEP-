const config = {
    development: {
        API_URL: 'http://localhost:5000/api',
        ASSETS_URL: '/assets',
        DEBUG: true
    },
    production: {
        API_URL: 'https://api.acadcomm.com/api',
        ASSETS_URL: 'https://cdn.acadcomm.com/assets',
        DEBUG: false
    }
};

const ENV = process.env.NODE_ENV || 'development';
export default config[ENV];
