define([
	"dojo/dom", "dojo/_base/window", "dojo/_base/lang", "./_base", "./svg", "./svg/_base"
], function (dom, win, lang, gfx, svg, svgUtils) {

	/*=====
	 return {
	 // summary:
	 //		A module that adds svg-specific features to the gfx api. You should require this module
	 //		when your application specifically targets the SVG renderer.
	 }
	 =====*/

	var svgext = gfx.svgext = {};
	var toIgnore = {
		primitives: null,
		tag: null,
		children: null
	};

	function buildFilterPrimitivesDOM(primitive, parentNode) {
		var node = parentNode.ownerDocument.createElementNS(svgUtils.xmlns.svg, primitive.tag);
		parentNode.appendChild(node);
		for (var p in primitive) {
			if (!(p in toIgnore)) {
				node.setAttribute(p, primitive[p]);
			}
		}
		if (primitive.children) {
			primitive.children.forEach(function (f) {
				buildFilterPrimitivesDOM(f, node);
			});
		}
		return node;
	}

	/*=====
	 dcl(null, {
	 // summary:
	 //		Represents an SVG filter primitive.
	 // description:
	 //		In addition to the following properties, a FilterPrimitiveArgs should define the properties specific to
	 //		this primitive, as defined by the SVG spec.
	 // example:
	 //		Define a simple feGaussianBlur primitive:
	 //	|	var blurPrimitive = {
	 //	|		"tag": "feGaussianBlur",
	 //	|		"in": "SourceAlpha",
	 //	|		"stdDeviation":"4",
	 //	|		"result":"blur"
	 //	|	};
	 //
	 // example:
	 //		Define a feSpecularLighting primitive with one fePointLight child
	 //	|	var lighting = {
	 //	|		"tag": "feSpecularLighting",
	 //	|		"in":"blur",
	 //	|		"surfaceScale":5,
	 //	|		"specularConstant":.75,
	 //	|		"specularExponent":20,
	 //	|		"lighting-color":"#bbbbbb",
	 //	|		"result":"specOut"
	 //	|		"children": [
	 //	|			"tag": "fePointLight"
	 //	|			"x":-5000,
	 //	|			"y":-10000,
	 //	|			"z":20000
	 //	|		]
	 //	|	};

	 declaredClass: "gfx.svgext.__FilterPrimitiveArgs",

	 // tag: String?
	 //		The type of the primitive, as specified by the SVG spec (http://www.w3.org/TR/SVG/filters.html)
	 tag: null,

	 // children: gfx.svgext.__FilterPrimitiveArgs[]?
	 //		An array of child primitives, if any.
	 children: null
	 });
	 =====*/


	/*=====
	 dcl(null, {
	 // summary:
	 //		The filter arguments passed to the gfx/svgext/Shape.setFilter method.
	 // description:
	 //		An object defining the properties of a SVG Filter.
	 // example:
	 //		Define a drop shadow filter:
	 //	|	var filter = {
	 //	|		"id": "fastSmallDropShadow",
	 //	|		"x": "-10%",
	 //	|		"y": "-10%",
	 //	|		"width": "125%",
	 //	|		"height": "125%",
	 //	|		"primitives": [{
	 //	|			"tag": "feColorMatrix",
	 //	|			"in": "SourceAlpha",
	 //	|			"type": "matrix",
	 //	|			"result": "grey",
	 //	|		"values": "0.2125,0.7154,0.0721,0,0,0.2125,0.7154,0.0721,0,0,0.2125,0.7154,0.0721,0,0,0,0,0,0.7,0"
	 //	|		},{
	 //	|			"tag": "feOffset",
	 //	|			"dx": 3,
	 //	|			"dy": 3,
	 //	|			"result": "offsetBlur"
	 //	|		},{
	 //	|			"tag": "feMerge",
	 //	|			"children":[{
	 //	|				"tag": "feMergeNode",
	 //	|				"in": "offsetBlur"
	 //	|			},{
	 //	|				"tag": "feMergeNode",
	 //	|				"in": "SourceGraphic"
	 //	|			}]
	 //	|		}]
	 //	|	};

	 declaredClass: "gfx.svgext.__FilterArgs",

	 // id: String?
	 //		The filter identifier. If none is provided, a generated id will be used.
	 id: null,

	 // filterUnits: String?
	 //		The coordinate system of the filter. Default is "userSpaceOnUse".
	 filterUnits: "userSpaceOnUse",

	 // primitives: gfx.svgext.__FilterPrimitiveArgs[]
	 //		An array of filter primitives that define this filter.
	 primitives: []
	 });
	 =====*/

	lang.extend(svg.Shape, {
		addRenderingOption: function (/*String*/option, /*String*/value) {
			// summary:
			//		Adds the specified SVG rendering option on this shape.
			// option: String
			//		The name of the rendering option to add to this shape, as specified by the
			//		SVG specification (http://www.w3.org/TR/SVG/painting.html#RenderingProperties)
			// value: String
			//		the option value.
			this.rawNode.setAttribute(option, value);
			return this; // self
		},

		setFilter: function (/*gfx.svgext.__FilterArgs*/filter) {
			// summary:
			//		Sets the specified SVG Filter on this shape.
			// filter: gfx.svgext.__FilterArgs
			//		An object that defines the filter properties. Note that in order to make the creation of such
			//		filter easier, the gfx/filters module defines both a simple API to easily create filter objects
			//		and also a set of predefined filters like drop shadows, blurs, textures effects (among others).
			// example:
			//		Sets a drop shadow filter:
			//	|	var filter = {
			//	|		"id": "fastSmallDropShadow",
			//	|		"x": "-10%",
			//	|		"y": "-10%",
			//	|		"width": "125%",
			//	|		"height": "125%",
			//	|		"primitives": [{
			//	|			"tag": "feColorMatrix",
			//	|			"in": "SourceAlpha",
			//	|			"type": "matrix",
			//	|			"result": "grey",
			//	| "values": "0.2125,0.7154,0.0721,0,0,0.2125,0.7154,0.0721,0,0,0.2125,0.7154,0.0721,0,0,0,0,0,0.7,0"
			//	|		},{
			//	|			"tag": "feOffset",
			//	|			"dx": 3,
			//	|			"dy": 3,
			//	|			"result": "offsetBlur"
			//	|		},{
			//	|			"tag": "feMerge",
			//	|			"in": "offsetBlur",
			//	|			"in2": "SourceGraphic"
			//	|		}]
			//	|	};
			//	|	var shape = surface.createRect().setFilter(filter);
			//
			// example:
			//		Sets a predefined filter from the gfx/filters module:
			//	|	require(["gfx/filters","gfx/svgext",...], function(filters, svgext){
			//	|		...
			//	|		var filter = filters.textures.paper({"id":"myFilter","x":0,"y":0,"width":100,"height":100});
			//	|		var shape = surface.createRect().setFilter(filter);

			if (!filter) {
				this.rawNode.removeAttribute("filter");
				this.filter = null;
				return this;
			}
			this.filter = filter;
			filter.id = filter.id || gfx._getUniqueId();
			var filterNode = dom.byId(filter.id);
			if (!filterNode) {
				filterNode = this.rawNode.ownerDocument.createElementNS(svgUtils.xmlns.svg, "filter");
				filterNode.setAttribute("filterUnits", "userSpaceOnUse");
				for (var p in filter) {
					if (!(p in toIgnore)) {
						filterNode.setAttribute(p, filter[p]);
					}
				}
				filter.primitives.forEach(function (p) {
					buildFilterPrimitivesDOM(p, filterNode);
				});
				var surface = this._getParentSurface();
				if (surface) {
					var defs = surface.defNode;
					defs.appendChild(filterNode);
				}
			}
			this.rawNode.setAttribute("filter", "url(#" + filter.id + ")");
			return this;
		},

		getFilter: function () {
			// summary:
			//		Gets the shape SVG Filter.
			return this.filter;
		}
	});
	return svgext;
});
