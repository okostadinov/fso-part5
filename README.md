# fso-part5

## Running the Jest tests:
```
cd bloglist-frontend/
npm run test
```

### Note on FE Jest tests:
By default one of the tests requires the button onClick event to be substituted with a mock function inside the React code.
Once done the test passes. I have left it with the default functionality in stead of the test version.

## Running the Cypress tests:

### Run BE
```
cd bloglist/
npm run test:start
```

### Run FE
```
cd bloglist-frontend/
npm start
```

### Run Cypress
```
cd bloglist-frontend/
npm run cy:open
```
