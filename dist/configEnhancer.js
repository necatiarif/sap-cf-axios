"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectivity_1 = require("./connectivity");
// import {https} from 'https';
// import ProxyAgent from 'https-proxy-agent';
function enhanceConfig(config, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        // add auth header
        const { destinationConfiguration } = destination;
        if (destination.authTokens && destination.authTokens[0]) {
            if (destination.authTokens[0].error) {
                throw (new Error(destination.authTokens[0].error));
            }
            config.headers = Object.assign(Object.assign({}, config.headers), { Authorization: `${destination.authTokens[0].type} ${destination.authTokens[0].value}` });
        }
        if (destinationConfiguration.ProxyType.toLowerCase() === "onpremise") {
            // connect over the cloud connector
            const connectivityValues = destinationConfiguration.Authentication === "PrincipalPropagation" ?
                yield connectivity_1.readConnectivity(destinationConfiguration.CloudConnectorLocationId, config.headers['Authorization']) :
                yield connectivity_1.readConnectivity(destinationConfiguration.CloudConnectorLocationId);
            config = Object.assign(Object.assign({}, config), { proxy: connectivityValues.proxy, headers: Object.assign(Object.assign({}, config.headers), connectivityValues.headers) });
            // if it is principal propagation ... remove the original authentication header ...
            if (destinationConfiguration.Authentication === "PrincipalPropagation") {
                delete config.headers["Authorization"];
            }
        }
        return Object.assign(Object.assign({}, config), { baseURL: destinationConfiguration.URL });
    });
}
exports.default = enhanceConfig;
