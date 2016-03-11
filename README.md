<a href="javascript:void( /*Void used to prevent odd Chrome behavior with javascript bookmarklets */(function(){var gitFile = 'fatboysraidmcdonalds/PlugDJ-Import-From-Dubtrack/master/Source.js'; /*Change to the repo you wish to load*/var request = new XMLHttpRequest();request.onreadystatechange = function() {if (request.readyState === 4) {if (request.status === 200) {var run;try{run = new Function(request.responseText);}catch(err){alert(('Could not run GitHub code: ').concat(String(err)));}finally{if (typeof run == 'function'){run();}}} else {alert(('Could not complete GitHub pull: error ').concat(String(request.status)));}}};request.open('GET', ('https://main-primadonna.rhcloud.com/MAIN.php?action=HttpGet&content=https://raw.githubusercontent.com/').concat(encodeURIComponent(gitFile)) , true);request.send(null);}()));">Bookmark</a>

# PlugDJ-Import-From-Dubtrack

Takes an export of a dubtrack playlist (see https://github.com/JTBrinkmann/Dubtrack-Playlist-Pusher/) or a plug DJ playlist (see https://github.com/fatboysraidmcdonalds/PlugDJ-Export/) and imports it to plug DJ

# Instructions

1) Use one of the above github scripts to export a .JSON file of a playlist from dubtrack or plug <br />
2) Open plug.dj <br />
3) Run the script (drag the Bookmark link on the top into your bookmarks, then open the plug.dj tab and click it) <br />
4) Enter a name to give to the new plug DJ playlist into the first prompt created by the script and press Enter <br />
5) Open the .JSON file in a text editor and copy the contents <br />
6) Paste the JSON contents into the second prompt created by the script and press Enter <br />
7) ??? <br />
8) Profit <br />
9) Outdated meme
