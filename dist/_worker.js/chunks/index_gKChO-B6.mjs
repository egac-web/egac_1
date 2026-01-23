globalThis.process ??= {}; globalThis.process.env ??= {};
import { n as getAugmentedNamespace, o as getDefaultExportFromCjs } from './astro/server_D9mQmrFP.mjs';
import { r as requireLib } from './index_DvLXe0Jc.mjs';

var escapeStringRegexp;
var hasRequiredEscapeStringRegexp;

function requireEscapeStringRegexp () {
	if (hasRequiredEscapeStringRegexp) return escapeStringRegexp;
	hasRequiredEscapeStringRegexp = 1;

	escapeStringRegexp = string => {
		if (typeof string !== 'string') {
			throw new TypeError('Expected a string');
		}

		// Escape characters with special meaning either inside or outside character sets.
		// Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
		return string
			.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
			.replace(/-/g, '\\x2d');
	};
	return escapeStringRegexp;
}

var isPlainObject = {};

var hasRequiredIsPlainObject;

function requireIsPlainObject () {
	if (hasRequiredIsPlainObject) return isPlainObject;
	hasRequiredIsPlainObject = 1;

	Object.defineProperty(isPlainObject, '__esModule', { value: true });

	/*!
	 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */

	function isObject(o) {
	  return Object.prototype.toString.call(o) === '[object Object]';
	}

	function isPlainObject$1(o) {
	  var ctor,prot;

	  if (isObject(o) === false) return false;

	  // If has modified constructor
	  ctor = o.constructor;
	  if (ctor === undefined) return true;

	  // If has modified prototype
	  prot = ctor.prototype;
	  if (isObject(prot) === false) return false;

	  // If constructor does not have an Object-specific method
	  if (prot.hasOwnProperty('isPrototypeOf') === false) {
	    return false;
	  }

	  // Most likely a plain Object
	  return true;
	}

	isPlainObject.isPlainObject = isPlainObject$1;
	return isPlainObject;
}

var cjs;
var hasRequiredCjs;

function requireCjs () {
	if (hasRequiredCjs) return cjs;
	hasRequiredCjs = 1;

	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function getMergeFunction(key, options) {
		if (!options.customMerge) {
			return deepmerge
		}
		var customMerge = options.customMerge(key);
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function(symbol) {
				return Object.propertyIsEnumerable.call(target, symbol)
			})
			: []
	}

	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	}

	function propertyIsOnObject(object, property) {
		try {
			return property in object
		} catch(_) {
			return false
		}
	}

	// Protects from prototype poisoning and unexpected merging up the prototype chain.
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
			&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
				&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
	}

	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) {
			getKeys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			});
		}
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) {
				return
			}

			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
				destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			} else {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			}
		});
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
		// implementations can use it. The caller may not replace it.
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	};

	var deepmerge_1 = deepmerge;

	cjs = deepmerge_1;
	return cjs;
}

var parseSrcset$1 = {exports: {}};

/**
 * Srcset Parser
 *
 * By Alex Bell |  MIT License
 *
 * JS Parser for the string value that appears in markup <img srcset="here">
 *
 * @returns Array [{url: _, d: _, w: _, h:_}, ...]
 *
 * Based super duper closely on the reference algorithm at:
 * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
 *
 * Most comments are copied in directly from the spec
 * (except for comments in parens).
 */
var parseSrcset = parseSrcset$1.exports;

var hasRequiredParseSrcset;

function requireParseSrcset () {
	if (hasRequiredParseSrcset) return parseSrcset$1.exports;
	hasRequiredParseSrcset = 1;
	(function (module) {
		(function (root, factory) {
			if (module.exports) {
				// Node. Does not work with strict CommonJS, but
				// only CommonJS-like environments that support module.exports,
				// like Node.
				module.exports = factory();
			} else {
				// Browser globals (root is window)
				root.parseSrcset = factory();
			}
		}(parseSrcset, function () {

			// 1. Let input be the value passed to this algorithm.
			return function (input) {

				// UTILITY FUNCTIONS

				// Manual is faster than RegEx
				// http://bjorn.tipling.com/state-and-regular-expressions-in-javascript
				// http://jsperf.com/whitespace-character/5
				function isSpace(c) {
					return (c === "\u0020" || // space
					c === "\u0009" || // horizontal tab
					c === "\u000A" || // new line
					c === "\u000C" || // form feed
					c === "\u000D");  // carriage return
				}

				function collectCharacters(regEx) {
					var chars,
						match = regEx.exec(input.substring(pos));
					if (match) {
						chars = match[ 0 ];
						pos += chars.length;
						return chars;
					}
				}

				var inputLength = input.length,

					// (Don't use \s, to avoid matching non-breaking space)
					regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
					regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
					regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
					regexTrailingCommas = /[,]+$/,
					regexNonNegativeInteger = /^\d+$/,

					// ( Positive or negative or unsigned integers or decimals, without or without exponents.
					// Must include at least one digit.
					// According to spec tests any decimal point must be followed by a digit.
					// No leading plus sign is allowed.)
					// https://html.spec.whatwg.org/multipage/infrastructure.html#valid-floating-point-number
					regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,

					url,
					descriptors,
					currentDescriptor,
					state,
					c,

					// 2. Let position be a pointer into input, initially pointing at the start
					//    of the string.
					pos = 0,

					// 3. Let candidates be an initially empty source set.
					candidates = [];

				// 4. Splitting loop: Collect a sequence of characters that are space
				//    characters or U+002C COMMA characters. If any U+002C COMMA characters
				//    were collected, that is a parse error.
				while (true) {
					collectCharacters(regexLeadingCommasOrSpaces);

					// 5. If position is past the end of input, return candidates and abort these steps.
					if (pos >= inputLength) {
						return candidates; // (we're done, this is the sole return path)
					}

					// 6. Collect a sequence of characters that are not space characters,
					//    and let that be url.
					url = collectCharacters(regexLeadingNotSpaces);

					// 7. Let descriptors be a new empty list.
					descriptors = [];

					// 8. If url ends with a U+002C COMMA character (,), follow these substeps:
					//		(1). Remove all trailing U+002C COMMA characters from url. If this removed
					//         more than one character, that is a parse error.
					if (url.slice(-1) === ",") {
						url = url.replace(regexTrailingCommas, "");
						// (Jump ahead to step 9 to skip tokenization and just push the candidate).
						parseDescriptors();

						//	Otherwise, follow these substeps:
					} else {
						tokenize();
					} // (close else of step 8)

					// 16. Return to the step labeled splitting loop.
				} // (Close of big while loop.)

				/**
				 * Tokenizes descriptor properties prior to parsing
				 * Returns undefined.
				 */
				function tokenize() {

					// 8.1. Descriptor tokeniser: Skip whitespace
					collectCharacters(regexLeadingSpaces);

					// 8.2. Let current descriptor be the empty string.
					currentDescriptor = "";

					// 8.3. Let state be in descriptor.
					state = "in descriptor";

					while (true) {

						// 8.4. Let c be the character at position.
						c = input.charAt(pos);

						//  Do the following depending on the value of state.
						//  For the purpose of this step, "EOF" is a special character representing
						//  that position is past the end of input.

						// In descriptor
						if (state === "in descriptor") {
							// Do the following, depending on the value of c:

							// Space character
							// If current descriptor is not empty, append current descriptor to
							// descriptors and let current descriptor be the empty string.
							// Set state to after descriptor.
							if (isSpace(c)) {
								if (currentDescriptor) {
									descriptors.push(currentDescriptor);
									currentDescriptor = "";
									state = "after descriptor";
								}

								// U+002C COMMA (,)
								// Advance position to the next character in input. If current descriptor
								// is not empty, append current descriptor to descriptors. Jump to the step
								// labeled descriptor parser.
							} else if (c === ",") {
								pos += 1;
								if (currentDescriptor) {
									descriptors.push(currentDescriptor);
								}
								parseDescriptors();
								return;

								// U+0028 LEFT PARENTHESIS (()
								// Append c to current descriptor. Set state to in parens.
							} else if (c === "\u0028") {
								currentDescriptor = currentDescriptor + c;
								state = "in parens";

								// EOF
								// If current descriptor is not empty, append current descriptor to
								// descriptors. Jump to the step labeled descriptor parser.
							} else if (c === "") {
								if (currentDescriptor) {
									descriptors.push(currentDescriptor);
								}
								parseDescriptors();
								return;

								// Anything else
								// Append c to current descriptor.
							} else {
								currentDescriptor = currentDescriptor + c;
							}
							// (end "in descriptor"

							// In parens
						} else if (state === "in parens") {

							// U+0029 RIGHT PARENTHESIS ())
							// Append c to current descriptor. Set state to in descriptor.
							if (c === ")") {
								currentDescriptor = currentDescriptor + c;
								state = "in descriptor";

								// EOF
								// Append current descriptor to descriptors. Jump to the step labeled
								// descriptor parser.
							} else if (c === "") {
								descriptors.push(currentDescriptor);
								parseDescriptors();
								return;

								// Anything else
								// Append c to current descriptor.
							} else {
								currentDescriptor = currentDescriptor + c;
							}

							// After descriptor
						} else if (state === "after descriptor") {

							// Do the following, depending on the value of c:
							// Space character: Stay in this state.
							if (isSpace(c)) ; else if (c === "") {
								parseDescriptors();
								return;

								// Anything else
								// Set state to in descriptor. Set position to the previous character in input.
							} else {
								state = "in descriptor";
								pos -= 1;

							}
						}

						// Advance position to the next character in input.
						pos += 1;

						// Repeat this step.
					} // (close while true loop)
				}

				/**
				 * Adds descriptor properties to a candidate, pushes to the candidates array
				 * @return undefined
				 */
				// Declared outside of the while loop so that it's only created once.
				function parseDescriptors() {

					// 9. Descriptor parser: Let error be no.
					var pError = false,

						// 10. Let width be absent.
						// 11. Let density be absent.
						// 12. Let future-compat-h be absent. (We're implementing it now as h)
						w, d, h, i,
						candidate = {},
						desc, lastChar, value, intVal, floatVal;

					// 13. For each descriptor in descriptors, run the appropriate set of steps
					// from the following list:
					for (i = 0 ; i < descriptors.length; i++) {
						desc = descriptors[ i ];

						lastChar = desc[ desc.length - 1 ];
						value = desc.substring(0, desc.length - 1);
						intVal = parseInt(value, 10);
						floatVal = parseFloat(value);

						// If the descriptor consists of a valid non-negative integer followed by
						// a U+0077 LATIN SMALL LETTER W character
						if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {

							// If width and density are not both absent, then let error be yes.
							if (w || d) {pError = true;}

							// Apply the rules for parsing non-negative integers to the descriptor.
							// If the result is zero, let error be yes.
							// Otherwise, let width be the result.
							if (intVal === 0) {pError = true;} else {w = intVal;}

							// If the descriptor consists of a valid floating-point number followed by
							// a U+0078 LATIN SMALL LETTER X character
						} else if (regexFloatingPoint.test(value) && (lastChar === "x")) {

							// If width, density and future-compat-h are not all absent, then let error
							// be yes.
							if (w || d || h) {pError = true;}

							// Apply the rules for parsing floating-point number values to the descriptor.
							// If the result is less than zero, let error be yes. Otherwise, let density
							// be the result.
							if (floatVal < 0) {pError = true;} else {d = floatVal;}

							// If the descriptor consists of a valid non-negative integer followed by
							// a U+0068 LATIN SMALL LETTER H character
						} else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {

							// If height and density are not both absent, then let error be yes.
							if (h || d) {pError = true;}

							// Apply the rules for parsing non-negative integers to the descriptor.
							// If the result is zero, let error be yes. Otherwise, let future-compat-h
							// be the result.
							if (intVal === 0) {pError = true;} else {h = intVal;}

							// Anything else, Let error be yes.
						} else {pError = true;}
					} // (close step 13 for loop)

					// 15. If error is still no, then append a new image source to candidates whose
					// URL is url, associated with a width width if not absent and a pixel
					// density density if not absent. Otherwise, there is a parse error.
					if (!pError) {
						candidate.url = url;
						if (w) { candidate.w = w;}
						if (d) { candidate.d = d;}
						if (h) { candidate.h = h;}
						candidates.push(candidate);
					} else if (console && console.log) {
						console.log("Invalid srcset descriptor found in '" +
							input + "' at '" + desc + "'.");
					}
				} // (close parseDescriptors fn)

			}
		})); 
	} (parseSrcset$1));
	return parseSrcset$1.exports;
}

var picocolors_browser = {exports: {}};

var hasRequiredPicocolors_browser;

function requirePicocolors_browser () {
	if (hasRequiredPicocolors_browser) return picocolors_browser.exports;
	hasRequiredPicocolors_browser = 1;
	var x=String;
	var create=function() {return {isColorSupported:false,reset:x,bold:x,dim:x,italic:x,underline:x,inverse:x,hidden:x,strikethrough:x,black:x,red:x,green:x,yellow:x,blue:x,magenta:x,cyan:x,white:x,gray:x,bgBlack:x,bgRed:x,bgGreen:x,bgYellow:x,bgBlue:x,bgMagenta:x,bgCyan:x,bgWhite:x,blackBright:x,redBright:x,greenBright:x,yellowBright:x,blueBright:x,magentaBright:x,cyanBright:x,whiteBright:x,bgBlackBright:x,bgRedBright:x,bgGreenBright:x,bgYellowBright:x,bgBlueBright:x,bgMagentaBright:x,bgCyanBright:x,bgWhiteBright:x}};
	picocolors_browser.exports=create();
	picocolors_browser.exports.createColors = create;
	return picocolors_browser.exports;
}

const __viteBrowserExternal = {};

const __viteBrowserExternal$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: __viteBrowserExternal
}, Symbol.toStringTag, { value: 'Module' }));

const require$$2 = /*@__PURE__*/getAugmentedNamespace(__viteBrowserExternal$1);

var cssSyntaxError;
var hasRequiredCssSyntaxError;

function requireCssSyntaxError () {
	if (hasRequiredCssSyntaxError) return cssSyntaxError;
	hasRequiredCssSyntaxError = 1;

	let pico = /*@__PURE__*/ requirePicocolors_browser();

	let terminalHighlight = require$$2;

	class CssSyntaxError extends Error {
	  constructor(message, line, column, source, file, plugin) {
	    super(message);
	    this.name = 'CssSyntaxError';
	    this.reason = message;

	    if (file) {
	      this.file = file;
	    }
	    if (source) {
	      this.source = source;
	    }
	    if (plugin) {
	      this.plugin = plugin;
	    }
	    if (typeof line !== 'undefined' && typeof column !== 'undefined') {
	      if (typeof line === 'number') {
	        this.line = line;
	        this.column = column;
	      } else {
	        this.line = line.line;
	        this.column = line.column;
	        this.endLine = column.line;
	        this.endColumn = column.column;
	      }
	    }

	    this.setMessage();

	    if (Error.captureStackTrace) {
	      Error.captureStackTrace(this, CssSyntaxError);
	    }
	  }

	  setMessage() {
	    this.message = this.plugin ? this.plugin + ': ' : '';
	    this.message += this.file ? this.file : '<css input>';
	    if (typeof this.line !== 'undefined') {
	      this.message += ':' + this.line + ':' + this.column;
	    }
	    this.message += ': ' + this.reason;
	  }

	  showSourceCode(color) {
	    if (!this.source) return ''

	    let css = this.source;
	    if (color == null) color = pico.isColorSupported;

	    let aside = text => text;
	    let mark = text => text;
	    let highlight = text => text;
	    if (color) {
	      let { bold, gray, red } = pico.createColors(true);
	      mark = text => bold(red(text));
	      aside = text => gray(text);
	      if (terminalHighlight) {
	        highlight = text => terminalHighlight(text);
	      }
	    }

	    let lines = css.split(/\r?\n/);
	    let start = Math.max(this.line - 3, 0);
	    let end = Math.min(this.line + 2, lines.length);
	    let maxWidth = String(end).length;

	    return lines
	      .slice(start, end)
	      .map((line, index) => {
	        let number = start + 1 + index;
	        let gutter = ' ' + (' ' + number).slice(-maxWidth) + ' | ';
	        if (number === this.line) {
	          if (line.length > 160) {
	            let padding = 20;
	            let subLineStart = Math.max(0, this.column - padding);
	            let subLineEnd = Math.max(
	              this.column + padding,
	              this.endColumn + padding
	            );
	            let subLine = line.slice(subLineStart, subLineEnd);

	            let spacing =
	              aside(gutter.replace(/\d/g, ' ')) +
	              line
	                .slice(0, Math.min(this.column - 1, padding - 1))
	                .replace(/[^\t]/g, ' ');

	            return (
	              mark('>') +
	              aside(gutter) +
	              highlight(subLine) +
	              '\n ' +
	              spacing +
	              mark('^')
	            )
	          }

	          let spacing =
	            aside(gutter.replace(/\d/g, ' ')) +
	            line.slice(0, this.column - 1).replace(/[^\t]/g, ' ');

	          return (
	            mark('>') +
	            aside(gutter) +
	            highlight(line) +
	            '\n ' +
	            spacing +
	            mark('^')
	          )
	        }

	        return ' ' + aside(gutter) + highlight(line)
	      })
	      .join('\n')
	  }

	  toString() {
	    let code = this.showSourceCode();
	    if (code) {
	      code = '\n\n' + code + '\n';
	    }
	    return this.name + ': ' + this.message + code
	  }
	}

	cssSyntaxError = CssSyntaxError;
	CssSyntaxError.default = CssSyntaxError;
	return cssSyntaxError;
}

var stringifier;
var hasRequiredStringifier;

function requireStringifier () {
	if (hasRequiredStringifier) return stringifier;
	hasRequiredStringifier = 1;

	const DEFAULT_RAW = {
	  after: '\n',
	  beforeClose: '\n',
	  beforeComment: '\n',
	  beforeDecl: '\n',
	  beforeOpen: ' ',
	  beforeRule: '\n',
	  colon: ': ',
	  commentLeft: ' ',
	  commentRight: ' ',
	  emptyBody: '',
	  indent: '    ',
	  semicolon: false
	};

	function capitalize(str) {
	  return str[0].toUpperCase() + str.slice(1)
	}

	class Stringifier {
	  constructor(builder) {
	    this.builder = builder;
	  }

	  atrule(node, semicolon) {
	    let name = '@' + node.name;
	    let params = node.params ? this.rawValue(node, 'params') : '';

	    if (typeof node.raws.afterName !== 'undefined') {
	      name += node.raws.afterName;
	    } else if (params) {
	      name += ' ';
	    }

	    if (node.nodes) {
	      this.block(node, name + params);
	    } else {
	      let end = (node.raws.between || '') + (semicolon ? ';' : '');
	      this.builder(name + params + end, node);
	    }
	  }

	  beforeAfter(node, detect) {
	    let value;
	    if (node.type === 'decl') {
	      value = this.raw(node, null, 'beforeDecl');
	    } else if (node.type === 'comment') {
	      value = this.raw(node, null, 'beforeComment');
	    } else if (detect === 'before') {
	      value = this.raw(node, null, 'beforeRule');
	    } else {
	      value = this.raw(node, null, 'beforeClose');
	    }

	    let buf = node.parent;
	    let depth = 0;
	    while (buf && buf.type !== 'root') {
	      depth += 1;
	      buf = buf.parent;
	    }

	    if (value.includes('\n')) {
	      let indent = this.raw(node, null, 'indent');
	      if (indent.length) {
	        for (let step = 0; step < depth; step++) value += indent;
	      }
	    }

	    return value
	  }

	  block(node, start) {
	    let between = this.raw(node, 'between', 'beforeOpen');
	    this.builder(start + between + '{', node, 'start');

	    let after;
	    if (node.nodes && node.nodes.length) {
	      this.body(node);
	      after = this.raw(node, 'after');
	    } else {
	      after = this.raw(node, 'after', 'emptyBody');
	    }

	    if (after) this.builder(after);
	    this.builder('}', node, 'end');
	  }

	  body(node) {
	    let last = node.nodes.length - 1;
	    while (last > 0) {
	      if (node.nodes[last].type !== 'comment') break
	      last -= 1;
	    }

	    let semicolon = this.raw(node, 'semicolon');
	    for (let i = 0; i < node.nodes.length; i++) {
	      let child = node.nodes[i];
	      let before = this.raw(child, 'before');
	      if (before) this.builder(before);
	      this.stringify(child, last !== i || semicolon);
	    }
	  }

	  comment(node) {
	    let left = this.raw(node, 'left', 'commentLeft');
	    let right = this.raw(node, 'right', 'commentRight');
	    this.builder('/*' + left + node.text + right + '*/', node);
	  }

	  decl(node, semicolon) {
	    let between = this.raw(node, 'between', 'colon');
	    let string = node.prop + between + this.rawValue(node, 'value');

	    if (node.important) {
	      string += node.raws.important || ' !important';
	    }

	    if (semicolon) string += ';';
	    this.builder(string, node);
	  }

	  document(node) {
	    this.body(node);
	  }

	  raw(node, own, detect) {
	    let value;
	    if (!detect) detect = own;

	    // Already had
	    if (own) {
	      value = node.raws[own];
	      if (typeof value !== 'undefined') return value
	    }

	    let parent = node.parent;

	    if (detect === 'before') {
	      // Hack for first rule in CSS
	      if (!parent || (parent.type === 'root' && parent.first === node)) {
	        return ''
	      }

	      // `root` nodes in `document` should use only their own raws
	      if (parent && parent.type === 'document') {
	        return ''
	      }
	    }

	    // Floating child without parent
	    if (!parent) return DEFAULT_RAW[detect]

	    // Detect style by other nodes
	    let root = node.root();
	    if (!root.rawCache) root.rawCache = {};
	    if (typeof root.rawCache[detect] !== 'undefined') {
	      return root.rawCache[detect]
	    }

	    if (detect === 'before' || detect === 'after') {
	      return this.beforeAfter(node, detect)
	    } else {
	      let method = 'raw' + capitalize(detect);
	      if (this[method]) {
	        value = this[method](root, node);
	      } else {
	        root.walk(i => {
	          value = i.raws[own];
	          if (typeof value !== 'undefined') return false
	        });
	      }
	    }

	    if (typeof value === 'undefined') value = DEFAULT_RAW[detect];

	    root.rawCache[detect] = value;
	    return value
	  }

	  rawBeforeClose(root) {
	    let value;
	    root.walk(i => {
	      if (i.nodes && i.nodes.length > 0) {
	        if (typeof i.raws.after !== 'undefined') {
	          value = i.raws.after;
	          if (value.includes('\n')) {
	            value = value.replace(/[^\n]+$/, '');
	          }
	          return false
	        }
	      }
	    });
	    if (value) value = value.replace(/\S/g, '');
	    return value
	  }

	  rawBeforeComment(root, node) {
	    let value;
	    root.walkComments(i => {
	      if (typeof i.raws.before !== 'undefined') {
	        value = i.raws.before;
	        if (value.includes('\n')) {
	          value = value.replace(/[^\n]+$/, '');
	        }
	        return false
	      }
	    });
	    if (typeof value === 'undefined') {
	      value = this.raw(node, null, 'beforeDecl');
	    } else if (value) {
	      value = value.replace(/\S/g, '');
	    }
	    return value
	  }

	  rawBeforeDecl(root, node) {
	    let value;
	    root.walkDecls(i => {
	      if (typeof i.raws.before !== 'undefined') {
	        value = i.raws.before;
	        if (value.includes('\n')) {
	          value = value.replace(/[^\n]+$/, '');
	        }
	        return false
	      }
	    });
	    if (typeof value === 'undefined') {
	      value = this.raw(node, null, 'beforeRule');
	    } else if (value) {
	      value = value.replace(/\S/g, '');
	    }
	    return value
	  }

	  rawBeforeOpen(root) {
	    let value;
	    root.walk(i => {
	      if (i.type !== 'decl') {
	        value = i.raws.between;
	        if (typeof value !== 'undefined') return false
	      }
	    });
	    return value
	  }

	  rawBeforeRule(root) {
	    let value;
	    root.walk(i => {
	      if (i.nodes && (i.parent !== root || root.first !== i)) {
	        if (typeof i.raws.before !== 'undefined') {
	          value = i.raws.before;
	          if (value.includes('\n')) {
	            value = value.replace(/[^\n]+$/, '');
	          }
	          return false
	        }
	      }
	    });
	    if (value) value = value.replace(/\S/g, '');
	    return value
	  }

	  rawColon(root) {
	    let value;
	    root.walkDecls(i => {
	      if (typeof i.raws.between !== 'undefined') {
	        value = i.raws.between.replace(/[^\s:]/g, '');
	        return false
	      }
	    });
	    return value
	  }

	  rawEmptyBody(root) {
	    let value;
	    root.walk(i => {
	      if (i.nodes && i.nodes.length === 0) {
	        value = i.raws.after;
	        if (typeof value !== 'undefined') return false
	      }
	    });
	    return value
	  }

	  rawIndent(root) {
	    if (root.raws.indent) return root.raws.indent
	    let value;
	    root.walk(i => {
	      let p = i.parent;
	      if (p && p !== root && p.parent && p.parent === root) {
	        if (typeof i.raws.before !== 'undefined') {
	          let parts = i.raws.before.split('\n');
	          value = parts[parts.length - 1];
	          value = value.replace(/\S/g, '');
	          return false
	        }
	      }
	    });
	    return value
	  }

	  rawSemicolon(root) {
	    let value;
	    root.walk(i => {
	      if (i.nodes && i.nodes.length && i.last.type === 'decl') {
	        value = i.raws.semicolon;
	        if (typeof value !== 'undefined') return false
	      }
	    });
	    return value
	  }

	  rawValue(node, prop) {
	    let value = node[prop];
	    let raw = node.raws[prop];
	    if (raw && raw.value === value) {
	      return raw.raw
	    }

	    return value
	  }

	  root(node) {
	    this.body(node);
	    if (node.raws.after) this.builder(node.raws.after);
	  }

	  rule(node) {
	    this.block(node, this.rawValue(node, 'selector'));
	    if (node.raws.ownSemicolon) {
	      this.builder(node.raws.ownSemicolon, node, 'end');
	    }
	  }

	  stringify(node, semicolon) {
	    /* c8 ignore start */
	    if (!this[node.type]) {
	      throw new Error(
	        'Unknown AST node type ' +
	          node.type +
	          '. ' +
	          'Maybe you need to change PostCSS stringifier.'
	      )
	    }
	    /* c8 ignore stop */
	    this[node.type](node, semicolon);
	  }
	}

	stringifier = Stringifier;
	Stringifier.default = Stringifier;
	return stringifier;
}

var stringify_1;
var hasRequiredStringify;

function requireStringify () {
	if (hasRequiredStringify) return stringify_1;
	hasRequiredStringify = 1;

	let Stringifier = requireStringifier();

	function stringify(node, builder) {
	  let str = new Stringifier(builder);
	  str.stringify(node);
	}

	stringify_1 = stringify;
	stringify.default = stringify;
	return stringify_1;
}

var symbols = {};

var hasRequiredSymbols;

function requireSymbols () {
	if (hasRequiredSymbols) return symbols;
	hasRequiredSymbols = 1;

	symbols.isClean = Symbol('isClean');

	symbols.my = Symbol('my');
	return symbols;
}

var node;
var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return node;
	hasRequiredNode = 1;

	let CssSyntaxError = requireCssSyntaxError();
	let Stringifier = requireStringifier();
	let stringify = requireStringify();
	let { isClean, my } = requireSymbols();

	function cloneNode(obj, parent) {
	  let cloned = new obj.constructor();

	  for (let i in obj) {
	    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
	      /* c8 ignore next 2 */
	      continue
	    }
	    if (i === 'proxyCache') continue
	    let value = obj[i];
	    let type = typeof value;

	    if (i === 'parent' && type === 'object') {
	      if (parent) cloned[i] = parent;
	    } else if (i === 'source') {
	      cloned[i] = value;
	    } else if (Array.isArray(value)) {
	      cloned[i] = value.map(j => cloneNode(j, cloned));
	    } else {
	      if (type === 'object' && value !== null) value = cloneNode(value);
	      cloned[i] = value;
	    }
	  }

	  return cloned
	}

	function sourceOffset(inputCSS, position) {
	  // Not all custom syntaxes support `offset` in `source.start` and `source.end`
	  if (position && typeof position.offset !== 'undefined') {
	    return position.offset
	  }

	  let column = 1;
	  let line = 1;
	  let offset = 0;

	  for (let i = 0; i < inputCSS.length; i++) {
	    if (line === position.line && column === position.column) {
	      offset = i;
	      break
	    }

	    if (inputCSS[i] === '\n') {
	      column = 1;
	      line += 1;
	    } else {
	      column += 1;
	    }
	  }

	  return offset
	}

	class Node {
	  get proxyOf() {
	    return this
	  }

	  constructor(defaults = {}) {
	    this.raws = {};
	    this[isClean] = false;
	    this[my] = true;

	    for (let name in defaults) {
	      if (name === 'nodes') {
	        this.nodes = [];
	        for (let node of defaults[name]) {
	          if (typeof node.clone === 'function') {
	            this.append(node.clone());
	          } else {
	            this.append(node);
	          }
	        }
	      } else {
	        this[name] = defaults[name];
	      }
	    }
	  }

	  addToError(error) {
	    error.postcssNode = this;
	    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
	      let s = this.source;
	      error.stack = error.stack.replace(
	        /\n\s{4}at /,
	        `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
	      );
	    }
	    return error
	  }

	  after(add) {
	    this.parent.insertAfter(this, add);
	    return this
	  }

	  assign(overrides = {}) {
	    for (let name in overrides) {
	      this[name] = overrides[name];
	    }
	    return this
	  }

	  before(add) {
	    this.parent.insertBefore(this, add);
	    return this
	  }

	  cleanRaws(keepBetween) {
	    delete this.raws.before;
	    delete this.raws.after;
	    if (!keepBetween) delete this.raws.between;
	  }

	  clone(overrides = {}) {
	    let cloned = cloneNode(this);
	    for (let name in overrides) {
	      cloned[name] = overrides[name];
	    }
	    return cloned
	  }

	  cloneAfter(overrides = {}) {
	    let cloned = this.clone(overrides);
	    this.parent.insertAfter(this, cloned);
	    return cloned
	  }

	  cloneBefore(overrides = {}) {
	    let cloned = this.clone(overrides);
	    this.parent.insertBefore(this, cloned);
	    return cloned
	  }

	  error(message, opts = {}) {
	    if (this.source) {
	      let { end, start } = this.rangeBy(opts);
	      return this.source.input.error(
	        message,
	        { column: start.column, line: start.line },
	        { column: end.column, line: end.line },
	        opts
	      )
	    }
	    return new CssSyntaxError(message)
	  }

	  getProxyProcessor() {
	    return {
	      get(node, prop) {
	        if (prop === 'proxyOf') {
	          return node
	        } else if (prop === 'root') {
	          return () => node.root().toProxy()
	        } else {
	          return node[prop]
	        }
	      },

	      set(node, prop, value) {
	        if (node[prop] === value) return true
	        node[prop] = value;
	        if (
	          prop === 'prop' ||
	          prop === 'value' ||
	          prop === 'name' ||
	          prop === 'params' ||
	          prop === 'important' ||
	          /* c8 ignore next */
	          prop === 'text'
	        ) {
	          node.markDirty();
	        }
	        return true
	      }
	    }
	  }

	  /* c8 ignore next 3 */
	  markClean() {
	    this[isClean] = true;
	  }

	  markDirty() {
	    if (this[isClean]) {
	      this[isClean] = false;
	      let next = this;
	      while ((next = next.parent)) {
	        next[isClean] = false;
	      }
	    }
	  }

	  next() {
	    if (!this.parent) return undefined
	    let index = this.parent.index(this);
	    return this.parent.nodes[index + 1]
	  }

	  positionBy(opts = {}) {
	    let pos = this.source.start;
	    if (opts.index) {
	      pos = this.positionInside(opts.index);
	    } else if (opts.word) {
	      let inputString =
	        'document' in this.source.input
	          ? this.source.input.document
	          : this.source.input.css;
	      let stringRepresentation = inputString.slice(
	        sourceOffset(inputString, this.source.start),
	        sourceOffset(inputString, this.source.end)
	      );
	      let index = stringRepresentation.indexOf(opts.word);
	      if (index !== -1) pos = this.positionInside(index);
	    }
	    return pos
	  }

	  positionInside(index) {
	    let column = this.source.start.column;
	    let line = this.source.start.line;
	    let inputString =
	      'document' in this.source.input
	        ? this.source.input.document
	        : this.source.input.css;
	    let offset = sourceOffset(inputString, this.source.start);
	    let end = offset + index;

	    for (let i = offset; i < end; i++) {
	      if (inputString[i] === '\n') {
	        column = 1;
	        line += 1;
	      } else {
	        column += 1;
	      }
	    }

	    return { column, line, offset: end }
	  }

	  prev() {
	    if (!this.parent) return undefined
	    let index = this.parent.index(this);
	    return this.parent.nodes[index - 1]
	  }

	  rangeBy(opts = {}) {
	    let inputString =
	      'document' in this.source.input
	        ? this.source.input.document
	        : this.source.input.css;
	    let start = {
	      column: this.source.start.column,
	      line: this.source.start.line,
	      offset: sourceOffset(inputString, this.source.start)
	    };
	    let end = this.source.end
	      ? {
	          column: this.source.end.column + 1,
	          line: this.source.end.line,
	          offset:
	            typeof this.source.end.offset === 'number'
	              ? // `source.end.offset` is exclusive, so we don't need to add 1
	                this.source.end.offset
	              : // Since line/column in this.source.end is inclusive,
	                // the `sourceOffset(... , this.source.end)` returns an inclusive offset.
	                // So, we add 1 to convert it to exclusive.
	                sourceOffset(inputString, this.source.end) + 1
	        }
	      : {
	          column: start.column + 1,
	          line: start.line,
	          offset: start.offset + 1
	        };

	    if (opts.word) {
	      let stringRepresentation = inputString.slice(
	        sourceOffset(inputString, this.source.start),
	        sourceOffset(inputString, this.source.end)
	      );
	      let index = stringRepresentation.indexOf(opts.word);
	      if (index !== -1) {
	        start = this.positionInside(index);
	        end = this.positionInside(index + opts.word.length);
	      }
	    } else {
	      if (opts.start) {
	        start = {
	          column: opts.start.column,
	          line: opts.start.line,
	          offset: sourceOffset(inputString, opts.start)
	        };
	      } else if (opts.index) {
	        start = this.positionInside(opts.index);
	      }

	      if (opts.end) {
	        end = {
	          column: opts.end.column,
	          line: opts.end.line,
	          offset: sourceOffset(inputString, opts.end)
	        };
	      } else if (typeof opts.endIndex === 'number') {
	        end = this.positionInside(opts.endIndex);
	      } else if (opts.index) {
	        end = this.positionInside(opts.index + 1);
	      }
	    }

	    if (
	      end.line < start.line ||
	      (end.line === start.line && end.column <= start.column)
	    ) {
	      end = {
	        column: start.column + 1,
	        line: start.line,
	        offset: start.offset + 1
	      };
	    }

	    return { end, start }
	  }

	  raw(prop, defaultType) {
	    let str = new Stringifier();
	    return str.raw(this, prop, defaultType)
	  }

	  remove() {
	    if (this.parent) {
	      this.parent.removeChild(this);
	    }
	    this.parent = undefined;
	    return this
	  }

	  replaceWith(...nodes) {
	    if (this.parent) {
	      let bookmark = this;
	      let foundSelf = false;
	      for (let node of nodes) {
	        if (node === this) {
	          foundSelf = true;
	        } else if (foundSelf) {
	          this.parent.insertAfter(bookmark, node);
	          bookmark = node;
	        } else {
	          this.parent.insertBefore(bookmark, node);
	        }
	      }

	      if (!foundSelf) {
	        this.remove();
	      }
	    }

	    return this
	  }

	  root() {
	    let result = this;
	    while (result.parent && result.parent.type !== 'document') {
	      result = result.parent;
	    }
	    return result
	  }

	  toJSON(_, inputs) {
	    let fixed = {};
	    let emitInputs = inputs == null;
	    inputs = inputs || new Map();
	    let inputsNextIndex = 0;

	    for (let name in this) {
	      if (!Object.prototype.hasOwnProperty.call(this, name)) {
	        /* c8 ignore next 2 */
	        continue
	      }
	      if (name === 'parent' || name === 'proxyCache') continue
	      let value = this[name];

	      if (Array.isArray(value)) {
	        fixed[name] = value.map(i => {
	          if (typeof i === 'object' && i.toJSON) {
	            return i.toJSON(null, inputs)
	          } else {
	            return i
	          }
	        });
	      } else if (typeof value === 'object' && value.toJSON) {
	        fixed[name] = value.toJSON(null, inputs);
	      } else if (name === 'source') {
	        if (value == null) continue
	        let inputId = inputs.get(value.input);
	        if (inputId == null) {
	          inputId = inputsNextIndex;
	          inputs.set(value.input, inputsNextIndex);
	          inputsNextIndex++;
	        }
	        fixed[name] = {
	          end: value.end,
	          inputId,
	          start: value.start
	        };
	      } else {
	        fixed[name] = value;
	      }
	    }

	    if (emitInputs) {
	      fixed.inputs = [...inputs.keys()].map(input => input.toJSON());
	    }

	    return fixed
	  }

	  toProxy() {
	    if (!this.proxyCache) {
	      this.proxyCache = new Proxy(this, this.getProxyProcessor());
	    }
	    return this.proxyCache
	  }

	  toString(stringifier = stringify) {
	    if (stringifier.stringify) stringifier = stringifier.stringify;
	    let result = '';
	    stringifier(this, i => {
	      result += i;
	    });
	    return result
	  }

	  warn(result, text, opts = {}) {
	    let data = { node: this };
	    for (let i in opts) data[i] = opts[i];
	    return result.warn(text, data)
	  }
	}

	node = Node;
	Node.default = Node;
	return node;
}

var comment;
var hasRequiredComment;

function requireComment () {
	if (hasRequiredComment) return comment;
	hasRequiredComment = 1;

	let Node = requireNode();

	class Comment extends Node {
	  constructor(defaults) {
	    super(defaults);
	    this.type = 'comment';
	  }
	}

	comment = Comment;
	Comment.default = Comment;
	return comment;
}

var declaration;
var hasRequiredDeclaration;

function requireDeclaration () {
	if (hasRequiredDeclaration) return declaration;
	hasRequiredDeclaration = 1;

	let Node = requireNode();

	class Declaration extends Node {
	  get variable() {
	    return this.prop.startsWith('--') || this.prop[0] === '$'
	  }

	  constructor(defaults) {
	    if (
	      defaults &&
	      typeof defaults.value !== 'undefined' &&
	      typeof defaults.value !== 'string'
	    ) {
	      defaults = { ...defaults, value: String(defaults.value) };
	    }
	    super(defaults);
	    this.type = 'decl';
	  }
	}

	declaration = Declaration;
	Declaration.default = Declaration;
	return declaration;
}

var container;
var hasRequiredContainer;

function requireContainer () {
	if (hasRequiredContainer) return container;
	hasRequiredContainer = 1;

	let Comment = requireComment();
	let Declaration = requireDeclaration();
	let Node = requireNode();
	let { isClean, my } = requireSymbols();

	let AtRule, parse, Root, Rule;

	function cleanSource(nodes) {
	  return nodes.map(i => {
	    if (i.nodes) i.nodes = cleanSource(i.nodes);
	    delete i.source;
	    return i
	  })
	}

	function markTreeDirty(node) {
	  node[isClean] = false;
	  if (node.proxyOf.nodes) {
	    for (let i of node.proxyOf.nodes) {
	      markTreeDirty(i);
	    }
	  }
	}

	class Container extends Node {
	  get first() {
	    if (!this.proxyOf.nodes) return undefined
	    return this.proxyOf.nodes[0]
	  }

	  get last() {
	    if (!this.proxyOf.nodes) return undefined
	    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1]
	  }

	  append(...children) {
	    for (let child of children) {
	      let nodes = this.normalize(child, this.last);
	      for (let node of nodes) this.proxyOf.nodes.push(node);
	    }

	    this.markDirty();

	    return this
	  }

	  cleanRaws(keepBetween) {
	    super.cleanRaws(keepBetween);
	    if (this.nodes) {
	      for (let node of this.nodes) node.cleanRaws(keepBetween);
	    }
	  }

	  each(callback) {
	    if (!this.proxyOf.nodes) return undefined
	    let iterator = this.getIterator();

	    let index, result;
	    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
	      index = this.indexes[iterator];
	      result = callback(this.proxyOf.nodes[index], index);
	      if (result === false) break

	      this.indexes[iterator] += 1;
	    }

	    delete this.indexes[iterator];
	    return result
	  }

	  every(condition) {
	    return this.nodes.every(condition)
	  }

	  getIterator() {
	    if (!this.lastEach) this.lastEach = 0;
	    if (!this.indexes) this.indexes = {};

	    this.lastEach += 1;
	    let iterator = this.lastEach;
	    this.indexes[iterator] = 0;

	    return iterator
	  }

	  getProxyProcessor() {
	    return {
	      get(node, prop) {
	        if (prop === 'proxyOf') {
	          return node
	        } else if (!node[prop]) {
	          return node[prop]
	        } else if (
	          prop === 'each' ||
	          (typeof prop === 'string' && prop.startsWith('walk'))
	        ) {
	          return (...args) => {
	            return node[prop](
	              ...args.map(i => {
	                if (typeof i === 'function') {
	                  return (child, index) => i(child.toProxy(), index)
	                } else {
	                  return i
	                }
	              })
	            )
	          }
	        } else if (prop === 'every' || prop === 'some') {
	          return cb => {
	            return node[prop]((child, ...other) =>
	              cb(child.toProxy(), ...other)
	            )
	          }
	        } else if (prop === 'root') {
	          return () => node.root().toProxy()
	        } else if (prop === 'nodes') {
	          return node.nodes.map(i => i.toProxy())
	        } else if (prop === 'first' || prop === 'last') {
	          return node[prop].toProxy()
	        } else {
	          return node[prop]
	        }
	      },

	      set(node, prop, value) {
	        if (node[prop] === value) return true
	        node[prop] = value;
	        if (prop === 'name' || prop === 'params' || prop === 'selector') {
	          node.markDirty();
	        }
	        return true
	      }
	    }
	  }

	  index(child) {
	    if (typeof child === 'number') return child
	    if (child.proxyOf) child = child.proxyOf;
	    return this.proxyOf.nodes.indexOf(child)
	  }

	  insertAfter(exist, add) {
	    let existIndex = this.index(exist);
	    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
	    existIndex = this.index(exist);
	    for (let node of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node);

	    let index;
	    for (let id in this.indexes) {
	      index = this.indexes[id];
	      if (existIndex < index) {
	        this.indexes[id] = index + nodes.length;
	      }
	    }

	    this.markDirty();

	    return this
	  }

	  insertBefore(exist, add) {
	    let existIndex = this.index(exist);
	    let type = existIndex === 0 ? 'prepend' : false;
	    let nodes = this.normalize(
	      add,
	      this.proxyOf.nodes[existIndex],
	      type
	    ).reverse();
	    existIndex = this.index(exist);
	    for (let node of nodes) this.proxyOf.nodes.splice(existIndex, 0, node);

	    let index;
	    for (let id in this.indexes) {
	      index = this.indexes[id];
	      if (existIndex <= index) {
	        this.indexes[id] = index + nodes.length;
	      }
	    }

	    this.markDirty();

	    return this
	  }

	  normalize(nodes, sample) {
	    if (typeof nodes === 'string') {
	      nodes = cleanSource(parse(nodes).nodes);
	    } else if (typeof nodes === 'undefined') {
	      nodes = [];
	    } else if (Array.isArray(nodes)) {
	      nodes = nodes.slice(0);
	      for (let i of nodes) {
	        if (i.parent) i.parent.removeChild(i, 'ignore');
	      }
	    } else if (nodes.type === 'root' && this.type !== 'document') {
	      nodes = nodes.nodes.slice(0);
	      for (let i of nodes) {
	        if (i.parent) i.parent.removeChild(i, 'ignore');
	      }
	    } else if (nodes.type) {
	      nodes = [nodes];
	    } else if (nodes.prop) {
	      if (typeof nodes.value === 'undefined') {
	        throw new Error('Value field is missed in node creation')
	      } else if (typeof nodes.value !== 'string') {
	        nodes.value = String(nodes.value);
	      }
	      nodes = [new Declaration(nodes)];
	    } else if (nodes.selector || nodes.selectors) {
	      nodes = [new Rule(nodes)];
	    } else if (nodes.name) {
	      nodes = [new AtRule(nodes)];
	    } else if (nodes.text) {
	      nodes = [new Comment(nodes)];
	    } else {
	      throw new Error('Unknown node type in node creation')
	    }

	    let processed = nodes.map(i => {
	      /* c8 ignore next */
	      if (!i[my]) Container.rebuild(i);
	      i = i.proxyOf;
	      if (i.parent) i.parent.removeChild(i);
	      if (i[isClean]) markTreeDirty(i);

	      if (!i.raws) i.raws = {};
	      if (typeof i.raws.before === 'undefined') {
	        if (sample && typeof sample.raws.before !== 'undefined') {
	          i.raws.before = sample.raws.before.replace(/\S/g, '');
	        }
	      }
	      i.parent = this.proxyOf;
	      return i
	    });

	    return processed
	  }

	  prepend(...children) {
	    children = children.reverse();
	    for (let child of children) {
	      let nodes = this.normalize(child, this.first, 'prepend').reverse();
	      for (let node of nodes) this.proxyOf.nodes.unshift(node);
	      for (let id in this.indexes) {
	        this.indexes[id] = this.indexes[id] + nodes.length;
	      }
	    }

	    this.markDirty();

	    return this
	  }

	  push(child) {
	    child.parent = this;
	    this.proxyOf.nodes.push(child);
	    return this
	  }

	  removeAll() {
	    for (let node of this.proxyOf.nodes) node.parent = undefined;
	    this.proxyOf.nodes = [];

	    this.markDirty();

	    return this
	  }

	  removeChild(child) {
	    child = this.index(child);
	    this.proxyOf.nodes[child].parent = undefined;
	    this.proxyOf.nodes.splice(child, 1);

	    let index;
	    for (let id in this.indexes) {
	      index = this.indexes[id];
	      if (index >= child) {
	        this.indexes[id] = index - 1;
	      }
	    }

	    this.markDirty();

	    return this
	  }

	  replaceValues(pattern, opts, callback) {
	    if (!callback) {
	      callback = opts;
	      opts = {};
	    }

	    this.walkDecls(decl => {
	      if (opts.props && !opts.props.includes(decl.prop)) return
	      if (opts.fast && !decl.value.includes(opts.fast)) return

	      decl.value = decl.value.replace(pattern, callback);
	    });

	    this.markDirty();

	    return this
	  }

	  some(condition) {
	    return this.nodes.some(condition)
	  }

	  walk(callback) {
	    return this.each((child, i) => {
	      let result;
	      try {
	        result = callback(child, i);
	      } catch (e) {
	        throw child.addToError(e)
	      }
	      if (result !== false && child.walk) {
	        result = child.walk(callback);
	      }

	      return result
	    })
	  }

	  walkAtRules(name, callback) {
	    if (!callback) {
	      callback = name;
	      return this.walk((child, i) => {
	        if (child.type === 'atrule') {
	          return callback(child, i)
	        }
	      })
	    }
	    if (name instanceof RegExp) {
	      return this.walk((child, i) => {
	        if (child.type === 'atrule' && name.test(child.name)) {
	          return callback(child, i)
	        }
	      })
	    }
	    return this.walk((child, i) => {
	      if (child.type === 'atrule' && child.name === name) {
	        return callback(child, i)
	      }
	    })
	  }

	  walkComments(callback) {
	    return this.walk((child, i) => {
	      if (child.type === 'comment') {
	        return callback(child, i)
	      }
	    })
	  }

	  walkDecls(prop, callback) {
	    if (!callback) {
	      callback = prop;
	      return this.walk((child, i) => {
	        if (child.type === 'decl') {
	          return callback(child, i)
	        }
	      })
	    }
	    if (prop instanceof RegExp) {
	      return this.walk((child, i) => {
	        if (child.type === 'decl' && prop.test(child.prop)) {
	          return callback(child, i)
	        }
	      })
	    }
	    return this.walk((child, i) => {
	      if (child.type === 'decl' && child.prop === prop) {
	        return callback(child, i)
	      }
	    })
	  }

	  walkRules(selector, callback) {
	    if (!callback) {
	      callback = selector;

	      return this.walk((child, i) => {
	        if (child.type === 'rule') {
	          return callback(child, i)
	        }
	      })
	    }
	    if (selector instanceof RegExp) {
	      return this.walk((child, i) => {
	        if (child.type === 'rule' && selector.test(child.selector)) {
	          return callback(child, i)
	        }
	      })
	    }
	    return this.walk((child, i) => {
	      if (child.type === 'rule' && child.selector === selector) {
	        return callback(child, i)
	      }
	    })
	  }
	}

	Container.registerParse = dependant => {
	  parse = dependant;
	};

	Container.registerRule = dependant => {
	  Rule = dependant;
	};

	Container.registerAtRule = dependant => {
	  AtRule = dependant;
	};

	Container.registerRoot = dependant => {
	  Root = dependant;
	};

	container = Container;
	Container.default = Container;

	/* c8 ignore start */
	Container.rebuild = node => {
	  if (node.type === 'atrule') {
	    Object.setPrototypeOf(node, AtRule.prototype);
	  } else if (node.type === 'rule') {
	    Object.setPrototypeOf(node, Rule.prototype);
	  } else if (node.type === 'decl') {
	    Object.setPrototypeOf(node, Declaration.prototype);
	  } else if (node.type === 'comment') {
	    Object.setPrototypeOf(node, Comment.prototype);
	  } else if (node.type === 'root') {
	    Object.setPrototypeOf(node, Root.prototype);
	  }

	  node[my] = true;

	  if (node.nodes) {
	    node.nodes.forEach(child => {
	      Container.rebuild(child);
	    });
	  }
	};
	/* c8 ignore stop */
	return container;
}

var atRule;
var hasRequiredAtRule;

function requireAtRule () {
	if (hasRequiredAtRule) return atRule;
	hasRequiredAtRule = 1;

	let Container = requireContainer();

	class AtRule extends Container {
	  constructor(defaults) {
	    super(defaults);
	    this.type = 'atrule';
	  }

	  append(...children) {
	    if (!this.proxyOf.nodes) this.nodes = [];
	    return super.append(...children)
	  }

	  prepend(...children) {
	    if (!this.proxyOf.nodes) this.nodes = [];
	    return super.prepend(...children)
	  }
	}

	atRule = AtRule;
	AtRule.default = AtRule;

	Container.registerAtRule(AtRule);
	return atRule;
}

var document;
var hasRequiredDocument;

function requireDocument () {
	if (hasRequiredDocument) return document;
	hasRequiredDocument = 1;

	let Container = requireContainer();

	let LazyResult, Processor;

	class Document extends Container {
	  constructor(defaults) {
	    // type needs to be passed to super, otherwise child roots won't be normalized correctly
	    super({ type: 'document', ...defaults });

	    if (!this.nodes) {
	      this.nodes = [];
	    }
	  }

	  toResult(opts = {}) {
	    let lazy = new LazyResult(new Processor(), this, opts);

	    return lazy.stringify()
	  }
	}

	Document.registerLazyResult = dependant => {
	  LazyResult = dependant;
	};

	Document.registerProcessor = dependant => {
	  Processor = dependant;
	};

	document = Document;
	Document.default = Document;
	return document;
}

var nonSecure;
var hasRequiredNonSecure;

function requireNonSecure () {
	if (hasRequiredNonSecure) return nonSecure;
	hasRequiredNonSecure = 1;
	// This alphabet uses `A-Za-z0-9_-` symbols.
	// The order of characters is optimized for better gzip and brotli compression.
	// References to the same file (works both for gzip and brotli):
	// `'use`, `andom`, and `rict'`
	// References to the brotli default dictionary:
	// `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`
	let urlAlphabet =
	  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

	let customAlphabet = (alphabet, defaultSize = 21) => {
	  return (size = defaultSize) => {
	    let id = '';
	    // A compact alternative for `for (var i = 0; i < step; i++)`.
	    let i = size | 0;
	    while (i--) {
	      // `| 0` is more compact and faster than `Math.floor()`.
	      id += alphabet[(Math.random() * alphabet.length) | 0];
	    }
	    return id
	  }
	};

	let nanoid = (size = 21) => {
	  let id = '';
	  // A compact alternative for `for (var i = 0; i < step; i++)`.
	  let i = size | 0;
	  while (i--) {
	    // `| 0` is more compact and faster than `Math.floor()`.
	    id += urlAlphabet[(Math.random() * 64) | 0];
	  }
	  return id
	};

	nonSecure = { nanoid, customAlphabet };
	return nonSecure;
}

var previousMap;
var hasRequiredPreviousMap;

function requirePreviousMap () {
	if (hasRequiredPreviousMap) return previousMap;
	hasRequiredPreviousMap = 1;

	let { existsSync, readFileSync } = require$$2;
	let { dirname, join } = require$$2;
	let { SourceMapConsumer, SourceMapGenerator } = require$$2;

	function fromBase64(str) {
	  if (Buffer) {
	    return Buffer.from(str, 'base64').toString()
	  } else {
	    /* c8 ignore next 2 */
	    return window.atob(str)
	  }
	}

	class PreviousMap {
	  constructor(css, opts) {
	    if (opts.map === false) return
	    this.loadAnnotation(css);
	    this.inline = this.startWith(this.annotation, 'data:');

	    let prev = opts.map ? opts.map.prev : undefined;
	    let text = this.loadMap(opts.from, prev);
	    if (!this.mapFile && opts.from) {
	      this.mapFile = opts.from;
	    }
	    if (this.mapFile) this.root = dirname(this.mapFile);
	    if (text) this.text = text;
	  }

	  consumer() {
	    if (!this.consumerCache) {
	      this.consumerCache = new SourceMapConsumer(this.text);
	    }
	    return this.consumerCache
	  }

	  decodeInline(text) {
	    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
	    let baseUri = /^data:application\/json;base64,/;
	    let charsetUri = /^data:application\/json;charset=utf-?8,/;
	    let uri = /^data:application\/json,/;

	    let uriMatch = text.match(charsetUri) || text.match(uri);
	    if (uriMatch) {
	      return decodeURIComponent(text.substr(uriMatch[0].length))
	    }

	    let baseUriMatch = text.match(baseCharsetUri) || text.match(baseUri);
	    if (baseUriMatch) {
	      return fromBase64(text.substr(baseUriMatch[0].length))
	    }

	    let encoding = text.match(/data:application\/json;([^,]+),/)[1];
	    throw new Error('Unsupported source map encoding ' + encoding)
	  }

	  getAnnotationURL(sourceMapString) {
	    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, '').trim()
	  }

	  isMap(map) {
	    if (typeof map !== 'object') return false
	    return (
	      typeof map.mappings === 'string' ||
	      typeof map._mappings === 'string' ||
	      Array.isArray(map.sections)
	    )
	  }

	  loadAnnotation(css) {
	    let comments = css.match(/\/\*\s*# sourceMappingURL=/g);
	    if (!comments) return

	    // sourceMappingURLs from comments, strings, etc.
	    let start = css.lastIndexOf(comments.pop());
	    let end = css.indexOf('*/', start);

	    if (start > -1 && end > -1) {
	      // Locate the last sourceMappingURL to avoid pickin
	      this.annotation = this.getAnnotationURL(css.substring(start, end));
	    }
	  }

	  loadFile(path) {
	    this.root = dirname(path);
	    if (existsSync(path)) {
	      this.mapFile = path;
	      return readFileSync(path, 'utf-8').toString().trim()
	    }
	  }

	  loadMap(file, prev) {
	    if (prev === false) return false

	    if (prev) {
	      if (typeof prev === 'string') {
	        return prev
	      } else if (typeof prev === 'function') {
	        let prevPath = prev(file);
	        if (prevPath) {
	          let map = this.loadFile(prevPath);
	          if (!map) {
	            throw new Error(
	              'Unable to load previous source map: ' + prevPath.toString()
	            )
	          }
	          return map
	        }
	      } else if (prev instanceof SourceMapConsumer) {
	        return SourceMapGenerator.fromSourceMap(prev).toString()
	      } else if (prev instanceof SourceMapGenerator) {
	        return prev.toString()
	      } else if (this.isMap(prev)) {
	        return JSON.stringify(prev)
	      } else {
	        throw new Error(
	          'Unsupported previous source map format: ' + prev.toString()
	        )
	      }
	    } else if (this.inline) {
	      return this.decodeInline(this.annotation)
	    } else if (this.annotation) {
	      let map = this.annotation;
	      if (file) map = join(dirname(file), map);
	      return this.loadFile(map)
	    }
	  }

	  startWith(string, start) {
	    if (!string) return false
	    return string.substr(0, start.length) === start
	  }

	  withContent() {
	    return !!(
	      this.consumer().sourcesContent &&
	      this.consumer().sourcesContent.length > 0
	    )
	  }
	}

	previousMap = PreviousMap;
	PreviousMap.default = PreviousMap;
	return previousMap;
}

var input;
var hasRequiredInput;

function requireInput () {
	if (hasRequiredInput) return input;
	hasRequiredInput = 1;

	let { nanoid } = /*@__PURE__*/ requireNonSecure();
	let { isAbsolute, resolve } = require$$2;
	let { SourceMapConsumer, SourceMapGenerator } = require$$2;
	let { fileURLToPath, pathToFileURL } = require$$2;

	let CssSyntaxError = requireCssSyntaxError();
	let PreviousMap = requirePreviousMap();
	let terminalHighlight = require$$2;

	let lineToIndexCache = Symbol('lineToIndexCache');

	let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	let pathAvailable = Boolean(resolve && isAbsolute);

	function getLineToIndex(input) {
	  if (input[lineToIndexCache]) return input[lineToIndexCache]
	  let lines = input.css.split('\n');
	  let lineToIndex = new Array(lines.length);
	  let prevIndex = 0;

	  for (let i = 0, l = lines.length; i < l; i++) {
	    lineToIndex[i] = prevIndex;
	    prevIndex += lines[i].length + 1;
	  }

	  input[lineToIndexCache] = lineToIndex;
	  return lineToIndex
	}

	class Input {
	  get from() {
	    return this.file || this.id
	  }

	  constructor(css, opts = {}) {
	    if (
	      css === null ||
	      typeof css === 'undefined' ||
	      (typeof css === 'object' && !css.toString)
	    ) {
	      throw new Error(`PostCSS received ${css} instead of CSS string`)
	    }

	    this.css = css.toString();

	    if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
	      this.hasBOM = true;
	      this.css = this.css.slice(1);
	    } else {
	      this.hasBOM = false;
	    }

	    this.document = this.css;
	    if (opts.document) this.document = opts.document.toString();

	    if (opts.from) {
	      if (
	        !pathAvailable ||
	        /^\w+:\/\//.test(opts.from) ||
	        isAbsolute(opts.from)
	      ) {
	        this.file = opts.from;
	      } else {
	        this.file = resolve(opts.from);
	      }
	    }

	    if (pathAvailable && sourceMapAvailable) {
	      let map = new PreviousMap(this.css, opts);
	      if (map.text) {
	        this.map = map;
	        let file = map.consumer().file;
	        if (!this.file && file) this.file = this.mapResolve(file);
	      }
	    }

	    if (!this.file) {
	      this.id = '<input css ' + nanoid(6) + '>';
	    }
	    if (this.map) this.map.file = this.from;
	  }

	  error(message, line, column, opts = {}) {
	    let endColumn, endLine, endOffset, offset, result;

	    if (line && typeof line === 'object') {
	      let start = line;
	      let end = column;
	      if (typeof start.offset === 'number') {
	        offset = start.offset;
	        let pos = this.fromOffset(offset);
	        line = pos.line;
	        column = pos.col;
	      } else {
	        line = start.line;
	        column = start.column;
	        offset = this.fromLineAndColumn(line, column);
	      }
	      if (typeof end.offset === 'number') {
	        endOffset = end.offset;
	        let pos = this.fromOffset(endOffset);
	        endLine = pos.line;
	        endColumn = pos.col;
	      } else {
	        endLine = end.line;
	        endColumn = end.column;
	        endOffset = this.fromLineAndColumn(end.line, end.column);
	      }
	    } else if (!column) {
	      offset = line;
	      let pos = this.fromOffset(offset);
	      line = pos.line;
	      column = pos.col;
	    } else {
	      offset = this.fromLineAndColumn(line, column);
	    }

	    let origin = this.origin(line, column, endLine, endColumn);
	    if (origin) {
	      result = new CssSyntaxError(
	        message,
	        origin.endLine === undefined
	          ? origin.line
	          : { column: origin.column, line: origin.line },
	        origin.endLine === undefined
	          ? origin.column
	          : { column: origin.endColumn, line: origin.endLine },
	        origin.source,
	        origin.file,
	        opts.plugin
	      );
	    } else {
	      result = new CssSyntaxError(
	        message,
	        endLine === undefined ? line : { column, line },
	        endLine === undefined ? column : { column: endColumn, line: endLine },
	        this.css,
	        this.file,
	        opts.plugin
	      );
	    }

	    result.input = { column, endColumn, endLine, endOffset, line, offset, source: this.css };
	    if (this.file) {
	      if (pathToFileURL) {
	        result.input.url = pathToFileURL(this.file).toString();
	      }
	      result.input.file = this.file;
	    }

	    return result
	  }

	  fromLineAndColumn(line, column) {
	    let lineToIndex = getLineToIndex(this);
	    let index = lineToIndex[line - 1];
	    return index + column - 1
	  }

	  fromOffset(offset) {
	    let lineToIndex = getLineToIndex(this);
	    let lastLine = lineToIndex[lineToIndex.length - 1];

	    let min = 0;
	    if (offset >= lastLine) {
	      min = lineToIndex.length - 1;
	    } else {
	      let max = lineToIndex.length - 2;
	      let mid;
	      while (min < max) {
	        mid = min + ((max - min) >> 1);
	        if (offset < lineToIndex[mid]) {
	          max = mid - 1;
	        } else if (offset >= lineToIndex[mid + 1]) {
	          min = mid + 1;
	        } else {
	          min = mid;
	          break
	        }
	      }
	    }
	    return {
	      col: offset - lineToIndex[min] + 1,
	      line: min + 1
	    }
	  }

	  mapResolve(file) {
	    if (/^\w+:\/\//.test(file)) {
	      return file
	    }
	    return resolve(this.map.consumer().sourceRoot || this.map.root || '.', file)
	  }

	  origin(line, column, endLine, endColumn) {
	    if (!this.map) return false
	    let consumer = this.map.consumer();

	    let from = consumer.originalPositionFor({ column, line });
	    if (!from.source) return false

	    let to;
	    if (typeof endLine === 'number') {
	      to = consumer.originalPositionFor({ column: endColumn, line: endLine });
	    }

	    let fromUrl;

	    if (isAbsolute(from.source)) {
	      fromUrl = pathToFileURL(from.source);
	    } else {
	      fromUrl = new URL(
	        from.source,
	        this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
	      );
	    }

	    let result = {
	      column: from.column,
	      endColumn: to && to.column,
	      endLine: to && to.line,
	      line: from.line,
	      url: fromUrl.toString()
	    };

	    if (fromUrl.protocol === 'file:') {
	      if (fileURLToPath) {
	        result.file = fileURLToPath(fromUrl);
	      } else {
	        /* c8 ignore next 2 */
	        throw new Error(`file: protocol is not available in this PostCSS build`)
	      }
	    }

	    let source = consumer.sourceContentFor(from.source);
	    if (source) result.source = source;

	    return result
	  }

	  toJSON() {
	    let json = {};
	    for (let name of ['hasBOM', 'css', 'file', 'id']) {
	      if (this[name] != null) {
	        json[name] = this[name];
	      }
	    }
	    if (this.map) {
	      json.map = { ...this.map };
	      if (json.map.consumerCache) {
	        json.map.consumerCache = undefined;
	      }
	    }
	    return json
	  }
	}

	input = Input;
	Input.default = Input;

	if (terminalHighlight && terminalHighlight.registerInput) {
	  terminalHighlight.registerInput(Input);
	}
	return input;
}

var root;
var hasRequiredRoot;

function requireRoot () {
	if (hasRequiredRoot) return root;
	hasRequiredRoot = 1;

	let Container = requireContainer();

	let LazyResult, Processor;

	class Root extends Container {
	  constructor(defaults) {
	    super(defaults);
	    this.type = 'root';
	    if (!this.nodes) this.nodes = [];
	  }

	  normalize(child, sample, type) {
	    let nodes = super.normalize(child);

	    if (sample) {
	      if (type === 'prepend') {
	        if (this.nodes.length > 1) {
	          sample.raws.before = this.nodes[1].raws.before;
	        } else {
	          delete sample.raws.before;
	        }
	      } else if (this.first !== sample) {
	        for (let node of nodes) {
	          node.raws.before = sample.raws.before;
	        }
	      }
	    }

	    return nodes
	  }

	  removeChild(child, ignore) {
	    let index = this.index(child);

	    if (!ignore && index === 0 && this.nodes.length > 1) {
	      this.nodes[1].raws.before = this.nodes[index].raws.before;
	    }

	    return super.removeChild(child)
	  }

	  toResult(opts = {}) {
	    let lazy = new LazyResult(new Processor(), this, opts);
	    return lazy.stringify()
	  }
	}

	Root.registerLazyResult = dependant => {
	  LazyResult = dependant;
	};

	Root.registerProcessor = dependant => {
	  Processor = dependant;
	};

	root = Root;
	Root.default = Root;

	Container.registerRoot(Root);
	return root;
}

var list_1;
var hasRequiredList;

function requireList () {
	if (hasRequiredList) return list_1;
	hasRequiredList = 1;

	let list = {
	  comma(string) {
	    return list.split(string, [','], true)
	  },

	  space(string) {
	    let spaces = [' ', '\n', '\t'];
	    return list.split(string, spaces)
	  },

	  split(string, separators, last) {
	    let array = [];
	    let current = '';
	    let split = false;

	    let func = 0;
	    let inQuote = false;
	    let prevQuote = '';
	    let escape = false;

	    for (let letter of string) {
	      if (escape) {
	        escape = false;
	      } else if (letter === '\\') {
	        escape = true;
	      } else if (inQuote) {
	        if (letter === prevQuote) {
	          inQuote = false;
	        }
	      } else if (letter === '"' || letter === "'") {
	        inQuote = true;
	        prevQuote = letter;
	      } else if (letter === '(') {
	        func += 1;
	      } else if (letter === ')') {
	        if (func > 0) func -= 1;
	      } else if (func === 0) {
	        if (separators.includes(letter)) split = true;
	      }

	      if (split) {
	        if (current !== '') array.push(current.trim());
	        current = '';
	        split = false;
	      } else {
	        current += letter;
	      }
	    }

	    if (last || current !== '') array.push(current.trim());
	    return array
	  }
	};

	list_1 = list;
	list.default = list;
	return list_1;
}

var rule;
var hasRequiredRule;

function requireRule () {
	if (hasRequiredRule) return rule;
	hasRequiredRule = 1;

	let Container = requireContainer();
	let list = requireList();

	class Rule extends Container {
	  get selectors() {
	    return list.comma(this.selector)
	  }

	  set selectors(values) {
	    let match = this.selector ? this.selector.match(/,\s*/) : null;
	    let sep = match ? match[0] : ',' + this.raw('between', 'beforeOpen');
	    this.selector = values.join(sep);
	  }

	  constructor(defaults) {
	    super(defaults);
	    this.type = 'rule';
	    if (!this.nodes) this.nodes = [];
	  }
	}

	rule = Rule;
	Rule.default = Rule;

	Container.registerRule(Rule);
	return rule;
}

var fromJSON_1;
var hasRequiredFromJSON;

function requireFromJSON () {
	if (hasRequiredFromJSON) return fromJSON_1;
	hasRequiredFromJSON = 1;

	let AtRule = requireAtRule();
	let Comment = requireComment();
	let Declaration = requireDeclaration();
	let Input = requireInput();
	let PreviousMap = requirePreviousMap();
	let Root = requireRoot();
	let Rule = requireRule();

	function fromJSON(json, inputs) {
	  if (Array.isArray(json)) return json.map(n => fromJSON(n))

	  let { inputs: ownInputs, ...defaults } = json;
	  if (ownInputs) {
	    inputs = [];
	    for (let input of ownInputs) {
	      let inputHydrated = { ...input, __proto__: Input.prototype };
	      if (inputHydrated.map) {
	        inputHydrated.map = {
	          ...inputHydrated.map,
	          __proto__: PreviousMap.prototype
	        };
	      }
	      inputs.push(inputHydrated);
	    }
	  }
	  if (defaults.nodes) {
	    defaults.nodes = json.nodes.map(n => fromJSON(n, inputs));
	  }
	  if (defaults.source) {
	    let { inputId, ...source } = defaults.source;
	    defaults.source = source;
	    if (inputId != null) {
	      defaults.source.input = inputs[inputId];
	    }
	  }
	  if (defaults.type === 'root') {
	    return new Root(defaults)
	  } else if (defaults.type === 'decl') {
	    return new Declaration(defaults)
	  } else if (defaults.type === 'rule') {
	    return new Rule(defaults)
	  } else if (defaults.type === 'comment') {
	    return new Comment(defaults)
	  } else if (defaults.type === 'atrule') {
	    return new AtRule(defaults)
	  } else {
	    throw new Error('Unknown node type: ' + json.type)
	  }
	}

	fromJSON_1 = fromJSON;
	fromJSON.default = fromJSON;
	return fromJSON_1;
}

var mapGenerator;
var hasRequiredMapGenerator;

function requireMapGenerator () {
	if (hasRequiredMapGenerator) return mapGenerator;
	hasRequiredMapGenerator = 1;

	let { dirname, relative, resolve, sep } = require$$2;
	let { SourceMapConsumer, SourceMapGenerator } = require$$2;
	let { pathToFileURL } = require$$2;

	let Input = requireInput();

	let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	let pathAvailable = Boolean(dirname && resolve && relative && sep);

	class MapGenerator {
	  constructor(stringify, root, opts, cssString) {
	    this.stringify = stringify;
	    this.mapOpts = opts.map || {};
	    this.root = root;
	    this.opts = opts;
	    this.css = cssString;
	    this.originalCSS = cssString;
	    this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;

	    this.memoizedFileURLs = new Map();
	    this.memoizedPaths = new Map();
	    this.memoizedURLs = new Map();
	  }

	  addAnnotation() {
	    let content;

	    if (this.isInline()) {
	      content =
	        'data:application/json;base64,' + this.toBase64(this.map.toString());
	    } else if (typeof this.mapOpts.annotation === 'string') {
	      content = this.mapOpts.annotation;
	    } else if (typeof this.mapOpts.annotation === 'function') {
	      content = this.mapOpts.annotation(this.opts.to, this.root);
	    } else {
	      content = this.outputFile() + '.map';
	    }
	    let eol = '\n';
	    if (this.css.includes('\r\n')) eol = '\r\n';

	    this.css += eol + '/*# sourceMappingURL=' + content + ' */';
	  }

	  applyPrevMaps() {
	    for (let prev of this.previous()) {
	      let from = this.toUrl(this.path(prev.file));
	      let root = prev.root || dirname(prev.file);
	      let map;

	      if (this.mapOpts.sourcesContent === false) {
	        map = new SourceMapConsumer(prev.text);
	        if (map.sourcesContent) {
	          map.sourcesContent = null;
	        }
	      } else {
	        map = prev.consumer();
	      }

	      this.map.applySourceMap(map, from, this.toUrl(this.path(root)));
	    }
	  }

	  clearAnnotation() {
	    if (this.mapOpts.annotation === false) return

	    if (this.root) {
	      let node;
	      for (let i = this.root.nodes.length - 1; i >= 0; i--) {
	        node = this.root.nodes[i];
	        if (node.type !== 'comment') continue
	        if (node.text.startsWith('# sourceMappingURL=')) {
	          this.root.removeChild(i);
	        }
	      }
	    } else if (this.css) {
	      this.css = this.css.replace(/\n*\/\*#[\S\s]*?\*\/$/gm, '');
	    }
	  }

	  generate() {
	    this.clearAnnotation();
	    if (pathAvailable && sourceMapAvailable && this.isMap()) {
	      return this.generateMap()
	    } else {
	      let result = '';
	      this.stringify(this.root, i => {
	        result += i;
	      });
	      return [result]
	    }
	  }

	  generateMap() {
	    if (this.root) {
	      this.generateString();
	    } else if (this.previous().length === 1) {
	      let prev = this.previous()[0].consumer();
	      prev.file = this.outputFile();
	      this.map = SourceMapGenerator.fromSourceMap(prev, {
	        ignoreInvalidMapping: true
	      });
	    } else {
	      this.map = new SourceMapGenerator({
	        file: this.outputFile(),
	        ignoreInvalidMapping: true
	      });
	      this.map.addMapping({
	        generated: { column: 0, line: 1 },
	        original: { column: 0, line: 1 },
	        source: this.opts.from
	          ? this.toUrl(this.path(this.opts.from))
	          : '<no source>'
	      });
	    }

	    if (this.isSourcesContent()) this.setSourcesContent();
	    if (this.root && this.previous().length > 0) this.applyPrevMaps();
	    if (this.isAnnotation()) this.addAnnotation();

	    if (this.isInline()) {
	      return [this.css]
	    } else {
	      return [this.css, this.map]
	    }
	  }

	  generateString() {
	    this.css = '';
	    this.map = new SourceMapGenerator({
	      file: this.outputFile(),
	      ignoreInvalidMapping: true
	    });

	    let line = 1;
	    let column = 1;

	    let noSource = '<no source>';
	    let mapping = {
	      generated: { column: 0, line: 0 },
	      original: { column: 0, line: 0 },
	      source: ''
	    };

	    let last, lines;
	    this.stringify(this.root, (str, node, type) => {
	      this.css += str;

	      if (node && type !== 'end') {
	        mapping.generated.line = line;
	        mapping.generated.column = column - 1;
	        if (node.source && node.source.start) {
	          mapping.source = this.sourcePath(node);
	          mapping.original.line = node.source.start.line;
	          mapping.original.column = node.source.start.column - 1;
	          this.map.addMapping(mapping);
	        } else {
	          mapping.source = noSource;
	          mapping.original.line = 1;
	          mapping.original.column = 0;
	          this.map.addMapping(mapping);
	        }
	      }

	      lines = str.match(/\n/g);
	      if (lines) {
	        line += lines.length;
	        last = str.lastIndexOf('\n');
	        column = str.length - last;
	      } else {
	        column += str.length;
	      }

	      if (node && type !== 'start') {
	        let p = node.parent || { raws: {} };
	        let childless =
	          node.type === 'decl' || (node.type === 'atrule' && !node.nodes);
	        if (!childless || node !== p.last || p.raws.semicolon) {
	          if (node.source && node.source.end) {
	            mapping.source = this.sourcePath(node);
	            mapping.original.line = node.source.end.line;
	            mapping.original.column = node.source.end.column - 1;
	            mapping.generated.line = line;
	            mapping.generated.column = column - 2;
	            this.map.addMapping(mapping);
	          } else {
	            mapping.source = noSource;
	            mapping.original.line = 1;
	            mapping.original.column = 0;
	            mapping.generated.line = line;
	            mapping.generated.column = column - 1;
	            this.map.addMapping(mapping);
	          }
	        }
	      }
	    });
	  }

	  isAnnotation() {
	    if (this.isInline()) {
	      return true
	    }
	    if (typeof this.mapOpts.annotation !== 'undefined') {
	      return this.mapOpts.annotation
	    }
	    if (this.previous().length) {
	      return this.previous().some(i => i.annotation)
	    }
	    return true
	  }

	  isInline() {
	    if (typeof this.mapOpts.inline !== 'undefined') {
	      return this.mapOpts.inline
	    }

	    let annotation = this.mapOpts.annotation;
	    if (typeof annotation !== 'undefined' && annotation !== true) {
	      return false
	    }

	    if (this.previous().length) {
	      return this.previous().some(i => i.inline)
	    }
	    return true
	  }

	  isMap() {
	    if (typeof this.opts.map !== 'undefined') {
	      return !!this.opts.map
	    }
	    return this.previous().length > 0
	  }

	  isSourcesContent() {
	    if (typeof this.mapOpts.sourcesContent !== 'undefined') {
	      return this.mapOpts.sourcesContent
	    }
	    if (this.previous().length) {
	      return this.previous().some(i => i.withContent())
	    }
	    return true
	  }

	  outputFile() {
	    if (this.opts.to) {
	      return this.path(this.opts.to)
	    } else if (this.opts.from) {
	      return this.path(this.opts.from)
	    } else {
	      return 'to.css'
	    }
	  }

	  path(file) {
	    if (this.mapOpts.absolute) return file
	    if (file.charCodeAt(0) === 60 /* `<` */) return file
	    if (/^\w+:\/\//.test(file)) return file
	    let cached = this.memoizedPaths.get(file);
	    if (cached) return cached

	    let from = this.opts.to ? dirname(this.opts.to) : '.';

	    if (typeof this.mapOpts.annotation === 'string') {
	      from = dirname(resolve(from, this.mapOpts.annotation));
	    }

	    let path = relative(from, file);
	    this.memoizedPaths.set(file, path);

	    return path
	  }

	  previous() {
	    if (!this.previousMaps) {
	      this.previousMaps = [];
	      if (this.root) {
	        this.root.walk(node => {
	          if (node.source && node.source.input.map) {
	            let map = node.source.input.map;
	            if (!this.previousMaps.includes(map)) {
	              this.previousMaps.push(map);
	            }
	          }
	        });
	      } else {
	        let input = new Input(this.originalCSS, this.opts);
	        if (input.map) this.previousMaps.push(input.map);
	      }
	    }

	    return this.previousMaps
	  }

	  setSourcesContent() {
	    let already = {};
	    if (this.root) {
	      this.root.walk(node => {
	        if (node.source) {
	          let from = node.source.input.from;
	          if (from && !already[from]) {
	            already[from] = true;
	            let fromUrl = this.usesFileUrls
	              ? this.toFileUrl(from)
	              : this.toUrl(this.path(from));
	            this.map.setSourceContent(fromUrl, node.source.input.css);
	          }
	        }
	      });
	    } else if (this.css) {
	      let from = this.opts.from
	        ? this.toUrl(this.path(this.opts.from))
	        : '<no source>';
	      this.map.setSourceContent(from, this.css);
	    }
	  }

	  sourcePath(node) {
	    if (this.mapOpts.from) {
	      return this.toUrl(this.mapOpts.from)
	    } else if (this.usesFileUrls) {
	      return this.toFileUrl(node.source.input.from)
	    } else {
	      return this.toUrl(this.path(node.source.input.from))
	    }
	  }

	  toBase64(str) {
	    if (Buffer) {
	      return Buffer.from(str).toString('base64')
	    } else {
	      return window.btoa(unescape(encodeURIComponent(str)))
	    }
	  }

	  toFileUrl(path) {
	    let cached = this.memoizedFileURLs.get(path);
	    if (cached) return cached

	    if (pathToFileURL) {
	      let fileURL = pathToFileURL(path).toString();
	      this.memoizedFileURLs.set(path, fileURL);

	      return fileURL
	    } else {
	      throw new Error(
	        '`map.absolute` option is not available in this PostCSS build'
	      )
	    }
	  }

	  toUrl(path) {
	    let cached = this.memoizedURLs.get(path);
	    if (cached) return cached

	    if (sep === '\\') {
	      path = path.replace(/\\/g, '/');
	    }

	    let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
	    this.memoizedURLs.set(path, url);

	    return url
	  }
	}

	mapGenerator = MapGenerator;
	return mapGenerator;
}

var tokenize;
var hasRequiredTokenize;

function requireTokenize () {
	if (hasRequiredTokenize) return tokenize;
	hasRequiredTokenize = 1;

	const SINGLE_QUOTE = "'".charCodeAt(0);
	const DOUBLE_QUOTE = '"'.charCodeAt(0);
	const BACKSLASH = '\\'.charCodeAt(0);
	const SLASH = '/'.charCodeAt(0);
	const NEWLINE = '\n'.charCodeAt(0);
	const SPACE = ' '.charCodeAt(0);
	const FEED = '\f'.charCodeAt(0);
	const TAB = '\t'.charCodeAt(0);
	const CR = '\r'.charCodeAt(0);
	const OPEN_SQUARE = '['.charCodeAt(0);
	const CLOSE_SQUARE = ']'.charCodeAt(0);
	const OPEN_PARENTHESES = '('.charCodeAt(0);
	const CLOSE_PARENTHESES = ')'.charCodeAt(0);
	const OPEN_CURLY = '{'.charCodeAt(0);
	const CLOSE_CURLY = '}'.charCodeAt(0);
	const SEMICOLON = ';'.charCodeAt(0);
	const ASTERISK = '*'.charCodeAt(0);
	const COLON = ':'.charCodeAt(0);
	const AT = '@'.charCodeAt(0);

	const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
	const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
	const RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
	const RE_HEX_ESCAPE = /[\da-f]/i;

	tokenize = function tokenizer(input, options = {}) {
	  let css = input.css.valueOf();
	  let ignore = options.ignoreErrors;

	  let code, content, escape, next, quote;
	  let currentToken, escaped, escapePos, n, prev;

	  let length = css.length;
	  let pos = 0;
	  let buffer = [];
	  let returned = [];

	  function position() {
	    return pos
	  }

	  function unclosed(what) {
	    throw input.error('Unclosed ' + what, pos)
	  }

	  function endOfFile() {
	    return returned.length === 0 && pos >= length
	  }

	  function nextToken(opts) {
	    if (returned.length) return returned.pop()
	    if (pos >= length) return

	    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;

	    code = css.charCodeAt(pos);

	    switch (code) {
	      case NEWLINE:
	      case SPACE:
	      case TAB:
	      case CR:
	      case FEED: {
	        next = pos;
	        do {
	          next += 1;
	          code = css.charCodeAt(next);
	        } while (
	          code === SPACE ||
	          code === NEWLINE ||
	          code === TAB ||
	          code === CR ||
	          code === FEED
	        )

	        currentToken = ['space', css.slice(pos, next)];
	        pos = next - 1;
	        break
	      }

	      case OPEN_SQUARE:
	      case CLOSE_SQUARE:
	      case OPEN_CURLY:
	      case CLOSE_CURLY:
	      case COLON:
	      case SEMICOLON:
	      case CLOSE_PARENTHESES: {
	        let controlChar = String.fromCharCode(code);
	        currentToken = [controlChar, controlChar, pos];
	        break
	      }

	      case OPEN_PARENTHESES: {
	        prev = buffer.length ? buffer.pop()[1] : '';
	        n = css.charCodeAt(pos + 1);
	        if (
	          prev === 'url' &&
	          n !== SINGLE_QUOTE &&
	          n !== DOUBLE_QUOTE &&
	          n !== SPACE &&
	          n !== NEWLINE &&
	          n !== TAB &&
	          n !== FEED &&
	          n !== CR
	        ) {
	          next = pos;
	          do {
	            escaped = false;
	            next = css.indexOf(')', next + 1);
	            if (next === -1) {
	              if (ignore || ignoreUnclosed) {
	                next = pos;
	                break
	              } else {
	                unclosed('bracket');
	              }
	            }
	            escapePos = next;
	            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
	              escapePos -= 1;
	              escaped = !escaped;
	            }
	          } while (escaped)

	          currentToken = ['brackets', css.slice(pos, next + 1), pos, next];

	          pos = next;
	        } else {
	          next = css.indexOf(')', pos + 1);
	          content = css.slice(pos, next + 1);

	          if (next === -1 || RE_BAD_BRACKET.test(content)) {
	            currentToken = ['(', '(', pos];
	          } else {
	            currentToken = ['brackets', content, pos, next];
	            pos = next;
	          }
	        }

	        break
	      }

	      case SINGLE_QUOTE:
	      case DOUBLE_QUOTE: {
	        quote = code === SINGLE_QUOTE ? "'" : '"';
	        next = pos;
	        do {
	          escaped = false;
	          next = css.indexOf(quote, next + 1);
	          if (next === -1) {
	            if (ignore || ignoreUnclosed) {
	              next = pos + 1;
	              break
	            } else {
	              unclosed('string');
	            }
	          }
	          escapePos = next;
	          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
	            escapePos -= 1;
	            escaped = !escaped;
	          }
	        } while (escaped)

	        currentToken = ['string', css.slice(pos, next + 1), pos, next];
	        pos = next;
	        break
	      }

	      case AT: {
	        RE_AT_END.lastIndex = pos + 1;
	        RE_AT_END.test(css);
	        if (RE_AT_END.lastIndex === 0) {
	          next = css.length - 1;
	        } else {
	          next = RE_AT_END.lastIndex - 2;
	        }

	        currentToken = ['at-word', css.slice(pos, next + 1), pos, next];

	        pos = next;
	        break
	      }

	      case BACKSLASH: {
	        next = pos;
	        escape = true;
	        while (css.charCodeAt(next + 1) === BACKSLASH) {
	          next += 1;
	          escape = !escape;
	        }
	        code = css.charCodeAt(next + 1);
	        if (
	          escape &&
	          code !== SLASH &&
	          code !== SPACE &&
	          code !== NEWLINE &&
	          code !== TAB &&
	          code !== CR &&
	          code !== FEED
	        ) {
	          next += 1;
	          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
	            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
	              next += 1;
	            }
	            if (css.charCodeAt(next + 1) === SPACE) {
	              next += 1;
	            }
	          }
	        }

	        currentToken = ['word', css.slice(pos, next + 1), pos, next];

	        pos = next;
	        break
	      }

	      default: {
	        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
	          next = css.indexOf('*/', pos + 2) + 1;
	          if (next === 0) {
	            if (ignore || ignoreUnclosed) {
	              next = css.length;
	            } else {
	              unclosed('comment');
	            }
	          }

	          currentToken = ['comment', css.slice(pos, next + 1), pos, next];
	          pos = next;
	        } else {
	          RE_WORD_END.lastIndex = pos + 1;
	          RE_WORD_END.test(css);
	          if (RE_WORD_END.lastIndex === 0) {
	            next = css.length - 1;
	          } else {
	            next = RE_WORD_END.lastIndex - 2;
	          }

	          currentToken = ['word', css.slice(pos, next + 1), pos, next];
	          buffer.push(currentToken);
	          pos = next;
	        }

	        break
	      }
	    }

	    pos++;
	    return currentToken
	  }

	  function back(token) {
	    returned.push(token);
	  }

	  return {
	    back,
	    endOfFile,
	    nextToken,
	    position
	  }
	};
	return tokenize;
}

var parser;
var hasRequiredParser;

function requireParser () {
	if (hasRequiredParser) return parser;
	hasRequiredParser = 1;

	let AtRule = requireAtRule();
	let Comment = requireComment();
	let Declaration = requireDeclaration();
	let Root = requireRoot();
	let Rule = requireRule();
	let tokenizer = requireTokenize();

	const SAFE_COMMENT_NEIGHBOR = {
	  empty: true,
	  space: true
	};

	function findLastWithPosition(tokens) {
	  for (let i = tokens.length - 1; i >= 0; i--) {
	    let token = tokens[i];
	    let pos = token[3] || token[2];
	    if (pos) return pos
	  }
	}

	class Parser {
	  constructor(input) {
	    this.input = input;

	    this.root = new Root();
	    this.current = this.root;
	    this.spaces = '';
	    this.semicolon = false;

	    this.createTokenizer();
	    this.root.source = { input, start: { column: 1, line: 1, offset: 0 } };
	  }

	  atrule(token) {
	    let node = new AtRule();
	    node.name = token[1].slice(1);
	    if (node.name === '') {
	      this.unnamedAtrule(node, token);
	    }
	    this.init(node, token[2]);

	    let type;
	    let prev;
	    let shift;
	    let last = false;
	    let open = false;
	    let params = [];
	    let brackets = [];

	    while (!this.tokenizer.endOfFile()) {
	      token = this.tokenizer.nextToken();
	      type = token[0];

	      if (type === '(' || type === '[') {
	        brackets.push(type === '(' ? ')' : ']');
	      } else if (type === '{' && brackets.length > 0) {
	        brackets.push('}');
	      } else if (type === brackets[brackets.length - 1]) {
	        brackets.pop();
	      }

	      if (brackets.length === 0) {
	        if (type === ';') {
	          node.source.end = this.getPosition(token[2]);
	          node.source.end.offset++;
	          this.semicolon = true;
	          break
	        } else if (type === '{') {
	          open = true;
	          break
	        } else if (type === '}') {
	          if (params.length > 0) {
	            shift = params.length - 1;
	            prev = params[shift];
	            while (prev && prev[0] === 'space') {
	              prev = params[--shift];
	            }
	            if (prev) {
	              node.source.end = this.getPosition(prev[3] || prev[2]);
	              node.source.end.offset++;
	            }
	          }
	          this.end(token);
	          break
	        } else {
	          params.push(token);
	        }
	      } else {
	        params.push(token);
	      }

	      if (this.tokenizer.endOfFile()) {
	        last = true;
	        break
	      }
	    }

	    node.raws.between = this.spacesAndCommentsFromEnd(params);
	    if (params.length) {
	      node.raws.afterName = this.spacesAndCommentsFromStart(params);
	      this.raw(node, 'params', params);
	      if (last) {
	        token = params[params.length - 1];
	        node.source.end = this.getPosition(token[3] || token[2]);
	        node.source.end.offset++;
	        this.spaces = node.raws.between;
	        node.raws.between = '';
	      }
	    } else {
	      node.raws.afterName = '';
	      node.params = '';
	    }

	    if (open) {
	      node.nodes = [];
	      this.current = node;
	    }
	  }

	  checkMissedSemicolon(tokens) {
	    let colon = this.colon(tokens);
	    if (colon === false) return

	    let founded = 0;
	    let token;
	    for (let j = colon - 1; j >= 0; j--) {
	      token = tokens[j];
	      if (token[0] !== 'space') {
	        founded += 1;
	        if (founded === 2) break
	      }
	    }
	    // If the token is a word, e.g. `!important`, `red` or any other valid property's value.
	    // Then we need to return the colon after that word token. [3] is the "end" colon of that word.
	    // And because we need it after that one we do +1 to get the next one.
	    throw this.input.error(
	      'Missed semicolon',
	      token[0] === 'word' ? token[3] + 1 : token[2]
	    )
	  }

	  colon(tokens) {
	    let brackets = 0;
	    let prev, token, type;
	    for (let [i, element] of tokens.entries()) {
	      token = element;
	      type = token[0];

	      if (type === '(') {
	        brackets += 1;
	      }
	      if (type === ')') {
	        brackets -= 1;
	      }
	      if (brackets === 0 && type === ':') {
	        if (!prev) {
	          this.doubleColon(token);
	        } else if (prev[0] === 'word' && prev[1] === 'progid') {
	          continue
	        } else {
	          return i
	        }
	      }

	      prev = token;
	    }
	    return false
	  }

	  comment(token) {
	    let node = new Comment();
	    this.init(node, token[2]);
	    node.source.end = this.getPosition(token[3] || token[2]);
	    node.source.end.offset++;

	    let text = token[1].slice(2, -2);
	    if (/^\s*$/.test(text)) {
	      node.text = '';
	      node.raws.left = text;
	      node.raws.right = '';
	    } else {
	      let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
	      node.text = match[2];
	      node.raws.left = match[1];
	      node.raws.right = match[3];
	    }
	  }

	  createTokenizer() {
	    this.tokenizer = tokenizer(this.input);
	  }

	  decl(tokens, customProperty) {
	    let node = new Declaration();
	    this.init(node, tokens[0][2]);

	    let last = tokens[tokens.length - 1];
	    if (last[0] === ';') {
	      this.semicolon = true;
	      tokens.pop();
	    }

	    node.source.end = this.getPosition(
	      last[3] || last[2] || findLastWithPosition(tokens)
	    );
	    node.source.end.offset++;

	    while (tokens[0][0] !== 'word') {
	      if (tokens.length === 1) this.unknownWord(tokens);
	      node.raws.before += tokens.shift()[1];
	    }
	    node.source.start = this.getPosition(tokens[0][2]);

	    node.prop = '';
	    while (tokens.length) {
	      let type = tokens[0][0];
	      if (type === ':' || type === 'space' || type === 'comment') {
	        break
	      }
	      node.prop += tokens.shift()[1];
	    }

	    node.raws.between = '';

	    let token;
	    while (tokens.length) {
	      token = tokens.shift();

	      if (token[0] === ':') {
	        node.raws.between += token[1];
	        break
	      } else {
	        if (token[0] === 'word' && /\w/.test(token[1])) {
	          this.unknownWord([token]);
	        }
	        node.raws.between += token[1];
	      }
	    }

	    if (node.prop[0] === '_' || node.prop[0] === '*') {
	      node.raws.before += node.prop[0];
	      node.prop = node.prop.slice(1);
	    }

	    let firstSpaces = [];
	    let next;
	    while (tokens.length) {
	      next = tokens[0][0];
	      if (next !== 'space' && next !== 'comment') break
	      firstSpaces.push(tokens.shift());
	    }

	    this.precheckMissedSemicolon(tokens);

	    for (let i = tokens.length - 1; i >= 0; i--) {
	      token = tokens[i];
	      if (token[1].toLowerCase() === '!important') {
	        node.important = true;
	        let string = this.stringFrom(tokens, i);
	        string = this.spacesFromEnd(tokens) + string;
	        if (string !== ' !important') node.raws.important = string;
	        break
	      } else if (token[1].toLowerCase() === 'important') {
	        let cache = tokens.slice(0);
	        let str = '';
	        for (let j = i; j > 0; j--) {
	          let type = cache[j][0];
	          if (str.trim().startsWith('!') && type !== 'space') {
	            break
	          }
	          str = cache.pop()[1] + str;
	        }
	        if (str.trim().startsWith('!')) {
	          node.important = true;
	          node.raws.important = str;
	          tokens = cache;
	        }
	      }

	      if (token[0] !== 'space' && token[0] !== 'comment') {
	        break
	      }
	    }

	    let hasWord = tokens.some(i => i[0] !== 'space' && i[0] !== 'comment');

	    if (hasWord) {
	      node.raws.between += firstSpaces.map(i => i[1]).join('');
	      firstSpaces = [];
	    }
	    this.raw(node, 'value', firstSpaces.concat(tokens), customProperty);

	    if (node.value.includes(':') && !customProperty) {
	      this.checkMissedSemicolon(tokens);
	    }
	  }

	  doubleColon(token) {
	    throw this.input.error(
	      'Double colon',
	      { offset: token[2] },
	      { offset: token[2] + token[1].length }
	    )
	  }

	  emptyRule(token) {
	    let node = new Rule();
	    this.init(node, token[2]);
	    node.selector = '';
	    node.raws.between = '';
	    this.current = node;
	  }

	  end(token) {
	    if (this.current.nodes && this.current.nodes.length) {
	      this.current.raws.semicolon = this.semicolon;
	    }
	    this.semicolon = false;

	    this.current.raws.after = (this.current.raws.after || '') + this.spaces;
	    this.spaces = '';

	    if (this.current.parent) {
	      this.current.source.end = this.getPosition(token[2]);
	      this.current.source.end.offset++;
	      this.current = this.current.parent;
	    } else {
	      this.unexpectedClose(token);
	    }
	  }

	  endFile() {
	    if (this.current.parent) this.unclosedBlock();
	    if (this.current.nodes && this.current.nodes.length) {
	      this.current.raws.semicolon = this.semicolon;
	    }
	    this.current.raws.after = (this.current.raws.after || '') + this.spaces;
	    this.root.source.end = this.getPosition(this.tokenizer.position());
	  }

	  freeSemicolon(token) {
	    this.spaces += token[1];
	    if (this.current.nodes) {
	      let prev = this.current.nodes[this.current.nodes.length - 1];
	      if (prev && prev.type === 'rule' && !prev.raws.ownSemicolon) {
	        prev.raws.ownSemicolon = this.spaces;
	        this.spaces = '';
	        prev.source.end = this.getPosition(token[2]);
	        prev.source.end.offset += prev.raws.ownSemicolon.length;
	      }
	    }
	  }

	  // Helpers

	  getPosition(offset) {
	    let pos = this.input.fromOffset(offset);
	    return {
	      column: pos.col,
	      line: pos.line,
	      offset
	    }
	  }

	  init(node, offset) {
	    this.current.push(node);
	    node.source = {
	      input: this.input,
	      start: this.getPosition(offset)
	    };
	    node.raws.before = this.spaces;
	    this.spaces = '';
	    if (node.type !== 'comment') this.semicolon = false;
	  }

	  other(start) {
	    let end = false;
	    let type = null;
	    let colon = false;
	    let bracket = null;
	    let brackets = [];
	    let customProperty = start[1].startsWith('--');

	    let tokens = [];
	    let token = start;
	    while (token) {
	      type = token[0];
	      tokens.push(token);

	      if (type === '(' || type === '[') {
	        if (!bracket) bracket = token;
	        brackets.push(type === '(' ? ')' : ']');
	      } else if (customProperty && colon && type === '{') {
	        if (!bracket) bracket = token;
	        brackets.push('}');
	      } else if (brackets.length === 0) {
	        if (type === ';') {
	          if (colon) {
	            this.decl(tokens, customProperty);
	            return
	          } else {
	            break
	          }
	        } else if (type === '{') {
	          this.rule(tokens);
	          return
	        } else if (type === '}') {
	          this.tokenizer.back(tokens.pop());
	          end = true;
	          break
	        } else if (type === ':') {
	          colon = true;
	        }
	      } else if (type === brackets[brackets.length - 1]) {
	        brackets.pop();
	        if (brackets.length === 0) bracket = null;
	      }

	      token = this.tokenizer.nextToken();
	    }

	    if (this.tokenizer.endOfFile()) end = true;
	    if (brackets.length > 0) this.unclosedBracket(bracket);

	    if (end && colon) {
	      if (!customProperty) {
	        while (tokens.length) {
	          token = tokens[tokens.length - 1][0];
	          if (token !== 'space' && token !== 'comment') break
	          this.tokenizer.back(tokens.pop());
	        }
	      }
	      this.decl(tokens, customProperty);
	    } else {
	      this.unknownWord(tokens);
	    }
	  }

	  parse() {
	    let token;
	    while (!this.tokenizer.endOfFile()) {
	      token = this.tokenizer.nextToken();

	      switch (token[0]) {
	        case 'space':
	          this.spaces += token[1];
	          break

	        case ';':
	          this.freeSemicolon(token);
	          break

	        case '}':
	          this.end(token);
	          break

	        case 'comment':
	          this.comment(token);
	          break

	        case 'at-word':
	          this.atrule(token);
	          break

	        case '{':
	          this.emptyRule(token);
	          break

	        default:
	          this.other(token);
	          break
	      }
	    }
	    this.endFile();
	  }

	  precheckMissedSemicolon(/* tokens */) {
	    // Hook for Safe Parser
	  }

	  raw(node, prop, tokens, customProperty) {
	    let token, type;
	    let length = tokens.length;
	    let value = '';
	    let clean = true;
	    let next, prev;

	    for (let i = 0; i < length; i += 1) {
	      token = tokens[i];
	      type = token[0];
	      if (type === 'space' && i === length - 1 && !customProperty) {
	        clean = false;
	      } else if (type === 'comment') {
	        prev = tokens[i - 1] ? tokens[i - 1][0] : 'empty';
	        next = tokens[i + 1] ? tokens[i + 1][0] : 'empty';
	        if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
	          if (value.slice(-1) === ',') {
	            clean = false;
	          } else {
	            value += token[1];
	          }
	        } else {
	          clean = false;
	        }
	      } else {
	        value += token[1];
	      }
	    }
	    if (!clean) {
	      let raw = tokens.reduce((all, i) => all + i[1], '');
	      node.raws[prop] = { raw, value };
	    }
	    node[prop] = value;
	  }

	  rule(tokens) {
	    tokens.pop();

	    let node = new Rule();
	    this.init(node, tokens[0][2]);

	    node.raws.between = this.spacesAndCommentsFromEnd(tokens);
	    this.raw(node, 'selector', tokens);
	    this.current = node;
	  }

	  spacesAndCommentsFromEnd(tokens) {
	    let lastTokenType;
	    let spaces = '';
	    while (tokens.length) {
	      lastTokenType = tokens[tokens.length - 1][0];
	      if (lastTokenType !== 'space' && lastTokenType !== 'comment') break
	      spaces = tokens.pop()[1] + spaces;
	    }
	    return spaces
	  }

	  // Errors

	  spacesAndCommentsFromStart(tokens) {
	    let next;
	    let spaces = '';
	    while (tokens.length) {
	      next = tokens[0][0];
	      if (next !== 'space' && next !== 'comment') break
	      spaces += tokens.shift()[1];
	    }
	    return spaces
	  }

	  spacesFromEnd(tokens) {
	    let lastTokenType;
	    let spaces = '';
	    while (tokens.length) {
	      lastTokenType = tokens[tokens.length - 1][0];
	      if (lastTokenType !== 'space') break
	      spaces = tokens.pop()[1] + spaces;
	    }
	    return spaces
	  }

	  stringFrom(tokens, from) {
	    let result = '';
	    for (let i = from; i < tokens.length; i++) {
	      result += tokens[i][1];
	    }
	    tokens.splice(from, tokens.length - from);
	    return result
	  }

	  unclosedBlock() {
	    let pos = this.current.source.start;
	    throw this.input.error('Unclosed block', pos.line, pos.column)
	  }

	  unclosedBracket(bracket) {
	    throw this.input.error(
	      'Unclosed bracket',
	      { offset: bracket[2] },
	      { offset: bracket[2] + 1 }
	    )
	  }

	  unexpectedClose(token) {
	    throw this.input.error(
	      'Unexpected }',
	      { offset: token[2] },
	      { offset: token[2] + 1 }
	    )
	  }

	  unknownWord(tokens) {
	    throw this.input.error(
	      'Unknown word ' + tokens[0][1],
	      { offset: tokens[0][2] },
	      { offset: tokens[0][2] + tokens[0][1].length }
	    )
	  }

	  unnamedAtrule(node, token) {
	    throw this.input.error(
	      'At-rule without name',
	      { offset: token[2] },
	      { offset: token[2] + token[1].length }
	    )
	  }
	}

	parser = Parser;
	return parser;
}

var parse_1;
var hasRequiredParse;

function requireParse () {
	if (hasRequiredParse) return parse_1;
	hasRequiredParse = 1;
	let Container = requireContainer();
	let Input = requireInput();
	let Parser = requireParser();
	function parse(css, opts) {
	  let input = new Input(css, opts);
	  let parser = new Parser(input);
	  try {
	    parser.parse();
	  } catch (e) {
	    throw e;
	  }
	  return parser.root;
	}
	parse_1 = parse;
	parse.default = parse;
	Container.registerParse(parse);
	return parse_1;
}

var warning;
var hasRequiredWarning;

function requireWarning () {
	if (hasRequiredWarning) return warning;
	hasRequiredWarning = 1;

	class Warning {
	  constructor(text, opts = {}) {
	    this.type = 'warning';
	    this.text = text;

	    if (opts.node && opts.node.source) {
	      let range = opts.node.rangeBy(opts);
	      this.line = range.start.line;
	      this.column = range.start.column;
	      this.endLine = range.end.line;
	      this.endColumn = range.end.column;
	    }

	    for (let opt in opts) this[opt] = opts[opt];
	  }

	  toString() {
	    if (this.node) {
	      return this.node.error(this.text, {
	        index: this.index,
	        plugin: this.plugin,
	        word: this.word
	      }).message
	    }

	    if (this.plugin) {
	      return this.plugin + ': ' + this.text
	    }

	    return this.text
	  }
	}

	warning = Warning;
	Warning.default = Warning;
	return warning;
}

var result;
var hasRequiredResult;

function requireResult () {
	if (hasRequiredResult) return result;
	hasRequiredResult = 1;

	let Warning = requireWarning();

	class Result {
	  get content() {
	    return this.css
	  }

	  constructor(processor, root, opts) {
	    this.processor = processor;
	    this.messages = [];
	    this.root = root;
	    this.opts = opts;
	    this.css = '';
	    this.map = undefined;
	  }

	  toString() {
	    return this.css
	  }

	  warn(text, opts = {}) {
	    if (!opts.plugin) {
	      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
	        opts.plugin = this.lastPlugin.postcssPlugin;
	      }
	    }

	    let warning = new Warning(text, opts);
	    this.messages.push(warning);

	    return warning
	  }

	  warnings() {
	    return this.messages.filter(i => i.type === 'warning')
	  }
	}

	result = Result;
	Result.default = Result;
	return result;
}

var lazyResult;
var hasRequiredLazyResult;

function requireLazyResult () {
	if (hasRequiredLazyResult) return lazyResult;
	hasRequiredLazyResult = 1;
	let Container = requireContainer();
	let Document = requireDocument();
	let MapGenerator = requireMapGenerator();
	let parse = requireParse();
	let Result = requireResult();
	let Root = requireRoot();
	let stringify = requireStringify();
	let { isClean, my } = requireSymbols();
	const TYPE_TO_CLASS_NAME = {
	  atrule: "AtRule",
	  comment: "Comment",
	  decl: "Declaration",
	  document: "Document",
	  root: "Root",
	  rule: "Rule"
	};
	const PLUGIN_PROPS = {
	  AtRule: true,
	  AtRuleExit: true,
	  Comment: true,
	  CommentExit: true,
	  Declaration: true,
	  DeclarationExit: true,
	  Document: true,
	  DocumentExit: true,
	  Once: true,
	  OnceExit: true,
	  postcssPlugin: true,
	  prepare: true,
	  Root: true,
	  RootExit: true,
	  Rule: true,
	  RuleExit: true
	};
	const NOT_VISITORS = {
	  Once: true,
	  postcssPlugin: true,
	  prepare: true
	};
	const CHILDREN = 0;
	function isPromise(obj) {
	  return typeof obj === "object" && typeof obj.then === "function";
	}
	function getEvents(node) {
	  let key = false;
	  let type = TYPE_TO_CLASS_NAME[node.type];
	  if (node.type === "decl") {
	    key = node.prop.toLowerCase();
	  } else if (node.type === "atrule") {
	    key = node.name.toLowerCase();
	  }
	  if (key && node.append) {
	    return [
	      type,
	      type + "-" + key,
	      CHILDREN,
	      type + "Exit",
	      type + "Exit-" + key
	    ];
	  } else if (key) {
	    return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
	  } else if (node.append) {
	    return [type, CHILDREN, type + "Exit"];
	  } else {
	    return [type, type + "Exit"];
	  }
	}
	function toStack(node) {
	  let events;
	  if (node.type === "document") {
	    events = ["Document", CHILDREN, "DocumentExit"];
	  } else if (node.type === "root") {
	    events = ["Root", CHILDREN, "RootExit"];
	  } else {
	    events = getEvents(node);
	  }
	  return {
	    eventIndex: 0,
	    events,
	    iterator: 0,
	    node,
	    visitorIndex: 0,
	    visitors: []
	  };
	}
	function cleanMarks(node) {
	  node[isClean] = false;
	  if (node.nodes) node.nodes.forEach((i) => cleanMarks(i));
	  return node;
	}
	let postcss = {};
	class LazyResult {
	  get content() {
	    return this.stringify().content;
	  }
	  get css() {
	    return this.stringify().css;
	  }
	  get map() {
	    return this.stringify().map;
	  }
	  get messages() {
	    return this.sync().messages;
	  }
	  get opts() {
	    return this.result.opts;
	  }
	  get processor() {
	    return this.result.processor;
	  }
	  get root() {
	    return this.sync().root;
	  }
	  get [Symbol.toStringTag]() {
	    return "LazyResult";
	  }
	  constructor(processor, css, opts) {
	    this.stringified = false;
	    this.processed = false;
	    let root;
	    if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
	      root = cleanMarks(css);
	    } else if (css instanceof LazyResult || css instanceof Result) {
	      root = cleanMarks(css.root);
	      if (css.map) {
	        if (typeof opts.map === "undefined") opts.map = {};
	        if (!opts.map.inline) opts.map.inline = false;
	        opts.map.prev = css.map;
	      }
	    } else {
	      let parser = parse;
	      if (opts.syntax) parser = opts.syntax.parse;
	      if (opts.parser) parser = opts.parser;
	      if (parser.parse) parser = parser.parse;
	      try {
	        root = parser(css, opts);
	      } catch (error) {
	        this.processed = true;
	        this.error = error;
	      }
	      if (root && !root[my]) {
	        Container.rebuild(root);
	      }
	    }
	    this.result = new Result(processor, root, opts);
	    this.helpers = { ...postcss, postcss, result: this.result };
	    this.plugins = this.processor.plugins.map((plugin) => {
	      if (typeof plugin === "object" && plugin.prepare) {
	        return { ...plugin, ...plugin.prepare(this.result) };
	      } else {
	        return plugin;
	      }
	    });
	  }
	  async() {
	    if (this.error) return Promise.reject(this.error);
	    if (this.processed) return Promise.resolve(this.result);
	    if (!this.processing) {
	      this.processing = this.runAsync();
	    }
	    return this.processing;
	  }
	  catch(onRejected) {
	    return this.async().catch(onRejected);
	  }
	  finally(onFinally) {
	    return this.async().then(onFinally, onFinally);
	  }
	  getAsyncError() {
	    throw new Error("Use process(css).then(cb) to work with async plugins");
	  }
	  handleError(error, node) {
	    let plugin = this.result.lastPlugin;
	    try {
	      if (node) node.addToError(error);
	      this.error = error;
	      if (error.name === "CssSyntaxError" && !error.plugin) {
	        error.plugin = plugin.postcssPlugin;
	        error.setMessage();
	      } else if (plugin.postcssVersion) {
	        if (false) ;
	      }
	    } catch (err) {
	      if (console && console.error) console.error(err);
	    }
	    return error;
	  }
	  prepareVisitors() {
	    this.listeners = {};
	    let add = (plugin, type, cb) => {
	      if (!this.listeners[type]) this.listeners[type] = [];
	      this.listeners[type].push([plugin, cb]);
	    };
	    for (let plugin of this.plugins) {
	      if (typeof plugin === "object") {
	        for (let event in plugin) {
	          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
	            throw new Error(
	              `Unknown event ${event} in ${plugin.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
	            );
	          }
	          if (!NOT_VISITORS[event]) {
	            if (typeof plugin[event] === "object") {
	              for (let filter in plugin[event]) {
	                if (filter === "*") {
	                  add(plugin, event, plugin[event][filter]);
	                } else {
	                  add(
	                    plugin,
	                    event + "-" + filter.toLowerCase(),
	                    plugin[event][filter]
	                  );
	                }
	              }
	            } else if (typeof plugin[event] === "function") {
	              add(plugin, event, plugin[event]);
	            }
	          }
	        }
	      }
	    }
	    this.hasListener = Object.keys(this.listeners).length > 0;
	  }
	  async runAsync() {
	    this.plugin = 0;
	    for (let i = 0; i < this.plugins.length; i++) {
	      let plugin = this.plugins[i];
	      let promise = this.runOnRoot(plugin);
	      if (isPromise(promise)) {
	        try {
	          await promise;
	        } catch (error) {
	          throw this.handleError(error);
	        }
	      }
	    }
	    this.prepareVisitors();
	    if (this.hasListener) {
	      let root = this.result.root;
	      while (!root[isClean]) {
	        root[isClean] = true;
	        let stack = [toStack(root)];
	        while (stack.length > 0) {
	          let promise = this.visitTick(stack);
	          if (isPromise(promise)) {
	            try {
	              await promise;
	            } catch (e) {
	              let node = stack[stack.length - 1].node;
	              throw this.handleError(e, node);
	            }
	          }
	        }
	      }
	      if (this.listeners.OnceExit) {
	        for (let [plugin, visitor] of this.listeners.OnceExit) {
	          this.result.lastPlugin = plugin;
	          try {
	            if (root.type === "document") {
	              let roots = root.nodes.map(
	                (subRoot) => visitor(subRoot, this.helpers)
	              );
	              await Promise.all(roots);
	            } else {
	              await visitor(root, this.helpers);
	            }
	          } catch (e) {
	            throw this.handleError(e);
	          }
	        }
	      }
	    }
	    this.processed = true;
	    return this.stringify();
	  }
	  runOnRoot(plugin) {
	    this.result.lastPlugin = plugin;
	    try {
	      if (typeof plugin === "object" && plugin.Once) {
	        if (this.result.root.type === "document") {
	          let roots = this.result.root.nodes.map(
	            (root) => plugin.Once(root, this.helpers)
	          );
	          if (isPromise(roots[0])) {
	            return Promise.all(roots);
	          }
	          return roots;
	        }
	        return plugin.Once(this.result.root, this.helpers);
	      } else if (typeof plugin === "function") {
	        return plugin(this.result.root, this.result);
	      }
	    } catch (error) {
	      throw this.handleError(error);
	    }
	  }
	  stringify() {
	    if (this.error) throw this.error;
	    if (this.stringified) return this.result;
	    this.stringified = true;
	    this.sync();
	    let opts = this.result.opts;
	    let str = stringify;
	    if (opts.syntax) str = opts.syntax.stringify;
	    if (opts.stringifier) str = opts.stringifier;
	    if (str.stringify) str = str.stringify;
	    let map = new MapGenerator(str, this.result.root, this.result.opts);
	    let data = map.generate();
	    this.result.css = data[0];
	    this.result.map = data[1];
	    return this.result;
	  }
	  sync() {
	    if (this.error) throw this.error;
	    if (this.processed) return this.result;
	    this.processed = true;
	    if (this.processing) {
	      throw this.getAsyncError();
	    }
	    for (let plugin of this.plugins) {
	      let promise = this.runOnRoot(plugin);
	      if (isPromise(promise)) {
	        throw this.getAsyncError();
	      }
	    }
	    this.prepareVisitors();
	    if (this.hasListener) {
	      let root = this.result.root;
	      while (!root[isClean]) {
	        root[isClean] = true;
	        this.walkSync(root);
	      }
	      if (this.listeners.OnceExit) {
	        if (root.type === "document") {
	          for (let subRoot of root.nodes) {
	            this.visitSync(this.listeners.OnceExit, subRoot);
	          }
	        } else {
	          this.visitSync(this.listeners.OnceExit, root);
	        }
	      }
	    }
	    return this.result;
	  }
	  then(onFulfilled, onRejected) {
	    return this.async().then(onFulfilled, onRejected);
	  }
	  toString() {
	    return this.css;
	  }
	  visitSync(visitors, node) {
	    for (let [plugin, visitor] of visitors) {
	      this.result.lastPlugin = plugin;
	      let promise;
	      try {
	        promise = visitor(node, this.helpers);
	      } catch (e) {
	        throw this.handleError(e, node.proxyOf);
	      }
	      if (node.type !== "root" && node.type !== "document" && !node.parent) {
	        return true;
	      }
	      if (isPromise(promise)) {
	        throw this.getAsyncError();
	      }
	    }
	  }
	  visitTick(stack) {
	    let visit = stack[stack.length - 1];
	    let { node, visitors } = visit;
	    if (node.type !== "root" && node.type !== "document" && !node.parent) {
	      stack.pop();
	      return;
	    }
	    if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
	      let [plugin, visitor] = visitors[visit.visitorIndex];
	      visit.visitorIndex += 1;
	      if (visit.visitorIndex === visitors.length) {
	        visit.visitors = [];
	        visit.visitorIndex = 0;
	      }
	      this.result.lastPlugin = plugin;
	      try {
	        return visitor(node.toProxy(), this.helpers);
	      } catch (e) {
	        throw this.handleError(e, node);
	      }
	    }
	    if (visit.iterator !== 0) {
	      let iterator = visit.iterator;
	      let child;
	      while (child = node.nodes[node.indexes[iterator]]) {
	        node.indexes[iterator] += 1;
	        if (!child[isClean]) {
	          child[isClean] = true;
	          stack.push(toStack(child));
	          return;
	        }
	      }
	      visit.iterator = 0;
	      delete node.indexes[iterator];
	    }
	    let events = visit.events;
	    while (visit.eventIndex < events.length) {
	      let event = events[visit.eventIndex];
	      visit.eventIndex += 1;
	      if (event === CHILDREN) {
	        if (node.nodes && node.nodes.length) {
	          node[isClean] = true;
	          visit.iterator = node.getIterator();
	        }
	        return;
	      } else if (this.listeners[event]) {
	        visit.visitors = this.listeners[event];
	        return;
	      }
	    }
	    stack.pop();
	  }
	  walkSync(node) {
	    node[isClean] = true;
	    let events = getEvents(node);
	    for (let event of events) {
	      if (event === CHILDREN) {
	        if (node.nodes) {
	          node.each((child) => {
	            if (!child[isClean]) this.walkSync(child);
	          });
	        }
	      } else {
	        let visitors = this.listeners[event];
	        if (visitors) {
	          if (this.visitSync(visitors, node.toProxy())) return;
	        }
	      }
	    }
	  }
	  warnings() {
	    return this.sync().warnings();
	  }
	}
	LazyResult.registerPostcss = (dependant) => {
	  postcss = dependant;
	};
	lazyResult = LazyResult;
	LazyResult.default = LazyResult;
	Root.registerLazyResult(LazyResult);
	Document.registerLazyResult(LazyResult);
	return lazyResult;
}

var noWorkResult;
var hasRequiredNoWorkResult;

function requireNoWorkResult () {
	if (hasRequiredNoWorkResult) return noWorkResult;
	hasRequiredNoWorkResult = 1;
	let MapGenerator = requireMapGenerator();
	let parse = requireParse();
	const Result = requireResult();
	let stringify = requireStringify();
	class NoWorkResult {
	  get content() {
	    return this.result.css;
	  }
	  get css() {
	    return this.result.css;
	  }
	  get map() {
	    return this.result.map;
	  }
	  get messages() {
	    return [];
	  }
	  get opts() {
	    return this.result.opts;
	  }
	  get processor() {
	    return this.result.processor;
	  }
	  get root() {
	    if (this._root) {
	      return this._root;
	    }
	    let root;
	    let parser = parse;
	    try {
	      root = parser(this._css, this._opts);
	    } catch (error) {
	      this.error = error;
	    }
	    if (this.error) {
	      throw this.error;
	    } else {
	      this._root = root;
	      return root;
	    }
	  }
	  get [Symbol.toStringTag]() {
	    return "NoWorkResult";
	  }
	  constructor(processor, css, opts) {
	    css = css.toString();
	    this.stringified = false;
	    this._processor = processor;
	    this._css = css;
	    this._opts = opts;
	    this._map = void 0;
	    let root;
	    let str = stringify;
	    this.result = new Result(this._processor, root, this._opts);
	    this.result.css = css;
	    let self = this;
	    Object.defineProperty(this.result, "root", {
	      get() {
	        return self.root;
	      }
	    });
	    let map = new MapGenerator(str, root, this._opts, css);
	    if (map.isMap()) {
	      let [generatedCSS, generatedMap] = map.generate();
	      if (generatedCSS) {
	        this.result.css = generatedCSS;
	      }
	      if (generatedMap) {
	        this.result.map = generatedMap;
	      }
	    } else {
	      map.clearAnnotation();
	      this.result.css = map.css;
	    }
	  }
	  async() {
	    if (this.error) return Promise.reject(this.error);
	    return Promise.resolve(this.result);
	  }
	  catch(onRejected) {
	    return this.async().catch(onRejected);
	  }
	  finally(onFinally) {
	    return this.async().then(onFinally, onFinally);
	  }
	  sync() {
	    if (this.error) throw this.error;
	    return this.result;
	  }
	  then(onFulfilled, onRejected) {
	    return this.async().then(onFulfilled, onRejected);
	  }
	  toString() {
	    return this._css;
	  }
	  warnings() {
	    return [];
	  }
	}
	noWorkResult = NoWorkResult;
	NoWorkResult.default = NoWorkResult;
	return noWorkResult;
}

var processor;
var hasRequiredProcessor;

function requireProcessor () {
	if (hasRequiredProcessor) return processor;
	hasRequiredProcessor = 1;
	let Document = requireDocument();
	let LazyResult = requireLazyResult();
	let NoWorkResult = requireNoWorkResult();
	let Root = requireRoot();
	class Processor {
	  constructor(plugins = []) {
	    this.version = "8.5.6";
	    this.plugins = this.normalize(plugins);
	  }
	  normalize(plugins) {
	    let normalized = [];
	    for (let i of plugins) {
	      if (i.postcss === true) {
	        i = i();
	      } else if (i.postcss) {
	        i = i.postcss;
	      }
	      if (typeof i === "object" && Array.isArray(i.plugins)) {
	        normalized = normalized.concat(i.plugins);
	      } else if (typeof i === "object" && i.postcssPlugin) {
	        normalized.push(i);
	      } else if (typeof i === "function") {
	        normalized.push(i);
	      } else if (typeof i === "object" && (i.parse || i.stringify)) ; else {
	        throw new Error(i + " is not a PostCSS plugin");
	      }
	    }
	    return normalized;
	  }
	  process(css, opts = {}) {
	    if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
	      return new NoWorkResult(this, css, opts);
	    } else {
	      return new LazyResult(this, css, opts);
	    }
	  }
	  use(plugin) {
	    this.plugins = this.plugins.concat(this.normalize([plugin]));
	    return this;
	  }
	}
	processor = Processor;
	Processor.default = Processor;
	Root.registerProcessor(Processor);
	Document.registerProcessor(Processor);
	return processor;
}

var postcss_1;
var hasRequiredPostcss;

function requirePostcss () {
	if (hasRequiredPostcss) return postcss_1;
	hasRequiredPostcss = 1;
	let AtRule = requireAtRule();
	let Comment = requireComment();
	let Container = requireContainer();
	let CssSyntaxError = requireCssSyntaxError();
	let Declaration = requireDeclaration();
	let Document = requireDocument();
	let fromJSON = requireFromJSON();
	let Input = requireInput();
	let LazyResult = requireLazyResult();
	let list = requireList();
	let Node = requireNode();
	let parse = requireParse();
	let Processor = requireProcessor();
	let Result = requireResult();
	let Root = requireRoot();
	let Rule = requireRule();
	let stringify = requireStringify();
	let Warning = requireWarning();
	function postcss(...plugins) {
	  if (plugins.length === 1 && Array.isArray(plugins[0])) {
	    plugins = plugins[0];
	  }
	  return new Processor(plugins);
	}
	postcss.plugin = function plugin(name, initializer) {
	  let warningPrinted = false;
	  function creator(...args) {
	    if (console && console.warn && !warningPrinted) {
	      warningPrinted = true;
	      console.warn(
	        name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
	      );
	      if (process.env.LANG && process.env.LANG.startsWith("cn")) {
	        console.warn(
	          name + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226"
	        );
	      }
	    }
	    let transformer = initializer(...args);
	    transformer.postcssPlugin = name;
	    transformer.postcssVersion = new Processor().version;
	    return transformer;
	  }
	  let cache;
	  Object.defineProperty(creator, "postcss", {
	    get() {
	      if (!cache) cache = creator();
	      return cache;
	    }
	  });
	  creator.process = function(css, processOpts, pluginOpts) {
	    return postcss([creator(pluginOpts)]).process(css, processOpts);
	  };
	  return creator;
	};
	postcss.stringify = stringify;
	postcss.parse = parse;
	postcss.fromJSON = fromJSON;
	postcss.list = list;
	postcss.comment = (defaults) => new Comment(defaults);
	postcss.atRule = (defaults) => new AtRule(defaults);
	postcss.decl = (defaults) => new Declaration(defaults);
	postcss.rule = (defaults) => new Rule(defaults);
	postcss.root = (defaults) => new Root(defaults);
	postcss.document = (defaults) => new Document(defaults);
	postcss.CssSyntaxError = CssSyntaxError;
	postcss.Declaration = Declaration;
	postcss.Container = Container;
	postcss.Processor = Processor;
	postcss.Document = Document;
	postcss.Comment = Comment;
	postcss.Warning = Warning;
	postcss.AtRule = AtRule;
	postcss.Result = Result;
	postcss.Input = Input;
	postcss.Rule = Rule;
	postcss.Root = Root;
	postcss.Node = Node;
	LazyResult.registerPostcss(postcss);
	postcss_1 = postcss;
	postcss.default = postcss;
	return postcss_1;
}

var sanitizeHtml_1;
var hasRequiredSanitizeHtml;

function requireSanitizeHtml () {
	if (hasRequiredSanitizeHtml) return sanitizeHtml_1;
	hasRequiredSanitizeHtml = 1;
	const htmlparser = /*@__PURE__*/ requireLib();
	const escapeStringRegexp = requireEscapeStringRegexp();
	const { isPlainObject } = requireIsPlainObject();
	const deepmerge = requireCjs();
	const parseSrcset = requireParseSrcset();
	const { parse: postcssParse } = requirePostcss();
	// Tags that can conceivably represent stand-alone media.
	const mediaTags = [
	  'img', 'audio', 'video', 'picture', 'svg',
	  'object', 'map', 'iframe', 'embed'
	];
	// Tags that are inherently vulnerable to being used in XSS attacks.
	const vulnerableTags = [ 'script', 'style' ];

	function each(obj, cb) {
	  if (obj) {
	    Object.keys(obj).forEach(function (key) {
	      cb(obj[key], key);
	    });
	  }
	}

	// Avoid false positives with .__proto__, .hasOwnProperty, etc.
	function has(obj, key) {
	  return ({}).hasOwnProperty.call(obj, key);
	}

	// Returns those elements of `a` for which `cb(a)` returns truthy
	function filter(a, cb) {
	  const n = [];
	  each(a, function(v) {
	    if (cb(v)) {
	      n.push(v);
	    }
	  });
	  return n;
	}

	function isEmptyObject(obj) {
	  for (const key in obj) {
	    if (has(obj, key)) {
	      return false;
	    }
	  }
	  return true;
	}

	function stringifySrcset(parsedSrcset) {
	  return parsedSrcset.map(function(part) {
	    if (!part.url) {
	      throw new Error('URL missing');
	    }

	    return (
	      part.url +
	      (part.w ? ` ${part.w}w` : '') +
	      (part.h ? ` ${part.h}h` : '') +
	      (part.d ? ` ${part.d}x` : '')
	    );
	  }).join(', ');
	}

	sanitizeHtml_1 = sanitizeHtml;

	// A valid attribute name.
	// We use a tolerant definition based on the set of strings defined by
	// html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state
	// and html.spec.whatwg.org/multipage/parsing.html#attribute-name-state .
	// The characters accepted are ones which can be appended to the attribute
	// name buffer without triggering a parse error:
	//   * unexpected-equals-sign-before-attribute-name
	//   * unexpected-null-character
	//   * unexpected-character-in-attribute-name
	// We exclude the empty string because it's impossible to get to the after
	// attribute name state with an empty attribute name buffer.
	const VALID_HTML_ATTRIBUTE_NAME = /^[^\0\t\n\f\r /<=>]+$/;

	// Ignore the _recursing flag; it's there for recursive
	// invocation as a guard against this exploit:
	// https://github.com/fb55/htmlparser2/issues/105

	function sanitizeHtml(html, options, _recursing) {
	  if (html == null) {
	    return '';
	  }
	  if (typeof html === 'number') {
	    html = html.toString();
	  }

	  let result = '';
	  // Used for hot swapping the result variable with an empty string in order to "capture" the text written to it.
	  let tempResult = '';

	  function Frame(tag, attribs) {
	    const that = this;
	    this.tag = tag;
	    this.attribs = attribs || {};
	    this.tagPosition = result.length;
	    this.text = ''; // Node inner text
	    this.openingTagLength = 0;
	    this.mediaChildren = [];

	    this.updateParentNodeText = function() {
	      if (stack.length) {
	        const parentFrame = stack[stack.length - 1];
	        parentFrame.text += that.text;
	      }
	    };

	    this.updateParentNodeMediaChildren = function() {
	      if (stack.length && mediaTags.includes(this.tag)) {
	        const parentFrame = stack[stack.length - 1];
	        parentFrame.mediaChildren.push(this.tag);
	      }
	    };
	  }

	  options = Object.assign({}, sanitizeHtml.defaults, options);
	  options.parser = Object.assign({}, htmlParserDefaults, options.parser);

	  const tagAllowed = function (name) {
	    return options.allowedTags === false || (options.allowedTags || []).indexOf(name) > -1;
	  };

	  // vulnerableTags
	  vulnerableTags.forEach(function (tag) {
	    if (tagAllowed(tag) && !options.allowVulnerableTags) {
	      console.warn(`\n\n⚠️ Your \`allowedTags\` option includes, \`${tag}\`, which is inherently\nvulnerable to XSS attacks. Please remove it from \`allowedTags\`.\nOr, to disable this warning, add the \`allowVulnerableTags\` option\nand ensure you are accounting for this risk.\n\n`);
	    }
	  });

	  // Tags that contain something other than HTML, or where discarding
	  // the text when the tag is disallowed makes sense for other reasons.
	  // If we are not allowing these tags, we should drop their content too.
	  // For other tags you would drop the tag but keep its content.
	  const nonTextTagsArray = options.nonTextTags || [
	    'script',
	    'style',
	    'textarea',
	    'option'
	  ];
	  let allowedAttributesMap;
	  let allowedAttributesGlobMap;
	  if (options.allowedAttributes) {
	    allowedAttributesMap = {};
	    allowedAttributesGlobMap = {};
	    each(options.allowedAttributes, function(attributes, tag) {
	      allowedAttributesMap[tag] = [];
	      const globRegex = [];
	      attributes.forEach(function(obj) {
	        if (typeof obj === 'string' && obj.indexOf('*') >= 0) {
	          globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, '.*'));
	        } else {
	          allowedAttributesMap[tag].push(obj);
	        }
	      });
	      if (globRegex.length) {
	        allowedAttributesGlobMap[tag] = new RegExp('^(' + globRegex.join('|') + ')$');
	      }
	    });
	  }
	  const allowedClassesMap = {};
	  const allowedClassesGlobMap = {};
	  const allowedClassesRegexMap = {};
	  each(options.allowedClasses, function(classes, tag) {
	    // Implicitly allows the class attribute
	    if (allowedAttributesMap) {
	      if (!has(allowedAttributesMap, tag)) {
	        allowedAttributesMap[tag] = [];
	      }
	      allowedAttributesMap[tag].push('class');
	    }

	    allowedClassesMap[tag] = classes;

	    if (Array.isArray(classes)) {
	      const globRegex = [];
	      allowedClassesMap[tag] = [];
	      allowedClassesRegexMap[tag] = [];
	      classes.forEach(function(obj) {
	        if (typeof obj === 'string' && obj.indexOf('*') >= 0) {
	          globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, '.*'));
	        } else if (obj instanceof RegExp) {
	          allowedClassesRegexMap[tag].push(obj);
	        } else {
	          allowedClassesMap[tag].push(obj);
	        }
	      });
	      if (globRegex.length) {
	        allowedClassesGlobMap[tag] = new RegExp('^(' + globRegex.join('|') + ')$');
	      }
	    }
	  });

	  const transformTagsMap = {};
	  let transformTagsAll;
	  each(options.transformTags, function(transform, tag) {
	    let transFun;
	    if (typeof transform === 'function') {
	      transFun = transform;
	    } else if (typeof transform === 'string') {
	      transFun = sanitizeHtml.simpleTransform(transform);
	    }
	    if (tag === '*') {
	      transformTagsAll = transFun;
	    } else {
	      transformTagsMap[tag] = transFun;
	    }
	  });

	  let depth;
	  let stack;
	  let skipMap;
	  let transformMap;
	  let skipText;
	  let skipTextDepth;
	  let addedText = false;

	  initializeState();

	  const parser = new htmlparser.Parser({
	    onopentag: function(name, attribs) {
	      if (options.onOpenTag) {
	        options.onOpenTag(name, attribs);
	      }

	      // If `enforceHtmlBoundary` is `true` and this has found the opening
	      // `html` tag, reset the state.
	      if (options.enforceHtmlBoundary && name === 'html') {
	        initializeState();
	      }

	      if (skipText) {
	        skipTextDepth++;
	        return;
	      }
	      const frame = new Frame(name, attribs);
	      stack.push(frame);

	      let skip = false;
	      const hasText = !!frame.text;
	      let transformedTag;
	      if (has(transformTagsMap, name)) {
	        transformedTag = transformTagsMap[name](name, attribs);

	        frame.attribs = attribs = transformedTag.attribs;

	        if (transformedTag.text !== undefined) {
	          frame.innerText = transformedTag.text;
	        }

	        if (name !== transformedTag.tagName) {
	          frame.name = name = transformedTag.tagName;
	          transformMap[depth] = transformedTag.tagName;
	        }
	      }
	      if (transformTagsAll) {
	        transformedTag = transformTagsAll(name, attribs);

	        frame.attribs = attribs = transformedTag.attribs;
	        if (name !== transformedTag.tagName) {
	          frame.name = name = transformedTag.tagName;
	          transformMap[depth] = transformedTag.tagName;
	        }
	      }

	      if (!tagAllowed(name) || (options.disallowedTagsMode === 'recursiveEscape' && !isEmptyObject(skipMap)) || (options.nestingLimit != null && depth >= options.nestingLimit)) {
	        skip = true;
	        skipMap[depth] = true;
	        if (options.disallowedTagsMode === 'discard' || options.disallowedTagsMode === 'completelyDiscard') {
	          if (nonTextTagsArray.indexOf(name) !== -1) {
	            skipText = true;
	            skipTextDepth = 1;
	          }
	        }
	      }
	      depth++;
	      if (skip) {
	        if (options.disallowedTagsMode === 'discard' || options.disallowedTagsMode === 'completelyDiscard') {
	          // We want the contents but not this tag
	          if (frame.innerText && !hasText) {
	            const escaped = escapeHtml(frame.innerText);
	            if (options.textFilter) {
	              result += options.textFilter(escaped, name);
	            } else {
	              result += escaped;
	            }
	            addedText = true;
	          }
	          return;
	        }
	        tempResult = result;
	        result = '';
	      }
	      result += '<' + name;

	      if (name === 'script') {
	        if (options.allowedScriptHostnames || options.allowedScriptDomains) {
	          frame.innerText = '';
	        }
	      }

	      const isBeingEscaped = skip && (options.disallowedTagsMode === 'escape' || options.disallowedTagsMode === 'recursiveEscape');
	      const shouldPreserveEscapedAttributes = isBeingEscaped && options.preserveEscapedAttributes;

	      if (shouldPreserveEscapedAttributes) {
	        each(attribs, function(value, a) {
	          result += ' ' + a + '="' + escapeHtml((value || ''), true) + '"';
	        });
	      } else if (!allowedAttributesMap || has(allowedAttributesMap, name) || allowedAttributesMap['*']) {
	        each(attribs, function(value, a) {
	          if (!VALID_HTML_ATTRIBUTE_NAME.test(a)) {
	            // This prevents part of an attribute name in the output from being
	            // interpreted as the end of an attribute, or end of a tag.
	            delete frame.attribs[a];
	            return;
	          }
	          // If the value is empty, check if the attribute is in the allowedEmptyAttributes array.
	          // If it is not in the allowedEmptyAttributes array, and it is a known non-boolean attribute, delete it
	          // List taken from https://html.spec.whatwg.org/multipage/indices.html#attributes-3
	          if (value === '' && (!options.allowedEmptyAttributes.includes(a)) &&
	            (options.nonBooleanAttributes.includes(a) || options.nonBooleanAttributes.includes('*'))) {
	            delete frame.attribs[a];
	            return;
	          }
	          // check allowedAttributesMap for the element and attribute and modify the value
	          // as necessary if there are specific values defined.
	          let passedAllowedAttributesMapCheck = false;
	          if (!allowedAttributesMap ||
	            (has(allowedAttributesMap, name) && allowedAttributesMap[name].indexOf(a) !== -1) ||
	            (allowedAttributesMap['*'] && allowedAttributesMap['*'].indexOf(a) !== -1) ||
	            (has(allowedAttributesGlobMap, name) && allowedAttributesGlobMap[name].test(a)) ||
	            (allowedAttributesGlobMap['*'] && allowedAttributesGlobMap['*'].test(a))) {
	            passedAllowedAttributesMapCheck = true;
	          } else if (allowedAttributesMap && allowedAttributesMap[name]) {
	            for (const o of allowedAttributesMap[name]) {
	              if (isPlainObject(o) && o.name && (o.name === a)) {
	                passedAllowedAttributesMapCheck = true;
	                let newValue = '';
	                if (o.multiple === true) {
	                  // verify the values that are allowed
	                  const splitStrArray = value.split(' ');
	                  for (const s of splitStrArray) {
	                    if (o.values.indexOf(s) !== -1) {
	                      if (newValue === '') {
	                        newValue = s;
	                      } else {
	                        newValue += ' ' + s;
	                      }
	                    }
	                  }
	                } else if (o.values.indexOf(value) >= 0) {
	                  // verified an allowed value matches the entire attribute value
	                  newValue = value;
	                }
	                value = newValue;
	              }
	            }
	          }
	          if (passedAllowedAttributesMapCheck) {
	            if (options.allowedSchemesAppliedToAttributes.indexOf(a) !== -1) {
	              if (naughtyHref(name, value)) {
	                delete frame.attribs[a];
	                return;
	              }
	            }

	            if (name === 'script' && a === 'src') {

	              let allowed = true;

	              try {
	                const parsed = parseUrl(value);

	                if (options.allowedScriptHostnames || options.allowedScriptDomains) {
	                  const allowedHostname = (options.allowedScriptHostnames || []).find(function (hostname) {
	                    return hostname === parsed.url.hostname;
	                  });
	                  const allowedDomain = (options.allowedScriptDomains || []).find(function(domain) {
	                    return parsed.url.hostname === domain || parsed.url.hostname.endsWith(`.${domain}`);
	                  });
	                  allowed = allowedHostname || allowedDomain;
	                }
	              } catch (e) {
	                allowed = false;
	              }

	              if (!allowed) {
	                delete frame.attribs[a];
	                return;
	              }
	            }

	            if (name === 'iframe' && a === 'src') {
	              let allowed = true;
	              try {
	                const parsed = parseUrl(value);

	                if (parsed.isRelativeUrl) {
	                  // default value of allowIframeRelativeUrls is true
	                  // unless allowedIframeHostnames or allowedIframeDomains specified
	                  allowed = has(options, 'allowIframeRelativeUrls')
	                    ? options.allowIframeRelativeUrls
	                    : (!options.allowedIframeHostnames && !options.allowedIframeDomains);
	                } else if (options.allowedIframeHostnames || options.allowedIframeDomains) {
	                  const allowedHostname = (options.allowedIframeHostnames || []).find(function (hostname) {
	                    return hostname === parsed.url.hostname;
	                  });
	                  const allowedDomain = (options.allowedIframeDomains || []).find(function(domain) {
	                    return parsed.url.hostname === domain || parsed.url.hostname.endsWith(`.${domain}`);
	                  });
	                  allowed = allowedHostname || allowedDomain;
	                }
	              } catch (e) {
	                // Unparseable iframe src
	                allowed = false;
	              }
	              if (!allowed) {
	                delete frame.attribs[a];
	                return;
	              }
	            }
	            if (a === 'srcset') {
	              try {
	                let parsed = parseSrcset(value);
	                parsed.forEach(function(value) {
	                  if (naughtyHref('srcset', value.url)) {
	                    value.evil = true;
	                  }
	                });
	                parsed = filter(parsed, function(v) {
	                  return !v.evil;
	                });
	                if (!parsed.length) {
	                  delete frame.attribs[a];
	                  return;
	                } else {
	                  value = stringifySrcset(filter(parsed, function(v) {
	                    return !v.evil;
	                  }));
	                  frame.attribs[a] = value;
	                }
	              } catch (e) {
	                // Unparseable srcset
	                delete frame.attribs[a];
	                return;
	              }
	            }
	            if (a === 'class') {
	              const allowedSpecificClasses = allowedClassesMap[name];
	              const allowedWildcardClasses = allowedClassesMap['*'];
	              const allowedSpecificClassesGlob = allowedClassesGlobMap[name];
	              const allowedSpecificClassesRegex = allowedClassesRegexMap[name];
	              const allowedWildcardClassesRegex = allowedClassesRegexMap['*'];
	              const allowedWildcardClassesGlob = allowedClassesGlobMap['*'];
	              const allowedClassesGlobs = [
	                allowedSpecificClassesGlob,
	                allowedWildcardClassesGlob
	              ]
	                .concat(allowedSpecificClassesRegex, allowedWildcardClassesRegex)
	                .filter(function (t) {
	                  return t;
	                });
	              if (allowedSpecificClasses && allowedWildcardClasses) {
	                value = filterClasses(value, deepmerge(allowedSpecificClasses, allowedWildcardClasses), allowedClassesGlobs);
	              } else {
	                value = filterClasses(value, allowedSpecificClasses || allowedWildcardClasses, allowedClassesGlobs);
	              }
	              if (!value.length) {
	                delete frame.attribs[a];
	                return;
	              }
	            }
	            if (a === 'style') {
	              if (options.parseStyleAttributes) {
	                try {
	                  const abstractSyntaxTree = postcssParse(name + ' {' + value + '}', { map: false });
	                  const filteredAST = filterCss(abstractSyntaxTree, options.allowedStyles);

	                  value = stringifyStyleAttributes(filteredAST);

	                  if (value.length === 0) {
	                    delete frame.attribs[a];
	                    return;
	                  }
	                } catch (e) {
	                  if (typeof window !== 'undefined') {
	                    console.warn('Failed to parse "' + name + ' {' + value + '}' + '", If you\'re running this in a browser, we recommend to disable style parsing: options.parseStyleAttributes: false, since this only works in a node environment due to a postcss dependency, More info: https://github.com/apostrophecms/sanitize-html/issues/547');
	                  }
	                  delete frame.attribs[a];
	                  return;
	                }
	              } else if (options.allowedStyles) {
	                throw new Error('allowedStyles option cannot be used together with parseStyleAttributes: false.');
	              }
	            }
	            result += ' ' + a;
	            if (value && value.length) {
	              result += '="' + escapeHtml(value, true) + '"';
	            } else if (options.allowedEmptyAttributes.includes(a)) {
	              result += '=""';
	            }
	          } else {
	            delete frame.attribs[a];
	          }
	        });
	      }
	      if (options.selfClosing.indexOf(name) !== -1) {
	        result += ' />';
	      } else {
	        result += '>';
	        if (frame.innerText && !hasText && !options.textFilter) {
	          result += escapeHtml(frame.innerText);
	          addedText = true;
	        }
	      }
	      if (skip) {
	        result = tempResult + escapeHtml(result);
	        tempResult = '';
	      }
	      frame.openingTagLength = result.length - frame.tagPosition;
	    },
	    ontext: function(text) {
	      if (skipText) {
	        return;
	      }
	      const lastFrame = stack[stack.length - 1];
	      let tag;

	      if (lastFrame) {
	        tag = lastFrame.tag;
	        // If inner text was set by transform function then let's use it
	        text = lastFrame.innerText !== undefined ? lastFrame.innerText : text;
	      }

	      if (options.disallowedTagsMode === 'completelyDiscard' && !tagAllowed(tag)) {
	        text = '';
	      } else if ((options.disallowedTagsMode === 'discard' || options.disallowedTagsMode === 'completelyDiscard') && ((tag === 'script') || (tag === 'style'))) {
	        // htmlparser2 gives us these as-is. Escaping them ruins the content. Allowing
	        // script tags is, by definition, game over for XSS protection, so if that's
	        // your concern, don't allow them. The same is essentially true for style tags
	        // which have their own collection of XSS vectors.
	        result += text;
	      } else if (!addedText) {
	        const escaped = escapeHtml(text, false);
	        if (options.textFilter) {
	          result += options.textFilter(escaped, tag);
	        } else {
	          result += escaped;
	        }
	      }
	      if (stack.length) {
	        const frame = stack[stack.length - 1];
	        frame.text += text;
	      }
	    },
	    onclosetag: function(name, isImplied) {
	      if (options.onCloseTag) {
	        options.onCloseTag(name, isImplied);
	      }

	      if (skipText) {
	        skipTextDepth--;
	        if (!skipTextDepth) {
	          skipText = false;
	        } else {
	          return;
	        }
	      }

	      const frame = stack.pop();
	      if (!frame) {
	        // Do not crash on bad markup
	        return;
	      }

	      if (frame.tag !== name) {
	        // Another case of bad markup.
	        // Push to stack, so that it will be used in future closing tags.
	        stack.push(frame);
	        return;
	      }

	      skipText = options.enforceHtmlBoundary ? name === 'html' : false;
	      depth--;
	      const skip = skipMap[depth];
	      if (skip) {
	        delete skipMap[depth];
	        if (options.disallowedTagsMode === 'discard' || options.disallowedTagsMode === 'completelyDiscard') {
	          frame.updateParentNodeText();
	          return;
	        }
	        tempResult = result;
	        result = '';
	      }

	      if (transformMap[depth]) {
	        name = transformMap[depth];
	        delete transformMap[depth];
	      }

	      if (options.exclusiveFilter) {
	        const filterResult = options.exclusiveFilter(frame);
	        if (filterResult === 'excludeTag') {
	          if (skip) {
	            // no longer escaping the tag since it's not added at all
	            result = tempResult;
	            tempResult = '';
	          }
	          // remove the opening tag from the result
	          result = result.substring(0, frame.tagPosition) + result.substring(frame.tagPosition + frame.openingTagLength);
	          return;
	        } else if (filterResult) {
	          result = result.substring(0, frame.tagPosition);
	          return;
	        }
	      }

	      frame.updateParentNodeMediaChildren();
	      frame.updateParentNodeText();

	      if (
	        // Already output />
	        options.selfClosing.indexOf(name) !== -1 ||
	        // Escaped tag, closing tag is implied
	        (isImplied && !tagAllowed(name) && [ 'escape', 'recursiveEscape' ].indexOf(options.disallowedTagsMode) >= 0)
	      ) {
	        if (skip) {
	          result = tempResult;
	          tempResult = '';
	        }
	        return;
	      }

	      result += '</' + name + '>';
	      if (skip) {
	        result = tempResult + escapeHtml(result);
	        tempResult = '';
	      }
	      addedText = false;
	    }
	  }, options.parser);
	  parser.write(html);
	  parser.end();

	  return result;

	  function initializeState() {
	    result = '';
	    depth = 0;
	    stack = [];
	    skipMap = {};
	    transformMap = {};
	    skipText = false;
	    skipTextDepth = 0;
	  }

	  function escapeHtml(s, quote) {
	    if (typeof (s) !== 'string') {
	      s = s + '';
	    }
	    if (options.parser.decodeEntities) {
	      s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	      if (quote) {
	        s = s.replace(/"/g, '&quot;');
	      }
	    }
	    // TODO: this is inadequate because it will pass `&0;`. This approach
	    // will not work, each & must be considered with regard to whether it
	    // is followed by a 100% syntactically valid entity or not, and escaped
	    // if it is not. If this bothers you, don't set parser.decodeEntities
	    // to false. (The default is true.)
	    s = s.replace(/&(?![a-zA-Z0-9#]{1,20};)/g, '&amp;') // Match ampersands not part of existing HTML entity
	      .replace(/</g, '&lt;')
	      .replace(/>/g, '&gt;');
	    if (quote) {
	      s = s.replace(/"/g, '&quot;');
	    }
	    return s;
	  }

	  function naughtyHref(name, href) {
	    // Browsers ignore character codes of 32 (space) and below in a surprising
	    // number of situations. Start reading here:
	    // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet#Embedded_tab
	    // eslint-disable-next-line no-control-regex
	    href = href.replace(/[\x00-\x20]+/g, '');
	    // Clobber any comments in URLs, which the browser might
	    // interpret inside an XML data island, allowing
	    // a javascript: URL to be snuck through
	    while (true) {
	      const firstIndex = href.indexOf('<!--');
	      if (firstIndex === -1) {
	        break;
	      }
	      const lastIndex = href.indexOf('-->', firstIndex + 4);
	      if (lastIndex === -1) {
	        break;
	      }
	      href = href.substring(0, firstIndex) + href.substring(lastIndex + 3);
	    }
	    // Case insensitive so we don't get faked out by JAVASCRIPT #1
	    // Allow more characters after the first so we don't get faked
	    // out by certain schemes browsers accept
	    const matches = href.match(/^([a-zA-Z][a-zA-Z0-9.\-+]*):/);
	    if (!matches) {
	      // Protocol-relative URL starting with any combination of '/' and '\'
	      if (href.match(/^[/\\]{2}/)) {
	        return !options.allowProtocolRelative;
	      }

	      // No scheme
	      return false;
	    }
	    const scheme = matches[1].toLowerCase();

	    if (has(options.allowedSchemesByTag, name)) {
	      return options.allowedSchemesByTag[name].indexOf(scheme) === -1;
	    }

	    return !options.allowedSchemes || options.allowedSchemes.indexOf(scheme) === -1;
	  }

	  function parseUrl(value) {
	    value = value.replace(/^(\w+:)?\s*[\\/]\s*[\\/]/, '$1//');
	    if (value.startsWith('relative:')) {
	      // An attempt to exploit our workaround for base URLs being
	      // mandatory for relative URL validation in the WHATWG
	      // URL parser, reject it
	      throw new Error('relative: exploit attempt');
	    }
	    // naughtyHref is in charge of whether protocol relative URLs
	    // are cool. Here we are concerned just with allowed hostnames and
	    // whether to allow relative URLs.
	    //
	    // Build a placeholder "base URL" against which any reasonable
	    // relative URL may be parsed successfully
	    let base = 'relative://relative-site';
	    for (let i = 0; (i < 100); i++) {
	      base += `/${i}`;
	    }

	    const parsed = new URL(value, base);

	    const isRelativeUrl = parsed && parsed.hostname === 'relative-site' && parsed.protocol === 'relative:';
	    return {
	      isRelativeUrl,
	      url: parsed
	    };
	  }
	  /**
	   * Filters user input css properties by allowlisted regex attributes.
	   * Modifies the abstractSyntaxTree object.
	   *
	   * @param {object} abstractSyntaxTree  - Object representation of CSS attributes.
	   * @property {array[Declaration]} abstractSyntaxTree.nodes[0] - Each object cointains prop and value key, i.e { prop: 'color', value: 'red' }.
	   * @param {object} allowedStyles       - Keys are properties (i.e color), value is list of permitted regex rules (i.e /green/i).
	   * @return {object}                    - The modified tree.
	   */
	  function filterCss(abstractSyntaxTree, allowedStyles) {
	    if (!allowedStyles) {
	      return abstractSyntaxTree;
	    }

	    const astRules = abstractSyntaxTree.nodes[0];
	    let selectedRule;

	    // Merge global and tag-specific styles into new AST.
	    if (allowedStyles[astRules.selector] && allowedStyles['*']) {
	      selectedRule = deepmerge(
	        allowedStyles[astRules.selector],
	        allowedStyles['*']
	      );
	    } else {
	      selectedRule = allowedStyles[astRules.selector] || allowedStyles['*'];
	    }

	    if (selectedRule) {
	      abstractSyntaxTree.nodes[0].nodes = astRules.nodes.reduce(filterDeclarations(selectedRule), []);
	    }

	    return abstractSyntaxTree;
	  }

	  /**
	   * Extracts the style attributes from an AbstractSyntaxTree and formats those
	   * values in the inline style attribute format.
	   *
	   * @param  {AbstractSyntaxTree} filteredAST
	   * @return {string}             - Example: "color:yellow;text-align:center !important;font-family:helvetica;"
	   */
	  function stringifyStyleAttributes(filteredAST) {
	    return filteredAST.nodes[0].nodes
	      .reduce(function(extractedAttributes, attrObject) {
	        extractedAttributes.push(
	          `${attrObject.prop}:${attrObject.value}${attrObject.important ? ' !important' : ''}`
	        );
	        return extractedAttributes;
	      }, [])
	      .join(';');
	  }

	  /**
	    * Filters the existing attributes for the given property. Discards any attributes
	    * which don't match the allowlist.
	    *
	    * @param  {object} selectedRule             - Example: { color: red, font-family: helvetica }
	    * @param  {array} allowedDeclarationsList   - List of declarations which pass the allowlist.
	    * @param  {object} attributeObject          - Object representing the current css property.
	    * @property {string} attributeObject.type   - Typically 'declaration'.
	    * @property {string} attributeObject.prop   - The CSS property, i.e 'color'.
	    * @property {string} attributeObject.value  - The corresponding value to the css property, i.e 'red'.
	    * @return {function}                        - When used in Array.reduce, will return an array of Declaration objects
	    */
	  function filterDeclarations(selectedRule) {
	    return function (allowedDeclarationsList, attributeObject) {
	      // If this property is allowlisted...
	      if (has(selectedRule, attributeObject.prop)) {
	        const matchesRegex = selectedRule[attributeObject.prop].some(function(regularExpression) {
	          return regularExpression.test(attributeObject.value);
	        });

	        if (matchesRegex) {
	          allowedDeclarationsList.push(attributeObject);
	        }
	      }
	      return allowedDeclarationsList;
	    };
	  }

	  function filterClasses(classes, allowed, allowedGlobs) {
	    if (!allowed) {
	      // The class attribute is allowed without filtering on this tag
	      return classes;
	    }
	    classes = classes.split(/\s+/);
	    return classes.filter(function(clss) {
	      return allowed.indexOf(clss) !== -1 || allowedGlobs.some(function(glob) {
	        return glob.test(clss);
	      });
	    }).join(' ');
	  }
	}

	// Defaults are accessible to you so that you can use them as a starting point
	// programmatically if you wish

	const htmlParserDefaults = {
	  decodeEntities: true
	};
	sanitizeHtml.defaults = {
	  allowedTags: [
	    // Sections derived from MDN element categories and limited to the more
	    // benign categories.
	    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
	    // Content sectioning
	    'address', 'article', 'aside', 'footer', 'header',
	    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup',
	    'main', 'nav', 'section',
	    // Text content
	    'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure',
	    'hr', 'li', 'menu', 'ol', 'p', 'pre', 'ul',
	    // Inline text semantics
	    'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn',
	    'em', 'i', 'kbd', 'mark', 'q',
	    'rb', 'rp', 'rt', 'rtc', 'ruby',
	    's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr',
	    // Table content
	    'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th',
	    'thead', 'tr'
	  ],
	  // Tags that cannot be boolean
	  nonBooleanAttributes: [
	    'abbr', 'accept', 'accept-charset', 'accesskey', 'action',
	    'allow', 'alt', 'as', 'autocapitalize', 'autocomplete',
	    'blocking', 'charset', 'cite', 'class', 'color', 'cols',
	    'colspan', 'content', 'contenteditable', 'coords', 'crossorigin',
	    'data', 'datetime', 'decoding', 'dir', 'dirname', 'download',
	    'draggable', 'enctype', 'enterkeyhint', 'fetchpriority', 'for',
	    'form', 'formaction', 'formenctype', 'formmethod', 'formtarget',
	    'headers', 'height', 'hidden', 'high', 'href', 'hreflang',
	    'http-equiv', 'id', 'imagesizes', 'imagesrcset', 'inputmode',
	    'integrity', 'is', 'itemid', 'itemprop', 'itemref', 'itemtype',
	    'kind', 'label', 'lang', 'list', 'loading', 'low', 'max',
	    'maxlength', 'media', 'method', 'min', 'minlength', 'name',
	    'nonce', 'optimum', 'pattern', 'ping', 'placeholder', 'popover',
	    'popovertarget', 'popovertargetaction', 'poster', 'preload',
	    'referrerpolicy', 'rel', 'rows', 'rowspan', 'sandbox', 'scope',
	    'shape', 'size', 'sizes', 'slot', 'span', 'spellcheck', 'src',
	    'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style',
	    'tabindex', 'target', 'title', 'translate', 'type', 'usemap',
	    'value', 'width', 'wrap',
	    // Event handlers
	    'onauxclick', 'onafterprint', 'onbeforematch', 'onbeforeprint',
	    'onbeforeunload', 'onbeforetoggle', 'onblur', 'oncancel',
	    'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose',
	    'oncontextlost', 'oncontextmenu', 'oncontextrestored', 'oncopy',
	    'oncuechange', 'oncut', 'ondblclick', 'ondrag', 'ondragend',
	    'ondragenter', 'ondragleave', 'ondragover', 'ondragstart',
	    'ondrop', 'ondurationchange', 'onemptied', 'onended',
	    'onerror', 'onfocus', 'onformdata', 'onhashchange', 'oninput',
	    'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup',
	    'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata',
	    'onloadstart', 'onmessage', 'onmessageerror', 'onmousedown',
	    'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout',
	    'onmouseover', 'onmouseup', 'onoffline', 'ononline', 'onpagehide',
	    'onpageshow', 'onpaste', 'onpause', 'onplay', 'onplaying',
	    'onpopstate', 'onprogress', 'onratechange', 'onreset', 'onresize',
	    'onrejectionhandled', 'onscroll', 'onscrollend',
	    'onsecuritypolicyviolation', 'onseeked', 'onseeking', 'onselect',
	    'onslotchange', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend',
	    'ontimeupdate', 'ontoggle', 'onunhandledrejection', 'onunload',
	    'onvolumechange', 'onwaiting', 'onwheel'
	  ],
	  disallowedTagsMode: 'discard',
	  allowedAttributes: {
	    a: [ 'href', 'name', 'target' ],
	    // We don't currently allow img itself by default, but
	    // these attributes would make sense if we did.
	    img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
	  },
	  allowedEmptyAttributes: [
	    'alt'
	  ],
	  // Lots of these won't come up by default because we don't allow them
	  selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
	  // URL schemes we permit
	  allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
	  allowedSchemesByTag: {},
	  allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
	  allowProtocolRelative: true,
	  enforceHtmlBoundary: false,
	  parseStyleAttributes: true,
	  preserveEscapedAttributes: false
	};

	sanitizeHtml.simpleTransform = function(newTagName, newAttribs, merge) {
	  merge = (merge === undefined) ? true : merge;
	  newAttribs = newAttribs || {};

	  return function(tagName, attribs) {
	    let attrib;
	    if (merge) {
	      for (attrib in newAttribs) {
	        attribs[attrib] = newAttribs[attrib];
	      }
	    } else {
	      attribs = newAttribs;
	    }

	    return {
	      tagName: newTagName,
	      attribs: attribs
	    };
	  };
	};
	return sanitizeHtml_1;
}

var sanitizeHtmlExports = /*@__PURE__*/ requireSanitizeHtml();
const sanitizeHtml = /*@__PURE__*/getDefaultExportFromCjs(sanitizeHtmlExports);

export { sanitizeHtml as s };
