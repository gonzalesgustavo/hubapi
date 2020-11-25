import express from 'express';
import Switchboard from './core/SwitchBoard/index';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { MiddlewareSwitch } from './core/Switches/Middleware.switch';
import Settings from './Config';
import { RouteSwitch } from './core/Switches/Routes.switch';
import { ROUTES } from './Hub/registry/route.registry';
import SwitchBoard from './core/SwitchBoard/index';
import { AppSwitch } from './core/Switches/Application.switch';

// -------> Express application

const app = express();

// -------> Switches
const middleware = new MiddlewareSwitch({
  application: app,
  middleware: [cors(), json(), urlencoded({ extended: false })],
});

const routes = new RouteSwitch({
  application: app,
  baseUrl: Settings.URL,
  modules: ROUTES,
});

const appSwitch = new AppSwitch({
  application: app,
  port: Settings.port,
});

// -------> Switchboard
const board = new SwitchBoard([
  {
    name: 'middleware',
    state: true,
    control: middleware,
  },
  {
    name: 'routes',
    state: true,
    control: routes,
  },
  {
    name: 'app',
    state: true,
    control: appSwitch,
  },
]);

board.start();

export default app;