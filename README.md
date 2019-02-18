## Get started


### 1. Install

```sh
yarn global add torbjorn
```

### 2. Create a config (.torbrc / .torbrc.json / .torbrc.js)

```json
[
  ["prompts", [
    {
      "type": "text",
      "name": "react_version",
      "message": "What react version would you like to use?"
    }
  ]]
  ["action", {
    "name": "install-react",
    "call": [
      ["install", [
        "react@<%= react_version %>",
        "react-dom@<%= react_version %>"
      ]]
    ]
  }]
]
```

### 3. Apply config

```sh
torbjorn run
```

## Development

```sh
yarn

yarn watch
```
