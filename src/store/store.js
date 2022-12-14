import { compose, createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { rootReducer } from "./root-reducer";

const middleWares = [logger];
const composedEnhancers = compose(applyMiddleware(...middleWares));

//root-reducer [all reducers combined]
export const store = createStore(rootReducer, undefined, composedEnhancers);
