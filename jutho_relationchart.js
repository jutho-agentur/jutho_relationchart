/***********************************
####################################
  © JuTho-Agentur • www.jutho.com
  jutho_relationchart Version 1.1
  19.01.2020
####################################
***********************************/
function jutho_relationchart(id, options) {
	var obj = obj || {};
	obj.options = options || {};
	obj.options.nodes = options.nodes || {};
	obj.options.edges = options.edges || {};
	var jutho_relationchart = {
		id: id,
		i: 0,
		j: 0,
		options:{
			bg:		(obj.options.bg) ? obj.options.bg : 'white',
			width:	(obj.options.width) ? obj.options.width : '100%',
			height:	(obj.options.height) ? obj.options.height : '75vh',
			nodes:{
				fontfamily:	(obj.options.nodes.fontfamily) ? obj.options.nodes.fontfamily : 'Arial',
				fontsize:	(obj.options.nodes.fontsize) ? obj.options.nodes.fontsize : '11pt',
				bg: 		(obj.options.nodes.bg) ? obj.options.nodes.bg : 'lightgray',
				color: 		(obj.options.nodes.color) ? obj.options.nodes.color : 'black',
			},
			edges:{
				fontfamily:	(obj.options.edges.fontfamily) ? obj.options.edges.fontfamily : 'Arial',
				fontsize:	(obj.options.edges.fontsize) ? obj.options.edges.fontsize : '9pt',
				fontweight:	(obj.options.edges.fontweight) ? obj.options.edges.fontweight : 'normal',
				bg: 		(obj.options.edges.bg) ? obj.options.edges.bg : 'lightgray',
				color: 		(obj.options.edges.color) ? obj.options.edges.color : 'darkgray',
				weight: 	(obj.options.edges.weight) ? obj.options.edges.weight : '1px',
			}
		},
		nodes:{},
		edges:{},
		master:false,
		reserved_positions:[],
		render:function(data){
			if(data.options) Object.assign(this.options, data.options);
			var that=this;
			var options=this.options;
			var nodes=data.nodes||{};
			var edges=data.edges||{};
			var update_edges=false
			
			var sheet = $(id);
			//set sheet-options
			$(sheet).css("background-color", options.bg);
			$(sheet).css("width", options.width);
			$(sheet).css("height", options.height);
			
			var timeout=0;
			//insert nodes
			for(key in nodes) {
				var n=nodes[key];
				// console.log(n);
				//check if node already exists
				if(typeof(this.nodes[key])=="object") {
					var c={};
					Object.assign(c, this.nodes[key], n);
					n=c;
					$(sheet).find(".node[data-name='"+key+"']").remove();
					//mark edge for update
					update_edges=true;
				}
				//check if node has special options
				n.id			=	(n.id) ? n.id : 'node_'+this.i;
				n.css			=	(n.css) ? n.css : false;
				n.fontfamily	=	(n.fontfamily) ? n.fontfamily : options.nodes.fontfamily;
				n.fontsize		=	(n.fontsize) ? n.fontsize : options.nodes.fontsize;
				n.bg			=	(n.bg) ? n.bg : options.nodes.bg;
				n.class			=	(n.class) ? n.class : false;
				//create node
				let node = document.createElement("div"); 
				let label = document.createElement("div"); 
				// let txt = document.createTextNode(""); 
				// label.appendChild(txt);
				node.appendChild(label);
				$(label).html(n.name);
				$(node).addClass("node");
				if(n.class) $(node).addClass(n.class);
				if(n.css) {
					$(node).attr("style", n.css);
				}
				$(node).attr("data-name", key);
				$(node).attr("id", n.id);
				$(node).attr("data-shape", n.shape);
				$(node).css("background", n.bg);
				$(node).css("color", n.color);
				$(node).css("font-family", n.fontfamily);
				$(node).css("font-size", n.fontsize);
				$(node).find("div").addClass("textnode");
				$(node).css("cursor", "move");
				// $(node).css("display", "inline-block");
				$(sheet).append(node);
				//calc size for dot, star
				if(n.shape=="dot" || n.shape=="star") {
					$(node).css("width", $(node).outerWidth()+"px");
					$(node).css("height", $(node).outerWidth()+"px");
				}
				//calc size for tv
				if(n.shape=="tv") {
					$(node).css("width", $(node).outerWidth()+"px");
					$(node).css("height", $(node).outerWidth()*0.85+"px");
				}
				//save master
				if(this.i==0 && this.master===false) {
					this.master=$(node);
					var left = $(sheet).width()/2 - $(node).outerWidth()/2;
					var top = $(sheet).height()/2 - $(node).outerHeight()/2;
					$(node).css("position", "absolute");
					$(node).css("left", "40%");
					$(node).css("top", "40%");
					$(node).animate({left:left+"px", top:top+"px"}, 1200, "swing");
					//Keep in reserved positions
					this.reserved_positions.push({assigned:n.id, x1:left, x2:left+$(node).outerWidth(), y1:top, y2:top+$(node).outerHeight()});
				}
				//random position for slaves
				else if(this.i>0 || (this.i==0 && this.master!==false)) {
					//max values
					const maxleft = $(sheet).width()-$(node).outerWidth();
					const maxtop = $(sheet).height()-$(node).outerHeight();
					//calc positions
					var left = Math.floor(Math.random() * maxleft); 
					var right = left + $(node).outerWidth(); 
					var top = Math.floor(Math.random() * maxtop); 
					var bottom = top + $(node).outerHeight();
					//check positions
					var c=0;r=0; //r = maximum repeats of calc per reserved position
					while(r<=20 && this.reserved_positions[c]) {
						const pos=this.reserved_positions[c];
						// if(((left>=pos.x1 && left<pos.x2) && (right>pos.x1 && right<=pos.x2))) {
						if(
						(right>pos.x1 && right<=pos.x2 && top<=pos.y1 && bottom>=pos.y1 && bottom<=pos.y2) ||
						(left>=pos.x1 && left<pos.x2 && top<=pos.y1 && bottom>=pos.y1 && bottom<=pos.y2) ||
						(left<=pos.x1 && right>=pos.x2 && top<=pos.y1 && bottom>pos.y1 && bottom<=pos.y2) ||
						(right>pos.x1 && right<=pos.x2 && top>=pos.y1 && top<pos.y2) ||
						(left>=pos.x1 && left<pos.x2 && top>=pos.y1 && top<pos.y2) ||
						(left<=pos.x1 && right>=pos.x2 && top<=pos.y1 && bottom>=pos.y2) ||
						(left<=pos.x1 && right>=pos.x2 && top>=pos.y1 && top<pos.y2) ||
						(left>=pos.x1 && left<pos.x2 && top<=pos.y1 && bottom>=pos.y2)
							) {
							left = Math.floor(Math.random() * maxleft);
							right = left + $(node).outerWidth(); 
							top = Math.floor(Math.random() * maxtop); 
							bottom = top + $(node).outerHeight();
							c=0;
							r++;
						}
						else {
							c++;
							r=0;
						}
					}
					// console.log("left: "+left);
					// console.log("top: "+top);
					//set start-position
					$(node).css("position", "absolute");
					$(node).css("left", "40%");
					$(node).css("top", "40%");
					//set random time
					var random=Math.floor(Math.random() * 2500) + 300;
					if(random>timeout) { timeout=random; }
					//set final position
					$(node).animate({left:left+"px", top:top+"px"}, random, "swing");
					//keep reserved position
					this.reserved_positions.push({assigned:n.id, x1:left, x2:left+$(node).outerWidth(), y1:top, y2:top+$(node).outerHeight()});
					// console.log(reserved_positions);
				}
				
				this.nodes[key]=n;
				this.i++;
			}
			
			//save in central object
			// if(data.nodes) Object.assign(this.nodes, data.nodes);
			// if(data.edges) Object.assign(this.edges, data.edges);
			
			//check for edges to be updated
			if(update_edges===true) {
				$(sheet).find(".edge_wrapper").remove();
				for(t=0;t<that.reserved_positions.length;t++) {
					p=that.reserved_positions[t];
					if(p.assigned.indexOf("edge")>-1) {
						that.reserved_positions.splice(t, 1);
						t=-1;
					}
				}
				// console.log(that);
				var c={};
				Object.assign(c, that.edges);
				for(origin in edges) {
					for(key in edges[origin]) {
						var e=edges[origin][key];
						if(typeof(c[origin])=="object" && typeof(c[origin][key])=="object") {
							Object.assign(c[origin][key], e);
						}
						else if(typeof(c[origin])=="object" && typeof(c[origin][key])=="undefined") {
							c[origin][key]=e;
						}
						else if(typeof(c[origin])=="undefined") {
							c[origin]={};
							c[origin][key]=e;
						}
					}
				}
				edges=c;
			}
			
			window.setTimeout(function() {
				// console.log(edges);
				//insert edges
				for(origin in edges) {
					//get coordinates of origin
					// console.log(origin);
					var calc_origin=$(sheet).find(".node[data-name='"+origin+"']").position();
					if(typeof(calc_origin)!="undefined") {
						calc_origin['center_y']=calc_origin.top + $(sheet).find(".node[data-name="+origin+"]").outerHeight()/2;
						calc_origin['center_x']=calc_origin.left + $(sheet).find(".node[data-name="+origin+"]").outerWidth()/2;
						
						//get targets
						for(key in edges[origin]) {
							var e=edges[origin][key];
							
							//check if edge already exists
							if(typeof(that.edges[origin])=="object" && typeof(that.edges[origin][key])=="object") {
								var c={};
								Object.assign(c, that.edges[origin][key], e);
								e=c;
								//remove old edge
								$(sheet).find('.edge_wrapper[data-node1="'+origin+'"][data-node2="'+key+'"]').remove();
							}
							
							//check if node as special options
							e.id			=	(e.id) ? e.id : 'edge_'+that.j;
							e.css			=	(e.css) ? e.css : false;
							e.color			=	(e.color) ? e.color : options.edges.color;
							e.fontfamily	=	(e.fontfamily) ? e.fontfamily : options.edges.fontfamily;
							e.fontsize		=	(e.fontsize) ? e.fontsize : options.edges.fontsize;
							e.fontweight	=	(e.fontweight) ? e.fontweight : options.edges.fontweight;
							e.weight		=	(e.weight) ? e.weight : options.edges.weight;
							e.bg			=	(e.bg) ? e.bg : options.edges.bg;
							e.label			=	(e.label) ? e.label : false;
							e.class			=	(e.class) ? e.class : false;
							
							//get coordinates of target
							var calc_target=$(sheet).find(".node[data-name="+key+"]").position();
							if(typeof(calc_target)!="undefined") {
								calc_target['center_y']=calc_target.top + $(sheet).find(".node[data-name="+key+"]").outerHeight()/2;
								calc_target['center_x']=calc_target.left + $(sheet).find(".node[data-name="+key+"]").outerWidth()/2;
								
								//calc coordinates and size
								var wrapper_coords={};
								var transformorigin="bottom left";
								var pos="left";
								if(calc_target.center_x<=calc_origin.center_x) {
									wrapper_coords.relx='left';
									wrapper_coords.x=calc_target.center_x;
									wrapper_coords.width=calc_origin.center_x - calc_target.center_x;
								}
								else {
									wrapper_coords.relx='right';
									wrapper_coords.x=calc_origin.center_x;
									wrapper_coords.width=calc_target.center_x - calc_origin.center_x;
								}
								
								if(calc_target.center_y<=calc_origin.center_y) {
									wrapper_coords.rely='top';
									wrapper_coords.y=calc_target.center_y;
									wrapper_coords.height=calc_origin.center_y - calc_target.center_y;
									
									if(wrapper_coords.relx=="left") {
										transformorigin="bottom right";
										pos="right";
									}
								}
								else {
									wrapper_coords.rely='bottom';
									wrapper_coords.y=calc_origin.center_y;
									wrapper_coords.height=calc_target.center_y - calc_origin.center_y;
									
									if(wrapper_coords.relx=="right") {
										transformorigin="bottom right";
										pos="right";
									}
								}
								
								//create edge
								let wrapper = document.createElement("div"); 
								let edge = document.createElement("div"); 
								let label = document.createElement("div"); 
								//Label
								if(e.label) {
									// let txt = document.createTextNode("");
									// label.appendChild(txt);
									$(label).html(e.label);
									$(label).css("color", e.color);
									$(label).css("font-weight", e.fontweight);
									$(label).addClass("textnode");
									if(e.class) {
										$(label).addClass(e.class);
									}
								}
								wrapper.appendChild(edge);
								wrapper.appendChild(label);
								$(sheet).append(wrapper);
								//wrapper
								$(wrapper).addClass("edge_wrapper");
								$(wrapper).attr("data-node1", origin);
								$(wrapper).attr("data-node2", key);
								$(wrapper).attr("id", e.id);
								$(wrapper).css("font-family", e.fontfamily);
								$(wrapper).css("font-size", e.fontsize);
								$(wrapper).css("position", "absolute");
								$(wrapper).css("left", wrapper_coords.x+"px");
								$(wrapper).css("top", wrapper_coords.y+"px");
								$(wrapper).css("width", wrapper_coords.width+"px");
								$(wrapper).css("height", wrapper_coords.height+"px");
								
								
								//Edge
								var width=Math.sqrt((wrapper_coords.width * wrapper_coords.width) + (wrapper_coords.height * wrapper_coords.height));
								$(edge).addClass("edge");
								$(edge).css("background", e.bg);
								$(edge).css("width", width);
								$(edge).css("height", e.weight);
								$(edge).css('left', "unset");
								$(edge).css('right', "unset");
								$(edge).css(pos, "0");
								if(transformorigin=="bottom right") {
									var pre="";
								}
								else{
									var pre="-";
								} 
								$(edge).css("transform-origin", transformorigin);
								$(edge).css("transform", "rotate("+pre+""+Math.atan(wrapper_coords.height / wrapper_coords.width)*180/Math.PI+"deg)");
								if(e.css) {
									$(edge).attr("style", e.css);
								}
								
								//keep labelpos reserved
								if(e.label) {
									var wrapperpos = $(wrapper).position();
									var labelpos = $(label).position();
									labelpos.left = labelpos.left + wrapperpos.left;
									labelpos.top = labelpos.top + wrapperpos.top;
									that.reserved_positions.push({assigned:e.id, x1:labelpos.left, x2:labelpos.left+$(label).outerWidth(), y1:labelpos.top, y2:labelpos.top+$(label).outerHeight()});
								}
								
								if(typeof(that.edges[origin])!="object") that.edges[origin]={};
								that.edges[origin][key]=e;
								that.j++;
							}
						}
					}
				}
			}, timeout);
			
			this.initiate_move(id);
		},
		initiate_move:function(id){
			var that=this;
			var sheet = $(id);
			
			$(sheet).find(".node").bind("mousedown", function(event) {
				var node1 = $(this);
				
				var original_pos=$(node1).position();
				$(node1).css("opacity", "0.6");
				$(node1).css("position", "absolute");
				$(node1).css("top", original_pos.top+"px");
				$(node1).css("left", original_pos.left+"px");
				// $(node1).css("transform", "unset");
				// $(node1).css("transition", "top 0.1s ease-out, left 0.2s ease-out");
				$(node1).addClass("moving");
				
				//get initial Mouse Pos
				var mouseX = event.pageX;
				var mouseY = event.pageY;
				// console.log("Mouse Pos: " + mouseX + " / " + mouseY);
				
				//get initial Box Pos
				var boxX = $(node1).position().left;
				var boxY = $(node1).position().top;
				// console.log("Box Pos: " + boxX + " / " + boxY);
				
				$(document).bind("mousemove", function(event) {
					if(!event)  {
						var e = window.event;
					}
					else {
						var e = event;
					}
					var b = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
					var pos = {
					// Position im Dokument
						top: e.pageY ? e.pageY : e.clientY + b.scrollTop - b.clientTop,
						left: e.pageX ? e.pageX : e.clientX + b.scrollLeft  - b.clientLeft
					};
					
					//find out the moved way
					var newX = boxX + (pos.left - mouseX);
					var newY = boxY + (pos.top - mouseY);
					
					//plausiprüfung viewport
					var newXend=newX + $(node1).outerWidth();
					var newYend=newY + $(node1).outerHeight();
					// console.log(newXend);
					// console.log($(node).parent().outerWidth());
					if(newXend>$(sheet).outerWidth()) {
						newX=$(sheet).outerWidth() - $(node1).outerWidth();
					}
					if(newYend>$(sheet).outerHeight()) {
						newY=$(sheet).outerHeight() - $(node1).outerHeight();
					}
					if(newX<0) {
						newX=0;
					}
					if(newY<0) {
						newY=0;
					}
					
					//set the new position
					$(node1).css("left", newX+"px");
					$(node1).css("top", newY+"px");
					
					//find all belonged edges
					var name = $(node1).attr("data-name");
					var edges = $(sheet).find(".edge_wrapper[data-node1="+name+"], .edge_wrapper[data-node2="+name+"]");
					//calc edge direction
					$(edges).each(function() {
						const wrapper=$(this);
						const edge=$(wrapper).find(".edge");
						var targetname=$(this).attr('data-node1');
						if(targetname==name) {
							var targetname=$(this).attr('data-node2');
						}
						
						//get coordinates of origin
						var calc_target=$(sheet).find(".node[data-name="+targetname+"]").position();
						if(typeof(calc_target)!="undefined") {
							calc_target['center_y']=calc_target.top + $(sheet).find(".node[data-name="+targetname+"]").outerHeight()/2;
							calc_target['center_x']=calc_target.left + $(sheet).find(".node[data-name="+targetname+"]").outerWidth()/2;
						
							//get coordinates of target
							var calc_origin=$(node1).position();
							calc_origin['center_y']=calc_origin.top + $(node1).outerHeight()/2;
							calc_origin['center_x']=calc_origin.left + $(node1).outerWidth()/2;
							
							//calc coordinates and size
							var wrapper_coords={};
							var transformorigin="bottom left";
							var pos="left";
							if(calc_target.center_x<=calc_origin.center_x) {
								wrapper_coords.relx='left';
								wrapper_coords.x=calc_target.center_x;
								wrapper_coords.width=calc_origin.center_x - calc_target.center_x;
							}
							else {
								wrapper_coords.relx='right';
								wrapper_coords.x=calc_origin.center_x;
								wrapper_coords.width=calc_target.center_x - calc_origin.center_x;
							}
							
							if(calc_target.center_y<=calc_origin.center_y) {
								wrapper_coords.rely='top';
								wrapper_coords.y=calc_target.center_y;
								wrapper_coords.height=calc_origin.center_y - calc_target.center_y;
								
								if(wrapper_coords.relx=="left") {
									transformorigin="bottom right";
									pos="right";
								}
							}
							else {
								wrapper_coords.rely='bottom';
								wrapper_coords.y=calc_origin.center_y;
								wrapper_coords.height=calc_target.center_y - calc_origin.center_y;
								
								if(wrapper_coords.relx=="right") {
									transformorigin="bottom right";
									pos="right";
								}
							}
							//Wrapper
							$(wrapper).css("left", wrapper_coords.x+"px");
							$(wrapper).css("top", wrapper_coords.y+"px");
							$(wrapper).css("width", wrapper_coords.width+"px");
							$(wrapper).css("height", wrapper_coords.height+"px");
							
							//Edge
							var width=Math.sqrt((wrapper_coords.width * wrapper_coords.width) + (wrapper_coords.height * wrapper_coords.height));
							$(edge).css("width", width);
							$(edge).css('left', "unset");
							$(edge).css('right', "unset");
							$(edge).css(pos, "0");
							if(transformorigin=="bottom right") {
								var pre="";
							}
							else{
								var pre="-";
							} 
							$(edge).css("transform-origin", transformorigin);
							$(edge).css("transform", "rotate("+pre+""+Math.atan(wrapper_coords.height / wrapper_coords.width)*180/Math.PI+"deg)");
						}
					});
				});
				
				$(document).bind("mouseup", function(event) {
					var node = $(sheet).find(".node.moving");
					$(node).css("opacity", "1");
					$(document).unbind("mousemove");
					$(node).removeClass("moving");
				});
			});
		},
		removeNode:function(rem) {
			var sheet = $(this.id);
			if(typeof(rem)=="string") {
				rem=[rem];
			}
			for(i=0;i<rem.length;i++) {
				if(typeof(this.nodes[rem[i]])=="object") {
					const id=this.nodes[rem[i]].id;
					$(sheet).find("#"+id).remove();
					delete this.nodes[rem[i]];
					
					//find edges in object and delete
					if(typeof(this.edges[rem[i]])=="object") {
						delete this.edges[rem[i]];
					}
					for(key in this.edges) {
						if(typeof(this.edges[key][rem[i]])=="object") {
							delete this.edges[key][rem[i]];
						}
					}
					
					//find edges in sheet and delete
					$(sheet).find(".edge_wrapper[data-node1='"+rem[i]+"'], .edge_wrapper[data-node2='"+rem[i]+"']").remove();
				}
			}
		},
		reload:function() {
			this.master=false;
			this.i=0;
			this.j=0;
			this.reserved_positions=[];
			this.render({options:this.options, nodes:this.nodes, edges:this.edges});
		}
	}
	return jutho_relationchart;
}