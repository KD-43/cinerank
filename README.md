# Project Summary

This is a fully interactive, single-page application that allows users to create, customize, and manage personal tier lists. The application is built on a modern, professional-grade stack, featuring a sophisticated React front-end and a serverless API backend running on Cloudflare Pages. The user interface includes a complex, multi-container, sortable drag-and-drop system powered by 'react-dnd'. It allows for precise, index-based insertion and reordering of items, even within a responsive, wrapping layout. The front-end communicates with a RESTful API that handles all data operations. For this portfolio version, the API is an "API-Aware Mock": the Cloudflare Function backend uses a stateless, in-memory database to perfectly simulate a full CRUD lifecycle. This architecture demonstrates a mastery of the full client-server data flow and secure API design, while providing a seamless demo experience without requiring a real database or user login.

# Developer Notes

Notes created by developer to keep track of any quirks or behaviors that are intended or otherwise.

## Intended Design

- Advanced State Management with Immer:
    - Architected a custom, all-in-one state management hook (useTierList) to encapsulate all complex logic.
    - Instead of a traditional useReducer, this hook leverages useImmer to provide a reducer-like API. Action functions dispatch "recipes" that describe state mutations in a simple, direct style, while Immer guarantees the immutability of the complex, nested state tree.
    - This pattern provides the predictability of a reducer with superior ergonomics and eliminates an entire class of mutation bugs.
    - The state manager includes a full undo/redo history stack, built from scratch to handle the application's specific state transitions.
- Complex UI & Drag-and-Drop (react-dnd):
    - Implemented a multi-container, sortable drag-and-drop interface.
    - Engineered a "Smart Container / Dumb Item" architecture, where container components (TierRow, UnrankedItems) are responsible for handling all drop events, including precise, index-based insertion.
    - Solved complex DND bugs, including race conditions and stale closures, by implementing the "ref pattern" to ensure event handlers always have access to the latest props.
- Serverless REST API (API-Aware Mock):
    - Designed and built a RESTful API backend using Cloudflare Functions to handle all CRUD (Create, Read, Update, Delete) operations.
    - The API acts as both an origin server for the application's data and a secure proxy gateway for fetching data from the external TMDB API.
    - Implemented RESTful conventions for endpoints, HTTP verbs, and status codes.
- Modern React Architecture & Tooling:
    - Utilized a "Smart Parent / Dumb Child" component pattern, with a top-level page component (TierListPage) orchestrating data and logic.
    - Configured a full CI/CD pipeline from GitHub to Cloudflare Pages for automatic deployments, including management of server-side secrets and SPA routing (_redirects).
    - Optimized the production build using Vite and Terser to remove console logs and minify code.


## False Errors

Currently these are known errors displayed by React's DevTools, but have been verified to NOT be true and safe to use:

- " TypeError: 'setFetchedTierList' is not a function ": This is a known FALSE error that points to 'setFetchedTierList' not being an actual function, when it factually is. When the 'handleUpdateExistingList' function fires it makes a fetch request to the Mock database using the method of 'PUT' to modify the property of an existing object. If all checks are passed within the async function of 'handleUpdateExisting', it returns a new response object that is used by the setter function of the state manager called 'setFetchedTierList', to update the main state variable with the correct object.