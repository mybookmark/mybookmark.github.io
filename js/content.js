var mybookmark_main = {
	var worldContentCounter = 9;
	var json_sourceInfo;
	var sourceMap ={};
	var allItemList=[];
	var newsCounter =0;
	function getMore() {
		worldContentCounter = worldContentCounter + 9;
	}


	window.onload = function() {
		
		json_sourceInfo[0] = {id: "bbc", name: "BBC中文网", link: "http://feeds.bbci.co.uk/zhongwen/simp/rss.xml"};
		json_sourceInfo[1] = {id: "reuters", name: "路透中文网", link: "http://cn.reuters.com/rssFeed/CNTopGenNews/"};
		json_sourceInfo[2] = {id: "nytimes", name: "纽约时报中文网", link: "https://cn.nytimes.com/rss.html"};
		json_sourceInfo[3] = {id: "sina", name: "新浪网", link: "http://rss.sina.com.cn/news/world/focus15.xml"};
		json_sourceInfo[4] = {id: "mingpao", name: "明报新闻网", link: "https://news.mingpao.com/rss/pns/s00014.xml"};
		json_sourceInfo[5] = {id: "zaobao", name: "联合早报网", link: "http://www.zaobao.com.sg/ssi/rss/gj.xml"};
							 
		for (x = 0; x < json_sourceInfo.length; x++)
		{	
			sourceMap[json_sourceInfo[x].id]= json_sourceInfo[x].name;
		}
		loadRSS();
		
		var var_worldNewsColumn = document.getElementById("worldNewsColumn");
		 
		//loadDataAsynchronously(iframe, src);
	}
	function loadNews(){
		
		var fullListContent = "";//$("#worldNewsColumn").html();
		console.log("counter = " + newsCounter);
		console.log("allItemList = " + allItemList.length);
		var itemFixContent = "<div class='newsContainer-template'><div class='newsTitle-template'>";

		if (newsCounter == (json_sourceInfo.length -1))
		{
			console.log("reach here");
			allItemList.sort(compare);
			for (j =0; j <allItemList.length; j++)
			{    		
				var varTitle =$(allItemList[j]).find('title').text();
				var varLink = $(allItemList[j]).find('link').text();
				var varDescription = $(allItemList[j]).find('description').text();
				var varPubDate = $(allItemList[j]).find('pubDate').text();
				 
				var author =getAuthor(varLink);
				
				var itemContent = "<a href='" + varLink
				+ "' class='newsContainerLink-template' target='_blank'>";
				itemContent = itemContent + itemFixContent;
				itemContent = itemContent + varTitle + "</div>";
				itemContent = itemContent + "<div class='newsMeta-template'>"
						+ author + " - "
						+ varPubDate+ "</div>";
				itemContent = itemContent + "<div class='newsDescription-template'>"
						+ varDescription + "</div></div></div></a>";

				fullListContent = fullListContent + itemContent;
			}
			$("#worldNewsColumn").html(fullListContent);
		}
		 newsCounter++;
	}

	function getAuthor(link)
	{
		var author = "";
		if (link.includes("bbc"))
			return sourceMap["bbc"];
		
		if (link.includes("nytimes"))
			return sourceMap["nytimes"];
		
		if (link.includes("reuters"))
			return sourceMap["reuters"];
		
		if (link.includes("sina"))
			return sourceMap["sina"];
		
		if (link.includes("qq"))
			return sourceMap["qq"];
		
		if (link.includes("mingpao"))
			return sourceMap["mingpao"];
		
		if (link.includes("zaobao"))
			return sourceMap["zaobao"];
	}
	function loadRSS()
	{
		console.log("sourceInfo size =" + json_sourceInfo.length);
		if (json_sourceInfo != null && json_sourceInfo.length > 0)
		{	
			console.log("loadRSS()------------------------");
			for (i = 0; i < json_sourceInfo.length; i++)
			{ 
				console.log("loading "+ json_sourceInfo[i].link + ".............");
				
				var url = json_sourceInfo[i].link;
				  
				var yqlURL = [
						"http://query.yahooapis.com/v1/public/yql",
						"?q=" + encodeURIComponent("select * from xml where url='" + url + "'"),
						"&format=xml&callback=?"
					].join("");
				
				 $.getJSON(yqlURL, function(data){
						var parseData = $.parseXML(data.results[0]);
						var items = $(parseData).find("item");

						if (allItemList.length > 0)
							allItemList = $.merge(allItemList, items);
						else
							allItemList = items;		
									   
						loadNews();
				 });		
				console.log("loadRSS() successfully from " + json_sourceInfo[i].id);
			}		
		}
	}
	function compare(a,b) 
	{
		var varPubDate_A = $(a).find('pubDate').text();
		var varPubDate_B = $(b).find('pubDate').text();
		if( (new Date(varPubDate_A).getTime() > new Date(varPubDate_B).getTime()))
		{
			return -1;
		}
		if( (new Date(varPubDate_A).getTime() < new Date(varPubDate_B).getTime()))
		{
			return 1;
		}
	  
		return 0;
	}

}