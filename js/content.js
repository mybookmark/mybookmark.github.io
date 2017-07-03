	var sourceMap = [];
	var allItemList=[];
	var newsCounter =0;

	function loadNews(sourceInfo, columnID){
		
		var fullListContent = "";
		console.log("counter = " + newsCounter);
		console.log("allItemList = " + allItemList.length);
		var itemFixContent = "<div class='newsContainer-template'><div class='newsTitle-template'>";

		if (newsCounter == (sourceInfo.length -1))
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
			$("#loadingLogo").hide();
			columnID.html(fullListContent);
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
	function loadRSS(sourceInfo, columnID)
	{
		console.log("sourceInfo size =" + sourceInfo.length);
		if (sourceInfo != null && sourceInfo.length > 0)
		{	
			console.log("loadRSS()------------------------");
			for (i = 0; i < sourceInfo.length; i++)
			{ 
				console.log("loading "+ sourceInfo[i].link + ".............");
				
				var url = sourceInfo[i].link;
				  
				var yqlURL = [
						"https://query.yahooapis.com/v1/public/yql",
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
									   
						loadNews(sourceInfo, columnID);
				 });		
				console.log("loadRSS() successfully from " + sourceInfo[i].id);
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

