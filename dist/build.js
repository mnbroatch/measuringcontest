/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 72:
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 113:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 159:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 221:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var React = __webpack_require__(540);
function formatProdErrorMessage(code) {
  var url = "https://react.dev/errors/" + code;
  if (1 < arguments.length) {
    url += "?args[]=" + encodeURIComponent(arguments[1]);
    for (var i = 2; i < arguments.length; i++)
      url += "&args[]=" + encodeURIComponent(arguments[i]);
  }
  return (
    "Minified React error #" +
    code +
    "; visit " +
    url +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
function noop() {}
var Internals = {
    d: {
      f: noop,
      r: function () {
        throw Error(formatProdErrorMessage(522));
      },
      D: noop,
      C: noop,
      L: noop,
      m: noop,
      X: noop,
      S: noop,
      M: noop
    },
    p: 0,
    findDOMNode: null
  },
  REACT_PORTAL_TYPE = Symbol.for("react.portal");
function createPortal$1(children, containerInfo, implementation) {
  var key =
    3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: null == key ? null : "" + key,
    children: children,
    containerInfo: containerInfo,
    implementation: implementation
  };
}
var ReactSharedInternals =
  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function getCrossOriginStringAs(as, input) {
  if ("font" === as) return "";
  if ("string" === typeof input)
    return "use-credentials" === input ? input : "";
}
exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
  Internals;
exports.createPortal = function (children, container) {
  var key =
    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (
    !container ||
    (1 !== container.nodeType &&
      9 !== container.nodeType &&
      11 !== container.nodeType)
  )
    throw Error(formatProdErrorMessage(299));
  return createPortal$1(children, container, null, key);
};
exports.flushSync = function (fn) {
  var previousTransition = ReactSharedInternals.T,
    previousUpdatePriority = Internals.p;
  try {
    if (((ReactSharedInternals.T = null), (Internals.p = 2), fn)) return fn();
  } finally {
    (ReactSharedInternals.T = previousTransition),
      (Internals.p = previousUpdatePriority),
      Internals.d.f();
  }
};
exports.preconnect = function (href, options) {
  "string" === typeof href &&
    (options
      ? ((options = options.crossOrigin),
        (options =
          "string" === typeof options
            ? "use-credentials" === options
              ? options
              : ""
            : void 0))
      : (options = null),
    Internals.d.C(href, options));
};
exports.prefetchDNS = function (href) {
  "string" === typeof href && Internals.d.D(href);
};
exports.preinit = function (href, options) {
  if ("string" === typeof href && options && "string" === typeof options.as) {
    var as = options.as,
      crossOrigin = getCrossOriginStringAs(as, options.crossOrigin),
      integrity =
        "string" === typeof options.integrity ? options.integrity : void 0,
      fetchPriority =
        "string" === typeof options.fetchPriority
          ? options.fetchPriority
          : void 0;
    "style" === as
      ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin: crossOrigin,
            integrity: integrity,
            fetchPriority: fetchPriority
          }
        )
      : "script" === as &&
        Internals.d.X(href, {
          crossOrigin: crossOrigin,
          integrity: integrity,
          fetchPriority: fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
  }
};
exports.preinitModule = function (href, options) {
  if ("string" === typeof href)
    if ("object" === typeof options && null !== options) {
      if (null == options.as || "script" === options.as) {
        var crossOrigin = getCrossOriginStringAs(
          options.as,
          options.crossOrigin
        );
        Internals.d.M(href, {
          crossOrigin: crossOrigin,
          integrity:
            "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    } else null == options && Internals.d.M(href);
};
exports.preload = function (href, options) {
  if (
    "string" === typeof href &&
    "object" === typeof options &&
    null !== options &&
    "string" === typeof options.as
  ) {
    var as = options.as,
      crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
    Internals.d.L(href, as, {
      crossOrigin: crossOrigin,
      integrity:
        "string" === typeof options.integrity ? options.integrity : void 0,
      nonce: "string" === typeof options.nonce ? options.nonce : void 0,
      type: "string" === typeof options.type ? options.type : void 0,
      fetchPriority:
        "string" === typeof options.fetchPriority
          ? options.fetchPriority
          : void 0,
      referrerPolicy:
        "string" === typeof options.referrerPolicy
          ? options.referrerPolicy
          : void 0,
      imageSrcSet:
        "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
      imageSizes:
        "string" === typeof options.imageSizes ? options.imageSizes : void 0,
      media: "string" === typeof options.media ? options.media : void 0
    });
  }
};
exports.preloadModule = function (href, options) {
  if ("string" === typeof href)
    if (options) {
      var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
      Internals.d.m(href, {
        as:
          "string" === typeof options.as && "script" !== options.as
            ? options.as
            : void 0,
        crossOrigin: crossOrigin,
        integrity:
          "string" === typeof options.integrity ? options.integrity : void 0
      });
    } else Internals.d.m(href);
};
exports.requestFormReset = function (form) {
  Internals.d.r(form);
};
exports.unstable_batchedUpdates = function (fn, a) {
  return fn(a);
};
exports.useFormState = function (action, initialState, permalink) {
  return ReactSharedInternals.H.useFormState(action, initialState, permalink);
};
exports.useFormStatus = function () {
  return ReactSharedInternals.H.useHostTransitionStatus();
};
exports.version = "19.1.0";


/***/ }),

/***/ 314:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 392:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.content{display:block}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 540:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (true) {
  module.exports = __webpack_require__(869);
} else // removed by dead control flow
{}


/***/ }),

/***/ 601:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 659:
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 825:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 869:
/***/ ((__unused_webpack_module, exports) => {

/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
  REACT_MEMO_TYPE = Symbol.for("react.memo"),
  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
  MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
function getIteratorFn(maybeIterable) {
  if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
  maybeIterable =
    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
    maybeIterable["@@iterator"];
  return "function" === typeof maybeIterable ? maybeIterable : null;
}
var ReactNoopUpdateQueue = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {}
  },
  assign = Object.assign,
  emptyObject = {};
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function (partialState, callback) {
  if (
    "object" !== typeof partialState &&
    "function" !== typeof partialState &&
    null != partialState
  )
    throw Error(
      "takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
};
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = !0;
var isArrayImpl = Array.isArray,
  ReactSharedInternals = { H: null, A: null, T: null, S: null, V: null },
  hasOwnProperty = Object.prototype.hasOwnProperty;
function ReactElement(type, key, self, source, owner, props) {
  self = props.ref;
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: void 0 !== self ? self : null,
    props: props
  };
}
function cloneAndReplaceKey(oldElement, newKey) {
  return ReactElement(
    oldElement.type,
    newKey,
    void 0,
    void 0,
    void 0,
    oldElement.props
  );
}
function isValidElement(object) {
  return (
    "object" === typeof object &&
    null !== object &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
function escape(key) {
  var escaperLookup = { "=": "=0", ":": "=2" };
  return (
    "$" +
    key.replace(/[=:]/g, function (match) {
      return escaperLookup[match];
    })
  );
}
var userProvidedKeyEscapeRegex = /\/+/g;
function getElementKey(element, index) {
  return "object" === typeof element && null !== element && null != element.key
    ? escape("" + element.key)
    : index.toString(36);
}
function noop$1() {}
function resolveThenable(thenable) {
  switch (thenable.status) {
    case "fulfilled":
      return thenable.value;
    case "rejected":
      throw thenable.reason;
    default:
      switch (
        ("string" === typeof thenable.status
          ? thenable.then(noop$1, noop$1)
          : ((thenable.status = "pending"),
            thenable.then(
              function (fulfilledValue) {
                "pending" === thenable.status &&
                  ((thenable.status = "fulfilled"),
                  (thenable.value = fulfilledValue));
              },
              function (error) {
                "pending" === thenable.status &&
                  ((thenable.status = "rejected"), (thenable.reason = error));
              }
            )),
        thenable.status)
      ) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
      }
  }
  throw thenable;
}
function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
  var type = typeof children;
  if ("undefined" === type || "boolean" === type) children = null;
  var invokeCallback = !1;
  if (null === children) invokeCallback = !0;
  else
    switch (type) {
      case "bigint":
      case "string":
      case "number":
        invokeCallback = !0;
        break;
      case "object":
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = !0;
            break;
          case REACT_LAZY_TYPE:
            return (
              (invokeCallback = children._init),
              mapIntoArray(
                invokeCallback(children._payload),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              )
            );
        }
    }
  if (invokeCallback)
    return (
      (callback = callback(children)),
      (invokeCallback =
        "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar),
      isArrayImpl(callback)
        ? ((escapedPrefix = ""),
          null != invokeCallback &&
            (escapedPrefix =
              invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"),
          mapIntoArray(callback, array, escapedPrefix, "", function (c) {
            return c;
          }))
        : null != callback &&
          (isValidElement(callback) &&
            (callback = cloneAndReplaceKey(
              callback,
              escapedPrefix +
                (null == callback.key ||
                (children && children.key === callback.key)
                  ? ""
                  : ("" + callback.key).replace(
                      userProvidedKeyEscapeRegex,
                      "$&/"
                    ) + "/") +
                invokeCallback
            )),
          array.push(callback)),
      1
    );
  invokeCallback = 0;
  var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
  if (isArrayImpl(children))
    for (var i = 0; i < children.length; i++)
      (nameSoFar = children[i]),
        (type = nextNamePrefix + getElementKey(nameSoFar, i)),
        (invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        ));
  else if (((i = getIteratorFn(children)), "function" === typeof i))
    for (
      children = i.call(children), i = 0;
      !(nameSoFar = children.next()).done;

    )
      (nameSoFar = nameSoFar.value),
        (type = nextNamePrefix + getElementKey(nameSoFar, i++)),
        (invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        ));
  else if ("object" === type) {
    if ("function" === typeof children.then)
      return mapIntoArray(
        resolveThenable(children),
        array,
        escapedPrefix,
        nameSoFar,
        callback
      );
    array = String(children);
    throw Error(
      "Objects are not valid as a React child (found: " +
        ("[object Object]" === array
          ? "object with keys {" + Object.keys(children).join(", ") + "}"
          : array) +
        "). If you meant to render a collection of children, use an array instead."
    );
  }
  return invokeCallback;
}
function mapChildren(children, func, context) {
  if (null == children) return children;
  var result = [],
    count = 0;
  mapIntoArray(children, result, "", "", function (child) {
    return func.call(context, child, count++);
  });
  return result;
}
function lazyInitializer(payload) {
  if (-1 === payload._status) {
    var ctor = payload._result;
    ctor = ctor();
    ctor.then(
      function (moduleObject) {
        if (0 === payload._status || -1 === payload._status)
          (payload._status = 1), (payload._result = moduleObject);
      },
      function (error) {
        if (0 === payload._status || -1 === payload._status)
          (payload._status = 2), (payload._result = error);
      }
    );
    -1 === payload._status && ((payload._status = 0), (payload._result = ctor));
  }
  if (1 === payload._status) return payload._result.default;
  throw payload._result;
}
var reportGlobalError =
  "function" === typeof reportError
    ? reportError
    : function (error) {
        if (
          "object" === typeof window &&
          "function" === typeof window.ErrorEvent
        ) {
          var event = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message:
              "object" === typeof error &&
              null !== error &&
              "string" === typeof error.message
                ? String(error.message)
                : String(error),
            error: error
          });
          if (!window.dispatchEvent(event)) return;
        } else if (
          "object" === typeof process &&
          "function" === typeof process.emit
        ) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      };
function noop() {}
exports.Children = {
  map: mapChildren,
  forEach: function (children, forEachFunc, forEachContext) {
    mapChildren(
      children,
      function () {
        forEachFunc.apply(this, arguments);
      },
      forEachContext
    );
  },
  count: function (children) {
    var n = 0;
    mapChildren(children, function () {
      n++;
    });
    return n;
  },
  toArray: function (children) {
    return (
      mapChildren(children, function (child) {
        return child;
      }) || []
    );
  },
  only: function (children) {
    if (!isValidElement(children))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return children;
  }
};
exports.Component = Component;
exports.Fragment = REACT_FRAGMENT_TYPE;
exports.Profiler = REACT_PROFILER_TYPE;
exports.PureComponent = PureComponent;
exports.StrictMode = REACT_STRICT_MODE_TYPE;
exports.Suspense = REACT_SUSPENSE_TYPE;
exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
  ReactSharedInternals;
exports.__COMPILER_RUNTIME = {
  __proto__: null,
  c: function (size) {
    return ReactSharedInternals.H.useMemoCache(size);
  }
};
exports.cache = function (fn) {
  return function () {
    return fn.apply(null, arguments);
  };
};
exports.cloneElement = function (element, config, children) {
  if (null === element || void 0 === element)
    throw Error(
      "The argument must be a React element, but you passed " + element + "."
    );
  var props = assign({}, element.props),
    key = element.key,
    owner = void 0;
  if (null != config)
    for (propName in (void 0 !== config.ref && (owner = void 0),
    void 0 !== config.key && (key = "" + config.key),
    config))
      !hasOwnProperty.call(config, propName) ||
        "key" === propName ||
        "__self" === propName ||
        "__source" === propName ||
        ("ref" === propName && void 0 === config.ref) ||
        (props[propName] = config[propName]);
  var propName = arguments.length - 2;
  if (1 === propName) props.children = children;
  else if (1 < propName) {
    for (var childArray = Array(propName), i = 0; i < propName; i++)
      childArray[i] = arguments[i + 2];
    props.children = childArray;
  }
  return ReactElement(element.type, key, void 0, void 0, owner, props);
};
exports.createContext = function (defaultValue) {
  defaultValue = {
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: null,
    Consumer: null
  };
  defaultValue.Provider = defaultValue;
  defaultValue.Consumer = {
    $$typeof: REACT_CONSUMER_TYPE,
    _context: defaultValue
  };
  return defaultValue;
};
exports.createElement = function (type, config, children) {
  var propName,
    props = {},
    key = null;
  if (null != config)
    for (propName in (void 0 !== config.key && (key = "" + config.key), config))
      hasOwnProperty.call(config, propName) &&
        "key" !== propName &&
        "__self" !== propName &&
        "__source" !== propName &&
        (props[propName] = config[propName]);
  var childrenLength = arguments.length - 2;
  if (1 === childrenLength) props.children = children;
  else if (1 < childrenLength) {
    for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
      childArray[i] = arguments[i + 2];
    props.children = childArray;
  }
  if (type && type.defaultProps)
    for (propName in ((childrenLength = type.defaultProps), childrenLength))
      void 0 === props[propName] &&
        (props[propName] = childrenLength[propName]);
  return ReactElement(type, key, void 0, void 0, null, props);
};
exports.createRef = function () {
  return { current: null };
};
exports.forwardRef = function (render) {
  return { $$typeof: REACT_FORWARD_REF_TYPE, render: render };
};
exports.isValidElement = isValidElement;
exports.lazy = function (ctor) {
  return {
    $$typeof: REACT_LAZY_TYPE,
    _payload: { _status: -1, _result: ctor },
    _init: lazyInitializer
  };
};
exports.memo = function (type, compare) {
  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: void 0 === compare ? null : compare
  };
};
exports.startTransition = function (scope) {
  var prevTransition = ReactSharedInternals.T,
    currentTransition = {};
  ReactSharedInternals.T = currentTransition;
  try {
    var returnValue = scope(),
      onStartTransitionFinish = ReactSharedInternals.S;
    null !== onStartTransitionFinish &&
      onStartTransitionFinish(currentTransition, returnValue);
    "object" === typeof returnValue &&
      null !== returnValue &&
      "function" === typeof returnValue.then &&
      returnValue.then(noop, reportGlobalError);
  } catch (error) {
    reportGlobalError(error);
  } finally {
    ReactSharedInternals.T = prevTransition;
  }
};
exports.unstable_useCacheRefresh = function () {
  return ReactSharedInternals.H.useCacheRefresh();
};
exports.use = function (usable) {
  return ReactSharedInternals.H.use(usable);
};
exports.useActionState = function (action, initialState, permalink) {
  return ReactSharedInternals.H.useActionState(action, initialState, permalink);
};
exports.useCallback = function (callback, deps) {
  return ReactSharedInternals.H.useCallback(callback, deps);
};
exports.useContext = function (Context) {
  return ReactSharedInternals.H.useContext(Context);
};
exports.useDebugValue = function () {};
exports.useDeferredValue = function (value, initialValue) {
  return ReactSharedInternals.H.useDeferredValue(value, initialValue);
};
exports.useEffect = function (create, createDeps, update) {
  var dispatcher = ReactSharedInternals.H;
  if ("function" === typeof update)
    throw Error(
      "useEffect CRUD overload is not enabled in this build of React."
    );
  return dispatcher.useEffect(create, createDeps);
};
exports.useId = function () {
  return ReactSharedInternals.H.useId();
};
exports.useImperativeHandle = function (ref, create, deps) {
  return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
};
exports.useInsertionEffect = function (create, deps) {
  return ReactSharedInternals.H.useInsertionEffect(create, deps);
};
exports.useLayoutEffect = function (create, deps) {
  return ReactSharedInternals.H.useLayoutEffect(create, deps);
};
exports.useMemo = function (create, deps) {
  return ReactSharedInternals.H.useMemo(create, deps);
};
exports.useOptimistic = function (passthrough, reducer) {
  return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
};
exports.useReducer = function (reducer, initialArg, init) {
  return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
};
exports.useRef = function (initialValue) {
  return ReactSharedInternals.H.useRef(initialValue);
};
exports.useState = function (initialState) {
  return ReactSharedInternals.H.useState(initialState);
};
exports.useSyncExternalStore = function (
  subscribe,
  getSnapshot,
  getServerSnapshot
) {
  return ReactSharedInternals.H.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
};
exports.useTransition = function () {
  return ReactSharedInternals.H.useTransition();
};
exports.version = "19.1.0";


/***/ }),

/***/ 961:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) // removed by dead control flow
{}
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(221);
} else // removed by dead control flow
{}


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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(540);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(961);
;// ./node_modules/js-cookie/dist/js.cookie.mjs
/*! js-cookie v3.0.5 | MIT */
/* eslint-disable no-var */
function js_cookie_assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = js_cookie_assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          js_cookie_assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, js_cookie_assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(js_cookie_assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */



;// ./node_modules/@aws-amplify/core/dist/esm/storage/CookieStorage.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class CookieStorage {
    constructor(data = {}) {
        const { path, domain, expires, sameSite, secure } = data;
        this.domain = domain;
        this.path = path || '/';
        this.expires = Object.prototype.hasOwnProperty.call(data, 'expires')
            ? expires
            : 365;
        this.secure = Object.prototype.hasOwnProperty.call(data, 'secure')
            ? secure
            : true;
        if (Object.prototype.hasOwnProperty.call(data, 'sameSite')) {
            if (!sameSite || !['strict', 'lax', 'none'].includes(sameSite)) {
                throw new Error('The sameSite value of cookieStorage must be "lax", "strict" or "none".');
            }
            if (sameSite === 'none' && !this.secure) {
                throw new Error('sameSite = None requires the Secure attribute in latest browser versions.');
            }
            this.sameSite = sameSite;
        }
    }
    async setItem(key, value) {
        api.set(key, value, this.getData());
    }
    async getItem(key) {
        const item = api.get(key);
        return item ?? null;
    }
    async removeItem(key) {
        api.remove(key, this.getData());
    }
    async clear() {
        const cookie = api.get();
        const promises = Object.keys(cookie).map(key => this.removeItem(key));
        await Promise.all(promises);
    }
    getData() {
        return {
            path: this.path,
            expires: this.expires,
            domain: this.domain,
            secure: this.secure,
            ...(this.sameSite && { sameSite: this.sameSite }),
        };
    }
}


//# sourceMappingURL=CookieStorage.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/types/errors.mjs
var AmplifyErrorCode;
(function (AmplifyErrorCode) {
    AmplifyErrorCode["NoEndpointId"] = "NoEndpointId";
    AmplifyErrorCode["PlatformNotSupported"] = "PlatformNotSupported";
    AmplifyErrorCode["Unknown"] = "Unknown";
    AmplifyErrorCode["NetworkError"] = "NetworkError";
})(AmplifyErrorCode || (AmplifyErrorCode = {}));


//# sourceMappingURL=errors.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/errors/AmplifyError.mjs
class AmplifyError extends Error {
    /**
     *  Constructs an AmplifyError.
     *
     * @param message text that describes the main problem.
     * @param underlyingError the underlying cause of the error.
     * @param recoverySuggestion suggestion to recover from the error.
     *
     */
    constructor({ message, name, recoverySuggestion, underlyingError, metadata, }) {
        super(message);
        this.name = name;
        this.underlyingError = underlyingError;
        this.recoverySuggestion = recoverySuggestion;
        if (metadata) {
            // If metadata exists, explicitly only record the following properties.
            const { extendedRequestId, httpStatusCode, requestId } = metadata;
            this.metadata = { extendedRequestId, httpStatusCode, requestId };
        }
        // Hack for making the custom error class work when transpiled to es5
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = AmplifyError;
        Object.setPrototypeOf(this, AmplifyError.prototype);
    }
}


//# sourceMappingURL=AmplifyError.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/errors/PlatformNotSupportedError.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class PlatformNotSupportedError extends AmplifyError {
    constructor() {
        super({
            name: AmplifyErrorCode.PlatformNotSupported,
            message: 'Function not supported on current platform',
        });
    }
}


//# sourceMappingURL=PlatformNotSupportedError.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/storage/KeyValueStorage.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class KeyValueStorage {
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * This is used to set a specific item in storage
     * @param {string} key - the key for the item
     * @param {object} value - the value
     * @returns {string} value that was set
     */
    async setItem(key, value) {
        if (!this.storage)
            throw new PlatformNotSupportedError();
        this.storage.setItem(key, value);
    }
    /**
     * This is used to get a specific key from storage
     * @param {string} key - the key for the item
     * This is used to clear the storage
     * @returns {string} the data item
     */
    async getItem(key) {
        if (!this.storage)
            throw new PlatformNotSupportedError();
        return this.storage.getItem(key);
    }
    /**
     * This is used to remove an item from storage
     * @param {string} key - the key being set
     * @returns {string} value - value that was deleted
     */
    async removeItem(key) {
        if (!this.storage)
            throw new PlatformNotSupportedError();
        this.storage.removeItem(key);
    }
    /**
     * This is used to clear the storage
     * @returns {string} nothing
     */
    async clear() {
        if (!this.storage)
            throw new PlatformNotSupportedError();
        this.storage.clear();
    }
}


//# sourceMappingURL=KeyValueStorage.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/constants.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Logging constants
const AWS_CLOUDWATCH_CATEGORY = 'Logging';
const USER_AGENT_HEADER = 'x-amz-user-agent';
// Error exception code constants
const NO_HUBCALLBACK_PROVIDED_EXCEPTION = 'NoHubcallbackProvidedException';


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Logger/types.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var LogType;
(function (LogType) {
    LogType["DEBUG"] = "DEBUG";
    LogType["ERROR"] = "ERROR";
    LogType["INFO"] = "INFO";
    LogType["WARN"] = "WARN";
    LogType["VERBOSE"] = "VERBOSE";
    LogType["NONE"] = "NONE";
})(LogType || (LogType = {}));


//# sourceMappingURL=types.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Logger/ConsoleLogger.mjs



/* eslint-disable no-console */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const LOG_LEVELS = {
    VERBOSE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
    NONE: 6,
};
/**
 * Write logs
 * @class Logger
 */
class ConsoleLogger {
    /**
     * @constructor
     * @param {string} name - Name of the logger
     */
    constructor(name, level = LogType.WARN) {
        this.name = name;
        this.level = level;
        this._pluggables = [];
    }
    _padding(n) {
        return n < 10 ? '0' + n : '' + n;
    }
    _ts() {
        const dt = new Date();
        return ([this._padding(dt.getMinutes()), this._padding(dt.getSeconds())].join(':') +
            '.' +
            dt.getMilliseconds());
    }
    configure(config) {
        if (!config)
            return this._config;
        this._config = config;
        return this._config;
    }
    /**
     * Write log
     * @method
     * @memeberof Logger
     * @param {LogType|string} type - log type, default INFO
     * @param {string|object} msg - Logging message or object
     */
    _log(type, ...msg) {
        let loggerLevelName = this.level;
        if (ConsoleLogger.LOG_LEVEL) {
            loggerLevelName = ConsoleLogger.LOG_LEVEL;
        }
        if (typeof window !== 'undefined' && window.LOG_LEVEL) {
            loggerLevelName = window.LOG_LEVEL;
        }
        const loggerLevel = LOG_LEVELS[loggerLevelName];
        const typeLevel = LOG_LEVELS[type];
        if (!(typeLevel >= loggerLevel)) {
            // Do nothing if type is not greater than or equal to logger level (handle undefined)
            return;
        }
        let log = console.log.bind(console);
        if (type === LogType.ERROR && console.error) {
            log = console.error.bind(console);
        }
        if (type === LogType.WARN && console.warn) {
            log = console.warn.bind(console);
        }
        if (ConsoleLogger.BIND_ALL_LOG_LEVELS) {
            if (type === LogType.INFO && console.info) {
                log = console.info.bind(console);
            }
            if (type === LogType.DEBUG && console.debug) {
                log = console.debug.bind(console);
            }
        }
        const prefix = `[${type}] ${this._ts()} ${this.name}`;
        let message = '';
        if (msg.length === 1 && typeof msg[0] === 'string') {
            message = `${prefix} - ${msg[0]}`;
            log(message);
        }
        else if (msg.length === 1) {
            message = `${prefix} ${msg[0]}`;
            log(prefix, msg[0]);
        }
        else if (typeof msg[0] === 'string') {
            let obj = msg.slice(1);
            if (obj.length === 1) {
                obj = obj[0];
            }
            message = `${prefix} - ${msg[0]} ${obj}`;
            log(`${prefix} - ${msg[0]}`, obj);
        }
        else {
            message = `${prefix} ${msg}`;
            log(prefix, msg);
        }
        for (const plugin of this._pluggables) {
            const logEvent = { message, timestamp: Date.now() };
            plugin.pushLogs([logEvent]);
        }
    }
    /**
     * Write General log. Default to INFO
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    log(...msg) {
        this._log(LogType.INFO, ...msg);
    }
    /**
     * Write INFO log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    info(...msg) {
        this._log(LogType.INFO, ...msg);
    }
    /**
     * Write WARN log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    warn(...msg) {
        this._log(LogType.WARN, ...msg);
    }
    /**
     * Write ERROR log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    error(...msg) {
        this._log(LogType.ERROR, ...msg);
    }
    /**
     * Write DEBUG log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    debug(...msg) {
        this._log(LogType.DEBUG, ...msg);
    }
    /**
     * Write VERBOSE log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    verbose(...msg) {
        this._log(LogType.VERBOSE, ...msg);
    }
    addPluggable(pluggable) {
        if (pluggable && pluggable.getCategoryName() === AWS_CLOUDWATCH_CATEGORY) {
            this._pluggables.push(pluggable);
            pluggable.configure(this._config);
        }
    }
    listPluggables() {
        return this._pluggables;
    }
}
ConsoleLogger.LOG_LEVEL = null;
ConsoleLogger.BIND_ALL_LOG_LEVELS = false;


//# sourceMappingURL=ConsoleLogger.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/storage/InMemoryStorage.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class InMemoryStorage {
    constructor() {
        this.storage = new Map();
    }
    get length() {
        return this.storage.size;
    }
    key(index) {
        if (index > this.length - 1) {
            return null;
        }
        return Array.from(this.storage.keys())[index];
    }
    setItem(key, value) {
        this.storage.set(key, value);
    }
    getItem(key) {
        return this.storage.get(key) ?? null;
    }
    removeItem(key) {
        this.storage.delete(key);
    }
    clear() {
        this.storage.clear();
    }
}


//# sourceMappingURL=InMemoryStorage.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/storage/utils.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 * @returns Either a reference to window.localStorage or an in-memory storage as fallback
 */
const logger = new ConsoleLogger('CoreStorageUtils');
const getLocalStorageWithFallback = () => {
    try {
        // Attempt to use localStorage directly
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage;
        }
    }
    catch (e) {
        // Handle any errors related to localStorage access
        logger.info('localStorage not found. InMemoryStorage is used as a fallback.');
    }
    // Return in-memory storage as a fallback if localStorage is not accessible
    return new InMemoryStorage();
};
/**
 * @internal
 * @returns Either a reference to window.sessionStorage or an in-memory storage as fallback
 */
const getSessionStorageWithFallback = () => {
    try {
        // Attempt to use sessionStorage directly
        if (typeof window !== 'undefined' && window.sessionStorage) {
            // Verify we can actually use it by testing access
            window.sessionStorage.getItem('test');
            return window.sessionStorage;
        }
        throw new Error('sessionStorage is not defined');
    }
    catch (e) {
        // Handle any errors related to sessionStorage access
        logger.info('sessionStorage not found. InMemoryStorage is used as a fallback.');
        return new InMemoryStorage();
    }
};


//# sourceMappingURL=utils.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/storage/DefaultStorage.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class DefaultStorage extends KeyValueStorage {
    constructor() {
        super(getLocalStorageWithFallback());
    }
}


//# sourceMappingURL=DefaultStorage.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/storage/SessionStorage.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class SessionStorage extends KeyValueStorage {
    constructor() {
        super(getSessionStorageWithFallback());
    }
}


//# sourceMappingURL=SessionStorage.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/storage/SyncKeyValueStorage.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class SyncKeyValueStorage {
    constructor(storage) {
        this._storage = storage;
    }
    get storage() {
        if (!this._storage)
            throw new PlatformNotSupportedError();
        return this._storage;
    }
    /**
     * This is used to set a specific item in storage
     * @param {string} key - the key for the item
     * @param {object} value - the value
     * @returns {string} value that was set
     */
    setItem(key, value) {
        this.storage.setItem(key, value);
    }
    /**
     * This is used to get a specific key from storage
     * @param {string} key - the key for the item
     * This is used to clear the storage
     * @returns {string} the data item
     */
    getItem(key) {
        return this.storage.getItem(key);
    }
    /**
     * This is used to remove an item from storage
     * @param {string} key - the key being set
     * @returns {string} value - value that was deleted
     */
    removeItem(key) {
        this.storage.removeItem(key);
    }
    /**
     * This is used to clear the storage
     * @returns {string} nothing
     */
    clear() {
        this.storage.clear();
    }
}


//# sourceMappingURL=SyncKeyValueStorage.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/storage/SyncSessionStorage.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class SyncSessionStorage extends SyncKeyValueStorage {
    constructor() {
        super(getSessionStorageWithFallback());
    }
}


//# sourceMappingURL=SyncSessionStorage.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/storage/index.mjs







// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const defaultStorage = new DefaultStorage();
const sessionStorage = new SessionStorage();
const syncSessionStorage = new SyncSessionStorage();
const sharedInMemoryStorage = new KeyValueStorage(new InMemoryStorage());


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Hub/index.mjs






// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const AMPLIFY_SYMBOL = (typeof Symbol !== 'undefined'
    ? Symbol('amplify_default')
    : '@@amplify_default');
const Hub_logger = new ConsoleLogger('Hub');
class HubClass {
    constructor(name) {
        this.listeners = new Map();
        this.protectedChannels = [
            'core',
            'auth',
            'api',
            'analytics',
            'interactions',
            'pubsub',
            'storage',
            'ui',
            'xr',
        ];
        this.name = name;
    }
    /**
     * Used internally to remove a Hub listener.
     *
     * @remarks
     * This private method is for internal use only. Instead of calling Hub.remove, call the result of Hub.listen.
     */
    _remove(channel, listener) {
        const holder = this.listeners.get(channel);
        if (!holder) {
            Hub_logger.warn(`No listeners for ${channel}`);
            return;
        }
        this.listeners.set(channel, [
            ...holder.filter(({ callback }) => callback !== listener),
        ]);
    }
    dispatch(channel, payload, source, ampSymbol) {
        if (typeof channel === 'string' &&
            this.protectedChannels.indexOf(channel) > -1) {
            const hasAccess = ampSymbol === AMPLIFY_SYMBOL;
            if (!hasAccess) {
                Hub_logger.warn(`WARNING: ${channel} is protected and dispatching on it can have unintended consequences`);
            }
        }
        const capsule = {
            channel,
            payload: { ...payload },
            source,
            patternInfo: [],
        };
        try {
            this._toListeners(capsule);
        }
        catch (e) {
            Hub_logger.error(e);
        }
    }
    listen(channel, callback, listenerName = 'noname') {
        let cb;
        if (typeof callback !== 'function') {
            throw new AmplifyError({
                name: NO_HUBCALLBACK_PROVIDED_EXCEPTION,
                message: 'No callback supplied to Hub',
            });
        }
        else {
            // Needs to be casted as a more generic type
            cb = callback;
        }
        let holder = this.listeners.get(channel);
        if (!holder) {
            holder = [];
            this.listeners.set(channel, holder);
        }
        holder.push({
            name: listenerName,
            callback: cb,
        });
        return () => {
            this._remove(channel, cb);
        };
    }
    _toListeners(capsule) {
        const { channel, payload } = capsule;
        const holder = this.listeners.get(channel);
        if (holder) {
            holder.forEach(listener => {
                Hub_logger.debug(`Dispatching to ${channel} with `, payload);
                try {
                    listener.callback(capsule);
                }
                catch (e) {
                    Hub_logger.error(e);
                }
            });
        }
    }
}
/* We export a __default__ instance of HubClass to use it as a
pseudo Singleton for the main messaging bus, however you can still create
your own instance of HubClass() for a separate "private bus" of events. */
const Hub = new HubClass('__default__');
/**
 * @internal
 *
 * Internal hub used for core Amplify functionality. Not intended for use outside of Amplify.
 *
 */
const HubInternal = new HubClass('internal-hub');


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/deepFreeze.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const deepFreeze = (object) => {
    const propNames = Reflect.ownKeys(object);
    for (const name of propNames) {
        const value = object[name];
        if ((value && typeof value === 'object') || typeof value === 'function') {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
};


//# sourceMappingURL=deepFreeze.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/singleton/constants.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const ADD_OAUTH_LISTENER = Symbol('oauth-listener');


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/parseAWSExports.mjs





// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const parseAWSExports_logger = new ConsoleLogger('parseAWSExports');
const authTypeMapping = {
    API_KEY: 'apiKey',
    AWS_IAM: 'iam',
    AMAZON_COGNITO_USER_POOLS: 'userPool',
    OPENID_CONNECT: 'oidc',
    NONE: 'none',
    AWS_LAMBDA: 'lambda',
    // `LAMBDA` is an incorrect value that was added during the v6 rewrite.
    // Keeping it as a valid value until v7 to prevent breaking customers who might
    // be relying on it as a workaround.
    // ref: https://github.com/aws-amplify/amplify-js/pull/12922
    // TODO: @v7 remove next line
    LAMBDA: 'lambda',
};
/**
 * Converts the object imported from `aws-exports.js` or `amplifyconfiguration.json` files generated by
 * the Amplify CLI into an object that conforms to the {@link ResourcesConfig}.
 *
 * @param config A configuration object imported  from `aws-exports.js` or `amplifyconfiguration.json`.
 *
 * @returns An object that conforms to the {@link ResourcesConfig} .
 */
const parseAWSExports = (config = {}) => {
    if (!Object.prototype.hasOwnProperty.call(config, 'aws_project_region')) {
        throw new AmplifyError({
            name: 'InvalidParameterException',
            message: 'Invalid config parameter.',
            recoverySuggestion: 'Ensure passing the config object imported from  `amplifyconfiguration.json`.',
        });
    }
    const { aws_appsync_apiKey, aws_appsync_authenticationType, aws_appsync_graphqlEndpoint, aws_appsync_region, aws_bots_config, aws_cognito_identity_pool_id, aws_cognito_sign_up_verification_method, aws_cognito_mfa_configuration, aws_cognito_mfa_types, aws_cognito_password_protection_settings, aws_cognito_verification_mechanisms, aws_cognito_signup_attributes, aws_cognito_social_providers, aws_cognito_username_attributes, aws_mandatory_sign_in, aws_mobile_analytics_app_id, aws_mobile_analytics_app_region, aws_user_files_s3_bucket, aws_user_files_s3_bucket_region, aws_user_files_s3_dangerously_connect_to_http_endpoint_for_testing, aws_user_pools_id, aws_user_pools_web_client_id, geo, oauth, predictions, aws_cloud_logic_custom, Notifications, modelIntrospection, } = config;
    const amplifyConfig = {};
    // Analytics
    if (aws_mobile_analytics_app_id) {
        amplifyConfig.Analytics = {
            Pinpoint: {
                appId: aws_mobile_analytics_app_id,
                region: aws_mobile_analytics_app_region,
            },
        };
    }
    // Notifications
    const { InAppMessaging, Push } = Notifications ?? {};
    if (InAppMessaging?.AWSPinpoint || Push?.AWSPinpoint) {
        if (InAppMessaging?.AWSPinpoint) {
            const { appId, region } = InAppMessaging.AWSPinpoint;
            amplifyConfig.Notifications = {
                InAppMessaging: {
                    Pinpoint: {
                        appId,
                        region,
                    },
                },
            };
        }
        if (Push?.AWSPinpoint) {
            const { appId, region } = Push.AWSPinpoint;
            amplifyConfig.Notifications = {
                ...amplifyConfig.Notifications,
                PushNotification: {
                    Pinpoint: {
                        appId,
                        region,
                    },
                },
            };
        }
    }
    // Interactions
    if (Array.isArray(aws_bots_config)) {
        amplifyConfig.Interactions = {
            LexV1: Object.fromEntries(aws_bots_config.map(bot => [bot.name, bot])),
        };
    }
    // API
    if (aws_appsync_graphqlEndpoint) {
        const defaultAuthMode = authTypeMapping[aws_appsync_authenticationType];
        if (!defaultAuthMode) {
            parseAWSExports_logger.debug(`Invalid authentication type ${aws_appsync_authenticationType}. Falling back to IAM.`);
        }
        amplifyConfig.API = {
            GraphQL: {
                endpoint: aws_appsync_graphqlEndpoint,
                apiKey: aws_appsync_apiKey,
                region: aws_appsync_region,
                defaultAuthMode: defaultAuthMode ?? 'iam',
            },
        };
        if (modelIntrospection) {
            amplifyConfig.API.GraphQL.modelIntrospection = modelIntrospection;
        }
    }
    // Auth
    const mfaConfig = aws_cognito_mfa_configuration
        ? {
            status: aws_cognito_mfa_configuration &&
                aws_cognito_mfa_configuration.toLowerCase(),
            totpEnabled: aws_cognito_mfa_types?.includes('TOTP') ?? false,
            smsEnabled: aws_cognito_mfa_types?.includes('SMS') ?? false,
        }
        : undefined;
    const passwordFormatConfig = aws_cognito_password_protection_settings
        ? {
            minLength: aws_cognito_password_protection_settings.passwordPolicyMinLength,
            requireLowercase: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes('REQUIRES_LOWERCASE') ?? false,
            requireUppercase: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes('REQUIRES_UPPERCASE') ?? false,
            requireNumbers: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes('REQUIRES_NUMBERS') ?? false,
            requireSpecialCharacters: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes('REQUIRES_SYMBOLS') ?? false,
        }
        : undefined;
    const mergedUserAttributes = Array.from(new Set([
        ...(aws_cognito_verification_mechanisms ?? []),
        ...(aws_cognito_signup_attributes ?? []),
    ]));
    const userAttributes = mergedUserAttributes.reduce((attributes, key) => ({
        ...attributes,
        // All user attributes generated by the CLI are required
        [key.toLowerCase()]: { required: true },
    }), {});
    const loginWithEmailEnabled = aws_cognito_username_attributes?.includes('EMAIL') ?? false;
    const loginWithPhoneEnabled = aws_cognito_username_attributes?.includes('PHONE_NUMBER') ?? false;
    if (aws_cognito_identity_pool_id || aws_user_pools_id) {
        amplifyConfig.Auth = {
            Cognito: {
                identityPoolId: aws_cognito_identity_pool_id,
                allowGuestAccess: aws_mandatory_sign_in !== 'enable',
                signUpVerificationMethod: aws_cognito_sign_up_verification_method,
                userAttributes,
                userPoolClientId: aws_user_pools_web_client_id,
                userPoolId: aws_user_pools_id,
                mfa: mfaConfig,
                passwordFormat: passwordFormatConfig,
                loginWith: {
                    username: !(loginWithEmailEnabled || loginWithPhoneEnabled),
                    email: loginWithEmailEnabled,
                    phone: loginWithPhoneEnabled,
                },
            },
        };
    }
    const hasOAuthConfig = oauth ? Object.keys(oauth).length > 0 : false;
    const hasSocialProviderConfig = aws_cognito_social_providers
        ? aws_cognito_social_providers.length > 0
        : false;
    if (amplifyConfig.Auth && hasOAuthConfig) {
        amplifyConfig.Auth.Cognito.loginWith = {
            ...amplifyConfig.Auth.Cognito.loginWith,
            oauth: {
                ...getOAuthConfig(oauth),
                ...(hasSocialProviderConfig && {
                    providers: parseSocialProviders(aws_cognito_social_providers),
                }),
            },
        };
    }
    // Storage
    if (aws_user_files_s3_bucket) {
        amplifyConfig.Storage = {
            S3: {
                bucket: aws_user_files_s3_bucket,
                region: aws_user_files_s3_bucket_region,
                dangerouslyConnectToHttpEndpointForTesting: aws_user_files_s3_dangerously_connect_to_http_endpoint_for_testing,
            },
        };
    }
    // Geo
    if (geo) {
        const { amazon_location_service } = geo;
        amplifyConfig.Geo = {
            LocationService: {
                maps: amazon_location_service.maps,
                geofenceCollections: amazon_location_service.geofenceCollections,
                searchIndices: amazon_location_service.search_indices,
                region: amazon_location_service.region,
            },
        };
    }
    // REST API
    if (aws_cloud_logic_custom) {
        amplifyConfig.API = {
            ...amplifyConfig.API,
            REST: aws_cloud_logic_custom.reduce((acc, api) => {
                const { name, endpoint, region, service } = api;
                return {
                    ...acc,
                    [name]: {
                        endpoint,
                        ...(service ? { service } : undefined),
                        ...(region ? { region } : undefined),
                    },
                };
            }, {}),
        };
    }
    // Predictions
    if (predictions) {
        // map VoiceId from speechGenerator defaults to voiceId
        const { VoiceId: voiceId } = predictions?.convert?.speechGenerator?.defaults ?? {};
        amplifyConfig.Predictions = voiceId
            ? {
                ...predictions,
                convert: {
                    ...predictions.convert,
                    speechGenerator: {
                        ...predictions.convert.speechGenerator,
                        defaults: { voiceId },
                    },
                },
            }
            : predictions;
    }
    return amplifyConfig;
};
const getRedirectUrl = (redirectStr) => redirectStr?.split(',') ?? [];
const getOAuthConfig = ({ domain, scope, redirectSignIn, redirectSignOut, responseType, }) => ({
    domain,
    scopes: scope,
    redirectSignIn: getRedirectUrl(redirectSignIn),
    redirectSignOut: getRedirectUrl(redirectSignOut),
    responseType,
});
const parseSocialProviders = (aws_cognito_social_providers) => {
    return aws_cognito_social_providers.map((provider) => {
        const updatedProvider = provider.toLowerCase();
        return updatedProvider.charAt(0).toUpperCase() + updatedProvider.slice(1);
    });
};


//# sourceMappingURL=parseAWSExports.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/parseAmplifyOutputs.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function isAmplifyOutputs(config) {
    // version format initially will be '1' but is expected to be something like x.y where x is major and y minor version
    const { version } = config;
    if (!version) {
        return false;
    }
    return version.startsWith('1');
}
function parseStorage(amplifyOutputsStorageProperties) {
    if (!amplifyOutputsStorageProperties) {
        return undefined;
    }
    const { bucket_name, aws_region, buckets } = amplifyOutputsStorageProperties;
    return {
        S3: {
            bucket: bucket_name,
            region: aws_region,
            buckets: buckets && createBucketInfoMap(buckets),
        },
    };
}
function parseAuth(amplifyOutputsAuthProperties) {
    if (!amplifyOutputsAuthProperties) {
        return undefined;
    }
    const { user_pool_id, user_pool_client_id, identity_pool_id, password_policy, mfa_configuration, mfa_methods, unauthenticated_identities_enabled, oauth, username_attributes, standard_required_attributes, groups, } = amplifyOutputsAuthProperties;
    const authConfig = {
        Cognito: {
            userPoolId: user_pool_id,
            userPoolClientId: user_pool_client_id,
            groups,
        },
    };
    if (identity_pool_id) {
        authConfig.Cognito = {
            ...authConfig.Cognito,
            identityPoolId: identity_pool_id,
        };
    }
    if (password_policy) {
        authConfig.Cognito.passwordFormat = {
            requireLowercase: password_policy.require_lowercase,
            requireNumbers: password_policy.require_numbers,
            requireUppercase: password_policy.require_uppercase,
            requireSpecialCharacters: password_policy.require_symbols,
            minLength: password_policy.min_length ?? 6,
        };
    }
    if (mfa_configuration) {
        authConfig.Cognito.mfa = {
            status: getMfaStatus(mfa_configuration),
            smsEnabled: mfa_methods?.includes('SMS'),
            totpEnabled: mfa_methods?.includes('TOTP'),
        };
    }
    if (unauthenticated_identities_enabled) {
        authConfig.Cognito.allowGuestAccess = unauthenticated_identities_enabled;
    }
    if (oauth) {
        authConfig.Cognito.loginWith = {
            oauth: {
                domain: oauth.domain,
                redirectSignIn: oauth.redirect_sign_in_uri,
                redirectSignOut: oauth.redirect_sign_out_uri,
                responseType: oauth.response_type === 'token' ? 'token' : 'code',
                scopes: oauth.scopes,
                providers: getOAuthProviders(oauth.identity_providers),
            },
        };
    }
    if (username_attributes) {
        authConfig.Cognito.loginWith = {
            ...authConfig.Cognito.loginWith,
            email: username_attributes.includes('email'),
            phone: username_attributes.includes('phone_number'),
            // Signing in with a username is not currently supported in Gen2, this should always evaluate to false
            username: username_attributes.includes('username'),
        };
    }
    if (standard_required_attributes) {
        authConfig.Cognito.userAttributes = standard_required_attributes.reduce((acc, curr) => ({ ...acc, [curr]: { required: true } }), {});
    }
    return authConfig;
}
function parseAnalytics(amplifyOutputsAnalyticsProperties) {
    if (!amplifyOutputsAnalyticsProperties?.amazon_pinpoint) {
        return undefined;
    }
    const { amazon_pinpoint } = amplifyOutputsAnalyticsProperties;
    return {
        Pinpoint: {
            appId: amazon_pinpoint.app_id,
            region: amazon_pinpoint.aws_region,
        },
    };
}
function parseGeo(amplifyOutputsAnalyticsProperties) {
    if (!amplifyOutputsAnalyticsProperties) {
        return undefined;
    }
    const { aws_region, geofence_collections, maps, search_indices } = amplifyOutputsAnalyticsProperties;
    return {
        LocationService: {
            region: aws_region,
            searchIndices: search_indices,
            geofenceCollections: geofence_collections,
            maps,
        },
    };
}
function parseData(amplifyOutputsDataProperties) {
    if (!amplifyOutputsDataProperties) {
        return undefined;
    }
    const { aws_region, default_authorization_type, url, api_key, model_introspection, } = amplifyOutputsDataProperties;
    const GraphQL = {
        endpoint: url,
        defaultAuthMode: getGraphQLAuthMode(default_authorization_type),
        region: aws_region,
        apiKey: api_key,
        modelIntrospection: model_introspection,
    };
    return {
        GraphQL,
    };
}
function parseCustom(amplifyOutputsCustomProperties) {
    if (!amplifyOutputsCustomProperties?.events) {
        return undefined;
    }
    const { url, aws_region, api_key, default_authorization_type } = amplifyOutputsCustomProperties.events;
    const Events = {
        endpoint: url,
        defaultAuthMode: getGraphQLAuthMode(default_authorization_type),
        region: aws_region,
        apiKey: api_key,
    };
    return {
        Events,
    };
}
function parseNotifications(amplifyOutputsNotificationsProperties) {
    if (!amplifyOutputsNotificationsProperties) {
        return undefined;
    }
    const { aws_region, channels, amazon_pinpoint_app_id } = amplifyOutputsNotificationsProperties;
    const hasInAppMessaging = channels.includes('IN_APP_MESSAGING');
    const hasPushNotification = channels.includes('APNS') || channels.includes('FCM');
    if (!(hasInAppMessaging || hasPushNotification)) {
        return undefined;
    }
    // At this point, we know the Amplify outputs contains at least one supported channel
    const notificationsConfig = {};
    if (hasInAppMessaging) {
        notificationsConfig.InAppMessaging = {
            Pinpoint: {
                appId: amazon_pinpoint_app_id,
                region: aws_region,
            },
        };
    }
    if (hasPushNotification) {
        notificationsConfig.PushNotification = {
            Pinpoint: {
                appId: amazon_pinpoint_app_id,
                region: aws_region,
            },
        };
    }
    return notificationsConfig;
}
function parseAmplifyOutputs(amplifyOutputs) {
    const resourcesConfig = {};
    if (amplifyOutputs.storage) {
        resourcesConfig.Storage = parseStorage(amplifyOutputs.storage);
    }
    if (amplifyOutputs.auth) {
        resourcesConfig.Auth = parseAuth(amplifyOutputs.auth);
    }
    if (amplifyOutputs.analytics) {
        resourcesConfig.Analytics = parseAnalytics(amplifyOutputs.analytics);
    }
    if (amplifyOutputs.geo) {
        resourcesConfig.Geo = parseGeo(amplifyOutputs.geo);
    }
    if (amplifyOutputs.data) {
        resourcesConfig.API = parseData(amplifyOutputs.data);
    }
    if (amplifyOutputs.custom) {
        const customConfig = parseCustom(amplifyOutputs.custom);
        if (customConfig && 'Events' in customConfig) {
            resourcesConfig.API = { ...resourcesConfig.API, ...customConfig };
        }
    }
    if (amplifyOutputs.notifications) {
        resourcesConfig.Notifications = parseNotifications(amplifyOutputs.notifications);
    }
    return resourcesConfig;
}
const authModeNames = {
    AMAZON_COGNITO_USER_POOLS: 'userPool',
    API_KEY: 'apiKey',
    AWS_IAM: 'iam',
    AWS_LAMBDA: 'lambda',
    OPENID_CONNECT: 'oidc',
};
function getGraphQLAuthMode(authType) {
    return authModeNames[authType];
}
const providerNames = {
    GOOGLE: 'Google',
    LOGIN_WITH_AMAZON: 'Amazon',
    FACEBOOK: 'Facebook',
    SIGN_IN_WITH_APPLE: 'Apple',
};
function getOAuthProviders(providers = []) {
    return providers.reduce((oAuthProviders, provider) => {
        if (providerNames[provider] !== undefined) {
            oAuthProviders.push(providerNames[provider]);
        }
        return oAuthProviders;
    }, []);
}
function getMfaStatus(mfaConfiguration) {
    if (mfaConfiguration === 'OPTIONAL')
        return 'optional';
    if (mfaConfiguration === 'REQUIRED')
        return 'on';
    return 'off';
}
function createBucketInfoMap(buckets) {
    const mappedBuckets = {};
    buckets.forEach(({ name, bucket_name: bucketName, aws_region: region, paths }) => {
        if (name in mappedBuckets) {
            throw new Error(`Duplicate friendly name found: ${name}. Name must be unique.`);
        }
        const sanitizedPaths = paths
            ? Object.entries(paths).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {})
            : undefined;
        mappedBuckets[name] = {
            bucketName,
            region,
            paths: sanitizedPaths,
        };
    });
    return mappedBuckets;
}


//# sourceMappingURL=parseAmplifyOutputs.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/parseAmplifyConfig.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Parses the variety of configuration shapes that Amplify can accept into a ResourcesConfig.
 *
 * @param amplifyConfig An Amplify configuration object conforming to one of the supported schemas.
 * @return A ResourcesConfig for the provided configuration object.
 */
const parseAmplifyConfig = (amplifyConfig) => {
    if (Object.keys(amplifyConfig).some(key => key.startsWith('aws_'))) {
        return parseAWSExports(amplifyConfig);
    }
    else if (isAmplifyOutputs(amplifyConfig)) {
        return parseAmplifyOutputs(amplifyConfig);
    }
    else {
        return amplifyConfig;
    }
};


//# sourceMappingURL=parseAmplifyConfig.mjs.map

;// ./node_modules/tslib/tslib.es6.mjs
/******************************************************************************
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

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

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

/* harmony default export */ const tslib_es6 = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
});

;// ./node_modules/@aws-crypto/sha256-js/build/module/constants.js
/**
 * @internal
 */
var BLOCK_SIZE = 64;
/**
 * @internal
 */
var DIGEST_LENGTH = 32;
/**
 * @internal
 */
var KEY = new Uint32Array([
    0x428a2f98,
    0x71374491,
    0xb5c0fbcf,
    0xe9b5dba5,
    0x3956c25b,
    0x59f111f1,
    0x923f82a4,
    0xab1c5ed5,
    0xd807aa98,
    0x12835b01,
    0x243185be,
    0x550c7dc3,
    0x72be5d74,
    0x80deb1fe,
    0x9bdc06a7,
    0xc19bf174,
    0xe49b69c1,
    0xefbe4786,
    0x0fc19dc6,
    0x240ca1cc,
    0x2de92c6f,
    0x4a7484aa,
    0x5cb0a9dc,
    0x76f988da,
    0x983e5152,
    0xa831c66d,
    0xb00327c8,
    0xbf597fc7,
    0xc6e00bf3,
    0xd5a79147,
    0x06ca6351,
    0x14292967,
    0x27b70a85,
    0x2e1b2138,
    0x4d2c6dfc,
    0x53380d13,
    0x650a7354,
    0x766a0abb,
    0x81c2c92e,
    0x92722c85,
    0xa2bfe8a1,
    0xa81a664b,
    0xc24b8b70,
    0xc76c51a3,
    0xd192e819,
    0xd6990624,
    0xf40e3585,
    0x106aa070,
    0x19a4c116,
    0x1e376c08,
    0x2748774c,
    0x34b0bcb5,
    0x391c0cb3,
    0x4ed8aa4a,
    0x5b9cca4f,
    0x682e6ff3,
    0x748f82ee,
    0x78a5636f,
    0x84c87814,
    0x8cc70208,
    0x90befffa,
    0xa4506ceb,
    0xbef9a3f7,
    0xc67178f2
]);
/**
 * @internal
 */
var INIT = [
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
];
/**
 * @internal
 */
var MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1;
//# sourceMappingURL=constants.js.map
;// ./node_modules/@aws-crypto/sha256-js/build/module/RawSha256.js

/**
 * @internal
 */
var RawSha256 = /** @class */ (function () {
    function RawSha256() {
        this.state = Int32Array.from(INIT);
        this.temp = new Int32Array(64);
        this.buffer = new Uint8Array(64);
        this.bufferLength = 0;
        this.bytesHashed = 0;
        /**
         * @internal
         */
        this.finished = false;
    }
    RawSha256.prototype.update = function (data) {
        if (this.finished) {
            throw new Error("Attempted to update an already finished hash.");
        }
        var position = 0;
        var byteLength = data.byteLength;
        this.bytesHashed += byteLength;
        if (this.bytesHashed * 8 > MAX_HASHABLE_LENGTH) {
            throw new Error("Cannot hash more than 2^53 - 1 bits");
        }
        while (byteLength > 0) {
            this.buffer[this.bufferLength++] = data[position++];
            byteLength--;
            if (this.bufferLength === BLOCK_SIZE) {
                this.hashBuffer();
                this.bufferLength = 0;
            }
        }
    };
    RawSha256.prototype.digest = function () {
        if (!this.finished) {
            var bitsHashed = this.bytesHashed * 8;
            var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
            var undecoratedLength = this.bufferLength;
            bufferView.setUint8(this.bufferLength++, 0x80);
            // Ensure the final block has enough room for the hashed length
            if (undecoratedLength % BLOCK_SIZE >= BLOCK_SIZE - 8) {
                for (var i = this.bufferLength; i < BLOCK_SIZE; i++) {
                    bufferView.setUint8(i, 0);
                }
                this.hashBuffer();
                this.bufferLength = 0;
            }
            for (var i = this.bufferLength; i < BLOCK_SIZE - 8; i++) {
                bufferView.setUint8(i, 0);
            }
            bufferView.setUint32(BLOCK_SIZE - 8, Math.floor(bitsHashed / 0x100000000), true);
            bufferView.setUint32(BLOCK_SIZE - 4, bitsHashed);
            this.hashBuffer();
            this.finished = true;
        }
        // The value in state is little-endian rather than big-endian, so flip
        // each word into a new Uint8Array
        var out = new Uint8Array(DIGEST_LENGTH);
        for (var i = 0; i < 8; i++) {
            out[i * 4] = (this.state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this.state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this.state[i] >>> 8) & 0xff;
            out[i * 4 + 3] = (this.state[i] >>> 0) & 0xff;
        }
        return out;
    };
    RawSha256.prototype.hashBuffer = function () {
        var _a = this, buffer = _a.buffer, state = _a.state;
        var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
        for (var i = 0; i < BLOCK_SIZE; i++) {
            if (i < 16) {
                this.temp[i] =
                    ((buffer[i * 4] & 0xff) << 24) |
                        ((buffer[i * 4 + 1] & 0xff) << 16) |
                        ((buffer[i * 4 + 2] & 0xff) << 8) |
                        (buffer[i * 4 + 3] & 0xff);
            }
            else {
                var u = this.temp[i - 2];
                var t1_1 = ((u >>> 17) | (u << 15)) ^ ((u >>> 19) | (u << 13)) ^ (u >>> 10);
                u = this.temp[i - 15];
                var t2_1 = ((u >>> 7) | (u << 25)) ^ ((u >>> 18) | (u << 14)) ^ (u >>> 3);
                this.temp[i] =
                    ((t1_1 + this.temp[i - 7]) | 0) + ((t2_1 + this.temp[i - 16]) | 0);
            }
            var t1 = ((((((state4 >>> 6) | (state4 << 26)) ^
                ((state4 >>> 11) | (state4 << 21)) ^
                ((state4 >>> 25) | (state4 << 7))) +
                ((state4 & state5) ^ (~state4 & state6))) |
                0) +
                ((state7 + ((KEY[i] + this.temp[i]) | 0)) | 0)) |
                0;
            var t2 = ((((state0 >>> 2) | (state0 << 30)) ^
                ((state0 >>> 13) | (state0 << 19)) ^
                ((state0 >>> 22) | (state0 << 10))) +
                ((state0 & state1) ^ (state0 & state2) ^ (state1 & state2))) |
                0;
            state7 = state6;
            state6 = state5;
            state5 = state4;
            state4 = (state3 + t1) | 0;
            state3 = state2;
            state2 = state1;
            state1 = state0;
            state0 = (t1 + t2) | 0;
        }
        state[0] += state0;
        state[1] += state1;
        state[2] += state2;
        state[3] += state3;
        state[4] += state4;
        state[5] += state5;
        state[6] += state6;
        state[7] += state7;
    };
    return RawSha256;
}());

//# sourceMappingURL=RawSha256.js.map
;// ./node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
const fromUtf8 = (input) => new TextEncoder().encode(input);

;// ./node_modules/@aws-crypto/util/build/module/convertToBuffer.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Quick polyfill
var convertToBuffer_fromUtf8 = typeof Buffer !== "undefined" && Buffer.from
    ? function (input) { return Buffer.from(input, "utf8"); }
    : fromUtf8;
function convertToBuffer(data) {
    // Already a Uint8, do nothing
    if (data instanceof Uint8Array)
        return data;
    if (typeof data === "string") {
        return convertToBuffer_fromUtf8(data);
    }
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    }
    return new Uint8Array(data);
}
//# sourceMappingURL=convertToBuffer.js.map
;// ./node_modules/@aws-crypto/util/build/module/isEmptyData.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function isEmptyData(data) {
    if (typeof data === "string") {
        return data.length === 0;
    }
    return data.byteLength === 0;
}
//# sourceMappingURL=isEmptyData.js.map
;// ./node_modules/@aws-crypto/util/build/module/index.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0




//# sourceMappingURL=index.js.map
;// ./node_modules/@aws-crypto/sha256-js/build/module/jsSha256.js




var Sha256 = /** @class */ (function () {
    function Sha256(secret) {
        this.secret = secret;
        this.hash = new RawSha256();
        this.reset();
    }
    Sha256.prototype.update = function (toHash) {
        if (isEmptyData(toHash) || this.error) {
            return;
        }
        try {
            this.hash.update(convertToBuffer(toHash));
        }
        catch (e) {
            this.error = e;
        }
    };
    /* This synchronous method keeps compatibility
     * with the v2 aws-sdk.
     */
    Sha256.prototype.digestSync = function () {
        if (this.error) {
            throw this.error;
        }
        if (this.outer) {
            if (!this.outer.finished) {
                this.outer.update(this.hash.digest());
            }
            return this.outer.digest();
        }
        return this.hash.digest();
    };
    /* The underlying digest method here is synchronous.
     * To keep the same interface with the other hash functions
     * the default is to expose this as an async method.
     * However, it can sometimes be useful to have a sync method.
     */
    Sha256.prototype.digest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.digestSync()];
            });
        });
    };
    Sha256.prototype.reset = function () {
        this.hash = new RawSha256();
        if (this.secret) {
            this.outer = new RawSha256();
            var inner = bufferFromSecret(this.secret);
            var outer = new Uint8Array(BLOCK_SIZE);
            outer.set(inner);
            for (var i = 0; i < BLOCK_SIZE; i++) {
                inner[i] ^= 0x36;
                outer[i] ^= 0x5c;
            }
            this.hash.update(inner);
            this.outer.update(outer);
            // overwrite the copied key in memory
            for (var i = 0; i < inner.byteLength; i++) {
                inner[i] = 0;
            }
        }
    };
    return Sha256;
}());

function bufferFromSecret(secret) {
    var input = convertToBuffer(secret);
    if (input.byteLength > BLOCK_SIZE) {
        var bufferHash = new RawSha256();
        bufferHash.update(input);
        input = bufferHash.digest();
    }
    var buffer = new Uint8Array(BLOCK_SIZE);
    buffer.set(input);
    return buffer;
}
//# sourceMappingURL=jsSha256.js.map
;// ./node_modules/@aws-crypto/sha256-js/build/module/index.js

//# sourceMappingURL=index.js.map
;// ./node_modules/@smithy/util-hex-encoding/dist-es/index.js
const SHORT_TO_HEX = {};
const HEX_TO_SHORT = {};
for (let i = 0; i < 256; i++) {
    let encodedByte = i.toString(16).toLowerCase();
    if (encodedByte.length === 1) {
        encodedByte = `0${encodedByte}`;
    }
    SHORT_TO_HEX[i] = encodedByte;
    HEX_TO_SHORT[encodedByte] = i;
}
function fromHex(encoded) {
    if (encoded.length % 2 !== 0) {
        throw new Error("Hex encoded strings must have an even number length");
    }
    const out = new Uint8Array(encoded.length / 2);
    for (let i = 0; i < encoded.length; i += 2) {
        const encodedByte = encoded.slice(i, i + 2).toLowerCase();
        if (encodedByte in HEX_TO_SHORT) {
            out[i / 2] = HEX_TO_SHORT[encodedByte];
        }
        else {
            throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
        }
    }
    return out;
}
function toHex(bytes) {
    let out = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        out += SHORT_TO_HEX[bytes[i]];
    }
    return out;
}

;// ./node_modules/@aws-amplify/core/dist/esm/singleton/Auth/index.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const Auth_logger = new ConsoleLogger('Auth');
class AuthClass {
    /**
     * Configure Auth category
     *
     * @internal
     *
     * @param authResourcesConfig - Resources configurations required by Auth providers.
     * @param authOptions - Client options used by library
     *
     * @returns void
     */
    configure(authResourcesConfig, authOptions) {
        this.authConfig = authResourcesConfig;
        this.authOptions = authOptions;
        if (authResourcesConfig && authResourcesConfig.Cognito?.userPoolEndpoint) {
            Auth_logger.warn(getCustomEndpointWarningMessage('Amazon Cognito User Pool'));
        }
        if (authResourcesConfig &&
            authResourcesConfig.Cognito?.identityPoolEndpoint) {
            Auth_logger.warn(getCustomEndpointWarningMessage('Amazon Cognito Identity Pool'));
        }
    }
    /**
     * Fetch the auth tokens, and the temporary AWS credentials and identity if they are configured. By default it
     * does not refresh the auth tokens or credentials if they are loaded in storage already. You can force a refresh
     * with `{ forceRefresh: true }` input.
     *
     * @param options - Options configuring the fetch behavior.
     *
     * @returns Promise of current auth session {@link AuthSession}.
     */
    async fetchAuthSession(options = {}) {
        let credentialsAndIdentityId;
        let userSub;
        // Get tokens will throw if session cannot be refreshed (network or service error) or return null if not available
        const tokens = await this.getTokens(options);
        if (tokens) {
            userSub = tokens.accessToken?.payload?.sub;
            // getCredentialsAndIdentityId will throw if cannot get credentials (network or service error)
            credentialsAndIdentityId =
                await this.authOptions?.credentialsProvider?.getCredentialsAndIdentityId({
                    authConfig: this.authConfig,
                    tokens,
                    authenticated: true,
                    forceRefresh: options.forceRefresh,
                });
        }
        else {
            // getCredentialsAndIdentityId will throw if cannot get credentials (network or service error)
            credentialsAndIdentityId =
                await this.authOptions?.credentialsProvider?.getCredentialsAndIdentityId({
                    authConfig: this.authConfig,
                    authenticated: false,
                    forceRefresh: options.forceRefresh,
                });
        }
        return {
            tokens,
            credentials: credentialsAndIdentityId?.credentials,
            identityId: credentialsAndIdentityId?.identityId,
            userSub,
        };
    }
    async clearCredentials() {
        await this.authOptions?.credentialsProvider?.clearCredentialsAndIdentityId();
    }
    async getTokens(options) {
        return ((await this.authOptions?.tokenProvider?.getTokens(options)) ?? undefined);
    }
}
const getCustomEndpointWarningMessage = (target) => `You are using a custom Amazon ${target} endpoint, ensure the endpoint is correct.`;


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/singleton/Amplify.mjs




















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class AmplifyClass {
    constructor() {
        this.oAuthListener = undefined;
        this.isConfigured = false;
        this.resourcesConfig = {};
        this.libraryOptions = {};
        this.Auth = new AuthClass();
    }
    /**
     * Configures Amplify for use with your back-end resources.
     *
     * @remarks
     * This API does not perform any merging of either `resourcesConfig` or `libraryOptions`. The most recently
     * provided values will be used after configuration.
     *
     * @remarks
     * `configure` can be used to specify additional library options where available for supported categories.
     *
     * @param resourceConfig - Back-end resource configuration. Typically provided via the `aws-exports.js` file.
     * @param libraryOptions - Additional options for customizing the behavior of the library.
     */
    configure(resourcesConfig, libraryOptions) {
        const resolvedResourceConfig = parseAmplifyConfig(resourcesConfig);
        this.resourcesConfig = resolvedResourceConfig;
        if (libraryOptions) {
            this.libraryOptions = libraryOptions;
        }
        // Make resource config immutable
        this.resourcesConfig = deepFreeze(this.resourcesConfig);
        this.Auth.configure(this.resourcesConfig.Auth, this.libraryOptions.Auth);
        Hub.dispatch('core', {
            event: 'configure',
            data: this.resourcesConfig,
        }, 'Configure', AMPLIFY_SYMBOL);
        this.notifyOAuthListener();
        this.isConfigured = true;
    }
    /**
     * Provides access to the current back-end resource configuration for the Library.
     *
     * @returns Returns the immutable back-end resource configuration.
     */
    getConfig() {
        if (!this.isConfigured) {
            // eslint-disable-next-line no-console
            console.warn(`Amplify has not been configured. Please call Amplify.configure() before using this service.`);
        }
        return this.resourcesConfig;
    }
    /** @internal */
    [ADD_OAUTH_LISTENER](listener) {
        if (this.resourcesConfig.Auth?.Cognito.loginWith?.oauth) {
            // when Amplify has been configured with a valid OAuth config while adding the listener, run it directly
            listener(this.resourcesConfig.Auth?.Cognito);
        }
        else {
            // otherwise register the listener and run it later when Amplify gets configured with a valid oauth config
            this.oAuthListener = listener;
        }
    }
    notifyOAuthListener() {
        if (!this.resourcesConfig.Auth?.Cognito.loginWith?.oauth ||
            !this.oAuthListener) {
            return;
        }
        this.oAuthListener(this.resourcesConfig.Auth?.Cognito);
        // the listener should only be notified once with a valid oauth config
        this.oAuthListener = undefined;
    }
}
/**
 * The `Amplify` utility is used to configure the library.
 *
 * @remarks
 * `Amplify` orchestrates cross-category communication within the library.
 */
const Amplify_Amplify = new AmplifyClass();


//# sourceMappingURL=Amplify.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/types.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var Framework;
(function (Framework) {
    // < 100 - Web frameworks
    Framework["WebUnknown"] = "0";
    Framework["React"] = "1";
    Framework["NextJs"] = "2";
    Framework["Angular"] = "3";
    Framework["VueJs"] = "4";
    Framework["Nuxt"] = "5";
    Framework["Svelte"] = "6";
    // 100s - Server side frameworks
    Framework["ServerSideUnknown"] = "100";
    Framework["ReactSSR"] = "101";
    Framework["NextJsSSR"] = "102";
    Framework["AngularSSR"] = "103";
    Framework["VueJsSSR"] = "104";
    Framework["NuxtSSR"] = "105";
    Framework["SvelteSSR"] = "106";
    // 200s - Mobile framework
    Framework["ReactNative"] = "201";
    Framework["Expo"] = "202";
})(Framework || (Framework = {}));
var Category;
(function (Category) {
    Category["AI"] = "ai";
    Category["API"] = "api";
    Category["Auth"] = "auth";
    Category["Analytics"] = "analytics";
    Category["DataStore"] = "datastore";
    Category["Geo"] = "geo";
    Category["InAppMessaging"] = "inappmessaging";
    Category["Interactions"] = "interactions";
    Category["Predictions"] = "predictions";
    Category["PubSub"] = "pubsub";
    Category["PushNotification"] = "pushnotification";
    Category["Storage"] = "storage";
})(Category || (Category = {}));
var AiAction;
(function (AiAction) {
    AiAction["CreateConversation"] = "1";
    AiAction["GetConversation"] = "2";
    AiAction["ListConversations"] = "3";
    AiAction["DeleteConversation"] = "4";
    AiAction["SendMessage"] = "5";
    AiAction["ListMessages"] = "6";
    AiAction["OnMessage"] = "7";
    AiAction["Generation"] = "8";
    AiAction["UpdateConversation"] = "9";
})(AiAction || (AiAction = {}));
var AnalyticsAction;
(function (AnalyticsAction) {
    AnalyticsAction["Record"] = "1";
    AnalyticsAction["IdentifyUser"] = "2";
})(AnalyticsAction || (AnalyticsAction = {}));
var ApiAction;
(function (ApiAction) {
    ApiAction["GraphQl"] = "1";
    ApiAction["Get"] = "2";
    ApiAction["Post"] = "3";
    ApiAction["Put"] = "4";
    ApiAction["Patch"] = "5";
    ApiAction["Del"] = "6";
    ApiAction["Head"] = "7";
})(ApiAction || (ApiAction = {}));
var types_AuthAction;
(function (AuthAction) {
    AuthAction["SignUp"] = "1";
    AuthAction["ConfirmSignUp"] = "2";
    AuthAction["ResendSignUpCode"] = "3";
    AuthAction["SignIn"] = "4";
    AuthAction["FetchMFAPreference"] = "6";
    AuthAction["UpdateMFAPreference"] = "7";
    AuthAction["SetUpTOTP"] = "10";
    AuthAction["VerifyTOTPSetup"] = "11";
    AuthAction["ConfirmSignIn"] = "12";
    AuthAction["DeleteUserAttributes"] = "15";
    AuthAction["DeleteUser"] = "16";
    AuthAction["UpdateUserAttributes"] = "17";
    AuthAction["FetchUserAttributes"] = "18";
    AuthAction["ConfirmUserAttribute"] = "22";
    AuthAction["SignOut"] = "26";
    AuthAction["UpdatePassword"] = "27";
    AuthAction["ResetPassword"] = "28";
    AuthAction["ConfirmResetPassword"] = "29";
    AuthAction["FederatedSignIn"] = "30";
    AuthAction["RememberDevice"] = "32";
    AuthAction["ForgetDevice"] = "33";
    AuthAction["FetchDevices"] = "34";
    AuthAction["SendUserAttributeVerificationCode"] = "35";
    AuthAction["SignInWithRedirect"] = "36";
    AuthAction["StartWebAuthnRegistration"] = "37";
    AuthAction["CompleteWebAuthnRegistration"] = "38";
    AuthAction["ListWebAuthnCredentials"] = "39";
    AuthAction["DeleteWebAuthnCredential"] = "40";
})(types_AuthAction || (types_AuthAction = {}));
var DataStoreAction;
(function (DataStoreAction) {
    DataStoreAction["Subscribe"] = "1";
    DataStoreAction["GraphQl"] = "2";
})(DataStoreAction || (DataStoreAction = {}));
var GeoAction;
(function (GeoAction) {
    GeoAction["SearchByText"] = "0";
    GeoAction["SearchByCoordinates"] = "1";
    GeoAction["SearchForSuggestions"] = "2";
    GeoAction["SearchByPlaceId"] = "3";
    GeoAction["SaveGeofences"] = "4";
    GeoAction["GetGeofence"] = "5";
    GeoAction["ListGeofences"] = "6";
    GeoAction["DeleteGeofences"] = "7";
})(GeoAction || (GeoAction = {}));
var InAppMessagingAction;
(function (InAppMessagingAction) {
    InAppMessagingAction["SyncMessages"] = "1";
    InAppMessagingAction["IdentifyUser"] = "2";
    InAppMessagingAction["NotifyMessageInteraction"] = "3";
})(InAppMessagingAction || (InAppMessagingAction = {}));
var InteractionsAction;
(function (InteractionsAction) {
    InteractionsAction["None"] = "0";
})(InteractionsAction || (InteractionsAction = {}));
var PredictionsAction;
(function (PredictionsAction) {
    PredictionsAction["Convert"] = "1";
    PredictionsAction["Identify"] = "2";
    PredictionsAction["Interpret"] = "3";
})(PredictionsAction || (PredictionsAction = {}));
var PubSubAction;
(function (PubSubAction) {
    PubSubAction["Subscribe"] = "1";
})(PubSubAction || (PubSubAction = {}));
var PushNotificationAction;
(function (PushNotificationAction) {
    PushNotificationAction["InitializePushNotifications"] = "1";
    PushNotificationAction["IdentifyUser"] = "2";
})(PushNotificationAction || (PushNotificationAction = {}));
var StorageAction;
(function (StorageAction) {
    StorageAction["UploadData"] = "1";
    StorageAction["DownloadData"] = "2";
    StorageAction["List"] = "3";
    StorageAction["Copy"] = "4";
    StorageAction["Remove"] = "5";
    StorageAction["GetProperties"] = "6";
    StorageAction["GetUrl"] = "7";
    StorageAction["GetDataAccess"] = "8";
    StorageAction["ListCallerAccessGrants"] = "9";
})(StorageAction || (StorageAction = {}));


//# sourceMappingURL=types.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/version.mjs
// generated by genversion
const version = '6.15.3';


//# sourceMappingURL=version.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/helpers.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const globalExists = () => {
    return typeof global !== 'undefined';
};
const globalThisExists = () => {
    return typeof globalThis !== 'undefined';
};
const windowExists = () => {
    return typeof window !== 'undefined';
};
const documentExists = () => {
    return typeof document !== 'undefined';
};
const processExists = () => {
    return typeof process !== 'undefined';
};
const keyPrefixMatch = (object, prefix) => {
    return !!Object.keys(object).find(key => key.startsWith(prefix));
};


//# sourceMappingURL=helpers.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/React.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with react 18.2 - built using Vite
function reactWebDetect() {
    const elementKeyPrefixedWithReact = (key) => {
        return key.startsWith('_react') || key.startsWith('__react');
    };
    const elementIsReactEnabled = (element) => {
        return Object.keys(element).find(elementKeyPrefixedWithReact);
    };
    const allElementsWithId = () => Array.from(document.querySelectorAll('[id]'));
    return documentExists() && allElementsWithId().some(elementIsReactEnabled);
}
function reactSSRDetect() {
    return (processExists() &&
        typeof process.env !== 'undefined' &&
        !!Object.keys(process.env).find(key => key.includes('react')));
}
// use the some


//# sourceMappingURL=React.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/Vue.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with vue 3.3.2
function vueWebDetect() {
    return windowExists() && keyPrefixMatch(window, '__VUE');
}
function vueSSRDetect() {
    return globalExists() && keyPrefixMatch(global, '__VUE');
}


//# sourceMappingURL=Vue.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/Svelte.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with svelte 3.59
function svelteWebDetect() {
    return windowExists() && keyPrefixMatch(window, '__SVELTE');
}
function svelteSSRDetect() {
    return (processExists() &&
        typeof process.env !== 'undefined' &&
        !!Object.keys(process.env).find(key => key.includes('svelte')));
}


//# sourceMappingURL=Svelte.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/Next.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with next 13.4 / react 18.2
function nextWebDetect() {
    return (windowExists() &&
        window.next &&
        typeof window.next === 'object');
}
function nextSSRDetect() {
    return (globalExists() &&
        (keyPrefixMatch(global, '__next') || keyPrefixMatch(global, '__NEXT')));
}


//# sourceMappingURL=Next.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/Nuxt.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with nuxt 2.15 / vue 2.7
function nuxtWebDetect() {
    return (windowExists() &&
        (window.__NUXT__ !== undefined ||
            window.$nuxt !== undefined));
}
function nuxtSSRDetect() {
    return (globalExists() && typeof global.__NUXT_PATHS__ !== 'undefined');
}


//# sourceMappingURL=Nuxt.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/Angular.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with @angular/core 16.0.0
function angularWebDetect() {
    const angularVersionSetInDocument = Boolean(documentExists() && document.querySelector('[ng-version]'));
    const angularContentSetInWindow = Boolean(windowExists() && typeof window.ng !== 'undefined');
    return angularVersionSetInDocument || angularContentSetInWindow;
}
function angularSSRDetect() {
    return ((processExists() &&
        typeof process.env === 'object' &&
        process.env.npm_lifecycle_script?.startsWith('ng ')) ||
        false);
}


//# sourceMappingURL=Angular.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/ReactNative.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with react-native 0.17.7
function reactNativeDetect() {
    return (typeof navigator !== 'undefined' &&
        typeof navigator.product !== 'undefined' &&
        navigator.product === 'ReactNative');
}


//# sourceMappingURL=ReactNative.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/Expo.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with expo 48 / react-native 0.71.3
function expoDetect() {
    return globalExists() && typeof global.expo !== 'undefined';
}


//# sourceMappingURL=Expo.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/Web.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function webDetect() {
    return windowExists();
}


//# sourceMappingURL=Web.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detection/index.mjs











// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// These are in the order of detection where when both are detectable, the early Framework will be reported
const detectionMap = [
    // First, detect mobile
    { platform: Framework.Expo, detectionMethod: expoDetect },
    { platform: Framework.ReactNative, detectionMethod: reactNativeDetect },
    // Next, detect web frameworks
    { platform: Framework.NextJs, detectionMethod: nextWebDetect },
    { platform: Framework.Nuxt, detectionMethod: nuxtWebDetect },
    { platform: Framework.Angular, detectionMethod: angularWebDetect },
    { platform: Framework.React, detectionMethod: reactWebDetect },
    { platform: Framework.VueJs, detectionMethod: vueWebDetect },
    { platform: Framework.Svelte, detectionMethod: svelteWebDetect },
    { platform: Framework.WebUnknown, detectionMethod: webDetect },
    // Last, detect ssr frameworks
    { platform: Framework.NextJsSSR, detectionMethod: nextSSRDetect },
    { platform: Framework.NuxtSSR, detectionMethod: nuxtSSRDetect },
    { platform: Framework.ReactSSR, detectionMethod: reactSSRDetect },
    { platform: Framework.VueJsSSR, detectionMethod: vueSSRDetect },
    { platform: Framework.AngularSSR, detectionMethod: angularSSRDetect },
    { platform: Framework.SvelteSSR, detectionMethod: svelteSSRDetect },
];
function detect() {
    return (detectionMap.find(detectionEntry => detectionEntry.detectionMethod())
        ?.platform || Framework.ServerSideUnknown);
}


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/detectFramework.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// We want to cache detection since the framework won't change
let frameworkCache;
const frameworkChangeObservers = [];
// Setup the detection reset tracking / timeout delays
let resetTriggered = false;
const SSR_RESET_TIMEOUT = 10; // ms
const WEB_RESET_TIMEOUT = 10; // ms
const PRIME_FRAMEWORK_DELAY = 1000; // ms
const detectFramework = () => {
    if (!frameworkCache) {
        frameworkCache = detect();
        if (resetTriggered) {
            // The final run of detectFramework:
            // Starting from this point, the `frameworkCache` becomes "final".
            // So we don't need to notify the observers again so the observer
            // can be removed after the final notice.
            while (frameworkChangeObservers.length) {
                frameworkChangeObservers.pop()?.();
            }
        }
        else {
            // The first run of detectFramework:
            // Every time we update the cache, call each observer function
            frameworkChangeObservers.forEach(fcn => {
                fcn();
            });
        }
        // Retry once for either Unknown type after a delay (explained below)
        resetTimeout(Framework.ServerSideUnknown, SSR_RESET_TIMEOUT);
        resetTimeout(Framework.WebUnknown, WEB_RESET_TIMEOUT);
    }
    return frameworkCache;
};
/**
 * @internal Setup observer callback that will be called everytime the framework changes
 */
const observeFrameworkChanges = (fcn) => {
    // When the `frameworkCache` won't be updated again, we ignore all incoming
    // observers.
    if (resetTriggered) {
        return;
    }
    frameworkChangeObservers.push(fcn);
};
function clearCache() {
    frameworkCache = undefined;
}
// For a framework type and a delay amount, setup the event to re-detect
//   During the runtime boot, it is possible that framework detection will
//   be triggered before the framework has made modifications to the
//   global/window/etc needed for detection. When no framework is detected
//   we will reset and try again to ensure we don't use a cached
//   non-framework detection result for all requests.
function resetTimeout(framework, delay) {
    if (frameworkCache === framework && !resetTriggered) {
        setTimeout(() => {
            clearCache();
            resetTriggered = true;
            setTimeout(detectFramework, PRIME_FRAMEWORK_DELAY);
        }, delay);
    }
}


//# sourceMappingURL=detectFramework.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/customUserAgent.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Maintains custom user-agent state set by external consumers.
const customUserAgentState = {};
/**
 * Sets custom user agent state which will be appended to applicable requests. Returns a function that can be used to
 * clean up any custom state set with this API.
 *
 * @note
 * This API operates globally. Calling this API multiple times will result in the most recently set values for a
 * particular API being used.
 *
 * @note
 * This utility IS NOT compatible with SSR.
 *
 * @param input - SetCustomUserAgentInput that defines custom state to apply to the specified APIs.
 */
const setCustomUserAgent = (input) => {
    // Save custom user-agent state & increment reference counter
    // TODO Remove `any` when we upgrade to TypeScript 5.2, see: https://github.com/microsoft/TypeScript/issues/44373
    customUserAgentState[input.category] = input.apis.reduce((acc, api) => ({
        ...acc,
        [api]: {
            refCount: acc[api]?.refCount ? acc[api].refCount + 1 : 1,
            additionalDetails: input.additionalDetails,
        },
    }), customUserAgentState[input.category] ?? {});
    // Callback that cleans up state for APIs recorded by this call
    let cleanUpCallbackCalled = false;
    const cleanUpCallback = () => {
        // Only allow the cleanup callback to be called once
        if (cleanUpCallbackCalled) {
            return;
        }
        cleanUpCallbackCalled = true;
        input.apis.forEach(api => {
            const apiRefCount = customUserAgentState[input.category][api].refCount;
            if (apiRefCount > 1) {
                customUserAgentState[input.category][api].refCount = apiRefCount - 1;
            }
            else {
                delete customUserAgentState[input.category][api];
                // Clean up category if no more APIs set
                if (!Object.keys(customUserAgentState[input.category]).length) {
                    delete customUserAgentState[input.category];
                }
            }
        });
    };
    return cleanUpCallback;
};
const getCustomUserAgent = (category, api) => customUserAgentState[category]?.[api]?.additionalDetails;


//# sourceMappingURL=customUserAgent.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/Platform/index.mjs





// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const BASE_USER_AGENT = `aws-amplify`;
/** Sanitize Amplify version string be removing special character + and character post the special character  */
const sanitizeAmplifyVersion = (amplifyVersion) => amplifyVersion.replace(/\+.*/, '');
class PlatformBuilder {
    constructor() {
        this.userAgent = `${BASE_USER_AGENT}/${sanitizeAmplifyVersion(version)}`;
    }
    get framework() {
        return detectFramework();
    }
    get isReactNative() {
        return (this.framework === Framework.ReactNative ||
            this.framework === Framework.Expo);
    }
    observeFrameworkChanges(fcn) {
        observeFrameworkChanges(fcn);
    }
}
const Platform = new PlatformBuilder();
const getAmplifyUserAgentObject = ({ category, action, } = {}) => {
    const userAgent = [
        [BASE_USER_AGENT, sanitizeAmplifyVersion(version)],
    ];
    if (category) {
        userAgent.push([category, action]);
    }
    userAgent.push(['framework', detectFramework()]);
    if (category && action) {
        const customState = getCustomUserAgent(category, action);
        if (customState) {
            customState.forEach(state => {
                userAgent.push(state);
            });
        }
    }
    return userAgent;
};
const getAmplifyUserAgent = (customUserAgentDetails) => {
    const userAgent = getAmplifyUserAgentObject(customUserAgentDetails);
    const userAgentString = userAgent
        .map(([agentKey, agentValue]) => agentKey && agentValue ? `${agentKey}/${agentValue}` : agentKey)
        .join(' ');
    return userAgentString;
};


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/serde/responseInfo.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const parseMetadata = (response) => {
    const { headers, statusCode } = response;
    return {
        ...(isMetadataBearer(response) ? response.$metadata : {}),
        httpStatusCode: statusCode,
        requestId: headers['x-amzn-requestid'] ??
            headers['x-amzn-request-id'] ??
            headers['x-amz-request-id'],
        extendedRequestId: headers['x-amz-id-2'],
        cfId: headers['x-amz-cf-id'],
    };
};
const isMetadataBearer = (response) => typeof response?.$metadata === 'object';


//# sourceMappingURL=responseInfo.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/serde/json.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Utility functions for serializing and deserializing of JSON protocol in general(including: REST-JSON, JSON-RPC, etc.)
 */
/**
 * Error parser for AWS JSON protocol.
 */
const parseJsonError = async (response) => {
    if (!response || response.statusCode < 300) {
        return;
    }
    const body = await parseJsonBody(response);
    const sanitizeErrorCode = (rawValue) => {
        const [cleanValue] = rawValue.toString().split(/[,:]+/);
        if (cleanValue.includes('#')) {
            return cleanValue.split('#')[1];
        }
        return cleanValue;
    };
    const code = sanitizeErrorCode(response.headers['x-amzn-errortype'] ??
        body.code ??
        body.__type ??
        'UnknownError');
    const message = body.message ?? body.Message ?? 'Unknown error';
    const error = new Error(message);
    return Object.assign(error, {
        name: code,
        $metadata: parseMetadata(response),
    });
};
/**
 * Parse JSON response body to JavaScript object.
 */
const parseJsonBody = async (response) => {
    if (!response.body) {
        throw new Error('Missing response payload');
    }
    const output = await response.body.json();
    return Object.assign(output, {
        $metadata: parseMetadata(response),
    });
};


//# sourceMappingURL=json.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/internal/composeServiceApi.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Compose a service API handler that accepts input as defined shape and responds conforming to defined output shape.
 * A service API handler is composed with:
 * * A transfer handler
 * * A serializer function
 * * A deserializer function
 * * A default config object
 *
 * The returned service API handler, when called, will trigger the following workflow:
 * 1. When calling the service API handler function, the default config object is merged into the input config
 * object to assign the default values of some omitted configs, resulting to a resolved config object.
 * 2. The `endpointResolver` function from the default config object will be invoked with the resolved config object and
 * API input object resulting to an endpoint instance.
 * 3. The serializer function is invoked with API input object and the endpoint instance resulting to an HTTP request
 * instance.
 * 4. The HTTP request instance and the resolved config object is passed to the transfer handler function.
 * 5. The transfer handler function resolves to an HTTP response instance(can be either successful or failed status code).
 * 6. The deserializer function is invoked with the HTTP response instance resulting to the API output object, and
 * return to the caller.
 *
 *
 * @param transferHandler Async function for dispatching HTTP requests and returning HTTP response.
 * @param serializer  Async function for converting object in defined input shape into HTTP request targeting a given
 * 	endpoint.
 * @param deserializer Async function for converting HTTP response into output object in defined output shape, or error
 * 	shape.
 * @param defaultConfig  object containing default options to be consumed by transfer handler, serializer and
 *  deserializer.
 * @returns a async service API handler function that accepts a config object and input object in defined shape, returns
 * 	an output object in defined shape. It may also throw error instance in defined shape in deserializer. The config
 *  object type is composed with options type of transferHandler, endpointResolver function as well as endpointResolver
 *  function's input options type, region string. The config object property will be marked as optional if it's also
 * 	defined in defaultConfig.
 *
 * @internal
 */
const composeServiceApi = (transferHandler, serializer, deserializer, defaultConfig) => {
    return async (config, input) => {
        const resolvedConfig = {
            ...defaultConfig,
            ...config,
        };
        // We need to allow different endpoints based on both given config(other than region) and input.
        // However for most of non-S3 services, region is the only input for endpoint resolver.
        const endpoint = await resolvedConfig.endpointResolver(resolvedConfig, input);
        // Unlike AWS SDK clients, a serializer should NOT populate the `host` or `content-length` headers.
        // Both of these headers are prohibited per Spec(https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name).
        // They will be populated automatically by browser, or node-fetch polyfill.
        const request = await serializer(input, endpoint);
        const response = await transferHandler(request, {
            ...resolvedConfig,
        });
        return deserializer(response);
    };
};


//# sourceMappingURL=composeServiceApi.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/retry/constants.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const MAX_DELAY_MS = 5 * 60 * 1000;


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/retry/jitteredBackoff.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @private
 * Internal use of Amplify only
 */
function jitteredBackoff(maxDelayMs = MAX_DELAY_MS) {
    const BASE_TIME_MS = 100;
    const JITTER_FACTOR = 100;
    return attempt => {
        const delay = 2 ** attempt * BASE_TIME_MS + JITTER_FACTOR * Math.random();
        return delay > maxDelayMs ? false : delay;
    };
}


//# sourceMappingURL=jitteredBackoff.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/constants.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const DEFAULT_RETRY_ATTEMPTS = 3;
const AMZ_SDK_INVOCATION_ID_HEADER = 'amz-sdk-invocation-id';
const AMZ_SDK_REQUEST_HEADER = 'amz-sdk-request';
const DEFAULT_MAX_DELAY_MS = 5 * 60 * 1000;


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/jitteredBackoff.mjs







// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// TODO: [v6] The separate retry utility is used by Data packages now and will replaced by retry middleware.
const jitteredBackoff_jitteredBackoff = attempt => {
    const delayFunction = jitteredBackoff(DEFAULT_MAX_DELAY_MS);
    const delay = delayFunction(attempt);
    // The delayFunction returns false when the delay is greater than the max delay(5 mins).
    // In this case, the retry middleware will delay 5 mins instead, as a ceiling of the delay.
    return delay === false ? DEFAULT_MAX_DELAY_MS : delay;
};


//# sourceMappingURL=jitteredBackoff.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/isClockSkewError.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// via https://github.com/aws/aws-sdk-js-v3/blob/ab0e7be36e7e7f8a0c04834357aaad643c7912c3/packages/service-error-classification/src/constants.ts#L8
const CLOCK_SKEW_ERROR_CODES = [
    'AuthFailure',
    'InvalidSignatureException',
    'RequestExpired',
    'RequestInTheFuture',
    'RequestTimeTooSkewed',
    'SignatureDoesNotMatch',
    'BadRequestException', // API Gateway
];
/**
 * Given an error code, returns true if it is related to a clock skew error.
 *
 * @param errorCode String representation of some error.
 * @returns True if given error is present in `CLOCK_SKEW_ERROR_CODES`, false otherwise.
 *
 * @internal
 */
const isClockSkewError = (errorCode) => !!errorCode && CLOCK_SKEW_ERROR_CODES.includes(errorCode);


//# sourceMappingURL=isClockSkewError.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/defaultRetryDecider.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Get retry decider function
 * @param errorParser Function to load JavaScript error from HTTP response
 */
const getRetryDecider = (errorParser) => async (response, error) => {
    const parsedError = error ??
        (await errorParser(response)) ??
        undefined;
    const errorCode = parsedError?.code || parsedError?.name;
    const statusCode = response?.statusCode;
    const isRetryable = isConnectionError(error) ||
        isThrottlingError(statusCode, errorCode) ||
        isClockSkewError(errorCode) ||
        isServerSideError(statusCode, errorCode);
    return {
        retryable: isRetryable,
    };
};
// reference: https://github.com/aws/aws-sdk-js-v3/blob/ab0e7be36e7e7f8a0c04834357aaad643c7912c3/packages/service-error-classification/src/constants.ts#L22-L37
const THROTTLING_ERROR_CODES = [
    'BandwidthLimitExceeded',
    'EC2ThrottledException',
    'LimitExceededException',
    'PriorRequestNotComplete',
    'ProvisionedThroughputExceededException',
    'RequestLimitExceeded',
    'RequestThrottled',
    'RequestThrottledException',
    'SlowDown',
    'ThrottledException',
    'Throttling',
    'ThrottlingException',
    'TooManyRequestsException',
];
const TIMEOUT_ERROR_CODES = [
    'TimeoutError',
    'RequestTimeout',
    'RequestTimeoutException',
];
const isThrottlingError = (statusCode, errorCode) => statusCode === 429 ||
    (!!errorCode && THROTTLING_ERROR_CODES.includes(errorCode));
const isConnectionError = (error) => [
    AmplifyErrorCode.NetworkError,
    // TODO(vNext): unify the error code `ERR_NETWORK` used by the Storage XHR handler
    'ERR_NETWORK',
].includes(error?.name);
const isServerSideError = (statusCode, errorCode) => (!!statusCode && [500, 502, 503, 504].includes(statusCode)) ||
    (!!errorCode && TIMEOUT_ERROR_CODES.includes(errorCode));


//# sourceMappingURL=defaultRetryDecider.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/foundation/factories/serviceClients/cognitoIdentity/constants.mjs



















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * The service name used to sign requests if the API requires authentication.
 */
const COGNITO_IDENTITY_SERVICE_NAME = 'cognito-identity';
const DEFAULT_SERVICE_CLIENT_API_CONFIG = {
    service: COGNITO_IDENTITY_SERVICE_NAME,
    retryDecider: getRetryDecider(parseJsonError),
    computeDelay: jitteredBackoff_jitteredBackoff,
    cache: 'no-store',
};


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/retryMiddleware.mjs


/**
 * Middleware that executes the retry logic.
 */
const retryMiddlewareFactory = ({ maxAttempts = DEFAULT_RETRY_ATTEMPTS, retryDecider, computeDelay, abortSignal, }) => {
    if (maxAttempts < 1) {
        throw new Error('maxAttempts must be greater than 0');
    }
    return (next, context) => async function retryMiddleware(request) {
        let error;
        let attemptsCount = context.attemptsCount ?? 0;
        let response;
        // When retry is not needed or max attempts is reached, either error or response will be set. This function handles either cases.
        const handleTerminalErrorOrResponse = () => {
            if (response) {
                addOrIncrementMetadataAttempts(response, attemptsCount);
                return response;
            }
            else {
                addOrIncrementMetadataAttempts(error, attemptsCount);
                throw error;
            }
        };
        while (!abortSignal?.aborted && attemptsCount < maxAttempts) {
            try {
                response = await next(request);
                error = undefined;
            }
            catch (e) {
                error = e;
                response = undefined;
            }
            // context.attemptsCount may be updated after calling next handler which may retry the request by itself.
            attemptsCount =
                (context.attemptsCount ?? 0) > attemptsCount
                    ? (context.attemptsCount ?? 0)
                    : attemptsCount + 1;
            context.attemptsCount = attemptsCount;
            const { isCredentialsExpiredError, retryable } = await retryDecider(response, error, context);
            if (retryable) {
                // Setting isCredentialsInvalid flag to notify signing middleware to forceRefresh credentials provider.
                context.isCredentialsExpired = !!isCredentialsExpiredError;
                if (!abortSignal?.aborted && attemptsCount < maxAttempts) {
                    // prevent sleep for last attempt or cancelled request;
                    const delay = computeDelay(attemptsCount);
                    await cancellableSleep(delay, abortSignal);
                }
                continue;
            }
            else {
                return handleTerminalErrorOrResponse();
            }
        }
        if (abortSignal?.aborted) {
            throw new Error('Request aborted.');
        }
        else {
            return handleTerminalErrorOrResponse();
        }
    };
};
const cancellableSleep = (timeoutMs, abortSignal) => {
    if (abortSignal?.aborted) {
        return Promise.resolve();
    }
    let timeoutId;
    let sleepPromiseResolveFn;
    const sleepPromise = new Promise(resolve => {
        sleepPromiseResolveFn = resolve;
        timeoutId = setTimeout(resolve, timeoutMs);
    });
    abortSignal?.addEventListener('abort', function cancelSleep(_) {
        clearTimeout(timeoutId);
        abortSignal?.removeEventListener('abort', cancelSleep);
        sleepPromiseResolveFn();
    });
    return sleepPromise;
};
const addOrIncrementMetadataAttempts = (nextHandlerOutput, attempts) => {
    if (Object.prototype.toString.call(nextHandlerOutput) !== '[object Object]') {
        return;
    }
    nextHandlerOutput.$metadata = {
        ...(nextHandlerOutput.$metadata ?? {}),
        attempts,
    };
};


//# sourceMappingURL=retryMiddleware.mjs.map

;// ./node_modules/uuid/dist/esm-browser/native.js
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
/* harmony default export */ const esm_browser_native = ({ randomUUID });

;// ./node_modules/uuid/dist/esm-browser/rng.js
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
    if (!getRandomValues) {
        if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
        getRandomValues = crypto.getRandomValues.bind(crypto);
    }
    return getRandomValues(rnds8);
}

;// ./node_modules/uuid/dist/esm-browser/stringify.js

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] +
        byteToHex[arr[offset + 1]] +
        byteToHex[arr[offset + 2]] +
        byteToHex[arr[offset + 3]] +
        '-' +
        byteToHex[arr[offset + 4]] +
        byteToHex[arr[offset + 5]] +
        '-' +
        byteToHex[arr[offset + 6]] +
        byteToHex[arr[offset + 7]] +
        '-' +
        byteToHex[arr[offset + 8]] +
        byteToHex[arr[offset + 9]] +
        '-' +
        byteToHex[arr[offset + 10]] +
        byteToHex[arr[offset + 11]] +
        byteToHex[arr[offset + 12]] +
        byteToHex[arr[offset + 13]] +
        byteToHex[arr[offset + 14]] +
        byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
/* harmony default export */ const esm_browser_stringify = ((/* unused pure expression or super */ null && (stringify)));

;// ./node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
    if (esm_browser_native.randomUUID && !buf && !options) {
        return esm_browser_native.randomUUID();
    }
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? rng();
    if (rnds.length < 16) {
        throw new Error('Random bytes length must be >= 16');
    }
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    if (buf) {
        offset = offset || 0;
        if (offset < 0 || offset + 16 > buf.length) {
            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
        }
        for (let i = 0; i < 16; ++i) {
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return unsafeStringify(rnds);
}
/* harmony default export */ const esm_browser_v4 = (v4);

;// ./node_modules/@aws-amplify/core/dist/esm/utils/amplifyUuid/index.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const amplifyUuid = esm_browser_v4;


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/amzSdkInvocationIdHeaderMiddleware.mjs

















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Middleware injects a UUID string to `amz-sdk-invocation-id` header.
 * if the header is not set already. This header is helpful to provide
 * observability to group the requests caused by automatic retry.
 *
 * This middleware is standalone because of extra UUID dependency, we will
 * NOT use this middleware for API categories.
 *
 * Ref: https://sdk.amazonaws.com/kotlin/api/smithy-kotlin/api/1.0.9/http-client/aws.smithy.kotlin.runtime.http.operation/-http-operation-context/-sdk-invocation-id.html
 */
const amzSdkInvocationIdHeaderMiddlewareFactory = () => next => {
    return async function amzSdkInvocationIdHeaderMiddleware(request) {
        if (!request.headers[AMZ_SDK_INVOCATION_ID_HEADER]) {
            request.headers[AMZ_SDK_INVOCATION_ID_HEADER] = amplifyUuid();
        }
        return next(request);
    };
};


//# sourceMappingURL=amzSdkInvocationIdHeaderMiddleware.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/middleware/retry/amzSdkRequestHeaderMiddleware.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Middleware injects `amz-sdk-request` header to indicate the retry state at the time an HTTP request is made.
 * This middleware should co-exist with retryMiddleware as it relies on the retryAttempts value in middleware context
 * set by the retry middleware.
 *
 * Example header: `amz-sdk-request: attempt=1; max=3`.
 *
 * This middleware is standalone because of extra headers may conflict with custom endpoint settings(e.g. CORS), we will
 * NOT use this middleware for API categories.
 */
const amzSdkRequestHeaderMiddlewareFactory = ({ maxAttempts = DEFAULT_RETRY_ATTEMPTS }) => (next, context) => {
    return async function amzSdkRequestHeaderMiddleware(request) {
        const attemptsCount = context.attemptsCount ?? 0;
        request.headers[AMZ_SDK_REQUEST_HEADER] =
            `attempt=${attemptsCount + 1}; max=${maxAttempts}`;
        return next(request);
    };
};


//# sourceMappingURL=amzSdkRequestHeaderMiddleware.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/middleware/userAgent/middleware.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Middleware injects user agent string to specified header(default to 'x-amz-user-agent'),
 * if the header is not set already.
 *
 * TODO: incorporate new user agent design
 */
const userAgentMiddlewareFactory = ({ userAgentHeader = 'x-amz-user-agent', userAgentValue = '', }) => next => {
    return async function userAgentMiddleware(request) {
        if (userAgentValue.trim().length === 0) {
            const result = await next(request);
            return result;
        }
        else {
            const headerName = userAgentHeader.toLowerCase();
            request.headers[headerName] = request.headers[headerName]
                ? `${request.headers[headerName]} ${userAgentValue}`
                : userAgentValue;
            const response = await next(request);
            return response;
        }
    };
};


//# sourceMappingURL=middleware.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/internal/composeTransferHandler.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Compose a transfer handler with a core transfer handler and a list of middleware.
 * @param coreHandler Core transfer handler
 * @param middleware	List of middleware
 * @returns A transfer handler whose option type is the union of the core
 * 	transfer handler's option type and the middleware's option type.
 * @internal
 */
const composeTransferHandler = (coreHandler, middleware) => (request, options) => {
    const context = {};
    let composedHandler = (composeHandlerRequest) => coreHandler(composeHandlerRequest, options);
    for (let i = middleware.length - 1; i >= 0; i--) {
        const m = middleware[i];
        const resolvedMiddleware = m(options);
        composedHandler = resolvedMiddleware(composedHandler, context);
    }
    return composedHandler(request);
};


//# sourceMappingURL=composeTransferHandler.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/utils/memoization.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Cache the payload of a response body. It allows multiple calls to the body,
 * for example, when reading the body in both retry decider and error deserializer.
 * Caching body is allowed here because we call the body accessor(blob(), json(),
 * etc.) when body is small or streaming implementation is not available(RN).
 *
 * @internal
 */
const withMemoization = (payloadAccessor) => {
    let cached;
    return () => {
        if (!cached) {
            // Explicitly not awaiting. Intermediate await would add overhead and
            // introduce a possible race in the event that this wrapper is called
            // again before the first `payloadAccessor` call resolves.
            cached = payloadAccessor();
        }
        return cached;
    };
};


//# sourceMappingURL=memoization.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/handlers/fetch.mjs





// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const shouldSendBody = (method) => !['HEAD', 'GET', 'DELETE'].includes(method.toUpperCase());
// TODO[AllanZhengYP]: we need to provide isCanceledError utility
const fetchTransferHandler = async ({ url, method, headers, body }, { abortSignal, cache, withCrossDomainCredentials }) => {
    let resp;
    try {
        resp = await fetch(url, {
            method,
            headers,
            body: shouldSendBody(method) ? body : undefined,
            signal: abortSignal,
            cache,
            credentials: withCrossDomainCredentials ? 'include' : 'same-origin',
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            throw new AmplifyError({
                name: AmplifyErrorCode.NetworkError,
                message: 'A network error has occurred.',
                underlyingError: e,
            });
        }
        throw e;
    }
    const responseHeaders = {};
    resp.headers?.forEach((value, key) => {
        responseHeaders[key.toLowerCase()] = value;
    });
    const httpResponse = {
        statusCode: resp.status,
        headers: responseHeaders,
        body: null,
    };
    // resp.body is a ReadableStream according to Fetch API spec, but React Native
    // does not implement it.
    const bodyWithMixin = Object.assign(resp.body ?? {}, {
        text: withMemoization(() => resp.text()),
        blob: withMemoization(() => resp.blob()),
        json: withMemoization(() => resp.json()),
    });
    return {
        ...httpResponse,
        body: bodyWithMixin,
    };
};


//# sourceMappingURL=fetch.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/handlers/aws/unauthenticated.mjs











// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const unauthenticatedHandler = composeTransferHandler(fetchTransferHandler, [
    userAgentMiddlewareFactory,
    amzSdkInvocationIdHeaderMiddlewareFactory,
    retryMiddlewareFactory,
    amzSdkRequestHeaderMiddlewareFactory,
]);


//# sourceMappingURL=unauthenticated.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/foundation/factories/middleware/createDisableCacheMiddleware.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * A Cognito Identity-specific middleware that disables caching for all requests.
 */
const createDisableCacheMiddleware = () => next => async function disableCacheMiddleware(request) {
    request.headers['cache-control'] = 'no-store';
    return next(request);
};


//# sourceMappingURL=createDisableCacheMiddleware.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/foundation/factories/serviceClients/cognitoIdentity/handler/cognitoIdentityTransferHandler.mjs



















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * A Cognito Identity-specific transfer handler that does NOT sign requests, and
 * disables caching.
 *
 * @internal
 */
const cognitoIdentityTransferHandler = composeTransferHandler(unauthenticatedHandler, [createDisableCacheMiddleware]);


//# sourceMappingURL=cognitoIdentityTransferHandler.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/foundation/factories/serviceClients/cognitoIdentity/serde/createClientSerializer.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createClientSerializer = (operation) => (input, endpoint) => {
    const headers = getSharedHeaders(operation);
    const body = JSON.stringify(input);
    return buildHttpRpcRequest(endpoint, headers, body);
};
const getSharedHeaders = (operation) => ({
    'content-type': 'application/x-amz-json-1.1',
    'x-amz-target': `AWSCognitoIdentityService.${operation}`,
});
const buildHttpRpcRequest = ({ url }, headers, body) => ({
    headers,
    url,
    body,
    method: 'POST',
});


//# sourceMappingURL=createClientSerializer.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/foundation/factories/serviceClients/cognitoIdentity/createGetCredentialsForIdentityClient.mjs






















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createGetCredentialsForIdentityClient = (config) => composeServiceApi(cognitoIdentityTransferHandler, createClientSerializer('GetCredentialsForIdentity'), getCredentialsForIdentityDeserializer, {
    ...DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
    userAgentValue: getAmplifyUserAgent(),
});
const getCredentialsForIdentityDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        const error = await parseJsonError(response);
        throw error;
    }
    const body = await parseJsonBody(response);
    return {
        IdentityId: body.IdentityId,
        Credentials: deserializeCredentials(body.Credentials),
        $metadata: parseMetadata(response),
    };
};
const deserializeCredentials = ({ Expiration, ...rest } = {}) => ({
    ...rest,
    Expiration: Expiration && new Date(Expiration * 1000),
});


//# sourceMappingURL=createGetCredentialsForIdentityClient.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/globalHelpers/index.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getCrypto = () => {
    if (typeof window === 'object' && typeof window.crypto === 'object') {
        return window.crypto;
    }
    // Next.js global polyfill
    if (typeof crypto === 'object') {
        return crypto;
    }
    throw new AmplifyError({
        name: 'MissingPolyfill',
        message: 'Cannot resolve the `crypto` function from the environment.',
    });
};
const getBtoa = () => {
    // browser
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
        return window.btoa;
    }
    // Next.js global polyfill
    if (typeof btoa === 'function') {
        return btoa;
    }
    throw new AmplifyError({
        name: 'Base64EncoderError',
        message: 'Cannot resolve the `btoa` function from the environment.',
    });
};
const getAtob = () => {
    // browser
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        return window.atob;
    }
    // Next.js global polyfill
    if (typeof atob === 'function') {
        return atob;
    }
    throw new AmplifyError({
        name: 'Base64EncoderError',
        message: 'Cannot resolve the `atob` function from the environment.',
    });
};


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/convert/base64/base64Decoder.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const base64Decoder = {
    convert(input, options) {
        let inputStr = input;
        // urlSafe character replacement options conform to the base64 url spec
        // https://datatracker.ietf.org/doc/html/rfc4648#page-7
        if (options?.urlSafe) {
            inputStr = inputStr.replace(/-/g, '+').replace(/_/g, '/');
        }
        return getAtob()(inputStr);
    },
};


//# sourceMappingURL=base64Decoder.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/errors/createAssertionFunction.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createAssertionFunction = (errorMap, AssertionError = AmplifyError) => (assertion, name, additionalContext) => {
    const { message, recoverySuggestion } = errorMap[name];
    if (!assertion) {
        throw new AssertionError({
            name,
            message: additionalContext
                ? `${message} ${additionalContext}`
                : message,
            recoverySuggestion,
        });
    }
};


//# sourceMappingURL=createAssertionFunction.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/singleton/Auth/utils/errorHelpers.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var AuthConfigurationErrorCode;
(function (AuthConfigurationErrorCode) {
    AuthConfigurationErrorCode["AuthTokenConfigException"] = "AuthTokenConfigException";
    AuthConfigurationErrorCode["AuthUserPoolAndIdentityPoolException"] = "AuthUserPoolAndIdentityPoolException";
    AuthConfigurationErrorCode["AuthUserPoolException"] = "AuthUserPoolException";
    AuthConfigurationErrorCode["InvalidIdentityPoolIdException"] = "InvalidIdentityPoolIdException";
    AuthConfigurationErrorCode["OAuthNotConfigureException"] = "OAuthNotConfigureException";
})(AuthConfigurationErrorCode || (AuthConfigurationErrorCode = {}));
const authConfigurationErrorMap = {
    [AuthConfigurationErrorCode.AuthTokenConfigException]: {
        message: 'Auth Token Provider not configured.',
        recoverySuggestion: 'Make sure to call Amplify.configure in your app.',
    },
    [AuthConfigurationErrorCode.AuthUserPoolAndIdentityPoolException]: {
        message: 'Auth UserPool or IdentityPool not configured.',
        recoverySuggestion: 'Make sure to call Amplify.configure in your app with UserPoolId and IdentityPoolId.',
    },
    [AuthConfigurationErrorCode.AuthUserPoolException]: {
        message: 'Auth UserPool not configured.',
        recoverySuggestion: 'Make sure to call Amplify.configure in your app with userPoolId and userPoolClientId.',
    },
    [AuthConfigurationErrorCode.InvalidIdentityPoolIdException]: {
        message: 'Invalid identity pool id provided.',
        recoverySuggestion: 'Make sure a valid identityPoolId is given in the config.',
    },
    [AuthConfigurationErrorCode.OAuthNotConfigureException]: {
        message: 'oauth param not configured.',
        recoverySuggestion: 'Make sure to call Amplify.configure with oauth parameter in your app.',
    },
};
const assert = createAssertionFunction(authConfigurationErrorMap);


//# sourceMappingURL=errorHelpers.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/singleton/Auth/utils/index.mjs





// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function utils_assertTokenProviderConfig(cognitoConfig) {
    let assertionValid = true; // assume valid until otherwise proveed
    if (!cognitoConfig) {
        assertionValid = false;
    }
    else {
        assertionValid =
            !!cognitoConfig.userPoolId && !!cognitoConfig.userPoolClientId;
    }
    assert(assertionValid, AuthConfigurationErrorCode.AuthUserPoolException);
}
function assertOAuthConfig(cognitoConfig) {
    const validOAuthConfig = !!cognitoConfig?.loginWith?.oauth?.domain &&
        !!cognitoConfig?.loginWith?.oauth?.redirectSignOut &&
        !!cognitoConfig?.loginWith?.oauth?.redirectSignIn &&
        !!cognitoConfig?.loginWith?.oauth?.responseType;
    assert(validOAuthConfig, AuthConfigurationErrorCode.OAuthNotConfigureException);
}
function assertIdentityPoolIdConfig(cognitoConfig) {
    const validConfig = !!cognitoConfig?.identityPoolId;
    assert(validConfig, AuthConfigurationErrorCode.InvalidIdentityPoolIdException);
}
/**
 * Decodes payload of JWT token
 *
 * @param {String} token A string representing a token to be decoded
 * @throws {@link Error} - Throws error when token is invalid or payload malformed.
 */
function decodeJWT(token) {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        throw new Error('Invalid token');
    }
    try {
        const base64WithUrlSafe = tokenParts[1];
        const base64 = base64WithUrlSafe.replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = decodeURIComponent(base64Decoder
            .convert(base64)
            .split('')
            .map(char => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join(''));
        const payload = JSON.parse(jsonStr);
        return {
            toString: () => token,
            payload,
        };
    }
    catch (err) {
        throw new Error('Invalid token payload');
    }
}


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/errors/AuthError.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class AuthError_AuthError extends AmplifyError {
    constructor(params) {
        super(params);
        // Hack for making the custom error class work when transpiled to es5
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = AuthError_AuthError;
        Object.setPrototypeOf(this, AuthError_AuthError.prototype);
    }
}


//# sourceMappingURL=AuthError.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/errors/utils/assertServiceError.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function assertServiceError(error) {
    if (!error ||
        error.name === 'Error' ||
        error instanceof TypeError) {
        throw new AuthError_AuthError({
            name: AmplifyErrorCode.Unknown,
            message: 'An unknown error has occurred.',
            underlyingError: error,
        });
    }
}


//# sourceMappingURL=assertServiceError.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/parsers/regionParsers.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function regionParsers_getRegionFromUserPoolId(userPoolId) {
    const region = userPoolId?.split('_')[0];
    if (!userPoolId ||
        userPoolId.indexOf('_') < 0 ||
        !region ||
        typeof region !== 'string')
        throw new AuthError_AuthError({
            name: 'InvalidUserPoolId',
            message: 'Invalid user pool id provided.',
        });
    return region;
}
function getRegionFromIdentityPoolId(identityPoolId) {
    if (!identityPoolId || !identityPoolId.includes(':')) {
        throw new AuthError_AuthError({
            name: 'InvalidIdentityPoolIdException',
            message: 'Invalid identity pool id provided.',
            recoverySuggestion: 'Make sure a valid identityPoolId is given in the config.',
        });
    }
    return identityPoolId.split(':')[0];
}


//# sourceMappingURL=regionParsers.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/errors/constants.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const USER_UNAUTHENTICATED_EXCEPTION = 'UserUnAuthenticatedException';
const USER_ALREADY_AUTHENTICATED_EXCEPTION = 'UserAlreadyAuthenticatedException';
const constants_DEVICE_METADATA_NOT_FOUND_EXCEPTION = 'DeviceMetadataNotFoundException';
const AUTO_SIGN_IN_EXCEPTION = 'AutoSignInException';
const INVALID_REDIRECT_EXCEPTION = 'InvalidRedirectException';
const INVALID_APP_SCHEME_EXCEPTION = 'InvalidAppSchemeException';
const INVALID_PREFERRED_REDIRECT_EXCEPTION = 'InvalidPreferredRedirectUrlException';
const invalidRedirectException = new AuthError_AuthError({
    name: INVALID_REDIRECT_EXCEPTION,
    message: 'signInRedirect or signOutRedirect had an invalid format or was not found.',
    recoverySuggestion: 'Please make sure the signIn/Out redirect in your oauth config is valid.',
});
const invalidAppSchemeException = new AuthError_AuthError({
    name: INVALID_APP_SCHEME_EXCEPTION,
    message: 'A valid non-http app scheme was not found in the config.',
    recoverySuggestion: 'Please make sure a valid custom app scheme is present in the config.',
});
const invalidPreferredRedirectUrlException = new AuthError_AuthError({
    name: INVALID_PREFERRED_REDIRECT_EXCEPTION,
    message: 'The given preferredRedirectUrl does not match any items in the redirectSignOutUrls array from the config.',
    recoverySuggestion: 'Please make sure a matching preferredRedirectUrl is provided.',
});
const INVALID_ORIGIN_EXCEPTION = 'InvalidOriginException';
const invalidOriginException = new AuthError_AuthError({
    name: INVALID_ORIGIN_EXCEPTION,
    message: 'redirect is coming from a different origin. The oauth flow needs to be initiated from the same origin',
    recoverySuggestion: 'Please call signInWithRedirect from the same origin.',
});
const OAUTH_SIGNOUT_EXCEPTION = 'OAuthSignOutException';
const TOKEN_REFRESH_EXCEPTION = 'TokenRefreshException';
const UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION = 'UnexpectedSignInInterruptionException';


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/types.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function isTypeUserPoolConfig(authConfig) {
    if (authConfig &&
        authConfig.Cognito.userPoolId &&
        authConfig.Cognito.userPoolClientId) {
        return true;
    }
    return false;
}
function assertAuthTokens(tokens) {
    if (!tokens || !tokens.accessToken) {
        throw new AuthError_AuthError({
            name: USER_UNAUTHENTICATED_EXCEPTION,
            message: 'User needs to be authenticated to call this API.',
            recoverySuggestion: 'Sign in before calling this API again.',
        });
    }
}
function assertIdTokenInAuthTokens(tokens) {
    if (!tokens || !tokens.idToken) {
        throw new AuthError_AuthError({
            name: USER_UNAUTHENTICATED_EXCEPTION,
            message: 'User needs to be authenticated to call this API.',
            recoverySuggestion: 'Sign in before calling this API again.',
        });
    }
}
const oAuthTokenRefreshException = new AuthError_AuthError({
    name: TOKEN_REFRESH_EXCEPTION,
    message: `Token refresh is not supported when authenticated with the 'implicit grant' (token) oauth flow. 
	Please change your oauth configuration to use 'code grant' flow.`,
    recoverySuggestion: `Please logout and change your Amplify configuration to use "code grant" flow. 
	E.g { responseType: 'code' }`,
});
const tokenRefreshException = new AuthError_AuthError({
    name: USER_UNAUTHENTICATED_EXCEPTION,
    message: 'User needs to be authenticated to call this API.',
    recoverySuggestion: 'Sign in before calling this API again.',
});
function assertAuthTokensWithRefreshToken(tokens) {
    if (isAuthenticatedWithImplicitOauthFlow(tokens)) {
        throw oAuthTokenRefreshException;
    }
    if (!isAuthenticatedWithRefreshToken(tokens)) {
        throw tokenRefreshException;
    }
}
function assertDeviceMetadata(deviceMetadata) {
    if (!deviceMetadata ||
        !deviceMetadata.deviceKey ||
        !deviceMetadata.deviceGroupKey ||
        !deviceMetadata.randomPassword) {
        throw new AuthError({
            name: DEVICE_METADATA_NOT_FOUND_EXCEPTION,
            message: 'Either deviceKey, deviceGroupKey or secretPassword were not found during the sign-in process.',
            recoverySuggestion: 'Make sure to not clear storage after calling the signIn API.',
        });
    }
}
const OAuthStorageKeys = {
    inflightOAuth: 'inflightOAuth',
    oauthSignIn: 'oauthSignIn',
    oauthPKCE: 'oauthPKCE',
    oauthState: 'oauthState',
};
function isAuthenticated(tokens) {
    return tokens?.accessToken || tokens?.idToken;
}
function isAuthenticatedWithRefreshToken(tokens) {
    return isAuthenticated(tokens) && tokens?.refreshToken;
}
function isAuthenticatedWithImplicitOauthFlow(tokens) {
    return isAuthenticated(tokens) && !tokens?.refreshToken;
}


//# sourceMappingURL=types.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/endpoints/partitions.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Default partition for AWS services. This is used when the region is not provided or the region is not recognized.
 *
 * @internal
 */
const defaultPartition = {
    id: 'aws',
    outputs: {
        dnsSuffix: 'amazonaws.com',
    },
    regionRegex: '^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$',
    regions: ['aws-global'],
};
/**
 * This data is adapted from the partition file from AWS SDK shared utilities but remove some contents for bundle size
 * concern. Information removed are `dualStackDnsSuffix`, `supportDualStack`, `supportFIPS`, restricted partitions, and
 * list of regions for each partition other than global regions.
 *
 * * Ref: https://docs.aws.amazon.com/general/latest/gr/rande.html#regional-endpoints
 * * Ref: https://github.com/aws/aws-sdk-js-v3/blob/0201baef03c2379f1f6f7150b9d401d4b230d488/packages/util-endpoints/src/lib/aws/partitions.json#L1
 *
 * @internal
 */
const partitionsInfo = {
    partitions: [
        defaultPartition,
        {
            id: 'aws-cn',
            outputs: {
                dnsSuffix: 'amazonaws.com.cn',
            },
            regionRegex: '^cn\\-\\w+\\-\\d+$',
            regions: ['aws-cn-global'],
        },
    ],
};


//# sourceMappingURL=partitions.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/clients/endpoints/getDnsSuffix.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Get the AWS Services endpoint URL's DNS suffix for a given region. A typical AWS regional service endpoint URL will
 * follow this pattern: {endpointPrefix}.{region}.{dnsSuffix}. For example, the endpoint URL for Cognito Identity in
 * us-east-1 will be cognito-identity.us-east-1.amazonaws.com. Here the DnsSuffix is `amazonaws.com`.
 *
 * @param region
 * @returns The DNS suffix
 *
 * @internal
 */
const getDnsSuffix = (region) => {
    const { partitions } = partitionsInfo;
    for (const { regions, outputs, regionRegex } of partitions) {
        const regex = new RegExp(regionRegex);
        if (regions.includes(region) || regex.test(region)) {
            return outputs.dnsSuffix;
        }
    }
    return defaultPartition.outputs.dnsSuffix;
};


//# sourceMappingURL=getDnsSuffix.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/amplifyUrl/index.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const amplifyUrl_AmplifyUrl = URL;
const AmplifyUrlSearchParams = (/* unused pure expression or super */ null && (URLSearchParams));


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/foundation/factories/serviceClients/cognitoIdentity/cognitoIdentityPoolEndpointResolver.mjs



















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const cognitoIdentityPoolEndpointResolver = ({ region, }) => ({
    url: new amplifyUrl_AmplifyUrl(`https://${COGNITO_IDENTITY_SERVICE_NAME}.${region}.${getDnsSuffix(region)}`),
});


//# sourceMappingURL=cognitoIdentityPoolEndpointResolver.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/factories/createCognitoIdentityPoolEndpointResolver.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createCognitoIdentityPoolEndpointResolver = ({ endpointOverride }) => (input) => {
    if (endpointOverride) {
        return { url: new amplifyUrl_AmplifyUrl(endpointOverride) };
    }
    return cognitoIdentityPoolEndpointResolver(input);
};


//# sourceMappingURL=createCognitoIdentityPoolEndpointResolver.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/foundation/factories/serviceClients/cognitoIdentity/createGetIdClient.mjs






















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createGetIdClient = (config) => composeServiceApi(cognitoIdentityTransferHandler, createClientSerializer('GetId'), getIdDeserializer, {
    ...DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
    userAgentValue: getAmplifyUserAgent(),
});
const getIdDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        const error = await parseJsonError(response);
        throw error;
    }
    const body = await parseJsonBody(response);
    return {
        IdentityId: body.IdentityId,
        $metadata: parseMetadata(response),
    };
};


//# sourceMappingURL=createGetIdClient.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/credentialsProvider/utils.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function formLoginsMap(idToken) {
    const issuer = decodeJWT(idToken).payload.iss;
    const res = {};
    if (!issuer) {
        throw new AuthError_AuthError({
            name: 'InvalidIdTokenException',
            message: 'Invalid Idtoken.',
        });
    }
    const domainName = issuer.replace(/(^\w+:|^)\/\//, '');
    res[domainName] = idToken;
    return res;
}


//# sourceMappingURL=utils.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/credentialsProvider/IdentityIdProvider.mjs









// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Provides a Cognito identityId
 *
 * @param tokens - The AuthTokens received after SignIn
 * @returns string
 * @throws configuration exceptions: `InvalidIdentityPoolIdException`
 *  - Auth errors that may arise from misconfiguration.
 * @throws service exceptions: {@link GetIdException }
 */
async function cognitoIdentityIdProvider({ tokens, authConfig, identityIdStore, }) {
    identityIdStore.setAuthConfig({ Cognito: authConfig });
    // will return null only if there is no identityId cached or if there is an error retrieving it
    const identityId = await identityIdStore.loadIdentityId();
    if (identityId) {
        return identityId.id;
    }
    const logins = tokens?.idToken
        ? formLoginsMap(tokens.idToken.toString())
        : {};
    const generatedIdentityId = await generateIdentityId(logins, authConfig);
    // Store generated identityId
    identityIdStore.storeIdentityId({
        id: generatedIdentityId,
        type: tokens ? 'primary' : 'guest',
    });
    return generatedIdentityId;
}
async function generateIdentityId(logins, authConfig) {
    const identityPoolId = authConfig?.identityPoolId;
    const region = getRegionFromIdentityPoolId(identityPoolId);
    const getId = createGetIdClient({
        endpointResolver: createCognitoIdentityPoolEndpointResolver({
            endpointOverride: authConfig.identityPoolEndpoint,
        }),
    });
    // IdentityId is absent so get it using IdentityPoolId with Cognito's GetId API
    let idResult;
    // for a first-time user, this will return a brand new identity
    // for a returning user, this will retrieve the previous identity assocaited with the logins
    try {
        idResult = (await getId({
            region,
        }, {
            IdentityPoolId: identityPoolId,
            Logins: logins,
        })).IdentityId;
    }
    catch (e) {
        assertServiceError(e);
        throw new AuthError_AuthError(e);
    }
    if (!idResult) {
        throw new AuthError_AuthError({
            name: 'GetIdResponseException',
            message: 'Received undefined response from getId operation',
            recoverySuggestion: 'Make sure to pass a valid identityPoolId in the configuration.',
        });
    }
    return idResult;
}


//# sourceMappingURL=IdentityIdProvider.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/credentialsProvider/credentialsProvider.mjs











// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const credentialsProvider_logger = new ConsoleLogger('CognitoCredentialsProvider');
const CREDENTIALS_TTL = 50 * 60 * 1000; // 50 min, can be modified on config if required in the future
class CognitoAWSCredentialsAndIdentityIdProvider {
    constructor(identityIdStore) {
        this._nextCredentialsRefresh = 0;
        this._identityIdStore = identityIdStore;
    }
    async clearCredentialsAndIdentityId() {
        credentialsProvider_logger.debug('Clearing out credentials and identityId');
        this._credentialsAndIdentityId = undefined;
        await this._identityIdStore.clearIdentityId();
    }
    async clearCredentials() {
        credentialsProvider_logger.debug('Clearing out in-memory credentials');
        this._credentialsAndIdentityId = undefined;
    }
    async getCredentialsAndIdentityId(getCredentialsOptions) {
        const isAuthenticated = getCredentialsOptions.authenticated;
        const { tokens } = getCredentialsOptions;
        const { authConfig } = getCredentialsOptions;
        try {
            assertIdentityPoolIdConfig(authConfig?.Cognito);
        }
        catch {
            // No identity pool configured, skipping
            return;
        }
        if (!isAuthenticated && !authConfig.Cognito.allowGuestAccess) {
            // TODO(V6): return partial result like Native platforms
            return;
        }
        const { forceRefresh } = getCredentialsOptions;
        const tokenHasChanged = this.hasTokenChanged(tokens);
        const identityId = await cognitoIdentityIdProvider({
            tokens,
            authConfig: authConfig.Cognito,
            identityIdStore: this._identityIdStore,
        });
        // Clear cached credentials when forceRefresh is true OR the cache token has changed
        if (forceRefresh || tokenHasChanged) {
            this.clearCredentials();
        }
        if (!isAuthenticated) {
            return this.getGuestCredentials(identityId, authConfig.Cognito);
        }
        else {
            assertIdTokenInAuthTokens(tokens);
            return this.credsForOIDCTokens(authConfig.Cognito, tokens, identityId);
        }
    }
    async getGuestCredentials(identityId, authConfig) {
        // Return existing in-memory cached credentials only if it exists, is not past it's lifetime and is unauthenticated credentials
        if (this._credentialsAndIdentityId &&
            !this.isPastTTL() &&
            this._credentialsAndIdentityId.isAuthenticatedCreds === false) {
            credentialsProvider_logger.info('returning stored credentials as they neither past TTL nor expired.');
            return this._credentialsAndIdentityId;
        }
        // Clear to discard if any authenticated credentials are set and start with a clean slate
        this.clearCredentials();
        const region = getRegionFromIdentityPoolId(authConfig.identityPoolId);
        const getCredentialsForIdentity = createGetCredentialsForIdentityClient({
            endpointResolver: createCognitoIdentityPoolEndpointResolver({
                endpointOverride: authConfig.identityPoolEndpoint,
            }),
        });
        // use identityId to obtain guest credentials
        // save credentials in-memory
        // No logins params should be passed for guest creds:
        // https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetCredentialsForIdentity.html
        let clientResult;
        try {
            clientResult = await getCredentialsForIdentity({ region }, {
                IdentityId: identityId,
            });
        }
        catch (e) {
            assertServiceError(e);
            throw new AuthError_AuthError(e);
        }
        if (clientResult?.Credentials?.AccessKeyId &&
            clientResult?.Credentials?.SecretKey) {
            this._nextCredentialsRefresh = new Date().getTime() + CREDENTIALS_TTL;
            const res = {
                credentials: {
                    accessKeyId: clientResult.Credentials.AccessKeyId,
                    secretAccessKey: clientResult.Credentials.SecretKey,
                    sessionToken: clientResult.Credentials.SessionToken,
                    expiration: clientResult.Credentials.Expiration,
                },
                identityId,
            };
            if (clientResult.IdentityId) {
                res.identityId = clientResult.IdentityId;
                this._identityIdStore.storeIdentityId({
                    id: clientResult.IdentityId,
                    type: 'guest',
                });
            }
            this._credentialsAndIdentityId = {
                ...res,
                isAuthenticatedCreds: false,
            };
            return res;
        }
        else {
            throw new AuthError_AuthError({
                name: 'CredentialsNotFoundException',
                message: `Cognito did not respond with either Credentials, AccessKeyId or SecretKey.`,
            });
        }
    }
    async credsForOIDCTokens(authConfig, authTokens, identityId) {
        if (this._credentialsAndIdentityId &&
            !this.isPastTTL() &&
            this._credentialsAndIdentityId.isAuthenticatedCreds === true) {
            credentialsProvider_logger.debug('returning stored credentials as they neither past TTL nor expired.');
            return this._credentialsAndIdentityId;
        }
        // Clear to discard if any unauthenticated credentials are set and start with a clean slate
        this.clearCredentials();
        const logins = authTokens.idToken
            ? formLoginsMap(authTokens.idToken.toString())
            : {};
        const region = getRegionFromIdentityPoolId(authConfig.identityPoolId);
        const getCredentialsForIdentity = createGetCredentialsForIdentityClient({
            endpointResolver: createCognitoIdentityPoolEndpointResolver({
                endpointOverride: authConfig.identityPoolEndpoint,
            }),
        });
        let clientResult;
        try {
            clientResult = await getCredentialsForIdentity({ region }, {
                IdentityId: identityId,
                Logins: logins,
            });
        }
        catch (e) {
            assertServiceError(e);
            throw new AuthError_AuthError(e);
        }
        if (clientResult?.Credentials?.AccessKeyId &&
            clientResult?.Credentials?.SecretKey) {
            this._nextCredentialsRefresh = new Date().getTime() + CREDENTIALS_TTL;
            const res = {
                credentials: {
                    accessKeyId: clientResult.Credentials.AccessKeyId,
                    secretAccessKey: clientResult.Credentials.SecretKey,
                    sessionToken: clientResult.Credentials.SessionToken,
                    expiration: clientResult.Credentials.Expiration,
                },
                identityId,
            };
            if (clientResult.IdentityId) {
                res.identityId = clientResult.IdentityId;
                // note: the following call removes guest identityId from the persistent store (localStorage)
                this._identityIdStore.storeIdentityId({
                    id: clientResult.IdentityId,
                    type: 'primary',
                });
            }
            // Store the credentials in-memory along with the expiration
            this._credentialsAndIdentityId = {
                ...res,
                isAuthenticatedCreds: true,
                associatedIdToken: authTokens.idToken?.toString(),
            };
            return res;
        }
        else {
            throw new AuthError_AuthError({
                name: 'CredentialsException',
                message: `Cognito did not respond with either Credentials, AccessKeyId or SecretKey.`,
            });
        }
    }
    isPastTTL() {
        return this._nextCredentialsRefresh === undefined
            ? true
            : this._nextCredentialsRefresh <= Date.now();
    }
    hasTokenChanged(tokens) {
        return (!!tokens &&
            !!this._credentialsAndIdentityId?.associatedIdToken &&
            tokens.idToken?.toString() !==
                this._credentialsAndIdentityId.associatedIdToken);
    }
}


//# sourceMappingURL=credentialsProvider.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/types.mjs
const AuthTokenStorageKeys = {
    accessToken: 'accessToken',
    idToken: 'idToken',
    oidcProvider: 'oidcProvider',
    clockDrift: 'clockDrift',
    refreshToken: 'refreshToken',
    deviceKey: 'deviceKey',
    randomPasswordKey: 'randomPasswordKey',
    deviceGroupKey: 'deviceGroupKey',
    signInDetails: 'signInDetails',
    oauthMetadata: 'oauthMetadata',
};


//# sourceMappingURL=types.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/errorHelpers.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var TokenProviderErrorCode;
(function (TokenProviderErrorCode) {
    TokenProviderErrorCode["InvalidAuthTokens"] = "InvalidAuthTokens";
})(TokenProviderErrorCode || (TokenProviderErrorCode = {}));
const tokenValidationErrorMap = {
    [TokenProviderErrorCode.InvalidAuthTokens]: {
        message: 'Invalid tokens.',
        recoverySuggestion: 'Make sure the tokens are valid.',
    },
};
const errorHelpers_assert = createAssertionFunction(tokenValidationErrorMap);


//# sourceMappingURL=errorHelpers.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/constants.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const AUTH_KEY_PREFIX = 'CognitoIdentityServiceProvider';


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/TokenStore.mjs






class DefaultTokenStore {
    getKeyValueStorage() {
        if (!this.keyValueStorage) {
            throw new AuthError_AuthError({
                name: 'KeyValueStorageNotFoundException',
                message: 'KeyValueStorage was not found in TokenStore',
            });
        }
        return this.keyValueStorage;
    }
    setKeyValueStorage(keyValueStorage) {
        this.keyValueStorage = keyValueStorage;
    }
    setAuthConfig(authConfig) {
        this.authConfig = authConfig;
    }
    async loadTokens() {
        // TODO(v6): migration logic should be here
        // Reading V5 tokens old format
        try {
            const authKeys = await this.getAuthKeys();
            const accessTokenString = await this.getKeyValueStorage().getItem(authKeys.accessToken);
            if (!accessTokenString) {
                throw new AuthError_AuthError({
                    name: 'NoSessionFoundException',
                    message: 'Auth session was not found. Make sure to call signIn.',
                });
            }
            const accessToken = decodeJWT(accessTokenString);
            const itString = await this.getKeyValueStorage().getItem(authKeys.idToken);
            const idToken = itString ? decodeJWT(itString) : undefined;
            const refreshToken = (await this.getKeyValueStorage().getItem(authKeys.refreshToken)) ??
                undefined;
            const clockDriftString = (await this.getKeyValueStorage().getItem(authKeys.clockDrift)) ?? '0';
            const clockDrift = Number.parseInt(clockDriftString);
            const signInDetails = await this.getKeyValueStorage().getItem(authKeys.signInDetails);
            const tokens = {
                accessToken,
                idToken,
                refreshToken,
                deviceMetadata: (await this.getDeviceMetadata()) ?? undefined,
                clockDrift,
                username: await this.getLastAuthUser(),
            };
            if (signInDetails) {
                tokens.signInDetails = JSON.parse(signInDetails);
            }
            return tokens;
        }
        catch (err) {
            return null;
        }
    }
    async storeTokens(tokens) {
        errorHelpers_assert(tokens !== undefined, TokenProviderErrorCode.InvalidAuthTokens);
        const lastAuthUser = tokens.username;
        await this.getKeyValueStorage().setItem(this.getLastAuthUserKey(), lastAuthUser);
        const authKeys = await this.getAuthKeys();
        await this.getKeyValueStorage().setItem(authKeys.accessToken, tokens.accessToken.toString());
        if (tokens.idToken) {
            await this.getKeyValueStorage().setItem(authKeys.idToken, tokens.idToken.toString());
        }
        else {
            await this.getKeyValueStorage().removeItem(authKeys.idToken);
        }
        if (tokens.refreshToken) {
            await this.getKeyValueStorage().setItem(authKeys.refreshToken, tokens.refreshToken);
        }
        else {
            await this.getKeyValueStorage().removeItem(authKeys.refreshToken);
        }
        if (tokens.deviceMetadata) {
            if (tokens.deviceMetadata.deviceKey) {
                await this.getKeyValueStorage().setItem(authKeys.deviceKey, tokens.deviceMetadata.deviceKey);
            }
            if (tokens.deviceMetadata.deviceGroupKey) {
                await this.getKeyValueStorage().setItem(authKeys.deviceGroupKey, tokens.deviceMetadata.deviceGroupKey);
            }
            await this.getKeyValueStorage().setItem(authKeys.randomPasswordKey, tokens.deviceMetadata.randomPassword);
        }
        if (tokens.signInDetails) {
            await this.getKeyValueStorage().setItem(authKeys.signInDetails, JSON.stringify(tokens.signInDetails));
        }
        else {
            await this.getKeyValueStorage().removeItem(authKeys.signInDetails);
        }
        await this.getKeyValueStorage().setItem(authKeys.clockDrift, `${tokens.clockDrift}`);
    }
    async clearTokens() {
        const authKeys = await this.getAuthKeys();
        // Not calling clear because it can remove data that is not managed by AuthTokenStore
        await Promise.all([
            this.getKeyValueStorage().removeItem(authKeys.accessToken),
            this.getKeyValueStorage().removeItem(authKeys.idToken),
            this.getKeyValueStorage().removeItem(authKeys.clockDrift),
            this.getKeyValueStorage().removeItem(authKeys.refreshToken),
            this.getKeyValueStorage().removeItem(authKeys.signInDetails),
            this.getKeyValueStorage().removeItem(this.getLastAuthUserKey()),
            this.getKeyValueStorage().removeItem(authKeys.oauthMetadata),
        ]);
    }
    async getDeviceMetadata(username) {
        const authKeys = await this.getAuthKeys(username);
        const deviceKey = await this.getKeyValueStorage().getItem(authKeys.deviceKey);
        const deviceGroupKey = await this.getKeyValueStorage().getItem(authKeys.deviceGroupKey);
        const randomPassword = await this.getKeyValueStorage().getItem(authKeys.randomPasswordKey);
        return randomPassword && deviceGroupKey && deviceKey
            ? {
                deviceKey,
                deviceGroupKey,
                randomPassword,
            }
            : null;
    }
    async clearDeviceMetadata(username) {
        const authKeys = await this.getAuthKeys(username);
        await Promise.all([
            this.getKeyValueStorage().removeItem(authKeys.deviceKey),
            this.getKeyValueStorage().removeItem(authKeys.deviceGroupKey),
            this.getKeyValueStorage().removeItem(authKeys.randomPasswordKey),
        ]);
    }
    async getAuthKeys(username) {
        utils_assertTokenProviderConfig(this.authConfig?.Cognito);
        const lastAuthUser = username ?? (await this.getLastAuthUser());
        return createKeysForAuthStorage(AUTH_KEY_PREFIX, `${this.authConfig.Cognito.userPoolClientId}.${lastAuthUser}`);
    }
    getLastAuthUserKey() {
        utils_assertTokenProviderConfig(this.authConfig?.Cognito);
        const identifier = this.authConfig.Cognito.userPoolClientId;
        return `${AUTH_KEY_PREFIX}.${identifier}.LastAuthUser`;
    }
    async getLastAuthUser() {
        const lastAuthUser = (await this.getKeyValueStorage().getItem(this.getLastAuthUserKey())) ??
            'username';
        return lastAuthUser;
    }
    async setOAuthMetadata(metadata) {
        const { oauthMetadata: oauthMetadataKey } = await this.getAuthKeys();
        await this.getKeyValueStorage().setItem(oauthMetadataKey, JSON.stringify(metadata));
    }
    async getOAuthMetadata() {
        const { oauthMetadata: oauthMetadataKey } = await this.getAuthKeys();
        const oauthMetadata = await this.getKeyValueStorage().getItem(oauthMetadataKey);
        return oauthMetadata && JSON.parse(oauthMetadata);
    }
}
const createKeysForAuthStorage = (provider, identifier) => {
    return getAuthStorageKeys(AuthTokenStorageKeys)(`${provider}`, identifier);
};
function getAuthStorageKeys(authKeys) {
    const keys = Object.values({ ...authKeys });
    return (prefix, identifier) => keys.reduce((acc, authKey) => ({
        ...acc,
        [authKey]: `${prefix}.${identifier}.${authKey}`,
    }), {});
}


//# sourceMappingURL=TokenStore.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/credentialsProvider/types.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const IdentityIdStorageKeys = {
    identityId: 'identityId',
};


//# sourceMappingURL=types.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/credentialsProvider/IdentityIdStore.mjs





// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const IdentityIdStore_logger = new ConsoleLogger('DefaultIdentityIdStore');
class DefaultIdentityIdStore {
    setAuthConfig(authConfigParam) {
        assertIdentityPoolIdConfig(authConfigParam.Cognito);
        this.authConfig = authConfigParam;
        this._authKeys = IdentityIdStore_createKeysForAuthStorage('Cognito', authConfigParam.Cognito.identityPoolId);
    }
    constructor(keyValueStorage) {
        this._authKeys = {};
        this._hasGuestIdentityId = false;
        this.keyValueStorage = keyValueStorage;
    }
    async loadIdentityId() {
        assertIdentityPoolIdConfig(this.authConfig?.Cognito);
        try {
            if (this._primaryIdentityId) {
                return {
                    id: this._primaryIdentityId,
                    type: 'primary',
                };
            }
            else {
                const storedIdentityId = await this.keyValueStorage.getItem(this._authKeys.identityId);
                if (storedIdentityId) {
                    this._hasGuestIdentityId = true;
                    return {
                        id: storedIdentityId,
                        type: 'guest',
                    };
                }
                return null;
            }
        }
        catch (err) {
            IdentityIdStore_logger.log('Error getting stored IdentityId.', err);
            return null;
        }
    }
    async storeIdentityId(identity) {
        assertIdentityPoolIdConfig(this.authConfig?.Cognito);
        if (identity.type === 'guest') {
            this.keyValueStorage.setItem(this._authKeys.identityId, identity.id);
            // Clear in-memory storage of primary identityId
            this._primaryIdentityId = undefined;
            this._hasGuestIdentityId = true;
        }
        else {
            this._primaryIdentityId = identity.id;
            // Clear locally stored guest id
            if (this._hasGuestIdentityId) {
                this.keyValueStorage.removeItem(this._authKeys.identityId);
                this._hasGuestIdentityId = false;
            }
        }
    }
    async clearIdentityId() {
        this._primaryIdentityId = undefined;
        await this.keyValueStorage.removeItem(this._authKeys.identityId);
    }
}
const IdentityIdStore_createKeysForAuthStorage = (provider, identifier) => {
    return getAuthStorageKeys(IdentityIdStorageKeys)(`com.amplify.${provider}`, identifier);
};


//# sourceMappingURL=IdentityIdStore.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/credentialsProvider/index.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Cognito specific implmentation of the CredentialsProvider interface
 * that manages setting and getting of AWS Credentials.
 *
 * @throws configuration expections: `InvalidIdentityPoolIdException`
 *  - Auth errors that may arise from misconfiguration.
 * @throws service expections: {@link GetCredentialsForIdentityException}, {@link GetIdException}
 *
 */
const cognitoCredentialsProvider = new CognitoAWSCredentialsAndIdentityIdProvider(new DefaultIdentityIdStore(defaultStorage));


//# sourceMappingURL=index.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/deDupeAsyncFunction.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * returns in-flight promise if there is one
 *
 * @param asyncFunction - asyncFunction to be deduped.
 * @returns - the return type of the callback
 */
const deDupeAsyncFunction = (asyncFunction) => {
    let inflightPromise;
    return async (...args) => {
        if (inflightPromise)
            return inflightPromise;
        inflightPromise = new Promise((resolve, reject) => {
            asyncFunction(...args)
                .then(result => {
                resolve(result);
            })
                .catch(error => {
                reject(error);
            })
                .finally(() => {
                inflightPromise = undefined;
            });
        });
        return inflightPromise;
    };
};


//# sourceMappingURL=deDupeAsyncFunction.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/serde/createUserPoolSerializer.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createUserPoolSerializer = (operation) => (input, endpoint) => {
    const headers = createUserPoolSerializer_getSharedHeaders(operation);
    const body = JSON.stringify(input);
    return createUserPoolSerializer_buildHttpRpcRequest(endpoint, headers, body);
};
const createUserPoolSerializer_getSharedHeaders = (operation) => ({
    'content-type': 'application/x-amz-json-1.1',
    'x-amz-target': `AWSCognitoIdentityProviderService.${operation}`,
});
const createUserPoolSerializer_buildHttpRpcRequest = ({ url }, headers, body) => ({
    headers,
    url,
    body,
    method: 'POST',
});


//# sourceMappingURL=createUserPoolSerializer.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/serde/createUserPoolDeserializer.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createUserPoolDeserializer = () => async (response) => {
    if (response.statusCode >= 300) {
        const error = await parseJsonError(response);
        assertServiceError(error);
        throw new AuthError_AuthError({
            name: error.name,
            message: error.message,
            metadata: error.$metadata,
        });
    }
    return parseJsonBody(response);
};


//# sourceMappingURL=createUserPoolDeserializer.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * A Cognito Identity-specific middleware that disables caching for all requests.
 */
const disableCacheMiddlewareFactory = () => (next, _) => async function disableCacheMiddleware(request) {
    request.headers['cache-control'] = 'no-store';
    return next(request);
};
/**
 * A Cognito Identity-specific transfer handler that does NOT sign requests, and
 * disables caching.
 *
 * @internal
 */
const cognitoUserPoolTransferHandler = composeTransferHandler(unauthenticatedHandler, [disableCacheMiddlewareFactory]);


//# sourceMappingURL=cognitoUserPoolTransferHandler.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/constants.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * The service name used to sign requests if the API requires authentication.
 */
const COGNITO_IDP_SERVICE_NAME = 'cognito-idp';


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const constants_DEFAULT_SERVICE_CLIENT_API_CONFIG = {
    service: COGNITO_IDP_SERVICE_NAME,
    retryDecider: getRetryDecider(parseJsonError),
    computeDelay: jitteredBackoff_jitteredBackoff,
    get userAgentValue() {
        return getAmplifyUserAgent();
    },
    cache: 'no-store',
};


//# sourceMappingURL=constants.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createInitiateAuthClient.mjs








// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createInitiateAuthClient_createInitiateAuthClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer('InitiateAuth'), createUserPoolDeserializer(), {
    ...constants_DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});


//# sourceMappingURL=createInitiateAuthClient.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/cognitoUserPoolEndpointResolver.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const cognitoUserPoolEndpointResolver = ({ region, }) => ({
    url: new amplifyUrl_AmplifyUrl(`https://${COGNITO_IDP_SERVICE_NAME}.${region}.${getDnsSuffix(region)}`),
});


//# sourceMappingURL=cognitoUserPoolEndpointResolver.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/factories/createCognitoUserPoolEndpointResolver.mjs



const createCognitoUserPoolEndpointResolver_createCognitoUserPoolEndpointResolver = ({ endpointOverride }) => (input) => {
    if (endpointOverride) {
        return { url: new amplifyUrl_AmplifyUrl(endpointOverride) };
    }
    return cognitoUserPoolEndpointResolver(input);
};


//# sourceMappingURL=createCognitoUserPoolEndpointResolver.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/userContextData.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function userContextData_getUserContextData({ username, userPoolId, userPoolClientId, }) {
    if (typeof window === 'undefined') {
        return undefined;
    }
    const amazonCognitoAdvancedSecurityData = window
        .AmazonCognitoAdvancedSecurityData;
    if (typeof amazonCognitoAdvancedSecurityData === 'undefined') {
        return undefined;
    }
    const advancedSecurityData = amazonCognitoAdvancedSecurityData.getData(username, userPoolId, userPoolClientId);
    if (advancedSecurityData) {
        const userContextData = {
            EncodedData: advancedSecurityData,
        };
        return userContextData;
    }
    return {};
}


//# sourceMappingURL=userContextData.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/refreshAuthTokens.mjs
















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const refreshAuthTokensFunction = async ({ tokens, authConfig, username, }) => {
    utils_assertTokenProviderConfig(authConfig?.Cognito);
    const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig.Cognito;
    const region = regionParsers_getRegionFromUserPoolId(userPoolId);
    assertAuthTokensWithRefreshToken(tokens);
    const refreshTokenString = tokens.refreshToken;
    const AuthParameters = {
        REFRESH_TOKEN: refreshTokenString,
    };
    if (tokens.deviceMetadata?.deviceKey) {
        AuthParameters.DEVICE_KEY = tokens.deviceMetadata.deviceKey;
    }
    const UserContextData = userContextData_getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const initiateAuth = createInitiateAuthClient_createInitiateAuthClient({
        endpointResolver: createCognitoUserPoolEndpointResolver_createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { AuthenticationResult } = await initiateAuth({ region }, {
        ClientId: userPoolClientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters,
        UserContextData,
    });
    const accessToken = decodeJWT(AuthenticationResult?.AccessToken ?? '');
    const idToken = AuthenticationResult?.IdToken
        ? decodeJWT(AuthenticationResult.IdToken)
        : undefined;
    const { iat } = accessToken.payload;
    // This should never happen. If it does, it's a bug from the service.
    if (!iat) {
        throw new AuthError_AuthError({
            name: 'iatNotFoundException',
            message: 'iat not found in access token',
        });
    }
    const clockDrift = iat * 1000 - new Date().getTime();
    return {
        accessToken,
        idToken,
        clockDrift,
        refreshToken: refreshTokenString,
        username,
    };
};
const refreshAuthTokens = deDupeAsyncFunction(refreshAuthTokensFunction);
const refreshAuthTokensWithoutDedupe = (/* unused pure expression or super */ null && (refreshAuthTokensFunction));


//# sourceMappingURL=refreshAuthTokens.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/isBrowser.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const isBrowser = () => typeof window !== 'undefined' && typeof window.document !== 'undefined';


//# sourceMappingURL=isBrowser.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/isTokenExpired.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function isTokenExpired({ expiresAt, clockDrift, tolerance = 5000, }) {
    const currentTime = Date.now();
    return currentTime + clockDrift + tolerance > expiresAt;
}


//# sourceMappingURL=isTokenExpired.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/signInWithRedirectStore.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const V5_HOSTED_UI_KEY = 'amplify-signin-with-hostedUI';
const signInWithRedirectStore_name = 'CognitoIdentityServiceProvider';
class DefaultOAuthStore {
    constructor(keyValueStorage) {
        this.keyValueStorage = keyValueStorage;
    }
    async clearOAuthInflightData() {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        await Promise.all([
            this.keyValueStorage.removeItem(authKeys.inflightOAuth),
            this.keyValueStorage.removeItem(authKeys.oauthPKCE),
            this.keyValueStorage.removeItem(authKeys.oauthState),
        ]);
    }
    async clearOAuthData() {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        await this.clearOAuthInflightData();
        await this.keyValueStorage.removeItem(V5_HOSTED_UI_KEY); // remove in case a customer migrated an App from v5 to v6
        return this.keyValueStorage.removeItem(authKeys.oauthSignIn);
    }
    loadOAuthState() {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        return this.keyValueStorage.getItem(authKeys.oauthState);
    }
    storeOAuthState(state) {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        return this.keyValueStorage.setItem(authKeys.oauthState, state);
    }
    loadPKCE() {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        return this.keyValueStorage.getItem(authKeys.oauthPKCE);
    }
    storePKCE(pkce) {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        return this.keyValueStorage.setItem(authKeys.oauthPKCE, pkce);
    }
    setAuthConfig(authConfigParam) {
        this.cognitoConfig = authConfigParam;
    }
    async loadOAuthInFlight() {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        return ((await this.keyValueStorage.getItem(authKeys.inflightOAuth)) === 'true');
    }
    async storeOAuthInFlight(inflight) {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        await this.keyValueStorage.setItem(authKeys.inflightOAuth, `${inflight}`);
    }
    async loadOAuthSignIn() {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        const isLegacyHostedUISignIn = await this.keyValueStorage.getItem(V5_HOSTED_UI_KEY);
        const [isOAuthSignIn, preferPrivateSession] = (await this.keyValueStorage.getItem(authKeys.oauthSignIn))?.split(',') ??
            [];
        return {
            isOAuthSignIn: isOAuthSignIn === 'true' || isLegacyHostedUISignIn === 'true',
            preferPrivateSession: preferPrivateSession === 'true',
        };
    }
    async storeOAuthSignIn(oauthSignIn, preferPrivateSession = false) {
        utils_assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = signInWithRedirectStore_createKeysForAuthStorage(signInWithRedirectStore_name, this.cognitoConfig.userPoolClientId);
        await this.keyValueStorage.setItem(authKeys.oauthSignIn, `${oauthSignIn},${preferPrivateSession}`);
    }
}
const signInWithRedirectStore_createKeysForAuthStorage = (provider, identifier) => {
    return getAuthStorageKeys(OAuthStorageKeys)(provider, identifier);
};


//# sourceMappingURL=signInWithRedirectStore.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/oAuthStore.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const oAuthStore = new DefaultOAuthStore(defaultStorage);


//# sourceMappingURL=oAuthStore.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/inflightPromise.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const inflightPromises = [];
const addInflightPromise = (resolver) => {
    inflightPromises.push(resolver);
};
const resolveAndClearInflightPromises = () => {
    while (inflightPromises.length) {
        inflightPromises.pop()?.();
    }
};


//# sourceMappingURL=inflightPromise.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/TokenOrchestrator.mjs







// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class TokenOrchestrator {
    constructor() {
        this.waitForInflightOAuth = isBrowser()
            ? async () => {
                if (!(await oAuthStore.loadOAuthInFlight())) {
                    return;
                }
                if (this.inflightPromise) {
                    return this.inflightPromise;
                }
                // when there is valid oauth config and there is an inflight oauth flow, try
                // to block async calls that require fetching tokens before the oauth flow completes
                // e.g. getCurrentUser, fetchAuthSession etc.
                this.inflightPromise = new Promise((resolve, _reject) => {
                    addInflightPromise(resolve);
                });
                return this.inflightPromise;
            }
            : async () => {
                // no-op for non-browser environments
            };
    }
    setAuthConfig(authConfig) {
        oAuthStore.setAuthConfig(authConfig.Cognito);
        this.authConfig = authConfig;
    }
    setTokenRefresher(tokenRefresher) {
        this.tokenRefresher = tokenRefresher;
    }
    setAuthTokenStore(tokenStore) {
        this.tokenStore = tokenStore;
    }
    getTokenStore() {
        if (!this.tokenStore) {
            throw new AuthError_AuthError({
                name: 'EmptyTokenStoreException',
                message: 'TokenStore not set',
            });
        }
        return this.tokenStore;
    }
    getTokenRefresher() {
        if (!this.tokenRefresher) {
            throw new AuthError_AuthError({
                name: 'EmptyTokenRefresherException',
                message: 'TokenRefresher not set',
            });
        }
        return this.tokenRefresher;
    }
    async getTokens(options) {
        let tokens;
        try {
            utils_assertTokenProviderConfig(this.authConfig?.Cognito);
        }
        catch (_err) {
            // Token provider not configured
            return null;
        }
        await this.waitForInflightOAuth();
        this.inflightPromise = undefined;
        tokens = await this.getTokenStore().loadTokens();
        const username = await this.getTokenStore().getLastAuthUser();
        if (tokens === null) {
            return null;
        }
        const idTokenExpired = !!tokens?.idToken &&
            isTokenExpired({
                expiresAt: (tokens.idToken?.payload?.exp ?? 0) * 1000,
                clockDrift: tokens.clockDrift ?? 0,
            });
        const accessTokenExpired = isTokenExpired({
            expiresAt: (tokens.accessToken?.payload?.exp ?? 0) * 1000,
            clockDrift: tokens.clockDrift ?? 0,
        });
        if (options?.forceRefresh || idTokenExpired || accessTokenExpired) {
            tokens = await this.refreshTokens({
                tokens,
                username,
            });
            if (tokens === null) {
                return null;
            }
        }
        return {
            accessToken: tokens?.accessToken,
            idToken: tokens?.idToken,
            signInDetails: tokens?.signInDetails,
        };
    }
    async refreshTokens({ tokens, username, }) {
        try {
            const { signInDetails } = tokens;
            const newTokens = await this.getTokenRefresher()({
                tokens,
                authConfig: this.authConfig,
                username,
            });
            newTokens.signInDetails = signInDetails;
            await this.setTokens({ tokens: newTokens });
            Hub.dispatch('auth', { event: 'tokenRefresh' }, 'Auth', AMPLIFY_SYMBOL);
            return newTokens;
        }
        catch (err) {
            return this.handleErrors(err);
        }
    }
    handleErrors(err) {
        assertServiceError(err);
        if (err.name !== AmplifyErrorCode.NetworkError) {
            // TODO(v6): Check errors on client
            this.clearTokens();
        }
        Hub.dispatch('auth', {
            event: 'tokenRefresh_failure',
            data: { error: err },
        }, 'Auth', AMPLIFY_SYMBOL);
        if (err.name.startsWith('NotAuthorizedException')) {
            return null;
        }
        throw err;
    }
    async setTokens({ tokens }) {
        return this.getTokenStore().storeTokens(tokens);
    }
    async clearTokens() {
        return this.getTokenStore().clearTokens();
    }
    getDeviceMetadata(username) {
        return this.getTokenStore().getDeviceMetadata(username);
    }
    clearDeviceMetadata(username) {
        return this.getTokenStore().clearDeviceMetadata(username);
    }
    setOAuthMetadata(metadata) {
        return this.getTokenStore().setOAuthMetadata(metadata);
    }
    getOAuthMetadata() {
        return this.getTokenStore().getOAuthMetadata();
    }
}


//# sourceMappingURL=TokenOrchestrator.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/CognitoUserPoolsTokenProvider.mjs





// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class CognitoUserPoolsTokenProvider {
    constructor() {
        this.authTokenStore = new DefaultTokenStore();
        this.authTokenStore.setKeyValueStorage(defaultStorage);
        this.tokenOrchestrator = new TokenOrchestrator();
        this.tokenOrchestrator.setAuthTokenStore(this.authTokenStore);
        this.tokenOrchestrator.setTokenRefresher(refreshAuthTokens);
    }
    getTokens({ forceRefresh } = { forceRefresh: false }) {
        return this.tokenOrchestrator.getTokens({ forceRefresh });
    }
    setKeyValueStorage(keyValueStorage) {
        this.authTokenStore.setKeyValueStorage(keyValueStorage);
    }
    setAuthConfig(authConfig) {
        this.authTokenStore.setAuthConfig(authConfig);
        this.tokenOrchestrator.setAuthConfig(authConfig);
    }
}


//# sourceMappingURL=CognitoUserPoolsTokenProvider.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/tokenProvider.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * The default provider for the JWT access token and ID token issued from the configured Cognito user pool. It manages
 * the refresh and storage of the tokens. It stores the tokens in `window.localStorage` if available, and falls back to
 * in-memory storage if not.
 */
const cognitoUserPoolsTokenProvider = new CognitoUserPoolsTokenProvider();
const { tokenOrchestrator } = cognitoUserPoolsTokenProvider;


//# sourceMappingURL=tokenProvider.mjs.map

;// ./node_modules/aws-amplify/dist/esm/initSingleton.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const DefaultAmplify = {
    /**
     * Configures Amplify with the {@link resourceConfig} and {@link libraryOptions}.
     *
     * @param resourceConfig The {@link ResourcesConfig} object that is typically imported from the
     * `amplifyconfiguration.json` file. It can also be an object literal created inline when calling `Amplify.configure`.
     * @param libraryOptions The {@link LibraryOptions} additional options for the library.
     *
     * @example
     * import config from './amplifyconfiguration.json';
     *
     * Amplify.configure(config);
     */
    configure(resourceConfig, libraryOptions) {
        const resolvedResourceConfig = parseAmplifyConfig(resourceConfig);
        const cookieBasedKeyValueStorage = new CookieStorage({ sameSite: 'lax' });
        const resolvedKeyValueStorage = libraryOptions?.ssr
            ? cookieBasedKeyValueStorage
            : defaultStorage;
        const resolvedCredentialsProvider = libraryOptions?.ssr
            ? new CognitoAWSCredentialsAndIdentityIdProvider(new DefaultIdentityIdStore(cookieBasedKeyValueStorage))
            : cognitoCredentialsProvider;
        // If no Auth config is provided, no special handling will be required, configure as is.
        // Otherwise, we can assume an Auth config is provided from here on.
        if (!resolvedResourceConfig.Auth) {
            Amplify_Amplify.configure(resolvedResourceConfig, libraryOptions);
            return;
        }
        // If Auth options are provided, always just configure as is.
        // Otherwise, we can assume no Auth libraryOptions were provided from here on.
        if (libraryOptions?.Auth) {
            Amplify_Amplify.configure(resolvedResourceConfig, libraryOptions);
            return;
        }
        // If no Auth libraryOptions were previously configured, then always add default providers.
        if (!Amplify_Amplify.libraryOptions.Auth) {
            cognitoUserPoolsTokenProvider.setAuthConfig(resolvedResourceConfig.Auth);
            cognitoUserPoolsTokenProvider.setKeyValueStorage(
            // TODO: allow configure with a public interface
            resolvedKeyValueStorage);
            Amplify_Amplify.configure(resolvedResourceConfig, {
                ...libraryOptions,
                Auth: {
                    tokenProvider: cognitoUserPoolsTokenProvider,
                    credentialsProvider: resolvedCredentialsProvider,
                },
            });
            return;
        }
        // At this point, Auth libraryOptions would have been previously configured and no overriding
        // Auth options were given, so we should preserve the currently configured Auth libraryOptions.
        if (libraryOptions) {
            const authLibraryOptions = Amplify_Amplify.libraryOptions.Auth;
            // If ssr is provided through libraryOptions, we should respect the intentional reconfiguration.
            if (libraryOptions.ssr !== undefined) {
                cognitoUserPoolsTokenProvider.setKeyValueStorage(
                // TODO: allow configure with a public interface
                resolvedKeyValueStorage);
                authLibraryOptions.credentialsProvider = resolvedCredentialsProvider;
            }
            Amplify_Amplify.configure(resolvedResourceConfig, {
                Auth: authLibraryOptions,
                ...libraryOptions,
            });
            return;
        }
        // Finally, if there were no libraryOptions given at all, we should simply not touch the currently
        // configured libraryOptions.
        Amplify_Amplify.configure(resolvedResourceConfig);
    },
    /**
     * Returns the {@link ResourcesConfig} object passed in as the `resourceConfig` parameter when calling
     * `Amplify.configure`.
     *
     * @returns An {@link ResourcesConfig} object.
     */
    getConfig() {
        return Amplify_Amplify.getConfig();
    },
};


//# sourceMappingURL=initSingleton.mjs.map

;// ./constants/auth.js
var USER_POOL_CLIENT_ID = "lmckmqd7bndat4ot0ajl7u2uk";
var USER_POOL_ID = "us-west-1_G8hKy1gmb";
var AUTH_DOMAIN = "auth.measuringcontest.com";
var AUTH_SCOPES = ["openid", "email", "profile"];
var COGNITO_RESPONSE_TYPE = 'code';
var cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: AUTH_DOMAIN,
          scopes: AUTH_SCOPES,
          redirectSignIn: typeof window === 'undefined' ? null : [window.origin],
          redirectSignOut: typeof window === 'undefined' ? null : [window.origin],
          responseType: COGNITO_RESPONSE_TYPE
        }
      }
    }
  }
};
;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/internal/getCurrentUser.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getCurrentUser = async (amplify) => {
    const authConfig = amplify.getConfig().Auth?.Cognito;
    utils_assertTokenProviderConfig(authConfig);
    const tokens = await amplify.Auth.getTokens({ forceRefresh: false });
    assertAuthTokens(tokens);
    const { 'cognito:username': username, sub } = tokens.idToken?.payload ?? {};
    const authUser = {
        username: username,
        userId: sub,
    };
    const signInDetails = getSignInDetailsFromTokens(tokens);
    if (signInDetails) {
        authUser.signInDetails = signInDetails;
    }
    return authUser;
};
function getSignInDetailsFromTokens(tokens) {
    return tokens?.signInDetails;
}


//# sourceMappingURL=getCurrentUser.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/getCurrentUser.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Gets the current user from the idToken.
 *
 * @param input -  The GetCurrentUserInput object.
 * @returns GetCurrentUserOutput
 * @throws - {@link InitiateAuthException} - Thrown when the service fails to refresh the tokens.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
const getCurrentUser_getCurrentUser = async () => {
    return getCurrentUser(Amplify_Amplify);
};


//# sourceMappingURL=getCurrentUser.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/urlSafeEncode.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function urlSafeEncode(str) {
    return str
        .split('')
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
}


//# sourceMappingURL=urlSafeEncode.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/utils/getAuthUserAgentValue.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getAuthUserAgentValue_getAuthUserAgentValue = (action, customUserAgentDetails) => getAmplifyUserAgent({
    category: Category.Auth,
    action,
    ...customUserAgentDetails,
});


//# sourceMappingURL=getAuthUserAgentValue.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/urlSafeDecode.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function urlSafeDecode(hex) {
    const matchArr = hex.match(/.{2}/g) || [];
    return matchArr.map(char => String.fromCharCode(parseInt(char, 16))).join('');
}


//# sourceMappingURL=urlSafeDecode.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/cacheTokens.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function cacheCognitoTokens(AuthenticationResult) {
    if (AuthenticationResult.AccessToken) {
        const accessToken = decodeJWT(AuthenticationResult.AccessToken);
        const accessTokenIssuedAtInMillis = (accessToken.payload.iat || 0) * 1000;
        const currentTime = new Date().getTime();
        const clockDrift = accessTokenIssuedAtInMillis > 0
            ? accessTokenIssuedAtInMillis - currentTime
            : 0;
        let idToken;
        let refreshToken;
        let deviceMetadata;
        if (AuthenticationResult.RefreshToken) {
            refreshToken = AuthenticationResult.RefreshToken;
        }
        if (AuthenticationResult.IdToken) {
            idToken = decodeJWT(AuthenticationResult.IdToken);
        }
        if (AuthenticationResult?.NewDeviceMetadata) {
            deviceMetadata = AuthenticationResult.NewDeviceMetadata;
        }
        const tokens = {
            accessToken,
            idToken,
            refreshToken,
            clockDrift,
            deviceMetadata,
            username: AuthenticationResult.username,
        };
        if (AuthenticationResult?.signInDetails) {
            tokens.signInDetails = AuthenticationResult.signInDetails;
        }
        await tokenOrchestrator.setTokens({
            tokens,
        });
    }
    else {
        // This would be a service error
        throw new AmplifyError({
            message: 'Invalid tokens',
            name: 'InvalidTokens',
            recoverySuggestion: 'Check Cognito UserPool settings',
        });
    }
}


//# sourceMappingURL=cacheTokens.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/dispatchSignedInHubEvent.mjs






// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const ERROR_MESSAGE = 'Unable to get user session following successful sign-in.';
const dispatchSignedInHubEvent = async () => {
    try {
        Hub.dispatch('auth', {
            event: 'signedIn',
            data: await getCurrentUser_getCurrentUser(),
        }, 'Auth', AMPLIFY_SYMBOL);
    }
    catch (error) {
        if (error.name === USER_UNAUTHENTICATED_EXCEPTION) {
            throw new AuthError_AuthError({
                name: UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION,
                message: ERROR_MESSAGE,
                recoverySuggestion: 'This most likely is due to auth tokens not being persisted. If you are using cookie store, please ensure cookies can be correctly set from your server.',
            });
        }
        throw error;
    }
};


//# sourceMappingURL=dispatchSignedInHubEvent.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/errors/types/validation.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var validation_AuthValidationErrorCode;
(function (AuthValidationErrorCode) {
    AuthValidationErrorCode["EmptySignInUsername"] = "EmptySignInUsername";
    AuthValidationErrorCode["EmptySignInPassword"] = "EmptySignInPassword";
    AuthValidationErrorCode["CustomAuthSignInPassword"] = "CustomAuthSignInPassword";
    AuthValidationErrorCode["EmptySignUpUsername"] = "EmptySignUpUsername";
    AuthValidationErrorCode["EmptySignUpPassword"] = "EmptySignUpPassword";
    AuthValidationErrorCode["EmptyConfirmSignUpUsername"] = "EmptyConfirmSignUpUsername";
    AuthValidationErrorCode["EmptyConfirmSignUpCode"] = "EmptyConfirmSignUpCode";
    AuthValidationErrorCode["EmptyResendSignUpCodeUsername"] = "EmptyresendSignUpCodeUsername";
    AuthValidationErrorCode["EmptyChallengeResponse"] = "EmptyChallengeResponse";
    AuthValidationErrorCode["EmptyConfirmResetPasswordUsername"] = "EmptyConfirmResetPasswordUsername";
    AuthValidationErrorCode["EmptyConfirmResetPasswordNewPassword"] = "EmptyConfirmResetPasswordNewPassword";
    AuthValidationErrorCode["EmptyConfirmResetPasswordConfirmationCode"] = "EmptyConfirmResetPasswordConfirmationCode";
    AuthValidationErrorCode["EmptyResetPasswordUsername"] = "EmptyResetPasswordUsername";
    AuthValidationErrorCode["EmptyVerifyTOTPSetupCode"] = "EmptyVerifyTOTPSetupCode";
    AuthValidationErrorCode["EmptyConfirmUserAttributeCode"] = "EmptyConfirmUserAttributeCode";
    AuthValidationErrorCode["IncorrectMFAMethod"] = "IncorrectMFAMethod";
    AuthValidationErrorCode["EmptyUpdatePassword"] = "EmptyUpdatePassword";
})(validation_AuthValidationErrorCode || (validation_AuthValidationErrorCode = {}));


//# sourceMappingURL=validation.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/common/AuthErrorStrings.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const validationErrorMap = {
    [validation_AuthValidationErrorCode.EmptyChallengeResponse]: {
        message: 'challengeResponse is required to confirmSignIn',
    },
    [validation_AuthValidationErrorCode.EmptyConfirmResetPasswordUsername]: {
        message: 'username is required to confirmResetPassword',
    },
    [validation_AuthValidationErrorCode.EmptyConfirmSignUpCode]: {
        message: 'code is required to confirmSignUp',
    },
    [validation_AuthValidationErrorCode.EmptyConfirmSignUpUsername]: {
        message: 'username is required to confirmSignUp',
    },
    [validation_AuthValidationErrorCode.EmptyConfirmResetPasswordConfirmationCode]: {
        message: 'confirmationCode is required to confirmResetPassword',
    },
    [validation_AuthValidationErrorCode.EmptyConfirmResetPasswordNewPassword]: {
        message: 'newPassword is required to confirmResetPassword',
    },
    [validation_AuthValidationErrorCode.EmptyResendSignUpCodeUsername]: {
        message: 'username is required to confirmSignUp',
    },
    [validation_AuthValidationErrorCode.EmptyResetPasswordUsername]: {
        message: 'username is required to resetPassword',
    },
    [validation_AuthValidationErrorCode.EmptySignInPassword]: {
        message: 'password is required to signIn',
    },
    [validation_AuthValidationErrorCode.EmptySignInUsername]: {
        message: 'username is required to signIn',
    },
    [validation_AuthValidationErrorCode.EmptySignUpPassword]: {
        message: 'password is required to signUp',
    },
    [validation_AuthValidationErrorCode.EmptySignUpUsername]: {
        message: 'username is required to signUp',
    },
    [validation_AuthValidationErrorCode.CustomAuthSignInPassword]: {
        message: 'A password is not needed when signing in with CUSTOM_WITHOUT_SRP',
        recoverySuggestion: 'Do not include a password in your signIn call.',
    },
    [validation_AuthValidationErrorCode.IncorrectMFAMethod]: {
        message: 'Incorrect MFA method was chosen. It should be either SMS, TOTP, or EMAIL',
        recoverySuggestion: 'Try to pass SMS, TOTP, or EMAIL as the challengeResponse',
    },
    [validation_AuthValidationErrorCode.EmptyVerifyTOTPSetupCode]: {
        message: 'code is required to verifyTotpSetup',
    },
    [validation_AuthValidationErrorCode.EmptyUpdatePassword]: {
        message: 'oldPassword and newPassword are required to changePassword',
    },
    [validation_AuthValidationErrorCode.EmptyConfirmUserAttributeCode]: {
        message: 'confirmation code is required to confirmUserAttribute',
    },
};
// TODO: delete this code when the Auth class is removed.
var AuthErrorStrings;
(function (AuthErrorStrings) {
    AuthErrorStrings["DEFAULT_MSG"] = "Authentication Error";
    AuthErrorStrings["EMPTY_EMAIL"] = "Email cannot be empty";
    AuthErrorStrings["EMPTY_PHONE"] = "Phone number cannot be empty";
    AuthErrorStrings["EMPTY_USERNAME"] = "Username cannot be empty";
    AuthErrorStrings["INVALID_USERNAME"] = "The username should either be a string or one of the sign in types";
    AuthErrorStrings["EMPTY_PASSWORD"] = "Password cannot be empty";
    AuthErrorStrings["EMPTY_CODE"] = "Confirmation code cannot be empty";
    AuthErrorStrings["SIGN_UP_ERROR"] = "Error creating account";
    AuthErrorStrings["NO_MFA"] = "No valid MFA method provided";
    AuthErrorStrings["INVALID_MFA"] = "Invalid MFA type";
    AuthErrorStrings["EMPTY_CHALLENGE"] = "Challenge response cannot be empty";
    AuthErrorStrings["NO_USER_SESSION"] = "Failed to get the session because the user is empty";
    AuthErrorStrings["NETWORK_ERROR"] = "Network Error";
    AuthErrorStrings["DEVICE_CONFIG"] = "Device tracking has not been configured in this User Pool";
    AuthErrorStrings["AUTOSIGNIN_ERROR"] = "Please use your credentials to sign in";
    AuthErrorStrings["OAUTH_ERROR"] = "Couldn't finish OAuth flow, check your User Pool HostedUI settings";
})(AuthErrorStrings || (AuthErrorStrings = {}));
var AuthErrorStrings_AuthErrorCodes;
(function (AuthErrorCodes) {
    AuthErrorCodes["SignInException"] = "SignInException";
    AuthErrorCodes["OAuthSignInError"] = "OAuthSignInException";
})(AuthErrorStrings_AuthErrorCodes || (AuthErrorStrings_AuthErrorCodes = {}));


//# sourceMappingURL=AuthErrorStrings.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/Errors.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// TODO: delete this module when the Auth class is removed.
const Errors_logger = new ConsoleLogger('AuthError');
class Errors_AuthError extends Error {
    constructor(type) {
        const { message, log } = authErrorMessages[type];
        super(message);
        // Hack for making the custom error class work when transpiled to es5
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = Errors_AuthError;
        Object.setPrototypeOf(this, Errors_AuthError.prototype);
        this.name = 'AuthError';
        this.log = log || message;
        Errors_logger.error(this.log);
    }
}
class NoUserPoolError extends Errors_AuthError {
    constructor(type) {
        super(type);
        // Hack for making the custom error class work when transpiled to es5
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = NoUserPoolError;
        Object.setPrototypeOf(this, NoUserPoolError.prototype);
        this.name = 'NoUserPoolError';
    }
}
const authErrorMessages = {
    oauthSignInError: {
        message: AuthErrorStrings.OAUTH_ERROR,
        log: 'Make sure Cognito Hosted UI has been configured correctly',
    },
    noConfig: {
        message: AuthErrorStrings.DEFAULT_MSG,
        log: `
            Error: Amplify has not been configured correctly.
            This error is typically caused by one of the following scenarios:

            1. Make sure you're passing the awsconfig object to Amplify.configure() in your app's entry point
                See https://aws-amplify.github.io/docs/js/authentication#configure-your-app for more information
            
            2. There might be multiple conflicting versions of amplify packages in your node_modules.
				Refer to our docs site for help upgrading Amplify packages (https://docs.amplify.aws/lib/troubleshooting/upgrading/q/platform/js)
        `,
    },
    missingAuthConfig: {
        message: AuthErrorStrings.DEFAULT_MSG,
        log: `
            Error: Amplify has not been configured correctly. 
            The configuration object is missing required auth properties.
            This error is typically caused by one of the following scenarios:

            1. Did you run \`amplify push\` after adding auth via \`amplify add auth\`?
                See https://aws-amplify.github.io/docs/js/authentication#amplify-project-setup for more information

            2. This could also be caused by multiple conflicting versions of amplify packages, see (https://docs.amplify.aws/lib/troubleshooting/upgrading/q/platform/js) for help upgrading Amplify packages.
        `,
    },
    emptyUsername: {
        message: AuthErrorStrings.EMPTY_USERNAME,
    },
    // TODO: should include a list of valid sign-in types
    invalidUsername: {
        message: AuthErrorStrings.INVALID_USERNAME,
    },
    emptyPassword: {
        message: AuthErrorStrings.EMPTY_PASSWORD,
    },
    emptyCode: {
        message: AuthErrorStrings.EMPTY_CODE,
    },
    signUpError: {
        message: AuthErrorStrings.SIGN_UP_ERROR,
        log: 'The first parameter should either be non-null string or object',
    },
    noMFA: {
        message: AuthErrorStrings.NO_MFA,
    },
    invalidMFA: {
        message: AuthErrorStrings.INVALID_MFA,
    },
    emptyChallengeResponse: {
        message: AuthErrorStrings.EMPTY_CHALLENGE,
    },
    noUserSession: {
        message: AuthErrorStrings.NO_USER_SESSION,
    },
    deviceConfig: {
        message: AuthErrorStrings.DEVICE_CONFIG,
    },
    networkError: {
        message: AuthErrorStrings.NETWORK_ERROR,
    },
    autoSignInError: {
        message: AuthErrorStrings.AUTOSIGNIN_ERROR,
    },
    default: {
        message: AuthErrorStrings.DEFAULT_MSG,
    },
};


//# sourceMappingURL=Errors.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/createOAuthError.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createOAuthError = (message, recoverySuggestion) => new AuthError_AuthError({
    message: message ?? 'An error has occurred during the oauth process.',
    name: AuthErrorStrings_AuthErrorCodes.OAuthSignInError,
    recoverySuggestion: recoverySuggestion ?? authErrorMessages.oauthSignInError.log,
});


//# sourceMappingURL=createOAuthError.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/types/Auth.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var AuthErrorTypes;
(function (AuthErrorTypes) {
    AuthErrorTypes["NoConfig"] = "noConfig";
    AuthErrorTypes["MissingAuthConfig"] = "missingAuthConfig";
    AuthErrorTypes["EmptyUsername"] = "emptyUsername";
    AuthErrorTypes["InvalidUsername"] = "invalidUsername";
    AuthErrorTypes["EmptyPassword"] = "emptyPassword";
    AuthErrorTypes["EmptyCode"] = "emptyCode";
    AuthErrorTypes["SignUpError"] = "signUpError";
    AuthErrorTypes["NoMFA"] = "noMFA";
    AuthErrorTypes["InvalidMFA"] = "invalidMFA";
    AuthErrorTypes["EmptyChallengeResponse"] = "emptyChallengeResponse";
    AuthErrorTypes["NoUserSession"] = "noUserSession";
    AuthErrorTypes["Default"] = "default";
    AuthErrorTypes["DeviceConfig"] = "deviceConfig";
    AuthErrorTypes["NetworkError"] = "networkError";
    AuthErrorTypes["AutoSignInError"] = "autoSignInError";
    AuthErrorTypes["OAuthSignInError"] = "oauthSignInError";
})(AuthErrorTypes || (AuthErrorTypes = {}));


//# sourceMappingURL=Auth.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/validateState.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const flowCancelledMessage = '`signInWithRedirect` has been canceled.';
const validationFailedMessage = 'An error occurred while validating the state.';
const validationRecoverySuggestion = 'Try to initiate an OAuth flow from Amplify';
const validateState = async (state) => {
    const savedState = await oAuthStore.loadOAuthState();
    // This is because savedState only exists if the flow was initiated by Amplify
    const validatedState = state === savedState ? savedState : undefined;
    if (!validatedState) {
        throw new AuthError_AuthError({
            name: AuthErrorTypes.OAuthSignInError,
            message: state === null ? flowCancelledMessage : validationFailedMessage,
            recoverySuggestion: state === null ? undefined : validationRecoverySuggestion,
        });
    }
    return validatedState;
};


//# sourceMappingURL=validateState.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/completeOAuthFlow.mjs












// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const completeOAuthFlow = async ({ currentUrl, userAgentValue, clientId, redirectUri, responseType, domain, preferPrivateSession, }) => {
    const urlParams = new amplifyUrl_AmplifyUrl(currentUrl);
    const error = urlParams.searchParams.get('error');
    const errorMessage = urlParams.searchParams.get('error_description');
    if (error) {
        throw createOAuthError(errorMessage ?? error);
    }
    if (responseType === 'code') {
        return handleCodeFlow({
            currentUrl,
            userAgentValue,
            clientId,
            redirectUri,
            domain,
            preferPrivateSession,
        });
    }
    return handleImplicitFlow({
        currentUrl,
        redirectUri,
        preferPrivateSession,
    });
};
const handleCodeFlow = async ({ currentUrl, userAgentValue, clientId, redirectUri, domain, preferPrivateSession, }) => {
    /* Convert URL into an object with parameters as keys
{ redirect_uri: 'http://localhost:3000/', response_type: 'code', ...} */
    const url = new amplifyUrl_AmplifyUrl(currentUrl);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    // if `code` or `state` is not presented in the redirect url, most likely
    // that the end user cancelled the inflight oauth flow by:
    // 1. clicking the back button of browser
    // 2. closing the provider hosted UI page and coming back to the app
    if (!code || !state) {
        throw createOAuthError('User cancelled OAuth flow.');
    }
    // may throw error is being caught in attemptCompleteOAuthFlow.ts
    const validatedState = await validateState(state);
    const oAuthTokenEndpoint = 'https://' + domain + '/oauth2/token';
    // TODO(v6): check hub events
    // dispatchAuthEvent(
    // 	'codeFlow',
    // 	{},
    // 	`Retrieving tokens from ${oAuthTokenEndpoint}`
    // );
    const codeVerifier = await oAuthStore.loadPKCE();
    const oAuthTokenBody = {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
        ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
    };
    const body = Object.entries(oAuthTokenBody)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    const { access_token, refresh_token: refreshToken, id_token, error, error_message: errorMessage, token_type, expires_in, } = await (await fetch(oAuthTokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            [USER_AGENT_HEADER]: userAgentValue,
        },
        body,
    })).json();
    if (error) {
        // error is being caught in attemptCompleteOAuthFlow.ts
        throw createOAuthError(errorMessage ?? error);
    }
    const username = (access_token && decodeJWT(access_token).payload.username) ?? 'username';
    await cacheCognitoTokens({
        username,
        AccessToken: access_token,
        IdToken: id_token,
        RefreshToken: refreshToken});
    return completeFlow({
        redirectUri,
        state: validatedState,
        preferPrivateSession,
    });
};
const handleImplicitFlow = async ({ currentUrl, redirectUri, preferPrivateSession, }) => {
    // hash is `null` if `#` doesn't exist on URL
    const url = new amplifyUrl_AmplifyUrl(currentUrl);
    const { id_token, access_token, state, token_type, expires_in, error_description, error, } = (url.hash ?? '#')
        .substring(1) // Remove # from returned code
        .split('&')
        .map(pairings => pairings.split('='))
        .reduce((accum, [k, v]) => ({ ...accum, [k]: v }), {
        id_token: undefined,
        access_token: undefined,
        state: undefined,
        token_type: undefined,
        expires_in: undefined,
        error_description: undefined,
        error: undefined,
    });
    if (error) {
        throw createOAuthError(error_description ?? error);
    }
    if (!access_token) {
        // error is being caught in attemptCompleteOAuthFlow.ts
        throw createOAuthError('No access token returned from OAuth flow.');
    }
    const validatedState = await validateState(state);
    const username = (access_token && decodeJWT(access_token).payload.username) ?? 'username';
    await cacheCognitoTokens({
        username,
        AccessToken: access_token,
        IdToken: id_token});
    return completeFlow({
        redirectUri,
        state: validatedState,
        preferPrivateSession,
    });
};
const completeFlow = async ({ redirectUri, state, preferPrivateSession, }) => {
    await tokenOrchestrator.setOAuthMetadata({
        oauthSignIn: true,
    });
    await oAuthStore.clearOAuthData();
    await oAuthStore.storeOAuthSignIn(true, preferPrivateSession);
    // this should be called before any call that involves `fetchAuthSession`
    // e.g. `getCurrentUser()` below, so it allows every inflight async calls to
    //  `fetchAuthSession` can be resolved
    resolveAndClearInflightPromises();
    // clear history before sending out final Hub events
    clearHistory(redirectUri);
    if (isCustomState(state)) {
        Hub.dispatch('auth', {
            event: 'customOAuthState',
            data: urlSafeDecode(getCustomState(state)),
        }, 'Auth', AMPLIFY_SYMBOL);
    }
    Hub.dispatch('auth', { event: 'signInWithRedirect' }, 'Auth', AMPLIFY_SYMBOL);
    await dispatchSignedInHubEvent();
};
const isCustomState = (state) => {
    return /-/.test(state);
};
const getCustomState = (state) => {
    return state.split('-').splice(1).join('-');
};
const clearHistory = (redirectUri) => {
    if (typeof window !== 'undefined' && typeof window.history !== 'undefined') {
        window.history.replaceState(window.history.state, '', redirectUri);
    }
};


//# sourceMappingURL=completeOAuthFlow.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/getRedirectUrl.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/** @internal */
function getRedirectUrl_getRedirectUrl(redirects, preferredRedirectUrl) {
    if (preferredRedirectUrl) {
        const redirectUrl = redirects?.find(redirect => redirect === preferredRedirectUrl);
        if (!redirectUrl) {
            throw invalidPreferredRedirectUrlException;
        }
        return redirectUrl;
    }
    else {
        const redirectUrlFromTheSameOrigin = redirects?.find(isSameOriginAndPathName) ??
            redirects?.find(isTheSameDomain);
        const redirectUrlFromDifferentOrigin = redirects?.find(isHttps) ?? redirects?.find(isHttp);
        if (redirectUrlFromTheSameOrigin) {
            return redirectUrlFromTheSameOrigin;
        }
        else if (redirectUrlFromDifferentOrigin) {
            throw invalidOriginException;
        }
        throw invalidRedirectException;
    }
}
// origin + pathname => https://example.com/app
const isSameOriginAndPathName = (redirect) => redirect.startsWith(String(window.location.origin + (window.location.pathname || '/')));
// domain => outlook.live.com, github.com
const isTheSameDomain = (redirect) => redirect.includes(String(window.location.hostname));
const isHttp = (redirect) => redirect.startsWith('http://');
const isHttps = (redirect) => redirect.startsWith('https://');


//# sourceMappingURL=getRedirectUrl.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/handleFailure.mjs





// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const handleFailure = async (error) => {
    resolveAndClearInflightPromises();
    await oAuthStore.clearOAuthInflightData();
    Hub.dispatch('auth', { event: 'signInWithRedirect_failure', data: { error } }, 'Auth', AMPLIFY_SYMBOL);
};


//# sourceMappingURL=handleFailure.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/attemptCompleteOAuthFlow.mjs







// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const attemptCompleteOAuthFlow = async (authConfig) => {
    try {
        utils_assertTokenProviderConfig(authConfig);
        assertOAuthConfig(authConfig);
        oAuthStore.setAuthConfig(authConfig);
    }
    catch (_) {
        // no-op
        // This should not happen as Amplify singleton checks the oauth config key
        // unless the oauth config object doesn't contain required properties
        return;
    }
    // No inflight OAuth
    if (!(await oAuthStore.loadOAuthInFlight())) {
        return;
    }
    try {
        const currentUrl = window.location.href;
        const { loginWith, userPoolClientId } = authConfig;
        const { domain, redirectSignIn, responseType } = loginWith.oauth;
        const redirectUri = getRedirectUrl_getRedirectUrl(redirectSignIn);
        await completeOAuthFlow({
            currentUrl,
            clientId: userPoolClientId,
            domain,
            redirectUri,
            responseType,
            userAgentValue: getAuthUserAgentValue_getAuthUserAgentValue(types_AuthAction.SignInWithRedirect),
        });
    }
    catch (err) {
        await handleFailure(err);
    }
};


//# sourceMappingURL=attemptCompleteOAuthFlow.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/enableOAuthListener.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// attach the side effect for handling the completion of an inflight oauth flow
// this side effect works only on Web
isBrowser() &&
    (() => {
        // add the listener to the singleton for triggering
        Amplify_Amplify[ADD_OAUTH_LISTENER](attemptCompleteOAuthFlow);
    })();
//# sourceMappingURL=enableOAuthListener.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/types/models.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const cognitoHostedUIIdentityProviderMap = {
    Google: 'Google',
    Facebook: 'Facebook',
    Amazon: 'LoginWithAmazon',
    Apple: 'SignInWithApple',
};


//# sourceMappingURL=models.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/utils/openAuthSession.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const openAuthSession = async (url) => {
    if (!window?.location) {
        return;
    }
    // enforce HTTPS
    window.location.href = url.replace('http://', 'https://');
};


//# sourceMappingURL=openAuthSession.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/signInHelpers.mjs




































// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const USER_ATTRIBUTES = 'userAttributes.';
function isWebAuthnResultAuthSignInOutput(result) {
    return 'isSignedIn' in result && 'nextStep' in result;
}
async function handleCustomChallenge({ challengeResponse, clientMetadata, session, username, config, tokenOrchestrator, }) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    const challengeResponses = {
        USERNAME: username,
        ANSWER: challengeResponse,
    };
    const deviceMetadata = await tokenOrchestrator?.getDeviceMetadata(username);
    if (deviceMetadata && deviceMetadata.deviceKey) {
        challengeResponses.DEVICE_KEY = deviceMetadata.deviceKey;
    }
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReq = {
        ChallengeName: 'CUSTOM_CHALLENGE',
        ChallengeResponses: challengeResponses,
        Session: session,
        ClientMetadata: clientMetadata,
        ClientId: userPoolClientId,
        UserContextData,
    };
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const response = await respondToAuthChallenge({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
    }, jsonReq);
    if (response.ChallengeName === 'DEVICE_SRP_AUTH') {
        return handleDeviceSRPAuth({
            username,
            config,
            clientMetadata,
            session: response.Session,
            tokenOrchestrator,
        });
    }
    return response;
}
async function handleMFASetupChallenge({ challengeResponse, username, clientMetadata, session, deviceName, config, }) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    if (challengeResponse === 'EMAIL') {
        return {
            ChallengeName: 'MFA_SETUP',
            Session: session,
            ChallengeParameters: {
                MFAS_CAN_SETUP: '["EMAIL_OTP"]',
            },
            $metadata: {},
        };
    }
    if (challengeResponse === 'TOTP') {
        return {
            ChallengeName: 'MFA_SETUP',
            Session: session,
            ChallengeParameters: {
                MFAS_CAN_SETUP: '["SOFTWARE_TOKEN_MFA"]',
            },
            $metadata: {},
        };
    }
    const challengeResponses = {
        USERNAME: username,
    };
    const isTOTPCode = /^\d+$/.test(challengeResponse);
    if (isTOTPCode) {
        const verifySoftwareToken = createVerifySoftwareTokenClient({
            endpointResolver: createCognitoUserPoolEndpointResolver({
                endpointOverride: userPoolEndpoint,
            }),
        });
        const { Session } = await verifySoftwareToken({
            region: getRegionFromUserPoolId(userPoolId),
            userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
        }, {
            UserCode: challengeResponse,
            Session: session,
            FriendlyDeviceName: deviceName,
        });
        signInStore.dispatch({
            type: 'SET_SIGN_IN_SESSION',
            value: Session,
        });
        const jsonReq = {
            ChallengeName: 'MFA_SETUP',
            ChallengeResponses: challengeResponses,
            Session,
            ClientMetadata: clientMetadata,
            ClientId: userPoolClientId,
        };
        const respondToAuthChallenge = createRespondToAuthChallengeClient({
            endpointResolver: createCognitoUserPoolEndpointResolver({
                endpointOverride: userPoolEndpoint,
            }),
        });
        return respondToAuthChallenge({
            region: getRegionFromUserPoolId(userPoolId),
            userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
        }, jsonReq);
    }
    const isEmail = challengeResponse.includes('@');
    if (isEmail) {
        challengeResponses.EMAIL = challengeResponse;
        const jsonReq = {
            ChallengeName: 'MFA_SETUP',
            ChallengeResponses: challengeResponses,
            Session: session,
            ClientMetadata: clientMetadata,
            ClientId: userPoolClientId,
        };
        const respondToAuthChallenge = createRespondToAuthChallengeClient({
            endpointResolver: createCognitoUserPoolEndpointResolver({
                endpointOverride: userPoolEndpoint,
            }),
        });
        return respondToAuthChallenge({
            region: getRegionFromUserPoolId(userPoolId),
            userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
        }, jsonReq);
    }
    throw new AuthError({
        name: AuthErrorCodes.SignInException,
        message: `Cannot proceed with MFA setup using challengeResponse: ${challengeResponse}`,
        recoverySuggestion: 'Try passing "EMAIL", "TOTP", a valid email, or OTP code as the challengeResponse.',
    });
}
async function handleSelectMFATypeChallenge({ challengeResponse, username, clientMetadata, session, config, }) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    assertValidationError(challengeResponse === 'TOTP' ||
        challengeResponse === 'SMS' ||
        challengeResponse === 'EMAIL', AuthValidationErrorCode.IncorrectMFAMethod);
    const challengeResponses = {
        USERNAME: username,
        ANSWER: mapMfaType(challengeResponse),
    };
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReq = {
        ChallengeName: 'SELECT_MFA_TYPE',
        ChallengeResponses: challengeResponses,
        Session: session,
        ClientMetadata: clientMetadata,
        ClientId: userPoolClientId,
        UserContextData,
    };
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    return respondToAuthChallenge({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
    }, jsonReq);
}
async function handleCompleteNewPasswordChallenge({ challengeResponse, clientMetadata, session, username, requiredAttributes, config, }) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    const challengeResponses = {
        ...createAttributes(requiredAttributes),
        NEW_PASSWORD: challengeResponse,
        USERNAME: username,
    };
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReq = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: challengeResponses,
        ClientMetadata: clientMetadata,
        Session: session,
        ClientId: userPoolClientId,
        UserContextData,
    };
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    return respondToAuthChallenge({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
    }, jsonReq);
}
async function handleUserPasswordAuthFlow(username, password, clientMetadata, config, tokenOrchestrator) {
    const { userPoolClientId, userPoolId, userPoolEndpoint } = config;
    const authParameters = {
        USERNAME: username,
        PASSWORD: password,
    };
    const deviceMetadata = await tokenOrchestrator.getDeviceMetadata(username);
    if (deviceMetadata && deviceMetadata.deviceKey) {
        authParameters.DEVICE_KEY = deviceMetadata.deviceKey;
    }
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReq = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: authParameters,
        ClientMetadata: clientMetadata,
        ClientId: userPoolClientId,
        UserContextData,
    };
    const initiateAuth = createInitiateAuthClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const response = await initiateAuth({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.SignIn),
    }, jsonReq);
    const activeUsername = response.ChallengeParameters?.USERNAME ??
        response.ChallengeParameters?.USER_ID_FOR_SRP ??
        username;
    setActiveSignInUsername(activeUsername);
    if (response.ChallengeName === 'DEVICE_SRP_AUTH')
        return handleDeviceSRPAuth({
            username: activeUsername,
            config,
            clientMetadata,
            session: response.Session,
            tokenOrchestrator,
        });
    return response;
}
async function handleUserSRPAuthFlow(username, password, clientMetadata, config, tokenOrchestrator) {
    return handlePasswordSRP({
        username,
        password,
        clientMetadata,
        config,
        tokenOrchestrator,
        authFlow: 'USER_SRP_AUTH',
    });
}
async function handleCustomAuthFlowWithoutSRP(username, clientMetadata, config, tokenOrchestrator) {
    const { userPoolClientId, userPoolId, userPoolEndpoint } = config;
    const authParameters = {
        USERNAME: username,
    };
    const deviceMetadata = await tokenOrchestrator.getDeviceMetadata(username);
    if (deviceMetadata && deviceMetadata.deviceKey) {
        authParameters.DEVICE_KEY = deviceMetadata.deviceKey;
    }
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReq = {
        AuthFlow: 'CUSTOM_AUTH',
        AuthParameters: authParameters,
        ClientMetadata: clientMetadata,
        ClientId: userPoolClientId,
        UserContextData,
    };
    const initiateAuth = createInitiateAuthClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const response = await initiateAuth({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.SignIn),
    }, jsonReq);
    const activeUsername = response.ChallengeParameters?.USERNAME ?? username;
    setActiveSignInUsername(activeUsername);
    if (response.ChallengeName === 'DEVICE_SRP_AUTH')
        return handleDeviceSRPAuth({
            username: activeUsername,
            config,
            clientMetadata,
            session: response.Session,
            tokenOrchestrator,
        });
    return response;
}
async function handleCustomSRPAuthFlow(username, password, clientMetadata, config, tokenOrchestrator) {
    assertTokenProviderConfig(config);
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    const userPoolName = userPoolId?.split('_')[1] || '';
    const authenticationHelper = await getAuthenticationHelper(userPoolName);
    const authParameters = {
        USERNAME: username,
        SRP_A: authenticationHelper.A.toString(16),
        CHALLENGE_NAME: 'SRP_A',
    };
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReq = {
        AuthFlow: 'CUSTOM_AUTH',
        AuthParameters: authParameters,
        ClientMetadata: clientMetadata,
        ClientId: userPoolClientId,
        UserContextData,
    };
    const initiateAuth = createInitiateAuthClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { ChallengeParameters: challengeParameters, Session: session } = await initiateAuth({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.SignIn),
    }, jsonReq);
    const activeUsername = challengeParameters?.USERNAME ?? username;
    setActiveSignInUsername(activeUsername);
    return retryOnResourceNotFoundException(handlePasswordVerifierChallenge, [
        password,
        challengeParameters,
        clientMetadata,
        session,
        authenticationHelper,
        config,
        tokenOrchestrator,
    ], activeUsername, tokenOrchestrator);
}
async function getSignInResult(params) {
    const { challengeName, challengeParameters, availableChallenges } = params;
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    switch (challengeName) {
        case 'CUSTOM_CHALLENGE':
            return {
                isSignedIn: false,
                nextStep: {
                    signInStep: 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE',
                    additionalInfo: challengeParameters,
                },
            };
        case 'MFA_SETUP': {
            const { signInSession, username } = signInStore.getState();
            const mfaSetupTypes = getMFATypes(parseMFATypes(challengeParameters.MFAS_CAN_SETUP)) || [];
            const allowedMfaSetupTypes = getAllowedMfaSetupTypes(mfaSetupTypes);
            const isTotpMfaSetupAvailable = allowedMfaSetupTypes.includes('TOTP');
            const isEmailMfaSetupAvailable = allowedMfaSetupTypes.includes('EMAIL');
            if (isTotpMfaSetupAvailable && isEmailMfaSetupAvailable) {
                return {
                    isSignedIn: false,
                    nextStep: {
                        signInStep: 'CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION',
                        allowedMFATypes: allowedMfaSetupTypes,
                    },
                };
            }
            if (isEmailMfaSetupAvailable) {
                return {
                    isSignedIn: false,
                    nextStep: {
                        signInStep: 'CONTINUE_SIGN_IN_WITH_EMAIL_SETUP',
                    },
                };
            }
            if (isTotpMfaSetupAvailable) {
                const associateSoftwareToken = createAssociateSoftwareTokenClient({
                    endpointResolver: createCognitoUserPoolEndpointResolver({
                        endpointOverride: authConfig.userPoolEndpoint,
                    }),
                });
                const { Session, SecretCode: secretCode } = await associateSoftwareToken({ region: getRegionFromUserPoolId(authConfig.userPoolId) }, {
                    Session: signInSession,
                });
                signInStore.dispatch({
                    type: 'SET_SIGN_IN_SESSION',
                    value: Session,
                });
                return {
                    isSignedIn: false,
                    nextStep: {
                        signInStep: 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP',
                        totpSetupDetails: getTOTPSetupDetails(secretCode, username),
                    },
                };
            }
            throw new AuthError({
                name: AuthErrorCodes.SignInException,
                message: `Cannot initiate MFA setup from available types: ${mfaSetupTypes}`,
            });
        }
        case 'NEW_PASSWORD_REQUIRED':
            return {
                isSignedIn: false,
                nextStep: {
                    signInStep: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
                    missingAttributes: parseAttributes(challengeParameters.requiredAttributes),
                },
            };
        case 'SELECT_MFA_TYPE':
            return {
                isSignedIn: false,
                nextStep: {
                    signInStep: 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION',
                    allowedMFATypes: getMFATypes(parseMFATypes(challengeParameters.MFAS_CAN_CHOOSE)),
                },
            };
        case 'SMS_OTP':
        case 'SMS_MFA':
            return {
                isSignedIn: false,
                nextStep: {
                    signInStep: 'CONFIRM_SIGN_IN_WITH_SMS_CODE',
                    codeDeliveryDetails: {
                        deliveryMedium: challengeParameters.CODE_DELIVERY_DELIVERY_MEDIUM,
                        destination: challengeParameters.CODE_DELIVERY_DESTINATION,
                    },
                },
            };
        case 'SOFTWARE_TOKEN_MFA':
            return {
                isSignedIn: false,
                nextStep: {
                    signInStep: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE',
                },
            };
        case 'EMAIL_OTP':
            return {
                isSignedIn: false,
                nextStep: {
                    signInStep: 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE',
                    codeDeliveryDetails: {
                        deliveryMedium: challengeParameters.CODE_DELIVERY_DELIVERY_MEDIUM,
                        destination: challengeParameters.CODE_DELIVERY_DESTINATION,
                    },
                },
            };
        case 'WEB_AUTHN': {
            const result = await handleWebAuthnSignInResult(challengeParameters);
            if (isWebAuthnResultAuthSignInOutput(result)) {
                return result;
            }
            return getSignInResult(result);
        }
        case 'PASSWORD':
        case 'PASSWORD_SRP':
            return {
                isSignedIn: false,
                nextStep: {
                    signInStep: 'CONFIRM_SIGN_IN_WITH_PASSWORD',
                },
            };
        case 'SELECT_CHALLENGE':
            return {
                isSignedIn: false,
                nextStep: {
                    signInStep: 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION',
                    availableChallenges,
                },
            };
    }
    // TODO: remove this error message for production apps
    throw new AuthError({
        name: AuthErrorCodes.SignInException,
        message: 'An error occurred during the sign in process. ' +
            `${challengeName} challengeName returned by the underlying service was not addressed.`,
    });
}
function getTOTPSetupDetails(secretCode, username) {
    return {
        sharedSecret: secretCode,
        getSetupUri: (appName, accountName) => {
            const totpUri = `otpauth://totp/${appName}:${accountName ?? username}?secret=${secretCode}&issuer=${appName}`;
            return new AmplifyUrl(totpUri);
        },
    };
}
function getSignInResultFromError(errorName) {
    if (errorName === InitiateAuthException.PasswordResetRequiredException) {
        return {
            isSignedIn: false,
            nextStep: { signInStep: 'RESET_PASSWORD' },
        };
    }
    else if (errorName === InitiateAuthException.UserNotConfirmedException) {
        return {
            isSignedIn: false,
            nextStep: { signInStep: 'CONFIRM_SIGN_UP' },
        };
    }
}
function parseAttributes(attributes) {
    if (!attributes)
        return [];
    const parsedAttributes = JSON.parse(attributes).map(att => att.includes(USER_ATTRIBUTES) ? att.replace(USER_ATTRIBUTES, '') : att);
    return parsedAttributes;
}
function createAttributes(attributes) {
    if (!attributes)
        return {};
    const newAttributes = {};
    Object.entries(attributes).forEach(([key, value]) => {
        if (value)
            newAttributes[`${USER_ATTRIBUTES}${key}`] = value;
    });
    return newAttributes;
}
async function handleChallengeName(username, challengeName, session, challengeResponse, config, tokenOrchestrator, clientMetadata, options) {
    const userAttributes = options?.userAttributes;
    const deviceName = options?.friendlyDeviceName;
    switch (challengeName) {
        case 'WEB_AUTHN':
        case 'SELECT_CHALLENGE':
            if (challengeResponse === 'PASSWORD_SRP' ||
                challengeResponse === 'PASSWORD') {
                return {
                    ChallengeName: challengeResponse,
                    Session: session,
                    $metadata: {},
                };
            }
            return initiateSelectedChallenge({
                username,
                session,
                selectedChallenge: challengeResponse,
                config,
                clientMetadata,
            });
        case 'SELECT_MFA_TYPE':
            return handleSelectMFATypeChallenge({
                challengeResponse,
                clientMetadata,
                session,
                username,
                config,
            });
        case 'MFA_SETUP':
            return handleMFASetupChallenge({
                challengeResponse,
                clientMetadata,
                session,
                username,
                deviceName,
                config,
            });
        case 'NEW_PASSWORD_REQUIRED':
            return handleCompleteNewPasswordChallenge({
                challengeResponse,
                clientMetadata,
                session,
                username,
                requiredAttributes: userAttributes,
                config,
            });
        case 'CUSTOM_CHALLENGE':
            return retryOnResourceNotFoundException(handleCustomChallenge, [
                {
                    challengeResponse,
                    clientMetadata,
                    session,
                    username,
                    config,
                    tokenOrchestrator,
                },
            ], username, tokenOrchestrator);
        case 'SMS_MFA':
        case 'SOFTWARE_TOKEN_MFA':
        case 'SMS_OTP':
        case 'EMAIL_OTP':
            return handleMFAChallenge({
                challengeName,
                challengeResponse,
                clientMetadata,
                session,
                username,
                config,
            });
        case 'PASSWORD':
            return handleSelectChallengeWithPassword(username, challengeResponse, clientMetadata, config, session);
        case 'PASSWORD_SRP':
            return handleSelectChallengeWithPasswordSRP(username, challengeResponse, // This is the actual password
            clientMetadata, config, session, tokenOrchestrator);
    }
    // TODO: remove this error message for production apps
    throw new AuthError({
        name: AuthErrorCodes.SignInException,
        message: `An error occurred during the sign in process.
		${challengeName} challengeName returned by the underlying service was not addressed.`,
    });
}
function mapMfaType(mfa) {
    let mfaType = 'SMS_MFA';
    if (mfa === 'TOTP')
        mfaType = 'SOFTWARE_TOKEN_MFA';
    if (mfa === 'EMAIL')
        mfaType = 'EMAIL_OTP';
    return mfaType;
}
function getMFAType(type) {
    if (type === 'SMS_MFA')
        return 'SMS';
    if (type === 'SOFTWARE_TOKEN_MFA')
        return 'TOTP';
    if (type === 'EMAIL_OTP')
        return 'EMAIL';
    // TODO: log warning for unknown MFA type
}
function getMFATypes(types) {
    if (!types)
        return undefined;
    return types.map(getMFAType).filter(Boolean);
}
function parseMFATypes(mfa) {
    if (!mfa)
        return [];
    return JSON.parse(mfa);
}
function getAllowedMfaSetupTypes(availableMfaSetupTypes) {
    return availableMfaSetupTypes.filter(authMfaType => authMfaType === 'EMAIL' || authMfaType === 'TOTP');
}
async function assertUserNotAuthenticated() {
    let authUser;
    try {
        authUser = await getCurrentUser_getCurrentUser();
    }
    catch (error) { }
    if (authUser && authUser.userId && authUser.username) {
        throw new AuthError_AuthError({
            name: USER_ALREADY_AUTHENTICATED_EXCEPTION,
            message: 'There is already a signed in user.',
            recoverySuggestion: 'Call signOut before calling signIn again.',
        });
    }
}
function getActiveSignInUsername(username) {
    const state = signInStore.getState();
    return state.username ?? username;
}
async function handleMFAChallenge({ challengeName, challengeResponse, clientMetadata, session, username, config, }) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    const challengeResponses = {
        USERNAME: username,
    };
    if (challengeName === 'EMAIL_OTP') {
        challengeResponses.EMAIL_OTP_CODE = challengeResponse;
    }
    if (challengeName === 'SMS_MFA') {
        challengeResponses.SMS_MFA_CODE = challengeResponse;
    }
    if (challengeName === 'SMS_OTP') {
        challengeResponses.SMS_OTP_CODE = challengeResponse;
    }
    if (challengeName === 'SOFTWARE_TOKEN_MFA') {
        challengeResponses.SOFTWARE_TOKEN_MFA_CODE = challengeResponse;
    }
    const userContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReq = {
        ChallengeName: challengeName,
        ChallengeResponses: challengeResponses,
        Session: session,
        ClientMetadata: clientMetadata,
        ClientId: userPoolClientId,
        UserContextData: userContextData,
    };
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    return respondToAuthChallenge({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
    }, jsonReq);
}


//# sourceMappingURL=signInHelpers.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/convert/base64/bytesToString.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function bytesToString(input) {
    return Array.from(input, byte => String.fromCodePoint(byte)).join('');
}


//# sourceMappingURL=bytesToString.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/convert/base64/base64Encoder.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const base64Encoder = {
    /**
     * Convert input to base64-encoded string
     * @param input - string to convert to base64
     * @param options - encoding options that can optionally produce a base64url string
     * @returns base64-encoded string
     */
    convert(input, options = {
        urlSafe: false,
        skipPadding: false,
    }) {
        const inputStr = typeof input === 'string' ? input : bytesToString(input);
        let encodedStr = getBtoa()(inputStr);
        // urlSafe char replacement and skipPadding options conform to the base64url spec
        // https://datatracker.ietf.org/doc/html/rfc4648#section-5
        if (options.urlSafe) {
            encodedStr = encodedStr.replace(/\+/g, '-').replace(/\//g, '_');
        }
        if (options.skipPadding) {
            encodedStr = encodedStr.replace(/=/g, '');
        }
        return encodedStr;
    },
};


//# sourceMappingURL=base64Encoder.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/generateCodeVerifier.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const CODE_VERIFIER_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
/**
 *
 * @param length Desired length of the code verifier.
 *
 * **NOTE:** According to the [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636#section-4.1)
 * A code verifier must be with a length >= 43 and <= 128.
 *
 * @returns An object that contains the generated `codeVerifier` and a method
 * `toCodeChallenge` to generate the code challenge from the `codeVerifier`
 * following the spec of [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636#section-4.2).
 */
const generateCodeVerifier = (length) => {
    const randomBytes = new Uint8Array(length);
    getCrypto().getRandomValues(randomBytes);
    let value = '';
    let codeChallenge;
    for (const byte of randomBytes) {
        value += CODE_VERIFIER_CHARSET.charAt(byte % CODE_VERIFIER_CHARSET.length);
    }
    return {
        value,
        method: 'S256',
        toCodeChallenge() {
            if (codeChallenge) {
                return codeChallenge;
            }
            codeChallenge = generateCodeChallenge(value);
            return codeChallenge;
        },
    };
};
function generateCodeChallenge(codeVerifier) {
    const awsCryptoHash = new Sha256();
    awsCryptoHash.update(codeVerifier);
    const codeChallenge = removePaddingChar(base64Encoder.convert(awsCryptoHash.digestSync(), { urlSafe: true }));
    return codeChallenge;
}
function removePaddingChar(base64Encoded) {
    return base64Encoded.replace(/=/g, '');
}


//# sourceMappingURL=generateCodeVerifier.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/utils/generateRandomString.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const generateRandomString = (length) => {
    const STATE_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const result = [];
    const randomNums = new Uint8Array(length);
    getCrypto().getRandomValues(randomNums);
    for (const num of randomNums) {
        result.push(STATE_CHARSET[num % STATE_CHARSET.length]);
    }
    return result.join('');
};


//# sourceMappingURL=generateRandomString.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/generateState.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const generateState = () => {
    return generateRandomString(32);
};


//# sourceMappingURL=generateState.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/cancelOAuthFlow.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const listenForOAuthFlowCancellation = (store) => {
    async function handleCancelOAuthFlow(event) {
        const isBfcache = event.persisted;
        if (isBfcache && (await store.loadOAuthInFlight())) {
            const error = createOAuthError('User cancelled OAuth flow.');
            await handleFailure(error);
        }
        window.removeEventListener('pageshow', handleCancelOAuthFlow);
    }
    window.addEventListener('pageshow', handleCancelOAuthFlow);
};


//# sourceMappingURL=cancelOAuthFlow.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signInWithRedirect.mjs




















// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Signs in a user with OAuth. Redirects the application to an Identity Provider.
 *
 * @param input - The SignInWithRedirectInput object, if empty it will redirect to Cognito HostedUI
 *
 * @throws AuthTokenConfigException - Thrown when the user pool config is invalid.
 * @throws OAuthNotConfigureException - Thrown when the oauth config is invalid.
 */
async function signInWithRedirect(input) {
    const authConfig = Amplify_Amplify.getConfig().Auth?.Cognito;
    utils_assertTokenProviderConfig(authConfig);
    assertOAuthConfig(authConfig);
    oAuthStore.setAuthConfig(authConfig);
    await assertUserNotAuthenticated();
    let provider = 'COGNITO'; // Default
    if (typeof input?.provider === 'string') {
        provider = cognitoHostedUIIdentityProviderMap[input.provider];
    }
    else if (input?.provider?.custom) {
        provider = input.provider.custom;
    }
    return oauthSignIn({
        oauthConfig: authConfig.loginWith.oauth,
        clientId: authConfig.userPoolClientId,
        provider,
        customState: input?.customState,
        preferPrivateSession: input?.options?.preferPrivateSession,
        options: {
            loginHint: input?.options?.loginHint,
            lang: input?.options?.lang,
            nonce: input?.options?.nonce,
        },
    });
}
const oauthSignIn = async ({ oauthConfig, provider, clientId, customState, preferPrivateSession, options, }) => {
    const { domain, redirectSignIn, responseType, scopes } = oauthConfig;
    const { loginHint, lang, nonce } = options ?? {};
    const randomState = generateState();
    /* encodeURIComponent is not URL safe, use urlSafeEncode instead. Cognito
    single-encodes/decodes url on first sign in and double-encodes/decodes url
    when user already signed in. Using encodeURIComponent, Base32, Base64 add
    characters % or = which on further encoding becomes unsafe. '=' create issue
    for parsing query params.
    Refer: https://github.com/aws-amplify/amplify-js/issues/5218 */
    const state = customState
        ? `${randomState}-${urlSafeEncode(customState)}`
        : randomState;
    const { value, method, toCodeChallenge } = generateCodeVerifier(128);
    const redirectUri = getRedirectUrl_getRedirectUrl(oauthConfig.redirectSignIn);
    if (isBrowser())
        oAuthStore.storeOAuthInFlight(true);
    oAuthStore.storeOAuthState(state);
    oAuthStore.storePKCE(value);
    const queryString = Object.entries({
        redirect_uri: redirectUri,
        response_type: responseType,
        client_id: clientId,
        identity_provider: provider,
        scope: scopes.join(' '),
        // eslint-disable-next-line camelcase
        ...(loginHint && { login_hint: loginHint }),
        ...(lang && { lang }),
        ...(nonce && { nonce }),
        state,
        ...(responseType === 'code' && {
            code_challenge: toCodeChallenge(),
            code_challenge_method: method,
        }),
    })
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    // TODO(v6): use URL object instead
    const oAuthUrl = `https://${domain}/oauth2/authorize?${queryString}`;
    // this will only take effect in the following scenarios:
    // 1. the user cancels the OAuth flow on web via back button, and
    // 2. when bfcache is enabled
    listenForOAuthFlowCancellation(oAuthStore);
    // the following is effective only in react-native as openAuthSession resolves only in react-native
    const { type, error, url } = (await openAuthSession(oAuthUrl)) ??
        {};
    try {
        if (type === 'error') {
            throw createOAuthError(String(error));
        }
        if (type === 'success' && url) {
            await completeOAuthFlow({
                currentUrl: url,
                clientId,
                domain,
                redirectUri,
                responseType,
                userAgentValue: getAuthUserAgentValue_getAuthUserAgentValue(types_AuthAction.SignInWithRedirect),
                preferPrivateSession,
            });
        }
    }
    catch (err) {
        await handleFailure(err);
        // rethrow the error so it can be caught by `await signInWithRedirect()` in react-native
        throw err;
    }
};


//# sourceMappingURL=signInWithRedirect.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/singleton/apis/clearCredentials.mjs


// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function clearCredentials() {
    return Amplify_Amplify.Auth.clearCredentials();
}


//# sourceMappingURL=clearCredentials.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/completeOAuthSignOut.mjs







// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const completeOAuthSignOut = async (store) => {
    await store.clearOAuthData();
    tokenOrchestrator.clearTokens();
    await clearCredentials();
    Hub.dispatch('auth', { event: 'signedOut' }, 'Auth', AMPLIFY_SYMBOL);
};


//# sourceMappingURL=completeOAuthSignOut.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/oAuthSignOutRedirect.mjs




// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const oAuthSignOutRedirect = async (authConfig, preferPrivateSession = false, redirectUrl) => {
    assertOAuthConfig(authConfig);
    const { loginWith, userPoolClientId } = authConfig;
    const { domain, redirectSignOut } = loginWith.oauth;
    const signoutUri = getRedirectUrl_getRedirectUrl(redirectSignOut, redirectUrl);
    const oAuthLogoutEndpoint = `https://${domain}/logout?${Object.entries({
        client_id: userPoolClientId,
        logout_uri: encodeURIComponent(signoutUri),
    })
        .map(([k, v]) => `${k}=${v}`)
        .join('&')}`;
    return openAuthSession(oAuthLogoutEndpoint);
};


//# sourceMappingURL=oAuthSignOutRedirect.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/utils/oauth/handleOAuthSignOut.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const handleOAuthSignOut = async (cognitoConfig, store, tokenOrchestrator, redirectUrl) => {
    const { isOAuthSignIn } = await store.loadOAuthSignIn();
    const oauthMetadata = await tokenOrchestrator.getOAuthMetadata();
    // Clear everything before attempting to visted logout endpoint since the current application
    // state could be wiped away on redirect
    await completeOAuthSignOut(store);
    // The isOAuthSignIn flag is propagated by the oAuthToken store which manages oauth keys in local storage only.
    // These keys are used to determine if a user is in an inflight or signedIn oauth states.
    // However, this behavior represents an issue when 2 apps share the same set of tokens in Cookie storage because the app that didn't
    // start the OAuth will not have access to the oauth keys.
    // A heuristic solution is to add oauth metadata to the tokenOrchestrator which will have access to the underlying
    // storage mechanism that is used by Amplify.
    if (isOAuthSignIn || oauthMetadata?.oauthSignIn) {
        // On web, this will always end up being a void action
        return oAuthSignOutRedirect(cognitoConfig, false, redirectUrl);
    }
};


//# sourceMappingURL=handleOAuthSignOut.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createRevokeTokenClient.mjs








// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createRevokeTokenClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer('RevokeToken'), createUserPoolDeserializer(), {
    ...constants_DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});


//# sourceMappingURL=createRevokeTokenClient.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/foundation/factories/serviceClients/cognitoIdentityProvider/createGlobalSignOutClient.mjs








// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createGlobalSignOutClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer('GlobalSignOut'), createUserPoolDeserializer(), {
    ...constants_DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});


//# sourceMappingURL=createGlobalSignOutClient.mjs.map

;// ./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signOut.mjs


























// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const signOut_logger = new ConsoleLogger('Auth');
/**
 * Signs a user out
 *
 * @param input - The SignOutInput object
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function signOut(input) {
    const cognitoConfig = Amplify_Amplify.getConfig().Auth?.Cognito;
    utils_assertTokenProviderConfig(cognitoConfig);
    if (input?.global) {
        await globalSignOut(cognitoConfig);
    }
    else {
        await clientSignOut(cognitoConfig);
    }
    let hasOAuthConfig;
    try {
        assertOAuthConfig(cognitoConfig);
        hasOAuthConfig = true;
    }
    catch (err) {
        hasOAuthConfig = false;
    }
    if (hasOAuthConfig) {
        const oAuthStore = new DefaultOAuthStore(defaultStorage);
        oAuthStore.setAuthConfig(cognitoConfig);
        const { type } = (await handleOAuthSignOut(cognitoConfig, oAuthStore, tokenOrchestrator, input?.oauth?.redirectUrl)) ?? {};
        if (type === 'error') {
            throw new AuthError_AuthError({
                name: OAUTH_SIGNOUT_EXCEPTION,
                message: `An error occurred when attempting to log out from OAuth provider.`,
            });
        }
    }
    else {
        // complete sign out
        tokenOrchestrator.clearTokens();
        await clearCredentials();
        Hub.dispatch('auth', { event: 'signedOut' }, 'Auth', AMPLIFY_SYMBOL);
    }
}
async function clientSignOut(cognitoConfig) {
    try {
        const { userPoolEndpoint, userPoolId, userPoolClientId } = cognitoConfig;
        const authTokens = await tokenOrchestrator.getTokenStore().loadTokens();
        assertAuthTokensWithRefreshToken(authTokens);
        if (isSessionRevocable(authTokens.accessToken)) {
            const revokeToken = createRevokeTokenClient({
                endpointResolver: createCognitoUserPoolEndpointResolver_createCognitoUserPoolEndpointResolver({
                    endpointOverride: userPoolEndpoint,
                }),
            });
            await revokeToken({
                region: regionParsers_getRegionFromUserPoolId(userPoolId),
                userAgentValue: getAuthUserAgentValue_getAuthUserAgentValue(types_AuthAction.SignOut),
            }, {
                ClientId: userPoolClientId,
                Token: authTokens.refreshToken,
            });
        }
    }
    catch (err) {
        // this shouldn't throw
        signOut_logger.debug('Client signOut error caught but will proceed with token removal');
    }
}
async function globalSignOut(cognitoConfig) {
    try {
        const { userPoolEndpoint, userPoolId } = cognitoConfig;
        const authTokens = await tokenOrchestrator.getTokenStore().loadTokens();
        assertAuthTokens(authTokens);
        const globalSignOutClient = createGlobalSignOutClient({
            endpointResolver: createCognitoUserPoolEndpointResolver_createCognitoUserPoolEndpointResolver({
                endpointOverride: userPoolEndpoint,
            }),
        });
        await globalSignOutClient({
            region: regionParsers_getRegionFromUserPoolId(userPoolId),
            userAgentValue: getAuthUserAgentValue_getAuthUserAgentValue(types_AuthAction.SignOut),
        }, {
            AccessToken: authTokens.accessToken.toString(),
        });
    }
    catch (err) {
        // it should not throw
        signOut_logger.debug('Global signOut error caught but will proceed with token removal');
    }
}
const isSessionRevocable = (token) => !!token?.payload?.origin_jti;


//# sourceMappingURL=signOut.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/singleton/apis/internal/fetchAuthSession.mjs
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fetchAuthSession = (amplify, options) => {
    return amplify.Auth.fetchAuthSession(options);
};


//# sourceMappingURL=fetchAuthSession.mjs.map

;// ./node_modules/@aws-amplify/core/dist/esm/singleton/apis/fetchAuthSession.mjs



// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Fetch the auth session including the tokens and credentials if they are available. By default it
 * does not refresh the auth tokens or credentials if they are loaded in storage already. You can force a refresh
 * with `{ forceRefresh: true }` input.
 *
 * @param options - Options configuring the fetch behavior.
 * @throws {@link AuthError} - Throws error when session information cannot be refreshed.
 * @returns Promise<AuthSession>
 */
const fetchAuthSession_fetchAuthSession = (options) => {
    return fetchAuthSession(Amplify_Amplify, options);
};


//# sourceMappingURL=fetchAuthSession.mjs.map

;// ./hooks/useCognitoAuth.js
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }


function useCognitoAuth() {
  var _useState = (0,react.useState)(true),
    _useState2 = _slicedToArray(_useState, 2),
    loading = _useState2[0],
    setLoading = _useState2[1];
  var _useState3 = (0,react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isAuthenticated = _useState4[0],
    setIsAuthenticated = _useState4[1];
  (0,react.useEffect)(function () {
    var checkAuth = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return getCurrentUser_getCurrentUser();
            case 1:
              setIsAuthenticated(true);
              _context.n = 3;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
              console.error('? getCurrentUser failed:', _t);
              setIsAuthenticated(false);
            case 3:
              _context.p = 3;
              setLoading(false);
              return _context.f(3);
            case 4:
              return _context.a(2);
          }
        }, _callee, null, [[0, 2, 3, 4]]);
      }));
      return function checkAuth() {
        return _ref.apply(this, arguments);
      };
    }();
    checkAuth();
  }, []);
  var login = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return signInWithRedirect();
          case 1:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return function login() {
      return _ref2.apply(this, arguments);
    };
  }();
  var logout = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return signOut();
          case 1:
            setIsAuthenticated(false);
          case 2:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function logout() {
      return _ref3.apply(this, arguments);
    };
  }();
  var getIdToken = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var _yield$fetchAuthSessi, tokens, _t2;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _context4.p = 0;
            _context4.n = 1;
            return fetchAuthSession_fetchAuthSession();
          case 1:
            _yield$fetchAuthSessi = _context4.v;
            tokens = _yield$fetchAuthSessi.tokens;
            return _context4.a(2, tokens.idToken.toString());
          case 2:
            _context4.p = 2;
            _t2 = _context4.v;
            console.log('error getting id token:');
            console.error(_t2);
            return _context4.a(2, null);
        }
      }, _callee4, null, [[0, 2]]);
    }));
    return function getIdToken() {
      return _ref4.apply(this, arguments);
    };
  }();
  var getUserId = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var _yield$fetchAuthSessi2, tokens, payload, _t3;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.p = 0;
            _context5.n = 1;
            return fetchAuthSession_fetchAuthSession();
          case 1:
            _yield$fetchAuthSessi2 = _context5.v;
            tokens = _yield$fetchAuthSessi2.tokens;
            payload = JSON.parse(atob(tokens.idToken.toString().split('.')[1]));
            return _context5.a(2, payload.sub);
          case 2:
            _context5.p = 2;
            _t3 = _context5.v;
            console.log('error getting user id:');
            console.error(_t3);
            return _context5.a(2, null);
        }
      }, _callee5, null, [[0, 2]]);
    }));
    return function getUserId() {
      return _ref5.apply(this, arguments);
    };
  }();
  return {
    getIdToken: getIdToken,
    getUserId: getUserId,
    login: login,
    logout: logout,
    loading: loading,
    isAuthenticated: isAuthenticated
  };
}
;// ./utils/make-request.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["method", "headers", "body"];
function make_request_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return make_request_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (make_request_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, make_request_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, make_request_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), make_request_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", make_request_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), make_request_regeneratorDefine2(u), make_request_regeneratorDefine2(u, o, "Generator"), make_request_regeneratorDefine2(u, n, function () { return this; }), make_request_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (make_request_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function make_request_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } make_request_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { make_request_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, make_request_regeneratorDefine2(e, r, n, t); }
function make_request_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? make_request_ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : make_request_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function make_request_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function make_request_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { make_request_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { make_request_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function makeRequest(_x) {
  return _makeRequest.apply(this, arguments);
}
function _makeRequest() {
  _makeRequest = make_request_asyncToGenerator(/*#__PURE__*/make_request_regenerator().m(function _callee(url) {
    var options,
      _options$method,
      method,
      _options$headers,
      headers,
      body,
      restOptions,
      fetchHeaders,
      fetchOptions,
      response,
      data,
      contentType,
      error,
      _args = arguments;
    return make_request_regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          _options$method = options.method, method = _options$method === void 0 ? 'GET' : _options$method, _options$headers = options.headers, headers = _options$headers === void 0 ? {} : _options$headers, body = options.body, restOptions = _objectWithoutProperties(options, _excluded);
          fetchHeaders = new Headers(headers); // Set Content-Type for JSON body if not set and body is present
          if (body && !fetchHeaders.has('Content-Type')) {
            fetchHeaders.set('Content-Type', 'application/json');
          }

          // Prepare fetch options
          fetchOptions = _objectSpread({
            method: method,
            headers: fetchHeaders
          }, restOptions); // If body is an object (not FormData), stringify it
          if (body && !(body instanceof FormData)) {
            fetchOptions.body = JSON.stringify(body);
          } else if (body) {
            // If FormData or other body types, send as-is
            fetchOptions.body = body;
          }
          console.log('fetchOptions', fetchOptions);

          // Make the fetch call
          _context.n = 1;
          return fetch(url, fetchOptions);
        case 1:
          response = _context.v;
          contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            _context.n = 3;
            break;
          }
          _context.n = 2;
          return response.json();
        case 2:
          data = _context.v;
          _context.n = 5;
          break;
        case 3:
          _context.n = 4;
          return response.text();
        case 4:
          data = _context.v;
        case 5:
          if (response.ok) {
            _context.n = 6;
            break;
          }
          error = new Error("HTTP ".concat(response.status, " ").concat(response.statusText));
          error.status = response.status;
          error.statusText = response.statusText;
          error.data = data;
          throw error;
        case 6:
          return _context.a(2, data);
      }
    }, _callee);
  }));
  return _makeRequest.apply(this, arguments);
}
;// ./utils/make-authenticated-request.js
function make_authenticated_request_typeof(o) { "@babel/helpers - typeof"; return make_authenticated_request_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, make_authenticated_request_typeof(o); }
function make_authenticated_request_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function make_authenticated_request_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? make_authenticated_request_ownKeys(Object(t), !0).forEach(function (r) { make_authenticated_request_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : make_authenticated_request_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function make_authenticated_request_defineProperty(e, r, t) { return (r = make_authenticated_request_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function make_authenticated_request_toPropertyKey(t) { var i = make_authenticated_request_toPrimitive(t, "string"); return "symbol" == make_authenticated_request_typeof(i) ? i : i + ""; }
function make_authenticated_request_toPrimitive(t, r) { if ("object" != make_authenticated_request_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != make_authenticated_request_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

function makeAuthenticatedRequest(url, token) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!token) {
    throw new Error("authenticated request attempted with no token: ".concat(url));
  }
  console.log('url', url);
  var headers = new Headers(options.headers);
  headers.set('Authorization', "Bearer ".concat(token));
  return makeRequest(url, make_authenticated_request_objectSpread(make_authenticated_request_objectSpread({}, options), {}, {
    headers: headers
  }));
}
;// ./app.js
function app_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return app_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (app_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, app_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, app_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), app_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", app_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), app_regeneratorDefine2(u), app_regeneratorDefine2(u, o, "Generator"), app_regeneratorDefine2(u, n, function () { return this; }), app_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (app_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function app_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } app_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { app_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, app_regeneratorDefine2(e, r, n, t); }
function app_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function app_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { app_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { app_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }





DefaultAmplify.configure(cognitoConfig);
var apiUrl = 'https://api.measuringcontest.com/sessions';
function App() {
  var auth = useCognitoAuth();
  var createSession = /*#__PURE__*/function () {
    var _ref = app_asyncToGenerator(/*#__PURE__*/app_regenerator().m(function _callee() {
      var idToken, userId, session;
      return app_regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return auth.getIdToken();
          case 1:
            idToken = _context.v;
            _context.n = 2;
            return auth.getUserId();
          case 2:
            userId = _context.v;
            _context.n = 3;
            return makeAuthenticatedRequest(apiUrl, idToken, {
              method: 'POST',
              body: {
                createdBy: userId
              }
            });
          case 3:
            session = _context.v;
            console.log('session', session);
          case 4:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function createSession() {
      return _ref.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/react.createElement("div", {
    className: "content"
  }, !auth.loading && !auth.isAuthenticated && /*#__PURE__*/react.createElement("button", {
    onClick: auth.login
  }, "Login with Google"), !auth.loading && auth.isAuthenticated && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("button", {
    onClick: auth.logout
  }, "Logout"), /*#__PURE__*/react.createElement("button", {
    onClick: createSession
  }, "create session")));
}
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(159);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./styles.css
var cjs_js_styles = __webpack_require__(392);
;// ./styles.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(cjs_js_styles/* default */.A, options);




       /* harmony default export */ const styles = (cjs_js_styles/* default */.A && cjs_js_styles/* default */.A.locals ? cjs_js_styles/* default */.A.locals : undefined);

;// ./index.js




react_dom.render(/*#__PURE__*/react.createElement(App, null), document.getElementById('root'));
/******/ })()
;