/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@hotwired/stimulus-webpack-helpers/dist/stimulus-webpack-helpers.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@hotwired/stimulus-webpack-helpers/dist/stimulus-webpack-helpers.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "definitionForModuleAndIdentifier": () => (/* binding */ definitionForModuleAndIdentifier),
/* harmony export */   "definitionForModuleWithContextAndKey": () => (/* binding */ definitionForModuleWithContextAndKey),
/* harmony export */   "definitionsFromContext": () => (/* binding */ definitionsFromContext),
/* harmony export */   "identifierForContextKey": () => (/* binding */ identifierForContextKey)
/* harmony export */ });
/*
Stimulus Webpack Helpers 1.0.0
Copyright © 2021 Basecamp, LLC
 */
function definitionsFromContext(context) {
    return context.keys()
        .map((key) => definitionForModuleWithContextAndKey(context, key))
        .filter((value) => value);
}
function definitionForModuleWithContextAndKey(context, key) {
    const identifier = identifierForContextKey(key);
    if (identifier) {
        return definitionForModuleAndIdentifier(context(key), identifier);
    }
}
function definitionForModuleAndIdentifier(module, identifier) {
    const controllerConstructor = module.default;
    if (typeof controllerConstructor == "function") {
        return { identifier, controllerConstructor };
    }
}
function identifierForContextKey(key) {
    const logicalName = (key.match(/^(?:\.\/)?(.+)(?:[_-]controller\..+?)$/) || [])[1];
    if (logicalName) {
        return logicalName.replace(/_/g, "-").replace(/\//g, "--");
    }
}




/***/ }),

/***/ "./node_modules/@hotwired/stimulus/dist/stimulus.js":
/*!**********************************************************!*\
  !*** ./node_modules/@hotwired/stimulus/dist/stimulus.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Application": () => (/* binding */ Application),
/* harmony export */   "AttributeObserver": () => (/* binding */ AttributeObserver),
/* harmony export */   "Context": () => (/* binding */ Context),
/* harmony export */   "Controller": () => (/* binding */ Controller),
/* harmony export */   "ElementObserver": () => (/* binding */ ElementObserver),
/* harmony export */   "IndexedMultimap": () => (/* binding */ IndexedMultimap),
/* harmony export */   "Multimap": () => (/* binding */ Multimap),
/* harmony export */   "StringMapObserver": () => (/* binding */ StringMapObserver),
/* harmony export */   "TokenListObserver": () => (/* binding */ TokenListObserver),
/* harmony export */   "ValueListObserver": () => (/* binding */ ValueListObserver),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "defaultSchema": () => (/* binding */ defaultSchema),
/* harmony export */   "del": () => (/* binding */ del),
/* harmony export */   "fetch": () => (/* binding */ fetch),
/* harmony export */   "prune": () => (/* binding */ prune)
/* harmony export */ });
/*
Stimulus 3.1.0
Copyright © 2022 Basecamp, LLC
 */
class EventListener {
    constructor(eventTarget, eventName, eventOptions) {
        this.eventTarget = eventTarget;
        this.eventName = eventName;
        this.eventOptions = eventOptions;
        this.unorderedBindings = new Set();
    }
    connect() {
        this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
        this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
        this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
        this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
        const extendedEvent = extendEvent(event);
        for (const binding of this.bindings) {
            if (extendedEvent.immediatePropagationStopped) {
                break;
            }
            else {
                binding.handleEvent(extendedEvent);
            }
        }
    }
    get bindings() {
        return Array.from(this.unorderedBindings).sort((left, right) => {
            const leftIndex = left.index, rightIndex = right.index;
            return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
        });
    }
}
function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
        return event;
    }
    else {
        const { stopImmediatePropagation } = event;
        return Object.assign(event, {
            immediatePropagationStopped: false,
            stopImmediatePropagation() {
                this.immediatePropagationStopped = true;
                stopImmediatePropagation.call(this);
            }
        });
    }
}

class Dispatcher {
    constructor(application) {
        this.application = application;
        this.eventListenerMaps = new Map;
        this.started = false;
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.eventListeners.forEach(eventListener => eventListener.connect());
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            this.eventListeners.forEach(eventListener => eventListener.disconnect());
        }
    }
    get eventListeners() {
        return Array.from(this.eventListenerMaps.values())
            .reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
        this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding) {
        this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
    }
    handleError(error, message, detail = {}) {
        this.application.handleError(error, `Error ${message}`, detail);
    }
    fetchEventListenerForBinding(binding) {
        const { eventTarget, eventName, eventOptions } = binding;
        return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
        const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
        const cacheKey = this.cacheKey(eventName, eventOptions);
        let eventListener = eventListenerMap.get(cacheKey);
        if (!eventListener) {
            eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
            eventListenerMap.set(cacheKey, eventListener);
        }
        return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
        const eventListener = new EventListener(eventTarget, eventName, eventOptions);
        if (this.started) {
            eventListener.connect();
        }
        return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
        let eventListenerMap = this.eventListenerMaps.get(eventTarget);
        if (!eventListenerMap) {
            eventListenerMap = new Map;
            this.eventListenerMaps.set(eventTarget, eventListenerMap);
        }
        return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
        const parts = [eventName];
        Object.keys(eventOptions).sort().forEach(key => {
            parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
        });
        return parts.join(":");
    }
}

const descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;
function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    return {
        eventTarget: parseEventTarget(matches[4]),
        eventName: matches[2],
        eventOptions: matches[9] ? parseEventOptions(matches[9]) : {},
        identifier: matches[5],
        methodName: matches[7]
    };
}
function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
        return window;
    }
    else if (eventTargetName == "document") {
        return document;
    }
}
function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
}
function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
        return "window";
    }
    else if (eventTarget == document) {
        return "document";
    }
}

function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
}
function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
}

class Action {
    constructor(element, index, descriptor) {
        this.element = element;
        this.index = index;
        this.eventTarget = descriptor.eventTarget || element;
        this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
        this.eventOptions = descriptor.eventOptions || {};
        this.identifier = descriptor.identifier || error("missing identifier");
        this.methodName = descriptor.methodName || error("missing method name");
    }
    static forToken(token) {
        return new this(token.element, token.index, parseActionDescriptorString(token.content));
    }
    toString() {
        const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : "";
        return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`;
    }
    get params() {
        const params = {};
        const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`);
        for (const { name, value } of Array.from(this.element.attributes)) {
            const match = name.match(pattern);
            const key = match && match[1];
            if (key) {
                params[camelize(key)] = typecast(value);
            }
        }
        return params;
    }
    get eventTargetName() {
        return stringifyEventTarget(this.eventTarget);
    }
}
const defaultEventNames = {
    "a": e => "click",
    "button": e => "click",
    "form": e => "submit",
    "details": e => "toggle",
    "input": e => e.getAttribute("type") == "submit" ? "click" : "input",
    "select": e => "change",
    "textarea": e => "input"
};
function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
        return defaultEventNames[tagName](element);
    }
}
function error(message) {
    throw new Error(message);
}
function typecast(value) {
    try {
        return JSON.parse(value);
    }
    catch (o_O) {
        return value;
    }
}

class Binding {
    constructor(context, action) {
        this.context = context;
        this.action = action;
    }
    get index() {
        return this.action.index;
    }
    get eventTarget() {
        return this.action.eventTarget;
    }
    get eventOptions() {
        return this.action.eventOptions;
    }
    get identifier() {
        return this.context.identifier;
    }
    handleEvent(event) {
        if (this.willBeInvokedByEvent(event) && this.shouldBeInvokedPerSelf(event)) {
            this.processStopPropagation(event);
            this.processPreventDefault(event);
            this.invokeWithEvent(event);
        }
    }
    get eventName() {
        return this.action.eventName;
    }
    get method() {
        const method = this.controller[this.methodName];
        if (typeof method == "function") {
            return method;
        }
        throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    processStopPropagation(event) {
        if (this.eventOptions.stop) {
            event.stopPropagation();
        }
    }
    processPreventDefault(event) {
        if (this.eventOptions.prevent) {
            event.preventDefault();
        }
    }
    invokeWithEvent(event) {
        const { target, currentTarget } = event;
        try {
            const { params } = this.action;
            const actionEvent = Object.assign(event, { params });
            this.method.call(this.controller, actionEvent);
            this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
        }
        catch (error) {
            const { identifier, controller, element, index } = this;
            const detail = { identifier, controller, element, index, event };
            this.context.handleError(error, `invoking action "${this.action}"`, detail);
        }
    }
    shouldBeInvokedPerSelf(event) {
        if (this.action.eventOptions.self === true) {
            return this.action.element === event.target;
        }
        else {
            return true;
        }
    }
    willBeInvokedByEvent(event) {
        const eventTarget = event.target;
        if (this.element === eventTarget) {
            return true;
        }
        else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
            return this.scope.containsElement(eventTarget);
        }
        else {
            return this.scope.containsElement(this.action.element);
        }
    }
    get controller() {
        return this.context.controller;
    }
    get methodName() {
        return this.action.methodName;
    }
    get element() {
        return this.scope.element;
    }
    get scope() {
        return this.context.scope;
    }
}

class ElementObserver {
    constructor(element, delegate) {
        this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
        this.element = element;
        this.started = false;
        this.delegate = delegate;
        this.elements = new Set;
        this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.mutationObserver.observe(this.element, this.mutationObserverInit);
            this.refresh();
        }
    }
    pause(callback) {
        if (this.started) {
            this.mutationObserver.disconnect();
            this.started = false;
        }
        callback();
        if (!this.started) {
            this.mutationObserver.observe(this.element, this.mutationObserverInit);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    }
    refresh() {
        if (this.started) {
            const matches = new Set(this.matchElementsInTree());
            for (const element of Array.from(this.elements)) {
                if (!matches.has(element)) {
                    this.removeElement(element);
                }
            }
            for (const element of Array.from(matches)) {
                this.addElement(element);
            }
        }
    }
    processMutations(mutations) {
        if (this.started) {
            for (const mutation of mutations) {
                this.processMutation(mutation);
            }
        }
    }
    processMutation(mutation) {
        if (mutation.type == "attributes") {
            this.processAttributeChange(mutation.target, mutation.attributeName);
        }
        else if (mutation.type == "childList") {
            this.processRemovedNodes(mutation.removedNodes);
            this.processAddedNodes(mutation.addedNodes);
        }
    }
    processAttributeChange(node, attributeName) {
        const element = node;
        if (this.elements.has(element)) {
            if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
                this.delegate.elementAttributeChanged(element, attributeName);
            }
            else {
                this.removeElement(element);
            }
        }
        else if (this.matchElement(element)) {
            this.addElement(element);
        }
    }
    processRemovedNodes(nodes) {
        for (const node of Array.from(nodes)) {
            const element = this.elementFromNode(node);
            if (element) {
                this.processTree(element, this.removeElement);
            }
        }
    }
    processAddedNodes(nodes) {
        for (const node of Array.from(nodes)) {
            const element = this.elementFromNode(node);
            if (element && this.elementIsActive(element)) {
                this.processTree(element, this.addElement);
            }
        }
    }
    matchElement(element) {
        return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
        return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
        for (const element of this.matchElementsInTree(tree)) {
            processor.call(this, element);
        }
    }
    elementFromNode(node) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            return node;
        }
    }
    elementIsActive(element) {
        if (element.isConnected != this.element.isConnected) {
            return false;
        }
        else {
            return this.element.contains(element);
        }
    }
    addElement(element) {
        if (!this.elements.has(element)) {
            if (this.elementIsActive(element)) {
                this.elements.add(element);
                if (this.delegate.elementMatched) {
                    this.delegate.elementMatched(element);
                }
            }
        }
    }
    removeElement(element) {
        if (this.elements.has(element)) {
            this.elements.delete(element);
            if (this.delegate.elementUnmatched) {
                this.delegate.elementUnmatched(element);
            }
        }
    }
}

class AttributeObserver {
    constructor(element, attributeName, delegate) {
        this.attributeName = attributeName;
        this.delegate = delegate;
        this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
        return this.elementObserver.element;
    }
    get selector() {
        return `[${this.attributeName}]`;
    }
    start() {
        this.elementObserver.start();
    }
    pause(callback) {
        this.elementObserver.pause(callback);
    }
    stop() {
        this.elementObserver.stop();
    }
    refresh() {
        this.elementObserver.refresh();
    }
    get started() {
        return this.elementObserver.started;
    }
    matchElement(element) {
        return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
        const match = this.matchElement(tree) ? [tree] : [];
        const matches = Array.from(tree.querySelectorAll(this.selector));
        return match.concat(matches);
    }
    elementMatched(element) {
        if (this.delegate.elementMatchedAttribute) {
            this.delegate.elementMatchedAttribute(element, this.attributeName);
        }
    }
    elementUnmatched(element) {
        if (this.delegate.elementUnmatchedAttribute) {
            this.delegate.elementUnmatchedAttribute(element, this.attributeName);
        }
    }
    elementAttributeChanged(element, attributeName) {
        if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
            this.delegate.elementAttributeValueChanged(element, attributeName);
        }
    }
}

class StringMapObserver {
    constructor(element, delegate) {
        this.element = element;
        this.delegate = delegate;
        this.started = false;
        this.stringMap = new Map;
        this.mutationObserver = new MutationObserver(mutations => this.processMutations(mutations));
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
            this.refresh();
        }
    }
    stop() {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    }
    refresh() {
        if (this.started) {
            for (const attributeName of this.knownAttributeNames) {
                this.refreshAttribute(attributeName, null);
            }
        }
    }
    processMutations(mutations) {
        if (this.started) {
            for (const mutation of mutations) {
                this.processMutation(mutation);
            }
        }
    }
    processMutation(mutation) {
        const attributeName = mutation.attributeName;
        if (attributeName) {
            this.refreshAttribute(attributeName, mutation.oldValue);
        }
    }
    refreshAttribute(attributeName, oldValue) {
        const key = this.delegate.getStringMapKeyForAttribute(attributeName);
        if (key != null) {
            if (!this.stringMap.has(attributeName)) {
                this.stringMapKeyAdded(key, attributeName);
            }
            const value = this.element.getAttribute(attributeName);
            if (this.stringMap.get(attributeName) != value) {
                this.stringMapValueChanged(value, key, oldValue);
            }
            if (value == null) {
                const oldValue = this.stringMap.get(attributeName);
                this.stringMap.delete(attributeName);
                if (oldValue)
                    this.stringMapKeyRemoved(key, attributeName, oldValue);
            }
            else {
                this.stringMap.set(attributeName, value);
            }
        }
    }
    stringMapKeyAdded(key, attributeName) {
        if (this.delegate.stringMapKeyAdded) {
            this.delegate.stringMapKeyAdded(key, attributeName);
        }
    }
    stringMapValueChanged(value, key, oldValue) {
        if (this.delegate.stringMapValueChanged) {
            this.delegate.stringMapValueChanged(value, key, oldValue);
        }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
        if (this.delegate.stringMapKeyRemoved) {
            this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
        }
    }
    get knownAttributeNames() {
        return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
        return Array.from(this.element.attributes).map(attribute => attribute.name);
    }
    get recordedAttributeNames() {
        return Array.from(this.stringMap.keys());
    }
}

function add(map, key, value) {
    fetch(map, key).add(value);
}
function del(map, key, value) {
    fetch(map, key).delete(value);
    prune(map, key);
}
function fetch(map, key) {
    let values = map.get(key);
    if (!values) {
        values = new Set();
        map.set(key, values);
    }
    return values;
}
function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
        map.delete(key);
    }
}

class Multimap {
    constructor() {
        this.valuesByKey = new Map();
    }
    get keys() {
        return Array.from(this.valuesByKey.keys());
    }
    get values() {
        const sets = Array.from(this.valuesByKey.values());
        return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
        const sets = Array.from(this.valuesByKey.values());
        return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
        add(this.valuesByKey, key, value);
    }
    delete(key, value) {
        del(this.valuesByKey, key, value);
    }
    has(key, value) {
        const values = this.valuesByKey.get(key);
        return values != null && values.has(value);
    }
    hasKey(key) {
        return this.valuesByKey.has(key);
    }
    hasValue(value) {
        const sets = Array.from(this.valuesByKey.values());
        return sets.some(set => set.has(value));
    }
    getValuesForKey(key) {
        const values = this.valuesByKey.get(key);
        return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
        return Array.from(this.valuesByKey)
            .filter(([key, values]) => values.has(value))
            .map(([key, values]) => key);
    }
}

class IndexedMultimap extends Multimap {
    constructor() {
        super();
        this.keysByValue = new Map;
    }
    get values() {
        return Array.from(this.keysByValue.keys());
    }
    add(key, value) {
        super.add(key, value);
        add(this.keysByValue, value, key);
    }
    delete(key, value) {
        super.delete(key, value);
        del(this.keysByValue, value, key);
    }
    hasValue(value) {
        return this.keysByValue.has(value);
    }
    getKeysForValue(value) {
        const set = this.keysByValue.get(value);
        return set ? Array.from(set) : [];
    }
}

class TokenListObserver {
    constructor(element, attributeName, delegate) {
        this.attributeObserver = new AttributeObserver(element, attributeName, this);
        this.delegate = delegate;
        this.tokensByElement = new Multimap;
    }
    get started() {
        return this.attributeObserver.started;
    }
    start() {
        this.attributeObserver.start();
    }
    pause(callback) {
        this.attributeObserver.pause(callback);
    }
    stop() {
        this.attributeObserver.stop();
    }
    refresh() {
        this.attributeObserver.refresh();
    }
    get element() {
        return this.attributeObserver.element;
    }
    get attributeName() {
        return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
        this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
        const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
        this.tokensUnmatched(unmatchedTokens);
        this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
        this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
        tokens.forEach(token => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
        tokens.forEach(token => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
        this.delegate.tokenMatched(token);
        this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
        this.delegate.tokenUnmatched(token);
        this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
        const previousTokens = this.tokensByElement.getValuesForKey(element);
        const currentTokens = this.readTokensForElement(element);
        const firstDifferingIndex = zip(previousTokens, currentTokens)
            .findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
        if (firstDifferingIndex == -1) {
            return [[], []];
        }
        else {
            return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
        }
    }
    readTokensForElement(element) {
        const attributeName = this.attributeName;
        const tokenString = element.getAttribute(attributeName) || "";
        return parseTokenString(tokenString, element, attributeName);
    }
}
function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter(content => content.length)
        .map((content, index) => ({ element, attributeName, content, index }));
}
function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_, index) => [left[index], right[index]]);
}
function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
}

class ValueListObserver {
    constructor(element, attributeName, delegate) {
        this.tokenListObserver = new TokenListObserver(element, attributeName, this);
        this.delegate = delegate;
        this.parseResultsByToken = new WeakMap;
        this.valuesByTokenByElement = new WeakMap;
    }
    get started() {
        return this.tokenListObserver.started;
    }
    start() {
        this.tokenListObserver.start();
    }
    stop() {
        this.tokenListObserver.stop();
    }
    refresh() {
        this.tokenListObserver.refresh();
    }
    get element() {
        return this.tokenListObserver.element;
    }
    get attributeName() {
        return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
        const { element } = token;
        const { value } = this.fetchParseResultForToken(token);
        if (value) {
            this.fetchValuesByTokenForElement(element).set(token, value);
            this.delegate.elementMatchedValue(element, value);
        }
    }
    tokenUnmatched(token) {
        const { element } = token;
        const { value } = this.fetchParseResultForToken(token);
        if (value) {
            this.fetchValuesByTokenForElement(element).delete(token);
            this.delegate.elementUnmatchedValue(element, value);
        }
    }
    fetchParseResultForToken(token) {
        let parseResult = this.parseResultsByToken.get(token);
        if (!parseResult) {
            parseResult = this.parseToken(token);
            this.parseResultsByToken.set(token, parseResult);
        }
        return parseResult;
    }
    fetchValuesByTokenForElement(element) {
        let valuesByToken = this.valuesByTokenByElement.get(element);
        if (!valuesByToken) {
            valuesByToken = new Map;
            this.valuesByTokenByElement.set(element, valuesByToken);
        }
        return valuesByToken;
    }
    parseToken(token) {
        try {
            const value = this.delegate.parseValueForToken(token);
            return { value };
        }
        catch (error) {
            return { error };
        }
    }
}

class BindingObserver {
    constructor(context, delegate) {
        this.context = context;
        this.delegate = delegate;
        this.bindingsByAction = new Map;
    }
    start() {
        if (!this.valueListObserver) {
            this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
            this.valueListObserver.start();
        }
    }
    stop() {
        if (this.valueListObserver) {
            this.valueListObserver.stop();
            delete this.valueListObserver;
            this.disconnectAllActions();
        }
    }
    get element() {
        return this.context.element;
    }
    get identifier() {
        return this.context.identifier;
    }
    get actionAttribute() {
        return this.schema.actionAttribute;
    }
    get schema() {
        return this.context.schema;
    }
    get bindings() {
        return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
        const binding = new Binding(this.context, action);
        this.bindingsByAction.set(action, binding);
        this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
        const binding = this.bindingsByAction.get(action);
        if (binding) {
            this.bindingsByAction.delete(action);
            this.delegate.bindingDisconnected(binding);
        }
    }
    disconnectAllActions() {
        this.bindings.forEach(binding => this.delegate.bindingDisconnected(binding));
        this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
        const action = Action.forToken(token);
        if (action.identifier == this.identifier) {
            return action;
        }
    }
    elementMatchedValue(element, action) {
        this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
        this.disconnectAction(action);
    }
}

class ValueObserver {
    constructor(context, receiver) {
        this.context = context;
        this.receiver = receiver;
        this.stringMapObserver = new StringMapObserver(this.element, this);
        this.valueDescriptorMap = this.controller.valueDescriptorMap;
    }
    start() {
        this.stringMapObserver.start();
        this.invokeChangedCallbacksForDefaultValues();
    }
    stop() {
        this.stringMapObserver.stop();
    }
    get element() {
        return this.context.element;
    }
    get controller() {
        return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
        if (attributeName in this.valueDescriptorMap) {
            return this.valueDescriptorMap[attributeName].name;
        }
    }
    stringMapKeyAdded(key, attributeName) {
        const descriptor = this.valueDescriptorMap[attributeName];
        if (!this.hasValue(key)) {
            this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
        }
    }
    stringMapValueChanged(value, name, oldValue) {
        const descriptor = this.valueDescriptorNameMap[name];
        if (value === null)
            return;
        if (oldValue === null) {
            oldValue = descriptor.writer(descriptor.defaultValue);
        }
        this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
        const descriptor = this.valueDescriptorNameMap[key];
        if (this.hasValue(key)) {
            this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
        }
        else {
            this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
        }
    }
    invokeChangedCallbacksForDefaultValues() {
        for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
            if (defaultValue != undefined && !this.controller.data.has(key)) {
                this.invokeChangedCallback(name, writer(defaultValue), undefined);
            }
        }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
        const changedMethodName = `${name}Changed`;
        const changedMethod = this.receiver[changedMethodName];
        if (typeof changedMethod == "function") {
            const descriptor = this.valueDescriptorNameMap[name];
            try {
                const value = descriptor.reader(rawValue);
                let oldValue = rawOldValue;
                if (rawOldValue) {
                    oldValue = descriptor.reader(rawOldValue);
                }
                changedMethod.call(this.receiver, value, oldValue);
            }
            catch (error) {
                if (!(error instanceof TypeError))
                    throw error;
                throw new TypeError(`Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error.message}`);
            }
        }
    }
    get valueDescriptors() {
        const { valueDescriptorMap } = this;
        return Object.keys(valueDescriptorMap).map(key => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
        const descriptors = {};
        Object.keys(this.valueDescriptorMap).forEach(key => {
            const descriptor = this.valueDescriptorMap[key];
            descriptors[descriptor.name] = descriptor;
        });
        return descriptors;
    }
    hasValue(attributeName) {
        const descriptor = this.valueDescriptorNameMap[attributeName];
        const hasMethodName = `has${capitalize(descriptor.name)}`;
        return this.receiver[hasMethodName];
    }
}

class TargetObserver {
    constructor(context, delegate) {
        this.context = context;
        this.delegate = delegate;
        this.targetsByName = new Multimap;
    }
    start() {
        if (!this.tokenListObserver) {
            this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
            this.tokenListObserver.start();
        }
    }
    stop() {
        if (this.tokenListObserver) {
            this.disconnectAllTargets();
            this.tokenListObserver.stop();
            delete this.tokenListObserver;
        }
    }
    tokenMatched({ element, content: name }) {
        if (this.scope.containsElement(element)) {
            this.connectTarget(element, name);
        }
    }
    tokenUnmatched({ element, content: name }) {
        this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
        var _a;
        if (!this.targetsByName.has(name, element)) {
            this.targetsByName.add(name, element);
            (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
        }
    }
    disconnectTarget(element, name) {
        var _a;
        if (this.targetsByName.has(name, element)) {
            this.targetsByName.delete(name, element);
            (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
        }
    }
    disconnectAllTargets() {
        for (const name of this.targetsByName.keys) {
            for (const element of this.targetsByName.getValuesForKey(name)) {
                this.disconnectTarget(element, name);
            }
        }
    }
    get attributeName() {
        return `data-${this.context.identifier}-target`;
    }
    get element() {
        return this.context.element;
    }
    get scope() {
        return this.context.scope;
    }
}

class Context {
    constructor(module, scope) {
        this.logDebugActivity = (functionName, detail = {}) => {
            const { identifier, controller, element } = this;
            detail = Object.assign({ identifier, controller, element }, detail);
            this.application.logDebugActivity(this.identifier, functionName, detail);
        };
        this.module = module;
        this.scope = scope;
        this.controller = new module.controllerConstructor(this);
        this.bindingObserver = new BindingObserver(this, this.dispatcher);
        this.valueObserver = new ValueObserver(this, this.controller);
        this.targetObserver = new TargetObserver(this, this);
        try {
            this.controller.initialize();
            this.logDebugActivity("initialize");
        }
        catch (error) {
            this.handleError(error, "initializing controller");
        }
    }
    connect() {
        this.bindingObserver.start();
        this.valueObserver.start();
        this.targetObserver.start();
        try {
            this.controller.connect();
            this.logDebugActivity("connect");
        }
        catch (error) {
            this.handleError(error, "connecting controller");
        }
    }
    disconnect() {
        try {
            this.controller.disconnect();
            this.logDebugActivity("disconnect");
        }
        catch (error) {
            this.handleError(error, "disconnecting controller");
        }
        this.targetObserver.stop();
        this.valueObserver.stop();
        this.bindingObserver.stop();
    }
    get application() {
        return this.module.application;
    }
    get identifier() {
        return this.module.identifier;
    }
    get schema() {
        return this.application.schema;
    }
    get dispatcher() {
        return this.application.dispatcher;
    }
    get element() {
        return this.scope.element;
    }
    get parentElement() {
        return this.element.parentElement;
    }
    handleError(error, message, detail = {}) {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.handleError(error, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
        this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
        this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    invokeControllerMethod(methodName, ...args) {
        const controller = this.controller;
        if (typeof controller[methodName] == "function") {
            controller[methodName](...args);
        }
    }
}

function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor) => {
        getOwnStaticArrayValues(constructor, propertyName).forEach(name => values.add(name));
        return values;
    }, new Set));
}
function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor) => {
        pairs.push(...getOwnStaticObjectPairs(constructor, propertyName));
        return pairs;
    }, []);
}
function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
        ancestors.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
}
function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
}
function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map(key => [key, definition[key]]) : [];
}

function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
}
function shadow(constructor, properties) {
    const shadowConstructor = extend(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
}
function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
        const properties = blessing(constructor);
        for (const key in properties) {
            const descriptor = blessedProperties[key] || {};
            blessedProperties[key] = Object.assign(descriptor, properties[key]);
        }
        return blessedProperties;
    }, {});
}
function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
        const descriptor = getShadowedDescriptor(prototype, properties, key);
        if (descriptor) {
            Object.assign(shadowProperties, { [key]: descriptor });
        }
        return shadowProperties;
    }, {});
}
function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
        const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
        if (shadowingDescriptor) {
            descriptor.get = shadowingDescriptor.get || descriptor.get;
            descriptor.set = shadowingDescriptor.set || descriptor.set;
        }
        return descriptor;
    }
}
const getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
        return (object) => [
            ...Object.getOwnPropertyNames(object),
            ...Object.getOwnPropertySymbols(object)
        ];
    }
    else {
        return Object.getOwnPropertyNames;
    }
})();
const extend = (() => {
    function extendWithReflect(constructor) {
        function extended() {
            return Reflect.construct(constructor, arguments, new.target);
        }
        extended.prototype = Object.create(constructor.prototype, {
            constructor: { value: extended }
        });
        Reflect.setPrototypeOf(extended, constructor);
        return extended;
    }
    function testReflectExtension() {
        const a = function () { this.a.call(this); };
        const b = extendWithReflect(a);
        b.prototype.a = function () { };
        return new b;
    }
    try {
        testReflectExtension();
        return extendWithReflect;
    }
    catch (error) {
        return (constructor) => class extended extends constructor {
        };
    }
})();

function blessDefinition(definition) {
    return {
        identifier: definition.identifier,
        controllerConstructor: bless(definition.controllerConstructor)
    };
}

class Module {
    constructor(application, definition) {
        this.application = application;
        this.definition = blessDefinition(definition);
        this.contextsByScope = new WeakMap;
        this.connectedContexts = new Set;
    }
    get identifier() {
        return this.definition.identifier;
    }
    get controllerConstructor() {
        return this.definition.controllerConstructor;
    }
    get contexts() {
        return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
        const context = this.fetchContextForScope(scope);
        this.connectedContexts.add(context);
        context.connect();
    }
    disconnectContextForScope(scope) {
        const context = this.contextsByScope.get(scope);
        if (context) {
            this.connectedContexts.delete(context);
            context.disconnect();
        }
    }
    fetchContextForScope(scope) {
        let context = this.contextsByScope.get(scope);
        if (!context) {
            context = new Context(this, scope);
            this.contextsByScope.set(scope, context);
        }
        return context;
    }
}

class ClassMap {
    constructor(scope) {
        this.scope = scope;
    }
    has(name) {
        return this.data.has(this.getDataKey(name));
    }
    get(name) {
        return this.getAll(name)[0];
    }
    getAll(name) {
        const tokenString = this.data.get(this.getDataKey(name)) || "";
        return tokenize(tokenString);
    }
    getAttributeName(name) {
        return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
        return `${name}-class`;
    }
    get data() {
        return this.scope.data;
    }
}

class DataMap {
    constructor(scope) {
        this.scope = scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get(key) {
        const name = this.getAttributeNameForKey(key);
        return this.element.getAttribute(name);
    }
    set(key, value) {
        const name = this.getAttributeNameForKey(key);
        this.element.setAttribute(name, value);
        return this.get(key);
    }
    has(key) {
        const name = this.getAttributeNameForKey(key);
        return this.element.hasAttribute(name);
    }
    delete(key) {
        if (this.has(key)) {
            const name = this.getAttributeNameForKey(key);
            this.element.removeAttribute(name);
            return true;
        }
        else {
            return false;
        }
    }
    getAttributeNameForKey(key) {
        return `data-${this.identifier}-${dasherize(key)}`;
    }
}

class Guide {
    constructor(logger) {
        this.warnedKeysByObject = new WeakMap;
        this.logger = logger;
    }
    warn(object, key, message) {
        let warnedKeys = this.warnedKeysByObject.get(object);
        if (!warnedKeys) {
            warnedKeys = new Set;
            this.warnedKeysByObject.set(object, warnedKeys);
        }
        if (!warnedKeys.has(key)) {
            warnedKeys.add(key);
            this.logger.warn(message, object);
        }
    }
}

function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
}

class TargetSet {
    constructor(scope) {
        this.scope = scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get schema() {
        return this.scope.schema;
    }
    has(targetName) {
        return this.find(targetName) != null;
    }
    find(...targetNames) {
        return targetNames.reduce((target, targetName) => target
            || this.findTarget(targetName)
            || this.findLegacyTarget(targetName), undefined);
    }
    findAll(...targetNames) {
        return targetNames.reduce((targets, targetName) => [
            ...targets,
            ...this.findAllTargets(targetName),
            ...this.findAllLegacyTargets(targetName)
        ], []);
    }
    findTarget(targetName) {
        const selector = this.getSelectorForTargetName(targetName);
        return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
        const selector = this.getSelectorForTargetName(targetName);
        return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
        const attributeName = this.schema.targetAttributeForScope(this.identifier);
        return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
        const selector = this.getLegacySelectorForTargetName(targetName);
        return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
        const selector = this.getLegacySelectorForTargetName(targetName);
        return this.scope.findAllElements(selector).map(element => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
        const targetDescriptor = `${this.identifier}.${targetName}`;
        return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
        if (element) {
            const { identifier } = this;
            const attributeName = this.schema.targetAttribute;
            const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
            this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". ` +
                `The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
        }
        return element;
    }
    get guide() {
        return this.scope.guide;
    }
}

class Scope {
    constructor(schema, element, identifier, logger) {
        this.targets = new TargetSet(this);
        this.classes = new ClassMap(this);
        this.data = new DataMap(this);
        this.containsElement = (element) => {
            return element.closest(this.controllerSelector) === this.element;
        };
        this.schema = schema;
        this.element = element;
        this.identifier = identifier;
        this.guide = new Guide(logger);
    }
    findElement(selector) {
        return this.element.matches(selector)
            ? this.element
            : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
        return [
            ...this.element.matches(selector) ? [this.element] : [],
            ...this.queryElements(selector).filter(this.containsElement)
        ];
    }
    queryElements(selector) {
        return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
        return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
}

class ScopeObserver {
    constructor(element, schema, delegate) {
        this.element = element;
        this.schema = schema;
        this.delegate = delegate;
        this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
        this.scopesByIdentifierByElement = new WeakMap;
        this.scopeReferenceCounts = new WeakMap;
    }
    start() {
        this.valueListObserver.start();
    }
    stop() {
        this.valueListObserver.stop();
    }
    get controllerAttribute() {
        return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
        const { element, content: identifier } = token;
        const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
        let scope = scopesByIdentifier.get(identifier);
        if (!scope) {
            scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
            scopesByIdentifier.set(identifier, scope);
        }
        return scope;
    }
    elementMatchedValue(element, value) {
        const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
        this.scopeReferenceCounts.set(value, referenceCount);
        if (referenceCount == 1) {
            this.delegate.scopeConnected(value);
        }
    }
    elementUnmatchedValue(element, value) {
        const referenceCount = this.scopeReferenceCounts.get(value);
        if (referenceCount) {
            this.scopeReferenceCounts.set(value, referenceCount - 1);
            if (referenceCount == 1) {
                this.delegate.scopeDisconnected(value);
            }
        }
    }
    fetchScopesByIdentifierForElement(element) {
        let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
        if (!scopesByIdentifier) {
            scopesByIdentifier = new Map;
            this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
        }
        return scopesByIdentifier;
    }
}

class Router {
    constructor(application) {
        this.application = application;
        this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
        this.scopesByIdentifier = new Multimap;
        this.modulesByIdentifier = new Map;
    }
    get element() {
        return this.application.element;
    }
    get schema() {
        return this.application.schema;
    }
    get logger() {
        return this.application.logger;
    }
    get controllerAttribute() {
        return this.schema.controllerAttribute;
    }
    get modules() {
        return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
        return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
        this.scopeObserver.start();
    }
    stop() {
        this.scopeObserver.stop();
    }
    loadDefinition(definition) {
        this.unloadIdentifier(definition.identifier);
        const module = new Module(this.application, definition);
        this.connectModule(module);
    }
    unloadIdentifier(identifier) {
        const module = this.modulesByIdentifier.get(identifier);
        if (module) {
            this.disconnectModule(module);
        }
    }
    getContextForElementAndIdentifier(element, identifier) {
        const module = this.modulesByIdentifier.get(identifier);
        if (module) {
            return module.contexts.find(context => context.element == element);
        }
    }
    handleError(error, message, detail) {
        this.application.handleError(error, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
        return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
        this.scopesByIdentifier.add(scope.identifier, scope);
        const module = this.modulesByIdentifier.get(scope.identifier);
        if (module) {
            module.connectContextForScope(scope);
        }
    }
    scopeDisconnected(scope) {
        this.scopesByIdentifier.delete(scope.identifier, scope);
        const module = this.modulesByIdentifier.get(scope.identifier);
        if (module) {
            module.disconnectContextForScope(scope);
        }
    }
    connectModule(module) {
        this.modulesByIdentifier.set(module.identifier, module);
        const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
        scopes.forEach(scope => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
        this.modulesByIdentifier.delete(module.identifier);
        const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
        scopes.forEach(scope => module.disconnectContextForScope(scope));
    }
}

const defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: identifier => `data-${identifier}-target`
};

class Application {
    constructor(element = document.documentElement, schema = defaultSchema) {
        this.logger = console;
        this.debug = false;
        this.logDebugActivity = (identifier, functionName, detail = {}) => {
            if (this.debug) {
                this.logFormattedMessage(identifier, functionName, detail);
            }
        };
        this.element = element;
        this.schema = schema;
        this.dispatcher = new Dispatcher(this);
        this.router = new Router(this);
    }
    static start(element, schema) {
        const application = new Application(element, schema);
        application.start();
        return application;
    }
    async start() {
        await domReady();
        this.logDebugActivity("application", "starting");
        this.dispatcher.start();
        this.router.start();
        this.logDebugActivity("application", "start");
    }
    stop() {
        this.logDebugActivity("application", "stopping");
        this.dispatcher.stop();
        this.router.stop();
        this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
        this.load({ identifier, controllerConstructor });
    }
    load(head, ...rest) {
        const definitions = Array.isArray(head) ? head : [head, ...rest];
        definitions.forEach(definition => {
            if (definition.controllerConstructor.shouldLoad) {
                this.router.loadDefinition(definition);
            }
        });
    }
    unload(head, ...rest) {
        const identifiers = Array.isArray(head) ? head : [head, ...rest];
        identifiers.forEach(identifier => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
        return this.router.contexts.map(context => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
        const context = this.router.getContextForElementAndIdentifier(element, identifier);
        return context ? context.controller : null;
    }
    handleError(error, message, detail) {
        var _a;
        this.logger.error(`%s\n\n%o\n\n%o`, message, error, detail);
        (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
        detail = Object.assign({ application: this }, detail);
        this.logger.groupCollapsed(`${identifier} #${functionName}`);
        this.logger.log("details:", Object.assign({}, detail));
        this.logger.groupEnd();
    }
}
function domReady() {
    return new Promise(resolve => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", () => resolve());
        }
        else {
            resolve();
        }
    });
}

function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
        return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
}
function propertiesForClassDefinition(key) {
    return {
        [`${key}Class`]: {
            get() {
                const { classes } = this;
                if (classes.has(key)) {
                    return classes.get(key);
                }
                else {
                    const attribute = classes.getAttributeName(key);
                    throw new Error(`Missing attribute "${attribute}"`);
                }
            }
        },
        [`${key}Classes`]: {
            get() {
                return this.classes.getAll(key);
            }
        },
        [`has${capitalize(key)}Class`]: {
            get() {
                return this.classes.has(key);
            }
        }
    };
}

function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
        return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
}
function propertiesForTargetDefinition(name) {
    return {
        [`${name}Target`]: {
            get() {
                const target = this.targets.find(name);
                if (target) {
                    return target;
                }
                else {
                    throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
                }
            }
        },
        [`${name}Targets`]: {
            get() {
                return this.targets.findAll(name);
            }
        },
        [`has${capitalize(name)}Target`]: {
            get() {
                return this.targets.has(name);
            }
        }
    };
}

function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
        valueDescriptorMap: {
            get() {
                return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
                    const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
                    const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
                    return Object.assign(result, { [attributeName]: valueDescriptor });
                }, {});
            }
        }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
        return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
}
function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
        [name]: {
            get() {
                const value = this.data.get(key);
                if (value !== null) {
                    return read(value);
                }
                else {
                    return definition.defaultValue;
                }
            },
            set(value) {
                if (value === undefined) {
                    this.data.delete(key);
                }
                else {
                    this.data.set(key, write(value));
                }
            }
        },
        [`has${capitalize(name)}`]: {
            get() {
                return this.data.has(key) || definition.hasCustomDefaultValue;
            }
        }
    };
}
function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
        controller,
        token,
        typeDefinition,
    });
}
function parseValueTypeConstant(constant) {
    switch (constant) {
        case Array: return "array";
        case Boolean: return "boolean";
        case Number: return "number";
        case Object: return "object";
        case String: return "string";
    }
}
function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
        case "boolean": return "boolean";
        case "number": return "number";
        case "string": return "string";
    }
    if (Array.isArray(defaultValue))
        return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
        return "object";
}
function parseValueTypeObject(payload) {
    const typeFromObject = parseValueTypeConstant(payload.typeObject.type);
    if (!typeFromObject)
        return;
    const defaultValueType = parseValueTypeDefault(payload.typeObject.default);
    if (typeFromObject !== defaultValueType) {
        const propertyPath = payload.controller ? `${payload.controller}.${payload.token}` : payload.token;
        throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${payload.typeObject.default}" is of type "${defaultValueType}".`);
    }
    return typeFromObject;
}
function parseValueTypeDefinition(payload) {
    const typeFromObject = parseValueTypeObject({
        controller: payload.controller,
        token: payload.token,
        typeObject: payload.typeDefinition
    });
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeDefinition);
    const typeFromConstant = parseValueTypeConstant(payload.typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
        return type;
    const propertyPath = payload.controller ? `${payload.controller}.${payload.typeDefinition}` : payload.token;
    throw new Error(`Unknown value type "${propertyPath}" for "${payload.token}" value`);
}
function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
        return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== undefined)
        return defaultValue;
    return typeDefinition;
}
function valueDescriptorForTokenAndTypeDefinition(payload) {
    const key = `${dasherize(payload.token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
        type,
        key,
        name: camelize(key),
        get defaultValue() { return defaultValueForDefinition(payload.typeDefinition); },
        get hasCustomDefaultValue() { return parseValueTypeDefault(payload.typeDefinition) !== undefined; },
        reader: readers[type],
        writer: writers[type] || writers.default
    };
}
const defaultValuesByType = {
    get array() { return []; },
    boolean: false,
    number: 0,
    get object() { return {}; },
    string: ""
};
const readers = {
    array(value) {
        const array = JSON.parse(value);
        if (!Array.isArray(array)) {
            throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
        }
        return array;
    },
    boolean(value) {
        return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
        return Number(value);
    },
    object(value) {
        const object = JSON.parse(value);
        if (object === null || typeof object != "object" || Array.isArray(object)) {
            throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
        }
        return object;
    },
    string(value) {
        return value;
    }
};
const writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
};
function writeJSON(value) {
    return JSON.stringify(value);
}
function writeString(value) {
    return `${value}`;
}

class Controller {
    constructor(context) {
        this.context = context;
    }
    static get shouldLoad() {
        return true;
    }
    get application() {
        return this.context.application;
    }
    get scope() {
        return this.context.scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get targets() {
        return this.scope.targets;
    }
    get classes() {
        return this.scope.classes;
    }
    get data() {
        return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
        const type = prefix ? `${prefix}:${eventName}` : eventName;
        const event = new CustomEvent(type, { detail, bubbles, cancelable });
        target.dispatchEvent(event);
        return event;
    }
}
Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
Controller.targets = [];
Controller.values = {};




/***/ }),

/***/ "./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FrameElement": () => (/* binding */ FrameElement),
/* harmony export */   "FrameLoadingStyle": () => (/* binding */ FrameLoadingStyle),
/* harmony export */   "FrameRenderer": () => (/* binding */ FrameRenderer),
/* harmony export */   "PageRenderer": () => (/* binding */ PageRenderer),
/* harmony export */   "PageSnapshot": () => (/* binding */ PageSnapshot),
/* harmony export */   "StreamActions": () => (/* binding */ StreamActions),
/* harmony export */   "StreamElement": () => (/* binding */ StreamElement),
/* harmony export */   "StreamSourceElement": () => (/* binding */ StreamSourceElement),
/* harmony export */   "cache": () => (/* binding */ cache),
/* harmony export */   "clearCache": () => (/* binding */ clearCache),
/* harmony export */   "connectStreamSource": () => (/* binding */ connectStreamSource),
/* harmony export */   "disconnectStreamSource": () => (/* binding */ disconnectStreamSource),
/* harmony export */   "navigator": () => (/* binding */ navigator$1),
/* harmony export */   "registerAdapter": () => (/* binding */ registerAdapter),
/* harmony export */   "renderStreamMessage": () => (/* binding */ renderStreamMessage),
/* harmony export */   "session": () => (/* binding */ session),
/* harmony export */   "setConfirmMethod": () => (/* binding */ setConfirmMethod),
/* harmony export */   "setFormMode": () => (/* binding */ setFormMode),
/* harmony export */   "setProgressBarDelay": () => (/* binding */ setProgressBarDelay),
/* harmony export */   "start": () => (/* binding */ start),
/* harmony export */   "visit": () => (/* binding */ visit)
/* harmony export */ });
/*
Turbo 7.2.0
Copyright © 2022 37signals LLC
 */
(function () {
    if (window.Reflect === undefined ||
        window.customElements === undefined ||
        window.customElements.polyfillWrapFlushCallback) {
        return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
        HTMLElement: function HTMLElement() {
            return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
        },
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
})();

/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2019 Javan Makhmali
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(prototype) {
  if (typeof prototype.requestSubmit == "function") return

  prototype.requestSubmit = function(submitter) {
    if (submitter) {
      validateSubmitter(submitter, this);
      submitter.click();
    } else {
      submitter = document.createElement("input");
      submitter.type = "submit";
      submitter.hidden = true;
      this.appendChild(submitter);
      submitter.click();
      this.removeChild(submitter);
    }
  };

  function validateSubmitter(submitter, form) {
    submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
    submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
    submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
  }

  function raise(errorConstructor, message, name) {
    throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name)
  }
})(HTMLFormElement.prototype);

const submittersByForm = new WeakMap();
function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
}
function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
        submittersByForm.set(submitter.form, submitter);
    }
}
(function () {
    if ("submitter" in Event.prototype)
        return;
    let prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
        prototype = window.SubmitEvent.prototype;
    }
    else if ("SubmitEvent" in window) {
        return;
    }
    else {
        prototype = window.Event.prototype;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
        get() {
            if (this.type == "submit" && this.target instanceof HTMLFormElement) {
                return submittersByForm.get(this.target);
            }
        },
    });
})();

var FrameLoadingStyle;
(function (FrameLoadingStyle) {
    FrameLoadingStyle["eager"] = "eager";
    FrameLoadingStyle["lazy"] = "lazy";
})(FrameLoadingStyle || (FrameLoadingStyle = {}));
class FrameElement extends HTMLElement {
    constructor() {
        super();
        this.loaded = Promise.resolve();
        this.delegate = new FrameElement.delegateConstructor(this);
    }
    static get observedAttributes() {
        return ["disabled", "complete", "loading", "src"];
    }
    connectedCallback() {
        this.delegate.connect();
    }
    disconnectedCallback() {
        this.delegate.disconnect();
    }
    reload() {
        const { src } = this;
        this.removeAttribute("complete");
        this.src = null;
        this.src = src;
        return this.loaded;
    }
    attributeChangedCallback(name) {
        if (name == "loading") {
            this.delegate.loadingStyleChanged();
        }
        else if (name == "complete") {
            this.delegate.completeChanged();
        }
        else if (name == "src") {
            this.delegate.sourceURLChanged();
        }
        else {
            this.delegate.disabledChanged();
        }
    }
    get src() {
        return this.getAttribute("src");
    }
    set src(value) {
        if (value) {
            this.setAttribute("src", value);
        }
        else {
            this.removeAttribute("src");
        }
    }
    get loading() {
        return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
        if (value) {
            this.setAttribute("loading", value);
        }
        else {
            this.removeAttribute("loading");
        }
    }
    get disabled() {
        return this.hasAttribute("disabled");
    }
    set disabled(value) {
        if (value) {
            this.setAttribute("disabled", "");
        }
        else {
            this.removeAttribute("disabled");
        }
    }
    get autoscroll() {
        return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
        if (value) {
            this.setAttribute("autoscroll", "");
        }
        else {
            this.removeAttribute("autoscroll");
        }
    }
    get complete() {
        return !this.delegate.isLoading;
    }
    get isActive() {
        return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
        var _a, _b;
        return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
}
function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
        case "lazy":
            return FrameLoadingStyle.lazy;
        default:
            return FrameLoadingStyle.eager;
    }
}

function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
}
function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
        return url.hash.slice(1);
    }
    else if ((anchorMatch = url.href.match(/#(.*)$/))) {
        return anchorMatch[1];
    }
}
function getAction(form, submitter) {
    const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) || form.getAttribute("action") || form.action;
    return expandURL(action);
}
function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
}
function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml|php))$/);
}
function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
}
function locationIsVisitable(location, rootLocation) {
    return isPrefixedBy(location, rootLocation) && isHTML(location);
}
function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
}
function toCacheKey(url) {
    return getRequestURL(url);
}
function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
}
function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
}
function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
}
function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
}
function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
}

class FetchResponse {
    constructor(response) {
        this.response = response;
    }
    get succeeded() {
        return this.response.ok;
    }
    get failed() {
        return !this.succeeded;
    }
    get clientError() {
        return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
        return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
        return this.response.redirected;
    }
    get location() {
        return expandURL(this.response.url);
    }
    get isHTML() {
        return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
        return this.response.status;
    }
    get contentType() {
        return this.header("Content-Type");
    }
    get responseText() {
        return this.response.clone().text();
    }
    get responseHTML() {
        if (this.isHTML) {
            return this.response.clone().text();
        }
        else {
            return Promise.resolve(undefined);
        }
    }
    header(name) {
        return this.response.headers.get(name);
    }
}

function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
}

function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
        return element;
    }
    else {
        const createdScriptElement = document.createElement("script");
        const cspNonce = getMetaContent("csp-nonce");
        if (cspNonce) {
            createdScriptElement.nonce = cspNonce;
        }
        createdScriptElement.textContent = element.textContent;
        createdScriptElement.async = false;
        copyElementAttributes(createdScriptElement, element);
        return createdScriptElement;
    }
}
function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
        destinationElement.setAttribute(name, value);
    }
}
function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}
function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
        cancelable,
        bubbles: true,
        detail,
    });
    if (target && target.isConnected) {
        target.dispatchEvent(event);
    }
    else {
        document.documentElement.dispatchEvent(event);
    }
    return event;
}
function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
}
function nextMicrotask() {
    return Promise.resolve();
}
function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
}
function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
}
function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
        const value = values[i] == undefined ? "" : values[i];
        return result + string + value;
    }, "");
}
function uuid() {
    return Array.from({ length: 36 })
        .map((_, i) => {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
            return "-";
        }
        else if (i == 14) {
            return "4";
        }
        else if (i == 19) {
            return (Math.floor(Math.random() * 4) + 8).toString(16);
        }
        else {
            return Math.floor(Math.random() * 15).toString(16);
        }
    })
        .join("");
}
function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element === null || element === void 0 ? void 0 : element.getAttribute(attributeName))) {
        if (typeof value == "string")
            return value;
    }
    return null;
}
function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
}
function markAsBusy(...elements) {
    for (const element of elements) {
        if (element.localName == "turbo-frame") {
            element.setAttribute("busy", "");
        }
        element.setAttribute("aria-busy", "true");
    }
}
function clearBusyState(...elements) {
    for (const element of elements) {
        if (element.localName == "turbo-frame") {
            element.removeAttribute("busy");
        }
        element.removeAttribute("aria-busy");
    }
}
function waitForLoad(element, timeoutInMilliseconds = 2000) {
    return new Promise((resolve) => {
        const onComplete = () => {
            element.removeEventListener("error", onComplete);
            element.removeEventListener("load", onComplete);
            resolve();
        };
        element.addEventListener("load", onComplete, { once: true });
        element.addEventListener("error", onComplete, { once: true });
        setTimeout(resolve, timeoutInMilliseconds);
    });
}
function getHistoryMethodForAction(action) {
    switch (action) {
        case "replace":
            return history.replaceState;
        case "advance":
        case "restore":
            return history.pushState;
    }
}
function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
}
function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
}
function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
}
function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
}

var FetchMethod;
(function (FetchMethod) {
    FetchMethod[FetchMethod["get"] = 0] = "get";
    FetchMethod[FetchMethod["post"] = 1] = "post";
    FetchMethod[FetchMethod["put"] = 2] = "put";
    FetchMethod[FetchMethod["patch"] = 3] = "patch";
    FetchMethod[FetchMethod["delete"] = 4] = "delete";
})(FetchMethod || (FetchMethod = {}));
function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
        case "get":
            return FetchMethod.get;
        case "post":
            return FetchMethod.post;
        case "put":
            return FetchMethod.put;
        case "patch":
            return FetchMethod.patch;
        case "delete":
            return FetchMethod.delete;
    }
}
class FetchRequest {
    constructor(delegate, method, location, body = new URLSearchParams(), target = null) {
        this.abortController = new AbortController();
        this.resolveRequestPromise = (_value) => { };
        this.delegate = delegate;
        this.method = method;
        this.headers = this.defaultHeaders;
        this.body = body;
        this.url = location;
        this.target = target;
    }
    get location() {
        return this.url;
    }
    get params() {
        return this.url.searchParams;
    }
    get entries() {
        return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
        this.abortController.abort();
    }
    async perform() {
        var _a, _b;
        const { fetchOptions } = this;
        (_b = (_a = this.delegate).prepareHeadersForRequest) === null || _b === void 0 ? void 0 : _b.call(_a, this.headers, this);
        await this.allowRequestToBeIntercepted(fetchOptions);
        try {
            this.delegate.requestStarted(this);
            const response = await fetch(this.url.href, fetchOptions);
            return await this.receive(response);
        }
        catch (error) {
            if (error.name !== "AbortError") {
                if (this.willDelegateErrorHandling(error)) {
                    this.delegate.requestErrored(this, error);
                }
                throw error;
            }
        }
        finally {
            this.delegate.requestFinished(this);
        }
    }
    async receive(response) {
        const fetchResponse = new FetchResponse(response);
        const event = dispatch("turbo:before-fetch-response", {
            cancelable: true,
            detail: { fetchResponse },
            target: this.target,
        });
        if (event.defaultPrevented) {
            this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
        }
        else if (fetchResponse.succeeded) {
            this.delegate.requestSucceededWithResponse(this, fetchResponse);
        }
        else {
            this.delegate.requestFailedWithResponse(this, fetchResponse);
        }
        return fetchResponse;
    }
    get fetchOptions() {
        var _a;
        return {
            method: FetchMethod[this.method].toUpperCase(),
            credentials: "same-origin",
            headers: this.headers,
            redirect: "follow",
            body: this.isIdempotent ? null : this.body,
            signal: this.abortSignal,
            referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href,
        };
    }
    get defaultHeaders() {
        return {
            Accept: "text/html, application/xhtml+xml",
        };
    }
    get isIdempotent() {
        return this.method == FetchMethod.get;
    }
    get abortSignal() {
        return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
        this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async allowRequestToBeIntercepted(fetchOptions) {
        const requestInterception = new Promise((resolve) => (this.resolveRequestPromise = resolve));
        const event = dispatch("turbo:before-fetch-request", {
            cancelable: true,
            detail: {
                fetchOptions,
                url: this.url,
                resume: this.resolveRequestPromise,
            },
            target: this.target,
        });
        if (event.defaultPrevented)
            await requestInterception;
    }
    willDelegateErrorHandling(error) {
        const event = dispatch("turbo:fetch-request-error", {
            target: this.target,
            cancelable: true,
            detail: { request: this, error: error },
        });
        return !event.defaultPrevented;
    }
}

class AppearanceObserver {
    constructor(delegate, element) {
        this.started = false;
        this.intersect = (entries) => {
            const lastEntry = entries.slice(-1)[0];
            if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
                this.delegate.elementAppearedInViewport(this.element);
            }
        };
        this.delegate = delegate;
        this.element = element;
        this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.intersectionObserver.observe(this.element);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            this.intersectionObserver.unobserve(this.element);
        }
    }
}

class StreamMessage {
    constructor(fragment) {
        this.fragment = importStreamElements(fragment);
    }
    static wrap(message) {
        if (typeof message == "string") {
            return new this(createDocumentFragment(message));
        }
        else {
            return message;
        }
    }
}
StreamMessage.contentType = "text/vnd.turbo-stream.html";
function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
        const streamElement = document.importNode(element, true);
        for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
            inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
        }
        element.replaceWith(streamElement);
    }
    return fragment;
}

var FormSubmissionState;
(function (FormSubmissionState) {
    FormSubmissionState[FormSubmissionState["initialized"] = 0] = "initialized";
    FormSubmissionState[FormSubmissionState["requesting"] = 1] = "requesting";
    FormSubmissionState[FormSubmissionState["waiting"] = 2] = "waiting";
    FormSubmissionState[FormSubmissionState["receiving"] = 3] = "receiving";
    FormSubmissionState[FormSubmissionState["stopping"] = 4] = "stopping";
    FormSubmissionState[FormSubmissionState["stopped"] = 5] = "stopped";
})(FormSubmissionState || (FormSubmissionState = {}));
var FormEnctype;
(function (FormEnctype) {
    FormEnctype["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype["multipart"] = "multipart/form-data";
    FormEnctype["plain"] = "text/plain";
})(FormEnctype || (FormEnctype = {}));
function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
        case FormEnctype.multipart:
            return FormEnctype.multipart;
        case FormEnctype.plain:
            return FormEnctype.plain;
        default:
            return FormEnctype.urlEncoded;
    }
}
class FormSubmission {
    constructor(delegate, formElement, submitter, mustRedirect = false) {
        this.state = FormSubmissionState.initialized;
        this.delegate = delegate;
        this.formElement = formElement;
        this.submitter = submitter;
        this.formData = buildFormData(formElement, submitter);
        this.location = expandURL(this.action);
        if (this.method == FetchMethod.get) {
            mergeFormDataEntries(this.location, [...this.body.entries()]);
        }
        this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
        this.mustRedirect = mustRedirect;
    }
    static confirmMethod(message, _element, _submitter) {
        return Promise.resolve(confirm(message));
    }
    get method() {
        var _a;
        const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
        return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
        var _a;
        const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
        if ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.hasAttribute("formaction")) {
            return this.submitter.getAttribute("formaction") || "";
        }
        else {
            return this.formElement.getAttribute("action") || formElementAction || "";
        }
    }
    get body() {
        if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
            return new URLSearchParams(this.stringFormData);
        }
        else {
            return this.formData;
        }
    }
    get enctype() {
        var _a;
        return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isIdempotent() {
        return this.fetchRequest.isIdempotent;
    }
    get stringFormData() {
        return [...this.formData].reduce((entries, [name, value]) => {
            return entries.concat(typeof value == "string" ? [[name, value]] : []);
        }, []);
    }
    async start() {
        const { initialized, requesting } = FormSubmissionState;
        const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
        if (typeof confirmationMessage === "string") {
            const answer = await FormSubmission.confirmMethod(confirmationMessage, this.formElement, this.submitter);
            if (!answer) {
                return;
            }
        }
        if (this.state == initialized) {
            this.state = requesting;
            return this.fetchRequest.perform();
        }
    }
    stop() {
        const { stopping, stopped } = FormSubmissionState;
        if (this.state != stopping && this.state != stopped) {
            this.state = stopping;
            this.fetchRequest.cancel();
            return true;
        }
    }
    prepareHeadersForRequest(headers, request) {
        if (!request.isIdempotent) {
            const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
            if (token) {
                headers["X-CSRF-Token"] = token;
            }
        }
        if (this.requestAcceptsTurboStreamResponse(request)) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted(_request) {
        var _a;
        this.state = FormSubmissionState.waiting;
        (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.setAttribute("disabled", "");
        dispatch("turbo:submit-start", {
            target: this.formElement,
            detail: { formSubmission: this },
        });
        this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
        this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
        if (response.clientError || response.serverError) {
            this.delegate.formSubmissionFailedWithResponse(this, response);
        }
        else if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
            const error = new Error("Form responses must redirect to another location");
            this.delegate.formSubmissionErrored(this, error);
        }
        else {
            this.state = FormSubmissionState.receiving;
            this.result = { success: true, fetchResponse: response };
            this.delegate.formSubmissionSucceededWithResponse(this, response);
        }
    }
    requestFailedWithResponse(request, response) {
        this.result = { success: false, fetchResponse: response };
        this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error) {
        this.result = { success: false, error };
        this.delegate.formSubmissionErrored(this, error);
    }
    requestFinished(_request) {
        var _a;
        this.state = FormSubmissionState.stopped;
        (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
        dispatch("turbo:submit-end", {
            target: this.formElement,
            detail: Object.assign({ formSubmission: this }, this.result),
        });
        this.delegate.formSubmissionFinished(this);
    }
    requestMustRedirect(request) {
        return !request.isIdempotent && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
        return !request.isIdempotent || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
}
function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name) {
        formData.append(name, value || "");
    }
    return formData;
}
function getCookieValue(cookieName) {
    if (cookieName != null) {
        const cookies = document.cookie ? document.cookie.split("; ") : [];
        const cookie = cookies.find((cookie) => cookie.startsWith(cookieName));
        if (cookie) {
            const value = cookie.split("=").slice(1).join("=");
            return value ? decodeURIComponent(value) : undefined;
        }
    }
}
function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
}
function mergeFormDataEntries(url, entries) {
    const searchParams = new URLSearchParams();
    for (const [name, value] of entries) {
        if (value instanceof File)
            continue;
        searchParams.append(name, value);
    }
    url.search = searchParams.toString();
    return url;
}

class Snapshot {
    constructor(element) {
        this.element = element;
    }
    get activeElement() {
        return this.element.ownerDocument.activeElement;
    }
    get children() {
        return [...this.element.children];
    }
    hasAnchor(anchor) {
        return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
        return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
        return this.element.isConnected;
    }
    get firstAutofocusableElement() {
        const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
        for (const element of this.element.querySelectorAll("[autofocus]")) {
            if (element.closest(inertDisabledOrHidden) == null)
                return element;
            else
                continue;
        }
        return null;
    }
    get permanentElements() {
        return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id) {
        return getPermanentElementById(this.element, id);
    }
    getPermanentElementMapForSnapshot(snapshot) {
        const permanentElementMap = {};
        for (const currentPermanentElement of this.permanentElements) {
            const { id } = currentPermanentElement;
            const newPermanentElement = snapshot.getPermanentElementById(id);
            if (newPermanentElement) {
                permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
            }
        }
        return permanentElementMap;
    }
}
function getPermanentElementById(node, id) {
    return node.querySelector(`#${id}[data-turbo-permanent]`);
}
function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
}

class FormSubmitObserver {
    constructor(delegate, eventTarget) {
        this.started = false;
        this.submitCaptured = () => {
            this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
            this.eventTarget.addEventListener("submit", this.submitBubbled, false);
        };
        this.submitBubbled = ((event) => {
            if (!event.defaultPrevented) {
                const form = event.target instanceof HTMLFormElement ? event.target : undefined;
                const submitter = event.submitter || undefined;
                if (form &&
                    submissionDoesNotDismissDialog(form, submitter) &&
                    submissionDoesNotTargetIFrame(form, submitter) &&
                    this.delegate.willSubmitForm(form, submitter)) {
                    event.preventDefault();
                    this.delegate.formSubmitted(form, submitter);
                }
            }
        });
        this.delegate = delegate;
        this.eventTarget = eventTarget;
    }
    start() {
        if (!this.started) {
            this.eventTarget.addEventListener("submit", this.submitCaptured, true);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
            this.started = false;
        }
    }
}
function submissionDoesNotDismissDialog(form, submitter) {
    const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.getAttribute("method");
    return method != "dialog";
}
function submissionDoesNotTargetIFrame(form, submitter) {
    const target = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formtarget")) || form.target;
    for (const element of document.getElementsByName(target)) {
        if (element instanceof HTMLIFrameElement)
            return false;
    }
    return true;
}

class View {
    constructor(delegate, element) {
        this.resolveRenderPromise = (_value) => { };
        this.resolveInterceptionPromise = (_value) => { };
        this.delegate = delegate;
        this.element = element;
    }
    scrollToAnchor(anchor) {
        const element = this.snapshot.getElementForAnchor(anchor);
        if (element) {
            this.scrollToElement(element);
            this.focusElement(element);
        }
        else {
            this.scrollToPosition({ x: 0, y: 0 });
        }
    }
    scrollToAnchorFromLocation(location) {
        this.scrollToAnchor(getAnchor(location));
    }
    scrollToElement(element) {
        element.scrollIntoView();
    }
    focusElement(element) {
        if (element instanceof HTMLElement) {
            if (element.hasAttribute("tabindex")) {
                element.focus();
            }
            else {
                element.setAttribute("tabindex", "-1");
                element.focus();
                element.removeAttribute("tabindex");
            }
        }
    }
    scrollToPosition({ x, y }) {
        this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
        this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
        return window;
    }
    async render(renderer) {
        const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
        if (shouldRender) {
            try {
                this.renderPromise = new Promise((resolve) => (this.resolveRenderPromise = resolve));
                this.renderer = renderer;
                await this.prepareToRenderSnapshot(renderer);
                const renderInterception = new Promise((resolve) => (this.resolveInterceptionPromise = resolve));
                const options = { resume: this.resolveInterceptionPromise, render: this.renderer.renderElement };
                const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
                if (!immediateRender)
                    await renderInterception;
                await this.renderSnapshot(renderer);
                this.delegate.viewRenderedSnapshot(snapshot, isPreview);
                this.delegate.preloadOnLoadLinksForView(this.element);
                this.finishRenderingSnapshot(renderer);
            }
            finally {
                delete this.renderer;
                this.resolveRenderPromise(undefined);
                delete this.renderPromise;
            }
        }
        else {
            this.invalidate(renderer.reloadReason);
        }
    }
    invalidate(reason) {
        this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
        this.markAsPreview(renderer.isPreview);
        await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
        if (isPreview) {
            this.element.setAttribute("data-turbo-preview", "");
        }
        else {
            this.element.removeAttribute("data-turbo-preview");
        }
    }
    async renderSnapshot(renderer) {
        await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
        renderer.finishRendering();
    }
}

class FrameView extends View {
    invalidate() {
        this.element.innerHTML = "";
    }
    get snapshot() {
        return new Snapshot(this.element);
    }
}

class LinkClickObserver {
    constructor(delegate, eventTarget) {
        this.started = false;
        this.clickCaptured = () => {
            this.eventTarget.removeEventListener("click", this.clickBubbled, false);
            this.eventTarget.addEventListener("click", this.clickBubbled, false);
        };
        this.clickBubbled = (event) => {
            if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
                const target = (event.composedPath && event.composedPath()[0]) || event.target;
                const link = this.findLinkFromClickTarget(target);
                if (link && doesNotTargetIFrame(link)) {
                    const location = this.getLocationForLink(link);
                    if (this.delegate.willFollowLinkToLocation(link, location, event)) {
                        event.preventDefault();
                        this.delegate.followedLinkToLocation(link, location);
                    }
                }
            }
        };
        this.delegate = delegate;
        this.eventTarget = eventTarget;
    }
    start() {
        if (!this.started) {
            this.eventTarget.addEventListener("click", this.clickCaptured, true);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.eventTarget.removeEventListener("click", this.clickCaptured, true);
            this.started = false;
        }
    }
    clickEventIsSignificant(event) {
        return !((event.target && event.target.isContentEditable) ||
            event.defaultPrevented ||
            event.which > 1 ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey);
    }
    findLinkFromClickTarget(target) {
        if (target instanceof Element) {
            return target.closest("a[href]:not([target^=_]):not([download])");
        }
    }
    getLocationForLink(link) {
        return expandURL(link.getAttribute("href") || "");
    }
}
function doesNotTargetIFrame(anchor) {
    for (const element of document.getElementsByName(anchor.target)) {
        if (element instanceof HTMLIFrameElement)
            return false;
    }
    return true;
}

class FormLinkClickObserver {
    constructor(delegate, element) {
        this.delegate = delegate;
        this.linkClickObserver = new LinkClickObserver(this, element);
    }
    start() {
        this.linkClickObserver.start();
    }
    stop() {
        this.linkClickObserver.stop();
    }
    willFollowLinkToLocation(link, location, originalEvent) {
        return (this.delegate.willSubmitFormLinkToLocation(link, location, originalEvent) &&
            link.hasAttribute("data-turbo-method"));
    }
    followedLinkToLocation(link, location) {
        const action = location.href;
        const form = document.createElement("form");
        form.setAttribute("data-turbo", "true");
        form.setAttribute("action", action);
        form.setAttribute("hidden", "");
        const method = link.getAttribute("data-turbo-method");
        if (method)
            form.setAttribute("method", method);
        const turboFrame = link.getAttribute("data-turbo-frame");
        if (turboFrame)
            form.setAttribute("data-turbo-frame", turboFrame);
        const turboAction = link.getAttribute("data-turbo-action");
        if (turboAction)
            form.setAttribute("data-turbo-action", turboAction);
        const turboConfirm = link.getAttribute("data-turbo-confirm");
        if (turboConfirm)
            form.setAttribute("data-turbo-confirm", turboConfirm);
        const turboStream = link.hasAttribute("data-turbo-stream");
        if (turboStream)
            form.setAttribute("data-turbo-stream", "");
        this.delegate.submittedFormLinkToLocation(link, location, form);
        document.body.appendChild(form);
        form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
        requestAnimationFrame(() => form.requestSubmit());
    }
}

class Bardo {
    constructor(delegate, permanentElementMap) {
        this.delegate = delegate;
        this.permanentElementMap = permanentElementMap;
    }
    static preservingPermanentElements(delegate, permanentElementMap, callback) {
        const bardo = new this(delegate, permanentElementMap);
        bardo.enter();
        callback();
        bardo.leave();
    }
    enter() {
        for (const id in this.permanentElementMap) {
            const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id];
            this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
            this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
        }
    }
    leave() {
        for (const id in this.permanentElementMap) {
            const [currentPermanentElement] = this.permanentElementMap[id];
            this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
            this.replacePlaceholderWithPermanentElement(currentPermanentElement);
            this.delegate.leavingBardo(currentPermanentElement);
        }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
        const placeholder = createPlaceholderForPermanentElement(permanentElement);
        permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
        const clone = permanentElement.cloneNode(true);
        permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
        const placeholder = this.getPlaceholderById(permanentElement.id);
        placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
        return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
        return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
}
function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
}

class Renderer {
    constructor(currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
        this.activeElement = null;
        this.currentSnapshot = currentSnapshot;
        this.newSnapshot = newSnapshot;
        this.isPreview = isPreview;
        this.willRender = willRender;
        this.renderElement = renderElement;
        this.promise = new Promise((resolve, reject) => (this.resolvingFunctions = { resolve, reject }));
    }
    get shouldRender() {
        return true;
    }
    get reloadReason() {
        return;
    }
    prepareToRender() {
        return;
    }
    finishRendering() {
        if (this.resolvingFunctions) {
            this.resolvingFunctions.resolve();
            delete this.resolvingFunctions;
        }
    }
    preservingPermanentElements(callback) {
        Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
        const element = this.connectedSnapshot.firstAutofocusableElement;
        if (elementIsFocusable(element)) {
            element.focus();
        }
    }
    enteringBardo(currentPermanentElement) {
        if (this.activeElement)
            return;
        if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
            this.activeElement = this.currentSnapshot.activeElement;
        }
    }
    leavingBardo(currentPermanentElement) {
        if (currentPermanentElement.contains(this.activeElement) && this.activeElement instanceof HTMLElement) {
            this.activeElement.focus();
            this.activeElement = null;
        }
    }
    get connectedSnapshot() {
        return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
        return this.currentSnapshot.element;
    }
    get newElement() {
        return this.newSnapshot.element;
    }
    get permanentElementMap() {
        return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
}
function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
}

class FrameRenderer extends Renderer {
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
        super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
        this.delegate = delegate;
    }
    static renderElement(currentElement, newElement) {
        var _a;
        const destinationRange = document.createRange();
        destinationRange.selectNodeContents(currentElement);
        destinationRange.deleteContents();
        const frameElement = newElement;
        const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
        if (sourceRange) {
            sourceRange.selectNodeContents(frameElement);
            currentElement.appendChild(sourceRange.extractContents());
        }
    }
    get shouldRender() {
        return true;
    }
    async render() {
        await nextAnimationFrame();
        this.preservingPermanentElements(() => {
            this.loadFrameElement();
        });
        this.scrollFrameIntoView();
        await nextAnimationFrame();
        this.focusFirstAutofocusableElement();
        await nextAnimationFrame();
        this.activateScriptElements();
    }
    loadFrameElement() {
        this.delegate.willRenderFrame(this.currentElement, this.newElement);
        this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
        if (this.currentElement.autoscroll || this.newElement.autoscroll) {
            const element = this.currentElement.firstElementChild;
            const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
            const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
            if (element) {
                element.scrollIntoView({ block, behavior });
                return true;
            }
        }
        return false;
    }
    activateScriptElements() {
        for (const inertScriptElement of this.newScriptElements) {
            const activatedScriptElement = activateScriptElement(inertScriptElement);
            inertScriptElement.replaceWith(activatedScriptElement);
        }
    }
    get newScriptElements() {
        return this.currentElement.querySelectorAll("script");
    }
}
function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
        return value;
    }
    else {
        return defaultValue;
    }
}
function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
        return value;
    }
    else {
        return defaultValue;
    }
}

class ProgressBar {
    constructor() {
        this.hiding = false;
        this.value = 0;
        this.visible = false;
        this.trickle = () => {
            this.setValue(this.value + Math.random() / 100);
        };
        this.stylesheetElement = this.createStylesheetElement();
        this.progressElement = this.createProgressElement();
        this.installStylesheetElement();
        this.setValue(0);
    }
    static get defaultCSS() {
        return unindent `
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${ProgressBar.animationDuration}ms ease-out,
          opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    show() {
        if (!this.visible) {
            this.visible = true;
            this.installProgressElement();
            this.startTrickling();
        }
    }
    hide() {
        if (this.visible && !this.hiding) {
            this.hiding = true;
            this.fadeProgressElement(() => {
                this.uninstallProgressElement();
                this.stopTrickling();
                this.visible = false;
                this.hiding = false;
            });
        }
    }
    setValue(value) {
        this.value = value;
        this.refresh();
    }
    installStylesheetElement() {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
        this.progressElement.style.width = "0";
        this.progressElement.style.opacity = "1";
        document.documentElement.insertBefore(this.progressElement, document.body);
        this.refresh();
    }
    fadeProgressElement(callback) {
        this.progressElement.style.opacity = "0";
        setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
        if (this.progressElement.parentNode) {
            document.documentElement.removeChild(this.progressElement);
        }
    }
    startTrickling() {
        if (!this.trickleInterval) {
            this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
        }
    }
    stopTrickling() {
        window.clearInterval(this.trickleInterval);
        delete this.trickleInterval;
    }
    refresh() {
        requestAnimationFrame(() => {
            this.progressElement.style.width = `${10 + this.value * 90}%`;
        });
    }
    createStylesheetElement() {
        const element = document.createElement("style");
        element.type = "text/css";
        element.textContent = ProgressBar.defaultCSS;
        if (this.cspNonce) {
            element.nonce = this.cspNonce;
        }
        return element;
    }
    createProgressElement() {
        const element = document.createElement("div");
        element.className = "turbo-progress-bar";
        return element;
    }
    get cspNonce() {
        return getMetaContent("csp-nonce");
    }
}
ProgressBar.animationDuration = 300;

class HeadSnapshot extends Snapshot {
    constructor() {
        super(...arguments);
        this.detailsByOuterHTML = this.children
            .filter((element) => !elementIsNoscript(element))
            .map((element) => elementWithoutNonce(element))
            .reduce((result, element) => {
            const { outerHTML } = element;
            const details = outerHTML in result
                ? result[outerHTML]
                : {
                    type: elementType(element),
                    tracked: elementIsTracked(element),
                    elements: [],
                };
            return Object.assign(Object.assign({}, result), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
        }, {});
    }
    get trackedElementSignature() {
        return Object.keys(this.detailsByOuterHTML)
            .filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked)
            .join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
        return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
        return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
        return Object.keys(this.detailsByOuterHTML)
            .filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML))
            .map((outerHTML) => this.detailsByOuterHTML[outerHTML])
            .filter(({ type }) => type == matchedType)
            .map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
        return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
            const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
            if (type == null && !tracked) {
                return [...result, ...elements];
            }
            else if (elements.length > 1) {
                return [...result, ...elements.slice(1)];
            }
            else {
                return result;
            }
        }, []);
    }
    getMetaValue(name) {
        const element = this.findMetaElementByName(name);
        return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
        return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
            const { elements: [element], } = this.detailsByOuterHTML[outerHTML];
            return elementIsMetaElementWithName(element, name) ? element : result;
        }, undefined);
    }
}
function elementType(element) {
    if (elementIsScript(element)) {
        return "script";
    }
    else if (elementIsStylesheet(element)) {
        return "stylesheet";
    }
}
function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
}
function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
}
function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
}
function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || (tagName == "link" && element.getAttribute("rel") == "stylesheet");
}
function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
}
function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
        element.setAttribute("nonce", "");
    }
    return element;
}

class PageSnapshot extends Snapshot {
    constructor(element, headSnapshot) {
        super(element);
        this.headSnapshot = headSnapshot;
    }
    static fromHTMLString(html = "") {
        return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
        return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
        return new this(body, new HeadSnapshot(head));
    }
    clone() {
        const clonedElement = this.element.cloneNode(true);
        const selectElements = this.element.querySelectorAll("select");
        const clonedSelectElements = clonedElement.querySelectorAll("select");
        for (const [index, source] of selectElements.entries()) {
            const clone = clonedSelectElements[index];
            for (const option of clone.selectedOptions)
                option.selected = false;
            for (const option of source.selectedOptions)
                clone.options[option.index].selected = true;
        }
        for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
            clonedPasswordInput.value = "";
        }
        return new PageSnapshot(clonedElement, this.headSnapshot);
    }
    get headElement() {
        return this.headSnapshot.element;
    }
    get rootLocation() {
        var _a;
        const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
        return expandURL(root);
    }
    get cacheControlValue() {
        return this.getSetting("cache-control");
    }
    get isPreviewable() {
        return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
        return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
        return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
        return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
}

var TimingMetric;
(function (TimingMetric) {
    TimingMetric["visitStart"] = "visitStart";
    TimingMetric["requestStart"] = "requestStart";
    TimingMetric["requestEnd"] = "requestEnd";
    TimingMetric["visitEnd"] = "visitEnd";
})(TimingMetric || (TimingMetric = {}));
var VisitState;
(function (VisitState) {
    VisitState["initialized"] = "initialized";
    VisitState["started"] = "started";
    VisitState["canceled"] = "canceled";
    VisitState["failed"] = "failed";
    VisitState["completed"] = "completed";
})(VisitState || (VisitState = {}));
const defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => { },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false,
};
var SystemStatusCode;
(function (SystemStatusCode) {
    SystemStatusCode[SystemStatusCode["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode[SystemStatusCode["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode[SystemStatusCode["contentTypeMismatch"] = -2] = "contentTypeMismatch";
})(SystemStatusCode || (SystemStatusCode = {}));
class Visit {
    constructor(delegate, location, restorationIdentifier, options = {}) {
        this.identifier = uuid();
        this.timingMetrics = {};
        this.followedRedirect = false;
        this.historyChanged = false;
        this.scrolled = false;
        this.shouldCacheSnapshot = true;
        this.acceptsStreamResponse = false;
        this.snapshotCached = false;
        this.state = VisitState.initialized;
        this.delegate = delegate;
        this.location = location;
        this.restorationIdentifier = restorationIdentifier || uuid();
        const { action, historyChanged, referrer, snapshotHTML, response, visitCachedSnapshot, willRender, updateHistory, shouldCacheSnapshot, acceptsStreamResponse, } = Object.assign(Object.assign({}, defaultOptions), options);
        this.action = action;
        this.historyChanged = historyChanged;
        this.referrer = referrer;
        this.snapshotHTML = snapshotHTML;
        this.response = response;
        this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
        this.visitCachedSnapshot = visitCachedSnapshot;
        this.willRender = willRender;
        this.updateHistory = updateHistory;
        this.scrolled = !willRender;
        this.shouldCacheSnapshot = shouldCacheSnapshot;
        this.acceptsStreamResponse = acceptsStreamResponse;
    }
    get adapter() {
        return this.delegate.adapter;
    }
    get view() {
        return this.delegate.view;
    }
    get history() {
        return this.delegate.history;
    }
    get restorationData() {
        return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
        return this.isSamePage;
    }
    start() {
        if (this.state == VisitState.initialized) {
            this.recordTimingMetric(TimingMetric.visitStart);
            this.state = VisitState.started;
            this.adapter.visitStarted(this);
            this.delegate.visitStarted(this);
        }
    }
    cancel() {
        if (this.state == VisitState.started) {
            if (this.request) {
                this.request.cancel();
            }
            this.cancelRender();
            this.state = VisitState.canceled;
        }
    }
    complete() {
        if (this.state == VisitState.started) {
            this.recordTimingMetric(TimingMetric.visitEnd);
            this.state = VisitState.completed;
            this.followRedirect();
            if (!this.followedRedirect) {
                this.adapter.visitCompleted(this);
                this.delegate.visitCompleted(this);
            }
        }
    }
    fail() {
        if (this.state == VisitState.started) {
            this.state = VisitState.failed;
            this.adapter.visitFailed(this);
        }
    }
    changeHistory() {
        var _a;
        if (!this.historyChanged && this.updateHistory) {
            const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
            const method = getHistoryMethodForAction(actionForHistory);
            this.history.update(method, this.location, this.restorationIdentifier);
            this.historyChanged = true;
        }
    }
    issueRequest() {
        if (this.hasPreloadedResponse()) {
            this.simulateRequest();
        }
        else if (this.shouldIssueRequest() && !this.request) {
            this.request = new FetchRequest(this, FetchMethod.get, this.location);
            this.request.perform();
        }
    }
    simulateRequest() {
        if (this.response) {
            this.startRequest();
            this.recordResponse();
            this.finishRequest();
        }
    }
    startRequest() {
        this.recordTimingMetric(TimingMetric.requestStart);
        this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
        this.response = response;
        if (response) {
            const { statusCode } = response;
            if (isSuccessful(statusCode)) {
                this.adapter.visitRequestCompleted(this);
            }
            else {
                this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
            }
        }
    }
    finishRequest() {
        this.recordTimingMetric(TimingMetric.requestEnd);
        this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
        if (this.response) {
            const { statusCode, responseHTML } = this.response;
            this.render(async () => {
                if (this.shouldCacheSnapshot)
                    this.cacheSnapshot();
                if (this.view.renderPromise)
                    await this.view.renderPromise;
                if (isSuccessful(statusCode) && responseHTML != null) {
                    await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML), false, this.willRender, this);
                    this.performScroll();
                    this.adapter.visitRendered(this);
                    this.complete();
                }
                else {
                    await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
                    this.adapter.visitRendered(this);
                    this.fail();
                }
            });
        }
    }
    getCachedSnapshot() {
        const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
        if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
            if (this.action == "restore" || snapshot.isPreviewable) {
                return snapshot;
            }
        }
    }
    getPreloadedSnapshot() {
        if (this.snapshotHTML) {
            return PageSnapshot.fromHTMLString(this.snapshotHTML);
        }
    }
    hasCachedSnapshot() {
        return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
        const snapshot = this.getCachedSnapshot();
        if (snapshot) {
            const isPreview = this.shouldIssueRequest();
            this.render(async () => {
                this.cacheSnapshot();
                if (this.isSamePage) {
                    this.adapter.visitRendered(this);
                }
                else {
                    if (this.view.renderPromise)
                        await this.view.renderPromise;
                    await this.view.renderPage(snapshot, isPreview, this.willRender, this);
                    this.performScroll();
                    this.adapter.visitRendered(this);
                    if (!isPreview) {
                        this.complete();
                    }
                }
            });
        }
    }
    followRedirect() {
        var _a;
        if (this.redirectedToLocation && !this.followedRedirect && ((_a = this.response) === null || _a === void 0 ? void 0 : _a.redirected)) {
            this.adapter.visitProposedToLocation(this.redirectedToLocation, {
                action: "replace",
                response: this.response,
            });
            this.followedRedirect = true;
        }
    }
    goToSamePageAnchor() {
        if (this.isSamePage) {
            this.render(async () => {
                this.cacheSnapshot();
                this.performScroll();
                this.adapter.visitRendered(this);
            });
        }
    }
    prepareHeadersForRequest(headers, request) {
        if (this.acceptsStreamResponse) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted() {
        this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) { }
    async requestSucceededWithResponse(request, response) {
        const responseHTML = await response.responseHTML;
        const { redirected, statusCode } = response;
        if (responseHTML == undefined) {
            this.recordResponse({
                statusCode: SystemStatusCode.contentTypeMismatch,
                redirected,
            });
        }
        else {
            this.redirectedToLocation = response.redirected ? response.location : undefined;
            this.recordResponse({ statusCode: statusCode, responseHTML, redirected });
        }
    }
    async requestFailedWithResponse(request, response) {
        const responseHTML = await response.responseHTML;
        const { redirected, statusCode } = response;
        if (responseHTML == undefined) {
            this.recordResponse({
                statusCode: SystemStatusCode.contentTypeMismatch,
                redirected,
            });
        }
        else {
            this.recordResponse({ statusCode: statusCode, responseHTML, redirected });
        }
    }
    requestErrored(_request, _error) {
        this.recordResponse({
            statusCode: SystemStatusCode.networkFailure,
            redirected: false,
        });
    }
    requestFinished() {
        this.finishRequest();
    }
    performScroll() {
        if (!this.scrolled && !this.view.forceReloaded) {
            if (this.action == "restore") {
                this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
            }
            else {
                this.scrollToAnchor() || this.view.scrollToTop();
            }
            if (this.isSamePage) {
                this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
            }
            this.scrolled = true;
        }
    }
    scrollToRestoredPosition() {
        const { scrollPosition } = this.restorationData;
        if (scrollPosition) {
            this.view.scrollToPosition(scrollPosition);
            return true;
        }
    }
    scrollToAnchor() {
        const anchor = getAnchor(this.location);
        if (anchor != null) {
            this.view.scrollToAnchor(anchor);
            return true;
        }
    }
    recordTimingMetric(metric) {
        this.timingMetrics[metric] = new Date().getTime();
    }
    getTimingMetrics() {
        return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
        switch (action) {
            case "replace":
                return history.replaceState;
            case "advance":
            case "restore":
                return history.pushState;
        }
    }
    hasPreloadedResponse() {
        return typeof this.response == "object";
    }
    shouldIssueRequest() {
        if (this.isSamePage) {
            return false;
        }
        else if (this.action == "restore") {
            return !this.hasCachedSnapshot();
        }
        else {
            return this.willRender;
        }
    }
    cacheSnapshot() {
        if (!this.snapshotCached) {
            this.view.cacheSnapshot().then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
            this.snapshotCached = true;
        }
    }
    async render(callback) {
        this.cancelRender();
        await new Promise((resolve) => {
            this.frame = requestAnimationFrame(() => resolve());
        });
        await callback();
        delete this.frame;
    }
    cancelRender() {
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            delete this.frame;
        }
    }
}
function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
}

class BrowserAdapter {
    constructor(session) {
        this.progressBar = new ProgressBar();
        this.showProgressBar = () => {
            this.progressBar.show();
        };
        this.session = session;
    }
    visitProposedToLocation(location, options) {
        this.navigator.startVisit(location, (options === null || options === void 0 ? void 0 : options.restorationIdentifier) || uuid(), options);
    }
    visitStarted(visit) {
        this.location = visit.location;
        visit.loadCachedSnapshot();
        visit.issueRequest();
        visit.goToSamePageAnchor();
    }
    visitRequestStarted(visit) {
        this.progressBar.setValue(0);
        if (visit.hasCachedSnapshot() || visit.action != "restore") {
            this.showVisitProgressBarAfterDelay();
        }
        else {
            this.showProgressBar();
        }
    }
    visitRequestCompleted(visit) {
        visit.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit, statusCode) {
        switch (statusCode) {
            case SystemStatusCode.networkFailure:
            case SystemStatusCode.timeoutFailure:
            case SystemStatusCode.contentTypeMismatch:
                return this.reload({
                    reason: "request_failed",
                    context: {
                        statusCode,
                    },
                });
            default:
                return visit.loadResponse();
        }
    }
    visitRequestFinished(_visit) {
        this.progressBar.setValue(1);
        this.hideVisitProgressBar();
    }
    visitCompleted(_visit) { }
    pageInvalidated(reason) {
        this.reload(reason);
    }
    visitFailed(_visit) { }
    visitRendered(_visit) { }
    formSubmissionStarted(_formSubmission) {
        this.progressBar.setValue(0);
        this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
        this.progressBar.setValue(1);
        this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
        this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
        this.progressBar.hide();
        if (this.visitProgressBarTimeout != null) {
            window.clearTimeout(this.visitProgressBarTimeout);
            delete this.visitProgressBarTimeout;
        }
    }
    showFormProgressBarAfterDelay() {
        if (this.formProgressBarTimeout == null) {
            this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
        }
    }
    hideFormProgressBar() {
        this.progressBar.hide();
        if (this.formProgressBarTimeout != null) {
            window.clearTimeout(this.formProgressBarTimeout);
            delete this.formProgressBarTimeout;
        }
    }
    reload(reason) {
        dispatch("turbo:reload", { detail: reason });
        if (!this.location)
            return;
        window.location.href = this.location.toString();
    }
    get navigator() {
        return this.session.navigator;
    }
}

class CacheObserver {
    constructor() {
        this.started = false;
        this.removeStaleElements = ((_event) => {
            const staleElements = [...document.querySelectorAll('[data-turbo-cache="false"]')];
            for (const element of staleElements) {
                element.remove();
            }
        });
    }
    start() {
        if (!this.started) {
            this.started = true;
            addEventListener("turbo:before-cache", this.removeStaleElements, false);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            removeEventListener("turbo:before-cache", this.removeStaleElements, false);
        }
    }
}

class FrameRedirector {
    constructor(session, element) {
        this.session = session;
        this.element = element;
        this.linkClickObserver = new LinkClickObserver(this, element);
        this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
    }
    stop() {
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
    }
    willFollowLinkToLocation(element, location, event) {
        return this.shouldRedirect(element) && this.frameAllowsVisitingLocation(element, location, event);
    }
    followedLinkToLocation(element, url) {
        const frame = this.findFrameElement(element);
        if (frame) {
            frame.delegate.followedLinkToLocation(element, url);
        }
    }
    willSubmitForm(element, submitter) {
        return (element.closest("turbo-frame") == null &&
            this.shouldSubmit(element, submitter) &&
            this.shouldRedirect(element, submitter));
    }
    formSubmitted(element, submitter) {
        const frame = this.findFrameElement(element, submitter);
        if (frame) {
            frame.delegate.formSubmitted(element, submitter);
        }
    }
    frameAllowsVisitingLocation(target, { href: url }, originalEvent) {
        const event = dispatch("turbo:click", {
            target,
            detail: { url, originalEvent },
            cancelable: true,
        });
        return !event.defaultPrevented;
    }
    shouldSubmit(form, submitter) {
        var _a;
        const action = getAction(form, submitter);
        const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
        const rootLocation = expandURL((_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/");
        return this.shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    shouldRedirect(element, submitter) {
        const isNavigatable = element instanceof HTMLFormElement
            ? this.session.submissionIsNavigatable(element, submitter)
            : this.session.elementIsNavigatable(element);
        if (isNavigatable) {
            const frame = this.findFrameElement(element, submitter);
            return frame ? frame != element.closest("turbo-frame") : false;
        }
        else {
            return false;
        }
    }
    findFrameElement(element, submitter) {
        const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
        if (id && id != "_top") {
            const frame = this.element.querySelector(`#${id}:not([disabled])`);
            if (frame instanceof FrameElement) {
                return frame;
            }
        }
    }
}

class History {
    constructor(delegate) {
        this.restorationIdentifier = uuid();
        this.restorationData = {};
        this.started = false;
        this.pageLoaded = false;
        this.onPopState = (event) => {
            if (this.shouldHandlePopState()) {
                const { turbo } = event.state || {};
                if (turbo) {
                    this.location = new URL(window.location.href);
                    const { restorationIdentifier } = turbo;
                    this.restorationIdentifier = restorationIdentifier;
                    this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
                }
            }
        };
        this.onPageLoad = async (_event) => {
            await nextMicrotask();
            this.pageLoaded = true;
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            addEventListener("popstate", this.onPopState, false);
            addEventListener("load", this.onPageLoad, false);
            this.started = true;
            this.replace(new URL(window.location.href));
        }
    }
    stop() {
        if (this.started) {
            removeEventListener("popstate", this.onPopState, false);
            removeEventListener("load", this.onPageLoad, false);
            this.started = false;
        }
    }
    push(location, restorationIdentifier) {
        this.update(history.pushState, location, restorationIdentifier);
    }
    replace(location, restorationIdentifier) {
        this.update(history.replaceState, location, restorationIdentifier);
    }
    update(method, location, restorationIdentifier = uuid()) {
        const state = { turbo: { restorationIdentifier } };
        method.call(history, state, "", location.href);
        this.location = location;
        this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
        return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
        const { restorationIdentifier } = this;
        const restorationData = this.restorationData[restorationIdentifier];
        this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
        var _a;
        if (!this.previousScrollRestoration) {
            this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
            history.scrollRestoration = "manual";
        }
    }
    relinquishControlOfScrollRestoration() {
        if (this.previousScrollRestoration) {
            history.scrollRestoration = this.previousScrollRestoration;
            delete this.previousScrollRestoration;
        }
    }
    shouldHandlePopState() {
        return this.pageIsLoaded();
    }
    pageIsLoaded() {
        return this.pageLoaded || document.readyState == "complete";
    }
}

class Navigator {
    constructor(delegate) {
        this.delegate = delegate;
    }
    proposeVisit(location, options = {}) {
        if (this.delegate.allowsVisitingLocationWithAction(location, options.action)) {
            if (locationIsVisitable(location, this.view.snapshot.rootLocation)) {
                this.delegate.visitProposedToLocation(location, options);
            }
            else {
                window.location.href = location.toString();
            }
        }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
        this.lastVisit = this.currentVisit;
        this.stop();
        this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options));
        this.currentVisit.start();
    }
    submitForm(form, submitter) {
        this.stop();
        this.formSubmission = new FormSubmission(this, form, submitter, true);
        this.formSubmission.start();
    }
    stop() {
        if (this.formSubmission) {
            this.formSubmission.stop();
            delete this.formSubmission;
        }
        if (this.currentVisit) {
            this.currentVisit.cancel();
            delete this.currentVisit;
        }
    }
    get adapter() {
        return this.delegate.adapter;
    }
    get view() {
        return this.delegate.view;
    }
    get history() {
        return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
        if (typeof this.adapter.formSubmissionStarted === "function") {
            this.adapter.formSubmissionStarted(formSubmission);
        }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
        if (formSubmission == this.formSubmission) {
            const responseHTML = await fetchResponse.responseHTML;
            if (responseHTML) {
                const shouldCacheSnapshot = formSubmission.method == FetchMethod.get;
                if (!shouldCacheSnapshot) {
                    this.view.clearSnapshotCache();
                }
                const { statusCode, redirected } = fetchResponse;
                const action = this.getActionForFormSubmission(formSubmission);
                const visitOptions = {
                    action,
                    shouldCacheSnapshot,
                    response: { statusCode, responseHTML, redirected },
                };
                this.proposeVisit(fetchResponse.location, visitOptions);
            }
        }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
            const snapshot = PageSnapshot.fromHTMLString(responseHTML);
            if (fetchResponse.serverError) {
                await this.view.renderError(snapshot, this.currentVisit);
            }
            else {
                await this.view.renderPage(snapshot, false, true, this.currentVisit);
            }
            this.view.scrollToTop();
            this.view.clearSnapshotCache();
        }
    }
    formSubmissionErrored(formSubmission, error) {
        console.error(error);
    }
    formSubmissionFinished(formSubmission) {
        if (typeof this.adapter.formSubmissionFinished === "function") {
            this.adapter.formSubmissionFinished(formSubmission);
        }
    }
    visitStarted(visit) {
        this.delegate.visitStarted(visit);
    }
    visitCompleted(visit) {
        this.delegate.visitCompleted(visit);
    }
    locationWithActionIsSamePage(location, action) {
        var _a;
        const anchor = getAnchor(location);
        const lastLocation = ((_a = this.lastVisit) === null || _a === void 0 ? void 0 : _a.location) || this.view.lastRenderedLocation;
        const currentAnchor = getAnchor(lastLocation);
        const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
        return (action !== "replace" &&
            getRequestURL(location) === getRequestURL(lastLocation) &&
            (isRestorationToTop || (anchor != null && anchor !== currentAnchor)));
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
        this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
        return this.history.location;
    }
    get restorationIdentifier() {
        return this.history.restorationIdentifier;
    }
    getActionForFormSubmission(formSubmission) {
        const { formElement, submitter } = formSubmission;
        const action = getAttribute("data-turbo-action", submitter, formElement);
        return isAction(action) ? action : "advance";
    }
}

var PageStage;
(function (PageStage) {
    PageStage[PageStage["initial"] = 0] = "initial";
    PageStage[PageStage["loading"] = 1] = "loading";
    PageStage[PageStage["interactive"] = 2] = "interactive";
    PageStage[PageStage["complete"] = 3] = "complete";
})(PageStage || (PageStage = {}));
class PageObserver {
    constructor(delegate) {
        this.stage = PageStage.initial;
        this.started = false;
        this.interpretReadyState = () => {
            const { readyState } = this;
            if (readyState == "interactive") {
                this.pageIsInteractive();
            }
            else if (readyState == "complete") {
                this.pageIsComplete();
            }
        };
        this.pageWillUnload = () => {
            this.delegate.pageWillUnload();
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            if (this.stage == PageStage.initial) {
                this.stage = PageStage.loading;
            }
            document.addEventListener("readystatechange", this.interpretReadyState, false);
            addEventListener("pagehide", this.pageWillUnload, false);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            document.removeEventListener("readystatechange", this.interpretReadyState, false);
            removeEventListener("pagehide", this.pageWillUnload, false);
            this.started = false;
        }
    }
    pageIsInteractive() {
        if (this.stage == PageStage.loading) {
            this.stage = PageStage.interactive;
            this.delegate.pageBecameInteractive();
        }
    }
    pageIsComplete() {
        this.pageIsInteractive();
        if (this.stage == PageStage.interactive) {
            this.stage = PageStage.complete;
            this.delegate.pageLoaded();
        }
    }
    get readyState() {
        return document.readyState;
    }
}

class ScrollObserver {
    constructor(delegate) {
        this.started = false;
        this.onScroll = () => {
            this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            addEventListener("scroll", this.onScroll, false);
            this.onScroll();
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            removeEventListener("scroll", this.onScroll, false);
            this.started = false;
        }
    }
    updatePosition(position) {
        this.delegate.scrollPositionChanged(position);
    }
}

class StreamMessageRenderer {
    render({ fragment }) {
        Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => document.documentElement.appendChild(fragment));
    }
    enteringBardo(currentPermanentElement, newPermanentElement) {
        newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() { }
}
function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
        const { id } = permanentElementInDocument;
        for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
            const elementInStream = getPermanentElementById(streamElement.templateElement.content, id);
            if (elementInStream) {
                permanentElementMap[id] = [permanentElementInDocument, elementInStream];
            }
        }
    }
    return permanentElementMap;
}

class StreamObserver {
    constructor(delegate) {
        this.sources = new Set();
        this.started = false;
        this.inspectFetchResponse = ((event) => {
            const response = fetchResponseFromEvent(event);
            if (response && fetchResponseIsStream(response)) {
                event.preventDefault();
                this.receiveMessageResponse(response);
            }
        });
        this.receiveMessageEvent = (event) => {
            if (this.started && typeof event.data == "string") {
                this.receiveMessageHTML(event.data);
            }
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            this.started = true;
            addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
        }
    }
    connectStreamSource(source) {
        if (!this.streamSourceIsConnected(source)) {
            this.sources.add(source);
            source.addEventListener("message", this.receiveMessageEvent, false);
        }
    }
    disconnectStreamSource(source) {
        if (this.streamSourceIsConnected(source)) {
            this.sources.delete(source);
            source.removeEventListener("message", this.receiveMessageEvent, false);
        }
    }
    streamSourceIsConnected(source) {
        return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
        const html = await response.responseHTML;
        if (html) {
            this.receiveMessageHTML(html);
        }
    }
    receiveMessageHTML(html) {
        this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
}
function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
        return fetchResponse;
    }
}
function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
}

class ErrorRenderer extends Renderer {
    static renderElement(currentElement, newElement) {
        const { documentElement, body } = document;
        documentElement.replaceChild(newElement, body);
    }
    async render() {
        this.replaceHeadAndBody();
        this.activateScriptElements();
    }
    replaceHeadAndBody() {
        const { documentElement, head } = document;
        documentElement.replaceChild(this.newHead, head);
        this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
        for (const replaceableElement of this.scriptElements) {
            const parentNode = replaceableElement.parentNode;
            if (parentNode) {
                const element = activateScriptElement(replaceableElement);
                parentNode.replaceChild(element, replaceableElement);
            }
        }
    }
    get newHead() {
        return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
        return document.documentElement.querySelectorAll("script");
    }
}

class PageRenderer extends Renderer {
    static renderElement(currentElement, newElement) {
        if (document.body && newElement instanceof HTMLBodyElement) {
            document.body.replaceWith(newElement);
        }
        else {
            document.documentElement.appendChild(newElement);
        }
    }
    get shouldRender() {
        return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
        if (!this.newSnapshot.isVisitable) {
            return {
                reason: "turbo_visit_control_is_reload",
            };
        }
        if (!this.trackedElementsAreIdentical) {
            return {
                reason: "tracked_element_mismatch",
            };
        }
    }
    async prepareToRender() {
        await this.mergeHead();
    }
    async render() {
        if (this.willRender) {
            this.replaceBody();
        }
    }
    finishRendering() {
        super.finishRendering();
        if (!this.isPreview) {
            this.focusFirstAutofocusableElement();
        }
    }
    get currentHeadSnapshot() {
        return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
        return this.newSnapshot.headSnapshot;
    }
    get newElement() {
        return this.newSnapshot.element;
    }
    async mergeHead() {
        const newStylesheetElements = this.copyNewHeadStylesheetElements();
        this.copyNewHeadScriptElements();
        this.removeCurrentHeadProvisionalElements();
        this.copyNewHeadProvisionalElements();
        await newStylesheetElements;
    }
    replaceBody() {
        this.preservingPermanentElements(() => {
            this.activateNewBody();
            this.assignNewBody();
        });
    }
    get trackedElementsAreIdentical() {
        return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
        const loadingElements = [];
        for (const element of this.newHeadStylesheetElements) {
            loadingElements.push(waitForLoad(element));
            document.head.appendChild(element);
        }
        await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
        for (const element of this.newHeadScriptElements) {
            document.head.appendChild(activateScriptElement(element));
        }
    }
    removeCurrentHeadProvisionalElements() {
        for (const element of this.currentHeadProvisionalElements) {
            document.head.removeChild(element);
        }
    }
    copyNewHeadProvisionalElements() {
        for (const element of this.newHeadProvisionalElements) {
            document.head.appendChild(element);
        }
    }
    activateNewBody() {
        document.adoptNode(this.newElement);
        this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
        for (const inertScriptElement of this.newBodyScriptElements) {
            const activatedScriptElement = activateScriptElement(inertScriptElement);
            inertScriptElement.replaceWith(activatedScriptElement);
        }
    }
    assignNewBody() {
        this.renderElement(this.currentElement, this.newElement);
    }
    get newHeadStylesheetElements() {
        return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
        return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
        return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
        return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
        return this.newElement.querySelectorAll("script");
    }
}

class SnapshotCache {
    constructor(size) {
        this.keys = [];
        this.snapshots = {};
        this.size = size;
    }
    has(location) {
        return toCacheKey(location) in this.snapshots;
    }
    get(location) {
        if (this.has(location)) {
            const snapshot = this.read(location);
            this.touch(location);
            return snapshot;
        }
    }
    put(location, snapshot) {
        this.write(location, snapshot);
        this.touch(location);
        return snapshot;
    }
    clear() {
        this.snapshots = {};
    }
    read(location) {
        return this.snapshots[toCacheKey(location)];
    }
    write(location, snapshot) {
        this.snapshots[toCacheKey(location)] = snapshot;
    }
    touch(location) {
        const key = toCacheKey(location);
        const index = this.keys.indexOf(key);
        if (index > -1)
            this.keys.splice(index, 1);
        this.keys.unshift(key);
        this.trim();
    }
    trim() {
        for (const key of this.keys.splice(this.size)) {
            delete this.snapshots[key];
        }
    }
}

class PageView extends View {
    constructor() {
        super(...arguments);
        this.snapshotCache = new SnapshotCache(10);
        this.lastRenderedLocation = new URL(location.href);
        this.forceReloaded = false;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit) {
        const renderer = new PageRenderer(this.snapshot, snapshot, PageRenderer.renderElement, isPreview, willRender);
        if (!renderer.shouldRender) {
            this.forceReloaded = true;
        }
        else {
            visit === null || visit === void 0 ? void 0 : visit.changeHistory();
        }
        return this.render(renderer);
    }
    renderError(snapshot, visit) {
        visit === null || visit === void 0 ? void 0 : visit.changeHistory();
        const renderer = new ErrorRenderer(this.snapshot, snapshot, ErrorRenderer.renderElement, false);
        return this.render(renderer);
    }
    clearSnapshotCache() {
        this.snapshotCache.clear();
    }
    async cacheSnapshot() {
        if (this.shouldCacheSnapshot) {
            this.delegate.viewWillCacheSnapshot();
            const { snapshot, lastRenderedLocation: location } = this;
            await nextEventLoopTick();
            const cachedSnapshot = snapshot.clone();
            this.snapshotCache.put(location, cachedSnapshot);
            return cachedSnapshot;
        }
    }
    getCachedSnapshotForLocation(location) {
        return this.snapshotCache.get(location);
    }
    get snapshot() {
        return PageSnapshot.fromElement(this.element);
    }
    get shouldCacheSnapshot() {
        return this.snapshot.isCacheable;
    }
}

class Preloader {
    constructor(delegate) {
        this.selector = "a[data-turbo-preload]";
        this.delegate = delegate;
    }
    get snapshotCache() {
        return this.delegate.navigator.view.snapshotCache;
    }
    start() {
        if (document.readyState === "loading") {
            return document.addEventListener("DOMContentLoaded", () => {
                this.preloadOnLoadLinksForView(document.body);
            });
        }
        else {
            this.preloadOnLoadLinksForView(document.body);
        }
    }
    preloadOnLoadLinksForView(element) {
        for (const link of element.querySelectorAll(this.selector)) {
            this.preloadURL(link);
        }
    }
    async preloadURL(link) {
        const location = new URL(link.href);
        if (this.snapshotCache.has(location)) {
            return;
        }
        try {
            const response = await fetch(location.toString(), { headers: { "VND.PREFETCH": "true", Accept: "text/html" } });
            const responseText = await response.text();
            const snapshot = PageSnapshot.fromHTMLString(responseText);
            this.snapshotCache.put(location, snapshot);
        }
        catch (_) {
        }
    }
}

class Session {
    constructor() {
        this.navigator = new Navigator(this);
        this.history = new History(this);
        this.preloader = new Preloader(this);
        this.view = new PageView(this, document.documentElement);
        this.adapter = new BrowserAdapter(this);
        this.pageObserver = new PageObserver(this);
        this.cacheObserver = new CacheObserver();
        this.linkClickObserver = new LinkClickObserver(this, window);
        this.formSubmitObserver = new FormSubmitObserver(this, document);
        this.scrollObserver = new ScrollObserver(this);
        this.streamObserver = new StreamObserver(this);
        this.formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
        this.frameRedirector = new FrameRedirector(this, document.documentElement);
        this.streamMessageRenderer = new StreamMessageRenderer();
        this.drive = true;
        this.enabled = true;
        this.progressBarDelay = 500;
        this.started = false;
        this.formMode = "on";
    }
    start() {
        if (!this.started) {
            this.pageObserver.start();
            this.cacheObserver.start();
            this.formLinkClickObserver.start();
            this.linkClickObserver.start();
            this.formSubmitObserver.start();
            this.scrollObserver.start();
            this.streamObserver.start();
            this.frameRedirector.start();
            this.history.start();
            this.preloader.start();
            this.started = true;
            this.enabled = true;
        }
    }
    disable() {
        this.enabled = false;
    }
    stop() {
        if (this.started) {
            this.pageObserver.stop();
            this.cacheObserver.stop();
            this.formLinkClickObserver.stop();
            this.linkClickObserver.stop();
            this.formSubmitObserver.stop();
            this.scrollObserver.stop();
            this.streamObserver.stop();
            this.frameRedirector.stop();
            this.history.stop();
            this.started = false;
        }
    }
    registerAdapter(adapter) {
        this.adapter = adapter;
    }
    visit(location, options = {}) {
        const frameElement = options.frame ? document.getElementById(options.frame) : null;
        if (frameElement instanceof FrameElement) {
            frameElement.src = location.toString();
            frameElement.loaded;
        }
        else {
            this.navigator.proposeVisit(expandURL(location), options);
        }
    }
    connectStreamSource(source) {
        this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
        this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
        this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
        this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
        this.progressBarDelay = delay;
    }
    setFormMode(mode) {
        this.formMode = mode;
    }
    get location() {
        return this.history.location;
    }
    get restorationIdentifier() {
        return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location, restorationIdentifier) {
        if (this.enabled) {
            this.navigator.startVisit(location, restorationIdentifier, {
                action: "restore",
                historyChanged: true,
            });
        }
        else {
            this.adapter.pageInvalidated({
                reason: "turbo_disabled",
            });
        }
    }
    scrollPositionChanged(position) {
        this.history.updateRestorationData({ scrollPosition: position });
    }
    willSubmitFormLinkToLocation(link, location) {
        return this.elementIsNavigatable(link) && locationIsVisitable(location, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() { }
    willFollowLinkToLocation(link, location, event) {
        return (this.elementIsNavigatable(link) &&
            locationIsVisitable(location, this.snapshot.rootLocation) &&
            this.applicationAllowsFollowingLinkToLocation(link, location, event));
    }
    followedLinkToLocation(link, location) {
        const action = this.getActionForLink(link);
        const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
        this.visit(location.href, { action, acceptsStreamResponse });
    }
    allowsVisitingLocationWithAction(location, action) {
        return this.locationWithActionIsSamePage(location, action) || this.applicationAllowsVisitingLocation(location);
    }
    visitProposedToLocation(location, options) {
        extendURLWithDeprecatedProperties(location);
        this.adapter.visitProposedToLocation(location, options);
    }
    visitStarted(visit) {
        if (!visit.acceptsStreamResponse) {
            markAsBusy(document.documentElement);
        }
        extendURLWithDeprecatedProperties(visit.location);
        if (!visit.silent) {
            this.notifyApplicationAfterVisitingLocation(visit.location, visit.action);
        }
    }
    visitCompleted(visit) {
        clearBusyState(document.documentElement);
        this.notifyApplicationAfterPageLoad(visit.getTimingMetrics());
    }
    locationWithActionIsSamePage(location, action) {
        return this.navigator.locationWithActionIsSamePage(location, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
        this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
        const action = getAction(form, submitter);
        return (this.submissionIsNavigatable(form, submitter) &&
            locationIsVisitable(expandURL(action), this.snapshot.rootLocation));
    }
    formSubmitted(form, submitter) {
        this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
        this.view.lastRenderedLocation = this.location;
        this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
        this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
        this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
        this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
        var _a;
        if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
            this.notifyApplicationBeforeCachingSnapshot();
        }
    }
    allowsImmediateRender({ element }, options) {
        const event = this.notifyApplicationBeforeRender(element, options);
        const { defaultPrevented, detail: { render }, } = event;
        if (this.view.renderer && render) {
            this.view.renderer.renderElement = render;
        }
        return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) {
        this.view.lastRenderedLocation = this.history.location;
        this.notifyApplicationAfterRender();
    }
    preloadOnLoadLinksForView(element) {
        this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
        this.adapter.pageInvalidated(reason);
    }
    frameLoaded(frame) {
        this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
        this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location, ev) {
        const event = this.notifyApplicationAfterClickingLinkToLocation(link, location, ev);
        return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location) {
        const event = this.notifyApplicationBeforeVisitingLocation(location);
        return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location, event) {
        return dispatch("turbo:click", {
            target: link,
            detail: { url: location.href, originalEvent: event },
            cancelable: true,
        });
    }
    notifyApplicationBeforeVisitingLocation(location) {
        return dispatch("turbo:before-visit", {
            detail: { url: location.href },
            cancelable: true,
        });
    }
    notifyApplicationAfterVisitingLocation(location, action) {
        return dispatch("turbo:visit", { detail: { url: location.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
        return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
        return dispatch("turbo:before-render", {
            detail: Object.assign({ newBody }, options),
            cancelable: true,
        });
    }
    notifyApplicationAfterRender() {
        return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
        return dispatch("turbo:load", {
            detail: { url: this.location.href, timing },
        });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
        dispatchEvent(new HashChangeEvent("hashchange", {
            oldURL: oldURL.toString(),
            newURL: newURL.toString(),
        }));
    }
    notifyApplicationAfterFrameLoad(frame) {
        return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
        return dispatch("turbo:frame-render", {
            detail: { fetchResponse },
            target: frame,
            cancelable: true,
        });
    }
    submissionIsNavigatable(form, submitter) {
        if (this.formMode == "off") {
            return false;
        }
        else {
            const submitterIsNavigatable = submitter ? this.elementIsNavigatable(submitter) : true;
            if (this.formMode == "optin") {
                return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
            }
            else {
                return submitterIsNavigatable && this.elementIsNavigatable(form);
            }
        }
    }
    elementIsNavigatable(element) {
        const container = element.closest("[data-turbo]");
        const withinFrame = element.closest("turbo-frame");
        if (this.drive || withinFrame) {
            if (container) {
                return container.getAttribute("data-turbo") != "false";
            }
            else {
                return true;
            }
        }
        else {
            if (container) {
                return container.getAttribute("data-turbo") == "true";
            }
            else {
                return false;
            }
        }
    }
    getActionForLink(link) {
        const action = link.getAttribute("data-turbo-action");
        return isAction(action) ? action : "advance";
    }
    get snapshot() {
        return this.view.snapshot;
    }
}
function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
}
const deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
        get() {
            return this.toString();
        },
    },
};

class Cache {
    constructor(session) {
        this.session = session;
    }
    clear() {
        this.session.clearCache();
    }
    resetCacheControl() {
        this.setCacheControl("");
    }
    exemptPageFromCache() {
        this.setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
        this.setCacheControl("no-preview");
    }
    setCacheControl(value) {
        setMetaContent("turbo-cache-control", value);
    }
}

const StreamActions = {
    after() {
        this.targetElements.forEach((e) => { var _a; return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e.nextSibling); });
    },
    append() {
        this.removeDuplicateTargetChildren();
        this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
        this.targetElements.forEach((e) => { var _a; return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e); });
    },
    prepend() {
        this.removeDuplicateTargetChildren();
        this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
        this.targetElements.forEach((e) => e.remove());
    },
    replace() {
        this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
        this.targetElements.forEach((e) => e.replaceChildren(this.templateContent));
    },
};

const session = new Session();
const cache = new Cache(session);
const { navigator: navigator$1 } = session;
function start() {
    session.start();
}
function registerAdapter(adapter) {
    session.registerAdapter(adapter);
}
function visit(location, options) {
    session.visit(location, options);
}
function connectStreamSource(source) {
    session.connectStreamSource(source);
}
function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
}
function renderStreamMessage(message) {
    session.renderStreamMessage(message);
}
function clearCache() {
    console.warn("Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`");
    session.clearCache();
}
function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
}
function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
}
function setFormMode(mode) {
    session.setFormMode(mode);
}

var Turbo = /*#__PURE__*/Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session: session,
    cache: cache,
    PageRenderer: PageRenderer,
    PageSnapshot: PageSnapshot,
    FrameRenderer: FrameRenderer,
    start: start,
    registerAdapter: registerAdapter,
    visit: visit,
    connectStreamSource: connectStreamSource,
    disconnectStreamSource: disconnectStreamSource,
    renderStreamMessage: renderStreamMessage,
    clearCache: clearCache,
    setProgressBarDelay: setProgressBarDelay,
    setConfirmMethod: setConfirmMethod,
    setFormMode: setFormMode,
    StreamActions: StreamActions
});

class FrameController {
    constructor(element) {
        this.fetchResponseLoaded = (_fetchResponse) => { };
        this.currentFetchRequest = null;
        this.resolveVisitPromise = () => { };
        this.connected = false;
        this.hasBeenLoaded = false;
        this.ignoredAttributes = new Set();
        this.action = null;
        this.visitCachedSnapshot = ({ element }) => {
            const frame = element.querySelector("#" + this.element.id);
            if (frame && this.previousFrameElement) {
                frame.replaceChildren(...this.previousFrameElement.children);
            }
            delete this.previousFrameElement;
        };
        this.element = element;
        this.view = new FrameView(this, this.element);
        this.appearanceObserver = new AppearanceObserver(this, this.element);
        this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
        this.linkClickObserver = new LinkClickObserver(this, this.element);
        this.restorationIdentifier = uuid();
        this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    connect() {
        if (!this.connected) {
            this.connected = true;
            if (this.loadingStyle == FrameLoadingStyle.lazy) {
                this.appearanceObserver.start();
            }
            else {
                this.loadSourceURL();
            }
            this.formLinkClickObserver.start();
            this.linkClickObserver.start();
            this.formSubmitObserver.start();
        }
    }
    disconnect() {
        if (this.connected) {
            this.connected = false;
            this.appearanceObserver.stop();
            this.formLinkClickObserver.stop();
            this.linkClickObserver.stop();
            this.formSubmitObserver.stop();
        }
    }
    disabledChanged() {
        if (this.loadingStyle == FrameLoadingStyle.eager) {
            this.loadSourceURL();
        }
    }
    sourceURLChanged() {
        if (this.isIgnoringChangesTo("src"))
            return;
        if (this.element.isConnected) {
            this.complete = false;
        }
        if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
            this.loadSourceURL();
        }
    }
    completeChanged() {
        if (this.isIgnoringChangesTo("complete"))
            return;
        this.loadSourceURL();
    }
    loadingStyleChanged() {
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
            this.appearanceObserver.start();
        }
        else {
            this.appearanceObserver.stop();
            this.loadSourceURL();
        }
    }
    async loadSourceURL() {
        if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
            this.element.loaded = this.visit(expandURL(this.sourceURL));
            this.appearanceObserver.stop();
            await this.element.loaded;
            this.hasBeenLoaded = true;
        }
    }
    async loadResponse(fetchResponse) {
        if (fetchResponse.redirected || (fetchResponse.succeeded && fetchResponse.isHTML)) {
            this.sourceURL = fetchResponse.response.url;
        }
        try {
            const html = await fetchResponse.responseHTML;
            if (html) {
                const { body } = parseHTMLDocument(html);
                const newFrameElement = await this.extractForeignFrameElement(body);
                if (newFrameElement) {
                    const snapshot = new Snapshot(newFrameElement);
                    const renderer = new FrameRenderer(this, this.view.snapshot, snapshot, FrameRenderer.renderElement, false, false);
                    if (this.view.renderPromise)
                        await this.view.renderPromise;
                    this.changeHistory();
                    await this.view.render(renderer);
                    this.complete = true;
                    session.frameRendered(fetchResponse, this.element);
                    session.frameLoaded(this.element);
                    this.fetchResponseLoaded(fetchResponse);
                }
                else if (this.willHandleFrameMissingFromResponse(fetchResponse)) {
                    console.warn(`A matching frame for #${this.element.id} was missing from the response, transforming into full-page Visit.`);
                    this.visitResponse(fetchResponse.response);
                }
            }
        }
        catch (error) {
            console.error(error);
            this.view.invalidate();
        }
        finally {
            this.fetchResponseLoaded = () => { };
        }
    }
    elementAppearedInViewport(_element) {
        this.loadSourceURL();
    }
    willSubmitFormLinkToLocation(link) {
        return link.closest("turbo-frame") == this.element && this.shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
        const frame = this.findFrameElement(link);
        if (frame)
            form.setAttribute("data-turbo-frame", frame.id);
    }
    willFollowLinkToLocation(element, location, event) {
        return this.shouldInterceptNavigation(element) && this.frameAllowsVisitingLocation(element, location, event);
    }
    followedLinkToLocation(element, location) {
        this.navigateFrame(element, location.href);
    }
    willSubmitForm(element, submitter) {
        return element.closest("turbo-frame") == this.element && this.shouldInterceptNavigation(element, submitter);
    }
    formSubmitted(element, submitter) {
        if (this.formSubmission) {
            this.formSubmission.stop();
        }
        this.formSubmission = new FormSubmission(this, element, submitter);
        const { fetchRequest } = this.formSubmission;
        this.prepareHeadersForRequest(fetchRequest.headers, fetchRequest);
        this.formSubmission.start();
    }
    prepareHeadersForRequest(headers, request) {
        var _a;
        headers["Turbo-Frame"] = this.id;
        if ((_a = this.currentNavigationElement) === null || _a === void 0 ? void 0 : _a.hasAttribute("data-turbo-stream")) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted(_request) {
        markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
        this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
        await this.loadResponse(response);
        this.resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
        console.error(response);
        await this.loadResponse(response);
        this.resolveVisitPromise();
    }
    requestErrored(request, error) {
        console.error(error);
        this.resolveVisitPromise();
    }
    requestFinished(_request) {
        clearBusyState(this.element);
    }
    formSubmissionStarted({ formElement }) {
        markAsBusy(formElement, this.findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
        const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
        this.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
        frame.delegate.loadResponse(response);
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
        this.element.delegate.loadResponse(fetchResponse);
    }
    formSubmissionErrored(formSubmission, error) {
        console.error(error);
    }
    formSubmissionFinished({ formElement }) {
        clearBusyState(formElement, this.findFrameElement(formElement));
    }
    allowsImmediateRender({ element: newFrame }, options) {
        const event = dispatch("turbo:before-frame-render", {
            target: this.element,
            detail: Object.assign({ newFrame }, options),
            cancelable: true,
        });
        const { defaultPrevented, detail: { render }, } = event;
        if (this.view.renderer && render) {
            this.view.renderer.renderElement = render;
        }
        return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) { }
    preloadOnLoadLinksForView(element) {
        session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() { }
    willRenderFrame(currentElement, _newElement) {
        this.previousFrameElement = currentElement.cloneNode(true);
    }
    async visit(url) {
        var _a;
        const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
        (_a = this.currentFetchRequest) === null || _a === void 0 ? void 0 : _a.cancel();
        this.currentFetchRequest = request;
        return new Promise((resolve) => {
            this.resolveVisitPromise = () => {
                this.resolveVisitPromise = () => { };
                this.currentFetchRequest = null;
                resolve();
            };
            request.perform();
        });
    }
    navigateFrame(element, url, submitter) {
        const frame = this.findFrameElement(element, submitter);
        this.proposeVisitIfNavigatedWithAction(frame, element, submitter);
        this.withCurrentNavigationElement(element, () => {
            frame.src = url;
        });
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
        this.action = getVisitAction(submitter, element, frame);
        this.frame = frame;
        if (isAction(this.action)) {
            const { visitCachedSnapshot } = frame.delegate;
            frame.delegate.fetchResponseLoaded = (fetchResponse) => {
                if (frame.src) {
                    const { statusCode, redirected } = fetchResponse;
                    const responseHTML = frame.ownerDocument.documentElement.outerHTML;
                    const response = { statusCode, redirected, responseHTML };
                    const options = {
                        response,
                        visitCachedSnapshot,
                        willRender: false,
                        updateHistory: false,
                        restorationIdentifier: this.restorationIdentifier,
                    };
                    if (this.action)
                        options.action = this.action;
                    session.visit(frame.src, options);
                }
            };
        }
    }
    changeHistory() {
        if (this.action && this.frame) {
            const method = getHistoryMethodForAction(this.action);
            session.history.update(method, expandURL(this.frame.src || ""), this.restorationIdentifier);
        }
    }
    willHandleFrameMissingFromResponse(fetchResponse) {
        this.element.setAttribute("complete", "");
        const response = fetchResponse.response;
        const visit = async (url, options = {}) => {
            if (url instanceof Response) {
                this.visitResponse(url);
            }
            else {
                session.visit(url, options);
            }
        };
        const event = dispatch("turbo:frame-missing", {
            target: this.element,
            detail: { response, visit },
            cancelable: true,
        });
        return !event.defaultPrevented;
    }
    async visitResponse(response) {
        const wrapped = new FetchResponse(response);
        const responseHTML = await wrapped.responseHTML;
        const { location, redirected, statusCode } = wrapped;
        return session.visit(location, { response: { redirected, statusCode, responseHTML } });
    }
    findFrameElement(element, submitter) {
        var _a;
        const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
        return (_a = getFrameElementById(id)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
        let element;
        const id = CSS.escape(this.id);
        try {
            element = activateElement(container.querySelector(`turbo-frame#${id}`), this.sourceURL);
            if (element) {
                return element;
            }
            element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.sourceURL);
            if (element) {
                await element.loaded;
                return await this.extractForeignFrameElement(element);
            }
        }
        catch (error) {
            console.error(error);
            return new FrameElement();
        }
        return null;
    }
    formActionIsVisitable(form, submitter) {
        const action = getAction(form, submitter);
        return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    shouldInterceptNavigation(element, submitter) {
        const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
        if (element instanceof HTMLFormElement && !this.formActionIsVisitable(element, submitter)) {
            return false;
        }
        if (!this.enabled || id == "_top") {
            return false;
        }
        if (id) {
            const frameElement = getFrameElementById(id);
            if (frameElement) {
                return !frameElement.disabled;
            }
        }
        if (!session.elementIsNavigatable(element)) {
            return false;
        }
        if (submitter && !session.elementIsNavigatable(submitter)) {
            return false;
        }
        return true;
    }
    get id() {
        return this.element.id;
    }
    get enabled() {
        return !this.element.disabled;
    }
    get sourceURL() {
        if (this.element.src) {
            return this.element.src;
        }
    }
    set sourceURL(sourceURL) {
        this.ignoringChangesToAttribute("src", () => {
            this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
        });
    }
    get loadingStyle() {
        return this.element.loading;
    }
    get isLoading() {
        return this.formSubmission !== undefined || this.resolveVisitPromise() !== undefined;
    }
    get complete() {
        return this.element.hasAttribute("complete");
    }
    set complete(value) {
        this.ignoringChangesToAttribute("complete", () => {
            if (value) {
                this.element.setAttribute("complete", "");
            }
            else {
                this.element.removeAttribute("complete");
            }
        });
    }
    get isActive() {
        return this.element.isActive && this.connected;
    }
    get rootLocation() {
        var _a;
        const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
        const root = (_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/";
        return expandURL(root);
    }
    frameAllowsVisitingLocation(target, { href: url }, originalEvent) {
        const event = dispatch("turbo:click", {
            target,
            detail: { url, originalEvent },
            cancelable: true,
        });
        return !event.defaultPrevented;
    }
    isIgnoringChangesTo(attributeName) {
        return this.ignoredAttributes.has(attributeName);
    }
    ignoringChangesToAttribute(attributeName, callback) {
        this.ignoredAttributes.add(attributeName);
        callback();
        this.ignoredAttributes.delete(attributeName);
    }
    withCurrentNavigationElement(element, callback) {
        this.currentNavigationElement = element;
        callback();
        delete this.currentNavigationElement;
    }
}
function getFrameElementById(id) {
    if (id != null) {
        const element = document.getElementById(id);
        if (element instanceof FrameElement) {
            return element;
        }
    }
}
function activateElement(element, currentURL) {
    if (element) {
        const src = element.getAttribute("src");
        if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
            throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
        }
        if (element.ownerDocument !== document) {
            element = document.importNode(element, true);
        }
        if (element instanceof FrameElement) {
            element.connectedCallback();
            element.disconnectedCallback();
            return element;
        }
    }
}

class StreamElement extends HTMLElement {
    static async renderElement(newElement) {
        await newElement.performAction();
    }
    async connectedCallback() {
        try {
            await this.render();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            this.disconnect();
        }
    }
    async render() {
        var _a;
        return ((_a = this.renderPromise) !== null && _a !== void 0 ? _a : (this.renderPromise = (async () => {
            const event = this.beforeRenderEvent;
            if (this.dispatchEvent(event)) {
                await nextAnimationFrame();
                await event.detail.render(this);
            }
        })()));
    }
    disconnect() {
        try {
            this.remove();
        }
        catch (_a) { }
    }
    removeDuplicateTargetChildren() {
        this.duplicateChildren.forEach((c) => c.remove());
    }
    get duplicateChildren() {
        var _a;
        const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
        const newChildrenIds = [...(((_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children) || [])].filter((c) => !!c.id).map((c) => c.id);
        return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    get performAction() {
        if (this.action) {
            const actionFunction = StreamActions[this.action];
            if (actionFunction) {
                return actionFunction;
            }
            this.raise("unknown action");
        }
        this.raise("action attribute is missing");
    }
    get targetElements() {
        if (this.target) {
            return this.targetElementsById;
        }
        else if (this.targets) {
            return this.targetElementsByQuery;
        }
        else {
            this.raise("target or targets attribute is missing");
        }
    }
    get templateContent() {
        return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
        if (this.firstElementChild === null) {
            const template = this.ownerDocument.createElement("template");
            this.appendChild(template);
            return template;
        }
        else if (this.firstElementChild instanceof HTMLTemplateElement) {
            return this.firstElementChild;
        }
        this.raise("first child element must be a <template> element");
    }
    get action() {
        return this.getAttribute("action");
    }
    get target() {
        return this.getAttribute("target");
    }
    get targets() {
        return this.getAttribute("targets");
    }
    raise(message) {
        throw new Error(`${this.description}: ${message}`);
    }
    get description() {
        var _a, _b;
        return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
        return new CustomEvent("turbo:before-stream-render", {
            bubbles: true,
            cancelable: true,
            detail: { newStream: this, render: StreamElement.renderElement },
        });
    }
    get targetElementsById() {
        var _a;
        const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
        if (element !== null) {
            return [element];
        }
        else {
            return [];
        }
    }
    get targetElementsByQuery() {
        var _a;
        const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
        if (elements.length !== 0) {
            return Array.prototype.slice.call(elements);
        }
        else {
            return [];
        }
    }
}

class StreamSourceElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.streamSource = null;
    }
    connectedCallback() {
        this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
        connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
        if (this.streamSource) {
            disconnectStreamSource(this.streamSource);
        }
    }
    get src() {
        return this.getAttribute("src") || "";
    }
}

FrameElement.delegateConstructor = FrameController;
if (customElements.get("turbo-frame") === undefined) {
    customElements.define("turbo-frame", FrameElement);
}
if (customElements.get("turbo-stream") === undefined) {
    customElements.define("turbo-stream", StreamElement);
}
if (customElements.get("turbo-stream-source") === undefined) {
    customElements.define("turbo-stream-source", StreamSourceElement);
}

(() => {
    let element = document.currentScript;
    if (!element)
        return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
        return;
    element = element.parentElement;
    while (element) {
        if (element == document.body) {
            return console.warn(unindent `
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
        }
        element = element.parentElement;
    }
})();

window.Turbo = Turbo;
start();




/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/AbortController.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/AbortController.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AbortController": () => (/* binding */ AbortController)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
// We don't actually ever use the API being polyfilled, we always use the polyfill because
// it's a very new API right now.
// Not exported from index.
/** @private */
class AbortController {
    constructor() {
        this._isAborted = false;
        this.onabort = null;
    }
    abort() {
        if (!this._isAborted) {
            this._isAborted = true;
            if (this.onabort) {
                this.onabort();
            }
        }
    }
    get signal() {
        return this;
    }
    get aborted() {
        return this._isAborted;
    }
}
//# sourceMappingURL=AbortController.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultHttpClient": () => (/* binding */ DefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FetchHttpClient */ "./node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
/* harmony import */ var _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./XhrHttpClient */ "./node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





/** Default implementation of {@link @microsoft/signalr.HttpClient}. */
class DefaultHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
    constructor(logger) {
        super();
        if (typeof fetch !== "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode) {
            this._httpClient = new _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__.FetchHttpClient(logger);
        }
        else if (typeof XMLHttpRequest !== "undefined") {
            this._httpClient = new _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__.XhrHttpClient(logger);
        }
        else {
            throw new Error("No usable HttpClient found.");
        }
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_4__.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return this._httpClient.send(request);
    }
    getCookieString(url) {
        return this._httpClient.getCookieString(url);
    }
}
//# sourceMappingURL=DefaultHttpClient.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultReconnectPolicy": () => (/* binding */ DefaultReconnectPolicy)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// 0, 2, 10, 30 second delays before reconnect attempts.
const DEFAULT_RETRY_DELAYS_IN_MILLISECONDS = [0, 2000, 10000, 30000, null];
/** @private */
class DefaultReconnectPolicy {
    constructor(retryDelays) {
        this._retryDelays = retryDelays !== undefined ? [...retryDelays, null] : DEFAULT_RETRY_DELAYS_IN_MILLISECONDS;
    }
    nextRetryDelayInMilliseconds(retryContext) {
        return this._retryDelays[retryContext.previousRetryCount];
    }
}
//# sourceMappingURL=DefaultReconnectPolicy.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/Errors.js":
/*!************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Errors.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AbortError": () => (/* binding */ AbortError),
/* harmony export */   "AggregateErrors": () => (/* binding */ AggregateErrors),
/* harmony export */   "DisabledTransportError": () => (/* binding */ DisabledTransportError),
/* harmony export */   "FailedToNegotiateWithServerError": () => (/* binding */ FailedToNegotiateWithServerError),
/* harmony export */   "FailedToStartTransportError": () => (/* binding */ FailedToStartTransportError),
/* harmony export */   "HttpError": () => (/* binding */ HttpError),
/* harmony export */   "TimeoutError": () => (/* binding */ TimeoutError),
/* harmony export */   "UnsupportedTransportError": () => (/* binding */ UnsupportedTransportError)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Error thrown when an HTTP request fails. */
class HttpError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
     *
     * @param {string} errorMessage A descriptive error message.
     * @param {number} statusCode The HTTP status code represented by this error.
     */
    constructor(errorMessage, statusCode) {
        const trueProto = new.target.prototype;
        super(`${errorMessage}: Status code '${statusCode}'`);
        this.statusCode = statusCode;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when a timeout elapses. */
class TimeoutError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
     *
     * @param {string} errorMessage A descriptive error message.
     */
    constructor(errorMessage = "A timeout occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when an action is aborted. */
class AbortError extends Error {
    /** Constructs a new instance of {@link AbortError}.
     *
     * @param {string} errorMessage A descriptive error message.
     */
    constructor(errorMessage = "An abort occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport is unsupported by the browser. */
/** @private */
class UnsupportedTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.UnsupportedTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occured on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'UnsupportedTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport is disabled by the browser. */
/** @private */
class DisabledTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.DisabledTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occured on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'DisabledTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport cannot be started. */
/** @private */
class FailedToStartTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.FailedToStartTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occured on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'FailedToStartTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the negotiation with the server failed to complete. */
/** @private */
class FailedToNegotiateWithServerError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.FailedToNegotiateWithServerError}.
     *
     * @param {string} message A descriptive error message.
     */
    constructor(message) {
        const trueProto = new.target.prototype;
        super(message);
        this.errorType = 'FailedToNegotiateWithServerError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when multiple errors have occured. */
/** @private */
class AggregateErrors extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.AggregateErrors}.
     *
     * @param {string} message A descriptive error message.
     * @param {Error[]} innerErrors The collection of errors this error is aggregating.
     */
    constructor(message, innerErrors) {
        const trueProto = new.target.prototype;
        super(message);
        this.innerErrors = innerErrors;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
//# sourceMappingURL=Errors.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FetchHttpClient": () => (/* binding */ FetchHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class FetchHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(logger) {
        super();
        this._logger = logger;
        if (typeof fetch === "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            // Cookies aren't automatically handled in Node so we need to add a CookieJar to preserve cookies across requests
            this._jar = new (requireFunc("tough-cookie")).CookieJar();
            this._fetchType = requireFunc("node-fetch");
            // node-fetch doesn't have a nice API for getting and setting cookies
            // fetch-cookie will wrap a fetch implementation with a default CookieJar or a provided one
            this._fetchType = requireFunc("fetch-cookie")(this._fetchType, this._jar);
        }
        else {
            this._fetchType = fetch.bind((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getGlobalThis)());
        }
        if (typeof AbortController === "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            // Node needs EventListener methods on AbortController which our custom polyfill doesn't provide
            this._abortControllerType = requireFunc("abort-controller");
        }
        else {
            this._abortControllerType = AbortController;
        }
    }
    /** @inheritDoc */
    async send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            throw new _Errors__WEBPACK_IMPORTED_MODULE_2__.AbortError();
        }
        if (!request.method) {
            throw new Error("No method defined.");
        }
        if (!request.url) {
            throw new Error("No url defined.");
        }
        const abortController = new this._abortControllerType();
        let error;
        // Hook our abortSignal into the abort controller
        if (request.abortSignal) {
            request.abortSignal.onabort = () => {
                abortController.abort();
                error = new _Errors__WEBPACK_IMPORTED_MODULE_2__.AbortError();
            };
        }
        // If a timeout has been passed in, setup a timeout to call abort
        // Type needs to be any to fit window.setTimeout and NodeJS.setTimeout
        let timeoutId = null;
        if (request.timeout) {
            const msTimeout = request.timeout;
            timeoutId = setTimeout(() => {
                abortController.abort();
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Timeout from HTTP request.`);
                error = new _Errors__WEBPACK_IMPORTED_MODULE_2__.TimeoutError();
            }, msTimeout);
        }
        let response;
        try {
            response = await this._fetchType(request.url, {
                body: request.content,
                cache: "no-cache",
                credentials: request.withCredentials === true ? "include" : "same-origin",
                headers: {
                    "Content-Type": "text/plain;charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    ...request.headers,
                },
                method: request.method,
                mode: "cors",
                redirect: "follow",
                signal: abortController.signal,
            });
        }
        catch (e) {
            if (error) {
                throw error;
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Error from HTTP request. ${e}.`);
            throw e;
        }
        finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = null;
            }
        }
        if (!response.ok) {
            const errorMessage = await deserializeContent(response, "text");
            throw new _Errors__WEBPACK_IMPORTED_MODULE_2__.HttpError(errorMessage || response.statusText, response.status);
        }
        const content = deserializeContent(response, request.responseType);
        const payload = await content;
        return new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(response.status, response.statusText, payload);
    }
    getCookieString(url) {
        let cookies = "";
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && this._jar) {
            // @ts-ignore: unused variable
            this._jar.getCookies(url, (e, c) => cookies = c.join("; "));
        }
        return cookies;
    }
}
function deserializeContent(response, responseType) {
    let content;
    switch (responseType) {
        case "arraybuffer":
            content = response.arrayBuffer();
            break;
        case "text":
            content = response.text();
            break;
        case "blob":
        case "document":
        case "json":
            throw new Error(`${responseType} is not supported.`);
        default:
            content = response.text();
            break;
    }
    return content;
}
//# sourceMappingURL=FetchHttpClient.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HandshakeProtocol": () => (/* binding */ HandshakeProtocol)
/* harmony export */ });
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextMessageFormat */ "./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class HandshakeProtocol {
    // Handshake request is always JSON
    writeHandshakeRequest(handshakeRequest) {
        return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.write(JSON.stringify(handshakeRequest));
    }
    parseHandshakeResponse(data) {
        let messageData;
        let remainingData;
        if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(data)) {
            // Format is binary but still need to read JSON text from handshake response
            const binaryData = new Uint8Array(data);
            const separatorIndex = binaryData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparatorCode);
            if (separatorIndex === -1) {
                throw new Error("Message is incomplete.");
            }
            // content before separator is handshake response
            // optional content after is additional messages
            const responseLength = separatorIndex + 1;
            messageData = String.fromCharCode.apply(null, Array.prototype.slice.call(binaryData.slice(0, responseLength)));
            remainingData = (binaryData.byteLength > responseLength) ? binaryData.slice(responseLength).buffer : null;
        }
        else {
            const textData = data;
            const separatorIndex = textData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparator);
            if (separatorIndex === -1) {
                throw new Error("Message is incomplete.");
            }
            // content before separator is handshake response
            // optional content after is additional messages
            const responseLength = separatorIndex + 1;
            messageData = textData.substring(0, responseLength);
            remainingData = (textData.length > responseLength) ? textData.substring(responseLength) : null;
        }
        // At this point we should have just the single handshake message
        const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.parse(messageData);
        const response = JSON.parse(messages[0]);
        if (response.type) {
            throw new Error("Expected a handshake response from the server.");
        }
        const responseMessage = response;
        // multiple messages could have arrived with handshake
        // return additional data to be parsed as usual, or null if all parsed
        return [remainingData, responseMessage];
    }
}
//# sourceMappingURL=HandshakeProtocol.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HeaderNames": () => (/* binding */ HeaderNames)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
class HeaderNames {
}
HeaderNames.Authorization = "Authorization";
HeaderNames.Cookie = "Cookie";
//# sourceMappingURL=HeaderNames.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js":
/*!****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HttpClient.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpClient": () => (/* binding */ HttpClient),
/* harmony export */   "HttpResponse": () => (/* binding */ HttpResponse)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Represents an HTTP response. */
class HttpResponse {
    constructor(statusCode, statusText, content) {
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.content = content;
    }
}
/** Abstraction over an HTTP client.
 *
 * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
 */
class HttpClient {
    get(url, options) {
        return this.send({
            ...options,
            method: "GET",
            url,
        });
    }
    post(url, options) {
        return this.send({
            ...options,
            method: "POST",
            url,
        });
    }
    delete(url, options) {
        return this.send({
            ...options,
            method: "DELETE",
            url,
        });
    }
    /** Gets all cookies that apply to the specified URL.
     *
     * @param url The URL that the cookies are valid for.
     * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
     */
    // @ts-ignore
    getCookieString(url) {
        return "";
    }
}
//# sourceMappingURL=HttpClient.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HttpConnection.js":
/*!********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HttpConnection.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpConnection": () => (/* binding */ HttpConnection),
/* harmony export */   "TransportSendQueue": () => (/* binding */ TransportSendQueue)
/* harmony export */ });
/* harmony import */ var _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DefaultHttpClient */ "./node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js");
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./HeaderNames */ "./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _LongPollingTransport__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LongPollingTransport */ "./node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js");
/* harmony import */ var _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ServerSentEventsTransport */ "./node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
/* harmony import */ var _WebSocketTransport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./WebSocketTransport */ "./node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.









const MAX_REDIRECTS = 100;
/** @private */
class HttpConnection {
    constructor(url, options = {}) {
        this._stopPromiseResolver = () => { };
        this.features = {};
        this._negotiateVersion = 1;
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        this._logger = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.createLogger)(options.logger);
        this.baseUrl = this._resolveUrl(url);
        options = options || {};
        options.logMessageContent = options.logMessageContent === undefined ? false : options.logMessageContent;
        if (typeof options.withCredentials === "boolean" || options.withCredentials === undefined) {
            options.withCredentials = options.withCredentials === undefined ? true : options.withCredentials;
        }
        else {
            throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
        }
        options.timeout = options.timeout === undefined ? 100 * 1000 : options.timeout;
        let webSocketModule = null;
        let eventSourceModule = null;
        if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && "function" !== "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            webSocketModule = requireFunc("ws");
            eventSourceModule = requireFunc("eventsource");
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && typeof WebSocket !== "undefined" && !options.WebSocket) {
            options.WebSocket = WebSocket;
        }
        else if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && !options.WebSocket) {
            if (webSocketModule) {
                options.WebSocket = webSocketModule;
            }
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && typeof EventSource !== "undefined" && !options.EventSource) {
            options.EventSource = EventSource;
        }
        else if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && !options.EventSource) {
            if (typeof eventSourceModule !== "undefined") {
                options.EventSource = eventSourceModule;
            }
        }
        this._httpClient = options.httpClient || new _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_1__.DefaultHttpClient(this._logger);
        this._connectionState = "Disconnected" /* Disconnected */;
        this._connectionStarted = false;
        this._options = options;
        this.onreceive = null;
        this.onclose = null;
    }
    async start(transferFormat) {
        transferFormat = transferFormat || _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary;
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Starting connection with transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat[transferFormat]}'.`);
        if (this._connectionState !== "Disconnected" /* Disconnected */) {
            return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
        }
        this._connectionState = "Connecting" /* Connecting */;
        this._startInternalPromise = this._startInternal(transferFormat);
        await this._startInternalPromise;
        // The TypeScript compiler thinks that connectionState must be Connecting here. The TypeScript compiler is wrong.
        if (this._connectionState === "Disconnecting" /* Disconnecting */) {
            // stop() was called and transitioned the client into the Disconnecting state.
            const message = "Failed to start the HttpConnection before stop() was called.";
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, message);
            // We cannot await stopPromise inside startInternal since stopInternal awaits the startInternalPromise.
            await this._stopPromise;
            return Promise.reject(new Error(message));
        }
        else if (this._connectionState !== "Connected" /* Connected */) {
            // stop() was called and transitioned the client into the Disconnecting state.
            const message = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, message);
            return Promise.reject(new Error(message));
        }
        this._connectionStarted = true;
    }
    send(data) {
        if (this._connectionState !== "Connected" /* Connected */) {
            return Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."));
        }
        if (!this._sendQueue) {
            this._sendQueue = new TransportSendQueue(this.transport);
        }
        // Transport will not be null if state is connected
        return this._sendQueue.send(data);
    }
    async stop(error) {
        if (this._connectionState === "Disconnected" /* Disconnected */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnected state.`);
            return Promise.resolve();
        }
        if (this._connectionState === "Disconnecting" /* Disconnecting */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
            return this._stopPromise;
        }
        this._connectionState = "Disconnecting" /* Disconnecting */;
        this._stopPromise = new Promise((resolve) => {
            // Don't complete stop() until stopConnection() completes.
            this._stopPromiseResolver = resolve;
        });
        // stopInternal should never throw so just observe it.
        await this._stopInternal(error);
        await this._stopPromise;
    }
    async _stopInternal(error) {
        // Set error as soon as possible otherwise there is a race between
        // the transport closing and providing an error and the error from a close message
        // We would prefer the close message error.
        this._stopError = error;
        try {
            await this._startInternalPromise;
        }
        catch (e) {
            // This exception is returned to the user as a rejected Promise from the start method.
        }
        // The transport's onclose will trigger stopConnection which will run our onclose event.
        // The transport should always be set if currently connected. If it wasn't set, it's likely because
        // stop was called during start() and start() failed.
        if (this.transport) {
            try {
                await this.transport.stop();
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `HttpConnection.transport.stop() threw error '${e}'.`);
                this._stopConnection();
            }
            this.transport = undefined;
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
        }
    }
    async _startInternal(transferFormat) {
        // Store the original base url and the access token factory since they may change
        // as part of negotiating
        let url = this.baseUrl;
        this._accessTokenFactory = this._options.accessTokenFactory;
        try {
            if (this._options.skipNegotiation) {
                if (this._options.transport === _ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType.WebSockets) {
                    // No need to add a connection ID in this case
                    this.transport = this._constructTransport(_ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType.WebSockets);
                    // We should just call connect directly in this case.
                    // No fallback or negotiate in this case.
                    await this._startTransport(url, transferFormat);
                }
                else {
                    throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
                }
            }
            else {
                let negotiateResponse = null;
                let redirects = 0;
                do {
                    negotiateResponse = await this._getNegotiationResponse(url);
                    // the user tries to stop the connection when it is being started
                    if (this._connectionState === "Disconnecting" /* Disconnecting */ || this._connectionState === "Disconnected" /* Disconnected */) {
                        throw new Error("The connection was stopped during negotiation.");
                    }
                    if (negotiateResponse.error) {
                        throw new Error(negotiateResponse.error);
                    }
                    if (negotiateResponse.ProtocolVersion) {
                        throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
                    }
                    if (negotiateResponse.url) {
                        url = negotiateResponse.url;
                    }
                    if (negotiateResponse.accessToken) {
                        // Replace the current access token factory with one that uses
                        // the returned access token
                        const accessToken = negotiateResponse.accessToken;
                        this._accessTokenFactory = () => accessToken;
                    }
                    redirects++;
                } while (negotiateResponse.url && redirects < MAX_REDIRECTS);
                if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
                    throw new Error("Negotiate redirection limit exceeded.");
                }
                await this._createTransport(url, this._options.transport, negotiateResponse, transferFormat);
            }
            if (this.transport instanceof _LongPollingTransport__WEBPACK_IMPORTED_MODULE_4__.LongPollingTransport) {
                this.features.inherentKeepAlive = true;
            }
            if (this._connectionState === "Connecting" /* Connecting */) {
                // Ensure the connection transitions to the connected state prior to completing this.startInternalPromise.
                // start() will handle the case when stop was called and startInternal exits still in the disconnecting state.
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, "The HttpConnection connected successfully.");
                this._connectionState = "Connected" /* Connected */;
            }
            // stop() is waiting on us via this.startInternalPromise so keep this.transport around so it can clean up.
            // This is the only case startInternal can exit in neither the connected nor disconnected state because stopConnection()
            // will transition to the disconnected state. start() will wait for the transition using the stopPromise.
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, "Failed to start the connection: " + e);
            this._connectionState = "Disconnected" /* Disconnected */;
            this.transport = undefined;
            // if start fails, any active calls to stop assume that start will complete the stop promise
            this._stopPromiseResolver();
            return Promise.reject(e);
        }
    }
    async _getNegotiationResponse(url) {
        const headers = {};
        if (this._accessTokenFactory) {
            const token = await this._accessTokenFactory();
            if (token) {
                headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_5__.HeaderNames.Authorization] = `Bearer ${token}`;
            }
        }
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
        headers[name] = value;
        const negotiateUrl = this._resolveNegotiateUrl(url);
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Sending negotiation request: ${negotiateUrl}.`);
        try {
            const response = await this._httpClient.post(negotiateUrl, {
                content: "",
                headers: { ...headers, ...this._options.headers },
                timeout: this._options.timeout,
                withCredentials: this._options.withCredentials,
            });
            if (response.statusCode !== 200) {
                return Promise.reject(new Error(`Unexpected status code returned from negotiate '${response.statusCode}'`));
            }
            const negotiateResponse = JSON.parse(response.content);
            if (!negotiateResponse.negotiateVersion || negotiateResponse.negotiateVersion < 1) {
                // Negotiate version 0 doesn't use connectionToken
                // So we set it equal to connectionId so all our logic can use connectionToken without being aware of the negotiate version
                negotiateResponse.connectionToken = negotiateResponse.connectionId;
            }
            return negotiateResponse;
        }
        catch (e) {
            let errorMessage = "Failed to complete negotiation with the server: " + e;
            if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_6__.HttpError) {
                if (e.statusCode === 404) {
                    errorMessage = errorMessage + " Either this is not a SignalR endpoint or there is a proxy blocking the connection.";
                }
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, errorMessage);
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_6__.FailedToNegotiateWithServerError(errorMessage));
        }
    }
    _createConnectUrl(url, connectionToken) {
        if (!connectionToken) {
            return url;
        }
        return url + (url.indexOf("?") === -1 ? "?" : "&") + `id=${connectionToken}`;
    }
    async _createTransport(url, requestedTransport, negotiateResponse, requestedTransferFormat) {
        let connectUrl = this._createConnectUrl(url, negotiateResponse.connectionToken);
        if (this._isITransport(requestedTransport)) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
            this.transport = requestedTransport;
            await this._startTransport(connectUrl, requestedTransferFormat);
            this.connectionId = negotiateResponse.connectionId;
            return;
        }
        const transportExceptions = [];
        const transports = negotiateResponse.availableTransports || [];
        let negotiate = negotiateResponse;
        for (const endpoint of transports) {
            const transportOrError = this._resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat);
            if (transportOrError instanceof Error) {
                // Store the error and continue, we don't want to cause a re-negotiate in these cases
                transportExceptions.push(`${endpoint.transport} failed:`);
                transportExceptions.push(transportOrError);
            }
            else if (this._isITransport(transportOrError)) {
                this.transport = transportOrError;
                if (!negotiate) {
                    try {
                        negotiate = await this._getNegotiationResponse(url);
                    }
                    catch (ex) {
                        return Promise.reject(ex);
                    }
                    connectUrl = this._createConnectUrl(url, negotiate.connectionToken);
                }
                try {
                    await this._startTransport(connectUrl, requestedTransferFormat);
                    this.connectionId = negotiate.connectionId;
                    return;
                }
                catch (ex) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `Failed to start the transport '${endpoint.transport}': ${ex}`);
                    negotiate = undefined;
                    transportExceptions.push(new _Errors__WEBPACK_IMPORTED_MODULE_6__.FailedToStartTransportError(`${endpoint.transport} failed: ${ex}`, _ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[endpoint.transport]));
                    if (this._connectionState !== "Connecting" /* Connecting */) {
                        const message = "Failed to select transport before stop() was called.";
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, message);
                        return Promise.reject(new Error(message));
                    }
                }
            }
        }
        if (transportExceptions.length > 0) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_6__.AggregateErrors(`Unable to connect to the server with any of the available transports. ${transportExceptions.join(" ")}`, transportExceptions));
        }
        return Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
    }
    _constructTransport(transport) {
        switch (transport) {
            case _ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType.WebSockets:
                if (!this._options.WebSocket) {
                    throw new Error("'WebSocket' is not supported in your environment.");
                }
                return new _WebSocketTransport__WEBPACK_IMPORTED_MODULE_7__.WebSocketTransport(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
            case _ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType.ServerSentEvents:
                if (!this._options.EventSource) {
                    throw new Error("'EventSource' is not supported in your environment.");
                }
                return new _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_8__.ServerSentEventsTransport(this._httpClient, this._accessTokenFactory, this._logger, this._options);
            case _ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType.LongPolling:
                return new _LongPollingTransport__WEBPACK_IMPORTED_MODULE_4__.LongPollingTransport(this._httpClient, this._accessTokenFactory, this._logger, this._options);
            default:
                throw new Error(`Unknown transport: ${transport}.`);
        }
    }
    _startTransport(url, transferFormat) {
        this.transport.onreceive = this.onreceive;
        this.transport.onclose = (e) => this._stopConnection(e);
        return this.transport.connect(url, transferFormat);
    }
    _resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat) {
        const transport = _ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[endpoint.transport];
        if (transport === null || transport === undefined) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
            return new Error(`Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
        }
        else {
            if (transportMatches(requestedTransport, transport)) {
                const transferFormats = endpoint.transferFormats.map((s) => _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat[s]);
                if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
                    if ((transport === _ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType.WebSockets && !this._options.WebSocket) ||
                        (transport === _ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType.ServerSentEvents && !this._options.EventSource)) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[transport]}' because it is not supported in your environment.'`);
                        return new _Errors__WEBPACK_IMPORTED_MODULE_6__.UnsupportedTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[transport]}' is not supported in your environment.`, transport);
                    }
                    else {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Selecting transport '${_ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[transport]}'.`);
                        try {
                            return this._constructTransport(transport);
                        }
                        catch (ex) {
                            return ex;
                        }
                    }
                }
                else {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[transport]}' because it does not support the requested transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat[requestedTransferFormat]}'.`);
                    return new Error(`'${_ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[transport]}' does not support ${_ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat[requestedTransferFormat]}.`);
                }
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[transport]}' because it was disabled by the client.`);
                return new _Errors__WEBPACK_IMPORTED_MODULE_6__.DisabledTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_2__.HttpTransportType[transport]}' is disabled by the client.`, transport);
            }
        }
    }
    _isITransport(transport) {
        return transport && typeof (transport) === "object" && "connect" in transport;
    }
    _stopConnection(error) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `HttpConnection.stopConnection(${error}) called while in state ${this._connectionState}.`);
        this.transport = undefined;
        // If we have a stopError, it takes precedence over the error from the transport
        error = this._stopError || error;
        this._stopError = undefined;
        if (this._connectionState === "Disconnected" /* Disconnected */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Debug, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is already in the disconnected state.`);
            return;
        }
        if (this._connectionState === "Connecting" /* Connecting */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is still in the connecting state.`);
            throw new Error(`HttpConnection.stopConnection(${error}) was called while the connection is still in the connecting state.`);
        }
        if (this._connectionState === "Disconnecting" /* Disconnecting */) {
            // A call to stop() induced this call to stopConnection and needs to be completed.
            // Any stop() awaiters will be scheduled to continue after the onclose callback fires.
            this._stopPromiseResolver();
        }
        if (error) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `Connection disconnected with error '${error}'.`);
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, "Connection disconnected.");
        }
        if (this._sendQueue) {
            this._sendQueue.stop().catch((e) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `TransportSendQueue.stop() threw error '${e}'.`);
            });
            this._sendQueue = undefined;
        }
        this.connectionId = undefined;
        this._connectionState = "Disconnected" /* Disconnected */;
        if (this._connectionStarted) {
            this._connectionStarted = false;
            try {
                if (this.onclose) {
                    this.onclose(error);
                }
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `HttpConnection.onclose(${error}) threw error '${e}'.`);
            }
        }
    }
    _resolveUrl(url) {
        // startsWith is not supported in IE
        if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
            return url;
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isBrowser) {
            throw new Error(`Cannot resolve '${url}'.`);
        }
        // Setting the url to the href propery of an anchor tag handles normalization
        // for us. There are 3 main cases.
        // 1. Relative path normalization e.g "b" -> "http://localhost:5000/a/b"
        // 2. Absolute path normalization e.g "/a/b" -> "http://localhost:5000/a/b"
        // 3. Networkpath reference normalization e.g "//localhost:5000/a/b" -> "http://localhost:5000/a/b"
        const aTag = window.document.createElement("a");
        aTag.href = url;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, `Normalizing '${url}' to '${aTag.href}'.`);
        return aTag.href;
    }
    _resolveNegotiateUrl(url) {
        const index = url.indexOf("?");
        let negotiateUrl = url.substring(0, index === -1 ? url.length : index);
        if (negotiateUrl[negotiateUrl.length - 1] !== "/") {
            negotiateUrl += "/";
        }
        negotiateUrl += "negotiate";
        negotiateUrl += index === -1 ? "" : url.substring(index);
        if (negotiateUrl.indexOf("negotiateVersion") === -1) {
            negotiateUrl += index === -1 ? "?" : "&";
            negotiateUrl += "negotiateVersion=" + this._negotiateVersion;
        }
        return negotiateUrl;
    }
}
function transportMatches(requestedTransport, actualTransport) {
    return !requestedTransport || ((actualTransport & requestedTransport) !== 0);
}
/** @private */
class TransportSendQueue {
    constructor(_transport) {
        this._transport = _transport;
        this._buffer = [];
        this._executing = true;
        this._sendBufferedData = new PromiseSource();
        this._transportResult = new PromiseSource();
        this._sendLoopPromise = this._sendLoop();
    }
    send(data) {
        this._bufferData(data);
        if (!this._transportResult) {
            this._transportResult = new PromiseSource();
        }
        return this._transportResult.promise;
    }
    stop() {
        this._executing = false;
        this._sendBufferedData.resolve();
        return this._sendLoopPromise;
    }
    _bufferData(data) {
        if (this._buffer.length && typeof (this._buffer[0]) !== typeof (data)) {
            throw new Error(`Expected data to be of type ${typeof (this._buffer)} but was of type ${typeof (data)}`);
        }
        this._buffer.push(data);
        this._sendBufferedData.resolve();
    }
    async _sendLoop() {
        while (true) {
            await this._sendBufferedData.promise;
            if (!this._executing) {
                if (this._transportResult) {
                    this._transportResult.reject("Connection stopped.");
                }
                break;
            }
            this._sendBufferedData = new PromiseSource();
            const transportResult = this._transportResult;
            this._transportResult = undefined;
            const data = typeof (this._buffer[0]) === "string" ?
                this._buffer.join("") :
                TransportSendQueue._concatBuffers(this._buffer);
            this._buffer.length = 0;
            try {
                await this._transport.send(data);
                transportResult.resolve();
            }
            catch (error) {
                transportResult.reject(error);
            }
        }
    }
    static _concatBuffers(arrayBuffers) {
        const totalLength = arrayBuffers.map((b) => b.byteLength).reduce((a, b) => a + b);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const item of arrayBuffers) {
            result.set(new Uint8Array(item), offset);
            offset += item.byteLength;
        }
        return result.buffer;
    }
}
class PromiseSource {
    constructor() {
        this.promise = new Promise((resolve, reject) => [this._resolver, this._rejecter] = [resolve, reject]);
    }
    resolve() {
        this._resolver();
    }
    reject(reason) {
        this._rejecter(reason);
    }
}
//# sourceMappingURL=HttpConnection.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HubConnection.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HubConnection.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HubConnection": () => (/* binding */ HubConnection),
/* harmony export */   "HubConnectionState": () => (/* binding */ HubConnectionState)
/* harmony export */ });
/* harmony import */ var _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HandshakeProtocol */ "./node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js");
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Subject */ "./node_modules/@microsoft/signalr/dist/esm/Subject.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





const DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
const DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
/** Describes the current state of the {@link HubConnection} to the server. */
var HubConnectionState;
(function (HubConnectionState) {
    /** The hub connection is disconnected. */
    HubConnectionState["Disconnected"] = "Disconnected";
    /** The hub connection is connecting. */
    HubConnectionState["Connecting"] = "Connecting";
    /** The hub connection is connected. */
    HubConnectionState["Connected"] = "Connected";
    /** The hub connection is disconnecting. */
    HubConnectionState["Disconnecting"] = "Disconnecting";
    /** The hub connection is reconnecting. */
    HubConnectionState["Reconnecting"] = "Reconnecting";
})(HubConnectionState || (HubConnectionState = {}));
/** Represents a connection to a SignalR Hub. */
class HubConnection {
    constructor(connection, logger, protocol, reconnectPolicy) {
        this._nextKeepAlive = 0;
        this._freezeEventListener = () => {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://docs.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
        };
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(connection, "connection");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logger, "logger");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
        this.serverTimeoutInMilliseconds = DEFAULT_TIMEOUT_IN_MS;
        this.keepAliveIntervalInMilliseconds = DEFAULT_PING_INTERVAL_IN_MS;
        this._logger = logger;
        this._protocol = protocol;
        this.connection = connection;
        this._reconnectPolicy = reconnectPolicy;
        this._handshakeProtocol = new _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_2__.HandshakeProtocol();
        this.connection.onreceive = (data) => this._processIncomingData(data);
        this.connection.onclose = (error) => this._connectionClosed(error);
        this._callbacks = {};
        this._methods = {};
        this._closedCallbacks = [];
        this._reconnectingCallbacks = [];
        this._reconnectedCallbacks = [];
        this._invocationId = 0;
        this._receivedHandshakeResponse = false;
        this._connectionState = HubConnectionState.Disconnected;
        this._connectionStarted = false;
        this._cachedPingMessage = this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping });
    }
    /** @internal */
    // Using a public static factory method means we can have a private constructor and an _internal_
    // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
    // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
    // public parameter-less constructor.
    static create(connection, logger, protocol, reconnectPolicy) {
        return new HubConnection(connection, logger, protocol, reconnectPolicy);
    }
    /** Indicates the state of the {@link HubConnection} to the server. */
    get state() {
        return this._connectionState;
    }
    /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
     *  in the disconnected state or if the negotiation step was skipped.
     */
    get connectionId() {
        return this.connection ? (this.connection.connectionId || null) : null;
    }
    /** Indicates the url of the {@link HubConnection} to the server. */
    get baseUrl() {
        return this.connection.baseUrl || "";
    }
    /**
     * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
     * Reconnecting states.
     * @param {string} url The url to connect to.
     */
    set baseUrl(url) {
        if (this._connectionState !== HubConnectionState.Disconnected && this._connectionState !== HubConnectionState.Reconnecting) {
            throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
        }
        if (!url) {
            throw new Error("The HubConnection url must be a valid url.");
        }
        this.connection.baseUrl = url;
    }
    /** Starts the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
     */
    start() {
        this._startPromise = this._startWithStateTransitions();
        return this._startPromise;
    }
    async _startWithStateTransitions() {
        if (this._connectionState !== HubConnectionState.Disconnected) {
            return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
        }
        this._connectionState = HubConnectionState.Connecting;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Starting HubConnection.");
        try {
            await this._startInternal();
            if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
                // Log when the browser freezes the tab so users know why their connection unexpectedly stopped working
                window.document.addEventListener("freeze", this._freezeEventListener);
            }
            this._connectionState = HubConnectionState.Connected;
            this._connectionStarted = true;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "HubConnection connected successfully.");
        }
        catch (e) {
            this._connectionState = HubConnectionState.Disconnected;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `HubConnection failed to start successfully because of error '${e}'.`);
            return Promise.reject(e);
        }
    }
    async _startInternal() {
        this._stopDuringStartError = undefined;
        this._receivedHandshakeResponse = false;
        // Set up the promise before any connection is (re)started otherwise it could race with received messages
        const handshakePromise = new Promise((resolve, reject) => {
            this._handshakeResolver = resolve;
            this._handshakeRejecter = reject;
        });
        await this.connection.start(this._protocol.transferFormat);
        try {
            const handshakeRequest = {
                protocol: this._protocol.name,
                version: this._protocol.version,
            };
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Sending handshake request.");
            await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(handshakeRequest));
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Using HubProtocol '${this._protocol.name}'.`);
            // defensively cleanup timeout in case we receive a message from the server before we finish start
            this._cleanupTimeout();
            this._resetTimeoutPeriod();
            this._resetKeepAliveInterval();
            await handshakePromise;
            // It's important to check the stopDuringStartError instead of just relying on the handshakePromise
            // being rejected on close, because this continuation can run after both the handshake completed successfully
            // and the connection was closed.
            if (this._stopDuringStartError) {
                // It's important to throw instead of returning a rejected promise, because we don't want to allow any state
                // transitions to occur between now and the calling code observing the exceptions. Returning a rejected promise
                // will cause the calling continuation to get scheduled to run later.
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw this._stopDuringStartError;
            }
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`);
            this._cleanupTimeout();
            this._cleanupPingTimer();
            // HttpConnection.stop() should not complete until after the onclose callback is invoked.
            // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
            await this.connection.stop(e);
            throw e;
        }
    }
    /** Stops the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
     */
    async stop() {
        // Capture the start promise before the connection might be restarted in an onclose callback.
        const startPromise = this._startPromise;
        this._stopPromise = this._stopInternal();
        await this._stopPromise;
        try {
            // Awaiting undefined continues immediately
            await startPromise;
        }
        catch (e) {
            // This exception is returned to the user as a rejected Promise from the start method.
        }
    }
    _stopInternal(error) {
        if (this._connectionState === HubConnectionState.Disconnected) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Call to HubConnection.stop(${error}) ignored because it is already in the disconnected state.`);
            return Promise.resolve();
        }
        if (this._connectionState === HubConnectionState.Disconnecting) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
            return this._stopPromise;
        }
        this._connectionState = HubConnectionState.Disconnecting;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Stopping HubConnection.");
        if (this._reconnectDelayHandle) {
            // We're in a reconnect delay which means the underlying connection is currently already stopped.
            // Just clear the handle to stop the reconnect loop (which no one is waiting on thankfully) and
            // fire the onclose callbacks.
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection stopped during reconnect delay. Done reconnecting.");
            clearTimeout(this._reconnectDelayHandle);
            this._reconnectDelayHandle = undefined;
            this._completeClose();
            return Promise.resolve();
        }
        this._cleanupTimeout();
        this._cleanupPingTimer();
        this._stopDuringStartError = error || new Error("The connection was stopped before the hub handshake could complete.");
        // HttpConnection.stop() should not complete until after either HttpConnection.start() fails
        // or the onclose callback is invoked. The onclose callback will transition the HubConnection
        // to the disconnected state if need be before HttpConnection.stop() completes.
        return this.connection.stop(error);
    }
    /** Invokes a streaming hub method on the server using the specified name and arguments.
     *
     * @typeparam T The type of the items returned by the server.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
     */
    stream(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const invocationDescriptor = this._createStreamInvocation(methodName, args, streamIds);
        // eslint-disable-next-line prefer-const
        let promiseQueue;
        const subject = new _Subject__WEBPACK_IMPORTED_MODULE_4__.Subject();
        subject.cancelCallback = () => {
            const cancelInvocation = this._createCancelInvocation(invocationDescriptor.invocationId);
            delete this._callbacks[invocationDescriptor.invocationId];
            return promiseQueue.then(() => {
                return this._sendWithProtocol(cancelInvocation);
            });
        };
        this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
            if (error) {
                subject.error(error);
                return;
            }
            else if (invocationEvent) {
                // invocationEvent will not be null when an error is not passed to the callback
                if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                    if (invocationEvent.error) {
                        subject.error(new Error(invocationEvent.error));
                    }
                    else {
                        subject.complete();
                    }
                }
                else {
                    subject.next((invocationEvent.item));
                }
            }
        };
        promiseQueue = this._sendWithProtocol(invocationDescriptor)
            .catch((e) => {
            subject.error(e);
            delete this._callbacks[invocationDescriptor.invocationId];
        });
        this._launchStreams(streams, promiseQueue);
        return subject;
    }
    _sendMessage(message) {
        this._resetKeepAliveInterval();
        return this.connection.send(message);
    }
    /**
     * Sends a js object to the server.
     * @param message The js object to serialize and send.
     */
    _sendWithProtocol(message) {
        return this._sendMessage(this._protocol.writeMessage(message));
    }
    /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
     *
     * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
     * be processing the invocation.
     *
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
     */
    send(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const sendPromise = this._sendWithProtocol(this._createInvocation(methodName, args, true, streamIds));
        this._launchStreams(streams, sendPromise);
        return sendPromise;
    }
    /** Invokes a hub method on the server using the specified name and arguments.
     *
     * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
     * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
     * resolving the Promise.
     *
     * @typeparam T The expected return type.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
     */
    invoke(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const invocationDescriptor = this._createInvocation(methodName, args, false, streamIds);
        const p = new Promise((resolve, reject) => {
            // invocationId will always have a value for a non-blocking invocation
            this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
                if (error) {
                    reject(error);
                    return;
                }
                else if (invocationEvent) {
                    // invocationEvent will not be null when an error is not passed to the callback
                    if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                        if (invocationEvent.error) {
                            reject(new Error(invocationEvent.error));
                        }
                        else {
                            resolve(invocationEvent.result);
                        }
                    }
                    else {
                        reject(new Error(`Unexpected message type: ${invocationEvent.type}`));
                    }
                }
            };
            const promiseQueue = this._sendWithProtocol(invocationDescriptor)
                .catch((e) => {
                reject(e);
                // invocationId will always have a value for a non-blocking invocation
                delete this._callbacks[invocationDescriptor.invocationId];
            });
            this._launchStreams(streams, promiseQueue);
        });
        return p;
    }
    /** Registers a handler that will be invoked when the hub method with the specified method name is invoked.
     *
     * @param {string} methodName The name of the hub method to define.
     * @param {Function} newMethod The handler that will be raised when the hub method is invoked.
     */
    on(methodName, newMethod) {
        if (!methodName || !newMethod) {
            return;
        }
        methodName = methodName.toLowerCase();
        if (!this._methods[methodName]) {
            this._methods[methodName] = [];
        }
        // Preventing adding the same handler multiple times.
        if (this._methods[methodName].indexOf(newMethod) !== -1) {
            return;
        }
        this._methods[methodName].push(newMethod);
    }
    off(methodName, method) {
        if (!methodName) {
            return;
        }
        methodName = methodName.toLowerCase();
        const handlers = this._methods[methodName];
        if (!handlers) {
            return;
        }
        if (method) {
            const removeIdx = handlers.indexOf(method);
            if (removeIdx !== -1) {
                handlers.splice(removeIdx, 1);
                if (handlers.length === 0) {
                    delete this._methods[methodName];
                }
            }
        }
        else {
            delete this._methods[methodName];
        }
    }
    /** Registers a handler that will be invoked when the connection is closed.
     *
     * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
     */
    onclose(callback) {
        if (callback) {
            this._closedCallbacks.push(callback);
        }
    }
    /** Registers a handler that will be invoked when the connection starts reconnecting.
     *
     * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
     */
    onreconnecting(callback) {
        if (callback) {
            this._reconnectingCallbacks.push(callback);
        }
    }
    /** Registers a handler that will be invoked when the connection successfully reconnects.
     *
     * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
     */
    onreconnected(callback) {
        if (callback) {
            this._reconnectedCallbacks.push(callback);
        }
    }
    _processIncomingData(data) {
        this._cleanupTimeout();
        if (!this._receivedHandshakeResponse) {
            data = this._processHandshakeResponse(data);
            this._receivedHandshakeResponse = true;
        }
        // Data may have all been read when processing handshake response
        if (data) {
            // Parse the messages
            const messages = this._protocol.parseMessages(data, this._logger);
            for (const message of messages) {
                switch (message.type) {
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
                        this._invokeClientMethod(message);
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion: {
                        const callback = this._callbacks[message.invocationId];
                        if (callback) {
                            if (message.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                                delete this._callbacks[message.invocationId];
                            }
                            try {
                                callback(message);
                            }
                            catch (e) {
                                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Stream callback threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
                            }
                        }
                        break;
                    }
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
                        // Don't care about pings
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close: {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "Close message received from server.");
                        const error = message.error ? new Error("Server returned an error on close: " + message.error) : undefined;
                        if (message.allowReconnect === true) {
                            // It feels wrong not to await connection.stop() here, but processIncomingData is called as part of an onreceive callback which is not async,
                            // this is already the behavior for serverTimeout(), and HttpConnection.Stop() should catch and log all possible exceptions.
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.connection.stop(error);
                        }
                        else {
                            // We cannot await stopInternal() here, but subsequent calls to stop() will await this if stopInternal() is still ongoing.
                            this._stopPromise = this._stopInternal(error);
                        }
                        break;
                    }
                    default:
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `Invalid message type: ${message.type}.`);
                        break;
                }
            }
        }
        this._resetTimeoutPeriod();
    }
    _processHandshakeResponse(data) {
        let responseMessage;
        let remainingData;
        try {
            [remainingData, responseMessage] = this._handshakeProtocol.parseHandshakeResponse(data);
        }
        catch (e) {
            const message = "Error parsing handshake response: " + e;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
            const error = new Error(message);
            this._handshakeRejecter(error);
            throw error;
        }
        if (responseMessage.error) {
            const message = "Server returned handshake error: " + responseMessage.error;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
            const error = new Error(message);
            this._handshakeRejecter(error);
            throw error;
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Server handshake complete.");
        }
        this._handshakeResolver();
        return remainingData;
    }
    _resetKeepAliveInterval() {
        if (this.connection.features.inherentKeepAlive) {
            return;
        }
        // Set the time we want the next keep alive to be sent
        // Timer will be setup on next message receive
        this._nextKeepAlive = new Date().getTime() + this.keepAliveIntervalInMilliseconds;
        this._cleanupPingTimer();
    }
    _resetTimeoutPeriod() {
        if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
            // Set the timeout timer
            this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
            // Set keepAlive timer if there isn't one
            if (this._pingServerHandle === undefined) {
                let nextPing = this._nextKeepAlive - new Date().getTime();
                if (nextPing < 0) {
                    nextPing = 0;
                }
                // The timer needs to be set from a networking callback to avoid Chrome timer throttling from causing timers to run once a minute
                this._pingServerHandle = setTimeout(async () => {
                    if (this._connectionState === HubConnectionState.Connected) {
                        try {
                            await this._sendMessage(this._cachedPingMessage);
                        }
                        catch {
                            // We don't care about the error. It should be seen elsewhere in the client.
                            // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering
                            this._cleanupPingTimer();
                        }
                    }
                }, nextPing);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    serverTimeout() {
        // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
        // Terminate the connection, but we don't need to wait on the promise. This could trigger reconnecting.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
    }
    _invokeClientMethod(invocationMessage) {
        const methods = this._methods[invocationMessage.target.toLowerCase()];
        if (methods) {
            try {
                methods.forEach((m) => m.apply(this, invocationMessage.arguments));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `A callback for the method ${invocationMessage.target.toLowerCase()} threw error '${e}'.`);
            }
            if (invocationMessage.invocationId) {
                // This is not supported in v1. So we return an error to avoid blocking the server waiting for the response.
                const message = "Server requested a response, which is not supported in this version of the client.";
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
                // We don't want to wait on the stop itself.
                this._stopPromise = this._stopInternal(new Error(message));
            }
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No client method with the name '${invocationMessage.target}' found.`);
        }
    }
    _connectionClosed(error) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `HubConnection.connectionClosed(${error}) called while in state ${this._connectionState}.`);
        // Triggering this.handshakeRejecter is insufficient because it could already be resolved without the continuation having run yet.
        this._stopDuringStartError = this._stopDuringStartError || error || new Error("The underlying connection was closed before the hub handshake could complete.");
        // If the handshake is in progress, start will be waiting for the handshake promise, so we complete it.
        // If it has already completed, this should just noop.
        if (this._handshakeResolver) {
            this._handshakeResolver();
        }
        this._cancelCallbacksWithError(error || new Error("Invocation canceled due to the underlying connection being closed."));
        this._cleanupTimeout();
        this._cleanupPingTimer();
        if (this._connectionState === HubConnectionState.Disconnecting) {
            this._completeClose(error);
        }
        else if (this._connectionState === HubConnectionState.Connected && this._reconnectPolicy) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._reconnect(error);
        }
        else if (this._connectionState === HubConnectionState.Connected) {
            this._completeClose(error);
        }
        // If none of the above if conditions were true were called the HubConnection must be in either:
        // 1. The Connecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail it.
        // 2. The Reconnecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail the current reconnect attempt
        //    and potentially continue the reconnect() loop.
        // 3. The Disconnected state in which case we're already done.
    }
    _completeClose(error) {
        if (this._connectionStarted) {
            this._connectionState = HubConnectionState.Disconnected;
            this._connectionStarted = false;
            if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
                window.document.removeEventListener("freeze", this._freezeEventListener);
            }
            try {
                this._closedCallbacks.forEach((c) => c.apply(this, [error]));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onclose callback called with error '${error}' threw error '${e}'.`);
            }
        }
    }
    async _reconnect(error) {
        const reconnectStartTime = Date.now();
        let previousReconnectAttempts = 0;
        let retryError = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
        let nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, 0, retryError);
        if (nextRetryDelay === null) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
            this._completeClose(error);
            return;
        }
        this._connectionState = HubConnectionState.Reconnecting;
        if (error) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Connection reconnecting because of error '${error}'.`);
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "Connection reconnecting.");
        }
        if (this._reconnectingCallbacks.length !== 0) {
            try {
                this._reconnectingCallbacks.forEach((c) => c.apply(this, [error]));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onreconnecting callback called with error '${error}' threw error '${e}'.`);
            }
            // Exit early if an onreconnecting callback called connection.stop().
            if (this._connectionState !== HubConnectionState.Reconnecting) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
                return;
            }
        }
        while (nextRetryDelay !== null) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect attempt number ${previousReconnectAttempts} will start in ${nextRetryDelay} ms.`);
            await new Promise((resolve) => {
                this._reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
            });
            this._reconnectDelayHandle = undefined;
            if (this._connectionState !== HubConnectionState.Reconnecting) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
                return;
            }
            try {
                await this._startInternal();
                this._connectionState = HubConnectionState.Connected;
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "HubConnection reconnected successfully.");
                if (this._reconnectedCallbacks.length !== 0) {
                    try {
                        this._reconnectedCallbacks.forEach((c) => c.apply(this, [this.connection.connectionId]));
                    }
                    catch (e) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
                    }
                }
                return;
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect attempt failed because of error '${e}'.`);
                if (this._connectionState !== HubConnectionState.Reconnecting) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`);
                    // The TypeScript compiler thinks that connectionState must be Connected here. The TypeScript compiler is wrong.
                    if (this._connectionState === HubConnectionState.Disconnecting) {
                        this._completeClose();
                    }
                    return;
                }
                retryError = e instanceof Error ? e : new Error(e.toString());
                nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, Date.now() - reconnectStartTime, retryError);
            }
        }
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect retries have been exhausted after ${Date.now() - reconnectStartTime} ms and ${previousReconnectAttempts} failed attempts. Connection disconnecting.`);
        this._completeClose();
    }
    _getNextRetryDelay(previousRetryCount, elapsedMilliseconds, retryReason) {
        try {
            return this._reconnectPolicy.nextRetryDelayInMilliseconds({
                elapsedMilliseconds,
                previousRetryCount,
                retryReason,
            });
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${previousRetryCount}, ${elapsedMilliseconds}) threw error '${e}'.`);
            return null;
        }
    }
    _cancelCallbacksWithError(error) {
        const callbacks = this._callbacks;
        this._callbacks = {};
        Object.keys(callbacks)
            .forEach((key) => {
            const callback = callbacks[key];
            try {
                callback(null, error);
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Stream 'error' callback called with '${error}' threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
            }
        });
    }
    _cleanupPingTimer() {
        if (this._pingServerHandle) {
            clearTimeout(this._pingServerHandle);
            this._pingServerHandle = undefined;
        }
    }
    _cleanupTimeout() {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
        }
    }
    _createInvocation(methodName, args, nonblocking, streamIds) {
        if (nonblocking) {
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    streamIds,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
            else {
                return {
                    arguments: args,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
        }
        else {
            const invocationId = this._invocationId;
            this._invocationId++;
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    streamIds,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
            else {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
        }
    }
    _launchStreams(streams, promiseQueue) {
        if (streams.length === 0) {
            return;
        }
        // Synchronize stream data so they arrive in-order on the server
        if (!promiseQueue) {
            promiseQueue = Promise.resolve();
        }
        // We want to iterate over the keys, since the keys are the stream ids
        // eslint-disable-next-line guard-for-in
        for (const streamId in streams) {
            streams[streamId].subscribe({
                complete: () => {
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId)));
                },
                error: (err) => {
                    let message;
                    if (err instanceof Error) {
                        message = err.message;
                    }
                    else if (err && err.toString) {
                        message = err.toString();
                    }
                    else {
                        message = "Unknown error";
                    }
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId, message)));
                },
                next: (item) => {
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createStreamItemMessage(streamId, item)));
                },
            });
        }
    }
    _replaceStreamingParams(args) {
        const streams = [];
        const streamIds = [];
        for (let i = 0; i < args.length; i++) {
            const argument = args[i];
            if (this._isObservable(argument)) {
                const streamId = this._invocationId;
                this._invocationId++;
                // Store the stream for later use
                streams[streamId] = argument;
                streamIds.push(streamId.toString());
                // remove stream from args
                args.splice(i, 1);
            }
        }
        return [streams, streamIds];
    }
    _isObservable(arg) {
        // This allows other stream implementations to just work (like rxjs)
        return arg && arg.subscribe && typeof arg.subscribe === "function";
    }
    _createStreamInvocation(methodName, args, streamIds) {
        const invocationId = this._invocationId;
        this._invocationId++;
        if (streamIds.length !== 0) {
            return {
                arguments: args,
                invocationId: invocationId.toString(),
                streamIds,
                target: methodName,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamInvocation,
            };
        }
        else {
            return {
                arguments: args,
                invocationId: invocationId.toString(),
                target: methodName,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamInvocation,
            };
        }
    }
    _createCancelInvocation(id) {
        return {
            invocationId: id,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.CancelInvocation,
        };
    }
    _createStreamItemMessage(id, item) {
        return {
            invocationId: id,
            item,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem,
        };
    }
    _createCompletionMessage(id, error, result) {
        if (error) {
            return {
                error,
                invocationId: id,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion,
            };
        }
        return {
            invocationId: id,
            result,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion,
        };
    }
}
//# sourceMappingURL=HubConnection.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HubConnectionBuilder": () => (/* binding */ HubConnectionBuilder)
/* harmony export */ });
/* harmony import */ var _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultReconnectPolicy */ "./node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js");
/* harmony import */ var _HttpConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HttpConnection */ "./node_modules/@microsoft/signalr/dist/esm/HttpConnection.js");
/* harmony import */ var _HubConnection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./HubConnection */ "./node_modules/@microsoft/signalr/dist/esm/HubConnection.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./JsonHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Loggers */ "./node_modules/@microsoft/signalr/dist/esm/Loggers.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const LogLevelNameMapping = {
    trace: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace,
    debug: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug,
    info: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
    information: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
    warn: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
    warning: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
    error: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error,
    critical: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical,
    none: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.None,
};
function parseLogLevel(name) {
    // Case-insensitive matching via lower-casing
    // Yes, I know case-folding is a complicated problem in Unicode, but we only support
    // the ASCII strings defined in LogLevelNameMapping anyway, so it's fine -anurse.
    const mapping = LogLevelNameMapping[name.toLowerCase()];
    if (typeof mapping !== "undefined") {
        return mapping;
    }
    else {
        throw new Error(`Unknown log level: ${name}`);
    }
}
/** A builder for configuring {@link @microsoft/signalr.HubConnection} instances. */
class HubConnectionBuilder {
    configureLogging(logging) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logging, "logging");
        if (isLogger(logging)) {
            this.logger = logging;
        }
        else if (typeof logging === "string") {
            const logLevel = parseLogLevel(logging);
            this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logLevel);
        }
        else {
            this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logging);
        }
        return this;
    }
    withUrl(url, transportTypeOrOptions) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isNotEmpty(url, "url");
        this.url = url;
        // Flow-typing knows where it's at. Since HttpTransportType is a number and IHttpConnectionOptions is guaranteed
        // to be an object, we know (as does TypeScript) this comparison is all we need to figure out which overload was called.
        if (typeof transportTypeOrOptions === "object") {
            this.httpConnectionOptions = { ...this.httpConnectionOptions, ...transportTypeOrOptions };
        }
        else {
            this.httpConnectionOptions = {
                ...this.httpConnectionOptions,
                transport: transportTypeOrOptions,
            };
        }
        return this;
    }
    /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
     *
     * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
     */
    withHubProtocol(protocol) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
        this.protocol = protocol;
        return this;
    }
    withAutomaticReconnect(retryDelaysOrReconnectPolicy) {
        if (this.reconnectPolicy) {
            throw new Error("A reconnectPolicy has already been set.");
        }
        if (!retryDelaysOrReconnectPolicy) {
            this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy();
        }
        else if (Array.isArray(retryDelaysOrReconnectPolicy)) {
            this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy(retryDelaysOrReconnectPolicy);
        }
        else {
            this.reconnectPolicy = retryDelaysOrReconnectPolicy;
        }
        return this;
    }
    /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
     *
     * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
     */
    build() {
        // If httpConnectionOptions has a logger, use it. Otherwise, override it with the one
        // provided to configureLogger
        const httpConnectionOptions = this.httpConnectionOptions || {};
        // If it's 'null', the user **explicitly** asked for null, don't mess with it.
        if (httpConnectionOptions.logger === undefined) {
            // If our logger is undefined or null, that's OK, the HttpConnection constructor will handle it.
            httpConnectionOptions.logger = this.logger;
        }
        // Now create the connection
        if (!this.url) {
            throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
        }
        const connection = new _HttpConnection__WEBPACK_IMPORTED_MODULE_3__.HttpConnection(this.url, httpConnectionOptions);
        return _HubConnection__WEBPACK_IMPORTED_MODULE_4__.HubConnection.create(connection, this.logger || _Loggers__WEBPACK_IMPORTED_MODULE_5__.NullLogger.instance, this.protocol || new _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__.JsonHubProtocol(), this.reconnectPolicy);
    }
}
function isLogger(logger) {
    return logger.log !== undefined;
}
//# sourceMappingURL=HubConnectionBuilder.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js":
/*!******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MessageType": () => (/* binding */ MessageType)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Defines the type of a Hub Message. */
var MessageType;
(function (MessageType) {
    /** Indicates the message is an Invocation message and implements the {@link @microsoft/signalr.InvocationMessage} interface. */
    MessageType[MessageType["Invocation"] = 1] = "Invocation";
    /** Indicates the message is a StreamItem message and implements the {@link @microsoft/signalr.StreamItemMessage} interface. */
    MessageType[MessageType["StreamItem"] = 2] = "StreamItem";
    /** Indicates the message is a Completion message and implements the {@link @microsoft/signalr.CompletionMessage} interface. */
    MessageType[MessageType["Completion"] = 3] = "Completion";
    /** Indicates the message is a Stream Invocation message and implements the {@link @microsoft/signalr.StreamInvocationMessage} interface. */
    MessageType[MessageType["StreamInvocation"] = 4] = "StreamInvocation";
    /** Indicates the message is a Cancel Invocation message and implements the {@link @microsoft/signalr.CancelInvocationMessage} interface. */
    MessageType[MessageType["CancelInvocation"] = 5] = "CancelInvocation";
    /** Indicates the message is a Ping message and implements the {@link @microsoft/signalr.PingMessage} interface. */
    MessageType[MessageType["Ping"] = 6] = "Ping";
    /** Indicates the message is a Close message and implements the {@link @microsoft/signalr.CloseMessage} interface. */
    MessageType[MessageType["Close"] = 7] = "Close";
})(MessageType || (MessageType = {}));
//# sourceMappingURL=IHubProtocol.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js":
/*!*************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/ILogger.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LogLevel": () => (/* binding */ LogLevel)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// These values are designed to match the ASP.NET Log Levels since that's the pattern we're emulating here.
/** Indicates the severity of a log message.
 *
 * Log Levels are ordered in increasing severity. So `Debug` is more severe than `Trace`, etc.
 */
var LogLevel;
(function (LogLevel) {
    /** Log level for very low severity diagnostic messages. */
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    /** Log level for low severity diagnostic messages. */
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    /** Log level for informational diagnostic messages. */
    LogLevel[LogLevel["Information"] = 2] = "Information";
    /** Log level for diagnostic messages that indicate a non-fatal problem. */
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    /** Log level for diagnostic messages that indicate a failure in the current operation. */
    LogLevel[LogLevel["Error"] = 4] = "Error";
    /** Log level for diagnostic messages that indicate a failure that will terminate the entire application. */
    LogLevel[LogLevel["Critical"] = 5] = "Critical";
    /** The highest possible log level. Used when configuring logging to indicate that no log messages should be emitted. */
    LogLevel[LogLevel["None"] = 6] = "None";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=ILogger.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js":
/*!****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/ITransport.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpTransportType": () => (/* binding */ HttpTransportType),
/* harmony export */   "TransferFormat": () => (/* binding */ TransferFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// This will be treated as a bit flag in the future, so we keep it using power-of-two values.
/** Specifies a specific HTTP transport type. */
var HttpTransportType;
(function (HttpTransportType) {
    /** Specifies no transport preference. */
    HttpTransportType[HttpTransportType["None"] = 0] = "None";
    /** Specifies the WebSockets transport. */
    HttpTransportType[HttpTransportType["WebSockets"] = 1] = "WebSockets";
    /** Specifies the Server-Sent Events transport. */
    HttpTransportType[HttpTransportType["ServerSentEvents"] = 2] = "ServerSentEvents";
    /** Specifies the Long Polling transport. */
    HttpTransportType[HttpTransportType["LongPolling"] = 4] = "LongPolling";
})(HttpTransportType || (HttpTransportType = {}));
/** Specifies the transfer format for a connection. */
var TransferFormat;
(function (TransferFormat) {
    /** Specifies that only text data will be transmitted over the connection. */
    TransferFormat[TransferFormat["Text"] = 1] = "Text";
    /** Specifies that binary data will be transmitted over the connection. */
    TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
})(TransferFormat || (TransferFormat = {}));
//# sourceMappingURL=ITransport.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JsonHubProtocol": () => (/* binding */ JsonHubProtocol)
/* harmony export */ });
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loggers */ "./node_modules/@microsoft/signalr/dist/esm/Loggers.js");
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TextMessageFormat */ "./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





const JSON_HUB_PROTOCOL_NAME = "json";
/** Implements the JSON Hub Protocol. */
class JsonHubProtocol {
    constructor() {
        /** @inheritDoc */
        this.name = JSON_HUB_PROTOCOL_NAME;
        /** @inheritDoc */
        this.version = 1;
        /** @inheritDoc */
        this.transferFormat = _ITransport__WEBPACK_IMPORTED_MODULE_0__.TransferFormat.Text;
    }
    /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
     *
     * @param {string} input A string containing the serialized representation.
     * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
     */
    parseMessages(input, logger) {
        // The interface does allow "ArrayBuffer" to be passed in, but this implementation does not. So let's throw a useful error.
        if (typeof input !== "string") {
            throw new Error("Invalid input for JSON hub protocol. Expected a string.");
        }
        if (!input) {
            return [];
        }
        if (logger === null) {
            logger = _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
        }
        // Parse the messages
        const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.parse(input);
        const hubMessages = [];
        for (const message of messages) {
            const parsedMessage = JSON.parse(message);
            if (typeof parsedMessage.type !== "number") {
                throw new Error("Invalid payload.");
            }
            switch (parsedMessage.type) {
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
                    this._isInvocationMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
                    this._isStreamItemMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion:
                    this._isCompletionMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
                    // Single value, no need to validate
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close:
                    // All optional values, no need to validate
                    break;
                default:
                    // Future protocol changes can add message types, old clients can ignore them
                    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
                    continue;
            }
            hubMessages.push(parsedMessage);
        }
        return hubMessages;
    }
    /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
     *
     * @param {HubMessage} message The message to write.
     * @returns {string} A string containing the serialized representation of the message.
     */
    writeMessage(message) {
        return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.write(JSON.stringify(message));
    }
    _isInvocationMessage(message) {
        this._assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
        if (message.invocationId !== undefined) {
            this._assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
        }
    }
    _isStreamItemMessage(message) {
        this._assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
        if (message.item === undefined) {
            throw new Error("Invalid payload for StreamItem message.");
        }
    }
    _isCompletionMessage(message) {
        if (message.result && message.error) {
            throw new Error("Invalid payload for Completion message.");
        }
        if (!message.result && message.error) {
            this._assertNotEmptyString(message.error, "Invalid payload for Completion message.");
        }
        this._assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
    }
    _assertNotEmptyString(value, errorMessage) {
        if (typeof value !== "string" || value === "") {
            throw new Error(errorMessage);
        }
    }
}
//# sourceMappingURL=JsonHubProtocol.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/Loggers.js":
/*!*************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Loggers.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NullLogger": () => (/* binding */ NullLogger)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** A logger that does nothing when log messages are sent to it. */
class NullLogger {
    constructor() { }
    /** @inheritDoc */
    // eslint-disable-next-line
    log(_logLevel, _message) {
    }
}
/** The singleton instance of the {@link @microsoft/signalr.NullLogger}. */
NullLogger.instance = new NullLogger();
//# sourceMappingURL=Loggers.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LongPollingTransport": () => (/* binding */ LongPollingTransport)
/* harmony export */ });
/* harmony import */ var _AbortController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbortController */ "./node_modules/@microsoft/signalr/dist/esm/AbortController.js");
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./HeaderNames */ "./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.






// Not exported from 'index', this type is internal.
/** @private */
class LongPollingTransport {
    constructor(httpClient, accessTokenFactory, logger, options) {
        this._httpClient = httpClient;
        this._accessTokenFactory = accessTokenFactory;
        this._logger = logger;
        this._pollAbort = new _AbortController__WEBPACK_IMPORTED_MODULE_0__.AbortController();
        this._options = options;
        this._running = false;
        this.onreceive = null;
        this.onclose = null;
    }
    // This is an internal type, not exported from 'index' so this is really just internal.
    get pollAborted() {
        return this._pollAbort.aborted;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat, "transferFormat");
        this._url = url;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Connecting.");
        // Allow binary format on Node and Browsers that support binary content (indicated by the presence of responseType property)
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary &&
            (typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string")) {
            throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
        }
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
        const headers = { [name]: value, ...this._options.headers };
        const pollOptions = {
            abortSignal: this._pollAbort.signal,
            headers,
            timeout: 100000,
            withCredentials: this._options.withCredentials,
        };
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary) {
            pollOptions.responseType = "arraybuffer";
        }
        const token = await this._getAccessToken();
        this._updateHeaderToken(pollOptions, token);
        // Make initial long polling request
        // Server uses first long polling request to finish initializing connection and it returns without data
        const pollUrl = `${url}&_=${Date.now()}`;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
        const response = await this._httpClient.get(pollUrl, pollOptions);
        if (response.statusCode !== 200) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
            // Mark running as false so that the poll immediately ends and runs the close logic
            this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError(response.statusText || "", response.statusCode);
            this._running = false;
        }
        else {
            this._running = true;
        }
        this._receiving = this._poll(this._url, pollOptions);
    }
    async _getAccessToken() {
        if (this._accessTokenFactory) {
            return await this._accessTokenFactory();
        }
        return null;
    }
    _updateHeaderToken(request, token) {
        if (!request.headers) {
            request.headers = {};
        }
        if (token) {
            request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_5__.HeaderNames.Authorization] = `Bearer ${token}`;
            return;
        }
        if (request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_5__.HeaderNames.Authorization]) {
            delete request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_5__.HeaderNames.Authorization];
        }
    }
    async _poll(url, pollOptions) {
        try {
            while (this._running) {
                // We have to get the access token on each poll, in case it changes
                const token = await this._getAccessToken();
                this._updateHeaderToken(pollOptions, token);
                try {
                    const pollUrl = `${url}&_=${Date.now()}`;
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
                    const response = await this._httpClient.get(pollUrl, pollOptions);
                    if (response.statusCode === 204) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
                        this._running = false;
                    }
                    else if (response.statusCode !== 200) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
                        // Unexpected status code
                        this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError(response.statusText || "", response.statusCode);
                        this._running = false;
                    }
                    else {
                        // Process the response
                        if (response.content) {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getDataDetail)(response.content, this._options.logMessageContent)}.`);
                            if (this.onreceive) {
                                this.onreceive(response.content);
                            }
                        }
                        else {
                            // This is another way timeout manifest.
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                    }
                }
                catch (e) {
                    if (!this._running) {
                        // Log but disregard errors that occur after stopping
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
                    }
                    else {
                        if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_4__.TimeoutError) {
                            // Ignore timeouts and reissue the poll.
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                        else {
                            // Close the connection with the error as the result.
                            this._closeError = e;
                            this._running = false;
                        }
                    }
                }
            }
        }
        finally {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Polling complete.");
            // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
            // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.
            if (!this.pollAborted) {
                this._raiseOnClose();
            }
        }
    }
    async send(data) {
        if (!this._running) {
            return Promise.reject(new Error("Cannot send until the transport is connected"));
        }
        return (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.sendMessage)(this._logger, "LongPolling", this._httpClient, this._url, this._accessTokenFactory, data, this._options);
    }
    async stop() {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Stopping polling.");
        // Tell receiving loop to stop, abort any current request, and then wait for it to finish
        this._running = false;
        this._pollAbort.abort();
        try {
            await this._receiving;
            // Send DELETE to clean up long polling on the server
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
            const headers = {};
            const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
            headers[name] = value;
            const deleteOptions = {
                headers: { ...headers, ...this._options.headers },
                timeout: this._options.timeout,
                withCredentials: this._options.withCredentials,
            };
            const token = await this._getAccessToken();
            this._updateHeaderToken(deleteOptions, token);
            await this._httpClient.delete(this._url, deleteOptions);
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) DELETE request sent.");
        }
        finally {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Stop finished.");
            // Raise close event here instead of in polling
            // It needs to happen after the DELETE request is sent
            this._raiseOnClose();
        }
    }
    _raiseOnClose() {
        if (this.onclose) {
            let logMessage = "(LongPolling transport) Firing onclose event.";
            if (this._closeError) {
                logMessage += " Error: " + this._closeError;
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, logMessage);
            this.onclose(this._closeError);
        }
    }
}
//# sourceMappingURL=LongPollingTransport.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ServerSentEventsTransport": () => (/* binding */ ServerSentEventsTransport)
/* harmony export */ });
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.



/** @private */
class ServerSentEventsTransport {
    constructor(httpClient, accessTokenFactory, logger, options) {
        this._httpClient = httpClient;
        this._accessTokenFactory = accessTokenFactory;
        this._logger = logger;
        this._options = options;
        this.onreceive = null;
        this.onclose = null;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(SSE transport) Connecting.");
        // set url before accessTokenFactory because this.url is only for send and we set the auth header instead of the query string for send
        this._url = url;
        if (this._accessTokenFactory) {
            const token = await this._accessTokenFactory();
            if (token) {
                url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
            }
        }
        return new Promise((resolve, reject) => {
            let opened = false;
            if (transferFormat !== _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat.Text) {
                reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                return;
            }
            let eventSource;
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isBrowser || _Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isWebWorker) {
                eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials });
            }
            else {
                // Non-browser passes cookies via the dictionary
                const cookies = this._httpClient.getCookieString(url);
                const headers = {};
                headers.Cookie = cookies;
                const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
                headers[name] = value;
                eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials, headers: { ...headers, ...this._options.headers } });
            }
            try {
                eventSource.onmessage = (e) => {
                    if (this.onreceive) {
                        try {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(SSE transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(e.data, this._options.logMessageContent)}.`);
                            this.onreceive(e.data);
                        }
                        catch (error) {
                            this._close(error);
                            return;
                        }
                    }
                };
                // @ts-ignore: not using event on purpose
                eventSource.onerror = (e) => {
                    // EventSource doesn't give any useful information about server side closes.
                    if (opened) {
                        this._close();
                    }
                    else {
                        reject(new Error("EventSource failed to connect. The connection could not be found on the server,"
                            + " either the connection ID is not present on the server, or a proxy is refusing/buffering the connection."
                            + " If you have multiple servers check that sticky sessions are enabled."));
                    }
                };
                eventSource.onopen = () => {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `SSE connected to ${this._url}`);
                    this._eventSource = eventSource;
                    opened = true;
                    resolve();
                };
            }
            catch (e) {
                reject(e);
                return;
            }
        });
    }
    async send(data) {
        if (!this._eventSource) {
            return Promise.reject(new Error("Cannot send until the transport is connected"));
        }
        return (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.sendMessage)(this._logger, "SSE", this._httpClient, this._url, this._accessTokenFactory, data, this._options);
    }
    stop() {
        this._close();
        return Promise.resolve();
    }
    _close(e) {
        if (this._eventSource) {
            this._eventSource.close();
            this._eventSource = undefined;
            if (this.onclose) {
                this.onclose(e);
            }
        }
    }
}
//# sourceMappingURL=ServerSentEventsTransport.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/Subject.js":
/*!*************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Subject.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Subject": () => (/* binding */ Subject)
/* harmony export */ });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

/** Stream implementation to stream items to the server. */
class Subject {
    constructor() {
        this.observers = [];
    }
    next(item) {
        for (const observer of this.observers) {
            observer.next(item);
        }
    }
    error(err) {
        for (const observer of this.observers) {
            if (observer.error) {
                observer.error(err);
            }
        }
    }
    complete() {
        for (const observer of this.observers) {
            if (observer.complete) {
                observer.complete();
            }
        }
    }
    subscribe(observer) {
        this.observers.push(observer);
        return new _Utils__WEBPACK_IMPORTED_MODULE_0__.SubjectSubscription(this, observer);
    }
}
//# sourceMappingURL=Subject.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextMessageFormat": () => (/* binding */ TextMessageFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Not exported from index
/** @private */
class TextMessageFormat {
    static write(output) {
        return `${output}${TextMessageFormat.RecordSeparator}`;
    }
    static parse(input) {
        if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
            throw new Error("Message is incomplete.");
        }
        const messages = input.split(TextMessageFormat.RecordSeparator);
        messages.pop();
        return messages;
    }
}
TextMessageFormat.RecordSeparatorCode = 0x1e;
TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
//# sourceMappingURL=TextMessageFormat.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/Utils.js":
/*!***********************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Utils.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Arg": () => (/* binding */ Arg),
/* harmony export */   "ConsoleLogger": () => (/* binding */ ConsoleLogger),
/* harmony export */   "Platform": () => (/* binding */ Platform),
/* harmony export */   "SubjectSubscription": () => (/* binding */ SubjectSubscription),
/* harmony export */   "VERSION": () => (/* binding */ VERSION),
/* harmony export */   "constructUserAgent": () => (/* binding */ constructUserAgent),
/* harmony export */   "createLogger": () => (/* binding */ createLogger),
/* harmony export */   "formatArrayBuffer": () => (/* binding */ formatArrayBuffer),
/* harmony export */   "getDataDetail": () => (/* binding */ getDataDetail),
/* harmony export */   "getErrorString": () => (/* binding */ getErrorString),
/* harmony export */   "getGlobalThis": () => (/* binding */ getGlobalThis),
/* harmony export */   "getUserAgentHeader": () => (/* binding */ getUserAgentHeader),
/* harmony export */   "isArrayBuffer": () => (/* binding */ isArrayBuffer),
/* harmony export */   "sendMessage": () => (/* binding */ sendMessage)
/* harmony export */ });
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loggers */ "./node_modules/@microsoft/signalr/dist/esm/Loggers.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


// Version token that will be replaced by the prepack command
/** The version of the SignalR client. */
const VERSION = "6.0.9";
/** @private */
class Arg {
    static isRequired(val, name) {
        if (val === null || val === undefined) {
            throw new Error(`The '${name}' argument is required.`);
        }
    }
    static isNotEmpty(val, name) {
        if (!val || val.match(/^\s*$/)) {
            throw new Error(`The '${name}' argument should not be empty.`);
        }
    }
    static isIn(val, values, name) {
        // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
        if (!(val in values)) {
            throw new Error(`Unknown ${name} value: ${val}.`);
        }
    }
}
/** @private */
class Platform {
    // react-native has a window but no document so we should check both
    static get isBrowser() {
        return typeof window === "object" && typeof window.document === "object";
    }
    // WebWorkers don't have a window object so the isBrowser check would fail
    static get isWebWorker() {
        return typeof self === "object" && "importScripts" in self;
    }
    // react-native has a window but no document
    static get isReactNative() {
        return typeof window === "object" && typeof window.document === "undefined";
    }
    // Node apps shouldn't have a window object, but WebWorkers don't either
    // so we need to check for both WebWorker and window
    static get isNode() {
        return !this.isBrowser && !this.isWebWorker && !this.isReactNative;
    }
}
/** @private */
function getDataDetail(data, includeContent) {
    let detail = "";
    if (isArrayBuffer(data)) {
        detail = `Binary data of length ${data.byteLength}`;
        if (includeContent) {
            detail += `. Content: '${formatArrayBuffer(data)}'`;
        }
    }
    else if (typeof data === "string") {
        detail = `String data of length ${data.length}`;
        if (includeContent) {
            detail += `. Content: '${data}'`;
        }
    }
    return detail;
}
/** @private */
function formatArrayBuffer(data) {
    const view = new Uint8Array(data);
    // Uint8Array.map only supports returning another Uint8Array?
    let str = "";
    view.forEach((num) => {
        const pad = num < 16 ? "0" : "";
        str += `0x${pad}${num.toString(16)} `;
    });
    // Trim of trailing space.
    return str.substr(0, str.length - 1);
}
// Also in signalr-protocol-msgpack/Utils.ts
/** @private */
function isArrayBuffer(val) {
    return val && typeof ArrayBuffer !== "undefined" &&
        (val instanceof ArrayBuffer ||
            // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
            (val.constructor && val.constructor.name === "ArrayBuffer"));
}
/** @private */
async function sendMessage(logger, transportName, httpClient, url, accessTokenFactory, content, options) {
    let headers = {};
    if (accessTokenFactory) {
        const token = await accessTokenFactory();
        if (token) {
            headers = {
                ["Authorization"]: `Bearer ${token}`,
            };
        }
    }
    const [name, value] = getUserAgentHeader();
    headers[name] = value;
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace, `(${transportName} transport) sending data. ${getDataDetail(content, options.logMessageContent)}.`);
    const responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
    const response = await httpClient.post(url, {
        content,
        headers: { ...headers, ...options.headers },
        responseType,
        timeout: options.timeout,
        withCredentials: options.withCredentials,
    });
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace, `(${transportName} transport) request complete. Response status: ${response.statusCode}.`);
}
/** @private */
function createLogger(logger) {
    if (logger === undefined) {
        return new ConsoleLogger(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information);
    }
    if (logger === null) {
        return _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
    }
    if (logger.log !== undefined) {
        return logger;
    }
    return new ConsoleLogger(logger);
}
/** @private */
class SubjectSubscription {
    constructor(subject, observer) {
        this._subject = subject;
        this._observer = observer;
    }
    dispose() {
        const index = this._subject.observers.indexOf(this._observer);
        if (index > -1) {
            this._subject.observers.splice(index, 1);
        }
        if (this._subject.observers.length === 0 && this._subject.cancelCallback) {
            this._subject.cancelCallback().catch((_) => { });
        }
    }
}
/** @private */
class ConsoleLogger {
    constructor(minimumLogLevel) {
        this._minLevel = minimumLogLevel;
        this.out = console;
    }
    log(logLevel, message) {
        if (logLevel >= this._minLevel) {
            const msg = `[${new Date().toISOString()}] ${_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel[logLevel]}: ${message}`;
            switch (logLevel) {
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical:
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error:
                    this.out.error(msg);
                    break;
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning:
                    this.out.warn(msg);
                    break;
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information:
                    this.out.info(msg);
                    break;
                default:
                    // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
                    this.out.log(msg);
                    break;
            }
        }
    }
}
/** @private */
function getUserAgentHeader() {
    let userAgentHeaderName = "X-SignalR-User-Agent";
    if (Platform.isNode) {
        userAgentHeaderName = "User-Agent";
    }
    return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
}
/** @private */
function constructUserAgent(version, os, runtime, runtimeVersion) {
    // Microsoft SignalR/[Version] ([Detailed Version]; [Operating System]; [Runtime]; [Runtime Version])
    let userAgent = "Microsoft SignalR/";
    const majorAndMinor = version.split(".");
    userAgent += `${majorAndMinor[0]}.${majorAndMinor[1]}`;
    userAgent += ` (${version}; `;
    if (os && os !== "") {
        userAgent += `${os}; `;
    }
    else {
        userAgent += "Unknown OS; ";
    }
    userAgent += `${runtime}`;
    if (runtimeVersion) {
        userAgent += `; ${runtimeVersion}`;
    }
    else {
        userAgent += "; Unknown Runtime Version";
    }
    userAgent += ")";
    return userAgent;
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/ function getOsName() {
    if (Platform.isNode) {
        switch (process.platform) {
            case "win32":
                return "Windows NT";
            case "darwin":
                return "macOS";
            case "linux":
                return "Linux";
            default:
                return process.platform;
        }
    }
    else {
        return "";
    }
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/ function getRuntimeVersion() {
    if (Platform.isNode) {
        return process.versions.node;
    }
    return undefined;
}
function getRuntime() {
    if (Platform.isNode) {
        return "NodeJS";
    }
    else {
        return "Browser";
    }
}
/** @private */
function getErrorString(e) {
    if (e.stack) {
        return e.stack;
    }
    else if (e.message) {
        return e.message;
    }
    return `${e}`;
}
/** @private */
function getGlobalThis() {
    // globalThis is semi-new and not available in Node until v12
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof __webpack_require__.g !== "undefined") {
        return __webpack_require__.g;
    }
    throw new Error("could not find global");
}
//# sourceMappingURL=Utils.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js":
/*!************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebSocketTransport": () => (/* binding */ WebSocketTransport)
/* harmony export */ });
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HeaderNames */ "./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




/** @private */
class WebSocketTransport {
    constructor(httpClient, accessTokenFactory, logger, logMessageContent, webSocketConstructor, headers) {
        this._logger = logger;
        this._accessTokenFactory = accessTokenFactory;
        this._logMessageContent = logMessageContent;
        this._webSocketConstructor = webSocketConstructor;
        this._httpClient = httpClient;
        this.onreceive = null;
        this.onclose = null;
        this._headers = headers;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(WebSockets transport) Connecting.");
        if (this._accessTokenFactory) {
            const token = await this._accessTokenFactory();
            if (token) {
                url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
            }
        }
        return new Promise((resolve, reject) => {
            url = url.replace(/^http/, "ws");
            let webSocket;
            const cookies = this._httpClient.getCookieString(url);
            let opened = false;
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode) {
                const headers = {};
                const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
                headers[name] = value;
                if (cookies) {
                    headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_3__.HeaderNames.Cookie] = `${cookies}`;
                }
                // Only pass headers when in non-browser environments
                webSocket = new this._webSocketConstructor(url, undefined, {
                    headers: { ...headers, ...this._headers },
                });
            }
            if (!webSocket) {
                // Chrome is not happy with passing 'undefined' as protocol
                webSocket = new this._webSocketConstructor(url);
            }
            if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat.Binary) {
                webSocket.binaryType = "arraybuffer";
            }
            webSocket.onopen = (_event) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `WebSocket connected to ${url}.`);
                this._webSocket = webSocket;
                opened = true;
                resolve();
            };
            webSocket.onerror = (event) => {
                let error = null;
                // ErrorEvent is a browser only type we need to check if the type exists before using it
                if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                    error = event.error;
                }
                else {
                    error = "There was an error with the transport";
                }
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `(WebSockets transport) ${error}.`);
            };
            webSocket.onmessage = (message) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(WebSockets transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(message.data, this._logMessageContent)}.`);
                if (this.onreceive) {
                    try {
                        this.onreceive(message.data);
                    }
                    catch (error) {
                        this._close(error);
                        return;
                    }
                }
            };
            webSocket.onclose = (event) => {
                // Don't call close handler if connection was never established
                // We'll reject the connect call instead
                if (opened) {
                    this._close(event);
                }
                else {
                    let error = null;
                    // ErrorEvent is a browser only type we need to check if the type exists before using it
                    if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                        error = event.error;
                    }
                    else {
                        error = "WebSocket failed to connect. The connection could not be found on the server,"
                            + " either the endpoint may not be a SignalR endpoint,"
                            + " the connection ID is not present on the server, or there is a proxy blocking WebSockets."
                            + " If you have multiple servers check that sticky sessions are enabled.";
                    }
                    reject(new Error(error));
                }
            };
        });
    }
    send(data) {
        if (this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(WebSockets transport) sending data. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(data, this._logMessageContent)}.`);
            this._webSocket.send(data);
            return Promise.resolve();
        }
        return Promise.reject("WebSocket is not in the OPEN state");
    }
    stop() {
        if (this._webSocket) {
            // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
            // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects
            this._close(undefined);
        }
        return Promise.resolve();
    }
    _close(event) {
        // webSocket will be null if the transport did not start successfully
        if (this._webSocket) {
            // Clear websocket handlers because we are considering the socket closed now
            this._webSocket.onclose = () => { };
            this._webSocket.onmessage = () => { };
            this._webSocket.onerror = () => { };
            this._webSocket.close();
            this._webSocket = undefined;
        }
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(WebSockets transport) socket closed.");
        if (this.onclose) {
            if (this._isCloseEvent(event) && (event.wasClean === false || event.code !== 1000)) {
                this.onclose(new Error(`WebSocket closed with status code: ${event.code} (${event.reason || "no reason given"}).`));
            }
            else if (event instanceof Error) {
                this.onclose(event);
            }
            else {
                this.onclose();
            }
        }
    }
    _isCloseEvent(event) {
        return event && typeof event.wasClean === "boolean" && typeof event.code === "number";
    }
}
//# sourceMappingURL=WebSocketTransport.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "XhrHttpClient": () => (/* binding */ XhrHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.



class XhrHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(logger) {
        super();
        this._logger = logger;
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(request.method, request.url, true);
            xhr.withCredentials = request.withCredentials === undefined ? true : request.withCredentials;
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            // Explicitly setting the Content-Type header for React Native on Android platform.
            xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            const headers = request.headers;
            if (headers) {
                Object.keys(headers)
                    .forEach((header) => {
                    xhr.setRequestHeader(header, headers[header]);
                });
            }
            if (request.responseType) {
                xhr.responseType = request.responseType;
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = () => {
                    xhr.abort();
                    reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
                };
            }
            if (request.timeout) {
                xhr.timeout = request.timeout;
            }
            xhr.onload = () => {
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
                }
                else {
                    reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.response || xhr.responseText || xhr.statusText, xhr.status));
                }
            };
            xhr.onerror = () => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Warning, `Error from HTTP request. ${xhr.status}: ${xhr.statusText}.`);
                reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.statusText, xhr.status));
            };
            xhr.ontimeout = () => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Warning, `Timeout from HTTP request.`);
                reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.TimeoutError());
            };
            xhr.send(request.content || "");
        });
    }
}
//# sourceMappingURL=XhrHttpClient.js.map

/***/ }),

/***/ "./src/js/controllers/dropdown-controller.js":
/*!***************************************************!*\
  !*** ./src/js/controllers/dropdown-controller.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _default)
/* harmony export */ });
/* harmony import */ var stimulus_dropdown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! stimulus-dropdown */ "./node_modules/stimulus-dropdown/dist/stimulus-dropdown.es.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var _default = /*#__PURE__*/function (_Dropdown) {
  _inherits(_default, _Dropdown);

  var _super = _createSuper(_default);

  function _default() {
    _classCallCheck(this, _default);

    return _super.apply(this, arguments);
  }

  _createClass(_default, [{
    key: "connect",
    value: function connect() {
      _get(_getPrototypeOf(_default.prototype), "connect", this).call(this);
    }
  }, {
    key: "toggle",
    value: function toggle(event) {
      _get(_getPrototypeOf(_default.prototype), "toggle", this).call(this);
    }
  }, {
    key: "hide",
    value: function hide(event) {
      _get(_getPrototypeOf(_default.prototype), "hide", this).call(this, event);
    }
  }]);

  return _default;
}(stimulus_dropdown__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/js/controllers/stimulus-controller.js":
/*!***************************************************!*\
  !*** ./src/js/controllers/stimulus-controller.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _default)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var _default = /*#__PURE__*/function (_Controller) {
  _inherits(_default, _Controller);

  var _super = _createSuper(_default);

  function _default() {
    _classCallCheck(this, _default);

    return _super.apply(this, arguments);
  }

  _createClass(_default, [{
    key: "work",
    value: function work() {
      this.outputTarget.textContent = "Hello, ".concat(this.sourceTarget.value);
      console.log("Hello, ".concat(this.sourceTarget.value));
    }
  }]);

  return _default;
}(_hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller);

_defineProperty(_default, "targets", ["source", "output"]);



/***/ }),

/***/ "./src/js/controllers/tooltip-controller.js":
/*!**************************************************!*\
  !*** ./src/js/controllers/tooltip-controller.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _default)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var _default = /*#__PURE__*/function (_Controller) {
  _inherits(_default, _Controller);

  var _super = _createSuper(_default);

  function _default() {
    _classCallCheck(this, _default);

    return _super.apply(this, arguments);
  }

  _createClass(_default, [{
    key: "work",
    value: function work() {
      this.outputTarget.textContent = "Hello, ".concat(this.sourceTarget.value);
      console.log("Hello, ".concat(this.sourceTarget.value));
    }
  }, {
    key: "open",
    value: function open() {
      console.log("open");
      this.infoTarget.classList.remove("text-white");
      this.boxTarget.classList.remove("bg-gray-400", "ring-[#ffdb4d]");
      this.boxTarget.classList.add("bg-purple-700", "ring-purple-700");
      this.infoTarget.classList.add("text-yellow-400");
    }
  }, {
    key: "close",
    value: function close() {
      console.log("close");
      this.infoTarget.classList.remove("text-yellow-400");
      this.infoTarget.classList.add("text-white");
      this.boxTarget.classList.remove("bg-purple-700", "ring-purple-700");
      this.boxTarget.classList.add("bg-gray-400", "ring-[#ffdb4d]");
    }
  }, {
    key: "change",
    value: function change() {
      if (this.detailTarget.open) {
        this.open();
      } else {
        this.close();
      } //this.infoTarget.classList.remove("text-yellow-400");
      //this.infoTarget.classList.add("text-white");
      //this.boxTarget.classList.remove("bg-purple-700", "ring-purple-700");
      //this.boxTarget.classList.add("bg-gray-400", "ring-[#ffdb4d]");

    }
  }]);

  return _default;
}(_hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller);

_defineProperty(_default, "targets", ["content", "info", "box", "detail"]);



/***/ }),

/***/ "./src/js/controllers/turbo-progress-bar-controller.js":
/*!*************************************************************!*\
  !*** ./src/js/controllers/turbo-progress-bar-controller.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _default)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

 // Connects to data-controller="turbo-progress-bar"

var _default = /*#__PURE__*/function (_Controller) {
  _inherits(_default, _Controller);

  var _super = _createSuper(_default);

  function _default() {
    _classCallCheck(this, _default);

    return _super.apply(this, arguments);
  }

  _createClass(_default, [{
    key: "connect",
    value: function connect() {
      Turbo.setProgressBarDelay(1);
      document.addEventListener("turbo:before-fetch-request", function () {
        Turbo.navigator.adapter.progressBar.setValue(0);
        Turbo.navigator.adapter.progressBar.show();
      });
      document.addEventListener("turbo:before-fetch-response", function () {
        Turbo.navigator.adapter.progressBar.setValue(100);
        Turbo.navigator.adapter.progressBar.hide();
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {//  detach events if needed
    }
  }]);

  return _default;
}(_hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller);


;

/***/ }),

/***/ "./src/js/signalRTurboStreamElement.js":
/*!*********************************************!*\
  !*** ./src/js/signalRTurboStreamElement.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hotwired_turbo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hotwired/turbo */ "./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js");
/* harmony import */ var _microsoft_signalr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/signalr */ "./node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var SignalRTurboStreamElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(SignalRTurboStreamElement, _HTMLElement);

  var _super = _createSuper(SignalRTurboStreamElement);

  function SignalRTurboStreamElement() {
    _classCallCheck(this, SignalRTurboStreamElement);

    return _super.apply(this, arguments);
  }

  _createClass(SignalRTurboStreamElement, [{
    key: "connectedCallback",
    value: function () {
      var _connectedCallback = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _this = this;

        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0,_hotwired_turbo__WEBPACK_IMPORTED_MODULE_1__.connectStreamSource)(this); // We are connecting to the hub where the name is given in hub attribute

                this.connection = new _microsoft_signalr__WEBPACK_IMPORTED_MODULE_2__.HubConnectionBuilder().withUrl(this.getAttribute("hub")).build(); // We are subscribing to the event in the method attribute and send it to dispatch

                this.connection.on(this.getAttribute("method"), function (message) {
                  _this.dispatchMessageEvent(message);
                }); // Start the connection

                this.connection.start();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connectedCallback() {
        return _connectedCallback.apply(this, arguments);
      }

      return connectedCallback;
    }()
  }, {
    key: "dispatchMessageEvent",
    value: function dispatchMessageEvent(data) {
      var event = new MessageEvent("message", {
        data: data
      });
      return this.dispatchEvent(event);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      (0,_hotwired_turbo__WEBPACK_IMPORTED_MODULE_1__.disconnectStreamSource)(this);
      if (this.connection) this.connection.stop();
    }
  }]);

  return SignalRTurboStreamElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

customElements.define("signalr-turbo-stream", SignalRTurboStreamElement);

/***/ }),

/***/ "./node_modules/hotkeys-js/dist/hotkeys.esm.js":
/*!*****************************************************!*\
  !*** ./node_modules/hotkeys-js/dist/hotkeys.esm.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hotkeys)
/* harmony export */ });
/**! 
 * hotkeys-js v3.10.0 
 * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies. 
 * 
 * Copyright (c) 2022 kenny wong <wowohoo@qq.com> 
 * http://jaywcjlove.github.io/hotkeys 
 * Licensed under the MIT license 
 */

var isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false; // 绑定事件

function addEvent(object, event, method, useCapture) {
  if (object.addEventListener) {
    object.addEventListener(event, method, useCapture);
  } else if (object.attachEvent) {
    object.attachEvent("on".concat(event), function () {
      method(window.event);
    });
  }
} // 修饰键转换成对应的键码


function getMods(modifier, key) {
  var mods = key.slice(0, key.length - 1);

  for (var i = 0; i < mods.length; i++) {
    mods[i] = modifier[mods[i].toLowerCase()];
  }

  return mods;
} // 处理传的key字符串转换成数组


function getKeys(key) {
  if (typeof key !== 'string') key = '';
  key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等

  var keys = key.split(','); // 同时设置多个快捷键，以','分割

  var index = keys.lastIndexOf(''); // 快捷键可能包含','，需特殊处理

  for (; index >= 0;) {
    keys[index - 1] += ',';
    keys.splice(index, 1);
    index = keys.lastIndexOf('');
  }

  return keys;
} // 比较修饰键的数组


function compareArray(a1, a2) {
  var arr1 = a1.length >= a2.length ? a1 : a2;
  var arr2 = a1.length >= a2.length ? a2 : a1;
  var isIndex = true;

  for (var i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
  }

  return isIndex;
}

var _keyMap = {
  backspace: 8,
  '⌫': 8,
  tab: 9,
  clear: 12,
  enter: 13,
  '↩': 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  num_0: 96,
  num_1: 97,
  num_2: 98,
  num_3: 99,
  num_4: 100,
  num_5: 101,
  num_6: 102,
  num_7: 103,
  num_8: 104,
  num_9: 105,
  num_multiply: 106,
  num_add: 107,
  num_enter: 108,
  num_subtract: 109,
  num_decimal: 110,
  num_divide: 111,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  '\'': 222,
  '[': 219,
  ']': 221,
  '\\': 220
}; // Modifier Keys

var _modifier = {
  // shiftKey
  '⇧': 16,
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  command: 91
};
var modifierMap = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',
  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91
};
var _mods = {
  16: false,
  18: false,
  17: false,
  91: false
};
var _handlers = {}; // F1~F12 special key

for (var k = 1; k < 20; k++) {
  _keyMap["f".concat(k)] = 111 + k;
}

var _downKeys = []; // 记录摁下的绑定键

var winListendFocus = false; // window是否已经监听了focus事件

var _scope = 'all'; // 默认热键范围

var elementHasBindEvent = []; // 已绑定事件的节点记录
// 返回键码

var code = function code(x) {
  return _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
};

var getKey = function getKey(x) {
  return Object.keys(_keyMap).find(function (k) {
    return _keyMap[k] === x;
  });
};

var getModifier = function getModifier(x) {
  return Object.keys(_modifier).find(function (k) {
    return _modifier[k] === x;
  });
}; // 设置获取当前范围（默认为'所有'）


function setScope(scope) {
  _scope = scope || 'all';
} // 获取当前范围


function getScope() {
  return _scope || 'all';
} // 获取摁下绑定键的键值


function getPressedKeyCodes() {
  return _downKeys.slice(0);
}

function getPressedKeyString() {
  return _downKeys.map(function (c) {
    return getKey(c) || getModifier(c) || String.fromCharCode(c);
  });
} // 表单控件控件判断 返回 Boolean
// hotkey is effective only when filter return true


function filter(event) {
  var target = event.target || event.srcElement;
  var tagName = target.tagName;
  var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>

  if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
    flag = false;
  }

  return flag;
} // 判断摁下的键是否为某个键，返回true或者false


function isPressed(keyCode) {
  if (typeof keyCode === 'string') {
    keyCode = code(keyCode); // 转换成键码
  }

  return _downKeys.indexOf(keyCode) !== -1;
} // 循环删除handlers中的所有 scope(范围)


function deleteScope(scope, newScope) {
  var handlers;
  var i; // 没有指定scope，获取scope

  if (!scope) scope = getScope();

  for (var key in _handlers) {
    if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
      handlers = _handlers[key];

      for (i = 0; i < handlers.length;) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);else i++;
      }
    }
  } // 如果scope被删除，将scope重置为all


  if (getScope() === scope) setScope(newScope || 'all');
} // 清除修饰键


function clearModifier(event) {
  var key = event.keyCode || event.which || event.charCode;

  var i = _downKeys.indexOf(key); // 从列表中清除按压过的键


  if (i >= 0) {
    _downKeys.splice(i, 1);
  } // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题


  if (event.key && event.key.toLowerCase() === 'meta') {
    _downKeys.splice(0, _downKeys.length);
  } // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除


  if (key === 93 || key === 224) key = 91;

  if (key in _mods) {
    _mods[key] = false; // 将修饰键重置为false

    for (var k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = false;
    }
  }
}

function unbind(keysInfo) {
  // unbind(), unbind all keys
  if (typeof keysInfo === 'undefined') {
    Object.keys(_handlers).forEach(function (key) {
      return delete _handlers[key];
    });
  } else if (Array.isArray(keysInfo)) {
    // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
    keysInfo.forEach(function (info) {
      if (info.key) eachUnbind(info);
    });
  } else if (typeof keysInfo === 'object') {
    // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
    if (keysInfo.key) eachUnbind(keysInfo);
  } else if (typeof keysInfo === 'string') {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // support old method
    // eslint-disable-line
    var scope = args[0],
        method = args[1];

    if (typeof scope === 'function') {
      method = scope;
      scope = '';
    }

    eachUnbind({
      key: keysInfo,
      scope: scope,
      method: method,
      splitKey: '+'
    });
  }
} // 解除绑定某个范围的快捷键


var eachUnbind = function eachUnbind(_ref) {
  var key = _ref.key,
      scope = _ref.scope,
      method = _ref.method,
      _ref$splitKey = _ref.splitKey,
      splitKey = _ref$splitKey === void 0 ? '+' : _ref$splitKey;
  var multipleKeys = getKeys(key);
  multipleKeys.forEach(function (originKey) {
    var unbindKeys = originKey.split(splitKey);
    var len = unbindKeys.length;
    var lastKey = unbindKeys[len - 1];
    var keyCode = lastKey === '*' ? '*' : code(lastKey);
    if (!_handlers[keyCode]) return; // 判断是否传入范围，没有就获取范围

    if (!scope) scope = getScope();
    var mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
    _handlers[keyCode] = _handlers[keyCode].filter(function (record) {
      // 通过函数判断，是否解除绑定，函数相等直接返回
      var isMatchingMethod = method ? record.method === method : true;
      return !(isMatchingMethod && record.scope === scope && compareArray(record.mods, mods));
    });
  });
}; // 对监听对应快捷键的回调函数进行处理


function eventHandler(event, handler, scope, element) {
  if (handler.element !== element) {
    return;
  }

  var modifiersMatch; // 看它是否在当前范围

  if (handler.scope === scope || handler.scope === 'all') {
    // 检查是否匹配修饰符（如果有返回true）
    modifiersMatch = handler.mods.length > 0;

    for (var y in _mods) {
      if (Object.prototype.hasOwnProperty.call(_mods, y)) {
        if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
          modifiersMatch = false;
        }
      }
    } // 调用处理程序，如果是修饰键不做处理


    if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
      if (handler.method(event, handler) === false) {
        if (event.preventDefault) event.preventDefault();else event.returnValue = false;
        if (event.stopPropagation) event.stopPropagation();
        if (event.cancelBubble) event.cancelBubble = true;
      }
    }
  }
} // 处理keydown事件


function dispatch(event, element) {
  var asterisk = _handlers['*'];
  var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

  if (!hotkeys.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
  // Webkit左右 command 键值不一样

  if (key === 93 || key === 224) key = 91;
  /**
   * Collect bound keys
   * If an Input Method Editor is processing key input and the event is keydown, return 229.
   * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
   * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
   */

  if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
  /**
   * Jest test cases are required.
   * ===============================
   */

  ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (keyName) {
    var keyNum = modifierMap[keyName];

    if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
      _downKeys.push(keyNum);
    } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
      _downKeys.splice(_downKeys.indexOf(keyNum), 1);
    } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
      /**
       * Fix if Command is pressed:
       * ===============================
       */
      if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
        _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
      }
    }
  });
  /**
   * -------------------------------
   */

  if (key in _mods) {
    _mods[key] = true; // 将特殊字符的key注册到 hotkeys 上

    for (var k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = true;
    }

    if (!asterisk) return;
  } // 将 modifierMap 里面的修饰键绑定到 event 中


  for (var e in _mods) {
    if (Object.prototype.hasOwnProperty.call(_mods, e)) {
      _mods[e] = event[modifierMap[e]];
    }
  }
  /**
   * https://github.com/jaywcjlove/hotkeys/pull/129
   * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
   * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
   * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
   */


  if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
    if (_downKeys.indexOf(17) === -1) {
      _downKeys.push(17);
    }

    if (_downKeys.indexOf(18) === -1) {
      _downKeys.push(18);
    }

    _mods[17] = true;
    _mods[18] = true;
  } // 获取范围 默认为 `all`


  var scope = getScope(); // 对任何快捷键都需要做的处理

  if (asterisk) {
    for (var i = 0; i < asterisk.length; i++) {
      if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
        eventHandler(event, asterisk[i], scope, element);
      }
    }
  } // key 不在 _handlers 中返回


  if (!(key in _handlers)) return;

  for (var _i = 0; _i < _handlers[key].length; _i++) {
    if (event.type === 'keydown' && _handlers[key][_i].keydown || event.type === 'keyup' && _handlers[key][_i].keyup) {
      if (_handlers[key][_i].key) {
        var record = _handlers[key][_i];
        var splitKey = record.splitKey;
        var keyShortcut = record.key.split(splitKey);
        var _downKeysCurrent = []; // 记录当前按键键值

        for (var a = 0; a < keyShortcut.length; a++) {
          _downKeysCurrent.push(code(keyShortcut[a]));
        }

        if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
          // 找到处理内容
          eventHandler(event, record, scope, element);
        }
      }
    }
  }
} // 判断 element 是否已经绑定事件


function isElementBind(element) {
  return elementHasBindEvent.indexOf(element) > -1;
}

function hotkeys(key, option, method) {
  _downKeys = [];
  var keys = getKeys(key); // 需要处理的快捷键列表

  var mods = [];
  var scope = 'all'; // scope默认为all，所有范围都有效

  var element = document; // 快捷键事件绑定节点

  var i = 0;
  var keyup = false;
  var keydown = true;
  var splitKey = '+';
  var capture = false; // 对为设定范围的判断

  if (method === undefined && typeof option === 'function') {
    method = option;
  }

  if (Object.prototype.toString.call(option) === '[object Object]') {
    if (option.scope) scope = option.scope; // eslint-disable-line

    if (option.element) element = option.element; // eslint-disable-line

    if (option.keyup) keyup = option.keyup; // eslint-disable-line

    if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line

    if (option.capture !== undefined) capture = option.capture; // eslint-disable-line

    if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
  }

  if (typeof option === 'string') scope = option; // 对于每个快捷键进行处理

  for (; i < keys.length; i++) {
    key = keys[i].split(splitKey); // 按键列表

    mods = []; // 如果是组合快捷键取得组合快捷键

    if (key.length > 1) mods = getMods(_modifier, key); // 将非修饰键转化为键码

    key = key[key.length - 1];
    key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键
    // 判断key是否在_handlers中，不在就赋一个空数组

    if (!(key in _handlers)) _handlers[key] = [];

    _handlers[key].push({
      keyup: keyup,
      keydown: keydown,
      scope: scope,
      mods: mods,
      shortcut: keys[i],
      method: method,
      key: keys[i],
      splitKey: splitKey,
      element: element
    });
  } // 在全局document上设置快捷键


  if (typeof element !== 'undefined' && !isElementBind(element) && window) {
    elementHasBindEvent.push(element);
    addEvent(element, 'keydown', function (e) {
      dispatch(e, element);
    }, capture);

    if (!winListendFocus) {
      winListendFocus = true;
      addEvent(window, 'focus', function () {
        _downKeys = [];
      }, capture);
    }

    addEvent(element, 'keyup', function (e) {
      dispatch(e, element);
      clearModifier(e);
    }, capture);
  }
}

function trigger(shortcut) {
  var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';
  Object.keys(_handlers).forEach(function (key) {
    var data = _handlers[key].find(function (item) {
      return item.scope === scope && item.shortcut === shortcut;
    });

    if (data && data.method) {
      data.method();
    }
  });
}

var _api = {
  getPressedKeyString: getPressedKeyString,
  setScope: setScope,
  getScope: getScope,
  deleteScope: deleteScope,
  getPressedKeyCodes: getPressedKeyCodes,
  isPressed: isPressed,
  filter: filter,
  trigger: trigger,
  unbind: unbind,
  keyMap: _keyMap,
  modifier: _modifier,
  modifierMap: modifierMap
};

for (var a in _api) {
  if (Object.prototype.hasOwnProperty.call(_api, a)) {
    hotkeys[a] = _api[a];
  }
}

if (typeof window !== 'undefined') {
  var _hotkeys = window.hotkeys;

  hotkeys.noConflict = function (deep) {
    if (deep && window.hotkeys === hotkeys) {
      window.hotkeys = _hotkeys;
    }

    return hotkeys;
  };

  window.hotkeys = hotkeys;
}




/***/ }),

/***/ "./src/css/app.css":
/*!*************************!*\
  !*** ./src/css/app.css ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = "object" === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),

/***/ "./node_modules/stimulus-dropdown/dist/stimulus-dropdown.es.js":
/*!*********************************************************************!*\
  !*** ./node_modules/stimulus-dropdown/dist/stimulus-dropdown.es.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ src_default)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
/* harmony import */ var stimulus_use__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stimulus-use */ "./node_modules/stimulus-use/dist/index.js");


class src_default extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
  connect() {
    (0,stimulus_use__WEBPACK_IMPORTED_MODULE_1__.useTransition)(this, {
      element: this.menuTarget
    });
  }
  toggle() {
    this.toggleTransition();
  }
  hide(event) {
    if (!this.element.contains(event.target) && !this.menuTarget.classList.contains("hidden")) {
      this.leave();
    }
  }
}
src_default.targets = ["menu"];



/***/ }),

/***/ "./node_modules/stimulus-use/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/stimulus-use/dist/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApplicationController": () => (/* binding */ ApplicationController),
/* harmony export */   "ClickOutsideController": () => (/* binding */ ClickOutsideController),
/* harmony export */   "HoverController": () => (/* binding */ HoverController),
/* harmony export */   "IdleController": () => (/* binding */ IdleController),
/* harmony export */   "IntersectionController": () => (/* binding */ IntersectionController),
/* harmony export */   "LazyLoadController": () => (/* binding */ LazyLoadController),
/* harmony export */   "MutationController": () => (/* binding */ MutationController),
/* harmony export */   "ResizeController": () => (/* binding */ ResizeController),
/* harmony export */   "TargetMutationController": () => (/* binding */ TargetMutationController),
/* harmony export */   "TransitionController": () => (/* binding */ TransitionController),
/* harmony export */   "UseHover": () => (/* binding */ UseHover),
/* harmony export */   "UseMutation": () => (/* binding */ UseMutation),
/* harmony export */   "UseTargetMutation": () => (/* binding */ UseTargetMutation),
/* harmony export */   "UseVisibility": () => (/* binding */ UseVisibility),
/* harmony export */   "VisibilityController": () => (/* binding */ VisibilityController),
/* harmony export */   "WindowFocusController": () => (/* binding */ WindowFocusController),
/* harmony export */   "WindowResizeController": () => (/* binding */ WindowResizeController),
/* harmony export */   "useApplication": () => (/* binding */ useApplication),
/* harmony export */   "useClickOutside": () => (/* binding */ useClickOutside),
/* harmony export */   "useDebounce": () => (/* binding */ useDebounce),
/* harmony export */   "useDispatch": () => (/* binding */ useDispatch),
/* harmony export */   "useHotkeys": () => (/* binding */ useHotkeys),
/* harmony export */   "useHover": () => (/* binding */ useHover),
/* harmony export */   "useIdle": () => (/* binding */ useIdle),
/* harmony export */   "useIntersection": () => (/* binding */ useIntersection),
/* harmony export */   "useLazyLoad": () => (/* binding */ useLazyLoad),
/* harmony export */   "useMatchMedia": () => (/* binding */ useMatchMedia),
/* harmony export */   "useMemo": () => (/* binding */ useMemo),
/* harmony export */   "useMeta": () => (/* binding */ useMeta),
/* harmony export */   "useMutation": () => (/* binding */ useMutation),
/* harmony export */   "useResize": () => (/* binding */ useResize),
/* harmony export */   "useTargetMutation": () => (/* binding */ useTargetMutation),
/* harmony export */   "useThrottle": () => (/* binding */ useThrottle),
/* harmony export */   "useTransition": () => (/* binding */ useTransition),
/* harmony export */   "useVisibility": () => (/* binding */ useVisibility),
/* harmony export */   "useWindowFocus": () => (/* binding */ useWindowFocus),
/* harmony export */   "useWindowResize": () => (/* binding */ useWindowResize)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
/* harmony import */ var hotkeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hotkeys-js */ "./node_modules/hotkeys-js/dist/hotkeys.esm.js");
/*
Stimulus-Use 0.50.0-2
*/



const method = (controller, methodName) => {
    const method = controller[methodName];
    if (typeof method == 'function') {
        return method;
    }
    else {
        return (...args) => { };
    }
};
const composeEventName = (name, controller, eventPrefix) => {
    let composedName = name;
    if (eventPrefix === true) {
        composedName = `${controller.identifier}:${name}`;
    }
    else if (typeof eventPrefix === 'string') {
        composedName = `${eventPrefix}:${name}`;
    }
    return composedName;
};
const extendedEvent = (type, event, detail) => {
    const { bubbles, cancelable, composed } = event || { bubbles: true, cancelable: true, composed: true };
    if (event) {
        Object.assign(detail, { originalEvent: event });
    }
    const customEvent = new CustomEvent(type, {
        bubbles,
        cancelable,
        composed,
        detail
    });
    return customEvent;
};
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
    const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
    return vertInView && horInView;
}
function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}

const defaultOptions$7 = {
    dispatchEvent: true,
    eventPrefix: true
};
const useIntersection = (controller, options = {}) => {
    const { dispatchEvent, eventPrefix } = Object.assign({}, defaultOptions$7, options);
    const targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
    const callback = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            dispatchAppear(entry);
        }
        else if (controller.isVisible) {
            dispatchDisappear(entry);
        }
    };
    const dispatchAppear = (entry) => {
        controller.isVisible = true;
        method(controller, 'appear').call(controller, entry);
        if (dispatchEvent) {
            const eventName = composeEventName('appear', controller, eventPrefix);
            const appearEvent = extendedEvent(eventName, null, { controller, entry });
            targetElement.dispatchEvent(appearEvent);
        }
    };
    const dispatchDisappear = (entry) => {
        controller.isVisible = false;
        method(controller, 'disappear').call(controller, entry);
        if (dispatchEvent) {
            const eventName = composeEventName('disappear', controller, eventPrefix);
            const disappearEvent = extendedEvent(eventName, null, { controller, entry });
            targetElement.dispatchEvent(disappearEvent);
        }
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observer = new IntersectionObserver(callback, options);
    const observe = () => {
        observer.observe(targetElement);
    };
    const unobserve = () => {
        observer.unobserve(targetElement);
    };
    Object.assign(controller, {
        isVisible: false,
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class IntersectionComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.isVisible = false;
    }
}
class IntersectionController extends IntersectionComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useIntersection(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const useLazyLoad = (controller, options) => {
    const callback = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !controller.isLoaded) {
            handleAppear();
        }
    };
    const handleAppear = (entry) => {
        const src = controller.data.get('src');
        if (!src)
            return;
        const imageElement = controller.element;
        controller.isLoading = true;
        method(controller, 'loading').call(controller, src);
        imageElement.onload = () => {
            handleLoaded(src);
        };
        imageElement.src = src;
    };
    const handleLoaded = (src) => {
        controller.isLoading = false;
        controller.isLoaded = true;
        method(controller, 'loaded').call(controller, src);
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observer = new IntersectionObserver(callback, options);
    const observe = () => {
        observer.observe(controller.element);
    };
    const unobserve = () => {
        observer.unobserve(controller.element);
    };
    Object.assign(controller, {
        isVisible: false,
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class LazyLoadComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.isLoading = false;
        this.isLoaded = false;
    }
}
class LazyLoadController extends LazyLoadComposableController {
    constructor(context) {
        super(context);
        this.options = { rootMargin: '10%' };
        requestAnimationFrame(() => {
            const [observe, unobserve] = useLazyLoad(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const defaultOptions$6 = {
    dispatchEvent: true,
    eventPrefix: true
};
const useResize = (controller, options = {}) => {
    const { dispatchEvent, eventPrefix } = Object.assign({}, defaultOptions$6, options);
    const targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
    const callback = (entries) => {
        const [entry] = entries;
        method(controller, 'resize').call(controller, entry.contentRect);
        if (dispatchEvent) {
            const eventName = composeEventName('resize', controller, eventPrefix);
            const appearEvent = extendedEvent(eventName, null, {
                controller,
                entry
            });
            targetElement.dispatchEvent(appearEvent);
        }
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observer = new ResizeObserver(callback);
    const observe = () => {
        observer.observe(targetElement);
    };
    const unobserve = () => {
        observer.unobserve(targetElement);
    };
    Object.assign(controller, {
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class ResizeComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class ResizeController extends ResizeComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useResize(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const defaultOptions$5 = {
    events: ['click', 'touchend'],
    onlyVisible: true,
    dispatchEvent: true,
    eventPrefix: true
};
const useClickOutside = (controller, options = {}) => {
    const { onlyVisible, dispatchEvent, events, eventPrefix } = Object.assign({}, defaultOptions$5, options);
    const onEvent = (event) => {
        const targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
        if (targetElement.contains(event.target) || (!isElementInViewport(targetElement) && onlyVisible)) {
            return;
        }
        if (controller.clickOutside) {
            controller.clickOutside(event);
        }
        if (dispatchEvent) {
            const eventName = composeEventName('click:outside', controller, eventPrefix);
            const clickOutsideEvent = extendedEvent(eventName, event, { controller });
            targetElement.dispatchEvent(clickOutsideEvent);
        }
    };
    const observe = () => {
        events === null || events === void 0 ? void 0 : events.forEach(event => {
            window.addEventListener(event, onEvent, false);
        });
    };
    const unobserve = () => {
        events === null || events === void 0 ? void 0 : events.forEach(event => {
            window.removeEventListener(event, onEvent, false);
        });
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    Object.assign(controller, {
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class ClickOutsideComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class ClickOutsideController extends ClickOutsideComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useClickOutside(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const defaultOptions$4 = {
    debug: false,
    logger: console,
    dispatchEvent: true,
    eventPrefix: true
};
class StimulusUse {
    constructor(controller, options = {}) {
        var _a, _b, _c;
        this.log = (functionName, args) => {
            if (!this.debug)
                return;
            this.logger.groupCollapsed(`%c${this.controller.identifier} %c#${functionName}`, 'color: #3B82F6', 'color: unset');
            this.logger.log(Object.assign({ controllerId: this.controllerId }, args));
            this.logger.groupEnd();
        };
        this.dispatch = (eventName, details = {}) => {
            if (this.dispatchEvent) {
                const { event } = details, eventDetails = __rest(details, ["event"]);
                const customEvent = this.extendedEvent(eventName, event || null, eventDetails);
                this.targetElement.dispatchEvent(customEvent);
                this.log('dispatchEvent', Object.assign({ eventName: customEvent.type }, eventDetails));
            }
        };
        this.call = (methodName, args = {}) => {
            const method = this.controller[methodName];
            if (typeof method == 'function') {
                return method.call(this.controller, args);
            }
        };
        this.extendedEvent = (name, event, detail) => {
            const { bubbles, cancelable, composed } = event || { bubbles: true, cancelable: true, composed: true };
            if (event) {
                Object.assign(detail, { originalEvent: event });
            }
            const customEvent = new CustomEvent(this.composeEventName(name), {
                bubbles,
                cancelable,
                composed,
                detail
            });
            return customEvent;
        };
        this.composeEventName = (name) => {
            let composedName = name;
            if (this.eventPrefix === true) {
                composedName = `${this.controller.identifier}:${name}`;
            }
            else if (typeof this.eventPrefix === 'string') {
                composedName = `${this.eventPrefix}:${name}`;
            }
            return composedName;
        };
        this.debug = (_b = (_a = options === null || options === void 0 ? void 0 : options.debug) !== null && _a !== void 0 ? _a : controller.application.stimulusUseDebug) !== null && _b !== void 0 ? _b : defaultOptions$4.debug;
        this.logger = (_c = options === null || options === void 0 ? void 0 : options.logger) !== null && _c !== void 0 ? _c : defaultOptions$4.logger;
        this.controller = controller;
        this.controllerId = controller.element.id || controller.element.dataset.id;
        this.targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
        const { dispatchEvent, eventPrefix } = Object.assign({}, defaultOptions$4, options);
        Object.assign(this, { dispatchEvent, eventPrefix });
        this.controllerInitialize = controller.initialize.bind(controller);
        this.controllerConnect = controller.connect.bind(controller);
        this.controllerDisconnect = controller.disconnect.bind(controller);
    }
}

const defaultOptions$3 = {
    eventPrefix: true,
    bubbles: true,
    cancelable: true
};
class UseDispatch extends StimulusUse {
    constructor(controller, options = {}) {
        var _a, _b, _c, _d;
        super(controller, options);
        this.dispatch = (eventName, detail = {}) => {
            const { controller, targetElement, eventPrefix, bubbles, cancelable, log } = this;
            Object.assign(detail, { controller });
            const eventNameWithPrefix = composeEventName(eventName, this.controller, eventPrefix);
            const event = new CustomEvent(eventNameWithPrefix, {
                detail,
                bubbles,
                cancelable
            });
            targetElement.dispatchEvent(event);
            log('dispatch', { eventName: eventNameWithPrefix, detail, bubbles, cancelable });
            return event;
        };
        this.targetElement = (_a = options.element) !== null && _a !== void 0 ? _a : controller.element;
        this.eventPrefix = (_b = options.eventPrefix) !== null && _b !== void 0 ? _b : defaultOptions$3.eventPrefix;
        this.bubbles = (_c = options.bubbles) !== null && _c !== void 0 ? _c : defaultOptions$3.bubbles;
        this.cancelable = (_d = options.cancelable) !== null && _d !== void 0 ? _d : defaultOptions$3.cancelable;
        this.enhanceController();
    }
    enhanceController() {
        Object.assign(this.controller, { dispatch: this.dispatch });
    }
}
const useDispatch = (controller, options = {}) => {
    return new UseDispatch(controller, options);
};

const useApplication = (controller, options = {}) => {
    Object.defineProperty(controller, 'isPreview', {
        get() {
            return (document.documentElement.hasAttribute('data-turbolinks-preview') ||
                document.documentElement.hasAttribute('data-turbo-preview'));
        }
    });
    Object.defineProperty(controller, 'isConnected', {
        get() {
            return !!Array.from(this.context.module.connectedContexts).find(c => c === this.context);
        }
    });
    Object.defineProperty(controller, 'csrfToken', {
        get() {
            return this.metaValue('csrf-token');
        }
    });
    useDispatch(controller, options);
    Object.assign(controller, {
        metaValue(name) {
            const element = document.head.querySelector(`meta[name="${name}"]`);
            return element && element.getAttribute('content');
        }
    });
};

class ApplicationController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor(context) {
        super(context);
        this.isPreview = false;
        this.isConnected = false;
        this.csrfToken = '';
        useApplication(this, this.options);
    }
}

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];
const oneMinute = 60e3;
const defaultOptions$2 = {
    ms: oneMinute,
    initialState: false,
    events: defaultEvents,
    dispatchEvent: true,
    eventPrefix: true
};
const useIdle = (controller, options = {}) => {
    const { ms, initialState, events, dispatchEvent, eventPrefix } = Object.assign({}, defaultOptions$2, options);
    let isIdle = initialState;
    let timeout = setTimeout(() => {
        isIdle = true;
        dispatchAway();
    }, ms);
    const dispatchAway = (event) => {
        const eventName = composeEventName('away', controller, eventPrefix);
        controller.isIdle = true;
        method(controller, 'away').call(controller, event);
        if (dispatchEvent) {
            const clickOutsideEvent = extendedEvent(eventName, event || null, { controller });
            controller.element.dispatchEvent(clickOutsideEvent);
        }
    };
    const dispatchBack = (event) => {
        const eventName = composeEventName('back', controller, eventPrefix);
        controller.isIdle = false;
        method(controller, 'back').call(controller, event);
        if (dispatchEvent) {
            const clickOutsideEvent = extendedEvent(eventName, event || null, { controller });
            controller.element.dispatchEvent(clickOutsideEvent);
        }
    };
    const onEvent = (event) => {
        if (isIdle)
            dispatchBack(event);
        isIdle = false;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            isIdle = true;
            dispatchAway(event);
        }, ms);
    };
    const onVisibility = (event) => {
        if (!document.hidden)
            onEvent(event);
    };
    if (isIdle) {
        dispatchAway();
    }
    else {
        dispatchBack();
    }
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observe = () => {
        events.forEach(event => {
            window.addEventListener(event, onEvent);
        });
        document.addEventListener('visibilitychange', onVisibility);
    };
    const unobserve = () => {
        clearTimeout(timeout);
        events.forEach(event => {
            window.removeEventListener(event, onEvent);
        });
        document.removeEventListener('visibilitychange', onVisibility);
    };
    Object.assign(controller, {
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class IdleComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.isIdle = false;
    }
}
class IdleController extends IdleComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useIdle(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

class UseVisibility extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            this.controller.isVisible = !document.hidden;
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            this.handleVisibilityChange();
        };
        this.unobserve = () => {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        };
        this.becomesInvisible = (event) => {
            this.controller.isVisible = false;
            this.call('invisible', event);
            this.log('invisible', { isVisible: false });
            this.dispatch('invisible', { event, isVisible: false });
        };
        this.becomesVisible = (event) => {
            this.controller.isVisible = true;
            this.call('visible', event);
            this.log('visible', { isVisible: true });
            this.dispatch('visible', { event, isVisible: true });
        };
        this.handleVisibilityChange = (event) => {
            if (document.hidden) {
                this.becomesInvisible(event);
            }
            else {
                this.becomesVisible(event);
            }
        };
        this.controller = controller;
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controllerDisconnect;
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useVisibility = (controller, options = {}) => {
    const observer = new UseVisibility(controller, options);
    return [observer.observe, observer.unobserve];
};

class VisibilityComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.isVisible = false;
    }
}
class VisibilityController extends VisibilityComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useVisibility(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

class UseHover extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            this.targetElement.addEventListener('mouseenter', this.onEnter);
            this.targetElement.addEventListener('mouseleave', this.onLeave);
        };
        this.unobserve = () => {
            this.targetElement.removeEventListener('mouseenter', this.onEnter);
            this.targetElement.removeEventListener('mouseleave', this.onLeave);
        };
        this.onEnter = (event) => {
            this.call('mouseEnter', event);
            this.log('mouseEnter', { hover: true });
            this.dispatch('mouseEnter', { hover: false });
        };
        this.onLeave = (event) => {
            this.call('mouseLeave', event);
            this.log('mouseLeave', { hover: false });
            this.dispatch('mouseLeave', { hover: false });
        };
        this.controller = controller;
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useHover = (controller, options = {}) => {
    const observer = new UseHover(controller, options);
    return [observer.observe, observer.unobserve];
};

class HoverComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class HoverController extends HoverComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useHover(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

class UseMutation extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            try {
                this.observer.observe(this.targetElement, this.options);
            }
            catch (error) {
                this.controller.application.handleError(error, 'At a minimum, one of childList, attributes, and/or characterData must be true', {});
            }
        };
        this.unobserve = () => {
            this.observer.disconnect();
        };
        this.mutation = (entries) => {
            this.call('mutate', entries);
            this.log('mutate', { entries });
            this.dispatch('mutate', { entries });
        };
        this.targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
        this.controller = controller;
        this.options = options;
        this.observer = new MutationObserver(this.mutation);
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useMutation = (controller, options = {}) => {
    const observer = new UseMutation(controller, options);
    return [observer.observe, observer.unobserve];
};

class MutationComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class MutationController extends MutationComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useMutation(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

class UseTargetMutation extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            this.observer.observe(this.targetElement, {
                subtree: true,
                characterData: true,
                childList: true,
                attributes: true,
                attributeOldValue: true,
                attributeFilter: [this.targetSelector, this.scopedTargetSelector]
            });
        };
        this.unobserve = () => {
            this.observer.disconnect();
        };
        this.mutation = (entries) => {
            for (const mutation of entries) {
                switch (mutation.type) {
                    case 'attributes':
                        let newValue = mutation.target.getAttribute(mutation.attributeName);
                        let oldValue = mutation.oldValue;
                        if (mutation.attributeName === this.targetSelector || mutation.attributeName === this.scopedTargetSelector) {
                            let oldTargets = this.targetsUsedByThisController(oldValue);
                            let newTargets = this.targetsUsedByThisController(newValue);
                            let removedTargets = oldTargets.filter(target => !newTargets.includes(target));
                            let addedTargets = newTargets.filter(target => !oldTargets.includes(target));
                            removedTargets.forEach(target => this.targetRemoved(this.stripIdentifierPrefix(target), mutation.target, 'attributeChange'));
                            addedTargets.forEach(target => this.targetAdded(this.stripIdentifierPrefix(target), mutation.target, 'attributeChange'));
                        }
                        break;
                    case 'characterData':
                        let nodule = this.findTargetInAncestry(mutation.target);
                        if (nodule == null) {
                            return;
                        }
                        else {
                            let supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
                            supportedTargets.forEach((target) => {
                                this.targetChanged(this.stripIdentifierPrefix(target), nodule, 'domMutation');
                            });
                        }
                        break;
                    case 'childList':
                        let { addedNodes, removedNodes } = mutation;
                        addedNodes.forEach((node) => this.processNodeDOMMutation(node, this.targetAdded));
                        removedNodes.forEach((node) => this.processNodeDOMMutation(node, this.targetRemoved));
                        break;
                }
            }
        };
        this.controller = controller;
        this.options = options;
        this.targetElement = controller.element;
        this.identifier = controller.scope.identifier;
        this.identifierPrefix = `${this.identifier}.`;
        this.targetSelector = controller.scope.schema.targetAttribute;
        this.scopedTargetSelector = `data-${this.identifier}-target`;
        this.targets = options.targets || controller.constructor.targets;
        this.prefixedTargets = this.targets.map(target => `${this.identifierPrefix}${target}`);
        this.observer = new MutationObserver(this.mutation);
        this.enhanceController();
        this.observe();
    }
    processNodeDOMMutation(node, initialChangeModeAssumption) {
        let nodule = node;
        let change = initialChangeModeAssumption;
        let supportedTargets = [];
        if (nodule.nodeName == '#text' || this.targetsUsedByThisControllerFromNode(nodule).length == 0) {
            change = this.targetChanged;
            nodule = this.findTargetInAncestry(node);
        }
        else {
            supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
        }
        if (nodule == null) {
            return;
        }
        else if (supportedTargets.length == 0) {
            supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
        }
        supportedTargets.forEach((target) => {
            change.call(this, this.stripIdentifierPrefix(target), nodule, 'domMutation');
        });
    }
    findTargetInAncestry(node) {
        let nodule = node;
        let supportedTargets = [];
        if (nodule.nodeName != '#text') {
            supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
        }
        while (nodule.parentNode !== null && nodule.parentNode != this.targetElement && supportedTargets.length == 0) {
            nodule = nodule.parentNode;
            if (nodule.nodeName !== '#text') {
                let supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
                if (supportedTargets.length > 0) {
                    return nodule;
                }
            }
        }
        if (nodule.nodeName == '#text') {
            return null;
        }
        if (nodule.parentNode == null) {
            return null;
        }
        if (nodule.parentNode == this.targetElement) {
            if (this.targetsUsedByThisControllerFromNode(nodule).length > 0) {
                return nodule;
            }
            return null;
        }
        return null;
    }
    targetAdded(name, node, trigger) {
        let targetCallback = `${name}TargetAdded`;
        this.controller[targetCallback] && method(this.controller, targetCallback).call(this.controller, node);
        this.log('targetAdded', { target: name, node, trigger });
    }
    targetRemoved(name, node, trigger) {
        let targetCallback = `${name}TargetRemoved`;
        this.controller[targetCallback] && method(this.controller, targetCallback).call(this.controller, node);
        this.log('targetRemoved', { target: name, node, trigger });
    }
    targetChanged(name, node, trigger) {
        let targetCallback = `${name}TargetChanged`;
        this.controller[targetCallback] && method(this.controller, targetCallback).call(this.controller, node);
        this.log('targetChanged', { target: name, node, trigger });
    }
    targetsUsedByThisControllerFromNode(node) {
        if (node.nodeName == '#text' || node.nodeName == '#comment') {
            return [];
        }
        let nodeElement = node;
        return this.targetsUsedByThisController(nodeElement.getAttribute(this.scopedTargetSelector) || nodeElement.getAttribute(this.targetSelector));
    }
    targetsUsedByThisController(targetStr) {
        targetStr = targetStr || '';
        let targetsToCheck = this.stripIdentifierPrefix(targetStr).split(' ');
        return this.targets.filter(n => targetsToCheck.indexOf(n) !== -1);
    }
    stripIdentifierPrefix(target) {
        return target.replace(new RegExp(this.identifierPrefix, 'g'), '');
    }
    enhanceController() {
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useTargetMutation = (controller, options = {}) => {
    const observer = new UseTargetMutation(controller, options);
    return [observer.observe, observer.unobserve];
};

class TargetMutationComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class TargetMutationController extends TargetMutationComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useTargetMutation(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const useWindowResize = (controller) => {
    const callback = (event) => {
        const { innerWidth, innerHeight } = window;
        const payload = {
            height: innerHeight || Infinity,
            width: innerWidth || Infinity,
            event
        };
        method(controller, 'windowResize').call(controller, payload);
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observe = () => {
        window.addEventListener('resize', callback);
        callback();
    };
    const unobserve = () => {
        window.removeEventListener('resize', callback);
    };
    Object.assign(controller, {
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class WindowResizeComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class WindowResizeController extends WindowResizeComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useWindowResize(this);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const memoize = (controller, name, value) => {
    Object.defineProperty(controller, name, { value });
    return value;
};
const useMemo = (controller) => {
    var _a;
    (_a = controller.constructor.memos) === null || _a === void 0 ? void 0 : _a.forEach((getter) => {
        memoize(controller, getter, controller[getter]);
    });
};

class DebounceController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
DebounceController.debounces = [];
const defaultWait$1 = 200;
const debounce = (fn, wait = defaultWait$1) => {
    let timeoutId = null;
    return function () {
        const args = arguments;
        const context = this;
        const callback = () => fn.apply(context, args);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(callback, wait);
    };
};
const useDebounce = (controller, options) => {
    var _a;
    const constructor = controller.constructor;
    (_a = constructor.debounces) === null || _a === void 0 ? void 0 : _a.forEach((func) => {
        if (typeof func === 'string') {
            controller[func] = debounce(controller[func], options === null || options === void 0 ? void 0 : options.wait);
        }
        if (typeof func === 'object') {
            const { name, wait } = func;
            if (!name)
                return;
            controller[name] = debounce(controller[name], wait || (options === null || options === void 0 ? void 0 : options.wait));
        }
    });
};

class ThrottleController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
ThrottleController.throttles = [];
const defaultWait = 200;
function throttle(func, wait = defaultWait) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            inThrottle = true;
            func.apply(context, args);
            setTimeout(() => (inThrottle = false), wait);
        }
    };
}
const useThrottle = (controller, options = {}) => {
    var _a;
    const constructor = controller.constructor;
    (_a = constructor.throttles) === null || _a === void 0 ? void 0 : _a.forEach((func) => {
        if (typeof func === 'string') {
            controller[func] = throttle(controller[func], options === null || options === void 0 ? void 0 : options.wait);
        }
        if (typeof func === 'object') {
            const { name, wait } = func;
            if (!name)
                return;
            controller[name] = throttle(controller[name], wait || (options === null || options === void 0 ? void 0 : options.wait));
        }
    });
};

const defineMetaGetter = (controller, metaName, suffix) => {
    const getterName = suffix ? `${camelize(metaName)}Meta` : camelize(metaName);
    Object.defineProperty(controller, getterName, {
        get() {
            return typeCast(metaValue(metaName));
        }
    });
};
function metaValue(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    return element && element.getAttribute('content');
}
function typeCast(value) {
    try {
        return JSON.parse(value);
    }
    catch (o_O) {
        return value;
    }
}
const useMeta = (controller, options = { suffix: true }) => {
    const metaNames = controller.constructor.metaNames;
    const suffix = options.suffix;
    metaNames === null || metaNames === void 0 ? void 0 : metaNames.forEach((metaName) => {
        defineMetaGetter(controller, metaName, suffix);
    });
    Object.defineProperty(controller, 'metas', {
        get() {
            const result = {};
            metaNames === null || metaNames === void 0 ? void 0 : metaNames.forEach((metaName) => {
                const value = typeCast(metaValue(metaName));
                if (value !== undefined && value !== null) {
                    result[camelize(metaName)] = value;
                }
            });
            return result;
        }
    });
};

const alpineNames = {
    enterFromClass: 'enter',
    enterActiveClass: 'enterStart',
    enterToClass: 'enterEnd',
    leaveFromClass: 'leave',
    leaveActiveClass: 'leaveStart',
    leaveToClass: 'leaveEnd'
};
const defaultOptions$1 = {
    transitioned: false,
    hiddenClass: 'hidden',
    preserveOriginalClass: true,
    removeToClasses: true
};
const useTransition = (controller, options = {}) => {
    var _a, _b, _c;
    const targetName = controller.element.dataset.transitionTarget;
    let targetFromAttribute;
    if (targetName) {
        targetFromAttribute = controller[`${targetName}Target`];
    }
    const targetElement = (options === null || options === void 0 ? void 0 : options.element) || targetFromAttribute || controller.element;
    if (!(targetElement instanceof HTMLElement || targetElement instanceof SVGElement))
        return;
    const dataset = targetElement.dataset;
    const leaveAfter = parseInt(dataset.leaveAfter || '') || options.leaveAfter || 0;
    const { transitioned, hiddenClass, preserveOriginalClass, removeToClasses } = Object.assign(defaultOptions$1, options);
    const controllerEnter = (_a = controller.enter) === null || _a === void 0 ? void 0 : _a.bind(controller);
    const controllerLeave = (_b = controller.leave) === null || _b === void 0 ? void 0 : _b.bind(controller);
    const controllerToggleTransition = (_c = controller.toggleTransition) === null || _c === void 0 ? void 0 : _c.bind(controller);
    async function enter(event) {
        if (controller.transitioned)
            return;
        controller.transitioned = true;
        controllerEnter && controllerEnter(event);
        const enterFromClasses = getAttribute('enterFrom', options, dataset);
        const enterActiveClasses = getAttribute('enterActive', options, dataset);
        const enterToClasses = getAttribute('enterTo', options, dataset);
        const leaveToClasses = getAttribute('leaveTo', options, dataset);
        if (!!hiddenClass) {
            targetElement.classList.remove(hiddenClass);
        }
        if (!removeToClasses) {
            removeClasses(targetElement, leaveToClasses);
        }
        await transition(targetElement, enterFromClasses, enterActiveClasses, enterToClasses, hiddenClass, preserveOriginalClass, removeToClasses);
        if (leaveAfter > 0) {
            setTimeout(() => {
                leave(event);
            }, leaveAfter);
        }
    }
    async function leave(event) {
        if (!controller.transitioned)
            return;
        controller.transitioned = false;
        controllerLeave && controllerLeave(event);
        const leaveFromClasses = getAttribute('leaveFrom', options, dataset);
        const leaveActiveClasses = getAttribute('leaveActive', options, dataset);
        const leaveToClasses = getAttribute('leaveTo', options, dataset);
        const enterToClasses = getAttribute('enterTo', options, dataset);
        if (!removeToClasses) {
            removeClasses(targetElement, enterToClasses);
        }
        await transition(targetElement, leaveFromClasses, leaveActiveClasses, leaveToClasses, hiddenClass, preserveOriginalClass, removeToClasses);
        if (!!hiddenClass) {
            targetElement.classList.add(hiddenClass);
        }
    }
    function toggleTransition(event) {
        controllerToggleTransition && controllerToggleTransition(event);
        if (controller.transitioned) {
            leave();
        }
        else {
            enter();
        }
    }
    async function transition(element, initialClasses, activeClasses, endClasses, hiddenClass, preserveOriginalClass, removeEndClasses) {
        const stashedClasses = [];
        if (preserveOriginalClass) {
            initialClasses.forEach(cls => element.classList.contains(cls) && cls !== hiddenClass && stashedClasses.push(cls));
            activeClasses.forEach(cls => element.classList.contains(cls) && cls !== hiddenClass && stashedClasses.push(cls));
            endClasses.forEach(cls => element.classList.contains(cls) && cls !== hiddenClass && stashedClasses.push(cls));
        }
        addClasses(element, initialClasses);
        removeClasses(element, stashedClasses);
        addClasses(element, activeClasses);
        await nextAnimationFrame();
        removeClasses(element, initialClasses);
        addClasses(element, endClasses);
        await afterTransition(element);
        removeClasses(element, activeClasses);
        if (removeEndClasses) {
            removeClasses(element, endClasses);
        }
        addClasses(element, stashedClasses);
    }
    function initialState() {
        controller.transitioned = transitioned;
        if (transitioned) {
            if (!!hiddenClass) {
                targetElement.classList.remove(hiddenClass);
            }
            enter();
        }
        else {
            if (!!hiddenClass) {
                targetElement.classList.add(hiddenClass);
            }
            leave();
        }
    }
    function addClasses(element, classes) {
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
    }
    function removeClasses(element, classes) {
        if (classes.length > 0) {
            element.classList.remove(...classes);
        }
    }
    initialState();
    Object.assign(controller, { enter, leave, toggleTransition });
    return [enter, leave, toggleTransition];
};
function getAttribute(name, options, dataset) {
    const datasetName = `transition${name[0].toUpperCase()}${name.substr(1)}`;
    const datasetAlpineName = alpineNames[name];
    const classes = options[name] || dataset[datasetName] || dataset[datasetAlpineName] || ' ';
    return isEmpty(classes) ? [] : classes.split(' ');
}
async function afterTransition(element) {
    return new Promise(resolve => {
        const duration = Number(getComputedStyle(element).transitionDuration.split(',')[0].replace('s', '')) * 1000;
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}
async function nextAnimationFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}
function isEmpty(str) {
    return str.length === 0 || !str.trim();
}

class TransitionComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.transitioned = false;
    }
}
class TransitionController extends TransitionComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            useTransition(this, this.options);
        });
    }
}

class UseHotkeys extends StimulusUse {
    constructor(controller, hotkeysOptions) {
        super(controller, hotkeysOptions);
        this.bind = () => {
            for (const [hotkey, definition] of Object.entries(this.hotkeysOptions.hotkeys)) {
                const handler = definition.handler.bind(this.controller);
                (0,hotkeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(hotkey, definition.options, (e) => handler(e, e));
            }
        };
        this.unbind = () => {
            for (const hotkey in this.hotkeysOptions.hotkeys) {
                hotkeys_js__WEBPACK_IMPORTED_MODULE_1__["default"].unbind(hotkey);
            }
        };
        this.controller = controller;
        this.hotkeysOptions = hotkeysOptions;
        this.enhanceController();
        this.bind();
    }
    enhanceController() {
        if (this.hotkeysOptions.filter) {
            hotkeys_js__WEBPACK_IMPORTED_MODULE_1__["default"].filter = this.hotkeysOptions.filter;
        }
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unbind();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const convertSimpleHotkeyDefinition = (definition) => {
    return {
        handler: definition[0],
        options: {
            element: definition[1]
        }
    };
};
const coerceOptions = (options) => {
    if (!options.hotkeys) {
        const hotkeys = {};
        Object.entries(options).forEach(([hotkey, definition]) => {
            Object.defineProperty(hotkeys, hotkey, {
                value: convertSimpleHotkeyDefinition(definition),
                writable: false,
                enumerable: true
            });
        });
        options = {
            hotkeys
        };
    }
    return options;
};
const useHotkeys = (controller, options) => {
    return new UseHotkeys(controller, coerceOptions(options));
};

const defaultOptions = {
    mediaQueries: {},
    dispatchEvent: true,
    eventPrefix: true,
    debug: false
};
class UseMatchMedia extends StimulusUse {
    constructor(controller, options = {}) {
        var _a, _b, _c, _d;
        super(controller, options);
        this.matches = [];
        this.callback = (event) => {
            const name = Object.keys(this.mediaQueries).find(name => this.mediaQueries[name] === event.media);
            if (!name)
                return;
            const { media, matches } = event;
            this.changed({ name, media, matches, event });
        };
        this.changed = (payload) => {
            const { name } = payload;
            if (payload.event) {
                this.call(camelize(`${name}_changed`), payload);
                this.dispatch(`${name}:changed`, payload);
                this.log(`media query "${name}" changed`, payload);
            }
            if (payload.matches) {
                this.call(camelize(`is_${name}`), payload);
                this.dispatch(`is:${name}`, payload);
            }
            else {
                this.call(camelize(`not_${name}`), payload);
                this.dispatch(`not:${name}`, payload);
            }
        };
        this.observe = () => {
            Object.keys(this.mediaQueries).forEach(name => {
                const media = this.mediaQueries[name];
                const match = window.matchMedia(media);
                match.addListener(this.callback);
                this.matches.push(match);
                this.changed({ name, media, matches: match.matches });
            });
        };
        this.unobserve = () => {
            this.matches.forEach(match => match.removeListener(this.callback));
        };
        this.controller = controller;
        this.mediaQueries = (_a = options.mediaQueries) !== null && _a !== void 0 ? _a : defaultOptions.mediaQueries;
        this.dispatchEvent = (_b = options.dispatchEvent) !== null && _b !== void 0 ? _b : defaultOptions.dispatchEvent;
        this.eventPrefix = (_c = options.eventPrefix) !== null && _c !== void 0 ? _c : defaultOptions.eventPrefix;
        this.debug = (_d = options.debug) !== null && _d !== void 0 ? _d : defaultOptions.debug;
        if (!window.matchMedia) {
            console.error('window.matchMedia() is not available');
            return;
        }
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useMatchMedia = (controller, options = {}) => {
    const observer = new UseMatchMedia(controller, options);
    return [observer.observe, observer.unobserve];
};

class UseWindowFocus extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            if (document.hasFocus()) {
                this.becomesFocused();
            }
            else {
                console.log('i should be there');
                this.becomesUnfocused();
            }
            this.interval = setInterval(() => {
                this.handleWindowFocusChange();
            }, this.intervalDuration);
        };
        this.unobserve = () => {
            clearInterval(this.interval);
        };
        this.becomesUnfocused = (event) => {
            this.controller.hasFocus = false;
            this.call('unfocus', event);
            this.log('unfocus', { hasFocus: false });
            this.dispatch('unfocus', { event, hasFocus: false });
        };
        this.becomesFocused = (event) => {
            this.controller.hasFocus = true;
            this.call('focus', event);
            this.log('focus', { hasFocus: true });
            this.dispatch('focus', { event, hasFocus: true });
        };
        this.handleWindowFocusChange = (event) => {
            if (document.hasFocus() && !this.controller.hasFocus) {
                this.becomesFocused(event);
            }
            else if (!document.hasFocus() && this.controller.hasFocus) {
                this.becomesUnfocused(event);
            }
        };
        this.controller = controller;
        this.intervalDuration = options.interval || 200;
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controllerDisconnect;
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useWindowFocus = (controller, options = {}) => {
    const observer = new UseWindowFocus(controller, options);
    return [observer.observe, observer.unobserve];
};

class WindowFocusComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.hasFocus = false;
    }
}
class WindowFocusController extends WindowFocusComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useWindowFocus(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}




/***/ }),

/***/ "./src/js/controllers sync recursive \\.js$":
/*!****************************************!*\
  !*** ./src/js/controllers/ sync \.js$ ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./dropdown-controller.js": "./src/js/controllers/dropdown-controller.js",
	"./stimulus-controller.js": "./src/js/controllers/stimulus-controller.js",
	"./tooltip-controller.js": "./src/js/controllers/tooltip-controller.js",
	"./turbo-progress-bar-controller.js": "./src/js/controllers/turbo-progress-bar-controller.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/js/controllers sync recursive \\.js$";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_app_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/app.css */ "./src/css/app.css");
/* harmony import */ var _signalRTurboStreamElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./signalRTurboStreamElement */ "./src/js/signalRTurboStreamElement.js");
/* harmony import */ var _hotwired_turbo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hotwired/turbo */ "./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js");
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
/* harmony import */ var _hotwired_stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @hotwired/stimulus-webpack-helpers */ "./node_modules/@hotwired/stimulus-webpack-helpers/dist/stimulus-webpack-helpers.js");
/* harmony import */ var stimulus_dropdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stimulus-dropdown */ "./node_modules/stimulus-dropdown/dist/stimulus-dropdown.es.js");




 // Turns Turbo Drive on/off (default on). 
// If off, we must opt-in to Turbo Drive on a per-link and per-form basis using data-turbo="true".

_hotwired_turbo__WEBPACK_IMPORTED_MODULE_2__.session.drive = true;

var application = _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_3__.Application.start();
application.register('dropdown', stimulus_dropdown__WEBPACK_IMPORTED_MODULE_5__["default"]);

var context = __webpack_require__("./src/js/controllers sync recursive \\.js$");

application.load((0,_hotwired_stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_4__.definitionsFromContext)(context)); // Turbo event listeners

document.addEventListener('turbo:load', function (e) {
  console.log('turbo:load', e);
});
document.addEventListener('turbo:visit', function (e) {
  console.log('turbo:visit', e);
});
document.addEventListener('turbo:frame-load', function (e) {
  console.log('turbo:frame-load', e);
});
})();

/******/ })()
;
//# sourceMappingURL=app.js.map