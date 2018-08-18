void(
	(function(){
		var client_id = "3edd57551e32679d7ed09d84b6c7318e";
		function ProxyURL(url){
			return "https://cors-anywhere.herokuapp.com/".concat(encodeURIComponent(url));
		}
		function YoutubeArtist(cid){
			return ProxyURL("https://www.youtube.com/oembed?format=json&url=http://www.youtube.com/watch?v=".concat(encodeURIComponent(cid)));
		}
		function SoundcloudArtist(cid){
			return ProxyURL("https://api.soundcloud.com/tracks/".concat(encodeURIComponent(cid)).concat("?client_id=").concat(encodeURIComponent(client_id)));
		}
		function CreateElement(str){
			var asd = document.createElement('div');
			asd.innerHTML = str;
			var child = asd.childNodes[0];
			return child;
		}
		function RemoveElement(element){
			var parent = element.parentNode;
			return ((typeof parent !== "undefined" && parent !== null) ? (parent.removeChild(element) !== null) : false);
		}
		function fileprompt(title,body,handler){
			var main = CreateElement("<div style=\"z-index: 99999; box-sizing: border-box; position: relative; background-color: #fff; background-clip: padding-box; border: 1px solid rgba(0,0,0,.2); border-radius: 6px; outline: 0; width: 50vw; margin-top: calc(50vh - 92px); margin-left: 25vw; color: #000\">");
			var header = CreateElement("<div style=\"box-sizing: border-box; padding: 15px; border-bottom: 1px solid #e5e5e5;\">");
			main.appendChild(header);
			var titleblock = CreateElement("<h4 style=\"box-sizing: border-box; font-size: 18px; margin: 0; line-height: 1.42857143;\">");
			titleblock.innerHTML = (title);
			header.appendChild(titleblock);
			var XClose = CreateElement("<button type=\"button\" data-dismiss=\"modal\" aria-label=\"Close\" style=\"box-sizing: border-box; margin: 0; overflow: visible; text-transform: none; opacity: .2; text-shadow: 0 1px 0 #fff; color: #000; line-height: 1; font-size: 21px; float: right; border: 0; background: 0 0; cursor: pointer; padding: 0; -webkit-appearance: none; margin-top: 2px;\">X</button>");
			titleblock.appendChild(XClose);
			var bodyblock = CreateElement("<div style=\"box-sizing: border-box; position: relative; padding: 15px;\">");
			main.appendChild(bodyblock);
			var bodytext = CreateElement("<p style=\"box-sizing: border-box; margin: 0 0 10px;\">");
			bodytext.innerHTML = (body);
			bodyblock.appendChild(bodytext);
			var footer = CreateElement("<div style=\"box-sizing: border-box; padding: 15px; text-align: right; border-top: 1px solid #e5e5e5;\">");
			main.appendChild(footer);
			var upload = CreateElement("<input type=\"file\" accept=\".txt,.json,text/plain,application/json\" style=\"box-sizing: border-box; margin: 0; overflow: visible; text-transform: none; -webkit-appearance: none; border-radius: 4px; border: 1px solid transparent; background-image: none; user-select: none; -webkit-user-select: none; cursor: pointer; touch-action: manipulation; -ms-touch-action: manipulation; vertical-align: middle; white-space: nowrap; text-align: center; line-height: 1.42857143; font-size: 14px; padding: 6px 12px; display: inline-block; border-color: #2e6da4; background-color: #337ab7; margin-left: 5px; margin-bottom: 0;\">Select File</button>");
			footer.appendChild(upload);
			XClose.addEventListener("click",function(){
				RemoveElement(main);
				handler(false);
			});
			var fileInput = upload;
			fileInput.addEventListener('change', function(e){
				var file = fileInput.files[0];
				if(file.type === "application/json" || file.type === "text/plain" || (file.type === "" && file.name.substring(file.name.length - 5).toLowerCase() === ".json")){
					var reader = new FileReader();
					reader.onload = function(e2){
						var result = reader.result;
						if(typeof result === "string"){
							RemoveElement(main);
							handler(reader.result);
						}else{
							alert("An error occurred while reading this file. It may be malformed or corrupted, or you're trying to trick me with a false file extension =)");
						}
					}
					reader.readAsText(file);
				}else{
					alert("Please submit a .txt or a .json file! (Filetype submitted: ".concat(file.type).concat(")"));
				}
			});
			document.body.appendChild(main);
		}
		function isImage(url,timeout,handler){
			if(typeof url === "string" && /\S/.test(url)){
				timeout = timeout || 5000;
				var timedOut = false, timer;
				var img = new Image();
				img.onerror = img.onabort = function() {
					if (!timedOut) {
						clearTimeout(timer);
						handler(false);
					}
				};
				img.onload = function() {
					if (!timedOut) {
						clearTimeout(timer);
						handler(true);
					}
				};
				img.src = url;
				timer = setTimeout(function() {
					timedOut = true;
					handler(false);
				}, timeout); 
			}else{
				handler(false);
			}
		}
		var name = prompt("Playlist Name");
		fileprompt("Playlist JSON","Select a .json or a .txt file of your playlist to import it",function(json){
			var data;
			try{
				data = $.parseJSON(json);
			}catch(err){}
			if(typeof data === "object" && data !== null){
				var songs = data["data"];
				if(typeof songs === "object" && songs != null){
					var len = songs.length;
					var playlists = Math.max(1,Math.ceil(len/200));
					var playlistZeroes = playlists.toString().length - 1;
					var imports = [];
					var total = 0;
					var ready = 0;
					for(playlist = 0; playlist < playlists; playlist++){
						void(
							(function(playlist){
								var toImport = {};
								imports.push(toImport);
								toImport["name"] = name.concat(playlists === 1 ? '' : ' Part '.concat('0'.repeat(playlistZeroes).concat(playlist + 1).substring(0,playlistZeroes + 1)));
								var media = [];
								toImport["media"] = media;
								toImport["errors"] = 0;
								var start = playlist * 200;
								var end = Math.min(start + 199,len);
								for(i = start; i <= end; i++){
									void(
										(function(i){
											var song = songs[i];
											if(typeof song === "object" && song !== null){
												var format = song["format"];
												var cid = song["cid"];
												var id = 0;
												var title = song["title"];
												var duration = song["duration"];
												var image = song["image"];
												if((format === 1 || format === 2) && typeof cid === "string" && typeof id === "number" && typeof title === "string" && typeof duration === "number" && duration >= 0){
													var pos = total;
													total++;
													isImage(image,5000,function(isimage){
														if(!isimage){
															image = "http://i.imgur.com/e4hGizI.png";
														}
														var artistURL = format === 1 ? YoutubeArtist(cid) : SoundcloudArtist(cid);
														var artist;
														var errored = false;
														$.ajax({
															url: artistURL,
															headers: {
																Origin: "https://www.github.com"
															}
														}).done(function(data){
															try{
																var response = data;
																var responseData;
																if(typeof response === "string"){
																	if(response === "Not Found"){
																		errored = true;
																		throw "YouTube Not Found";
																	}else{
																		try{
																			responseData = $.parseJSON(data);
																		}catch(e){}
																	}
																}else{
																	responseData = data;
																}
																if(typeof responseData === "object" && responseData !== null){
																	var errors = responseData["errors"];
																	if(typeof errors !== "undefined" && errors !== null){
																		errored = true;
																		throw "SoundCloud Not Found";
																	}else{
																		var responseArtist = responseData["author_name"];
																		if(typeof responseArtist === "string"){
																			artist = responseArtist;
																		}else{
																			var responseUser = responseData["user"];
																			if(typeof responseUser === "object" && responseUser !== null){
																				var responseUsername = responseUser["username"];
																				if(typeof responseUsername === "string"){
																					artist = responseUsername;
																				}
																			}
																		}
																	}
																}
															}catch(err){
																artist = "";
															}
														})
														.fail(function(data){
															try{
																var response = data.responseText;
																var responseData;
																if(typeof response === "string"){
																	if(response === "Not Found"){
																		errored = true;
																		throw "YouTube Not Found";
																	}else{
																		try{
																			responseData = $.parseJSON(response);
																		}catch(e){}
																	}
																}else{
																	responseData = data.responseJSON;
																}
																if(typeof responseData === "object" && responseData !== null){
																	var errors = responseData["errors"];
																	if(typeof errors !== "undefined" && errors !== null){
																		errored = true;
																		throw "SoundCloud Not Found";
																	}
																}
																var status = data.status;
																if(status !== 200 && status !== 401){
																	errored = true;
																	throw "Connectivity Error";
																}
															}catch(e){}
															artist = "";
														})
														.always(function(){
															if(!errored){
																artist = (artist === "") ? "Artist unavailable" : artist;
																media[(pos - start)] = {
																	id: id,
																	format: format,
																	cid: cid,
																	author: artist,
																	title: title,
																	image: image,
																	duration: duration,
																};
															}else{
																toImport["errors"]++;
															}
															ready++;
														});
													});
												}else{
													toImport["errors"]++;
												}
											}
										}(i))
									);
								}
							}(playlist))
						);
					}
					function Complete(){
						if(total !== ready){
							setTimeout(Complete,0);
						}else{
							var impLen = imports.length;
							var completes = 0;
							for(impIndex = 0; impIndex < impLen; impIndex++){
								void(
									(function(impIndex){
										var toImport = imports[impIndex];
										var errors = toImport["errors"];
										delete toImport["errors"];
										var media = toImport["media"];
										var medialen = media.length;
										for(asd = 0;asd < 200; asd++){
											if(typeof media[asd] !== "object" || media[asd] === null){
												media.splice(asd,1);
											}
										}
										var importString = JSON.stringify(toImport);
										$.ajax({
											type: "POST",
											url: "/_/playlists",
											data: importString,
											dataType: "json",
											contentType: "application/json",
											headers: {
												Accept: "application/json, text/javascript, */*; q=0.01",
											}
										})
										.done(function(data){
											alert("Successfully imported playlist #".concat(impIndex + 1).concat("! (").concat(errors).concat(" broken songs omitted)"));
										})
										.fail(function(data){
											var err = "An error occurred on playlist #".concat(impIndex + 1).concat("! (").concat(errors).concat(" broken songs omitted)").concat(":\n");
											try{
												var errParse = data;
												if(typeof errParse === "string"){
													var errJson = false;
													try{
														errJson = $.parseJSON(errParse);
													}catch(e){
														throw "Got string that wasn't JSON";
													}
													errParse = errJson;
												}
												var append = "";
												for (var key in errParse){
													if (errParse.hasOwnProperty(key)){
														var value = errParse[key];
														append = append.concat("\n").concat(key).concat(": ").concat(value);
													}
												}
												if(append === ""){
													append = "\nAn unknown error occurred (no response)";
												}
												err = err.concat(append);
											}catch(e){
												err = err.concat("\nCouldn't parse error... here's the raw response instead: ").concat(data);
											}
											alert(err);
										})
										.always(function(){
											completes = completes + 1;
											if(completes === impLen){
												location.reload();
											}
										});
									}(impIndex))
								);
							}
						}
					}
					Complete();
				}else{
					alert("Invalid playlist JSON!");
				}
			}else{
				alert("Invalid playlist JSON!");
			}
		});
	}())
);
