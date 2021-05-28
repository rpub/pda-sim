// **************************************************************	
// Graph class
// **************************************************************
export default class Graph{

	constructor(){
		this.cy = null;
        this.elements = [];
    }

    addNode(name){
        this.elements.push({
            data: { id: name}
        });
    }
	
	addStartNode(name){
        this.elements.push({
            data: { id: name, label: "start" }
        });
    }
	
	addAcceptNode(name){
        this.elements.push({
            data: { id: name, label: "accept" }
        });
    }
	
	addStartAcceptNode(name){
        this.elements.push({
            data: { id: name, label: "start-accept" }
        });
    }

	addEdge(label, source, target) {
		this.elements.push({
			data: { label: label, source: source, target: target }
		});
	}

	generate(){
		this.cy = cytoscape({
			container: document.getElementById("cy"), // container to render in
			boxSelectionEnabled: false,
			autounselectify: true,
		
			elements: this.elements,
			style: [
				{
				selector: "node",
				style: {
					shape: "ellipse",
					content: "data(id)",
					"text-valign": "center",
					"text-halign": "center",
					"width": 25,
					"height": 25,
					borderWidth: 0.25,
					borderColor: "#eceff1",
					fontSize: 6,
					"font-family": "Monaco, monospace",          
					backgroundColor: "#eceff1"
				}
				},
				{
					selector: "node[label = 'start']",
					style: {
						"background-color": "#ffffff"
					}
				},
				{
					selector: "node[label = 'accept']",
					style: {
						"border-color": "#00ff00",
					}
				},
				{
					selector: "node[label = 'start-accept']",
					style: {
						"background-color": "#ffffff",
						"border-color": "#00ff00",
					}
				},
				{
					selector: "edge",
					style: {
						fontSize: 5,
						textBackgroundColor: "#ffffff",
						textBackgroundPadding: 3,
						textWrap: "wrap",
						targetDistanceFromNode: 2,

						width: 1,
						"line-color": "#eceff1",
						targetArrowColor: "#eceff1",
						targetArrowShape: "triangle",
						curveStyle: "bezier",
						"label": "data(label)",
						"z-index": 100

					}
				}
			],

			layout: {
				
				name: 'cose',			  
				animate: false,  

				// Whether to fit the network view after when done
				fit: true,
			  
				// Padding on fit
				padding: 30,
			  
				// Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
				boundingBox: undefined,
			  
				// Excludes the label when calculating node bounding boxes for the layout algorithm
				nodeDimensionsIncludeLabels: false,
			  
				// Randomize the initial positions of the nodes (true) or use existing positions (false)
				randomize: true,
			  
				// Extra spacing between components in non-compound graphs
				componentSpacing: 40,
			  
				// Node repulsion (non overlapping) multiplier
				nodeRepulsion: function( node ){ return 2048; },
			  
				// Node repulsion (overlapping) multiplier
				nodeOverlap: 4,
			  
				// Ideal edge (non nested) length
				idealEdgeLength: function( edge ){ return 32; },
			  
				// Divisor to compute edge forces
				edgeElasticity: function( edge ){ return 32; },
			  
				// Nesting factor (multiplier) to compute ideal edge length for nested edges
				nestingFactor: 1.2,
			  
				// Gravity force (constant)
				gravity: 1,
			  
				// Maximum number of iterations to perform
				numIter: 1000,
			  
				// Initial temperature (maximum node displacement)
				initialTemp: 1000,
			  
				// Cooling factor (how the temperature is reduced between consecutive iterations
				coolingFactor: 0.99,
			  
				// Lower temperature threshold (below this point the layout will end)
				minTemp: 1.0
				
				// name: 'cose-bilkent',
				// randomize: true,
				// idealEdgeLength: 100,
				// animate: false,

				// avoidOverlap: true,
				// avoidOverlapPadding: 30, // extra spacing around nodes when avoidOverlap: true
				// nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
				// spacingFactor: 1, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
				// condense: true, // uses all available space on false, uses minimal space on true
				// rows: undefined, // force num of rows in the grid
				// cols: undefined, // force num of columns in the grid

				// fit: true,
				// padding: 30,
				// boundingBox: undefined
			  }
		});
	}
};

let graph = new Graph();
for (var i = 0; i < 6; i++) {
	graph.addNode(i);
}

graph.addEdge(1, 2, 4);
graph.addEdge(1, 1, 1);

graph.generate();

// var elem = [];

// for (var i = 0; i < 6; i++) {
//   addState(i);
// }

// addEdge(1, 2, 4);
// addEdge(1, 1, 1);

// function addState(name) {
//   elem.push({
//     data: { id: name }
//   });
// }

// elem.push({
//   data: { id: 8, label: "initial" }
// });

// function addEdge(label, source, target) {
//   elem.push({
//     data: { label: label, source: source, target: target }
//   });
// }

// **************************************************************
// GRAPH GENERATOR
// Original source: 
// David Khourshid (https://codepen.io/davidkpiano/pen/ayWKJO)
// Last modified by Rami Isaac on Fri, May 26 2021
// **************************************************************

// const lightMachine = {
// 	id: 'light',
// 	initial: 'q0',
// 	states: {
// 		q0: {
// 			on: {
// 				'ε, Z->ε': 'q1',
// 				'a, Z->a': 'q2' 
// 			} 
// 		},
// 		q1: {
// 			on: {
// 			'a, a->a': 'q1',
// 			'b, a->ε': 'q2' 
// 			} 
// 		},
// 		q2: {
// 			on: {
// 				'b, a->ε': 'q1',
// 				'ε, Z->ε': 'q3' 
// 			} 	
// 		},

// 		q3: {
// 			on: {

// 			} 
// 		} 
// 	} 
// };

// export class Graph extends React.Component {
// 	constructor() {
// 		super();

// 		this.state = {
// 		nodes: [],
// 		edges: [],
// 		raw: JSON.stringify(lightMachine, null, 2),
// 		machine: lightMachine 
// 		};
// 	}

// 	initializeMachine() {
// 	  const { machine } = this.state;
// 	  const nodes = [];
// 	  const edges = [];

// 	  function addNodesAndEdges(node, key, parent) {
// 		const id = parent ? parent + '.' + key : key;
  
// 		if (parent) {
// 		  nodes.push({
// 			data: {
// 			  id,
// 			  label: key,
// 			  parent } });  
// 		}

// 		if (node.states) {
// 		  const states = Object.keys(node.states).
// 		  map(key => ({
// 			...node.states[key],
// 			id: key })).

// 		  concat({
// 			id: '$initial',
// 			initial: 1,
// 			on: { '': node.initial } }
// 			);
// 		  states.forEach(state => {
// 			addNodesAndEdges(state, state.id, id);
// 		  });
// 		}

// 		if (node.on) {
// 		  const visited = {};
// 		  Object.keys(node.on).forEach(event => {
// 			const target = node.on[event];
// 			(visited[target] || (visited[target] = [])).push(event);
// 		  });
  
// 		  Object.keys(visited).forEach(target => {
// 			edges.push({
// 			  data: {
// 				id: key + ':' + target,
// 				source: id,
// 				target: parent ? parent + '.' + target : target,
// 				label: visited[target].join(',\n') } });  
// 		  });
// 		}
// 	  }

// 	  addNodesAndEdges(machine, machine.id || 'machine');
  
// 	  this.cy = cytoscape({

// 		container: this.cyNode,

// 		boxSelectionEnabled: false,
// 		autounselectify: true,

// 		style: `
// 		  node[label != '$initial'] {
// 			content: data(label);
// 			text-valign: center;
// 			text-halign: center;
// 			shape: circle;
// 			width: 25px;
// 			height: 25px;
// 			border-width: 0px;
// 			border-color: black;
// 			font-size: 6px;
// 			font-family: "Monaco", monospace;          
//             background-color: #f6f6f6;
//         }
// 		  node:active {
// 			overlay-color: black;
// 			overlay-padding: 0;
// 			overlay-opacity: 0.1;
// 		  }
// 		  .foo {
// 			background-color: blue;
// 		  }
// 		  node[label = '$initial'] {
//             visibility: hidden;			
// 		  }
// 		  $node > node {
// 			padding-top: 1px;
// 			padding-left: 10px;
// 			padding-bottom: 10px;
// 			padding-right: 10px;
// 			text-valign: top;
// 			text-halign: center;
// 			border-width: 1px;
// 			border-color: black;
// 			background-color: white;
// 		  }
// 		  edge {
// 			curve-style: bezier;
// 			width: 1px;
// 			target-arrow-shape: triangle;
// 			label: data(label);
// 			font-size: 5px;
// 			font-weight: bold;
// 			text-background-color: white;
// 			text-background-padding: 3px;
// 			line-color: #white;
// 			target-arrow-color: #white;
// 			z-index: 100;
// 			text-wrap: wrap;
// 			text-background-color: white;
// 			text-background-opacity: 1;
// 			target-distance-from-node: 2px;
// 		  }
// 		  edge[label = ''] {
// 			source-arrow-shape: circle;
// 			source-arrow-color: white;
//             line-color: white;
//         }
// 		`,
                
// 		elements: {
// 		  nodes,
// 		  edges 
// 		},

// 		layout: {
// 		  name: 'cose-bilkent',
// 		  randomize: true,
// 		  idealEdgeLength: 100,
// 		  animate: false 
// 		} });
        		  
// 	}

// 	componentDidMount() {
// 	  this.initializeMachine();
// 	}
  
// 	handleChange(raw) {
// 	  this.setState({ raw });
// 	}
  
// 	generateGraph() {
// 	  try {
// 		const machine = eval(`var r=${this.state.raw};r`);
// 		this.setState({ machine, error: false }, this.initializeMachine);  
// 	  } catch (e) {
// 		console.error(e);
// 		this.setState({ error: true });
// 	  }
// 	}
	
// 	render() {
// 		return React.createElement("div", { id: "cy", ref: n => this.cyNode = n});
// 	}
// }

// ReactDOM.render(React.createElement(Graph, null), document.querySelector('#app'));