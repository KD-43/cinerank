# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Developer Notes

Notes created by developer to keep track of any quirks or behaviors that are intended or otherwise.

## False Errors

Currently these are known errors displayed by React's DevTools, but have been verified to NOT be true and safe to use:

- " TypeError: 'setFetchedTierList' is not a function ": This is a known FALSE error that points to 'setFetchedTierList' not being an actual function, when it factually is. When the 'handleUpdateExistingList' function fires it makes a fetch request to the Mock database using the method of 'PUT' to modify the property of an existing object. If all checks are passed within the async function of 'handleUpdateExisting', it returns a new response object that is used by the setter function of the state manager called 'setFetchedTierList', to update the main state variable with the correct object.