<h1 align="center">
  MOCCHI RAYCAST
  <br>
</h1>

## Key Features

- Search tokens, view detail of that tokens
    - Use https://api.mochi.pod.town/api/v1/defi/tokens to get list tokens
    - Use https://api.mochi.pod.town/api/v1/defi/coins/:id to get detail of a token
- Manage your favorite tokens, get real time token's prices
    - Store favorite tokens to localstorage 
    - Use https://api.mochi.pod.town/api/v1/defi/coins/:id to calculate token price
- Get swap rate when swap 2 tokens
    - Use https://api.mochi.pod.town/api/v1/defi/coins/:id to get 2 tokens information then calculate swap rate

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Jump-Lab/Mochi-raycast

# Go into the repository
$ cd Mochi-raycast

# Install dependencies
$ npm install

# Run the app
$ npm run dev
```

## Credits

This software uses the following open source packages:

- [Axios](https://axios-http.com/)


## License

MIT

---