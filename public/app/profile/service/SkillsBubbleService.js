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

        var generateClickableBubble = function(input) {
            var w = window.innerWidth*0.68*0.95;
            var h = Math.ceil(w*0.5);
            var oR = 0;
            var nTop = 0;

            var gmisCategory = {
                "Technical" : "#7030A0",
                "Soft Skills" : "#0070C0",
                "Project Management" : "#007037",
                "Management" : "#FFC000",
                "HSBC Application" : "#E46C0A",
                "Business Domain" : "#FF0000"
            }

            var svgContainer = d3.select("#bubbleChart")
              .style("height", h+"px");

            var svg = d3.select("#bubbleChart").append("svg")
                .attr("class", "mainBubbleSVG")
                .attr("width", w)
                .attr("height",h)
                .on("mouseleave", function() {return resetBubbles();});
                
            var mainNote = svg.append("text")
            .attr("id", "bubbleItemNote")
            .attr("x", 10)
            .attr("y", w/2-15)
            .attr("font-size", 12)
            .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
            .style("fill", "#888888");    


            //d3.json(massage(input), function(error, root) {
             //   console.log(error);
                var root = massage(input);
                var bubbleObj = svg.selectAll(".topBubble")
                        .data(massage(input).children)
                    .enter().append("g")
                        .attr("id", function(d,i) {return "topBubbleAndText_" + i});
                    
                console.log(root);  
                nTop = root.children.length;
                //oR = w/(1+3*nTop);  
                oR = w/(1+3*Math.max(nTop, 3));  

                //h = Math.ceil(w/nTop*1.5);
                h = Math.ceil(w/2.1);
                svgContainer.style("height",h+"px");
                
                //var colVals = d3.scale.category10();
                
                bubbleObj.append("circle")
                    .attr("class", "topBubble")
                    .attr("id", function(d,i) {return "topBubble" + i;})
                    .attr("r", function(d) { return oR*0.75; }) // 75% of original radius
                    .attr("cx", function(d, i) {return oR*(3*(1+i)-1);})
                    .attr("cy", (h+oR)/3)
                    .style("fill", function(d,i) { return gmisCategory[root.children[i].name]; }) // #1f77b4
                    .style("opacity",0.8)
                    .on("mouseover", function(d,i) {return activateBubble(d,i);});
                
                    
                bubbleObj.append("text")
                    .attr("class", "topBubbleText")
                    .attr("x", function(d, i) {return oR*(3*(1+i)-1);})
                    .attr("y", (h+oR)/3)
                    .style("fill", function(d,i) { return "#fff"; }) // #1f77b4
                    .attr("font-size", 15)
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("alignment-baseline", "middle")
                    .text(function(d) {return d.name})      
                    .on("mouseover", function(d,i) {return activateBubble(d,i);});
                
                
                for(var iB = 0; iB < nTop; iB++)
                {
                    var childBubbles = svg.selectAll(".childBubble" + iB)
                        .data(root.children[iB].children)
                        .enter().append("g");
                        
                //var nSubBubble = Math.floor(root.children[iB].children.length/2.0);   
                    
                    var numSatellites = root.children[iB].children.length;
                    var factor = 360 / numSatellites;  // Affect the placement around the mother
                    var satelliteRadius = 180/numSatellites * oR*0.75;
                    
                    if(satelliteRadius > oR*0.75/6 ) {
                        satelliteRadius = oR*0.75/6;
                    }
         

                    childBubbles.append("circle")
                        .attr("class", "childBubble" + iB)
                        .attr("id", function(d,i) {return "childBubble_" + iB + "sub_" + i;})
                        .attr("r",  function(d) {return satelliteRadius;})  
                        .attr("cx", function(d,i) {return (oR*(3*(iB+1)-1) + oR*Math.cos((i-1)*factor/180*Math.PI));})
                        .attr("cy", function(d,i) {return ((h+oR)/3 +        oR*Math.sin((i-1)*factor/180*Math.PI));})
                        .attr("cursor","pointer")
                        .style("opacity",0.5)
                        .style("fill", function(d,i) { return gmisCategory[root.children[iB].name]; })
                    /*.on("mouseover", function(d,i) {
                      //window.alert("say something");
                      var noteText = "";
                      if (d.note == null || d.note == "") {
                        noteText = d.address;
                      } else {
                        noteText = d.note;
                      }
                      d3.select("#bubbleItemNote").text(noteText);
                      })
                    .append("svg:title")
                    .text(function(d) { return d.address; });   
*/
                    childBubbles.append("text")
                        .attr("class", "childBubbleText" + iB)
                        .attr("x", function(d,i) {return (oR*(3*(iB+1)-1) + oR*1.1*Math.cos((i-1)*factor/180*Math.PI));})
                        .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.1*Math.sin((i-1)*factor/180*Math.PI));})
                        .style("opacity",0.0)
                        .attr("text-anchor", "middle")
                    .style("fill", function(d,i) { return gmisCategory[root.children[iB].name]; }) // #1f77b4
                        .attr("font-size", 3)
                        .attr("cursor","pointer")
                        .attr("dominant-baseline", "middle")
                    .attr("alignment-baseline", "middle")
                        .text(function(d) {return d.name}); 

                }

                
               // }); 

            function resetBubbles() {
              w = window.innerWidth*0.68*0.95;
              //oR = w/(1+3*nTop);
              oR = w/(1+3*Math.max(nTop, 3)); 
              
              //h = Math.ceil(w/nTop*1.5);
              h = Math.ceil(w/2.1);
              svgContainer.style("height",h+"px");

              mainNote.attr("y",h-15);
                  
              svg.attr("width", w);
              svg.attr("height",h);       
              
            
              
              var t = svg.transition()
                  .duration(650);
                
                t.selectAll(".topBubble")
                    .attr("r", function(d) { return oR*0.75; })
                    .attr("cx", function(d, i) {return oR*(3*(1+i)-1);})
                    .attr("cy", (h+oR)/3)
                    .style("opacity",0.8);

                t.selectAll(".topBubbleText")
                .attr("font-size", 15)
                    .attr("x", function(d, i) {return oR*(3*(1+i)-1);})
                    .attr("y", (h+oR)/3)
                    .style("opacity",1);

              for(var k = 0; k < nTop; k++) 
              {
                var numSatellites = root.children[k].children.length;
                var factor = 360 / numSatellites;  // Affect the placement around the mother
                var satelliteRadius = 180/numSatellites * oR*0.75;
                
                if(satelliteRadius > oR*0.75/6 ) {
                    satelliteRadius = oR*0.75/6;
                }

                t.selectAll(".childBubbleText" + k)
                        .attr("x", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.1*Math.cos((i-1)*factor/180*Math.PI));})
                        .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.1*Math.sin((i-1)*factor/180*Math.PI));})
                    .attr("font-size", 6)
                        .style("opacity",0.0);

                t.selectAll(".childBubble" + k)
                        .attr("r",  function(d) {return satelliteRadius;})
                    .style("opacity",0.5)
                        .attr("cx", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.1*Math.cos((i-1)*factor/180*Math.PI));})
                        .attr("cy", function(d,i) {return ((h+oR)/3 +        oR*1.1*Math.sin((i-1)*factor/180*Math.PI));});
                            
              }   
            }
                
                
                function activateBubble(d,i) {
                    // increase this bubble and decrease others
                    var t = svg.transition()
                        .duration(d3.event.altKey ? 7500 : 350);

                    t.selectAll(".topBubble")
                        .attr("cx", function(d,ii){
                            if(i == ii) {
                                // Nothing to change
                                return oR*(3*(1+ii)-1) - 0.6*oR*(ii-1);
                            } else {
                                // Push away a little bit
                                if(ii < i){
                                    // left side
                                    return oR*0.6*(3*(1+ii)-1);
                                } else {
                                    // right side
                                    return oR*(nTop*3+1) - oR*0.6*(3*(nTop-ii)-1);
                                }
                            }               
                        })
                        .attr("r", function(d, ii) { 
                            if(i == ii)
                                return oR*1.3;
                            else
                                return oR*0.8;
                            })
                        .attr("cy", (h+oR)/4.6)
                        .style("opacity",0.1);
                            
                    t.selectAll(".topBubbleText")
                        .attr("x", function(d,ii){
                            if(i == ii) {
                                // Nothing to change
                                return oR*(3*(1+ii)-1) - 0.6*oR*(ii-1);
                            } else {
                                // Push away a little bit
                                if(ii < i){
                                    // left side
                                    return oR*0.6*(3*(1+ii)-1);
                                } else {
                                    // right side
                                    return oR*(nTop*3+1) - oR*0.6*(3*(nTop-ii)-1);
                                }
                            }               
                        })          
                        .attr("font-size", function(d,ii){
                            if(i == ii)
                                return 19*1.5;
                            else
                                return 19*0.6;              
                        })
                        .style("opacity",0);

                    var numSatellites = d.children.length;
                    var factor = 360 / numSatellites;  // Affect the placement around the mother
                    var satelliteRadius = 180/numSatellites * oR*1.3;
                    
                    if(satelliteRadius > oR*1.3/5 ) {
                        satelliteRadius = oR*1.3/5;
                    }

                    var signSide = -1;
                    var fontSize = 13;
                    var fontHeight = 22;

                    for(var k = 0; k < nTop; k++) 
                    {
                        var colWidth = 200;
                        var positionCenterX = oR*(3*(k+1)-1) - 0.6*oR*(k-1);
                        var numCol = Math.ceil(numSatellites * fontHeight / (h * 0.95));  // approximate pixel height for size 17
                        var numPerCol = numSatellites / numCol;
                        if(numCol > 2) {
                            numCol = 2;
                        }
                        var positionCenterXShift = positionCenterX - (colWidth * (numCol-1) * 0.5);

                        t.selectAll(".childBubbleText" + k)
                            .attr("x", function(d,i) {
                                var col = 0;
                                if(i > 1) { 
                                   col = Math.floor(i / numPerCol);
                                }
                                return positionCenterXShift + (colWidth*col);
                            })
                            .attr("y", function(d,i) {
                                var index = i % numPerCol;
                                return (fontHeight * index+17*2);
                            })
                            .attr("font-size", function(){
                                    return fontSize;
                                })
                            .attr("font-weight", "bold")
                            .style("opacity",function(){
                                    return (k==i)?1:0;
                                });

                        t.selectAll(".childBubble" + k)
                        .attr("cx", function(d,i) {return (oR*(3*(k+1)-1) - 0.6*oR*(k-1) + signSide*oR*1.9*Math.cos((i-1)*factor/180*Math.PI));})
                        .attr("cy", function(d,i) {return ((h+oR)/3 + signSide*oR*1.9*Math.sin((i-1)*factor/180*Math.PI));})
                        .attr("r", function(){
                                return satelliteRadius;               
                        })
                        .style("opacity", 0); 

                    }
                    

                                     
                }

                function massage(input) {
                    var result = { 
                        name : "root",
                        children : []
                    };

                    var index = {};
                    var counter = 0;

                    input.forEach(function(skill) {
                        if(index[skill.category] == undefined){
                            index[skill.category] = counter;
                            result.children[counter] = {
                                name : skill.category,
                                children : []
                            }
                            counter++;

                        }

                        var trimmedSkill = skill.skill;

                        /*if(trimmedSkill.length > 20) {
                            trimmedSkill = trimmedSkill.substring(0, 19) + ".";
                        }*/
                        result.children[index[skill.category]].children.push(
                            {name : trimmedSkill}
                        );  
                    });

                  return result;
                }

                function containsCategory(category, list) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].name === category) {
                            return true;
                        }
                    }
                    return false;
                }

            window.onresize = resetBubbles;
        }

    	return {
    		generateBubble : generateBubble,
            generateClickableBubble : generateClickableBubble
    	};
}]);
