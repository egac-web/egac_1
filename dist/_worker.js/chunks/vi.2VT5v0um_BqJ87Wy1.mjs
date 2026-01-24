globalThis.process ??= {}; globalThis.process.env ??= {};
// src/index.ts
var d = {
  reset: [0, 0],
  bold: [1, 22, "\x1B[22m\x1B[1m"],
  dim: [2, 22, "\x1B[22m\x1B[2m"],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  blackBright: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],
  bgBlackBright: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49]
};
function g(e) {
  return String(e);
}
g.open = "";
g.close = "";
function h() {
  let e = typeof process != "undefined" ? process : void 0, n = (e == null ? void 0 : e.env) || {}, a = n.FORCE_TTY !== "false", i = (e == null ? void 0 : e.argv) || [];
  return !("NO_COLOR" in n || i.includes("--no-color")) && ("FORCE_COLOR" in n || i.includes("--color") || (e == null ? void 0 : e.platform) === "win32" || a && n.TERM !== "dumb" || "CI" in n) || typeof window != "undefined" && !!window.chrome;
}
function f() {
  let e = h(), n = (r, t, u, o) => {
    let l = "", s = 0;
    do
      l += r.substring(s, o) + u, s = o + t.length, o = r.indexOf(t, s);
    while (~o);
    return l + r.substring(s);
  }, a = (r, t, u = r) => {
    let o = (l) => {
      let s = String(l), b = s.indexOf(t, r.length);
      return ~b ? r + n(s, t, u, b) + t : r + s + t;
    };
    return o.open = r, o.close = t, o;
  }, i = {
    isColorSupported: e
  }, c = (r) => `\x1B[${r}m`;
  for (let r in d) {
    let t = d[r];
    i[r] = e ? a(
      c(t[0]),
      c(t[1]),
      t[2]
    ) : g;
  }
  return i;
}
var C = f();

function _mergeNamespaces$1(n, m) {
  m.forEach(function (e) {
    e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
      if (k !== 'default' && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  });
  return Object.freeze(n);
}

function getKeysOfEnumerableProperties(object, compareKeys) {
	const rawKeys = Object.keys(object);
	const keys = compareKeys === null ? rawKeys : rawKeys.sort(compareKeys);
	if (Object.getOwnPropertySymbols) {
		for (const symbol of Object.getOwnPropertySymbols(object)) {
			if (Object.getOwnPropertyDescriptor(object, symbol).enumerable) {
				keys.push(symbol);
			}
		}
	}
	return keys;
}
/**
* Return entries (for example, of a map)
* with spacing, indentation, and comma
* without surrounding punctuation (for example, braces)
*/
function printIteratorEntries(iterator, config, indentation, depth, refs, printer, separator = ": ") {
	let result = "";
	let width = 0;
	let current = iterator.next();
	if (!current.done) {
		result += config.spacingOuter;
		const indentationNext = indentation + config.indent;
		while (!current.done) {
			result += indentationNext;
			if (width++ === config.maxWidth) {
				result += "…";
				break;
			}
			const name = printer(current.value[0], config, indentationNext, depth, refs);
			const value = printer(current.value[1], config, indentationNext, depth, refs);
			result += name + separator + value;
			current = iterator.next();
			if (!current.done) {
				result += `,${config.spacingInner}`;
			} else if (!config.min) {
				result += ",";
			}
		}
		result += config.spacingOuter + indentation;
	}
	return result;
}
/**
* Return values (for example, of a set)
* with spacing, indentation, and comma
* without surrounding punctuation (braces or brackets)
*/
function printIteratorValues(iterator, config, indentation, depth, refs, printer) {
	let result = "";
	let width = 0;
	let current = iterator.next();
	if (!current.done) {
		result += config.spacingOuter;
		const indentationNext = indentation + config.indent;
		while (!current.done) {
			result += indentationNext;
			if (width++ === config.maxWidth) {
				result += "…";
				break;
			}
			result += printer(current.value, config, indentationNext, depth, refs);
			current = iterator.next();
			if (!current.done) {
				result += `,${config.spacingInner}`;
			} else if (!config.min) {
				result += ",";
			}
		}
		result += config.spacingOuter + indentation;
	}
	return result;
}
/**
* Return items (for example, of an array)
* with spacing, indentation, and comma
* without surrounding punctuation (for example, brackets)
*/
function printListItems(list, config, indentation, depth, refs, printer) {
	let result = "";
	list = list instanceof ArrayBuffer ? new DataView(list) : list;
	const isDataView = (l) => l instanceof DataView;
	const length = isDataView(list) ? list.byteLength : list.length;
	if (length > 0) {
		result += config.spacingOuter;
		const indentationNext = indentation + config.indent;
		for (let i = 0; i < length; i++) {
			result += indentationNext;
			if (i === config.maxWidth) {
				result += "…";
				break;
			}
			if (isDataView(list) || i in list) {
				result += printer(isDataView(list) ? list.getInt8(i) : list[i], config, indentationNext, depth, refs);
			}
			if (i < length - 1) {
				result += `,${config.spacingInner}`;
			} else if (!config.min) {
				result += ",";
			}
		}
		result += config.spacingOuter + indentation;
	}
	return result;
}
/**
* Return properties of an object
* with spacing, indentation, and comma
* without surrounding punctuation (for example, braces)
*/
function printObjectProperties(val, config, indentation, depth, refs, printer) {
	let result = "";
	const keys = getKeysOfEnumerableProperties(val, config.compareKeys);
	if (keys.length > 0) {
		result += config.spacingOuter;
		const indentationNext = indentation + config.indent;
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const name = printer(key, config, indentationNext, depth, refs);
			const value = printer(val[key], config, indentationNext, depth, refs);
			result += `${indentationNext + name}: ${value}`;
			if (i < keys.length - 1) {
				result += `,${config.spacingInner}`;
			} else if (!config.min) {
				result += ",";
			}
		}
		result += config.spacingOuter + indentation;
	}
	return result;
}

const asymmetricMatcher = typeof Symbol === "function" && Symbol.for ? Symbol.for("jest.asymmetricMatcher") : 1267621;
const SPACE$2 = " ";
const serialize$5 = (val, config, indentation, depth, refs, printer) => {
	const stringedValue = val.toString();
	if (stringedValue === "ArrayContaining" || stringedValue === "ArrayNotContaining") {
		if (++depth > config.maxDepth) {
			return `[${stringedValue}]`;
		}
		return `${stringedValue + SPACE$2}[${printListItems(val.sample, config, indentation, depth, refs, printer)}]`;
	}
	if (stringedValue === "ObjectContaining" || stringedValue === "ObjectNotContaining") {
		if (++depth > config.maxDepth) {
			return `[${stringedValue}]`;
		}
		return `${stringedValue + SPACE$2}{${printObjectProperties(val.sample, config, indentation, depth, refs, printer)}}`;
	}
	if (stringedValue === "StringMatching" || stringedValue === "StringNotMatching") {
		return stringedValue + SPACE$2 + printer(val.sample, config, indentation, depth, refs);
	}
	if (stringedValue === "StringContaining" || stringedValue === "StringNotContaining") {
		return stringedValue + SPACE$2 + printer(val.sample, config, indentation, depth, refs);
	}
	if (typeof val.toAsymmetricMatcher !== "function") {
		throw new TypeError(`Asymmetric matcher ${val.constructor.name} does not implement toAsymmetricMatcher()`);
	}
	return val.toAsymmetricMatcher();
};
const test$5 = (val) => val && val.$$typeof === asymmetricMatcher;
const plugin$5 = {
	serialize: serialize$5,
	test: test$5
};

const SPACE$1 = " ";
const OBJECT_NAMES = new Set(["DOMStringMap", "NamedNodeMap"]);
const ARRAY_REGEXP = /^(?:HTML\w*Collection|NodeList)$/;
function testName(name) {
	return OBJECT_NAMES.has(name) || ARRAY_REGEXP.test(name);
}
const test$4 = (val) => val && val.constructor && !!val.constructor.name && testName(val.constructor.name);
function isNamedNodeMap(collection) {
	return collection.constructor.name === "NamedNodeMap";
}
const serialize$4 = (collection, config, indentation, depth, refs, printer) => {
	const name = collection.constructor.name;
	if (++depth > config.maxDepth) {
		return `[${name}]`;
	}
	return (config.min ? "" : name + SPACE$1) + (OBJECT_NAMES.has(name) ? `{${printObjectProperties(isNamedNodeMap(collection) ? [...collection].reduce((props, attribute) => {
		props[attribute.name] = attribute.value;
		return props;
	}, {}) : { ...collection }, config, indentation, depth, refs, printer)}}` : `[${printListItems([...collection], config, indentation, depth, refs, printer)}]`);
};
const plugin$4 = {
	serialize: serialize$4,
	test: test$4
};

/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
function escapeHTML(str) {
	return str.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// Return empty string if keys is empty.
function printProps(keys, props, config, indentation, depth, refs, printer) {
	const indentationNext = indentation + config.indent;
	const colors = config.colors;
	return keys.map((key) => {
		const value = props[key];
		let printed = printer(value, config, indentationNext, depth, refs);
		if (typeof value !== "string") {
			if (printed.includes("\n")) {
				printed = config.spacingOuter + indentationNext + printed + config.spacingOuter + indentation;
			}
			printed = `{${printed}}`;
		}
		return `${config.spacingInner + indentation + colors.prop.open + key + colors.prop.close}=${colors.value.open}${printed}${colors.value.close}`;
	}).join("");
}
// Return empty string if children is empty.
function printChildren(children, config, indentation, depth, refs, printer) {
	return children.map((child) => config.spacingOuter + indentation + (typeof child === "string" ? printText(child, config) : printer(child, config, indentation, depth, refs))).join("");
}
function printShadowRoot(children, config, indentation, depth, refs, printer) {
	if (config.printShadowRoot === false) {
		return "";
	}
	return [`${config.spacingOuter + indentation}#shadow-root`, printChildren(children, config, indentation + config.indent, depth, refs, printer)].join("");
}
function printText(text, config) {
	const contentColor = config.colors.content;
	return contentColor.open + escapeHTML(text) + contentColor.close;
}
function printComment(comment, config) {
	const commentColor = config.colors.comment;
	return `${commentColor.open}<!--${escapeHTML(comment)}-->${commentColor.close}`;
}
// Separate the functions to format props, children, and element,
// so a plugin could override a particular function, if needed.
// Too bad, so sad: the traditional (but unnecessary) space
// in a self-closing tagColor requires a second test of printedProps.
function printElement(type, printedProps, printedChildren, config, indentation) {
	const tagColor = config.colors.tag;
	return `${tagColor.open}<${type}${printedProps && tagColor.close + printedProps + config.spacingOuter + indentation + tagColor.open}${printedChildren ? `>${tagColor.close}${printedChildren}${config.spacingOuter}${indentation}${tagColor.open}</${type}` : `${printedProps && !config.min ? "" : " "}/`}>${tagColor.close}`;
}
function printElementAsLeaf(type, config) {
	const tagColor = config.colors.tag;
	return `${tagColor.open}<${type}${tagColor.close} …${tagColor.open} />${tagColor.close}`;
}

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const FRAGMENT_NODE = 11;
const ELEMENT_REGEXP = /^(?:(?:HTML|SVG)\w*)?Element$/;
function testHasAttribute(val) {
	try {
		return typeof val.hasAttribute === "function" && val.hasAttribute("is");
	} catch {
		return false;
	}
}
function testNode(val) {
	const constructorName = val.constructor.name;
	const { nodeType, tagName } = val;
	const isCustomElement = typeof tagName === "string" && tagName.includes("-") || testHasAttribute(val);
	return nodeType === ELEMENT_NODE && (ELEMENT_REGEXP.test(constructorName) || isCustomElement) || nodeType === TEXT_NODE && constructorName === "Text" || nodeType === COMMENT_NODE && constructorName === "Comment" || nodeType === FRAGMENT_NODE && constructorName === "DocumentFragment";
}
const test$3 = (val) => val?.constructor?.name && testNode(val);
function nodeIsText(node) {
	return node.nodeType === TEXT_NODE;
}
function nodeIsComment(node) {
	return node.nodeType === COMMENT_NODE;
}
function nodeIsFragment(node) {
	return node.nodeType === FRAGMENT_NODE;
}
const serialize$3 = (node, config, indentation, depth, refs, printer) => {
	if (nodeIsText(node)) {
		return printText(node.data, config);
	}
	if (nodeIsComment(node)) {
		return printComment(node.data, config);
	}
	const type = nodeIsFragment(node) ? "DocumentFragment" : node.tagName.toLowerCase();
	if (++depth > config.maxDepth) {
		return printElementAsLeaf(type, config);
	}
	return printElement(type, printProps(nodeIsFragment(node) ? [] : Array.from(node.attributes, (attr) => attr.name).sort(), nodeIsFragment(node) ? {} : [...node.attributes].reduce((props, attribute) => {
		props[attribute.name] = attribute.value;
		return props;
	}, {}), config, indentation + config.indent, depth, refs, printer), (nodeIsFragment(node) || !node.shadowRoot ? "" : printShadowRoot(Array.prototype.slice.call(node.shadowRoot.children), config, indentation + config.indent, depth, refs, printer)) + printChildren(Array.prototype.slice.call(node.childNodes || node.children), config, indentation + config.indent, depth, refs, printer), config, indentation);
};
const plugin$3 = {
	serialize: serialize$3,
	test: test$3
};

// SENTINEL constants are from https://github.com/facebook/immutable-js
const IS_ITERABLE_SENTINEL = "@@__IMMUTABLE_ITERABLE__@@";
const IS_LIST_SENTINEL$1 = "@@__IMMUTABLE_LIST__@@";
const IS_KEYED_SENTINEL$1 = "@@__IMMUTABLE_KEYED__@@";
const IS_MAP_SENTINEL = "@@__IMMUTABLE_MAP__@@";
const IS_ORDERED_SENTINEL$1 = "@@__IMMUTABLE_ORDERED__@@";
const IS_RECORD_SENTINEL = "@@__IMMUTABLE_RECORD__@@";
const IS_SEQ_SENTINEL = "@@__IMMUTABLE_SEQ__@@";
const IS_SET_SENTINEL$1 = "@@__IMMUTABLE_SET__@@";
const IS_STACK_SENTINEL = "@@__IMMUTABLE_STACK__@@";
const getImmutableName = (name) => `Immutable.${name}`;
const printAsLeaf = (name) => `[${name}]`;
const SPACE = " ";
const LAZY = "…";
function printImmutableEntries(val, config, indentation, depth, refs, printer, type) {
	return ++depth > config.maxDepth ? printAsLeaf(getImmutableName(type)) : `${getImmutableName(type) + SPACE}{${printIteratorEntries(val.entries(), config, indentation, depth, refs, printer)}}`;
}
// Record has an entries method because it is a collection in immutable v3.
// Return an iterator for Immutable Record from version v3 or v4.
function getRecordEntries(val) {
	let i = 0;
	return { next() {
		if (i < val._keys.length) {
			const key = val._keys[i++];
			return {
				done: false,
				value: [key, val.get(key)]
			};
		}
		return {
			done: true,
			value: undefined
		};
	} };
}
function printImmutableRecord(val, config, indentation, depth, refs, printer) {
	// _name property is defined only for an Immutable Record instance
	// which was constructed with a second optional descriptive name arg
	const name = getImmutableName(val._name || "Record");
	return ++depth > config.maxDepth ? printAsLeaf(name) : `${name + SPACE}{${printIteratorEntries(getRecordEntries(val), config, indentation, depth, refs, printer)}}`;
}
function printImmutableSeq(val, config, indentation, depth, refs, printer) {
	const name = getImmutableName("Seq");
	if (++depth > config.maxDepth) {
		return printAsLeaf(name);
	}
	if (val[IS_KEYED_SENTINEL$1]) {
		return `${name + SPACE}{${val._iter || val._object ? printIteratorEntries(val.entries(), config, indentation, depth, refs, printer) : LAZY}}`;
	}
	return `${name + SPACE}[${val._iter || val._array || val._collection || val._iterable ? printIteratorValues(val.values(), config, indentation, depth, refs, printer) : LAZY}]`;
}
function printImmutableValues(val, config, indentation, depth, refs, printer, type) {
	return ++depth > config.maxDepth ? printAsLeaf(getImmutableName(type)) : `${getImmutableName(type) + SPACE}[${printIteratorValues(val.values(), config, indentation, depth, refs, printer)}]`;
}
const serialize$2 = (val, config, indentation, depth, refs, printer) => {
	if (val[IS_MAP_SENTINEL]) {
		return printImmutableEntries(val, config, indentation, depth, refs, printer, val[IS_ORDERED_SENTINEL$1] ? "OrderedMap" : "Map");
	}
	if (val[IS_LIST_SENTINEL$1]) {
		return printImmutableValues(val, config, indentation, depth, refs, printer, "List");
	}
	if (val[IS_SET_SENTINEL$1]) {
		return printImmutableValues(val, config, indentation, depth, refs, printer, val[IS_ORDERED_SENTINEL$1] ? "OrderedSet" : "Set");
	}
	if (val[IS_STACK_SENTINEL]) {
		return printImmutableValues(val, config, indentation, depth, refs, printer, "Stack");
	}
	if (val[IS_SEQ_SENTINEL]) {
		return printImmutableSeq(val, config, indentation, depth, refs, printer);
	}
	// For compatibility with immutable v3 and v4, let record be the default.
	return printImmutableRecord(val, config, indentation, depth, refs, printer);
};
// Explicitly comparing sentinel properties to true avoids false positive
// when mock identity-obj-proxy returns the key as the value for any key.
const test$2$1 = (val) => val && (val[IS_ITERABLE_SENTINEL] === true || val[IS_RECORD_SENTINEL] === true);
const plugin$2 = {
	serialize: serialize$2,
	test: test$2$1
};

function getDefaultExportFromCjs$2(x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}

var reactIs$1 = {exports: {}};

var reactIs_production = {};

/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_production;

function requireReactIs_production () {
	if (hasRequiredReactIs_production) return reactIs_production;
	hasRequiredReactIs_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
	  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	  REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
	  REACT_MEMO_TYPE = Symbol.for("react.memo"),
	  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
	  REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"),
	  REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function typeOf(object) {
	  if ("object" === typeof object && null !== object) {
	    var $$typeof = object.$$typeof;
	    switch ($$typeof) {
	      case REACT_ELEMENT_TYPE:
	        switch (((object = object.type), object)) {
	          case REACT_FRAGMENT_TYPE:
	          case REACT_PROFILER_TYPE:
	          case REACT_STRICT_MODE_TYPE:
	          case REACT_SUSPENSE_TYPE:
	          case REACT_SUSPENSE_LIST_TYPE:
	          case REACT_VIEW_TRANSITION_TYPE:
	            return object;
	          default:
	            switch (((object = object && object.$$typeof), object)) {
	              case REACT_CONTEXT_TYPE:
	              case REACT_FORWARD_REF_TYPE:
	              case REACT_LAZY_TYPE:
	              case REACT_MEMO_TYPE:
	                return object;
	              case REACT_CONSUMER_TYPE:
	                return object;
	              default:
	                return $$typeof;
	            }
	        }
	      case REACT_PORTAL_TYPE:
	        return $$typeof;
	    }
	  }
	}
	reactIs_production.ContextConsumer = REACT_CONSUMER_TYPE;
	reactIs_production.ContextProvider = REACT_CONTEXT_TYPE;
	reactIs_production.Element = REACT_ELEMENT_TYPE;
	reactIs_production.ForwardRef = REACT_FORWARD_REF_TYPE;
	reactIs_production.Fragment = REACT_FRAGMENT_TYPE;
	reactIs_production.Lazy = REACT_LAZY_TYPE;
	reactIs_production.Memo = REACT_MEMO_TYPE;
	reactIs_production.Portal = REACT_PORTAL_TYPE;
	reactIs_production.Profiler = REACT_PROFILER_TYPE;
	reactIs_production.StrictMode = REACT_STRICT_MODE_TYPE;
	reactIs_production.Suspense = REACT_SUSPENSE_TYPE;
	reactIs_production.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
	reactIs_production.isContextConsumer = function (object) {
	  return typeOf(object) === REACT_CONSUMER_TYPE;
	};
	reactIs_production.isContextProvider = function (object) {
	  return typeOf(object) === REACT_CONTEXT_TYPE;
	};
	reactIs_production.isElement = function (object) {
	  return (
	    "object" === typeof object &&
	    null !== object &&
	    object.$$typeof === REACT_ELEMENT_TYPE
	  );
	};
	reactIs_production.isForwardRef = function (object) {
	  return typeOf(object) === REACT_FORWARD_REF_TYPE;
	};
	reactIs_production.isFragment = function (object) {
	  return typeOf(object) === REACT_FRAGMENT_TYPE;
	};
	reactIs_production.isLazy = function (object) {
	  return typeOf(object) === REACT_LAZY_TYPE;
	};
	reactIs_production.isMemo = function (object) {
	  return typeOf(object) === REACT_MEMO_TYPE;
	};
	reactIs_production.isPortal = function (object) {
	  return typeOf(object) === REACT_PORTAL_TYPE;
	};
	reactIs_production.isProfiler = function (object) {
	  return typeOf(object) === REACT_PROFILER_TYPE;
	};
	reactIs_production.isStrictMode = function (object) {
	  return typeOf(object) === REACT_STRICT_MODE_TYPE;
	};
	reactIs_production.isSuspense = function (object) {
	  return typeOf(object) === REACT_SUSPENSE_TYPE;
	};
	reactIs_production.isSuspenseList = function (object) {
	  return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
	};
	reactIs_production.isValidElementType = function (type) {
	  return "string" === typeof type ||
	    "function" === typeof type ||
	    type === REACT_FRAGMENT_TYPE ||
	    type === REACT_PROFILER_TYPE ||
	    type === REACT_STRICT_MODE_TYPE ||
	    type === REACT_SUSPENSE_TYPE ||
	    type === REACT_SUSPENSE_LIST_TYPE ||
	    ("object" === typeof type &&
	      null !== type &&
	      (type.$$typeof === REACT_LAZY_TYPE ||
	        type.$$typeof === REACT_MEMO_TYPE ||
	        type.$$typeof === REACT_CONTEXT_TYPE ||
	        type.$$typeof === REACT_CONSUMER_TYPE ||
	        type.$$typeof === REACT_FORWARD_REF_TYPE ||
	        type.$$typeof === REACT_CLIENT_REFERENCE ||
	        void 0 !== type.getModuleId))
	    ? true
	    : false;
	};
	reactIs_production.typeOf = typeOf;
	return reactIs_production;
}

var hasRequiredReactIs$1;

function requireReactIs$1 () {
	if (hasRequiredReactIs$1) return reactIs$1.exports;
	hasRequiredReactIs$1 = 1;

	{
	  reactIs$1.exports = requireReactIs_production();
	}
	return reactIs$1.exports;
}

var reactIsExports$1 = requireReactIs$1();
var index$1 = /*@__PURE__*/getDefaultExportFromCjs$2(reactIsExports$1);

var ReactIs19 = /*#__PURE__*/_mergeNamespaces$1({
  __proto__: null,
  default: index$1
}, [reactIsExports$1]);

var reactIs = {exports: {}};

var reactIs_production_min = {};

/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_production_min;

function requireReactIs_production_min () {
	if (hasRequiredReactIs_production_min) return reactIs_production_min;
	hasRequiredReactIs_production_min = 1;
var b=Symbol.for("react.element"),c=Symbol.for("react.portal"),d=Symbol.for("react.fragment"),e=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),g=Symbol.for("react.provider"),h=Symbol.for("react.context"),k=Symbol.for("react.server_context"),l=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),n=Symbol.for("react.suspense_list"),p=Symbol.for("react.memo"),q=Symbol.for("react.lazy"),t=Symbol.for("react.offscreen"),u;u=Symbol.for("react.module.reference");
	function v(a){if("object"===typeof a&&null!==a){var r=a.$$typeof;switch(r){case b:switch(a=a.type,a){case d:case f:case e:case m:case n:return a;default:switch(a=a&&a.$$typeof,a){case k:case h:case l:case q:case p:case g:return a;default:return r}}case c:return r}}}reactIs_production_min.ContextConsumer=h;reactIs_production_min.ContextProvider=g;reactIs_production_min.Element=b;reactIs_production_min.ForwardRef=l;reactIs_production_min.Fragment=d;reactIs_production_min.Lazy=q;reactIs_production_min.Memo=p;reactIs_production_min.Portal=c;reactIs_production_min.Profiler=f;reactIs_production_min.StrictMode=e;reactIs_production_min.Suspense=m;
	reactIs_production_min.SuspenseList=n;reactIs_production_min.isAsyncMode=function(){return  false};reactIs_production_min.isConcurrentMode=function(){return  false};reactIs_production_min.isContextConsumer=function(a){return v(a)===h};reactIs_production_min.isContextProvider=function(a){return v(a)===g};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===b};reactIs_production_min.isForwardRef=function(a){return v(a)===l};reactIs_production_min.isFragment=function(a){return v(a)===d};reactIs_production_min.isLazy=function(a){return v(a)===q};reactIs_production_min.isMemo=function(a){return v(a)===p};
	reactIs_production_min.isPortal=function(a){return v(a)===c};reactIs_production_min.isProfiler=function(a){return v(a)===f};reactIs_production_min.isStrictMode=function(a){return v(a)===e};reactIs_production_min.isSuspense=function(a){return v(a)===m};reactIs_production_min.isSuspenseList=function(a){return v(a)===n};
	reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===d||a===f||a===e||a===m||a===n||a===t||"object"===typeof a&&null!==a&&(a.$$typeof===q||a.$$typeof===p||a.$$typeof===g||a.$$typeof===h||a.$$typeof===l||a.$$typeof===u||void 0!==a.getModuleId)?true:false};reactIs_production_min.typeOf=v;
	return reactIs_production_min;
}

var hasRequiredReactIs;

function requireReactIs () {
	if (hasRequiredReactIs) return reactIs.exports;
	hasRequiredReactIs = 1;

	{
	  reactIs.exports = requireReactIs_production_min();
	}
	return reactIs.exports;
}

var reactIsExports = requireReactIs();
var index = /*@__PURE__*/getDefaultExportFromCjs$2(reactIsExports);

var ReactIs18 = /*#__PURE__*/_mergeNamespaces$1({
  __proto__: null,
  default: index
}, [reactIsExports]);

const reactIsMethods = [
	"isAsyncMode",
	"isConcurrentMode",
	"isContextConsumer",
	"isContextProvider",
	"isElement",
	"isForwardRef",
	"isFragment",
	"isLazy",
	"isMemo",
	"isPortal",
	"isProfiler",
	"isStrictMode",
	"isSuspense",
	"isSuspenseList",
	"isValidElementType"
];
const ReactIs = Object.fromEntries(reactIsMethods.map((m) => [m, (v) => ReactIs18[m](v) || ReactIs19[m](v)]));
// Given element.props.children, or subtree during recursive traversal,
// return flattened array of children.
function getChildren(arg, children = []) {
	if (Array.isArray(arg)) {
		for (const item of arg) {
			getChildren(item, children);
		}
	} else if (arg != null && arg !== false && arg !== "") {
		children.push(arg);
	}
	return children;
}
function getType$2(element) {
	const type = element.type;
	if (typeof type === "string") {
		return type;
	}
	if (typeof type === "function") {
		return type.displayName || type.name || "Unknown";
	}
	if (ReactIs.isFragment(element)) {
		return "React.Fragment";
	}
	if (ReactIs.isSuspense(element)) {
		return "React.Suspense";
	}
	if (typeof type === "object" && type !== null) {
		if (ReactIs.isContextProvider(element)) {
			return "Context.Provider";
		}
		if (ReactIs.isContextConsumer(element)) {
			return "Context.Consumer";
		}
		if (ReactIs.isForwardRef(element)) {
			if (type.displayName) {
				return type.displayName;
			}
			const functionName = type.render.displayName || type.render.name || "";
			return functionName === "" ? "ForwardRef" : `ForwardRef(${functionName})`;
		}
		if (ReactIs.isMemo(element)) {
			const functionName = type.displayName || type.type.displayName || type.type.name || "";
			return functionName === "" ? "Memo" : `Memo(${functionName})`;
		}
	}
	return "UNDEFINED";
}
function getPropKeys$1(element) {
	const { props } = element;
	return Object.keys(props).filter((key) => key !== "children" && props[key] !== undefined).sort();
}
const serialize$1$1 = (element, config, indentation, depth, refs, printer) => ++depth > config.maxDepth ? printElementAsLeaf(getType$2(element), config) : printElement(getType$2(element), printProps(getPropKeys$1(element), element.props, config, indentation + config.indent, depth, refs, printer), printChildren(getChildren(element.props.children), config, indentation + config.indent, depth, refs, printer), config, indentation);
const test$1$1 = (val) => val != null && ReactIs.isElement(val);
const plugin$1 = {
	serialize: serialize$1$1,
	test: test$1$1
};

const testSymbol = typeof Symbol === "function" && Symbol.for ? Symbol.for("react.test.json") : 245830487;
function getPropKeys(object) {
	const { props } = object;
	return props ? Object.keys(props).filter((key) => props[key] !== undefined).sort() : [];
}
const serialize$6 = (object, config, indentation, depth, refs, printer) => ++depth > config.maxDepth ? printElementAsLeaf(object.type, config) : printElement(object.type, object.props ? printProps(getPropKeys(object), object.props, config, indentation + config.indent, depth, refs, printer) : "", object.children ? printChildren(object.children, config, indentation + config.indent, depth, refs, printer) : "", config, indentation);
const test$6 = (val) => val && val.$$typeof === testSymbol;
const plugin$6 = {
	serialize: serialize$6,
	test: test$6
};

const toString$2 = Object.prototype.toString;
const toISOString = Date.prototype.toISOString;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
/**
* Explicitly comparing typeof constructor to function avoids undefined as name
* when mock identity-obj-proxy returns the key as the value for any key.
*/
function getConstructorName$1(val) {
	return typeof val.constructor === "function" && val.constructor.name || "Object";
}
/** Is val is equal to global window object? Works even if it does not exist :) */
function isWindow(val) {
	return typeof window !== "undefined" && val === window;
}
// eslint-disable-next-line regexp/no-super-linear-backtracking
const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
const NEWLINE_REGEXP = /\n/g;
class PrettyFormatPluginError extends Error {
	constructor(message, stack) {
		super(message);
		this.stack = stack;
		this.name = this.constructor.name;
	}
}
function isToStringedArrayType(toStringed) {
	return toStringed === "[object Array]" || toStringed === "[object ArrayBuffer]" || toStringed === "[object DataView]" || toStringed === "[object Float32Array]" || toStringed === "[object Float64Array]" || toStringed === "[object Int8Array]" || toStringed === "[object Int16Array]" || toStringed === "[object Int32Array]" || toStringed === "[object Uint8Array]" || toStringed === "[object Uint8ClampedArray]" || toStringed === "[object Uint16Array]" || toStringed === "[object Uint32Array]";
}
function printNumber(val) {
	return Object.is(val, -0) ? "-0" : String(val);
}
function printBigInt(val) {
	return String(`${val}n`);
}
function printFunction(val, printFunctionName) {
	if (!printFunctionName) {
		return "[Function]";
	}
	return `[Function ${val.name || "anonymous"}]`;
}
function printSymbol(val) {
	return String(val).replace(SYMBOL_REGEXP, "Symbol($1)");
}
function printError(val) {
	return `[${errorToString.call(val)}]`;
}
/**
* The first port of call for printing an object, handles most of the
* data-types in JS.
*/
function printBasicValue(val, printFunctionName, escapeRegex, escapeString) {
	if (val === true || val === false) {
		return `${val}`;
	}
	if (val === undefined) {
		return "undefined";
	}
	if (val === null) {
		return "null";
	}
	const typeOf = typeof val;
	if (typeOf === "number") {
		return printNumber(val);
	}
	if (typeOf === "bigint") {
		return printBigInt(val);
	}
	if (typeOf === "string") {
		if (escapeString) {
			return `"${val.replaceAll(/"|\\/g, "\\$&")}"`;
		}
		return `"${val}"`;
	}
	if (typeOf === "function") {
		return printFunction(val, printFunctionName);
	}
	if (typeOf === "symbol") {
		return printSymbol(val);
	}
	const toStringed = toString$2.call(val);
	if (toStringed === "[object WeakMap]") {
		return "WeakMap {}";
	}
	if (toStringed === "[object WeakSet]") {
		return "WeakSet {}";
	}
	if (toStringed === "[object Function]" || toStringed === "[object GeneratorFunction]") {
		return printFunction(val, printFunctionName);
	}
	if (toStringed === "[object Symbol]") {
		return printSymbol(val);
	}
	if (toStringed === "[object Date]") {
		return Number.isNaN(+val) ? "Date { NaN }" : toISOString.call(val);
	}
	if (toStringed === "[object Error]") {
		return printError(val);
	}
	if (toStringed === "[object RegExp]") {
		if (escapeRegex) {
			// https://github.com/benjamingr/RegExp.escape/blob/main/polyfill.js
			return regExpToString.call(val).replaceAll(/[$()*+.?[\\\]^{|}]/g, "\\$&");
		}
		return regExpToString.call(val);
	}
	if (val instanceof Error) {
		return printError(val);
	}
	return null;
}
/**
* Handles more complex objects ( such as objects with circular references.
* maps and sets etc )
*/
function printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON) {
	if (refs.includes(val)) {
		return "[Circular]";
	}
	refs = [...refs];
	refs.push(val);
	const hitMaxDepth = ++depth > config.maxDepth;
	const min = config.min;
	if (config.callToJSON && !hitMaxDepth && val.toJSON && typeof val.toJSON === "function" && !hasCalledToJSON) {
		return printer(val.toJSON(), config, indentation, depth, refs, true);
	}
	const toStringed = toString$2.call(val);
	if (toStringed === "[object Arguments]") {
		return hitMaxDepth ? "[Arguments]" : `${min ? "" : "Arguments "}[${printListItems(val, config, indentation, depth, refs, printer)}]`;
	}
	if (isToStringedArrayType(toStringed)) {
		return hitMaxDepth ? `[${val.constructor.name}]` : `${min ? "" : !config.printBasicPrototype && val.constructor.name === "Array" ? "" : `${val.constructor.name} `}[${printListItems(val, config, indentation, depth, refs, printer)}]`;
	}
	if (toStringed === "[object Map]") {
		return hitMaxDepth ? "[Map]" : `Map {${printIteratorEntries(val.entries(), config, indentation, depth, refs, printer, " => ")}}`;
	}
	if (toStringed === "[object Set]") {
		return hitMaxDepth ? "[Set]" : `Set {${printIteratorValues(val.values(), config, indentation, depth, refs, printer)}}`;
	}
	// Avoid failure to serialize global window object in jsdom test environment.
	// For example, not even relevant if window is prop of React element.
	return hitMaxDepth || isWindow(val) ? `[${getConstructorName$1(val)}]` : `${min ? "" : !config.printBasicPrototype && getConstructorName$1(val) === "Object" ? "" : `${getConstructorName$1(val)} `}{${printObjectProperties(val, config, indentation, depth, refs, printer)}}`;
}
const ErrorPlugin = {
	test: (val) => val && val instanceof Error,
	serialize(val, config, indentation, depth, refs, printer) {
		if (refs.includes(val)) {
			return "[Circular]";
		}
		refs = [...refs, val];
		const hitMaxDepth = ++depth > config.maxDepth;
		const { message, cause, ...rest } = val;
		const entries = {
			message,
			...typeof cause !== "undefined" ? { cause } : {},
			...val instanceof AggregateError ? { errors: val.errors } : {},
			...rest
		};
		const name = val.name !== "Error" ? val.name : getConstructorName$1(val);
		return hitMaxDepth ? `[${name}]` : `${name} {${printIteratorEntries(Object.entries(entries).values(), config, indentation, depth, refs, printer)}}`;
	}
};
function isNewPlugin(plugin) {
	return plugin.serialize != null;
}
function printPlugin(plugin, val, config, indentation, depth, refs) {
	let printed;
	try {
		printed = isNewPlugin(plugin) ? plugin.serialize(val, config, indentation, depth, refs, printer) : plugin.print(val, (valChild) => printer(valChild, config, indentation, depth, refs), (str) => {
			const indentationNext = indentation + config.indent;
			return indentationNext + str.replaceAll(NEWLINE_REGEXP, `\n${indentationNext}`);
		}, {
			edgeSpacing: config.spacingOuter,
			min: config.min,
			spacing: config.spacingInner
		}, config.colors);
	} catch (error) {
		throw new PrettyFormatPluginError(error.message, error.stack);
	}
	if (typeof printed !== "string") {
		throw new TypeError(`pretty-format: Plugin must return type "string" but instead returned "${typeof printed}".`);
	}
	return printed;
}
function findPlugin(plugins, val) {
	for (const plugin of plugins) {
		try {
			if (plugin.test(val)) {
				return plugin;
			}
		} catch (error) {
			throw new PrettyFormatPluginError(error.message, error.stack);
		}
	}
	return null;
}
function printer(val, config, indentation, depth, refs, hasCalledToJSON) {
	const plugin = findPlugin(config.plugins, val);
	if (plugin !== null) {
		return printPlugin(plugin, val, config, indentation, depth, refs);
	}
	const basicResult = printBasicValue(val, config.printFunctionName, config.escapeRegex, config.escapeString);
	if (basicResult !== null) {
		return basicResult;
	}
	return printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON);
}
const DEFAULT_THEME = {
	comment: "gray",
	content: "reset",
	prop: "yellow",
	tag: "cyan",
	value: "green"
};
const DEFAULT_THEME_KEYS = Object.keys(DEFAULT_THEME);
const DEFAULT_OPTIONS = {
	callToJSON: true,
	compareKeys: undefined,
	escapeRegex: false,
	escapeString: true,
	highlight: false,
	indent: 2,
	maxDepth: Number.POSITIVE_INFINITY,
	maxWidth: Number.POSITIVE_INFINITY,
	min: false,
	plugins: [],
	printBasicPrototype: true,
	printFunctionName: true,
	printShadowRoot: true,
	theme: DEFAULT_THEME
};
function validateOptions(options) {
	for (const key of Object.keys(options)) {
		if (!Object.hasOwn(DEFAULT_OPTIONS, key)) {
			throw new Error(`pretty-format: Unknown option "${key}".`);
		}
	}
	if (options.min && options.indent !== undefined && options.indent !== 0) {
		throw new Error("pretty-format: Options \"min\" and \"indent\" cannot be used together.");
	}
}
function getColorsHighlight() {
	return DEFAULT_THEME_KEYS.reduce((colors, key) => {
		const value = DEFAULT_THEME[key];
		const color = value && C[value];
		if (color && typeof color.close === "string" && typeof color.open === "string") {
			colors[key] = color;
		} else {
			throw new Error(`pretty-format: Option "theme" has a key "${key}" whose value "${value}" is undefined in ansi-styles.`);
		}
		return colors;
	}, Object.create(null));
}
function getColorsEmpty() {
	return DEFAULT_THEME_KEYS.reduce((colors, key) => {
		colors[key] = {
			close: "",
			open: ""
		};
		return colors;
	}, Object.create(null));
}
function getPrintFunctionName(options) {
	return options?.printFunctionName ?? DEFAULT_OPTIONS.printFunctionName;
}
function getEscapeRegex(options) {
	return options?.escapeRegex ?? DEFAULT_OPTIONS.escapeRegex;
}
function getEscapeString(options) {
	return options?.escapeString ?? DEFAULT_OPTIONS.escapeString;
}
function getConfig(options) {
	return {
		callToJSON: options?.callToJSON ?? DEFAULT_OPTIONS.callToJSON,
		colors: options?.highlight ? getColorsHighlight() : getColorsEmpty(),
		compareKeys: typeof options?.compareKeys === "function" || options?.compareKeys === null ? options.compareKeys : DEFAULT_OPTIONS.compareKeys,
		escapeRegex: getEscapeRegex(options),
		escapeString: getEscapeString(options),
		indent: options?.min ? "" : createIndent(options?.indent ?? DEFAULT_OPTIONS.indent),
		maxDepth: options?.maxDepth ?? DEFAULT_OPTIONS.maxDepth,
		maxWidth: options?.maxWidth ?? DEFAULT_OPTIONS.maxWidth,
		min: options?.min ?? DEFAULT_OPTIONS.min,
		plugins: options?.plugins ?? DEFAULT_OPTIONS.plugins,
		printBasicPrototype: options?.printBasicPrototype ?? true,
		printFunctionName: getPrintFunctionName(options),
		printShadowRoot: options?.printShadowRoot ?? true,
		spacingInner: options?.min ? " " : "\n",
		spacingOuter: options?.min ? "" : "\n"
	};
}
function createIndent(indent) {
	return Array.from({ length: indent + 1 }).join(" ");
}
/**
* Returns a presentation string of your `val` object
* @param val any potential JavaScript object
* @param options Custom settings
*/
function format$1(val, options) {
	if (options) {
		validateOptions(options);
		if (options.plugins) {
			const plugin = findPlugin(options.plugins, val);
			if (plugin !== null) {
				return printPlugin(plugin, val, getConfig(options), "", 0, []);
			}
		}
	}
	const basicResult = printBasicValue(val, getPrintFunctionName(options), getEscapeRegex(options), getEscapeString(options));
	if (basicResult !== null) {
		return basicResult;
	}
	return printComplexValue(val, getConfig(options), "", 0, []);
}
const plugins = {
	AsymmetricMatcher: plugin$5,
	DOMCollection: plugin$4,
	DOMElement: plugin$3,
	Immutable: plugin$2,
	ReactElement: plugin$1,
	ReactTestComponent: plugin$6,
	Error: ErrorPlugin
};

const ansiColors$1 = {
    bold: ['1', '22'],
    dim: ['2', '22'],
    italic: ['3', '23'],
    underline: ['4', '24'],
    // 5 & 6 are blinking
    inverse: ['7', '27'],
    hidden: ['8', '28'],
    strike: ['9', '29'],
    // 10-20 are fonts
    // 21-29 are resets for 1-9
    black: ['30', '39'],
    red: ['31', '39'],
    green: ['32', '39'],
    yellow: ['33', '39'],
    blue: ['34', '39'],
    magenta: ['35', '39'],
    cyan: ['36', '39'],
    white: ['37', '39'],
    brightblack: ['30;1', '39'],
    brightred: ['31;1', '39'],
    brightgreen: ['32;1', '39'],
    brightyellow: ['33;1', '39'],
    brightblue: ['34;1', '39'],
    brightmagenta: ['35;1', '39'],
    brightcyan: ['36;1', '39'],
    brightwhite: ['37;1', '39'],
    grey: ['90', '39'],
};
const styles$1 = {
    special: 'cyan',
    number: 'yellow',
    bigint: 'yellow',
    boolean: 'yellow',
    undefined: 'grey',
    null: 'bold',
    string: 'green',
    symbol: 'green',
    date: 'magenta',
    regexp: 'red',
};
const truncator$1 = '…';
function colorise$1(value, styleType) {
    const color = ansiColors$1[styles$1[styleType]] || ansiColors$1[styleType] || '';
    if (!color) {
        return String(value);
    }
    return `\u001b[${color[0]}m${String(value)}\u001b[${color[1]}m`;
}
function normaliseOptions$1({ showHidden = false, depth = 2, colors = false, customInspect = true, showProxy = false, maxArrayLength = Infinity, breakLength = Infinity, seen = [], 
// eslint-disable-next-line no-shadow
truncate = Infinity, stylize = String, } = {}, inspect) {
    const options = {
        showHidden: Boolean(showHidden),
        depth: Number(depth),
        colors: Boolean(colors),
        customInspect: Boolean(customInspect),
        showProxy: Boolean(showProxy),
        maxArrayLength: Number(maxArrayLength),
        breakLength: Number(breakLength),
        truncate: Number(truncate),
        seen,
        inspect,
        stylize,
    };
    if (options.colors) {
        options.stylize = colorise$1;
    }
    return options;
}
function isHighSurrogate$1(char) {
    return char >= '\ud800' && char <= '\udbff';
}
function truncate$1(string, length, tail = truncator$1) {
    string = String(string);
    const tailLength = tail.length;
    const stringLength = string.length;
    if (tailLength > length && stringLength > tailLength) {
        return tail;
    }
    if (stringLength > length && stringLength > tailLength) {
        let end = length - tailLength;
        if (end > 0 && isHighSurrogate$1(string[end - 1])) {
            end = end - 1;
        }
        return `${string.slice(0, end)}${tail}`;
    }
    return string;
}
// eslint-disable-next-line complexity
function inspectList$1(list, options, inspectItem, separator = ', ') {
    inspectItem = inspectItem || options.inspect;
    const size = list.length;
    if (size === 0)
        return '';
    const originalLength = options.truncate;
    let output = '';
    let peek = '';
    let truncated = '';
    for (let i = 0; i < size; i += 1) {
        const last = i + 1 === list.length;
        const secondToLast = i + 2 === list.length;
        truncated = `${truncator$1}(${list.length - i})`;
        const value = list[i];
        // If there is more than one remaining we need to account for a separator of `, `
        options.truncate = originalLength - output.length - (last ? 0 : separator.length);
        const string = peek || inspectItem(value, options) + (last ? '' : separator);
        const nextLength = output.length + string.length;
        const truncatedLength = nextLength + truncated.length;
        // If this is the last element, and adding it would
        // take us over length, but adding the truncator wouldn't - then break now
        if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) {
            break;
        }
        // If this isn't the last or second to last element to scan,
        // but the string is already over length then break here
        if (!last && !secondToLast && truncatedLength > originalLength) {
            break;
        }
        // Peek at the next string to determine if we should
        // break early before adding this item to the output
        peek = last ? '' : inspectItem(list[i + 1], options) + (secondToLast ? '' : separator);
        // If we have one element left, but this element and
        // the next takes over length, the break early
        if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) {
            break;
        }
        output += string;
        // If the next element takes us to length -
        // but there are more after that, then we should truncate now
        if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
            truncated = `${truncator$1}(${list.length - i - 1})`;
            break;
        }
        truncated = '';
    }
    return `${output}${truncated}`;
}
function quoteComplexKey$1(key) {
    if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
        return key;
    }
    return JSON.stringify(key)
        .replace(/'/g, "\\'")
        .replace(/\\"/g, '"')
        .replace(/(^"|"$)/g, "'");
}
function inspectProperty$1([key, value], options) {
    options.truncate -= 2;
    if (typeof key === 'string') {
        key = quoteComplexKey$1(key);
    }
    else if (typeof key !== 'number') {
        key = `[${options.inspect(key, options)}]`;
    }
    options.truncate -= key.length;
    value = options.inspect(value, options);
    return `${key}: ${value}`;
}

function inspectArray$1(array, options) {
    // Object.keys will always output the Array indices first, so we can slice by
    // `array.length` to get non-index properties
    const nonIndexProperties = Object.keys(array).slice(array.length);
    if (!array.length && !nonIndexProperties.length)
        return '[]';
    options.truncate -= 4;
    const listContents = inspectList$1(array, options);
    options.truncate -= listContents.length;
    let propertyContents = '';
    if (nonIndexProperties.length) {
        propertyContents = inspectList$1(nonIndexProperties.map(key => [key, array[key]]), options, inspectProperty$1);
    }
    return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ''} ]`;
}

const getArrayName$1 = (array) => {
    // We need to special case Node.js' Buffers, which report to be Uint8Array
    // @ts-ignore
    if (typeof Buffer === 'function' && array instanceof Buffer) {
        return 'Buffer';
    }
    if (array[Symbol.toStringTag]) {
        return array[Symbol.toStringTag];
    }
    return array.constructor.name;
};
function inspectTypedArray$1(array, options) {
    const name = getArrayName$1(array);
    options.truncate -= name.length + 4;
    // Object.keys will always output the Array indices first, so we can slice by
    // `array.length` to get non-index properties
    const nonIndexProperties = Object.keys(array).slice(array.length);
    if (!array.length && !nonIndexProperties.length)
        return `${name}[]`;
    // As we know TypedArrays only contain Unsigned Integers, we can skip inspecting each one and simply
    // stylise the toString() value of them
    let output = '';
    for (let i = 0; i < array.length; i++) {
        const string = `${options.stylize(truncate$1(array[i], options.truncate), 'number')}${i === array.length - 1 ? '' : ', '}`;
        options.truncate -= string.length;
        if (array[i] !== array.length && options.truncate <= 3) {
            output += `${truncator$1}(${array.length - array[i] + 1})`;
            break;
        }
        output += string;
    }
    let propertyContents = '';
    if (nonIndexProperties.length) {
        propertyContents = inspectList$1(nonIndexProperties.map(key => [key, array[key]]), options, inspectProperty$1);
    }
    return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ''} ]`;
}

function inspectDate$1(dateObject, options) {
    const stringRepresentation = dateObject.toJSON();
    if (stringRepresentation === null) {
        return 'Invalid Date';
    }
    const split = stringRepresentation.split('T');
    const date = split[0];
    // If we need to - truncate the time portion, but never the date
    return options.stylize(`${date}T${truncate$1(split[1], options.truncate - date.length - 1)}`, 'date');
}

function inspectFunction$1(func, options) {
    const functionType = func[Symbol.toStringTag] || 'Function';
    const name = func.name;
    if (!name) {
        return options.stylize(`[${functionType}]`, 'special');
    }
    return options.stylize(`[${functionType} ${truncate$1(name, options.truncate - 11)}]`, 'special');
}

function inspectMapEntry$1([key, value], options) {
    options.truncate -= 4;
    key = options.inspect(key, options);
    options.truncate -= key.length;
    value = options.inspect(value, options);
    return `${key} => ${value}`;
}
// IE11 doesn't support `map.entries()`
function mapToEntries$1(map) {
    const entries = [];
    map.forEach((value, key) => {
        entries.push([key, value]);
    });
    return entries;
}
function inspectMap$1(map, options) {
    if (map.size === 0)
        return 'Map{}';
    options.truncate -= 7;
    return `Map{ ${inspectList$1(mapToEntries$1(map), options, inspectMapEntry$1)} }`;
}

const isNaN$1 = Number.isNaN || (i => i !== i); // eslint-disable-line no-self-compare
function inspectNumber$1(number, options) {
    if (isNaN$1(number)) {
        return options.stylize('NaN', 'number');
    }
    if (number === Infinity) {
        return options.stylize('Infinity', 'number');
    }
    if (number === -Infinity) {
        return options.stylize('-Infinity', 'number');
    }
    if (number === 0) {
        return options.stylize(1 / number === Infinity ? '+0' : '-0', 'number');
    }
    return options.stylize(truncate$1(String(number), options.truncate), 'number');
}

function inspectBigInt$1(number, options) {
    let nums = truncate$1(number.toString(), options.truncate - 1);
    if (nums !== truncator$1)
        nums += 'n';
    return options.stylize(nums, 'bigint');
}

function inspectRegExp$1(value, options) {
    const flags = value.toString().split('/')[2];
    const sourceLength = options.truncate - (2 + flags.length);
    const source = value.source;
    return options.stylize(`/${truncate$1(source, sourceLength)}/${flags}`, 'regexp');
}

// IE11 doesn't support `Array.from(set)`
function arrayFromSet$1(set) {
    const values = [];
    set.forEach(value => {
        values.push(value);
    });
    return values;
}
function inspectSet$1(set, options) {
    if (set.size === 0)
        return 'Set{}';
    options.truncate -= 7;
    return `Set{ ${inspectList$1(arrayFromSet$1(set), options)} }`;
}

const stringEscapeChars$1 = new RegExp("['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5" +
    '\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]', 'g');
const escapeCharacters$1 = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    "'": "\\'",
    '\\': '\\\\',
};
const hex$1 = 16;
function escape$1(char) {
    return (escapeCharacters$1[char] ||
        `\\u${`0000${char.charCodeAt(0).toString(hex$1)}`.slice(-4)}`);
}
function inspectString$1(string, options) {
    if (stringEscapeChars$1.test(string)) {
        string = string.replace(stringEscapeChars$1, escape$1);
    }
    return options.stylize(`'${truncate$1(string, options.truncate - 2)}'`, 'string');
}

function inspectSymbol$1(value) {
    if ('description' in Symbol.prototype) {
        return value.description ? `Symbol(${value.description})` : 'Symbol()';
    }
    return value.toString();
}

const getPromiseValue$1 = () => 'Promise{…}';

function inspectObject$1(object, options) {
    const properties = Object.getOwnPropertyNames(object);
    const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
    if (properties.length === 0 && symbols.length === 0) {
        return '{}';
    }
    options.truncate -= 4;
    options.seen = options.seen || [];
    if (options.seen.includes(object)) {
        return '[Circular]';
    }
    options.seen.push(object);
    const propertyContents = inspectList$1(properties.map(key => [key, object[key]]), options, inspectProperty$1);
    const symbolContents = inspectList$1(symbols.map(key => [key, object[key]]), options, inspectProperty$1);
    options.seen.pop();
    let sep = '';
    if (propertyContents && symbolContents) {
        sep = ', ';
    }
    return `{ ${propertyContents}${sep}${symbolContents} }`;
}

const toStringTag$1 = typeof Symbol !== 'undefined' && Symbol.toStringTag ? Symbol.toStringTag : false;
function inspectClass$1(value, options) {
    let name = '';
    if (toStringTag$1 && toStringTag$1 in value) {
        name = value[toStringTag$1];
    }
    name = name || value.constructor.name;
    // Babel transforms anonymous classes to the name `_class`
    if (!name || name === '_class') {
        name = '<Anonymous Class>';
    }
    options.truncate -= name.length;
    return `${name}${inspectObject$1(value, options)}`;
}

function inspectArguments$1(args, options) {
    if (args.length === 0)
        return 'Arguments[]';
    options.truncate -= 13;
    return `Arguments[ ${inspectList$1(args, options)} ]`;
}

const errorKeys$1 = [
    'stack',
    'line',
    'column',
    'name',
    'message',
    'fileName',
    'lineNumber',
    'columnNumber',
    'number',
    'description',
    'cause',
];
function inspectObject$2(error, options) {
    const properties = Object.getOwnPropertyNames(error).filter(key => errorKeys$1.indexOf(key) === -1);
    const name = error.name;
    options.truncate -= name.length;
    let message = '';
    if (typeof error.message === 'string') {
        message = truncate$1(error.message, options.truncate);
    }
    else {
        properties.unshift('message');
    }
    message = message ? `: ${message}` : '';
    options.truncate -= message.length + 5;
    options.seen = options.seen || [];
    if (options.seen.includes(error)) {
        return '[Circular]';
    }
    options.seen.push(error);
    const propertyContents = inspectList$1(properties.map(key => [key, error[key]]), options, inspectProperty$1);
    return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ''}`;
}

function inspectAttribute$1([key, value], options) {
    options.truncate -= 3;
    if (!value) {
        return `${options.stylize(String(key), 'yellow')}`;
    }
    return `${options.stylize(String(key), 'yellow')}=${options.stylize(`"${value}"`, 'string')}`;
}
function inspectNodeCollection$1(collection, options) {
    return inspectList$1(collection, options, inspectNode$1, '\n');
}
function inspectNode$1(node, options) {
    switch (node.nodeType) {
        case 1:
            return inspectHTML$1(node, options);
        case 3:
            return options.inspect(node.data, options);
        default:
            return options.inspect(node, options);
    }
}
// @ts-ignore (Deno doesn't have Element)
function inspectHTML$1(element, options) {
    const properties = element.getAttributeNames();
    const name = element.tagName.toLowerCase();
    const head = options.stylize(`<${name}`, 'special');
    const headClose = options.stylize(`>`, 'special');
    const tail = options.stylize(`</${name}>`, 'special');
    options.truncate -= name.length * 2 + 5;
    let propertyContents = '';
    if (properties.length > 0) {
        propertyContents += ' ';
        propertyContents += inspectList$1(properties.map((key) => [key, element.getAttribute(key)]), options, inspectAttribute$1, ' ');
    }
    options.truncate -= propertyContents.length;
    const truncate = options.truncate;
    let children = inspectNodeCollection$1(element.children, options);
    if (children && children.length > truncate) {
        children = `${truncator$1}(${element.children.length})`;
    }
    return `${head}${propertyContents}${headClose}${children}${tail}`;
}

/* !
 * loupe
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
const symbolsSupported$1 = typeof Symbol === 'function' && typeof Symbol.for === 'function';
const chaiInspect$1 = symbolsSupported$1 ? Symbol.for('chai/inspect') : '@@chai/inspect';
const nodeInspect$1 = Symbol.for('nodejs.util.inspect.custom');
const constructorMap$1 = new WeakMap();
const stringTagMap$1 = {};
const baseTypesMap$1 = {
    undefined: (value, options) => options.stylize('undefined', 'undefined'),
    null: (value, options) => options.stylize('null', 'null'),
    boolean: (value, options) => options.stylize(String(value), 'boolean'),
    Boolean: (value, options) => options.stylize(String(value), 'boolean'),
    number: inspectNumber$1,
    Number: inspectNumber$1,
    bigint: inspectBigInt$1,
    BigInt: inspectBigInt$1,
    string: inspectString$1,
    String: inspectString$1,
    function: inspectFunction$1,
    Function: inspectFunction$1,
    symbol: inspectSymbol$1,
    // A Symbol polyfill will return `Symbol` not `symbol` from typedetect
    Symbol: inspectSymbol$1,
    Array: inspectArray$1,
    Date: inspectDate$1,
    Map: inspectMap$1,
    Set: inspectSet$1,
    RegExp: inspectRegExp$1,
    Promise: getPromiseValue$1,
    // WeakSet, WeakMap are totally opaque to us
    WeakSet: (value, options) => options.stylize('WeakSet{…}', 'special'),
    WeakMap: (value, options) => options.stylize('WeakMap{…}', 'special'),
    Arguments: inspectArguments$1,
    Int8Array: inspectTypedArray$1,
    Uint8Array: inspectTypedArray$1,
    Uint8ClampedArray: inspectTypedArray$1,
    Int16Array: inspectTypedArray$1,
    Uint16Array: inspectTypedArray$1,
    Int32Array: inspectTypedArray$1,
    Uint32Array: inspectTypedArray$1,
    Float32Array: inspectTypedArray$1,
    Float64Array: inspectTypedArray$1,
    Generator: () => '',
    DataView: () => '',
    ArrayBuffer: () => '',
    Error: inspectObject$2,
    HTMLCollection: inspectNodeCollection$1,
    NodeList: inspectNodeCollection$1,
};
// eslint-disable-next-line complexity
const inspectCustom$1 = (value, options, type, inspectFn) => {
    if (chaiInspect$1 in value && typeof value[chaiInspect$1] === 'function') {
        return value[chaiInspect$1](options);
    }
    if (nodeInspect$1 in value && typeof value[nodeInspect$1] === 'function') {
        return value[nodeInspect$1](options.depth, options, inspectFn);
    }
    if ('inspect' in value && typeof value.inspect === 'function') {
        return value.inspect(options.depth, options);
    }
    if ('constructor' in value && constructorMap$1.has(value.constructor)) {
        return constructorMap$1.get(value.constructor)(value, options);
    }
    if (stringTagMap$1[type]) {
        return stringTagMap$1[type](value, options);
    }
    return '';
};
const toString$1 = Object.prototype.toString;
// eslint-disable-next-line complexity
function inspect$1(value, opts = {}) {
    const options = normaliseOptions$1(opts, inspect$1);
    const { customInspect } = options;
    let type = value === null ? 'null' : typeof value;
    if (type === 'object') {
        type = toString$1.call(value).slice(8, -1);
    }
    // If it is a base value that we already support, then use Loupe's inspector
    if (type in baseTypesMap$1) {
        return baseTypesMap$1[type](value, options);
    }
    // If `options.customInspect` is set to true then try to use the custom inspector
    if (customInspect && value) {
        const output = inspectCustom$1(value, options, type, inspect$1);
        if (output) {
            if (typeof output === 'string')
                return output;
            return inspect$1(output, options);
        }
    }
    const proto = value ? Object.getPrototypeOf(value) : false;
    // If it's a plain Object then use Loupe's inspector
    if (proto === Object.prototype || proto === null) {
        return inspectObject$1(value, options);
    }
    // Specifically account for HTMLElements
    // @ts-ignore
    if (value && typeof HTMLElement === 'function' && value instanceof HTMLElement) {
        return inspectHTML$1(value, options);
    }
    if ('constructor' in value) {
        // If it is a class, inspect it like an object but add the constructor name
        if (value.constructor !== Object) {
            return inspectClass$1(value, options);
        }
        // If it is an object with an anonymous prototype, display it as an object.
        return inspectObject$1(value, options);
    }
    // last chance to check if it's an object
    if (value === Object(value)) {
        return inspectObject$1(value, options);
    }
    // We have run out of options! Just stringify the value
    return options.stylize(String(value), type);
}

const { AsymmetricMatcher: AsymmetricMatcher$3, DOMCollection: DOMCollection$2, DOMElement: DOMElement$2, Immutable: Immutable$2, ReactElement: ReactElement$2, ReactTestComponent: ReactTestComponent$2 } = plugins;
const PLUGINS$2 = [
	ReactTestComponent$2,
	ReactElement$2,
	DOMElement$2,
	DOMCollection$2,
	Immutable$2,
	AsymmetricMatcher$3
];
function stringify(object, maxDepth = 10, { maxLength, ...options } = {}) {
	const MAX_LENGTH = maxLength ?? 1e4;
	let result;
	try {
		result = format$1(object, {
			maxDepth,
			escapeString: false,
			plugins: PLUGINS$2,
			...options
		});
	} catch {
		result = format$1(object, {
			callToJSON: false,
			maxDepth,
			escapeString: false,
			plugins: PLUGINS$2,
			...options
		});
	}
	// Prevents infinite loop https://github.com/vitest-dev/vitest/issues/7249
	return result.length >= MAX_LENGTH && maxDepth > 1 ? stringify(object, Math.floor(Math.min(maxDepth, Number.MAX_SAFE_INTEGER) / 2), {
		maxLength,
		...options
	}) : result;
}
const formatRegExp = /%[sdjifoOc%]/g;
function baseFormat(args, options = {}) {
	const formatArg = (item, inspecOptions) => {
		if (options.prettifyObject) {
			return stringify(item, undefined, {
				printBasicPrototype: false,
				escapeString: false
			});
		}
		return inspect$2(item, inspecOptions);
	};
	if (typeof args[0] !== "string") {
		const objects = [];
		for (let i = 0; i < args.length; i++) {
			objects.push(formatArg(args[i], {
				depth: 0,
				colors: false
			}));
		}
		return objects.join(" ");
	}
	const len = args.length;
	let i = 1;
	const template = args[0];
	let str = String(template).replace(formatRegExp, (x) => {
		if (x === "%%") {
			return "%";
		}
		if (i >= len) {
			return x;
		}
		switch (x) {
			case "%s": {
				const value = args[i++];
				if (typeof value === "bigint") {
					return `${value.toString()}n`;
				}
				if (typeof value === "number" && value === 0 && 1 / value < 0) {
					return "-0";
				}
				if (typeof value === "object" && value !== null) {
					if (typeof value.toString === "function" && value.toString !== Object.prototype.toString) {
						return value.toString();
					}
					return formatArg(value, {
						depth: 0,
						colors: false
					});
				}
				return String(value);
			}
			case "%d": {
				const value = args[i++];
				if (typeof value === "bigint") {
					return `${value.toString()}n`;
				}
				return Number(value).toString();
			}
			case "%i": {
				const value = args[i++];
				if (typeof value === "bigint") {
					return `${value.toString()}n`;
				}
				return Number.parseInt(String(value)).toString();
			}
			case "%f": return Number.parseFloat(String(args[i++])).toString();
			case "%o": return formatArg(args[i++], {
				showHidden: true,
				showProxy: true
			});
			case "%O": return formatArg(args[i++]);
			case "%c": {
				i++;
				return "";
			}
			case "%j": try {
				return JSON.stringify(args[i++]);
			} catch (err) {
				const m = err.message;
				if (m.includes("circular structure") || m.includes("cyclic structures") || m.includes("cyclic object")) {
					return "[Circular]";
				}
				throw err;
			}
			default: return x;
		}
	});
	for (let x = args[i]; i < len; x = args[++i]) {
		if (x === null || typeof x !== "object") {
			str += ` ${x}`;
		} else {
			str += ` ${formatArg(x)}`;
		}
	}
	return str;
}
function format(...args) {
	return baseFormat(args);
}
function inspect$2(obj, options = {}) {
	if (options.truncate === 0) {
		options.truncate = Number.POSITIVE_INFINITY;
	}
	return inspect$1(obj, options);
}
function objDisplay$1(obj, options = {}) {
	if (typeof options.truncate === "undefined") {
		options.truncate = 40;
	}
	const str = inspect$2(obj, options);
	const type = Object.prototype.toString.call(obj);
	if (options.truncate && str.length >= options.truncate) {
		if (type === "[object Function]") {
			const fn = obj;
			return !fn.name ? "[Function]" : `[Function: ${fn.name}]`;
		} else if (type === "[object Array]") {
			return `[ Array(${obj.length}) ]`;
		} else if (type === "[object Object]") {
			const keys = Object.keys(obj);
			const kstr = keys.length > 2 ? `${keys.splice(0, 2).join(", ")}, ...` : keys.join(", ");
			return `{ Object (${kstr}) }`;
		} else {
			return str;
		}
	}
	return str;
}

/**
* Get original stacktrace without source map support the most performant way.
* - Create only 1 stack frame.
* - Rewrite prepareStackTrace to bypass "support-stack-trace" (usually takes ~250ms).
*/
function createSimpleStackTrace(options) {
	const { message = "$$stack trace error", stackTraceLimit = 1 } = options || {};
	const limit = Error.stackTraceLimit;
	const prepareStackTrace = Error.prepareStackTrace;
	Error.stackTraceLimit = stackTraceLimit;
	Error.prepareStackTrace = (e) => e.stack;
	const err = new Error(message);
	const stackTrace = err.stack || "";
	Error.prepareStackTrace = prepareStackTrace;
	Error.stackTraceLimit = limit;
	return stackTrace;
}
function assertTypes(value, name, types) {
	const receivedType = typeof value;
	const pass = types.includes(receivedType);
	if (!pass) {
		throw new TypeError(`${name} value must be ${types.join(" or ")}, received "${receivedType}"`);
	}
}
function toArray(array) {
	if (array === null || array === undefined) {
		array = [];
	}
	if (Array.isArray(array)) {
		return array;
	}
	return [array];
}
function isObject$1(item) {
	return item != null && typeof item === "object" && !Array.isArray(item);
}
function isFinalObj(obj) {
	return obj === Object.prototype || obj === Function.prototype || obj === RegExp.prototype;
}
function getType$1(value) {
	return Object.prototype.toString.apply(value).slice(8, -1);
}
function collectOwnProperties(obj, collector) {
	const collect = typeof collector === "function" ? collector : (key) => collector.add(key);
	Object.getOwnPropertyNames(obj).forEach(collect);
	Object.getOwnPropertySymbols(obj).forEach(collect);
}
function getOwnProperties(obj) {
	const ownProps = new Set();
	if (isFinalObj(obj)) {
		return [];
	}
	collectOwnProperties(obj, ownProps);
	return Array.from(ownProps);
}
const defaultCloneOptions = { forceWritable: false };
function deepClone(val, options = defaultCloneOptions) {
	const seen = new WeakMap();
	return clone(val, seen, options);
}
function clone(val, seen, options = defaultCloneOptions) {
	let k, out;
	if (seen.has(val)) {
		return seen.get(val);
	}
	if (Array.isArray(val)) {
		out = Array.from({ length: k = val.length });
		seen.set(val, out);
		while (k--) {
			out[k] = clone(val[k], seen, options);
		}
		return out;
	}
	if (Object.prototype.toString.call(val) === "[object Object]") {
		out = Object.create(Object.getPrototypeOf(val));
		seen.set(val, out);
		// we don't need properties from prototype
		const props = getOwnProperties(val);
		for (const k of props) {
			const descriptor = Object.getOwnPropertyDescriptor(val, k);
			if (!descriptor) {
				continue;
			}
			const cloned = clone(val[k], seen, options);
			if (options.forceWritable) {
				Object.defineProperty(out, k, {
					enumerable: descriptor.enumerable,
					configurable: true,
					writable: true,
					value: cloned
				});
			} else if ("get" in descriptor) {
				Object.defineProperty(out, k, {
					...descriptor,
					get() {
						return cloned;
					}
				});
			} else {
				Object.defineProperty(out, k, {
					...descriptor,
					value: cloned
				});
			}
		}
		return out;
	}
	return val;
}
function noop() {}
function objectAttr(source, path, defaultValue = undefined) {
	// a[3].b -> a.3.b
	const paths = path.replace(/\[(\d+)\]/g, ".$1").split(".");
	let result = source;
	for (const p of paths) {
		result = new Object(result)[p];
		if (result === undefined) {
			return defaultValue;
		}
	}
	return result;
}
function createDefer() {
	let resolve = null;
	let reject = null;
	const p = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	p.resolve = resolve;
	p.reject = reject;
	return p;
}
function isNegativeNaN(val) {
	if (!Number.isNaN(val)) {
		return false;
	}
	const f64 = new Float64Array(1);
	f64[0] = val;
	const u32 = new Uint32Array(f64.buffer);
	const isNegative = u32[1] >>> 31 === 1;
	return isNegative;
}

function getDefaultExportFromCjs$1(x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}

/**
* Diff Match and Patch
* Copyright 2018 The diff-match-patch Authors.
* https://github.com/google/diff-match-patch
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @fileoverview Computes the difference between two texts to create a patch.
* Applies the patch onto another text, allowing for errors.
* @author fraser@google.com (Neil Fraser)
*/
/**
* CHANGES by pedrottimark to diff_match_patch_uncompressed.ts file:
*
* 1. Delete anything not needed to use diff_cleanupSemantic method
* 2. Convert from prototype properties to var declarations
* 3. Convert Diff to class from constructor and prototype
* 4. Add type annotations for arguments and return values
* 5. Add exports
*/
/**
* The data structure representing a diff is an array of tuples:
* [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
* which means: delete 'Hello', add 'Goodbye' and keep ' world.'
*/
const DIFF_DELETE = -1;
const DIFF_INSERT = 1;
const DIFF_EQUAL = 0;
/**
* Class representing one diff tuple.
* Attempts to look like a two-element array (which is what this used to be).
* @param {number} op Operation, one of: DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL.
* @param {string} text Text to be deleted, inserted, or retained.
* @constructor
*/
class Diff {
	0;
	1;
	constructor(op, text) {
		this[0] = op;
		this[1] = text;
	}
}
/**
* Determine the common prefix of two strings.
* @param {string} text1 First string.
* @param {string} text2 Second string.
* @return {number} The number of characters common to the start of each
*     string.
*/
function diff_commonPrefix(text1, text2) {
	// Quick check for common null cases.
	if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
		return 0;
	}
	// Binary search.
	// Performance analysis: https://neil.fraser.name/news/2007/10/09/
	let pointermin = 0;
	let pointermax = Math.min(text1.length, text2.length);
	let pointermid = pointermax;
	let pointerstart = 0;
	while (pointermin < pointermid) {
		if (text1.substring(pointerstart, pointermid) === text2.substring(pointerstart, pointermid)) {
			pointermin = pointermid;
			pointerstart = pointermin;
		} else {
			pointermax = pointermid;
		}
		pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	}
	return pointermid;
}
/**
* Determine the common suffix of two strings.
* @param {string} text1 First string.
* @param {string} text2 Second string.
* @return {number} The number of characters common to the end of each string.
*/
function diff_commonSuffix(text1, text2) {
	// Quick check for common null cases.
	if (!text1 || !text2 || text1.charAt(text1.length - 1) !== text2.charAt(text2.length - 1)) {
		return 0;
	}
	// Binary search.
	// Performance analysis: https://neil.fraser.name/news/2007/10/09/
	let pointermin = 0;
	let pointermax = Math.min(text1.length, text2.length);
	let pointermid = pointermax;
	let pointerend = 0;
	while (pointermin < pointermid) {
		if (text1.substring(text1.length - pointermid, text1.length - pointerend) === text2.substring(text2.length - pointermid, text2.length - pointerend)) {
			pointermin = pointermid;
			pointerend = pointermin;
		} else {
			pointermax = pointermid;
		}
		pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	}
	return pointermid;
}
/**
* Determine if the suffix of one string is the prefix of another.
* @param {string} text1 First string.
* @param {string} text2 Second string.
* @return {number} The number of characters common to the end of the first
*     string and the start of the second string.
* @private
*/
function diff_commonOverlap_(text1, text2) {
	// Cache the text lengths to prevent multiple calls.
	const text1_length = text1.length;
	const text2_length = text2.length;
	// Eliminate the null case.
	if (text1_length === 0 || text2_length === 0) {
		return 0;
	}
	// Truncate the longer string.
	if (text1_length > text2_length) {
		text1 = text1.substring(text1_length - text2_length);
	} else if (text1_length < text2_length) {
		text2 = text2.substring(0, text1_length);
	}
	const text_length = Math.min(text1_length, text2_length);
	// Quick check for the worst case.
	if (text1 === text2) {
		return text_length;
	}
	// Start by looking for a single character match
	// and increase length until no match is found.
	// Performance analysis: https://neil.fraser.name/news/2010/11/04/
	let best = 0;
	let length = 1;
	while (true) {
		const pattern = text1.substring(text_length - length);
		const found = text2.indexOf(pattern);
		if (found === -1) {
			return best;
		}
		length += found;
		if (found === 0 || text1.substring(text_length - length) === text2.substring(0, length)) {
			best = length;
			length++;
		}
	}
}
/**
* Reduce the number of edits by eliminating semantically trivial equalities.
* @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
*/
function diff_cleanupSemantic(diffs) {
	let changes = false;
	const equalities = [];
	let equalitiesLength = 0;
	/** @type {?string} */
	let lastEquality = null;
	// Always equal to diffs[equalities[equalitiesLength - 1]][1]
	let pointer = 0;
	// Number of characters that changed prior to the equality.
	let length_insertions1 = 0;
	let length_deletions1 = 0;
	// Number of characters that changed after the equality.
	let length_insertions2 = 0;
	let length_deletions2 = 0;
	while (pointer < diffs.length) {
		if (diffs[pointer][0] === DIFF_EQUAL) {
			// Equality found.
			equalities[equalitiesLength++] = pointer;
			length_insertions1 = length_insertions2;
			length_deletions1 = length_deletions2;
			length_insertions2 = 0;
			length_deletions2 = 0;
			lastEquality = diffs[pointer][1];
		} else {
			// An insertion or deletion.
			if (diffs[pointer][0] === DIFF_INSERT) {
				length_insertions2 += diffs[pointer][1].length;
			} else {
				length_deletions2 += diffs[pointer][1].length;
			}
			// Eliminate an equality that is smaller or equal to the edits on both
			// sides of it.
			if (lastEquality && lastEquality.length <= Math.max(length_insertions1, length_deletions1) && lastEquality.length <= Math.max(length_insertions2, length_deletions2)) {
				// Duplicate record.
				diffs.splice(equalities[equalitiesLength - 1], 0, new Diff(DIFF_DELETE, lastEquality));
				// Change second copy to insert.
				diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
				// Throw away the equality we just deleted.
				equalitiesLength--;
				// Throw away the previous equality (it needs to be reevaluated).
				equalitiesLength--;
				pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
				length_insertions1 = 0;
				length_deletions1 = 0;
				length_insertions2 = 0;
				length_deletions2 = 0;
				lastEquality = null;
				changes = true;
			}
		}
		pointer++;
	}
	// Normalize the diff.
	if (changes) {
		diff_cleanupMerge(diffs);
	}
	diff_cleanupSemanticLossless(diffs);
	// Find any overlaps between deletions and insertions.
	// e.g: <del>abcxxx</del><ins>xxxdef</ins>
	//   -> <del>abc</del>xxx<ins>def</ins>
	// e.g: <del>xxxabc</del><ins>defxxx</ins>
	//   -> <ins>def</ins>xxx<del>abc</del>
	// Only extract an overlap if it is as big as the edit ahead or behind it.
	pointer = 1;
	while (pointer < diffs.length) {
		if (diffs[pointer - 1][0] === DIFF_DELETE && diffs[pointer][0] === DIFF_INSERT) {
			const deletion = diffs[pointer - 1][1];
			const insertion = diffs[pointer][1];
			const overlap_length1 = diff_commonOverlap_(deletion, insertion);
			const overlap_length2 = diff_commonOverlap_(insertion, deletion);
			if (overlap_length1 >= overlap_length2) {
				if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
					// Overlap found.  Insert an equality and trim the surrounding edits.
					diffs.splice(pointer, 0, new Diff(DIFF_EQUAL, insertion.substring(0, overlap_length1)));
					diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
					diffs[pointer + 1][1] = insertion.substring(overlap_length1);
					pointer++;
				}
			} else {
				if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
					// Reverse overlap found.
					// Insert an equality and swap and trim the surrounding edits.
					diffs.splice(pointer, 0, new Diff(DIFF_EQUAL, deletion.substring(0, overlap_length2)));
					diffs[pointer - 1][0] = DIFF_INSERT;
					diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
					diffs[pointer + 1][0] = DIFF_DELETE;
					diffs[pointer + 1][1] = deletion.substring(overlap_length2);
					pointer++;
				}
			}
			pointer++;
		}
		pointer++;
	}
}
// Define some regex patterns for matching boundaries.
const nonAlphaNumericRegex_ = /[^a-z0-9]/i;
const whitespaceRegex_ = /\s/;
const linebreakRegex_ = /[\r\n]/;
const blanklineEndRegex_ = /\n\r?\n$/;
const blanklineStartRegex_ = /^\r?\n\r?\n/;
/**
* Look for single edits surrounded on both sides by equalities
* which can be shifted sideways to align the edit to a word boundary.
* e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
* @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
*/
function diff_cleanupSemanticLossless(diffs) {
	let pointer = 1;
	// Intentionally ignore the first and last element (don't need checking).
	while (pointer < diffs.length - 1) {
		if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
			// This is a single edit surrounded by equalities.
			let equality1 = diffs[pointer - 1][1];
			let edit = diffs[pointer][1];
			let equality2 = diffs[pointer + 1][1];
			// First, shift the edit as far left as possible.
			const commonOffset = diff_commonSuffix(equality1, edit);
			if (commonOffset) {
				const commonString = edit.substring(edit.length - commonOffset);
				equality1 = equality1.substring(0, equality1.length - commonOffset);
				edit = commonString + edit.substring(0, edit.length - commonOffset);
				equality2 = commonString + equality2;
			}
			// Second, step character by character right, looking for the best fit.
			let bestEquality1 = equality1;
			let bestEdit = edit;
			let bestEquality2 = equality2;
			let bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
			while (edit.charAt(0) === equality2.charAt(0)) {
				equality1 += edit.charAt(0);
				edit = edit.substring(1) + equality2.charAt(0);
				equality2 = equality2.substring(1);
				const score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
				// The >= encourages trailing rather than leading whitespace on edits.
				if (score >= bestScore) {
					bestScore = score;
					bestEquality1 = equality1;
					bestEdit = edit;
					bestEquality2 = equality2;
				}
			}
			if (diffs[pointer - 1][1] !== bestEquality1) {
				// We have an improvement, save it back to the diff.
				if (bestEquality1) {
					diffs[pointer - 1][1] = bestEquality1;
				} else {
					diffs.splice(pointer - 1, 1);
					pointer--;
				}
				diffs[pointer][1] = bestEdit;
				if (bestEquality2) {
					diffs[pointer + 1][1] = bestEquality2;
				} else {
					diffs.splice(pointer + 1, 1);
					pointer--;
				}
			}
		}
		pointer++;
	}
}
/**
* Reorder and merge like edit sections.  Merge equalities.
* Any edit section can move as long as it doesn't cross an equality.
* @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
*/
function diff_cleanupMerge(diffs) {
	var _diffs$at;
	// Add a dummy entry at the end.
	diffs.push(new Diff(DIFF_EQUAL, ""));
	let pointer = 0;
	let count_delete = 0;
	let count_insert = 0;
	let text_delete = "";
	let text_insert = "";
	let commonlength;
	while (pointer < diffs.length) {
		switch (diffs[pointer][0]) {
			case DIFF_INSERT:
				count_insert++;
				text_insert += diffs[pointer][1];
				pointer++;
				break;
			case DIFF_DELETE:
				count_delete++;
				text_delete += diffs[pointer][1];
				pointer++;
				break;
			case DIFF_EQUAL:
				// Upon reaching an equality, check for prior redundancies.
				if (count_delete + count_insert > 1) {
					if (count_delete !== 0 && count_insert !== 0) {
						// Factor out any common prefixes.
						commonlength = diff_commonPrefix(text_insert, text_delete);
						if (commonlength !== 0) {
							if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] === DIFF_EQUAL) {
								diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
							} else {
								diffs.splice(0, 0, new Diff(DIFF_EQUAL, text_insert.substring(0, commonlength)));
								pointer++;
							}
							text_insert = text_insert.substring(commonlength);
							text_delete = text_delete.substring(commonlength);
						}
						// Factor out any common suffixes.
						commonlength = diff_commonSuffix(text_insert, text_delete);
						if (commonlength !== 0) {
							diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
							text_insert = text_insert.substring(0, text_insert.length - commonlength);
							text_delete = text_delete.substring(0, text_delete.length - commonlength);
						}
					}
					// Delete the offending records and add the merged ones.
					pointer -= count_delete + count_insert;
					diffs.splice(pointer, count_delete + count_insert);
					if (text_delete.length) {
						diffs.splice(pointer, 0, new Diff(DIFF_DELETE, text_delete));
						pointer++;
					}
					if (text_insert.length) {
						diffs.splice(pointer, 0, new Diff(DIFF_INSERT, text_insert));
						pointer++;
					}
					pointer++;
				} else if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
					// Merge this equality with the previous one.
					diffs[pointer - 1][1] += diffs[pointer][1];
					diffs.splice(pointer, 1);
				} else {
					pointer++;
				}
				count_insert = 0;
				count_delete = 0;
				text_delete = "";
				text_insert = "";
				break;
		}
	}
	if (((_diffs$at = diffs.at(-1)) === null || _diffs$at === void 0 ? void 0 : _diffs$at[1]) === "") {
		diffs.pop();
	}
	// Second pass: look for single edits surrounded on both sides by equalities
	// which can be shifted sideways to eliminate an equality.
	// e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	let changes = false;
	pointer = 1;
	// Intentionally ignore the first and last element (don't need checking).
	while (pointer < diffs.length - 1) {
		if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
			// This is a single edit surrounded by equalities.
			if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) === diffs[pointer - 1][1]) {
				// Shift the edit over the previous equality.
				diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
				diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
				diffs.splice(pointer - 1, 1);
				changes = true;
			} else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) === diffs[pointer + 1][1]) {
				// Shift the edit over the next equality.
				diffs[pointer - 1][1] += diffs[pointer + 1][1];
				diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
				diffs.splice(pointer + 1, 1);
				changes = true;
			}
		}
		pointer++;
	}
	// If shifts were made, the diff needs reordering and another shift sweep.
	if (changes) {
		diff_cleanupMerge(diffs);
	}
}
/**
* Given two strings, compute a score representing whether the internal
* boundary falls on logical boundaries.
* Scores range from 6 (best) to 0 (worst).
* Closure, but does not reference any external variables.
* @param {string} one First string.
* @param {string} two Second string.
* @return {number} The score.
* @private
*/
function diff_cleanupSemanticScore_(one, two) {
	if (!one || !two) {
		// Edges are the best.
		return 6;
	}
	// Each port of this function behaves slightly differently due to
	// subtle differences in each language's definition of things like
	// 'whitespace'.  Since this function's purpose is largely cosmetic,
	// the choice has been made to use each language's native features
	// rather than force total conformity.
	const char1 = one.charAt(one.length - 1);
	const char2 = two.charAt(0);
	const nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
	const nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
	const whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
	const whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
	const lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
	const lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
	const blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
	const blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);
	if (blankLine1 || blankLine2) {
		// Five points for blank lines.
		return 5;
	} else if (lineBreak1 || lineBreak2) {
		// Four points for line breaks.
		return 4;
	} else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
		// Three points for end of sentences.
		return 3;
	} else if (whitespace1 || whitespace2) {
		// Two points for whitespace.
		return 2;
	} else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
		// One point for non-alphanumeric.
		return 1;
	}
	return 0;
}

/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
const NO_DIFF_MESSAGE = "Compared values have no visual difference.";
const SIMILAR_MESSAGE = "Compared values serialize to the same structure.\n" + "Printing internal object structure without calling `toJSON` instead.";

var build = {};

var hasRequiredBuild;

function requireBuild () {
	if (hasRequiredBuild) return build;
	hasRequiredBuild = 1;

	Object.defineProperty(build, '__esModule', {
	  value: true
	});
	build.default = diffSequence;
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	// This diff-sequences package implements the linear space variation in
	// An O(ND) Difference Algorithm and Its Variations by Eugene W. Myers

	// Relationship in notation between Myers paper and this package:
	// A is a
	// N is aLength, aEnd - aStart, and so on
	// x is aIndex, aFirst, aLast, and so on
	// B is b
	// M is bLength, bEnd - bStart, and so on
	// y is bIndex, bFirst, bLast, and so on
	// Δ = N - M is negative of baDeltaLength = bLength - aLength
	// D is d
	// k is kF
	// k + Δ is kF = kR - baDeltaLength
	// V is aIndexesF or aIndexesR (see comment below about Indexes type)
	// index intervals [1, N] and [1, M] are [0, aLength) and [0, bLength)
	// starting point in forward direction (0, 0) is (-1, -1)
	// starting point in reverse direction (N + 1, M + 1) is (aLength, bLength)

	// The “edit graph” for sequences a and b corresponds to items:
	// in a on the horizontal axis
	// in b on the vertical axis
	//
	// Given a-coordinate of a point in a diagonal, you can compute b-coordinate.
	//
	// Forward diagonals kF:
	// zero diagonal intersects top left corner
	// positive diagonals intersect top edge
	// negative diagonals insersect left edge
	//
	// Reverse diagonals kR:
	// zero diagonal intersects bottom right corner
	// positive diagonals intersect right edge
	// negative diagonals intersect bottom edge

	// The graph contains a directed acyclic graph of edges:
	// horizontal: delete an item from a
	// vertical: insert an item from b
	// diagonal: common item in a and b
	//
	// The algorithm solves dual problems in the graph analogy:
	// Find longest common subsequence: path with maximum number of diagonal edges
	// Find shortest edit script: path with minimum number of non-diagonal edges

	// Input callback function compares items at indexes in the sequences.

	// Output callback function receives the number of adjacent items
	// and starting indexes of each common subsequence.
	// Either original functions or wrapped to swap indexes if graph is transposed.
	// Indexes in sequence a of last point of forward or reverse paths in graph.
	// Myers algorithm indexes by diagonal k which for negative is bad deopt in V8.
	// This package indexes by iF and iR which are greater than or equal to zero.
	// and also updates the index arrays in place to cut memory in half.
	// kF = 2 * iF - d
	// kR = d - 2 * iR
	// Division of index intervals in sequences a and b at the middle change.
	// Invariant: intervals do not have common items at the start or end.
	const pkg = 'diff-sequences'; // for error messages
	const NOT_YET_SET = 0; // small int instead of undefined to avoid deopt in V8

	// Return the number of common items that follow in forward direction.
	// The length of what Myers paper calls a “snake” in a forward path.
	const countCommonItemsF = (aIndex, aEnd, bIndex, bEnd, isCommon) => {
	  let nCommon = 0;
	  while (aIndex < aEnd && bIndex < bEnd && isCommon(aIndex, bIndex)) {
	    aIndex += 1;
	    bIndex += 1;
	    nCommon += 1;
	  }
	  return nCommon;
	};

	// Return the number of common items that precede in reverse direction.
	// The length of what Myers paper calls a “snake” in a reverse path.
	const countCommonItemsR = (aStart, aIndex, bStart, bIndex, isCommon) => {
	  let nCommon = 0;
	  while (aStart <= aIndex && bStart <= bIndex && isCommon(aIndex, bIndex)) {
	    aIndex -= 1;
	    bIndex -= 1;
	    nCommon += 1;
	  }
	  return nCommon;
	};

	// A simple function to extend forward paths from (d - 1) to d changes
	// when forward and reverse paths cannot yet overlap.
	const extendPathsF = (
	  d,
	  aEnd,
	  bEnd,
	  bF,
	  isCommon,
	  aIndexesF,
	  iMaxF // return the value because optimization might decrease it
	) => {
	  // Unroll the first iteration.
	  let iF = 0;
	  let kF = -d; // kF = 2 * iF - d
	  let aFirst = aIndexesF[iF]; // in first iteration always insert
	  let aIndexPrev1 = aFirst; // prev value of [iF - 1] in next iteration
	  aIndexesF[iF] += countCommonItemsF(
	    aFirst + 1,
	    aEnd,
	    bF + aFirst - kF + 1,
	    bEnd,
	    isCommon
	  );

	  // Optimization: skip diagonals in which paths cannot ever overlap.
	  const nF = d < iMaxF ? d : iMaxF;

	  // The diagonals kF are odd when d is odd and even when d is even.
	  for (iF += 1, kF += 2; iF <= nF; iF += 1, kF += 2) {
	    // To get first point of path segment, move one change in forward direction
	    // from last point of previous path segment in an adjacent diagonal.
	    // In last possible iteration when iF === d and kF === d always delete.
	    if (iF !== d && aIndexPrev1 < aIndexesF[iF]) {
	      aFirst = aIndexesF[iF]; // vertical to insert from b
	    } else {
	      aFirst = aIndexPrev1 + 1; // horizontal to delete from a

	      if (aEnd <= aFirst) {
	        // Optimization: delete moved past right of graph.
	        return iF - 1;
	      }
	    }

	    // To get last point of path segment, move along diagonal of common items.
	    aIndexPrev1 = aIndexesF[iF];
	    aIndexesF[iF] =
	      aFirst +
	      countCommonItemsF(aFirst + 1, aEnd, bF + aFirst - kF + 1, bEnd, isCommon);
	  }
	  return iMaxF;
	};

	// A simple function to extend reverse paths from (d - 1) to d changes
	// when reverse and forward paths cannot yet overlap.
	const extendPathsR = (
	  d,
	  aStart,
	  bStart,
	  bR,
	  isCommon,
	  aIndexesR,
	  iMaxR // return the value because optimization might decrease it
	) => {
	  // Unroll the first iteration.
	  let iR = 0;
	  let kR = d; // kR = d - 2 * iR
	  let aFirst = aIndexesR[iR]; // in first iteration always insert
	  let aIndexPrev1 = aFirst; // prev value of [iR - 1] in next iteration
	  aIndexesR[iR] -= countCommonItemsR(
	    aStart,
	    aFirst - 1,
	    bStart,
	    bR + aFirst - kR - 1,
	    isCommon
	  );

	  // Optimization: skip diagonals in which paths cannot ever overlap.
	  const nR = d < iMaxR ? d : iMaxR;

	  // The diagonals kR are odd when d is odd and even when d is even.
	  for (iR += 1, kR -= 2; iR <= nR; iR += 1, kR -= 2) {
	    // To get first point of path segment, move one change in reverse direction
	    // from last point of previous path segment in an adjacent diagonal.
	    // In last possible iteration when iR === d and kR === -d always delete.
	    if (iR !== d && aIndexesR[iR] < aIndexPrev1) {
	      aFirst = aIndexesR[iR]; // vertical to insert from b
	    } else {
	      aFirst = aIndexPrev1 - 1; // horizontal to delete from a

	      if (aFirst < aStart) {
	        // Optimization: delete moved past left of graph.
	        return iR - 1;
	      }
	    }

	    // To get last point of path segment, move along diagonal of common items.
	    aIndexPrev1 = aIndexesR[iR];
	    aIndexesR[iR] =
	      aFirst -
	      countCommonItemsR(
	        aStart,
	        aFirst - 1,
	        bStart,
	        bR + aFirst - kR - 1,
	        isCommon
	      );
	  }
	  return iMaxR;
	};

	// A complete function to extend forward paths from (d - 1) to d changes.
	// Return true if a path overlaps reverse path of (d - 1) changes in its diagonal.
	const extendOverlappablePathsF = (
	  d,
	  aStart,
	  aEnd,
	  bStart,
	  bEnd,
	  isCommon,
	  aIndexesF,
	  iMaxF,
	  aIndexesR,
	  iMaxR,
	  division // update prop values if return true
	) => {
	  const bF = bStart - aStart; // bIndex = bF + aIndex - kF
	  const aLength = aEnd - aStart;
	  const bLength = bEnd - bStart;
	  const baDeltaLength = bLength - aLength; // kF = kR - baDeltaLength

	  // Range of diagonals in which forward and reverse paths might overlap.
	  const kMinOverlapF = -baDeltaLength - (d - 1); // -(d - 1) <= kR
	  const kMaxOverlapF = -baDeltaLength + (d - 1); // kR <= (d - 1)

	  let aIndexPrev1 = NOT_YET_SET; // prev value of [iF - 1] in next iteration

	  // Optimization: skip diagonals in which paths cannot ever overlap.
	  const nF = d < iMaxF ? d : iMaxF;

	  // The diagonals kF = 2 * iF - d are odd when d is odd and even when d is even.
	  for (let iF = 0, kF = -d; iF <= nF; iF += 1, kF += 2) {
	    // To get first point of path segment, move one change in forward direction
	    // from last point of previous path segment in an adjacent diagonal.
	    // In first iteration when iF === 0 and kF === -d always insert.
	    // In last possible iteration when iF === d and kF === d always delete.
	    const insert = iF === 0 || (iF !== d && aIndexPrev1 < aIndexesF[iF]);
	    const aLastPrev = insert ? aIndexesF[iF] : aIndexPrev1;
	    const aFirst = insert
	      ? aLastPrev // vertical to insert from b
	      : aLastPrev + 1; // horizontal to delete from a

	    // To get last point of path segment, move along diagonal of common items.
	    const bFirst = bF + aFirst - kF;
	    const nCommonF = countCommonItemsF(
	      aFirst + 1,
	      aEnd,
	      bFirst + 1,
	      bEnd,
	      isCommon
	    );
	    const aLast = aFirst + nCommonF;
	    aIndexPrev1 = aIndexesF[iF];
	    aIndexesF[iF] = aLast;
	    if (kMinOverlapF <= kF && kF <= kMaxOverlapF) {
	      // Solve for iR of reverse path with (d - 1) changes in diagonal kF:
	      // kR = kF + baDeltaLength
	      // kR = (d - 1) - 2 * iR
	      const iR = (d - 1 - (kF + baDeltaLength)) / 2;

	      // If this forward path overlaps the reverse path in this diagonal,
	      // then this is the middle change of the index intervals.
	      if (iR <= iMaxR && aIndexesR[iR] - 1 <= aLast) {
	        // Unlike the Myers algorithm which finds only the middle “snake”
	        // this package can find two common subsequences per division.
	        // Last point of previous path segment is on an adjacent diagonal.
	        const bLastPrev = bF + aLastPrev - (insert ? kF + 1 : kF - 1);

	        // Because of invariant that intervals preceding the middle change
	        // cannot have common items at the end,
	        // move in reverse direction along a diagonal of common items.
	        const nCommonR = countCommonItemsR(
	          aStart,
	          aLastPrev,
	          bStart,
	          bLastPrev,
	          isCommon
	        );
	        const aIndexPrevFirst = aLastPrev - nCommonR;
	        const bIndexPrevFirst = bLastPrev - nCommonR;
	        const aEndPreceding = aIndexPrevFirst + 1;
	        const bEndPreceding = bIndexPrevFirst + 1;
	        division.nChangePreceding = d - 1;
	        if (d - 1 === aEndPreceding + bEndPreceding - aStart - bStart) {
	          // Optimization: number of preceding changes in forward direction
	          // is equal to number of items in preceding interval,
	          // therefore it cannot contain any common items.
	          division.aEndPreceding = aStart;
	          division.bEndPreceding = bStart;
	        } else {
	          division.aEndPreceding = aEndPreceding;
	          division.bEndPreceding = bEndPreceding;
	        }
	        division.nCommonPreceding = nCommonR;
	        if (nCommonR !== 0) {
	          division.aCommonPreceding = aEndPreceding;
	          division.bCommonPreceding = bEndPreceding;
	        }
	        division.nCommonFollowing = nCommonF;
	        if (nCommonF !== 0) {
	          division.aCommonFollowing = aFirst + 1;
	          division.bCommonFollowing = bFirst + 1;
	        }
	        const aStartFollowing = aLast + 1;
	        const bStartFollowing = bFirst + nCommonF + 1;
	        division.nChangeFollowing = d - 1;
	        if (d - 1 === aEnd + bEnd - aStartFollowing - bStartFollowing) {
	          // Optimization: number of changes in reverse direction
	          // is equal to number of items in following interval,
	          // therefore it cannot contain any common items.
	          division.aStartFollowing = aEnd;
	          division.bStartFollowing = bEnd;
	        } else {
	          division.aStartFollowing = aStartFollowing;
	          division.bStartFollowing = bStartFollowing;
	        }
	        return true;
	      }
	    }
	  }
	  return false;
	};

	// A complete function to extend reverse paths from (d - 1) to d changes.
	// Return true if a path overlaps forward path of d changes in its diagonal.
	const extendOverlappablePathsR = (
	  d,
	  aStart,
	  aEnd,
	  bStart,
	  bEnd,
	  isCommon,
	  aIndexesF,
	  iMaxF,
	  aIndexesR,
	  iMaxR,
	  division // update prop values if return true
	) => {
	  const bR = bEnd - aEnd; // bIndex = bR + aIndex - kR
	  const aLength = aEnd - aStart;
	  const bLength = bEnd - bStart;
	  const baDeltaLength = bLength - aLength; // kR = kF + baDeltaLength

	  // Range of diagonals in which forward and reverse paths might overlap.
	  const kMinOverlapR = baDeltaLength - d; // -d <= kF
	  const kMaxOverlapR = baDeltaLength + d; // kF <= d

	  let aIndexPrev1 = NOT_YET_SET; // prev value of [iR - 1] in next iteration

	  // Optimization: skip diagonals in which paths cannot ever overlap.
	  const nR = d < iMaxR ? d : iMaxR;

	  // The diagonals kR = d - 2 * iR are odd when d is odd and even when d is even.
	  for (let iR = 0, kR = d; iR <= nR; iR += 1, kR -= 2) {
	    // To get first point of path segment, move one change in reverse direction
	    // from last point of previous path segment in an adjacent diagonal.
	    // In first iteration when iR === 0 and kR === d always insert.
	    // In last possible iteration when iR === d and kR === -d always delete.
	    const insert = iR === 0 || (iR !== d && aIndexesR[iR] < aIndexPrev1);
	    const aLastPrev = insert ? aIndexesR[iR] : aIndexPrev1;
	    const aFirst = insert
	      ? aLastPrev // vertical to insert from b
	      : aLastPrev - 1; // horizontal to delete from a

	    // To get last point of path segment, move along diagonal of common items.
	    const bFirst = bR + aFirst - kR;
	    const nCommonR = countCommonItemsR(
	      aStart,
	      aFirst - 1,
	      bStart,
	      bFirst - 1,
	      isCommon
	    );
	    const aLast = aFirst - nCommonR;
	    aIndexPrev1 = aIndexesR[iR];
	    aIndexesR[iR] = aLast;
	    if (kMinOverlapR <= kR && kR <= kMaxOverlapR) {
	      // Solve for iF of forward path with d changes in diagonal kR:
	      // kF = kR - baDeltaLength
	      // kF = 2 * iF - d
	      const iF = (d + (kR - baDeltaLength)) / 2;

	      // If this reverse path overlaps the forward path in this diagonal,
	      // then this is a middle change of the index intervals.
	      if (iF <= iMaxF && aLast - 1 <= aIndexesF[iF]) {
	        const bLast = bFirst - nCommonR;
	        division.nChangePreceding = d;
	        if (d === aLast + bLast - aStart - bStart) {
	          // Optimization: number of changes in reverse direction
	          // is equal to number of items in preceding interval,
	          // therefore it cannot contain any common items.
	          division.aEndPreceding = aStart;
	          division.bEndPreceding = bStart;
	        } else {
	          division.aEndPreceding = aLast;
	          division.bEndPreceding = bLast;
	        }
	        division.nCommonPreceding = nCommonR;
	        if (nCommonR !== 0) {
	          // The last point of reverse path segment is start of common subsequence.
	          division.aCommonPreceding = aLast;
	          division.bCommonPreceding = bLast;
	        }
	        division.nChangeFollowing = d - 1;
	        if (d === 1) {
	          // There is no previous path segment.
	          division.nCommonFollowing = 0;
	          division.aStartFollowing = aEnd;
	          division.bStartFollowing = bEnd;
	        } else {
	          // Unlike the Myers algorithm which finds only the middle “snake”
	          // this package can find two common subsequences per division.
	          // Last point of previous path segment is on an adjacent diagonal.
	          const bLastPrev = bR + aLastPrev - (insert ? kR - 1 : kR + 1);

	          // Because of invariant that intervals following the middle change
	          // cannot have common items at the start,
	          // move in forward direction along a diagonal of common items.
	          const nCommonF = countCommonItemsF(
	            aLastPrev,
	            aEnd,
	            bLastPrev,
	            bEnd,
	            isCommon
	          );
	          division.nCommonFollowing = nCommonF;
	          if (nCommonF !== 0) {
	            // The last point of reverse path segment is start of common subsequence.
	            division.aCommonFollowing = aLastPrev;
	            division.bCommonFollowing = bLastPrev;
	          }
	          const aStartFollowing = aLastPrev + nCommonF; // aFirstPrev
	          const bStartFollowing = bLastPrev + nCommonF; // bFirstPrev

	          if (d - 1 === aEnd + bEnd - aStartFollowing - bStartFollowing) {
	            // Optimization: number of changes in forward direction
	            // is equal to number of items in following interval,
	            // therefore it cannot contain any common items.
	            division.aStartFollowing = aEnd;
	            division.bStartFollowing = bEnd;
	          } else {
	            division.aStartFollowing = aStartFollowing;
	            division.bStartFollowing = bStartFollowing;
	          }
	        }
	        return true;
	      }
	    }
	  }
	  return false;
	};

	// Given index intervals and input function to compare items at indexes,
	// divide at the middle change.
	//
	// DO NOT CALL if start === end, because interval cannot contain common items
	// and because this function will throw the “no overlap” error.
	const divide = (
	  nChange,
	  aStart,
	  aEnd,
	  bStart,
	  bEnd,
	  isCommon,
	  aIndexesF,
	  aIndexesR,
	  division // output
	) => {
	  const bF = bStart - aStart; // bIndex = bF + aIndex - kF
	  const bR = bEnd - aEnd; // bIndex = bR + aIndex - kR
	  const aLength = aEnd - aStart;
	  const bLength = bEnd - bStart;

	  // Because graph has square or portrait orientation,
	  // length difference is minimum number of items to insert from b.
	  // Corresponding forward and reverse diagonals in graph
	  // depend on length difference of the sequences:
	  // kF = kR - baDeltaLength
	  // kR = kF + baDeltaLength
	  const baDeltaLength = bLength - aLength;

	  // Optimization: max diagonal in graph intersects corner of shorter side.
	  let iMaxF = aLength;
	  let iMaxR = aLength;

	  // Initialize no changes yet in forward or reverse direction:
	  aIndexesF[0] = aStart - 1; // at open start of interval, outside closed start
	  aIndexesR[0] = aEnd; // at open end of interval

	  if (baDeltaLength % 2 === 0) {
	    // The number of changes in paths is 2 * d if length difference is even.
	    const dMin = (nChange || baDeltaLength) / 2;
	    const dMax = (aLength + bLength) / 2;
	    for (let d = 1; d <= dMax; d += 1) {
	      iMaxF = extendPathsF(d, aEnd, bEnd, bF, isCommon, aIndexesF, iMaxF);
	      if (d < dMin) {
	        iMaxR = extendPathsR(d, aStart, bStart, bR, isCommon, aIndexesR, iMaxR);
	      } else if (
	        // If a reverse path overlaps a forward path in the same diagonal,
	        // return a division of the index intervals at the middle change.
	        extendOverlappablePathsR(
	          d,
	          aStart,
	          aEnd,
	          bStart,
	          bEnd,
	          isCommon,
	          aIndexesF,
	          iMaxF,
	          aIndexesR,
	          iMaxR,
	          division
	        )
	      ) {
	        return;
	      }
	    }
	  } else {
	    // The number of changes in paths is 2 * d - 1 if length difference is odd.
	    const dMin = ((nChange || baDeltaLength) + 1) / 2;
	    const dMax = (aLength + bLength + 1) / 2;

	    // Unroll first half iteration so loop extends the relevant pairs of paths.
	    // Because of invariant that intervals have no common items at start or end,
	    // and limitation not to call divide with empty intervals,
	    // therefore it cannot be called if a forward path with one change
	    // would overlap a reverse path with no changes, even if dMin === 1.
	    let d = 1;
	    iMaxF = extendPathsF(d, aEnd, bEnd, bF, isCommon, aIndexesF, iMaxF);
	    for (d += 1; d <= dMax; d += 1) {
	      iMaxR = extendPathsR(
	        d - 1,
	        aStart,
	        bStart,
	        bR,
	        isCommon,
	        aIndexesR,
	        iMaxR
	      );
	      if (d < dMin) {
	        iMaxF = extendPathsF(d, aEnd, bEnd, bF, isCommon, aIndexesF, iMaxF);
	      } else if (
	        // If a forward path overlaps a reverse path in the same diagonal,
	        // return a division of the index intervals at the middle change.
	        extendOverlappablePathsF(
	          d,
	          aStart,
	          aEnd,
	          bStart,
	          bEnd,
	          isCommon,
	          aIndexesF,
	          iMaxF,
	          aIndexesR,
	          iMaxR,
	          division
	        )
	      ) {
	        return;
	      }
	    }
	  }

	  /* istanbul ignore next */
	  throw new Error(
	    `${pkg}: no overlap aStart=${aStart} aEnd=${aEnd} bStart=${bStart} bEnd=${bEnd}`
	  );
	};

	// Given index intervals and input function to compare items at indexes,
	// return by output function the number of adjacent items and starting indexes
	// of each common subsequence. Divide and conquer with only linear space.
	//
	// The index intervals are half open [start, end) like array slice method.
	// DO NOT CALL if start === end, because interval cannot contain common items
	// and because divide function will throw the “no overlap” error.
	const findSubsequences = (
	  nChange,
	  aStart,
	  aEnd,
	  bStart,
	  bEnd,
	  transposed,
	  callbacks,
	  aIndexesF,
	  aIndexesR,
	  division // temporary memory, not input nor output
	) => {
	  if (bEnd - bStart < aEnd - aStart) {
	    // Transpose graph so it has portrait instead of landscape orientation.
	    // Always compare shorter to longer sequence for consistency and optimization.
	    transposed = !transposed;
	    if (transposed && callbacks.length === 1) {
	      // Lazily wrap callback functions to swap args if graph is transposed.
	      const {foundSubsequence, isCommon} = callbacks[0];
	      callbacks[1] = {
	        foundSubsequence: (nCommon, bCommon, aCommon) => {
	          foundSubsequence(nCommon, aCommon, bCommon);
	        },
	        isCommon: (bIndex, aIndex) => isCommon(aIndex, bIndex)
	      };
	    }
	    const tStart = aStart;
	    const tEnd = aEnd;
	    aStart = bStart;
	    aEnd = bEnd;
	    bStart = tStart;
	    bEnd = tEnd;
	  }
	  const {foundSubsequence, isCommon} = callbacks[transposed ? 1 : 0];

	  // Divide the index intervals at the middle change.
	  divide(
	    nChange,
	    aStart,
	    aEnd,
	    bStart,
	    bEnd,
	    isCommon,
	    aIndexesF,
	    aIndexesR,
	    division
	  );
	  const {
	    nChangePreceding,
	    aEndPreceding,
	    bEndPreceding,
	    nCommonPreceding,
	    aCommonPreceding,
	    bCommonPreceding,
	    nCommonFollowing,
	    aCommonFollowing,
	    bCommonFollowing,
	    nChangeFollowing,
	    aStartFollowing,
	    bStartFollowing
	  } = division;

	  // Unless either index interval is empty, they might contain common items.
	  if (aStart < aEndPreceding && bStart < bEndPreceding) {
	    // Recursely find and return common subsequences preceding the division.
	    findSubsequences(
	      nChangePreceding,
	      aStart,
	      aEndPreceding,
	      bStart,
	      bEndPreceding,
	      transposed,
	      callbacks,
	      aIndexesF,
	      aIndexesR,
	      division
	    );
	  }

	  // Return common subsequences that are adjacent to the middle change.
	  if (nCommonPreceding !== 0) {
	    foundSubsequence(nCommonPreceding, aCommonPreceding, bCommonPreceding);
	  }
	  if (nCommonFollowing !== 0) {
	    foundSubsequence(nCommonFollowing, aCommonFollowing, bCommonFollowing);
	  }

	  // Unless either index interval is empty, they might contain common items.
	  if (aStartFollowing < aEnd && bStartFollowing < bEnd) {
	    // Recursely find and return common subsequences following the division.
	    findSubsequences(
	      nChangeFollowing,
	      aStartFollowing,
	      aEnd,
	      bStartFollowing,
	      bEnd,
	      transposed,
	      callbacks,
	      aIndexesF,
	      aIndexesR,
	      division
	    );
	  }
	};
	const validateLength = (name, arg) => {
	  if (typeof arg !== 'number') {
	    throw new TypeError(`${pkg}: ${name} typeof ${typeof arg} is not a number`);
	  }
	  if (!Number.isSafeInteger(arg)) {
	    throw new RangeError(`${pkg}: ${name} value ${arg} is not a safe integer`);
	  }
	  if (arg < 0) {
	    throw new RangeError(`${pkg}: ${name} value ${arg} is a negative integer`);
	  }
	};
	const validateCallback = (name, arg) => {
	  const type = typeof arg;
	  if (type !== 'function') {
	    throw new TypeError(`${pkg}: ${name} typeof ${type} is not a function`);
	  }
	};

	// Compare items in two sequences to find a longest common subsequence.
	// Given lengths of sequences and input function to compare items at indexes,
	// return by output function the number of adjacent items and starting indexes
	// of each common subsequence.
	function diffSequence(aLength, bLength, isCommon, foundSubsequence) {
	  validateLength('aLength', aLength);
	  validateLength('bLength', bLength);
	  validateCallback('isCommon', isCommon);
	  validateCallback('foundSubsequence', foundSubsequence);

	  // Count common items from the start in the forward direction.
	  const nCommonF = countCommonItemsF(0, aLength, 0, bLength, isCommon);
	  if (nCommonF !== 0) {
	    foundSubsequence(nCommonF, 0, 0);
	  }

	  // Unless both sequences consist of common items only,
	  // find common items in the half-trimmed index intervals.
	  if (aLength !== nCommonF || bLength !== nCommonF) {
	    // Invariant: intervals do not have common items at the start.
	    // The start of an index interval is closed like array slice method.
	    const aStart = nCommonF;
	    const bStart = nCommonF;

	    // Count common items from the end in the reverse direction.
	    const nCommonR = countCommonItemsR(
	      aStart,
	      aLength - 1,
	      bStart,
	      bLength - 1,
	      isCommon
	    );

	    // Invariant: intervals do not have common items at the end.
	    // The end of an index interval is open like array slice method.
	    const aEnd = aLength - nCommonR;
	    const bEnd = bLength - nCommonR;

	    // Unless one sequence consists of common items only,
	    // therefore the other trimmed index interval consists of changes only,
	    // find common items in the trimmed index intervals.
	    const nCommonFR = nCommonF + nCommonR;
	    if (aLength !== nCommonFR && bLength !== nCommonFR) {
	      const nChange = 0; // number of change items is not yet known
	      const transposed = false; // call the original unwrapped functions
	      const callbacks = [
	        {
	          foundSubsequence,
	          isCommon
	        }
	      ];

	      // Indexes in sequence a of last points in furthest reaching paths
	      // from outside the start at top left in the forward direction:
	      const aIndexesF = [NOT_YET_SET];
	      // from the end at bottom right in the reverse direction:
	      const aIndexesR = [NOT_YET_SET];

	      // Initialize one object as output of all calls to divide function.
	      const division = {
	        aCommonFollowing: NOT_YET_SET,
	        aCommonPreceding: NOT_YET_SET,
	        aEndPreceding: NOT_YET_SET,
	        aStartFollowing: NOT_YET_SET,
	        bCommonFollowing: NOT_YET_SET,
	        bCommonPreceding: NOT_YET_SET,
	        bEndPreceding: NOT_YET_SET,
	        bStartFollowing: NOT_YET_SET,
	        nChangeFollowing: NOT_YET_SET,
	        nChangePreceding: NOT_YET_SET,
	        nCommonFollowing: NOT_YET_SET,
	        nCommonPreceding: NOT_YET_SET
	      };

	      // Find and return common subsequences in the trimmed index intervals.
	      findSubsequences(
	        nChange,
	        aStart,
	        aEnd,
	        bStart,
	        bEnd,
	        transposed,
	        callbacks,
	        aIndexesF,
	        aIndexesR,
	        division
	      );
	    }
	    if (nCommonR !== 0) {
	      foundSubsequence(nCommonR, aEnd, bEnd);
	    }
	  }
	}
	return build;
}

var buildExports = /*@__PURE__*/ requireBuild();
var diffSequences = /*@__PURE__*/getDefaultExportFromCjs$1(buildExports);

function formatTrailingSpaces(line, trailingSpaceFormatter) {
	return line.replace(/\s+$/, (match) => trailingSpaceFormatter(match));
}
function printDiffLine(line, isFirstOrLast, color, indicator, trailingSpaceFormatter, emptyFirstOrLastLinePlaceholder) {
	return line.length !== 0 ? color(`${indicator} ${formatTrailingSpaces(line, trailingSpaceFormatter)}`) : indicator !== " " ? color(indicator) : isFirstOrLast && emptyFirstOrLastLinePlaceholder.length !== 0 ? color(`${indicator} ${emptyFirstOrLastLinePlaceholder}`) : "";
}
function printDeleteLine(line, isFirstOrLast, { aColor, aIndicator, changeLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder }) {
	return printDiffLine(line, isFirstOrLast, aColor, aIndicator, changeLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder);
}
function printInsertLine(line, isFirstOrLast, { bColor, bIndicator, changeLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder }) {
	return printDiffLine(line, isFirstOrLast, bColor, bIndicator, changeLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder);
}
function printCommonLine(line, isFirstOrLast, { commonColor, commonIndicator, commonLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder }) {
	return printDiffLine(line, isFirstOrLast, commonColor, commonIndicator, commonLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder);
}
// In GNU diff format, indexes are one-based instead of zero-based.
function createPatchMark(aStart, aEnd, bStart, bEnd, { patchColor }) {
	return patchColor(`@@ -${aStart + 1},${aEnd - aStart} +${bStart + 1},${bEnd - bStart} @@`);
}
// jest --no-expand
//
// Given array of aligned strings with inverse highlight formatting,
// return joined lines with diff formatting (and patch marks, if needed).
function joinAlignedDiffsNoExpand(diffs, options) {
	const iLength = diffs.length;
	const nContextLines = options.contextLines;
	const nContextLines2 = nContextLines + nContextLines;
	// First pass: count output lines and see if it has patches.
	let jLength = iLength;
	let hasExcessAtStartOrEnd = false;
	let nExcessesBetweenChanges = 0;
	let i = 0;
	while (i !== iLength) {
		const iStart = i;
		while (i !== iLength && diffs[i][0] === DIFF_EQUAL) {
			i += 1;
		}
		if (iStart !== i) {
			if (iStart === 0) {
				// at start
				if (i > nContextLines) {
					jLength -= i - nContextLines;
					hasExcessAtStartOrEnd = true;
				}
			} else if (i === iLength) {
				// at end
				const n = i - iStart;
				if (n > nContextLines) {
					jLength -= n - nContextLines;
					hasExcessAtStartOrEnd = true;
				}
			} else {
				// between changes
				const n = i - iStart;
				if (n > nContextLines2) {
					jLength -= n - nContextLines2;
					nExcessesBetweenChanges += 1;
				}
			}
		}
		while (i !== iLength && diffs[i][0] !== DIFF_EQUAL) {
			i += 1;
		}
	}
	const hasPatch = nExcessesBetweenChanges !== 0 || hasExcessAtStartOrEnd;
	if (nExcessesBetweenChanges !== 0) {
		jLength += nExcessesBetweenChanges + 1;
	} else if (hasExcessAtStartOrEnd) {
		jLength += 1;
	}
	const jLast = jLength - 1;
	const lines = [];
	let jPatchMark = 0;
	if (hasPatch) {
		lines.push("");
	}
	// Indexes of expected or received lines in current patch:
	let aStart = 0;
	let bStart = 0;
	let aEnd = 0;
	let bEnd = 0;
	const pushCommonLine = (line) => {
		const j = lines.length;
		lines.push(printCommonLine(line, j === 0 || j === jLast, options));
		aEnd += 1;
		bEnd += 1;
	};
	const pushDeleteLine = (line) => {
		const j = lines.length;
		lines.push(printDeleteLine(line, j === 0 || j === jLast, options));
		aEnd += 1;
	};
	const pushInsertLine = (line) => {
		const j = lines.length;
		lines.push(printInsertLine(line, j === 0 || j === jLast, options));
		bEnd += 1;
	};
	// Second pass: push lines with diff formatting (and patch marks, if needed).
	i = 0;
	while (i !== iLength) {
		let iStart = i;
		while (i !== iLength && diffs[i][0] === DIFF_EQUAL) {
			i += 1;
		}
		if (iStart !== i) {
			if (iStart === 0) {
				// at beginning
				if (i > nContextLines) {
					iStart = i - nContextLines;
					aStart = iStart;
					bStart = iStart;
					aEnd = aStart;
					bEnd = bStart;
				}
				for (let iCommon = iStart; iCommon !== i; iCommon += 1) {
					pushCommonLine(diffs[iCommon][1]);
				}
			} else if (i === iLength) {
				// at end
				const iEnd = i - iStart > nContextLines ? iStart + nContextLines : i;
				for (let iCommon = iStart; iCommon !== iEnd; iCommon += 1) {
					pushCommonLine(diffs[iCommon][1]);
				}
			} else {
				// between changes
				const nCommon = i - iStart;
				if (nCommon > nContextLines2) {
					const iEnd = iStart + nContextLines;
					for (let iCommon = iStart; iCommon !== iEnd; iCommon += 1) {
						pushCommonLine(diffs[iCommon][1]);
					}
					lines[jPatchMark] = createPatchMark(aStart, aEnd, bStart, bEnd, options);
					jPatchMark = lines.length;
					lines.push("");
					const nOmit = nCommon - nContextLines2;
					aStart = aEnd + nOmit;
					bStart = bEnd + nOmit;
					aEnd = aStart;
					bEnd = bStart;
					for (let iCommon = i - nContextLines; iCommon !== i; iCommon += 1) {
						pushCommonLine(diffs[iCommon][1]);
					}
				} else {
					for (let iCommon = iStart; iCommon !== i; iCommon += 1) {
						pushCommonLine(diffs[iCommon][1]);
					}
				}
			}
		}
		while (i !== iLength && diffs[i][0] === DIFF_DELETE) {
			pushDeleteLine(diffs[i][1]);
			i += 1;
		}
		while (i !== iLength && diffs[i][0] === DIFF_INSERT) {
			pushInsertLine(diffs[i][1]);
			i += 1;
		}
	}
	if (hasPatch) {
		lines[jPatchMark] = createPatchMark(aStart, aEnd, bStart, bEnd, options);
	}
	return lines.join("\n");
}
// jest --expand
//
// Given array of aligned strings with inverse highlight formatting,
// return joined lines with diff formatting.
function joinAlignedDiffsExpand(diffs, options) {
	return diffs.map((diff, i, diffs) => {
		const line = diff[1];
		const isFirstOrLast = i === 0 || i === diffs.length - 1;
		switch (diff[0]) {
			case DIFF_DELETE: return printDeleteLine(line, isFirstOrLast, options);
			case DIFF_INSERT: return printInsertLine(line, isFirstOrLast, options);
			default: return printCommonLine(line, isFirstOrLast, options);
		}
	}).join("\n");
}

const noColor = (string) => string;
const DIFF_CONTEXT_DEFAULT = 5;
const DIFF_TRUNCATE_THRESHOLD_DEFAULT = 0;
function getDefaultOptions() {
	return {
		aAnnotation: "Expected",
		aColor: C.green,
		aIndicator: "-",
		bAnnotation: "Received",
		bColor: C.red,
		bIndicator: "+",
		changeColor: C.inverse,
		changeLineTrailingSpaceColor: noColor,
		commonColor: C.dim,
		commonIndicator: " ",
		commonLineTrailingSpaceColor: noColor,
		compareKeys: undefined,
		contextLines: DIFF_CONTEXT_DEFAULT,
		emptyFirstOrLastLinePlaceholder: "",
		expand: false,
		includeChangeCounts: false,
		omitAnnotationLines: false,
		patchColor: C.yellow,
		printBasicPrototype: false,
		truncateThreshold: DIFF_TRUNCATE_THRESHOLD_DEFAULT,
		truncateAnnotation: "... Diff result is truncated",
		truncateAnnotationColor: noColor
	};
}
function getCompareKeys(compareKeys) {
	return compareKeys && typeof compareKeys === "function" ? compareKeys : undefined;
}
function getContextLines(contextLines) {
	return typeof contextLines === "number" && Number.isSafeInteger(contextLines) && contextLines >= 0 ? contextLines : DIFF_CONTEXT_DEFAULT;
}
// Pure function returns options with all properties.
function normalizeDiffOptions(options = {}) {
	return {
		...getDefaultOptions(),
		...options,
		compareKeys: getCompareKeys(options.compareKeys),
		contextLines: getContextLines(options.contextLines)
	};
}

function isEmptyString(lines) {
	return lines.length === 1 && lines[0].length === 0;
}
function countChanges(diffs) {
	let a = 0;
	let b = 0;
	diffs.forEach((diff) => {
		switch (diff[0]) {
			case DIFF_DELETE:
				a += 1;
				break;
			case DIFF_INSERT:
				b += 1;
				break;
		}
	});
	return {
		a,
		b
	};
}
function printAnnotation({ aAnnotation, aColor, aIndicator, bAnnotation, bColor, bIndicator, includeChangeCounts, omitAnnotationLines }, changeCounts) {
	if (omitAnnotationLines) {
		return "";
	}
	let aRest = "";
	let bRest = "";
	if (includeChangeCounts) {
		const aCount = String(changeCounts.a);
		const bCount = String(changeCounts.b);
		// Padding right aligns the ends of the annotations.
		const baAnnotationLengthDiff = bAnnotation.length - aAnnotation.length;
		const aAnnotationPadding = " ".repeat(Math.max(0, baAnnotationLengthDiff));
		const bAnnotationPadding = " ".repeat(Math.max(0, -baAnnotationLengthDiff));
		// Padding left aligns the ends of the counts.
		const baCountLengthDiff = bCount.length - aCount.length;
		const aCountPadding = " ".repeat(Math.max(0, baCountLengthDiff));
		const bCountPadding = " ".repeat(Math.max(0, -baCountLengthDiff));
		aRest = `${aAnnotationPadding}  ${aIndicator} ${aCountPadding}${aCount}`;
		bRest = `${bAnnotationPadding}  ${bIndicator} ${bCountPadding}${bCount}`;
	}
	const a = `${aIndicator} ${aAnnotation}${aRest}`;
	const b = `${bIndicator} ${bAnnotation}${bRest}`;
	return `${aColor(a)}\n${bColor(b)}\n\n`;
}
function printDiffLines(diffs, truncated, options) {
	return printAnnotation(options, countChanges(diffs)) + (options.expand ? joinAlignedDiffsExpand(diffs, options) : joinAlignedDiffsNoExpand(diffs, options)) + (truncated ? options.truncateAnnotationColor(`\n${options.truncateAnnotation}`) : "");
}
// Compare two arrays of strings line-by-line. Format as comparison lines.
function diffLinesUnified(aLines, bLines, options) {
	const normalizedOptions = normalizeDiffOptions(options);
	const [diffs, truncated] = diffLinesRaw(isEmptyString(aLines) ? [] : aLines, isEmptyString(bLines) ? [] : bLines, normalizedOptions);
	return printDiffLines(diffs, truncated, normalizedOptions);
}
// Given two pairs of arrays of strings:
// Compare the pair of comparison arrays line-by-line.
// Format the corresponding lines in the pair of displayable arrays.
function diffLinesUnified2(aLinesDisplay, bLinesDisplay, aLinesCompare, bLinesCompare, options) {
	if (isEmptyString(aLinesDisplay) && isEmptyString(aLinesCompare)) {
		aLinesDisplay = [];
		aLinesCompare = [];
	}
	if (isEmptyString(bLinesDisplay) && isEmptyString(bLinesCompare)) {
		bLinesDisplay = [];
		bLinesCompare = [];
	}
	if (aLinesDisplay.length !== aLinesCompare.length || bLinesDisplay.length !== bLinesCompare.length) {
		// Fall back to diff of display lines.
		return diffLinesUnified(aLinesDisplay, bLinesDisplay, options);
	}
	const [diffs, truncated] = diffLinesRaw(aLinesCompare, bLinesCompare, options);
	// Replace comparison lines with displayable lines.
	let aIndex = 0;
	let bIndex = 0;
	diffs.forEach((diff) => {
		switch (diff[0]) {
			case DIFF_DELETE:
				diff[1] = aLinesDisplay[aIndex];
				aIndex += 1;
				break;
			case DIFF_INSERT:
				diff[1] = bLinesDisplay[bIndex];
				bIndex += 1;
				break;
			default:
				diff[1] = bLinesDisplay[bIndex];
				aIndex += 1;
				bIndex += 1;
		}
	});
	return printDiffLines(diffs, truncated, normalizeDiffOptions(options));
}
// Compare two arrays of strings line-by-line.
function diffLinesRaw(aLines, bLines, options) {
	const truncate = (options === null || options === void 0 ? void 0 : options.truncateThreshold) ?? false;
	const truncateThreshold = Math.max(Math.floor((options === null || options === void 0 ? void 0 : options.truncateThreshold) ?? 0), 0);
	const aLength = truncate ? Math.min(aLines.length, truncateThreshold) : aLines.length;
	const bLength = truncate ? Math.min(bLines.length, truncateThreshold) : bLines.length;
	const truncated = aLength !== aLines.length || bLength !== bLines.length;
	const isCommon = (aIndex, bIndex) => aLines[aIndex] === bLines[bIndex];
	const diffs = [];
	let aIndex = 0;
	let bIndex = 0;
	const foundSubsequence = (nCommon, aCommon, bCommon) => {
		for (; aIndex !== aCommon; aIndex += 1) {
			diffs.push(new Diff(DIFF_DELETE, aLines[aIndex]));
		}
		for (; bIndex !== bCommon; bIndex += 1) {
			diffs.push(new Diff(DIFF_INSERT, bLines[bIndex]));
		}
		for (; nCommon !== 0; nCommon -= 1, aIndex += 1, bIndex += 1) {
			diffs.push(new Diff(DIFF_EQUAL, bLines[bIndex]));
		}
	};
	diffSequences(aLength, bLength, isCommon, foundSubsequence);
	// After the last common subsequence, push remaining change items.
	for (; aIndex !== aLength; aIndex += 1) {
		diffs.push(new Diff(DIFF_DELETE, aLines[aIndex]));
	}
	for (; bIndex !== bLength; bIndex += 1) {
		diffs.push(new Diff(DIFF_INSERT, bLines[bIndex]));
	}
	return [diffs, truncated];
}

// get the type of a value with handling the edge cases like `typeof []`
// and `typeof null`
function getType(value) {
	if (value === undefined) {
		return "undefined";
	} else if (value === null) {
		return "null";
	} else if (Array.isArray(value)) {
		return "array";
	} else if (typeof value === "boolean") {
		return "boolean";
	} else if (typeof value === "function") {
		return "function";
	} else if (typeof value === "number") {
		return "number";
	} else if (typeof value === "string") {
		return "string";
	} else if (typeof value === "bigint") {
		return "bigint";
	} else if (typeof value === "object") {
		if (value != null) {
			if (value.constructor === RegExp) {
				return "regexp";
			} else if (value.constructor === Map) {
				return "map";
			} else if (value.constructor === Set) {
				return "set";
			} else if (value.constructor === Date) {
				return "date";
			}
		}
		return "object";
	} else if (typeof value === "symbol") {
		return "symbol";
	}
	throw new Error(`value of unknown type: ${value}`);
}

// platforms compatible
function getNewLineSymbol(string) {
	return string.includes("\r\n") ? "\r\n" : "\n";
}
function diffStrings(a, b, options) {
	const truncate = (options === null || options === void 0 ? void 0 : options.truncateThreshold) ?? false;
	const truncateThreshold = Math.max(Math.floor((options === null || options === void 0 ? void 0 : options.truncateThreshold) ?? 0), 0);
	let aLength = a.length;
	let bLength = b.length;
	if (truncate) {
		const aMultipleLines = a.includes("\n");
		const bMultipleLines = b.includes("\n");
		const aNewLineSymbol = getNewLineSymbol(a);
		const bNewLineSymbol = getNewLineSymbol(b);
		// multiple-lines string expects a newline to be appended at the end
		const _a = aMultipleLines ? `${a.split(aNewLineSymbol, truncateThreshold).join(aNewLineSymbol)}\n` : a;
		const _b = bMultipleLines ? `${b.split(bNewLineSymbol, truncateThreshold).join(bNewLineSymbol)}\n` : b;
		aLength = _a.length;
		bLength = _b.length;
	}
	const truncated = aLength !== a.length || bLength !== b.length;
	const isCommon = (aIndex, bIndex) => a[aIndex] === b[bIndex];
	let aIndex = 0;
	let bIndex = 0;
	const diffs = [];
	const foundSubsequence = (nCommon, aCommon, bCommon) => {
		if (aIndex !== aCommon) {
			diffs.push(new Diff(DIFF_DELETE, a.slice(aIndex, aCommon)));
		}
		if (bIndex !== bCommon) {
			diffs.push(new Diff(DIFF_INSERT, b.slice(bIndex, bCommon)));
		}
		aIndex = aCommon + nCommon;
		bIndex = bCommon + nCommon;
		diffs.push(new Diff(DIFF_EQUAL, b.slice(bCommon, bIndex)));
	};
	diffSequences(aLength, bLength, isCommon, foundSubsequence);
	// After the last common subsequence, push remaining change items.
	if (aIndex !== aLength) {
		diffs.push(new Diff(DIFF_DELETE, a.slice(aIndex)));
	}
	if (bIndex !== bLength) {
		diffs.push(new Diff(DIFF_INSERT, b.slice(bIndex)));
	}
	return [diffs, truncated];
}

// Given change op and array of diffs, return concatenated string:
// * include common strings
// * include change strings which have argument op with changeColor
// * exclude change strings which have opposite op
function concatenateRelevantDiffs(op, diffs, changeColor) {
	return diffs.reduce((reduced, diff) => reduced + (diff[0] === DIFF_EQUAL ? diff[1] : diff[0] === op && diff[1].length !== 0 ? changeColor(diff[1]) : ""), "");
}
// Encapsulate change lines until either a common newline or the end.
class ChangeBuffer {
	op;
	line;
	lines;
	changeColor;
	constructor(op, changeColor) {
		this.op = op;
		this.line = [];
		this.lines = [];
		this.changeColor = changeColor;
	}
	pushSubstring(substring) {
		this.pushDiff(new Diff(this.op, substring));
	}
	pushLine() {
		// Assume call only if line has at least one diff,
		// therefore an empty line must have a diff which has an empty string.
		// If line has multiple diffs, then assume it has a common diff,
		// therefore change diffs have change color;
		// otherwise then it has line color only.
		this.lines.push(this.line.length !== 1 ? new Diff(this.op, concatenateRelevantDiffs(this.op, this.line, this.changeColor)) : this.line[0][0] === this.op ? this.line[0] : new Diff(this.op, this.line[0][1]));
		this.line.length = 0;
	}
	isLineEmpty() {
		return this.line.length === 0;
	}
	// Minor input to buffer.
	pushDiff(diff) {
		this.line.push(diff);
	}
	// Main input to buffer.
	align(diff) {
		const string = diff[1];
		if (string.includes("\n")) {
			const substrings = string.split("\n");
			const iLast = substrings.length - 1;
			substrings.forEach((substring, i) => {
				if (i < iLast) {
					// The first substring completes the current change line.
					// A middle substring is a change line.
					this.pushSubstring(substring);
					this.pushLine();
				} else if (substring.length !== 0) {
					// The last substring starts a change line, if it is not empty.
					// Important: This non-empty condition also automatically omits
					// the newline appended to the end of expected and received strings.
					this.pushSubstring(substring);
				}
			});
		} else {
			// Append non-multiline string to current change line.
			this.pushDiff(diff);
		}
	}
	// Output from buffer.
	moveLinesTo(lines) {
		if (!this.isLineEmpty()) {
			this.pushLine();
		}
		lines.push(...this.lines);
		this.lines.length = 0;
	}
}
// Encapsulate common and change lines.
class CommonBuffer {
	deleteBuffer;
	insertBuffer;
	lines;
	constructor(deleteBuffer, insertBuffer) {
		this.deleteBuffer = deleteBuffer;
		this.insertBuffer = insertBuffer;
		this.lines = [];
	}
	pushDiffCommonLine(diff) {
		this.lines.push(diff);
	}
	pushDiffChangeLines(diff) {
		const isDiffEmpty = diff[1].length === 0;
		// An empty diff string is redundant, unless a change line is empty.
		if (!isDiffEmpty || this.deleteBuffer.isLineEmpty()) {
			this.deleteBuffer.pushDiff(diff);
		}
		if (!isDiffEmpty || this.insertBuffer.isLineEmpty()) {
			this.insertBuffer.pushDiff(diff);
		}
	}
	flushChangeLines() {
		this.deleteBuffer.moveLinesTo(this.lines);
		this.insertBuffer.moveLinesTo(this.lines);
	}
	// Input to buffer.
	align(diff) {
		const op = diff[0];
		const string = diff[1];
		if (string.includes("\n")) {
			const substrings = string.split("\n");
			const iLast = substrings.length - 1;
			substrings.forEach((substring, i) => {
				if (i === 0) {
					const subdiff = new Diff(op, substring);
					if (this.deleteBuffer.isLineEmpty() && this.insertBuffer.isLineEmpty()) {
						// If both current change lines are empty,
						// then the first substring is a common line.
						this.flushChangeLines();
						this.pushDiffCommonLine(subdiff);
					} else {
						// If either current change line is non-empty,
						// then the first substring completes the change lines.
						this.pushDiffChangeLines(subdiff);
						this.flushChangeLines();
					}
				} else if (i < iLast) {
					// A middle substring is a common line.
					this.pushDiffCommonLine(new Diff(op, substring));
				} else if (substring.length !== 0) {
					// The last substring starts a change line, if it is not empty.
					// Important: This non-empty condition also automatically omits
					// the newline appended to the end of expected and received strings.
					this.pushDiffChangeLines(new Diff(op, substring));
				}
			});
		} else {
			// Append non-multiline string to current change lines.
			// Important: It cannot be at the end following empty change lines,
			// because newline appended to the end of expected and received strings.
			this.pushDiffChangeLines(diff);
		}
	}
	// Output from buffer.
	getLines() {
		this.flushChangeLines();
		return this.lines;
	}
}
// Given diffs from expected and received strings,
// return new array of diffs split or joined into lines.
//
// To correctly align a change line at the end, the algorithm:
// * assumes that a newline was appended to the strings
// * omits the last newline from the output array
//
// Assume the function is not called:
// * if either expected or received is empty string
// * if neither expected nor received is multiline string
function getAlignedDiffs(diffs, changeColor) {
	const deleteBuffer = new ChangeBuffer(DIFF_DELETE, changeColor);
	const insertBuffer = new ChangeBuffer(DIFF_INSERT, changeColor);
	const commonBuffer = new CommonBuffer(deleteBuffer, insertBuffer);
	diffs.forEach((diff) => {
		switch (diff[0]) {
			case DIFF_DELETE:
				deleteBuffer.align(diff);
				break;
			case DIFF_INSERT:
				insertBuffer.align(diff);
				break;
			default: commonBuffer.align(diff);
		}
	});
	return commonBuffer.getLines();
}

function hasCommonDiff(diffs, isMultiline) {
	if (isMultiline) {
		// Important: Ignore common newline that was appended to multiline strings!
		const iLast = diffs.length - 1;
		return diffs.some((diff, i) => diff[0] === DIFF_EQUAL && (i !== iLast || diff[1] !== "\n"));
	}
	return diffs.some((diff) => diff[0] === DIFF_EQUAL);
}
// Compare two strings character-by-character.
// Format as comparison lines in which changed substrings have inverse colors.
function diffStringsUnified(a, b, options) {
	if (a !== b && a.length !== 0 && b.length !== 0) {
		const isMultiline = a.includes("\n") || b.includes("\n");
		// getAlignedDiffs assumes that a newline was appended to the strings.
		const [diffs, truncated] = diffStringsRaw(isMultiline ? `${a}\n` : a, isMultiline ? `${b}\n` : b, true, options);
		if (hasCommonDiff(diffs, isMultiline)) {
			const optionsNormalized = normalizeDiffOptions(options);
			const lines = getAlignedDiffs(diffs, optionsNormalized.changeColor);
			return printDiffLines(lines, truncated, optionsNormalized);
		}
	}
	// Fall back to line-by-line diff.
	return diffLinesUnified(a.split("\n"), b.split("\n"), options);
}
// Compare two strings character-by-character.
// Optionally clean up small common substrings, also known as chaff.
function diffStringsRaw(a, b, cleanup, options) {
	const [diffs, truncated] = diffStrings(a, b, options);
	{
		diff_cleanupSemantic(diffs);
	}
	return [diffs, truncated];
}

function getCommonMessage(message, options) {
	const { commonColor } = normalizeDiffOptions(options);
	return commonColor(message);
}
const { AsymmetricMatcher: AsymmetricMatcher$2, DOMCollection: DOMCollection$1, DOMElement: DOMElement$1, Immutable: Immutable$1, ReactElement: ReactElement$1, ReactTestComponent: ReactTestComponent$1 } = plugins;
const PLUGINS$1 = [
	ReactTestComponent$1,
	ReactElement$1,
	DOMElement$1,
	DOMCollection$1,
	Immutable$1,
	AsymmetricMatcher$2,
	plugins.Error
];
const FORMAT_OPTIONS = {
	maxDepth: 20,
	plugins: PLUGINS$1
};
const FALLBACK_FORMAT_OPTIONS = {
	callToJSON: false,
	maxDepth: 8,
	plugins: PLUGINS$1
};
// Generate a string that will highlight the difference between two values
// with green and red. (similar to how github does code diffing)
/**
* @param a Expected value
* @param b Received value
* @param options Diff options
* @returns {string | null} a string diff
*/
function diff(a, b, options) {
	if (Object.is(a, b)) {
		return "";
	}
	const aType = getType(a);
	let expectedType = aType;
	let omitDifference = false;
	if (aType === "object" && typeof a.asymmetricMatch === "function") {
		if (a.$$typeof !== Symbol.for("jest.asymmetricMatcher")) {
			// Do not know expected type of user-defined asymmetric matcher.
			return undefined;
		}
		if (typeof a.getExpectedType !== "function") {
			// For example, expect.anything() matches either null or undefined
			return undefined;
		}
		expectedType = a.getExpectedType();
		// Primitive types boolean and number omit difference below.
		// For example, omit difference for expect.stringMatching(regexp)
		omitDifference = expectedType === "string";
	}
	if (expectedType !== getType(b)) {
		const { aAnnotation, aColor, aIndicator, bAnnotation, bColor, bIndicator } = normalizeDiffOptions(options);
		const formatOptions = getFormatOptions(FALLBACK_FORMAT_OPTIONS, options);
		let aDisplay = format$1(a, formatOptions);
		let bDisplay = format$1(b, formatOptions);
		// even if prettyFormat prints successfully big objects,
		// large string can choke later on (concatenation? RPC?),
		// so truncate it to a reasonable length here.
		// (For example, playwright's ElementHandle can become about 200_000_000 length string)
		const MAX_LENGTH = 1e5;
		function truncate(s) {
			return s.length <= MAX_LENGTH ? s : `${s.slice(0, MAX_LENGTH)}...`;
		}
		aDisplay = truncate(aDisplay);
		bDisplay = truncate(bDisplay);
		const aDiff = `${aColor(`${aIndicator} ${aAnnotation}:`)} \n${aDisplay}`;
		const bDiff = `${bColor(`${bIndicator} ${bAnnotation}:`)} \n${bDisplay}`;
		return `${aDiff}\n\n${bDiff}`;
	}
	if (omitDifference) {
		return undefined;
	}
	switch (aType) {
		case "string": return diffLinesUnified(a.split("\n"), b.split("\n"), options);
		case "boolean":
		case "number": return comparePrimitive(a, b, options);
		case "map": return compareObjects(sortMap(a), sortMap(b), options);
		case "set": return compareObjects(sortSet(a), sortSet(b), options);
		default: return compareObjects(a, b, options);
	}
}
function comparePrimitive(a, b, options) {
	const aFormat = format$1(a, FORMAT_OPTIONS);
	const bFormat = format$1(b, FORMAT_OPTIONS);
	return aFormat === bFormat ? "" : diffLinesUnified(aFormat.split("\n"), bFormat.split("\n"), options);
}
function sortMap(map) {
	return new Map(Array.from(map.entries()).sort());
}
function sortSet(set) {
	return new Set(Array.from(set.values()).sort());
}
function compareObjects(a, b, options) {
	let difference;
	let hasThrown = false;
	try {
		const formatOptions = getFormatOptions(FORMAT_OPTIONS, options);
		difference = getObjectsDifference(a, b, formatOptions, options);
	} catch {
		hasThrown = true;
	}
	const noDiffMessage = getCommonMessage(NO_DIFF_MESSAGE, options);
	// If the comparison yields no results, compare again but this time
	// without calling `toJSON`. It's also possible that toJSON might throw.
	if (difference === undefined || difference === noDiffMessage) {
		const formatOptions = getFormatOptions(FALLBACK_FORMAT_OPTIONS, options);
		difference = getObjectsDifference(a, b, formatOptions, options);
		if (difference !== noDiffMessage && !hasThrown) {
			difference = `${getCommonMessage(SIMILAR_MESSAGE, options)}\n\n${difference}`;
		}
	}
	return difference;
}
function getFormatOptions(formatOptions, options) {
	const { compareKeys, printBasicPrototype, maxDepth } = normalizeDiffOptions(options);
	return {
		...formatOptions,
		compareKeys,
		printBasicPrototype,
		maxDepth: maxDepth ?? formatOptions.maxDepth
	};
}
function getObjectsDifference(a, b, formatOptions, options) {
	const formatOptionsZeroIndent = {
		...formatOptions,
		indent: 0
	};
	const aCompare = format$1(a, formatOptionsZeroIndent);
	const bCompare = format$1(b, formatOptionsZeroIndent);
	if (aCompare === bCompare) {
		return getCommonMessage(NO_DIFF_MESSAGE, options);
	} else {
		const aDisplay = format$1(a, formatOptions);
		const bDisplay = format$1(b, formatOptions);
		return diffLinesUnified2(aDisplay.split("\n"), bDisplay.split("\n"), aCompare.split("\n"), bCompare.split("\n"), options);
	}
}
const MAX_DIFF_STRING_LENGTH = 2e4;
function isAsymmetricMatcher(data) {
	const type = getType$1(data);
	return type === "Object" && typeof data.asymmetricMatch === "function";
}
function isReplaceable(obj1, obj2) {
	const obj1Type = getType$1(obj1);
	const obj2Type = getType$1(obj2);
	return obj1Type === obj2Type && (obj1Type === "Object" || obj1Type === "Array");
}
function printDiffOrStringify(received, expected, options) {
	const { aAnnotation, bAnnotation } = normalizeDiffOptions(options);
	if (typeof expected === "string" && typeof received === "string" && expected.length > 0 && received.length > 0 && expected.length <= MAX_DIFF_STRING_LENGTH && received.length <= MAX_DIFF_STRING_LENGTH && expected !== received) {
		if (expected.includes("\n") || received.includes("\n")) {
			return diffStringsUnified(expected, received, options);
		}
		const [diffs] = diffStringsRaw(expected, received);
		const hasCommonDiff = diffs.some((diff) => diff[0] === DIFF_EQUAL);
		const printLabel = getLabelPrinter(aAnnotation, bAnnotation);
		const expectedLine = printLabel(aAnnotation) + printExpected$1(getCommonAndChangedSubstrings(diffs, DIFF_DELETE, hasCommonDiff));
		const receivedLine = printLabel(bAnnotation) + printReceived$1(getCommonAndChangedSubstrings(diffs, DIFF_INSERT, hasCommonDiff));
		return `${expectedLine}\n${receivedLine}`;
	}
	// if (isLineDiffable(expected, received)) {
	const clonedExpected = deepClone(expected, { forceWritable: true });
	const clonedReceived = deepClone(received, { forceWritable: true });
	const { replacedExpected, replacedActual } = replaceAsymmetricMatcher(clonedReceived, clonedExpected);
	const difference = diff(replacedExpected, replacedActual, options);
	return difference;
	// }
	// const printLabel = getLabelPrinter(aAnnotation, bAnnotation)
	// const expectedLine = printLabel(aAnnotation) + printExpected(expected)
	// const receivedLine
	//   = printLabel(bAnnotation)
	//   + (stringify(expected) === stringify(received)
	//     ? 'serializes to the same string'
	//     : printReceived(received))
	// return `${expectedLine}\n${receivedLine}`
}
function replaceAsymmetricMatcher(actual, expected, actualReplaced = new WeakSet(), expectedReplaced = new WeakSet()) {
	// handle asymmetric Error.cause diff
	if (actual instanceof Error && expected instanceof Error && typeof actual.cause !== "undefined" && typeof expected.cause === "undefined") {
		delete actual.cause;
		return {
			replacedActual: actual,
			replacedExpected: expected
		};
	}
	if (!isReplaceable(actual, expected)) {
		return {
			replacedActual: actual,
			replacedExpected: expected
		};
	}
	if (actualReplaced.has(actual) || expectedReplaced.has(expected)) {
		return {
			replacedActual: actual,
			replacedExpected: expected
		};
	}
	actualReplaced.add(actual);
	expectedReplaced.add(expected);
	getOwnProperties(expected).forEach((key) => {
		const expectedValue = expected[key];
		const actualValue = actual[key];
		if (isAsymmetricMatcher(expectedValue)) {
			if (expectedValue.asymmetricMatch(actualValue)) {
				actual[key] = expectedValue;
			}
		} else if (isAsymmetricMatcher(actualValue)) {
			if (actualValue.asymmetricMatch(expectedValue)) {
				expected[key] = actualValue;
			}
		} else if (isReplaceable(actualValue, expectedValue)) {
			const replaced = replaceAsymmetricMatcher(actualValue, expectedValue, actualReplaced, expectedReplaced);
			actual[key] = replaced.replacedActual;
			expected[key] = replaced.replacedExpected;
		}
	});
	return {
		replacedActual: actual,
		replacedExpected: expected
	};
}
function getLabelPrinter(...strings) {
	const maxLength = strings.reduce((max, string) => string.length > max ? string.length : max, 0);
	return (string) => `${string}: ${" ".repeat(maxLength - string.length)}`;
}
const SPACE_SYMBOL$1 = "·";
function replaceTrailingSpaces$1(text) {
	return text.replace(/\s+$/gm, (spaces) => SPACE_SYMBOL$1.repeat(spaces.length));
}
function printReceived$1(object) {
	return C.red(replaceTrailingSpaces$1(stringify(object)));
}
function printExpected$1(value) {
	return C.green(replaceTrailingSpaces$1(stringify(value)));
}
function getCommonAndChangedSubstrings(diffs, op, hasCommonDiff) {
	return diffs.reduce((reduced, diff) => reduced + (diff[0] === DIFF_EQUAL ? diff[1] : diff[0] === op ? hasCommonDiff ? C.inverse(diff[1]) : diff[1] : ""), "");
}

function isMockFunction(fn) {
	return typeof fn === "function" && "_isMockFunction" in fn && fn._isMockFunction === true;
}
const MOCK_RESTORE = new Set();
// Jest keeps the state in a separate WeakMap which is good for memory,
// but it makes the state slower to access and return different values
// if you stored it before calling `mockClear` where it will be recreated
const REGISTERED_MOCKS = new Set();
const MOCK_CONFIGS = new WeakMap();
function createMockInstance(options = {}) {
	var _ref;
	const { originalImplementation, restore, mockImplementation, resetToMockImplementation, resetToMockName } = options;
	if (restore) {
		MOCK_RESTORE.add(restore);
	}
	const config = getDefaultConfig(originalImplementation);
	const state = getDefaultState();
	const mock = createMock({
		config,
		state,
		...options
	});
	const mockLength = ((_ref = mockImplementation || originalImplementation) === null || _ref === void 0 ? void 0 : _ref.length) ?? 0;
	Object.defineProperty(mock, "length", {
		writable: true,
		enumerable: false,
		value: mockLength,
		configurable: true
	});
	// inherit the default name so it appears in snapshots and logs
	// this is used by `vi.spyOn()` for better debugging.
	// when `vi.fn()` is called, we just use the default string
	if (resetToMockName) {
		config.mockName = mock.name || "vi.fn()";
	}
	MOCK_CONFIGS.set(mock, config);
	REGISTERED_MOCKS.add(mock);
	mock._isMockFunction = true;
	mock.getMockImplementation = () => {
		// Jest only returns `config.mockImplementation` here,
		// but we think it makes sense to return what the next function will be called
		return config.onceMockImplementations[0] || config.mockImplementation;
	};
	Object.defineProperty(mock, "mock", {
		configurable: false,
		enumerable: true,
		writable: false,
		value: state
	});
	mock.mockImplementation = function mockImplementation(implementation) {
		config.mockImplementation = implementation;
		return mock;
	};
	mock.mockImplementationOnce = function mockImplementationOnce(implementation) {
		config.onceMockImplementations.push(implementation);
		return mock;
	};
	mock.withImplementation = function withImplementation(implementation, callback) {
		const previousImplementation = config.mockImplementation;
		const previousOnceImplementations = config.onceMockImplementations;
		const reset = () => {
			config.mockImplementation = previousImplementation;
			config.onceMockImplementations = previousOnceImplementations;
		};
		config.mockImplementation = implementation;
		config.onceMockImplementations = [];
		const returnValue = callback();
		if (typeof returnValue === "object" && typeof (returnValue === null || returnValue === void 0 ? void 0 : returnValue.then) === "function") {
			return returnValue.then(() => {
				reset();
				return mock;
			});
		} else {
			reset();
		}
		return mock;
	};
	mock.mockReturnThis = function mockReturnThis() {
		return mock.mockImplementation(function() {
			return this;
		});
	};
	mock.mockReturnValue = function mockReturnValue(value) {
		return mock.mockImplementation(() => value);
	};
	mock.mockReturnValueOnce = function mockReturnValueOnce(value) {
		return mock.mockImplementationOnce(() => value);
	};
	mock.mockResolvedValue = function mockResolvedValue(value) {
		return mock.mockImplementation(() => Promise.resolve(value));
	};
	mock.mockResolvedValueOnce = function mockResolvedValueOnce(value) {
		return mock.mockImplementationOnce(() => Promise.resolve(value));
	};
	mock.mockRejectedValue = function mockRejectedValue(value) {
		return mock.mockImplementation(() => Promise.reject(value));
	};
	mock.mockRejectedValueOnce = function mockRejectedValueOnce(value) {
		return mock.mockImplementationOnce(() => Promise.reject(value));
	};
	mock.mockClear = function mockClear() {
		state.calls = [];
		state.contexts = [];
		state.instances = [];
		state.invocationCallOrder = [];
		state.results = [];
		state.settledResults = [];
		return mock;
	};
	mock.mockReset = function mockReset() {
		mock.mockClear();
		config.mockImplementation = resetToMockImplementation ? mockImplementation : undefined;
		config.mockName = resetToMockName ? mock.name || "vi.fn()" : "vi.fn()";
		config.onceMockImplementations = [];
		return mock;
	};
	mock.mockRestore = function mockRestore() {
		mock.mockReset();
		return restore === null || restore === void 0 ? void 0 : restore();
	};
	mock.mockName = function mockName(name) {
		if (typeof name === "string") {
			config.mockName = name;
		}
		return mock;
	};
	mock.getMockName = function getMockName() {
		return config.mockName || "vi.fn()";
	};
	if (Symbol.dispose) {
		mock[Symbol.dispose] = () => mock.mockRestore();
	}
	if (mockImplementation) {
		mock.mockImplementation(mockImplementation);
	}
	return mock;
}
function fn(originalImplementation) {
	// if the function is already a mock, just return the same function,
	// simillarly to how vi.spyOn() works
	if (originalImplementation != null && isMockFunction(originalImplementation)) {
		return originalImplementation;
	}
	return createMockInstance({
		mockImplementation: originalImplementation,
		resetToMockImplementation: true
	});
}
function spyOn(object, key, accessor) {
	assert$2(object != null, "The vi.spyOn() function could not find an object to spy upon. The first argument must be defined.");
	assert$2(typeof object === "object" || typeof object === "function", "Vitest cannot spy on a primitive value.");
	const [originalDescriptorObject, originalDescriptor] = getDescriptor(object, key) || [];
	assert$2(originalDescriptor || key in object, `The property "${String(key)}" is not defined on the ${typeof object}.`);
	let accessType = accessor || "value";
	let ssr = false;
	// vite ssr support - actual function is stored inside a getter
	if (accessType === "value" && originalDescriptor && originalDescriptor.value == null && originalDescriptor.get) {
		accessType = "get";
		ssr = true;
	}
	let original;
	if (originalDescriptor) {
		original = originalDescriptor[accessType];
	} else if (accessType !== "value") {
		original = () => object[key];
	} else {
		original = object[key];
	}
	const originalImplementation = ssr && original ? original() : original;
	const originalType = typeof originalImplementation;
	assert$2(
		// allow only functions
		originalType === "function" || accessType !== "value" && original == null,
		`vi.spyOn() can only spy on a function. Received ${originalType}.`
	);
	if (isMockFunction(originalImplementation)) {
		return originalImplementation;
	}
	const reassign = (cb) => {
		const { value, ...desc } = originalDescriptor || {
			configurable: true,
			writable: true
		};
		if (accessType !== "value") {
			delete desc.writable;
		}
		desc[accessType] = cb;
		Object.defineProperty(object, key, desc);
	};
	const restore = () => {
		// if method is defined on the prototype, we can just remove it from
		// the current object instead of redefining a copy of it
		if (originalDescriptorObject !== object) {
			Reflect.deleteProperty(object, key);
		} else if (originalDescriptor && !original) {
			Object.defineProperty(object, key, originalDescriptor);
		} else {
			reassign(original);
		}
	};
	const mock = createMockInstance({
		restore,
		originalImplementation,
		resetToMockName: true
	});
	try {
		reassign(ssr ? () => mock : mock);
	} catch (error) {
		if (error instanceof TypeError && Symbol.toStringTag && object[Symbol.toStringTag] === "Module" && (error.message.includes("Cannot redefine property") || error.message.includes("Cannot replace module namespace") || error.message.includes("can't redefine non-configurable property"))) {
			throw new TypeError(`Cannot spy on export "${String(key)}". Module namespace is not configurable in ESM. See: https://vitest.dev/guide/browser/#limitations`, { cause: error });
		}
		throw error;
	}
	return mock;
}
function getDescriptor(obj, method) {
	const objDescriptor = Object.getOwnPropertyDescriptor(obj, method);
	if (objDescriptor) {
		return [obj, objDescriptor];
	}
	let currentProto = Object.getPrototypeOf(obj);
	while (currentProto !== null) {
		const descriptor = Object.getOwnPropertyDescriptor(currentProto, method);
		if (descriptor) {
			return [currentProto, descriptor];
		}
		currentProto = Object.getPrototypeOf(currentProto);
	}
}
function assert$2(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}
let invocationCallCounter = 1;
function createMock({ state, config, name: mockName, prototypeState, prototypeConfig, keepMembersImplementation, mockImplementation, prototypeMembers = [] }) {
	const original = config.mockOriginal;
	const pseudoOriginal = mockImplementation;
	const name = mockName || (original === null || original === void 0 ? void 0 : original.name) || "Mock";
	const namedObject = { [name]: (function(...args) {
		registerCalls(args, state, prototypeState);
		registerInvocationOrder(invocationCallCounter++, state, prototypeState);
		const result = {
			type: "incomplete",
			value: undefined
		};
		const settledResult = {
			type: "incomplete",
			value: undefined
		};
		registerResult(result, state, prototypeState);
		registerSettledResult(settledResult, state, prototypeState);
		const context = new.target ? undefined : this;
		const [instanceIndex, instancePrototypeIndex] = registerInstance(context, state, prototypeState);
		const [contextIndex, contextPrototypeIndex] = registerContext(context, state, prototypeState);
		const implementation = config.onceMockImplementations.shift() || config.mockImplementation || (prototypeConfig === null || prototypeConfig === void 0 ? void 0 : prototypeConfig.onceMockImplementations.shift()) || (prototypeConfig === null || prototypeConfig === void 0 ? void 0 : prototypeConfig.mockImplementation) || original || function() {};
		let returnValue;
		let thrownValue;
		let didThrow = false;
		try {
			if (new.target) {
				returnValue = Reflect.construct(implementation, args, new.target);
				// jest calls this before the implementation, but we have to resolve this _after_
				// because we cannot do it before the `Reflect.construct` called the custom implementation.
				// fortunetly, the constructor is always an empty functon because `prototypeMethods`
				// are only used by the automocker, so this doesn't matter
				for (const prop of prototypeMembers) {
					const prototypeMock = returnValue[prop];
					// the method was overidden because of inheritence, ignore it
					// eslint-disable-next-line ts/no-use-before-define
					if (prototypeMock !== mock.prototype[prop]) {
						continue;
					}
					const isMock = isMockFunction(prototypeMock);
					const prototypeState = isMock ? prototypeMock.mock : undefined;
					const prototypeConfig = isMock ? MOCK_CONFIGS.get(prototypeMock) : undefined;
					returnValue[prop] = createMockInstance({
						originalImplementation: keepMembersImplementation ? prototypeConfig === null || prototypeConfig === void 0 ? void 0 : prototypeConfig.mockOriginal : undefined,
						prototypeState,
						prototypeConfig,
						keepMembersImplementation
					});
				}
			} else {
				returnValue = implementation.apply(this, args);
			}
		} catch (error) {
			thrownValue = error;
			didThrow = true;
			if (error instanceof TypeError && error.message.includes("is not a constructor")) {
				console.warn(`[vitest] The ${namedObject[name].getMockName()} mock did not use 'function' or 'class' in its implementation, see https://vitest.dev/api/vi#vi-spyon for examples.`);
			}
			throw error;
		} finally {
			if (didThrow) {
				result.type = "throw";
				result.value = thrownValue;
				settledResult.type = "rejected";
				settledResult.value = thrownValue;
			} else {
				result.type = "return";
				result.value = returnValue;
				if (new.target) {
					state.contexts[contextIndex - 1] = returnValue;
					state.instances[instanceIndex - 1] = returnValue;
					if (contextPrototypeIndex != null && prototypeState) {
						prototypeState.contexts[contextPrototypeIndex - 1] = returnValue;
					}
					if (instancePrototypeIndex != null && prototypeState) {
						prototypeState.instances[instancePrototypeIndex - 1] = returnValue;
					}
				}
				if (returnValue instanceof Promise) {
					returnValue.then((settledValue) => {
						settledResult.type = "fulfilled";
						settledResult.value = settledValue;
					}, (rejectedValue) => {
						settledResult.type = "rejected";
						settledResult.value = rejectedValue;
					});
				} else {
					settledResult.type = "fulfilled";
					settledResult.value = returnValue;
				}
			}
		}
		return returnValue;
	}) };
	const mock = namedObject[name];
	const copyPropertiesFrom = original || pseudoOriginal;
	if (copyPropertiesFrom) {
		copyOriginalStaticProperties(mock, copyPropertiesFrom);
	}
	return mock;
}
function registerCalls(args, state, prototypeState) {
	state.calls.push(args);
	prototypeState === null || prototypeState === void 0 ? void 0 : prototypeState.calls.push(args);
}
function registerInvocationOrder(order, state, prototypeState) {
	state.invocationCallOrder.push(order);
	prototypeState === null || prototypeState === void 0 ? void 0 : prototypeState.invocationCallOrder.push(order);
}
function registerResult(result, state, prototypeState) {
	state.results.push(result);
	prototypeState === null || prototypeState === void 0 ? void 0 : prototypeState.results.push(result);
}
function registerSettledResult(result, state, prototypeState) {
	state.settledResults.push(result);
	prototypeState === null || prototypeState === void 0 ? void 0 : prototypeState.settledResults.push(result);
}
function registerInstance(instance, state, prototypeState) {
	const instanceIndex = state.instances.push(instance);
	const instancePrototypeIndex = prototypeState === null || prototypeState === void 0 ? void 0 : prototypeState.instances.push(instance);
	return [instanceIndex, instancePrototypeIndex];
}
function registerContext(context, state, prototypeState) {
	const contextIndex = state.contexts.push(context);
	const contextPrototypeIndex = prototypeState === null || prototypeState === void 0 ? void 0 : prototypeState.contexts.push(context);
	return [contextIndex, contextPrototypeIndex];
}
function copyOriginalStaticProperties(mock, original) {
	const { properties, descriptors } = getAllProperties(original);
	for (const key of properties) {
		const descriptor = descriptors[key];
		const mockDescriptor = getDescriptor(mock, key);
		if (mockDescriptor) {
			continue;
		}
		Object.defineProperty(mock, key, descriptor);
	}
}
const ignoreProperties = new Set([
	"length",
	"name",
	"prototype",
	Symbol.for("nodejs.util.promisify.custom")
]);
function getAllProperties(original) {
	const properties = new Set();
	const descriptors = {};
	while (original && original !== Object.prototype && original !== Function.prototype) {
		const ownProperties = [...Object.getOwnPropertyNames(original), ...Object.getOwnPropertySymbols(original)];
		for (const prop of ownProperties) {
			if (descriptors[prop] || ignoreProperties.has(prop)) {
				continue;
			}
			properties.add(prop);
			descriptors[prop] = Object.getOwnPropertyDescriptor(original, prop);
		}
		original = Object.getPrototypeOf(original);
	}
	return {
		properties,
		descriptors
	};
}
function getDefaultConfig(original) {
	return {
		mockImplementation: undefined,
		mockOriginal: original,
		mockName: "vi.fn()",
		onceMockImplementations: []
	};
}
function getDefaultState() {
	const state = {
		calls: [],
		contexts: [],
		instances: [],
		invocationCallOrder: [],
		settledResults: [],
		results: [],
		get lastCall() {
			return state.calls.at(-1);
		}
	};
	return state;
}
function restoreAllMocks() {
	for (const restore of MOCK_RESTORE) {
		restore();
	}
	MOCK_RESTORE.clear();
}
function clearAllMocks() {
	REGISTERED_MOCKS.forEach((mock) => mock.mockClear());
}
function resetAllMocks() {
	REGISTERED_MOCKS.forEach((mock) => mock.mockReset());
}

const IS_RECORD_SYMBOL$1 = "@@__IMMUTABLE_RECORD__@@";
const IS_COLLECTION_SYMBOL = "@@__IMMUTABLE_ITERABLE__@@";
function isImmutable(v) {
	return v && (v[IS_COLLECTION_SYMBOL] || v[IS_RECORD_SYMBOL$1]);
}
const OBJECT_PROTO = Object.getPrototypeOf({});
function getUnserializableMessage(err) {
	if (err instanceof Error) {
		return `<unserializable>: ${err.message}`;
	}
	if (typeof err === "string") {
		return `<unserializable>: ${err}`;
	}
	return "<unserializable>";
}
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
function serializeValue(val, seen = new WeakMap()) {
	if (!val || typeof val === "string") {
		return val;
	}
	if (val instanceof Error && "toJSON" in val && typeof val.toJSON === "function") {
		const jsonValue = val.toJSON();
		if (jsonValue && jsonValue !== val && typeof jsonValue === "object") {
			if (typeof val.message === "string") {
				safe(() => jsonValue.message ?? (jsonValue.message = normalizeErrorMessage(val.message)));
			}
			if (typeof val.stack === "string") {
				safe(() => jsonValue.stack ?? (jsonValue.stack = val.stack));
			}
			if (typeof val.name === "string") {
				safe(() => jsonValue.name ?? (jsonValue.name = val.name));
			}
			if (val.cause != null) {
				safe(() => jsonValue.cause ?? (jsonValue.cause = serializeValue(val.cause, seen)));
			}
		}
		return serializeValue(jsonValue, seen);
	}
	if (typeof val === "function") {
		return `Function<${val.name || "anonymous"}>`;
	}
	if (typeof val === "symbol") {
		return val.toString();
	}
	if (typeof val !== "object") {
		return val;
	}
	if (typeof Buffer !== "undefined" && val instanceof Buffer) {
		return `<Buffer(${val.length}) ...>`;
	}
	if (typeof Uint8Array !== "undefined" && val instanceof Uint8Array) {
		return `<Uint8Array(${val.length}) ...>`;
	}
	// cannot serialize immutables as immutables
	if (isImmutable(val)) {
		return serializeValue(val.toJSON(), seen);
	}
	if (val instanceof Promise || val.constructor && val.constructor.prototype === "AsyncFunction") {
		return "Promise";
	}
	if (typeof Element !== "undefined" && val instanceof Element) {
		return val.tagName;
	}
	if (typeof val.toJSON === "function") {
		return serializeValue(val.toJSON(), seen);
	}
	if (seen.has(val)) {
		return seen.get(val);
	}
	if (Array.isArray(val)) {
		// eslint-disable-next-line unicorn/no-new-array -- we need to keep sparse arrays ([1,,3])
		const clone = new Array(val.length);
		seen.set(val, clone);
		val.forEach((e, i) => {
			try {
				clone[i] = serializeValue(e, seen);
			} catch (err) {
				clone[i] = getUnserializableMessage(err);
			}
		});
		return clone;
	} else {
		// Objects with `Error` constructors appear to cause problems during worker communication
		// using `MessagePort`, so the serialized error object is being recreated as plain object.
		const clone = Object.create(null);
		seen.set(val, clone);
		let obj = val;
		while (obj && obj !== OBJECT_PROTO) {
			Object.getOwnPropertyNames(obj).forEach((key) => {
				if (key in clone) {
					return;
				}
				try {
					clone[key] = serializeValue(val[key], seen);
				} catch (err) {
					// delete in case it has a setter from prototype that might throw
					delete clone[key];
					clone[key] = getUnserializableMessage(err);
				}
			});
			obj = Object.getPrototypeOf(obj);
		}
		if (val instanceof Error) {
			safe(() => val.message = normalizeErrorMessage(val.message));
		}
		return clone;
	}
}
function safe(fn) {
	try {
		return fn();
	} catch {}
}
function normalizeErrorMessage(message) {
	return message.replace(/__(vite_ssr_import|vi_import)_\d+__\./g, "");
}

function processError(_err, diffOptions, seen = new WeakSet()) {
	if (!_err || typeof _err !== "object") {
		return { message: String(_err) };
	}
	const err = _err;
	if (err.showDiff || err.showDiff === undefined && err.expected !== undefined && err.actual !== undefined) {
		err.diff = printDiffOrStringify(err.actual, err.expected, {
			...diffOptions,
			...err.diffOptions
		});
	}
	if ("expected" in err && typeof err.expected !== "string") {
		err.expected = stringify(err.expected, 10);
	}
	if ("actual" in err && typeof err.actual !== "string") {
		err.actual = stringify(err.actual, 10);
	}
	// some Error implementations may not allow rewriting cause
	// in most cases, the assignment will lead to "err.cause = err.cause"
	try {
		if (!seen.has(err) && typeof err.cause === "object") {
			seen.add(err);
			err.cause = processError(err.cause, diffOptions, seen);
		}
	} catch {}
	try {
		return serializeValue(err);
	} catch (e) {
		return serializeValue(new Error(`Failed to fully serialize error: ${e === null || e === void 0 ? void 0 : e.message}\nInner error message: ${err === null || err === void 0 ? void 0 : err.message}`));
	}
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// lib/chai/utils/index.js
var utils_exports = {};
__export(utils_exports, {
  addChainableMethod: () => addChainableMethod,
  addLengthGuard: () => addLengthGuard,
  addMethod: () => addMethod,
  addProperty: () => addProperty,
  checkError: () => check_error_exports,
  compareByInspect: () => compareByInspect,
  eql: () => deep_eql_default,
  events: () => events,
  expectTypes: () => expectTypes,
  flag: () => flag,
  getActual: () => getActual,
  getMessage: () => getMessage2,
  getName: () => getName,
  getOperator: () => getOperator,
  getOwnEnumerableProperties: () => getOwnEnumerableProperties,
  getOwnEnumerablePropertySymbols: () => getOwnEnumerablePropertySymbols,
  getPathInfo: () => getPathInfo,
  hasProperty: () => hasProperty,
  inspect: () => inspect2,
  isNaN: () => isNaN2,
  isNumeric: () => isNumeric,
  isProxyEnabled: () => isProxyEnabled,
  isRegExp: () => isRegExp2,
  objDisplay: () => objDisplay,
  overwriteChainableMethod: () => overwriteChainableMethod,
  overwriteMethod: () => overwriteMethod,
  overwriteProperty: () => overwriteProperty,
  proxify: () => proxify,
  test: () => test$2,
  transferFlags: () => transferFlags,
  type: () => type
});

// node_modules/check-error/index.js
var check_error_exports = {};
__export(check_error_exports, {
  compatibleConstructor: () => compatibleConstructor,
  compatibleInstance: () => compatibleInstance,
  compatibleMessage: () => compatibleMessage,
  getConstructorName: () => getConstructorName,
  getMessage: () => getMessage
});
function isErrorInstance(obj) {
  return obj instanceof Error || Object.prototype.toString.call(obj) === "[object Error]";
}
__name(isErrorInstance, "isErrorInstance");
function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === "[object RegExp]";
}
__name(isRegExp, "isRegExp");
function compatibleInstance(thrown, errorLike) {
  return isErrorInstance(errorLike) && thrown === errorLike;
}
__name(compatibleInstance, "compatibleInstance");
function compatibleConstructor(thrown, errorLike) {
  if (isErrorInstance(errorLike)) {
    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
  } else if ((typeof errorLike === "object" || typeof errorLike === "function") && errorLike.prototype) {
    return thrown.constructor === errorLike || thrown instanceof errorLike;
  }
  return false;
}
__name(compatibleConstructor, "compatibleConstructor");
function compatibleMessage(thrown, errMatcher) {
  const comparisonString = typeof thrown === "string" ? thrown : thrown.message;
  if (isRegExp(errMatcher)) {
    return errMatcher.test(comparisonString);
  } else if (typeof errMatcher === "string") {
    return comparisonString.indexOf(errMatcher) !== -1;
  }
  return false;
}
__name(compatibleMessage, "compatibleMessage");
function getConstructorName(errorLike) {
  let constructorName = errorLike;
  if (isErrorInstance(errorLike)) {
    constructorName = errorLike.constructor.name;
  } else if (typeof errorLike === "function") {
    constructorName = errorLike.name;
    if (constructorName === "") {
      const newConstructorName = new errorLike().name;
      constructorName = newConstructorName || constructorName;
    }
  }
  return constructorName;
}
__name(getConstructorName, "getConstructorName");
function getMessage(errorLike) {
  let msg = "";
  if (errorLike && errorLike.message) {
    msg = errorLike.message;
  } else if (typeof errorLike === "string") {
    msg = errorLike;
  }
  return msg;
}
__name(getMessage, "getMessage");

// lib/chai/utils/flag.js
function flag(obj, key, value) {
  let flags = obj.__flags || (obj.__flags = /* @__PURE__ */ Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
}
__name(flag, "flag");

// lib/chai/utils/test.js
function test$2(obj, args) {
  let negate = flag(obj, "negate"), expr = args[0];
  return negate ? !expr : expr;
}
__name(test$2, "test");

// lib/chai/utils/type-detect.js
function type(obj) {
  if (typeof obj === "undefined") {
    return "undefined";
  }
  if (obj === null) {
    return "null";
  }
  const stringTag = obj[Symbol.toStringTag];
  if (typeof stringTag === "string") {
    return stringTag;
  }
  const type3 = Object.prototype.toString.call(obj).slice(8, -1);
  return type3;
}
__name(type, "type");

// node_modules/assertion-error/index.js
var canElideFrames = "captureStackTrace" in Error;
var _AssertionError = class _AssertionError extends Error {
  constructor(message = "Unspecified AssertionError", props, ssf) {
    super(message);
    __publicField(this, "message");
    this.message = message;
    if (canElideFrames) {
      Error.captureStackTrace(this, ssf || _AssertionError);
    }
    for (const key in props) {
      if (!(key in this)) {
        this[key] = props[key];
      }
    }
  }
  get name() {
    return "AssertionError";
  }
  get ok() {
    return false;
  }
  toJSON(stack) {
    return {
      ...this,
      name: this.name,
      message: this.message,
      ok: false,
      stack: stack !== false ? this.stack : void 0
    };
  }
};
__name(_AssertionError, "AssertionError");
var AssertionError = _AssertionError;

// lib/chai/utils/expectTypes.js
function expectTypes(obj, types) {
  let flagMsg = flag(obj, "message");
  let ssfi = flag(obj, "ssfi");
  flagMsg = flagMsg ? flagMsg + ": " : "";
  obj = flag(obj, "object");
  types = types.map(function(t) {
    return t.toLowerCase();
  });
  types.sort();
  let str = types.map(function(t, index) {
    let art = ~["a", "e", "i", "o", "u"].indexOf(t.charAt(0)) ? "an" : "a";
    let or = types.length > 1 && index === types.length - 1 ? "or " : "";
    return or + art + " " + t;
  }).join(", ");
  let objType = type(obj).toLowerCase();
  if (!types.some(function(expected) {
    return objType === expected;
  })) {
    throw new AssertionError(
      flagMsg + "object tested must be " + str + ", but " + objType + " given",
      void 0,
      ssfi
    );
  }
}
__name(expectTypes, "expectTypes");

// lib/chai/utils/getActual.js
function getActual(obj, args) {
  return args.length > 4 ? args[4] : obj._obj;
}
__name(getActual, "getActual");

// node_modules/loupe/lib/helpers.js
var ansiColors = {
  bold: ["1", "22"],
  dim: ["2", "22"],
  italic: ["3", "23"],
  underline: ["4", "24"],
  // 5 & 6 are blinking
  inverse: ["7", "27"],
  hidden: ["8", "28"],
  strike: ["9", "29"],
  // 10-20 are fonts
  // 21-29 are resets for 1-9
  black: ["30", "39"],
  red: ["31", "39"],
  green: ["32", "39"],
  yellow: ["33", "39"],
  blue: ["34", "39"],
  magenta: ["35", "39"],
  cyan: ["36", "39"],
  white: ["37", "39"],
  brightblack: ["30;1", "39"],
  brightred: ["31;1", "39"],
  brightgreen: ["32;1", "39"],
  brightyellow: ["33;1", "39"],
  brightblue: ["34;1", "39"],
  brightmagenta: ["35;1", "39"],
  brightcyan: ["36;1", "39"],
  brightwhite: ["37;1", "39"],
  grey: ["90", "39"]
};
var styles = {
  special: "cyan",
  number: "yellow",
  bigint: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  symbol: "green",
  date: "magenta",
  regexp: "red"
};
var truncator = "\u2026";
function colorise(value, styleType) {
  const color = ansiColors[styles[styleType]] || ansiColors[styleType] || "";
  if (!color) {
    return String(value);
  }
  return `\x1B[${color[0]}m${String(value)}\x1B[${color[1]}m`;
}
__name(colorise, "colorise");
function normaliseOptions({
  showHidden = false,
  depth = 2,
  colors = false,
  customInspect = true,
  showProxy = false,
  maxArrayLength = Infinity,
  breakLength = Infinity,
  seen = [],
  // eslint-disable-next-line no-shadow
  truncate: truncate2 = Infinity,
  stylize = String
} = {}, inspect3) {
  const options = {
    showHidden: Boolean(showHidden),
    depth: Number(depth),
    colors: Boolean(colors),
    customInspect: Boolean(customInspect),
    showProxy: Boolean(showProxy),
    maxArrayLength: Number(maxArrayLength),
    breakLength: Number(breakLength),
    truncate: Number(truncate2),
    seen,
    inspect: inspect3,
    stylize
  };
  if (options.colors) {
    options.stylize = colorise;
  }
  return options;
}
__name(normaliseOptions, "normaliseOptions");
function isHighSurrogate(char) {
  return char >= "\uD800" && char <= "\uDBFF";
}
__name(isHighSurrogate, "isHighSurrogate");
function truncate(string, length, tail = truncator) {
  string = String(string);
  const tailLength = tail.length;
  const stringLength = string.length;
  if (tailLength > length && stringLength > tailLength) {
    return tail;
  }
  if (stringLength > length && stringLength > tailLength) {
    let end = length - tailLength;
    if (end > 0 && isHighSurrogate(string[end - 1])) {
      end = end - 1;
    }
    return `${string.slice(0, end)}${tail}`;
  }
  return string;
}
__name(truncate, "truncate");
function inspectList(list, options, inspectItem, separator = ", ") {
  inspectItem = inspectItem || options.inspect;
  const size = list.length;
  if (size === 0)
    return "";
  const originalLength = options.truncate;
  let output = "";
  let peek = "";
  let truncated = "";
  for (let i = 0; i < size; i += 1) {
    const last = i + 1 === list.length;
    const secondToLast = i + 2 === list.length;
    truncated = `${truncator}(${list.length - i})`;
    const value = list[i];
    options.truncate = originalLength - output.length - (last ? 0 : separator.length);
    const string = peek || inspectItem(value, options) + (last ? "" : separator);
    const nextLength = output.length + string.length;
    const truncatedLength = nextLength + truncated.length;
    if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) {
      break;
    }
    if (!last && !secondToLast && truncatedLength > originalLength) {
      break;
    }
    peek = last ? "" : inspectItem(list[i + 1], options) + (secondToLast ? "" : separator);
    if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) {
      break;
    }
    output += string;
    if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
      truncated = `${truncator}(${list.length - i - 1})`;
      break;
    }
    truncated = "";
  }
  return `${output}${truncated}`;
}
__name(inspectList, "inspectList");
function quoteComplexKey(key) {
  if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
    return key;
  }
  return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
}
__name(quoteComplexKey, "quoteComplexKey");
function inspectProperty([key, value], options) {
  options.truncate -= 2;
  if (typeof key === "string") {
    key = quoteComplexKey(key);
  } else if (typeof key !== "number") {
    key = `[${options.inspect(key, options)}]`;
  }
  options.truncate -= key.length;
  value = options.inspect(value, options);
  return `${key}: ${value}`;
}
__name(inspectProperty, "inspectProperty");

// node_modules/loupe/lib/array.js
function inspectArray(array, options) {
  const nonIndexProperties = Object.keys(array).slice(array.length);
  if (!array.length && !nonIndexProperties.length)
    return "[]";
  options.truncate -= 4;
  const listContents = inspectList(array, options);
  options.truncate -= listContents.length;
  let propertyContents = "";
  if (nonIndexProperties.length) {
    propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options, inspectProperty);
  }
  return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ""} ]`;
}
__name(inspectArray, "inspectArray");

// node_modules/loupe/lib/typedarray.js
var getArrayName = /* @__PURE__ */ __name((array) => {
  if (typeof Buffer === "function" && array instanceof Buffer) {
    return "Buffer";
  }
  if (array[Symbol.toStringTag]) {
    return array[Symbol.toStringTag];
  }
  return array.constructor.name;
}, "getArrayName");
function inspectTypedArray(array, options) {
  const name = getArrayName(array);
  options.truncate -= name.length + 4;
  const nonIndexProperties = Object.keys(array).slice(array.length);
  if (!array.length && !nonIndexProperties.length)
    return `${name}[]`;
  let output = "";
  for (let i = 0; i < array.length; i++) {
    const string = `${options.stylize(truncate(array[i], options.truncate), "number")}${i === array.length - 1 ? "" : ", "}`;
    options.truncate -= string.length;
    if (array[i] !== array.length && options.truncate <= 3) {
      output += `${truncator}(${array.length - array[i] + 1})`;
      break;
    }
    output += string;
  }
  let propertyContents = "";
  if (nonIndexProperties.length) {
    propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options, inspectProperty);
  }
  return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ""} ]`;
}
__name(inspectTypedArray, "inspectTypedArray");

// node_modules/loupe/lib/date.js
function inspectDate(dateObject, options) {
  const stringRepresentation = dateObject.toJSON();
  if (stringRepresentation === null) {
    return "Invalid Date";
  }
  const split = stringRepresentation.split("T");
  const date = split[0];
  return options.stylize(`${date}T${truncate(split[1], options.truncate - date.length - 1)}`, "date");
}
__name(inspectDate, "inspectDate");

// node_modules/loupe/lib/function.js
function inspectFunction(func, options) {
  const functionType = func[Symbol.toStringTag] || "Function";
  const name = func.name;
  if (!name) {
    return options.stylize(`[${functionType}]`, "special");
  }
  return options.stylize(`[${functionType} ${truncate(name, options.truncate - 11)}]`, "special");
}
__name(inspectFunction, "inspectFunction");

// node_modules/loupe/lib/map.js
function inspectMapEntry([key, value], options) {
  options.truncate -= 4;
  key = options.inspect(key, options);
  options.truncate -= key.length;
  value = options.inspect(value, options);
  return `${key} => ${value}`;
}
__name(inspectMapEntry, "inspectMapEntry");
function mapToEntries(map) {
  const entries = [];
  map.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
}
__name(mapToEntries, "mapToEntries");
function inspectMap(map, options) {
  if (map.size === 0)
    return "Map{}";
  options.truncate -= 7;
  return `Map{ ${inspectList(mapToEntries(map), options, inspectMapEntry)} }`;
}
__name(inspectMap, "inspectMap");

// node_modules/loupe/lib/number.js
var isNaN = Number.isNaN || ((i) => i !== i);
function inspectNumber(number, options) {
  if (isNaN(number)) {
    return options.stylize("NaN", "number");
  }
  if (number === Infinity) {
    return options.stylize("Infinity", "number");
  }
  if (number === -Infinity) {
    return options.stylize("-Infinity", "number");
  }
  if (number === 0) {
    return options.stylize(1 / number === Infinity ? "+0" : "-0", "number");
  }
  return options.stylize(truncate(String(number), options.truncate), "number");
}
__name(inspectNumber, "inspectNumber");

// node_modules/loupe/lib/bigint.js
function inspectBigInt(number, options) {
  let nums = truncate(number.toString(), options.truncate - 1);
  if (nums !== truncator)
    nums += "n";
  return options.stylize(nums, "bigint");
}
__name(inspectBigInt, "inspectBigInt");

// node_modules/loupe/lib/regexp.js
function inspectRegExp(value, options) {
  const flags = value.toString().split("/")[2];
  const sourceLength = options.truncate - (2 + flags.length);
  const source = value.source;
  return options.stylize(`/${truncate(source, sourceLength)}/${flags}`, "regexp");
}
__name(inspectRegExp, "inspectRegExp");

// node_modules/loupe/lib/set.js
function arrayFromSet(set2) {
  const values = [];
  set2.forEach((value) => {
    values.push(value);
  });
  return values;
}
__name(arrayFromSet, "arrayFromSet");
function inspectSet(set2, options) {
  if (set2.size === 0)
    return "Set{}";
  options.truncate -= 7;
  return `Set{ ${inspectList(arrayFromSet(set2), options)} }`;
}
__name(inspectSet, "inspectSet");

// node_modules/loupe/lib/string.js
var stringEscapeChars = new RegExp("['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]", "g");
var escapeCharacters = {
  "\b": "\\b",
  "	": "\\t",
  "\n": "\\n",
  "\f": "\\f",
  "\r": "\\r",
  "'": "\\'",
  "\\": "\\\\"
};
var hex = 16;
function escape(char) {
  return escapeCharacters[char] || `\\u${`0000${char.charCodeAt(0).toString(hex)}`.slice(-4)}`;
}
__name(escape, "escape");
function inspectString(string, options) {
  if (stringEscapeChars.test(string)) {
    string = string.replace(stringEscapeChars, escape);
  }
  return options.stylize(`'${truncate(string, options.truncate - 2)}'`, "string");
}
__name(inspectString, "inspectString");

// node_modules/loupe/lib/symbol.js
function inspectSymbol(value) {
  if ("description" in Symbol.prototype) {
    return value.description ? `Symbol(${value.description})` : "Symbol()";
  }
  return value.toString();
}
__name(inspectSymbol, "inspectSymbol");

// node_modules/loupe/lib/promise.js
var getPromiseValue = /* @__PURE__ */ __name(() => "Promise{\u2026}", "getPromiseValue");
var promise_default = getPromiseValue;

// node_modules/loupe/lib/object.js
function inspectObject(object, options) {
  const properties = Object.getOwnPropertyNames(object);
  const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
  if (properties.length === 0 && symbols.length === 0) {
    return "{}";
  }
  options.truncate -= 4;
  options.seen = options.seen || [];
  if (options.seen.includes(object)) {
    return "[Circular]";
  }
  options.seen.push(object);
  const propertyContents = inspectList(properties.map((key) => [key, object[key]]), options, inspectProperty);
  const symbolContents = inspectList(symbols.map((key) => [key, object[key]]), options, inspectProperty);
  options.seen.pop();
  let sep = "";
  if (propertyContents && symbolContents) {
    sep = ", ";
  }
  return `{ ${propertyContents}${sep}${symbolContents} }`;
}
__name(inspectObject, "inspectObject");

// node_modules/loupe/lib/class.js
var toStringTag = typeof Symbol !== "undefined" && Symbol.toStringTag ? Symbol.toStringTag : false;
function inspectClass(value, options) {
  let name = "";
  if (toStringTag && toStringTag in value) {
    name = value[toStringTag];
  }
  name = name || value.constructor.name;
  if (!name || name === "_class") {
    name = "<Anonymous Class>";
  }
  options.truncate -= name.length;
  return `${name}${inspectObject(value, options)}`;
}
__name(inspectClass, "inspectClass");

// node_modules/loupe/lib/arguments.js
function inspectArguments(args, options) {
  if (args.length === 0)
    return "Arguments[]";
  options.truncate -= 13;
  return `Arguments[ ${inspectList(args, options)} ]`;
}
__name(inspectArguments, "inspectArguments");

// node_modules/loupe/lib/error.js
var errorKeys = [
  "stack",
  "line",
  "column",
  "name",
  "message",
  "fileName",
  "lineNumber",
  "columnNumber",
  "number",
  "description",
  "cause"
];
function inspectObject2(error, options) {
  const properties = Object.getOwnPropertyNames(error).filter((key) => errorKeys.indexOf(key) === -1);
  const name = error.name;
  options.truncate -= name.length;
  let message = "";
  if (typeof error.message === "string") {
    message = truncate(error.message, options.truncate);
  } else {
    properties.unshift("message");
  }
  message = message ? `: ${message}` : "";
  options.truncate -= message.length + 5;
  options.seen = options.seen || [];
  if (options.seen.includes(error)) {
    return "[Circular]";
  }
  options.seen.push(error);
  const propertyContents = inspectList(properties.map((key) => [key, error[key]]), options, inspectProperty);
  return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ""}`;
}
__name(inspectObject2, "inspectObject");

// node_modules/loupe/lib/html.js
function inspectAttribute([key, value], options) {
  options.truncate -= 3;
  if (!value) {
    return `${options.stylize(String(key), "yellow")}`;
  }
  return `${options.stylize(String(key), "yellow")}=${options.stylize(`"${value}"`, "string")}`;
}
__name(inspectAttribute, "inspectAttribute");
function inspectNodeCollection(collection, options) {
  return inspectList(collection, options, inspectNode, "\n");
}
__name(inspectNodeCollection, "inspectNodeCollection");
function inspectNode(node, options) {
  switch (node.nodeType) {
    case 1:
      return inspectHTML(node, options);
    case 3:
      return options.inspect(node.data, options);
    default:
      return options.inspect(node, options);
  }
}
__name(inspectNode, "inspectNode");
function inspectHTML(element, options) {
  const properties = element.getAttributeNames();
  const name = element.tagName.toLowerCase();
  const head = options.stylize(`<${name}`, "special");
  const headClose = options.stylize(`>`, "special");
  const tail = options.stylize(`</${name}>`, "special");
  options.truncate -= name.length * 2 + 5;
  let propertyContents = "";
  if (properties.length > 0) {
    propertyContents += " ";
    propertyContents += inspectList(properties.map((key) => [key, element.getAttribute(key)]), options, inspectAttribute, " ");
  }
  options.truncate -= propertyContents.length;
  const truncate2 = options.truncate;
  let children = inspectNodeCollection(element.children, options);
  if (children && children.length > truncate2) {
    children = `${truncator}(${element.children.length})`;
  }
  return `${head}${propertyContents}${headClose}${children}${tail}`;
}
__name(inspectHTML, "inspectHTML");

// node_modules/loupe/lib/index.js
var symbolsSupported = typeof Symbol === "function" && typeof Symbol.for === "function";
var chaiInspect = symbolsSupported ? /* @__PURE__ */ Symbol.for("chai/inspect") : "@@chai/inspect";
var nodeInspect = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
var constructorMap = /* @__PURE__ */ new WeakMap();
var stringTagMap = {};
var baseTypesMap = {
  undefined: /* @__PURE__ */ __name((value, options) => options.stylize("undefined", "undefined"), "undefined"),
  null: /* @__PURE__ */ __name((value, options) => options.stylize("null", "null"), "null"),
  boolean: /* @__PURE__ */ __name((value, options) => options.stylize(String(value), "boolean"), "boolean"),
  Boolean: /* @__PURE__ */ __name((value, options) => options.stylize(String(value), "boolean"), "Boolean"),
  number: inspectNumber,
  Number: inspectNumber,
  bigint: inspectBigInt,
  BigInt: inspectBigInt,
  string: inspectString,
  String: inspectString,
  function: inspectFunction,
  Function: inspectFunction,
  symbol: inspectSymbol,
  // A Symbol polyfill will return `Symbol` not `symbol` from typedetect
  Symbol: inspectSymbol,
  Array: inspectArray,
  Date: inspectDate,
  Map: inspectMap,
  Set: inspectSet,
  RegExp: inspectRegExp,
  Promise: promise_default,
  // WeakSet, WeakMap are totally opaque to us
  WeakSet: /* @__PURE__ */ __name((value, options) => options.stylize("WeakSet{\u2026}", "special"), "WeakSet"),
  WeakMap: /* @__PURE__ */ __name((value, options) => options.stylize("WeakMap{\u2026}", "special"), "WeakMap"),
  Arguments: inspectArguments,
  Int8Array: inspectTypedArray,
  Uint8Array: inspectTypedArray,
  Uint8ClampedArray: inspectTypedArray,
  Int16Array: inspectTypedArray,
  Uint16Array: inspectTypedArray,
  Int32Array: inspectTypedArray,
  Uint32Array: inspectTypedArray,
  Float32Array: inspectTypedArray,
  Float64Array: inspectTypedArray,
  Generator: /* @__PURE__ */ __name(() => "", "Generator"),
  DataView: /* @__PURE__ */ __name(() => "", "DataView"),
  ArrayBuffer: /* @__PURE__ */ __name(() => "", "ArrayBuffer"),
  Error: inspectObject2,
  HTMLCollection: inspectNodeCollection,
  NodeList: inspectNodeCollection
};
var inspectCustom = /* @__PURE__ */ __name((value, options, type3, inspectFn) => {
  if (chaiInspect in value && typeof value[chaiInspect] === "function") {
    return value[chaiInspect](options);
  }
  if (nodeInspect in value && typeof value[nodeInspect] === "function") {
    return value[nodeInspect](options.depth, options, inspectFn);
  }
  if ("inspect" in value && typeof value.inspect === "function") {
    return value.inspect(options.depth, options);
  }
  if ("constructor" in value && constructorMap.has(value.constructor)) {
    return constructorMap.get(value.constructor)(value, options);
  }
  if (stringTagMap[type3]) {
    return stringTagMap[type3](value, options);
  }
  return "";
}, "inspectCustom");
var toString = Object.prototype.toString;
function inspect(value, opts = {}) {
  const options = normaliseOptions(opts, inspect);
  const { customInspect } = options;
  let type3 = value === null ? "null" : typeof value;
  if (type3 === "object") {
    type3 = toString.call(value).slice(8, -1);
  }
  if (type3 in baseTypesMap) {
    return baseTypesMap[type3](value, options);
  }
  if (customInspect && value) {
    const output = inspectCustom(value, options, type3, inspect);
    if (output) {
      if (typeof output === "string")
        return output;
      return inspect(output, options);
    }
  }
  const proto = value ? Object.getPrototypeOf(value) : false;
  if (proto === Object.prototype || proto === null) {
    return inspectObject(value, options);
  }
  if (value && typeof HTMLElement === "function" && value instanceof HTMLElement) {
    return inspectHTML(value, options);
  }
  if ("constructor" in value) {
    if (value.constructor !== Object) {
      return inspectClass(value, options);
    }
    return inspectObject(value, options);
  }
  if (value === Object(value)) {
    return inspectObject(value, options);
  }
  return options.stylize(String(value), type3);
}
__name(inspect, "inspect");

// lib/chai/config.js
var config = {
  /**
   * ### config.includeStack
   *
   * User configurable property, influences whether stack trace
   * is included in Assertion error message. Default of false
   * suppresses stack trace in the error message.
   *
   *     chai.config.includeStack = true;  // enable stack on error
   *
   * @param {boolean}
   * @public
   */
  includeStack: false,
  /**
   * ### config.showDiff
   *
   * User configurable property, influences whether or not
   * the `showDiff` flag should be included in the thrown
   * AssertionErrors. `false` will always be `false`; `true`
   * will be true when the assertion has requested a diff
   * be shown.
   *
   * @param {boolean}
   * @public
   */
  showDiff: true,
  /**
   * ### config.truncateThreshold
   *
   * User configurable property, sets length threshold for actual and
   * expected values in assertion errors. If this threshold is exceeded, for
   * example for large data structures, the value is replaced with something
   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
   *
   * Set it to zero if you want to disable truncating altogether.
   *
   * This is especially userful when doing assertions on arrays: having this
   * set to a reasonable large value makes the failure messages readily
   * inspectable.
   *
   *     chai.config.truncateThreshold = 0;  // disable truncating
   *
   * @param {number}
   * @public
   */
  truncateThreshold: 40,
  /**
   * ### config.useProxy
   *
   * User configurable property, defines if chai will use a Proxy to throw
   * an error when a non-existent property is read, which protects users
   * from typos when using property-based assertions.
   *
   * Set it to false if you want to disable this feature.
   *
   *     chai.config.useProxy = false;  // disable use of Proxy
   *
   * This feature is automatically disabled regardless of this config value
   * in environments that don't support proxies.
   *
   * @param {boolean}
   * @public
   */
  useProxy: true,
  /**
   * ### config.proxyExcludedKeys
   *
   * User configurable property, defines which properties should be ignored
   * instead of throwing an error if they do not exist on the assertion.
   * This is only applied if the environment Chai is running in supports proxies and
   * if the `useProxy` configuration setting is enabled.
   * By default, `then` and `inspect` will not throw an error if they do not exist on the
   * assertion object because the `.inspect` property is read by `util.inspect` (for example, when
   * using `console.log` on the assertion object) and `.then` is necessary for promise type-checking.
   *
   *     // By default these keys will not throw an error if they do not exist on the assertion object
   *     chai.config.proxyExcludedKeys = ['then', 'inspect'];
   *
   * @param {Array}
   * @public
   */
  proxyExcludedKeys: ["then", "catch", "inspect", "toJSON"],
  /**
   * ### config.deepEqual
   *
   * User configurable property, defines which a custom function to use for deepEqual
   * comparisons.
   * By default, the function used is the one from the `deep-eql` package without custom comparator.
   *
   *     // use a custom comparator
   *     chai.config.deepEqual = (expected, actual) => {
   *         return chai.util.eql(expected, actual, {
   *             comparator: (expected, actual) => {
   *                 // for non number comparison, use the default behavior
   *                 if(typeof expected !== 'number') return null;
   *                 // allow a difference of 10 between compared numbers
   *                 return typeof actual === 'number' && Math.abs(actual - expected) < 10
   *             }
   *         })
   *     };
   *
   * @param {Function}
   * @public
   */
  deepEqual: null
};

// lib/chai/utils/inspect.js
function inspect2(obj, showHidden, depth, colors) {
  let options = {
    colors,
    depth: typeof depth === "undefined" ? 2 : depth,
    showHidden,
    truncate: config.truncateThreshold ? config.truncateThreshold : Infinity
  };
  return inspect(obj, options);
}
__name(inspect2, "inspect");

// lib/chai/utils/objDisplay.js
function objDisplay(obj) {
  let str = inspect2(obj), type3 = Object.prototype.toString.call(obj);
  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
    if (type3 === "[object Function]") {
      return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
    } else if (type3 === "[object Array]") {
      return "[ Array(" + obj.length + ") ]";
    } else if (type3 === "[object Object]") {
      let keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ");
      return "{ Object (" + kstr + ") }";
    } else {
      return str;
    }
  } else {
    return str;
  }
}
__name(objDisplay, "objDisplay");

// lib/chai/utils/getMessage.js
function getMessage2(obj, args) {
  let negate = flag(obj, "negate");
  let val = flag(obj, "object");
  let expected = args[3];
  let actual = getActual(obj, args);
  let msg = negate ? args[2] : args[1];
  let flagMsg = flag(obj, "message");
  if (typeof msg === "function") msg = msg();
  msg = msg || "";
  msg = msg.replace(/#\{this\}/g, function() {
    return objDisplay(val);
  }).replace(/#\{act\}/g, function() {
    return objDisplay(actual);
  }).replace(/#\{exp\}/g, function() {
    return objDisplay(expected);
  });
  return flagMsg ? flagMsg + ": " + msg : msg;
}
__name(getMessage2, "getMessage");

// lib/chai/utils/transferFlags.js
function transferFlags(assertion, object, includeAll) {
  let flags = assertion.__flags || (assertion.__flags = /* @__PURE__ */ Object.create(null));
  if (!object.__flags) {
    object.__flags = /* @__PURE__ */ Object.create(null);
  }
  includeAll = arguments.length === 3 ? includeAll : true;
  for (let flag3 in flags) {
    if (includeAll || flag3 !== "object" && flag3 !== "ssfi" && flag3 !== "lockSsfi" && flag3 != "message") {
      object.__flags[flag3] = flags[flag3];
    }
  }
}
__name(transferFlags, "transferFlags");

// node_modules/deep-eql/index.js
function type2(obj) {
  if (typeof obj === "undefined") {
    return "undefined";
  }
  if (obj === null) {
    return "null";
  }
  const stringTag = obj[Symbol.toStringTag];
  if (typeof stringTag === "string") {
    return stringTag;
  }
  const sliceStart = 8;
  const sliceEnd = -1;
  return Object.prototype.toString.call(obj).slice(sliceStart, sliceEnd);
}
__name(type2, "type");
function FakeMap() {
  this._key = "chai/deep-eql__" + Math.random() + Date.now();
}
__name(FakeMap, "FakeMap");
FakeMap.prototype = {
  get: /* @__PURE__ */ __name(function get(key) {
    return key[this._key];
  }, "get"),
  set: /* @__PURE__ */ __name(function set(key, value) {
    if (Object.isExtensible(key)) {
      Object.defineProperty(key, this._key, {
        value,
        configurable: true
      });
    }
  }, "set")
};
var MemoizeMap = typeof WeakMap === "function" ? WeakMap : FakeMap;
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
  if (!memoizeMap || isPrimitive$1(leftHandOperand) || isPrimitive$1(rightHandOperand)) {
    return null;
  }
  var leftHandMap = memoizeMap.get(leftHandOperand);
  if (leftHandMap) {
    var result = leftHandMap.get(rightHandOperand);
    if (typeof result === "boolean") {
      return result;
    }
  }
  return null;
}
__name(memoizeCompare, "memoizeCompare");
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
  if (!memoizeMap || isPrimitive$1(leftHandOperand) || isPrimitive$1(rightHandOperand)) {
    return;
  }
  var leftHandMap = memoizeMap.get(leftHandOperand);
  if (leftHandMap) {
    leftHandMap.set(rightHandOperand, result);
  } else {
    leftHandMap = new MemoizeMap();
    leftHandMap.set(rightHandOperand, result);
    memoizeMap.set(leftHandOperand, leftHandMap);
  }
}
__name(memoizeSet, "memoizeSet");
var deep_eql_default = deepEqual;
function deepEqual(leftHandOperand, rightHandOperand, options) {
  if (options && options.comparator) {
    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
  }
  var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
  if (simpleResult !== null) {
    return simpleResult;
  }
  return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
__name(deepEqual, "deepEqual");
function simpleEqual(leftHandOperand, rightHandOperand) {
  if (leftHandOperand === rightHandOperand) {
    return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
  }
  if (leftHandOperand !== leftHandOperand && // eslint-disable-line no-self-compare
  rightHandOperand !== rightHandOperand) {
    return true;
  }
  if (isPrimitive$1(leftHandOperand) || isPrimitive$1(rightHandOperand)) {
    return false;
  }
  return null;
}
__name(simpleEqual, "simpleEqual");
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
  options = options || {};
  options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
  var comparator = options && options.comparator;
  var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
  if (memoizeResultLeft !== null) {
    return memoizeResultLeft;
  }
  var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
  if (memoizeResultRight !== null) {
    return memoizeResultRight;
  }
  if (comparator) {
    var comparatorResult = comparator(leftHandOperand, rightHandOperand);
    if (comparatorResult === false || comparatorResult === true) {
      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
      return comparatorResult;
    }
    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
    if (simpleResult !== null) {
      return simpleResult;
    }
  }
  var leftHandType = type2(leftHandOperand);
  if (leftHandType !== type2(rightHandOperand)) {
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
    return false;
  }
  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
  var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
  return result;
}
__name(extensiveDeepEqual, "extensiveDeepEqual");
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
  switch (leftHandType) {
    case "String":
    case "Number":
    case "Boolean":
    case "Date":
      return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
    case "Promise":
    case "Symbol":
    case "function":
    case "WeakMap":
    case "WeakSet":
      return leftHandOperand === rightHandOperand;
    case "Error":
      return keysEqual(leftHandOperand, rightHandOperand, ["name", "message", "code"], options);
    case "Arguments":
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "Array":
      return iterableEqual(leftHandOperand, rightHandOperand, options);
    case "RegExp":
      return regexpEqual(leftHandOperand, rightHandOperand);
    case "Generator":
      return generatorEqual(leftHandOperand, rightHandOperand, options);
    case "DataView":
      return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
    case "ArrayBuffer":
      return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
    case "Set":
      return entriesEqual(leftHandOperand, rightHandOperand, options);
    case "Map":
      return entriesEqual(leftHandOperand, rightHandOperand, options);
    case "Temporal.PlainDate":
    case "Temporal.PlainTime":
    case "Temporal.PlainDateTime":
    case "Temporal.Instant":
    case "Temporal.ZonedDateTime":
    case "Temporal.PlainYearMonth":
    case "Temporal.PlainMonthDay":
      return leftHandOperand.equals(rightHandOperand);
    case "Temporal.Duration":
      return leftHandOperand.total("nanoseconds") === rightHandOperand.total("nanoseconds");
    case "Temporal.TimeZone":
    case "Temporal.Calendar":
      return leftHandOperand.toString() === rightHandOperand.toString();
    default:
      return objectEqual(leftHandOperand, rightHandOperand, options);
  }
}
__name(extensiveDeepEqualByType, "extensiveDeepEqualByType");
function regexpEqual(leftHandOperand, rightHandOperand) {
  return leftHandOperand.toString() === rightHandOperand.toString();
}
__name(regexpEqual, "regexpEqual");
function entriesEqual(leftHandOperand, rightHandOperand, options) {
  try {
    if (leftHandOperand.size !== rightHandOperand.size) {
      return false;
    }
    if (leftHandOperand.size === 0) {
      return true;
    }
  } catch (sizeError) {
    return false;
  }
  var leftHandItems = [];
  var rightHandItems = [];
  leftHandOperand.forEach(/* @__PURE__ */ __name(function gatherEntries(key, value) {
    leftHandItems.push([key, value]);
  }, "gatherEntries"));
  rightHandOperand.forEach(/* @__PURE__ */ __name(function gatherEntries(key, value) {
    rightHandItems.push([key, value]);
  }, "gatherEntries"));
  return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}
__name(entriesEqual, "entriesEqual");
function iterableEqual(leftHandOperand, rightHandOperand, options) {
  var length = leftHandOperand.length;
  if (length !== rightHandOperand.length) {
    return false;
  }
  if (length === 0) {
    return true;
  }
  var index = -1;
  while (++index < length) {
    if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
      return false;
    }
  }
  return true;
}
__name(iterableEqual, "iterableEqual");
function generatorEqual(leftHandOperand, rightHandOperand, options) {
  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
}
__name(generatorEqual, "generatorEqual");
function hasIteratorFunction(target) {
  return typeof Symbol !== "undefined" && typeof target === "object" && typeof Symbol.iterator !== "undefined" && typeof target[Symbol.iterator] === "function";
}
__name(hasIteratorFunction, "hasIteratorFunction");
function getIteratorEntries(target) {
  if (hasIteratorFunction(target)) {
    try {
      return getGeneratorEntries(target[Symbol.iterator]());
    } catch (iteratorError) {
      return [];
    }
  }
  return [];
}
__name(getIteratorEntries, "getIteratorEntries");
function getGeneratorEntries(generator) {
  var generatorResult = generator.next();
  var accumulator = [generatorResult.value];
  while (generatorResult.done === false) {
    generatorResult = generator.next();
    accumulator.push(generatorResult.value);
  }
  return accumulator;
}
__name(getGeneratorEntries, "getGeneratorEntries");
function getEnumerableKeys(target) {
  var keys = [];
  for (var key in target) {
    keys.push(key);
  }
  return keys;
}
__name(getEnumerableKeys, "getEnumerableKeys");
function getEnumerableSymbols(target) {
  var keys = [];
  var allKeys = Object.getOwnPropertySymbols(target);
  for (var i = 0; i < allKeys.length; i += 1) {
    var key = allKeys[i];
    if (Object.getOwnPropertyDescriptor(target, key).enumerable) {
      keys.push(key);
    }
  }
  return keys;
}
__name(getEnumerableSymbols, "getEnumerableSymbols");
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
  var length = keys.length;
  if (length === 0) {
    return true;
  }
  for (var i = 0; i < length; i += 1) {
    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
      return false;
    }
  }
  return true;
}
__name(keysEqual, "keysEqual");
function objectEqual(leftHandOperand, rightHandOperand, options) {
  var leftHandKeys = getEnumerableKeys(leftHandOperand);
  var rightHandKeys = getEnumerableKeys(rightHandOperand);
  var leftHandSymbols = getEnumerableSymbols(leftHandOperand);
  var rightHandSymbols = getEnumerableSymbols(rightHandOperand);
  leftHandKeys = leftHandKeys.concat(leftHandSymbols);
  rightHandKeys = rightHandKeys.concat(rightHandSymbols);
  if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
    if (iterableEqual(mapSymbols(leftHandKeys).sort(), mapSymbols(rightHandKeys).sort()) === false) {
      return false;
    }
    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
  }
  var leftHandEntries = getIteratorEntries(leftHandOperand);
  var rightHandEntries = getIteratorEntries(rightHandOperand);
  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
    leftHandEntries.sort();
    rightHandEntries.sort();
    return iterableEqual(leftHandEntries, rightHandEntries, options);
  }
  if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
    return true;
  }
  return false;
}
__name(objectEqual, "objectEqual");
function isPrimitive$1(value) {
  return value === null || typeof value !== "object";
}
__name(isPrimitive$1, "isPrimitive");
function mapSymbols(arr) {
  return arr.map(/* @__PURE__ */ __name(function mapSymbol(entry) {
    if (typeof entry === "symbol") {
      return entry.toString();
    }
    return entry;
  }, "mapSymbol"));
}
__name(mapSymbols, "mapSymbols");

// node_modules/pathval/index.js
function hasProperty(obj, name) {
  if (typeof obj === "undefined" || obj === null) {
    return false;
  }
  return name in Object(obj);
}
__name(hasProperty, "hasProperty");
function parsePath(path) {
  const str = path.replace(/([^\\])\[/g, "$1.[");
  const parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map((value) => {
    if (value === "constructor" || value === "__proto__" || value === "prototype") {
      return {};
    }
    const regexp = /^\[(\d+)\]$/;
    const mArr = regexp.exec(value);
    let parsed = null;
    if (mArr) {
      parsed = { i: parseFloat(mArr[1]) };
    } else {
      parsed = { p: value.replace(/\\([.[\]])/g, "$1") };
    }
    return parsed;
  });
}
__name(parsePath, "parsePath");
function internalGetPathValue(obj, parsed, pathDepth) {
  let temporaryValue = obj;
  let res = null;
  pathDepth = typeof pathDepth === "undefined" ? parsed.length : pathDepth;
  for (let i = 0; i < pathDepth; i++) {
    const part = parsed[i];
    if (temporaryValue) {
      if (typeof part.p === "undefined") {
        temporaryValue = temporaryValue[part.i];
      } else {
        temporaryValue = temporaryValue[part.p];
      }
      if (i === pathDepth - 1) {
        res = temporaryValue;
      }
    }
  }
  return res;
}
__name(internalGetPathValue, "internalGetPathValue");
function getPathInfo(obj, path) {
  const parsed = parsePath(path);
  const last = parsed[parsed.length - 1];
  const info = {
    parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
    name: last.p || last.i,
    value: internalGetPathValue(obj, parsed)
  };
  info.exists = hasProperty(info.parent, info.name);
  return info;
}
__name(getPathInfo, "getPathInfo");

// lib/chai/assertion.js
var _Assertion = class _Assertion {
  /**
   * Creates object for chaining.
   * `Assertion` objects contain metadata in the form of flags. Three flags can
   * be assigned during instantiation by passing arguments to this constructor:
   *
   * - `object`: This flag contains the target of the assertion. For example, in
   * the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
   * contain `numKittens` so that the `equal` assertion can reference it when
   * needed.
   *
   * - `message`: This flag contains an optional custom error message to be
   * prepended to the error message that's generated by the assertion when it
   * fails.
   *
   * - `ssfi`: This flag stands for "start stack function indicator". It
   * contains a function reference that serves as the starting point for
   * removing frames from the stack trace of the error that's created by the
   * assertion when it fails. The goal is to provide a cleaner stack trace to
   * end users by removing Chai's internal functions. Note that it only works
   * in environments that support `Error.captureStackTrace`, and only when
   * `Chai.config.includeStack` hasn't been set to `false`.
   *
   * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
   * should retain its current value, even as assertions are chained off of
   * this object. This is usually set to `true` when creating a new assertion
   * from within another assertion. It's also temporarily set to `true` before
   * an overwritten assertion gets called by the overwriting assertion.
   *
   * - `eql`: This flag contains the deepEqual function to be used by the assertion.
   *
   * @param {unknown} obj target of the assertion
   * @param {string} [msg] (optional) custom error message
   * @param {Function} [ssfi] (optional) starting point for removing stack frames
   * @param {boolean} [lockSsfi] (optional) whether or not the ssfi flag is locked
   */
  constructor(obj, msg, ssfi, lockSsfi) {
    /** @type {{}} */
    __publicField(this, "__flags", {});
    flag(this, "ssfi", ssfi || _Assertion);
    flag(this, "lockSsfi", lockSsfi);
    flag(this, "object", obj);
    flag(this, "message", msg);
    flag(this, "eql", config.deepEqual || deep_eql_default);
    return proxify(this);
  }
  /** @returns {boolean} */
  static get includeStack() {
    console.warn(
      "Assertion.includeStack is deprecated, use chai.config.includeStack instead."
    );
    return config.includeStack;
  }
  /** @param {boolean} value */
  static set includeStack(value) {
    console.warn(
      "Assertion.includeStack is deprecated, use chai.config.includeStack instead."
    );
    config.includeStack = value;
  }
  /** @returns {boolean} */
  static get showDiff() {
    console.warn(
      "Assertion.showDiff is deprecated, use chai.config.showDiff instead."
    );
    return config.showDiff;
  }
  /** @param {boolean} value */
  static set showDiff(value) {
    console.warn(
      "Assertion.showDiff is deprecated, use chai.config.showDiff instead."
    );
    config.showDiff = value;
  }
  /**
   * @param {string} name
   * @param {Function} fn
   */
  static addProperty(name, fn) {
    addProperty(this.prototype, name, fn);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   */
  static addMethod(name, fn) {
    addMethod(this.prototype, name, fn);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   * @param {Function} chainingBehavior
   */
  static addChainableMethod(name, fn, chainingBehavior) {
    addChainableMethod(this.prototype, name, fn, chainingBehavior);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   */
  static overwriteProperty(name, fn) {
    overwriteProperty(this.prototype, name, fn);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   */
  static overwriteMethod(name, fn) {
    overwriteMethod(this.prototype, name, fn);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   * @param {Function} chainingBehavior
   */
  static overwriteChainableMethod(name, fn, chainingBehavior) {
    overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
  }
  /**
   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
   *
   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
   *
   * @name assert
   * @param {unknown} _expr to be tested
   * @param {string | Function} msg or function that returns message to display if expression fails
   * @param {string | Function} _negateMsg or function that returns negatedMessage to display if negated expression fails
   * @param {unknown} expected value (remember to check for negation)
   * @param {unknown} _actual (optional) will default to `this.obj`
   * @param {boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
   * @returns {void}
   */
  assert(_expr, msg, _negateMsg, expected, _actual, showDiff) {
    const ok = test$2(this, arguments);
    if (false !== showDiff) showDiff = true;
    if (void 0 === expected && void 0 === _actual) showDiff = false;
    if (true !== config.showDiff) showDiff = false;
    if (!ok) {
      msg = getMessage2(this, arguments);
      const actual = getActual(this, arguments);
      const assertionErrorObjectProperties = {
        actual,
        expected,
        showDiff
      };
      const operator = getOperator(this, arguments);
      if (operator) {
        assertionErrorObjectProperties.operator = operator;
      }
      throw new AssertionError(
        msg,
        assertionErrorObjectProperties,
        // @ts-expect-error Not sure what to do about these types yet
        config.includeStack ? this.assert : flag(this, "ssfi")
      );
    }
  }
  /**
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @returns {unknown}
   */
  get _obj() {
    return flag(this, "object");
  }
  /**
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @param {unknown} val
   */
  set _obj(val) {
    flag(this, "object", val);
  }
};
__name(_Assertion, "Assertion");
var Assertion = _Assertion;

// lib/chai/utils/events.js
var events = new EventTarget();
var _PluginEvent = class _PluginEvent extends Event {
  constructor(type3, name, fn) {
    super(type3);
    this.name = String(name);
    this.fn = fn;
  }
};
__name(_PluginEvent, "PluginEvent");
var PluginEvent = _PluginEvent;

// lib/chai/utils/isProxyEnabled.js
function isProxyEnabled() {
  return config.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
}
__name(isProxyEnabled, "isProxyEnabled");

// lib/chai/utils/addProperty.js
function addProperty(ctx, name, getter) {
  getter = getter === void 0 ? function() {
  } : getter;
  Object.defineProperty(ctx, name, {
    get: /* @__PURE__ */ __name(function propertyGetter() {
      if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
        flag(this, "ssfi", propertyGetter);
      }
      let result = getter.call(this);
      if (result !== void 0) return result;
      let newAssertion = new Assertion();
      transferFlags(this, newAssertion);
      return newAssertion;
    }, "propertyGetter"),
    configurable: true
  });
  events.dispatchEvent(new PluginEvent("addProperty", name, getter));
}
__name(addProperty, "addProperty");

// lib/chai/utils/addLengthGuard.js
var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {
}, "length");
function addLengthGuard(fn, assertionName, isChainable) {
  if (!fnLengthDesc.configurable) return fn;
  Object.defineProperty(fn, "length", {
    get: /* @__PURE__ */ __name(function() {
      if (isChainable) {
        throw Error(
          "Invalid Chai property: " + assertionName + '.length. Due to a compatibility issue, "length" cannot directly follow "' + assertionName + '". Use "' + assertionName + '.lengthOf" instead.'
        );
      }
      throw Error(
        "Invalid Chai property: " + assertionName + '.length. See docs for proper usage of "' + assertionName + '".'
      );
    }, "get")
  });
  return fn;
}
__name(addLengthGuard, "addLengthGuard");

// lib/chai/utils/getProperties.js
function getProperties(object) {
  let result = Object.getOwnPropertyNames(object);
  function addProperty2(property) {
    if (result.indexOf(property) === -1) {
      result.push(property);
    }
  }
  __name(addProperty2, "addProperty");
  let proto = Object.getPrototypeOf(object);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(addProperty2);
    proto = Object.getPrototypeOf(proto);
  }
  return result;
}
__name(getProperties, "getProperties");

// lib/chai/utils/proxify.js
var builtins = ["__flags", "__methods", "_obj", "assert"];
function proxify(obj, nonChainableMethodName) {
  if (!isProxyEnabled()) return obj;
  return new Proxy(obj, {
    get: /* @__PURE__ */ __name(function proxyGetter(target, property) {
      if (typeof property === "string" && config.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
        if (nonChainableMethodName) {
          throw Error(
            "Invalid Chai property: " + nonChainableMethodName + "." + property + '. See docs for proper usage of "' + nonChainableMethodName + '".'
          );
        }
        let suggestion = null;
        let suggestionDistance = 4;
        getProperties(target).forEach(function(prop) {
          if (
            // we actually mean to check `Object.prototype` here
            // eslint-disable-next-line no-prototype-builtins
            !Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1
          ) {
            let dist = stringDistanceCapped(property, prop, suggestionDistance);
            if (dist < suggestionDistance) {
              suggestion = prop;
              suggestionDistance = dist;
            }
          }
        });
        if (suggestion !== null) {
          throw Error(
            "Invalid Chai property: " + property + '. Did you mean "' + suggestion + '"?'
          );
        } else {
          throw Error("Invalid Chai property: " + property);
        }
      }
      if (builtins.indexOf(property) === -1 && !flag(target, "lockSsfi")) {
        flag(target, "ssfi", proxyGetter);
      }
      return Reflect.get(target, property);
    }, "proxyGetter")
  });
}
__name(proxify, "proxify");
function stringDistanceCapped(strA, strB, cap) {
  if (Math.abs(strA.length - strB.length) >= cap) {
    return cap;
  }
  let memo = [];
  for (let i = 0; i <= strA.length; i++) {
    memo[i] = Array(strB.length + 1).fill(0);
    memo[i][0] = i;
  }
  for (let j = 0; j < strB.length; j++) {
    memo[0][j] = j;
  }
  for (let i = 1; i <= strA.length; i++) {
    let ch = strA.charCodeAt(i - 1);
    for (let j = 1; j <= strB.length; j++) {
      if (Math.abs(i - j) >= cap) {
        memo[i][j] = cap;
        continue;
      }
      memo[i][j] = Math.min(
        memo[i - 1][j] + 1,
        memo[i][j - 1] + 1,
        memo[i - 1][j - 1] + (ch === strB.charCodeAt(j - 1) ? 0 : 1)
      );
    }
  }
  return memo[strA.length][strB.length];
}
__name(stringDistanceCapped, "stringDistanceCapped");

// lib/chai/utils/addMethod.js
function addMethod(ctx, name, method) {
  let methodWrapper = /* @__PURE__ */ __name(function() {
    if (!flag(this, "lockSsfi")) {
      flag(this, "ssfi", methodWrapper);
    }
    let result = method.apply(this, arguments);
    if (result !== void 0) return result;
    let newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "methodWrapper");
  addLengthGuard(methodWrapper, name, false);
  ctx[name] = proxify(methodWrapper, name);
  events.dispatchEvent(new PluginEvent("addMethod", name, method));
}
__name(addMethod, "addMethod");

// lib/chai/utils/overwriteProperty.js
function overwriteProperty(ctx, name, getter) {
  let _get = Object.getOwnPropertyDescriptor(ctx, name), _super = /* @__PURE__ */ __name(function() {
  }, "_super");
  if (_get && "function" === typeof _get.get) _super = _get.get;
  Object.defineProperty(ctx, name, {
    get: /* @__PURE__ */ __name(function overwritingPropertyGetter() {
      if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
        flag(this, "ssfi", overwritingPropertyGetter);
      }
      let origLockSsfi = flag(this, "lockSsfi");
      flag(this, "lockSsfi", true);
      let result = getter(_super).call(this);
      flag(this, "lockSsfi", origLockSsfi);
      if (result !== void 0) {
        return result;
      }
      let newAssertion = new Assertion();
      transferFlags(this, newAssertion);
      return newAssertion;
    }, "overwritingPropertyGetter"),
    configurable: true
  });
}
__name(overwriteProperty, "overwriteProperty");

// lib/chai/utils/overwriteMethod.js
function overwriteMethod(ctx, name, method) {
  let _method = ctx[name], _super = /* @__PURE__ */ __name(function() {
    throw new Error(name + " is not a function");
  }, "_super");
  if (_method && "function" === typeof _method) _super = _method;
  let overwritingMethodWrapper = /* @__PURE__ */ __name(function() {
    if (!flag(this, "lockSsfi")) {
      flag(this, "ssfi", overwritingMethodWrapper);
    }
    let origLockSsfi = flag(this, "lockSsfi");
    flag(this, "lockSsfi", true);
    let result = method(_super).apply(this, arguments);
    flag(this, "lockSsfi", origLockSsfi);
    if (result !== void 0) {
      return result;
    }
    let newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "overwritingMethodWrapper");
  addLengthGuard(overwritingMethodWrapper, name, false);
  ctx[name] = proxify(overwritingMethodWrapper, name);
}
__name(overwriteMethod, "overwriteMethod");

// lib/chai/utils/addChainableMethod.js
var canSetPrototype = typeof Object.setPrototypeOf === "function";
var testFn = /* @__PURE__ */ __name(function() {
}, "testFn");
var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
  let propDesc = Object.getOwnPropertyDescriptor(testFn, name);
  if (typeof propDesc !== "object") return true;
  return !propDesc.configurable;
});
var call = Function.prototype.call;
var apply = Function.prototype.apply;
var _PluginAddChainableMethodEvent = class _PluginAddChainableMethodEvent extends PluginEvent {
  constructor(type3, name, fn, chainingBehavior) {
    super(type3, name, fn);
    this.chainingBehavior = chainingBehavior;
  }
};
__name(_PluginAddChainableMethodEvent, "PluginAddChainableMethodEvent");
var PluginAddChainableMethodEvent = _PluginAddChainableMethodEvent;
function addChainableMethod(ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== "function") {
    chainingBehavior = /* @__PURE__ */ __name(function() {
    }, "chainingBehavior");
  }
  let chainableBehavior = {
    method,
    chainingBehavior
  };
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;
  Object.defineProperty(ctx, name, {
    get: /* @__PURE__ */ __name(function chainableMethodGetter() {
      chainableBehavior.chainingBehavior.call(this);
      let chainableMethodWrapper = /* @__PURE__ */ __name(function() {
        if (!flag(this, "lockSsfi")) {
          flag(this, "ssfi", chainableMethodWrapper);
        }
        let result = chainableBehavior.method.apply(this, arguments);
        if (result !== void 0) {
          return result;
        }
        let newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      }, "chainableMethodWrapper");
      addLengthGuard(chainableMethodWrapper, name, true);
      if (canSetPrototype) {
        let prototype = Object.create(this);
        prototype.call = call;
        prototype.apply = apply;
        Object.setPrototypeOf(chainableMethodWrapper, prototype);
      } else {
        let asserterNames = Object.getOwnPropertyNames(ctx);
        asserterNames.forEach(function(asserterName) {
          if (excludeNames.indexOf(asserterName) !== -1) {
            return;
          }
          let pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
          Object.defineProperty(chainableMethodWrapper, asserterName, pd);
        });
      }
      transferFlags(this, chainableMethodWrapper);
      return proxify(chainableMethodWrapper);
    }, "chainableMethodGetter"),
    configurable: true
  });
  events.dispatchEvent(
    new PluginAddChainableMethodEvent(
      "addChainableMethod",
      name,
      method,
      chainingBehavior
    )
  );
}
__name(addChainableMethod, "addChainableMethod");

// lib/chai/utils/overwriteChainableMethod.js
function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
  let chainableBehavior = ctx.__methods[name];
  let _chainingBehavior = chainableBehavior.chainingBehavior;
  chainableBehavior.chainingBehavior = /* @__PURE__ */ __name(function overwritingChainableMethodGetter() {
    let result = chainingBehavior(_chainingBehavior).call(this);
    if (result !== void 0) {
      return result;
    }
    let newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "overwritingChainableMethodGetter");
  let _method = chainableBehavior.method;
  chainableBehavior.method = /* @__PURE__ */ __name(function overwritingChainableMethodWrapper() {
    let result = method(_method).apply(this, arguments);
    if (result !== void 0) {
      return result;
    }
    let newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "overwritingChainableMethodWrapper");
}
__name(overwriteChainableMethod, "overwriteChainableMethod");

// lib/chai/utils/compareByInspect.js
function compareByInspect(a, b) {
  return inspect2(a) < inspect2(b) ? -1 : 1;
}
__name(compareByInspect, "compareByInspect");

// lib/chai/utils/getOwnEnumerablePropertySymbols.js
function getOwnEnumerablePropertySymbols(obj) {
  if (typeof Object.getOwnPropertySymbols !== "function") return [];
  return Object.getOwnPropertySymbols(obj).filter(function(sym) {
    return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
  });
}
__name(getOwnEnumerablePropertySymbols, "getOwnEnumerablePropertySymbols");

// lib/chai/utils/getOwnEnumerableProperties.js
function getOwnEnumerableProperties(obj) {
  return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
}
__name(getOwnEnumerableProperties, "getOwnEnumerableProperties");

// lib/chai/utils/isNaN.js
var isNaN2 = Number.isNaN;

// lib/chai/utils/getOperator.js
function isObjectType(obj) {
  let objectType = type(obj);
  let objectTypes = ["Array", "Object", "Function"];
  return objectTypes.indexOf(objectType) !== -1;
}
__name(isObjectType, "isObjectType");
function getOperator(obj, args) {
  let operator = flag(obj, "operator");
  let negate = flag(obj, "negate");
  let expected = args[3];
  let msg = negate ? args[2] : args[1];
  if (operator) {
    return operator;
  }
  if (typeof msg === "function") msg = msg();
  msg = msg || "";
  if (!msg) {
    return void 0;
  }
  if (/\shave\s/.test(msg)) {
    return void 0;
  }
  let isObject = isObjectType(expected);
  if (/\snot\s/.test(msg)) {
    return isObject ? "notDeepStrictEqual" : "notStrictEqual";
  }
  return isObject ? "deepStrictEqual" : "strictEqual";
}
__name(getOperator, "getOperator");

// lib/chai/utils/index.js
function getName(fn) {
  return fn.name;
}
__name(getName, "getName");
function isRegExp2(obj) {
  return Object.prototype.toString.call(obj) === "[object RegExp]";
}
__name(isRegExp2, "isRegExp");
function isNumeric(obj) {
  return ["Number", "BigInt"].includes(type(obj));
}
__name(isNumeric, "isNumeric");

// lib/chai/core/assertions.js
var { flag: flag2 } = utils_exports;
[
  "to",
  "be",
  "been",
  "is",
  "and",
  "has",
  "have",
  "with",
  "that",
  "which",
  "at",
  "of",
  "same",
  "but",
  "does",
  "still",
  "also"
].forEach(function(chain) {
  Assertion.addProperty(chain);
});
Assertion.addProperty("not", function() {
  flag2(this, "negate", true);
});
Assertion.addProperty("deep", function() {
  flag2(this, "deep", true);
});
Assertion.addProperty("nested", function() {
  flag2(this, "nested", true);
});
Assertion.addProperty("own", function() {
  flag2(this, "own", true);
});
Assertion.addProperty("ordered", function() {
  flag2(this, "ordered", true);
});
Assertion.addProperty("any", function() {
  flag2(this, "any", true);
  flag2(this, "all", false);
});
Assertion.addProperty("all", function() {
  flag2(this, "all", true);
  flag2(this, "any", false);
});
var functionTypes = {
  function: [
    "function",
    "asyncfunction",
    "generatorfunction",
    "asyncgeneratorfunction"
  ],
  asyncfunction: ["asyncfunction", "asyncgeneratorfunction"],
  generatorfunction: ["generatorfunction", "asyncgeneratorfunction"],
  asyncgeneratorfunction: ["asyncgeneratorfunction"]
};
function an(type3, msg) {
  if (msg) flag2(this, "message", msg);
  type3 = type3.toLowerCase();
  let obj = flag2(this, "object"), article = ~["a", "e", "i", "o", "u"].indexOf(type3.charAt(0)) ? "an " : "a ";
  const detectedType = type(obj).toLowerCase();
  if (functionTypes["function"].includes(type3)) {
    this.assert(
      functionTypes[type3].includes(detectedType),
      "expected #{this} to be " + article + type3,
      "expected #{this} not to be " + article + type3
    );
  } else {
    this.assert(
      type3 === detectedType,
      "expected #{this} to be " + article + type3,
      "expected #{this} not to be " + article + type3
    );
  }
}
__name(an, "an");
Assertion.addChainableMethod("an", an);
Assertion.addChainableMethod("a", an);
function SameValueZero(a, b) {
  return isNaN2(a) && isNaN2(b) || a === b;
}
__name(SameValueZero, "SameValueZero");
function includeChainingBehavior() {
  flag2(this, "contains", true);
}
__name(includeChainingBehavior, "includeChainingBehavior");
function include(val, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), objType = type(obj).toLowerCase(), flagMsg = flag2(this, "message"), negate = flag2(this, "negate"), ssfi = flag2(this, "ssfi"), isDeep = flag2(this, "deep"), descriptor = isDeep ? "deep " : "", isEql = isDeep ? flag2(this, "eql") : SameValueZero;
  flagMsg = flagMsg ? flagMsg + ": " : "";
  let included = false;
  switch (objType) {
    case "string":
      included = obj.indexOf(val) !== -1;
      break;
    case "weakset":
      if (isDeep) {
        throw new AssertionError(
          flagMsg + "unable to use .deep.include with WeakSet",
          void 0,
          ssfi
        );
      }
      included = obj.has(val);
      break;
    case "map":
      obj.forEach(function(item) {
        included = included || isEql(item, val);
      });
      break;
    case "set":
      if (isDeep) {
        obj.forEach(function(item) {
          included = included || isEql(item, val);
        });
      } else {
        included = obj.has(val);
      }
      break;
    case "array":
      if (isDeep) {
        included = obj.some(function(item) {
          return isEql(item, val);
        });
      } else {
        included = obj.indexOf(val) !== -1;
      }
      break;
    default: {
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg + "the given combination of arguments (" + objType + " and " + type(val).toLowerCase() + ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " + type(val).toLowerCase(),
          void 0,
          ssfi
        );
      }
      let props = Object.keys(val);
      let firstErr = null;
      let numErrs = 0;
      props.forEach(function(prop) {
        let propAssertion = new Assertion(obj);
        transferFlags(this, propAssertion, true);
        flag2(propAssertion, "lockSsfi", true);
        if (!negate || props.length === 1) {
          propAssertion.property(prop, val[prop]);
          return;
        }
        try {
          propAssertion.property(prop, val[prop]);
        } catch (err) {
          if (!check_error_exports.compatibleConstructor(err, AssertionError)) {
            throw err;
          }
          if (firstErr === null) firstErr = err;
          numErrs++;
        }
      }, this);
      if (negate && props.length > 1 && numErrs === props.length) {
        throw firstErr;
      }
      return;
    }
  }
  this.assert(
    included,
    "expected #{this} to " + descriptor + "include " + inspect2(val),
    "expected #{this} to not " + descriptor + "include " + inspect2(val)
  );
}
__name(include, "include");
Assertion.addChainableMethod("include", include, includeChainingBehavior);
Assertion.addChainableMethod("contain", include, includeChainingBehavior);
Assertion.addChainableMethod("contains", include, includeChainingBehavior);
Assertion.addChainableMethod("includes", include, includeChainingBehavior);
Assertion.addProperty("ok", function() {
  this.assert(
    flag2(this, "object"),
    "expected #{this} to be truthy",
    "expected #{this} to be falsy"
  );
});
Assertion.addProperty("true", function() {
  this.assert(
    true === flag2(this, "object"),
    "expected #{this} to be true",
    "expected #{this} to be false",
    flag2(this, "negate") ? false : true
  );
});
Assertion.addProperty("numeric", function() {
  const object = flag2(this, "object");
  this.assert(
    ["Number", "BigInt"].includes(type(object)),
    "expected #{this} to be numeric",
    "expected #{this} to not be numeric",
    flag2(this, "negate") ? false : true
  );
});
Assertion.addProperty("callable", function() {
  const val = flag2(this, "object");
  const ssfi = flag2(this, "ssfi");
  const message = flag2(this, "message");
  const msg = message ? `${message}: ` : "";
  const negate = flag2(this, "negate");
  const assertionMessage = negate ? `${msg}expected ${inspect2(val)} not to be a callable function` : `${msg}expected ${inspect2(val)} to be a callable function`;
  const isCallable = [
    "Function",
    "AsyncFunction",
    "GeneratorFunction",
    "AsyncGeneratorFunction"
  ].includes(type(val));
  if (isCallable && negate || !isCallable && !negate) {
    throw new AssertionError(assertionMessage, void 0, ssfi);
  }
});
Assertion.addProperty("false", function() {
  this.assert(
    false === flag2(this, "object"),
    "expected #{this} to be false",
    "expected #{this} to be true",
    flag2(this, "negate") ? true : false
  );
});
Assertion.addProperty("null", function() {
  this.assert(
    null === flag2(this, "object"),
    "expected #{this} to be null",
    "expected #{this} not to be null"
  );
});
Assertion.addProperty("undefined", function() {
  this.assert(
    void 0 === flag2(this, "object"),
    "expected #{this} to be undefined",
    "expected #{this} not to be undefined"
  );
});
Assertion.addProperty("NaN", function() {
  this.assert(
    isNaN2(flag2(this, "object")),
    "expected #{this} to be NaN",
    "expected #{this} not to be NaN"
  );
});
function assertExist() {
  let val = flag2(this, "object");
  this.assert(
    val !== null && val !== void 0,
    "expected #{this} to exist",
    "expected #{this} to not exist"
  );
}
__name(assertExist, "assertExist");
Assertion.addProperty("exist", assertExist);
Assertion.addProperty("exists", assertExist);
Assertion.addProperty("empty", function() {
  let val = flag2(this, "object"), ssfi = flag2(this, "ssfi"), flagMsg = flag2(this, "message"), itemsCount;
  flagMsg = flagMsg ? flagMsg + ": " : "";
  switch (type(val).toLowerCase()) {
    case "array":
    case "string":
      itemsCount = val.length;
      break;
    case "map":
    case "set":
      itemsCount = val.size;
      break;
    case "weakmap":
    case "weakset":
      throw new AssertionError(
        flagMsg + ".empty was passed a weak collection",
        void 0,
        ssfi
      );
    case "function": {
      const msg = flagMsg + ".empty was passed a function " + getName(val);
      throw new AssertionError(msg.trim(), void 0, ssfi);
    }
    default:
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg + ".empty was passed non-string primitive " + inspect2(val),
          void 0,
          ssfi
        );
      }
      itemsCount = Object.keys(val).length;
  }
  this.assert(
    0 === itemsCount,
    "expected #{this} to be empty",
    "expected #{this} not to be empty"
  );
});
function checkArguments() {
  let obj = flag2(this, "object"), type3 = type(obj);
  this.assert(
    "Arguments" === type3,
    "expected #{this} to be arguments but got " + type3,
    "expected #{this} to not be arguments"
  );
}
__name(checkArguments, "checkArguments");
Assertion.addProperty("arguments", checkArguments);
Assertion.addProperty("Arguments", checkArguments);
function assertEqual(val, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  if (flag2(this, "deep")) {
    let prevLockSsfi = flag2(this, "lockSsfi");
    flag2(this, "lockSsfi", true);
    this.eql(val);
    flag2(this, "lockSsfi", prevLockSsfi);
  } else {
    this.assert(
      val === obj,
      "expected #{this} to equal #{exp}",
      "expected #{this} to not equal #{exp}",
      val,
      this._obj,
      true
    );
  }
}
__name(assertEqual, "assertEqual");
Assertion.addMethod("equal", assertEqual);
Assertion.addMethod("equals", assertEqual);
Assertion.addMethod("eq", assertEqual);
function assertEql(obj, msg) {
  if (msg) flag2(this, "message", msg);
  let eql = flag2(this, "eql");
  this.assert(
    eql(obj, flag2(this, "object")),
    "expected #{this} to deeply equal #{exp}",
    "expected #{this} to not deeply equal #{exp}",
    obj,
    this._obj,
    true
  );
}
__name(assertEql, "assertEql");
Assertion.addMethod("eql", assertEql);
Assertion.addMethod("eqls", assertEql);
function assertAbove(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase();
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && nType !== "date") {
    throw new AssertionError(
      msgPrefix + "the argument to above must be a date",
      void 0,
      ssfi
    );
  } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
    throw new AssertionError(
      msgPrefix + "the argument to above must be a number",
      void 0,
      ssfi
    );
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    throw new AssertionError(
      msgPrefix + "expected " + printObj + " to be a number or a date",
      void 0,
      ssfi
    );
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount > n,
      "expected #{this} to have a " + descriptor + " above #{exp} but got #{act}",
      "expected #{this} to not have a " + descriptor + " above #{exp}",
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj > n,
      "expected #{this} to be above #{exp}",
      "expected #{this} to be at most #{exp}",
      n
    );
  }
}
__name(assertAbove, "assertAbove");
Assertion.addMethod("above", assertAbove);
Assertion.addMethod("gt", assertAbove);
Assertion.addMethod("greaterThan", assertAbove);
function assertLeast(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && nType !== "date") {
    errorMessage = msgPrefix + "the argument to least must be a date";
  } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
    errorMessage = msgPrefix + "the argument to least must be a number";
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount >= n,
      "expected #{this} to have a " + descriptor + " at least #{exp} but got #{act}",
      "expected #{this} to have a " + descriptor + " below #{exp}",
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj >= n,
      "expected #{this} to be at least #{exp}",
      "expected #{this} to be below #{exp}",
      n
    );
  }
}
__name(assertLeast, "assertLeast");
Assertion.addMethod("least", assertLeast);
Assertion.addMethod("gte", assertLeast);
Assertion.addMethod("greaterThanOrEqual", assertLeast);
function assertBelow(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && nType !== "date") {
    errorMessage = msgPrefix + "the argument to below must be a date";
  } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
    errorMessage = msgPrefix + "the argument to below must be a number";
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount < n,
      "expected #{this} to have a " + descriptor + " below #{exp} but got #{act}",
      "expected #{this} to not have a " + descriptor + " below #{exp}",
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj < n,
      "expected #{this} to be below #{exp}",
      "expected #{this} to be at least #{exp}",
      n
    );
  }
}
__name(assertBelow, "assertBelow");
Assertion.addMethod("below", assertBelow);
Assertion.addMethod("lt", assertBelow);
Assertion.addMethod("lessThan", assertBelow);
function assertMost(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && nType !== "date") {
    errorMessage = msgPrefix + "the argument to most must be a date";
  } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
    errorMessage = msgPrefix + "the argument to most must be a number";
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount <= n,
      "expected #{this} to have a " + descriptor + " at most #{exp} but got #{act}",
      "expected #{this} to have a " + descriptor + " above #{exp}",
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj <= n,
      "expected #{this} to be at most #{exp}",
      "expected #{this} to be above #{exp}",
      n
    );
  }
}
__name(assertMost, "assertMost");
Assertion.addMethod("most", assertMost);
Assertion.addMethod("lte", assertMost);
Assertion.addMethod("lessThanOrEqual", assertMost);
Assertion.addMethod("within", function(start, finish, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), startType = type(start).toLowerCase(), finishType = type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toISOString() + ".." + finish.toISOString() : start + ".." + finish;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && (startType !== "date" || finishType !== "date")) {
    errorMessage = msgPrefix + "the arguments to within must be dates";
  } else if ((!isNumeric(start) || !isNumeric(finish)) && (doLength || isNumeric(obj))) {
    errorMessage = msgPrefix + "the arguments to within must be numbers";
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount >= start && itemsCount <= finish,
      "expected #{this} to have a " + descriptor + " within " + range,
      "expected #{this} to not have a " + descriptor + " within " + range
    );
  } else {
    this.assert(
      obj >= start && obj <= finish,
      "expected #{this} to be within " + range,
      "expected #{this} to not be within " + range
    );
  }
});
function assertInstanceOf(constructor, msg) {
  if (msg) flag2(this, "message", msg);
  let target = flag2(this, "object");
  let ssfi = flag2(this, "ssfi");
  let flagMsg = flag2(this, "message");
  let isInstanceOf;
  try {
    isInstanceOf = target instanceof constructor;
  } catch (err) {
    if (err instanceof TypeError) {
      flagMsg = flagMsg ? flagMsg + ": " : "";
      throw new AssertionError(
        flagMsg + "The instanceof assertion needs a constructor but " + type(constructor) + " was given.",
        void 0,
        ssfi
      );
    }
    throw err;
  }
  let name = getName(constructor);
  if (name == null) {
    name = "an unnamed constructor";
  }
  this.assert(
    isInstanceOf,
    "expected #{this} to be an instance of " + name,
    "expected #{this} to not be an instance of " + name
  );
}
__name(assertInstanceOf, "assertInstanceOf");
Assertion.addMethod("instanceof", assertInstanceOf);
Assertion.addMethod("instanceOf", assertInstanceOf);
function assertProperty(name, val, msg) {
  if (msg) flag2(this, "message", msg);
  let isNested = flag2(this, "nested"), isOwn = flag2(this, "own"), flagMsg = flag2(this, "message"), obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), nameType = typeof name;
  flagMsg = flagMsg ? flagMsg + ": " : "";
  if (isNested) {
    if (nameType !== "string") {
      throw new AssertionError(
        flagMsg + "the argument to property must be a string when using nested syntax",
        void 0,
        ssfi
      );
    }
  } else {
    if (nameType !== "string" && nameType !== "number" && nameType !== "symbol") {
      throw new AssertionError(
        flagMsg + "the argument to property must be a string, number, or symbol",
        void 0,
        ssfi
      );
    }
  }
  if (isNested && isOwn) {
    throw new AssertionError(
      flagMsg + 'The "nested" and "own" flags cannot be combined.',
      void 0,
      ssfi
    );
  }
  if (obj === null || obj === void 0) {
    throw new AssertionError(
      flagMsg + "Target cannot be null or undefined.",
      void 0,
      ssfi
    );
  }
  let isDeep = flag2(this, "deep"), negate = flag2(this, "negate"), pathInfo = isNested ? getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name], isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
  let descriptor = "";
  if (isDeep) descriptor += "deep ";
  if (isOwn) descriptor += "own ";
  if (isNested) descriptor += "nested ";
  descriptor += "property ";
  let hasProperty2;
  if (isOwn) hasProperty2 = Object.prototype.hasOwnProperty.call(obj, name);
  else if (isNested) hasProperty2 = pathInfo.exists;
  else hasProperty2 = hasProperty(obj, name);
  if (!negate || arguments.length === 1) {
    this.assert(
      hasProperty2,
      "expected #{this} to have " + descriptor + inspect2(name),
      "expected #{this} to not have " + descriptor + inspect2(name)
    );
  }
  if (arguments.length > 1) {
    this.assert(
      hasProperty2 && isEql(val, value),
      "expected #{this} to have " + descriptor + inspect2(name) + " of #{exp}, but got #{act}",
      "expected #{this} to not have " + descriptor + inspect2(name) + " of #{act}",
      val,
      value
    );
  }
  flag2(this, "object", value);
}
__name(assertProperty, "assertProperty");
Assertion.addMethod("property", assertProperty);
function assertOwnProperty(_name, _value, _msg) {
  flag2(this, "own", true);
  assertProperty.apply(this, arguments);
}
__name(assertOwnProperty, "assertOwnProperty");
Assertion.addMethod("ownProperty", assertOwnProperty);
Assertion.addMethod("haveOwnProperty", assertOwnProperty);
function assertOwnPropertyDescriptor(name, descriptor, msg) {
  if (typeof descriptor === "string") {
    msg = descriptor;
    descriptor = null;
  }
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  let actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
  let eql = flag2(this, "eql");
  if (actualDescriptor && descriptor) {
    this.assert(
      eql(descriptor, actualDescriptor),
      "expected the own property descriptor for " + inspect2(name) + " on #{this} to match " + inspect2(descriptor) + ", got " + inspect2(actualDescriptor),
      "expected the own property descriptor for " + inspect2(name) + " on #{this} to not match " + inspect2(descriptor),
      descriptor,
      actualDescriptor,
      true
    );
  } else {
    this.assert(
      actualDescriptor,
      "expected #{this} to have an own property descriptor for " + inspect2(name),
      "expected #{this} to not have an own property descriptor for " + inspect2(name)
    );
  }
  flag2(this, "object", actualDescriptor);
}
__name(assertOwnPropertyDescriptor, "assertOwnPropertyDescriptor");
Assertion.addMethod("ownPropertyDescriptor", assertOwnPropertyDescriptor);
Assertion.addMethod("haveOwnPropertyDescriptor", assertOwnPropertyDescriptor);
function assertLengthChain() {
  flag2(this, "doLength", true);
}
__name(assertLengthChain, "assertLengthChain");
function assertLength(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), objType = type(obj).toLowerCase(), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), descriptor = "length", itemsCount;
  switch (objType) {
    case "map":
    case "set":
      descriptor = "size";
      itemsCount = obj.size;
      break;
    default:
      new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
      itemsCount = obj.length;
  }
  this.assert(
    itemsCount == n,
    "expected #{this} to have a " + descriptor + " of #{exp} but got #{act}",
    "expected #{this} to not have a " + descriptor + " of #{act}",
    n,
    itemsCount
  );
}
__name(assertLength, "assertLength");
Assertion.addChainableMethod("length", assertLength, assertLengthChain);
Assertion.addChainableMethod("lengthOf", assertLength, assertLengthChain);
function assertMatch(re, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  this.assert(
    re.exec(obj),
    "expected #{this} to match " + re,
    "expected #{this} not to match " + re
  );
}
__name(assertMatch, "assertMatch");
Assertion.addMethod("match", assertMatch);
Assertion.addMethod("matches", assertMatch);
Assertion.addMethod("string", function(str, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).is.a("string");
  this.assert(
    ~obj.indexOf(str),
    "expected #{this} to contain " + inspect2(str),
    "expected #{this} to not contain " + inspect2(str)
  );
});
function assertKeys(keys) {
  let obj = flag2(this, "object"), objType = type(obj), keysType = type(keys), ssfi = flag2(this, "ssfi"), isDeep = flag2(this, "deep"), str, deepStr = "", actual, ok = true, flagMsg = flag2(this, "message");
  flagMsg = flagMsg ? flagMsg + ": " : "";
  let mixedArgsMsg = flagMsg + "when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";
  if (objType === "Map" || objType === "Set") {
    deepStr = isDeep ? "deeply " : "";
    actual = [];
    obj.forEach(function(val, key) {
      actual.push(key);
    });
    if (keysType !== "Array") {
      keys = Array.prototype.slice.call(arguments);
    }
  } else {
    actual = getOwnEnumerableProperties(obj);
    switch (keysType) {
      case "Array":
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, void 0, ssfi);
        }
        break;
      case "Object":
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, void 0, ssfi);
        }
        keys = Object.keys(keys);
        break;
      default:
        keys = Array.prototype.slice.call(arguments);
    }
    keys = keys.map(function(val) {
      return typeof val === "symbol" ? val : String(val);
    });
  }
  if (!keys.length) {
    throw new AssertionError(flagMsg + "keys required", void 0, ssfi);
  }
  let len = keys.length, any = flag2(this, "any"), all = flag2(this, "all"), expected = keys, isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
  if (!any && !all) {
    all = true;
  }
  if (any) {
    ok = expected.some(function(expectedKey) {
      return actual.some(function(actualKey) {
        return isEql(expectedKey, actualKey);
      });
    });
  }
  if (all) {
    ok = expected.every(function(expectedKey) {
      return actual.some(function(actualKey) {
        return isEql(expectedKey, actualKey);
      });
    });
    if (!flag2(this, "contains")) {
      ok = ok && keys.length == actual.length;
    }
  }
  if (len > 1) {
    keys = keys.map(function(key) {
      return inspect2(key);
    });
    let last = keys.pop();
    if (all) {
      str = keys.join(", ") + ", and " + last;
    }
    if (any) {
      str = keys.join(", ") + ", or " + last;
    }
  } else {
    str = inspect2(keys[0]);
  }
  str = (len > 1 ? "keys " : "key ") + str;
  str = (flag2(this, "contains") ? "contain " : "have ") + str;
  this.assert(
    ok,
    "expected #{this} to " + deepStr + str,
    "expected #{this} to not " + deepStr + str,
    expected.slice(0).sort(compareByInspect),
    actual.sort(compareByInspect),
    true
  );
}
__name(assertKeys, "assertKeys");
Assertion.addMethod("keys", assertKeys);
Assertion.addMethod("key", assertKeys);
function assertThrows(errorLike, errMsgMatcher, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), flagMsg = flag2(this, "message"), negate = flag2(this, "negate") || false;
  new Assertion(obj, flagMsg, ssfi, true).is.a("function");
  if (isRegExp2(errorLike) || typeof errorLike === "string") {
    errMsgMatcher = errorLike;
    errorLike = null;
  }
  let caughtErr;
  let errorWasThrown = false;
  try {
    obj();
  } catch (err) {
    errorWasThrown = true;
    caughtErr = err;
  }
  let everyArgIsUndefined = errorLike === void 0 && errMsgMatcher === void 0;
  let everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
  let errorLikeFail = false;
  let errMsgMatcherFail = false;
  if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
    let errorLikeString = "an error";
    if (errorLike instanceof Error) {
      errorLikeString = "#{exp}";
    } else if (errorLike) {
      errorLikeString = check_error_exports.getConstructorName(errorLike);
    }
    let actual = caughtErr;
    if (caughtErr instanceof Error) {
      actual = caughtErr.toString();
    } else if (typeof caughtErr === "string") {
      actual = caughtErr;
    } else if (caughtErr && (typeof caughtErr === "object" || typeof caughtErr === "function")) {
      try {
        actual = check_error_exports.getConstructorName(caughtErr);
      } catch (_err) {
      }
    }
    this.assert(
      errorWasThrown,
      "expected #{this} to throw " + errorLikeString,
      "expected #{this} to not throw an error but #{act} was thrown",
      errorLike && errorLike.toString(),
      actual
    );
  }
  if (errorLike && caughtErr) {
    if (errorLike instanceof Error) {
      let isCompatibleInstance = check_error_exports.compatibleInstance(
        caughtErr,
        errorLike
      );
      if (isCompatibleInstance === negate) {
        if (everyArgIsDefined && negate) {
          errorLikeFail = true;
        } else {
          this.assert(
            negate,
            "expected #{this} to throw #{exp} but #{act} was thrown",
            "expected #{this} to not throw #{exp}" + (caughtErr && !negate ? " but #{act} was thrown" : ""),
            errorLike.toString(),
            caughtErr.toString()
          );
        }
      }
    }
    let isCompatibleConstructor = check_error_exports.compatibleConstructor(
      caughtErr,
      errorLike
    );
    if (isCompatibleConstructor === negate) {
      if (everyArgIsDefined && negate) {
        errorLikeFail = true;
      } else {
        this.assert(
          negate,
          "expected #{this} to throw #{exp} but #{act} was thrown",
          "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""),
          errorLike instanceof Error ? errorLike.toString() : errorLike && check_error_exports.getConstructorName(errorLike),
          caughtErr instanceof Error ? caughtErr.toString() : caughtErr && check_error_exports.getConstructorName(caughtErr)
        );
      }
    }
  }
  if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
    let placeholder = "including";
    if (isRegExp2(errMsgMatcher)) {
      placeholder = "matching";
    }
    let isCompatibleMessage = check_error_exports.compatibleMessage(
      caughtErr,
      errMsgMatcher
    );
    if (isCompatibleMessage === negate) {
      if (everyArgIsDefined && negate) {
        errMsgMatcherFail = true;
      } else {
        this.assert(
          negate,
          "expected #{this} to throw error " + placeholder + " #{exp} but got #{act}",
          "expected #{this} to throw error not " + placeholder + " #{exp}",
          errMsgMatcher,
          check_error_exports.getMessage(caughtErr)
        );
      }
    }
  }
  if (errorLikeFail && errMsgMatcherFail) {
    this.assert(
      negate,
      "expected #{this} to throw #{exp} but #{act} was thrown",
      "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""),
      errorLike instanceof Error ? errorLike.toString() : errorLike && check_error_exports.getConstructorName(errorLike),
      caughtErr instanceof Error ? caughtErr.toString() : caughtErr && check_error_exports.getConstructorName(caughtErr)
    );
  }
  flag2(this, "object", caughtErr);
}
__name(assertThrows, "assertThrows");
Assertion.addMethod("throw", assertThrows);
Assertion.addMethod("throws", assertThrows);
Assertion.addMethod("Throw", assertThrows);
function respondTo(method, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), itself = flag2(this, "itself"), context = "function" === typeof obj && !itself ? obj.prototype[method] : obj[method];
  this.assert(
    "function" === typeof context,
    "expected #{this} to respond to " + inspect2(method),
    "expected #{this} to not respond to " + inspect2(method)
  );
}
__name(respondTo, "respondTo");
Assertion.addMethod("respondTo", respondTo);
Assertion.addMethod("respondsTo", respondTo);
Assertion.addProperty("itself", function() {
  flag2(this, "itself", true);
});
function satisfy(matcher, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  let result = matcher(obj);
  this.assert(
    result,
    "expected #{this} to satisfy " + objDisplay(matcher),
    "expected #{this} to not satisfy" + objDisplay(matcher),
    flag2(this, "negate") ? false : true,
    result
  );
}
__name(satisfy, "satisfy");
Assertion.addMethod("satisfy", satisfy);
Assertion.addMethod("satisfies", satisfy);
function closeTo(expected, delta, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).is.numeric;
  let message = "A `delta` value is required for `closeTo`";
  if (delta == void 0) {
    throw new AssertionError(
      flagMsg ? `${flagMsg}: ${message}` : message,
      void 0,
      ssfi
    );
  }
  new Assertion(delta, flagMsg, ssfi, true).is.numeric;
  message = "A `expected` value is required for `closeTo`";
  if (expected == void 0) {
    throw new AssertionError(
      flagMsg ? `${flagMsg}: ${message}` : message,
      void 0,
      ssfi
    );
  }
  new Assertion(expected, flagMsg, ssfi, true).is.numeric;
  const abs = /* @__PURE__ */ __name((x) => x < 0 ? -x : x, "abs");
  const strip = /* @__PURE__ */ __name((number) => parseFloat(parseFloat(number).toPrecision(12)), "strip");
  this.assert(
    strip(abs(obj - expected)) <= delta,
    "expected #{this} to be close to " + expected + " +/- " + delta,
    "expected #{this} not to be close to " + expected + " +/- " + delta
  );
}
__name(closeTo, "closeTo");
Assertion.addMethod("closeTo", closeTo);
Assertion.addMethod("approximately", closeTo);
function isSubsetOf(_subset, _superset, cmp, contains, ordered) {
  let superset = Array.from(_superset);
  let subset = Array.from(_subset);
  if (!contains) {
    if (subset.length !== superset.length) return false;
    superset = superset.slice();
  }
  return subset.every(function(elem, idx) {
    if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
    if (!cmp) {
      let matchIdx = superset.indexOf(elem);
      if (matchIdx === -1) return false;
      if (!contains) superset.splice(matchIdx, 1);
      return true;
    }
    return superset.some(function(elem2, matchIdx) {
      if (!cmp(elem, elem2)) return false;
      if (!contains) superset.splice(matchIdx, 1);
      return true;
    });
  });
}
__name(isSubsetOf, "isSubsetOf");
Assertion.addMethod("members", function(subset, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).to.be.iterable;
  new Assertion(subset, flagMsg, ssfi, true).to.be.iterable;
  let contains = flag2(this, "contains");
  let ordered = flag2(this, "ordered");
  let subject, failMsg, failNegateMsg;
  if (contains) {
    subject = ordered ? "an ordered superset" : "a superset";
    failMsg = "expected #{this} to be " + subject + " of #{exp}";
    failNegateMsg = "expected #{this} to not be " + subject + " of #{exp}";
  } else {
    subject = ordered ? "ordered members" : "members";
    failMsg = "expected #{this} to have the same " + subject + " as #{exp}";
    failNegateMsg = "expected #{this} to not have the same " + subject + " as #{exp}";
  }
  let cmp = flag2(this, "deep") ? flag2(this, "eql") : void 0;
  this.assert(
    isSubsetOf(subset, obj, cmp, contains, ordered),
    failMsg,
    failNegateMsg,
    subset,
    obj,
    true
  );
});
Assertion.addProperty("iterable", function(msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  this.assert(
    obj != void 0 && obj[Symbol.iterator],
    "expected #{this} to be an iterable",
    "expected #{this} to not be an iterable",
    obj
  );
});
function oneOf(list, msg) {
  if (msg) flag2(this, "message", msg);
  let expected = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), contains = flag2(this, "contains"), isDeep = flag2(this, "deep"), eql = flag2(this, "eql");
  new Assertion(list, flagMsg, ssfi, true).to.be.an("array");
  if (contains) {
    this.assert(
      list.some(function(possibility) {
        return expected.indexOf(possibility) > -1;
      }),
      "expected #{this} to contain one of #{exp}",
      "expected #{this} to not contain one of #{exp}",
      list,
      expected
    );
  } else {
    if (isDeep) {
      this.assert(
        list.some(function(possibility) {
          return eql(expected, possibility);
        }),
        "expected #{this} to deeply equal one of #{exp}",
        "expected #{this} to deeply equal one of #{exp}",
        list,
        expected
      );
    } else {
      this.assert(
        list.indexOf(expected) > -1,
        "expected #{this} to be one of #{exp}",
        "expected #{this} to not be one of #{exp}",
        list,
        expected
      );
    }
  }
}
__name(oneOf, "oneOf");
Assertion.addMethod("oneOf", oneOf);
function assertChanges(subject, prop, msg) {
  if (msg) flag2(this, "message", msg);
  let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  fn();
  let final = prop === void 0 || prop === null ? subject() : subject[prop];
  let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
  flag2(this, "deltaMsgObj", msgObj);
  flag2(this, "initialDeltaValue", initial);
  flag2(this, "finalDeltaValue", final);
  flag2(this, "deltaBehavior", "change");
  flag2(this, "realDelta", final !== initial);
  this.assert(
    initial !== final,
    "expected " + msgObj + " to change",
    "expected " + msgObj + " to not change"
  );
}
__name(assertChanges, "assertChanges");
Assertion.addMethod("change", assertChanges);
Assertion.addMethod("changes", assertChanges);
function assertIncreases(subject, prop, msg) {
  if (msg) flag2(this, "message", msg);
  let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  new Assertion(initial, flagMsg, ssfi, true).is.a("number");
  fn();
  let final = prop === void 0 || prop === null ? subject() : subject[prop];
  let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
  flag2(this, "deltaMsgObj", msgObj);
  flag2(this, "initialDeltaValue", initial);
  flag2(this, "finalDeltaValue", final);
  flag2(this, "deltaBehavior", "increase");
  flag2(this, "realDelta", final - initial);
  this.assert(
    final - initial > 0,
    "expected " + msgObj + " to increase",
    "expected " + msgObj + " to not increase"
  );
}
__name(assertIncreases, "assertIncreases");
Assertion.addMethod("increase", assertIncreases);
Assertion.addMethod("increases", assertIncreases);
function assertDecreases(subject, prop, msg) {
  if (msg) flag2(this, "message", msg);
  let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  new Assertion(initial, flagMsg, ssfi, true).is.a("number");
  fn();
  let final = prop === void 0 || prop === null ? subject() : subject[prop];
  let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
  flag2(this, "deltaMsgObj", msgObj);
  flag2(this, "initialDeltaValue", initial);
  flag2(this, "finalDeltaValue", final);
  flag2(this, "deltaBehavior", "decrease");
  flag2(this, "realDelta", initial - final);
  this.assert(
    final - initial < 0,
    "expected " + msgObj + " to decrease",
    "expected " + msgObj + " to not decrease"
  );
}
__name(assertDecreases, "assertDecreases");
Assertion.addMethod("decrease", assertDecreases);
Assertion.addMethod("decreases", assertDecreases);
function assertDelta(delta, msg) {
  if (msg) flag2(this, "message", msg);
  let msgObj = flag2(this, "deltaMsgObj");
  let initial = flag2(this, "initialDeltaValue");
  let final = flag2(this, "finalDeltaValue");
  let behavior = flag2(this, "deltaBehavior");
  let realDelta = flag2(this, "realDelta");
  let expression;
  if (behavior === "change") {
    expression = Math.abs(final - initial) === Math.abs(delta);
  } else {
    expression = realDelta === Math.abs(delta);
  }
  this.assert(
    expression,
    "expected " + msgObj + " to " + behavior + " by " + delta,
    "expected " + msgObj + " to not " + behavior + " by " + delta
  );
}
__name(assertDelta, "assertDelta");
Assertion.addMethod("by", assertDelta);
Assertion.addProperty("extensible", function() {
  let obj = flag2(this, "object");
  let isExtensible = obj === Object(obj) && Object.isExtensible(obj);
  this.assert(
    isExtensible,
    "expected #{this} to be extensible",
    "expected #{this} to not be extensible"
  );
});
Assertion.addProperty("sealed", function() {
  let obj = flag2(this, "object");
  let isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
  this.assert(
    isSealed,
    "expected #{this} to be sealed",
    "expected #{this} to not be sealed"
  );
});
Assertion.addProperty("frozen", function() {
  let obj = flag2(this, "object");
  let isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
  this.assert(
    isFrozen,
    "expected #{this} to be frozen",
    "expected #{this} to not be frozen"
  );
});
Assertion.addProperty("finite", function(_msg) {
  let obj = flag2(this, "object");
  this.assert(
    typeof obj === "number" && isFinite(obj),
    "expected #{this} to be a finite number",
    "expected #{this} to not be a finite number"
  );
});
function compareSubset(expected, actual) {
  if (expected === actual) {
    return true;
  }
  if (typeof actual !== typeof expected) {
    return false;
  }
  if (typeof expected !== "object" || expected === null) {
    return expected === actual;
  }
  if (!actual) {
    return false;
  }
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return false;
    }
    return expected.every(function(exp) {
      return actual.some(function(act) {
        return compareSubset(exp, act);
      });
    });
  }
  if (expected instanceof Date) {
    if (actual instanceof Date) {
      return expected.getTime() === actual.getTime();
    } else {
      return false;
    }
  }
  return Object.keys(expected).every(function(key) {
    let expectedValue = expected[key];
    let actualValue = actual[key];
    if (typeof expectedValue === "object" && expectedValue !== null && actualValue !== null) {
      return compareSubset(expectedValue, actualValue);
    }
    if (typeof expectedValue === "function") {
      return expectedValue(actualValue);
    }
    return actualValue === expectedValue;
  });
}
__name(compareSubset, "compareSubset");
Assertion.addMethod("containSubset", function(expected) {
  const actual = flag(this, "object");
  const showDiff = config.showDiff;
  this.assert(
    compareSubset(expected, actual),
    "expected #{act} to contain subset #{exp}",
    "expected #{act} to not contain subset #{exp}",
    expected,
    actual,
    showDiff
  );
});

// lib/chai/interface/expect.js
function expect(val, message) {
  return new Assertion(val, message);
}
__name(expect, "expect");
expect.fail = function(actual, expected, message, operator) {
  if (arguments.length < 2) {
    message = actual;
    actual = void 0;
  }
  message = message || "expect.fail()";
  throw new AssertionError(
    message,
    {
      actual,
      expected,
      operator
    },
    expect.fail
  );
};

// lib/chai/interface/should.js
var should_exports = {};
__export(should_exports, {
  Should: () => Should,
  should: () => should
});
function loadShould() {
  function shouldGetter() {
    if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === "function" && this instanceof Symbol || typeof BigInt === "function" && this instanceof BigInt) {
      return new Assertion(this.valueOf(), null, shouldGetter);
    }
    return new Assertion(this, null, shouldGetter);
  }
  __name(shouldGetter, "shouldGetter");
  function shouldSetter(value) {
    Object.defineProperty(this, "should", {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  __name(shouldSetter, "shouldSetter");
  Object.defineProperty(Object.prototype, "should", {
    set: shouldSetter,
    get: shouldGetter,
    configurable: true
  });
  let should2 = {};
  should2.fail = function(actual, expected, message, operator) {
    if (arguments.length < 2) {
      message = actual;
      actual = void 0;
    }
    message = message || "should.fail()";
    throw new AssertionError(
      message,
      {
        actual,
        expected,
        operator
      },
      should2.fail
    );
  };
  should2.equal = function(actual, expected, message) {
    new Assertion(actual, message).to.equal(expected);
  };
  should2.Throw = function(fn, errt, errs, msg) {
    new Assertion(fn, msg).to.Throw(errt, errs);
  };
  should2.exist = function(val, msg) {
    new Assertion(val, msg).to.exist;
  };
  should2.not = {};
  should2.not.equal = function(actual, expected, msg) {
    new Assertion(actual, msg).to.not.equal(expected);
  };
  should2.not.Throw = function(fn, errt, errs, msg) {
    new Assertion(fn, msg).to.not.Throw(errt, errs);
  };
  should2.not.exist = function(val, msg) {
    new Assertion(val, msg).to.not.exist;
  };
  should2["throw"] = should2["Throw"];
  should2.not["throw"] = should2.not["Throw"];
  return should2;
}
__name(loadShould, "loadShould");
var should = loadShould;
var Should = loadShould;

// lib/chai/interface/assert.js
function assert$1(express, errmsg) {
  let test2 = new Assertion(null, null, assert$1, true);
  test2.assert(express, errmsg, "[ negation message unavailable ]");
}
__name(assert$1, "assert");
assert$1.fail = function(actual, expected, message, operator) {
  if (arguments.length < 2) {
    message = actual;
    actual = void 0;
  }
  message = message || "assert.fail()";
  throw new AssertionError(
    message,
    {
      actual,
      expected,
      operator
    },
    assert$1.fail
  );
};
assert$1.isOk = function(val, msg) {
  new Assertion(val, msg, assert$1.isOk, true).is.ok;
};
assert$1.isNotOk = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotOk, true).is.not.ok;
};
assert$1.equal = function(act, exp, msg) {
  let test2 = new Assertion(act, msg, assert$1.equal, true);
  test2.assert(
    exp == flag(test2, "object"),
    "expected #{this} to equal #{exp}",
    "expected #{this} to not equal #{act}",
    exp,
    act,
    true
  );
};
assert$1.notEqual = function(act, exp, msg) {
  let test2 = new Assertion(act, msg, assert$1.notEqual, true);
  test2.assert(
    exp != flag(test2, "object"),
    "expected #{this} to not equal #{exp}",
    "expected #{this} to equal #{act}",
    exp,
    act,
    true
  );
};
assert$1.strictEqual = function(act, exp, msg) {
  new Assertion(act, msg, assert$1.strictEqual, true).to.equal(exp);
};
assert$1.notStrictEqual = function(act, exp, msg) {
  new Assertion(act, msg, assert$1.notStrictEqual, true).to.not.equal(exp);
};
assert$1.deepEqual = assert$1.deepStrictEqual = function(act, exp, msg) {
  new Assertion(act, msg, assert$1.deepEqual, true).to.eql(exp);
};
assert$1.notDeepEqual = function(act, exp, msg) {
  new Assertion(act, msg, assert$1.notDeepEqual, true).to.not.eql(exp);
};
assert$1.isAbove = function(val, abv, msg) {
  new Assertion(val, msg, assert$1.isAbove, true).to.be.above(abv);
};
assert$1.isAtLeast = function(val, atlst, msg) {
  new Assertion(val, msg, assert$1.isAtLeast, true).to.be.least(atlst);
};
assert$1.isBelow = function(val, blw, msg) {
  new Assertion(val, msg, assert$1.isBelow, true).to.be.below(blw);
};
assert$1.isAtMost = function(val, atmst, msg) {
  new Assertion(val, msg, assert$1.isAtMost, true).to.be.most(atmst);
};
assert$1.isTrue = function(val, msg) {
  new Assertion(val, msg, assert$1.isTrue, true).is["true"];
};
assert$1.isNotTrue = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotTrue, true).to.not.equal(true);
};
assert$1.isFalse = function(val, msg) {
  new Assertion(val, msg, assert$1.isFalse, true).is["false"];
};
assert$1.isNotFalse = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotFalse, true).to.not.equal(false);
};
assert$1.isNull = function(val, msg) {
  new Assertion(val, msg, assert$1.isNull, true).to.equal(null);
};
assert$1.isNotNull = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotNull, true).to.not.equal(null);
};
assert$1.isNaN = function(val, msg) {
  new Assertion(val, msg, assert$1.isNaN, true).to.be.NaN;
};
assert$1.isNotNaN = function(value, message) {
  new Assertion(value, message, assert$1.isNotNaN, true).not.to.be.NaN;
};
assert$1.exists = function(val, msg) {
  new Assertion(val, msg, assert$1.exists, true).to.exist;
};
assert$1.notExists = function(val, msg) {
  new Assertion(val, msg, assert$1.notExists, true).to.not.exist;
};
assert$1.isUndefined = function(val, msg) {
  new Assertion(val, msg, assert$1.isUndefined, true).to.equal(void 0);
};
assert$1.isDefined = function(val, msg) {
  new Assertion(val, msg, assert$1.isDefined, true).to.not.equal(void 0);
};
assert$1.isCallable = function(value, message) {
  new Assertion(value, message, assert$1.isCallable, true).is.callable;
};
assert$1.isNotCallable = function(value, message) {
  new Assertion(value, message, assert$1.isNotCallable, true).is.not.callable;
};
assert$1.isObject = function(val, msg) {
  new Assertion(val, msg, assert$1.isObject, true).to.be.a("object");
};
assert$1.isNotObject = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotObject, true).to.not.be.a("object");
};
assert$1.isArray = function(val, msg) {
  new Assertion(val, msg, assert$1.isArray, true).to.be.an("array");
};
assert$1.isNotArray = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotArray, true).to.not.be.an("array");
};
assert$1.isString = function(val, msg) {
  new Assertion(val, msg, assert$1.isString, true).to.be.a("string");
};
assert$1.isNotString = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotString, true).to.not.be.a("string");
};
assert$1.isNumber = function(val, msg) {
  new Assertion(val, msg, assert$1.isNumber, true).to.be.a("number");
};
assert$1.isNotNumber = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotNumber, true).to.not.be.a("number");
};
assert$1.isNumeric = function(val, msg) {
  new Assertion(val, msg, assert$1.isNumeric, true).is.numeric;
};
assert$1.isNotNumeric = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotNumeric, true).is.not.numeric;
};
assert$1.isFinite = function(val, msg) {
  new Assertion(val, msg, assert$1.isFinite, true).to.be.finite;
};
assert$1.isBoolean = function(val, msg) {
  new Assertion(val, msg, assert$1.isBoolean, true).to.be.a("boolean");
};
assert$1.isNotBoolean = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotBoolean, true).to.not.be.a("boolean");
};
assert$1.typeOf = function(val, type3, msg) {
  new Assertion(val, msg, assert$1.typeOf, true).to.be.a(type3);
};
assert$1.notTypeOf = function(value, type3, message) {
  new Assertion(value, message, assert$1.notTypeOf, true).to.not.be.a(type3);
};
assert$1.instanceOf = function(val, type3, msg) {
  new Assertion(val, msg, assert$1.instanceOf, true).to.be.instanceOf(type3);
};
assert$1.notInstanceOf = function(val, type3, msg) {
  new Assertion(val, msg, assert$1.notInstanceOf, true).to.not.be.instanceOf(
    type3
  );
};
assert$1.include = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.include, true).include(inc);
};
assert$1.notInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.notInclude, true).not.include(inc);
};
assert$1.deepInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.deepInclude, true).deep.include(inc);
};
assert$1.notDeepInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.notDeepInclude, true).not.deep.include(inc);
};
assert$1.nestedInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.nestedInclude, true).nested.include(inc);
};
assert$1.notNestedInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.notNestedInclude, true).not.nested.include(
    inc
  );
};
assert$1.deepNestedInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.deepNestedInclude, true).deep.nested.include(
    inc
  );
};
assert$1.notDeepNestedInclude = function(exp, inc, msg) {
  new Assertion(
    exp,
    msg,
    assert$1.notDeepNestedInclude,
    true
  ).not.deep.nested.include(inc);
};
assert$1.ownInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.ownInclude, true).own.include(inc);
};
assert$1.notOwnInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.notOwnInclude, true).not.own.include(inc);
};
assert$1.deepOwnInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.deepOwnInclude, true).deep.own.include(inc);
};
assert$1.notDeepOwnInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert$1.notDeepOwnInclude, true).not.deep.own.include(
    inc
  );
};
assert$1.match = function(exp, re, msg) {
  new Assertion(exp, msg, assert$1.match, true).to.match(re);
};
assert$1.notMatch = function(exp, re, msg) {
  new Assertion(exp, msg, assert$1.notMatch, true).to.not.match(re);
};
assert$1.property = function(obj, prop, msg) {
  new Assertion(obj, msg, assert$1.property, true).to.have.property(prop);
};
assert$1.notProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert$1.notProperty, true).to.not.have.property(prop);
};
assert$1.propertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert$1.propertyVal, true).to.have.property(prop, val);
};
assert$1.notPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert$1.notPropertyVal, true).to.not.have.property(
    prop,
    val
  );
};
assert$1.deepPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert$1.deepPropertyVal, true).to.have.deep.property(
    prop,
    val
  );
};
assert$1.notDeepPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.notDeepPropertyVal,
    true
  ).to.not.have.deep.property(prop, val);
};
assert$1.ownProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert$1.ownProperty, true).to.have.own.property(prop);
};
assert$1.notOwnProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert$1.notOwnProperty, true).to.not.have.own.property(
    prop
  );
};
assert$1.ownPropertyVal = function(obj, prop, value, msg) {
  new Assertion(obj, msg, assert$1.ownPropertyVal, true).to.have.own.property(
    prop,
    value
  );
};
assert$1.notOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.notOwnPropertyVal,
    true
  ).to.not.have.own.property(prop, value);
};
assert$1.deepOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.deepOwnPropertyVal,
    true
  ).to.have.deep.own.property(prop, value);
};
assert$1.notDeepOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.notDeepOwnPropertyVal,
    true
  ).to.not.have.deep.own.property(prop, value);
};
assert$1.nestedProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert$1.nestedProperty, true).to.have.nested.property(
    prop
  );
};
assert$1.notNestedProperty = function(obj, prop, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.notNestedProperty,
    true
  ).to.not.have.nested.property(prop);
};
assert$1.nestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.nestedPropertyVal,
    true
  ).to.have.nested.property(prop, val);
};
assert$1.notNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.notNestedPropertyVal,
    true
  ).to.not.have.nested.property(prop, val);
};
assert$1.deepNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.deepNestedPropertyVal,
    true
  ).to.have.deep.nested.property(prop, val);
};
assert$1.notDeepNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.notDeepNestedPropertyVal,
    true
  ).to.not.have.deep.nested.property(prop, val);
};
assert$1.lengthOf = function(exp, len, msg) {
  new Assertion(exp, msg, assert$1.lengthOf, true).to.have.lengthOf(len);
};
assert$1.hasAnyKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert$1.hasAnyKeys, true).to.have.any.keys(keys);
};
assert$1.hasAllKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert$1.hasAllKeys, true).to.have.all.keys(keys);
};
assert$1.containsAllKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert$1.containsAllKeys, true).to.contain.all.keys(
    keys
  );
};
assert$1.doesNotHaveAnyKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert$1.doesNotHaveAnyKeys, true).to.not.have.any.keys(
    keys
  );
};
assert$1.doesNotHaveAllKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert$1.doesNotHaveAllKeys, true).to.not.have.all.keys(
    keys
  );
};
assert$1.hasAnyDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert$1.hasAnyDeepKeys, true).to.have.any.deep.keys(
    keys
  );
};
assert$1.hasAllDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert$1.hasAllDeepKeys, true).to.have.all.deep.keys(
    keys
  );
};
assert$1.containsAllDeepKeys = function(obj, keys, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.containsAllDeepKeys,
    true
  ).to.contain.all.deep.keys(keys);
};
assert$1.doesNotHaveAnyDeepKeys = function(obj, keys, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.doesNotHaveAnyDeepKeys,
    true
  ).to.not.have.any.deep.keys(keys);
};
assert$1.doesNotHaveAllDeepKeys = function(obj, keys, msg) {
  new Assertion(
    obj,
    msg,
    assert$1.doesNotHaveAllDeepKeys,
    true
  ).to.not.have.all.deep.keys(keys);
};
assert$1.throws = function(fn, errorLike, errMsgMatcher, msg) {
  if ("string" === typeof errorLike || errorLike instanceof RegExp) {
    errMsgMatcher = errorLike;
    errorLike = null;
  }
  let assertErr = new Assertion(fn, msg, assert$1.throws, true).to.throw(
    errorLike,
    errMsgMatcher
  );
  return flag(assertErr, "object");
};
assert$1.doesNotThrow = function(fn, errorLike, errMsgMatcher, message) {
  if ("string" === typeof errorLike || errorLike instanceof RegExp) {
    errMsgMatcher = errorLike;
    errorLike = null;
  }
  new Assertion(fn, message, assert$1.doesNotThrow, true).to.not.throw(
    errorLike,
    errMsgMatcher
  );
};
assert$1.operator = function(val, operator, val2, msg) {
  let ok;
  switch (operator) {
    case "==":
      ok = val == val2;
      break;
    case "===":
      ok = val === val2;
      break;
    case ">":
      ok = val > val2;
      break;
    case ">=":
      ok = val >= val2;
      break;
    case "<":
      ok = val < val2;
      break;
    case "<=":
      ok = val <= val2;
      break;
    case "!=":
      ok = val != val2;
      break;
    case "!==":
      ok = val !== val2;
      break;
    default:
      msg = msg ? msg + ": " : msg;
      throw new AssertionError(
        msg + 'Invalid operator "' + operator + '"',
        void 0,
        assert$1.operator
      );
  }
  let test2 = new Assertion(ok, msg, assert$1.operator, true);
  test2.assert(
    true === flag(test2, "object"),
    "expected " + inspect2(val) + " to be " + operator + " " + inspect2(val2),
    "expected " + inspect2(val) + " to not be " + operator + " " + inspect2(val2)
  );
};
assert$1.closeTo = function(act, exp, delta, msg) {
  new Assertion(act, msg, assert$1.closeTo, true).to.be.closeTo(exp, delta);
};
assert$1.approximately = function(act, exp, delta, msg) {
  new Assertion(act, msg, assert$1.approximately, true).to.be.approximately(
    exp,
    delta
  );
};
assert$1.sameMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert$1.sameMembers, true).to.have.same.members(set2);
};
assert$1.notSameMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert$1.notSameMembers,
    true
  ).to.not.have.same.members(set2);
};
assert$1.sameDeepMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert$1.sameDeepMembers,
    true
  ).to.have.same.deep.members(set2);
};
assert$1.notSameDeepMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert$1.notSameDeepMembers,
    true
  ).to.not.have.same.deep.members(set2);
};
assert$1.sameOrderedMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert$1.sameOrderedMembers,
    true
  ).to.have.same.ordered.members(set2);
};
assert$1.notSameOrderedMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert$1.notSameOrderedMembers,
    true
  ).to.not.have.same.ordered.members(set2);
};
assert$1.sameDeepOrderedMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert$1.sameDeepOrderedMembers,
    true
  ).to.have.same.deep.ordered.members(set2);
};
assert$1.notSameDeepOrderedMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert$1.notSameDeepOrderedMembers,
    true
  ).to.not.have.same.deep.ordered.members(set2);
};
assert$1.includeMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert$1.includeMembers, true).to.include.members(
    subset
  );
};
assert$1.notIncludeMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert$1.notIncludeMembers,
    true
  ).to.not.include.members(subset);
};
assert$1.includeDeepMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert$1.includeDeepMembers,
    true
  ).to.include.deep.members(subset);
};
assert$1.notIncludeDeepMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert$1.notIncludeDeepMembers,
    true
  ).to.not.include.deep.members(subset);
};
assert$1.includeOrderedMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert$1.includeOrderedMembers,
    true
  ).to.include.ordered.members(subset);
};
assert$1.notIncludeOrderedMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert$1.notIncludeOrderedMembers,
    true
  ).to.not.include.ordered.members(subset);
};
assert$1.includeDeepOrderedMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert$1.includeDeepOrderedMembers,
    true
  ).to.include.deep.ordered.members(subset);
};
assert$1.notIncludeDeepOrderedMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert$1.notIncludeDeepOrderedMembers,
    true
  ).to.not.include.deep.ordered.members(subset);
};
assert$1.oneOf = function(inList, list, msg) {
  new Assertion(inList, msg, assert$1.oneOf, true).to.be.oneOf(list);
};
assert$1.isIterable = function(obj, msg) {
  if (obj == void 0 || !obj[Symbol.iterator]) {
    msg = msg ? `${msg} expected ${inspect2(obj)} to be an iterable` : `expected ${inspect2(obj)} to be an iterable`;
    throw new AssertionError(msg, void 0, assert$1.isIterable);
  }
};
assert$1.changes = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert$1.changes, true).to.change(obj, prop);
};
assert$1.changesBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert$1.changesBy, true).to.change(obj, prop).by(delta);
};
assert$1.doesNotChange = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert$1.doesNotChange, true).to.not.change(
    obj,
    prop
  );
};
assert$1.changesButNotBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert$1.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
};
assert$1.increases = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert$1.increases, true).to.increase(obj, prop);
};
assert$1.increasesBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert$1.increasesBy, true).to.increase(obj, prop).by(delta);
};
assert$1.doesNotIncrease = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert$1.doesNotIncrease, true).to.not.increase(
    obj,
    prop
  );
};
assert$1.increasesButNotBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert$1.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
};
assert$1.decreases = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert$1.decreases, true).to.decrease(obj, prop);
};
assert$1.decreasesBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert$1.decreasesBy, true).to.decrease(obj, prop).by(delta);
};
assert$1.doesNotDecrease = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert$1.doesNotDecrease, true).to.not.decrease(
    obj,
    prop
  );
};
assert$1.doesNotDecreaseBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert$1.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
};
assert$1.decreasesButNotBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert$1.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
};
assert$1.ifError = function(val) {
  if (val) {
    throw val;
  }
};
assert$1.isExtensible = function(obj, msg) {
  new Assertion(obj, msg, assert$1.isExtensible, true).to.be.extensible;
};
assert$1.isNotExtensible = function(obj, msg) {
  new Assertion(obj, msg, assert$1.isNotExtensible, true).to.not.be.extensible;
};
assert$1.isSealed = function(obj, msg) {
  new Assertion(obj, msg, assert$1.isSealed, true).to.be.sealed;
};
assert$1.isNotSealed = function(obj, msg) {
  new Assertion(obj, msg, assert$1.isNotSealed, true).to.not.be.sealed;
};
assert$1.isFrozen = function(obj, msg) {
  new Assertion(obj, msg, assert$1.isFrozen, true).to.be.frozen;
};
assert$1.isNotFrozen = function(obj, msg) {
  new Assertion(obj, msg, assert$1.isNotFrozen, true).to.not.be.frozen;
};
assert$1.isEmpty = function(val, msg) {
  new Assertion(val, msg, assert$1.isEmpty, true).to.be.empty;
};
assert$1.isNotEmpty = function(val, msg) {
  new Assertion(val, msg, assert$1.isNotEmpty, true).to.not.be.empty;
};
assert$1.containsSubset = function(val, exp, msg) {
  new Assertion(val, msg).to.containSubset(exp);
};
assert$1.doesNotContainSubset = function(val, exp, msg) {
  new Assertion(val, msg).to.not.containSubset(exp);
};
var aliases = [
  ["isOk", "ok"],
  ["isNotOk", "notOk"],
  ["throws", "throw"],
  ["throws", "Throw"],
  ["isExtensible", "extensible"],
  ["isNotExtensible", "notExtensible"],
  ["isSealed", "sealed"],
  ["isNotSealed", "notSealed"],
  ["isFrozen", "frozen"],
  ["isNotFrozen", "notFrozen"],
  ["isEmpty", "empty"],
  ["isNotEmpty", "notEmpty"],
  ["isCallable", "isFunction"],
  ["isNotCallable", "isNotFunction"],
  ["containsSubset", "containSubset"]
];
for (const [name, as] of aliases) {
  assert$1[as] = assert$1[name];
}

// lib/chai.js
var used = [];
function use(fn) {
  const exports$1 = {
    use,
    AssertionError,
    util: utils_exports,
    config,
    expect,
    assert: assert$1,
    Assertion,
    ...should_exports
  };
  if (!~used.indexOf(fn)) {
    fn(exports$1, utils_exports);
    used.push(fn);
  }
  return exports$1;
}
__name(use, "use");

const MATCHERS_OBJECT = Symbol.for("matchers-object");
const JEST_MATCHERS_OBJECT = Symbol.for("$$jest-matchers-object");
const GLOBAL_EXPECT = Symbol.for("expect-global");
const ASYMMETRIC_MATCHERS_OBJECT = Symbol.for("asymmetric-matchers-object");

// selectively ported from https://github.com/jest-community/jest-extended
const customMatchers = {
	toSatisfy(actual, expected, message) {
		const { printReceived, printExpected, matcherHint } = this.utils;
		const pass = expected(actual);
		return {
			pass,
			message: () => pass ? `\
${matcherHint(".not.toSatisfy", "received", "")}

Expected value to not satisfy:
${message || printExpected(expected)}
Received:
${printReceived(actual)}` : `\
${matcherHint(".toSatisfy", "received", "")}

Expected value to satisfy:
${message || printExpected(expected)}

Received:
${printReceived(actual)}`
		};
	},
	toBeOneOf(actual, expected) {
		const { equals, customTesters } = this;
		const { printReceived, printExpected, matcherHint } = this.utils;
		let pass;
		if (Array.isArray(expected)) {
			pass = expected.length === 0 || expected.some((item) => equals(item, actual, customTesters));
		} else if (expected instanceof Set) {
			pass = expected.size === 0 || expected.has(actual) || [...expected].some((item) => equals(item, actual, customTesters));
		} else {
			throw new TypeError(`You must provide an array or set to ${matcherHint(".toBeOneOf")}, not '${typeof expected}'.`);
		}
		return {
			pass,
			message: () => pass ? `\
${matcherHint(".not.toBeOneOf", "received", "")}

Expected value to not be one of:
${printExpected(expected)}
Received:
${printReceived(actual)}` : `\
${matcherHint(".toBeOneOf", "received", "")}

Expected value to be one of:
${printExpected(expected)}

Received:
${printReceived(actual)}`
		};
	}
};

const EXPECTED_COLOR = C.green;
const RECEIVED_COLOR = C.red;
const INVERTED_COLOR = C.inverse;
const BOLD_WEIGHT = C.bold;
const DIM_COLOR = C.dim;
function matcherHint(matcherName, received = "received", expected = "expected", options = {}) {
	const { comment = "", isDirectExpectCall = false, isNot = false, promise = "", secondArgument = "", expectedColor = EXPECTED_COLOR, receivedColor = RECEIVED_COLOR, secondArgumentColor = EXPECTED_COLOR } = options;
	let hint = "";
	let dimString = "expect";
	if (!isDirectExpectCall && received !== "") {
		hint += DIM_COLOR(`${dimString}(`) + receivedColor(received);
		dimString = ")";
	}
	if (promise !== "") {
		hint += DIM_COLOR(`${dimString}.`) + promise;
		dimString = "";
	}
	if (isNot) {
		hint += `${DIM_COLOR(`${dimString}.`)}not`;
		dimString = "";
	}
	if (matcherName.includes(".")) {
		// Old format: for backward compatibility,
		// especially without promise or isNot options
		dimString += matcherName;
	} else {
		// New format: omit period from matcherName arg
		hint += DIM_COLOR(`${dimString}.`) + matcherName;
		dimString = "";
	}
	if (expected === "") {
		dimString += "()";
	} else {
		hint += DIM_COLOR(`${dimString}(`) + expectedColor(expected);
		if (secondArgument) {
			hint += DIM_COLOR(", ") + secondArgumentColor(secondArgument);
		}
		dimString = ")";
	}
	if (comment !== "") {
		dimString += ` // ${comment}`;
	}
	if (dimString !== "") {
		hint += DIM_COLOR(dimString);
	}
	return hint;
}
const SPACE_SYMBOL = "·";
// Instead of inverse highlight which now implies a change,
// replace common spaces with middle dot at the end of any line.
function replaceTrailingSpaces(text) {
	return text.replace(/\s+$/gm, (spaces) => SPACE_SYMBOL.repeat(spaces.length));
}
function printReceived(object) {
	return RECEIVED_COLOR(replaceTrailingSpaces(stringify(object)));
}
function printExpected(value) {
	return EXPECTED_COLOR(replaceTrailingSpaces(stringify(value)));
}
function getMatcherUtils() {
	return {
		EXPECTED_COLOR,
		RECEIVED_COLOR,
		INVERTED_COLOR,
		BOLD_WEIGHT,
		DIM_COLOR,
		diff,
		matcherHint,
		printReceived,
		printExpected,
		printDiffOrStringify,
		printWithType
	};
}
function printWithType(name, value, print) {
	const type = getType$1(value);
	const hasType = type !== "null" && type !== "undefined" ? `${name} has type:  ${type}\n` : "";
	const hasValue = `${name} has value: ${print(value)}`;
	return hasType + hasValue;
}
function addCustomEqualityTesters(newTesters) {
	if (!Array.isArray(newTesters)) {
		throw new TypeError(`expect.customEqualityTesters: Must be set to an array of Testers. Was given "${getType$1(newTesters)}"`);
	}
	globalThis[JEST_MATCHERS_OBJECT].customEqualityTesters.push(...newTesters);
}
function getCustomEqualityTesters() {
	return globalThis[JEST_MATCHERS_OBJECT].customEqualityTesters;
}

// Extracted out of jasmine 2.5.2
function equals(a, b, customTesters, strictCheck) {
	customTesters = customTesters || [];
	return eq(a, b, [], [], customTesters, strictCheck ? hasKey : hasDefinedKey);
}
function isAsymmetric(obj) {
	return !!obj && typeof obj === "object" && "asymmetricMatch" in obj && isA("Function", obj.asymmetricMatch);
}
function asymmetricMatch(a, b, customTesters) {
	const asymmetricA = isAsymmetric(a);
	const asymmetricB = isAsymmetric(b);
	if (asymmetricA && asymmetricB) {
		return undefined;
	}
	if (asymmetricA) {
		return a.asymmetricMatch(b, customTesters);
	}
	if (asymmetricB) {
		return b.asymmetricMatch(a, customTesters);
	}
}
// Equality function lovingly adapted from isEqual in
//   [Underscore](http://underscorejs.org)
function eq(a, b, aStack, bStack, customTesters, hasKey) {
	let result = true;
	const asymmetricResult = asymmetricMatch(a, b, customTesters);
	if (asymmetricResult !== undefined) {
		return asymmetricResult;
	}
	const testerContext = { equals };
	for (let i = 0; i < customTesters.length; i++) {
		const customTesterResult = customTesters[i].call(testerContext, a, b, customTesters);
		if (customTesterResult !== undefined) {
			return customTesterResult;
		}
	}
	if (typeof URL === "function" && a instanceof URL && b instanceof URL) {
		return a.href === b.href;
	}
	if (Object.is(a, b)) {
		return true;
	}
	// A strict comparison is necessary because `null == undefined`.
	if (a === null || b === null) {
		return a === b;
	}
	const className = Object.prototype.toString.call(a);
	if (className !== Object.prototype.toString.call(b)) {
		return false;
	}
	switch (className) {
		case "[object Boolean]":
		case "[object String]":
		case "[object Number]": if (typeof a !== typeof b) {
			// One is a primitive, one a `new Primitive()`
			return false;
		} else if (typeof a !== "object" && typeof b !== "object") {
			// both are proper primitives
			return Object.is(a, b);
		} else {
			// both are `new Primitive()`s
			return Object.is(a.valueOf(), b.valueOf());
		}
		case "[object Date]": {
			const numA = +a;
			const numB = +b;
			// Coerce dates to numeric primitive values. Dates are compared by their
			// millisecond representations. Note that invalid dates with millisecond representations
			// of `NaN` are equivalent.
			return numA === numB || Number.isNaN(numA) && Number.isNaN(numB);
		}
		case "[object RegExp]": return a.source === b.source && a.flags === b.flags;
		case "[object Temporal.Instant]":
		case "[object Temporal.ZonedDateTime]":
		case "[object Temporal.PlainDateTime]":
		case "[object Temporal.PlainDate]":
		case "[object Temporal.PlainTime]":
		case "[object Temporal.PlainYearMonth]":
		case "[object Temporal.PlainMonthDay]": return a.equals(b);
		case "[object Temporal.Duration]": return a.toString() === b.toString();
	}
	if (typeof a !== "object" || typeof b !== "object") {
		return false;
	}
	// Use DOM3 method isEqualNode (IE>=9)
	if (isDomNode(a) && isDomNode(b)) {
		return a.isEqualNode(b);
	}
	// Used to detect circular references.
	let length = aStack.length;
	while (length--) {
		// Linear search. Performance is inversely proportional to the number of
		// unique nested structures.
		// circular references at same depth are equal
		// circular reference is not equal to non-circular one
		if (aStack[length] === a) {
			return bStack[length] === b;
		} else if (bStack[length] === b) {
			return false;
		}
	}
	// Add the first object to the stack of traversed objects.
	aStack.push(a);
	bStack.push(b);
	// Recursively compare objects and arrays.
	// Compare array lengths to determine if a deep comparison is necessary.
	if (className === "[object Array]" && a.length !== b.length) {
		return false;
	}
	if (a instanceof Error && b instanceof Error) {
		try {
			return isErrorEqual(a, b, aStack, bStack, customTesters, hasKey);
		} finally {
			aStack.pop();
			bStack.pop();
		}
	}
	// Deep compare objects.
	const aKeys = keys(a, hasKey);
	let key;
	let size = aKeys.length;
	// Ensure that both objects contain the same number of properties before comparing deep equality.
	if (keys(b, hasKey).length !== size) {
		return false;
	}
	while (size--) {
		key = aKeys[size];
		// Deep compare each member
		result = hasKey(b, key) && eq(a[key], b[key], aStack, bStack, customTesters, hasKey);
		if (!result) {
			return false;
		}
	}
	// Remove the first object from the stack of traversed objects.
	aStack.pop();
	bStack.pop();
	return result;
}
function isErrorEqual(a, b, aStack, bStack, customTesters, hasKey) {
	// https://nodejs.org/docs/latest-v22.x/api/assert.html#comparison-details
	// - [[Prototype]] of objects are compared using the === operator.
	// - Only enumerable "own" properties are considered.
	// - Error names, messages, causes, and errors are always compared, even if these are not enumerable properties. errors is also compared.
	let result = Object.getPrototypeOf(a) === Object.getPrototypeOf(b) && a.name === b.name && a.message === b.message;
	// check Error.cause asymmetrically
	if (typeof b.cause !== "undefined") {
		result && (result = eq(a.cause, b.cause, aStack, bStack, customTesters, hasKey));
	}
	// AggregateError.errors
	if (a instanceof AggregateError && b instanceof AggregateError) {
		result && (result = eq(a.errors, b.errors, aStack, bStack, customTesters, hasKey));
	}
	// spread to compare enumerable properties
	result && (result = eq({ ...a }, { ...b }, aStack, bStack, customTesters, hasKey));
	return result;
}
function keys(obj, hasKey) {
	const keys = [];
	for (const key in obj) {
		if (hasKey(obj, key)) {
			keys.push(key);
		}
	}
	return keys.concat(Object.getOwnPropertySymbols(obj).filter((symbol) => Object.getOwnPropertyDescriptor(obj, symbol).enumerable));
}
function hasDefinedKey(obj, key) {
	return hasKey(obj, key) && obj[key] !== undefined;
}
function hasKey(obj, key) {
	return Object.hasOwn(obj, key);
}
function isA(typeName, value) {
	return Object.prototype.toString.apply(value) === `[object ${typeName}]`;
}
function isDomNode(obj) {
	return obj !== null && typeof obj === "object" && "nodeType" in obj && typeof obj.nodeType === "number" && "nodeName" in obj && typeof obj.nodeName === "string" && "isEqualNode" in obj && typeof obj.isEqualNode === "function";
}
// SENTINEL constants are from https://github.com/facebook/immutable-js
const IS_KEYED_SENTINEL = "@@__IMMUTABLE_KEYED__@@";
const IS_SET_SENTINEL = "@@__IMMUTABLE_SET__@@";
const IS_LIST_SENTINEL = "@@__IMMUTABLE_LIST__@@";
const IS_ORDERED_SENTINEL = "@@__IMMUTABLE_ORDERED__@@";
const IS_RECORD_SYMBOL = "@@__IMMUTABLE_RECORD__@@";
function isImmutableUnorderedKeyed(maybeKeyed) {
	return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL] && !maybeKeyed[IS_ORDERED_SENTINEL]);
}
function isImmutableUnorderedSet(maybeSet) {
	return !!(maybeSet && maybeSet[IS_SET_SENTINEL] && !maybeSet[IS_ORDERED_SENTINEL]);
}
function isObjectLiteral(source) {
	return source != null && typeof source === "object" && !Array.isArray(source);
}
function isImmutableList(source) {
	return Boolean(source && isObjectLiteral(source) && source[IS_LIST_SENTINEL]);
}
function isImmutableOrderedKeyed(source) {
	return Boolean(source && isObjectLiteral(source) && source[IS_KEYED_SENTINEL] && source[IS_ORDERED_SENTINEL]);
}
function isImmutableOrderedSet(source) {
	return Boolean(source && isObjectLiteral(source) && source[IS_SET_SENTINEL] && source[IS_ORDERED_SENTINEL]);
}
function isImmutableRecord(source) {
	return Boolean(source && isObjectLiteral(source) && source[IS_RECORD_SYMBOL]);
}
/**
* Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
const IteratorSymbol = Symbol.iterator;
function hasIterator(object) {
	return !!(object != null && object[IteratorSymbol]);
}
function iterableEquality(a, b, customTesters = [], aStack = [], bStack = []) {
	if (typeof a !== "object" || typeof b !== "object" || Array.isArray(a) || Array.isArray(b) || !hasIterator(a) || !hasIterator(b)) {
		return undefined;
	}
	if (a.constructor !== b.constructor) {
		return false;
	}
	let length = aStack.length;
	while (length--) {
		// Linear search. Performance is inversely proportional to the number of
		// unique nested structures.
		// circular references at same depth are equal
		// circular reference is not equal to non-circular one
		if (aStack[length] === a) {
			return bStack[length] === b;
		}
	}
	aStack.push(a);
	bStack.push(b);
	const filteredCustomTesters = [...customTesters.filter((t) => t !== iterableEquality), iterableEqualityWithStack];
	function iterableEqualityWithStack(a, b) {
		return iterableEquality(a, b, [...customTesters], [...aStack], [...bStack]);
	}
	if (a.size !== undefined) {
		if (a.size !== b.size) {
			return false;
		} else if (isA("Set", a) || isImmutableUnorderedSet(a)) {
			let allFound = true;
			for (const aValue of a) {
				if (!b.has(aValue)) {
					let has = false;
					for (const bValue of b) {
						const isEqual = equals(aValue, bValue, filteredCustomTesters);
						if (isEqual === true) {
							has = true;
						}
					}
					if (has === false) {
						allFound = false;
						break;
					}
				}
			}
			// Remove the first value from the stack of traversed values.
			aStack.pop();
			bStack.pop();
			return allFound;
		} else if (isA("Map", a) || isImmutableUnorderedKeyed(a)) {
			let allFound = true;
			for (const aEntry of a) {
				if (!b.has(aEntry[0]) || !equals(aEntry[1], b.get(aEntry[0]), filteredCustomTesters)) {
					let has = false;
					for (const bEntry of b) {
						const matchedKey = equals(aEntry[0], bEntry[0], filteredCustomTesters);
						let matchedValue = false;
						if (matchedKey === true) {
							matchedValue = equals(aEntry[1], bEntry[1], filteredCustomTesters);
						}
						if (matchedValue === true) {
							has = true;
						}
					}
					if (has === false) {
						allFound = false;
						break;
					}
				}
			}
			// Remove the first value from the stack of traversed values.
			aStack.pop();
			bStack.pop();
			return allFound;
		}
	}
	const bIterator = b[IteratorSymbol]();
	for (const aValue of a) {
		const nextB = bIterator.next();
		if (nextB.done || !equals(aValue, nextB.value, filteredCustomTesters)) {
			return false;
		}
	}
	if (!bIterator.next().done) {
		return false;
	}
	if (!isImmutableList(a) && !isImmutableOrderedKeyed(a) && !isImmutableOrderedSet(a) && !isImmutableRecord(a)) {
		const aEntries = Object.entries(a);
		const bEntries = Object.entries(b);
		if (!equals(aEntries, bEntries, filteredCustomTesters)) {
			return false;
		}
	}
	// Remove the first value from the stack of traversed values.
	aStack.pop();
	bStack.pop();
	return true;
}
/**
* Checks if `hasOwnProperty(object, key)` up the prototype chain, stopping at `Object.prototype`.
*/
function hasPropertyInObject(object, key) {
	const shouldTerminate = !object || typeof object !== "object" || object === Object.prototype;
	if (shouldTerminate) {
		return false;
	}
	return Object.hasOwn(object, key) || hasPropertyInObject(Object.getPrototypeOf(object), key);
}
function isObjectWithKeys(a) {
	return isObject$1(a) && !(a instanceof Error) && !Array.isArray(a) && !(a instanceof Date);
}
function subsetEquality(object, subset, customTesters = []) {
	const filteredCustomTesters = customTesters.filter((t) => t !== subsetEquality);
	// subsetEquality needs to keep track of the references
	// it has already visited to avoid infinite loops in case
	// there are circular references in the subset passed to it.
	const subsetEqualityWithContext = (seenReferences = new WeakMap()) => (object, subset) => {
		if (!isObjectWithKeys(subset)) {
			return undefined;
		}
		return Object.keys(subset).every((key) => {
			if (subset[key] != null && typeof subset[key] === "object") {
				if (seenReferences.has(subset[key])) {
					return equals(object[key], subset[key], filteredCustomTesters);
				}
				seenReferences.set(subset[key], true);
			}
			const result = object != null && hasPropertyInObject(object, key) && equals(object[key], subset[key], [...filteredCustomTesters, subsetEqualityWithContext(seenReferences)]);
			// The main goal of using seenReference is to avoid circular node on tree.
			// It will only happen within a parent and its child, not a node and nodes next to it (same level)
			// We should keep the reference for a parent and its child only
			// Thus we should delete the reference immediately so that it doesn't interfere
			// other nodes within the same level on tree.
			seenReferences.delete(subset[key]);
			return result;
		});
	};
	return subsetEqualityWithContext()(object, subset);
}
function typeEquality(a, b) {
	if (a == null || b == null || a.constructor === b.constructor) {
		return undefined;
	}
	return false;
}
function arrayBufferEquality(a, b) {
	let dataViewA = a;
	let dataViewB = b;
	if (!(a instanceof DataView && b instanceof DataView)) {
		if (!(a instanceof ArrayBuffer) || !(b instanceof ArrayBuffer)) {
			return undefined;
		}
		try {
			dataViewA = new DataView(a);
			dataViewB = new DataView(b);
		} catch {
			return undefined;
		}
	}
	// Buffers are not equal when they do not have the same byte length
	if (dataViewA.byteLength !== dataViewB.byteLength) {
		return false;
	}
	// Check if every byte value is equal to each other
	for (let i = 0; i < dataViewA.byteLength; i++) {
		if (dataViewA.getUint8(i) !== dataViewB.getUint8(i)) {
			return false;
		}
	}
	return true;
}
function sparseArrayEquality(a, b, customTesters = []) {
	if (!Array.isArray(a) || !Array.isArray(b)) {
		return undefined;
	}
	// A sparse array [, , 1] will have keys ["2"] whereas [undefined, undefined, 1] will have keys ["0", "1", "2"]
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	const filteredCustomTesters = customTesters.filter((t) => t !== sparseArrayEquality);
	return equals(a, b, filteredCustomTesters, true) && equals(aKeys, bKeys);
}
function generateToBeMessage(deepEqualityName, expected = "#{this}", actual = "#{exp}") {
	const toBeMessage = `expected ${expected} to be ${actual} // Object.is equality`;
	if (["toStrictEqual", "toEqual"].includes(deepEqualityName)) {
		return `${toBeMessage}\n\nIf it should pass with deep equality, replace "toBe" with "${deepEqualityName}"\n\nExpected: ${expected}\nReceived: serializes to the same string\n`;
	}
	return toBeMessage;
}
function pluralize(word, count) {
	return `${count} ${word}${count === 1 ? "" : "s"}`;
}
function getObjectKeys(object) {
	return [...Object.keys(object), ...Object.getOwnPropertySymbols(object).filter((s) => {
		var _Object$getOwnPropert;
		return (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(object, s)) === null || _Object$getOwnPropert === void 0 ? void 0 : _Object$getOwnPropert.enumerable;
	})];
}
function getObjectSubset(object, subset, customTesters) {
	let stripped = 0;
	const getObjectSubsetWithContext = (seenReferences = new WeakMap()) => (object, subset) => {
		if (Array.isArray(object)) {
			if (Array.isArray(subset) && subset.length === object.length) {
				// The map method returns correct subclass of subset.
				return subset.map((sub, i) => getObjectSubsetWithContext(seenReferences)(object[i], sub));
			}
		} else if (object instanceof Date) {
			return object;
		} else if (isObject$1(object) && isObject$1(subset)) {
			if (equals(object, subset, [
				...customTesters,
				iterableEquality,
				subsetEquality
			])) {
				// return "expected" subset to avoid showing irrelevant toMatchObject diff
				return subset;
			}
			const trimmed = {};
			seenReferences.set(object, trimmed);
			// preserve constructor for toMatchObject diff
			if (typeof object.constructor === "function" && typeof object.constructor.name === "string") {
				Object.defineProperty(trimmed, "constructor", {
					enumerable: false,
					value: object.constructor
				});
			}
			for (const key of getObjectKeys(object)) {
				if (hasPropertyInObject(subset, key)) {
					trimmed[key] = seenReferences.has(object[key]) ? seenReferences.get(object[key]) : getObjectSubsetWithContext(seenReferences)(object[key], subset[key]);
				} else {
					if (!seenReferences.has(object[key])) {
						stripped += 1;
						if (isObject$1(object[key])) {
							stripped += getObjectKeys(object[key]).length;
						}
						getObjectSubsetWithContext(seenReferences)(object[key], subset[key]);
					}
				}
			}
			if (getObjectKeys(trimmed).length > 0) {
				return trimmed;
			}
		}
		return object;
	};
	return {
		subset: getObjectSubsetWithContext()(object, subset),
		stripped
	};
}
/**
* Detects if an object is a Standard Schema V1 compatible schema
*/
function isStandardSchema(obj) {
	return !!obj && (typeof obj === "object" || typeof obj === "function") && obj["~standard"] && typeof obj["~standard"].validate === "function";
}

if (!Object.hasOwn(globalThis, MATCHERS_OBJECT)) {
	const globalState = new WeakMap();
	const matchers = Object.create(null);
	const customEqualityTesters = [];
	const asymmetricMatchers = Object.create(null);
	Object.defineProperty(globalThis, MATCHERS_OBJECT, { get: () => globalState });
	Object.defineProperty(globalThis, JEST_MATCHERS_OBJECT, {
		configurable: true,
		get: () => ({
			state: globalState.get(globalThis[GLOBAL_EXPECT]),
			matchers,
			customEqualityTesters
		})
	});
	Object.defineProperty(globalThis, ASYMMETRIC_MATCHERS_OBJECT, { get: () => asymmetricMatchers });
}
function getState(expect) {
	return globalThis[MATCHERS_OBJECT].get(expect);
}
function setState(state, expect) {
	const map = globalThis[MATCHERS_OBJECT];
	const current = map.get(expect) || {};
	// so it keeps getters from `testPath`
	const results = Object.defineProperties(current, {
		...Object.getOwnPropertyDescriptors(current),
		...Object.getOwnPropertyDescriptors(state)
	});
	map.set(expect, results);
}

let AsymmetricMatcher$1 = class AsymmetricMatcher {
	// should have "jest" to be compatible with its ecosystem
	$$typeof = Symbol.for("jest.asymmetricMatcher");
	constructor(sample, inverse = false) {
		this.sample = sample;
		this.inverse = inverse;
	}
	getMatcherContext(expect) {
		return {
			...getState(expect || globalThis[GLOBAL_EXPECT]),
			equals,
			isNot: this.inverse,
			customTesters: getCustomEqualityTesters(),
			utils: {
				...getMatcherUtils(),
				diff,
				stringify,
				iterableEquality,
				subsetEquality
			}
		};
	}
};
// implement custom chai/loupe inspect for better AssertionError.message formatting
// https://github.com/chaijs/loupe/blob/9b8a6deabcd50adc056a64fb705896194710c5c6/src/index.ts#L29
// @ts-expect-error computed properties is not supported when isolatedDeclarations is enabled
// FIXME: https://github.com/microsoft/TypeScript/issues/61068
AsymmetricMatcher$1.prototype[Symbol.for("chai/inspect")] = function(options) {
	// minimal pretty-format with simple manual truncation
	const result = stringify(this, options.depth, { min: true });
	if (result.length <= options.truncate) {
		return result;
	}
	return `${this.toString()}{…}`;
};
class StringContaining extends AsymmetricMatcher$1 {
	constructor(sample, inverse = false) {
		if (!isA("String", sample)) {
			throw new Error("Expected is not a string");
		}
		super(sample, inverse);
	}
	asymmetricMatch(other) {
		const result = isA("String", other) && other.includes(this.sample);
		return this.inverse ? !result : result;
	}
	toString() {
		return `String${this.inverse ? "Not" : ""}Containing`;
	}
	getExpectedType() {
		return "string";
	}
}
class Anything extends AsymmetricMatcher$1 {
	asymmetricMatch(other) {
		return other != null;
	}
	toString() {
		return "Anything";
	}
	toAsymmetricMatcher() {
		return "Anything";
	}
}
class ObjectContaining extends AsymmetricMatcher$1 {
	constructor(sample, inverse = false) {
		super(sample, inverse);
	}
	getPrototype(obj) {
		if (Object.getPrototypeOf) {
			return Object.getPrototypeOf(obj);
		}
		if (obj.constructor.prototype === obj) {
			return null;
		}
		return obj.constructor.prototype;
	}
	hasProperty(obj, property) {
		if (!obj) {
			return false;
		}
		if (Object.hasOwn(obj, property)) {
			return true;
		}
		return this.hasProperty(this.getPrototype(obj), property);
	}
	getProperties(obj) {
		return [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj).filter((s) => {
			var _Object$getOwnPropert;
			return (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(obj, s)) === null || _Object$getOwnPropert === void 0 ? void 0 : _Object$getOwnPropert.enumerable;
		})];
	}
	asymmetricMatch(other, customTesters) {
		if (typeof this.sample !== "object") {
			throw new TypeError(`You must provide an object to ${this.toString()}, not '${typeof this.sample}'.`);
		}
		let result = true;
		const properties = this.getProperties(this.sample);
		for (const property of properties) {
			var _Object$getOwnPropert2, _Object$getOwnPropert3;
			if (!this.hasProperty(other, property)) {
				result = false;
				break;
			}
			const value = ((_Object$getOwnPropert2 = Object.getOwnPropertyDescriptor(this.sample, property)) === null || _Object$getOwnPropert2 === void 0 ? void 0 : _Object$getOwnPropert2.value) ?? this.sample[property];
			const otherValue = ((_Object$getOwnPropert3 = Object.getOwnPropertyDescriptor(other, property)) === null || _Object$getOwnPropert3 === void 0 ? void 0 : _Object$getOwnPropert3.value) ?? other[property];
			if (!equals(value, otherValue, customTesters)) {
				result = false;
				break;
			}
		}
		return this.inverse ? !result : result;
	}
	toString() {
		return `Object${this.inverse ? "Not" : ""}Containing`;
	}
	getExpectedType() {
		return "object";
	}
}
class ArrayContaining extends AsymmetricMatcher$1 {
	constructor(sample, inverse = false) {
		super(sample, inverse);
	}
	asymmetricMatch(other, customTesters) {
		if (!Array.isArray(this.sample)) {
			throw new TypeError(`You must provide an array to ${this.toString()}, not '${typeof this.sample}'.`);
		}
		const result = this.sample.length === 0 || Array.isArray(other) && this.sample.every((item) => other.some((another) => equals(item, another, customTesters)));
		return this.inverse ? !result : result;
	}
	toString() {
		return `Array${this.inverse ? "Not" : ""}Containing`;
	}
	getExpectedType() {
		return "array";
	}
}
class Any extends AsymmetricMatcher$1 {
	constructor(sample) {
		if (typeof sample === "undefined") {
			throw new TypeError("any() expects to be passed a constructor function. " + "Please pass one or use anything() to match any object.");
		}
		super(sample);
	}
	fnNameFor(func) {
		if (func.name) {
			return func.name;
		}
		const functionToString = Function.prototype.toString;
		const matches = functionToString.call(func).match(/^(?:async)?\s*function\s*(?:\*\s*)?([\w$]+)\s*\(/);
		return matches ? matches[1] : "<anonymous>";
	}
	asymmetricMatch(other) {
		if (this.sample === String) {
			return typeof other == "string" || other instanceof String;
		}
		if (this.sample === Number) {
			return typeof other == "number" || other instanceof Number;
		}
		if (this.sample === Function) {
			return typeof other == "function" || typeof other === "function";
		}
		if (this.sample === Boolean) {
			return typeof other == "boolean" || other instanceof Boolean;
		}
		if (this.sample === BigInt) {
			return typeof other == "bigint" || other instanceof BigInt;
		}
		if (this.sample === Symbol) {
			return typeof other == "symbol" || other instanceof Symbol;
		}
		if (this.sample === Object) {
			return typeof other == "object";
		}
		return other instanceof this.sample;
	}
	toString() {
		return "Any";
	}
	getExpectedType() {
		if (this.sample === String) {
			return "string";
		}
		if (this.sample === Number) {
			return "number";
		}
		if (this.sample === Function) {
			return "function";
		}
		if (this.sample === Object) {
			return "object";
		}
		if (this.sample === Boolean) {
			return "boolean";
		}
		return this.fnNameFor(this.sample);
	}
	toAsymmetricMatcher() {
		return `Any<${this.fnNameFor(this.sample)}>`;
	}
}
class StringMatching extends AsymmetricMatcher$1 {
	constructor(sample, inverse = false) {
		if (!isA("String", sample) && !isA("RegExp", sample)) {
			throw new Error("Expected is not a String or a RegExp");
		}
		super(new RegExp(sample), inverse);
	}
	asymmetricMatch(other) {
		const result = isA("String", other) && this.sample.test(other);
		return this.inverse ? !result : result;
	}
	toString() {
		return `String${this.inverse ? "Not" : ""}Matching`;
	}
	getExpectedType() {
		return "string";
	}
}
class CloseTo extends AsymmetricMatcher$1 {
	precision;
	constructor(sample, precision = 2, inverse = false) {
		if (!isA("Number", sample)) {
			throw new Error("Expected is not a Number");
		}
		if (!isA("Number", precision)) {
			throw new Error("Precision is not a Number");
		}
		super(sample);
		this.inverse = inverse;
		this.precision = precision;
	}
	asymmetricMatch(other) {
		if (!isA("Number", other)) {
			return false;
		}
		let result = false;
		if (other === Number.POSITIVE_INFINITY && this.sample === Number.POSITIVE_INFINITY) {
			result = true;
		} else if (other === Number.NEGATIVE_INFINITY && this.sample === Number.NEGATIVE_INFINITY) {
			result = true;
		} else {
			result = Math.abs(this.sample - other) < 10 ** -this.precision / 2;
		}
		return this.inverse ? !result : result;
	}
	toString() {
		return `Number${this.inverse ? "Not" : ""}CloseTo`;
	}
	getExpectedType() {
		return "number";
	}
	toAsymmetricMatcher() {
		return [
			this.toString(),
			this.sample,
			`(${pluralize("digit", this.precision)})`
		].join(" ");
	}
}
class SchemaMatching extends AsymmetricMatcher$1 {
	result;
	constructor(sample, inverse = false) {
		if (!isStandardSchema(sample)) {
			throw new TypeError("SchemaMatching expected to receive a Standard Schema.");
		}
		super(sample, inverse);
	}
	asymmetricMatch(other) {
		const result = this.sample["~standard"].validate(other);
		// Check if the result is a Promise (async validation)
		if (result instanceof Promise) {
			throw new TypeError("Async schema validation is not supported in asymmetric matchers.");
		}
		this.result = result;
		const pass = !this.result.issues || this.result.issues.length === 0;
		return this.inverse ? !pass : pass;
	}
	toString() {
		return `Schema${this.inverse ? "Not" : ""}Matching`;
	}
	getExpectedType() {
		return "object";
	}
	toAsymmetricMatcher() {
		var _this$result;
		const { utils } = this.getMatcherContext();
		const issues = ((_this$result = this.result) === null || _this$result === void 0 ? void 0 : _this$result.issues) || [];
		if (issues.length > 0) {
			return `${this.toString()} ${utils.stringify(this.result, undefined, { printBasicPrototype: false })}`;
		}
		return this.toString();
	}
}
const JestAsymmetricMatchers = (chai, utils) => {
	utils.addMethod(chai.expect, "anything", () => new Anything());
	utils.addMethod(chai.expect, "any", (expected) => new Any(expected));
	utils.addMethod(chai.expect, "stringContaining", (expected) => new StringContaining(expected));
	utils.addMethod(chai.expect, "objectContaining", (expected) => new ObjectContaining(expected));
	utils.addMethod(chai.expect, "arrayContaining", (expected) => new ArrayContaining(expected));
	utils.addMethod(chai.expect, "stringMatching", (expected) => new StringMatching(expected));
	utils.addMethod(chai.expect, "closeTo", (expected, precision) => new CloseTo(expected, precision));
	utils.addMethod(chai.expect, "schemaMatching", (expected) => new SchemaMatching(expected));
	// defineProperty does not work
	chai.expect.not = {
		stringContaining: (expected) => new StringContaining(expected, true),
		objectContaining: (expected) => new ObjectContaining(expected, true),
		arrayContaining: (expected) => new ArrayContaining(expected, true),
		stringMatching: (expected) => new StringMatching(expected, true),
		closeTo: (expected, precision) => new CloseTo(expected, precision, true),
		schemaMatching: (expected) => new SchemaMatching(expected, true)
	};
};

function createAssertionMessage$1(util, assertion, hasArgs) {
	const not = util.flag(assertion, "negate") ? "not." : "";
	const name = `${util.flag(assertion, "_name")}(${hasArgs ? "expected" : ""})`;
	const promiseName = util.flag(assertion, "promise");
	const promise = promiseName ? `.${promiseName}` : "";
	return `expect(actual)${promise}.${not}${name}`;
}
function recordAsyncExpect$1(_test, promise, assertion, error) {
	const test = _test;
	// record promise for test, that resolves before test ends
	if (test && promise instanceof Promise) {
		// if promise is explicitly awaited, remove it from the list
		promise = promise.finally(() => {
			if (!test.promises) {
				return;
			}
			const index = test.promises.indexOf(promise);
			if (index !== -1) {
				test.promises.splice(index, 1);
			}
		});
		// record promise
		if (!test.promises) {
			test.promises = [];
		}
		test.promises.push(promise);
		let resolved = false;
		test.onFinished ?? (test.onFinished = []);
		test.onFinished.push(() => {
			if (!resolved) {
				var _vitest_worker__;
				const processor = ((_vitest_worker__ = globalThis.__vitest_worker__) === null || _vitest_worker__ === void 0 ? void 0 : _vitest_worker__.onFilterStackTrace) || ((s) => s || "");
				const stack = processor(error.stack);
				console.warn([
					`Promise returned by \`${assertion}\` was not awaited. `,
					"Vitest currently auto-awaits hanging assertions at the end of the test, but this will cause the test to fail in Vitest 3. ",
					"Please remember to await the assertion.\n",
					stack
				].join(""));
			}
		});
		return {
			then(onFulfilled, onRejected) {
				resolved = true;
				return promise.then(onFulfilled, onRejected);
			},
			catch(onRejected) {
				return promise.catch(onRejected);
			},
			finally(onFinally) {
				return promise.finally(onFinally);
			},
			[Symbol.toStringTag]: "Promise"
		};
	}
	return promise;
}
function handleTestError(test, err) {
	var _test$result;
	test.result || (test.result = { state: "fail" });
	test.result.state = "fail";
	(_test$result = test.result).errors || (_test$result.errors = []);
	test.result.errors.push(processError(err));
}
function wrapAssertion(utils, name, fn) {
	return function(...args) {
		// private
		if (name !== "withTest") {
			utils.flag(this, "_name", name);
		}
		if (!utils.flag(this, "soft")) {
			return fn.apply(this, args);
		}
		const test = utils.flag(this, "vitest-test");
		if (!test) {
			throw new Error("expect.soft() can only be used inside a test");
		}
		try {
			const result = fn.apply(this, args);
			if (result && typeof result === "object" && typeof result.then === "function") {
				return result.then(noop, (err) => {
					handleTestError(test, err);
				});
			}
			return result;
		} catch (err) {
			handleTestError(test, err);
		}
	};
}

// Jest Expect Compact
const JestChaiExpect = (chai, utils) => {
	const { AssertionError } = chai;
	const customTesters = getCustomEqualityTesters();
	function def(name, fn) {
		const addMethod = (n) => {
			const softWrapper = wrapAssertion(utils, n, fn);
			utils.addMethod(chai.Assertion.prototype, n, softWrapper);
			utils.addMethod(globalThis[JEST_MATCHERS_OBJECT].matchers, n, softWrapper);
		};
		if (Array.isArray(name)) {
			name.forEach((n) => addMethod(n));
		} else {
			addMethod(name);
		}
	}
	[
		"throw",
		"throws",
		"Throw"
	].forEach((m) => {
		utils.overwriteMethod(chai.Assertion.prototype, m, (_super) => {
			return function(...args) {
				const promise = utils.flag(this, "promise");
				const object = utils.flag(this, "object");
				const isNot = utils.flag(this, "negate");
				if (promise === "rejects") {
					utils.flag(this, "object", () => {
						throw object;
					});
				} else if (promise === "resolves" && typeof object !== "function") {
					if (!isNot) {
						const message = utils.flag(this, "message") || "expected promise to throw an error, but it didn't";
						const error = { showDiff: false };
						throw new AssertionError(message, error, utils.flag(this, "ssfi"));
					} else {
						return;
					}
				}
				_super.apply(this, args);
			};
		});
	});
	// @ts-expect-error @internal
	def("withTest", function(test) {
		utils.flag(this, "vitest-test", test);
		return this;
	});
	def("toEqual", function(expected) {
		const actual = utils.flag(this, "object");
		const equal = equals(actual, expected, [...customTesters, iterableEquality]);
		return this.assert(equal, "expected #{this} to deeply equal #{exp}", "expected #{this} to not deeply equal #{exp}", expected, actual);
	});
	def("toStrictEqual", function(expected) {
		const obj = utils.flag(this, "object");
		const equal = equals(obj, expected, [
			...customTesters,
			iterableEquality,
			typeEquality,
			sparseArrayEquality,
			arrayBufferEquality
		], true);
		return this.assert(equal, "expected #{this} to strictly equal #{exp}", "expected #{this} to not strictly equal #{exp}", expected, obj);
	});
	def("toBe", function(expected) {
		const actual = this._obj;
		const pass = Object.is(actual, expected);
		let deepEqualityName = "";
		if (!pass) {
			const toStrictEqualPass = equals(actual, expected, [
				...customTesters,
				iterableEquality,
				typeEquality,
				sparseArrayEquality,
				arrayBufferEquality
			], true);
			if (toStrictEqualPass) {
				deepEqualityName = "toStrictEqual";
			} else {
				const toEqualPass = equals(actual, expected, [...customTesters, iterableEquality]);
				if (toEqualPass) {
					deepEqualityName = "toEqual";
				}
			}
		}
		return this.assert(pass, generateToBeMessage(deepEqualityName), "expected #{this} not to be #{exp} // Object.is equality", expected, actual);
	});
	def("toMatchObject", function(expected) {
		const actual = this._obj;
		const pass = equals(actual, expected, [
			...customTesters,
			iterableEquality,
			subsetEquality
		]);
		const isNot = utils.flag(this, "negate");
		const { subset: actualSubset, stripped } = getObjectSubset(actual, expected, customTesters);
		if (pass && isNot || !pass && !isNot) {
			const msg = utils.getMessage(this, [
				pass,
				"expected #{this} to match object #{exp}",
				"expected #{this} to not match object #{exp}",
				expected,
				actualSubset,
				false
			]);
			const message = stripped === 0 ? msg : `${msg}\n(${stripped} matching ${stripped === 1 ? "property" : "properties"} omitted from actual)`;
			throw new AssertionError(message, {
				showDiff: true,
				expected,
				actual: actualSubset
			});
		}
	});
	def("toMatch", function(expected) {
		const actual = this._obj;
		if (typeof actual !== "string") {
			throw new TypeError(`.toMatch() expects to receive a string, but got ${typeof actual}`);
		}
		return this.assert(typeof expected === "string" ? actual.includes(expected) : actual.match(expected), `expected #{this} to match #{exp}`, `expected #{this} not to match #{exp}`, expected, actual);
	});
	def("toContain", function(item) {
		const actual = this._obj;
		if (typeof Node !== "undefined" && actual instanceof Node) {
			if (!(item instanceof Node)) {
				throw new TypeError(`toContain() expected a DOM node as the argument, but got ${typeof item}`);
			}
			return this.assert(actual.contains(item), "expected #{this} to contain element #{exp}", "expected #{this} not to contain element #{exp}", item, actual);
		}
		if (typeof DOMTokenList !== "undefined" && actual instanceof DOMTokenList) {
			assertTypes(item, "class name", ["string"]);
			const isNot = utils.flag(this, "negate");
			const expectedClassList = isNot ? actual.value.replace(item, "").trim() : `${actual.value} ${item}`;
			return this.assert(actual.contains(item), `expected "${actual.value}" to contain "${item}"`, `expected "${actual.value}" not to contain "${item}"`, expectedClassList, actual.value);
		}
		// handle simple case on our own using `this.assert` to include diff in error message
		if (typeof actual === "string" && typeof item === "string") {
			return this.assert(actual.includes(item), `expected #{this} to contain #{exp}`, `expected #{this} not to contain #{exp}`, item, actual);
		}
		// make "actual" indexable to have compatibility with jest
		if (actual != null && typeof actual !== "string") {
			utils.flag(this, "object", Array.from(actual));
		}
		return this.contain(item);
	});
	def("toContainEqual", function(expected) {
		const obj = utils.flag(this, "object");
		const index = Array.from(obj).findIndex((item) => {
			return equals(item, expected, customTesters);
		});
		this.assert(index !== -1, "expected #{this} to deep equally contain #{exp}", "expected #{this} to not deep equally contain #{exp}", expected);
	});
	def("toBeTruthy", function() {
		const obj = utils.flag(this, "object");
		this.assert(Boolean(obj), "expected #{this} to be truthy", "expected #{this} to not be truthy", true, obj);
	});
	def("toBeFalsy", function() {
		const obj = utils.flag(this, "object");
		this.assert(!obj, "expected #{this} to be falsy", "expected #{this} to not be falsy", false, obj);
	});
	def("toBeGreaterThan", function(expected) {
		const actual = this._obj;
		assertTypes(actual, "actual", ["number", "bigint"]);
		assertTypes(expected, "expected", ["number", "bigint"]);
		return this.assert(actual > expected, `expected ${actual} to be greater than ${expected}`, `expected ${actual} to be not greater than ${expected}`, expected, actual, false);
	});
	def("toBeGreaterThanOrEqual", function(expected) {
		const actual = this._obj;
		assertTypes(actual, "actual", ["number", "bigint"]);
		assertTypes(expected, "expected", ["number", "bigint"]);
		return this.assert(actual >= expected, `expected ${actual} to be greater than or equal to ${expected}`, `expected ${actual} to be not greater than or equal to ${expected}`, expected, actual, false);
	});
	def("toBeLessThan", function(expected) {
		const actual = this._obj;
		assertTypes(actual, "actual", ["number", "bigint"]);
		assertTypes(expected, "expected", ["number", "bigint"]);
		return this.assert(actual < expected, `expected ${actual} to be less than ${expected}`, `expected ${actual} to be not less than ${expected}`, expected, actual, false);
	});
	def("toBeLessThanOrEqual", function(expected) {
		const actual = this._obj;
		assertTypes(actual, "actual", ["number", "bigint"]);
		assertTypes(expected, "expected", ["number", "bigint"]);
		return this.assert(actual <= expected, `expected ${actual} to be less than or equal to ${expected}`, `expected ${actual} to be not less than or equal to ${expected}`, expected, actual, false);
	});
	def("toBeNaN", function() {
		const obj = utils.flag(this, "object");
		this.assert(Number.isNaN(obj), "expected #{this} to be NaN", "expected #{this} not to be NaN", Number.NaN, obj);
	});
	def("toBeUndefined", function() {
		const obj = utils.flag(this, "object");
		this.assert(undefined === obj, "expected #{this} to be undefined", "expected #{this} not to be undefined", undefined, obj);
	});
	def("toBeNull", function() {
		const obj = utils.flag(this, "object");
		this.assert(obj === null, "expected #{this} to be null", "expected #{this} not to be null", null, obj);
	});
	def("toBeNullable", function() {
		const obj = utils.flag(this, "object");
		this.assert(obj == null, "expected #{this} to be nullish", "expected #{this} not to be nullish", null, obj);
	});
	def("toBeDefined", function() {
		const obj = utils.flag(this, "object");
		this.assert(typeof obj !== "undefined", "expected #{this} to be defined", "expected #{this} to be undefined", obj);
	});
	def("toBeTypeOf", function(expected) {
		const actual = typeof this._obj;
		const equal = expected === actual;
		return this.assert(equal, "expected #{this} to be type of #{exp}", "expected #{this} not to be type of #{exp}", expected, actual);
	});
	def("toBeInstanceOf", function(obj) {
		return this.instanceOf(obj);
	});
	def("toHaveLength", function(length) {
		return this.have.length(length);
	});
	// destructuring, because it checks `arguments` inside, and value is passing as `undefined`
	def("toHaveProperty", function(...args) {
		if (Array.isArray(args[0])) {
			args[0] = args[0].map((key) => String(key).replace(/([.[\]])/g, "\\$1")).join(".");
		}
		const actual = this._obj;
		const [propertyName, expected] = args;
		const getValue = () => {
			const hasOwn = Object.hasOwn(actual, propertyName);
			if (hasOwn) {
				return {
					value: actual[propertyName],
					exists: true
				};
			}
			return utils.getPathInfo(actual, propertyName);
		};
		const { value, exists } = getValue();
		const pass = exists && (args.length === 1 || equals(expected, value, customTesters));
		const valueString = args.length === 1 ? "" : ` with value ${utils.objDisplay(expected)}`;
		return this.assert(pass, `expected #{this} to have property "${propertyName}"${valueString}`, `expected #{this} to not have property "${propertyName}"${valueString}`, expected, exists ? value : undefined);
	});
	def("toBeCloseTo", function(received, precision = 2) {
		const expected = this._obj;
		let pass = false;
		let expectedDiff = 0;
		let receivedDiff = 0;
		if (received === Number.POSITIVE_INFINITY && expected === Number.POSITIVE_INFINITY) {
			pass = true;
		} else if (received === Number.NEGATIVE_INFINITY && expected === Number.NEGATIVE_INFINITY) {
			pass = true;
		} else {
			expectedDiff = 10 ** -precision / 2;
			receivedDiff = Math.abs(expected - received);
			pass = receivedDiff < expectedDiff;
		}
		return this.assert(pass, `expected #{this} to be close to #{exp}, received difference is ${receivedDiff}, but expected ${expectedDiff}`, `expected #{this} to not be close to #{exp}, received difference is ${receivedDiff}, but expected ${expectedDiff}`, received, expected, false);
	});
	function assertIsMock(assertion) {
		if (!isMockFunction(assertion._obj)) {
			throw new TypeError(`${utils.inspect(assertion._obj)} is not a spy or a call to a spy!`);
		}
	}
	function getSpy(assertion) {
		assertIsMock(assertion);
		return assertion._obj;
	}
	def(["toHaveBeenCalledTimes", "toBeCalledTimes"], function(number) {
		const spy = getSpy(this);
		const spyName = spy.getMockName();
		const callCount = spy.mock.calls.length;
		return this.assert(callCount === number, `expected "${spyName}" to be called #{exp} times, but got ${callCount} times`, `expected "${spyName}" to not be called #{exp} times`, number, callCount, false);
	});
	def("toHaveBeenCalledOnce", function() {
		const spy = getSpy(this);
		const spyName = spy.getMockName();
		const callCount = spy.mock.calls.length;
		return this.assert(callCount === 1, `expected "${spyName}" to be called once, but got ${callCount} times`, `expected "${spyName}" to not be called once`, 1, callCount, false);
	});
	def(["toHaveBeenCalled", "toBeCalled"], function() {
		const spy = getSpy(this);
		const spyName = spy.getMockName();
		const callCount = spy.mock.calls.length;
		const called = callCount > 0;
		const isNot = utils.flag(this, "negate");
		let msg = utils.getMessage(this, [
			called,
			`expected "${spyName}" to be called at least once`,
			`expected "${spyName}" to not be called at all, but actually been called ${callCount} times`,
			true,
			called
		]);
		if (called && isNot) {
			msg = formatCalls(spy, msg);
		}
		if (called && isNot || !called && !isNot) {
			throw new AssertionError(msg);
		}
	});
	// manually compare array elements since `jestEquals` cannot
	// apply asymmetric matcher to `undefined` array element.
	function equalsArgumentArray(a, b) {
		return a.length === b.length && a.every((aItem, i) => equals(aItem, b[i], [...customTesters, iterableEquality]));
	}
	def(["toHaveBeenCalledWith", "toBeCalledWith"], function(...args) {
		const spy = getSpy(this);
		const spyName = spy.getMockName();
		const pass = spy.mock.calls.some((callArg) => equalsArgumentArray(callArg, args));
		const isNot = utils.flag(this, "negate");
		const msg = utils.getMessage(this, [
			pass,
			`expected "${spyName}" to be called with arguments: #{exp}`,
			`expected "${spyName}" to not be called with arguments: #{exp}`,
			args
		]);
		if (pass && isNot || !pass && !isNot) {
			throw new AssertionError(formatCalls(spy, msg, args));
		}
	});
	def("toHaveBeenCalledExactlyOnceWith", function(...args) {
		const spy = getSpy(this);
		const spyName = spy.getMockName();
		const callCount = spy.mock.calls.length;
		const hasCallWithArgs = spy.mock.calls.some((callArg) => equalsArgumentArray(callArg, args));
		const pass = hasCallWithArgs && callCount === 1;
		const isNot = utils.flag(this, "negate");
		const msg = utils.getMessage(this, [
			pass,
			`expected "${spyName}" to be called once with arguments: #{exp}`,
			`expected "${spyName}" to not be called once with arguments: #{exp}`,
			args
		]);
		if (pass && isNot || !pass && !isNot) {
			throw new AssertionError(formatCalls(spy, msg, args));
		}
	});
	def(["toHaveBeenNthCalledWith", "nthCalledWith"], function(times, ...args) {
		const spy = getSpy(this);
		const spyName = spy.getMockName();
		const nthCall = spy.mock.calls[times - 1];
		const callCount = spy.mock.calls.length;
		const isCalled = times <= callCount;
		this.assert(nthCall && equalsArgumentArray(nthCall, args), `expected ${ordinalOf(times)} "${spyName}" call to have been called with #{exp}${isCalled ? `` : `, but called only ${callCount} times`}`, `expected ${ordinalOf(times)} "${spyName}" call to not have been called with #{exp}`, args, nthCall, isCalled);
	});
	def(["toHaveBeenLastCalledWith", "lastCalledWith"], function(...args) {
		const spy = getSpy(this);
		const spyName = spy.getMockName();
		const lastCall = spy.mock.calls.at(-1);
		this.assert(lastCall && equalsArgumentArray(lastCall, args), `expected last "${spyName}" call to have been called with #{exp}`, `expected last "${spyName}" call to not have been called with #{exp}`, args, lastCall);
	});
	/**
	* Used for `toHaveBeenCalledBefore` and `toHaveBeenCalledAfter` to determine if the expected spy was called before the result spy.
	*/
	function isSpyCalledBeforeAnotherSpy(beforeSpy, afterSpy, failIfNoFirstInvocation) {
		const beforeInvocationCallOrder = beforeSpy.mock.invocationCallOrder;
		const afterInvocationCallOrder = afterSpy.mock.invocationCallOrder;
		if (beforeInvocationCallOrder.length === 0) {
			return !failIfNoFirstInvocation;
		}
		if (afterInvocationCallOrder.length === 0) {
			return false;
		}
		return beforeInvocationCallOrder[0] < afterInvocationCallOrder[0];
	}
	def(["toHaveBeenCalledBefore"], function(resultSpy, failIfNoFirstInvocation = true) {
		const expectSpy = getSpy(this);
		if (!isMockFunction(resultSpy)) {
			throw new TypeError(`${utils.inspect(resultSpy)} is not a spy or a call to a spy`);
		}
		this.assert(isSpyCalledBeforeAnotherSpy(expectSpy, resultSpy, failIfNoFirstInvocation), `expected "${expectSpy.getMockName()}" to have been called before "${resultSpy.getMockName()}"`, `expected "${expectSpy.getMockName()}" to not have been called before "${resultSpy.getMockName()}"`, resultSpy, expectSpy);
	});
	def(["toHaveBeenCalledAfter"], function(resultSpy, failIfNoFirstInvocation = true) {
		const expectSpy = getSpy(this);
		if (!isMockFunction(resultSpy)) {
			throw new TypeError(`${utils.inspect(resultSpy)} is not a spy or a call to a spy`);
		}
		this.assert(isSpyCalledBeforeAnotherSpy(resultSpy, expectSpy, failIfNoFirstInvocation), `expected "${expectSpy.getMockName()}" to have been called after "${resultSpy.getMockName()}"`, `expected "${expectSpy.getMockName()}" to not have been called after "${resultSpy.getMockName()}"`, resultSpy, expectSpy);
	});
	def(["toThrow", "toThrowError"], function(expected) {
		if (typeof expected === "string" || typeof expected === "undefined" || expected instanceof RegExp) {
			// Fixes the issue related to `chai` <https://github.com/vitest-dev/vitest/issues/6618>
			return this.throws(expected === "" ? /^$/ : expected);
		}
		const obj = this._obj;
		const promise = utils.flag(this, "promise");
		const isNot = utils.flag(this, "negate");
		let thrown = null;
		if (promise === "rejects") {
			thrown = obj;
		} else if (promise === "resolves" && typeof obj !== "function") {
			if (!isNot) {
				const message = utils.flag(this, "message") || "expected promise to throw an error, but it didn't";
				const error = { showDiff: false };
				throw new AssertionError(message, error, utils.flag(this, "ssfi"));
			} else {
				return;
			}
		} else {
			let isThrow = false;
			try {
				obj();
			} catch (err) {
				isThrow = true;
				thrown = err;
			}
			if (!isThrow && !isNot) {
				const message = utils.flag(this, "message") || "expected function to throw an error, but it didn't";
				const error = { showDiff: false };
				throw new AssertionError(message, error, utils.flag(this, "ssfi"));
			}
		}
		if (typeof expected === "function") {
			const name = expected.name || expected.prototype.constructor.name;
			return this.assert(thrown && thrown instanceof expected, `expected error to be instance of ${name}`, `expected error not to be instance of ${name}`, expected, thrown);
		}
		if (expected instanceof Error) {
			const equal = equals(thrown, expected, [...customTesters, iterableEquality]);
			return this.assert(equal, "expected a thrown error to be #{exp}", "expected a thrown error not to be #{exp}", expected, thrown);
		}
		if (typeof expected === "object" && "asymmetricMatch" in expected && typeof expected.asymmetricMatch === "function") {
			const matcher = expected;
			return this.assert(thrown && matcher.asymmetricMatch(thrown), "expected error to match asymmetric matcher", "expected error not to match asymmetric matcher", matcher, thrown);
		}
		throw new Error(`"toThrow" expects string, RegExp, function, Error instance or asymmetric matcher, got "${typeof expected}"`);
	});
	[{
		name: "toHaveResolved",
		condition: (spy) => spy.mock.settledResults.length > 0 && spy.mock.settledResults.some(({ type }) => type === "fulfilled"),
		action: "resolved"
	}, {
		name: ["toHaveReturned", "toReturn"],
		condition: (spy) => spy.mock.calls.length > 0 && spy.mock.results.some(({ type }) => type !== "throw"),
		action: "called"
	}].forEach(({ name, condition, action }) => {
		def(name, function() {
			const spy = getSpy(this);
			const spyName = spy.getMockName();
			const pass = condition(spy);
			this.assert(pass, `expected "${spyName}" to be successfully ${action} at least once`, `expected "${spyName}" to not be successfully ${action}`, pass, !pass, false);
		});
	});
	[{
		name: "toHaveResolvedTimes",
		condition: (spy, times) => spy.mock.settledResults.reduce((s, { type }) => type === "fulfilled" ? ++s : s, 0) === times,
		action: "resolved"
	}, {
		name: ["toHaveReturnedTimes", "toReturnTimes"],
		condition: (spy, times) => spy.mock.results.reduce((s, { type }) => type === "throw" ? s : ++s, 0) === times,
		action: "called"
	}].forEach(({ name, condition, action }) => {
		def(name, function(times) {
			const spy = getSpy(this);
			const spyName = spy.getMockName();
			const pass = condition(spy, times);
			this.assert(pass, `expected "${spyName}" to be successfully ${action} ${times} times`, `expected "${spyName}" to not be successfully ${action} ${times} times`, `expected resolved times: ${times}`, `received resolved times: ${pass}`, false);
		});
	});
	[{
		name: "toHaveResolvedWith",
		condition: (spy, value) => spy.mock.settledResults.some(({ type, value: result }) => type === "fulfilled" && equals(value, result)),
		action: "resolve"
	}, {
		name: ["toHaveReturnedWith", "toReturnWith"],
		condition: (spy, value) => spy.mock.results.some(({ type, value: result }) => type === "return" && equals(value, result)),
		action: "return"
	}].forEach(({ name, condition, action }) => {
		def(name, function(value) {
			const spy = getSpy(this);
			const pass = condition(spy, value);
			const isNot = utils.flag(this, "negate");
			if (pass && isNot || !pass && !isNot) {
				const spyName = spy.getMockName();
				const msg = utils.getMessage(this, [
					pass,
					`expected "${spyName}" to ${action} with: #{exp} at least once`,
					`expected "${spyName}" to not ${action} with: #{exp}`,
					value
				]);
				const results = action === "return" ? spy.mock.results : spy.mock.settledResults;
				throw new AssertionError(formatReturns(spy, results, msg, value));
			}
		});
	});
	[{
		name: "toHaveLastResolvedWith",
		condition: (spy, value) => {
			const result = spy.mock.settledResults.at(-1);
			return Boolean(result && result.type === "fulfilled" && equals(result.value, value));
		},
		action: "resolve"
	}, {
		name: ["toHaveLastReturnedWith", "lastReturnedWith"],
		condition: (spy, value) => {
			const result = spy.mock.results.at(-1);
			return Boolean(result && result.type === "return" && equals(result.value, value));
		},
		action: "return"
	}].forEach(({ name, condition, action }) => {
		def(name, function(value) {
			const spy = getSpy(this);
			const results = action === "return" ? spy.mock.results : spy.mock.settledResults;
			const result = results.at(-1);
			const spyName = spy.getMockName();
			this.assert(condition(spy, value), `expected last "${spyName}" call to ${action} #{exp}`, `expected last "${spyName}" call to not ${action} #{exp}`, value, result === null || result === void 0 ? void 0 : result.value);
		});
	});
	[{
		name: "toHaveNthResolvedWith",
		condition: (spy, index, value) => {
			const result = spy.mock.settledResults[index - 1];
			return result && result.type === "fulfilled" && equals(result.value, value);
		},
		action: "resolve"
	}, {
		name: ["toHaveNthReturnedWith", "nthReturnedWith"],
		condition: (spy, index, value) => {
			const result = spy.mock.results[index - 1];
			return result && result.type === "return" && equals(result.value, value);
		},
		action: "return"
	}].forEach(({ name, condition, action }) => {
		def(name, function(nthCall, value) {
			const spy = getSpy(this);
			const spyName = spy.getMockName();
			const results = action === "return" ? spy.mock.results : spy.mock.settledResults;
			const result = results[nthCall - 1];
			const ordinalCall = `${ordinalOf(nthCall)} call`;
			this.assert(condition(spy, nthCall, value), `expected ${ordinalCall} "${spyName}" call to ${action} #{exp}`, `expected ${ordinalCall} "${spyName}" call to not ${action} #{exp}`, value, result === null || result === void 0 ? void 0 : result.value);
		});
	});
	// @ts-expect-error @internal
	def("withContext", function(context) {
		for (const key in context) {
			utils.flag(this, key, context[key]);
		}
		return this;
	});
	utils.addProperty(chai.Assertion.prototype, "resolves", function __VITEST_RESOLVES__() {
		const error = new Error("resolves");
		utils.flag(this, "promise", "resolves");
		utils.flag(this, "error", error);
		const test = utils.flag(this, "vitest-test");
		const obj = utils.flag(this, "object");
		if (utils.flag(this, "poll")) {
			throw new SyntaxError(`expect.poll() is not supported in combination with .resolves`);
		}
		if (typeof (obj === null || obj === void 0 ? void 0 : obj.then) !== "function") {
			throw new TypeError(`You must provide a Promise to expect() when using .resolves, not '${typeof obj}'.`);
		}
		const proxy = new Proxy(this, { get: (target, key, receiver) => {
			const result = Reflect.get(target, key, receiver);
			if (typeof result !== "function") {
				return result instanceof chai.Assertion ? proxy : result;
			}
			return (...args) => {
				utils.flag(this, "_name", key);
				const promise = obj.then((value) => {
					utils.flag(this, "object", value);
					return result.call(this, ...args);
				}, (err) => {
					const _error = new AssertionError(`promise rejected "${utils.inspect(err)}" instead of resolving`, { showDiff: false });
					_error.cause = err;
					_error.stack = error.stack.replace(error.message, _error.message);
					throw _error;
				});
				return recordAsyncExpect$1(test, promise, createAssertionMessage$1(utils, this, !!args.length), error);
			};
		} });
		return proxy;
	});
	utils.addProperty(chai.Assertion.prototype, "rejects", function __VITEST_REJECTS__() {
		const error = new Error("rejects");
		utils.flag(this, "promise", "rejects");
		utils.flag(this, "error", error);
		const test = utils.flag(this, "vitest-test");
		const obj = utils.flag(this, "object");
		const wrapper = typeof obj === "function" ? obj() : obj;
		if (utils.flag(this, "poll")) {
			throw new SyntaxError(`expect.poll() is not supported in combination with .rejects`);
		}
		if (typeof (wrapper === null || wrapper === void 0 ? void 0 : wrapper.then) !== "function") {
			throw new TypeError(`You must provide a Promise to expect() when using .rejects, not '${typeof wrapper}'.`);
		}
		const proxy = new Proxy(this, { get: (target, key, receiver) => {
			const result = Reflect.get(target, key, receiver);
			if (typeof result !== "function") {
				return result instanceof chai.Assertion ? proxy : result;
			}
			return (...args) => {
				utils.flag(this, "_name", key);
				const promise = wrapper.then((value) => {
					const _error = new AssertionError(`promise resolved "${utils.inspect(value)}" instead of rejecting`, {
						showDiff: true,
						expected: new Error("rejected promise"),
						actual: value
					});
					_error.stack = error.stack.replace(error.message, _error.message);
					throw _error;
				}, (err) => {
					utils.flag(this, "object", err);
					return result.call(this, ...args);
				});
				return recordAsyncExpect$1(test, promise, createAssertionMessage$1(utils, this, !!args.length), error);
			};
		} });
		return proxy;
	});
};
function ordinalOf(i) {
	const j = i % 10;
	const k = i % 100;
	if (j === 1 && k !== 11) {
		return `${i}st`;
	}
	if (j === 2 && k !== 12) {
		return `${i}nd`;
	}
	if (j === 3 && k !== 13) {
		return `${i}rd`;
	}
	return `${i}th`;
}
function formatCalls(spy, msg, showActualCall) {
	if (spy.mock.calls.length) {
		msg += C.gray(`\n\nReceived: \n\n${spy.mock.calls.map((callArg, i) => {
			let methodCall = C.bold(`  ${ordinalOf(i + 1)} ${spy.getMockName()} call:\n\n`);
			if (showActualCall) {
				methodCall += diff(showActualCall, callArg, { omitAnnotationLines: true });
			} else {
				methodCall += stringify(callArg).split("\n").map((line) => `    ${line}`).join("\n");
			}
			methodCall += "\n";
			return methodCall;
		}).join("\n")}`);
	}
	msg += C.gray(`\n\nNumber of calls: ${C.bold(spy.mock.calls.length)}\n`);
	return msg;
}
function formatReturns(spy, results, msg, showActualReturn) {
	if (results.length) {
		msg += C.gray(`\n\nReceived: \n\n${results.map((callReturn, i) => {
			let methodCall = C.bold(`  ${ordinalOf(i + 1)} ${spy.getMockName()} call return:\n\n`);
			if (showActualReturn) {
				methodCall += diff(showActualReturn, callReturn.value, { omitAnnotationLines: true });
			} else {
				methodCall += stringify(callReturn).split("\n").map((line) => `    ${line}`).join("\n");
			}
			methodCall += "\n";
			return methodCall;
		}).join("\n")}`);
	}
	msg += C.gray(`\n\nNumber of calls: ${C.bold(spy.mock.calls.length)}\n`);
	return msg;
}

function getMatcherState(assertion, expect) {
	const obj = assertion._obj;
	const isNot = utils_exports.flag(assertion, "negate");
	const promise = utils_exports.flag(assertion, "promise") || "";
	const customMessage = utils_exports.flag(assertion, "message");
	const jestUtils = {
		...getMatcherUtils(),
		diff,
		stringify,
		iterableEquality,
		subsetEquality
	};
	let task = utils_exports.flag(assertion, "vitest-test");
	const currentTestName = (task === null || task === void 0 ? void 0 : task.fullTestName) ?? "";
	if ((task === null || task === void 0 ? void 0 : task.type) !== "test") {
		task = undefined;
	}
	const matcherState = {
		...getState(expect),
		task,
		currentTestName,
		customTesters: getCustomEqualityTesters(),
		isNot,
		utils: jestUtils,
		promise,
		equals,
		suppressedErrors: [],
		soft: utils_exports.flag(assertion, "soft"),
		poll: utils_exports.flag(assertion, "poll")
	};
	return {
		state: matcherState,
		isNot,
		obj,
		customMessage
	};
}
class JestExtendError extends Error {
	constructor(message, actual, expected) {
		super(message);
		this.actual = actual;
		this.expected = expected;
	}
}
function JestExtendPlugin(c, expect, matchers) {
	return (_, utils) => {
		Object.entries(matchers).forEach(([expectAssertionName, expectAssertion]) => {
			function expectWrapper(...args) {
				const { state, isNot, obj, customMessage } = getMatcherState(this, expect);
				const result = expectAssertion.call(state, obj, ...args);
				if (result && typeof result === "object" && typeof result.then === "function") {
					const thenable = result;
					return thenable.then(({ pass, message, actual, expected }) => {
						if (pass && isNot || !pass && !isNot) {
							const errorMessage = customMessage != null ? customMessage : message();
							throw new JestExtendError(errorMessage, actual, expected);
						}
					});
				}
				const { pass, message, actual, expected } = result;
				if (pass && isNot || !pass && !isNot) {
					const errorMessage = customMessage != null ? customMessage : message();
					throw new JestExtendError(errorMessage, actual, expected);
				}
			}
			const softWrapper = wrapAssertion(utils, expectAssertionName, expectWrapper);
			utils.addMethod(globalThis[JEST_MATCHERS_OBJECT].matchers, expectAssertionName, softWrapper);
			utils.addMethod(c.Assertion.prototype, expectAssertionName, softWrapper);
			class CustomMatcher extends AsymmetricMatcher$1 {
				constructor(inverse = false, ...sample) {
					super(sample, inverse);
				}
				asymmetricMatch(other) {
					const { pass } = expectAssertion.call(this.getMatcherContext(expect), other, ...this.sample);
					return this.inverse ? !pass : pass;
				}
				toString() {
					return `${this.inverse ? "not." : ""}${expectAssertionName}`;
				}
				getExpectedType() {
					return "any";
				}
				toAsymmetricMatcher() {
					return `${this.toString()}<${this.sample.map((item) => stringify(item)).join(", ")}>`;
				}
			}
			const customMatcher = (...sample) => new CustomMatcher(false, ...sample);
			Object.defineProperty(expect, expectAssertionName, {
				configurable: true,
				enumerable: true,
				value: customMatcher,
				writable: true
			});
			Object.defineProperty(expect.not, expectAssertionName, {
				configurable: true,
				enumerable: true,
				value: (...sample) => new CustomMatcher(true, ...sample),
				writable: true
			});
			// keep track of asymmetric matchers on global so that it can be copied over to local context's `expect`.
			// note that the negated variant is automatically shared since it's assigned on the single `expect.not` object.
			Object.defineProperty(globalThis[ASYMMETRIC_MATCHERS_OBJECT], expectAssertionName, {
				configurable: true,
				enumerable: true,
				value: customMatcher,
				writable: true
			});
		});
	};
}
const JestExtend = (chai, utils) => {
	utils.addMethod(chai.expect, "extend", (expect, expects) => {
		use(JestExtendPlugin(chai, expect, expects));
	});
};

const SAFE_TIMERS_SYMBOL = Symbol("vitest:SAFE_TIMERS");
function getSafeTimers() {
	const { setTimeout: safeSetTimeout, setInterval: safeSetInterval, clearInterval: safeClearInterval, clearTimeout: safeClearTimeout, setImmediate: safeSetImmediate, clearImmediate: safeClearImmediate, queueMicrotask: safeQueueMicrotask } = globalThis[SAFE_TIMERS_SYMBOL] || globalThis;
	const { nextTick: safeNextTick } = globalThis[SAFE_TIMERS_SYMBOL] || globalThis.process || {};
	return {
		nextTick: safeNextTick,
		setTimeout: safeSetTimeout,
		setInterval: safeSetInterval,
		clearInterval: safeClearInterval,
		clearTimeout: safeClearTimeout,
		setImmediate: safeSetImmediate,
		clearImmediate: safeClearImmediate,
		queueMicrotask: safeQueueMicrotask
	};
}
/**
* Returns a promise that resolves after the specified duration.
*
* @param timeout - Delay in milliseconds
* @param scheduler - Timer function to use, defaults to `setTimeout`. Useful for mocked timers.
*
* @example
* await delay(100)
*
* @example
* // With mocked timers
* const { setTimeout } = getSafeTimers()
* await delay(100, setTimeout)
*/
function delay(timeout, scheduler = setTimeout) {
	return new Promise((resolve) => scheduler(resolve, timeout));
}

const _DRIVE_LETTER_START_RE$1 = /^[A-Za-z]:\//;
function normalizeWindowsPath$1(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE$1, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE$1 = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
function cwd$1() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve$1 = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath$1(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd$1();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute$1(path);
  }
  resolvedPath = normalizeString$1(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute$1(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString$1(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute$1 = function(p) {
  return _IS_ABSOLUTE_RE$1.test(p);
};

var chars$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar$1 = new Uint8Array(64);
var charToInt$1 = new Uint8Array(128);
for (let i = 0; i < chars$1.length; i++) {
  const c = chars$1.charCodeAt(i);
  intToChar$1[i] = c;
  charToInt$1[c] = i;
}

const CHROME_IE_STACK_REGEXP$1 = /^\s*at .*(?:\S:\d+|\(native\))/m;
const SAFARI_NATIVE_CODE_REGEXP$1 = /^(?:eval@)?(?:\[native code\])?$/;
function extractLocation$1(urlLike) {
	// Fail-fast but return locations like "(native)"
	if (!urlLike.includes(":")) {
		return [urlLike];
	}
	const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
	const parts = regExp.exec(urlLike.replace(/^\(|\)$/g, ""));
	if (!parts) {
		return [urlLike];
	}
	let url = parts[1];
	if (url.startsWith("async ")) {
		url = url.slice(6);
	}
	if (url.startsWith("http:") || url.startsWith("https:")) {
		const urlObj = new URL(url);
		urlObj.searchParams.delete("import");
		urlObj.searchParams.delete("browserv");
		url = urlObj.pathname + urlObj.hash + urlObj.search;
	}
	if (url.startsWith("/@fs/")) {
		const isWindows = /^\/@fs\/[a-zA-Z]:\//.test(url);
		url = url.slice(isWindows ? 5 : 4);
	}
	return [
		url,
		parts[2] || undefined,
		parts[3] || undefined
	];
}
function parseSingleFFOrSafariStack$1(raw) {
	let line = raw.trim();
	if (SAFARI_NATIVE_CODE_REGEXP$1.test(line)) {
		return null;
	}
	if (line.includes(" > eval")) {
		line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
	}
	// Early return for lines that don't look like Firefox/Safari stack traces
	// Firefox/Safari stack traces must contain '@' and should have location info after it
	if (!line.includes("@")) {
		return null;
	}
	// Find the correct @ that separates function name from location
	// For cases like '@https://@fs/path' or 'functionName@https://@fs/path'
	// we need to find the first @ that precedes a valid location (containing :)
	let atIndex = -1;
	let locationPart = "";
	let functionName;
	// Try each @ from left to right to find the one that gives us a valid location
	for (let i = 0; i < line.length; i++) {
		if (line[i] === "@") {
			const candidateLocation = line.slice(i + 1);
			// Minimum length 3 for valid location: 1 for filename + 1 for colon + 1 for line number (e.g., "a:1")
			if (candidateLocation.includes(":") && candidateLocation.length >= 3) {
				atIndex = i;
				locationPart = candidateLocation;
				functionName = i > 0 ? line.slice(0, i) : undefined;
				break;
			}
		}
	}
	// Validate we found a valid location with minimum length (filename:line format)
	if (atIndex === -1 || !locationPart.includes(":") || locationPart.length < 3) {
		return null;
	}
	const [url, lineNumber, columnNumber] = extractLocation$1(locationPart);
	if (!url || !lineNumber || !columnNumber) {
		return null;
	}
	return {
		file: url,
		method: functionName || "",
		line: Number.parseInt(lineNumber),
		column: Number.parseInt(columnNumber)
	};
}
function parseSingleStack(raw) {
	const line = raw.trim();
	if (!CHROME_IE_STACK_REGEXP$1.test(line)) {
		return parseSingleFFOrSafariStack$1(line);
	}
	return parseSingleV8Stack$1(line);
}
// Based on https://github.com/stacktracejs/error-stack-parser
// Credit to stacktracejs
function parseSingleV8Stack$1(raw) {
	let line = raw.trim();
	if (!CHROME_IE_STACK_REGEXP$1.test(line)) {
		return null;
	}
	if (line.includes("(eval ")) {
		line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, "");
	}
	let sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
	// capture and preserve the parenthesized location "(/foo/my bar.js:12:87)" in
	// case it has spaces in it, as the string is split on \s+ later on
	const location = sanitizedLine.match(/ (\(.+\)$)/);
	// remove the parenthesized location from the line, if it was matched
	sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
	// if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
	// because this line doesn't have function name
	const [url, lineNumber, columnNumber] = extractLocation$1(location ? location[1] : sanitizedLine);
	let method = location && sanitizedLine || "";
	let file = url && ["eval", "<anonymous>"].includes(url) ? undefined : url;
	if (!file || !lineNumber || !columnNumber) {
		return null;
	}
	if (method.startsWith("async ")) {
		method = method.slice(6);
	}
	if (file.startsWith("file://")) {
		file = file.slice(7);
	}
	// normalize Windows path (\ -> /)
	file = file.startsWith("node:") || file.startsWith("internal:") ? file : resolve$1(file);
	if (method) {
		method = method.replace(/__vite_ssr_import_\d+__\./g, "").replace(/(Object\.)?__vite_ssr_export_default__\s?/g, "");
	}
	return {
		method,
		file,
		line: Number.parseInt(lineNumber),
		column: Number.parseInt(columnNumber)
	};
}

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};

function createChainable(keys, fn) {
	function create(context) {
		const chain = function(...args) {
			return fn.apply(context, args);
		};
		Object.assign(chain, fn);
		chain.withContext = () => chain.bind(context);
		chain.setContext = (key, value) => {
			context[key] = value;
		};
		chain.mergeContext = (ctx) => {
			Object.assign(context, ctx);
		};
		for (const key of keys) {
			Object.defineProperty(chain, key, { get() {
				return create({
					...context,
					[key]: true
				});
			} });
		}
		return chain;
	}
	const chain = create({});
	chain.fn = fn;
	return chain;
}
function findTestFileStackTrace(testFilePath, error) {
	// first line is the error message
	const lines = error.split("\n").slice(1);
	for (const line of lines) {
		const stack = parseSingleStack(line);
		if (stack && stack.file === testFilePath) {
			return stack;
		}
	}
}
function getNames(task) {
	const names = [task.name];
	let current = task;
	while (current === null || current === void 0 ? void 0 : current.suite) {
		current = current.suite;
		if (current === null || current === void 0 ? void 0 : current.name) {
			names.unshift(current.name);
		}
	}
	if (current !== task.file) {
		names.unshift(task.file.name);
	}
	return names;
}
function createTaskName(names, separator = " > ") {
	return names.filter((name) => name !== undefined).join(separator);
}

class PendingError extends Error {
	code = "VITEST_PENDING";
	taskId;
	constructor(message, task, note) {
		super(message);
		this.message = message;
		this.note = note;
		this.taskId = task.id;
	}
}

// use WeakMap here to make the Test and Suite object serializable
const fnMap = new WeakMap();
const testFixtureMap = new WeakMap();
const hooksMap = new WeakMap();
function setFn(key, fn) {
	fnMap.set(key, fn);
}
function setTestFixture(key, fixture) {
	testFixtureMap.set(key, fixture);
}
function getTestFixture(key) {
	return testFixtureMap.get(key);
}
function setHooks(key, hooks) {
	hooksMap.set(key, hooks);
}
function getHooks(key) {
	return hooksMap.get(key);
}

function mergeScopedFixtures(testFixtures, scopedFixtures) {
	const scopedFixturesMap = scopedFixtures.reduce((map, fixture) => {
		map[fixture.prop] = fixture;
		return map;
	}, {});
	const newFixtures = {};
	testFixtures.forEach((fixture) => {
		const useFixture = scopedFixturesMap[fixture.prop] || { ...fixture };
		newFixtures[useFixture.prop] = useFixture;
	});
	for (const fixtureKep in newFixtures) {
		var _fixture$deps;
		const fixture = newFixtures[fixtureKep];
		// if the fixture was define before the scope, then its dep
		// will reference the original fixture instead of the scope
		fixture.deps = (_fixture$deps = fixture.deps) === null || _fixture$deps === void 0 ? void 0 : _fixture$deps.map((dep) => newFixtures[dep.prop]);
	}
	return Object.values(newFixtures);
}
function mergeContextFixtures(fixtures, context, runner) {
	const fixtureOptionKeys = [
		"auto",
		"injected",
		"scope"
	];
	const fixtureArray = Object.entries(fixtures).map(([prop, value]) => {
		const fixtureItem = { value };
		if (Array.isArray(value) && value.length >= 2 && isObject$1(value[1]) && Object.keys(value[1]).some((key) => fixtureOptionKeys.includes(key))) {
			var _runner$injectValue;
			// fixture with options
			Object.assign(fixtureItem, value[1]);
			const userValue = value[0];
			fixtureItem.value = fixtureItem.injected ? ((_runner$injectValue = runner.injectValue) === null || _runner$injectValue === void 0 ? void 0 : _runner$injectValue.call(runner, prop)) ?? userValue : userValue;
		}
		fixtureItem.scope = fixtureItem.scope || "test";
		if (fixtureItem.scope === "worker" && !runner.getWorkerContext) {
			fixtureItem.scope = "file";
		}
		fixtureItem.prop = prop;
		fixtureItem.isFn = typeof fixtureItem.value === "function";
		return fixtureItem;
	});
	if (Array.isArray(context.fixtures)) {
		context.fixtures = context.fixtures.concat(fixtureArray);
	} else {
		context.fixtures = fixtureArray;
	}
	// Update dependencies of fixture functions
	fixtureArray.forEach((fixture) => {
		if (fixture.isFn) {
			const usedProps = getUsedProps(fixture.value);
			if (usedProps.length) {
				fixture.deps = context.fixtures.filter(({ prop }) => prop !== fixture.prop && usedProps.includes(prop));
			}
			// test can access anything, so we ignore it
			if (fixture.scope !== "test") {
				var _fixture$deps2;
				(_fixture$deps2 = fixture.deps) === null || _fixture$deps2 === void 0 ? void 0 : _fixture$deps2.forEach((dep) => {
					if (!dep.isFn) {
						// non fn fixtures are always resolved and available to anyone
						return;
					}
					// worker scope can only import from worker scope
					if (fixture.scope === "worker" && dep.scope === "worker") {
						return;
					}
					// file scope an import from file and worker scopes
					if (fixture.scope === "file" && dep.scope !== "test") {
						return;
					}
					throw new SyntaxError(`cannot use the ${dep.scope} fixture "${dep.prop}" inside the ${fixture.scope} fixture "${fixture.prop}"`);
				});
			}
		}
	});
	return context;
}
const fixtureValueMaps = new Map();
const cleanupFnArrayMap = new Map();
function withFixtures(runner, fn, testContext) {
	return (hookContext) => {
		const context = hookContext || testContext;
		if (!context) {
			return fn({});
		}
		const fixtures = getTestFixture(context);
		if (!(fixtures === null || fixtures === void 0 ? void 0 : fixtures.length)) {
			return fn(context);
		}
		const usedProps = getUsedProps(fn);
		const hasAutoFixture = fixtures.some(({ auto }) => auto);
		if (!usedProps.length && !hasAutoFixture) {
			return fn(context);
		}
		if (!fixtureValueMaps.get(context)) {
			fixtureValueMaps.set(context, new Map());
		}
		const fixtureValueMap = fixtureValueMaps.get(context);
		if (!cleanupFnArrayMap.has(context)) {
			cleanupFnArrayMap.set(context, []);
		}
		const cleanupFnArray = cleanupFnArrayMap.get(context);
		const usedFixtures = fixtures.filter(({ prop, auto }) => auto || usedProps.includes(prop));
		const pendingFixtures = resolveDeps(usedFixtures);
		if (!pendingFixtures.length) {
			return fn(context);
		}
		async function resolveFixtures() {
			for (const fixture of pendingFixtures) {
				// fixture could be already initialized during "before" hook
				if (fixtureValueMap.has(fixture)) {
					continue;
				}
				const resolvedValue = await resolveFixtureValue(runner, fixture, context, cleanupFnArray);
				context[fixture.prop] = resolvedValue;
				fixtureValueMap.set(fixture, resolvedValue);
				if (fixture.scope === "test") {
					cleanupFnArray.unshift(() => {
						fixtureValueMap.delete(fixture);
					});
				}
			}
		}
		return resolveFixtures().then(() => fn(context));
	};
}
const globalFixturePromise = new WeakMap();
function resolveFixtureValue(runner, fixture, context, cleanupFnArray) {
	var _runner$getWorkerCont;
	const fileContext = getFileContext(context.task.file);
	const workerContext = (_runner$getWorkerCont = runner.getWorkerContext) === null || _runner$getWorkerCont === void 0 ? void 0 : _runner$getWorkerCont.call(runner);
	if (!fixture.isFn) {
		var _fixture$prop;
		fileContext[_fixture$prop = fixture.prop] ?? (fileContext[_fixture$prop] = fixture.value);
		if (workerContext) {
			var _fixture$prop2;
			workerContext[_fixture$prop2 = fixture.prop] ?? (workerContext[_fixture$prop2] = fixture.value);
		}
		return fixture.value;
	}
	if (fixture.scope === "test") {
		return resolveFixtureFunction(fixture.value, context, cleanupFnArray);
	}
	// in case the test runs in parallel
	if (globalFixturePromise.has(fixture)) {
		return globalFixturePromise.get(fixture);
	}
	let fixtureContext;
	if (fixture.scope === "worker") {
		if (!workerContext) {
			throw new TypeError("[@vitest/runner] The worker context is not available in the current test runner. Please, provide the `getWorkerContext` method when initiating the runner.");
		}
		fixtureContext = workerContext;
	} else {
		fixtureContext = fileContext;
	}
	if (fixture.prop in fixtureContext) {
		return fixtureContext[fixture.prop];
	}
	if (!cleanupFnArrayMap.has(fixtureContext)) {
		cleanupFnArrayMap.set(fixtureContext, []);
	}
	const cleanupFnFileArray = cleanupFnArrayMap.get(fixtureContext);
	const promise = resolveFixtureFunction(fixture.value, fixtureContext, cleanupFnFileArray).then((value) => {
		fixtureContext[fixture.prop] = value;
		globalFixturePromise.delete(fixture);
		return value;
	});
	globalFixturePromise.set(fixture, promise);
	return promise;
}
async function resolveFixtureFunction(fixtureFn, context, cleanupFnArray) {
	// wait for `use` call to extract fixture value
	const useFnArgPromise = createDefer();
	let isUseFnArgResolved = false;
	const fixtureReturn = fixtureFn(context, async (useFnArg) => {
		// extract `use` argument
		isUseFnArgResolved = true;
		useFnArgPromise.resolve(useFnArg);
		// suspend fixture teardown by holding off `useReturnPromise` resolution until cleanup
		const useReturnPromise = createDefer();
		cleanupFnArray.push(async () => {
			// start teardown by resolving `use` Promise
			useReturnPromise.resolve();
			// wait for finishing teardown
			await fixtureReturn;
		});
		await useReturnPromise;
	}).catch((e) => {
		// treat fixture setup error as test failure
		if (!isUseFnArgResolved) {
			useFnArgPromise.reject(e);
			return;
		}
		// otherwise re-throw to avoid silencing error during cleanup
		throw e;
	});
	return useFnArgPromise;
}
function resolveDeps(fixtures, depSet = new Set(), pendingFixtures = []) {
	fixtures.forEach((fixture) => {
		if (pendingFixtures.includes(fixture)) {
			return;
		}
		if (!fixture.isFn || !fixture.deps) {
			pendingFixtures.push(fixture);
			return;
		}
		if (depSet.has(fixture)) {
			throw new Error(`Circular fixture dependency detected: ${fixture.prop} <- ${[...depSet].reverse().map((d) => d.prop).join(" <- ")}`);
		}
		depSet.add(fixture);
		resolveDeps(fixture.deps, depSet, pendingFixtures);
		pendingFixtures.push(fixture);
		depSet.clear();
	});
	return pendingFixtures;
}
function getUsedProps(fn) {
	let fnString = filterOutComments(fn.toString());
	// match lowered async function and strip it off
	// example code on esbuild-try https://esbuild.github.io/try/#YgAwLjI0LjAALS1zdXBwb3J0ZWQ6YXN5bmMtYXdhaXQ9ZmFsc2UAZQBlbnRyeS50cwBjb25zdCBvID0gewogIGYxOiBhc3luYyAoKSA9PiB7fSwKICBmMjogYXN5bmMgKGEpID0+IHt9LAogIGYzOiBhc3luYyAoYSwgYikgPT4ge30sCiAgZjQ6IGFzeW5jIGZ1bmN0aW9uKGEpIHt9LAogIGY1OiBhc3luYyBmdW5jdGlvbiBmZihhKSB7fSwKICBhc3luYyBmNihhKSB7fSwKCiAgZzE6IGFzeW5jICgpID0+IHt9LAogIGcyOiBhc3luYyAoeyBhIH0pID0+IHt9LAogIGczOiBhc3luYyAoeyBhIH0sIGIpID0+IHt9LAogIGc0OiBhc3luYyBmdW5jdGlvbiAoeyBhIH0pIHt9LAogIGc1OiBhc3luYyBmdW5jdGlvbiBnZyh7IGEgfSkge30sCiAgYXN5bmMgZzYoeyBhIH0pIHt9LAoKICBoMTogYXN5bmMgKCkgPT4ge30sCiAgLy8gY29tbWVudCBiZXR3ZWVuCiAgaDI6IGFzeW5jIChhKSA9PiB7fSwKfQ
	//   __async(this, null, function*
	//   __async(this, arguments, function*
	//   __async(this, [_0, _1], function*
	if (/__async\((?:this|null), (?:null|arguments|\[[_0-9, ]*\]), function\*/.test(fnString)) {
		fnString = fnString.split(/__async\((?:this|null),/)[1];
	}
	const match = fnString.match(/[^(]*\(([^)]*)/);
	if (!match) {
		return [];
	}
	const args = splitByComma(match[1]);
	if (!args.length) {
		return [];
	}
	let first = args[0];
	if ("__VITEST_FIXTURE_INDEX__" in fn) {
		first = args[fn.__VITEST_FIXTURE_INDEX__];
		if (!first) {
			return [];
		}
	}
	if (!(first[0] === "{" && first.endsWith("}"))) {
		throw new Error(`The first argument inside a fixture must use object destructuring pattern, e.g. ({ test } => {}). Instead, received "${first}".`);
	}
	const _first = first.slice(1, -1).replace(/\s/g, "");
	const props = splitByComma(_first).map((prop) => {
		return prop.replace(/:.*|=.*/g, "");
	});
	const last = props.at(-1);
	if (last && last.startsWith("...")) {
		throw new Error(`Rest parameters are not supported in fixtures, received "${last}".`);
	}
	return props;
}
function filterOutComments(s) {
	const result = [];
	let commentState = "none";
	for (let i = 0; i < s.length; ++i) {
		if (commentState === "singleline") {
			if (s[i] === "\n") {
				commentState = "none";
			}
		} else if (commentState === "multiline") {
			if (s[i - 1] === "*" && s[i] === "/") {
				commentState = "none";
			}
		} else if (commentState === "none") {
			if (s[i] === "/" && s[i + 1] === "/") {
				commentState = "singleline";
			} else if (s[i] === "/" && s[i + 1] === "*") {
				commentState = "multiline";
				i += 2;
			} else {
				result.push(s[i]);
			}
		}
	}
	return result.join("");
}
function splitByComma(s) {
	const result = [];
	const stack = [];
	let start = 0;
	for (let i = 0; i < s.length; i++) {
		if (s[i] === "{" || s[i] === "[") {
			stack.push(s[i] === "{" ? "}" : "]");
		} else if (s[i] === stack.at(-1)) {
			stack.pop();
		} else if (!stack.length && s[i] === ",") {
			const token = s.substring(start, i).trim();
			if (token) {
				result.push(token);
			}
			start = i + 1;
		}
	}
	const lastToken = s.substring(start).trim();
	if (lastToken) {
		result.push(lastToken);
	}
	return result;
}

function getDefaultHookTimeout() {
	return getRunner().config.hookTimeout;
}
const CLEANUP_TIMEOUT_KEY = Symbol.for("VITEST_CLEANUP_TIMEOUT");
const CLEANUP_STACK_TRACE_KEY = Symbol.for("VITEST_CLEANUP_STACK_TRACE");
/**
* Registers a callback function to be executed once before all tests within the current suite.
* This hook is useful for scenarios where you need to perform setup operations that are common to all tests in a suite, such as initializing a database connection or setting up a test environment.
*
* **Note:** The `beforeAll` hooks are executed in the order they are defined one after another. You can configure this by changing the `sequence.hooks` option in the config file.
*
* @param {Function} fn - The callback function to be executed before all tests.
* @param {number} [timeout] - Optional timeout in milliseconds for the hook. If not provided, the default hook timeout from the runner's configuration is used.
* @returns {void}
* @example
* ```ts
* // Example of using beforeAll to set up a database connection
* beforeAll(async () => {
*   await database.connect();
* });
* ```
*/
function beforeAll(fn, timeout = getDefaultHookTimeout()) {
	assertTypes(fn, "\"beforeAll\" callback", ["function"]);
	const stackTraceError = new Error("STACK_TRACE_ERROR");
	return getCurrentSuite().on("beforeAll", Object.assign(withTimeout(fn, timeout, true, stackTraceError), {
		[CLEANUP_TIMEOUT_KEY]: timeout,
		[CLEANUP_STACK_TRACE_KEY]: stackTraceError
	}));
}
/**
* Registers a callback function to be executed once after all tests within the current suite have completed.
* This hook is useful for scenarios where you need to perform cleanup operations after all tests in a suite have run, such as closing database connections or cleaning up temporary files.
*
* **Note:** The `afterAll` hooks are running in reverse order of their registration. You can configure this by changing the `sequence.hooks` option in the config file.
*
* @param {Function} fn - The callback function to be executed after all tests.
* @param {number} [timeout] - Optional timeout in milliseconds for the hook. If not provided, the default hook timeout from the runner's configuration is used.
* @returns {void}
* @example
* ```ts
* // Example of using afterAll to close a database connection
* afterAll(async () => {
*   await database.disconnect();
* });
* ```
*/
function afterAll(fn, timeout) {
	assertTypes(fn, "\"afterAll\" callback", ["function"]);
	return getCurrentSuite().on("afterAll", withTimeout(fn, timeout ?? getDefaultHookTimeout(), true, new Error("STACK_TRACE_ERROR")));
}
/**
* Registers a callback function to be executed before each test within the current suite.
* This hook is useful for scenarios where you need to reset or reinitialize the test environment before each test runs, such as resetting database states, clearing caches, or reinitializing variables.
*
* **Note:** The `beforeEach` hooks are executed in the order they are defined one after another. You can configure this by changing the `sequence.hooks` option in the config file.
*
* @param {Function} fn - The callback function to be executed before each test. This function receives an `TestContext` parameter if additional test context is needed.
* @param {number} [timeout] - Optional timeout in milliseconds for the hook. If not provided, the default hook timeout from the runner's configuration is used.
* @returns {void}
* @example
* ```ts
* // Example of using beforeEach to reset a database state
* beforeEach(async () => {
*   await database.reset();
* });
* ```
*/
function beforeEach(fn, timeout = getDefaultHookTimeout()) {
	assertTypes(fn, "\"beforeEach\" callback", ["function"]);
	const stackTraceError = new Error("STACK_TRACE_ERROR");
	const runner = getRunner();
	return getCurrentSuite().on("beforeEach", Object.assign(withTimeout(withFixtures(runner, fn), timeout ?? getDefaultHookTimeout(), true, stackTraceError, abortIfTimeout), {
		[CLEANUP_TIMEOUT_KEY]: timeout,
		[CLEANUP_STACK_TRACE_KEY]: stackTraceError
	}));
}
/**
* Registers a callback function to be executed after each test within the current suite has completed.
* This hook is useful for scenarios where you need to clean up or reset the test environment after each test runs, such as deleting temporary files, clearing test-specific database entries, or resetting mocked functions.
*
* **Note:** The `afterEach` hooks are running in reverse order of their registration. You can configure this by changing the `sequence.hooks` option in the config file.
*
* @param {Function} fn - The callback function to be executed after each test. This function receives an `TestContext` parameter if additional test context is needed.
* @param {number} [timeout] - Optional timeout in milliseconds for the hook. If not provided, the default hook timeout from the runner's configuration is used.
* @returns {void}
* @example
* ```ts
* // Example of using afterEach to delete temporary files created during a test
* afterEach(async () => {
*   await fileSystem.deleteTempFiles();
* });
* ```
*/
function afterEach(fn, timeout) {
	assertTypes(fn, "\"afterEach\" callback", ["function"]);
	const runner = getRunner();
	return getCurrentSuite().on("afterEach", withTimeout(withFixtures(runner, fn), timeout ?? getDefaultHookTimeout(), true, new Error("STACK_TRACE_ERROR"), abortIfTimeout));
}

/**
* Creates a suite of tests, allowing for grouping and hierarchical organization of tests.
* Suites can contain both tests and other suites, enabling complex test structures.
*
* @param {string} name - The name of the suite, used for identification and reporting.
* @param {Function} fn - A function that defines the tests and suites within this suite.
* @example
* ```ts
* // Define a suite with two tests
* suite('Math operations', () => {
*   test('should add two numbers', () => {
*     expect(add(1, 2)).toBe(3);
*   });
*
*   test('should subtract two numbers', () => {
*     expect(subtract(5, 2)).toBe(3);
*   });
* });
* ```
* @example
* ```ts
* // Define nested suites
* suite('String operations', () => {
*   suite('Trimming', () => {
*     test('should trim whitespace from start and end', () => {
*       expect('  hello  '.trim()).toBe('hello');
*     });
*   });
*
*   suite('Concatenation', () => {
*     test('should concatenate two strings', () => {
*       expect('hello' + ' ' + 'world').toBe('hello world');
*     });
*   });
* });
* ```
*/
const suite = createSuite();
/**
* Defines a test case with a given name and test function. The test function can optionally be configured with test options.
*
* @param {string | Function} name - The name of the test or a function that will be used as a test name.
* @param {TestOptions | TestFunction} [optionsOrFn] - Optional. The test options or the test function if no explicit name is provided.
* @param {number | TestOptions | TestFunction} [optionsOrTest] - Optional. The test function or options, depending on the previous parameters.
* @throws {Error} If called inside another test function.
* @example
* ```ts
* // Define a simple test
* test('should add two numbers', () => {
*   expect(add(1, 2)).toBe(3);
* });
* ```
* @example
* ```ts
* // Define a test with options
* test('should subtract two numbers', { retry: 3 }, () => {
*   expect(subtract(5, 2)).toBe(3);
* });
* ```
*/
const test$1 = createTest(function(name, optionsOrFn, optionsOrTest) {
	getCurrentSuite().test.fn.call(this, formatName(name), optionsOrFn, optionsOrTest);
});
/**
* Creates a suite of tests, allowing for grouping and hierarchical organization of tests.
* Suites can contain both tests and other suites, enabling complex test structures.
*
* @param {string} name - The name of the suite, used for identification and reporting.
* @param {Function} fn - A function that defines the tests and suites within this suite.
* @example
* ```ts
* // Define a suite with two tests
* describe('Math operations', () => {
*   test('should add two numbers', () => {
*     expect(add(1, 2)).toBe(3);
*   });
*
*   test('should subtract two numbers', () => {
*     expect(subtract(5, 2)).toBe(3);
*   });
* });
* ```
* @example
* ```ts
* // Define nested suites
* describe('String operations', () => {
*   describe('Trimming', () => {
*     test('should trim whitespace from start and end', () => {
*       expect('  hello  '.trim()).toBe('hello');
*     });
*   });
*
*   describe('Concatenation', () => {
*     test('should concatenate two strings', () => {
*       expect('hello' + ' ' + 'world').toBe('hello world');
*     });
*   });
* });
* ```
*/
const describe = suite;
/**
* Defines a test case with a given name and test function. The test function can optionally be configured with test options.
*
* @param {string | Function} name - The name of the test or a function that will be used as a test name.
* @param {TestOptions | TestFunction} [optionsOrFn] - Optional. The test options or the test function if no explicit name is provided.
* @param {number | TestOptions | TestFunction} [optionsOrTest] - Optional. The test function or options, depending on the previous parameters.
* @throws {Error} If called inside another test function.
* @example
* ```ts
* // Define a simple test
* it('adds two numbers', () => {
*   expect(add(1, 2)).toBe(3);
* });
* ```
* @example
* ```ts
* // Define a test with options
* it('subtracts two numbers', { retry: 3 }, () => {
*   expect(subtract(5, 2)).toBe(3);
* });
* ```
*/
const it = test$1;
let runner;
let defaultSuite;
let currentTestFilepath;
function assert(condition, message) {
	if (!condition) {
		throw new Error(`Vitest failed to find ${message}. This is a bug in Vitest. Please, open an issue with reproduction.`);
	}
}
function getRunner() {
	assert(runner, "the runner");
	return runner;
}
function getCurrentSuite() {
	const currentSuite = collectorContext.currentSuite || defaultSuite;
	assert(currentSuite, "the current suite");
	return currentSuite;
}
function createSuiteHooks() {
	return {
		beforeAll: [],
		afterAll: [],
		beforeEach: [],
		afterEach: []
	};
}
function parseArguments(optionsOrFn, timeoutOrTest) {
	if (timeoutOrTest != null && typeof timeoutOrTest === "object") {
		throw new TypeError(`Signature "test(name, fn, { ... })" was deprecated in Vitest 3 and removed in Vitest 4. Please, provide options as a second argument instead.`);
	}
	let options = {};
	let fn;
	// it('', () => {}, 1000)
	if (typeof timeoutOrTest === "number") {
		options = { timeout: timeoutOrTest };
	} else if (typeof optionsOrFn === "object") {
		options = optionsOrFn;
	}
	if (typeof optionsOrFn === "function") {
		if (typeof timeoutOrTest === "function") {
			throw new TypeError("Cannot use two functions as arguments. Please use the second argument for options.");
		}
		fn = optionsOrFn;
	} else if (typeof timeoutOrTest === "function") {
		fn = timeoutOrTest;
	}
	return {
		options,
		handler: fn
	};
}
// implementations
function createSuiteCollector(name, factory = () => {}, mode, each, suiteOptions, parentCollectorFixtures) {
	const tasks = [];
	let suite;
	initSuite();
	const task = function(name = "", options = {}) {
		var _collectorContext$cur, _collectorContext$cur2, _collectorContext$cur3;
		const timeout = (options === null || options === void 0 ? void 0 : options.timeout) ?? runner.config.testTimeout;
		const currentSuite = (_collectorContext$cur = collectorContext.currentSuite) === null || _collectorContext$cur === void 0 ? void 0 : _collectorContext$cur.suite;
		const task = {
			id: "",
			name,
			fullName: createTaskName([(currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.fullName) ?? ((_collectorContext$cur2 = collectorContext.currentSuite) === null || _collectorContext$cur2 === void 0 || (_collectorContext$cur2 = _collectorContext$cur2.file) === null || _collectorContext$cur2 === void 0 ? void 0 : _collectorContext$cur2.fullName), name]),
			fullTestName: createTaskName([currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.fullTestName, name]),
			suite: currentSuite,
			each: options.each,
			fails: options.fails,
			context: undefined,
			type: "test",
			file: (currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.file) ?? ((_collectorContext$cur3 = collectorContext.currentSuite) === null || _collectorContext$cur3 === void 0 ? void 0 : _collectorContext$cur3.file),
			timeout,
			retry: options.retry ?? runner.config.retry,
			repeats: options.repeats,
			mode: options.only ? "only" : options.skip ? "skip" : options.todo ? "todo" : "run",
			meta: options.meta ?? Object.create(null),
			annotations: [],
			artifacts: []
		};
		const handler = options.handler;
		if (task.mode === "run" && !handler) {
			task.mode = "todo";
		}
		if (options.concurrent || !options.sequential && runner.config.sequence.concurrent) {
			task.concurrent = true;
		}
		task.shuffle = suiteOptions === null || suiteOptions === void 0 ? void 0 : suiteOptions.shuffle;
		const context = createTestContext(task, runner);
		// create test context
		Object.defineProperty(task, "context", {
			value: context,
			enumerable: false
		});
		setTestFixture(context, options.fixtures);
		// custom can be called from any place, let's assume the limit is 15 stacks
		const limit = Error.stackTraceLimit;
		Error.stackTraceLimit = 15;
		const stackTraceError = new Error("STACK_TRACE_ERROR");
		Error.stackTraceLimit = limit;
		if (handler) {
			setFn(task, withTimeout(withAwaitAsyncAssertions(withFixtures(runner, handler, context), task), timeout, false, stackTraceError, (_, error) => abortIfTimeout([context], error)));
		}
		if (runner.config.includeTaskLocation) {
			const error = stackTraceError.stack;
			const stack = findTestFileStackTrace(currentTestFilepath, error);
			if (stack) {
				task.location = {
					line: stack.line,
					column: stack.column
				};
			}
		}
		tasks.push(task);
		return task;
	};
	const test = createTest(function(name, optionsOrFn, timeoutOrTest) {
		let { options, handler } = parseArguments(optionsOrFn, timeoutOrTest);
		// inherit repeats, retry, timeout from suite
		if (typeof suiteOptions === "object") {
			options = Object.assign({}, suiteOptions, options);
		}
		// inherit concurrent / sequential from suite
		options.concurrent = this.concurrent || !this.sequential && (options === null || options === void 0 ? void 0 : options.concurrent);
		options.sequential = this.sequential || !this.concurrent && (options === null || options === void 0 ? void 0 : options.sequential);
		const test = task(formatName(name), {
			...this,
			...options,
			handler
		});
		test.type = "test";
	});
	let collectorFixtures = parentCollectorFixtures;
	const collector = {
		type: "collector",
		name,
		mode,
		suite,
		options: suiteOptions,
		test,
		tasks,
		collect,
		task,
		clear,
		on: addHook,
		fixtures() {
			return collectorFixtures;
		},
		scoped(fixtures) {
			const parsed = mergeContextFixtures(fixtures, { fixtures: collectorFixtures }, runner);
			if (parsed.fixtures) {
				collectorFixtures = parsed.fixtures;
			}
		}
	};
	function addHook(name, ...fn) {
		getHooks(suite)[name].push(...fn);
	}
	function initSuite(includeLocation) {
		var _collectorContext$cur4, _collectorContext$cur5, _collectorContext$cur6;
		if (typeof suiteOptions === "number") {
			suiteOptions = { timeout: suiteOptions };
		}
		const currentSuite = (_collectorContext$cur4 = collectorContext.currentSuite) === null || _collectorContext$cur4 === void 0 ? void 0 : _collectorContext$cur4.suite;
		suite = {
			id: "",
			type: "suite",
			name,
			fullName: createTaskName([(currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.fullName) ?? ((_collectorContext$cur5 = collectorContext.currentSuite) === null || _collectorContext$cur5 === void 0 || (_collectorContext$cur5 = _collectorContext$cur5.file) === null || _collectorContext$cur5 === void 0 ? void 0 : _collectorContext$cur5.fullName), name]),
			fullTestName: createTaskName([currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.fullTestName, name]),
			suite: currentSuite,
			mode,
			each,
			file: (currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.file) ?? ((_collectorContext$cur6 = collectorContext.currentSuite) === null || _collectorContext$cur6 === void 0 ? void 0 : _collectorContext$cur6.file),
			shuffle: suiteOptions === null || suiteOptions === void 0 ? void 0 : suiteOptions.shuffle,
			tasks: [],
			meta: Object.create(null),
			concurrent: suiteOptions === null || suiteOptions === void 0 ? void 0 : suiteOptions.concurrent
		};
		setHooks(suite, createSuiteHooks());
	}
	function clear() {
		tasks.length = 0;
		initSuite();
	}
	async function collect(file) {
		if (!file) {
			throw new TypeError("File is required to collect tasks.");
		}
		if (factory) {
			await runWithSuite(collector, () => factory(test));
		}
		const allChildren = [];
		for (const i of tasks) {
			allChildren.push(i.type === "collector" ? await i.collect(file) : i);
		}
		suite.tasks = allChildren;
		return suite;
	}
	collectTask(collector);
	return collector;
}
function withAwaitAsyncAssertions(fn, task) {
	return (async (...args) => {
		const fnResult = await fn(...args);
		// some async expect will be added to this array, in case user forget to await them
		if (task.promises) {
			const result = await Promise.allSettled(task.promises);
			const errors = result.map((r) => r.status === "rejected" ? r.reason : undefined).filter(Boolean);
			if (errors.length) {
				throw errors;
			}
		}
		return fnResult;
	});
}
function createSuite() {
	function suiteFn(name, factoryOrOptions, optionsOrFactory) {
		var _currentSuite$options;
		let mode = this.only ? "only" : this.skip ? "skip" : this.todo ? "todo" : "run";
		const currentSuite = collectorContext.currentSuite || defaultSuite;
		let { options, handler: factory } = parseArguments(factoryOrOptions, optionsOrFactory);
		if (mode === "run" && !factory) {
			mode = "todo";
		}
		const isConcurrentSpecified = options.concurrent || this.concurrent || options.sequential === false;
		const isSequentialSpecified = options.sequential || this.sequential || options.concurrent === false;
		// inherit options from current suite
		options = {
			...currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.options,
			...options,
			shuffle: this.shuffle ?? options.shuffle ?? (currentSuite === null || currentSuite === void 0 || (_currentSuite$options = currentSuite.options) === null || _currentSuite$options === void 0 ? void 0 : _currentSuite$options.shuffle) ?? (void 0 )
		};
		// inherit concurrent / sequential from suite
		const isConcurrent = isConcurrentSpecified || options.concurrent && !isSequentialSpecified;
		const isSequential = isSequentialSpecified || options.sequential && !isConcurrentSpecified;
		options.concurrent = isConcurrent && !isSequential;
		options.sequential = isSequential && !isConcurrent;
		return createSuiteCollector(formatName(name), factory, mode, this.each, options, currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.fixtures());
	}
	suiteFn.each = function(cases, ...args) {
		const suite = this.withContext();
		this.setContext("each", true);
		if (Array.isArray(cases) && args.length) {
			cases = formatTemplateString(cases, args);
		}
		return (name, optionsOrFn, fnOrOptions) => {
			const _name = formatName(name);
			const arrayOnlyCases = cases.every(Array.isArray);
			const { options, handler } = parseArguments(optionsOrFn, fnOrOptions);
			const fnFirst = typeof optionsOrFn === "function";
			cases.forEach((i, idx) => {
				const items = Array.isArray(i) ? i : [i];
				if (fnFirst) {
					if (arrayOnlyCases) {
						suite(formatTitle(_name, items, idx), handler ? () => handler(...items) : undefined, options.timeout);
					} else {
						suite(formatTitle(_name, items, idx), handler ? () => handler(i) : undefined, options.timeout);
					}
				} else {
					if (arrayOnlyCases) {
						suite(formatTitle(_name, items, idx), options, handler ? () => handler(...items) : undefined);
					} else {
						suite(formatTitle(_name, items, idx), options, handler ? () => handler(i) : undefined);
					}
				}
			});
			this.setContext("each", undefined);
		};
	};
	suiteFn.for = function(cases, ...args) {
		if (Array.isArray(cases) && args.length) {
			cases = formatTemplateString(cases, args);
		}
		return (name, optionsOrFn, fnOrOptions) => {
			const name_ = formatName(name);
			const { options, handler } = parseArguments(optionsOrFn, fnOrOptions);
			cases.forEach((item, idx) => {
				suite(formatTitle(name_, toArray(item), idx), options, handler ? () => handler(item) : undefined);
			});
		};
	};
	suiteFn.skipIf = (condition) => condition ? suite.skip : suite;
	suiteFn.runIf = (condition) => condition ? suite : suite.skip;
	return createChainable([
		"concurrent",
		"sequential",
		"shuffle",
		"skip",
		"only",
		"todo"
	], suiteFn);
}
function createTaskCollector(fn, context) {
	const taskFn = fn;
	taskFn.each = function(cases, ...args) {
		const test = this.withContext();
		this.setContext("each", true);
		if (Array.isArray(cases) && args.length) {
			cases = formatTemplateString(cases, args);
		}
		return (name, optionsOrFn, fnOrOptions) => {
			const _name = formatName(name);
			const arrayOnlyCases = cases.every(Array.isArray);
			const { options, handler } = parseArguments(optionsOrFn, fnOrOptions);
			const fnFirst = typeof optionsOrFn === "function";
			cases.forEach((i, idx) => {
				const items = Array.isArray(i) ? i : [i];
				if (fnFirst) {
					if (arrayOnlyCases) {
						test(formatTitle(_name, items, idx), handler ? () => handler(...items) : undefined, options.timeout);
					} else {
						test(formatTitle(_name, items, idx), handler ? () => handler(i) : undefined, options.timeout);
					}
				} else {
					if (arrayOnlyCases) {
						test(formatTitle(_name, items, idx), options, handler ? () => handler(...items) : undefined);
					} else {
						test(formatTitle(_name, items, idx), options, handler ? () => handler(i) : undefined);
					}
				}
			});
			this.setContext("each", undefined);
		};
	};
	taskFn.for = function(cases, ...args) {
		const test = this.withContext();
		if (Array.isArray(cases) && args.length) {
			cases = formatTemplateString(cases, args);
		}
		return (name, optionsOrFn, fnOrOptions) => {
			const _name = formatName(name);
			const { options, handler } = parseArguments(optionsOrFn, fnOrOptions);
			cases.forEach((item, idx) => {
				// monkey-patch handler to allow parsing fixture
				const handlerWrapper = handler ? (ctx) => handler(item, ctx) : undefined;
				if (handlerWrapper) {
					handlerWrapper.__VITEST_FIXTURE_INDEX__ = 1;
					handlerWrapper.toString = () => handler.toString();
				}
				test(formatTitle(_name, toArray(item), idx), options, handlerWrapper);
			});
		};
	};
	taskFn.skipIf = function(condition) {
		return condition ? this.skip : this;
	};
	taskFn.runIf = function(condition) {
		return condition ? this : this.skip;
	};
	taskFn.scoped = function(fixtures) {
		const collector = getCurrentSuite();
		collector.scoped(fixtures);
	};
	taskFn.extend = function(fixtures) {
		const _context = mergeContextFixtures(fixtures, context || {}, runner);
		const originalWrapper = fn;
		return createTest(function(name, optionsOrFn, optionsOrTest) {
			const collector = getCurrentSuite();
			const scopedFixtures = collector.fixtures();
			const context = { ...this };
			if (scopedFixtures) {
				context.fixtures = mergeScopedFixtures(context.fixtures || [], scopedFixtures);
			}
			originalWrapper.call(context, formatName(name), optionsOrFn, optionsOrTest);
		}, _context);
	};
	taskFn.beforeEach = beforeEach;
	taskFn.afterEach = afterEach;
	taskFn.beforeAll = beforeAll;
	taskFn.afterAll = afterAll;
	const _test = createChainable([
		"concurrent",
		"sequential",
		"skip",
		"only",
		"todo",
		"fails"
	], taskFn);
	if (context) {
		_test.mergeContext(context);
	}
	return _test;
}
function createTest(fn, context) {
	return createTaskCollector(fn, context);
}
function formatName(name) {
	return typeof name === "string" ? name : typeof name === "function" ? name.name || "<anonymous>" : String(name);
}
function formatTitle(template, items, idx) {
	if (template.includes("%#") || template.includes("%$")) {
		// '%#' match index of the test case
		template = template.replace(/%%/g, "__vitest_escaped_%__").replace(/%#/g, `${idx}`).replace(/%\$/g, `${idx + 1}`).replace(/__vitest_escaped_%__/g, "%%");
	}
	const count = template.split("%").length - 1;
	if (template.includes("%f")) {
		const placeholders = template.match(/%f/g) || [];
		placeholders.forEach((_, i) => {
			if (isNegativeNaN(items[i]) || Object.is(items[i], -0)) {
				// Replace the i-th occurrence of '%f' with '-%f'
				let occurrence = 0;
				template = template.replace(/%f/g, (match) => {
					occurrence++;
					return occurrence === i + 1 ? "-%f" : match;
				});
			}
		});
	}
	const isObjectItem = isObject$1(items[0]);
	function formatAttribute(s) {
		return s.replace(/\$([$\w.]+)/g, (_, key) => {
			const isArrayKey = /^\d+$/.test(key);
			if (!isObjectItem && !isArrayKey) {
				return `$${key}`;
			}
			const arrayElement = isArrayKey ? objectAttr(items, key) : undefined;
			const value = isObjectItem ? objectAttr(items[0], key, arrayElement) : arrayElement;
			return objDisplay$1(value, { truncate: void 0  });
		});
	}
	let output = "";
	let i = 0;
	handleRegexMatch(
		template,
		formatRegExp,
		// format "%"
		(match) => {
			if (i < count) {
				output += format(match[0], items[i++]);
			} else {
				output += match[0];
			}
		},
		// format "$"
		(nonMatch) => {
			output += formatAttribute(nonMatch);
		}
	);
	return output;
}
// based on https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/autocomplete/src/parse.ts#L11
function handleRegexMatch(input, regex, onMatch, onNonMatch) {
	let lastIndex = 0;
	for (const m of input.matchAll(regex)) {
		if (lastIndex < m.index) {
			onNonMatch(input.slice(lastIndex, m.index));
		}
		onMatch(m);
		lastIndex = m.index + m[0].length;
	}
	if (lastIndex < input.length) {
		onNonMatch(input.slice(lastIndex));
	}
}
function formatTemplateString(cases, args) {
	const header = cases.join("").trim().replace(/ /g, "").split("\n").map((i) => i.split("|"))[0];
	const res = [];
	for (let i = 0; i < Math.floor(args.length / header.length); i++) {
		const oneCase = {};
		for (let j = 0; j < header.length; j++) {
			oneCase[header[j]] = args[i * header.length + j];
		}
		res.push(oneCase);
	}
	return res;
}

const now$2 = Date.now;
const collectorContext = {
	currentSuite: null
};
function collectTask(task) {
	var _collectorContext$cur;
	(_collectorContext$cur = collectorContext.currentSuite) === null || _collectorContext$cur === void 0 ? void 0 : _collectorContext$cur.tasks.push(task);
}
async function runWithSuite(suite, fn) {
	const prev = collectorContext.currentSuite;
	collectorContext.currentSuite = suite;
	await fn();
	collectorContext.currentSuite = prev;
}
function withTimeout(fn, timeout, isHook = false, stackTraceError, onTimeout) {
	if (timeout <= 0 || timeout === Number.POSITIVE_INFINITY) {
		return fn;
	}
	const { setTimeout, clearTimeout } = getSafeTimers();
	// this function name is used to filter error in test/cli/test/fails.test.ts
	return (function runWithTimeout(...args) {
		const startTime = now$2();
		const runner = getRunner();
		runner._currentTaskStartTime = startTime;
		runner._currentTaskTimeout = timeout;
		return new Promise((resolve_, reject_) => {
			var _timer$unref;
			const timer = setTimeout(() => {
				clearTimeout(timer);
				rejectTimeoutError();
			}, timeout);
			// `unref` might not exist in browser
			(_timer$unref = timer.unref) === null || _timer$unref === void 0 ? void 0 : _timer$unref.call(timer);
			function rejectTimeoutError() {
				const error = makeTimeoutError(isHook, timeout, stackTraceError);
				onTimeout === null || onTimeout === void 0 ? void 0 : onTimeout(args, error);
				reject_(error);
			}
			function resolve(result) {
				runner._currentTaskStartTime = undefined;
				runner._currentTaskTimeout = undefined;
				clearTimeout(timer);
				// if test/hook took too long in microtask, setTimeout won't be triggered,
				// but we still need to fail the test, see
				// https://github.com/vitest-dev/vitest/issues/2920
				if (now$2() - startTime >= timeout) {
					rejectTimeoutError();
					return;
				}
				resolve_(result);
			}
			function reject(error) {
				runner._currentTaskStartTime = undefined;
				runner._currentTaskTimeout = undefined;
				clearTimeout(timer);
				reject_(error);
			}
			// sync test/hook will be caught by try/catch
			try {
				const result = fn(...args);
				// the result is a thenable, we don't wrap this in Promise.resolve
				// to avoid creating new promises
				if (typeof result === "object" && result != null && typeof result.then === "function") {
					result.then(resolve, reject);
				} else {
					resolve(result);
				}
			} 
			// user sync test/hook throws an error
catch (error) {
				reject(error);
			}
		});
	});
}
const abortControllers = new WeakMap();
function abortIfTimeout([context], error) {
	if (context) {
		abortContextSignal(context, error);
	}
}
function abortContextSignal(context, error) {
	const abortController = abortControllers.get(context);
	abortController === null || abortController === void 0 ? void 0 : abortController.abort(error);
}
function createTestContext(test, runner) {
	var _runner$extendTaskCon;
	const context = function() {
		throw new Error("done() callback is deprecated, use promise instead");
	};
	let abortController = abortControllers.get(context);
	if (!abortController) {
		abortController = new AbortController();
		abortControllers.set(context, abortController);
	}
	context.signal = abortController.signal;
	context.task = test;
	context.skip = (condition, note) => {
		if (condition === false) {
			// do nothing
			return undefined;
		}
		test.result ?? (test.result = { state: "skip" });
		test.result.pending = true;
		throw new PendingError("test is skipped; abort execution", test, typeof condition === "string" ? condition : note);
	};
	context.annotate = ((message, type, attachment) => {
		if (test.result && test.result.state !== "run") {
			throw new Error(`Cannot annotate tests outside of the test run. The test "${test.name}" finished running with the "${test.result.state}" state already.`);
		}
		const annotation = {
			message,
			type: typeof type === "object" || type === undefined ? "notice" : type
		};
		const annotationAttachment = typeof type === "object" ? type : attachment;
		if (annotationAttachment) {
			annotation.attachment = annotationAttachment;
			manageArtifactAttachment(annotation.attachment);
		}
		return recordAsyncOperation(test, recordArtifact(test, {
			type: "internal:annotation",
			annotation
		}).then(async ({ annotation }) => {
			if (!runner.onTestAnnotate) {
				throw new Error(`Test runner doesn't support test annotations.`);
			}
			await finishSendTasksUpdate(runner);
			const resolvedAnnotation = await runner.onTestAnnotate(test, annotation);
			test.annotations.push(resolvedAnnotation);
			return resolvedAnnotation;
		}));
	});
	context.onTestFailed = (handler, timeout) => {
		test.onFailed || (test.onFailed = []);
		test.onFailed.push(withTimeout(handler, timeout ?? runner.config.hookTimeout, true, new Error("STACK_TRACE_ERROR"), (_, error) => abortController.abort(error)));
	};
	context.onTestFinished = (handler, timeout) => {
		test.onFinished || (test.onFinished = []);
		test.onFinished.push(withTimeout(handler, timeout ?? runner.config.hookTimeout, true, new Error("STACK_TRACE_ERROR"), (_, error) => abortController.abort(error)));
	};
	return ((_runner$extendTaskCon = runner.extendTaskContext) === null || _runner$extendTaskCon === void 0 ? void 0 : _runner$extendTaskCon.call(runner, context)) || context;
}
function makeTimeoutError(isHook, timeout, stackTraceError) {
	const message = `${isHook ? "Hook" : "Test"} timed out in ${timeout}ms.\nIf this is a long-running ${isHook ? "hook" : "test"}, pass a timeout value as the last argument or configure it globally with "${isHook ? "hookTimeout" : "testTimeout"}".`;
	const error = new Error(message);
	if (stackTraceError === null || stackTraceError === void 0 ? void 0 : stackTraceError.stack) {
		error.stack = stackTraceError.stack.replace(error.message, stackTraceError.message);
	}
	return error;
}
const fileContexts = new WeakMap();
function getFileContext(file) {
	const context = fileContexts.get(file);
	if (!context) {
		throw new Error(`Cannot find file context for ${file.name}`);
	}
	return context;
}

globalThis.performance ? globalThis.performance.now.bind(globalThis.performance) : Date.now;

globalThis.performance ? globalThis.performance.now.bind(globalThis.performance) : Date.now;
getSafeTimers();
const packs = new Map();
const eventsPacks = [];
const pendingTasksUpdates = [];
function sendTasksUpdate(runner) {
	if (packs.size) {
		var _runner$onTaskUpdate;
		const taskPacks = Array.from(packs).map(([id, task]) => {
			return [
				id,
				task[0],
				task[1]
			];
		});
		const p = (_runner$onTaskUpdate = runner.onTaskUpdate) === null || _runner$onTaskUpdate === void 0 ? void 0 : _runner$onTaskUpdate.call(runner, taskPacks, eventsPacks);
		if (p) {
			pendingTasksUpdates.push(p);
			// remove successful promise to not grow array indefnitely,
			// but keep rejections so finishSendTasksUpdate can handle them
			p.then(() => pendingTasksUpdates.splice(pendingTasksUpdates.indexOf(p), 1), () => {});
		}
		eventsPacks.length = 0;
		packs.clear();
	}
}
async function finishSendTasksUpdate(runner) {
	sendTasksUpdate(runner);
	await Promise.all(pendingTasksUpdates);
}

/**
* @experimental
* @advanced
*
* Records a custom test artifact during test execution.
*
* This function allows you to attach structured data, files, or metadata to a test.
*
* Vitest automatically injects the source location where the artifact was created and manages any attachments you include.
*
* @param task - The test task context, typically accessed via `this.task` in custom matchers or `context.task` in tests
* @param artifact - The artifact to record. Must extend {@linkcode TestArtifactBase}
*
* @returns A promise that resolves to the recorded artifact with location injected
*
* @throws {Error} If called after the test has finished running
* @throws {Error} If the test runner doesn't support artifacts
*
* @example
* ```ts
* // In a custom assertion
* async function toHaveValidSchema(this: MatcherState, actual: unknown) {
*   const validation = validateSchema(actual)
*
*   await recordArtifact(this.task, {
*     type: 'my-plugin:schema-validation',
*     passed: validation.valid,
*     errors: validation.errors,
*   })
*
*   return { pass: validation.valid, message: () => '...' }
* }
* ```
*/
async function recordArtifact(task, artifact) {
	const runner = getRunner();
	if (task.result && task.result.state !== "run") {
		throw new Error(`Cannot record a test artifact outside of the test run. The test "${task.name}" finished running with the "${task.result.state}" state already.`);
	}
	const stack = findTestFileStackTrace(task.file.filepath, new Error("STACK_TRACE").stack);
	if (stack) {
		artifact.location = {
			file: stack.file,
			line: stack.line,
			column: stack.column
		};
		if (artifact.type === "internal:annotation") {
			artifact.annotation.location = artifact.location;
		}
	}
	if (Array.isArray(artifact.attachments)) {
		for (const attachment of artifact.attachments) {
			manageArtifactAttachment(attachment);
		}
	}
	// annotations won't resolve as artifacts for backwards compatibility until next major
	if (artifact.type === "internal:annotation") {
		return artifact;
	}
	if (!runner.onTestArtifactRecord) {
		throw new Error(`Test runner doesn't support test artifacts.`);
	}
	await finishSendTasksUpdate(runner);
	const resolvedArtifact = await runner.onTestArtifactRecord(task, artifact);
	task.artifacts.push(resolvedArtifact);
	return resolvedArtifact;
}
const table = [];
for (let i = 65; i < 91; i++) {
	table.push(String.fromCharCode(i));
}
for (let i = 97; i < 123; i++) {
	table.push(String.fromCharCode(i));
}
for (let i = 0; i < 10; i++) {
	table.push(i.toString(10));
}
table.push("+", "/");
function encodeUint8Array(bytes) {
	let base64 = "";
	const len = bytes.byteLength;
	for (let i = 0; i < len; i += 3) {
		if (len === i + 1) {
			const a = (bytes[i] & 252) >> 2;
			const b = (bytes[i] & 3) << 4;
			base64 += table[a];
			base64 += table[b];
			base64 += "==";
		} else if (len === i + 2) {
			const a = (bytes[i] & 252) >> 2;
			const b = (bytes[i] & 3) << 4 | (bytes[i + 1] & 240) >> 4;
			const c = (bytes[i + 1] & 15) << 2;
			base64 += table[a];
			base64 += table[b];
			base64 += table[c];
			base64 += "=";
		} else {
			const a = (bytes[i] & 252) >> 2;
			const b = (bytes[i] & 3) << 4 | (bytes[i + 1] & 240) >> 4;
			const c = (bytes[i + 1] & 15) << 2 | (bytes[i + 2] & 192) >> 6;
			const d = bytes[i + 2] & 63;
			base64 += table[a];
			base64 += table[b];
			base64 += table[c];
			base64 += table[d];
		}
	}
	return base64;
}
/**
* Records an async operation associated with a test task.
*
* This function tracks promises that should be awaited before a test completes.
* The promise is automatically removed from the test's promise list once it settles.
*/
function recordAsyncOperation(test, promise) {
	// if promise is explicitly awaited, remove it from the list
	promise = promise.finally(() => {
		if (!test.promises) {
			return;
		}
		const index = test.promises.indexOf(promise);
		if (index !== -1) {
			test.promises.splice(index, 1);
		}
	});
	// record promise
	if (!test.promises) {
		test.promises = [];
	}
	test.promises.push(promise);
	return promise;
}
/**
* Validates and prepares a test attachment for serialization.
*
* This function ensures attachments have either `body` or `path` set (but not both), and converts `Uint8Array` bodies to base64-encoded strings for easier serialization.
*
* @param attachment - The attachment to validate and prepare
*
* @throws {TypeError} If neither `body` nor `path` is provided
* @throws {TypeError} If both `body` and `path` are provided
*/
function manageArtifactAttachment(attachment) {
	if (attachment.body == null && !attachment.path) {
		throw new TypeError(`Test attachment requires "body" or "path" to be set. Both are missing.`);
	}
	if (attachment.body && attachment.path) {
		throw new TypeError(`Test attachment requires only one of "body" or "path" to be set. Both are specified.`);
	}
	// convert to a string so it's easier to serialise
	if (attachment.body instanceof Uint8Array) {
		attachment.body = encodeUint8Array(attachment.body);
	}
}

const NAME_WORKER_STATE = "__vitest_worker__";
function getWorkerState() {
	// @ts-expect-error untyped global
	const workerState = globalThis[NAME_WORKER_STATE];
	if (!workerState) throw new Error("Vitest failed to access its internal state.\n\nOne of the following is possible:\n- \"vitest\" is imported directly without running \"vitest\" command\n- \"vitest\" is imported inside \"globalSetup\" (to fix this, use \"setupFiles\" instead, because \"globalSetup\" runs in a different context)\n- \"vitest\" is imported inside Vite / Vitest config file\n- Otherwise, it might be a Vitest bug. Please report it to https://github.com/vitest-dev/vitest/issues\n");
	return workerState;
}
function isChildProcess() {
	return typeof process !== "undefined" && !!process.send;
}
function resetModules(modules, resetMocks = false) {
	const skipPaths = [
		/\/vitest\/dist\//,
		/vitest-virtual-\w+\/dist/,
		/@vitest\/dist/,
		...!resetMocks ? [/^mock:/] : []
	];
	modules.idToModuleMap.forEach((node, path) => {
		if (skipPaths.some((re) => re.test(path))) return;
		node.promise = void 0;
		node.exports = void 0;
		node.evaluated = false;
		node.importers.clear();
	});
}
function waitNextTick() {
	const { setTimeout } = getSafeTimers();
	return new Promise((resolve) => setTimeout(resolve, 0));
}
async function waitForImportsToResolve() {
	await waitNextTick();
	const state = getWorkerState();
	const promises = [];
	const resolvingCount = state.resolvingModules.size;
	for (const [_, mod] of state.evaluatedModules.idToModuleMap) if (mod.promise && !mod.evaluated) promises.push(mod.promise);
	if (!promises.length && !resolvingCount) return;
	await Promise.allSettled(promises);
	await waitForImportsToResolve();
}

// src/vlq.ts
var comma = ",".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}
function decodeInteger(reader, relative) {
  let value = 0;
  let shift = 0;
  let integer = 0;
  do {
    const c = reader.next();
    integer = charToInt[c];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);
  const shouldNegate = value & 1;
  value >>>= 1;
  if (shouldNegate) {
    value = -2147483648 | -value;
  }
  return relative + value;
}
function hasMoreVlq(reader, max) {
  if (reader.pos >= max) return false;
  return reader.peek() !== comma;
}
var StringReader = class {
  constructor(buffer) {
    this.pos = 0;
    this.buffer = buffer;
  }
  next() {
    return this.buffer.charCodeAt(this.pos++);
  }
  peek() {
    return this.buffer.charCodeAt(this.pos);
  }
  indexOf(char) {
    const { buffer, pos } = this;
    const idx = buffer.indexOf(char, pos);
    return idx === -1 ? buffer.length : idx;
  }
};

// src/sourcemap-codec.ts
function decode(mappings) {
  const { length } = mappings;
  const reader = new StringReader(mappings);
  const decoded = [];
  let genColumn = 0;
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  do {
    const semi = reader.indexOf(";");
    const line = [];
    let sorted = true;
    let lastCol = 0;
    genColumn = 0;
    while (reader.pos < semi) {
      let seg;
      genColumn = decodeInteger(reader, genColumn);
      if (genColumn < lastCol) sorted = false;
      lastCol = genColumn;
      if (hasMoreVlq(reader, semi)) {
        sourcesIndex = decodeInteger(reader, sourcesIndex);
        sourceLine = decodeInteger(reader, sourceLine);
        sourceColumn = decodeInteger(reader, sourceColumn);
        if (hasMoreVlq(reader, semi)) {
          namesIndex = decodeInteger(reader, namesIndex);
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex];
        } else {
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn];
        }
      } else {
        seg = [genColumn];
      }
      line.push(seg);
      reader.pos++;
    }
    if (!sorted) sort(line);
    decoded.push(line);
    reader.pos = semi + 1;
  } while (reader.pos <= length);
  return decoded;
}
function sort(line) {
  line.sort(sortComparator);
}
function sortComparator(a, b) {
  return a[0] - b[0];
}

// src/trace-mapping.ts

// src/sourcemap-segment.ts
var COLUMN = 0;
var SOURCES_INDEX = 1;
var SOURCE_LINE = 2;
var SOURCE_COLUMN = 3;
var NAMES_INDEX = 4;

// src/binary-search.ts
var found = false;
function binarySearch(haystack, needle, low, high) {
  while (low <= high) {
    const mid = low + (high - low >> 1);
    const cmp = haystack[mid][COLUMN] - needle;
    if (cmp === 0) {
      found = true;
      return mid;
    }
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  found = false;
  return low - 1;
}
function upperBound(haystack, needle, index) {
  for (let i = index + 1; i < haystack.length; index = i++) {
    if (haystack[i][COLUMN] !== needle) break;
  }
  return index;
}
function lowerBound(haystack, needle, index) {
  for (let i = index - 1; i >= 0; index = i--) {
    if (haystack[i][COLUMN] !== needle) break;
  }
  return index;
}
function memoizedBinarySearch(haystack, needle, state, key) {
  const { lastKey, lastNeedle, lastIndex } = state;
  let low = 0;
  let high = haystack.length - 1;
  if (key === lastKey) {
    if (needle === lastNeedle) {
      found = lastIndex !== -1 && haystack[lastIndex][COLUMN] === needle;
      return lastIndex;
    }
    if (needle >= lastNeedle) {
      low = lastIndex === -1 ? 0 : lastIndex;
    } else {
      high = lastIndex;
    }
  }
  state.lastKey = key;
  state.lastNeedle = needle;
  return state.lastIndex = binarySearch(haystack, needle, low, high);
}

// src/trace-mapping.ts
var LINE_GTR_ZERO = "`line` must be greater than 0 (lines start at line 1)";
var COL_GTR_EQ_ZERO = "`column` must be greater than or equal to 0 (columns start at column 0)";
var LEAST_UPPER_BOUND = -1;
var GREATEST_LOWER_BOUND = 1;
function cast(map) {
  return map;
}
function decodedMappings(map) {
  var _a;
  return (_a = cast(map))._decoded || (_a._decoded = decode(cast(map)._encoded));
}
function originalPositionFor(map, needle) {
  let { line, column, bias } = needle;
  line--;
  if (line < 0) throw new Error(LINE_GTR_ZERO);
  if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
  const decoded = decodedMappings(map);
  if (line >= decoded.length) return OMapping(null, null, null, null);
  const segments = decoded[line];
  const index = traceSegmentInternal(
    segments,
    cast(map)._decodedMemo,
    line,
    column,
    bias || GREATEST_LOWER_BOUND
  );
  if (index === -1) return OMapping(null, null, null, null);
  const segment = segments[index];
  if (segment.length === 1) return OMapping(null, null, null, null);
  const { names, resolvedSources } = map;
  return OMapping(
    resolvedSources[segment[SOURCES_INDEX]],
    segment[SOURCE_LINE] + 1,
    segment[SOURCE_COLUMN],
    segment.length === 5 ? names[segment[NAMES_INDEX]] : null
  );
}
function OMapping(source, line, column, name) {
  return { source, line, column, name };
}
function traceSegmentInternal(segments, memo, line, column, bias) {
  let index = memoizedBinarySearch(segments, column, memo, line);
  if (found) {
    index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
  } else if (bias === LEAST_UPPER_BOUND) index++;
  if (index === -1 || index === segments.length) return -1;
  return index;
}

function notNullish(v) {
	return v != null;
}
function isPrimitive(value) {
	return value === null || typeof value !== "function" && typeof value !== "object";
}
function isObject(item) {
	return item != null && typeof item === "object" && !Array.isArray(item);
}
/**
* If code starts with a function call, will return its last index, respecting arguments.
* This will return 25 - last ending character of toMatch ")"
* Also works with callbacks
* ```
* toMatch({ test: '123' });
* toBeAliased('123')
* ```
*/
function getCallLastIndex(code) {
	let charIndex = -1;
	let inString = null;
	let startedBracers = 0;
	let endedBracers = 0;
	let beforeChar = null;
	while (charIndex <= code.length) {
		beforeChar = code[charIndex];
		charIndex++;
		const char = code[charIndex];
		const isCharString = char === "\"" || char === "'" || char === "`";
		if (isCharString && beforeChar !== "\\") {
			if (inString === char) {
				inString = null;
			} else if (!inString) {
				inString = char;
			}
		}
		if (!inString) {
			if (char === "(") {
				startedBracers++;
			}
			if (char === ")") {
				endedBracers++;
			}
		}
		if (startedBracers && endedBracers && startedBracers === endedBracers) {
			return charIndex;
		}
	}
	return null;
}

const CHROME_IE_STACK_REGEXP = /^\s*at .*(?:\S:\d+|\(native\))/m;
const SAFARI_NATIVE_CODE_REGEXP = /^(?:eval@)?(?:\[native code\])?$/;
const stackIgnorePatterns = [
	"node:internal",
	/\/packages\/\w+\/dist\//,
	/\/@vitest\/\w+\/dist\//,
	"/vitest/dist/",
	"/vitest/src/",
	"/node_modules/chai/",
	"/node_modules/tinyspy/",
	"/vite/dist/node/module-runner",
	"/rolldown-vite/dist/node/module-runner",
	"/deps/chunk-",
	"/deps/@vitest",
	"/deps/loupe",
	"/deps/chai",
	"/browser-playwright/dist/locators.js",
	"/browser-webdriverio/dist/locators.js",
	"/browser-preview/dist/locators.js",
	/node:\w+/,
	/__vitest_test__/,
	/__vitest_browser__/,
	/\/deps\/vitest_/
];
function extractLocation(urlLike) {
	// Fail-fast but return locations like "(native)"
	if (!urlLike.includes(":")) {
		return [urlLike];
	}
	const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
	const parts = regExp.exec(urlLike.replace(/^\(|\)$/g, ""));
	if (!parts) {
		return [urlLike];
	}
	let url = parts[1];
	if (url.startsWith("async ")) {
		url = url.slice(6);
	}
	if (url.startsWith("http:") || url.startsWith("https:")) {
		const urlObj = new URL(url);
		urlObj.searchParams.delete("import");
		urlObj.searchParams.delete("browserv");
		url = urlObj.pathname + urlObj.hash + urlObj.search;
	}
	if (url.startsWith("/@fs/")) {
		const isWindows = /^\/@fs\/[a-zA-Z]:\//.test(url);
		url = url.slice(isWindows ? 5 : 4);
	}
	return [
		url,
		parts[2] || undefined,
		parts[3] || undefined
	];
}
function parseSingleFFOrSafariStack(raw) {
	let line = raw.trim();
	if (SAFARI_NATIVE_CODE_REGEXP.test(line)) {
		return null;
	}
	if (line.includes(" > eval")) {
		line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
	}
	// Early return for lines that don't look like Firefox/Safari stack traces
	// Firefox/Safari stack traces must contain '@' and should have location info after it
	if (!line.includes("@")) {
		return null;
	}
	// Find the correct @ that separates function name from location
	// For cases like '@https://@fs/path' or 'functionName@https://@fs/path'
	// we need to find the first @ that precedes a valid location (containing :)
	let atIndex = -1;
	let locationPart = "";
	let functionName;
	// Try each @ from left to right to find the one that gives us a valid location
	for (let i = 0; i < line.length; i++) {
		if (line[i] === "@") {
			const candidateLocation = line.slice(i + 1);
			// Minimum length 3 for valid location: 1 for filename + 1 for colon + 1 for line number (e.g., "a:1")
			if (candidateLocation.includes(":") && candidateLocation.length >= 3) {
				atIndex = i;
				locationPart = candidateLocation;
				functionName = i > 0 ? line.slice(0, i) : undefined;
				break;
			}
		}
	}
	// Validate we found a valid location with minimum length (filename:line format)
	if (atIndex === -1 || !locationPart.includes(":") || locationPart.length < 3) {
		return null;
	}
	const [url, lineNumber, columnNumber] = extractLocation(locationPart);
	if (!url || !lineNumber || !columnNumber) {
		return null;
	}
	return {
		file: url,
		method: functionName || "",
		line: Number.parseInt(lineNumber),
		column: Number.parseInt(columnNumber)
	};
}
// Based on https://github.com/stacktracejs/error-stack-parser
// Credit to stacktracejs
function parseSingleV8Stack(raw) {
	let line = raw.trim();
	if (!CHROME_IE_STACK_REGEXP.test(line)) {
		return null;
	}
	if (line.includes("(eval ")) {
		line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, "");
	}
	let sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
	// capture and preserve the parenthesized location "(/foo/my bar.js:12:87)" in
	// case it has spaces in it, as the string is split on \s+ later on
	const location = sanitizedLine.match(/ (\(.+\)$)/);
	// remove the parenthesized location from the line, if it was matched
	sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
	// if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
	// because this line doesn't have function name
	const [url, lineNumber, columnNumber] = extractLocation(location ? location[1] : sanitizedLine);
	let method = location && sanitizedLine || "";
	let file = url && ["eval", "<anonymous>"].includes(url) ? undefined : url;
	if (!file || !lineNumber || !columnNumber) {
		return null;
	}
	if (method.startsWith("async ")) {
		method = method.slice(6);
	}
	if (file.startsWith("file://")) {
		file = file.slice(7);
	}
	// normalize Windows path (\ -> /)
	file = file.startsWith("node:") || file.startsWith("internal:") ? file : resolve(file);
	if (method) {
		method = method.replace(/__vite_ssr_import_\d+__\./g, "").replace(/(Object\.)?__vite_ssr_export_default__\s?/g, "");
	}
	return {
		method,
		file,
		line: Number.parseInt(lineNumber),
		column: Number.parseInt(columnNumber)
	};
}
function parseStacktrace(stack, options = {}) {
	const { ignoreStackEntries = stackIgnorePatterns } = options;
	const stacks = !CHROME_IE_STACK_REGEXP.test(stack) ? parseFFOrSafariStackTrace(stack) : parseV8Stacktrace(stack);
	return stacks.map((stack) => {
		var _options$getSourceMap;
		if (options.getUrlId) {
			stack.file = options.getUrlId(stack.file);
		}
		const map = (_options$getSourceMap = options.getSourceMap) === null || _options$getSourceMap === void 0 ? void 0 : _options$getSourceMap.call(options, stack.file);
		if (!map || typeof map !== "object" || !map.version) {
			return shouldFilter(ignoreStackEntries, stack.file) ? null : stack;
		}
		const traceMap = new DecodedMap(map, stack.file);
		const position = getOriginalPosition(traceMap, stack);
		if (!position) {
			return stack;
		}
		const { line, column, source, name } = position;
		let file = source || stack.file;
		if (file.match(/\/\w:\//)) {
			file = file.slice(1);
		}
		if (shouldFilter(ignoreStackEntries, file)) {
			return null;
		}
		if (line != null && column != null) {
			return {
				line,
				column,
				file,
				method: name || stack.method
			};
		}
		return stack;
	}).filter((s) => s != null);
}
function shouldFilter(ignoreStackEntries, file) {
	return ignoreStackEntries.some((p) => file.match(p));
}
function parseFFOrSafariStackTrace(stack) {
	return stack.split("\n").map((line) => parseSingleFFOrSafariStack(line)).filter(notNullish);
}
function parseV8Stacktrace(stack) {
	return stack.split("\n").map((line) => parseSingleV8Stack(line)).filter(notNullish);
}
function parseErrorStacktrace(e, options = {}) {
	if (!e || isPrimitive(e)) {
		return [];
	}
	if ("stacks" in e && e.stacks) {
		return e.stacks;
	}
	const stackStr = e.stack || "";
	// if "stack" property was overwritten at runtime to be something else,
	// ignore the value because we don't know how to process it
	let stackFrames = typeof stackStr === "string" ? parseStacktrace(stackStr, options) : [];
	if (!stackFrames.length) {
		const e_ = e;
		if (e_.fileName != null && e_.lineNumber != null && e_.columnNumber != null) {
			stackFrames = parseStacktrace(`${e_.fileName}:${e_.lineNumber}:${e_.columnNumber}`, options);
		}
		if (e_.sourceURL != null && e_.line != null && e_._column != null) {
			stackFrames = parseStacktrace(`${e_.sourceURL}:${e_.line}:${e_.column}`, options);
		}
	}
	if (options.frameFilter) {
		stackFrames = stackFrames.filter((f) => options.frameFilter(e, f) !== false);
	}
	e.stacks = stackFrames;
	return stackFrames;
}
class DecodedMap {
	_encoded;
	_decoded;
	_decodedMemo;
	url;
	version;
	names = [];
	resolvedSources;
	constructor(map, from) {
		this.map = map;
		const { mappings, names, sources } = map;
		this.version = map.version;
		this.names = names || [];
		this._encoded = mappings || "";
		this._decodedMemo = memoizedState();
		this.url = from;
		this.resolvedSources = (sources || []).map((s) => resolve(s || "", from));
	}
}
function memoizedState() {
	return {
		lastKey: -1,
		lastNeedle: -1,
		lastIndex: -1
	};
}
function getOriginalPosition(map, needle) {
	const result = originalPositionFor(map, needle);
	if (result.column == null) {
		return null;
	}
	return result;
}

const lineSplitRE = /\r?\n/;
function positionToOffset(source, lineNumber, columnNumber) {
	const lines = source.split(lineSplitRE);
	const nl = /\r\n/.test(source) ? 2 : 1;
	let start = 0;
	if (lineNumber > lines.length) {
		return source.length;
	}
	for (let i = 0; i < lineNumber - 1; i++) {
		start += lines[i].length + nl;
	}
	return start + columnNumber;
}
function offsetToLineNumber(source, offset) {
	if (offset > source.length) {
		throw new Error(`offset is longer than source length! offset ${offset} > length ${source.length}`);
	}
	const lines = source.split(lineSplitRE);
	const nl = /\r\n/.test(source) ? 2 : 1;
	let counted = 0;
	let line = 0;
	for (; line < lines.length; line++) {
		const lineLength = lines[line].length + nl;
		if (counted + lineLength >= offset) {
			break;
		}
		counted += lineLength;
	}
	return line + 1;
}

async function saveInlineSnapshots(environment, snapshots) {
	const MagicString = (await import('./magic-string.es_gKRqwLep.mjs')).default;
	const files = new Set(snapshots.map((i) => i.file));
	await Promise.all(Array.from(files).map(async (file) => {
		const snaps = snapshots.filter((i) => i.file === file);
		const code = await environment.readSnapshotFile(file);
		const s = new MagicString(code);
		for (const snap of snaps) {
			const index = positionToOffset(code, snap.line, snap.column);
			replaceInlineSnap(code, s, index, snap.snapshot);
		}
		const transformed = s.toString();
		if (transformed !== code) {
			await environment.saveSnapshotFile(file, transformed);
		}
	}));
}
const startObjectRegex = /(?:toMatchInlineSnapshot|toThrowErrorMatchingInlineSnapshot)\s*\(\s*(?:\/\*[\s\S]*\*\/\s*|\/\/.*(?:[\n\r\u2028\u2029]\s*|[\t\v\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF]))*\{/;
function replaceObjectSnap(code, s, index, newSnap) {
	let _code = code.slice(index);
	const startMatch = startObjectRegex.exec(_code);
	if (!startMatch) {
		return false;
	}
	_code = _code.slice(startMatch.index);
	let callEnd = getCallLastIndex(_code);
	if (callEnd === null) {
		return false;
	}
	callEnd += index + startMatch.index;
	const shapeStart = index + startMatch.index + startMatch[0].length;
	const shapeEnd = getObjectShapeEndIndex(code, shapeStart);
	const snap = `, ${prepareSnapString(newSnap, code, index)}`;
	if (shapeEnd === callEnd) {
		// toMatchInlineSnapshot({ foo: expect.any(String) })
		s.appendLeft(callEnd, snap);
	} else {
		// toMatchInlineSnapshot({ foo: expect.any(String) }, ``)
		s.overwrite(shapeEnd, callEnd, snap);
	}
	return true;
}
function getObjectShapeEndIndex(code, index) {
	let startBraces = 1;
	let endBraces = 0;
	while (startBraces !== endBraces && index < code.length) {
		const s = code[index++];
		if (s === "{") {
			startBraces++;
		} else if (s === "}") {
			endBraces++;
		}
	}
	return index;
}
function prepareSnapString(snap, source, index) {
	const lineNumber = offsetToLineNumber(source, index);
	const line = source.split(lineSplitRE)[lineNumber - 1];
	const indent = line.match(/^\s*/)[0] || "";
	const indentNext = indent.includes("	") ? `${indent}\t` : `${indent}  `;
	const lines = snap.trim().replace(/\\/g, "\\\\").split(/\n/g);
	const isOneline = lines.length <= 1;
	const quote = "`";
	if (isOneline) {
		return `${quote}${lines.join("\n").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}${quote}`;
	}
	return `${quote}\n${lines.map((i) => i ? indentNext + i : "").join("\n").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\n${indent}${quote}`;
}
const toMatchInlineName = "toMatchInlineSnapshot";
const toThrowErrorMatchingInlineName = "toThrowErrorMatchingInlineSnapshot";
// on webkit, the line number is at the end of the method, not at the start
function getCodeStartingAtIndex(code, index) {
	const indexInline = index - toMatchInlineName.length;
	if (code.slice(indexInline, index) === toMatchInlineName) {
		return {
			code: code.slice(indexInline),
			index: indexInline
		};
	}
	const indexThrowInline = index - toThrowErrorMatchingInlineName.length;
	if (code.slice(index - indexThrowInline, index) === toThrowErrorMatchingInlineName) {
		return {
			code: code.slice(index - indexThrowInline),
			index: index - indexThrowInline
		};
	}
	return {
		code: code.slice(index),
		index
	};
}
const startRegex = /(?:toMatchInlineSnapshot|toThrowErrorMatchingInlineSnapshot)\s*\(\s*(?:\/\*[\s\S]*\*\/\s*|\/\/.*(?:[\n\r\u2028\u2029]\s*|[\t\v\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF]))*[\w$]*(['"`)])/;
function replaceInlineSnap(code, s, currentIndex, newSnap) {
	const { code: codeStartingAtIndex, index } = getCodeStartingAtIndex(code, currentIndex);
	const startMatch = startRegex.exec(codeStartingAtIndex);
	const firstKeywordMatch = /toMatchInlineSnapshot|toThrowErrorMatchingInlineSnapshot/.exec(codeStartingAtIndex);
	if (!startMatch || startMatch.index !== (firstKeywordMatch === null || firstKeywordMatch === void 0 ? void 0 : firstKeywordMatch.index)) {
		return replaceObjectSnap(code, s, index, newSnap);
	}
	const quote = startMatch[1];
	const startIndex = index + startMatch.index + startMatch[0].length;
	const snapString = prepareSnapString(newSnap, code, index);
	if (quote === ")") {
		s.appendRight(startIndex - 1, snapString);
		return true;
	}
	const quoteEndRE = new RegExp(`(?:^|[^\\\\])${quote}`);
	const endMatch = quoteEndRE.exec(code.slice(startIndex));
	if (!endMatch) {
		return false;
	}
	const endIndex = startIndex + endMatch.index + endMatch[0].length;
	s.overwrite(startIndex - 1, endIndex, snapString);
	return true;
}
const INDENTATION_REGEX = /^([^\S\n]*)\S/m;
function stripSnapshotIndentation(inlineSnapshot) {
	var _lines$at;
	// Find indentation if exists.
	const match = inlineSnapshot.match(INDENTATION_REGEX);
	if (!match || !match[1]) {
		// No indentation.
		return inlineSnapshot;
	}
	const indentation = match[1];
	const lines = inlineSnapshot.split(/\n/g);
	if (lines.length <= 2) {
		// Must be at least 3 lines.
		return inlineSnapshot;
	}
	if (lines[0].trim() !== "" || ((_lines$at = lines.at(-1)) === null || _lines$at === void 0 ? void 0 : _lines$at.trim()) !== "") {
		// If not blank first and last lines, abort.
		return inlineSnapshot;
	}
	for (let i = 1; i < lines.length - 1; i++) {
		if (lines[i] !== "") {
			if (lines[i].indexOf(indentation) !== 0) {
				// All lines except first and last should either be blank or have the same
				// indent as the first line (or more). If this isn't the case we don't
				// want to touch the snapshot at all.
				return inlineSnapshot;
			}
			lines[i] = lines[i].substring(indentation.length);
		}
	}
	// Last line is a special case because it won't have the same indent as others
	// but may still have been given some indent to line up.
	lines[lines.length - 1] = "";
	// Return inline snapshot, now at indent 0.
	inlineSnapshot = lines.join("\n");
	return inlineSnapshot;
}

async function saveRawSnapshots(environment, snapshots) {
	await Promise.all(snapshots.map(async (snap) => {
		if (!snap.readonly) {
			await environment.saveSnapshotFile(snap.file, snap.snapshot);
		}
	}));
}

function getDefaultExportFromCjs(x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}

var naturalCompare$1 = {exports: {}};

var hasRequiredNaturalCompare;

function requireNaturalCompare () {
	if (hasRequiredNaturalCompare) return naturalCompare$1.exports;
	hasRequiredNaturalCompare = 1;
	/*
	 * @version    1.4.0
	 * @date       2015-10-26
	 * @stability  3 - Stable
	 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
	 * @license    MIT License
	 */


	var naturalCompare = function(a, b) {
		var i, codeA
		, codeB = 1
		, posA = 0
		, posB = 0
		, alphabet = String.alphabet;

		function getCode(str, pos, code) {
			if (code) {
				for (i = pos; code = getCode(str, i), code < 76 && code > 65;) ++i;
				return +str.slice(pos - 1, i)
			}
			code = alphabet && alphabet.indexOf(str.charAt(pos));
			return code > -1 ? code + 76 : ((code = str.charCodeAt(pos) || 0), code < 45 || code > 127) ? code
				: code < 46 ? 65               // -
				: code < 48 ? code - 1
				: code < 58 ? code + 18        // 0-9
				: code < 65 ? code - 11
				: code < 91 ? code + 11        // A-Z
				: code < 97 ? code - 37
				: code < 123 ? code + 5        // a-z
				: code - 63
		}


		if ((a+="") != (b+="")) for (;codeB;) {
			codeA = getCode(a, posA++);
			codeB = getCode(b, posB++);

			if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
				codeA = getCode(a, posA, posA);
				codeB = getCode(b, posB, posA = i);
				posB = i;
			}

			if (codeA != codeB) return (codeA < codeB) ? -1 : 1
		}
		return 0
	};

	try {
		naturalCompare$1.exports = naturalCompare;
	} catch (e) {
		String.naturalCompare = naturalCompare;
	}
	return naturalCompare$1.exports;
}

var naturalCompareExports = requireNaturalCompare();
var naturalCompare = /*@__PURE__*/getDefaultExportFromCjs(naturalCompareExports);

const serialize$1 = (val, config, indentation, depth, refs, printer) => {
	// Serialize a non-default name, even if config.printFunctionName is false.
	const name = val.getMockName();
	const nameString = name === "vi.fn()" ? "" : ` ${name}`;
	let callsString = "";
	if (val.mock.calls.length !== 0) {
		const indentationNext = indentation + config.indent;
		callsString = ` {${config.spacingOuter}${indentationNext}"calls": ${printer(val.mock.calls, config, indentationNext, depth, refs)}${config.min ? ", " : ","}${config.spacingOuter}${indentationNext}"results": ${printer(val.mock.results, config, indentationNext, depth, refs)}${config.min ? "" : ","}${config.spacingOuter}${indentation}}`;
	}
	return `[MockFunction${nameString}]${callsString}`;
};
const test = (val) => val && !!val._isMockFunction;
const plugin = {
	serialize: serialize$1,
	test
};

const { DOMCollection, DOMElement, Immutable, ReactElement, ReactTestComponent, AsymmetricMatcher } = plugins;
let PLUGINS = [
	ReactTestComponent,
	ReactElement,
	DOMElement,
	DOMCollection,
	Immutable,
	AsymmetricMatcher,
	plugin
];
function addSerializer(plugin) {
	PLUGINS = [plugin].concat(PLUGINS);
}
function getSerializers() {
	return PLUGINS;
}

// TODO: rewrite and clean up
function testNameToKey(testName, count) {
	return `${testName} ${count}`;
}
function keyToTestName(key) {
	if (!/ \d+$/.test(key)) {
		throw new Error("Snapshot keys must end with a number.");
	}
	return key.replace(/ \d+$/, "");
}
function getSnapshotData(content, options) {
	const update = options.updateSnapshot;
	const data = Object.create(null);
	let snapshotContents = "";
	let dirty = false;
	if (content != null) {
		try {
			snapshotContents = content;
			// eslint-disable-next-line no-new-func
			const populate = new Function("exports", snapshotContents);
			populate(data);
		} catch {}
	}
	// const validationResult = validateSnapshotVersion(snapshotContents)
	const isInvalid = snapshotContents;
	// if (update === 'none' && isInvalid)
	//   throw validationResult
	if ((update === "all" || update === "new") && isInvalid) {
		dirty = true;
	}
	return {
		data,
		dirty
	};
}
// Add extra line breaks at beginning and end of multiline snapshot
// to make the content easier to read.
function addExtraLineBreaks(string) {
	return string.includes("\n") ? `\n${string}\n` : string;
}
// Remove extra line breaks at beginning and end of multiline snapshot.
// Instead of trim, which can remove additional newlines or spaces
// at beginning or end of the content from a custom serializer.
function removeExtraLineBreaks(string) {
	return string.length > 2 && string[0] === "\n" && string.endsWith("\n") ? string.slice(1, -1) : string;
}
// export const removeLinesBeforeExternalMatcherTrap = (stack: string): string => {
//   const lines = stack.split('\n')
//   for (let i = 0; i < lines.length; i += 1) {
//     // It's a function name specified in `packages/expect/src/index.ts`
//     // for external custom matchers.
//     if (lines[i].includes('__EXTERNAL_MATCHER_TRAP__'))
//       return lines.slice(i + 1).join('\n')
//   }
//   return stack
// }
const escapeRegex = true;
const printFunctionName = false;
function serialize(val, indent = 2, formatOverrides = {}) {
	return normalizeNewlines(format$1(val, {
		escapeRegex,
		indent,
		plugins: getSerializers(),
		printFunctionName,
		...formatOverrides
	}));
}
function escapeBacktickString(str) {
	return str.replace(/`|\\|\$\{/g, "\\$&");
}
function printBacktickString(str) {
	return `\`${escapeBacktickString(str)}\``;
}
function normalizeNewlines(string) {
	return string.replace(/\r\n|\r/g, "\n");
}
async function saveSnapshotFile(environment, snapshotData, snapshotPath) {
	const snapshots = Object.keys(snapshotData).sort(naturalCompare).map((key) => `exports[${printBacktickString(key)}] = ${printBacktickString(normalizeNewlines(snapshotData[key]))};`);
	const content = `${environment.getHeader()}\n\n${snapshots.join("\n\n")}\n`;
	const oldContent = await environment.readSnapshotFile(snapshotPath);
	const skipWriting = oldContent != null && oldContent === content;
	if (skipWriting) {
		return;
	}
	await environment.saveSnapshotFile(snapshotPath, content);
}
function deepMergeArray(target = [], source = []) {
	const mergedOutput = Array.from(target);
	source.forEach((sourceElement, index) => {
		const targetElement = mergedOutput[index];
		if (Array.isArray(target[index])) {
			mergedOutput[index] = deepMergeArray(target[index], sourceElement);
		} else if (isObject(targetElement)) {
			mergedOutput[index] = deepMergeSnapshot(target[index], sourceElement);
		} else {
			// Source does not exist in target or target is primitive and cannot be deep merged
			mergedOutput[index] = sourceElement;
		}
	});
	return mergedOutput;
}
/**
* Deep merge, but considers asymmetric matchers. Unlike base util's deep merge,
* will merge any object-like instance.
* Compatible with Jest's snapshot matcher. Should not be used outside of snapshot.
*
* @example
* ```ts
* toMatchSnapshot({
*   name: expect.stringContaining('text')
* })
* ```
*/
function deepMergeSnapshot(target, source) {
	if (isObject(target) && isObject(source)) {
		const mergedOutput = { ...target };
		Object.keys(source).forEach((key) => {
			if (isObject(source[key]) && !source[key].$$typeof) {
				if (!(key in target)) {
					Object.assign(mergedOutput, { [key]: source[key] });
				} else {
					mergedOutput[key] = deepMergeSnapshot(target[key], source[key]);
				}
			} else if (Array.isArray(source[key])) {
				mergedOutput[key] = deepMergeArray(target[key], source[key]);
			} else {
				Object.assign(mergedOutput, { [key]: source[key] });
			}
		});
		return mergedOutput;
	} else if (Array.isArray(target) && Array.isArray(source)) {
		return deepMergeArray(target, source);
	}
	return target;
}
class DefaultMap extends Map {
	constructor(defaultFn, entries) {
		super(entries);
		this.defaultFn = defaultFn;
	}
	get(key) {
		if (!this.has(key)) {
			this.set(key, this.defaultFn(key));
		}
		return super.get(key);
	}
}
class CounterMap extends DefaultMap {
	constructor() {
		super(() => 0);
	}
	// compat for jest-image-snapshot https://github.com/vitest-dev/vitest/issues/7322
	// `valueOf` and `Snapshot.added` setter allows
	//   snapshotState.added = snapshotState.added + 1
	// to function as
	//   snapshotState.added.total_ = snapshotState.added.total() + 1
	_total;
	valueOf() {
		return this._total = this.total();
	}
	increment(key) {
		if (typeof this._total !== "undefined") {
			this._total++;
		}
		this.set(key, this.get(key) + 1);
	}
	total() {
		if (typeof this._total !== "undefined") {
			return this._total;
		}
		let total = 0;
		for (const x of this.values()) {
			total += x;
		}
		return total;
	}
}

function isSameStackPosition(x, y) {
	return x.file === y.file && x.column === y.column && x.line === y.line;
}
class SnapshotState {
	_counters = new CounterMap();
	_dirty;
	_updateSnapshot;
	_snapshotData;
	_initialData;
	_inlineSnapshots;
	_inlineSnapshotStacks;
	_testIdToKeys = new DefaultMap(() => []);
	_rawSnapshots;
	_uncheckedKeys;
	_snapshotFormat;
	_environment;
	_fileExists;
	expand;
	// getter/setter for jest-image-snapshot compat
	// https://github.com/vitest-dev/vitest/issues/7322
	_added = new CounterMap();
	_matched = new CounterMap();
	_unmatched = new CounterMap();
	_updated = new CounterMap();
	get added() {
		return this._added;
	}
	set added(value) {
		this._added._total = value;
	}
	get matched() {
		return this._matched;
	}
	set matched(value) {
		this._matched._total = value;
	}
	get unmatched() {
		return this._unmatched;
	}
	set unmatched(value) {
		this._unmatched._total = value;
	}
	get updated() {
		return this._updated;
	}
	set updated(value) {
		this._updated._total = value;
	}
	constructor(testFilePath, snapshotPath, snapshotContent, options) {
		this.testFilePath = testFilePath;
		this.snapshotPath = snapshotPath;
		const { data, dirty } = getSnapshotData(snapshotContent, options);
		this._fileExists = snapshotContent != null;
		this._initialData = { ...data };
		this._snapshotData = { ...data };
		this._dirty = dirty;
		this._inlineSnapshots = [];
		this._inlineSnapshotStacks = [];
		this._rawSnapshots = [];
		this._uncheckedKeys = new Set(Object.keys(this._snapshotData));
		this.expand = options.expand || false;
		this._updateSnapshot = options.updateSnapshot;
		this._snapshotFormat = {
			printBasicPrototype: false,
			escapeString: false,
			...options.snapshotFormat
		};
		this._environment = options.snapshotEnvironment;
	}
	static async create(testFilePath, options) {
		const snapshotPath = await options.snapshotEnvironment.resolvePath(testFilePath);
		const content = await options.snapshotEnvironment.readSnapshotFile(snapshotPath);
		return new SnapshotState(testFilePath, snapshotPath, content, options);
	}
	get environment() {
		return this._environment;
	}
	markSnapshotsAsCheckedForTest(testName) {
		this._uncheckedKeys.forEach((uncheckedKey) => {
			// skip snapshots with following keys
			//   testName n
			//   testName > xxx n (this is for toMatchSnapshot("xxx") API)
			if (/ \d+$| > /.test(uncheckedKey.slice(testName.length))) {
				this._uncheckedKeys.delete(uncheckedKey);
			}
		});
	}
	clearTest(testId) {
		// clear inline
		this._inlineSnapshots = this._inlineSnapshots.filter((s) => s.testId !== testId);
		this._inlineSnapshotStacks = this._inlineSnapshotStacks.filter((s) => s.testId !== testId);
		// clear file
		for (const key of this._testIdToKeys.get(testId)) {
			const name = keyToTestName(key);
			const count = this._counters.get(name);
			if (count > 0) {
				if (key in this._snapshotData || key in this._initialData) {
					this._snapshotData[key] = this._initialData[key];
				}
				this._counters.set(name, count - 1);
			}
		}
		this._testIdToKeys.delete(testId);
		// clear stats
		this.added.delete(testId);
		this.updated.delete(testId);
		this.matched.delete(testId);
		this.unmatched.delete(testId);
	}
	_inferInlineSnapshotStack(stacks) {
		// if called inside resolves/rejects, stacktrace is different
		const promiseIndex = stacks.findIndex((i) => i.method.match(/__VITEST_(RESOLVES|REJECTS)__/));
		if (promiseIndex !== -1) {
			return stacks[promiseIndex + 3];
		}
		// inline snapshot function is called __INLINE_SNAPSHOT__
		// in integrations/snapshot/chai.ts
		const stackIndex = stacks.findIndex((i) => i.method.includes("__INLINE_SNAPSHOT__"));
		return stackIndex !== -1 ? stacks[stackIndex + 2] : null;
	}
	_addSnapshot(key, receivedSerialized, options) {
		this._dirty = true;
		if (options.stack) {
			this._inlineSnapshots.push({
				snapshot: receivedSerialized,
				testId: options.testId,
				...options.stack
			});
		} else if (options.rawSnapshot) {
			this._rawSnapshots.push({
				...options.rawSnapshot,
				snapshot: receivedSerialized
			});
		} else {
			this._snapshotData[key] = receivedSerialized;
		}
	}
	async save() {
		const hasExternalSnapshots = Object.keys(this._snapshotData).length;
		const hasInlineSnapshots = this._inlineSnapshots.length;
		const hasRawSnapshots = this._rawSnapshots.length;
		const isEmpty = !hasExternalSnapshots && !hasInlineSnapshots && !hasRawSnapshots;
		const status = {
			deleted: false,
			saved: false
		};
		if ((this._dirty || this._uncheckedKeys.size) && !isEmpty) {
			if (hasExternalSnapshots) {
				await saveSnapshotFile(this._environment, this._snapshotData, this.snapshotPath);
				this._fileExists = true;
			}
			if (hasInlineSnapshots) {
				await saveInlineSnapshots(this._environment, this._inlineSnapshots);
			}
			if (hasRawSnapshots) {
				await saveRawSnapshots(this._environment, this._rawSnapshots);
			}
			status.saved = true;
		} else if (!hasExternalSnapshots && this._fileExists) {
			if (this._updateSnapshot === "all") {
				await this._environment.removeSnapshotFile(this.snapshotPath);
				this._fileExists = false;
			}
			status.deleted = true;
		}
		return status;
	}
	getUncheckedCount() {
		return this._uncheckedKeys.size || 0;
	}
	getUncheckedKeys() {
		return Array.from(this._uncheckedKeys);
	}
	removeUncheckedKeys() {
		if (this._updateSnapshot === "all" && this._uncheckedKeys.size) {
			this._dirty = true;
			this._uncheckedKeys.forEach((key) => delete this._snapshotData[key]);
			this._uncheckedKeys.clear();
		}
	}
	match({ testId, testName, received, key, inlineSnapshot, isInline, error, rawSnapshot }) {
		// this also increments counter for inline snapshots. maybe we shouldn't?
		this._counters.increment(testName);
		const count = this._counters.get(testName);
		if (!key) {
			key = testNameToKey(testName, count);
		}
		this._testIdToKeys.get(testId).push(key);
		// Do not mark the snapshot as "checked" if the snapshot is inline and
		// there's an external snapshot. This way the external snapshot can be
		// removed with `--updateSnapshot`.
		if (!(isInline && this._snapshotData[key] !== undefined)) {
			this._uncheckedKeys.delete(key);
		}
		let receivedSerialized = rawSnapshot && typeof received === "string" ? received : serialize(received, undefined, this._snapshotFormat);
		if (!rawSnapshot) {
			receivedSerialized = addExtraLineBreaks(receivedSerialized);
		}
		if (rawSnapshot) {
			// normalize EOL when snapshot contains CRLF but received is LF
			if (rawSnapshot.content && rawSnapshot.content.match(/\r\n/) && !receivedSerialized.match(/\r\n/)) {
				rawSnapshot.content = normalizeNewlines(rawSnapshot.content);
			}
		}
		const expected = isInline ? inlineSnapshot : rawSnapshot ? rawSnapshot.content : this._snapshotData[key];
		const expectedTrimmed = rawSnapshot ? expected : expected === null || expected === void 0 ? void 0 : expected.trim();
		const pass = expectedTrimmed === (rawSnapshot ? receivedSerialized : receivedSerialized.trim());
		const hasSnapshot = expected !== undefined;
		const snapshotIsPersisted = isInline || this._fileExists || rawSnapshot && rawSnapshot.content != null;
		if (pass && !isInline && !rawSnapshot) {
			// Executing a snapshot file as JavaScript and writing the strings back
			// when other snapshots have changed loses the proper escaping for some
			// characters. Since we check every snapshot in every test, use the newly
			// generated formatted string.
			// Note that this is only relevant when a snapshot is added and the dirty
			// flag is set.
			this._snapshotData[key] = receivedSerialized;
		}
		// find call site of toMatchInlineSnapshot
		let stack;
		if (isInline) {
			var _this$environment$pro, _this$environment;
			const stacks = parseErrorStacktrace(error || new Error("snapshot"), { ignoreStackEntries: [] });
			const _stack = this._inferInlineSnapshotStack(stacks);
			if (!_stack) {
				throw new Error(`@vitest/snapshot: Couldn't infer stack frame for inline snapshot.\n${JSON.stringify(stacks)}`);
			}
			stack = ((_this$environment$pro = (_this$environment = this.environment).processStackTrace) === null || _this$environment$pro === void 0 ? void 0 : _this$environment$pro.call(_this$environment, _stack)) || _stack;
			// removing 1 column, because source map points to the wrong
			// location for js files, but `column-1` points to the same in both js/ts
			// https://github.com/vitejs/vite/issues/8657
			stack.column--;
			// reject multiple inline snapshots at the same location if snapshot is different
			const snapshotsWithSameStack = this._inlineSnapshotStacks.filter((s) => isSameStackPosition(s, stack));
			if (snapshotsWithSameStack.length > 0) {
				// ensure only one snapshot will be written at the same location
				this._inlineSnapshots = this._inlineSnapshots.filter((s) => !isSameStackPosition(s, stack));
				const differentSnapshot = snapshotsWithSameStack.find((s) => s.snapshot !== receivedSerialized);
				if (differentSnapshot) {
					throw Object.assign(new Error("toMatchInlineSnapshot with different snapshots cannot be called at the same location"), {
						actual: receivedSerialized,
						expected: differentSnapshot.snapshot
					});
				}
			}
			this._inlineSnapshotStacks.push({
				...stack,
				testId,
				snapshot: receivedSerialized
			});
		}
		// These are the conditions on when to write snapshots:
		//  * There's no snapshot file in a non-CI environment.
		//  * There is a snapshot file and we decided to update the snapshot.
		//  * There is a snapshot file, but it doesn't have this snapshot.
		// These are the conditions on when not to write snapshots:
		//  * The update flag is set to 'none'.
		//  * There's no snapshot file or a file without this snapshot on a CI environment.
		if (hasSnapshot && this._updateSnapshot === "all" || (!hasSnapshot || !snapshotIsPersisted) && (this._updateSnapshot === "new" || this._updateSnapshot === "all")) {
			if (this._updateSnapshot === "all") {
				if (!pass) {
					if (hasSnapshot) {
						this.updated.increment(testId);
					} else {
						this.added.increment(testId);
					}
					this._addSnapshot(key, receivedSerialized, {
						stack,
						testId,
						rawSnapshot
					});
				} else {
					this.matched.increment(testId);
				}
			} else {
				this._addSnapshot(key, receivedSerialized, {
					stack,
					testId,
					rawSnapshot
				});
				this.added.increment(testId);
			}
			return {
				actual: "",
				count,
				expected: "",
				key,
				pass: true
			};
		} else {
			if (!pass) {
				this.unmatched.increment(testId);
				return {
					actual: rawSnapshot ? receivedSerialized : removeExtraLineBreaks(receivedSerialized),
					count,
					expected: expectedTrimmed !== undefined ? rawSnapshot ? expectedTrimmed : removeExtraLineBreaks(expectedTrimmed) : undefined,
					key,
					pass: false
				};
			} else {
				this.matched.increment(testId);
				return {
					actual: "",
					count,
					expected: "",
					key,
					pass: true
				};
			}
		}
	}
	async pack() {
		const snapshot = {
			filepath: this.testFilePath,
			added: 0,
			fileDeleted: false,
			matched: 0,
			unchecked: 0,
			uncheckedKeys: [],
			unmatched: 0,
			updated: 0
		};
		const uncheckedCount = this.getUncheckedCount();
		const uncheckedKeys = this.getUncheckedKeys();
		if (uncheckedCount) {
			this.removeUncheckedKeys();
		}
		const status = await this.save();
		snapshot.fileDeleted = status.deleted;
		snapshot.added = this.added.total();
		snapshot.matched = this.matched.total();
		snapshot.unmatched = this.unmatched.total();
		snapshot.updated = this.updated.total();
		snapshot.unchecked = !status.deleted ? uncheckedCount : 0;
		snapshot.uncheckedKeys = Array.from(uncheckedKeys);
		return snapshot;
	}
}

function createMismatchError(message, expand, actual, expected) {
	const error = new Error(message);
	Object.defineProperty(error, "actual", {
		value: actual,
		enumerable: true,
		configurable: true,
		writable: true
	});
	Object.defineProperty(error, "expected", {
		value: expected,
		enumerable: true,
		configurable: true,
		writable: true
	});
	Object.defineProperty(error, "diffOptions", { value: { expand } });
	return error;
}
class SnapshotClient {
	snapshotStateMap = new Map();
	constructor(options = {}) {
		this.options = options;
	}
	async setup(filepath, options) {
		if (this.snapshotStateMap.has(filepath)) {
			return;
		}
		this.snapshotStateMap.set(filepath, await SnapshotState.create(filepath, options));
	}
	async finish(filepath) {
		const state = this.getSnapshotState(filepath);
		const result = await state.pack();
		this.snapshotStateMap.delete(filepath);
		return result;
	}
	skipTest(filepath, testName) {
		const state = this.getSnapshotState(filepath);
		state.markSnapshotsAsCheckedForTest(testName);
	}
	clearTest(filepath, testId) {
		const state = this.getSnapshotState(filepath);
		state.clearTest(testId);
	}
	getSnapshotState(filepath) {
		const state = this.snapshotStateMap.get(filepath);
		if (!state) {
			throw new Error(`The snapshot state for '${filepath}' is not found. Did you call 'SnapshotClient.setup()'?`);
		}
		return state;
	}
	assert(options) {
		const { filepath, name, testId = name, message, isInline = false, properties, inlineSnapshot, error, errorMessage, rawSnapshot } = options;
		let { received } = options;
		if (!filepath) {
			throw new Error("Snapshot cannot be used outside of test");
		}
		const snapshotState = this.getSnapshotState(filepath);
		if (typeof properties === "object") {
			if (typeof received !== "object" || !received) {
				throw new Error("Received value must be an object when the matcher has properties");
			}
			try {
				var _this$options$isEqual, _this$options;
				const pass = ((_this$options$isEqual = (_this$options = this.options).isEqual) === null || _this$options$isEqual === void 0 ? void 0 : _this$options$isEqual.call(_this$options, received, properties)) ?? false;
				// const pass = equals(received, properties, [iterableEquality, subsetEquality])
				if (!pass) {
					throw createMismatchError("Snapshot properties mismatched", snapshotState.expand, received, properties);
				} else {
					received = deepMergeSnapshot(received, properties);
				}
			} catch (err) {
				err.message = errorMessage || "Snapshot mismatched";
				throw err;
			}
		}
		const testName = [name, ...message ? [message] : []].join(" > ");
		const { actual, expected, key, pass } = snapshotState.match({
			testId,
			testName,
			received,
			isInline,
			error,
			inlineSnapshot,
			rawSnapshot
		});
		if (!pass) {
			throw createMismatchError(`Snapshot \`${key || "unknown"}\` mismatched`, snapshotState.expand, rawSnapshot ? actual : actual === null || actual === void 0 ? void 0 : actual.trim(), rawSnapshot ? expected : expected === null || expected === void 0 ? void 0 : expected.trim());
		}
	}
	async assertRaw(options) {
		if (!options.rawSnapshot) {
			throw new Error("Raw snapshot is required");
		}
		const { filepath, rawSnapshot } = options;
		if (rawSnapshot.content == null) {
			if (!filepath) {
				throw new Error("Snapshot cannot be used outside of test");
			}
			const snapshotState = this.getSnapshotState(filepath);
			// save the filepath, so it don't lose even if the await make it out-of-context
			options.filepath || (options.filepath = filepath);
			// resolve and read the raw snapshot file
			rawSnapshot.file = await snapshotState.environment.resolveRawPath(filepath, rawSnapshot.file);
			rawSnapshot.content = await snapshotState.environment.readSnapshotFile(rawSnapshot.file) ?? undefined;
		}
		return this.assert(options);
	}
	clear() {
		this.snapshotStateMap.clear();
	}
}

var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};

/* Ported from https://github.com/boblauer/MockDate/blob/master/src/mockdate.ts */
/*
The MIT License (MIT)

Copyright (c) 2014 Bob Lauer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const RealDate = Date;
let now = null;
class MockDate extends RealDate {
	constructor(y, m, d, h, M, s, ms) {
		super();
		let date;
		switch (arguments.length) {
			case 0:
				if (now !== null) date = new RealDate(now.valueOf());
				else date = new RealDate();
				break;
			case 1:
				date = new RealDate(y);
				break;
			default:
				d = typeof d === "undefined" ? 1 : d;
				h = h || 0;
				M = M || 0;
				s = s || 0;
				ms = ms || 0;
				date = new RealDate(y, m, d, h, M, s, ms);
				break;
		}
		Object.setPrototypeOf(date, MockDate.prototype);
		return date;
	}
}
MockDate.UTC = RealDate.UTC;
MockDate.now = function() {
	return new MockDate().valueOf();
};
MockDate.parse = function(dateString) {
	return RealDate.parse(dateString);
};
MockDate.toString = function() {
	return RealDate.toString();
};
function mockDate(date) {
	const dateObj = new RealDate(date.valueOf());
	if (Number.isNaN(dateObj.getTime())) throw new TypeError(`mockdate: The time set is an invalid date: ${date}`);
	// @ts-expect-error global
	globalThis.Date = MockDate;
	now = dateObj.valueOf();
}
function resetDate() {
	globalThis.Date = RealDate;
}

// these matchers are not supported because they don't make sense with poll
const unsupported = [
	"matchSnapshot",
	"toMatchSnapshot",
	"toMatchInlineSnapshot",
	"toThrowErrorMatchingSnapshot",
	"toThrowErrorMatchingInlineSnapshot",
	"throws",
	"Throw",
	"throw",
	"toThrow",
	"toThrowError"
];
/**
* Attaches a `cause` property to the error if missing, copies the stack trace from the source, and throws.
*
* @param error - The error to throw
* @param source - Error to copy the stack trace from
*
* @throws Always throws the provided error with an amended stack trace
*/
function throwWithCause(error, source) {
	if (error.cause == null) error.cause = /* @__PURE__ */ new Error("Matcher did not succeed in time.");
	throw copyStackTrace$1(error, source);
}
function createExpectPoll(expect) {
	return function poll(fn, options = {}) {
		const defaults = getWorkerState().config.expect?.poll ?? {};
		const { interval = defaults.interval ?? 50, timeout = defaults.timeout ?? 1e3, message } = options;
		// @ts-expect-error private poll access
		const assertion = expect(null, message).withContext({ poll: true });
		fn = fn.bind(assertion);
		const test = utils_exports.flag(assertion, "vitest-test");
		if (!test) throw new Error("expect.poll() must be called inside a test");
		const proxy = new Proxy(assertion, { get(target, key, receiver) {
			const assertionFunction = Reflect.get(target, key, receiver);
			if (typeof assertionFunction !== "function") return assertionFunction instanceof Assertion ? proxy : assertionFunction;
			if (key === "assert") return assertionFunction;
			if (typeof key === "string" && unsupported.includes(key)) throw new SyntaxError(`expect.poll() is not supported in combination with .${key}(). Use vi.waitFor() if your assertion condition is unstable.`);
			return function(...args) {
				const STACK_TRACE_ERROR = /* @__PURE__ */ new Error("STACK_TRACE_ERROR");
				const promise = async () => {
					const { setTimeout, clearTimeout } = getSafeTimers();
					let executionPhase = "fn";
					let hasTimedOut = false;
					const timerId = setTimeout(() => {
						hasTimedOut = true;
					}, timeout);
					utils_exports.flag(assertion, "_name", key);
					try {
						while (true) {
							const isLastAttempt = hasTimedOut;
							if (isLastAttempt) utils_exports.flag(assertion, "_isLastPollAttempt", true);
							try {
								executionPhase = "fn";
								const obj = await fn();
								utils_exports.flag(assertion, "object", obj);
								executionPhase = "assertion";
								return await assertionFunction.call(assertion, ...args);
							} catch (err) {
								if (isLastAttempt || executionPhase === "assertion" && utils_exports.flag(assertion, "_poll.assert_once")) throwWithCause(err, STACK_TRACE_ERROR);
								await delay(interval, setTimeout);
							}
						}
					} finally {
						clearTimeout(timerId);
					}
				};
				let awaited = false;
				test.onFinished ??= [];
				test.onFinished.push(() => {
					if (!awaited) {
						const negated = utils_exports.flag(assertion, "negate") ? "not." : "";
						const assertionString = `expect.${utils_exports.flag(assertion, "_poll.element") ? "element(locator)" : "poll(assertion)"}.${negated}${String(key)}()`;
						throw copyStackTrace$1(/* @__PURE__ */ new Error(`${assertionString} was not awaited. This assertion is asynchronous and must be awaited; otherwise, it is not executed to avoid unhandled rejections:\n\nawait ${assertionString}\n`), STACK_TRACE_ERROR);
					}
				});
				let resultPromise;
				// only .then is enough to check awaited, but we type this as `Promise<void>` in global types
				// so let's follow it
				return {
					then(onFulfilled, onRejected) {
						awaited = true;
						return (resultPromise ||= promise()).then(onFulfilled, onRejected);
					},
					catch(onRejected) {
						return (resultPromise ||= promise()).catch(onRejected);
					},
					finally(onFinally) {
						return (resultPromise ||= promise()).finally(onFinally);
					},
					[Symbol.toStringTag]: "Promise"
				};
			};
		} });
		return proxy;
	};
}
function copyStackTrace$1(target, source) {
	if (source.stack !== void 0) target.stack = source.stack.replace(source.message, target.message);
	return target;
}

function createAssertionMessage(util, assertion, hasArgs) {
	const not = util.flag(assertion, "negate") ? "not." : "";
	const name = `${util.flag(assertion, "_name")}(${"expected" })`;
	const promiseName = util.flag(assertion, "promise");
	return `expect(actual)${promiseName ? `.${promiseName}` : ""}.${not}${name}`;
}
function recordAsyncExpect(_test, promise, assertion, error) {
	const test = _test;
	// record promise for test, that resolves before test ends
	if (test && promise instanceof Promise) {
		// if promise is explicitly awaited, remove it from the list
		promise = promise.finally(() => {
			if (!test.promises) return;
			const index = test.promises.indexOf(promise);
			if (index !== -1) test.promises.splice(index, 1);
		});
		// record promise
		if (!test.promises) test.promises = [];
		test.promises.push(promise);
		let resolved = false;
		test.onFinished ??= [];
		test.onFinished.push(() => {
			if (!resolved) {
				const stack = (globalThis.__vitest_worker__?.onFilterStackTrace || ((s) => s || ""))(error.stack);
				console.warn([
					`Promise returned by \`${assertion}\` was not awaited. `,
					"Vitest currently auto-awaits hanging assertions at the end of the test, but this will cause the test to fail in Vitest 3. ",
					"Please remember to await the assertion.\n",
					stack
				].join(""));
			}
		});
		return {
			then(onFulfilled, onRejected) {
				resolved = true;
				return promise.then(onFulfilled, onRejected);
			},
			catch(onRejected) {
				return promise.catch(onRejected);
			},
			finally(onFinally) {
				return promise.finally(onFinally);
			},
			[Symbol.toStringTag]: "Promise"
		};
	}
	return promise;
}

let _client;
function getSnapshotClient() {
	if (!_client) _client = new SnapshotClient({ isEqual: (received, expected) => {
		return equals(received, expected, [iterableEquality, subsetEquality]);
	} });
	return _client;
}
function getError(expected, promise) {
	if (typeof expected !== "function") {
		if (!promise) throw new Error(`expected must be a function, received ${typeof expected}`);
		// when "promised", it receives thrown error
		return expected;
	}
	try {
		expected();
	} catch (e) {
		return e;
	}
	throw new Error("snapshot function didn't throw");
}
function getTestNames(test) {
	return {
		filepath: test.file.filepath,
		name: getNames(test).slice(1).join(" > "),
		testId: test.id
	};
}
const SnapshotPlugin = (chai, utils) => {
	function getTest(assertionName, obj) {
		const test = utils.flag(obj, "vitest-test");
		if (!test) throw new Error(`'${assertionName}' cannot be used without test context`);
		return test;
	}
	for (const key of ["matchSnapshot", "toMatchSnapshot"]) utils.addMethod(chai.Assertion.prototype, key, function(properties, message) {
		utils.flag(this, "_name", key);
		if (utils.flag(this, "negate")) throw new Error(`${key} cannot be used with "not"`);
		const expected = utils.flag(this, "object");
		const test = getTest(key, this);
		if (typeof properties === "string" && typeof message === "undefined") {
			message = properties;
			properties = void 0;
		}
		const errorMessage = utils.flag(this, "message");
		getSnapshotClient().assert({
			received: expected,
			message,
			isInline: false,
			properties,
			errorMessage,
			...getTestNames(test)
		});
	});
	utils.addMethod(chai.Assertion.prototype, "toMatchFileSnapshot", function(file, message) {
		utils.flag(this, "_name", "toMatchFileSnapshot");
		if (utils.flag(this, "negate")) throw new Error("toMatchFileSnapshot cannot be used with \"not\"");
		const error = /* @__PURE__ */ new Error("resolves");
		const expected = utils.flag(this, "object");
		const test = getTest("toMatchFileSnapshot", this);
		const errorMessage = utils.flag(this, "message");
		return recordAsyncExpect(test, getSnapshotClient().assertRaw({
			received: expected,
			message,
			isInline: false,
			rawSnapshot: { file },
			errorMessage,
			...getTestNames(test)
		}), createAssertionMessage(utils, this), error);
	});
	utils.addMethod(chai.Assertion.prototype, "toMatchInlineSnapshot", function __INLINE_SNAPSHOT__(properties, inlineSnapshot, message) {
		utils.flag(this, "_name", "toMatchInlineSnapshot");
		if (utils.flag(this, "negate")) throw new Error("toMatchInlineSnapshot cannot be used with \"not\"");
		const test = getTest("toMatchInlineSnapshot", this);
		if (test.each || test.suite?.each) throw new Error("InlineSnapshot cannot be used inside of test.each or describe.each");
		const expected = utils.flag(this, "object");
		const error = utils.flag(this, "error");
		if (typeof properties === "string") {
			message = inlineSnapshot;
			inlineSnapshot = properties;
			properties = void 0;
		}
		if (inlineSnapshot) inlineSnapshot = stripSnapshotIndentation(inlineSnapshot);
		const errorMessage = utils.flag(this, "message");
		getSnapshotClient().assert({
			received: expected,
			message,
			isInline: true,
			properties,
			inlineSnapshot,
			error,
			errorMessage,
			...getTestNames(test)
		});
	});
	utils.addMethod(chai.Assertion.prototype, "toThrowErrorMatchingSnapshot", function(message) {
		utils.flag(this, "_name", "toThrowErrorMatchingSnapshot");
		if (utils.flag(this, "negate")) throw new Error("toThrowErrorMatchingSnapshot cannot be used with \"not\"");
		const expected = utils.flag(this, "object");
		const test = getTest("toThrowErrorMatchingSnapshot", this);
		const promise = utils.flag(this, "promise");
		const errorMessage = utils.flag(this, "message");
		getSnapshotClient().assert({
			received: getError(expected, promise),
			message,
			errorMessage,
			...getTestNames(test)
		});
	});
	utils.addMethod(chai.Assertion.prototype, "toThrowErrorMatchingInlineSnapshot", function __INLINE_SNAPSHOT__(inlineSnapshot, message) {
		if (utils.flag(this, "negate")) throw new Error("toThrowErrorMatchingInlineSnapshot cannot be used with \"not\"");
		const test = getTest("toThrowErrorMatchingInlineSnapshot", this);
		if (test.each || test.suite?.each) throw new Error("InlineSnapshot cannot be used inside of test.each or describe.each");
		const expected = utils.flag(this, "object");
		const error = utils.flag(this, "error");
		const promise = utils.flag(this, "promise");
		const errorMessage = utils.flag(this, "message");
		if (inlineSnapshot) inlineSnapshot = stripSnapshotIndentation(inlineSnapshot);
		getSnapshotClient().assert({
			received: getError(expected, promise),
			message,
			inlineSnapshot,
			isInline: true,
			error,
			errorMessage,
			...getTestNames(test)
		});
	});
	utils.addMethod(chai.expect, "addSnapshotSerializer", addSerializer);
};

use(JestExtend);
use(JestChaiExpect);
use(SnapshotPlugin);
use(JestAsymmetricMatchers);

function createExpect(test) {
	const expect$1 = ((value, message) => {
		const { assertionCalls } = getState(expect$1);
		setState({ assertionCalls: assertionCalls + 1 }, expect$1);
		const assert = expect(value, message);
		return assert;
	});
	Object.assign(expect$1, expect);
	Object.assign(expect$1, globalThis[ASYMMETRIC_MATCHERS_OBJECT]);
	expect$1.getState = () => getState(expect$1);
	expect$1.setState = (state) => setState(state, expect$1);
	// @ts-expect-error global is not typed
	const globalState = getState(globalThis[GLOBAL_EXPECT]) || {};
	setState({
		...globalState,
		assertionCalls: 0,
		isExpectingAssertions: false,
		isExpectingAssertionsError: null,
		expectedAssertionsNumber: null,
		expectedAssertionsNumberErrorGen: null,
		get testPath() {
			return getWorkerState().filepath;
		},
		currentTestName: globalState.currentTestName
	}, expect$1);
	expect$1.assert = assert$1;
	// @ts-expect-error untyped
	expect$1.extend = (matchers) => expect.extend(expect$1, matchers);
	expect$1.addEqualityTesters = (customTesters) => addCustomEqualityTesters(customTesters);
	expect$1.soft = (...args) => {
		// @ts-expect-error private soft access
		return expect$1(...args).withContext({ soft: true });
	};
	expect$1.poll = createExpectPoll(expect$1);
	expect$1.unreachable = (message) => {
		assert$1.fail(`expected${message ? ` "${message}" ` : " "}not to be reached`);
	};
	function assertions(expected) {
		const errorGen = () => /* @__PURE__ */ new Error(`expected number of assertions to be ${expected}, but got ${expect$1.getState().assertionCalls}`);
		if (Error.captureStackTrace) Error.captureStackTrace(errorGen(), assertions);
		expect$1.setState({
			expectedAssertionsNumber: expected,
			expectedAssertionsNumberErrorGen: errorGen
		});
	}
	function hasAssertions() {
		const error = /* @__PURE__ */ new Error("expected any number of assertion, but got none");
		if (Error.captureStackTrace) Error.captureStackTrace(error, hasAssertions);
		expect$1.setState({
			isExpectingAssertions: true,
			isExpectingAssertionsError: error
		});
	}
	utils_exports.addMethod(expect$1, "assertions", assertions);
	utils_exports.addMethod(expect$1, "hasAssertions", hasAssertions);
	expect$1.extend(customMatchers);
	return expect$1;
}
const globalExpect = createExpect();
Object.defineProperty(globalThis, GLOBAL_EXPECT, {
	value: globalExpect,
	writable: true,
	configurable: true
});

var fakeTimersSrc = {};

var global$1;
var hasRequiredGlobal;

function requireGlobal () {
	if (hasRequiredGlobal) return global$1;
	hasRequiredGlobal = 1;

	/**
	 * A reference to the global object
	 * @type {object} globalObject
	 */
	var globalObject;

	/* istanbul ignore else */
	if (typeof commonjsGlobal !== "undefined") {
	    // Node
	    globalObject = commonjsGlobal;
	} else if (typeof window !== "undefined") {
	    // Browser
	    globalObject = window;
	} else {
	    // WebWorker
	    globalObject = self;
	}

	global$1 = globalObject;
	return global$1;
}

var throwsOnProto_1;
var hasRequiredThrowsOnProto;

function requireThrowsOnProto () {
	if (hasRequiredThrowsOnProto) return throwsOnProto_1;
	hasRequiredThrowsOnProto = 1;

	/**
	 * Is true when the environment causes an error to be thrown for accessing the
	 * __proto__ property.
	 * This is necessary in order to support `node --disable-proto=throw`.
	 *
	 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
	 * @type {boolean}
	 */
	let throwsOnProto;
	try {
	    const object = {};
	    // eslint-disable-next-line no-proto, no-unused-expressions
	    object.__proto__;
	    throwsOnProto = false;
	} catch (_) {
	    // This branch is covered when tests are run with `--disable-proto=throw`,
	    // however we can test both branches at the same time, so this is ignored
	    /* istanbul ignore next */
	    throwsOnProto = true;
	}

	throwsOnProto_1 = throwsOnProto;
	return throwsOnProto_1;
}

var copyPrototypeMethods;
var hasRequiredCopyPrototypeMethods;

function requireCopyPrototypeMethods () {
	if (hasRequiredCopyPrototypeMethods) return copyPrototypeMethods;
	hasRequiredCopyPrototypeMethods = 1;

	var call = Function.call;
	var throwsOnProto = requireThrowsOnProto();

	var disallowedProperties = [
	    // ignore size because it throws from Map
	    "size",
	    "caller",
	    "callee",
	    "arguments",
	];

	// This branch is covered when tests are run with `--disable-proto=throw`,
	// however we can test both branches at the same time, so this is ignored
	/* istanbul ignore next */
	if (throwsOnProto) {
	    disallowedProperties.push("__proto__");
	}

	copyPrototypeMethods = function copyPrototypeMethods(prototype) {
	    // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
	    return Object.getOwnPropertyNames(prototype).reduce(function (
	        result,
	        name
	    ) {
	        if (disallowedProperties.includes(name)) {
	            return result;
	        }

	        if (typeof prototype[name] !== "function") {
	            return result;
	        }

	        result[name] = call.bind(prototype[name]);

	        return result;
	    },
	    Object.create(null));
	};
	return copyPrototypeMethods;
}

var array;
var hasRequiredArray;

function requireArray () {
	if (hasRequiredArray) return array;
	hasRequiredArray = 1;

	var copyPrototype = requireCopyPrototypeMethods();

	array = copyPrototype(Array.prototype);
	return array;
}

var calledInOrder_1;
var hasRequiredCalledInOrder;

function requireCalledInOrder () {
	if (hasRequiredCalledInOrder) return calledInOrder_1;
	hasRequiredCalledInOrder = 1;

	var every = requireArray().every;

	/**
	 * @private
	 */
	function hasCallsLeft(callMap, spy) {
	    if (callMap[spy.id] === undefined) {
	        callMap[spy.id] = 0;
	    }

	    return callMap[spy.id] < spy.callCount;
	}

	/**
	 * @private
	 */
	function checkAdjacentCalls(callMap, spy, index, spies) {
	    var calledBeforeNext = true;

	    if (index !== spies.length - 1) {
	        calledBeforeNext = spy.calledBefore(spies[index + 1]);
	    }

	    if (hasCallsLeft(callMap, spy) && calledBeforeNext) {
	        callMap[spy.id] += 1;
	        return true;
	    }

	    return false;
	}

	/**
	 * A Sinon proxy object (fake, spy, stub)
	 * @typedef {object} SinonProxy
	 * @property {Function} calledBefore - A method that determines if this proxy was called before another one
	 * @property {string} id - Some id
	 * @property {number} callCount - Number of times this proxy has been called
	 */

	/**
	 * Returns true when the spies have been called in the order they were supplied in
	 * @param  {SinonProxy[] | SinonProxy} spies An array of proxies, or several proxies as arguments
	 * @returns {boolean} true when spies are called in order, false otherwise
	 */
	function calledInOrder(spies) {
	    var callMap = {};
	    // eslint-disable-next-line no-underscore-dangle
	    var _spies = arguments.length > 1 ? arguments : spies;

	    return every(_spies, checkAdjacentCalls.bind(null, callMap));
	}

	calledInOrder_1 = calledInOrder;
	return calledInOrder_1;
}

var className_1;
var hasRequiredClassName;

function requireClassName () {
	if (hasRequiredClassName) return className_1;
	hasRequiredClassName = 1;

	/**
	 * Returns a display name for a value from a constructor
	 * @param  {object} value A value to examine
	 * @returns {(string|null)} A string or null
	 */
	function className(value) {
	    const name = value.constructor && value.constructor.name;
	    return name || null;
	}

	className_1 = className;
	return className_1;
}

var deprecated = {};

/* eslint-disable no-console */

var hasRequiredDeprecated;

function requireDeprecated () {
	if (hasRequiredDeprecated) return deprecated;
	hasRequiredDeprecated = 1;
	(function (exports$1) {

		/**
		 * Returns a function that will invoke the supplied function and print a
		 * deprecation warning to the console each time it is called.
		 * @param  {Function} func
		 * @param  {string} msg
		 * @returns {Function}
		 */
		exports$1.wrap = function (func, msg) {
		    var wrapped = function () {
		        exports$1.printWarning(msg);
		        return func.apply(this, arguments);
		    };
		    if (func.prototype) {
		        wrapped.prototype = func.prototype;
		    }
		    return wrapped;
		};

		/**
		 * Returns a string which can be supplied to `wrap()` to notify the user that a
		 * particular part of the sinon API has been deprecated.
		 * @param  {string} packageName
		 * @param  {string} funcName
		 * @returns {string}
		 */
		exports$1.defaultMsg = function (packageName, funcName) {
		    return `${packageName}.${funcName} is deprecated and will be removed from the public API in a future version of ${packageName}.`;
		};

		/**
		 * Prints a warning on the console, when it exists
		 * @param  {string} msg
		 * @returns {undefined}
		 */
		exports$1.printWarning = function (msg) {
		    /* istanbul ignore next */
		    if (typeof process === "object" && process.emitWarning) {
		        // Emit Warnings in Node
		        process.emitWarning(msg);
		    } else if (console.info) {
		        console.info(msg);
		    } else {
		        console.log(msg);
		    }
		}; 
	} (deprecated));
	return deprecated;
}

var every;
var hasRequiredEvery;

function requireEvery () {
	if (hasRequiredEvery) return every;
	hasRequiredEvery = 1;

	/**
	 * Returns true when fn returns true for all members of obj.
	 * This is an every implementation that works for all iterables
	 * @param  {object}   obj
	 * @param  {Function} fn
	 * @returns {boolean}
	 */
	every = function every(obj, fn) {
	    var pass = true;

	    try {
	        // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
	        obj.forEach(function () {
	            if (!fn.apply(this, arguments)) {
	                // Throwing an error is the only way to break `forEach`
	                throw new Error();
	            }
	        });
	    } catch (e) {
	        pass = false;
	    }

	    return pass;
	};
	return every;
}

var functionName;
var hasRequiredFunctionName;

function requireFunctionName () {
	if (hasRequiredFunctionName) return functionName;
	hasRequiredFunctionName = 1;

	/**
	 * Returns a display name for a function
	 * @param  {Function} func
	 * @returns {string}
	 */
	functionName = function functionName(func) {
	    if (!func) {
	        return "";
	    }

	    try {
	        return (
	            func.displayName ||
	            func.name ||
	            // Use function decomposition as a last resort to get function
	            // name. Does not rely on function decomposition to work - if it
	            // doesn't debugging will be slightly less informative
	            // (i.e. toString will say 'spy' rather than 'myFunc').
	            (String(func).match(/function ([^\s(]+)/) || [])[1]
	        );
	    } catch (e) {
	        // Stringify may fail and we might get an exception, as a last-last
	        // resort fall back to empty string.
	        return "";
	    }
	};
	return functionName;
}

var orderByFirstCall_1;
var hasRequiredOrderByFirstCall;

function requireOrderByFirstCall () {
	if (hasRequiredOrderByFirstCall) return orderByFirstCall_1;
	hasRequiredOrderByFirstCall = 1;

	var sort = requireArray().sort;
	var slice = requireArray().slice;

	/**
	 * @private
	 */
	function comparator(a, b) {
	    // uuid, won't ever be equal
	    var aCall = a.getCall(0);
	    var bCall = b.getCall(0);
	    var aId = (aCall && aCall.callId) || -1;
	    var bId = (bCall && bCall.callId) || -1;

	    return aId < bId ? -1 : 1;
	}

	/**
	 * A Sinon proxy object (fake, spy, stub)
	 * @typedef {object} SinonProxy
	 * @property {Function} getCall - A method that can return the first call
	 */

	/**
	 * Sorts an array of SinonProxy instances (fake, spy, stub) by their first call
	 * @param  {SinonProxy[] | SinonProxy} spies
	 * @returns {SinonProxy[]}
	 */
	function orderByFirstCall(spies) {
	    return sort(slice(spies), comparator);
	}

	orderByFirstCall_1 = orderByFirstCall;
	return orderByFirstCall_1;
}

var _function;
var hasRequired_function;

function require_function () {
	if (hasRequired_function) return _function;
	hasRequired_function = 1;

	var copyPrototype = requireCopyPrototypeMethods();

	_function = copyPrototype(Function.prototype);
	return _function;
}

var map;
var hasRequiredMap;

function requireMap () {
	if (hasRequiredMap) return map;
	hasRequiredMap = 1;

	var copyPrototype = requireCopyPrototypeMethods();

	map = copyPrototype(Map.prototype);
	return map;
}

var object;
var hasRequiredObject;

function requireObject () {
	if (hasRequiredObject) return object;
	hasRequiredObject = 1;

	var copyPrototype = requireCopyPrototypeMethods();

	object = copyPrototype(Object.prototype);
	return object;
}

var set;
var hasRequiredSet;

function requireSet () {
	if (hasRequiredSet) return set;
	hasRequiredSet = 1;

	var copyPrototype = requireCopyPrototypeMethods();

	set = copyPrototype(Set.prototype);
	return set;
}

var string;
var hasRequiredString;

function requireString () {
	if (hasRequiredString) return string;
	hasRequiredString = 1;

	var copyPrototype = requireCopyPrototypeMethods();

	string = copyPrototype(String.prototype);
	return string;
}

var prototypes;
var hasRequiredPrototypes;

function requirePrototypes () {
	if (hasRequiredPrototypes) return prototypes;
	hasRequiredPrototypes = 1;

	prototypes = {
	    array: requireArray(),
	    function: require_function(),
	    map: requireMap(),
	    object: requireObject(),
	    set: requireSet(),
	    string: requireString(),
	};
	return prototypes;
}

var typeDetect$1 = {exports: {}};

var typeDetect = typeDetect$1.exports;

var hasRequiredTypeDetect;

function requireTypeDetect () {
	if (hasRequiredTypeDetect) return typeDetect$1.exports;
	hasRequiredTypeDetect = 1;
	(function (module, exports$1) {
		(function (global, factory) {
			module.exports = factory() ;
		}(typeDetect, (function () {
		/* !
		 * type-detect
		 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
		 * MIT Licensed
		 */
		var promiseExists = typeof Promise === 'function';

		/* eslint-disable no-undef */
		var globalObject = typeof self === 'object' ? self : commonjsGlobal; // eslint-disable-line id-blacklist

		var symbolExists = typeof Symbol !== 'undefined';
		var mapExists = typeof Map !== 'undefined';
		var setExists = typeof Set !== 'undefined';
		var weakMapExists = typeof WeakMap !== 'undefined';
		var weakSetExists = typeof WeakSet !== 'undefined';
		var dataViewExists = typeof DataView !== 'undefined';
		var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
		var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
		var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
		var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
		var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
		var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
		var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
		var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
		var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
		var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
		var toStringLeftSliceLength = 8;
		var toStringRightSliceLength = -1;
		/**
		 * ### typeOf (obj)
		 *
		 * Uses `Object.prototype.toString` to determine the type of an object,
		 * normalising behaviour across engine versions & well optimised.
		 *
		 * @param {Mixed} object
		 * @return {String} object type
		 * @api public
		 */
		function typeDetect(obj) {
		  /* ! Speed optimisation
		   * Pre:
		   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
		   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
		   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
		   *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
		   *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
		   * Post:
		   *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
		   *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
		   *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
		   *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
		   *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
		   */
		  var typeofObj = typeof obj;
		  if (typeofObj !== 'object') {
		    return typeofObj;
		  }

		  /* ! Speed optimisation
		   * Pre:
		   *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
		   * Post:
		   *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
		   */
		  if (obj === null) {
		    return 'null';
		  }

		  /* ! Spec Conformance
		   * Test: `Object.prototype.toString.call(window)``
		   *  - Node === "[object global]"
		   *  - Chrome === "[object global]"
		   *  - Firefox === "[object Window]"
		   *  - PhantomJS === "[object Window]"
		   *  - Safari === "[object Window]"
		   *  - IE 11 === "[object Window]"
		   *  - IE Edge === "[object Window]"
		   * Test: `Object.prototype.toString.call(this)``
		   *  - Chrome Worker === "[object global]"
		   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
		   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
		   *  - IE 11 Worker === "[object WorkerGlobalScope]"
		   *  - IE Edge Worker === "[object WorkerGlobalScope]"
		   */
		  if (obj === globalObject) {
		    return 'global';
		  }

		  /* ! Speed optimisation
		   * Pre:
		   *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
		   * Post:
		   *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
		   */
		  if (
		    Array.isArray(obj) &&
		    (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))
		  ) {
		    return 'Array';
		  }

		  // Not caching existence of `window` and related properties due to potential
		  // for `window` to be unset before tests in quasi-browser environments.
		  if (typeof window === 'object' && window !== null) {
		    /* ! Spec Conformance
		     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
		     * WhatWG HTML$7.7.3 - The `Location` interface
		     * Test: `Object.prototype.toString.call(window.location)``
		     *  - IE <=11 === "[object Object]"
		     *  - IE Edge <=13 === "[object Object]"
		     */
		    if (typeof window.location === 'object' && obj === window.location) {
		      return 'Location';
		    }

		    /* ! Spec Conformance
		     * (https://html.spec.whatwg.org/#document)
		     * WhatWG HTML$3.1.1 - The `Document` object
		     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
		     *       which suggests that browsers should use HTMLTableCellElement for
		     *       both TD and TH elements. WhatWG separates these.
		     *       WhatWG HTML states:
		     *         > For historical reasons, Window objects must also have a
		     *         > writable, configurable, non-enumerable property named
		     *         > HTMLDocument whose value is the Document interface object.
		     * Test: `Object.prototype.toString.call(document)``
		     *  - Chrome === "[object HTMLDocument]"
		     *  - Firefox === "[object HTMLDocument]"
		     *  - Safari === "[object HTMLDocument]"
		     *  - IE <=10 === "[object Document]"
		     *  - IE 11 === "[object HTMLDocument]"
		     *  - IE Edge <=13 === "[object HTMLDocument]"
		     */
		    if (typeof window.document === 'object' && obj === window.document) {
		      return 'Document';
		    }

		    if (typeof window.navigator === 'object') {
		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
		       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
		       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
		       *  - IE <=10 === "[object MSMimeTypesCollection]"
		       */
		      if (typeof window.navigator.mimeTypes === 'object' &&
		          obj === window.navigator.mimeTypes) {
		        return 'MimeTypeArray';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
		       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
		       * Test: `Object.prototype.toString.call(navigator.plugins)``
		       *  - IE <=10 === "[object MSPluginsCollection]"
		       */
		      if (typeof window.navigator.plugins === 'object' &&
		          obj === window.navigator.plugins) {
		        return 'PluginArray';
		      }
		    }

		    if ((typeof window.HTMLElement === 'function' ||
		        typeof window.HTMLElement === 'object') &&
		        obj instanceof window.HTMLElement) {
		      /* ! Spec Conformance
		      * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
		      * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
		      * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
		      *  - IE <=10 === "[object HTMLBlockElement]"
		      */
		      if (obj.tagName === 'BLOCKQUOTE') {
		        return 'HTMLQuoteElement';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
		       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
		       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
		       *       which suggests that browsers should use HTMLTableCellElement for
		       *       both TD and TH elements. WhatWG separates these.
		       * Test: Object.prototype.toString.call(document.createElement('td'))
		       *  - Chrome === "[object HTMLTableCellElement]"
		       *  - Firefox === "[object HTMLTableCellElement]"
		       *  - Safari === "[object HTMLTableCellElement]"
		       */
		      if (obj.tagName === 'TD') {
		        return 'HTMLTableDataCellElement';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
		       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
		       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
		       *       which suggests that browsers should use HTMLTableCellElement for
		       *       both TD and TH elements. WhatWG separates these.
		       * Test: Object.prototype.toString.call(document.createElement('th'))
		       *  - Chrome === "[object HTMLTableCellElement]"
		       *  - Firefox === "[object HTMLTableCellElement]"
		       *  - Safari === "[object HTMLTableCellElement]"
		       */
		      if (obj.tagName === 'TH') {
		        return 'HTMLTableHeaderCellElement';
		      }
		    }
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
		  *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
		  *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
		  *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
		  *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
		  *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
		  *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
		  *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
		  *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
		  * Post:
		  *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
		  *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
		  *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
		  *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
		  *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
		  *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
		  *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
		  *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
		  *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
		  */
		  var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
		  if (typeof stringTag === 'string') {
		    return stringTag;
		  }

		  var objPrototype = Object.getPrototypeOf(obj);
		  /* ! Speed optimisation
		  * Pre:
		  *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
		  *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
		  * Post:
		  *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
		  *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
		  */
		  if (objPrototype === RegExp.prototype) {
		    return 'RegExp';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
		  * Post:
		  *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
		  */
		  if (objPrototype === Date.prototype) {
		    return 'Date';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
		   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
		   * Test: `Object.prototype.toString.call(Promise.resolve())``
		   *  - Chrome <=47 === "[object Object]"
		   *  - Edge <=20 === "[object Object]"
		   *  - Firefox 29-Latest === "[object Promise]"
		   *  - Safari 7.1-Latest === "[object Promise]"
		   */
		  if (promiseExists && objPrototype === Promise.prototype) {
		    return 'Promise';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
		  * Post:
		  *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
		  */
		  if (setExists && objPrototype === Set.prototype) {
		    return 'Set';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
		  * Post:
		  *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
		  */
		  if (mapExists && objPrototype === Map.prototype) {
		    return 'Map';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
		  * Post:
		  *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
		  */
		  if (weakSetExists && objPrototype === WeakSet.prototype) {
		    return 'WeakSet';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
		  * Post:
		  *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
		  */
		  if (weakMapExists && objPrototype === WeakMap.prototype) {
		    return 'WeakMap';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
		   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
		   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (dataViewExists && objPrototype === DataView.prototype) {
		    return 'DataView';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
		   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
		   * Test: `Object.prototype.toString.call(new Map().entries())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (mapExists && objPrototype === mapIteratorPrototype) {
		    return 'Map Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
		   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
		   * Test: `Object.prototype.toString.call(new Set().entries())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (setExists && objPrototype === setIteratorPrototype) {
		    return 'Set Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
		   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
		   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
		    return 'Array Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
		   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
		   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
		    return 'String Iterator';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
		  * Post:
		  *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
		  */
		  if (objPrototype === null) {
		    return 'Object';
		  }

		  return Object
		    .prototype
		    .toString
		    .call(obj)
		    .slice(toStringLeftSliceLength, toStringRightSliceLength);
		}

		return typeDetect;

		}))); 
	} (typeDetect$1));
	return typeDetect$1.exports;
}

var typeOf;
var hasRequiredTypeOf;

function requireTypeOf () {
	if (hasRequiredTypeOf) return typeOf;
	hasRequiredTypeOf = 1;

	var type = requireTypeDetect();

	/**
	 * Returns the lower-case result of running type from type-detect on the value
	 * @param  {*} value
	 * @returns {string}
	 */
	typeOf = function typeOf(value) {
	    return type(value).toLowerCase();
	};
	return typeOf;
}

var valueToString_1;
var hasRequiredValueToString;

function requireValueToString () {
	if (hasRequiredValueToString) return valueToString_1;
	hasRequiredValueToString = 1;

	/**
	 * Returns a string representation of the value
	 * @param  {*} value
	 * @returns {string}
	 */
	function valueToString(value) {
	    if (value && value.toString) {
	        // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
	        return value.toString();
	    }
	    return String(value);
	}

	valueToString_1 = valueToString;
	return valueToString_1;
}

var lib;
var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;

	lib = {
	    global: requireGlobal(),
	    calledInOrder: requireCalledInOrder(),
	    className: requireClassName(),
	    deprecated: requireDeprecated(),
	    every: requireEvery(),
	    functionName: requireFunctionName(),
	    orderByFirstCall: requireOrderByFirstCall(),
	    prototypes: requirePrototypes(),
	    typeOf: requireTypeOf(),
	    valueToString: requireValueToString(),
	};
	return lib;
}

var hasRequiredFakeTimersSrc;

function requireFakeTimersSrc () {
	if (hasRequiredFakeTimersSrc) return fakeTimersSrc;
	hasRequiredFakeTimersSrc = 1;

	const globalObject = requireLib().global;
	let timersModule, timersPromisesModule;
	if (typeof __vitest_required__ !== 'undefined') {
	    try {
	        timersModule = __vitest_required__.timers;
	    } catch (e) {
	        // ignored
	    }
	    try {
	        timersPromisesModule = __vitest_required__.timersPromises;
	    } catch (e) {
	        // ignored
	    }
	}

	/**
	 * @typedef {object} IdleDeadline
	 * @property {boolean} didTimeout - whether or not the callback was called before reaching the optional timeout
	 * @property {function():number} timeRemaining - a floating-point value providing an estimate of the number of milliseconds remaining in the current idle period
	 */

	/**
	 * Queues a function to be called during a browser's idle periods
	 * @callback RequestIdleCallback
	 * @param {function(IdleDeadline)} callback
	 * @param {{timeout: number}} options - an options object
	 * @returns {number} the id
	 */

	/**
	 * @callback NextTick
	 * @param {VoidVarArgsFunc} callback - the callback to run
	 * @param {...*} args - optional arguments to call the callback with
	 * @returns {void}
	 */

	/**
	 * @callback SetImmediate
	 * @param {VoidVarArgsFunc} callback - the callback to run
	 * @param {...*} args - optional arguments to call the callback with
	 * @returns {NodeImmediate}
	 */

	/**
	 * @callback VoidVarArgsFunc
	 * @param {...*} callback - the callback to run
	 * @returns {void}
	 */

	/**
	 * @typedef RequestAnimationFrame
	 * @property {function(number):void} requestAnimationFrame
	 * @returns {number} - the id
	 */

	/**
	 * @typedef Performance
	 * @property {function(): number} now
	 */

	/* eslint-disable jsdoc/require-property-description */
	/**
	 * @typedef {object} Clock
	 * @property {number} now - the current time
	 * @property {Date} Date - the Date constructor
	 * @property {number} loopLimit - the maximum number of timers before assuming an infinite loop
	 * @property {RequestIdleCallback} requestIdleCallback
	 * @property {function(number):void} cancelIdleCallback
	 * @property {setTimeout} setTimeout
	 * @property {clearTimeout} clearTimeout
	 * @property {NextTick} nextTick
	 * @property {queueMicrotask} queueMicrotask
	 * @property {setInterval} setInterval
	 * @property {clearInterval} clearInterval
	 * @property {SetImmediate} setImmediate
	 * @property {function(NodeImmediate):void} clearImmediate
	 * @property {function():number} countTimers
	 * @property {RequestAnimationFrame} requestAnimationFrame
	 * @property {function(number):void} cancelAnimationFrame
	 * @property {function():void} runMicrotasks
	 * @property {function(string | number): number} tick
	 * @property {function(string | number): Promise<number>} tickAsync
	 * @property {function(): number} next
	 * @property {function(): Promise<number>} nextAsync
	 * @property {function(): number} runAll
	 * @property {function(): number} runToFrame
	 * @property {function(): Promise<number>} runAllAsync
	 * @property {function(): number} runToLast
	 * @property {function(): Promise<number>} runToLastAsync
	 * @property {function(): void} reset
	 * @property {function(number | Date): void} setSystemTime
	 * @property {function(number): void} jump
	 * @property {Performance} performance
	 * @property {function(number[]): number[]} hrtime - process.hrtime (legacy)
	 * @property {function(): void} uninstall Uninstall the clock.
	 * @property {Function[]} methods - the methods that are faked
	 * @property {boolean} [shouldClearNativeTimers] inherited from config
	 * @property {{methodName:string, original:any}[] | undefined} timersModuleMethods
	 * @property {{methodName:string, original:any}[] | undefined} timersPromisesModuleMethods
	 * @property {Map<function(): void, AbortSignal>} abortListenerMap
	 */
	/* eslint-enable jsdoc/require-property-description */

	/**
	 * Configuration object for the `install` method.
	 * @typedef {object} Config
	 * @property {number|Date} [now] a number (in milliseconds) or a Date object (default epoch)
	 * @property {string[]} [toFake] names of the methods that should be faked.
	 * @property {number} [loopLimit] the maximum number of timers that will be run when calling runAll()
	 * @property {boolean} [shouldAdvanceTime] tells FakeTimers to increment mocked time automatically (default false)
	 * @property {number} [advanceTimeDelta] increment mocked time every <<advanceTimeDelta>> ms (default: 20ms)
	 * @property {boolean} [shouldClearNativeTimers] forwards clear timer calls to native functions if they are not fakes (default: false)
	 * @property {boolean} [ignoreMissingTimers] default is false, meaning asking to fake timers that are not present will throw an error
	 */

	/* eslint-disable jsdoc/require-property-description */
	/**
	 * The internal structure to describe a scheduled fake timer
	 * @typedef {object} Timer
	 * @property {Function} func
	 * @property {*[]} args
	 * @property {number} delay
	 * @property {number} callAt
	 * @property {number} createdAt
	 * @property {boolean} immediate
	 * @property {number} id
	 * @property {Error} [error]
	 */

	/**
	 * A Node timer
	 * @typedef {object} NodeImmediate
	 * @property {function(): boolean} hasRef
	 * @property {function(): NodeImmediate} ref
	 * @property {function(): NodeImmediate} unref
	 */
	/* eslint-enable jsdoc/require-property-description */

	/* eslint-disable complexity */

	/**
	 * Mocks available features in the specified global namespace.
	 * @param {*} _global Namespace to mock (e.g. `window`)
	 * @returns {FakeTimers}
	 */
	function withGlobal(_global) {
	    const maxTimeout = Math.pow(2, 31) - 1; //see https://heycam.github.io/webidl/#abstract-opdef-converttoint
	    const idCounterStart = 1e12; // arbitrarily large number to avoid collisions with native timer IDs
	    const NOOP = function () {
	        return undefined;
	    };
	    const NOOP_ARRAY = function () {
	        return [];
	    };
	    const isPresent = {};
	    let timeoutResult,
	        addTimerReturnsObject = false;

	    if (_global.setTimeout) {
	        isPresent.setTimeout = true;
	        timeoutResult = _global.setTimeout(NOOP, 0);
	        addTimerReturnsObject = typeof timeoutResult === "object";
	    }
	    isPresent.clearTimeout = Boolean(_global.clearTimeout);
	    isPresent.setInterval = Boolean(_global.setInterval);
	    isPresent.clearInterval = Boolean(_global.clearInterval);
	    isPresent.hrtime =
	        _global.process && typeof _global.process.hrtime === "function";
	    isPresent.hrtimeBigint =
	        isPresent.hrtime && typeof _global.process.hrtime.bigint === "function";
	    isPresent.nextTick =
	        _global.process && typeof _global.process.nextTick === "function";
	    const utilPromisify = _global.process && _global.__vitest_required__ && _global.__vitest_required__.util.promisify;
	    isPresent.performance =
	        _global.performance && typeof _global.performance.now === "function";
	    const hasPerformancePrototype =
	        _global.Performance &&
	        (typeof _global.Performance).match(/^(function|object)$/);
	    const hasPerformanceConstructorPrototype =
	        _global.performance &&
	        _global.performance.constructor &&
	        _global.performance.constructor.prototype;
	    isPresent.queueMicrotask = _global.hasOwnProperty("queueMicrotask");
	    isPresent.requestAnimationFrame =
	        _global.requestAnimationFrame &&
	        typeof _global.requestAnimationFrame === "function";
	    isPresent.cancelAnimationFrame =
	        _global.cancelAnimationFrame &&
	        typeof _global.cancelAnimationFrame === "function";
	    isPresent.requestIdleCallback =
	        _global.requestIdleCallback &&
	        typeof _global.requestIdleCallback === "function";
	    isPresent.cancelIdleCallbackPresent =
	        _global.cancelIdleCallback &&
	        typeof _global.cancelIdleCallback === "function";
	    isPresent.setImmediate =
	        _global.setImmediate && typeof _global.setImmediate === "function";
	    isPresent.clearImmediate =
	        _global.clearImmediate && typeof _global.clearImmediate === "function";
	    isPresent.Intl = _global.Intl && typeof _global.Intl === "object";

	    if (_global.clearTimeout) {
	        _global.clearTimeout(timeoutResult);
	    }

	    const NativeDate = _global.Date;
	    const NativeIntl = isPresent.Intl
	        ? Object.defineProperties(
	              Object.create(null),
	              Object.getOwnPropertyDescriptors(_global.Intl),
	          )
	        : undefined;
	    let uniqueTimerId = idCounterStart;

	    if (NativeDate === undefined) {
	        throw new Error(
	            "The global scope doesn't have a `Date` object" +
	                " (see https://github.com/sinonjs/sinon/issues/1852#issuecomment-419622780)",
	        );
	    }
	    isPresent.Date = true;

	    /**
	     * The PerformanceEntry object encapsulates a single performance metric
	     * that is part of the browser's performance timeline.
	     *
	     * This is an object returned by the `mark` and `measure` methods on the Performance prototype
	     */
	    class FakePerformanceEntry {
	        constructor(name, entryType, startTime, duration) {
	            this.name = name;
	            this.entryType = entryType;
	            this.startTime = startTime;
	            this.duration = duration;
	        }

	        toJSON() {
	            return JSON.stringify({ ...this });
	        }
	    }

	    /**
	     * @param {number} num
	     * @returns {boolean}
	     */
	    function isNumberFinite(num) {
	        if (Number.isFinite) {
	            return Number.isFinite(num);
	        }

	        return isFinite(num);
	    }

	    let isNearInfiniteLimit = false;

	    /**
	     * @param {Clock} clock
	     * @param {number} i
	     */
	    function checkIsNearInfiniteLimit(clock, i) {
	        if (clock.loopLimit && i === clock.loopLimit - 1) {
	            isNearInfiniteLimit = true;
	        }
	    }

	    /**
	     *
	     */
	    function resetIsNearInfiniteLimit() {
	        isNearInfiniteLimit = false;
	    }

	    /**
	     * Parse strings like "01:10:00" (meaning 1 hour, 10 minutes, 0 seconds) into
	     * number of milliseconds. This is used to support human-readable strings passed
	     * to clock.tick()
	     * @param {string} str
	     * @returns {number}
	     */
	    function parseTime(str) {
	        if (!str) {
	            return 0;
	        }

	        const strings = str.split(":");
	        const l = strings.length;
	        let i = l;
	        let ms = 0;
	        let parsed;

	        if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
	            throw new Error(
	                "tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits",
	            );
	        }

	        while (i--) {
	            parsed = parseInt(strings[i], 10);

	            if (parsed >= 60) {
	                throw new Error(`Invalid time ${str}`);
	            }

	            ms += parsed * Math.pow(60, l - i - 1);
	        }

	        return ms * 1000;
	    }

	    /**
	     * Get the decimal part of the millisecond value as nanoseconds
	     * @param {number} msFloat the number of milliseconds
	     * @returns {number} an integer number of nanoseconds in the range [0,1e6)
	     *
	     * Example: nanoRemainer(123.456789) -> 456789
	     */
	    function nanoRemainder(msFloat) {
	        const modulo = 1e6;
	        const remainder = (msFloat * 1e6) % modulo;
	        const positiveRemainder =
	            remainder < 0 ? remainder + modulo : remainder;

	        return Math.floor(positiveRemainder);
	    }

	    /**
	     * Used to grok the `now` parameter to createClock.
	     * @param {Date|number} epoch the system time
	     * @returns {number}
	     */
	    function getEpoch(epoch) {
	        if (!epoch) {
	            return 0;
	        }
	        if (typeof epoch.getTime === "function") {
	            return epoch.getTime();
	        }
	        if (typeof epoch === "number") {
	            return epoch;
	        }
	        throw new TypeError("now should be milliseconds since UNIX epoch");
	    }

	    /**
	     * @param {number} from
	     * @param {number} to
	     * @param {Timer} timer
	     * @returns {boolean}
	     */
	    function inRange(from, to, timer) {
	        return timer && timer.callAt >= from && timer.callAt <= to;
	    }

	    /**
	     * @param {Clock} clock
	     * @param {Timer} job
	     */
	    function getInfiniteLoopError(clock, job) {
	        const infiniteLoopError = new Error(
	            `Aborting after running ${clock.loopLimit} timers, assuming an infinite loop!`,
	        );

	        if (!job.error) {
	            return infiniteLoopError;
	        }

	        // pattern never matched in Node
	        const computedTargetPattern = /target\.*[<|(|[].*?[>|\]|)]\s*/;
	        let clockMethodPattern = new RegExp(
	            String(Object.keys(clock).join("|")),
	        );

	        if (addTimerReturnsObject) {
	            // node.js environment
	            clockMethodPattern = new RegExp(
	                `\\s+at (Object\\.)?(?:${Object.keys(clock).join("|")})\\s+`,
	            );
	        }

	        let matchedLineIndex = -1;
	        job.error.stack.split("\n").some(function (line, i) {
	            // If we've matched a computed target line (e.g. setTimeout) then we
	            // don't need to look any further. Return true to stop iterating.
	            const matchedComputedTarget = line.match(computedTargetPattern);
	            /* istanbul ignore if */
	            if (matchedComputedTarget) {
	                matchedLineIndex = i;
	                return true;
	            }

	            // If we've matched a clock method line, then there may still be
	            // others further down the trace. Return false to keep iterating.
	            const matchedClockMethod = line.match(clockMethodPattern);
	            if (matchedClockMethod) {
	                matchedLineIndex = i;
	                return false;
	            }

	            // If we haven't matched anything on this line, but we matched
	            // previously and set the matched line index, then we can stop.
	            // If we haven't matched previously, then we should keep iterating.
	            return matchedLineIndex >= 0;
	        });

	        const stack = `${infiniteLoopError}\n${job.type || "Microtask"} - ${
	            job.func.name || "anonymous"
	        }\n${job.error.stack
	            .split("\n")
	            .slice(matchedLineIndex + 1)
	            .join("\n")}`;

	        try {
	            Object.defineProperty(infiniteLoopError, "stack", {
	                value: stack,
	            });
	        } catch (e) {
	            // noop
	        }

	        return infiniteLoopError;
	    }

	    //eslint-disable-next-line jsdoc/require-jsdoc
	    function createDate() {
	        class ClockDate extends NativeDate {
	            /**
	             * @param {number} year
	             * @param {number} month
	             * @param {number} date
	             * @param {number} hour
	             * @param {number} minute
	             * @param {number} second
	             * @param {number} ms
	             * @returns void
	             */
	            // eslint-disable-next-line no-unused-vars
	            constructor(year, month, date, hour, minute, second, ms) {
	                // Defensive and verbose to avoid potential harm in passing
	                // explicit undefined when user does not pass argument
	                if (arguments.length === 0) {
	                    super(ClockDate.clock.now);
	                } else {
	                    super(...arguments);
	                }

	                // ensures identity checks using the constructor prop still works
	                // this should have no other functional effect
	                Object.defineProperty(this, "constructor", {
	                    value: NativeDate,
	                    enumerable: false,
	                });
	            }

	            static [Symbol.hasInstance](instance) {
	                return instance instanceof NativeDate;
	            }
	        }

	        ClockDate.isFake = true;

	        if (NativeDate.now) {
	            ClockDate.now = function now() {
	                return ClockDate.clock.now;
	            };
	        }

	        if (NativeDate.toSource) {
	            ClockDate.toSource = function toSource() {
	                return NativeDate.toSource();
	            };
	        }

	        ClockDate.toString = function toString() {
	            return NativeDate.toString();
	        };

	        // noinspection UnnecessaryLocalVariableJS
	        /**
	         * A normal Class constructor cannot be called without `new`, but Date can, so we need
	         * to wrap it in a Proxy in order to ensure this functionality of Date is kept intact
	         * @type {ClockDate}
	         */
	        const ClockDateProxy = new Proxy(ClockDate, {
	            // handler for [[Call]] invocations (i.e. not using `new`)
	            apply() {
	                // the Date constructor called as a function, ref Ecma-262 Edition 5.1, section 15.9.2.
	                // This remains so in the 10th edition of 2019 as well.
	                if (this instanceof ClockDate) {
	                    throw new TypeError(
	                        "A Proxy should only capture `new` calls with the `construct` handler. This is not supposed to be possible, so check the logic.",
	                    );
	                }

	                return new NativeDate(ClockDate.clock.now).toString();
	            },
	        });

	        return ClockDateProxy;
	    }

	    /**
	     * Mirror Intl by default on our fake implementation
	     *
	     * Most of the properties are the original native ones,
	     * but we need to take control of those that have a
	     * dependency on the current clock.
	     * @returns {object} the partly fake Intl implementation
	     */
	    function createIntl() {
	        const ClockIntl = {};
	        /*
	         * All properties of Intl are non-enumerable, so we need
	         * to do a bit of work to get them out.
	         */
	        Object.getOwnPropertyNames(NativeIntl).forEach(
	            (property) => (ClockIntl[property] = NativeIntl[property]),
	        );

	        ClockIntl.DateTimeFormat = function (...args) {
	            const realFormatter = new NativeIntl.DateTimeFormat(...args);
	            const formatter = {};

	            ["formatRange", "formatRangeToParts", "resolvedOptions"].forEach(
	                (method) => {
	                    formatter[method] =
	                        realFormatter[method].bind(realFormatter);
	                },
	            );

	            ["format", "formatToParts"].forEach((method) => {
	                formatter[method] = function (date) {
	                    return realFormatter[method](date || ClockIntl.clock.now);
	                };
	            });

	            return formatter;
	        };

	        ClockIntl.DateTimeFormat.prototype = Object.create(
	            NativeIntl.DateTimeFormat.prototype,
	        );

	        ClockIntl.DateTimeFormat.supportedLocalesOf =
	            NativeIntl.DateTimeFormat.supportedLocalesOf;

	        return ClockIntl;
	    }

	    //eslint-disable-next-line jsdoc/require-jsdoc
	    function enqueueJob(clock, job) {
	        // enqueues a microtick-deferred task - ecma262/#sec-enqueuejob
	        if (!clock.jobs) {
	            clock.jobs = [];
	        }
	        clock.jobs.push(job);
	    }

	    //eslint-disable-next-line jsdoc/require-jsdoc
	    function runJobs(clock) {
	        // runs all microtick-deferred tasks - ecma262/#sec-runjobs
	        if (!clock.jobs) {
	            return;
	        }
	        for (let i = 0; i < clock.jobs.length; i++) {
	            const job = clock.jobs[i];
	            job.func.apply(null, job.args);

	            checkIsNearInfiniteLimit(clock, i);
	            if (clock.loopLimit && i > clock.loopLimit) {
	                throw getInfiniteLoopError(clock, job);
	            }
	        }
	        resetIsNearInfiniteLimit();
	        clock.jobs = [];
	    }

	    /**
	     * @param {Clock} clock
	     * @param {Timer} timer
	     * @returns {number} id of the created timer
	     */
	    function addTimer(clock, timer) {
	        if (timer.func === undefined) {
	            throw new Error("Callback must be provided to timer calls");
	        }

	        if (addTimerReturnsObject) {
	            // Node.js environment
	            if (typeof timer.func !== "function") {
	                throw new TypeError(
	                    `[ERR_INVALID_CALLBACK]: Callback must be a function. Received ${
	                        timer.func
	                    } of type ${typeof timer.func}`,
	                );
	            }
	        }

	        if (isNearInfiniteLimit) {
	            timer.error = new Error();
	        }

	        timer.type = timer.immediate ? "Immediate" : "Timeout";

	        if (timer.hasOwnProperty("delay")) {
	            if (typeof timer.delay !== "number") {
	                timer.delay = parseInt(timer.delay, 10);
	            }

	            if (!isNumberFinite(timer.delay)) {
	                timer.delay = 0;
	            }
	            timer.delay = timer.delay > maxTimeout ? 1 : timer.delay;
	            timer.delay = Math.max(0, timer.delay);
	        }

	        if (timer.hasOwnProperty("interval")) {
	            timer.type = "Interval";
	            timer.interval = timer.interval > maxTimeout ? 1 : timer.interval;
	        }

	        if (timer.hasOwnProperty("animation")) {
	            timer.type = "AnimationFrame";
	            timer.animation = true;
	        }

	        if (timer.hasOwnProperty("idleCallback")) {
	            timer.type = "IdleCallback";
	            timer.idleCallback = true;
	        }

	        if (!clock.timers) {
	            clock.timers = {};
	        }

	        timer.id = uniqueTimerId++;
	        timer.createdAt = clock.now;
	        timer.callAt =
	            clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));

	        clock.timers[timer.id] = timer;

	        if (addTimerReturnsObject) {
	            const res = {
	                refed: true,
	                ref: function () {
	                    this.refed = true;
	                    return res;
	                },
	                unref: function () {
	                    this.refed = false;
	                    return res;
	                },
	                hasRef: function () {
	                    return this.refed;
	                },
	                refresh: function () {
	                    timer.callAt =
	                        clock.now +
	                        (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));

	                    // it _might_ have been removed, but if not the assignment is perfectly fine
	                    clock.timers[timer.id] = timer;

	                    return res;
	                },
	                [Symbol.toPrimitive]: function () {
	                    return timer.id;
	                },
	            };
	            return res;
	        }

	        return timer.id;
	    }

	    /* eslint consistent-return: "off" */
	    /**
	     * Timer comparitor
	     * @param {Timer} a
	     * @param {Timer} b
	     * @returns {number}
	     */
	    function compareTimers(a, b) {
	        // Sort first by absolute timing
	        if (a.callAt < b.callAt) {
	            return -1;
	        }
	        if (a.callAt > b.callAt) {
	            return 1;
	        }

	        // Sort next by immediate, immediate timers take precedence
	        if (a.immediate && !b.immediate) {
	            return -1;
	        }
	        if (!a.immediate && b.immediate) {
	            return 1;
	        }

	        // Sort next by creation time, earlier-created timers take precedence
	        if (a.createdAt < b.createdAt) {
	            return -1;
	        }
	        if (a.createdAt > b.createdAt) {
	            return 1;
	        }

	        // Sort next by id, lower-id timers take precedence
	        if (a.id < b.id) {
	            return -1;
	        }
	        if (a.id > b.id) {
	            return 1;
	        }

	        // As timer ids are unique, no fallback `0` is necessary
	    }

	    /**
	     * @param {Clock} clock
	     * @param {number} from
	     * @param {number} to
	     * @returns {Timer}
	     */
	    function firstTimerInRange(clock, from, to) {
	        const timers = clock.timers;
	        let timer = null;
	        let id, isInRange;

	        for (id in timers) {
	            if (timers.hasOwnProperty(id)) {
	                isInRange = inRange(from, to, timers[id]);

	                if (
	                    isInRange &&
	                    (!timer || compareTimers(timer, timers[id]) === 1)
	                ) {
	                    timer = timers[id];
	                }
	            }
	        }

	        return timer;
	    }

	    /**
	     * @param {Clock} clock
	     * @returns {Timer}
	     */
	    function firstTimer(clock) {
	        const timers = clock.timers;
	        let timer = null;
	        let id;

	        for (id in timers) {
	            if (timers.hasOwnProperty(id)) {
	                if (!timer || compareTimers(timer, timers[id]) === 1) {
	                    timer = timers[id];
	                }
	            }
	        }

	        return timer;
	    }

	    /**
	     * @param {Clock} clock
	     * @returns {Timer}
	     */
	    function lastTimer(clock) {
	        const timers = clock.timers;
	        let timer = null;
	        let id;

	        for (id in timers) {
	            if (timers.hasOwnProperty(id)) {
	                if (!timer || compareTimers(timer, timers[id]) === -1) {
	                    timer = timers[id];
	                }
	            }
	        }

	        return timer;
	    }

	    /**
	     * @param {Clock} clock
	     * @param {Timer} timer
	     */
	    function callTimer(clock, timer) {
	        if (typeof timer.interval === "number") {
	            clock.timers[timer.id].callAt += timer.interval;
	        } else {
	            delete clock.timers[timer.id];
	        }

	        if (typeof timer.func === "function") {
	            timer.func.apply(null, timer.args);
	        } else {
	            /* eslint no-eval: "off" */
	            const eval2 = eval;
	            (function () {
	                eval2(timer.func);
	            })();
	        }
	    }

	    /**
	     * Gets clear handler name for a given timer type
	     * @param {string} ttype
	     */
	    function getClearHandler(ttype) {
	        if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
	            return `cancel${ttype}`;
	        }
	        return `clear${ttype}`;
	    }

	    /**
	     * Gets schedule handler name for a given timer type
	     * @param {string} ttype
	     */
	    function getScheduleHandler(ttype) {
	        if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
	            return `request${ttype}`;
	        }
	        return `set${ttype}`;
	    }

	    /**
	     * Creates an anonymous function to warn only once
	     */
	    function createWarnOnce() {
	        let calls = 0;
	        return function (msg) {
	            // eslint-disable-next-line
	            !calls++ && console.warn(msg);
	        };
	    }
	    const warnOnce = createWarnOnce();

	    /**
	     * @param {Clock} clock
	     * @param {number} timerId
	     * @param {string} ttype
	     */
	    function clearTimer(clock, timerId, ttype) {
	        if (!timerId) {
	            // null appears to be allowed in most browsers, and appears to be
	            // relied upon by some libraries, like Bootstrap carousel
	            return;
	        }

	        if (!clock.timers) {
	            clock.timers = {};
	        }

	        // in Node, the ID is stored as the primitive value for `Timeout` objects
	        // for `Immediate` objects, no ID exists, so it gets coerced to NaN
	        const id = Number(timerId);

	        if (Number.isNaN(id) || id < idCounterStart) {
	            const handlerName = getClearHandler(ttype);

	            if (clock.shouldClearNativeTimers === true) {
	                const nativeHandler = clock[`_${handlerName}`];
	                return typeof nativeHandler === "function"
	                    ? nativeHandler(timerId)
	                    : undefined;
	            }
	            warnOnce(
	                `FakeTimers: ${handlerName} was invoked to clear a native timer instead of one created by this library.` +
	                    "\nTo automatically clean-up native timers, use `shouldClearNativeTimers`.",
	            );
	        }

	        if (clock.timers.hasOwnProperty(id)) {
	            // check that the ID matches a timer of the correct type
	            const timer = clock.timers[id];
	            if (
	                timer.type === ttype ||
	                (timer.type === "Timeout" && ttype === "Interval") ||
	                (timer.type === "Interval" && ttype === "Timeout")
	            ) {
	                delete clock.timers[id];
	            } else {
	                const clear = getClearHandler(ttype);
	                const schedule = getScheduleHandler(timer.type);
	                throw new Error(
	                    `Cannot clear timer: timer created with ${schedule}() but cleared with ${clear}()`,
	                );
	            }
	        }
	    }

	    /**
	     * @param {Clock} clock
	     * @param {Config} config
	     * @returns {Timer[]}
	     */
	    function uninstall(clock, config) {
	        let method, i, l;
	        const installedHrTime = "_hrtime";
	        const installedNextTick = "_nextTick";

	        for (i = 0, l = clock.methods.length; i < l; i++) {
	            method = clock.methods[i];
	            if (method === "hrtime" && _global.process) {
	                _global.process.hrtime = clock[installedHrTime];
	            } else if (method === "nextTick" && _global.process) {
	                _global.process.nextTick = clock[installedNextTick];
	            } else if (method === "performance") {
	                const originalPerfDescriptor = Object.getOwnPropertyDescriptor(
	                    clock,
	                    `_${method}`,
	                );
	                if (
	                    originalPerfDescriptor &&
	                    originalPerfDescriptor.get &&
	                    !originalPerfDescriptor.set
	                ) {
	                    Object.defineProperty(
	                        _global,
	                        method,
	                        originalPerfDescriptor,
	                    );
	                } else if (originalPerfDescriptor.configurable) {
	                    _global[method] = clock[`_${method}`];
	                }
	            } else {
	                if (_global[method] && _global[method].hadOwnProperty) {
	                    _global[method] = clock[`_${method}`];
	                } else {
	                    try {
	                        delete _global[method];
	                    } catch (ignore) {
	                        /* eslint no-empty: "off" */
	                    }
	                }
	            }
	            if (clock.timersModuleMethods !== undefined) {
	                for (let j = 0; j < clock.timersModuleMethods.length; j++) {
	                    const entry = clock.timersModuleMethods[j];
	                    timersModule[entry.methodName] = entry.original;
	                }
	            }
	            if (clock.timersPromisesModuleMethods !== undefined) {
	                for (
	                    let j = 0;
	                    j < clock.timersPromisesModuleMethods.length;
	                    j++
	                ) {
	                    const entry = clock.timersPromisesModuleMethods[j];
	                    timersPromisesModule[entry.methodName] = entry.original;
	                }
	            }
	        }

	        if (config.shouldAdvanceTime === true) {
	            _global.clearInterval(clock.attachedInterval);
	        }

	        // Prevent multiple executions which will completely remove these props
	        clock.methods = [];

	        for (const [listener, signal] of clock.abortListenerMap.entries()) {
	            signal.removeEventListener("abort", listener);
	            clock.abortListenerMap.delete(listener);
	        }

	        // return pending timers, to enable checking what timers remained on uninstall
	        if (!clock.timers) {
	            return [];
	        }
	        return Object.keys(clock.timers).map(function mapper(key) {
	            return clock.timers[key];
	        });
	    }

	    /**
	     * @param {object} target the target containing the method to replace
	     * @param {string} method the keyname of the method on the target
	     * @param {Clock} clock
	     */
	    function hijackMethod(target, method, clock) {
	        clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(
	            target,
	            method,
	        );
	        clock[`_${method}`] = target[method];

	        if (method === "Date") {
	            target[method] = clock[method];
	        } else if (method === "Intl") {
	            target[method] = clock[method];
	        } else if (method === "performance") {
	            const originalPerfDescriptor = Object.getOwnPropertyDescriptor(
	                target,
	                method,
	            );
	            // JSDOM has a read only performance field so we have to save/copy it differently
	            if (
	                originalPerfDescriptor &&
	                originalPerfDescriptor.get &&
	                !originalPerfDescriptor.set
	            ) {
	                Object.defineProperty(
	                    clock,
	                    `_${method}`,
	                    originalPerfDescriptor,
	                );

	                const perfDescriptor = Object.getOwnPropertyDescriptor(
	                    clock,
	                    method,
	                );
	                Object.defineProperty(target, method, perfDescriptor);
	            } else {
	                target[method] = clock[method];
	            }
	        } else {
	            target[method] = function () {
	                return clock[method].apply(clock, arguments);
	            };

	            Object.defineProperties(
	                target[method],
	                Object.getOwnPropertyDescriptors(clock[method]),
	            );
	        }

	        target[method].clock = clock;
	    }

	    /**
	     * @param {Clock} clock
	     * @param {number} advanceTimeDelta
	     */
	    function doIntervalTick(clock, advanceTimeDelta) {
	        clock.tick(advanceTimeDelta);
	    }

	    /**
	     * @typedef {object} Timers
	     * @property {setTimeout} setTimeout
	     * @property {clearTimeout} clearTimeout
	     * @property {setInterval} setInterval
	     * @property {clearInterval} clearInterval
	     * @property {Date} Date
	     * @property {Intl} Intl
	     * @property {SetImmediate=} setImmediate
	     * @property {function(NodeImmediate): void=} clearImmediate
	     * @property {function(number[]):number[]=} hrtime
	     * @property {NextTick=} nextTick
	     * @property {Performance=} performance
	     * @property {RequestAnimationFrame=} requestAnimationFrame
	     * @property {boolean=} queueMicrotask
	     * @property {function(number): void=} cancelAnimationFrame
	     * @property {RequestIdleCallback=} requestIdleCallback
	     * @property {function(number): void=} cancelIdleCallback
	     */

	    /** @type {Timers} */
	    const timers = {
	        setTimeout: _global.setTimeout,
	        clearTimeout: _global.clearTimeout,
	        setInterval: _global.setInterval,
	        clearInterval: _global.clearInterval,
	        Date: _global.Date,
	    };

	    if (isPresent.setImmediate) {
	        timers.setImmediate = _global.setImmediate;
	    }

	    if (isPresent.clearImmediate) {
	        timers.clearImmediate = _global.clearImmediate;
	    }

	    if (isPresent.hrtime) {
	        timers.hrtime = _global.process.hrtime;
	    }

	    if (isPresent.nextTick) {
	        timers.nextTick = _global.process.nextTick;
	    }

	    if (isPresent.performance) {
	        timers.performance = _global.performance;
	    }

	    if (isPresent.requestAnimationFrame) {
	        timers.requestAnimationFrame = _global.requestAnimationFrame;
	    }

	    if (isPresent.queueMicrotask) {
	        timers.queueMicrotask = _global.queueMicrotask;
	    }

	    if (isPresent.cancelAnimationFrame) {
	        timers.cancelAnimationFrame = _global.cancelAnimationFrame;
	    }

	    if (isPresent.requestIdleCallback) {
	        timers.requestIdleCallback = _global.requestIdleCallback;
	    }

	    if (isPresent.cancelIdleCallback) {
	        timers.cancelIdleCallback = _global.cancelIdleCallback;
	    }

	    if (isPresent.Intl) {
	        timers.Intl = NativeIntl;
	    }

	    const originalSetTimeout = _global.setImmediate || _global.setTimeout;

	    /**
	     * @param {Date|number} [start] the system time - non-integer values are floored
	     * @param {number} [loopLimit] maximum number of timers that will be run when calling runAll()
	     * @returns {Clock}
	     */
	    function createClock(start, loopLimit) {
	        // eslint-disable-next-line no-param-reassign
	        start = Math.floor(getEpoch(start));
	        // eslint-disable-next-line no-param-reassign
	        loopLimit = loopLimit || 1000;
	        let nanos = 0;
	        const adjustedSystemTime = [0, 0]; // [millis, nanoremainder]

	        const clock = {
	            now: start,
	            Date: createDate(),
	            loopLimit: loopLimit,
	        };

	        clock.Date.clock = clock;

	        //eslint-disable-next-line jsdoc/require-jsdoc
	        function getTimeToNextFrame() {
	            return 16 - ((clock.now - start) % 16);
	        }

	        //eslint-disable-next-line jsdoc/require-jsdoc
	        function hrtime(prev) {
	            const millisSinceStart = clock.now - adjustedSystemTime[0] - start;
	            const secsSinceStart = Math.floor(millisSinceStart / 1000);
	            const remainderInNanos =
	                (millisSinceStart - secsSinceStart * 1e3) * 1e6 +
	                nanos -
	                adjustedSystemTime[1];

	            if (Array.isArray(prev)) {
	                if (prev[1] > 1e9) {
	                    throw new TypeError(
	                        "Number of nanoseconds can't exceed a billion",
	                    );
	                }

	                const oldSecs = prev[0];
	                let nanoDiff = remainderInNanos - prev[1];
	                let secDiff = secsSinceStart - oldSecs;

	                if (nanoDiff < 0) {
	                    nanoDiff += 1e9;
	                    secDiff -= 1;
	                }

	                return [secDiff, nanoDiff];
	            }
	            return [secsSinceStart, remainderInNanos];
	        }

	        /**
	         * A high resolution timestamp in milliseconds.
	         * @typedef {number} DOMHighResTimeStamp
	         */

	        /**
	         * performance.now()
	         * @returns {DOMHighResTimeStamp}
	         */
	        function fakePerformanceNow() {
	            const hrt = hrtime();
	            const millis = hrt[0] * 1000 + hrt[1] / 1e6;
	            return millis;
	        }

	        if (isPresent.hrtimeBigint) {
	            hrtime.bigint = function () {
	                const parts = hrtime();
	                return BigInt(parts[0]) * BigInt(1e9) + BigInt(parts[1]); // eslint-disable-line
	            };
	        }

	        if (isPresent.Intl) {
	            clock.Intl = createIntl();
	            clock.Intl.clock = clock;
	        }

	        clock.requestIdleCallback = function requestIdleCallback(
	            func,
	            timeout,
	        ) {
	            let timeToNextIdlePeriod = 0;

	            if (clock.countTimers() > 0) {
	                timeToNextIdlePeriod = 50; // const for now
	            }

	            const result = addTimer(clock, {
	                func: func,
	                args: Array.prototype.slice.call(arguments, 2),
	                delay:
	                    typeof timeout === "undefined"
	                        ? timeToNextIdlePeriod
	                        : Math.min(timeout, timeToNextIdlePeriod),
	                idleCallback: true,
	            });

	            return Number(result);
	        };

	        clock.cancelIdleCallback = function cancelIdleCallback(timerId) {
	            return clearTimer(clock, timerId, "IdleCallback");
	        };

	        clock.setTimeout = function setTimeout(func, timeout) {
	            return addTimer(clock, {
	                func: func,
	                args: Array.prototype.slice.call(arguments, 2),
	                delay: timeout,
	            });
	        };
	        if (typeof _global.Promise !== "undefined" && utilPromisify) {
	            clock.setTimeout[utilPromisify.custom] =
	                function promisifiedSetTimeout(timeout, arg) {
	                    return new _global.Promise(function setTimeoutExecutor(
	                        resolve,
	                    ) {
	                        addTimer(clock, {
	                            func: resolve,
	                            args: [arg],
	                            delay: timeout,
	                        });
	                    });
	                };
	        }

	        clock.clearTimeout = function clearTimeout(timerId) {
	            return clearTimer(clock, timerId, "Timeout");
	        };

	        clock.nextTick = function nextTick(func) {
	            return enqueueJob(clock, {
	                func: func,
	                args: Array.prototype.slice.call(arguments, 1),
	                error: isNearInfiniteLimit ? new Error() : null,
	            });
	        };

	        clock.queueMicrotask = function queueMicrotask(func) {
	            return clock.nextTick(func); // explicitly drop additional arguments
	        };

	        clock.setInterval = function setInterval(func, timeout) {
	            // eslint-disable-next-line no-param-reassign
	            timeout = parseInt(timeout, 10);
	            return addTimer(clock, {
	                func: func,
	                args: Array.prototype.slice.call(arguments, 2),
	                delay: timeout,
	                interval: timeout,
	            });
	        };

	        clock.clearInterval = function clearInterval(timerId) {
	            return clearTimer(clock, timerId, "Interval");
	        };

	        if (isPresent.setImmediate) {
	            clock.setImmediate = function setImmediate(func) {
	                return addTimer(clock, {
	                    func: func,
	                    args: Array.prototype.slice.call(arguments, 1),
	                    immediate: true,
	                });
	            };

	            if (typeof _global.Promise !== "undefined" && utilPromisify) {
	                clock.setImmediate[utilPromisify.custom] =
	                    function promisifiedSetImmediate(arg) {
	                        return new _global.Promise(
	                            function setImmediateExecutor(resolve) {
	                                addTimer(clock, {
	                                    func: resolve,
	                                    args: [arg],
	                                    immediate: true,
	                                });
	                            },
	                        );
	                    };
	            }

	            clock.clearImmediate = function clearImmediate(timerId) {
	                return clearTimer(clock, timerId, "Immediate");
	            };
	        }

	        clock.countTimers = function countTimers() {
	            return (
	                Object.keys(clock.timers || {}).length +
	                (clock.jobs || []).length
	            );
	        };

	        clock.requestAnimationFrame = function requestAnimationFrame(func) {
	            const result = addTimer(clock, {
	                func: func,
	                delay: getTimeToNextFrame(),
	                get args() {
	                    return [fakePerformanceNow()];
	                },
	                animation: true,
	            });

	            return Number(result);
	        };

	        clock.cancelAnimationFrame = function cancelAnimationFrame(timerId) {
	            return clearTimer(clock, timerId, "AnimationFrame");
	        };

	        clock.runMicrotasks = function runMicrotasks() {
	            runJobs(clock);
	        };

	        /**
	         * @param {number|string} tickValue milliseconds or a string parseable by parseTime
	         * @param {boolean} isAsync
	         * @param {Function} resolve
	         * @param {Function} reject
	         * @returns {number|undefined} will return the new `now` value or nothing for async
	         */
	        function doTick(tickValue, isAsync, resolve, reject) {
	            const msFloat =
	                typeof tickValue === "number"
	                    ? tickValue
	                    : parseTime(tickValue);
	            const ms = Math.floor(msFloat);
	            const remainder = nanoRemainder(msFloat);
	            let nanosTotal = nanos + remainder;
	            let tickTo = clock.now + ms;

	            if (msFloat < 0) {
	                throw new TypeError("Negative ticks are not supported");
	            }

	            // adjust for positive overflow
	            if (nanosTotal >= 1e6) {
	                tickTo += 1;
	                nanosTotal -= 1e6;
	            }

	            nanos = nanosTotal;
	            let tickFrom = clock.now;
	            let previous = clock.now;
	            // ESLint fails to detect this correctly
	            /* eslint-disable prefer-const */
	            let timer,
	                firstException,
	                oldNow,
	                nextPromiseTick,
	                compensationCheck,
	                postTimerCall;
	            /* eslint-enable prefer-const */

	            clock.duringTick = true;

	            // perform microtasks
	            oldNow = clock.now;
	            runJobs(clock);
	            if (oldNow !== clock.now) {
	                // compensate for any setSystemTime() call during microtask callback
	                tickFrom += clock.now - oldNow;
	                tickTo += clock.now - oldNow;
	            }

	            //eslint-disable-next-line jsdoc/require-jsdoc
	            function doTickInner() {
	                // perform each timer in the requested range
	                timer = firstTimerInRange(clock, tickFrom, tickTo);
	                // eslint-disable-next-line no-unmodified-loop-condition
	                while (timer && tickFrom <= tickTo) {
	                    if (clock.timers[timer.id]) {
	                        tickFrom = timer.callAt;
	                        clock.now = timer.callAt;
	                        oldNow = clock.now;
	                        try {
	                            runJobs(clock);
	                            callTimer(clock, timer);
	                        } catch (e) {
	                            firstException = firstException || e;
	                        }

	                        if (isAsync) {
	                            // finish up after native setImmediate callback to allow
	                            // all native es6 promises to process their callbacks after
	                            // each timer fires.
	                            originalSetTimeout(nextPromiseTick);
	                            return;
	                        }

	                        compensationCheck();
	                    }

	                    postTimerCall();
	                }

	                // perform process.nextTick()s again
	                oldNow = clock.now;
	                runJobs(clock);
	                if (oldNow !== clock.now) {
	                    // compensate for any setSystemTime() call during process.nextTick() callback
	                    tickFrom += clock.now - oldNow;
	                    tickTo += clock.now - oldNow;
	                }
	                clock.duringTick = false;

	                // corner case: during runJobs new timers were scheduled which could be in the range [clock.now, tickTo]
	                timer = firstTimerInRange(clock, tickFrom, tickTo);
	                if (timer) {
	                    try {
	                        clock.tick(tickTo - clock.now); // do it all again - for the remainder of the requested range
	                    } catch (e) {
	                        firstException = firstException || e;
	                    }
	                } else {
	                    // no timers remaining in the requested range: move the clock all the way to the end
	                    clock.now = tickTo;

	                    // update nanos
	                    nanos = nanosTotal;
	                }
	                if (firstException) {
	                    throw firstException;
	                }

	                if (isAsync) {
	                    resolve(clock.now);
	                } else {
	                    return clock.now;
	                }
	            }

	            nextPromiseTick =
	                isAsync &&
	                function () {
	                    try {
	                        compensationCheck();
	                        postTimerCall();
	                        doTickInner();
	                    } catch (e) {
	                        reject(e);
	                    }
	                };

	            compensationCheck = function () {
	                // compensate for any setSystemTime() call during timer callback
	                if (oldNow !== clock.now) {
	                    tickFrom += clock.now - oldNow;
	                    tickTo += clock.now - oldNow;
	                    previous += clock.now - oldNow;
	                }
	            };

	            postTimerCall = function () {
	                timer = firstTimerInRange(clock, previous, tickTo);
	                previous = tickFrom;
	            };

	            return doTickInner();
	        }

	        /**
	         * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
	         * @returns {number} will return the new `now` value
	         */
	        clock.tick = function tick(tickValue) {
	            return doTick(tickValue, false);
	        };

	        if (typeof _global.Promise !== "undefined") {
	            /**
	             * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
	             * @returns {Promise}
	             */
	            clock.tickAsync = function tickAsync(tickValue) {
	                return new _global.Promise(function (resolve, reject) {
	                    originalSetTimeout(function () {
	                        try {
	                            doTick(tickValue, true, resolve, reject);
	                        } catch (e) {
	                            reject(e);
	                        }
	                    });
	                });
	            };
	        }

	        clock.next = function next() {
	            runJobs(clock);
	            const timer = firstTimer(clock);
	            if (!timer) {
	                return clock.now;
	            }

	            clock.duringTick = true;
	            try {
	                clock.now = timer.callAt;
	                callTimer(clock, timer);
	                runJobs(clock);
	                return clock.now;
	            } finally {
	                clock.duringTick = false;
	            }
	        };

	        if (typeof _global.Promise !== "undefined") {
	            clock.nextAsync = function nextAsync() {
	                return new _global.Promise(function (resolve, reject) {
	                    originalSetTimeout(function () {
	                        try {
	                            const timer = firstTimer(clock);
	                            if (!timer) {
	                                resolve(clock.now);
	                                return;
	                            }

	                            let err;
	                            clock.duringTick = true;
	                            clock.now = timer.callAt;
	                            try {
	                                callTimer(clock, timer);
	                            } catch (e) {
	                                err = e;
	                            }
	                            clock.duringTick = false;

	                            originalSetTimeout(function () {
	                                if (err) {
	                                    reject(err);
	                                } else {
	                                    resolve(clock.now);
	                                }
	                            });
	                        } catch (e) {
	                            reject(e);
	                        }
	                    });
	                });
	            };
	        }

	        clock.runAll = function runAll() {
	            let numTimers, i;
	            runJobs(clock);
	            for (i = 0; i < clock.loopLimit; i++) {
	                if (!clock.timers) {
	                    resetIsNearInfiniteLimit();
	                    return clock.now;
	                }

	                numTimers = Object.keys(clock.timers).length;
	                if (numTimers === 0) {
	                    resetIsNearInfiniteLimit();
	                    return clock.now;
	                }

	                clock.next();
	                checkIsNearInfiniteLimit(clock, i);
	            }

	            const excessJob = firstTimer(clock);
	            throw getInfiniteLoopError(clock, excessJob);
	        };

	        clock.runToFrame = function runToFrame() {
	            return clock.tick(getTimeToNextFrame());
	        };

	        if (typeof _global.Promise !== "undefined") {
	            clock.runAllAsync = function runAllAsync() {
	                return new _global.Promise(function (resolve, reject) {
	                    let i = 0;
	                    /**
	                     *
	                     */
	                    function doRun() {
	                        originalSetTimeout(function () {
	                            try {
	                                runJobs(clock);

	                                let numTimers;
	                                if (i < clock.loopLimit) {
	                                    if (!clock.timers) {
	                                        resetIsNearInfiniteLimit();
	                                        resolve(clock.now);
	                                        return;
	                                    }

	                                    numTimers = Object.keys(
	                                        clock.timers,
	                                    ).length;
	                                    if (numTimers === 0) {
	                                        resetIsNearInfiniteLimit();
	                                        resolve(clock.now);
	                                        return;
	                                    }

	                                    clock.next();

	                                    i++;

	                                    doRun();
	                                    checkIsNearInfiniteLimit(clock, i);
	                                    return;
	                                }

	                                const excessJob = firstTimer(clock);
	                                reject(getInfiniteLoopError(clock, excessJob));
	                            } catch (e) {
	                                reject(e);
	                            }
	                        });
	                    }
	                    doRun();
	                });
	            };
	        }

	        clock.runToLast = function runToLast() {
	            const timer = lastTimer(clock);
	            if (!timer) {
	                runJobs(clock);
	                return clock.now;
	            }

	            return clock.tick(timer.callAt - clock.now);
	        };

	        if (typeof _global.Promise !== "undefined") {
	            clock.runToLastAsync = function runToLastAsync() {
	                return new _global.Promise(function (resolve, reject) {
	                    originalSetTimeout(function () {
	                        try {
	                            const timer = lastTimer(clock);
	                            if (!timer) {
	                                runJobs(clock);
	                                resolve(clock.now);
	                            }

	                            resolve(clock.tickAsync(timer.callAt - clock.now));
	                        } catch (e) {
	                            reject(e);
	                        }
	                    });
	                });
	            };
	        }

	        clock.reset = function reset() {
	            nanos = 0;
	            clock.timers = {};
	            clock.jobs = [];
	            clock.now = start;
	        };

	        clock.setSystemTime = function setSystemTime(systemTime) {
	            // determine time difference
	            const newNow = getEpoch(systemTime);
	            const difference = newNow - clock.now;
	            let id, timer;

	            adjustedSystemTime[0] = adjustedSystemTime[0] + difference;
	            adjustedSystemTime[1] = adjustedSystemTime[1] + nanos;
	            // update 'system clock'
	            clock.now = newNow;
	            nanos = 0;

	            // update timers and intervals to keep them stable
	            for (id in clock.timers) {
	                if (clock.timers.hasOwnProperty(id)) {
	                    timer = clock.timers[id];
	                    timer.createdAt += difference;
	                    timer.callAt += difference;
	                }
	            }
	        };

	        /**
	         * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
	         * @returns {number} will return the new `now` value
	         */
	        clock.jump = function jump(tickValue) {
	            const msFloat =
	                typeof tickValue === "number"
	                    ? tickValue
	                    : parseTime(tickValue);
	            const ms = Math.floor(msFloat);

	            for (const timer of Object.values(clock.timers)) {
	                if (clock.now + ms > timer.callAt) {
	                    timer.callAt = clock.now + ms;
	                }
	            }
	            clock.tick(ms);
	        };

	        if (isPresent.performance) {
	            clock.performance = Object.create(null);
	            clock.performance.now = fakePerformanceNow;
	        }

	        if (isPresent.hrtime) {
	            clock.hrtime = hrtime;
	        }

	        return clock;
	    }

	    /* eslint-disable complexity */

	    /**
	     * @param {Config=} [config] Optional config
	     * @returns {Clock}
	     */
	    function install(config) {
	        if (
	            arguments.length > 1 ||
	            config instanceof Date ||
	            Array.isArray(config) ||
	            typeof config === "number"
	        ) {
	            throw new TypeError(
	                `FakeTimers.install called with ${String(
	                    config,
	                )} install requires an object parameter`,
	            );
	        }

	        if (_global.Date.isFake === true) {
	            // Timers are already faked; this is a problem.
	            // Make the user reset timers before continuing.
	            throw new TypeError(
	                "Can't install fake timers twice on the same global object.",
	            );
	        }

	        // eslint-disable-next-line no-param-reassign
	        config = typeof config !== "undefined" ? config : {};
	        config.shouldAdvanceTime = config.shouldAdvanceTime || false;
	        config.advanceTimeDelta = config.advanceTimeDelta || 20;
	        config.shouldClearNativeTimers =
	            config.shouldClearNativeTimers || false;

	        if (config.target) {
	            throw new TypeError(
	                "config.target is no longer supported. Use `withGlobal(target)` instead.",
	            );
	        }

	        /**
	         * @param {string} timer/object the name of the thing that is not present
	         * @param timer
	         */
	        function handleMissingTimer(timer) {
	            if (config.ignoreMissingTimers) {
	                return;
	            }

	            throw new ReferenceError(
	                `non-existent timers and/or objects cannot be faked: '${timer}'`,
	            );
	        }

	        let i, l;
	        const clock = createClock(config.now, config.loopLimit);
	        clock.shouldClearNativeTimers = config.shouldClearNativeTimers;

	        clock.uninstall = function () {
	            return uninstall(clock, config);
	        };

	        clock.abortListenerMap = new Map();

	        clock.methods = config.toFake || [];

	        if (clock.methods.length === 0) {
	            clock.methods = Object.keys(timers);
	        }

	        if (config.shouldAdvanceTime === true) {
	            const intervalTick = doIntervalTick.bind(
	                null,
	                clock,
	                config.advanceTimeDelta,
	            );
	            const intervalId = _global.setInterval(
	                intervalTick,
	                config.advanceTimeDelta,
	            );
	            clock.attachedInterval = intervalId;
	        }

	        if (clock.methods.includes("performance")) {
	            const proto = (() => {
	                if (hasPerformanceConstructorPrototype) {
	                    return _global.performance.constructor.prototype;
	                }
	                if (hasPerformancePrototype) {
	                    return _global.Performance.prototype;
	                }
	            })();
	            if (proto) {
	                Object.getOwnPropertyNames(proto).forEach(function (name) {
	                    if (name !== "now") {
	                        clock.performance[name] =
	                            name.indexOf("getEntries") === 0
	                                ? NOOP_ARRAY
	                                : NOOP;
	                    }
	                });
	                // ensure `mark` returns a value that is valid
	                clock.performance.mark = (name) =>
	                    new FakePerformanceEntry(name, "mark", 0, 0);
	                clock.performance.measure = (name) =>
	                    new FakePerformanceEntry(name, "measure", 0, 100);
	                // `timeOrigin` should return the time of when the Window session started
	                // (or the Worker was installed)
	                clock.performance.timeOrigin = getEpoch(config.now);
	            } else if ((config.toFake || []).includes("performance")) {
	                return handleMissingTimer("performance");
	            }
	        }
	        if (_global === globalObject && timersModule) {
	            clock.timersModuleMethods = [];
	        }
	        if (_global === globalObject && timersPromisesModule) {
	            clock.timersPromisesModuleMethods = [];
	        }
	        for (i = 0, l = clock.methods.length; i < l; i++) {
	            const nameOfMethodToReplace = clock.methods[i];

	            if (!isPresent[nameOfMethodToReplace]) {
	                handleMissingTimer(nameOfMethodToReplace);
	                // eslint-disable-next-line
	                continue;
	            }

	            if (nameOfMethodToReplace === "hrtime") {
	                if (
	                    _global.process &&
	                    typeof _global.process.hrtime === "function"
	                ) {
	                    hijackMethod(_global.process, nameOfMethodToReplace, clock);
	                }
	            } else if (nameOfMethodToReplace === "nextTick") {
	                if (
	                    _global.process &&
	                    typeof _global.process.nextTick === "function"
	                ) {
	                    hijackMethod(_global.process, nameOfMethodToReplace, clock);
	                }
	            } else {
	                hijackMethod(_global, nameOfMethodToReplace, clock);
	            }
	            if (
	                clock.timersModuleMethods !== undefined &&
	                timersModule[nameOfMethodToReplace]
	            ) {
	                const original = timersModule[nameOfMethodToReplace];
	                clock.timersModuleMethods.push({
	                    methodName: nameOfMethodToReplace,
	                    original: original,
	                });
	                timersModule[nameOfMethodToReplace] =
	                    _global[nameOfMethodToReplace];
	            }
	            if (clock.timersPromisesModuleMethods !== undefined) {
	                if (nameOfMethodToReplace === "setTimeout") {
	                    clock.timersPromisesModuleMethods.push({
	                        methodName: "setTimeout",
	                        original: timersPromisesModule.setTimeout,
	                    });

	                    timersPromisesModule.setTimeout = (
	                        delay,
	                        value,
	                        options = {},
	                    ) =>
	                        new Promise((resolve, reject) => {
	                            const abort = () => {
	                                options.signal.removeEventListener(
	                                    "abort",
	                                    abort,
	                                );
	                                clock.abortListenerMap.delete(abort);

	                                // This is safe, there is no code path that leads to this function
	                                // being invoked before handle has been assigned.
	                                // eslint-disable-next-line no-use-before-define
	                                clock.clearTimeout(handle);
	                                reject(options.signal.reason);
	                            };

	                            const handle = clock.setTimeout(() => {
	                                if (options.signal) {
	                                    options.signal.removeEventListener(
	                                        "abort",
	                                        abort,
	                                    );
	                                    clock.abortListenerMap.delete(abort);
	                                }

	                                resolve(value);
	                            }, delay);

	                            if (options.signal) {
	                                if (options.signal.aborted) {
	                                    abort();
	                                } else {
	                                    options.signal.addEventListener(
	                                        "abort",
	                                        abort,
	                                    );
	                                    clock.abortListenerMap.set(
	                                        abort,
	                                        options.signal,
	                                    );
	                                }
	                            }
	                        });
	                } else if (nameOfMethodToReplace === "setImmediate") {
	                    clock.timersPromisesModuleMethods.push({
	                        methodName: "setImmediate",
	                        original: timersPromisesModule.setImmediate,
	                    });

	                    timersPromisesModule.setImmediate = (value, options = {}) =>
	                        new Promise((resolve, reject) => {
	                            const abort = () => {
	                                options.signal.removeEventListener(
	                                    "abort",
	                                    abort,
	                                );
	                                clock.abortListenerMap.delete(abort);

	                                // This is safe, there is no code path that leads to this function
	                                // being invoked before handle has been assigned.
	                                // eslint-disable-next-line no-use-before-define
	                                clock.clearImmediate(handle);
	                                reject(options.signal.reason);
	                            };

	                            const handle = clock.setImmediate(() => {
	                                if (options.signal) {
	                                    options.signal.removeEventListener(
	                                        "abort",
	                                        abort,
	                                    );
	                                    clock.abortListenerMap.delete(abort);
	                                }

	                                resolve(value);
	                            });

	                            if (options.signal) {
	                                if (options.signal.aborted) {
	                                    abort();
	                                } else {
	                                    options.signal.addEventListener(
	                                        "abort",
	                                        abort,
	                                    );
	                                    clock.abortListenerMap.set(
	                                        abort,
	                                        options.signal,
	                                    );
	                                }
	                            }
	                        });
	                } else if (nameOfMethodToReplace === "setInterval") {
	                    clock.timersPromisesModuleMethods.push({
	                        methodName: "setInterval",
	                        original: timersPromisesModule.setInterval,
	                    });

	                    timersPromisesModule.setInterval = (
	                        delay,
	                        value,
	                        options = {},
	                    ) => ({
	                        [Symbol.asyncIterator]: () => {
	                            const createResolvable = () => {
	                                let resolve, reject;
	                                const promise = new Promise((res, rej) => {
	                                    resolve = res;
	                                    reject = rej;
	                                });
	                                promise.resolve = resolve;
	                                promise.reject = reject;
	                                return promise;
	                            };

	                            let done = false;
	                            let hasThrown = false;
	                            let returnCall;
	                            let nextAvailable = 0;
	                            const nextQueue = [];

	                            const handle = clock.setInterval(() => {
	                                if (nextQueue.length > 0) {
	                                    nextQueue.shift().resolve();
	                                } else {
	                                    nextAvailable++;
	                                }
	                            }, delay);

	                            const abort = () => {
	                                options.signal.removeEventListener(
	                                    "abort",
	                                    abort,
	                                );
	                                clock.abortListenerMap.delete(abort);

	                                clock.clearInterval(handle);
	                                done = true;
	                                for (const resolvable of nextQueue) {
	                                    resolvable.resolve();
	                                }
	                            };

	                            if (options.signal) {
	                                if (options.signal.aborted) {
	                                    done = true;
	                                } else {
	                                    options.signal.addEventListener(
	                                        "abort",
	                                        abort,
	                                    );
	                                    clock.abortListenerMap.set(
	                                        abort,
	                                        options.signal,
	                                    );
	                                }
	                            }

	                            return {
	                                next: async () => {
	                                    if (options.signal?.aborted && !hasThrown) {
	                                        hasThrown = true;
	                                        throw options.signal.reason;
	                                    }

	                                    if (done) {
	                                        return { done: true, value: undefined };
	                                    }

	                                    if (nextAvailable > 0) {
	                                        nextAvailable--;
	                                        return { done: false, value: value };
	                                    }

	                                    const resolvable = createResolvable();
	                                    nextQueue.push(resolvable);

	                                    await resolvable;

	                                    if (returnCall && nextQueue.length === 0) {
	                                        returnCall.resolve();
	                                    }

	                                    if (options.signal?.aborted && !hasThrown) {
	                                        hasThrown = true;
	                                        throw options.signal.reason;
	                                    }

	                                    if (done) {
	                                        return { done: true, value: undefined };
	                                    }

	                                    return { done: false, value: value };
	                                },
	                                return: async () => {
	                                    if (done) {
	                                        return { done: true, value: undefined };
	                                    }

	                                    if (nextQueue.length > 0) {
	                                        returnCall = createResolvable();
	                                        await returnCall;
	                                    }

	                                    clock.clearInterval(handle);
	                                    done = true;

	                                    if (options.signal) {
	                                        options.signal.removeEventListener(
	                                            "abort",
	                                            abort,
	                                        );
	                                        clock.abortListenerMap.delete(abort);
	                                    }

	                                    return { done: true, value: undefined };
	                                },
	                            };
	                        },
	                    });
	                }
	            }
	        }

	        return clock;
	    }

	    /* eslint-enable complexity */

	    return {
	        timers: timers,
	        createClock: createClock,
	        install: install,
	        withGlobal: withGlobal,
	    };
	}

	/**
	 * @typedef {object} FakeTimers
	 * @property {Timers} timers
	 * @property {createClock} createClock
	 * @property {Function} install
	 * @property {withGlobal} withGlobal
	 */

	/* eslint-enable complexity */

	/** @type {FakeTimers} */
	const defaultImplementation = withGlobal(globalObject);

	fakeTimersSrc.timers = defaultImplementation.timers;
	fakeTimersSrc.createClock = defaultImplementation.createClock;
	fakeTimersSrc.install = defaultImplementation.install;
	fakeTimersSrc.withGlobal = withGlobal;
	return fakeTimersSrc;
}

var fakeTimersSrcExports = requireFakeTimersSrc();

class FakeTimers {
	_global;
	_clock;
	// | _fakingTime | _fakingDate |
	// +-------------+-------------+
	// | false       | falsy       | initial
	// | false       | truthy      | vi.setSystemTime called first (for mocking only Date without fake timers)
	// | true        | falsy       | vi.useFakeTimers called first
	// | true        | truthy      | unreachable
	_fakingTime;
	_fakingDate;
	_fakeTimers;
	_userConfig;
	_now = RealDate.now;
	constructor({ global, config }) {
		this._userConfig = config;
		this._fakingDate = null;
		this._fakingTime = false;
		this._fakeTimers = fakeTimersSrcExports.withGlobal(global);
		this._global = global;
	}
	clearAllTimers() {
		if (this._fakingTime) this._clock.reset();
	}
	dispose() {
		this.useRealTimers();
	}
	runAllTimers() {
		if (this._checkFakeTimers()) this._clock.runAll();
	}
	async runAllTimersAsync() {
		if (this._checkFakeTimers()) await this._clock.runAllAsync();
	}
	runOnlyPendingTimers() {
		if (this._checkFakeTimers()) this._clock.runToLast();
	}
	async runOnlyPendingTimersAsync() {
		if (this._checkFakeTimers()) await this._clock.runToLastAsync();
	}
	advanceTimersToNextTimer(steps = 1) {
		if (this._checkFakeTimers()) for (let i = steps; i > 0; i--) {
			this._clock.next();
			// Fire all timers at this point: https://github.com/sinonjs/fake-timers/issues/250
			this._clock.tick(0);
			if (this._clock.countTimers() === 0) break;
		}
	}
	async advanceTimersToNextTimerAsync(steps = 1) {
		if (this._checkFakeTimers()) for (let i = steps; i > 0; i--) {
			await this._clock.nextAsync();
			// Fire all timers at this point: https://github.com/sinonjs/fake-timers/issues/250
			this._clock.tick(0);
			if (this._clock.countTimers() === 0) break;
		}
	}
	advanceTimersByTime(msToRun) {
		if (this._checkFakeTimers()) this._clock.tick(msToRun);
	}
	async advanceTimersByTimeAsync(msToRun) {
		if (this._checkFakeTimers()) await this._clock.tickAsync(msToRun);
	}
	advanceTimersToNextFrame() {
		if (this._checkFakeTimers()) this._clock.runToFrame();
	}
	runAllTicks() {
		if (this._checkFakeTimers())
 // @ts-expect-error method not exposed
		this._clock.runMicrotasks();
	}
	useRealTimers() {
		if (this._fakingDate) {
			resetDate();
			this._fakingDate = null;
		}
		if (this._fakingTime) {
			this._clock.uninstall();
			this._fakingTime = false;
		}
	}
	useFakeTimers() {
		const fakeDate = this._fakingDate || Date.now();
		if (this._fakingDate) {
			resetDate();
			this._fakingDate = null;
		}
		if (this._fakingTime) this._clock.uninstall();
		const toFake = Object.keys(this._fakeTimers.timers).filter((timer) => timer !== "nextTick" && timer !== "queueMicrotask");
		if (this._userConfig?.toFake?.includes("nextTick") && isChildProcess()) throw new Error("process.nextTick cannot be mocked inside child_process");
		this._clock = this._fakeTimers.install({
			now: fakeDate,
			...this._userConfig,
			toFake: this._userConfig?.toFake || toFake,
			ignoreMissingTimers: true
		});
		this._fakingTime = true;
	}
	reset() {
		if (this._checkFakeTimers()) {
			const { now } = this._clock;
			this._clock.reset();
			this._clock.setSystemTime(now);
		}
	}
	setSystemTime(now) {
		const date = typeof now === "undefined" || now instanceof Date ? now : new Date(now);
		if (this._fakingTime) this._clock.setSystemTime(date);
		else {
			this._fakingDate = date ?? new Date(this.getRealSystemTime());
			mockDate(this._fakingDate);
		}
	}
	getMockedSystemTime() {
		return this._fakingTime ? new Date(this._clock.now) : this._fakingDate;
	}
	getRealSystemTime() {
		return this._now();
	}
	getTimerCount() {
		if (this._checkFakeTimers()) return this._clock.countTimers();
		return 0;
	}
	configure(config) {
		this._userConfig = config;
	}
	isFakeTimers() {
		return this._fakingTime;
	}
	_checkFakeTimers() {
		if (!this._fakingTime) throw new Error("A function to advance timers was called but the timers APIs are not mocked. Call `vi.useFakeTimers()` in the test file first.");
		return this._fakingTime;
	}
}

function copyStackTrace(target, source) {
	if (source.stack !== void 0) target.stack = source.stack.replace(source.message, target.message);
	return target;
}
function waitFor(callback, options = {}) {
	const { setTimeout, setInterval, clearTimeout, clearInterval } = getSafeTimers();
	const { interval = 50, timeout = 1e3 } = typeof options === "number" ? { timeout: options } : options;
	const STACK_TRACE_ERROR = /* @__PURE__ */ new Error("STACK_TRACE_ERROR");
	return new Promise((resolve, reject) => {
		let lastError;
		let promiseStatus = "idle";
		let timeoutId;
		let intervalId;
		const onResolve = (result) => {
			if (timeoutId) clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
			resolve(result);
		};
		const handleTimeout = () => {
			if (intervalId) clearInterval(intervalId);
			let error = lastError;
			if (!error) error = copyStackTrace(/* @__PURE__ */ new Error("Timed out in waitFor!"), STACK_TRACE_ERROR);
			reject(error);
		};
		const checkCallback = () => {
			if (vi.isFakeTimers()) vi.advanceTimersByTime(interval);
			if (promiseStatus === "pending") return;
			try {
				const result = callback();
				if (result !== null && typeof result === "object" && typeof result.then === "function") {
					const thenable = result;
					promiseStatus = "pending";
					thenable.then((resolvedValue) => {
						promiseStatus = "resolved";
						onResolve(resolvedValue);
					}, (rejectedValue) => {
						promiseStatus = "rejected";
						lastError = rejectedValue;
					});
				} else {
					onResolve(result);
					return true;
				}
			} catch (error) {
				lastError = error;
			}
		};
		if (checkCallback() === true) return;
		timeoutId = setTimeout(handleTimeout, timeout);
		intervalId = setInterval(checkCallback, interval);
	});
}
function waitUntil(callback, options = {}) {
	const { setTimeout, setInterval, clearTimeout, clearInterval } = getSafeTimers();
	const { interval = 50, timeout = 1e3 } = typeof options === "number" ? { timeout: options } : options;
	const STACK_TRACE_ERROR = /* @__PURE__ */ new Error("STACK_TRACE_ERROR");
	return new Promise((resolve, reject) => {
		let promiseStatus = "idle";
		let timeoutId;
		let intervalId;
		const onReject = (error) => {
			if (intervalId) clearInterval(intervalId);
			if (!error) error = copyStackTrace(/* @__PURE__ */ new Error("Timed out in waitUntil!"), STACK_TRACE_ERROR);
			reject(error);
		};
		const onResolve = (result) => {
			if (!result) return;
			if (timeoutId) clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
			resolve(result);
			return true;
		};
		const checkCallback = () => {
			if (vi.isFakeTimers()) vi.advanceTimersByTime(interval);
			if (promiseStatus === "pending") return;
			try {
				const result = callback();
				if (result !== null && typeof result === "object" && typeof result.then === "function") {
					const thenable = result;
					promiseStatus = "pending";
					thenable.then((resolvedValue) => {
						promiseStatus = "resolved";
						onResolve(resolvedValue);
					}, (rejectedValue) => {
						promiseStatus = "rejected";
						onReject(rejectedValue);
					});
				} else return onResolve(result);
			} catch (error) {
				onReject(error);
			}
		};
		if (checkCallback() === true) return;
		timeoutId = setTimeout(onReject, timeout);
		intervalId = setInterval(checkCallback, interval);
	});
}

function createVitest() {
	let _config = null;
	const state = () => getWorkerState();
	let _timers;
	const timers = () => _timers ||= new FakeTimers({
		global: globalThis,
		config: state().config.fakeTimers
	});
	const _stubsGlobal = /* @__PURE__ */ new Map();
	const _stubsEnv = /* @__PURE__ */ new Map();
	const _envBooleans = [
		"PROD",
		"DEV",
		"SSR"
	];
	const utils = {
		useFakeTimers(config) {
			if (isChildProcess()) {
				if (config?.toFake?.includes("nextTick") || state().config?.fakeTimers?.toFake?.includes("nextTick")) throw new Error("vi.useFakeTimers({ toFake: [\"nextTick\"] }) is not supported in node:child_process. Use --pool=threads if mocking nextTick is required.");
			}
			if (config) timers().configure({
				...state().config.fakeTimers,
				...config
			});
			else timers().configure(state().config.fakeTimers);
			timers().useFakeTimers();
			return utils;
		},
		isFakeTimers() {
			return timers().isFakeTimers();
		},
		useRealTimers() {
			timers().useRealTimers();
			return utils;
		},
		runOnlyPendingTimers() {
			timers().runOnlyPendingTimers();
			return utils;
		},
		async runOnlyPendingTimersAsync() {
			await timers().runOnlyPendingTimersAsync();
			return utils;
		},
		runAllTimers() {
			timers().runAllTimers();
			return utils;
		},
		async runAllTimersAsync() {
			await timers().runAllTimersAsync();
			return utils;
		},
		runAllTicks() {
			timers().runAllTicks();
			return utils;
		},
		advanceTimersByTime(ms) {
			timers().advanceTimersByTime(ms);
			return utils;
		},
		async advanceTimersByTimeAsync(ms) {
			await timers().advanceTimersByTimeAsync(ms);
			return utils;
		},
		advanceTimersToNextTimer() {
			timers().advanceTimersToNextTimer();
			return utils;
		},
		async advanceTimersToNextTimerAsync() {
			await timers().advanceTimersToNextTimerAsync();
			return utils;
		},
		advanceTimersToNextFrame() {
			timers().advanceTimersToNextFrame();
			return utils;
		},
		getTimerCount() {
			return timers().getTimerCount();
		},
		setSystemTime(time) {
			timers().setSystemTime(time);
			return utils;
		},
		getMockedSystemTime() {
			return timers().getMockedSystemTime();
		},
		getRealSystemTime() {
			return timers().getRealSystemTime();
		},
		clearAllTimers() {
			timers().clearAllTimers();
			return utils;
		},
		spyOn,
		fn,
		waitFor,
		waitUntil,
		hoisted(factory) {
			assertTypes(factory, "\"vi.hoisted\" factory", ["function"]);
			return factory();
		},
		mock(path, factory) {
			if (typeof path !== "string") throw new TypeError(`vi.mock() expects a string path, but received a ${typeof path}`);
			const importer = getImporter("mock");
			_mocker().queueMock(path, importer, typeof factory === "function" ? () => factory(() => _mocker().importActual(path, importer, _mocker().getMockContext().callstack)) : factory);
		},
		unmock(path) {
			if (typeof path !== "string") throw new TypeError(`vi.unmock() expects a string path, but received a ${typeof path}`);
			_mocker().queueUnmock(path, getImporter("unmock"));
		},
		doMock(path, factory) {
			if (typeof path !== "string") throw new TypeError(`vi.doMock() expects a string path, but received a ${typeof path}`);
			const importer = getImporter("doMock");
			_mocker().queueMock(path, importer, typeof factory === "function" ? () => factory(() => _mocker().importActual(path, importer, _mocker().getMockContext().callstack)) : factory);
		},
		doUnmock(path) {
			if (typeof path !== "string") throw new TypeError(`vi.doUnmock() expects a string path, but received a ${typeof path}`);
			const importer = getImporter("doUnmock");
			_mocker().queueUnmock(path, importer);
		},
		async importActual(path) {
			const importer = getImporter("importActual");
			return _mocker().importActual(path, importer, _mocker().getMockContext().callstack);
		},
		async importMock(path) {
			const importer = getImporter("importMock");
			return _mocker().importMock(path, importer);
		},
		mockObject(value, options) {
			return _mocker().mockObject({ value }, void 0, options?.spy ? "autospy" : "automock").value;
		},
		mocked(item, _options = {}) {
			return item;
		},
		isMockFunction(fn) {
			return isMockFunction(fn);
		},
		clearAllMocks() {
			clearAllMocks();
			return utils;
		},
		resetAllMocks() {
			resetAllMocks();
			return utils;
		},
		restoreAllMocks() {
			restoreAllMocks();
			return utils;
		},
		stubGlobal(name, value) {
			if (!_stubsGlobal.has(name)) _stubsGlobal.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
			Object.defineProperty(globalThis, name, {
				value,
				writable: true,
				configurable: true,
				enumerable: true
			});
			return utils;
		},
		stubEnv(name, value) {
			const env = state().metaEnv;
			if (!_stubsEnv.has(name)) _stubsEnv.set(name, env[name]);
			if (_envBooleans.includes(name)) env[name] = value ? "1" : "";
			else if (value === void 0) delete env[name];
			else env[name] = String(value);
			return utils;
		},
		unstubAllGlobals() {
			_stubsGlobal.forEach((original, name) => {
				if (!original) Reflect.deleteProperty(globalThis, name);
				else Object.defineProperty(globalThis, name, original);
			});
			_stubsGlobal.clear();
			return utils;
		},
		unstubAllEnvs() {
			const env = state().metaEnv;
			_stubsEnv.forEach((original, name) => {
				if (original === void 0) delete env[name];
				else env[name] = original;
			});
			_stubsEnv.clear();
			return utils;
		},
		resetModules() {
			resetModules(state().evaluatedModules);
			return utils;
		},
		async dynamicImportSettled() {
			return waitForImportsToResolve();
		},
		setConfig(config) {
			if (!_config) _config = { ...state().config };
			Object.assign(state().config, config);
		},
		resetConfig() {
			if (_config) Object.assign(state().config, _config);
		}
	};
	return utils;
}
const vitest = createVitest();
const vi = vitest;
function _mocker() {
	// @ts-expect-error injected by vite-nide
	return typeof __vitest_mocker__ !== "undefined" ? __vitest_mocker__ : new Proxy({}, { get(_, name) {
		throw new Error(`Vitest mocker was not initialized in this environment. vi.${String(name)}() is forbidden.`);
	} });
}
function getImporter(name) {
	const stackArray = createSimpleStackTrace({ stackTraceLimit: 5 }).split("\n");
	return parseSingleStack(stackArray[stackArray.findLastIndex((stack) => {
		return stack.includes(` at Object.${name}`) || stack.includes(`${name}@`) || stack.includes(` at ${name} (`);
	}) + 1])?.file || "";
}

export { beforeEach as b, describe as d, globalExpect as g, it as i, vi as v };
