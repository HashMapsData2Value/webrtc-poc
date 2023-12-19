# WebRTC Experiments - Web Client!

To spin up:

```
bun run dev
```

This will create a vite server serving the client at a specific port on localhost. You can open that URL in two tabs - these two tabs will constitute two peers communicating with each other.

Provided that you are running the peer server that is part of this project you should be fine with connecting to that server with the default values. However, if you want to try to connect to the cloud-hosted peer server the creators of PeerJs run, empty the input values and then try to connect.

Once you have a UUIDv4 peer identification string in one view, copy+paste it over to the other view and input it into the correct field before pressing connect. Repeat this process vice-versa with the other tab.

If everything went well you will be able to send the counterpart in the other tab a message, and see the messages sent from the counterpart in the receive field.

**Bonus**: Try killing the peer server and see if you can continue to send messages? :-)

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname
  }
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
