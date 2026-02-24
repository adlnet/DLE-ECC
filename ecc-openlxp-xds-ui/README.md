# OpenLXP: Experience Discovery Service UI (XDS UI)

This is the UI for the OpenLXP: Experience Discovery Service. It allows you to create and manage your own experience collection, subscribe to other people's experience collections, and search for experiences indexed in the service.

**Note: For this service to work properly you will need the XDS Backend component to accompany it.**

## 2. Environment variables
- Create a `.env` file in the root directory
- The following environment variables are required:

| Environment Variable            | Description                       |
| ------------------------------- | --------------------------------- |
| NEXT_PUBLIC_BACKEND_HOST        | The endpoint for your XDS backend |
| NEXT_PUBLIC_XAPI_LRS_ENDPOINT   | The endpoint for your SQL-LRS     |
| NEXT_PUBLIC_XAPI_LRS_KEY        | The SQL-LRS key                   |
| NEXT_PUBLIC_XAPI_LRS_SECRET     | The SQL-LRS secret                |

**Note: These environment variables need to be set up at build time**

## Testing

All of the components in the project are unit tested and are covered by the [Jest](https://jestjs.io/) testing framework. When testing components there are three key files to utilize:

1. `jest.setup.js`: This file is used to configure the testing environment including any mocks and setup functions for the code to work.
2. `mockSetUp.js`: This file is used to mock any functions that are reliant on external APIs or services.
3. `.test.js`: This file is used to test the components. Any file in the **tests** directory will be run by the testing framework as long as the child components are appended with `.test.js` or `.spec.js`.

### Our current threshold for testing coverage is:

- **Statement Coverage**: 80%
- **Branch Coverage**: 80%
- **Function Coverage**: 80%
- **Line Coverage**: 80%

## Development

### Frontend Stack Documentation

[Next.js Documentation can be found here](https://nextjs.org/docs)

[React-Query Documentation can be found here](https://react-query.tanstack.com/overview)

[TailwindCSS Documentation can be found here](https://tailwindcss.com/docs/installation)

[Axios Documentation can be found here](https://axios-http.com/docs/intro)

[HeadlessUi Documentation can be found here](https://headlessui.dev/)

### Dev Tools Documentation

[Eslint Documentation can be found here](https://eslint.org/docs/user-guide/configuring)

[Prettier Documentation can be found here](https://prettier.io/docs/en/install.html)

[Jest Documentation can be found here](https://jestjs.io/docs/en/getting-started)

