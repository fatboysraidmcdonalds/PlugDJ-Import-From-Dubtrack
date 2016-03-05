void(
	(function(){
		var client_id = "3edd57551e32679d7ed09d84b6c7318e";
		function YoutubeArtist(cid){
			return "https://main-primadonna.rhcloud.com/MAIN.php?action=HttpGet&content=" + encodeURIComponent("https://www.youtube.com/oembed?format=json&url=http://www.youtube.com/watch?v=" + encodeURIComponent(cid));
		}
		function SoundcloudArtist(cid){
			return "https://api.soundcloud.com/tracks/" + encodeURIComponent(cid) + "?client_id=" + encodeURIComponent(client_id);
		}
		var name = prompt("Playlist Name");
		var json = prompt("Playlist JSON");
		var data;
		try{
			data = $.parseJSON(json);
		}catch(err){}
		if(typeof data === "object" && data !== null){
			var songs = data["data"];
			var toImport = {};
			toImport["name"] = name;
			var media = [];
			if(typeof songs === "object" && songs != null){
				var len = songs.length;
				var total = 0;
				var ready = 0;
				for(i = 0; i < len; i++){
					void(
						(function(i){
							var song = songs[i];
							if(typeof song === "object" && song !== null){
								var pos = total;
								total = total + 1;
								var format = song["format"];
								var cid = song["cid"];
								var id = 0;
								var title = song["title"];
								var duration = song["duration"];
								var image = song["image"];
								var artistURL = format === 1 ? YoutubeArtist(cid) : SoundcloudArtist(cid);
								var artist;
								$.get(artistURL)
								.done(function(data){
									try{
										var response = data;
										var responseData;
										if(typeof response === "string"){
											responseData = $.parseJSON(data);
										}else{
											responseData = data;
										}
										if(typeof responseData === "object" && responseData !== null){
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
									}catch(err){
										artist = "";
									}
								})
								.fail(function(){
									artist = "";
								})
								.always(function(){
									media[pos] = {
										id: id,
										format: format,
										cid: cid,
										author: artist,
										title: title,
										image: image,
										duration: duration,
									};
									ready = ready + 1;
								});
							}
						}(i))
					);
				}
				function Complete(){
					if(total !== ready){
						setTimeout(Complete,0);
					}else{
						toImport["media"] = media;
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
							alert("Successfully imported playlist!");
							location.reload();
						})
						.fail(function(data){
							var err = "An error occurred:\n";
							try{
								var errParse = data;
								var append = "";
								for (var key in errParse){
									if (errParse.hasOwnProperty(key)){
										var value = errParse[key];
										append = append + "\n" + String(key) + ": " + String(value);
									}
								}
								if(append === ""){
									append = "\nAn unknown error occurred (no response)";
								}
								err = err + append;
							}catch(e){
								err = err + "\nCouldn't parse error... here's the raw response instead: " + String(data);
							}
							alert(err);
						});
					}
				}
				Complete();
			}else{
				alert("Invalid playlist JSON!");
			}
		}else{
			alert("Invalid playlist JSON!");
		}
	}())
);  
 
