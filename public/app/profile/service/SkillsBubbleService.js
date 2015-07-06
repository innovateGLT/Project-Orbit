'use strict';

// TODO : cleanup

angular.module('profile')
    
    .factory('Bubble', [ function( ) {
        // Config for D3 Bubble Chart -- BEGIN
        var generateBubble = function(input) {
        	
        	var diameter = document.querySelector("#bubbleChart").offsetWidth,
        	width = 640,
        	height = 500,
            format = d3.format(",d"),
            gmisCategory = {
        		"Technical" : "#7030A0",
        		"Soft Skills" : "#0070C0",
        		"Project Management" : "#007037",
        		"Management" : "#FFC000",
        		"HSBC Application" : "#E46C0A",
        		"Business Domain" : "#FF0000"
        	},
        	ratingDefinition = {
        		"1" : "1 - Novice",
        		"2" : "2 - Learner",
        		"3" : "3 - Proficient",
        		"4" : "4 - Professional",
        		"5" : "5 - Expert"
        	},
            color = d3.scale.category10();


        	var bubble = d3.layout.pack()
        	    .sort(null)
        	    .size([width, height])
        	    .padding(1.5);
        	
        	var svg = d3.select(document.querySelector("#bubbleChart")).append("svg")
        	    .attr("width", width)
        	    .attr("height", height)
        	    .attr("class", "bubble");
        	

        	  var node = svg.selectAll(".node")
        	      .data(bubble.nodes(massage(input))
        	      .filter(function(d) { return !d.children; }))
        	    .enter().append("g")
        	      .attr("class", "node")
        	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        	
        	  node.append("title")
        	      .text(function(d) { return d.className + ": " + ratingDefinition[format(Math.log(d.value))]; });
        	
        	  node.append("circle")
        	      .attr("r", function(d) { return d.r; })
        	      .style("fill", function(d) { 
        	    	  if(gmisCategory[d.packageName]) {
        	    		  return gmisCategory[d.packageName]
        	    	  } else {
        	    		  return color(d.packageName); 
        	    	  }});
        	
        	  node.append("text")
        	      .attr("dy", ".3em")
        	      .style("text-anchor", "middle").style("font-size", "0.6em").style('fill','white')
        	      .text(function(d) { return d.className.substring(0, d.r / 3); });
        	
        	// Returns a flattened hierarchy containing all leaf nodes under the root.
        	function massage(input) {
        	  var classes = [];

        	  input.forEach(function(node) {
        		  classes.push({packageName: node.category, className: node.skill, value: Math.exp(node.rating)  });
        	  });

        	  return {children: classes};
        	}

        	d3.select(self.frameElement).style("height", diameter + "px");
        }
        // Config for D3 Bubble Chart -- END
        
    	return {
    		generateBubble : generateBubble
    	};
}]);
