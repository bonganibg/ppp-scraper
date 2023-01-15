const app = require('./src/app');

const port = process.env.PORT || 8080;

app.set('port', port);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});