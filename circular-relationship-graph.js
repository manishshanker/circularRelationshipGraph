/**
 * Copyright 2012 Manish Shanker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author Manish Shanker
 */
 
(function() {
    "use strict";

	function RSG(options) {
	
		var paper;
		var radius;
		var nodes = {};
		var nodesCount = 0;
		var aRadian;
		var centerXY;

		function plotNode(item) {
			var nodeObject = nodes[item.replace(/ /g, "")];
			if (!nodeObject) {
				var x = Math.cos(aRadian*nodesCount) * radius + centerXY;
				var y = Math.sin(aRadian*nodesCount) * radius + centerXY;
				var node = paper.circle(x, y, 5);
				paper.text(x+10 , y+10, item);
				//var node = paper.path(Raphael.format("M {0} {1} T {2} {3}", lastCordinate.x, lastCordinate.y, x, y));
				node.attr({fill: "red"});
				nodeObject = {
					node: node,
					x: x,
					y: y,
					nodeConnectors: [],
					label: item
				};
				nodes[item.replace(/ /g, "")] = nodeObject;
				nodesCount++;
				node.hover(nodeHoverIn, nodeHoverOut, nodeObject, nodeObject);
			}
			return nodeObject;
		}
	
		function nodeHoverIn() {
			//this.node.attr({stroke: "red"}) // = this.node.glow();
			for (var i= 0, l = this.nodeConnectors.length; i<l; i++) {
				this.nodeConnectors[i].oldAlpha = this.nodeConnectors[i].attr("opacity");
				this.nodeConnectors[i].animate({"opacity": 1}, 500);
				this.nodeConnectors[i].animate({stroke: "red"}, 500);
			}
		}
		
		function nodeHoverOut() {
			//this.node.attr({stroke: "black"});
			for (var i= 0, l = this.nodeConnectors.length; i<l; i++) {
				this.nodeConnectors[i].animate({"opacity": this.nodeConnectors[i].oldAlpha}, 500);
				this.nodeConnectors[i].animate({stroke: "#CCCCCC"}, 500);	
			}
		}
		
		function plotNodeConnector(nodeFrom, nodeTo, strength) {
			var nodeConnector = paper.path(Raphael.format("M {0} {1} Q {2} {2} {3} {4}", nodeFrom.x, nodeFrom.y, centerXY, nodeTo.x, nodeTo.y));			
			//nodeConnector.attr({stroke: "#CCCCCC", opacity: strength/options.maxStrength});
			//nodeConnector.attr({stroke: "#CCCCCC", "stroke-width": strength, opacity: 0.5});
			nodeConnector.attr({stroke: "#CCCCCC", "stroke-width": (strength/options.maxStrength)*5, opacity: 0.6});
			nodeConnector.toBack();
			nodeFrom.nodeConnectors.push(nodeConnector);
			nodeTo.nodeConnectors.push(nodeConnector);
			return nodeConnector;  		
		}
		
		

		function plot() {
			paper = Raphael("relationshipChart", options.widthAndHeight, options.widthAndHeight);
			radius = options.widthAndHeight/2-20;
			centerXY = radius+20;
			aRadian = (2*Math.PI)/options.uniqueNodeCount;
			//paper.circle(centerXY, centerXY, radius);
			for (var i= 0, l = options.relationships.length; i<l; i++) {
				var nodeFrom = plotNode(options.relationships[i].from);
				var nodeTo = plotNode(options.relationships[i].to);
				plotNodeConnector(nodeFrom, nodeTo, options.relationships[i].strength);
			}
		}
		
		return {
			plot: plot
		};		
	}

    window.RSG = RSG;
}());